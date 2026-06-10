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
  
  const match = tier.color_class?.match(/#([A-Fa-f0-9]{6})/);
  return match ? `#${match[1]}` : '#EAFD69';
};

const getTierGradient = (tier: any) => {
  const key = (tier.tier_key || tier.id || '').toLowerCase();
  if (key.includes('bronze')) return 'linear-gradient(135deg, #3b1424 0%, #15030a 100%)';
  if (key.includes('silver')) return 'linear-gradient(135deg, #11331d 0%, #030f07 100%)';
  if (key.includes('gold')) return 'linear-gradient(135deg, #382311 0%, #120a03 100%)';
  if (key.includes('platinum')) return 'linear-gradient(135deg, #112538 0%, #030b12 100%)';
  if (key.includes('vip')) return 'linear-gradient(135deg, #281138 0%, #0b0312 100%)';
  return 'linear-gradient(135deg, #18234a 0%, #020d35 100%)';
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

  const currentTierColor = getTierColor(currentTier);
  const currentTierGradient = getTierGradient(currentTier);

  // Find index of current tier for splitting past and future tiers
  const currentTierIdx = sortedTiers.findIndex(t => t.tier_key === currentTier.tier_key || t.id === currentTier.id);

  const pastTiers = sortedTiers.slice(0, currentTierIdx);
  const futureTiers = sortedTiers.slice(currentTierIdx + 1);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative w-full min-h-[250px] overflow-hidden py-5 px-6 rounded-3xl shadow-ambient border-none flex flex-col justify-between transition-all duration-500"
      style={{ background: currentTierGradient }}
    >
      {/* Liquid Background Elements with Dynamic Tier Color */}
      <div 
        className="absolute top-[-20%] right-[-10%] w-64 h-64 rounded-full blur-3xl opacity-20 transition-all duration-500" 
        style={{ backgroundColor: currentTierColor }}
      />
      <div className="absolute bottom-[-20%] left-[-10%] w-48 h-48 bg-white/5 rounded-full blur-2xl" />

      <div className="relative z-10 flex flex-col h-full justify-between space-y-4">
        {/* Top Section */}
        <div className="flex justify-between items-start">
          {/* Left Side: Membership Status - Clickable */}
          <div 
            className="space-y-1 cursor-pointer active:scale-95 transition-transform" 
            onClick={onTierClick}
          >
            <p className="text-[9px] font-bold text-white/50 uppercase tracking-widest">Membership Status</p>
            <span 
              className="text-primary text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest shadow-sm inline-block transition-colors duration-500"
              style={{ backgroundColor: currentTierColor }}
            >
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
        <div className="flex flex-col space-y-3">
          {/* Points & Tier Display */}
          <div className="flex justify-between items-end">
            <div className="space-y-0.5">
              <p className="text-[9px] font-bold text-white/50 uppercase tracking-widest">คะแนนที่ใช้ได้ (Balance)</p>
              <div className="flex items-baseline gap-1.5">
                <span 
                  className="text-4xl font-black leading-none tracking-tighter transition-colors duration-500"
                  style={{ color: currentTierColor }}
                >
                  {redeemablePoints.toLocaleString()}
                </span>
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
                className="flex items-center gap-1 justify-end mb-0.5 cursor-pointer active:scale-95 transition-transform"
                onClick={onTierClick}
                style={{ color: currentTierColor }}
              >
                <span className="text-[9px] font-black uppercase tracking-widest">คะแนนสะสมทั้งหมด</span>
              </div>
              <p className="text-sm font-black text-white leading-none tracking-tighter">{totalAccumulatedPoints.toLocaleString()}</p>
            </div>
          </div>

          {/* Milestone Progress Section */}
          <div className="space-y-2 pt-1">
            <div className="relative pt-2 pb-1">
              {/* Milestone Stack Layout */}
              <div className="relative z-10 flex items-center justify-between w-full">
                
                {/* 1. Past Tiers Stack (Completed) */}
                <div className="flex items-center shrink-0">
                  <div className="flex items-center -space-x-2">
                    {pastTiers.map((tier, idx) => {
                      const tierColor = getTierColor(tier);
                      const tierIcon = iconMap[tier.icon_name] || <PawPrint size={8} />;
                      return (
                        <div 
                          key={tier.id || tier.tier_key} 
                          className="w-6 h-6 rounded-full border border-white/20 flex items-center justify-center shadow-md relative"
                          style={{ backgroundColor: tierColor, zIndex: idx }}
                        >
                          {React.cloneElement(tierIcon as React.ReactElement, { 
                            size: 9,
                            className: 'text-[#020d35]'
                          })}
                        </div>
                      );
                    })}
                  </div>
                  {pastTiers.length > 0 && (
                    <span className="text-[8px] font-black text-white/40 ml-2 uppercase tracking-wider">
                      Passed
                    </span>
                  )}
                </div>

                {/* 2. Active Connector Line (Glowing) */}
                <div className="flex-1 mx-3 h-0.5 bg-white/10 relative overflow-hidden rounded-full">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    className="h-full"
                    style={{ 
                      backgroundColor: currentTierColor,
                      boxShadow: `0 0 8px ${currentTierColor}`
                    }}
                  />
                </div>

                {/* 3. Current Tier (Magnified Focus) */}
                <div className="flex flex-col items-center shrink-0 z-20 scale-125 mx-1">
                  <div 
                    className="w-7 h-7 rounded-full border-2 border-white ring-4 ring-white/30 flex items-center justify-center shadow-lg"
                    style={{ 
                      backgroundColor: currentTierColor,
                      boxShadow: `0 0 15px ${currentTierColor}`
                    }}
                  >
                    {React.cloneElement((iconMap[currentTier.icon_name] || <PawPrint />) as React.ReactElement, { 
                      size: 11,
                      className: 'text-[#020d35]'
                    })}
                  </div>
                  <span 
                    className="text-[8px] mt-2 font-black uppercase tracking-wider"
                    style={{ color: currentTierColor }}
                  >
                    {currentTier.name.split(' ')[0]}
                  </span>
                </div>

                {/* 4. Locked Connector Line (Dashed) */}
                <div className="flex-1 mx-3 h-px border-t border-dashed border-white/20" />

                {/* 5. Future Tiers Stack (Locked) */}
                <div className="flex items-center shrink-0">
                  {futureTiers.length > 0 && (
                    <span className="text-[8px] font-black text-white/20 mr-2 uppercase tracking-wider">
                      Locked
                    </span>
                  )}
                  <div className="flex items-center -space-x-2">
                    {futureTiers.map((tier, idx) => {
                      const tierIcon = iconMap[tier.icon_name] || <PawPrint size={8} />;
                      return (
                        <div 
                          key={tier.id || tier.tier_key} 
                          className="w-6 h-6 rounded-full bg-[#020d35] border border-white/10 flex items-center justify-center relative"
                          style={{ zIndex: idx }}
                        >
                          {React.cloneElement(tierIcon as React.ReactElement, { 
                            size: 9,
                            className: 'text-white/20'
                          })}
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>
            </div>

            <div className="flex justify-center items-center text-center pt-1">
              <p className="text-[10px] font-black text-white/70 uppercase tracking-tight">
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