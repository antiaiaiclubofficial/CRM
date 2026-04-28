"use client";

import React, { useState, useEffect, useRef } from 'react';
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
import { Home, Award, PawPrint, Megaphone, Calendar, History, Scissors, Sparkles, PlusCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

export interface Pet {
  id: number;
  name: string;
  type: string;
  breed: string;
  age: string;
  gender: string;
  weight: string;
  medical_condition: string;
  precautions: string;
  color: string;
  icon: string;
  fur_length?: string;
  custom_preferences?: any;
  image_url: string;
  card_bg_color: string;
  is_favorite?: boolean;
}

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
  const [selectedPetForDetail, setSelectedPetForDetail] = useState<Pet | null>(null);
  const [selectedServiceForDetail, setSelectedServiceForDetail] = useState<any | null>(null);
  const [isPetFormOpen, setIsPetFormOpen] = useState(false);
  const [petToEdit, setPetToEdit] = useState<Pet | null>(null);
  const [isPreferenceFormOpen, setIsPreferenceFormOpen] = useState(false);
  const [selectedCouponToUse, setSelectedCouponToUse] = useState<any | null>(null);
  const [isCouponUseModalOpen, setIsCouponUseModalOpen] = useState(false);
  
  const mainScrollRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const performReset = () => {
      if (mainScrollRef.current) {
        mainScrollRef.current.scrollTop = 0;
      }
    };
    performReset();
    const timer = setTimeout(performReset, 50);
    return () => clearTimeout(timer);
  }, [activeTab, selectedPetForDetail, selectedServiceForDetail]);

  const handleNavClick = (tabId: string) => {
    if (activeTab === tabId) {
      mainScrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setSelectedPetForDetail(null);
      setSelectedServiceForDetail(null);
      setActiveTab(tabId);
    }
  };

  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ['profile', lineProfile?.userId],
    queryFn: async () => {
      if (!lineProfile?.userId) return null;
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('line_id', lineProfile.userId)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!lineProfile?.userId,
    staleTime: 1000 * 60 * 5,
  });

  const pets = (profile?.pets_data as Pet[]) || [];
  const serviceHistoryRaw = (profile?.service_history_data as any[]) || [];
  const userCoupons = (profile?.coupons_data as any[]) || [];
  const pointsLedger = (profile?.points_ledger as any[]) || [];

  const serviceHistory = serviceHistoryRaw.map(h => ({
    ...h,
    icon: h.icon_name === 'Scissors' ? <Scissors className="text-pink-500" /> : <Sparkles className="text-blue-500" />,
    bg: h.bg || 'bg-slate-50'
  }));

  const registerMutation = useMutation({
    mutationFn: async (userData: any) => {
      if (!lineProfile?.userId) throw new Error("ไม่พบข้อมูลผู้ใช้งาน LINE");
      const { error } = await supabase.from('profiles').insert([{
        line_id: lineProfile.userId,
        first_name: userData.firstName,
        last_name: userData.lastName,
        gender: userData.gender,
        age: userData.age,
        phone: userData.phone,
        address: userData.address,
        sub_district: userData.subDistrict,
        district: userData.district,
        province: userData.province,
        postal_code: userData.postalCode,
        email: userData.email,
        avatar_url: lineProfile.pictureUrl,
        points: 0,
        total_points: 0,
        pets_data: [],
        service_history_data: [],
        coupons_data: [],
        points_ledger: [],
        points_expiry: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString(),
        tier_expiry: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString()
      }]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      toast.success('ลงทะเบียนเรียบร้อยแล้วค่ะ');
    }
  });

  const saveProfileMutation = useMutation({
    mutationFn: async (userData: any) => {
      const { error } = await supabase.from('profiles').update({
        first_name: userData.firstName,
        last_name: userData.lastName,
        gender: userData.gender,
        age: userData.age,
        phone: userData.phone,
        address: userData.address,
        sub_district: userData.subDistrict,
        district: userData.district,
        province: userData.province,
        postal_code: userData.postalCode,
        email: userData.email
      }).eq('line_id', lineProfile.userId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      toast.success('อัปเดตข้อมูลเรียบร้อยแล้วค่ะ');
    }
  });

  const updateProfileDataMutation = useMutation({
    mutationFn: async (newData: any) => {
      const { error } = await supabase
        .from('profiles')
        .update(newData)
        .eq('line_id', lineProfile.userId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    }
  });

  const handleSimulatePoints = () => {
    const amount = 100;
    const currentPoints = profile?.points || 0;
    const currentTotal = profile?.total_points || 0;
    const newEntry = { amount, earned_at: new Date().toISOString() };
    const expiringEntry = { amount: 50, earned_at: new Date(new Date().setFullYear(new Date().getFullYear() - 2, new Date().getMonth() + 1, new Date().getDate() - 5)).toISOString() };
    const newLedger = [...pointsLedger, newEntry, expiringEntry];
    updateProfileDataMutation.mutate({ points: currentPoints + amount + 50, total_points: currentTotal + amount + 50, points_ledger: newLedger });
    toast.success('ได้รับคะแนนเพิ่มแล้วค่ะ');
  };

  const savePetMutation = useMutation({
    mutationFn: async (petData: any) => {
      const currentPets = [...pets];
      const isEdit = !!petData.id;
      let newPetsList;
      if (isEdit) {
        newPetsList = currentPets.map(p => p.id === petData.id ? petData : p);
      } else {
        newPetsList = [...currentPets, { ...petData, id: Date.now() }];
      }
      const { error } = await supabase.from('profiles').update({ pets_data: newPetsList }).eq('line_id', lineProfile.userId);
      if (error) throw error;
      return petData;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      if (selectedPetForDetail && selectedPetForDetail.id === data.id) setSelectedPetForDetail(data);
      setIsPetFormOpen(false);
      setPetToEdit(null);
      toast.success('บันทึกข้อมูลเรียบร้อยแล้วค่ะ');
    }
  });

  const deletePetMutation = useMutation({
    mutationFn: async (id: number) => {
      const newPetsList = pets.filter(p => p.id !== id);
      const { error } = await supabase.from('profiles').update({ pets_data: newPetsList }).eq('line_id', lineProfile.userId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      setSelectedPetForDetail(null);
      toast.success('ลบข้อมูลเรียบร้อยแล้วค่ะ');
    }
  });

  const collectCouponMutation = useMutation({
    mutationFn: async ({ coupon, cost }: { coupon: any; cost: number }) => {
      if ((profile?.points || 0) < cost) throw new Error("คะแนนสะสมไม่เพียงพอค่ะ");
      const newCoupon = { id: Date.now(), coupon_id: coupon.id, title: coupon.title, description: coupon.description, value: coupon.value, type: coupon.type, expiry: coupon.expiry, iconName: coupon.iconName, color: coupon.color, bg: coupon.bg, is_used: false, collected_at: new Date().toISOString() };
      const { error } = await supabase.from('profiles').update({ coupons_data: [...userCoupons, newCoupon], points: (profile?.points || 0) - cost }).eq('line_id', lineProfile.userId);
      if (error) throw error;
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['profile'] }); toast.success('เก็บคูปองเรียบร้อยแล้วค่ะ'); },
    onError: (error: any) => toast.error(error.message)
  });

  const useCouponMutation = useMutation({
    mutationFn: async (couponId: number) => {
      const newCouponsList = userCoupons.map(c => c.id === couponId ? { ...c, is_used: true, used_at: new Date().toISOString() } : c);
      const { error } = await supabase.from('profiles').update({ coupons_data: newCouponsList }).eq('line_id', lineProfile.userId);
      if (error) throw error;
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['profile'] }); setIsCouponUseModalOpen(false); toast.success('ใช้คูปองเรียบร้อยแล้วค่ะ'); }
  });

  if (liffLoading) return <div className="flex flex-col items-center justify-center min-h-screen bg-[#FFF9F0]"><PawPrint className="text-pink-400 animate-bounce" size={48} /><p className="mt-4 font-bold text-slate-600">กำลังเตรียมความพร้อม...</p></div>;
  if (lineProfile && !profile && !profileLoading) return <Register lineProfile={lineProfile} onSuccess={() => {}} onSave={(data) => registerMutation.mutateAsync(data)} />;

  const collectedCoupons = userCoupons.filter(uc => !uc.is_used);
  const usedCoupons = userCoupons.filter(uc => uc.is_used).map(uc => ({ ...uc, usedDate: uc.used_at ? new Date(uc.used_at).toLocaleDateString('th-TH') : '' }));
  const sortedPetsList = [...pets].sort((a, b) => (a.is_favorite === b.is_favorite ? 0 : a.is_favorite ? -1 : 1));

  // Map for UI components that expect camelCase
  const mappedPetsForUI = sortedPetsList.map(p => ({
    ...p,
    medicalCondition: p.medical_condition,
    imageUrl: p.image_url,
    cardBgColor: p.card_bg_color,
    isFavorite: p.is_favorite
  }));

  const ownerProfile = {
    firstName: profile?.first_name || '',
    lastName: profile?.last_name || '',
    gender: profile?.gender || '',
    age: profile?.age || '',
    phone: profile?.phone || '',
    address: profile?.address || '',
    subDistrict: profile?.sub_district || '',
    district: profile?.district || '',
    province: profile?.province || '',
    postalCode: profile?.postal_code || '',
    email: profile?.email || '',
    pointsExpiry: formatDateThai(profile?.points_expiry),
    pointsLedger: profile?.points_ledger || []
  };

  return (
    <div className="w-full h-[100dvh] max-w-md mx-auto bg-[#FFF9F0] relative shadow-2xl flex flex-col font-['Prompt'] overflow-hidden border-x border-slate-100/50">
      <header className="px-6 pt-[calc(8px+env(safe-area-inset-top))] pb-[15px] flex justify-between items-center shrink-0 z-[50]">
        <div className="min-w-0 flex-1">
          <h1 className="text-xl font-black text-slate-800 truncate">สวัสดี, {lineProfile?.displayName || profile?.first_name || 'คุณ'}</h1>
          <p className="text-slate-500 text-xs font-medium">วันนี้พาน้องๆ ไปสปากันเถอะ ✨</p>
        </div>
        <div className="flex items-center gap-2.5 ml-4">
          <motion.button whileTap={{ scale: 0.9 }} onClick={handleSimulatePoints} className="p-1.5 bg-amber-100 text-amber-600 rounded-full border border-amber-200 shadow-sm"><PlusCircle size={18} /></motion.button>
          <motion.div whileTap={{ scale: 0.9 }} onClick={() => setIsProfileEditing(true)} className="w-12 h-12 rounded-full border-2 border-white shadow-md overflow-hidden bg-pink-100 cursor-pointer">
            {(profile?.avatar_url || lineProfile?.pictureUrl) && <img src={profile?.avatar_url || lineProfile?.pictureUrl} alt="Profile" className="w-full h-full object-cover"/>}
          </motion.div>
        </div>
      </header>

      <main ref={mainScrollRef} className="px-6 flex-1 pb-[calc(7rem+env(safe-area-inset-bottom))] overflow-y-scroll no-scrollbar touch-pan-y">
        <AnimatePresence mode="wait">
          {activeTab === 'home' && (
            <motion.div key="home" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.2 }} className="space-y-6">
              {profileLoading ? <div className="w-full h-48 bg-slate-100 rounded-[2rem] animate-pulse" /> : <MembershipCard totalAccumulatedPoints={profile?.total_points || 0} redeemablePoints={profile?.points || 0} ownerProfile={ownerProfile} onShowQR={() => setIsQRCodeOpen(true)} />}
              <UpcomingAppointments />
              <HomeQuickActions onCouponsClick={() => setActiveTab('promo')} onAppointmentClick={() => toast.info('ฟังก์ชันจองคิวจะมาเร็วๆ นี้ค่ะ')} />
              <PetList pets={mappedPetsForUI} onPetClick={(p) => { setSelectedPetForDetail(pets.find(i => i.id === p.id) || null); setActiveTab('pets'); }} onViewAll={() => setActiveTab('pets')} />
              <MyCouponsHomePreview coupons={collectedCoupons} onViewAll={() => setActiveTab('promo')} />
            </motion.div>
          )}

          {activeTab === 'pets' && (
            <motion.div key="pets-tab" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.2 }}>
              {selectedPetForDetail ? (
                <PetDetailView pet={selectedPetForDetail} onBack={() => setSelectedPetForDetail(null)} onStartEdit={(p) => { setPetToEdit(pets.find(i => i.id === p.id) || null); setIsPetFormOpen(true); }} onDeletePet={(id) => deletePetMutation.mutate(id)} totalServiceCost={0} onViewServiceHistoryForPet={() => {}} onEditPreferences={() => setIsPreferenceFormOpen(true)} onToggleFavorite={() => savePetMutation.mutate({ ...selectedPetForDetail, is_favorite: !selectedPetForDetail.is_favorite })} />
              ) : (
                <PetManagement pets={mappedPetsForUI} onBack={() => setActiveTab('home')} onViewDetails={(p) => setSelectedPetForDetail(pets.find(i => i.id === p.id) || null)} onAddPet={() => { setPetToEdit(null); setIsPetFormOpen(true); }} />
              )}
            </motion.div>
          )}

          {activeTab === 'history' && (
            <motion.div key="history-tab" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.2 }}>
              {selectedServiceForDetail ? <ServiceHistoryDetail service={selectedServiceForDetail} onBack={() => setSelectedServiceForDetail(null)} /> : <ServiceHistory historyData={serviceHistory} onServiceClick={(s) => setSelectedServiceForDetail(s)} />}
            </motion.div>
          )}
          
          {activeTab === 'level' && (
            <motion.div key="level-tab" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.2 }}>
              <MembershipLevels totalAccumulatedPoints={profile?.total_points || 0} redeemablePoints={profile?.points || 0} tierExpiry={formatDateThai(profile?.tier_expiry)} />
            </motion.div>
          )}

          {activeTab === 'promo' && (
            <motion.div key="promo-tab" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.2 }}>
               <Promotions userPoints={profile?.points || 0} collectedCoupons={collectedCoupons} usedOrExpiredCoupons={usedCoupons} onRedeemCoupon={(c, cost) => collectCouponMutation.mutate({ coupon: c, cost })} onUseCoupon={(couponId) => { const uc = collectedCoupons.find(c => c.id === couponId); if (uc) { setSelectedCouponToUse(uc); setIsCouponUseModalOpen(true); } }} collectedSpecialPromos={userCoupons.map(uc => uc.coupon_id)} onCollectSpecialPromotion={(c) => collectCouponMutation.mutate({ coupon: c, cost: 0 })} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <UserProfileEdit isOpen={isProfileEditing} onClose={() => setIsProfileEditing(false)} profile={ownerProfile} onSave={(data) => saveProfileMutation.mutate(data)} />
      <QRCodeModal isOpen={isQRCodeOpen} onClose={() => setIsQRCodeOpen(false)} lineId={lineProfile?.displayName || profile?.first_name || 'สมาชิก'} memberId={profile?.phone || ''} />
      <PetForm isOpen={isPetFormOpen} onClose={() => setIsPetFormOpen(false)} onSave={(data) => savePetMutation.mutate(data)} initialData={petToEdit} />
      <PetPreferenceForm isOpen={isPreferenceFormOpen} onClose={() => setIsPreferenceFormOpen(false)} onSave={(prefs) => selectedPetForDetail && savePetMutation.mutate({ ...selectedPetForDetail, custom_preferences: prefs })} initialData={selectedPetForDetail?.custom_preferences || []} petName={selectedPetForDetail?.name || ''} />
      <CouponUseModal isOpen={isCouponUseModalOpen} onClose={() => setIsCouponUseModalOpen(false)} coupon={selectedCouponToUse} onConfirmUse={() => selectedCouponToUse && useCouponMutation.mutate(selectedCouponToUse.id)} />

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