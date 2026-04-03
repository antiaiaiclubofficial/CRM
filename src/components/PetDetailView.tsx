"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, Edit2, Share2, Scale, 
  Ruler, Activity, Heart, CheckCircle2, 
  Info, ChevronRight, MoreHorizontal,
  Droplet, Dog, Cat, DollarSign, Sparkles // Added DollarSign and Sparkles
} from 'lucide-react';

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
  shampooPreference?: string; // New field
  spaPreference?: string;     // New field
}

interface PetDetailViewProps {
  pet: Pet;
  onBack: () => void;
  onStartEdit: (pet: Pet) => void;
  onDeletePet: (id: number) => void;
  totalServiceCost: number; // New prop
  onViewServiceHistoryForPet: (petName: string) => void; // New prop
}

const PetDetailView = ({ pet, onBack, onStartEdit, onDeletePet, totalServiceCost, onViewServiceHistoryForPet }: PetDetailViewProps) => {
  // Mock data for the new sections
  const adventures = 323;
  
  // Determine emoji and color based on totalServiceCost
  let costEmoji = '✨';
  let costColor = 'text-slate-500';
  let bgColor = 'bg-slate-100';

  if (totalServiceCost > 2000) {
    costEmoji = '💎';
    costColor = 'text-blue-600';
    bgColor = 'bg-blue-50';
  } else if (totalServiceCost > 1000) {
    costEmoji = '🌟';
    costColor = 'text-amber-600';
    bgColor = 'bg-amber-50';
  } else if (totalServiceCost > 500) {
    costEmoji = '💖';
    costColor = 'text-pink-600';
    bgColor = 'bg-pink-50';
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-4 pb-32 bg-[#F5F1E3] -mx-6 -mt-6 p-6 min-h-screen"
    >
      {/* Top Navigation */}
      <div className="flex justify-between items-center mb-2">
        <button onClick={onBack} className="p-2 text-slate-400 hover:bg-white/50 rounded-full transition-colors">
          <ArrowLeft size={24} />
        </button>
        <div className="w-10 h-1.5 bg-[#A68966] rounded-full opacity-60"></div>
        <div className="w-10"></div> {/* Spacer */}
      </div>

      {/* Main Profile Card */}
      <div className="bg-white rounded-[2.5rem] p-6 shadow-sm relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-4 right-10 opacity-10">
          <svg width="100" height="100" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="1" />
            <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" strokeWidth="1" />
          </svg>
        </div>

        <div className="flex justify-between items-start mb-6">
          <div className="flex gap-4">
            <div className={`w-28 h-28 ${pet.color} rounded-3xl flex items-center justify-center text-5xl shadow-inner border-4 border-white`}>
              {pet.icon}
            </div>
            <div className="pt-2">
              <h2 className="text-2xl font-black text-slate-800">{pet.name}</h2>
              <p className="text-slate-400 text-sm font-medium">{pet.gender === 'ผู้' ? 'He/Him' : 'She/Her'} • {adventures} ผจญภัย</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="p-2.5 bg-[#F9F6ED] rounded-full text-[#A68966]">
              <Share2 size={20} />
            </button>
            <button onClick={() => onStartEdit(pet)} className="p-2.5 bg-[#F9F6ED] rounded-full text-[#A68966]">
              <Edit2 size={20} />
            </button>
          </div>
        </div>

        <div className="space-y-3 mb-6">
          <div className="flex items-center">
            <span className="text-[10px] font-black text-slate-300 tracking-widest w-24">AGE</span>
            <span className="text-sm font-bold text-slate-700">{pet.age} ปี</span>
          </div>
          <div className="flex items-center">
            <span className="text-[10px] font-black text-slate-300 tracking-widest w-24">BREED</span>
            <span className="text-sm font-bold text-slate-700 flex items-center gap-1">
              {pet.breed} <Heart size={14} className="text-red-400 fill-red-400" />
            </span>
          </div>
          <div className="flex items-center">
            <span className="text-[10px] font-black text-slate-300 tracking-widest w-24">TYPE</span>
            <span className="text-sm font-bold text-slate-700">{pet.type}</span>
          </div>
        </div>

        {/* Physical Stats */}
        <div className="flex gap-6 pt-4 border-t border-slate-50">
          <div className="flex items-center gap-1.5 text-slate-400">
            <Scale size={16} />
            <span className="text-xs font-bold">{pet.weight}kg</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-400">
            <Ruler size={16} />
            <span className="text-xs font-bold">45.0cm</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-400">
            <Activity size={16} />
            <span className="text-xs font-bold">ปกติ</span>
          </div>
        </div>
      </div>

      {/* Tabs Placeholder */}
      <div className="flex gap-2 p-1 bg-white/50 rounded-2xl">
        <button className="flex-1 py-3 bg-white rounded-xl text-xs font-black text-slate-600 shadow-sm uppercase tracking-widest">About</button>
        <button className="flex-1 py-3 text-xs font-black text-slate-400 uppercase tracking-widest">Personality</button>
      </div>

      {/* Total Service Cost Card (formerly Streak Card) */}
      <motion.div 
        whileTap={{ scale: 0.98 }}
        onClick={() => onViewServiceHistoryForPet(pet.name)} // New onClick
        className={`bg-white rounded-[2rem] p-5 flex items-center gap-4 shadow-sm cursor-pointer ${bgColor}`} // Added bgColor
      >
        <div className={`w-14 h-14 ${bgColor} rounded-2xl flex items-center justify-center text-2xl ${costColor}`}>
          {costEmoji}
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-black text-slate-800">รวมค่าบริการทั้งหมด</h3>
          <p className="text-xs text-slate-400 font-medium">฿{totalServiceCost.toLocaleString()} จาก {pet.name}</p>
        </div>
        <ChevronRight className="text-slate-300" size={20} />
      </motion.div>

      {/* Collection Section (now Pet Preferences) */}
      <div className="pt-4">
        <h3 className="text-lg font-black text-slate-800 mb-4 px-2">{pet.name}'s collection</h3>
        
        <div className="bg-[#FAF7F0] rounded-[2.5rem] border-t-8 border-[#D2B48C] relative">
          {/* Decorative tabs at the top */}
          <div className="absolute -top-3 left-0 right-0 flex justify-around px-8">
            {[1,2,3,4,5].map(i => <div key={i} className="w-3 h-5 bg-[#D2B48C] rounded-full" />)}
          </div>

          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h4 className="text-lg font-black text-[#8B4513]">ความชอบส่วนตัว</h4>
              <button className="p-1.5 bg-slate-200/50 rounded-full text-slate-400">
                <Info size={16} />
              </button>
            </div>

            <div className="space-y-4">
              {pet.shampooPreference && (
                <div className="flex items-center gap-3 bg-white p-4 rounded-2xl shadow-sm border border-slate-50">
                  <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-500 text-xl shadow-inner">
                    <Droplet size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-medium">แชมพูที่ชอบ</p>
                    <p className="font-bold text-slate-800 text-sm">{pet.shampooPreference}</p>
                  </div>
                </div>
              )}
              {pet.spaPreference && (
                <div className="flex items-center gap-3 bg-white p-4 rounded-2xl shadow-sm border border-slate-50">
                  <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center text-purple-500 text-xl shadow-inner">
                    <Sparkles size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-medium">สปาที่ชอบ</p>
                    <p className="font-bold text-slate-800 text-sm">{pet.spaPreference}</p>
                  </div>
                </div>
              )}
              {(!pet.shampooPreference && !pet.spaPreference) && (
                <div className="text-center py-4 text-slate-400 text-sm">
                  ยังไม่มีข้อมูลความชอบส่วนตัว
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Delete button (minimal) */}
      <div className="pt-4 pb-10 text-center">
        <button 
          onClick={() => onDeletePet(pet.id)}
          className="text-xs font-bold text-red-300 hover:text-red-500 transition-colors uppercase tracking-widest"
        >
          ลบข้อมูลสัตว์เลี้ยง
        </button>
      </div>
    </motion.div>
  );
};

export default PetDetailView;