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

const Index = () => {
  const queryClient = useQueryClient();
  const { profile: userProfile, loading: liffLoading } = useLiff();
  const [activeTab, setActiveTab] = useState('home');
  const [isProfileEditing, setIsProfileEditing] = useState(false);
  const [isQRCodeOpen, setIsQRCodeOpen] = useState(false);
  const [selectedPetForDetail, setSelectedPetForDetail] = useState<Pet | null>(null);
  const [selectedServiceForDetail, setSelectedServiceForDetail] = useState<any | null>(null);
  const [isPetFormOpen, setIsPetFormOpen] = useState(false);
  const [petToEdit, setPetToEdit] = useState<Pet | null>(null);
  const [isPreferenceFormOpen, setIsPreferenceFormOpen] = useState(false);

  // Queries
  const { data: pets = [] } = useQuery({
    queryKey: ['pets', userProfile?.id],
    queryFn: async () => {
      if (!userProfile?.id) return [];
      const { data, error } = await supabase.from('pets').select('*').eq('owner_id', userProfile.id);
      if (error) throw error;
      return data;
    },
    enabled: !!userProfile?.id
  });

  const { data: serviceHistory = [] } = useQuery({
    queryKey: ['history', userProfile?.id],
    queryFn: async () => {
      if (!userProfile?.id) return [];
      const { data, error } = await supabase.from('service_history').select('*').eq('owner_id', userProfile.id);
      if (error) throw error;
      return data.map(h => ({
        ...h,
        icon: h.icon_name === 'Scissors' ? <Scissors className="text-pink-500" /> : <Sparkles className="text-blue-500" />
      }));
    },
    enabled: !!userProfile?.id
  });

  // Mutations
  const savePetMutation = useMutation({
    mutationFn: async (petData: any) => {
      if (petData.id) {
        const { error } = await supabase.from('pets').update(petData).eq('id', petData.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('pets').insert([{ ...petData, owner_id: userProfile?.id }]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pets'] });
      setIsPetFormOpen(false);
      setPetToEdit(null);
      toast.success('บันทึกข้อมูลเรียบร้อยแล้ว');
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
      toast.success('ลบข้อมูลเรียบร้อยแล้ว');
    }
  });

  if (liffLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#FFF9F0]">
        <PawPrint className="text-pink-400 animate-bounce" size={48} />
        <p className="mt-4 font-bold text-slate-600">กำลังเข้าสู่ระบบ LINE...</p>
      </div>
    );
  }

  const sortedPets = [...pets].sort((a, b) => (a.is_favorite === b.is_favorite ? 0 : a.is_favorite ? -1 : 1));

  return (
    <div className="w-full min-h-screen max-w-lg mx-auto bg-[#FFF9F0] relative shadow-2xl flex flex-col font-['Prompt']">
      <header className="px-6 pt-[calc(5px+env(safe-area-inset-top))] pb-6 flex justify-between items-center shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">สวัสดี, คุณ{userProfile?.first_name}!</h1>
          <p className="text-slate-500 text-sm">วันนี้พาน้องๆ ไปสปากันเถอะ ✨</p>
        </div>
        <motion.div whileTap={{ scale: 0.9 }} onClick={() => setIsProfileEditing(true)} className="w-16 h-16 rounded-full border-[3px] border-white shadow-lg overflow-hidden bg-pink-100 cursor-pointer">
          <img src={userProfile?.avatar_url || "https://api.dicebear.com/7.x/avataaars/svg?seed=Pet"} alt="Profile" className="w-full h-full object-cover" />
        </motion.div>
      </header>

      <main className="px-6 flex-1 pb-[calc(7rem+env(safe-area-inset-bottom))]">
        <AnimatePresence mode="wait">
          {activeTab === 'home' && (
            <motion.div key="home" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
              <MembershipCard totalAccumulatedPoints={userProfile?.total_points || 0} redeemablePoints={userProfile?.points || 0} ownerProfile={userProfile} onShowQR={() => setIsQRCodeOpen(true)} />
              <UpcomingAppointments />
              <PetList pets={sortedPets} onPetClick={(pet) => { setSelectedPetForDetail(pet); setActiveTab('pets'); }} onViewAll={() => setActiveTab('pets')} />
            </motion.div>
          )}

          {activeTab === 'pets' && (
            <motion.div key="pets-tab" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              {selectedPetForDetail ? (
                <PetDetailView 
                  pet={{
                    ...selectedPetForDetail,
                    medicalCondition: selectedPetForDetail.medical_condition,
                    imageUrl: selectedPetForDetail.image_url,
                    isFavorite: selectedPetForDetail.is_favorite
                  }} 
                  onBack={() => setSelectedPetForDetail(null)} 
                  onStartEdit={(p) => { setPetToEdit(p); setIsPetFormOpen(true); }} 
                  onDeletePet={(id) => deletePetMutation.mutate(id)} 
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
          
          {/* ส่วน Tab อื่นๆ ปรับใช้ react-query ในลักษณะเดียวกัน */}
        </AnimatePresence>
      </main>

      <QRCodeModal isOpen={isQRCodeOpen} onClose={() => setIsQRCodeOpen(false)} ownerName={userProfile?.first_name || ''} memberId={userProfile?.phone || ''} />
      <PetForm isOpen={isPetFormOpen} onClose={() => setIsPetFormOpen(false)} onSave={(data) => savePetMutation.mutate(data)} initialData={petToEdit} />

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
    {active && <motion.div layoutId="activeNavBg" className="absolute inset-0 bg-gradient-to-b from-[#FFA14A] to-[#FF4B91] rounded-full shadow-lg" />}
    <div className={`relative z-10 ${active ? 'text-white' : 'text-slate-600'}`}>{icon}</div>
  </button>
);

export default Index;