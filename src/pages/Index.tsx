"use client";

import React, { useState } from 'react';
import MembershipCard from '@/components/MembershipCard';
import PetList from '@/components/PetList';
import { Home, Award, PawPrint, Megaphone, Calendar, Gift, Bell, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Index = () => {
  const [activeTab, setActiveTab] = useState('home');

  return (
    <div className="max-w-[390px] min-h-[844px] mx-auto bg-[#FFF9F0] relative shadow-2xl overflow-hidden flex flex-col font-['Prompt']">
      
      {/* Large Header Section */}
      <header className="px-8 pt-12 pb-8 flex justify-between items-start">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-black text-slate-900">สวัสดีจ้า!</h1>
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 1.2 }}
            >
              <PawPrint className="text-pink-500" size={32} fill="currentColor" />
            </motion.div>
          </div>
          <p className="text-slate-600 text-lg font-bold">คุณ <span className="text-pink-600">ซาร่า เจน</span></p>
        </div>
        <div className="relative group">
          <div className="w-16 h-16 rounded-[1.5rem] border-4 border-white shadow-xl overflow-hidden bg-pink-100 ring-2 ring-pink-100">
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Sara" alt="Profile" className="w-full h-full object-cover" />
          </div>
          <div className="absolute -top-2 -right-2 w-7 h-7 bg-red-500 rounded-full border-4 border-[#FFF9F0] flex items-center justify-center">
            <span className="text-xs text-white font-black">2</span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="px-6 flex-1 overflow-y-auto no-scrollbar pb-36">
        
        <AnimatePresence mode="wait">
          {activeTab === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              className="space-y-8"
            >
              {/* Membership Card */}
              <MembershipCard />

              {/* Enhanced Quick Actions Grid */}
              <div className="grid grid-cols-2 gap-5">
                <button className="bg-white p-6 rounded-[2.5rem] shadow-md border-2 border-slate-50 flex flex-col items-center gap-4 group active:scale-90 transition-all">
                  <div className="w-16 h-16 bg-[#B2F2BB]/40 rounded-[1.5rem] flex items-center justify-center shadow-inner">
                    <Calendar className="text-emerald-600" size={32} />
                  </div>
                  <span className="font-black text-base text-slate-800">จองคิว</span>
                </button>
                <button className="bg-white p-6 rounded-[2.5rem] shadow-md border-2 border-slate-50 flex flex-col items-center gap-4 group active:scale-90 transition-all">
                  <div className="w-16 h-16 bg-[#FFD8E4]/40 rounded-[1.5rem] flex items-center justify-center shadow-inner">
                    <Gift className="text-pink-600" size={32} />
                  </div>
                  <span className="font-black text-base text-slate-800">แลกรางวัล</span>
                </button>
              </div>

              {/* My Pets Section */}
              <PetList />

              {/* Bold Promotion Banner */}
              <div className="bg-[#FFE3BC] p-6 rounded-[2.5rem] border-4 border-white shadow-lg flex items-center gap-5">
                <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center shrink-0">
                  <Megaphone className="text-amber-600" size={28} />
                </div>
                <div className="flex-1">
                  <h4 className="font-black text-lg text-slate-900 leading-tight">โปรโมชั่นพิเศษ!</h4>
                  <p className="text-sm font-bold text-slate-700">ลด 20% สปาหินร้อน</p>
                </div>
                <ChevronRight className="text-amber-700" size={24} />
              </div>
            </motion.div>
          )}

          {activeTab !== 'home' && (
            <motion.div
              key="other"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center h-[500px] text-center p-10"
            >
              <div className="w-24 h-24 bg-white rounded-[2rem] shadow-xl flex items-center justify-center mb-6 text-pink-400">
                <Bell size={48} className="animate-bounce" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-2">เร็วๆ นี้จ้า!</h3>
              <p className="text-lg font-bold text-slate-500">ส่วนของ "{activeTab}" กำลังปรับปรุงให้ดียิ่งขึ้น</p>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Large Bottom Navigation Bar */}
      <nav className="absolute bottom-0 left-0 right-0 bg-white border-t-4 border-[#FFF9F0] px-6 py-6 flex justify-between items-center rounded-t-[3rem] shadow-[0_-15px_40px_-10px_rgba(0,0,0,0.1)]">
        <NavButton 
          active={activeTab === 'home'} 
          icon={<Home size={28} />} 
          label="หน้าแรก" 
          onClick={() => setActiveTab('home')} 
        />
        <NavButton 
          active={activeTab === 'level'} 
          icon={<Award size={28} />} 
          label="ระดับ" 
          onClick={() => setActiveTab('level')} 
        />
        <NavButton 
          active={activeTab === 'pets'} 
          icon={<PawPrint size={28} />} 
          label="น้องๆ" 
          onClick={() => setActiveTab('pets')} 
        />
        <NavButton 
          active={activeTab === 'promo'} 
          icon={<Megaphone size={28} />} 
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
    className={`flex flex-col items-center gap-1.5 transition-all duration-300 ${active ? 'text-pink-600 scale-110' : 'text-slate-400'}`}
  >
    <div className={`${active ? 'drop-shadow-[0_4px_8px_rgba(219,39,119,0.3)]' : ''} transition-transform`}>
      {icon}
    </div>
    <span className={`text-xs font-black tracking-tight ${active ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'}`}>
      {label}
    </span>
    {active && (
      <motion.div 
        layoutId="activeTab" 
        className="w-2 h-2 bg-pink-600 rounded-full mt-1 shadow-sm" 
      />
    )}
  </button>
);

export default Index;