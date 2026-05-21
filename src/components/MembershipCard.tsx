"use client";

import React from 'react';
import { Crown, PawPrint, QrCode, Zap, Star, Diamond } from 'lucide-react';
import { motion } from 'framer-motion';

interface MembershipCardProps {
  totalAccumulatedPoints: number;
  redeemablePoints: number;
  ownerProfile: any;
  onShowQR: () => void;
}

const tiers = [
  { id: 'bronze', name: 'Bronze Tier', minPoints: 0, icon: <PawPrint size={12} /> },
  { id: 'silver', name: 'Silver Tier', minPoints: 300, icon: <Star size={12} /> },
  { id: 'gold', name: 'Gold Tier', minPoints: 700, icon: <Crown size={12} /> },
  { id: 'platinum', name: 'Platinum Tier', minPoints: 1000, icon: <Zap size={12} /> },
  { id: 'vip', name: 'VIP Tier', minPoints: 2000, icon: <Diamond size={12} /> },
];

const MembershipCard = ({ totalAccumulatedPoints, redeemablePoints, ownerProfile, onShowQR }: MembershipCardProps) => {
  // Calculate current tier based on lifetime accumulated points
  const currentTier = [...tiers].reverse().find(t => totalAccumulatedPoints >= t.minPoints) || tiers[0];
  
  // Calculate next tier info
  const nextTierIndex = tiers.findIndex(t => t.id === currentTier.id) + 1;
  const nextTier = tiers[nextTierIndex];
  
  let progressPercentage = 100;
  let pointsNeeded = 0;
  
  if (nextTier) {
    pointsNeeded = nextTier.minPoints - totalAccumulatedPoints;
    const range = nextTier.minPoints - currentTier.minPoints;
    const progressInCurrentRange = totalAccumulatedPoints - currentTier.minPoints;
    progressPercentage = Math.min(100, Math.max(0, (progressInCurrentRange / range) * 100));
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative w-full aspect-[1.6/1] overflow-hidden p-6 rounded-3xl bg-liquid-primary shadow-ambient border-none flex flex-col justify-between"
    >
      {/* Liquid Background Elements */}
      <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-tertiary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-[-20%] left-[-10%] w-48 h-48 bg-white/5 rounded-full blur-2xl" />

      <div className="relative z-10 flex flex-col h-full justify-between">
        {/* Profile Info & QR */}
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <span className="bg-tertiary text-primary text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest shadow-sm">
              {currentTier.name.toUpperCase()}
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

        {/* Points & Tier Display */}
        <div className="flex justify-between items-end">
          <div className="space-y-0.5">
            <p className="text-[9px] font-bold text-white/50 uppercase tracking-widest">คะแนนที่ใช้ได้ (Balance)</p>
            <div className="flex items-baseline gap-1.5">
              <span className="text-4xl font-black text-tertiary leading-none tracking-tighter">{redeemablePoints.toLocaleString()}</span>
              <span className="text-[10px] font-black text-white/70 uppercase">pts</span>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1 justify-end text-tertiary mb-0.5">
              {React.cloneElement(currentTier.icon as React.ReactElement, { fill: "currentColor" })}
              <span className="text-[9px] font-black uppercase tracking-widest">คะแนนสะสมทั้งหมด</span>
            </div>
            <p className="text-xs font-bold text-white leading-none tracking-tighter">{totalAccumulatedPoints.toLocaleString()}</p>
          </div>
        </div>

        {/* Progress Section */}
        <div className="mt-3 space-y-2">
          <div className="w-full bg-white/10 h-2.5 rounded-full overflow-hidden p-[1.5px]">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="bg-tertiary h-full rounded-full shadow-[0_0_10px_rgba(234,253,105,0.4)]"
            />
          </div>
          <div className="flex justify-center items-center text-center">
            <p className="text-[11px] font-black text-white/70 uppercase tracking-tight">
              {nextTier 
                ? `สะสมอีก ${pointsNeeded.toLocaleString()} คะแนนเพื่อเลื่อนเป็น ${nextTier.name}`
                : 'ยินดีด้วย! คุณอยู่ในระดับสูงสุดแล้ว ✨'}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MembershipCard;