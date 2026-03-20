"use client";

import React from 'react';
import { motion } from 'framer-motion';

const pets = [
  { id: 1, name: 'น้องปุย', breed: 'Pomeranian', color: 'bg-orange-100', icon: '🐶' },
  { id: 2, name: 'น้องกะทิ', breed: 'Persian Cat', color: 'bg-blue-100', icon: '🐱' },
  { id: 3, name: 'น้องถุงทอง', breed: 'Golden', color: 'bg-yellow-100', icon: '🐕' },
  { id: 4, name: 'น้องมี่', breed: 'Scottish Fold', color: 'bg-pink-100', icon: '🐈' },
];

const PetList = () => {
  return (
    <div className="mt-10">
      <div className="flex justify-between items-end mb-6 px-1">
        <div>
          <h3 className="font-black text-2xl text-slate-900">สัตว์เลี้ยงของฉัน 🐾</h3>
          <div className="h-1.5 w-16 bg-pink-300 rounded-full mt-1"></div>
        </div>
        <button className="text-sm text-pink-600 font-black border-b-2 border-pink-200 pb-0.5">ดูทั้งหมด</button>
      </div>
      
      <div className="flex gap-6 overflow-x-auto no-scrollbar pb-6 px-1">
        {pets.map((pet) => (
          <motion.div 
            key={pet.id}
            whileHover={{ scale: 1.05, y: -5 }}
            className="flex-shrink-0 w-40 bg-white p-6 rounded-[2.5rem] shadow-lg shadow-slate-200/50 border-2 border-slate-50 text-center"
          >
            <div className={`w-24 h-24 ${pet.color} rounded-full flex items-center justify-center text-5xl mx-auto mb-4 shadow-inner border-4 border-white`}>
              {pet.icon}
            </div>
            <h4 className="font-black text-lg text-slate-900 truncate mb-1">{pet.name}</h4>
            <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">{pet.breed}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default PetList;