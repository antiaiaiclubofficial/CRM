"use client";

import React, { useState } from 'react';
import MembershipCard from '@/components/MembershipCard';
import PetList from '@/components/PetList';
import PetManagement from '@/components/PetManagement';
import ServiceHistory from '@/components/ServiceHistory';
import Promotions from '@/components/Promotions';
import UpcomingAppointments from '@/components/UpcomingAppointments';
import UserProfileEdit from '@/components/UserProfileEdit';
import MembershipLevels from '@/components/MembershipLevels'; // Import the new component
import { Home, Award, PawPrint, Megaphone, Calendar, Gift, Bell, History } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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

  const [pets, setPets] = useState([
    { 
      id: 1, 
      name: 'น้องปุย', 
      type: 'สุนัข',
      breed: 'Pomeranian', 
      age: '3',
      gender: 'เมีย',
      weight: '3.5',
      medicalCondition: 'ภูมิแพ้ผิวหนัง',
      precautions: 'ห้ามใช้แชมพูสูตรเย็น',
      color: 'bg-orange-100', 
      icon: '🐶' 
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
      icon: '🐱' 
    },
  ]);

  const handleAddPet = (newPet: any) => {
    const id = pets.length > 0 ? Math.max(...pets.map(p => p.id)) + 1 : 1;
    setPets([...pets, { ...newPet, id }]);
  };

  const handleEditPet = (id: number, updatedData: any) => {
    setPets(pets.map(p => p.id === id ? { ...p, ...updatedData } : p));
  };

  const handleDeletePet = (id: number) => {
    setPets(pets.filter(p => p.id !== id));
  };

  const handlePetSelection = (name: string) => {
    setSelectedPetName(name);
    setActiveTab('history');
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
              <MembershipCard />

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
                onPetClick={handlePetSelection}
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

          {activeTab === 'level' && ( // New tab for MembershipLevels
            <motion.div
              key="level-tab"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <MembershipLevels />
            </motion.div>
          )}

          {activeTab === 'pets' && (
            <motion.div
              key="pets-tab"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <PetManagement 
                pets={pets} 
                onAdd={handleAddPet} 
                onEdit={handleEditPet} 
                onDelete={handleDeletePet} 
              />
            </motion.div>
          )}

          {activeTab === 'history' && (
            <motion.div
              key="history-tab"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <ServiceHistory 
                filterPetName={selectedPetName} 
                onClearFilter={() => setSelectedPetName(null)}
              />
            </motion.div>
          )}

          {activeTab === 'promo' && (
            <motion.div
              key="promo-tab"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Promotions />
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
              <p className="text-sm text-slate-500">ส่วนของ "{activeTab}" กำลังจะมาเร็วๆ นี้</p>
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

      {/* Bottom Navigation Bar */}
      <nav className="absolute bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-slate-100 px-6 py-4 flex justify-between items-center rounded-t-[2.5rem] shadow-[0_-10px_25px_-5px_rgba(0,0,0,0.05)] z-50">
        <NavButton 
          active={activeTab === 'home'} 
          icon={<Home size={22} />} 
          label="หน้าแรก" 
          onClick={() => { setActiveTab('home'); setSelectedPetName(null); }} 
        />
        <NavButton 
          active={activeTab === 'level'} 
          icon={<Award size={22} />} 
          label="ระดับสมาชิก" 
          onClick={() => setActiveTab('level')} 
        />
        <NavButton 
          active={activeTab === 'pets'} 
          icon={<PawPrint size={22} />} 
          label="สัตว์เลี้ยง" 
          onClick={() => setActiveTab('pets')} 
        />
        <NavButton 
          active={activeTab === 'history'} 
          icon={<History size={22} />} 
          label="ประวัติ" 
          onClick={() => setActiveTab('history')} 
        />
        <NavButton 
          active={activeTab === 'promo'} 
          icon={<Megaphone size={22} />} 
          label="โปรโมชั่น" 
          onClick={() => setActiveTab('promo')} 
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