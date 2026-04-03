"use client";

import React from 'react';
import { Calendar, Scale, PawPrint, HeartPulse, Info, User, Feather } from 'lucide-react'; // Added Feather
import { motion } from 'framer-motion';

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

interface PetIDCardProps {
  pet: Pet;
}

const PetIDCard = ({ pet }: PetIDCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden p-6 rounded-[2rem] bg-gradient-to-br from-[#FFD8E4] via-[#FFE3BC] to-[#B2F2BB] shadow-xl shadow-pink-100/50 text-slate-800"
    >
      {/* Background Paw Prints */}
      <PawPrint className="absolute -right-4 -top-4 w-32 h-32 text-white/20 rotate-12" />
      <PawPrint className="absolute -left-8 -bottom-8 w-24 h-24 text-white/10 -rotate-12" />

      <div className="relative z-10 space-y-5">
        {/* Header: Icon and Name */}
        <div className="flex items-center gap-4">
          <div className={`w-20 h-20 ${pet.color} rounded-full flex items-center justify-center text-4xl shadow-inner border-2 border-white`}>
            {pet.icon}
          </div>
          <div>
            <h2 className="text-2xl font-bold">{pet.name}</h2>
            <p className="text-sm text-slate-600">{pet.type} • {pet.breed}</p>
          </div>
        </div>

        {/* Basic Info Grid */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
          <div className="flex items-center gap-2">
            <User size={16} className="text-pink-500" />
            <span className="font-medium">เพศ: <span className="font-bold">{pet.gender}</span></span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar size={16} className="text-blue-500" />
            <span className="font-medium">อายุ: <span className="font-bold">{pet.age || '-'} ปี</span></span>
          </div>
          <div className="flex items-center gap-2">
            <Scale size={16} className="text-amber-500" />
            <span className="font-medium">น้ำหนัก: <span className="font-bold">{pet.weight || '-'} kg</span></span>
          </div>
          <div className="flex items-center gap-2">
            <Feather size={16} className="text-purple-500" /> {/* Added Feather icon */}
            <span className="font-medium">ความยาวขน: <span className="font-bold">{pet.furLength || '-'}</span></span> {/* Display furLength */}
          </div>
        </div>

        {/* Medical & Precautions */}
        {(pet.medicalCondition || pet.precautions) && (
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 space-y-3 border border-white/80 shadow-inner">
            {pet.medicalCondition && (
              <div className="flex gap-3 items-start">
                <HeartPulse size={18} className="text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-slate-600 font-bold">โรคประจำตัว</p>
                  <p className="text-sm text-slate-700">{pet.medicalCondition}</p>
                </div>
              </div>
            )}
            {pet.precautions && (
              <div className="flex gap-3 items-start">
                <Info size={18} className="text-orange-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-slate-600 font-bold">ข้อควรระวัง / แพ้อาหาร</p>
                  <p className="text-sm text-slate-700">{pet.precautions}</p>
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