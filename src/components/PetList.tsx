"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { PawPrint, Plus } from 'lucide-react';

interface Pet {
  id: number;
  name: string;
  breed: string;
  imageUrl: string;
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
        <h3 className="font-extrabold text-lg text-primary tracking-tight">Vessels of Joy 🐾</h3>
        <button 
          onClick={onViewAll} 
          className="text-[10px] text-primary font-black uppercase tracking-widest opacity-50 hover:opacity-100 transition-opacity"
        >
          Manage All
        </button>
      </div>
      
      {pets.length > 0 ? (
        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4 px-1">
          {pets.map((pet) => (
            <motion.div 
              key={pet.id}
              whileTap={{ scale: 0.95 }}
              onClick={() => onPetClick?.(pet)}
              className="flex-shrink-0 w-32 bg-[#efecff] p-4 rounded-[2rem] shadow-ambient text-center cursor-pointer transition-all"
            >
              <div className="relative w-20 h-20 rounded-2xl overflow-hidden mx-auto mb-3 bg-surface-low shadow-sm">
                <img src={pet.imageUrl} alt={pet.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-tertiary/10 opacity-0 hover:opacity-100 transition-opacity" />
              </div>
              <h4 className="font-black text-primary text-xs truncate uppercase tracking-tighter">{pet.name}</h4>
              <p className="text-[9px] font-bold text-surface-variant opacity-50 truncate uppercase">{pet.breed}</p>
            </motion.div>
          ))}
          <motion.div 
            whileTap={{ scale: 0.95 }}
            onClick={onViewAll}
            className="flex-shrink-0 w-32 bg-surface-low p-4 rounded-[2rem] flex flex-col items-center justify-center text-center cursor-pointer opacity-50 hover:opacity-100 transition-all border-2 border-dashed border-primary/5"
          >
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-primary mb-2 shadow-sm">
              <Plus size={20} />
            </div>
            <span className="text-[9px] font-black text-primary uppercase tracking-widest">Add Pet</span>
          </motion.div>
        </div>
      ) : (
        <div className="bg-surface-low rounded-3xl p-8 text-center shadow-inner">
          <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-ambient">
             <PawPrint size={28} className="text-primary/10" />
          </div>
          <p className="text-[10px] font-black text-primary/30 uppercase tracking-widest">No residents hosted yet</p>
        </div>
      )}
    </div>
  );
};

export default PetList;