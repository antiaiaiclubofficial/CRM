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
      className="relative w-full aspect-[1.6/1] overflow-hidden p-6 rounded-3xl bg-liquid-primary shadow-ambient border-none flex flex-col justify-between"
    >
      {/* Liquid Elements */}
      <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-tertiary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-[-20%] left-[-10%] w-48 h-48 bg-white/5 rounded-full blur-2xl" />

      <div className="relative z-10 flex flex-col h-full justify-between">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <span className="bg-tertiary text-primary text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest shadow-sm">
              PREMIUM MEMBER
            </span>
            <h2 className="text-lg font-black text-white mt-1.5 drop-shadow-md">
              {ownerProfile?.first_name} {ownerProfile?.last_name}
            </h2>
          </div>
          <motion.button 
            whileTap={{ scale: 0.9 }}
            onClick={onShowQR}
            className="w-12 h-12 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 flex items-center justify-center text-white"
          >
            <QrCode size={24} />
          </motion.button>
        </div>

        <div className="flex justify-between items-end">
          <div className="space-y-0.5">
            <p className="text-[9px] font-bold text-white/50 uppercase tracking-widest">Available Points</p>
            <div className="flex items-baseline gap-1.5">
              <span className="text-4xl font-black text-tertiary leading-none tracking-tighter">{redeemablePoints.toLocaleString()}</span>
              <span className="text-[10px] font-black text-white/70 uppercase">pts</span>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1 justify-end text-tertiary mb-0.5">
              <Zap size={12} fill="currentColor" />
              <span className="text-[9px] font-black uppercase tracking-widest">Platinum Tier</span>
            </div>
            <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest">Total Earned: {totalAccumulatedPoints.toLocaleString()}</p>
          </div>
        </div>

        <div className="mt-3 space-y-1.5">
          <div className="w-full bg-white/10 h-2.5 rounded-full overflow-hidden p-[1.5px]">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="bg-tertiary h-full rounded-full shadow-[0_0_10px_rgba(234,253,105,0.4)]"
            />
          </div>
          <div className="flex justify-between items-center text-[9px] font-black text-white/50 uppercase tracking-tighter">
            <span>Next Tier Progress</span>
            <span className="text-tertiary">{Math.round(progressPercentage)}%</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MembershipCard;