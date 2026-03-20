"use client";

import React from 'react';
import { motion } from 'framer-motion';

interface Pet {
  id: number;
  name: string;
  breed: string;
  color: string;
  icon: string;
}

interface PetListProps {
  pets: Pet[];
}

const PetList = ({ pets }: PetListProps) => {
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
            className="flex-shrink-0 w-32 bg-white p-4 rounded-3xl shadow-sm border border-slate-50 text-center"
          >
            <div className={`w-16 h-16 ${pet.color} rounded-full flex items-center justify-center text-3xl mx-auto mb-3 shadow-inner`}>
              {pet.icon}
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