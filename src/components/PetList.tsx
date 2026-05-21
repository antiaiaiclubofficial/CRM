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
    <div className="mt-10">
      <div className="flex justify-between items-center mb-6 px-2">
        <h3 className="font-extrabold text-xl text-primary tracking-tight">Vessels of Joy 🐾</h3>
        <button 
          onClick={onViewAll} 
          className="text-xs text-primary font-black uppercase tracking-widest opacity-60 hover:opacity-100 transition-opacity"
        >
          Manage All
        </button>
      </div>
      
      {pets.length > 0 ? (
        <div className="flex gap-5 overflow-x-auto no-scrollbar pb-6 px-2">
          {pets.map((pet) => (
            <motion.div 
              key={pet.id}
              whileTap={{ scale: 0.95 }}
              onClick={() => onPetClick?.(pet)}
              className="flex-shrink-0 w-36 bg-surface-lowest p-5 rounded-3xl shadow-ambient text-center cursor-pointer transition-all hover:translate-y-[-4px]"
            >
              <div className="relative w-24 h-24 rounded-2xl overflow-hidden mx-auto mb-4 bg-surface-low shadow-sm">
                <img src={pet.imageUrl} alt={pet.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-tertiary/10 opacity-0 hover:opacity-100 transition-opacity" />
              </div>
              <h4 className="font-black text-primary text-sm truncate uppercase tracking-tighter">{pet.name}</h4>
              <p className="text-[10px] font-bold text-surface-variant opacity-60 truncate uppercase">{pet.breed}</p>
            </motion.div>
          ))}
          <motion.div 
            whileTap={{ scale: 0.95 }}
            onClick={onViewAll}
            className="flex-shrink-0 w-36 bg-surface-low p-5 rounded-3xl flex flex-col items-center justify-center text-center cursor-pointer opacity-60 hover:opacity-100 transition-all border-2 border-dashed border-primary/10"
          >
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-primary mb-3 shadow-sm">
              <Plus size={24} />
            </div>
            <span className="text-[10px] font-black text-primary uppercase tracking-widest">Add Pet</span>
          </motion.div>
        </div>
      ) : (
        <div className="bg-surface-low rounded-3xl p-10 text-center shadow-inner">
          <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-ambient">
             <PawPrint size={32} className="text-primary/20" />
          </div>
          <p className="text-sm font-black text-primary/40 uppercase tracking-widest">No residents hosted yet</p>
        </div>
      )}
    </div>
  );
};

export default PetList;