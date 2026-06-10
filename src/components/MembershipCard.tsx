"use client";

import React from 'react';
import { Crown, PawPrint, QrCode, Zap, Star, Diamond, Gem } from 'lucide-react';
import { motion } from 'framer-motion';

interface MembershipCardProps {
  totalAccumulatedPoints: number;
  redeemablePoints: number;
  ownerProfile: any;
  onShowQR: () => void;
  onTierClick?: () => void;
  tiers?: any[];
}

const iconMap: Record<string, any> = {
  PawPrint: <PawPrint size={10} />,
  Star: <Star size={10} />,
  Crown: <Crown size={10} />,
  Gem: <Gem size={10} />,
  Diamond: <Diamond size={10} />,
};

const defaultTiers = [
  { id: 'bronze', name: 'Bronze Tier', min_points: 0, icon_name: 'PawPrint', color_class: 'bg-[#FFD8E4]' },
  { id: 'silver', name: 'Silver Tier', min_points: 300, icon_name: 'Star', color_class: 'bg-[#B2F2BB]' },
  { id: 'gold', name: 'Gold Tier', min_points: 700, icon_name: 'Crown', color_class: 'bg-[#FFE3BC]' },
  { id: 'platinum', name: 'Platinum Tier', min_points: 1000, icon_name: 'Gem', color_class: 'bg-[#BBDEFB]' },
  { id: 'vip', name: 'VIP Tier', min_points: 2000, icon_name: 'Diamond', color_class: 'bg-[#E1BEE7]' },
];

const getTierColor = (tier: any) => {
  const key = (tier.tier_key || tier.id || '').toLowerCase();
  if (key.includes('bronze')) return '#FFD8E4';
  if (key.includes('silver')) return '#B2F2BB';
  if (key.includes('gold')) return '#FFE3BC';
  if (key.includes('platinum')) return '#BBDEFB';
  if (key.includes('vip')) return '#E1BEE7';
  
  // Fallback: try to parse hex from color_class (e.g. bg-[#FFD8E4])
  const match = tier.color_class?.match(/#([A-Fa-f0-9]{6})/);
  return match ? `#${match[1]}` : '#EAFD69';
};

const MembershipCard = ({ totalAccumulatedPoints, redeemablePoints, ownerProfile, onShowQR, onTierClick, tiers }: MembershipCardProps) => {
  const activeTiers = tiers && tiers.length > 0 ? tiers : defaultTiers;
  const sortedTiers = [...activeTiers].sort((a, b) => a.min_points - b.min_points);
  const N = sortedTiers.length;
  
  // Calculate current tier based on lifetime accumulated points
  const currentTier = [...sortedTiers].reverse().find(t => totalAccumulatedPoints >= t.min_points) || sortedTiers[0];
  
  // Calculate next tier info
  const nextTierIndex = sortedTiers.findIndex(t => t.tier_key === currentTier.tier_key || t.id === currentTier.id) + 1;
  const nextTier = sortedTiers[nextTierIndex];
  
  let pointsNeeded = 0;
  if (nextTier) {
    pointsNeeded = nextTier.min_points - totalAccumulatedPoints;
  }

  // Calculate overall progress percentage across milestones
  let overallProgress = 0;
  if (N > 1) {
    const lastTier = sortedTiers[N - 1];
    if (totalAccumulatedPoints >= lastTier.min_points) {
      overallProgress = 100;
    } else {
      // Find current segment
      let segmentIndex = 0;
      for (let i = 0; i < N - 1; i++) {
        if (totalAccumulatedPoints >= sortedTiers[i].min_points && totalAccumulatedPoints < sortedTiers[i + 1].min_points) {
          segmentIndex = i;
          break;
        }
      }
      const currentMin = sortedTiers[segmentIndex].min_points;
      const nextMin = sortedTiers[segmentIndex + 1].min_points;
      const segmentProgress = (totalAccumulatedPoints - currentMin) / (nextMin - currentMin);
      overallProgress = ((segmentIndex + segmentProgress) / (N - 1)) * 100;
    }
  } else {
    overallProgress = 100;
  }

  const currentTierColor = getTierColor(currentTier);

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
          {/* Left Side: Membership Status - Clickable */}
          <div 
            className="space-y-1 cursor-pointer active:scale-95 transition-transform" 
            onClick={onTierClick}
          >
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
        <div className="flex flex-col space-y-2">
          {/* Points & Tier Display */}
          <div className="flex justify-between items-end">
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
              
              <div 
                className="flex items-center gap-1 justify-end text-tertiary mb-0.5 cursor-pointer active:scale-95 transition-transform"
                onClick={onTierClick}
              >
                <span className="text-[9px] font-black uppercase tracking-widest">คะแนนสะสมทั้งหมด</span>
              </div>
              <p className="text-sm font-black text-white leading-none tracking-tighter">{totalAccumulatedPoints.toLocaleString()}</p>
            </div>
          </div>

          {/* Milestone Progress Section */}
          <div className="space-y-2">
            <div className="relative pt-3 pb-1">
              {/* Background Line */}
              <div className="absolute left-[12px] right-[12px] top-[24px] -translate-y-1/2 h-1 bg-white/10 rounded-full z-0" />
              
              {/* Active Progress Line */}
              <div className="absolute left-[12px] right-[12px] top-[24px] -translate-y-1/2 h-1 z-0 overflow-hidden rounded-full">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${overallProgress}%` }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="h-full rounded-full"
                  style={{ 
                    backgroundColor: currentTierColor,
                    boxShadow: `0 0 12px ${currentTierColor}99`
                  }}
                />
              </div>
              
              {/* Milestone Dots */}
              <div className="relative z-10 flex justify-between items-center">
                {sortedTiers.map((tier, index) => {
                  const isUnlocked = totalAccumulatedPoints >= tier.min_points;
                  const tierIcon = iconMap[tier.icon_name] || <PawPrint size={10} />;
                  const shortName = tier.name.split(' ')[0];
                  const tierColor = getTierColor(tier);
                  
                  return (
                    <div key={tier.id || tier.tier_key} className="flex flex-col items-center">
                      {/* Dot */}
                      <div 
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-500 ${
                          isUnlocked 
                            ? 'scale-110 text-[#020d35]' 
                            : 'bg-[#020d35] border-white/20 text-white/40'
                        }`}
                        style={isUnlocked ? {
                          backgroundColor: tierColor,
                          borderColor: tierColor,
                          boxShadow: `0 0 10px ${tierColor}66`
                        } : {}}
                      >
                        {React.cloneElement(tierIcon as React.ReactElement, { 
                          size: 10,
                          className: isUnlocked ? 'text-[#020d35]' : 'text-white/40'
                        })}
                      </div>
                      {/* Mini Label */}
                      <span 
                        className="text-[8px] font-black mt-1 transition-colors duration-500"
                        style={{ color: isUnlocked ? tierColor : 'rgba(255, 255, 255, 0.3)' }}
                      >
                        {shortName}
                      </span>
                    </div>
                  );
                })}
              </div>
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