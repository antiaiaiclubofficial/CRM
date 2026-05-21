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
    // Calculate progress as actual absolute ratio of current points to next goal
    progressPercentage = Math.min(100, Math.max(0, (totalAccumulatedPoints / nextTier.minPoints) * 100));
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
        {/* Top Section */}
        <div className="flex justify-between items-start">
          {/* Left Side: Membership Status */}
          <div className="space-y-1">
            <p className="text-[9px] font-bold text-white/50 uppercase tracking-widest">Membership Status</p>
            <span className="bg-tertiary text-primary text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest shadow-sm inline-block">
              {currentTier.name.toUpperCase()}
            </span>
          </div>
          
          {/* Right Side: Member ID and Name */}
          <div className="text-right space-y-0.5">
            <p className="text-[9px] font-bold text-white/50 uppercase tracking-widest">Member ID: {ownerProfile?.phone || 'N/A'}</p>
            <h2 className="text-lg font-black text-white drop-shadow-md truncate max-w-[180px]">
              {ownerProfile?.first_name} {ownerProfile?.last_name}
            </h2>
          </div>
        </div>

        {/* Bottom Group: Points & Progress */}
        <div className="flex flex-col">
          {/* Points & Tier Display */}
          <div className="flex justify-between items-end mb-1">
            <div className="space-y-0.5">
              <p className="text-[9px] font-bold text-white/50 uppercase tracking-widest">คะแนนที่ใช้ได้ (Balance)</p>
              <div className="flex items-baseline gap-1.5">
                <span className="text-4xl font-black text-tertiary leading-none tracking-tighter">{redeemablePoints.toLocaleString()}</span>
                <span className="text-[10px] font-black text-white/70 uppercase">pts</span>
              </div>
            </div>
            <div className="text-right flex flex-col items-end">
              {/* QR Capsule Button */}
              <motion.button 
                whileTap={{ scale: 0.95 }}
                onClick={onShowQR}
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-white mb-2 hover:bg-white/20 transition-colors"
              >
                <QrCode size={12} />
                <span className="text-[8px] font-black uppercase tracking-widest">My QR</span>
              </motion.button>
              
              <div className="flex items-center gap-1 justify-end text-tertiary mb-0.5">
                {React.cloneElement(currentTier.icon as React.ReactElement, { fill: "currentColor" })}
                <span className="text-[9px] font-black uppercase tracking-widest">คะแนนสะสมทั้งหมด</span>
              </div>
              <p className="text-sm font-black text-white leading-none tracking-tighter">{totalAccumulatedPoints.toLocaleString()}</p>
            </div>
          </div>

          {/* Progress Section (Distance ensured via mb-1 on div above) */}
          <div className="space-y-2">
            <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="bg-[#EAFD69] h-full rounded-full shadow-[0_0_12px_rgba(234,253,105,0.6)]"
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
      </div>
    </motion.div>
  );
};

export default MembershipCard;