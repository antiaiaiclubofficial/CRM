"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, Edit2, Share2, Scale, 
  Ruler, Activity, Heart, CheckCircle2, 
  Info, ChevronRight, MoreHorizontal,
  Droplet, Dog, Cat, Menu, Feather, Sun, Check
} from 'lucide-react';

interface Pet {
  id: number;
  name: string;
  type: string;
  breed: string;
  age: string; // Assuming this is in years, will display as months if < 1 year
  gender: string;
  weight: string; // Assuming this is in kg
  medicalCondition: string;
  precautions: string;
  color: string;
  icon: string;
}

interface PetDetailViewProps {
  pet: Pet;
  onBack: () => void;
  onStartEdit: (pet: Pet) => void;
  onDeletePet: (id: number) => void;
}

const PetDetailView = ({ pet, onBack, onStartEdit, onDeletePet }: PetDetailViewProps) => {
  // Mock data for the new sections, as these fields are not in the Pet interface
  const adventures = 323;
  const friendshipStatus = 'Uber Soulmates';
  const humanName = 'El';
  const friendCode = '••••••••••'; // Placeholder for friend code
  const petHeight = '9.0cm'; // Placeholder for height
  const petWingspan = '23.0cm'; // Placeholder for wingspan

  // Convert age to months if less than a year, otherwise display in years
  const displayAge = pet.age && parseFloat(pet.age) < 1 
    ? `${Math.round(parseFloat(pet.age) * 12)} months` 
    : `${pet.age} ปี`;

  const micropets = [
    { id: 1, name: 'Cow', icon: '🐮', color: 'bg-[#F3E5AB]', number: '#23' },
    { id: 2, name: 'Puppy', icon: '🐶', color: 'bg-[#E9967A]', number: '#53' },
    { id: 3, name: 'Drop', icon: '💧', color: 'bg-[#6495ED]', number: '#14' },
  ];

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
          <Menu size={24} /> {/* Changed to Menu icon */}
        </button>
        <div className="w-10 h-1.5 bg-[#A68966] rounded-full opacity-60"></div>
        <div className="flex gap-2">
          <button className="p-2.5 bg-[#F9F6ED] rounded-full text-[#A68966]">
            <Share2 size={20} />
          </button>
          <button onClick={() => onStartEdit(pet)} className="p-2.5 bg-[#F9F6ED] rounded-full text-[#A68966]">
            <Edit2 size={20} />
          </button>
        </div>
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
        </div>

        <div className="space-y-3 mb-6">
          <div className="flex items-center">
            <span className="text-[10px] font-black text-slate-300 tracking-widest w-24">AGE</span>
            <span className="text-sm font-bold text-slate-700">{displayAge}</span>
          </div>
          <div className="flex items-center">
            <span className="text-[10px] font-black text-slate-300 tracking-widest w-24">FRIENDSHIP</span>
            <span className="text-sm font-bold text-slate-700 flex items-center gap-1">
              {friendshipStatus} <Heart size={14} className="text-red-400 fill-red-400" />
            </span>
          </div>
          <div className="flex items-center">
            <span className="text-[10px] font-black text-slate-300 tracking-widest w-24">HUMAN</span>
            <span className="text-sm font-bold text-slate-700">{humanName}</span>
          </div>
          <div className="flex items-center">
            <span className="text-[10px] font-black text-slate-300 tracking-widest w-24">FRIEND CODE</span>
            <span className="text-sm font-bold text-slate-700 flex items-center gap-1">
              {friendCode} <Info size={14} className="text-slate-300" />
            </span>
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
            <span className="text-xs font-bold">{petHeight}</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-400">
            <Feather size={16} /> {/* Changed to Feather icon for wingspan */}
            <span className="text-xs font-bold">{petWingspan}</span>
          </div>
        </div>
      </div>

      {/* Tabs Placeholder */}
      <div className="flex gap-2 p-1 bg-white/50 rounded-2xl">
        <button className="flex-1 py-3 bg-white rounded-xl text-xs font-black text-slate-600 shadow-sm uppercase tracking-widest">About</button>
        <button className="flex-1 py-3 text-xs font-black text-slate-400 uppercase tracking-widest">Personality</button>
      </div>

      {/* Streak Card */}
      <motion.div 
        whileTap={{ scale: 0.98 }}
        className="bg-white rounded-[2rem] p-5 flex items-center gap-4 shadow-sm"
      >
        <div className="w-14 h-14 bg-[#FFD700]/20 rounded-2xl flex items-center justify-center text-[#DAA520]">
          <div className="relative">
            <Sun size={32} /> {/* Changed to Sun icon */}
            <Check size={16} className="absolute bottom-0 right-0 text-white bg-[#DAA520] rounded-full p-0.5" /> {/* Added Check icon */}
          </div>
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-black text-slate-800">320 day streak</h3> {/* Updated text */}
          <p className="text-xs text-slate-400 font-medium">Longest self-care streak ever!</p> {/* Updated text */}
        </div>
        <ChevronRight className="text-slate-300" size={20} />
      </motion.div>

      {/* Collection Section */}
      <div className="pt-4">
        <h3 className="text-lg font-black text-slate-800 mb-4 px-2">{pet.name}'s collection</h3>
        
        <div className="bg-[#FAF7F0] rounded-[2.5rem] border-t-8 border-[#D2B48C] relative">
          {/* Decorative tabs at the top */}
          <div className="absolute -top-3 left-0 right-0 flex justify-around px-8">
            {[1,2,3,4,5].map(i => <div key={i} className="w-10 h-2 bg-[#A68966] rounded-full" />)} {/* Updated tab styling */}
          </div>

          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h4 className="text-lg font-black text-[#8B4513]">Micropets</h4>
              <button className="p-1.5 bg-slate-200/50 rounded-full text-slate-400">
                <Info size={16} />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {micropets.map((mp) => (
                <div key={mp.id} className="space-y-1">
                  <div className={`${mp.color} aspect-square rounded-2xl flex items-center justify-center text-3xl shadow-sm border-2 border-white relative`}>
                    <span className="absolute top-1 right-2 text-[8px] font-black text-black/20">{mp.number}</span>
                    {mp.icon}
                  </div>
                </div>
              ))}
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