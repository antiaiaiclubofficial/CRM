"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import AnalogScaleIcon from './AnalogScaleIcon';

interface PetCategoryCardProps {
  pet: {
    id: number;
    name: string;
    breed: string;
    imageUrl: string;
    weight: string;
    gender: string;
    cardBgColor: string;
    is_favorite?: boolean;
  };
  onClick: (petId: number) => void;
  onToggleFavorite?: (e: React.MouseEvent, petId: number, currentFav: boolean) => void;
}

const PetCategoryCard = ({ pet, onClick, onToggleFavorite }: PetCategoryCardProps) => {
  return (
    <motion.div
      whileTap={{ scale: 0.98 }}
      onClick={() => onClick(pet.id)}
      className="relative w-full cursor-pointer"
    >
      <div className="relative w-full rounded-[2.5rem] border-none shadow-ambient overflow-hidden">
        <div className="absolute inset-0 opacity-40" style={{ backgroundColor: pet.cardBgColor }}></div>

        {/* Image Area */}
        <div className="relative w-[calc(100%-12px)] h-28 bg-white rounded-[1.8rem] overflow-hidden mx-1.5 mt-1.5 z-10 shadow-sm">
          <img src={pet.imageUrl} alt={pet.name} className="w-full h-full object-cover" />
        </div>

        {/* Info Area */}
        <div className="p-4 relative z-10">
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-[10px] text-primary/60 font-bold flex items-center gap-1">
              <AnalogScaleIcon size={14} />
              {pet.weight} kg
            </span>
            <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-white/50 text-primary uppercase">
              {pet.gender}
            </span>
          </div>
          
          <div className="flex justify-between items-end">
            <div className="min-w-0 flex-1 pr-1.5">
              <h3 className="text-base font-black text-primary truncate leading-tight">{pet.name}</h3>
              <p className="text-[11px] font-bold text-primary/40 truncate uppercase tracking-tighter">{pet.breed}</p>
            </div>
            
            <button
              onClick={(e) => onToggleFavorite?.(e, pet.id, !!pet.is_favorite)}
              className="p-1.5 bg-white/80 backdrop-blur-sm rounded-full shadow-sm transition-all active:scale-110 shrink-0"
            >
              <Heart 
                size={14} 
                className={pet.is_favorite ? 'text-pink-500' : 'text-primary/20'}
                fill={pet.is_favorite ? "currentColor" : "none"} 
                strokeWidth={2.5} 
              />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PetCategoryCard;