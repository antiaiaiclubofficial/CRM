"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { PawPrint, Plus } from 'lucide-react';

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
  imageUrl: string;
  cardBgColor: string;
  furLength?: string;
  customPreferences?: { id: string; label: string; value: string; }[];
  isFavorite?: boolean;
}

interface PetListProps {
  pets: Pet[];
  onPetClick?: (pet: Pet) => void;
  onViewAll?: () => void;
}

const PetList = ({ pets, onPetClick, onViewAll }: PetListProps) => {
  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-4 px-1">
        <h3 className="font-bold text-lg text-slate-800">สัตว์เลี้ยงของฉัน 🐾</h3>
        {pets.length > 0 && (
          <button 
            onClick={onViewAll} 
            className="text-xs text-pink-500 font-medium active:scale-95 transition-transform"
          >
            ดูทั้งหมด
          </button>
        )}
      </div>
      
      {pets.length > 0 ? (
        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4 px-1">
          {pets.map((pet) => (
            <motion.div 
              key={pet.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onPetClick?.(pet)}
              className="flex-shrink-0 w-32 bg-white p-4 rounded-3xl shadow-sm border border-slate-50 text-center cursor-pointer active:bg-slate-50 transition-colors"
            >
              <div className="w-16 h-16 rounded-full overflow-hidden mx-auto mb-3 border-2 border-white shadow-md bg-slate-100">
                <img 
                  src={pet.imageUrl} 
                  alt={pet.name} 
                  className="w-full h-full object-cover" 
                />
              </div>
              <h4 className="font-bold text-sm text-slate-800 truncate">{pet.name}</h4>
              <p className="text-[10px] text-slate-500 truncate">{pet.breed}</p>
            </motion.div>
          ))}
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={onViewAll}
          className="bg-white/40 border-2 border-dashed border-slate-200 rounded-[2.5rem] p-8 text-center cursor-pointer active:bg-slate-50 transition-colors"
        >
          <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
             <PawPrint size={24} className="text-slate-300" />
          </div>
          <p className="text-sm font-bold text-slate-400">บ้านนี้ยังไม่มีเจ้านายเลย... 🐾</p>
          <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-tight">กด "ดูทั้งหมด" เพื่อเพิ่มสมาชิกคนสำคัญกันนะคะ!</p>
        </motion.div>
      )}
    </div>
  );
};

export default PetList;