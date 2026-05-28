"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { PawPrint, Plus, ArrowLeft, Heart, Sparkles } from 'lucide-react';
import AnalogScaleIcon from './AnalogScaleIcon';

interface PetManagementProps {
  pets: any[];
  onBack: () => void;
  onViewDetails: (pet: any) => void;
  onAddPet: () => void;
  onToggleFavorite: (id: string | number, isFavorite: boolean) => void;
}

const PetManagement = ({ pets, onBack, onViewDetails, onAddPet, onToggleFavorite }: PetManagementProps) => {
  const hasPets = pets && pets.length > 0;

  return (
    <div className="space-y-8 relative min-h-[70vh]">
      {/* Header Area */}
      <div className="flex items-center justify-between gap-4">
        <button 
          onClick={onBack}
          className="w-12 h-12 rounded-2xl bg-white shadow-ambient flex items-center justify-center text-[#020d35] active:scale-95 transition-all shrink-0"
        >
          <ArrowLeft size={20} strokeWidth={2.5} />
        </button>
        <div className="flex-1 min-w-0 text-left">
          <h2 className="text-xl font-black text-[#020d35] tracking-tight uppercase">สัตว์เลี้ยงของฉัน</h2>
          <p className="text-[10px] font-black text-surface-variant opacity-40 uppercase tracking-[0.2em] mt-0.5">My Pets</p>
        </div>
        {hasPets ? (
          <button 
            onClick={onAddPet}
            className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#18234a] to-[#020d35] text-[#EAFD69] shadow-ambient flex items-center justify-center active:scale-95 transition-all shrink-0"
          >
            <Plus size={20} strokeWidth={3} />
          </button>
        ) : (
          <div className="w-12 shrink-0" /> /* Spacer */
        )}
      </div>

      {/* Content Area */}
      {!hasPets ? (
        /* Empty State */
        <div className="relative py-12 px-4 flex flex-col items-center justify-center min-h-[55vh] overflow-hidden rounded-[3rem]">
          <div className="absolute top-[10%] left-[-10%] w-[200px] h-[200px] bg-[#FFD8E4] rounded-full blur-[60px] opacity-70 pointer-events-none" />
          <div className="absolute bottom-[10%] right-[-10%] w-[220px] h-[220px] bg-[#EAFD69] rounded-full blur-[70px] opacity-50 pointer-events-none" />

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", damping: 20 }}
            className="w-full max-w-sm bg-white/70 backdrop-blur-2xl p-8 rounded-[3rem] shadow-ambient border border-white/40 text-center space-y-8 relative z-10"
          >
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-[#FFD8E4] rounded-[2.5rem] blur-xl opacity-60 scale-125 animate-pulse" />
              <div className="relative w-24 h-24 bg-gradient-to-br from-[#18234a] to-[#020d35] rounded-[2.5rem] flex items-center justify-center mx-auto shadow-ambient border border-white/20">
                <PawPrint size={44} className="text-[#EAFD69] animate-bounce" style={{ animationDuration: '3s' }} />
              </div>
              <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-pink-400 rounded-full flex items-center justify-center text-white shadow-ambient">
                <Heart size={16} className="fill-white" />
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-2xl font-black text-[#020d35] tracking-tight flex items-center justify-center gap-2">
                ยังไม่มีสมาชิกสี่ขา <Sparkles size={20} className="text-[#EAFD69] fill-[#EAFD69]" />
              </h3>
              <p className="text-[#45464E] text-sm font-medium leading-relaxed max-w-[240px] mx-auto opacity-80">
                เพิ่มข้อมูลสัตว์เลี้ยงของคุณเพื่อรับการดูแลที่ตรงใจและบันทึกประวัติน้ำหนักที่นี่ค่ะ
              </p>
            </div>

            <button 
              onClick={onAddPet}
              className="w-full py-4 bg-gradient-to-br from-[#18234a] to-[#020d35] text-white rounded-full font-black shadow-ambient active:scale-95 transition-all flex items-center justify-center gap-2 text-sm uppercase tracking-widest border-t border-white/10"
            >
              <Plus size={18} strokeWidth={3} className="text-[#EAFD69]" />
              เพิ่มสมาชิกคนสำคัญ
            </button>
          </motion.div>
        </div>
      ) : (
        /* Pet List Grid - 2 Columns Pastel Cards */
        <div className="grid grid-cols-2 gap-4">
          {pets.map((pet, index) => {
            const bgColor = pet.card_bg_color || pet.cardBgColor || '#FFD8E4';
            return (
              <motion.div
                key={pet.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => onViewDetails(pet)}
                className="relative w-full rounded-[2.5rem] p-4 shadow-ambient flex flex-col justify-between cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-all overflow-hidden"
                style={{ backgroundColor: bgColor }}
              >
                {/* Soft overlay to match the exact design */}
                <div className="absolute inset-0 bg-white/10 pointer-events-none" />

                <div className="relative z-10 flex flex-col h-full justify-between">
                  {/* Large White Rounded Image Container */}
                  <div className="relative w-full aspect-[4/3] rounded-[1.8rem] overflow-hidden bg-white shadow-sm mb-4">
                    {pet.imageUrl ? (
                      <img src={pet.imageUrl} alt={pet.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[#020d35]/20">
                        <PawPrint size={32} />
                      </div>
                    )}
                  </div>

                  {/* Weight & Gender Row */}
                  <div className="flex justify-between items-center mb-3 px-1">
                    <span className="text-xs text-[#020d35] font-bold flex items-center gap-1">
                      <AnalogScaleIcon size={14} className="text-[#020d35]/70" />
                      {pet.weight || '-'} kg
                    </span>
                    <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-white/80 text-[#020d35] uppercase">
                      {pet.gender || '-'}
                    </span>
                  </div>

                  {/* Name & Breed Row */}
                  <div className="flex justify-between items-end px-1">
                    <div className="min-w-0 flex-1 pr-2 text-left">
                      <h4 className="font-black text-[#020d35] text-lg truncate leading-tight">{pet.name}</h4>
                      <p className="text-xs font-bold text-[#020d35]/60 truncate mt-0.5">{pet.breed || 'ไม่ระบุ'}</p>
                    </div>
                    
                    {/* Favorite Heart Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(pet.id, !!pet.is_favorite);
                      }}
                      className="p-2 bg-white rounded-full shadow-sm active:scale-90 transition-all shrink-0"
                    >
                      <Heart 
                        size={14} 
                        className={pet.is_favorite ? "text-pink-500 fill-pink-500" : "text-slate-300"} 
                      />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PetManagement;