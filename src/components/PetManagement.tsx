"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { PawPrint, Plus, ArrowLeft, Heart, Sparkles } from 'lucide-react';

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
        /* Empty State - Redesigned according to DESIGN.md */
        <div className="relative py-12 px-4 flex flex-col items-center justify-center min-h-[55vh] overflow-hidden rounded-[3rem]">
          {/* Liquid Background Blobs for Empty State */}
          <div className="absolute top-[10%] left-[-10%] w-[200px] h-[200px] bg-[#FFD8E4] rounded-full blur-[60px] opacity-70 pointer-events-none" />
          <div className="absolute bottom-[10%] right-[-10%] w-[220px] h-[220px] bg-[#EAFD69] rounded-full blur-[70px] opacity-50 pointer-events-none" />

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", damping: 20 }}
            className="w-full max-w-sm bg-white/70 backdrop-blur-2xl p-8 rounded-[3rem] shadow-ambient border border-white/40 text-center space-y-8 relative z-10"
          >
            {/* Tactile Icon Container with Halo Effect */}
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-[#FFD8E4] rounded-[2.5rem] blur-xl opacity-60 scale-125 animate-pulse" />
              <div className="relative w-24 h-24 bg-gradient-to-br from-[#18234a] to-[#020d35] rounded-[2.5rem] flex items-center justify-center mx-auto shadow-ambient border border-white/20">
                <PawPrint size={44} className="text-[#EAFD69] animate-bounce" style={{ animationDuration: '3s' }} />
              </div>
              <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-pink-400 rounded-full flex items-center justify-center text-white shadow-ambient">
                <Heart size={16} className="fill-white" />
              </div>
            </div>

            {/* High-Contrast Typography */}
            <div className="space-y-3">
              <h3 className="text-2xl font-black text-[#020d35] tracking-tight flex items-center justify-center gap-2">
                ยังไม่มีสมาชิกสี่ขา <Sparkles size={20} className="text-[#EAFD69] fill-[#EAFD69]" />
              </h3>
              <p className="text-[#45464E] text-sm font-medium leading-relaxed max-w-[240px] mx-auto opacity-80">
                เพิ่มข้อมูลสัตว์เลี้ยงของคุณเพื่อรับการดูแลที่ตรงใจและบันทึกประวัติน้ำหนักที่นี่ค่ะ
              </p>
            </div>

            {/* Signature Navy Gradient Button with Lime Spark Accent */}
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
        /* Pet List Grid */
        <div className="grid grid-cols-1 gap-6">
          {pets.map((pet, index) => (
            <motion.div
              key={pet.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => onViewDetails(pet)}
              className="bg-white p-5 rounded-[2rem] shadow-ambient flex items-center gap-5 cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-all relative overflow-hidden group"
            >
              {/* Favorite Badge */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFavorite(pet.id, !!pet.is_favorite);
                }}
                className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-[#F9F9F9] flex items-center justify-center text-pink-500 shadow-sm active:scale-90 transition-all"
              >
                <Heart size={16} className={pet.is_favorite ? "fill-pink-500" : ""} />
              </button>

              {/* Pet Image */}
              <div className="w-20 h-20 rounded-2xl overflow-hidden bg-[#F3F3F3] shrink-0 border-2 border-white shadow-sm">
                {pet.imageUrl ? (
                  <img src={pet.imageUrl} alt={pet.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#18234a]/10 to-[#020d35]/10 text-[#020d35]/40">
                    <PawPrint size={28} />
                  </div>
                )}
              </div>

              {/* Pet Info */}
              <div className="min-w-0 flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-lg font-black text-[#020d35] truncate">{pet.name}</h4>
                  <span className="px-2.5 py-0.5 bg-[#F3F3F3] text-[#020d35] text-[10px] font-black rounded-full uppercase tracking-wider">
                    {pet.type === 'dog' ? 'สุนัข' : pet.type === 'cat' ? 'แมว' : 'อื่นๆ'}
                  </span>
                </div>
                <p className="text-xs font-bold text-[#45464E]/60 truncate">สายพันธุ์: {pet.breed || 'ไม่ระบุ'}</p>
                <p className="text-xs font-bold text-[#45464E]/60">น้ำหนัก: {pet.weight ? `${pet.weight} กก.` : 'ยังไม่ได้บันทึก'}</p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PetManagement;