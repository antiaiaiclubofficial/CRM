"use client";

import React from 'react';
import { Calendar, PawPrint, HeartPulse, Info, User, Feather } from 'lucide-react';
import { motion } from 'framer-motion';
import AnalogScaleIcon from './AnalogScaleIcon';

interface Pet {
  id: number;
  name: string;
  type: string;
  breed: string;
  age: string;
  birth_date?: string;
  gender: string;
  weight: string;
  medicalCondition: string;
  precautions: string;
  color: string;
  icon: string;
  furLength?: string;
  customPreferences?: { id: string; label: string; value: string; }[];
}

interface PetIDCardProps {
  pet: Pet;
}

const PetIDCard = ({ pet }: PetIDCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden p-8 rounded-[2.5rem] bg-gradient-to-br from-[#FFD8E4] via-[#FFE3BC] to-[#B2F2BB] shadow-xl shadow-pink-100/50 text-slate-800"
    >
      {/* Decorative Paw Prints */}
      <PawPrint className="absolute -right-4 -top-4 w-32 h-32 text-white/20 rotate-12 pointer-events-none" />
      <PawPrint className="absolute -left-8 -bottom-8 w-24 h-24 text-white/10 -rotate-12 pointer-events-none" />

      <div className="relative z-10 space-y-6">
        {/* Avatar & Name Section */}
        <div className="flex items-center gap-5">
          <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-5xl shadow-sm border-4 border-white shrink-0">
            {pet.icon}
          </div>
          <div className="min-w-0">
            <h2 className="text-4xl font-black text-slate-800 tracking-tight leading-none">{pet.name}</h2>
            <p className="text-lg font-bold text-slate-600 mt-1.5">{pet.type} • {pet.breed}</p>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-4 text-base pt-2">
          <div className="flex items-center gap-2.5">
            <User size={20} className="text-pink-500 shrink-0" />
            <span className="font-medium text-slate-700">เพศ: <span className="font-black text-slate-800">{pet.gender}</span></span>
          </div>
          <div className="flex items-center gap-2.5">
            <Calendar size={20} className="text-blue-500 shrink-0" />
            <span className="font-medium text-slate-700">อายุ: <span className="font-black text-slate-800">{pet.age || '-'}</span></span>
          </div>
          <div className="flex items-center gap-2.5">
            <AnalogScaleIcon size={20} className="text-amber-500 shrink-0" />
            <span className="font-medium text-slate-700">น้ำหนัก: <span className="font-black text-slate-800">{pet.weight || '-'} kg</span></span>
          </div>
          <div className="flex items-center gap-2.5">
            <Feather size={20} className="text-purple-500 shrink-0" />
            <span className="font-medium text-slate-700">ความยาวขน: <span className="font-black text-slate-800">{pet.furLength || '-'}</span></span>
          </div>
        </div>

        {/* Medical Conditions & Precautions */}
        {(pet.medicalCondition || pet.precautions) && (
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-5 space-y-3 border border-white/80 shadow-inner mt-2">
            {pet.medicalCondition && (
              <div className="flex gap-3 items-start">
                <HeartPulse size={18} className="text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-slate-600 font-bold">โรคประจำตัว</p>
                  <p className="text-sm text-slate-700 font-medium">{pet.medicalCondition}</p>
                </div>
              </div>
            )}
            {pet.precautions && (
              <div className="flex gap-3 items-start">
                <Info size={18} className="text-orange-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-slate-600 font-bold">ข้อควรระวัง / แพ้อาหาร</p>
                  <p className="text-sm text-slate-700 font-medium">{pet.precautions}</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default PetIDCard;