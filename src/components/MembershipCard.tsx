"use client";

import React from 'react';
import { Crown, PawPrint, QrCode, Clock, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

interface MembershipCardProps {
  totalAccumulatedPoints: number;
  redeemablePoints: number;
  ownerProfile: any;
  onShowQR: () => void;
}

const MembershipCard = ({ totalAccumulatedPoints, redeemablePoints, ownerProfile, onShowQR }: MembershipCardProps) => {
  const progressPercentage = Math.min(100, (totalAccumulatedPoints / 2000) * 100);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative w-full aspect-[1.6/1] overflow-hidden p-8 rounded-3xl bg-liquid-primary shadow-ambient border-none flex flex-col justify-between"
    >
      {/* Liquid Elements */}
      <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-tertiary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-[-20%] left-[-10%] w-48 h-48 bg-white/5 rounded-full blur-2xl" />

      <div className="relative z-10 flex flex-col h-full justify-between">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <span className="bg-tertiary text-primary text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-sm">
              PREMIUM MEMBER
            </span>
            <h2 className="text-xl font-black text-white mt-2 drop-shadow-md">
              {ownerProfile?.first_name} {ownerProfile?.last_name}
            </h2>
          </div>
          <motion.button 
            whileTap={{ scale: 0.9 }}
            onClick={onShowQR}
            className="w-14 h-14 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 flex items-center justify-center text-white"
          >
            <QrCode size={28} />
          </motion.button>
        </div>

        <div className="flex justify-between items-end">
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Available Points</p>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-black text-tertiary leading-none tracking-tighter">{redeemablePoints.toLocaleString()}</span>
              <span className="text-xs font-black text-white/70 uppercase">pts</span>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1 justify-end text-tertiary mb-1">
              <Zap size={14} fill="currentColor" />
              <span className="text-[10px] font-black uppercase tracking-widest">Platinum Tier</span>
            </div>
            <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Total Earned: {totalAccumulatedPoints.toLocaleString()}</p>
          </div>
        </div>

        <div className="mt-4 space-y-2">
          <div className="w-full bg-white/10 h-3 rounded-full overflow-hidden p-[2px]">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="bg-tertiary h-full rounded-full shadow-[0_0_15px_rgba(234,253,105,0.5)]"
            />
          </div>
          <div className="flex justify-between items-center text-[10px] font-black text-white/50 uppercase tracking-tighter">
            <span>Progress to Next Tier</span>
            <span className="text-tertiary">{Math.round(progressPercentage)}% Complete</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MembershipCard;