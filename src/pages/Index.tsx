"use client";

import React, { useState } from 'react';
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
import { Home, Award, PawPrint, Megaphone, Calendar, History, Scissors, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

export interface Pet {
  id: number;
  owner_id: string;
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

interface Coupon {
  id: number;
  title: string;
  description: string;
  value: string;
  type: string;
  expiry: string;
  iconName: string;
  color: string;
  bg: string;
  pointsRequired: number;
}

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

  // Coupon usage modal state
  const [selectedCouponToUse, setSelectedCouponToUse] = useState<any | null>(null);
  const [isCouponUseModalOpen, setIsCouponUseModalOpen] = useState(false);

  // Queries
  const { data: pets = [] } = useQuery({
    queryKey: ['pets', lineProfile?.userId],
    queryFn: async () => {
      if (!lineProfile?.userId) return [];
      const { data, error } = await supabase
        .from('pets')
        .select('*')
        .eq('owner_id', lineProfile.userId);
      if (error) throw error;
      return data as Pet[];
    },
    enabled: !!lineProfile?.userId
  });

  const { data: userCoupons = [] } = useQuery({
    queryKey: ['user_coupons', lineProfile?.userId],
    queryFn: async () => {
      if (!lineProfile?.userId) return [];
      const { data, error } = await supabase
        .from('user_coupons')
        .select(`
          *,
          coupons (*)
        `)
        .eq('owner_id', lineProfile.userId);
      if (error) throw error;
      return data;
    },
    enabled: !!lineProfile?.userId
  });

  const { data: serviceHistory = [] } = useQuery({
    queryKey: ['history', lineProfile?.userId],
    queryFn: async () => {
      if (!lineProfile?.userId) return [];
      const { data, error } = await supabase
        .from('service_history')
        .select('*')
        .eq('owner_id', lineProfile.userId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      
      return data.map(h => ({
        ...h,
        icon: h.icon_name === 'Scissors' ? <Scissors className="text-pink-500" /> : <Sparkles className="text-blue-500" />,
        bg: h.bg || 'bg-slate-50'
      }));
    },
    enabled: !!lineProfile?.userId
  });

  // Mutations
  const savePetMutation = useMutation({
    mutationFn: async (petData: any) => {
      if (!lineProfile?.userId) throw new Error("ไม่พบข้อมูลผู้ใช้งาน LINE");
      const isEdit = !!petData.id;
      const dataToSave = {
        name: petData.name,
        type: petData.type,
        breed: petData.breed,
        age: petData.age?.toString() || '',
        gender: petData.gender,
        weight: petData.weight?.toString() || '',
        medical_condition: petData.medicalCondition || petData.medical_condition || '-',
        precautions: petData.precautions || '-',
        color: petData.color || 'bg-orange-100',
        icon: petData.icon || '🐾',
        fur_length: petData.furLength || petData.fur_length || '',
        custom_preferences: petData.customPreferences || petData.custom_preferences || [],
        image_url: petData.imageUrl || petData.image_url || '',
        card_bg_color: petData.cardBgColor || petData.card_bg_color || '#FFF9C4',
        is_favorite: petData.isFavorite !== undefined ? petData.isFavorite : (petData.is_favorite || false),
        owner_id: lineProfile.userId,
      };
      if (isEdit) {
        const { error } = await supabase.from('pets').update(dataToSave).eq('id', petData.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('pets').insert([dataToSave]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pets'] });
      setIsPetFormOpen(false);
      setPetToEdit(null);
      toast.success('บันทึกข้อมูลเรียบร้อยแล้วค่ะ');
    }
  });

  const deletePetMutation = useMutation({
    mutationFn: async (id: number) => {
      const { error } = await supabase.from('pets').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pets'] });
      setSelectedPetForDetail(null);
      toast.success('ลบข้อมูลเรียบร้อยแล้วค่ะ');
    },
    onError: (error: any) => {
      toast.error(`เกิดข้อผิดพลาด: ${error.message}`);
    }
  });

  const collectCouponMutation = useMutation({
    mutationFn: async (couponId: number) => {
      if (!lineProfile?.userId) throw new Error("ไม่พบข้อมูลผู้ใช้งาน LINE");
      const { error } = await supabase.from('user_coupons').insert([{
        owner_id: lineProfile.userId,
        coupon_id: couponId,
        is_used: false
      }]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user_coupons'] });
      toast.success('เก็บคูปองเรียบร้อยแล้วค่ะ');
    }
  });

  const useCouponMutation = useMutation({
    mutationFn: async (userCouponId: number) => {
      const { error } = await supabase
        .from('user_coupons')
        .update({ is_used: true, used_at: new Date().toISOString() })
        .eq('id', userCouponId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user_coupons'] });
      setIsCouponUseModalOpen(false);
      setSelectedCouponToUse(null);
      toast.success('ใช้คูปองเรียบร้อยแล้วค่ะ');
    }
  });

  if (liffLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#FFF9F0]">
        <PawPrint className="text-pink-400 animate-bounce" size={48} />
        <p className="mt-4 font-bold text-slate-600">กำลังเชื่อมต่อ LINE LIFF...</p>
      </div>
    );
  }

  // Filter UI Data
  const collectedCoupons = userCoupons
    .filter(uc => !uc.is_used)
    .map(uc => ({
      ...uc.coupons,
      userCouponId: uc.id,
      pointsRequired: uc.coupons.points_required,
      iconName: uc.coupons.icon_name
    }));

  const usedCoupons = userCoupons
    .filter(uc => uc.is_used)
    .map(uc => ({
      ...uc.coupons,
      usedDate: uc.used_at ? new Date(uc.used_at).toLocaleDateString('th-TH') : '',
      iconName: uc.coupons.icon_name
    }));

  const collectedSpecialPromoIds = userCoupons.map(uc => uc.coupon_id);

  const sortedPets = [...pets].sort((a, b) => (a.is_favorite === b.is_favorite ? 0 : a.is_favorite ? -1 : 1));
  const mappedPetsForUI = sortedPets.map(p => ({
    ...p,
    medicalCondition: p.medical_condition,
    imageUrl: p.image_url,
    cardBgColor: p.card_bg_color,
    isFavorite: p.is_favorite
  }));

  return (
    <div className="w-full min-h-screen max-w-lg mx-auto bg-[#FFF9F0] relative shadow-2xl flex flex-col font-['Prompt']">
      <header className="px-6 pt-[calc(5px+env(safe-area-inset-top))] pb-6 flex justify-between items-center shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            สวัสดี, คุณ {lineProfile?.displayName || 'คุณ'}
          </h1>
          <p className="text-slate-500 text-sm">วันนี้พาน้องๆ ไปสปากันเถอะ ✨</p>
        </div>
        <motion.div 
          whileTap={{ scale: 0.9 }} 
          onClick={() => setIsProfileEditing(true)} 
          className="w-16 h-16 rounded-full border-[3px] border-white shadow-lg overflow-hidden bg-pink-100 cursor-pointer"
        >
          {lineProfile?.pictureUrl && <img src={lineProfile.pictureUrl} alt="Line Profile" className="w-full h-full object-cover"/>}
        </motion.div>
      </header>

      <main className="px-6 flex-1 pb-[calc(7rem+env(safe-area-inset-bottom))]">
        <AnimatePresence mode="wait">
          {activeTab === 'home' && (
            <motion.div key="home" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
              <MembershipCard 
                totalAccumulatedPoints={0} 
                redeemablePoints={0} 
                ownerProfile={{ firstName: lineProfile?.displayName?.split(' ')[0] || '', lastName: '', gender: '', age: '', phone: '', address: '', email: '' }} 
                onShowQR={() => setIsQRCodeOpen(true)} 
              />
              <UpcomingAppointments />
              <PetList pets={mappedPetsForUI} onPetClick={(p) => { setSelectedPetForDetail(pets.find(i => i.id === p.id) || null); setActiveTab('pets'); }} onViewAll={() => setActiveTab('pets')} />
              <MyCouponsHomePreview coupons={collectedCoupons} onViewAll={() => setActiveTab('promo')} />
            </motion.div>
          )}

          {activeTab === 'pets' && (
            <motion.div key="pets-tab" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              {selectedPetForDetail ? (
                <PetDetailView 
                  pet={{ ...selectedPetForDetail, medicalCondition: selectedPetForDetail.medical_condition, imageUrl: selectedPetForDetail.image_url, isFavorite: selectedPetForDetail.is_favorite }} 
                  onBack={() => setSelectedPetForDetail(null)} 
                  onStartEdit={(p) => { setPetToEdit(pets.find(i => i.id === p.id) || null); setIsPetFormOpen(true); }} 
                  onDeletePet={(id) => deletePetMutation.mutate(id)} 
                  totalServiceCost={0} 
                  onViewServiceHistoryForPet={() => {}} 
                  onEditPreferences={() => setIsPreferenceFormOpen(true)} 
                  onToggleFavorite={() => {
                    const updatedFavorite = !selectedPetForDetail.is_favorite;
                    savePetMutation.mutate({ ...selectedPetForDetail, isFavorite: updatedFavorite });
                    setSelectedPetForDetail({ ...selectedPetForDetail, is_favorite: updatedFavorite });
                  }}
                />
              ) : (
                <PetManagement pets={mappedPetsForUI} onBack={() => setActiveTab('home')} onViewDetails={(p) => setSelectedPetForDetail(pets.find(i => i.id === p.id) || null)} onAddPet={() => { setPetToEdit(null); setIsPetFormOpen(true); }} />
              )}
            </motion.div>
          )}

          {activeTab === 'history' && (
            <motion.div key="history-tab" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              {selectedServiceForDetail ? <ServiceHistoryDetail service={selectedServiceForDetail} onBack={() => setSelectedServiceForDetail(null)} /> : <ServiceHistory historyData={serviceHistory} onServiceClick={(s) => setSelectedServiceForDetail(s)} />}
            </motion.div>
          )}
          
          {activeTab === 'level' && (
            <motion.div key="level-tab" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <MembershipLevels totalAccumulatedPoints={0} redeemablePoints={0} />
            </motion.div>
          )}

          {activeTab === 'promo' && (
            <motion.div key="promo-tab" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
               <Promotions 
                userPoints={0}
                collectedCoupons={collectedCoupons} 
                usedOrExpiredCoupons={usedCoupons}
                onRedeemCoupon={(c) => collectCouponMutation.mutate(c.id)}
                onUseCoupon={(couponId) => {
                  const uc = collectedCoupons.find(c => c.id === couponId);
                  if (uc) { setSelectedCouponToUse(uc); setIsCouponUseModalOpen(true); }
                }}
                collectedSpecialPromos={collectedSpecialPromoIds}
                onCollectSpecialPromotion={(c) => collectCouponMutation.mutate(c.id)}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <UserProfileEdit isOpen={isProfileEditing} onClose={() => setIsProfileEditing(false)} profile={{ firstName: lineProfile?.displayName?.split(' ')[0] || '', lastName: '', gender: '', age: '', phone: '', address: '', email: '' }} onSave={() => setIsProfileEditing(false)} />
      <QRCodeModal isOpen={isQRCodeOpen} onClose={() => setIsQRCodeOpen(false)} ownerName={lineProfile?.displayName || ''} memberId={lineProfile?.userId || ''} />
      
      <PetForm isOpen={isPetFormOpen} onClose={() => setIsPetFormOpen(false)} onSave={(data) => savePetMutation.mutate(data)} initialData={petToEdit ? { ...petToEdit, medicalCondition: petToEdit.medical_condition, imageUrl: petToEdit.image_url, cardBgColor: petToEdit.card_bg_color, isFavorite: petToEdit.is_favorite } : null} />
      <PetPreferenceForm isOpen={isPreferenceFormOpen} onClose={() => setIsPreferenceFormOpen(false)} onSave={() => setIsPreferenceFormOpen(false)} initialData={selectedPetForDetail?.custom_preferences || []} petName={selectedPetForDetail?.name || ''} />
      
      <CouponUseModal 
        isOpen={isCouponUseModalOpen} 
        onClose={() => setIsCouponUseModalOpen(false)} 
        coupon={selectedCouponToUse} 
        onConfirmUse={() => selectedCouponToUse && useCouponMutation.mutate(selectedCouponToUse.userCouponId)} 
      />

      <nav className="fixed bottom-[calc(5px+env(safe-area-inset-bottom))] left-6 right-6 max-w-[calc(theme(maxWidth.lg)-3rem)] mx-auto bg-white/40 backdrop-blur-xl px-4 py-3 flex justify-between items-center rounded-full shadow-lg z-50 border border-white/60">
        <NavButton active={activeTab === 'home'} icon={<Home size={22} />} onClick={() => setActiveTab('home')} />
        <NavButton active={activeTab === 'level'} icon={<Award size={22} />} onClick={() => setActiveTab('level')} />
        <NavButton active={activeTab === 'pets'} icon={<PawPrint size={22} />} onClick={() => setActiveTab('pets')} />
        <NavButton active={activeTab === 'promo'} icon={<Megaphone size={22} />} onClick={() => setActiveTab('promo')} />
        <NavButton active={activeTab === 'history'} icon={<History size={22} />} onClick={() => setActiveTab('history')} />
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