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
    isFavorite?: boolean;
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
      <div className="relative w-full rounded-[2rem] border-2 border-slate-800 shadow-soft overflow-hidden">
        <div className="absolute inset-0 rounded-[1.8rem]" style={{ backgroundColor: pet.cardBgColor }}></div>

        {/* Image Area */}
        <div className="relative w-[calc(100%-16px)] h-32 bg-white rounded-[1.5rem] overflow-hidden border-2 border-slate-800 mx-2 mt-2 z-10">
          <img src={pet.imageUrl} alt={pet.name} className="w-full h-full object-cover" />
        </div>

        {/* Info Area */}
        <div className="p-4 relative z-10">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600 font-medium flex items-center gap-1">
              <AnalogScaleIcon size={16} className="text-gray-500" />
              {pet.weight} kg
            </span>
            <span className="text-xs font-bold px-3 py-1 rounded-full border border-slate-800 bg-white text-slate-800">
              {pet.gender}
            </span>
          </div>
          
          <div className="flex justify-between items-end">
            <div className="min-w-0 flex-1 pr-2">
              <h3 className="text-lg font-bold text-slate-800 truncate">{pet.name}</h3>
              <p className="text-sm text-gray-700 truncate">{pet.breed}</p>
            </div>
            
            <button
              onClick={(e) => onToggleFavorite?.(e, pet.id, !!pet.isFavorite)}
              className={`p-2.5 rounded-2xl border-2 transition-all active:scale-90 ${
                pet.isFavorite 
                  ? 'bg-pink-100 border-pink-500 text-pink-500 shadow-sm' 
                  : 'bg-white border-slate-200 text-slate-300'
              }`}
            >
              <Heart size={18} fill={pet.isFavorite ? "currentColor" : "none"} strokeWidth={pet.isFavorite ? 2 : 2.5} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PetCategoryCard;