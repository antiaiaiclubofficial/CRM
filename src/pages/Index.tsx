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
import PetPreferenceForm from '@/components/PetPreferenceForm';
import PetManagement from '@/components/PetManagement';
import QRCodeModal from '@/components/QRCodeModal';
import MyCouponsHomePreview from '@/components/MyCouponsHomePreview';
import CouponUseModal from '@/components/CouponUseModal';
import HomeQuickActions from '@/components/HomeQuickActions';
import AppointmentList from '@/components/AppointmentList';
import AppointmentDetailModal from '@/components/AppointmentDetailModal';
import BookingForm from '@/components/BookingForm';
import Register from './Register';
import { Home, Award, PawPrint, Megaphone, Calendar, History, Scissors, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

const Index = () => {
  const queryClient = useQueryClient();
  const { profile: lineProfile, loading: liffLoading } = useLiff();
  const [activeTab, setActiveTab] = useState('home');
  const [isProfileEditing, setIsProfileEditing] = useState(false);
  const [isQRCodeOpen, setIsQRCodeOpen] = useState(false);
  
  const [selectedPetId, setSelectedPetId] = useState<string | number | null>(null);
  const [selectedAppointment, setSelectedAppointment] = useState<any | null>(null);
  
  const [isPetFormOpen, setIsPetFormOpen] = useState(false);
  const [petToEdit, setPetToEdit] = useState<any | null>(null);
  const [isPreferenceFormOpen, setIsPreferenceFormOpen] = useState(false);
  const [selectedCouponToUse, setSelectedCouponToUse] = useState<any | null>(null);
  const [isCouponUseModalOpen, setIsCouponUseModalOpen] = useState(false);
  const [isBookingFormOpen, setIsBookingFormOpen] = useState(false);
  const [isAppointmentDetailOpen, setIsAppointmentDetailOpen] = useState(false);
  
  const mainScrollRef = useRef<HTMLElement>(null);

  const { data: store, isLoading: storeLoading } = useQuery({
    queryKey: ['current_store'],
    queryFn: async () => {
      const targetStoreId = 'b0f3c613-f742-4c86-951a-eaa65c8b1667';
      const { data } = await supabase.from('stores').select('*').eq('id', targetStoreId).maybeSingle();
      return data;
    }
  });

  const { data: customerData, isLoading: profileLoading } = useQuery({
    queryKey: ['customer_profile', lineProfile?.userId, store?.id],
    queryFn: async () => {
      if (!lineProfile?.userId || !store?.id) return null;
      
      const { data: customer } = await supabase.from('customers').select('*').eq('line_user_id', lineProfile.userId).maybeSingle();
      if (!customer) return null;

      const { data: membership } = await supabase.from('store_customers').select('*').eq('customer_id', customer.id).eq('store_id', store.id).maybeSingle();
      const { data: petsData } = await supabase.from('pets').select('*').eq('customer_id', customer.id).order('created_at', { ascending: true });
      
      // Fetch weight history for all pets
      const petIds = (petsData || []).map(p => p.id);
      const { data: weightHistory } = await supabase.from('pet_weight_history').select('*').in('pet_id', petIds).order('date', { ascending: true });

      const pets = (petsData || []).map(p => ({
        ...p,
        imageUrl: p.image_url,
        cardBgColor: p.card_bg_color || '#FFFFFF',
        custom_preferences: p.custom_preferences || [],
        weight_history: (weightHistory || [])
          .filter(wh => wh.pet_id === p.id)
          .map(wh => ({
            date: new Date(wh.date).toLocaleDateString('th-TH', { day: 'numeric', month: 'short' }),
            weight: parseFloat(wh.weight)
          }))
      }));

      // Fetch Coupons & Deals
      const { data: coupons } = await supabase.from('customer_coupons').select('*, coupon_templates(*)').eq('customer_id', customer.id).eq('store_id', store.id).eq('status', 'unused');
      const { data: deals } = await supabase.from('customers_deals').select('*, deal_templates(*)').eq('customer_id', customer.id).eq('store_id', store.id).eq('status', 'unused');
      
      const { data: appointmentsData } = await supabase.from('appointments').select('*, pets(name, image_url, breed), services(name, price)').eq('customer_id', customer.id).order('start_time', { ascending: true });

      // Combine and format coupons/deals for the UI
      const myCoupons = [
        ...(coupons || []).map(c => ({
          ...c,
          title: c.coupon_templates?.title,
          description: c.coupon_templates?.description,
          iconName: c.coupon_templates?.icon_name,
          bg: c.coupon_templates?.bg_color,
          pointsRequired: c.coupon_templates?.points_required,
          expiry: new Date(c.expires_at).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: '2-digit' }),
          is_deal: false
        })),
        ...(deals || []).map(d => ({
          ...d,
          title: d.deal_templates?.title,
          description: d.deal_templates?.description,
          iconName: d.deal_templates?.icon_name,
          bg: d.deal_templates?.bg_color,
          pointsRequired: d.deal_templates?.points_required,
          expiry: new Date(d.expires_at).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: '2-digit' }),
          is_deal: true
        }))
      ];

      return {
        profile: customer,
        membership: membership,
        pets,
        myCoupons,
        appointments: (appointmentsData || []).map(apt => ({
          id: apt.id,
          petName: apt.pets?.name || 'Unknown',
          petImage: apt.pets?.image_url,
          petBreed: apt.pets?.breed,
          service: apt.services?.name || 'General Service',
          servicePrice: apt.services?.price,
          startTime: apt.start_time,
          status: apt.status,
          notes: apt.notes
        }))
      };
    },
    enabled: !!lineProfile?.userId && !!store?.id,
  });

  const { data: couponTemplates } = useQuery({
    queryKey: ['coupon_templates', store?.id],
    queryFn: async () => {
      if (!store?.id) return [];
      const { data } = await supabase.from('coupon_templates').select('*').eq('store_id', store.id).eq('is_active', true);
      return (data || []).map(t => ({
        ...t,
        iconName: t.icon_name,
        bg: t.bg_color,
        pointsRequired: t.points_required,
        expiry: `${t.expiry_days} วัน`
      }));
    },
    enabled: !!store?.id
  });

  const { data: dealTemplates } = useQuery({
    queryKey: ['deal_templates', store?.id],
    queryFn: async () => {
      if (!store?.id) return [];
      const { data } = await supabase.from('deal_templates').select('*').eq('store_id', store.id).eq('is_active', true);
      return (data || []).map(t => ({
        ...t,
        iconName: t.icon_name,
        bg: t.bg_color,
        pointsRequired: t.points_required,
        expiry: `${t.expiry_days} วัน`
      }));
    },
    enabled: !!store?.id
  });

  const redeemMutation = useMutation({
    mutationFn: async ({ template, points, type }: { template: any, points: number, type: 'coupon' | 'deal' }) => {
      const customerId = customerData?.profile?.id;
      const storeId = store?.id;
      if (!customerId || !storeId) throw new Error("Missing context");

      // Check points
      const currentPoints = customerData?.membership?.points || 0;
      if (currentPoints < points) throw new Error("คะแนนไม่เพียงพอค่ะ");

      // 1. Deduct points
      const { error: pointsError } = await supabase
        .from('store_customers')
        .update({ points: currentPoints - points })
        .eq('customer_id', customerId)
        .eq('store_id', storeId);
      if (pointsError) throw pointsError;

      // 2. Insert coupon/deal
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + (template.expiry_days || 30));

      if (type === 'coupon') {
        await supabase.from('customer_coupons').insert([{
          template_id: template.id,
          customer_id: customerId,
          store_id: storeId,
          expires_at: expiresAt.toISOString(),
          status: 'unused'
        }]);
      } else {
        await supabase.from('customers_deals').insert([{
          template_id: template.id,
          customer_id: customerId,
          store_id: storeId,
          expires_at: expiresAt.toISOString(),
          status: 'unused'
        }]);
      }
    },
    onSuccess: () => {
      toast.success('แลกรับเรียบร้อยแล้วค่ะ! ดูได้ที่เมนู "คูปองของฉัน" นะคะ 🎫');
      queryClient.invalidateQueries({ queryKey: ['customer_profile'] });
    },
    onError: (error: any) => {
      toast.error(error.message || 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้งค่ะ');
    }
  });

  const registerMutation = useMutation({
    mutationFn: async (regData: any) => {
      if (!lineProfile?.userId || !store?.id) throw new Error("Missing context");
      const { data: newCustomer } = await supabase.from('customers').insert([{ line_user_id: lineProfile.userId, display_name: lineProfile.displayName, avatar_url: lineProfile.pictureUrl, ...regData }]).select().single();
      if (!newCustomer) throw new Error("Failed to create customer");
      await supabase.from('store_customers').insert([{ customer_id: newCustomer.id, store_id: store.id, points: 0, total_points: 0, tier: 'bronze' }]);
    },
    onSuccess: () => {
      toast.success('ลงทะเบียนเรียบร้อยแล้วค่ะ ✨');
      queryClient.invalidateQueries({ queryKey: ['customer_profile'] });
    }
  });

  const petMutation = useMutation({
    mutationFn: async (pet: any) => {
      const { id, weight, ...petData } = pet;
      let result;
      
      // 1. Create or Update Pet
      if (id) {
        result = await supabase.from('pets').update({ ...petData, weight }).eq('id', id).select().single();
      } else {
        result = await supabase.from('pets').insert([{ ...petData, weight, customer_id: customerData?.profile?.id }]).select().single();
      }

      const savedPetId = id || result.data?.id;

      // 2. If weight is provided, also record in weight history automatically
      if (savedPetId && weight) {
        const weightNum = parseFloat(weight);
        if (!isNaN(weightNum)) {
          // Check if today's record already exists to avoid redundant data
          const { data: existing } = await supabase
            .from('pet_weight_history')
            .select('*')
            .eq('pet_id', savedPetId)
            .eq('date', new Date().toISOString().split('T')[0])
            .maybeSingle();

          if (!existing) {
            await supabase.from('pet_weight_history').insert([{
              pet_id: savedPetId,
              weight: weightNum,
              date: new Date().toISOString()
            }]);
          }
        }
      }

      return result;
    },
    onSuccess: () => {
      toast.success('บันทึกข้อมูลเรียบร้อยค่ะ 🐾');
      setPetToEdit(null);
      setIsPetFormOpen(false);
      queryClient.invalidateQueries({ queryKey: ['customer_profile'] });
    }
  });

  const weightMutation = useMutation({
    mutationFn: async ({ petId, weight }: { petId: string | number, weight: number }) => {
      // 1. Update weight in pet table
      await supabase.from('pets').update({ weight: weight.toString() }).eq('id', petId);
      // 2. Insert into weight history
      return await supabase.from('pet_weight_history').insert([{ pet_id: petId, weight: weight, date: new Date().toISOString() }]);
    },
    onSuccess: () => {
      toast.success('บันทึกน้ำหนักเรียบร้อยแล้วค่ะ ⚖️');
      queryClient.invalidateQueries({ queryKey: ['customer_profile'] });
    }
  });

  const handleNavClick = (tab: string) => {
    setActiveTab(tab);
    mainScrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartEditPet = (pet: any) => {
    setPetToEdit(pet);
    setIsPetFormOpen(true);
  };

  const handleAddPetClick = () => {
    setPetToEdit(null);
    setIsPetFormOpen(true);
  };

  if (liffLoading || storeLoading || (lineProfile && profileLoading)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-surface p-8 text-center">
        <PawPrint className="text-primary animate-pulse" size={64} />
        <p className="mt-6 font-extrabold text-primary text-lg">LOADING YOUR SANCTUARY...</p>
      </div>
    );
  }

  if (lineProfile && !customerData?.profile && !profileLoading) {
    return <Register lineProfile={lineProfile} onSuccess={() => {}} onSave={async (data) => { await registerMutation.mutateAsync(data); }} />;
  }

  return (
    <div className="w-full h-[100dvh] max-md:max-w-md mx-auto bg-surface relative flex flex-col font-['Inter'] overflow-hidden">
      <header className="px-6 pt-[calc(8px+env(safe-area-inset-top))] pb-2 flex justify-between items-center shrink-0 z-[50]">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-black text-primary truncate leading-tight tracking-tight">{store?.name || 'Pet Care'}</h1>
          <p className="text-surface-variant text-xs font-semibold uppercase tracking-widest opacity-60">Hello, {customerData?.profile?.first_name || lineProfile?.displayName} 🐾</p>
        </div>
        <motion.div 
          whileTap={{ scale: 0.9 }} 
          onClick={() => setIsProfileEditing(true)} 
          className="w-14 h-14 rounded-2xl border-2 border-white shadow-ambient overflow-hidden bg-white cursor-pointer"
        >
          <img src={customerData?.profile?.avatar_url || lineProfile?.pictureUrl} alt="Profile" className="w-full h-full object-cover"/>
        </motion.div>
      </header>

      <main ref={mainScrollRef} className="px-4 flex-1 pb-[calc(7.5rem+env(safe-area-inset-bottom))] overflow-y-scroll no-scrollbar touch-pan-y">
        <AnimatePresence mode="wait">
          {activeTab === 'home' && (
            <motion.div key="home" className="space-y-8" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <MembershipCard 
                totalAccumulatedPoints={customerData?.membership?.total_points || 0} 
                redeemablePoints={customerData?.membership?.points || 0} 
                ownerProfile={customerData?.profile as any} 
                onShowQR={() => setIsQRCodeOpen(true)}
                onTierClick={() => handleNavClick('level')}
              />
              <UpcomingAppointments appointments={customerData?.appointments || []} onViewAll={() => handleNavClick('appointments')} />
              <HomeQuickActions 
                onCouponsClick={() => setActiveTab('promo')} 
                onAppointmentClick={() => { setActiveTab('appointments'); setIsBookingFormOpen(true); }} 
              />
              <PetList pets={customerData?.pets || []} onPetClick={(p: any) => { setSelectedPetId(p.id); setActiveTab('pets'); }} onViewAll={() => setActiveTab('pets')} />
              <MyCouponsHomePreview coupons={customerData?.myCoupons?.slice(0, 5) || []} onViewAll={() => { setActiveTab('promo'); setTimeout(() => { document.getElementById('my-coupons-section')?.scrollIntoView({ behavior: 'smooth' }); }, 100); }} />
            </motion.div>
          )}

          {activeTab === 'appointments' && (
            <motion.div key="appointments-tab" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
               <AppointmentList appointments={customerData?.appointments || []} onAddClick={() => setIsBookingFormOpen(true)} onAppointmentClick={(apt) => { setSelectedAppointment(apt); setIsAppointmentDetailOpen(true); }} />
            </motion.div>
          )}

          {activeTab === 'promo' && (
            <motion.div key="promo-tab" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
               <Promotions 
                 userPoints={customerData?.membership?.points || 0} 
                 collectedCoupons={customerData?.myCoupons || []} 
                 usedOrExpiredCoupons={[]} 
                 redeemableTemplates={couponTemplates || []} 
                 dealTemplates={dealTemplates || []} 
                 onRedeemCoupon={(t, p) => redeemMutation.mutate({ template: t, points: p, type: 'coupon' })} 
                 onBuyDeal={(t, p) => redeemMutation.mutate({ template: t, points: p, type: 'deal' })} 
                 onUseCoupon={(c) => { setSelectedCouponToUse(c); setIsCouponUseModalOpen(true); }} 
               />
            </motion.div>
          )}

          {activeTab === 'pets' && (
            <motion.div key="pets-tab" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              {selectedPetId ? (
                <PetDetailView 
                  pet={customerData?.pets?.find(p => p.id === selectedPetId)} 
                  onBack={() => setSelectedPetId(null)} 
                  onStartEdit={(pet) => handleStartEditPet(pet)} 
                  onDeletePet={() => {}} 
                  totalServiceCost={0} 
                  onViewServiceHistoryForPet={() => {}} 
                  onEditPreferences={() => {}} 
                  onToggleFavorite={() => {}}
                  onAddWeight={async (id, w) => { await weightMutation.mutateAsync({ petId: id, weight: w }); }}
                />
              ) : (
                <PetManagement pets={customerData?.pets || []} onBack={() => setActiveTab('home')} onViewDetails={(p: any) => setSelectedPetId(p.id)} onAddPet={handleAddPetClick} />
              )}
            </motion.div>
          )}
          
          {activeTab === 'level' && (
            <motion.div key="level-tab" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <MembershipLevels totalAccumulatedPoints={customerData?.membership?.total_points || 0} redeemablePoints={customerData?.membership?.points || 0} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <nav className="fixed bottom-[20px] left-4 right-4 max-w-[calc(theme(maxWidth.md)-2rem)] mx-auto glass-effect px-6 py-4 flex justify-between items-center rounded-3xl shadow-ambient z-[40] border border-white/40">
        <NavButton active={activeTab === 'home'} icon={<Home size={22} />} onClick={() => handleNavClick('home')} />
        <NavButton active={activeTab === 'appointments'} icon={<Calendar size={22} />} onClick={() => handleNavClick('appointments')} />
        <NavButton active={activeTab === 'pets'} icon={<PawPrint size={22} />} onClick={() => handleNavClick('pets')} />
        <NavButton active={activeTab === 'promo'} icon={<Megaphone size={22} />} onClick={() => handleNavClick('promo')} />
        <NavButton active={activeTab === 'history'} icon={<History size={22} />} onClick={() => handleNavClick('history')} />
      </nav>

      <QRCodeModal isOpen={isQRCodeOpen} onClose={() => setIsQRCodeOpen(false)} lineId={lineProfile?.displayName || ''} memberId={customerData?.profile?.phone || ''} />
      <PetForm isOpen={isPetFormOpen} onClose={() => setIsPetFormOpen(false)} onSave={(data) => petMutation.mutate(data)} initialData={petToEdit} />
      <BookingForm isOpen={isBookingFormOpen} onClose={() => setIsBookingFormOpen(false)} pets={customerData?.pets || []} services={[]} onConfirm={async () => {}} />
      <CouponUseModal isOpen={isCouponUseModalOpen} onClose={() => setIsCouponUseModalOpen(false)} coupon={selectedCouponToUse} onConfirmUse={() => {}} />
    </div>
  );
};

const NavButton = ({ active, icon, onClick }: { active: boolean; icon: any; onClick: () => void }) => (
  <button onClick={onClick} className="relative flex items-center justify-center w-12 h-12">
    {active && <motion.div layoutId="activeNavBg" className="absolute inset-0 bg-primary rounded-2xl shadow-ambient" transition={{ type: "spring", bounce: 0.2, duration: 0.6 }} />}
    <div className={`relative z-10 ${active ? 'text-tertiary' : 'text-primary/40'}`}>{icon}</div>
  </button>
);

export default Index;