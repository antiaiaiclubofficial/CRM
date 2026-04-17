"use client";

import React from 'react';
import { Crown, PawPrint, QrCode } from 'lucide-react';
import { motion } from 'framer-motion';

interface OwnerProfile {
  firstName: string;
  lastName: string;
  gender: string;
  age: string;
  phone: string;
  address: string;
  email: string;
}

interface MembershipCardProps {
  totalAccumulatedPoints: number;
  redeemablePoints: number;
  ownerProfile: OwnerProfile;
  onShowQR: () => void; // New prop
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
      className="relative overflow-hidden p-6 rounded-[2rem] bg-gradient-to-br from-[#FFD8E4] via-[#FFE3BC] to-[#B2F2BB] shadow-xl shadow-pink-100/50"
    >
      <PawPrint className="absolute -right-4 -top-4 w-32 h-32 text-white/20 rotate-12" />
      <PawPrint className="absolute -left-8 -bottom-8 w-24 h-24 text-white/10 -rotate-12" />

      <div className="relative z-10">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h2 className="text-sm font-medium text-slate-600">สมาชิกระดับ</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="bg-white/90 px-3 py-1 rounded-full text-xs font-bold text-amber-600 flex items-center gap-1">
                <Crown size={12} fill="currentColor" />
                {currentLevel.name.toUpperCase()}
              </span>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <p className="text-[10px] text-slate-500">ID: {ownerProfile.phone}</p>
            <p className="font-bold text-slate-800">คุณ{ownerProfile.firstName} {ownerProfile.lastName}</p>
            {/* Moved QR button to be under the name */}
            <motion.button 
              whileTap={{ scale: 0.9 }}
              onClick={onShowQR}
              className="mt-2 bg-white/90 p-2 rounded-2xl shadow-sm text-pink-500 hover:text-pink-600 transition-colors flex items-center gap-2 px-3"
            >
              <QrCode size={18} />
              <span className="text-[10px] font-bold">QR สมาชิก</span>
            </motion.button>
          </div>
        </div>

        <div className="flex justify-between items-end mb-4">
          <div>
            <p className="text-xs text-slate-600 mb-1">คะแนนปัจจุบันของคุณ</p>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-bold text-slate-800">{redeemablePoints.toLocaleString()}</span>
              <span className="text-sm text-slate-600">Points</span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-slate-500 mb-0.5">คะแนนสะสมทั้งหมด</p>
            <p className="text-sm font-bold text-slate-800">
              {totalAccumulatedPoints.toLocaleString()} / {nextLevel ? nextLevel.minPoints.toLocaleString() : 'MAX'} Points
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="w-full bg-white/40 h-3 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="bg-white h-full rounded-full"
            />
          </div>
          <p className="text-[10px] text-slate-600 text-center font-medium">
            {nextLevel ? (
              <>อีก {pointsToNextLevel} คะแนน เพื่อเลื่อนเป็น <span className="text-slate-800 font-bold">{nextLevel.name}</span></>
            ) : (
              <>คุณอยู่ในระดับสูงสุดแล้ว!</>
            )}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default MembershipCard;