"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Weight } from 'lucide-react';

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
}

const PetCategoryCard = ({ pet, onClick }: PetCategoryCardProps) => {
  return (
    <motion.div
      whileTap={{ scale: 0.98 }}
      onClick={() => onClick(pet.id)}
      className="relative w-full cursor-pointer"
    >
      <div className="relative w-full rounded-[2rem] border-2 border-black shadow-soft overflow-hidden">
        <div className="absolute inset-0 rounded-[1.8rem]" style={{ backgroundColor: pet.cardBgColor }}></div>

        <div className="relative w-[calc(100%-16px)] h-32 bg-white rounded-[1.5rem] overflow-hidden border-2 border-black mx-2 mt-2 z-10">
          <img src={pet.imageUrl} alt={pet.name} className="w-full h-full object-cover" />
          {pet.isFavorite && (
            <div className="absolute top-2 right-2 bg-white rounded-full p-1.5 shadow-sm border border-slate-100">
              <Heart size={16} className="text-red-500 fill-red-500" />
            </div>
          )}
        </div>

        <div className="p-4 relative z-10">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600 font-medium flex items-center gap-1">
              <Weight size={16} className="text-gray-500" />
              {pet.weight} kg
            </span>
            <span className="text-xs font-bold px-3 py-1 rounded-full border border-black bg-white text-black">
              {pet.gender}
            </span>
          </div>
          <h3 className="text-lg font-bold text-black">{pet.name}</h3>
          <p className="text-sm text-gray-700">{pet.breed}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default PetCategoryCard;