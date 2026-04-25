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
  rawPointsExpiry?: string;
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

  // Logic to calculate points expiring within 30 days
  const getExpiringPointsInfo = () => {
    if (!ownerProfile.rawPointsExpiry) return null;
    
    const expiryDate = new Date(ownerProfile.rawPointsExpiry);
    const now = new Date();
    const thirtyDaysFromNow = new Date(now.getTime() + (30 * 24 * 60 * 60 * 1000));
    
    // If expiry is within 30 days
    if (expiryDate <= thirtyDaysFromNow && expiryDate > now) {
      return {
        points: redeemablePoints, // Since we only have one expiry date per profile, all current points are expiring
        daysRemaining: Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
      };
    }
    return null;
  };

  const expiringInfo = getExpiringPointsInfo();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative w-full aspect-[1.58/1] overflow-hidden p-5 rounded-[1.5rem] bg-gradient-to-br from-[#FFD8E4] via-[#FFE3BC] to-[#B2F2BB] shadow-xl shadow-pink-100/50 border-[3px] border-white/100 flex flex-col justify-between"
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
              <span className="bg-white/60 px-2.5 py-0.5 rounded-full text-[9px] font-black text-slate-800 flex items-center gap-1.5 whitespace-nowrap">
                <Crown size={10} className="text-amber-500" fill="currentColor" />
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
            
            {/* EXPIRY INFO - Updated with 30-day logic */}
            <div className="mt-1">
              {expiringInfo ? (
                <div className="flex items-center gap-1 text-red-600 font-black animate-pulse">
                   <Clock size={10} strokeWidth={3} />
                   <span className="text-[8px] uppercase tracking-tight">
                     อีก {expiringInfo.points.toLocaleString()} คะแนน จะหมดอายุใน {expiringInfo.daysRemaining} วัน
                   </span>
                </div>
              ) : ownerProfile.pointsExpiry && (
                <div className="flex items-center gap-1 text-pink-600">
                  <Clock size={10} strokeWidth={3} />
                  <span className="text-[8px] font-black uppercase tracking-tight">
                    หมดอายุ: {ownerProfile.pointsExpiry}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col items-end gap-2">
            <motion.button 
              whileTap={{ scale: 0.9 }}
              onClick={onShowQR}
              className="bg-white py-1.5 px-3 rounded-xl shadow-sm border border-white/30 transition-all text-slate-800 flex items-center gap-1"
            >
              <QrCode size={13} />
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

        {/* Progress Bar - Thicker design */}
        <div className="mt-2 space-y-1.5">
          <div className="w-full bg-black/5 h-4 rounded-full overflow-hidden p-0.5 border border-white/30">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="bg-white h-full rounded-full shadow-sm"
            />
          </div>
          <div className="flex justify-center items-center px-0.5 translate-y-[2px]">
            <p className="text-[8px] font-bold text-slate-600 uppercase tracking-tight text-center">
              {nextLevel ? (
                <>สะสมอีก <span className="text-black font-black underline">{pointsToNextLevel.toLocaleString()}</span> คะแนน เพื่อเลื่อนระดับเป็น <span className="text-black font-black">{nextLevel.name}</span></>
              ) : (
                <span className="text-emerald-600 font-black">คุณอยู่ในระดับสูงสุดแล้ว! ✨</span>
              )}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MembershipCard;