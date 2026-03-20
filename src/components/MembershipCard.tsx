"use client";

import React from 'react';
import { Crown, PawPrint } from 'lucide-react';
import { motion } from 'framer-motion';

const MembershipCard = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden p-6 rounded-[2rem] bg-gradient-to-br from-[#FFD8E4] via-[#FFE3BC] to-[#B2F2BB] shadow-xl shadow-pink-100/50"
    >
      {/* Watermark Paw Prints */}
      <PawPrint className="absolute -right-4 -top-4 w-32 h-32 text-white/20 rotate-12" />
      <PawPrint className="absolute -left-8 -bottom-8 w-24 h-24 text-white/10 -rotate-12" />

      <div className="relative z-10">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h2 className="text-sm font-medium text-slate-600">สมาชิกระดับ</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="bg-white/90 px-3 py-1 rounded-full text-xs font-bold text-amber-600 flex items-center gap-1">
                <Crown size={12} fill="currentColor" />
                GOLD MEMBER
              </span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-500">ID: PET-8899</p>
            <p className="font-bold text-slate-800">คุณซาร่า เจน</p>
          </div>
        </div>

        <div className="mb-4">
          <p className="text-xs text-slate-600 mb-1">คะแนนสะสมของคุณ</p>
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-bold text-slate-800">1,250</span>
            <span className="text-sm text-slate-600">Points</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="w-full bg-white/40 h-3 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: '80%' }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="bg-white h-full rounded-full"
            />
          </div>
          <p className="text-[10px] text-slate-600 text-center font-medium">
            อีก 250 คะแนน เพื่อเลื่อนเป็น <span className="text-slate-800 font-bold">Platinum Member</span>
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default MembershipCard;