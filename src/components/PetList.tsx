"use client";

import React from 'react';
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
  imageUrl: string;
  cardBgColor: string;
  furLength?: string;
  customPreferences?: { id: string; label: string; value: string; }[];
  isFavorite?: boolean;
}

interface PetListProps {
  pets: Pet[];
  onPetClick?: (pet: Pet) => void;
}

const PetList = ({ pets, onPetClick }: PetListProps) => {
  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-4 px-1">
        <h3 className="font-bold text-lg text-slate-800">สัตว์เลี้ยงของฉัน 🐾</h3>
        <button className="text-xs text-pink-500 font-medium">ดูทั้งหมด</button>
      </div>
      
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
    </div>
  );
};

export default PetList;