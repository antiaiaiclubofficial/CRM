"use client";

import React from 'react';
import { Plus, ChevronRight } from 'lucide-react';
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
  furLength?: string;
  customPreferences?: { id: string; label: string; value: string; }[];
}

interface PetManagementProps {
  pets: Pet[];
  onAddPet: () => void;
  onViewDetails: (pet: Pet) => void;
}

const PetManagement = ({ pets, onAddPet, onViewDetails }: PetManagementProps) => {
  return (
    <div className="space-y-6 pb-20">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-slate-800">จัดการสัตว์เลี้ยง</h2>
        <button 
          onClick={onAddPet}
          className="bg-pink-500 text-white p-2 rounded-2xl shadow-lg shadow-pink-200 active:scale-90 transition-transform"
        >
          <Plus size={20} />
        </button>
      </div>

      <div className="space-y-4">
        {pets.map((pet) => (
          <motion.div 
            layout
            key={pet.id}
            whileTap={{ scale: 0.98 }}
            onClick={() => onViewDetails(pet)}
            className="relative bg-white p-6 pt-10 rounded-[2.5rem] shadow-sm border border-slate-50 flex flex-col items-center text-center cursor-pointer active:bg-slate-50 transition-colors overflow-hidden"
          >
            {/* Top accent/border */}
            <div className={`absolute top-0 left-0 right-0 h-2.5 ${pet.color} rounded-t-[2.5rem]`} />
            
            {/* Decorative tabs at the top */}
            <div className="absolute -top-3 left-0 right-0 flex justify-around px-8">
              {[1,2,3,4,5].map(i => <div key={i} className={`w-3 h-5 ${pet.color} rounded-full`} />)}
            </div>

            {/* Pet Icon */}
            <div className={`w-20 h-20 ${pet.color} rounded-full flex items-center justify-center text-4xl shadow-inner border-4 border-white relative z-10 -mt-8 mb-4`}>
              {pet.icon}
            </div>

            {/* Pet Name and Breed */}
            <h4 className="font-bold text-slate-800 text-lg mb-1">{pet.name}</h4>
            <p className="text-xs text-slate-500 mb-4">{pet.breed}</p>

            {/* View Details Button */}
            <div className="flex items-center gap-1 text-pink-500 text-sm font-medium">
              <span>ดูรายละเอียด</span>
              <ChevronRight size={16} />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default PetManagement;