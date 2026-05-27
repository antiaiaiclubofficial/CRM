"use client";

import React from 'react';
import { Crown, PawPrint, QrCode, Zap, Star, Diamond } from 'lucide-react';
import { motion } from 'framer-motion';

interface MembershipCardProps {
  totalAccumulatedPoints: number;
  redeemablePoints: number;
  ownerProfile: any;
  onShowQR: () => void;
  onTierClick?: () => void;
}

const tiers = [
  { 
    id: 'bronze', 
    name: 'Bronze Tier', 
    minPoints: 0, 
    icon: <PawPrint size={12} />,
    bgClass: 'bg-gradient-to-br from-[#FFD8E4] to-[#FFA6C9]',
    textColor: 'text-slate-800',
    subTextColor: 'text-slate-600/70',
    badgeClass: 'bg-slate-800 text-white',
    progressTrack: 'bg-slate-800/10',
    progressFill: 'bg-pink-600 shadow-[0_0_10px_rgba(219,39,119,0.4)]',
    pointsColor: 'text-pink-600',
    qrBtnClass: 'bg-slate-800/10 border-slate-800/20 text-slate-800 hover:bg-slate-800/20'
  },
  { 
    id: 'silver', 
    name: 'Silver Tier', 
    minPoints: 300, 
    icon: <Star size={12} />,
    bgClass: 'bg-gradient-to-br from-[#B2F2BB] to-[#8ce99a]',
    textColor: 'text-slate-800',
    subTextColor: 'text-slate-600/70',
    badgeClass: 'bg-slate-800 text-white',
    progressTrack: 'bg-slate-800/10',
    progressFill: 'bg-emerald-600 shadow-[0_0_10px_rgba(5,150,105,0.4)]',
    pointsColor: 'text-emerald-600',
    qrBtnClass: 'bg-slate-800/10 border-slate-800/20 text-slate-800 hover:bg-slate-800/20'
  },
  { 
    id: 'gold', 
    name: 'Gold Tier', 
    minPoints: 700, 
    icon: <Crown size={12} />,
    bgClass: 'bg-gradient-to-br from-[#FFE3BC] to-[#ffd099]',
    textColor: 'text-slate-800',
    subTextColor: 'text-slate-600/70',
    badgeClass: 'bg-slate-800 text-white',
    progressTrack: 'bg-slate-800/10',
    progressFill: 'bg-amber-600 shadow-[0_0_10px_rgba(217,119,6,0.4)]',
    pointsColor: 'text-amber-600',
    qrBtnClass: 'bg-slate-800/10 border-slate-800/20 text-slate-800 hover:bg-slate-800/20'
  },
  { 
    id: 'platinum', 
    name: 'Platinum Tier', 
    minPoints: 1000, 
    icon: <Zap size={12} />,
    bgClass: 'bg-gradient-to-br from-[#BBDEFB] to-[#90caf9]',
    textColor: 'text-slate-800',
    subTextColor: 'text-slate-600/70',
    badgeClass: 'bg-slate-800 text-white',
    progressTrack: 'bg-slate-800/10',
    progressFill: 'bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.4)]',
    pointsColor: 'text-blue-600',
    qrBtnClass: 'bg-slate-800/10 border-slate-800/20 text-slate-800 hover:bg-slate-800/20'
  },
  { 
    id: 'vip', 
    name: 'VIP Tier', 
    minPoints: 2000, 
    icon: <Diamond size={12} />,
    bgClass: 'bg-gradient-to-br from-[#E1BEE7] to-[#ce93d8]',
    textColor: 'text-slate-800',
    subTextColor: 'text-slate-600/70',
    badgeClass: 'bg-slate-800 text-white',
    progressTrack: 'bg-slate-800/10',
    progressFill: 'bg-purple-600 shadow-[0_0_10px_rgba(147,51,234,0.4)]',
    pointsColor: 'text-purple-600',
    qrBtnClass: 'bg-slate-800/10 border-slate-800/20 text-slate-800 hover:bg-slate-800/20'
  },
];

const MembershipCard = ({ totalAccumulatedPoints, redeemablePoints, ownerProfile, onShowQR, onTierClick }: MembershipCardProps) => {
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
      className={`relative w-full aspect-[1.6/1] overflow-hidden p-6 rounded-3xl shadow-ambient border-none flex flex-col justify-between ${currentTier.bgClass}`}
    >
      {/* Liquid Background Elements */}
      <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-white/10 rounded-full blur-3xl" />
      <div className="absolute bottom-[-20%] left-[-10%] w-48 h-48 bg-white/5 rounded-full blur-2xl" />

      <div className="relative z-10 flex flex-col h-full justify-between">
        {/* Top Section */}
        <div className="flex justify-between items-start">
          {/* Left Side: Membership Status - Clickable */}
          <div 
            className="space-y-1 cursor-pointer active:scale-95 transition-transform" 
            onClick={onTierClick}
          >
            <p className={`text-[9px] font-bold uppercase tracking-widest ${currentTier.subTextColor}`}>Membership Status</p>
            <span className={`text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest shadow-sm inline-block ${currentTier.badgeClass}`}>
              {currentTier.name.toUpperCase()}
            </span>
          </div>
          
          {/* Right Side: Member ID and Name */}
          <div className="text-right space-y-0.5">
            <p className={`text-[9px] font-bold uppercase tracking-widest ${currentTier.subTextColor}`}>Member ID: {ownerProfile?.phone || 'N/A'}</p>
            <h2 className={`text-lg font-black drop-shadow-sm truncate max-w-[180px] ${currentTier.textColor}`}>
              {ownerProfile?.first_name} {ownerProfile?.last_name}
            </h2>
          </div>
        </div>

        {/* Bottom Group: Points & Progress */}
        <div className="flex flex-col space-y-2">
          {/* Points & Tier Display */}
          <div className="flex justify-between items-end">
            <div className="space-y-0.5">
              <p className={`text-[9px] font-bold uppercase tracking-widest ${currentTier.subTextColor}`}>คะแนนที่ใช้ได้ (Balance)</p>
              <div className="flex items-baseline gap-1.5">
                <span className={`text-4xl font-black leading-none tracking-tighter ${currentTier.textColor}`}>{redeemablePoints.toLocaleString()}</span>
                <span className={`text-[10px] font-black uppercase ${currentTier.subTextColor}`}>pts</span>
              </div>
            </div>
            <div className="text-right flex flex-col items-end">
              {/* QR Capsule Button */}
              <motion.button 
                whileTap={{ scale: 0.95 }}
                onClick={onShowQR}
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-black uppercase tracking-widest transition-colors ${currentTier.qrBtnClass}`}
              >
                <QrCode size={12} />
                <span className="text-[8px] font-black uppercase tracking-widest">My QR</span>
              </motion.button>
              
              <div 
                className={`flex items-center gap-1 justify-end mb-0.5 cursor-pointer active:scale-95 transition-transform ${currentTier.pointsColor}`}
                onClick={onTierClick}
              >
                {React.cloneElement(currentTier.icon as React.ReactElement, { fill: "currentColor" })}
                <span className="text-[9px] font-black uppercase tracking-widest">คะแนนสะสมทั้งหมด</span>
              </div>
              <p className={`text-sm font-black leading-none tracking-tighter ${currentTier.textColor}`}>{totalAccumulatedPoints.toLocaleString()}</p>
            </div>
          </div>

          {/* Progress Section */}
          <div className="space-y-2">
            <div className={`w-full h-1.5 rounded-full overflow-hidden ${currentTier.progressTrack}`}>
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className={`h-full rounded-full ${currentTier.progressFill}`}
              />
            </div>
            <div className="flex justify-center items-center text-center">
              <p className={`text-[11px] font-black uppercase tracking-tight ${currentTier.subTextColor}`}>
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