"use client";

import React, { useState, useEffect } from 'react';
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
import { Home, Award, PawPrint, Megaphone, Calendar, History, Scissors } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { useLiff } from '@/hooks/use-liff';
import { supabase } from '@/integrations/supabase/client';

export interface Pet {
  id: number;
  name: string;
  type: string;
  breed: string;
  age: string;
  gender: string;
  weight: string;
  medicalCondition: string;
  precautions: string;
  color: string;
  icon: string;
  furLength?: string;
  customPreferences?: { id: string; label: string; value: string; }[];
  imageUrl: string;
  cardBgColor: string;
  isFavorite?: boolean;
}

const Index = () => {
  const { profile: liffProfile, isLoading: isLiffLoading } = useLiff();
  const [activeTab, setActiveTab] = useState('home');
  const [isProfileEditing, setIsProfileEditing] = useState(false);
  const [isQRCodeOpen, setIsQRCodeOpen] = useState(false);
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [selectedCouponToUse, setSelectedCouponToUse] = useState<any>(null);

  const [ownerProfile, setOwnerProfile] = useState<any>(null);
  const [pets, setPets] = useState<Pet[]>([]);
  const [serviceHistory, setServiceHistory] = useState<any[]>([]);
  const [collectedCoupons, setCollectedCoupons] = useState<any[]>([]);
  
  const [isPetFormOpen, setIsPetFormOpen] = useState(false);
  const [petToEdit, setPetToEdit] = useState<Pet | null>(null);
  const [selectedPetForDetail, setSelectedPetForDetail] = useState<Pet | null>(null);
  const [selectedServiceForDetail, setSelectedServiceForDetail] = useState<any>(null);
  const [isPreferenceFormOpen, setIsPreferenceFormOpen] = useState(false);

  useEffect(() => {
    if (liffProfile) {
      fetchUserData(liffProfile.userId);
    }
  }, [liffProfile]);

  const fetchUserData = async (lineUserId: string) => {
    try {
      let { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('line_id', lineUserId)
        .maybeSingle();

      if (!profile) {
        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .insert([{ 
            line_id: lineUserId, 
            first_name: liffProfile.displayName,
            avatar_url: liffProfile.pictureUrl,
            points: 0,
            total_points: 0
          }])
          .select()
          .single();
        profile = newProfile;
      }

      setOwnerProfile(profile);

      if (profile) {
        const { data: petsData } = await supabase
          .from('pets')
          .select('*')
          .eq('owner_id', profile.id);
        
        const mappedPets = (petsData || []).map(p => ({
          ...p,
          medicalCondition: p.medical_condition,
          furLength: p.fur_length,
          imageUrl: p.image_url,
          cardBgColor: p.card_bg_color,
          isFavorite: p.is_favorite,
          customPreferences: p.custom_preferences
        }));
        setPets(mappedPets);

        const { data: couponsData } = await supabase
          .from('user_coupons')
          .select('*, coupons(*)')
          .eq('owner_id', profile.id);
        setCollectedCoupons(couponsData?.map((uc: any) => ({
          ...uc.coupons,
          iconName: uc.coupons.icon_name,
          pointsRequired: uc.coupons.points_required
        })) || []);

        const { data: historyData } = await supabase
          .from('service_history')
          .select('*')
          .eq('owner_id', profile.id);
        
        const mappedHistory = (historyData || []).map(h => ({
          ...h,
          petName: h.pet_name,
          iconName: h.icon_name,
          shampooUsed: h.shampoo_used,
          spaTreatment: h.spa_treatment,
          groomerNotes: h.groomer_notes,
          icon: <Scissors size={18} /> // Placeholder icon
        }));
        setServiceHistory(mappedHistory);
      }
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  };

  const handleSavePet = async (petData: any) => {
    if (!ownerProfile) return;

    const dbPetData = {
      owner_id: ownerProfile.id,
      name: petData.name,
      type: petData.type,
      breed: petData.breed,
      age: petData.age,
      gender: petData.gender,
      weight: petData.weight,
      medical_condition: petData.medicalCondition,
      precautions: petData.precautions,
      color: petData.color,
      icon: petData.icon,
      fur_length: petData.furLength,
      image_url: petData.imageUrl,
      card_bg_color: petData.cardBgColor,
      is_favorite: petData.isFavorite,
      custom_preferences: petData.customPreferences
    };

    try {
      if (petData.id) {
        const { error } = await supabase.from('pets').update(dbPetData).eq('id', petData.id);
        if (error) throw error;
        toast.success('อัปเดตข้อมูลสำเร็จ');
      } else {
        const { error } = await supabase.from('pets').insert([dbPetData]);
        if (error) throw error;
        toast.success('เพิ่มสัตว์เลี้ยงสำเร็จ');
      }
      fetchUserData(liffProfile.userId);
      setIsPetFormOpen(false);
    } catch (err) {
      toast.error('เกิดข้อผิดพลาด');
    }
  };

  const handleDeletePet = async (id: number) => {
    try {
      const { error } = await supabase.from('pets').delete().eq('id', id);
      if (error) throw error;
      toast.success('ลบข้อมูลเรียบร้อย');
      fetchUserData(liffProfile.userId);
      setSelectedPetForDetail(null);
    } catch (err) {
      toast.error('ลบไม่สำเร็จ');
    }
  };

  const handleStartEditPet = (pet: Pet) => {
    setPetToEdit(pet);
    setIsPetFormOpen(true);
  };

  const handleUpdateProfile = async (updatedProfile: any) => {
    if (!ownerProfile) return;
    try {
      const dbProfileData = {
        first_name: updatedProfile.firstName,
        last_name: updatedProfile.lastName,
        gender: updatedProfile.gender,
        age: updatedProfile.age,
        phone: updatedProfile.phone,
        address: updatedProfile.address,
        email: updatedProfile.email
      };
      const { error } = await supabase.from('profiles').update(dbProfileData).eq('id', ownerProfile.id);
      if (error) throw error;
      toast.success('บันทึกข้อมูลส่วนตัวสำเร็จ');
      fetchUserData(liffProfile.userId);
    } catch (err) {
      toast.error('บันทึกไม่สำเร็จ');
    }
  };

  if (isLiffLoading || !ownerProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFF9F0]">
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="p-4 bg-white rounded-full shadow-lg">
          <PawPrint className="text-pink-500" size={40} />
        </motion.div>
      </div>
    );
  }

  const sortedPets = [...pets].sort((a, b) => (a.isFavorite === b.isFavorite ? 0 : a.isFavorite ? -1 : 1));

  return (
    <div className="w-full min-h-screen max-w-lg mx-auto bg-[#FFF9F0] relative shadow-2xl flex flex-col font-['Prompt']">
      <header className="px-6 pt-[calc(5px+env(safe-area-inset-top))] pb-6 flex justify-between items-center shrink-0">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-800">สวัสดี, คุณ{ownerProfile.first_name}!</h1>
            <motion.div animate={{ rotate: [0, 20, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
              <PawPrint className="text-pink-400" size={24} fill="currentColor" />
            </motion.div>
          </div>
          <p className="text-slate-500 text-sm">วันนี้พาน้องๆ ไปสปากันเถอะ ✨</p>
        </div>
        <motion.div whileTap={{ scale: 0.9 }} onClick={() => setIsProfileEditing(true)} className="w-16 h-16 rounded-full border-[3px] border-white shadow-lg overflow-hidden bg-pink-100 cursor-pointer">
          <img src={ownerProfile.avatar_url || liffProfile.pictureUrl} alt="Profile" className="w-full h-full object-cover" />
        </motion.div>
      </header>

      <main className="px-6 flex-1 pb-[calc(7rem+env(safe-area-inset-bottom))]">
        <AnimatePresence mode="wait">
          {activeTab === 'home' && (
            <motion.div key="home" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
              <MembershipCard 
                totalAccumulatedPoints={ownerProfile.total_points || 0} 
                redeemablePoints={ownerProfile.points || 0} 
                ownerProfile={{
                  firstName: ownerProfile.first_name,
                  lastName: ownerProfile.last_name || '',
                  gender: ownerProfile.gender || '',
                  age: ownerProfile.age || '',
                  phone: ownerProfile.phone || '',
                  address: ownerProfile.address || '',
                  email: ownerProfile.email || ''
                }} 
                onShowQR={() => setIsQRCodeOpen(true)} 
              />
              <UpcomingAppointments />
              <div className="grid grid-cols-2 gap-4">
                <button className="bg-white p-4 rounded-3xl shadow-sm border border-slate-50 flex flex-col items-center gap-2 group active:scale-95 transition-all">
                  <div className="w-12 h-12 bg-[#B2F2BB]/30 rounded-2xl flex items-center justify-center"><Calendar className="text-emerald-500" /></div>
                  <span className="font-bold text-sm text-slate-700">จองคิวอาบน้ำ</span>
                </button>
                <button onClick={() => setActiveTab('promo')} className="bg-white p-4 rounded-3xl shadow-sm border border-slate-50 flex flex-col items-center gap-2 group active:scale-95 transition-all">
                  <div className="w-12 h-12 bg-[#FFD8E4]/30 rounded-2xl flex items-center justify-center"><Megaphone className="text-pink-500" /></div>
                  <span className="font-bold text-sm text-slate-700">โปรโมชั่น</span>
                </button>
              </div>
              <PetList 
                pets={sortedPets} 
                onPetClick={(pet) => { setSelectedPetForDetail(pet); setActiveTab('pets'); }} 
                onViewAll={() => setActiveTab('pets')} 
              />
              <MyCouponsHomePreview coupons={collectedCoupons} onViewAll={() => setActiveTab('promo')} />
            </motion.div>
          )}

          {activeTab === 'level' && (
            <motion.div key="level-tab" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <MembershipLevels totalAccumulatedPoints={ownerProfile.total_points || 0} redeemablePoints={ownerProfile.points || 0} />
            </motion.div>
          )}

          {activeTab === 'pets' && (
            <motion.div key="pets-tab" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              {selectedPetForDetail ? (
                <PetDetailView 
                  pet={selectedPetForDetail} 
                  onBack={() => setSelectedPetForDetail(null)} 
                  onStartEdit={handleStartEditPet} 
                  onDeletePet={handleDeletePet} 
                  totalServiceCost={0} 
                  onViewServiceHistoryForPet={() => {}} 
                  onEditPreferences={() => setIsPreferenceFormOpen(true)} 
                  onToggleFavorite={() => {}} 
                />
              ) : (
                <PetManagement pets={sortedPets} onBack={() => setActiveTab('home')} onViewDetails={(pet) => setSelectedPetForDetail(pet)} onAddPet={() => { setPetToEdit(null); setIsPetFormOpen(true); }} />
              )}
            </motion.div>
          )}

          {activeTab === 'history' && (
            <motion.div key="history-tab" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              {selectedServiceForDetail ? (
                <ServiceHistoryDetail service={selectedServiceForDetail} onBack={() => setSelectedServiceForDetail(null)} />
              ) : (
                <ServiceHistory historyData={serviceHistory} onServiceClick={(s) => setSelectedServiceForDetail(s)} />
              )}
            </motion.div>
          )}

          {activeTab === 'promo' && (
            <motion.div key="promo-tab" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <Promotions 
                userPoints={ownerProfile.points || 0}
                collectedCoupons={collectedCoupons}
                usedOrExpiredCoupons={[]}
                onRedeemCoupon={() => {}}
                onUseCoupon={() => {}}
                collectedSpecialPromos={[]}
                onCollectSpecialPromotion={() => {}}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <UserProfileEdit 
        isOpen={isProfileEditing} 
        onClose={() => setIsProfileEditing(false)} 
        profile={{
          firstName: ownerProfile.first_name,
          lastName: ownerProfile.last_name || '',
          gender: ownerProfile.gender || '',
          age: ownerProfile.age || '',
          phone: ownerProfile.phone || '',
          address: ownerProfile.address || '',
          email: ownerProfile.email || ''
        }} 
        onSave={handleUpdateProfile} 
      />
      <QRCodeModal isOpen={isQRCodeOpen} onClose={() => setIsQRCodeOpen(false)} ownerName={ownerProfile.first_name} memberId={ownerProfile.phone || ownerProfile.line_id} />
      <PetForm isOpen={isPetFormOpen} onClose={() => setIsPetFormOpen(false)} onSave={handleSavePet} initialData={petToEdit} />
      
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

interface NavButtonProps { active: boolean; icon: React.ReactNode; onClick: () => void; }
const NavButton = ({ active, icon, onClick }: NavButtonProps) => (
  <button onClick={onClick} className="relative flex items-center justify-center w-12 h-12">
    {active && <motion.div layoutId="activeNavBg" className="absolute inset-0 bg-gradient-to-b from-[#FFA14A] to-[#FF4B91] rounded-full" />}
    <div className={`relative z-10 ${active ? 'text-white' : 'text-slate-600'}`}>{icon}</div>
  </button>
);

export default Index;