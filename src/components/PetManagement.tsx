"use client";

import React from 'react';
import { Plus, HeartPulse, Info } from 'lucide-react'; // Added HeartPulse and Info
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
            className="bg-white p-5 rounded-[2.5rem] shadow-sm border border-slate-50 flex flex-col gap-4 cursor-pointer active:bg-slate-50 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 ${pet.color} rounded-2xl flex items-center justify-center text-2xl shadow-inner`}>
                  {pet.icon}
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-lg">{pet.name}</h4>
                  <p className="text-xs text-slate-500">{pet.type} • {pet.breed}</p>
                </div>
              </div>
              {/* Removed Edit/Delete buttons from list view */}
            </div>
            
            <div className="grid grid-cols-3 gap-2 py-2 border-t border-slate-50">
              <div className="text-center">
                <p className="text-[10px] text-slate-400 uppercase font-bold">อายุ</p>
                <p className="text-sm font-medium text-slate-700">{pet.age || '-'} ปี</p>
              </div>
              <div className="text-center border-x border-slate-50">
                <p className="text-[10px] text-slate-400 uppercase font-bold">เพศ</p>
                <p className="text-sm font-medium text-slate-700">{pet.gender}</p>
              </div>
              <div className="text-center">
                <p className="text-[10px] text-slate-400 uppercase font-bold">น้ำหนัก</p>
                <p className="text-sm font-medium text-slate-700">{pet.weight || '-'} kg</p>
              </div>
            </div>

            {(pet.medicalCondition || pet.precautions) && (
              <div className="bg-slate-50 rounded-2xl p-3 space-y-2">
                {pet.medicalCondition && (
                  <div className="flex gap-2 items-start">
                    <HeartPulse size={14} className="text-red-400 mt-0.5" />
                    <p className="text-[11px] text-slate-600"><span className="font-bold">โรค:</span> {pet.medicalCondition}</p>
                  </div>
                )}
                {pet.precautions && (
                  <div className="flex gap-2 items-start">
                    <Info size={14} className="text-amber-400 mt-0.5" />
                    <p className="text-[11px] text-slate-600"><span className="font-bold">ควรระวัง:</span> {pet.precautions}</p>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default PetManagement;