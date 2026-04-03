"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

interface PetCategoryCardProps {
  pet: {
    id: number;
    name: string; // Pet's name or breed name
    breed: string; // Pet's breed
    imageUrl: string;
    weight: string; // Changed from locationLabel
    gender: string; // Changed from statusLabel
    cardBgColor: string; // Specific hex color for the inner background
    hasHeartIcon?: boolean; // Optional heart icon
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
      {/* Pin connection line (SVG) - positioned relative to the card */}
      <div className="absolute -top-2 left-1/2 -translate-x-1/2 z-20">
        <svg width="10" height="20" viewBox="0 0 10 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M5 0V10C5 15 0 15 0 20H10C10 15 5 15 5 10V0Z" fill="black"/>
        </svg>
        <svg className="absolute top-0 left-1/2 -translate-x-1/2" width="8" height="18" viewBox="0 0 8 18" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M4 0V9C4 13.5 0 13.5 0 18H8C8 13.5 4 13.5 4 9V0Z" fill="white"/>
        </svg>
      </div>

      {/* Main Card Body with black border and soft shadow */}
      <div className="relative w-full rounded-[2rem] border-2 border-black shadow-soft overflow-hidden">
        {/* Inner colored background */}
        <div className="absolute inset-0 rounded-[1.8rem]" style={{ backgroundColor: pet.cardBgColor }}></div>

        {/* Pet Image container */}
        <div className="relative w-[calc(100%-16px)] h-32 bg-white rounded-[1.5rem] overflow-hidden border-2 border-black mx-2 mt-2 z-10">
          <img src={pet.imageUrl} alt={pet.name} className="w-full h-full object-cover" />
          {pet.hasHeartIcon && (
            <div className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-sm">
              <Heart size={16} className="text-red-500 fill-red-500" />
            </div>
          )}
        </div>

        {/* Content Area */}
        <div className="p-4 relative z-10">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-gray-600 font-medium">{pet.weight} kg</span> {/* Changed to weight */}
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border border-black bg-white text-black">
              {pet.gender} {/* Changed to gender */}
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