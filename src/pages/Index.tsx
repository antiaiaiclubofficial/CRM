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
import PetPreferenceForm from '@/components/PetPreferenceForm'; // Import new component
import { Home, Award, PawPrint, Megaphone, Calendar, Gift, Bell, History, Scissors, Sparkles, Bath } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import PetManagement from '@/components/PetManagement';
import { toast } from 'sonner';

// Define the Pet interface here for consistency across components
interface Pet {
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
  furLength?: string; // New field for fur length
  customPreferences?: { id: string; label: string; value: string; }[];
}

// Define the Coupon interface here as well, or import it if it were in a shared file
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

// Define ServiceHistoryItem interface for consistency
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
      name: 'น้องปุย', 
      type: 'สุนัข',
      breed: 'Pomeranian', 
      age: '3',
      gender: 'เมีย',
      weight: '3.5',
      medicalCondition: 'ภูมิแพ้ผิวหนัง',
      precautions: 'ห้ามใช้แชมพูสูตรอ่อนโยนพิเศษ',
      color: 'bg-orange-100', 
      icon: '🐶',
      furLength: 'ขนสั้น', // Example fur length
      customPreferences: [
        { id: 'pref1', label: 'แชมพูที่ชอบ', value: 'กลิ่นลาเวนเดอร์' },
        { id: 'pref2', label: 'สปาที่ชอบ', value: 'สปาโคลนเดดซี' },
        { id: 'pref3', label: 'อาหารที่ชอบ', value: 'อาหารเม็ดสูตรลดน้ำหนัก' },
        { id: 'pref4', label: 'สไตล์การตัดขน', value: 'ตัดขนสั้นแบบเท็ดดี้แบร์' }
      ]
    },
    { 
      id: 2, 
      name: 'น้องกะทิ', 
      type: 'แมว',
      breed: 'Persian Cat', 
      age: '2',
      gender: 'ผู้',
      weight: '4.2',
      medicalCondition: '-',
      precautions: 'ขี้ตื่นง่าย ระวังตอนตัดเล็บ',
      color: 'bg-blue-100', 
      icon: '🐱',
      furLength: 'ขนยาว', // Example fur length
      customPreferences: [] // Empty for adding
    },
  ]);

  const [serviceHistory, setServiceHistory] = useState<ServiceHistoryItem[]>([
    {
      id: 1,
      date: '15 พ.ค. 2567',
      petName: 'น้องปุย',
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
      petName: 'น้องกะทิ',
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
      petName: 'น้องปุย',
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

  // State for PetForm modal
  const [isPetFormOpen, setIsPetFormOpen] = useState(false);
  const [petToEdit, setPetToEdit] = useState<Pet | null>(null);
  const [selectedPetForDetail, setSelectedPetForDetail] = useState<Pet | null>(null);
  const [selectedServiceForDetail, setSelectedServiceForDetail] = useState<ServiceHistoryItem | null>(null);

  // New state for PetPreferenceForm modal
  const [isPreferenceFormOpen, setIsPreferenceFormOpen] = useState(false);

  const handleAddPet = (newPetData: Omit<Pet, 'id'>) => {
    const id = pets.length > 0 ? Math.max(...pets.map(p => p.id)) + 1 : 1;
    setPets([...pets, { ...newPetData, id, customPreferences: [] }]); // Initialize customPreferences for new pets
  };

  const handleEditPet = (updatedPet: Pet) => {
    setPets(pets.map(p => p.id === updatedPet.id ? updatedPet : p));
    setSelectedPetForDetail(updatedPet); // Update detail view if currently open
  };

  const handleDeletePet = (id: number) => {
    setPets(pets.filter(p => p.id !== id));
    setSelectedPetForDetail(null); // Close detail view if deleted
  };

  const handlePetSelection = (pet: Pet) => { // Changed to accept full pet object
    setSelectedPetForDetail(pet); // Set the selected pet for detail view
    setActiveTab('pets'); // Change to the 'pets' tab
    setSelectedPetName(null); // Clear any history filter
    setSelectedServiceForDetail(null); // Clear any service detail
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

  // Handlers for PetForm
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

  // Handlers for PetDetailView
  const handleViewPetDetails = (pet: Pet) => {
    setSelectedPetForDetail(pet);
  };

  const handleBackFromPetDetail = () => {
    setSelectedPetForDetail(null);
  };

  // Handlers for ServiceHistoryDetail
  const handleViewServiceDetail = (service: ServiceHistoryItem) => {
    setSelectedServiceForDetail(service);
  };

  const handleBackFromServiceDetail = () => {
    setSelectedServiceForDetail(null);
  };

  // Calculate total service cost for a specific pet
  const calculateTotalServiceCost = (petName: string): number => {
    return serviceHistory
      .filter(item => item.petName === petName)
      .reduce((sum, item) => sum + parseFloat(item.price), 0);
  };

  // Handle viewing service history for a specific pet
  const handleViewPetServiceHistory = (petName: string) => {
    setSelectedPetName(petName);
    setSelectedServiceForDetail(null);
    setActiveTab('history');
  };

  // Handlers for PetPreferenceForm
  const handleOpenPreferenceForm = () => {
    setIsPreferenceFormOpen(true);
  };

  const handleClosePreferenceForm = () => {
    setIsPreferenceFormOpen(false);
  };

  const handleSavePetPreferences = (updatedPreferences: { id: string; label: string; value: string; }[]) => {
    if (selectedPetForDetail) {
      const updatedPet = { ...selectedPetForDetail, customPreferences: updatedPreferences };
      handleEditPet(updatedPet); // Use existing handleEditPet to update the pet in state
      toast.success('บันทึกความชอบส่วนตัวสำเร็จ!');
    }
  };

  return (
    <div className="max-w-[390px] min-h-[844px] mx-auto bg-[#FFF9F0] relative shadow-2xl overflow-hidden flex flex-col font-['Prompt']">
      
      {/* Header Section */}
      <header className="px-6 pt-10 pb-6 flex justify-between items-center">
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

      {/* Main Content Area */}
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
                pets={pets} 
                onPetClick={handlePetSelection} // Updated to use handlePetSelection
              />

              <div className="bg-[#FFE3BC]/40 p-5 rounded-[2rem] border border-[#FFE3BC] flex items-center gap-4">
                <div className="p-3 bg-white rounded-2xl shadow-sm">
                  <Megaphone className="text-amber-500" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-800">โปรโมชั่นประจำเดือน!</h4>
                  <p className="text-xs text-slate-600">ลด 20% สำหรับบริการสปาหินร้อน</p>
                </div>
              </div>
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
                  onEditPreferences={handleOpenPreferenceForm} // New prop
                />
              ) : (
                <PetManagement 
                  pets={pets} 
                  onAddPet={handleOpenAddPetForm}
                  onViewDetails={handleViewPetDetails}
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

          {(activeTab !== 'home' && activeTab !== 'pets' && activeTab !== 'history' && activeTab !== 'promo' && activeTab !== 'level') && (
            <motion.div
              key="other"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center h-[400px] text-center"
            >
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4 text-slate-400">
                <Bell size={40} />
              </div>
              <h3 className="font-bold text-slate-800">กำลังเตรียมข้อมูล...</h3>
              <p className="text-sm text-slate-500">ส่วนของ "{activeTab}" กำงจะมาเร็วๆ นี้</p>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Profile Edit Drawer */}
      <UserProfileEdit 
        isOpen={isProfileEditing} 
        onClose={() => setIsProfileEditing(false)} 
        profile={ownerProfile}
        onSave={(updated) => setOwnerProfile(updated)}
      />

      {/* Pet Add/Edit Form Modal */}
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

      {/* Pet Preference Form Modal */}
      {selectedPetForDetail && (
        <PetPreferenceForm
          isOpen={isPreferenceFormOpen}
          onClose={handleClosePreferenceForm}
          onSave={handleSavePetPreferences}
          initialData={selectedPetForDetail.customPreferences || []} // Pass customPreferences array
          petName={selectedPetForDetail.name}
        />
      )}

      {/* Bottom Navigation Bar */}
      <nav className="absolute bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-slate-100 px-6 py-4 flex justify-between items-center rounded-t-[2.5rem] shadow-[0_-10px_25px_-5px_rgba(0,0,0,0.05)] z-50">
        <NavButton 
          active={activeTab === 'home'} 
          icon={<Home size={22} />} 
          label="หน้าแรก" 
          onClick={() => { setActiveTab('home'); setSelectedPetName(null); setSelectedPetForDetail(null); setSelectedServiceForDetail(null); }} 
        />
        <NavButton 
          active={activeTab === 'level'} 
          icon={<Award size={22} />} 
          label="ระดับสมาชิก" 
          onClick={() => { setActiveTab('level'); setSelectedPetForDetail(null); setSelectedServiceForDetail(null); }} 
        />
        <NavButton 
          active={activeTab === 'pets'} 
          icon={<PawPrint size={22} />} 
          label="สัตว์เลี้ยง" 
          onClick={() => { setActiveTab('pets'); setSelectedPetForDetail(null); setSelectedServiceForDetail(null); }} 
        />
        <NavButton 
          active={activeTab === 'promo'}
          icon={<Megaphone size={22} />} 
          label="โปรโมชั่น" 
          onClick={() => { setActiveTab('promo'); setSelectedPetForDetail(null); setSelectedServiceForDetail(null); }} 
        />
        <NavButton 
          active={activeTab === 'history'}
          icon={<History size={22} />} 
          label="ประวัติ" 
          onClick={() => { setActiveTab('history'); setSelectedPetForDetail(null); setSelectedServiceForDetail(null); }} 
        />
      </nav>
    </div>
  );
};

interface NavButtonProps {
  active: boolean;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}

const NavButton = ({ active, icon, label, onClick }: NavButtonProps) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center gap-1 transition-all duration-300 ${active ? 'text-pink-500 scale-110' : 'text-slate-400'}`}
  >
    <div className={active ? 'drop-shadow-sm' : ''}>
      {icon}
    </div>
    <span className={`text-[10px] font-medium ${active ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'}`}>
      {label}
    </span>
    {active && (
      <motion.div 
        layoutId="activeTab" 
        className="w-1 h-1 bg-pink-500 rounded-full mt-0.5" 
      />
    )}
  </button>
);

export default Index;