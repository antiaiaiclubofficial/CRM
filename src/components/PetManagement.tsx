"use client";

import React from 'react';
import { Plus, ChevronRight } from 'lucide-react'; // Changed HeartPulse and Info to ChevronRight
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
            className="bg-white p-5 rounded-[2.5rem] shadow-sm border border-slate-50 flex items-center justify-between cursor-pointer active:bg-slate-50 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 ${pet.color} rounded-2xl flex items-center justify-center text-2xl shadow-inner`}>
                {pet.icon}
              </div>
              <div>
                <h4 className="font-bold text-slate-800 text-lg">{pet.name}</h4>
                <p className="text-xs text-slate-500">{pet.type} • {pet.breed}</p>
              </div>
            </div>
            
            <ChevronRight size={20} className="text-slate-300 group-hover:text-pink-400 transition-colors" />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default PetManagement;