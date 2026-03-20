"use client";

import React from 'react';
import { Crown, PawPrint } from 'lucide-react';
import { motion } from 'framer-motion';

const MembershipCard = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative overflow-hidden p-8 rounded-[2.5rem] bg-gradient-to-br from-[#FFB8D1] via-[#FFD39A] to-[#A2E9AF] shadow-2xl shadow-pink-200/40 border-4 border-white/50"
    >
      {/* Background Decor */}
      <PawPrint className="absolute -right-6 -top-6 w-40 h-40 text-white/25 rotate-12" />
      
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-10">
          <div>
            <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider">ระดับสมาชิก</h2>
            <div className="flex items-center gap-2 mt-2">
              <span className="bg-amber-500 px-4 py-1.5 rounded-full text-sm font-black text-white flex items-center gap-2 shadow-sm">
                <Crown size={16} fill="white" />
                GOLD MEMBER
              </span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-bold text-slate-600 bg-white/40 px-2 py-0.5 rounded-md inline-block">ID: PET-8899</p>
            <p className="text-xl font-black text-slate-900 mt-1">คุณซาร่า เจน</p>
          </div>
        </div>

        <div className="mb-6">
          <p className="text-sm font-bold text-slate-700 mb-1">คะแนนสะสมปัจจุบัน</p>
          <div className="flex items-baseline gap-2">
            <span className="text-6xl font-black text-slate-900 drop-shadow-sm">1,250</span>
            <span className="text-lg font-bold text-slate-700">แต้ม</span>
          </div>
        </div>

        <div className="space-y-3">
          <div className="w-full bg-black/10 h-5 rounded-full overflow-hidden border-2 border-white/30">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: '80%' }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="bg-white h-full rounded-full shadow-[0_0_15px_rgba(255,255,255,0.8)]"
            />
          </div>
          <div className="flex justify-between items-center px-1">
            <p className="text-xs text-slate-800 font-bold">
              อีก <span className="text-pink-600 text-sm font-black underline decoration-2 underline-offset-2">250 แต้ม</span> เพื่อเลื่อนระดับ
            </p>
            <span className="text-xs font-black text-slate-700">PLATINUM</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MembershipCard;