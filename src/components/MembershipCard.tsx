"use client";

import React from 'react';
import { Crown, PawPrint, QrCode, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

interface OwnerProfile {
  firstName: string;
  lastName: string;
  gender: string;
  age: string;
  phone: string;
  address: string;
  email: string;
  pointsExpiry?: string;
}

interface MembershipCardProps {
  totalAccumulatedPoints: number;
  redeemablePoints: number;
  ownerProfile: OwnerProfile;
  onShowQR: () => void;
}

const membershipTiers = [
  { id: 'bronze', name: 'Bronze Member', minPoints: 0 },
  { id: 'silver', name: 'Silver Member', minPoints: 300 },
  { id: 'gold', name: 'Gold Member', minPoints: 700 },
  { id: 'platinum', name: 'Platinum Member', minPoints: 1000 },
  { id: 'vip', name: 'VIP Member', minPoints: 2000 },
];

const MembershipCard = ({ totalAccumulatedPoints, redeemablePoints, ownerProfile, onShowQR }: MembershipCardProps) => {
  const sortedTiers = [...membershipTiers].sort((a, b) => a.minPoints - b.minPoints);

  let currentLevel = sortedTiers[0];
  let nextLevel: typeof membershipTiers[0] | null = null;

  for (let i = 0; i < sortedTiers.length; i++) {
    if (totalAccumulatedPoints >= sortedTiers[i].minPoints) {
      currentLevel = sortedTiers[i];
    } else {
      nextLevel = sortedTiers[i];
      break;
    }
  }

  const pointsToNextLevel = nextLevel ? nextLevel.minPoints - totalAccumulatedPoints : 0;
  
  let progressPercentage = 0;
  if (nextLevel) {
    progressPercentage = (totalAccumulatedPoints / nextLevel.minPoints) * 100;
  } else {
    progressPercentage = 100;
  }
  progressPercentage = Math.min(100, Math.max(0, progressPercentage));

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative w-full aspect-[1.58/1] overflow-hidden p-5 rounded-[1.5rem] bg-gradient-to-br from-[#FFD8E4] via-[#FFE3BC] to-[#B2F2BB] shadow-xl shadow-pink-100/50 border-2 border-white/50 flex flex-col justify-between"
    >
      {/* Background Decorative Elements */}
      <PawPrint className="absolute -right-4 -top-4 w-28 h-28 text-white/20 rotate-12" />
      <PawPrint className="absolute -left-8 -bottom-8 w-20 h-20 text-white/10 -rotate-12" />

      <div className="relative z-10 flex flex-col h-full justify-between">
        {/* Top Header Row - Fixed to 1 line */}
        <div className="flex justify-between items-start gap-2">
          <div className="space-y-1 min-w-0 flex-1">
            <h2 className="text-[9px] font-black text-slate-500 uppercase tracking-widest truncate">Membership Status</h2>
            <div className="flex items-center mt-0.5">
              <span className="bg-white border-2 border-black px-3 py-1 rounded-full text-[10px] font-black text-slate-800 flex items-center gap-1.5 shadow-sm whitespace-nowrap">
                <Crown size={12} className="text-amber-500" fill="currentColor" />
                {currentLevel.name.toUpperCase()}
              </span>
            </div>
          </div>
          <div className="flex flex-col items-end text-right min-w-0 flex-1">
            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-0.5 whitespace-nowrap">
              Owner ID: {ownerProfile.phone || '0XX-XXX-XXXX'}
            </p>
            <p className="font-black text-slate-800 text-lg leading-tight drop-shadow-sm truncate w-full">
              {ownerProfile.firstName} {ownerProfile.lastName}
            </p>
          </div>
        </div>

        {/* Points & QR Section */}
        <div className="flex justify-between items-end">
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-slate-600 uppercase tracking-tight">คะแนนสะสมปัจจุบัน</p>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-black text-slate-800 leading-none">{redeemablePoints.toLocaleString()}</span>
              <span className="text-[10px] font-black text-slate-600 uppercase">Pts</span>
            </div>
            
            {/* EXPIRY BADGE */}
            {ownerProfile.pointsExpiry && (
              <div className="flex items-center gap-1.5 bg-pink-500 text-white px-2 py-1 rounded-xl border border-white shadow-sm w-fit mt-1">
                <Clock size={10} strokeWidth={3} />
                <span className="text-[8px] font-black uppercase tracking-tight whitespace-nowrap">
                  หมดอายุ: {ownerProfile.pointsExpiry}
                </span>
              </div>
            )}
          </div>

          <div className="flex flex-col items-end gap-2">
            <motion.button 
              whileTap={{ scale: 0.9 }}
              onClick={onShowQR}
              className="bg-white border-2 border-black p-1.5 rounded-xl shadow-[3px_3px_0px_0px_#000] active:translate-y-0.5 active:shadow-none transition-all text-slate-800 flex items-center gap-1.5 px-3"
            >
              <QrCode size={14} />
              <span className="text-[9px] font-black uppercase whitespace-nowrap">My QR</span>
            </motion.button>
            <div className="text-right">
              <p className="text-[8px] text-slate-500 font-black uppercase tracking-widest">Total Points</p>
              <p className="text-[11px] font-black text-slate-800 whitespace-nowrap">
                {totalAccumulatedPoints.toLocaleString()} <span className="text-[9px] text-slate-400">/ {nextLevel ? nextLevel.minPoints.toLocaleString() : 'MAX'}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Progress Bar - Original Brutalist Style */}
        <div className="mt-2 space-y-1.5">
          <div className="w-full bg-white/40 border border-black/10 h-2.5 rounded-full overflow-hidden p-0.5">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="bg-black h-full rounded-full"
            />
          </div>
          <div className="flex justify-between items-center px-0.5">
            <p className="text-[8px] font-bold text-slate-600 uppercase tracking-tight">
              {nextLevel ? (
                <>อีก <span className="text-black font-black underline">{pointsToNextLevel.toLocaleString()}</span> คะแนน เพื่อเลื่อนระดับ</>
              ) : (
                <span className="text-emerald-600 font-black">ระดับสูงสุดแล้ว! ✨</span>
              )}
            </p>
            {nextLevel && (
              <span className="text-[7px] font-black text-slate-400 uppercase tracking-widest">
                Target: {nextLevel.name}
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MembershipCard;