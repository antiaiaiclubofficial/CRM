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
import MyCouponsHomePreview from '@/components/MyCouponsHomePreview'; // New import
import { Home, Award, PawPrint, Megaphone, Calendar, Gift, Bell, History, Scissors, Sparkles, Bath, X, LayoutGrid } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

// Define the Pet interface here for consistency across components
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
  const [usedSpecialPromotions, setUsedSpecialPromotions] = useState<number[]>([]);

  const [pets, setPets] = useState<Pet[]>([
    { 
      id: 1, 
      name: 'Abyssinian Cats', 
      type: 'แมว', 
      breed: 'Abyssinian', 
      age: '3',
      gender: 'เมีย', 
      weight: '3.5', 
      medicalCondition: 'ภูมิแพ้ผิวหนัง',
      precautions: 'ห้ามใช้แชมพูสูตรอ่อนโยนพิเศษ',
      color: 'bg-orange-100', 
      icon: '🐶',
      furLength: 'ขนสั้น',
      customPreferences: [
        { id: 'pref1', label: 'แชมพูที่ชอบ', value: 'กลิ่นลาเวนเดอร์' },
        { id: 'pref2', label: 'สปาที่ชอบ', value: 'สปาโคลนเดดซี' },
        { id: 'pref3', label: 'อาหารที่ชอบ', value: 'อาหารเม็ดสูตรลดน้ำหนัก' },
        { id: 'pref4', label: 'สไตล์การตัดขน', value: 'ตัดขนสั้นแบบเท็ดดี้แบร์' }
      ],
      imageUrl: 'https://images.unsplash.com/photo-1574144702728-1ab0e5759688?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      cardBgColor: '#FFF9C4',
      isFavorite: false,
    },
    { 
      id: 2, 
      name: 'Persian', 
      type: 'แมว',
      breed: 'Persian Cat', 
      age: '2',
      gender: 'ผู้', 
      weight: '4.2', 
      medicalCondition: '-',
      precautions: 'ขี้ตื่นง่าย ระวังตอนตัดเล็บ',
      color: 'bg-blue-100', 
      icon: '🐱',
      furLength: 'ขนยาว',
      customPreferences: [],
      imageUrl: 'https://images.unsplash.com/photo-1596854307913-a029b7371c95?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      cardBgColor: '#FFCDD2',
      isFavorite: true,
    },
    {
      id: 3,
      name: 'Gray Tabby',
      type: 'แมว',
      breed: 'Tabby',
      age: '1',
      gender: 'เมีย', 
      weight: '3.0', 
      medicalCondition: '-',
      precautions: '-',
      color: 'bg-gray-100',
      icon: '🐱',
      furLength: 'ขนสั้น',
      customPreferences: [],
      imageUrl: 'https://images.unsplash.com/photo-1514813482567-bf37b7610a88?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      cardBgColor: '#BBDEFB',
      isFavorite: false,
    },
    {
      id: 4,
      name: 'Scottish Fold',
      type: 'แมว',
      breed: 'Scottish Fold',
      age: '4',
      gender: 'ผู้', 
      weight: '5.0', 
      medicalCondition: '-',
      precautions: 'ชอบเล่นน้ำ',
      color: 'bg-green-100',
      icon: '🐱',
      furLength: 'ขนสั้น',
      customPreferences: [],
      imageUrl: 'https://images.unsplash.com/photo-1577023311546-cdc07a8454d9?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      cardBgColor: '#C8E6C9',
      isFavorite: false,
    },
    {
      id: 5,
      name: 'Japanese Bobtail',
      type: 'แมว',
      breed: 'Japanese Bobtail',
      age: '2',
      gender: 'เมีย', 
      weight: '3.8', 
      medicalCondition: '-',
      precautions: '-',
      color: 'bg-yellow-100',
      icon: '🐱',
      furLength: 'ขนสั้น',
      customPreferences: [],
      imageUrl: 'https://images.unsplash.com/photo-1548247771-f0016775d077?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      cardBgColor: '#DCEDC8',
      isFavorite: false,
    },
    {
      id: 6,
      name: 'Norwegian Forest',
      type: 'แมว',
      breed: 'Norwegian Forest Cat',
      age: '5',
      gender: 'ผู้', 
      weight: '6.5', 
      medicalCondition: '-',
      precautions: 'ขนยาว ต้องการการแปรงขนบ่อย',
      color: 'bg-purple-100',
      icon: '🐱',
      furLength: 'ขนยาว',
      customPreferences: [],
      imageUrl: 'https://images.unsplash.com/photo-1543852786-1cf6624b9987?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      cardBgColor: '#E1BEE7',
      isFavorite: false,
    },
  ]);

  const sortedPets = [...pets].sort((a, b) => {
    if (a.isFavorite && !b.isFavorite) return -1;
    if (!a.isFavorite && b.isFavorite) return 1;
    return a.name.localeCompare(b.name);
  });

  const [serviceHistory, setServiceHistory] = useState<ServiceHistoryItem[]>([
    {
      id: 1,
      date: '15 พ.ค. 2567',
      petName: 'Abyssinian Cats',
      service: 'อาบน้ำตัดขน Full Service',
      price: '550',
      icon: <Scissors className="text-pink-500" />,
      bg: 'bg-pink-50',
      description: 'บริการอาบน้ำและตัดขนครบวงจรสำหรับน้องปุย รวมถึงการแปรงขน กำจัดขนที่หลุดร่วง และตัดแต่งทรงขนตามต้องการ',
      notes: 'น้องปุยมีผิวแพ้ง่าย ใช้แชมพูสูตรอ่อนโยนพิเศษ',
      shampooUsed: 'แชมพูสูตรอ่อนโยนสำหรับผิวแพ้ง่าย (Hypoallergenic Shampoo)',
      spaTreatment: 'ไม่มี',
      groomerNotes: 'น้องปุยให้ความร่วมมือดีมาก ขนสะอาดและนุ่มสลวย',
      beforeAfterImages: [
        { before: 'https://via.placeholder.com/150/FFD8E4/000000?text=Before+Pui', after: 'https://via.placeholder.com/150/B2F2BB/000000?text=After+Pui' }
      ]
    },
    {
      id: 2,
      date: '02 พ.ค. 2567',
      petName: 'Persian',
      service: 'สปาโอโซนและนวดผ่อนคลาย',
      price: '890',
      icon: <Sparkles className="text-amber-500" />,
      bg: 'bg-amber-50',
      description: 'สปาโอโซนช่วยบำรุงผิวหนังและเส้นขนของน้องกะทิให้แข็งแรง พร้อมนวดผ่อนคลายลดความเครียด',
      notes: 'น้องกะทิขี้ตื่นง่าย ควรทำในห้องที่เงียบสงบ',
      shampooUsed: 'แชมพูบำรุงขนสำหรับแมวขนยาว (Long Hair Cat Shampoo)',
      spaTreatment: 'สปาโอโซนบำรุงผิวและขน',
      groomerNotes: 'น้องกะทิผ่อนคลายดีหลังจากการนวด ขนเงางามขึ้น',
      beforeAfterImages: [
        { before: 'https://via.placeholder.com/150/FFE3BC/000000?text=Before+Kati', after: 'https://via.placeholder.com/150/FFD8E4/000000?text=After+Kati' }
      ]
    },
    {
      id: 3,
      date: '20 เม.ย. 2567',
      petName: 'Abyssinian Cats',
      service: 'อาบน้ำกำจัดเห็บหมัด',
      price: '350',
      icon: <Bath className="text-blue-500" />,
      bg: 'bg-blue-50',
      description: 'บริการอาบน้ำด้วยแชมพูกำจัดเห็บหมัดประสิทธิภาพสูง เพื่อสุขอนามัยที่ดีของน้องปุย',
      notes: 'ตรวจสอบให้แน่ใจว่าไม่มีเห็บหมัดหลงเหลืออยู่',
      shampooUsed: 'แชมพูกำจัดเห็บหมัด (Flea & Tick Shampoo)',
      spaTreatment: 'ไม่มี',
      groomerNotes: 'พบเห็บหมัดเล็กน้อยบริเวณคอ ได้ทำการกำจัดออกทั้งหมดแล้ว',
      beforeAfterImages: [
        { before: 'https://via.placeholder.com/150/FFD8E4/000000?text=Before+Pui', after: 'https://via.placeholder.com/150/B2F2BB/000000?text=After+Pui' }
      ]
    }
  ]);

  const [isPetFormOpen, setIsPetFormOpen] = useState(false);
  const [petToEdit, setPetToEdit] = useState<Pet | null>(null);
  const [selectedPetForDetail, setSelectedPetForDetail] = useState<Pet | null>(null);
  const [selectedServiceForDetail, setSelectedServiceForDetail] = useState<ServiceHistoryItem | null>(null);
  const [isPreferenceFormOpen, setIsPreferenceFormOpen] = useState(false);

  const handleAddPet = (newPetData: Omit<Pet, 'id'>) => {
    const id = pets.length > 0 ? Math.max(...pets.map(p => p.id)) + 1 : 1;
    const defaultCardBgColors = ['#FFF9C4', '#FFCDD2', '#BBDEFB', '#C8E6C9', '#DCEDC8', '#E1BEE7'];
    const randomColor = defaultCardBgColors[Math.floor(Math.random() * defaultCardBgColors.length)];
    setPets([...pets, { 
      ...newPetData, 
      id, 
      imageUrl: newPetData.imageUrl || 'https://images.unsplash.com/photo-1514813482567-bf37b7610a88?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      weight: newPetData.weight || '0',
      gender: newPetData.gender || 'ไม่ระบุ',
      cardBgColor: newPetData.cardBgColor || randomColor,
      isFavorite: false,
    }]);
  };

  const handleEditPet = (updatedPet: Pet) => {
    setPets(pets.map(p => p.id === updatedPet.id ? updatedPet : p));
    if (selectedPetForDetail?.id === updatedPet.id) {
      setSelectedPetForDetail(updatedPet);
    }
  };

  const handleToggleFavorite = (petId: number) => {
    const updatedPets = pets.map(p => 
      p.id === petId ? { ...p, isFavorite: !p.isFavorite } : p
    );
    setPets(updatedPets);
    
    if (selectedPetForDetail?.id === petId) {
      setSelectedPetForDetail({ ...selectedPetForDetail, isFavorite: !selectedPetForDetail.isFavorite });
    }
    
    const pet = updatedPets.find(p => p.id === petId);
    if (pet?.isFavorite) {
      toast.success(`เพิ่ม ${pet.name} เป็นตัวโปรดแล้ว!`);
    }
  };

  const handleDeletePet = (id: number) => {
    setPets(pets.filter(p => p.id !== id));
    setSelectedPetForDetail(null);
  };

  const handlePetSelection = (pet: Pet) => {
    setSelectedPetForDetail(pet);
    setActiveTab('pets');
    setSelectedPetName(null);
    setSelectedServiceForDetail(null);
  };

  const handleRedeemCoupon = (coupon: Coupon, pointsCost: number) => {
    if (redeemablePoints >= pointsCost) {
      setRedeemablePoints(prev => prev - pointsCost);
      setCollectedCoupons((prev) => [...prev, coupon]);
      toast.success(`แลกคูปอง "${coupon.title}" สำเร็จ! ใช้ไป ${pointsCost} คะแนน`);
    } else {
      toast.error('คะแนนไม่พอสำหรับแลกคูปองนี้ค่ะ');
    }
  };

  const handleUseCoupon = (couponId: number) => {
    const couponToUse = collectedCoupons.find(c => c.id === couponId);
    if (couponToUse) {
      setCollectedCoupons(prev => prev.filter(c => c.id !== couponId));
      setUsedOrExpiredCoupons(prev => [...prev, { ...couponToUse, usedDate: new Date().toLocaleDateString('th-TH') }]);
      toast.success(`ใช้คูปอง "${couponToUse.title}" สำเร็จแล้วค่ะ!`);
    }
  };

  const handleUseSpecialPromotion = (promoId: number) => {
    if (!usedSpecialPromotions.includes(promoId)) {
      setUsedSpecialPromotions(prev => [...prev, promoId]);
      toast.success('ใช้โปรโมชั่นพิเศษสำเร็จแล้วค่ะ!');
    }
  };

  const handleOpenAddPetForm = () => {
    setPetToEdit(null);
    setIsPetFormOpen(true);
  };

  const handleOpenEditPetForm = (pet: Pet) => {
    setPetToEdit(pet);
    setIsPetFormOpen(true);
  };

  const handleClosePetForm = () => {
    setIsPetFormOpen(false);
    setPetToEdit(null);
  };

  const handleViewPetDetails = (pet: Pet) => {
    setSelectedPetForDetail(pet);
  };

  const handleBackFromPetDetail = () => {
    setSelectedPetForDetail(null);
  };

  const handleViewServiceDetail = (service: ServiceHistoryItem) => {
    setSelectedServiceForDetail(service);
  };

  const handleBackFromServiceDetail = () => {
    setSelectedServiceForDetail(null);
  };

  const calculateTotalServiceCost = (petName: string): number => {
    return serviceHistory
      .filter(item => item.petName === petName)
      .reduce((sum, item) => sum + parseFloat(item.price), 0);
  };

  const handleViewPetServiceHistory = (petName: string) => {
    setSelectedPetName(petName);
    setSelectedServiceForDetail(null);
    setActiveTab('history');
  };

  const handleOpenPreferenceForm = () => {
    setIsPreferenceFormOpen(true);
  };

  const handleClosePreferenceForm = () => {
    setIsPreferenceFormOpen(false);
  };

  const handleSavePetPreferences = (updatedPreferences: { id: string; label: string; value: string; }[]) => {
    if (selectedPetForDetail) {
      const updatedPet = { ...selectedPetForDetail, customPreferences: updatedPreferences };
      handleEditPet(updatedPet);
      toast.success('บันทึกความชอบส่วนตัวสำเร็จ!');
    }
  };

  return (
    <div className="max-w-[390px] h-[844px] mx-auto bg-[#FFF9F0] relative shadow-2xl overflow-hidden flex flex-col font-['Prompt']">
      
      <header className="px-6 pt-10 pb-6 flex justify-between items-center shrink-0">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-800">สวัสดี, คุณ{ownerProfile.firstName}!</h1>
            <motion.div
              animate={{ rotate: [0, 20, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              <PawPrint className="text-pink-400" size={24} fill="currentColor" />
            </motion.div>
          </div>
          <p className="text-slate-500 text-sm">วันนี้พาน้องๆ ไปสปากันเถอะ ✨</p>
        </div>
        <div className="relative">
          <motion.div 
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsProfileEditing(true)}
            className="w-16 h-16 rounded-full border-[3px] border-white shadow-lg overflow-hidden bg-pink-100 cursor-pointer"
          >
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Sara" alt="Profile" className="w-full h-full object-cover" />
          </motion.div>
          <div className="absolute top-0 right-0 w-5 h-5 bg-red-500 rounded-full border-2 border-white flex items-center justify-center shadow-sm">
            <span className="text-[10px] text-white font-bold">2</span>
          </div>
        </div>
      </header>

      <main className="px-6 flex-1 overflow-y-auto no-scrollbar pb-32">
        <AnimatePresence mode="wait">
          {activeTab === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <MembershipCard 
                totalAccumulatedPoints={totalAccumulatedPoints} 
                redeemablePoints={redeemablePoints} 
                ownerProfile={ownerProfile}
                onShowQR={() => setIsQRCodeOpen(true)}
              />

              <UpcomingAppointments />

              <div className="grid grid-cols-2 gap-4">
                <button className="bg-white p-4 rounded-3xl shadow-sm border border-slate-50 flex flex-col items-center gap-2 group active:scale-95 transition-all">
                  <div className="w-12 h-12 bg-[#B2F2BB]/30 rounded-2xl flex items-center justify-center">
                    <Calendar className="text-emerald-500" />
                  </div>
                  <span className="font-bold text-sm text-slate-700">จองคิวอาบน้ำ</span>
                </button>
                <button 
                  onClick={() => setActiveTab('promo')}
                  className="bg-white p-4 rounded-3xl shadow-sm border border-slate-50 flex flex-col items-center gap-2 group active:scale-95 transition-all"
                >
                  <div className="w-12 h-12 bg-[#FFD8E4]/30 rounded-2xl flex items-center justify-center">
                    <Megaphone className="text-pink-500" />
                  </div>
                  <span className="font-bold text-sm text-slate-700">โปรโมชั่น</span>
                </button>
              </div>

              <PetList 
                pets={sortedPets} 
                onPetClick={handlePetSelection}
              />

              {/* Replaced monthly promotion banner with My Coupons preview */}
              <MyCouponsHomePreview 
                coupons={collectedCoupons}
                onViewAll={() => setActiveTab('promo')}
              />
            </motion.div>
          )}

          {activeTab === 'level' && (
            <motion.div
              key="level-tab"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <MembershipLevels 
                totalAccumulatedPoints={totalAccumulatedPoints} 
                redeemablePoints={redeemablePoints} 
              />
            </motion.div>
          )}

          {activeTab === 'pets' && (
            <motion.div
              key="pets-tab"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              {selectedPetForDetail ? (
                <PetDetailView 
                  pet={selectedPetForDetail}
                  onBack={handleBackFromPetDetail}
                  onStartEdit={handleOpenEditPetForm}
                  onDeletePet={handleDeletePet}
                  totalServiceCost={calculateTotalServiceCost(selectedPetForDetail.name)}
                  onViewServiceHistoryForPet={handleViewPetServiceHistory}
                  onEditPreferences={handleOpenPreferenceForm}
                  onToggleFavorite={() => handleToggleFavorite(selectedPetForDetail.id)}
                />
              ) : (
                <PetManagement 
                  pets={sortedPets} 
                  onBack={() => setActiveTab('home')}
                  onViewDetails={handleViewPetDetails}
                  onAddPet={handleOpenAddPetForm}
                />
              )}
            </motion.div>
          )}

          {activeTab === 'history' && (
            <motion.div
              key="history-tab"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              {selectedServiceForDetail ? (
                <ServiceHistoryDetail 
                  service={selectedServiceForDetail} 
                  onBack={handleBackFromServiceDetail} 
                />
              ) : (
                <ServiceHistory 
                  historyData={serviceHistory}
                  filterPetName={selectedPetName} 
                  onClearFilter={() => setSelectedPetName(null)}
                  onServiceClick={handleViewServiceDetail}
                />
              )}
            </motion.div>
          )}

          {activeTab === 'promo' && (
            <motion.div
              key="promo-tab"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Promotions 
                userPoints={redeemablePoints}
                collectedCoupons={collectedCoupons}
                usedOrExpiredCoupons={usedOrExpiredCoupons}
                onRedeemCoupon={handleRedeemCoupon}
                onUseCoupon={handleUseCoupon}
                usedSpecialPromotions={usedSpecialPromotions}
                onUseSpecialPromotion={handleUseSpecialPromotion}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <UserProfileEdit 
        isOpen={isProfileEditing} 
        onClose={() => setIsProfileEditing(false)} 
        profile={ownerProfile}
        onSave={(updated) => setOwnerProfile(updated)}
      />

      <QRCodeModal 
        isOpen={isQRCodeOpen}
        onClose={() => setIsQRCodeOpen(false)}
        ownerName={ownerProfile.firstName}
        memberId={ownerProfile.phone}
      />

      <PetForm
        isOpen={isPetFormOpen}
        onClose={handleClosePetForm}
        onSave={(data) => {
          if ('id' in data) {
            handleEditPet(data as Pet);
          } else {
            handleAddPet(data);
          }
        }}
        initialData={petToEdit}
      />

      {selectedPetForDetail && (
        <PetPreferenceForm
          isOpen={isPreferenceFormOpen}
          onClose={handleClosePreferenceForm}
          onSave={handleSavePetPreferences}
          initialData={selectedPetForDetail.customPreferences || []}
          petName={selectedPetForDetail.name}
        />
      )}

      <nav className="absolute bottom-8 left-6 right-6 bg-white/30 backdrop-blur-xl px-4 py-3 flex justify-between items-center rounded-full shadow-2xl z-50 border border-white/40">
        <NavButton 
          active={activeTab === 'home'} 
          icon={<Home size={22} />} 
          onClick={() => { setActiveTab('home'); setSelectedPetName(null); setSelectedPetForDetail(null); setSelectedServiceForDetail(null); }} 
        />
        <NavButton 
          active={activeTab === 'level'} 
          icon={<Award size={22} />} 
          onClick={() => { setActiveTab('level'); setSelectedPetForDetail(null); setSelectedServiceForDetail(null); }} 
        />
        <NavButton 
          active={activeTab === 'pets'} 
          icon={<PawPrint size={22} />} 
          onClick={() => { setActiveTab('pets'); setSelectedPetForDetail(null); setSelectedServiceForDetail(null); }} 
        />
        <NavButton 
          active={activeTab === 'promo'}
          icon={<Megaphone size={22} />} 
          onClick={() => { setActiveTab('promo'); setSelectedPetForDetail(null); setSelectedServiceForDetail(null); }} 
        />
        <NavButton 
          active={activeTab === 'history'}
          icon={<History size={22} />} 
          onClick={() => { setActiveTab('history'); setSelectedPetForDetail(null); setSelectedServiceForDetail(null); }} 
        />
      </nav>
    </div>
  );
};

interface NavButtonProps {
  active: boolean;
  icon: React.ReactNode;
  onClick: () => void;
}

const NavButton = ({ active, icon, onClick }: NavButtonProps) => (
  <button 
    onClick={onClick}
    className="relative flex items-center justify-center w-12 h-12 transition-all duration-300 group"
  >
    {active && (
      <motion.div 
        layoutId="activeNavBg"
        className="absolute inset-0 bg-gradient-to-b from-[#FFA14A] to-[#FF4B91] rounded-full shadow-lg shadow-orange-500/20"
        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
      />
    )}
    <div className={`relative z-10 transition-colors duration-300 ${active ? 'text-white' : 'text-slate-600 group-hover:text-slate-800'}`}>
      {icon}
    </div>
  </button>
);

export default Index;