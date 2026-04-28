"use client";

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useLiff } from '@/hooks/use-liff';
import MembershipCard from '@/components/MembershipCard';
import PetList from '@/components/PetList';
import PetDetailView from '@/components/PetDetailView';
import PetForm from '@/components/PetForm';
import ServiceHistory from '@/components/ServiceHistory';
import Promotions from '@/components/Promotions';
import UpcomingAppointments from '@/components/UpcomingAppointments';
import UserProfileEdit from '@/components/UserProfileEdit';
import MembershipLevels from '@/components/MembershipLevels';
import ServiceHistoryDetail from '@/components/ServiceHistoryDetail';
import PetPreferenceForm from '@/components/PetPreferenceForm';
import PetManagement from '@/components/PetManagement';
import QRCodeModal from '@/components/QRCodeModal';
import MyCouponsHomePreview from '@/components/MyCouponsHomePreview';
import CouponUseModal from '@/components/CouponUseModal';
import HomeQuickActions from '@/components/HomeQuickActions';
import Register from './Register';
import { Home, Award, PawPrint, Megaphone, Calendar, History, Scissors, Sparkles, PlusCircle, LogIn, FlaskConical } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

const formatDateThai = (dateString?: string) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: '2-digit' });
};

const Index = () => {
  const queryClient = useQueryClient();
  const { profile: lineProfile, loading: liffLoading } = useLiff();
  const [activeTab, setActiveTab] = useState('home');
  const [isProfileEditing, setIsProfileEditing] = useState(false);
  const [isQRCodeOpen, setIsQRCodeOpen] = useState(false);
  
  const [selectedPetId, setSelectedPetId] = useState<string | number | null>(null);
  const [selectedServiceId, setSelectedServiceId] = useState<string | number | null>(null);
  
  const [isPetFormOpen, setIsPetFormOpen] = useState(false);
  const [petToEditId, setPetToEditId] = useState<string | number | null>(null);
  const [isPreferenceFormOpen, setIsPreferenceFormOpen] = useState(false);
  const [selectedCouponToUse, setSelectedCouponToUse] = useState<any | null>(null);
  const [isCouponUseModalOpen, setIsCouponUseModalOpen] = useState(false);
  
  const mainScrollRef = useRef<HTMLElement>(null);

  // Get Store Info
  const { data: store, isLoading: storeLoading } = useQuery({
    queryKey: ['current_store'],
    queryFn: async () => {
      const targetStoreId = 'b0f3c613-f742-4c86-951a-eaa65c8b1667';
      const { data, error } = await supabase
        .from('stores')
        .select('*')
        .eq('id', targetStoreId)
        .maybeSingle();
        
      if (error || !data) {
        const { data: fallback } = await supabase.from('stores').select('*').limit(1).maybeSingle();
        return fallback;
      }
      return data;
    }
  });

  // Get Available Coupon Templates
  const { data: couponTemplates } = useQuery({
    queryKey: ['coupon_templates', store?.id],
    queryFn: async () => {
      if (!store?.id) return [];
      const { data, error } = await supabase
        .from('coupon_templates')
        .select('*')
        .eq('store_id', store.id)
        .eq('is_active', true);
      if (error) throw error;
      return data;
    },
    enabled: !!store?.id
  });

  // Main Customer Data Fetch
  const { data: customerData, isLoading: profileLoading } = useQuery({
    queryKey: ['customer_profile', lineProfile?.userId, store?.id],
    queryFn: async () => {
      if (!lineProfile?.userId || !store?.id) return null;
      
      const { data: customer, error: customerError } = await supabase
        .from('customers')
        .select('*')
        .eq('line_user_id', lineProfile.userId)
        .maybeSingle();
      
      if (customerError) throw customerError;
      if (!customer) return null;

      const { data: membership, error: memberError } = await supabase
        .from('store_customers')
        .select('*')
        .eq('customer_id', customer.id)
        .eq('store_id', store.id)
        .maybeSingle();

      if (memberError) throw memberError;

      const { data: pets, error: petsError } = await supabase
        .from('pets')
        .select('*')
        .eq('customer_id', customer.id);

      const { data: coupons, error: couponError } = await supabase
        .from('customer_coupons')
        .select('*, coupon_templates(*)')
        .eq('customer_id', customer.id)
        .eq('store_id', store.id);

      const { data: history, error: historyError } = await supabase
        .from('service_history')
        .select('*, pets(*)')
        .eq('customer_id', customer.id)
        .eq('store_id', store.id)
        .order('created_at', { ascending: false });

      return {
        profile: customer,
        membership: membership,
        pets: (pets || []).map(p => ({
          ...p,
          imageUrl: p.image_url,
          cardBgColor: '#FFD8E4',
          custom_preferences: p.custom_preferences || []
        })),
        coupons: coupons || [],
        history: history || []
      };
    },
    enabled: !!lineProfile?.userId && !!store?.id,
  });

  // Mutation for Redeeming Coupon (Optimized with instant UI feedback)
  const redeemCouponMutation = useMutation({
    mutationFn: async ({ template, pointsCost }: { template: any, pointsCost: number }) => {
      if (!customerData?.profile?.id || !store?.id) throw new Error("Missing data");
      
      // Update points
      const { error: pointError } = await supabase
        .from('store_customers')
        .update({ points: customerData.membership.points - pointsCost })
        .eq('customer_id', customerData.profile.id)
        .eq('store_id', store.id);
      if (pointError) throw pointError;

      // Add coupon
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + (template.expiry_days || 30));
      const { error: couponError } = await supabase
        .from('customer_coupons')
        .insert([{
          template_id: template.id,
          customer_id: customerData.profile.id,
          store_id: store.id,
          status: 'unused',
          expires_at: expiryDate.toISOString()
        }]);
      if (couponError) throw couponError;
    },
    onMutate: async ({ pointsCost, template }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['customer_profile'] });
      // Snapshot previous value
      const previousData = queryClient.getQueryData(['customer_profile', lineProfile?.userId, store?.id]);
      // Optimistically update to the new value
      queryClient.setQueryData(['customer_profile', lineProfile?.userId, store?.id], (old: any) => ({
        ...old,
        membership: { ...old.membership, points: old.membership.points - pointsCost },
        coupons: [...old.coupons, { 
          id: 'temp-' + Date.now(), 
          template_id: template.id, 
          status: 'unused', 
          coupon_templates: template 
        }]
      }));
      return { previousData };
    },
    onSuccess: () => {
      toast.success('แลกคูปองเรียบร้อยแล้วค่ะ! 🎫');
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(['customer_profile', lineProfile?.userId, store?.id], context?.previousData);
      toast.error('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้งค่ะ');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['customer_profile'] });
    }
  });

  // Mutation for Using Coupon (Optimized with instant UI feedback)
  const confirmUseCouponMutation = useMutation({
    mutationFn: async (couponId: string | number) => {
      const { error } = await supabase
        .from('customer_coupons')
        .update({ status: 'used', used_at: new Date().toISOString() })
        .eq('id', couponId);
      if (error) throw error;
    },
    onMutate: async (couponId) => {
      await queryClient.cancelQueries({ queryKey: ['customer_profile'] });
      const previousData = queryClient.getQueryData(['customer_profile', lineProfile?.userId, store?.id]);
      
      // Mark as used in the local cache immediately
      queryClient.setQueryData(['customer_profile', lineProfile?.userId, store?.id], (old: any) => ({
        ...old,
        coupons: old.coupons.map((c: any) => c.id === couponId ? { ...c, status: 'used', used_at: new Date().toISOString() } : c)
      }));
      
      setIsCouponUseModalOpen(false);
      setSelectedCouponToUse(null);
      return { previousData };
    },
    onSuccess: () => {
      toast.success('ใช้งานคูปองเรียบร้อยแล้วค่ะ ✨');
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(['customer_profile', lineProfile?.userId, store?.id], context?.previousData);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['customer_profile'] });
    }
  });

  // Other Mutations (Profile, Pet, etc.)
  const registerMutation = useMutation({
    mutationFn: async (userData: any) => {
      if (!lineProfile?.userId || !store?.id) throw new Error("Missing data");
      const { data: newCustomer, error: cError } = await supabase.from('customers').insert([{
        line_user_id: lineProfile.userId,
        first_name: userData.firstName,
        last_name: userData.lastName,
        display_name: `${userData.firstName} ${userData.lastName}`,
        email: userData.email || null,
        phone: userData.phone,
        gender: userData.gender,
        age: userData.age,
        address: userData.address,
        sub_district: userData.subDistrict,
        district: userData.district,
        province: userData.province,
        postal_code: userData.postalCode,
        avatar_url: lineProfile.pictureUrl || null
      }]).select().single();
      if (cError) throw cError;
      const { error: mError } = await supabase.from('store_customers').insert([{
        store_id: store.id,
        customer_id: newCustomer.id,
        points: 0,
        tier: 'bronze'
      }]);
      if (mError) throw mError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customer_profile'] });
      toast.success('ลงทะเบียนเรียบร้อยแล้วค่ะ! ✨');
    }
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (updatedData: any) => {
      if (!customerData?.profile?.id) throw new Error("Missing ID");
      const { error } = await supabase
        .from('customers')
        .update({
          first_name: updatedData.firstName,
          last_name: updatedData.lastName,
          display_name: `${updatedData.firstName} ${updatedData.lastName}`,
          email: updatedData.email,
          phone: updatedData.phone,
          gender: updatedData.gender,
          age: updatedData.age,
          address: updatedData.address,
          sub_district: updatedData.subDistrict,
          district: updatedData.district,
          province: updatedData.province,
          postal_code: updatedData.postalCode,
        })
        .eq('id', customerData.profile.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customer_profile'] });
      toast.success('อัปเดตโปรไฟล์เรียบร้อยแล้วค่ะ ✨');
    }
  });

  const petMutation = useMutation({
    mutationFn: async (petData: any) => {
      if (!customerData?.profile?.id) throw new Error("Missing Customer ID");
      const numericWeight = petData.weight ? parseFloat(petData.weight) : null;
      const payload = {
        customer_id: customerData.profile.id,
        name: petData.name,
        type: petData.type,
        breed: petData.breed,
        age: petData.age?.toString(),
        gender: petData.gender,
        weight: isNaN(numericWeight as any) ? null : numericWeight,
        medical_condition: petData.medical_condition,
        precautions: petData.precautions,
        fur_length: petData.fur_length,
        image_url: petData.image_url
      };
      if (petData.id) {
        const { error } = await supabase.from('pets').update(payload).eq('id', petData.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('pets').insert([payload]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customer_profile'] });
      setIsPetFormOpen(false);
      setPetToEditId(null);
      toast.success('บันทึกข้อมูลสัตว์เลี้ยงเรียบร้อยแล้วค่ะ 🐾');
    }
  });

  const deletePetMutation = useMutation({
    mutationFn: async (petId: string | number) => {
      const { error } = await supabase.from('pets').delete().eq('id', petId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customer_profile'] });
      setSelectedPetId(null);
      toast.success('ลบข้อมูลสัตว์เลี้ยงเรียบร้อยแล้วค่ะ');
    }
  });

  const savePreferencesMutation = useMutation({
    mutationFn: async (preferences: any[]) => {
      if (!selectedPetId) throw new Error("No pet selected");
      const { error } = await supabase
        .from('pets')
        .update({ custom_preferences: preferences })
        .eq('id', selectedPetId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customer_profile'] });
      toast.success('บันทึกความชอบส่วนตัวเรียบร้อยแล้วค่ะ 🦴');
    }
  });

  const handleNavClick = (tabId: string) => {
    setSelectedPetId(null);
    setSelectedServiceId(null);
    setActiveTab(tabId);
  };

  const petsList = useMemo(() => customerData?.pets || [], [customerData]);
  const selectedPetForDetail = useMemo(() => petsList.find(p => p.id === selectedPetId) || null, [petsList, selectedPetId]);
  const petToEdit = useMemo(() => petsList.find(p => p.id === petToEditId) || null, [petsList, petToEditId]);

  const serviceHistory = useMemo(() => (customerData?.history || []).map(h => ({
    id: h.id,
    date: formatDateThai(h.created_at),
    petName: h.pets?.name || 'ไม่ระบุ',
    service: h.note || 'รับบริการทั่วไป',
    price: h.price?.toString() || '0',
    icon: <Scissors className="text-pink-500" />,
    bg: 'bg-pink-50',
    description: h.note,
  })), [customerData]);

  const selectedServiceForDetail = useMemo(() => serviceHistory.find(s => s.id === selectedServiceId) || null, [serviceHistory, selectedServiceId]);

  const userCoupons = useMemo(() => (customerData?.coupons || []).map(c => ({
    id: c.id,
    template_id: c.template_id,
    title: c.coupon_templates?.title || 'คูปอง',
    description: c.coupon_templates?.description || `หมดอายุ ${formatDateThai(c.expires_at)}`,
    value: '',
    type: 'GIFT',
    expiry: formatDateThai(c.expires_at),
    iconName: c.coupon_templates?.icon_name || 'Ticket',
    bg: c.coupon_templates?.bg_color || 'bg-amber-50',
    color: 'from-amber-400 to-orange-500',
    is_used: c.status === 'used'
  })), [customerData]);

  const availableTemplatesForRedeem = useMemo(() => (couponTemplates || []).map(t => ({
    id: t.id,
    title: t.title,
    description: t.description || (t.points_required > 0 ? `แลกด้วย ${t.points_required} คะแนน` : 'โปรโมชั่นพิเศษ'),
    pointsRequired: t.points_required,
    expiry: `${t.expiry_days} วัน`,
    iconName: t.icon_name || 'Tag',
    bg: t.bg_color || (t.points_required === 0 ? 'bg-pink-50' : 'bg-rose-50')
  })), [couponTemplates]);

  if (liffLoading || storeLoading || (lineProfile && profileLoading)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#FFF9F0] p-8 text-center">
        <PawPrint className="text-pink-400 animate-bounce" size={64} />
        <p className="mt-6 font-black text-slate-800 text-lg">กำลังเตรียมข้อมูล... 🐾</p>
      </div>
    );
  }

  if (lineProfile && !customerData?.profile && !profileLoading) {
    return <Register lineProfile={lineProfile} onSuccess={() => {}} onSave={(data) => registerMutation.mutateAsync(data)} />;
  }

  const ownerProfile = {
    firstName: customerData?.profile?.first_name || '',
    lastName: customerData?.profile?.last_name || '',
    gender: customerData?.profile?.gender || 'หญิง',
    age: customerData?.profile?.age || '',
    phone: customerData?.profile?.phone || '',
    address: customerData?.profile?.address || '',
    subDistrict: customerData?.profile?.sub_district || '',
    district: customerData?.profile?.district || '',
    province: customerData?.profile?.province || '',
    postalCode: customerData?.profile?.postal_code || '',
    email: customerData?.profile?.email || '',
  };

  return (
    <div className="w-full h-[100dvh] max-w-md mx-auto bg-[#FFF9F0] relative shadow-2xl flex flex-col font-['Prompt'] overflow-hidden border-x border-slate-100/50">
      <header className="px-6 pt-[calc(8px+env(safe-area-inset-top))] pb-[15px] flex justify-between items-center shrink-0 z-[50]">
        <div className="min-w-0 flex-1">
          <h1 className="text-xl font-black text-slate-800 truncate">{store?.name || 'Pet Care App'}</h1>
          <p className="text-slate-500 text-xs font-medium">สวัสดีค่ะ คุณ{customerData?.profile?.display_name} ✨</p>
        </div>
        <motion.div whileTap={{ scale: 0.9 }} onClick={() => setIsProfileEditing(true)} className="w-12 h-12 rounded-full border-2 border-white shadow-md overflow-hidden bg-pink-100 cursor-pointer">
          <img src={customerData?.profile?.avatar_url || lineProfile?.pictureUrl} alt="Profile" className="w-full h-full object-cover"/>
        </motion.div>
      </header>

      <main ref={mainScrollRef} className="px-6 flex-1 pb-[calc(7rem+env(safe-area-inset-bottom))] overflow-y-scroll no-scrollbar touch-pan-y">
        <AnimatePresence mode="wait">
          {activeTab === 'home' && (
            <motion.div key="home" className="space-y-6">
              <MembershipCard totalAccumulatedPoints={customerData?.membership?.points || 0} redeemablePoints={customerData?.membership?.points || 0} ownerProfile={ownerProfile as any} onShowQR={() => setIsQRCodeOpen(true)} />
              <UpcomingAppointments />
              <HomeQuickActions onCouponsClick={() => setActiveTab('promo')} onAppointmentClick={() => toast.info('เร็วๆ นี้')} />
              <PetList pets={petsList as any} onPetClick={(p: any) => { setSelectedPetId(p.id); setActiveTab('pets'); }} onViewAll={() => setActiveTab('pets')} />
              <MyCouponsHomePreview coupons={userCoupons.filter(c => !c.is_used) as any} onViewAll={() => setActiveTab('promo')} />
            </motion.div>
          )}

          {activeTab === 'pets' && (
            <motion.div key="pets-tab">
              {selectedPetForDetail ? (
                <PetDetailView pet={selectedPetForDetail as any} onBack={() => setSelectedPetId(null)} onStartEdit={(p: any) => { setPetToEditId(p.id); setIsPetFormOpen(true); }} onDeletePet={(id) => deletePetMutation.mutate(id)} totalServiceCost={0} onViewServiceHistoryForPet={() => {}} onEditPreferences={() => setIsPreferenceFormOpen(true)} onToggleFavorite={() => {}} />
              ) : (
                <PetManagement pets={petsList as any} onBack={() => setActiveTab('home')} onViewDetails={(p: any) => setSelectedPetId(p.id)} onAddPet={() => { setPetToEditId(null); setIsPetFormOpen(true); }} />
              )}
            </motion.div>
          )}

          {activeTab === 'history' && (
            <motion.div key="history-tab">
              {selectedServiceForDetail ? <ServiceHistoryDetail service={selectedServiceForDetail as any} onBack={() => setSelectedServiceId(null)} /> : <ServiceHistory historyData={serviceHistory as any} onServiceClick={(s) => setSelectedServiceId(s.id)} />}
            </motion.div>
          )}
          
          {activeTab === 'level' && (
            <motion.div key="level-tab">
              <MembershipLevels totalAccumulatedPoints={customerData?.membership?.points || 0} redeemablePoints={customerData?.membership?.points || 0} />
            </motion.div>
          )}

          {activeTab === 'promo' && (
            <motion.div key="promo-tab">
               <Promotions 
                userPoints={customerData?.membership?.points || 0} 
                collectedCoupons={userCoupons.filter(c => !c.is_used) as any} 
                usedOrExpiredCoupons={userCoupons.filter(c => c.is_used) as any} 
                redeemableTemplates={availableTemplatesForRedeem}
                onRedeemCoupon={(c, cost) => redeemCouponMutation.mutate({ template: c, pointsCost: cost })} 
                onUseCoupon={(id) => { const c = userCoupons.find(x => x.id === id); setSelectedCouponToUse(c); setIsCouponUseModalOpen(true); }} 
               />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <QRCodeModal isOpen={isQRCodeOpen} onClose={() => setIsQRCodeOpen(false)} lineId={lineProfile?.displayName || ''} memberId={customerData?.profile?.phone || ''} />
      <PetForm isOpen={isPetFormOpen} onClose={() => setIsPetFormOpen(false)} onSave={(data) => petMutation.mutate(data)} initialData={petToEdit as any} />
      <UserProfileEdit isOpen={isProfileEditing} onClose={() => setIsProfileEditing(false)} profile={ownerProfile as any} onSave={(data) => updateProfileMutation.mutate(data)} />
      <PetPreferenceForm isOpen={isPreferenceFormOpen} onClose={() => setIsPreferenceFormOpen(false)} onSave={(prefs) => savePreferencesMutation.mutate(prefs)} initialData={selectedPetForDetail?.custom_preferences} petName={selectedPetForDetail?.name || ''} />
      <CouponUseModal isOpen={isCouponUseModalOpen} onClose={() => setIsCouponUseModalOpen(false)} coupon={selectedCouponToUse} onConfirmUse={(id) => confirmUseCouponMutation.mutate(id)} />

      <nav className="fixed bottom-[10px] left-6 right-6 max-w-[calc(theme(maxWidth.md)-3rem)] mx-auto bg-white/40 backdrop-blur-xl px-4 py-3 flex justify-between items-center rounded-full shadow-lg z-[40] border border-white/60">
        <NavButton active={activeTab === 'home'} icon={<Home size={22} />} onClick={() => handleNavClick('home')} />
        <NavButton active={activeTab === 'level'} icon={<Award size={22} />} onClick={() => handleNavClick('level')} />
        <NavButton active={activeTab === 'pets'} icon={<PawPrint size={22} />} onClick={() => handleNavClick('pets')} />
        <NavButton active={activeTab === 'promo'} icon={<Megaphone size={22} />} onClick={() => handleNavClick('promo')} />
        <NavButton active={activeTab === 'history'} icon={<History size={22} />} onClick={() => handleNavClick('history')} />
      </nav>
    </div>
  );
};

const NavButton = ({ active, icon, onClick }: { active: boolean; icon: any; onClick: () => void }) => (
  <button onClick={onClick} className="relative flex items-center justify-center w-12 h-12">
    {active && <motion.div layoutId="activeNavBg" className="absolute inset-0 bg-gradient-to-b from-[#FFA14A] to-[#FF4B91] rounded-full shadow-lg" transition={{ type: "spring", bounce: 0.2, duration: 0.6 }} />}
    <div className={`relative z-10 ${active ? 'text-white' : 'text-slate-600'}`}>{icon}</div>
  </button>
);

export default Index;