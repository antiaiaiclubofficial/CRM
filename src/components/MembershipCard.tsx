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
      className="relative overflow-hidden p-6 rounded-[2.5rem] bg-gradient-to-br from-[#FFD8E4] via-[#FFE3BC] to-[#B2F2BB] shadow-xl shadow-pink-100/50 border-2 border-white/50"
    >
      {/* Background Decorative Elements */}
      <PawPrint className="absolute -right-4 -top-4 w-32 h-32 text-white/20 rotate-12" />
      <PawPrint className="absolute -left-8 -bottom-8 w-24 h-24 text-white/10 -rotate-12" />

      <div className="relative z-10">
        {/* Top Header Row */}
        <div className="flex justify-between items-start mb-4">
          <div className="space-y-1">
            <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Membership Status</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="bg-white border-2 border-black px-4 py-1.5 rounded-full text-xs font-black text-slate-800 flex items-center gap-1.5 shadow-sm">
                <Crown size={14} className="text-amber-500" fill="currentColor" />
                {currentLevel.name.toUpperCase()}
              </span>
            </div>
          </div>
          <div className="flex flex-col items-end text-right">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Owner ID: {ownerProfile.phone || '0XX-XXX-XXXX'}</p>
            <p className="font-black text-slate-800 text-xl leading-tight drop-shadow-sm">{ownerProfile.firstName} {ownerProfile.lastName}</p>
          </div>
        </div>

        {/* Points & QR Section */}
        <div className="flex justify-between items-end mb-6">
          <div className="space-y-2">
            <p className="text-[11px] font-bold text-slate-600 uppercase tracking-tight">คะแนนสะสมปัจจุบัน</p>
            <div className="flex items-baseline gap-1.5">
              <span className="text-5xl font-black text-slate-800 leading-none">{redeemablePoints.toLocaleString()}</span>
              <span className="text-sm font-black text-slate-600 uppercase">Pts</span>
            </div>
            
            {/* EXPIRY BADGE - NEW DESIGN */}
            {ownerProfile.pointsExpiry && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-2 bg-pink-500 text-white px-3 py-1.5 rounded-2xl border-2 border-white shadow-md w-fit mt-2"
              >
                <Clock size={12} strokeWidth={3} />
                <span className="text-[10px] font-black uppercase tracking-tight">
                  หมดอายุ: {ownerProfile.pointsExpiry}
                </span>
              </motion.div>
            )}
          </div>

          <div className="flex flex-col items-end gap-3">
            <motion.button 
              whileTap={{ scale: 0.9 }}
              onClick={onShowQR}
              className="bg-white border-2 border-black p-2 rounded-2xl shadow-[4px_4px_0px_0px_#000] active:translate-y-1 active:shadow-none transition-all text-slate-800 flex items-center gap-2 px-4"
            >
              <QrCode size={18} />
              <span className="text-xs font-black uppercase">My QR</span>
            </motion.button>
            <div className="text-right">
              <p className="text-[9px] text-slate-500 mb-0.5 font-black uppercase tracking-widest">Total Points</p>
              <p className="text-sm font-black text-slate-800">
                {totalAccumulatedPoints.toLocaleString()} <span className="text-[10px] text-slate-400">/ {nextLevel ? nextLevel.minPoints.toLocaleString() : 'MAX'}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-3 bg-white/30 p-3 rounded-[1.5rem] border border-white/40">
          <div className="w-full bg-slate-200/50 h-3 rounded-full overflow-hidden border border-slate-300/30 p-0.5 shadow-inner">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="bg-gradient-to-r from-pink-400 to-amber-400 h-full rounded-full shadow-sm"
            />
          </div>
          <div className="flex justify-between items-center px-1">
            <p className="text-[10px] text-slate-700 font-bold uppercase tracking-tight">
              {nextLevel ? (
                <>อีก <span className="font-black text-pink-600">{pointsToNextLevel.toLocaleString()}</span> คะแนน เพื่อเลื่อนระดับ</>
              ) : (
                <span className="text-emerald-600 font-black">คุณอยู่ในระดับสูงสุดแล้ว! ✨</span>
              )}
            </p>
            {nextLevel && (
              <span className="text-[9px] font-black bg-white border border-black/10 px-2 py-0.5 rounded-lg text-slate-800">
                GOAL: {nextLevel.name}
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MembershipCard;