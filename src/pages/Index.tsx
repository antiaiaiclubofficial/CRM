"use client";

import React, { useState } from 'react';
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
import { Home, Award, PawPrint, Megaphone, Calendar, Gift, Bell, History, Scissors, Sparkles, Bath, X, LayoutGrid } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

// Define the Pet interface
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
  conditions?: string[];
}

interface UsedCoupon extends Coupon {
  usedDate?: string;
}

interface ServiceHistoryItem {
  id: number;
  date: string;
  petName: string;
  service: string;
  price: string;
  icon: React.ReactNode;
  bg: string;
  description: string;
  notes?: string;
  shampooUsed?: string;
  spaTreatment?: string;
  groomerNotes?: string;
  beforeAfterImages?: { before: string; after: string; }[];
}

const Index = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [selectedPetName, setSelectedPetName] = useState<string | null>(null);
  const [isProfileEditing, setIsProfileEditing] = useState(false);
  const [isQRCodeOpen, setIsQRCodeOpen] = useState(false);
  
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [selectedCouponToUse, setSelectedCouponToUse] = useState<Coupon | null>(null);

  const [ownerProfile, setOwnerProfile] = useState({
    firstName: 'ซาร่า',
    lastName: 'เจน',
    gender: 'หญิง',
    age: '28',
    phone: '081-234-5678',
    address: '123/45 หมู่บ้านแสนสุข ถ.สุขุมวิท กรุงเทพฯ 10110',
    email: 'sara.jane@example.com'
  });

  const [totalAccumulatedPoints, setTotalAccumulatedPoints] = useState(1250);
  const [redeemablePoints, setRedeemablePoints] = useState(1250);
  const [collectedCoupons, setCollectedCoupons] = useState<Coupon[]>([]);
  const [usedOrExpiredCoupons, setUsedOrExpiredCoupons] = useState<UsedCoupon[]>([]);
  const [collectedSpecialPromos, setCollectedSpecialPromos] = useState<number[]>([]);

  const [pets, setPets] = useState<Pet[]>([
    { id: 1, name: 'Abyssinian Cats', type: 'แมว', breed: 'Abyssinian', age: '3', gender: 'เมีย', weight: '3.5', medicalCondition: 'ภูมิแพ้ผิวหนัง', precautions: 'ห้ามใช้แชมพูสูตรอ่อนโยนพิเศษ', color: 'bg-orange-100', icon: '🐱', furLength: 'ขนสั้น', imageUrl: 'https://images.unsplash.com/photo-1574144702728-1ab0e5759688?q=80&w=1935&auto=format&fit=crop', cardBgColor: '#FFF9C4', isFavorite: false },
    { id: 2, name: 'Persian', type: 'แมว', breed: 'Persian Cat', age: '2', gender: 'ผู้', weight: '4.2', medicalCondition: '-', precautions: 'ขี้ตื่นง่าย ระวังตอนตัดเล็บ', color: 'bg-blue-100', icon: '🐱', furLength: 'ขนยาว', imageUrl: 'https://images.unsplash.com/photo-1596854307913-a029b7371c95?q=80&w=1935&auto=format&fit=crop', cardBgColor: '#FFCDD2', isFavorite: true },
    { id: 3, name: 'Lucky', type: 'สุนัข', breed: 'Golden Retriever', age: '4', gender: 'ผู้', weight: '28.5', medicalCondition: '-', precautions: 'กลัวเสียงดัง', color: 'bg-yellow-100', icon: '🐶', furLength: 'ขนยาว', imageUrl: 'https://images.unsplash.com/photo-1552053831-71594a27632d?q=80&w=1935&auto=format&fit=crop', cardBgColor: '#BBDEFB', isFavorite: false },
    { id: 4, name: 'Cookie', type: 'สุนัข', breed: 'Beagle', age: '1', gender: 'เมีย', weight: '8.2', medicalCondition: '-', precautions: 'ห้ามให้กินขนมที่มีนม', color: 'bg-orange-100', icon: '🐶', furLength: 'ขนสั้น', imageUrl: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?q=80&w=1935&auto=format&fit=crop', cardBgColor: '#C8E6C9', isFavorite: false },
    { id: 5, name: 'Mochi', type: 'แมว', breed: 'Siamese Cat', age: '5', gender: 'ผู้', weight: '5.0', medicalCondition: '-', precautions: '-', color: 'bg-blue-100', icon: '🐱', furLength: 'ขนสั้น', imageUrl: 'https://images.unsplash.com/photo-1513245543132-31f507417b26?q=80&w=1935&auto=format&fit=crop', cardBgColor: '#DCEDC8', isFavorite: false },
    { id: 6, name: 'Bunny', type: 'กระต่าย', breed: 'Holland Lop', age: '1', gender: 'เมีย', weight: '1.5', medicalCondition: '-', precautions: 'ตกใจง่ายมาก', color: 'bg-green-100', icon: '🐰', furLength: 'ขนยาว', imageUrl: 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?q=80&w=1935&auto=format&fit=crop', cardBgColor: '#E1BEE7', isFavorite: false },
  ]);

  const [serviceHistory, setServiceHistory] = useState<ServiceHistoryItem[]>([
    { id: 1, date: '15 พ.ค. 2567', petName: 'Abyssinian Cats', service: 'อาบน้ำตัดขน Full Service', price: '550', icon: <Scissors className="text-pink-500" />, bg: 'bg-pink-50', description: 'บริการอาบน้ำและตัดขนครบวงจร', shampooUsed: 'Hypoallergenic Shampoo', beforeAfterImages: [] },
  ]);

  const [isPetFormOpen, setIsPetFormOpen] = useState(false);
  const [petToEdit, setPetToEdit] = useState<Pet | null>(null);
  const [selectedPetForDetail, setSelectedPetForDetail] = useState<Pet | null>(null);
  const [selectedServiceForDetail, setSelectedServiceForDetail] = useState<ServiceHistoryItem | null>(null);
  const [isPreferenceFormOpen, setIsPreferenceFormOpen] = useState(false);

  const handleRedeemCoupon = (coupon: Coupon, pointsCost: number) => {
    if (redeemablePoints >= pointsCost) {
      setRedeemablePoints(prev => prev - pointsCost);
      setCollectedCoupons((prev) => [...prev, coupon]);
      toast.success(`แลกคูปอง "${coupon.title}" สำเร็จ!`);
    } else {
      toast.error('คะแนนไม่พอค่ะ');
    }
  };

  const handleCollectSpecialPromotion = (promoCoupon: Coupon) => {
    if (!collectedSpecialPromos.includes(promoCoupon.id)) {
      setCollectedSpecialPromos(prev => [...prev, promoCoupon.id]);
      setCollectedCoupons(prev => [...prev, promoCoupon]);
      toast.success(`เก็บโปรโมชั่น "${promoCoupon.title}" ลงคูปองของฉันแล้วค่ะ!`);
    }
  };

  const handleUseCoupon = (couponId: number) => {
    const coupon = collectedCoupons.find(c => c.id === couponId);
    if (coupon) {
      setSelectedCouponToUse(coupon);
      setIsCouponModalOpen(true);
    }
  };

  const handleConfirmCouponUse = (couponId: number) => {
    const couponToUse = collectedCoupons.find(c => c.id === couponId);
    if (couponToUse) {
      setCollectedCoupons(prev => prev.filter(c => c.id !== couponId));
      setUsedOrExpiredCoupons(prev => [...prev, { ...couponToUse, usedDate: new Date().toLocaleDateString('th-TH') }]);
      setIsCouponModalOpen(false);
      setSelectedCouponToUse(null);
      toast.success(`ใช้คูปองสำเร็จแล้วค่ะ!`);
    }
  };

  const handleToggleFavorite = (petId: number) => {
    setPets(prevPets => prevPets.map(pet => 
      pet.id === petId ? { ...pet, isFavorite: !pet.isFavorite } : pet
    ));
    
    if (selectedPetForDetail && selectedPetForDetail.id === petId) {
      setSelectedPetForDetail(prev => prev ? { ...prev, isFavorite: !prev.isFavorite } : null);
    }
  };

  const handleSavePet = (petData: Omit<Pet, 'id'> | Pet) => {
    if ('id' in petData) {
      // Editing existing pet
      setPets(prev => prev.map(p => p.id === petData.id ? (petData as Pet) : p));
      if (selectedPetForDetail?.id === petData.id) {
        setSelectedPetForDetail(petData as Pet);
      }
      toast.success('อัปเดตข้อมูลน้องเรียบร้อยแล้วค่ะ');
    } else {
      // Adding new pet
      const newPet = {
        ...petData,
        id: Math.max(...pets.map(p => p.id), 0) + 1
      };
      setPets(prev => [...prev, newPet as Pet]);
      toast.success('เพิ่มน้องเข้าบ้านเรียบร้อยแล้วค่ะ! 🐾');
    }
    setIsPetFormOpen(false);
    setPetToEdit(null);
  };

  const handleDeletePet = (id: number) => {
    setPets(prev => prev.filter(p => p.id !== id));
    setSelectedPetForDetail(null);
    toast.success('ลบข้อมูลสัตว์เลี้ยงเรียบร้อยแล้วค่ะ');
  };

  const handleStartEditPet = (pet: Pet) => {
    setPetToEdit(pet);
    setIsPetFormOpen(true);
  };

  const handleUpdatePreferences = (prefs: { id: string; label: string; value: string; }[]) => {
    if (selectedPetForDetail) {
      const updatedPet = { ...selectedPetForDetail, customPreferences: prefs };
      setPets(prev => prev.map(p => p.id === updatedPet.id ? updatedPet : p));
      setSelectedPetForDetail(updatedPet);
      toast.success('บันทึกความชอบส่วนตัวแล้วค่ะ');
    }
  };

  const sortedPets = [...pets].sort((a, b) => {
    if (a.isFavorite === b.isFavorite) {
      return a.name.localeCompare(b.name, 'th');
    }
    return a.isFavorite ? -1 : 1;
  });

  return (
    <div className="w-full min-h-screen max-w-lg mx-auto bg-[#FFF9F0] relative shadow-2xl flex flex-col font-['Prompt']">
      <header className="px-6 pt-[calc(1rem+env(safe-area-inset-top))] pb-6 flex justify-between items-center shrink-0">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-800">สวัสดี, คุณ{ownerProfile.firstName}!</h1>
            <motion.div animate={{ rotate: [0, 20, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
              <PawPrint className="text-pink-400" size={24} fill="currentColor" />
            </motion.div>
          </div>
          <p className="text-slate-500 text-sm">วันนี้พาน้องๆ ไปสปากันเถอะ ✨</p>
        </div>
        <motion.div whileTap={{ scale: 0.9 }} onClick={() => setIsProfileEditing(true)} className="w-16 h-16 rounded-full border-[3px] border-white shadow-lg overflow-hidden bg-pink-100 cursor-pointer">
          <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Sara" alt="Profile" className="w-full h-full object-cover" />
        </motion.div>
      </header>

      <main className="px-6 flex-1 pb-[calc(7rem+env(safe-area-inset-bottom))]">
        <AnimatePresence mode="wait">
          {activeTab === 'home' && (
            <motion.div key="home" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
              <MembershipCard totalAccumulatedPoints={totalAccumulatedPoints} redeemablePoints={redeemablePoints} ownerProfile={ownerProfile} onShowQR={() => setIsQRCodeOpen(true)} />
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
              <MembershipLevels totalAccumulatedPoints={totalAccumulatedPoints} redeemablePoints={redeemablePoints} />
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
                  onToggleFavorite={() => handleToggleFavorite(selectedPetForDetail.id)} 
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
                <ServiceHistory historyData={serviceHistory} filterPetName={selectedPetName} onClearFilter={() => setSelectedPetName(null)} onServiceClick={(s) => setSelectedServiceForDetail(s)} />
              )}
            </motion.div>
          )}

          {activeTab === 'promo' && (
            <motion.div key="promo-tab" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <Promotions 
                userPoints={redeemablePoints}
                collectedCoupons={collectedCoupons}
                usedOrExpiredCoupons={usedOrExpiredCoupons}
                onRedeemCoupon={handleRedeemCoupon}
                onUseCoupon={handleUseCoupon}
                collectedSpecialPromos={collectedSpecialPromos}
                onCollectSpecialPromotion={handleCollectSpecialPromotion}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <UserProfileEdit isOpen={isProfileEditing} onClose={() => setIsProfileEditing(false)} profile={ownerProfile} onSave={(updated) => setOwnerProfile(updated)} />
      <QRCodeModal isOpen={isQRCodeOpen} onClose={() => setIsQRCodeOpen(false)} ownerName={ownerProfile.firstName} memberId={ownerProfile.phone} />
      <CouponUseModal isOpen={isCouponModalOpen} onClose={() => { setIsCouponModalOpen(false); setSelectedCouponToUse(null); }} coupon={selectedCouponToUse} onConfirmUse={handleConfirmCouponUse} />
      <PetForm 
        isOpen={isPetFormOpen} 
        onClose={() => { setIsPetFormOpen(false); setPetToEdit(null); }} 
        onSave={handleSavePet} 
        initialData={petToEdit} 
      />
      
      {selectedPetForDetail && (
        <PetPreferenceForm
          isOpen={isPreferenceFormOpen}
          onClose={() => setIsPreferenceFormOpen(false)}
          onSave={handleUpdatePreferences}
          initialData={selectedPetForDetail.customPreferences || []}
          petName={selectedPetForDetail.name}
        />
      )}

      {/* Floating Navigation Menu with updated bottom position and soft shadow */}
      <nav className="fixed bottom-[calc(0.75rem+env(safe-area-inset-bottom))] left-6 right-6 max-w-[calc(theme(maxWidth.lg)-3rem)] mx-auto bg-white/40 backdrop-blur-xl px-4 py-3 flex justify-between items-center rounded-full shadow-[0_10px_25px_-5px_rgba(0,0,0,0.1),0_8px_10px_-6px_rgba(0,0,0,0.1)] z-50 border border-white/60">
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
  <button onClick={onClick} className="relative flex items-center justify-center w-12 h-12 group">
    {active && <motion.div layoutId="activeNavBg" className="absolute inset-0 bg-gradient-to-b from-[#FFA14A] to-[#FF4B91] rounded-full shadow-lg" transition={{ type: "spring", bounce: 0.2, duration: 0.6 }} />}
    <div className={`relative z-10 ${active ? 'text-white' : 'text-slate-600'}`}>{icon}</div>
  </button>
);

export default Index;