"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { PawPrint, Plus, Heart } from 'lucide-react';
import AnalogScaleIcon from './AnalogScaleIcon';

interface Pet {
  id: number;
  name: string;
  breed: string;
  imageUrl: string;
  cardBgColor?: string;
  card_bg_color?: string;
  weight?: string;
  gender?: string;
  is_favorite?: boolean;
}

interface PetListProps {
  pets: Pet[];
  onPetClick?: (pet: Pet) => void;
  onViewAll?: () => void;
  onToggleFavorite?: (e: React.MouseEvent, petId: number, currentFav: boolean) => void;
}

const PetList = ({ pets, onPetClick, onViewAll, onToggleFavorite }: PetListProps) => {
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
          {pets.map((pet) => {
            const bgColor = pet.cardBgColor || pet.card_bg_color || '#efecff';
            return (
              <motion.div 
                key={pet.id}
                whileTap={{ scale: 0.98 }}
                onClick={() => onPetClick?.(pet)}
                className="flex-shrink-0 w-36 p-3 rounded-[2.5rem] shadow-ambient text-left cursor-pointer transition-all relative overflow-hidden bg-white"
              >
                {/* Softened background overlay (40% opacity) */}
                <div 
                  className="absolute inset-0 opacity-40" 
                  style={{ backgroundColor: bgColor }} 
                />
                
                {/* Content container */}
                <div className="relative z-10 flex flex-col h-full justify-between">
                  {/* Image Area - Adjusted border radius to match container proportions */}
                  <div className="relative w-full h-24 rounded-[1.8rem] overflow-hidden bg-white shadow-sm mb-3">
                    <img src={pet.imageUrl} alt={pet.name} className="w-full h-full object-cover" />
                  </div>

                  {/* Weight & Gender Row */}
                  <div className="flex justify-between items-center mb-1.5 px-1.5">
                    <span className="text-[9px] text-primary/60 font-bold flex items-center gap-0.5">
                      <AnalogScaleIcon size={12} />
                      {pet.weight || '-'} kg
                    </span>
                    {/* Fixed width container to align center with the heart button below */}
                    <div className="w-10 flex justify-center shrink-0">
                      <span className="text-[8px] font-black px-2 py-0.5 rounded-full bg-white/60 text-primary uppercase block text-center truncate">
                        {pet.gender || '-'}
                      </span>
                    </div>
                  </div>

                  {/* Name, Breed & Favorite Row */}
                  <div className="flex justify-between items-center px-1.5">
                    <div className="min-w-0 flex-1 pr-1">
                      <h4 className="font-black text-primary text-xs truncate uppercase tracking-tighter leading-tight">{pet.name}</h4>
                      <p className="text-[9px] font-bold text-primary/40 truncate uppercase tracking-tighter">{pet.breed}</p>
                    </div>
                    
                    {/* Fixed width container to align center with the gender badge above */}
                    <div className="w-10 flex justify-center shrink-0">
                      {onToggleFavorite && (
                        <button
                          onClick={(e) => onToggleFavorite(e, pet.id, !!pet.is_favorite)}
                          className="p-1 bg-white/80 backdrop-blur-sm rounded-full shadow-sm transition-all active:scale-110"
                        >
                          <Heart 
                            size={10} 
                            className={pet.is_favorite ? 'text-pink-500' : 'text-primary/20'}
                            fill={pet.is_favorite ? "currentColor" : "none"} 
                            strokeWidth={2.5} 
                          />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
          <motion.div 
            whileTap={{ scale: 0.95 }}
            onClick={onViewAll}
            className="flex-shrink-0 w-36 bg-surface-low p-4 rounded-[2.5rem] flex flex-col items-center justify-center text-center cursor-pointer opacity-50 hover:opacity-100 transition-all border-2 border-dashed border-primary/5"
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