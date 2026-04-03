"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, Edit2, Feather, Scale, 
  Info, ChevronRight, Settings, Plus, Tag // Added Feather icon
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
  furLength?: string; // New field for fur length
  customPreferences?: { id: string; label: string; value: string; }[];
}

interface PetDetailViewProps {
  pet: Pet;
  onBack: () => void;
  onStartEdit: (pet: Pet) => void;
  onDeletePet: (id: number) => void;
  totalServiceCost: number;
  onViewServiceHistoryForPet: (petName: string) => void;
  onEditPreferences: () => void; // New prop for editing preferences
}

const PetDetailView = ({ pet, onBack, onStartEdit, onDeletePet, totalServiceCost, onViewServiceHistoryForPet, onEditPreferences }: PetDetailViewProps) => {
  // Removed adventures variable as it's no longer used
  
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

  const hasPreferences = pet.customPreferences && pet.customPreferences.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-4 pb-32 bg-[#FFF9F0] -mx-6 -mt-6 p-6 min-h-screen" // Changed background color
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
        {/* Removed the SVG circles as requested */}

        <div className="flex justify-between items-start mb-6">
          <div className="flex gap-4">
            <div className={`w-28 h-28 ${pet.color} rounded-3xl flex items-center justify-center text-5xl shadow-inner border-4 border-white`}>
              {pet.icon}
            </div>
            <div className="pt-2">
              <h2 className="text-2xl font-black text-slate-800">{pet.name}</h2>
              <p className="text-slate-400 text-sm font-medium">
                {pet.gender === 'ผู้' ? 'เพศผู้' : 'เพศเมีย'} {/* Changed gender display */}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            {/* Removed Share2 button */}
            <button 
              onClick={() => onStartEdit(pet)} 
              className="p-2.5 bg-pink-100 text-pink-700 rounded-full active:scale-95 transition-all" // Reduced size to icon-only
            >
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
            <span className="text-sm font-bold text-slate-700">{pet.breed}</span>
          </div>
          <div className="flex items-center">
            <span className="text-[10px] font-black text-slate-300 tracking-widest w-24">TYPE</span>
            <span className="text-sm font-bold text-slate-700">{pet.type}</span>
          </div>
        </div>

        {/* Physical Stats & Precautions */}
        <div className="grid grid-cols-2 gap-6 pt-4 border-t border-slate-50">
          <div className="flex items-center gap-1.5 text-slate-400">
            <Scale size={16} />
            <span className="text-xs font-bold">{pet.weight}kg</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-400">
            <Feather size={16} /> {/* Changed icon to Feather */}
            <span className="text-xs font-bold">{pet.furLength || '-'}</span> {/* Display furLength */}
          </div>
          <div className="flex items-center gap-1.5 text-slate-400 col-span-2"> {/* Made precautions span 2 columns */}
            <Info size={16} /> {/* Changed icon to Info */}
            <span className="text-xs font-bold">ข้อควรระวัง: {pet.precautions || '-'}</span> {/* Display precautions */}
          </div>
        </div>
      </div>

      {/* Total Service Cost Card (formerly Streak Card) */}
      <motion.div 
        whileTap={{ scale: 0.98 }}
        onClick={() => onViewServiceHistoryForPet(pet.name)}
        className={`bg-white rounded-[2rem] p-5 flex items-center gap-4 shadow-sm cursor-pointer ${bgColor}`}
      >
        <div className={`w-14 h-14 ${bgColor} rounded-2xl flex items-center justify-center text-2xl ${costColor}`}>
          {costEmoji}
        </div>
        <div className="flex-1">
          <p className="text-xs font-medium text-slate-500 mb-1">ยอดการใช้บริการสะสม</p>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold text-slate-800">฿{totalServiceCost.toLocaleString()}</span>
            <span className="text-sm text-slate-600">จาก {pet.name}</span>
          </div>
        </div>
        <ChevronRight className="text-slate-300" size={20} />
      </motion.div>

      {/* Collection Section (Pet Preferences) */}
      <div className="pt-4">
        <h3 className="text-lg font-black text-slate-800 mb-4 px-2">{pet.name}'s collection</h3>
        
        <div className="bg-[#fff6ed] rounded-[2.5rem] border-t-8 border-[#c28856] relative shadow-lg">
          {/* Decorative tabs at the top */}
          <div className="absolute -top-3 left-0 right-0 flex justify-around px-8">
            {[1,2,3,4,5].map(i => <div key={i} className="w-3 h-5 bg-[#c28856] rounded-full" />)}
          </div>

          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h4 className="text-lg font-black text-[#4A2C0F]">ความชอบส่วนตัว</h4>
              <button 
                onClick={onEditPreferences} // This button is always for editing/adding
                className="p-1.5 bg-[#D4B89A] rounded-full text-[#4A2C0F] hover:bg-[#E0C7A9] transition-colors"
              >
                <Settings size={16} />
              </button>
            </div>

            <div className="space-y-4">
              {hasPreferences ? (
                pet.customPreferences?.map((pref, index) => (
                  <div key={index} className="flex items-center gap-3 bg-white p-4 rounded-2xl shadow-sm border border-slate-50">
                    <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center text-slate-500 text-xl shadow-inner">
                      <Tag size={20} /> {/* Generic icon for custom preferences */}
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 font-medium">{pref.label}</p>
                      <p className="font-bold text-slate-800 text-sm">{pref.value}</p>
                    </div>
                  </div>
                ))
              ) : (
                <button 
                  onClick={onEditPreferences} 
                  className="w-full py-4 text-center text-[#4A2C0F] text-sm bg-[#F0E6D2] rounded-2xl border border-[#D4B89A] hover:bg-[#E0C7A9] transition-colors flex items-center justify-center gap-2"
                >
                  <Plus size={16} /> เพิ่มความชอบส่วนตัว
                </button>
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