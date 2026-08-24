"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Ticket, Scissors, Sparkles, Gift, ShowerHead, Leaf, Hand, Tag, Heart, 
  History, Crown, PawPrint, Award, LucideIcon, Zap, Clock, ChevronRight,
  Coins, CheckCircle2, AlertCircle, ArrowRight, Box, Play, Star, Diamond, X
} from 'lucide-react';

interface Coupon {
  id: string | number;
  title: string;
  description: string;
  value: string;
  type: string;
  expiry: string;
  iconName: string;
  color: string;
  bg: string;
  pointsRequired: number;
  is_deal?: boolean;
}

interface PromotionsProps {
  userPoints: number;
  totalAccumulatedPoints: number;
  collectedCoupons: any[];
  usedOrExpiredCoupons: any[];
  redeemableTemplates: any[];
  dealTemplates: any[];
  packageTemplates: any[];
  customerPackages: any[];
  onRedeemCoupon: (template: any, pointsCost: number) => void;
  onBuyDeal: (template: any, pointsCost: number) => void;
  onBuyPackage: (template: any) => void;
  onUseCoupon: (coupon: any) => void;
  onUsePackage: (pkg: any) => void;
  tiers?: any[];
  activeSubTab?: 'redeem' | 'my-coupons' | 'my-packages';
  onSubTabChange?: (tab: 'redeem' | 'my-coupons' | 'my-packages') => void;
}

const iconMap: Record<string, LucideIcon> = {
  Scissors, Sparkles, Gift, Ticket, ShowerHead, Leaf, Hand, Tag, Heart, History, Crown, PawPrint, Award, Zap
};

const getIconComponent = (iconName: string, size: number, className?: string) => {
  const IconComponent = iconMap[iconName] || Ticket;
  return <IconComponent size={size} className={className} />;
};

const defaultTiers = [
  { 
    id: 'bronze', 
    tier_key: 'bronze',
    name: 'Bronze Tier', 
    min_points: 0, 
    icon_name: 'PawPrint',
    color_class: 'bg-[#FFD8E4]',
    bgClass: 'from-[#FFD8E4] to-[#FFA6C9]',
    textColor: 'text-slate-800',
    subTextColor: 'text-slate-600/70',
    badgeClass: 'bg-slate-800 text-white',
    iconColor: 'text-pink-600',
    iconBg: 'bg-slate-800/10'
  },
  { 
    id: 'silver', 
    tier_key: 'silver',
    name: 'Silver Tier', 
    min_points: 300, 
    icon_name: 'Star',
    color_class: 'bg-[#B2F2BB]',
    bgClass: 'from-[#B2F2BB] to-[#8ce99a]',
    textColor: 'text-slate-800',
    subTextColor: 'text-slate-600/70',
    badgeClass: 'bg-slate-800 text-white',
    iconColor: 'text-emerald-600',
    iconBg: 'bg-slate-800/10'
  },
  { 
    id: 'gold', 
    tier_key: 'gold',
    name: 'Gold Tier', 
    min_points: 700, 
    icon_name: 'Crown',
    color_class: 'bg-[#FFE3BC]',
    bgClass: 'from-[#FFE3BC] to-[#ffd099]',
    textColor: 'text-slate-800',
    subTextColor: 'text-slate-600/70',
    badgeClass: 'bg-slate-800 text-white',
    iconColor: 'text-amber-600',
    iconBg: 'bg-slate-800/10'
  },
  { 
    id: 'platinum', 
    tier_key: 'platinum',
    name: 'Platinum Tier', 
    min_points: 1000, 
    icon_name: 'Gem',
    color_class: 'bg-[#BBDEFB]',
    bgClass: 'from-[#BBDEFB] to-[#90caf9]',
    textColor: 'text-slate-800',
    subTextColor: 'text-slate-600/70',
    badgeClass: 'bg-slate-800 text-white',
    iconColor: 'text-blue-600',
    iconBg: 'bg-slate-800/10'
  },
  { 
    id: 'vip', 
    tier_key: 'vip',
    name: 'VIP Tier', 
    min_points: 2000, 
    icon_name: 'Diamond',
    color_class: 'bg-[#E1BEE7]',
    bgClass: 'from-[#E1BEE7] to-[#ce93d8]',
    textColor: 'text-slate-800',
    subTextColor: 'text-slate-600/70',
    badgeClass: 'bg-slate-800 text-white',
    iconColor: 'text-purple-600',
    iconBg: 'bg-slate-800/10'
  },
];

const tierStyleMap: Record<string, any> = {
  bronze: {
    bgClass: 'from-[#FFD8E4] to-[#FFA6C9]',
    textColor: 'text-slate-800',
    subTextColor: 'text-slate-600/70',
    badgeClass: 'bg-slate-800 text-white',
    iconColor: 'text-pink-600',
    iconBg: 'bg-slate-800/10'
  },
  silver: {
    bgClass: 'from-[#B2F2BB] to-[#8ce99a]',
    textColor: 'text-slate-800',
    subTextColor: 'text-slate-600/70',
    badgeClass: 'bg-slate-800 text-white',
    iconColor: 'text-emerald-600',
    iconBg: 'bg-slate-800/10'
  },
  gold: {
    bgClass: 'from-[#FFE3BC] to-[#ffd099]',
    textColor: 'text-slate-800',
    subTextColor: 'text-slate-600/70',
    badgeClass: 'bg-slate-800 text-white',
    iconColor: 'text-amber-600',
    iconBg: 'bg-slate-800/10'
  },
  platinum: {
    bgClass: 'from-[#BBDEFB] to-[#90caf9]',
    textColor: 'text-slate-800',
    subTextColor: 'text-slate-600/70',
    badgeClass: 'bg-slate-800 text-white',
    iconColor: 'text-blue-600',
    iconBg: 'bg-slate-800/10'
  },
  vip: {
    bgClass: 'from-[#E1BEE7] to-[#ce93d8]',
    textColor: 'text-slate-800',
    subTextColor: 'text-slate-600/70',
    badgeClass: 'bg-slate-800 text-white',
    iconColor: 'text-purple-600',
    iconBg: 'bg-slate-800/10'
  }
};

const Promotions = ({ 
  userPoints, 
  totalAccumulatedPoints,
  collectedCoupons, 
  usedOrExpiredCoupons, 
  redeemableTemplates,
  dealTemplates,
  packageTemplates,
  customerPackages,
  onRedeemCoupon, 
  onBuyDeal,
  onBuyPackage,
  onUseCoupon,
  onUsePackage,
  tiers,
  activeSubTab,
  onSubTabChange
}: PromotionsProps) => {
  const [showCouponsModal, setShowCouponsModal] = useState(false);
  const [showPackagesModal, setShowPackagesModal] = useState(false);
  const [activeCategory, setActiveCategory] = useState<'all' | 'packages' | 'deals' | 'redeem'>('all');
  const [couponFilter, setCouponFilter] = useState<'unused' | 'used'>('unused');
  const carouselRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      if (carouselRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
        if (scrollLeft + clientWidth >= scrollWidth - 10) {
          carouselRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          carouselRef.current.scrollBy({ left: clientWidth * 0.85, behavior: 'smooth' });
        }
      }
    }, 4000); // Auto scroll every 4 seconds

    return () => clearInterval(interval);
  }, []);

  const toggleCategory = (cat: 'packages' | 'deals' | 'redeem') => {
    setActiveCategory(prev => prev === cat ? 'all' : cat);
  };

  const specialPromos = redeemableTemplates.filter(t => t.pointsRequired === 0);
  const regularRedeemables = redeemableTemplates.filter(t => t.pointsRequired > 0);

  const activeTiers = tiers && tiers.length > 0 ? tiers : defaultTiers;

  // Calculate current tier based on lifetime accumulated points
  const currentTier = [...activeTiers].reverse().find(t => totalAccumulatedPoints >= t.min_points) || activeTiers[0];
  
  // Get style config for current tier
  const styleConfig = tierStyleMap[currentTier.tier_key] || tierStyleMap.bronze;
  const IconComponent = iconMap[currentTier.icon_name] || PawPrint;

  return (
    <div className="space-y-6 pb-24">
      {/* Super Sleek & Compact Points Status Bar - Dynamic Tier Styling */}
      <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-r py-3.5 px-5 shadow-ambient border border-white/20 flex items-center justify-between ${styleConfig.bgClass}`}>
        {/* Subtle background glow */}
        <div className="absolute right-0 top-0 w-24 h-24 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="flex items-center gap-3 relative z-10">
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center border border-slate-800/10 ${styleConfig.iconBg} ${styleConfig.iconColor}`}>
            <Coins size={16} className="animate-pulse" />
          </div>
          <div>
            <p className={`text-[9px] font-bold uppercase tracking-widest ${styleConfig.subTextColor}`}>คะแนนสะสมของคุณ</p>
            <div className="flex items-baseline gap-1">
              <span className={`text-xl font-black tracking-tight leading-none ${styleConfig.textColor}`}>
                {userPoints.toLocaleString()}
              </span>
              <span className={`text-[8px] font-bold uppercase ${styleConfig.subTextColor}`}>pts</span>
            </div>
          </div>
        </div>

        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-800/5 relative z-10 ${styleConfig.badgeClass}`}>
          <IconComponent size={12} />
          <span className="text-[9px] font-black uppercase tracking-wider">{currentTier.name}</span>
        </div>
      </div>

      {/* Hero Carousel (Banners) */}
      <div className="relative -mx-1">
        <div ref={carouselRef} className="flex gap-3 overflow-x-auto snap-x snap-mandatory no-scrollbar px-1 pb-4 pt-1">
          {/* Banner 1: Promotions */}
          <button 
            onClick={() => toggleCategory('deals')}
            className="relative flex-shrink-0 w-[85%] sm:w-[320px] h-32 rounded-3xl overflow-hidden snap-center bg-gradient-to-br from-[#4c1d95] to-[#2e1065] shadow-ambient text-left group transition-transform active:scale-[0.98]"
          >
            <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-[#ecdff9]/20 rounded-full blur-2xl group-hover:scale-110 transition-transform duration-700" />
            <div className="absolute -left-10 -top-10 w-32 h-32 bg-[#8b5cf6]/30 rounded-full blur-2xl group-hover:scale-110 transition-transform duration-700" />
            
            <div className="relative z-10 p-5 h-full flex flex-col justify-between">
              <div className="flex items-center gap-2">
                <span className="bg-white/20 backdrop-blur-md text-white text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest shadow-sm">
                  Hot Deals
                </span>
              </div>
              <div>
                <h3 className="text-lg font-black text-white leading-tight mb-0.5">โปรโมชั่นพิเศษสุด🔥</h3>
                <p className="text-xs font-bold text-white/70">สิทธิพิเศษที่คุณไม่ควรพลาด</p>
              </div>
              <div className="absolute right-4 bottom-4 w-12 h-12 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center text-white border border-white/10 shadow-lg">
                <Tag size={24} />
              </div>
            </div>
          </button>

          {/* Banner 2: Packages */}
          <button 
            onClick={() => toggleCategory('packages')}
            className="relative flex-shrink-0 w-[85%] sm:w-[320px] h-32 rounded-3xl overflow-hidden snap-center bg-gradient-to-br from-[#5b21b6] to-[#3b0764] shadow-ambient text-left group transition-transform active:scale-[0.98]"
          >
            <div className="absolute -right-10 -top-10 w-32 h-32 bg-[#e9e5fa]/20 rounded-full blur-2xl group-hover:scale-110 transition-transform duration-700" />
            <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-[#a78bfa]/30 rounded-full blur-2xl group-hover:scale-110 transition-transform duration-700" />
            
            <div className="relative z-10 p-5 h-full flex flex-col justify-between">
              <div className="flex items-center gap-2">
                <span className="bg-white/20 backdrop-blur-md text-white text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest shadow-sm">
                  Value Packs
                </span>
              </div>
              <div>
                <h3 className="text-lg font-black text-white leading-tight mb-0.5">แพ็คเกจสุดคุ้ม✨</h3>
                <p className="text-xs font-bold text-white/70">ซื้อเหมาลดเยอะ คุ้มกว่าเห็นๆ</p>
              </div>
              <div className="absolute right-4 bottom-4 w-12 h-12 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center text-white border border-white/10 shadow-lg">
                <Box size={24} />
              </div>
            </div>
          </button>

          {/* Banner 3: Redeem */}
          <button 
            onClick={() => toggleCategory('redeem')}
            className="relative flex-shrink-0 w-[85%] sm:w-[320px] h-32 rounded-3xl overflow-hidden snap-center bg-gradient-to-br from-[#859500] to-[#4d5600] shadow-ambient text-left group transition-transform active:scale-[0.98]"
          >
            <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-[#EAFD69]/20 rounded-full blur-2xl group-hover:scale-110 transition-transform duration-700" />
            <div className="absolute -left-10 -top-10 w-32 h-32 bg-[#bef264]/30 rounded-full blur-2xl group-hover:scale-110 transition-transform duration-700" />
            
            <div className="relative z-10 p-5 h-full flex flex-col justify-between">
              <div className="flex items-center gap-2">
                <span className="bg-white/20 backdrop-blur-md text-white text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest shadow-sm">
                  Rewards
                </span>
              </div>
              <div>
                <h3 className="text-lg font-black text-white leading-tight mb-0.5">แลกคะแนนสะสม🎁</h3>
                <p className="text-xs font-bold text-white/70">ใช้คะแนนสะสมแทนเงินสด</p>
              </div>
              <div className="absolute right-4 bottom-4 w-12 h-12 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center text-white border border-white/10 shadow-lg">
                <Award size={24} />
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Icon Grid Shortcuts (Filters) */}
      <div className="grid grid-cols-5 gap-2 px-1">
        <button 
          onClick={() => toggleCategory('packages')}
          className={`flex flex-col items-center gap-1.5 p-2 rounded-2xl bg-white shadow-ambient transition-all ${
            activeCategory === 'packages' ? 'border-2 border-[#5b21b6] scale-105' : 'border border-black/5 active:scale-95'
          }`}
        >
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-1 ${
            activeCategory === 'packages' ? 'bg-[#5b21b6] text-white' : 'bg-[#e9e5fa] text-[#5b21b6]'
          }`}>
            <Box size={20} />
          </div>
          <span className={`text-[9px] font-black leading-tight text-center ${activeCategory === 'packages' ? 'text-[#5b21b6]' : 'text-[#020d35]'}`}>แพ็คเกจ<br/>สุดคุ้ม</span>
        </button>

        <button 
          onClick={() => toggleCategory('deals')}
          className={`flex flex-col items-center gap-1.5 p-2 rounded-2xl bg-white shadow-ambient transition-all ${
            activeCategory === 'deals' ? 'border-2 border-[#4c1d95] scale-105' : 'border border-black/5 active:scale-95'
          }`}
        >
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-1 ${
            activeCategory === 'deals' ? 'bg-[#4c1d95] text-white' : 'bg-[#ecdff9] text-[#4c1d95]'
          }`}>
            <Tag size={20} />
          </div>
          <span className={`text-[9px] font-black leading-tight text-center ${activeCategory === 'deals' ? 'text-[#4c1d95]' : 'text-[#020d35]'}`}>โปรโมชั่น<br/>พิเศษ</span>
        </button>

        <button 
          onClick={() => toggleCategory('redeem')}
          className={`flex flex-col items-center gap-1.5 p-2 rounded-2xl bg-white shadow-ambient transition-all ${
            activeCategory === 'redeem' ? 'border-2 border-[#859500] scale-105' : 'border border-black/5 active:scale-95'
          }`}
        >
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-1 ${
            activeCategory === 'redeem' ? 'bg-[#EAFD69] text-[#020d35]' : 'bg-[#EAFD69]/30 text-[#020d35]'
          }`}>
            <Award size={20} />
          </div>
          <span className={`text-[9px] font-black leading-tight text-center ${activeCategory === 'redeem' ? 'text-[#859500]' : 'text-[#020d35]'}`}>แลก<br/>คะแนน</span>
        </button>

        <button 
          onClick={() => setShowCouponsModal(true)}
          className="flex flex-col items-center gap-1.5 p-2 rounded-2xl bg-white shadow-ambient border border-black/5 active:scale-95 transition-all relative"
        >
          {collectedCoupons.length > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#ba1a1a] text-white text-[8px] font-black rounded-full flex items-center justify-center border-2 border-white shadow-sm z-10">
              {collectedCoupons.length}
            </span>
          )}
          <div className="w-10 h-10 rounded-xl bg-slate-100 text-[#45464E] flex items-center justify-center mb-1">
            <Ticket size={20} />
          </div>
          <span className="text-[9px] font-black text-[#020d35] leading-tight text-center">คูปอง<br/>ของฉัน</span>
        </button>

        <button 
          onClick={() => setShowPackagesModal(true)}
          className="flex flex-col items-center gap-1.5 p-2 rounded-2xl bg-white shadow-ambient border border-black/5 active:scale-95 transition-all relative"
        >
          {customerPackages.length > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#ba1a1a] text-white text-[8px] font-black rounded-full flex items-center justify-center border-2 border-white shadow-sm z-10">
              {customerPackages.length}
            </span>
          )}
          <div className="w-10 h-10 rounded-xl bg-slate-100 text-[#45464E] flex items-center justify-center mb-1">
            <Box size={20} />
          </div>
          <span className="text-[9px] font-black text-[#020d35] leading-tight text-center">แพ็คเกจ<br/>ของฉัน</span>
        </button>
      </div>

      {/* Main Feed Content */}
      <AnimatePresence mode="wait">
        <motion.div 
          key={activeCategory}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="space-y-10 pt-4"
        >
          {/* Package Templates Section */}
          {(activeCategory === 'all' || activeCategory === 'packages') && packageTemplates.length > 0 && (
            <div className="relative overflow-hidden bg-[#f9f9f9]/50 p-5 rounded-[2.5rem] space-y-5 shadow-sm border border-black/5 -mx-1">
            {/* Fluid Mesh Gradients (Aurora Effect) */}
            <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#e9e5fa] rounded-full filter blur-[80px] opacity-90 pointer-events-none" />
            <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#e2e6f9] rounded-full filter blur-[80px] opacity-90 pointer-events-none" />
            
            <div className="relative z-10 flex items-center justify-between px-1">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 bg-white/60 backdrop-blur-sm rounded-xl flex items-center justify-center text-[#5b21b6] shadow-sm">
                  <Box size={18} />
                </div>
                <div>
                  <h2 className="text-lg font-black text-[#020d35] tracking-tight">แพ็คเกจสุดคุ้ม</h2>
                  <p className="text-[10px] font-bold text-[#5b21b6] opacity-70 uppercase tracking-widest">Value Packages</p>
                </div>
              </div>
            </div>
            
            <div className={`relative z-10 flex gap-4 pb-2 px-1 ${
              activeCategory === 'packages' ? 'flex-col' : 'overflow-x-auto no-scrollbar'
            }`}>
              {packageTemplates.map((pkg) => {
                return (
                  <motion.div
                    key={pkg.id}
                    whileTap={{ scale: 0.98 }}
                    className={`relative flex-shrink-0 bg-white/80 backdrop-blur-md rounded-[2rem] p-5 shadow-ambient border border-black/5 flex flex-col justify-between transition-all ${
                      activeCategory === 'packages' ? 'w-full h-auto gap-4' : 'w-[280px] h-48'
                    }`}
                  >
                    <div className="relative z-10">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-[9px] font-black text-[#5b21b6] bg-[#e9e5fa] px-3 py-1 rounded-full uppercase tracking-wider">
                          {pkg.total_sessions} ครั้ง
                        </span>
                        <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-wider">
                          ชำระเงินสด/โอน
                        </span>
                      </div>
                      <h3 className="text-sm font-black text-[#020d35] leading-tight truncate">
                        {pkg.title}
                      </h3>
                      <p className={`text-[11px] font-bold text-[#45464E] opacity-70 mt-1.5 leading-relaxed ${
                        activeCategory === 'packages' ? '' : 'line-clamp-2'
                      }`}>
                        {pkg.description}
                      </p>
                    </div>
                    
                    <div className="relative z-10 flex justify-between items-center pt-2">
                      <div className="flex flex-col">
                        <span className="text-[9px] font-bold text-slate-400 uppercase">ราคาแพ็คเกจ</span>
                        <span className="text-lg font-black text-[#6d28d9]">
                          ฿{pkg.price?.toLocaleString()}
                        </span>
                      </div>
                      <button 
                        onClick={() => onBuyPackage(pkg)}
                        className="text-[10px] font-black px-5 py-2.5 rounded-full bg-gradient-to-br from-[#18234a] to-[#020d35] text-white active:scale-95 transition-all shadow-sm"
                      >
                        ซื้อแพ็คเกจ
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}


        {/* Special Promotions Section (Using Deals Data) */}
        {(activeCategory === 'all' || activeCategory === 'deals') && dealTemplates.length > 0 && (
          <div className="relative overflow-hidden bg-[#f9f9f9]/50 p-5 rounded-[2.5rem] space-y-5 shadow-sm border border-black/5 -mx-1">
            {/* Fluid Mesh Gradients (Aurora Effect) */}
            <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#d7e6f9] rounded-full filter blur-[80px] opacity-90 pointer-events-none" />
            <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#ecdff9] rounded-full filter blur-[80px] opacity-90 pointer-events-none" />
            
            <div className="relative z-10 flex items-center justify-between px-1">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 bg-white/60 backdrop-blur-sm rounded-xl flex items-center justify-center text-[#4c1d95] shadow-sm">
                  <Tag size={18} />
                </div>
                <div>
                  <h2 className="text-lg font-black text-[#020d35] tracking-tight">โปรโมชั่นพิเศษ</h2>
                  <p className="text-[10px] font-bold text-[#4c1d95] opacity-70 uppercase tracking-widest">Special Offers</p>
                </div>
              </div>
            </div>

            <div className={`relative z-10 flex gap-4 pb-2 px-1 ${
              activeCategory === 'deals' ? 'flex-col' : 'overflow-x-auto no-scrollbar'
            }`}>
              {dealTemplates.map((deal) => {
                const isCollected = collectedCoupons.some(c => c.template_id === deal.id && c.is_deal);
                return (
                  <motion.div
                    key={deal.id}
                    whileTap={{ scale: isCollected ? 1 : 0.98 }}
                    className={`relative flex-shrink-0 bg-white/80 backdrop-blur-md rounded-[2rem] p-5 shadow-ambient border border-black/5 flex flex-col justify-between transition-all ${
                      isCollected ? 'opacity-50' : ''
                    } ${
                      activeCategory === 'deals' ? 'w-full h-auto gap-4' : 'w-[280px] h-44'
                    }`}
                  >
                    <div className="relative z-10">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-[9px] font-black text-[#4c1d95] bg-[#ecdff9] px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                          PROMO
                        </span>
                        <span className="text-[10px] font-black text-[#020d35] bg-white/60 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm border border-slate-100">
                          {deal.pointsRequired} pts
                        </span>
                      </div>
                      <h3 className="text-sm font-black text-[#020d35] leading-tight truncate">
                        {deal.title}
                      </h3>
                      <p className={`text-[11px] font-bold text-[#45464E] opacity-70 mt-1.5 leading-relaxed ${
                        activeCategory === 'deals' ? '' : 'line-clamp-2'
                      }`}>
                        {deal.description}
                      </p>
                    </div>
                    
                    <div className="relative z-10 flex justify-between items-center pt-2">
                      <span className="text-[9px] font-bold text-[#45464E]/60 flex items-center gap-1">
                        <Clock size={10} /> Valid: {deal.expiry}
                      </span>
                      <button 
                        onClick={() => onBuyDeal(deal, deal.pointsRequired)}
                        disabled={isCollected || userPoints < deal.pointsRequired}
                        className={`text-[10px] font-black px-5 py-2.5 rounded-full transition-all shadow-sm ${
                          isCollected
                            ? 'bg-slate-100 text-slate-400'
                            : userPoints < deal.pointsRequired
                            ? 'bg-slate-100 text-slate-300 cursor-not-allowed'
                            : 'bg-gradient-to-br from-[#18234a] to-[#020d35] text-white active:scale-95'
                        }`}
                      >
                        {isCollected ? 'รับสิทธิ์แล้ว' : userPoints < deal.pointsRequired ? 'คะแนนไม่พอ' : 'รับสิทธิ์'}
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {/* Redeem Points Section */}
        {(activeCategory === 'all' || activeCategory === 'redeem') && (
          <div className="relative overflow-hidden bg-[#f9f9f9]/50 p-5 rounded-[2.5rem] space-y-5 shadow-sm border border-black/5 -mx-1">
            {/* Fluid Mesh Gradients (Aurora Effect) */}
            <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#ecfccb] rounded-full filter blur-[80px] opacity-90 pointer-events-none" />
            <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#EAFD69]/40 rounded-full filter blur-[80px] opacity-60 pointer-events-none" />
            
            <div className="relative z-10 flex items-center justify-between px-1">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 bg-white/60 backdrop-blur-sm rounded-xl flex items-center justify-center text-[#859500] shadow-sm">
                  <Award size={18} />
                </div>
                <div>
                  <h2 className="text-lg font-black text-[#020d35] tracking-tight">แลกคะแนนสะสม</h2>
                  <p className="text-[10px] font-bold text-[#859500] opacity-70 uppercase tracking-widest">Redeem Rewards</p>
                </div>
              </div>
            </div>

            <div className={`relative z-10 flex gap-4 pb-2 px-1 ${
              activeCategory === 'redeem' ? 'flex-col' : 'overflow-x-auto no-scrollbar'
            }`}>
              {regularRedeemables.length > 0 ? (
                regularRedeemables.map((coupon) => {
                  const canRedeem = userPoints >= coupon.pointsRequired;
                  const isAlreadyCollected = collectedCoupons.some(c => c.template_id === coupon.id && !c.is_deal);
                  const isDisabled = !canRedeem || isAlreadyCollected;

                  return (
                    <motion.div
                      key={coupon.id}
                      whileTap={{ scale: isDisabled ? 1 : 0.98 }}
                      className={`relative flex-shrink-0 bg-white/80 backdrop-blur-md rounded-[2rem] p-5 shadow-ambient border border-black/5 flex flex-col justify-between transition-all ${
                        isDisabled && !isAlreadyCollected ? 'opacity-60' : ''
                      } ${
                        activeCategory === 'redeem' ? 'w-full h-auto gap-4' : 'w-[280px] h-44'
                      }`}
                    >
                      <div className="relative z-10">
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-[9px] font-black text-[#657300] bg-[#EAFD69] px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                            REWARD
                          </span>
                          <span className="text-[10px] font-black text-[#020d35] bg-white/60 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm border border-slate-100">
                            {coupon.pointsRequired} pts
                          </span>
                        </div>
                        <h3 className="text-sm font-black text-[#020d35] leading-tight truncate">
                          {coupon.title}
                        </h3>
                        <p className={`text-[11px] font-bold text-[#45464E] opacity-70 mt-1.5 leading-relaxed ${
                          activeCategory === 'redeem' ? '' : 'line-clamp-2'
                        }`}>
                          {coupon.description}
                        </p>
                      </div>
                      
                      <div className="relative z-10 flex justify-between items-center pt-2">
                        <span className="text-[9px] font-bold text-[#45464E]/60 flex items-center gap-1">
                          <Gift size={10} /> ของรางวัลพิเศษ
                        </span>
                        <button
                          onClick={() => onRedeemCoupon(coupon, coupon.pointsRequired)}
                          disabled={isDisabled}
                          className={`text-[10px] font-black px-5 py-2.5 rounded-full transition-all shadow-sm ${
                            isAlreadyCollected
                              ? 'bg-slate-100 text-slate-400'
                              : !canRedeem
                              ? 'bg-slate-100 text-slate-300 cursor-not-allowed'
                              : 'bg-gradient-to-br from-[#18234a] to-[#020d35] text-white active:scale-95'
                          }`}
                        >
                          {isAlreadyCollected ? 'แลกแล้ว' : canRedeem ? 'แลกเลย' : 'คะแนนไม่พอ'}
                        </button>
                      </div>
                    </motion.div>
                  )
                })
              ) : (
                <div className="text-center py-12 bg-white/50 backdrop-blur-sm rounded-[2rem] text-slate-400 font-bold text-xs uppercase tracking-wider border border-dashed border-slate-200 w-full">
                  ไม่มีคูปองให้แลกในขณะนี้
                </div>
              )}
            </div>
          </div>
        )}
      </motion.div>
      </AnimatePresence>

      {/* Modals for Coupons and Packages */}
      <AnimatePresence>
        {showCouponsModal && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="fixed inset-0 bg-[#0f1200]/40 backdrop-blur-sm z-[90]" 
              onClick={() => setShowCouponsModal(false)}
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed bottom-0 left-0 right-0 h-[90vh] bg-[#f9f9f9] rounded-t-[2.5rem] shadow-2xl z-[100] flex flex-col border-t border-white/20"
            >
              <div className="flex justify-center pt-3 pb-2 w-full sticky top-0 bg-[#f9f9f9] rounded-t-[2.5rem] z-10">
                <div className="w-12 h-1.5 bg-slate-200 rounded-full" />
              </div>
              <div className="flex items-center justify-between px-6 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-[#45464E]">
                    <Ticket size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-[#020d35]">คูปองของฉัน</h3>
                    <p className="text-[11px] font-bold text-[#45464E] opacity-60">มีอยู่ {collectedCoupons.filter(c => couponFilter === 'unused' ? c.status !== 'used' : c.status === 'used').length} ใบ</p>
                  </div>
                </div>
                <button onClick={() => setShowCouponsModal(false)} className="w-10 h-10 bg-white shadow-sm border border-slate-100 rounded-full flex items-center justify-center text-slate-500">
                  <X size={20} />
                </button>
              </div>

              {/* Coupon Filter Switch */}
              <div className="px-6 pb-4">
                <div className="bg-slate-100 p-1 rounded-full flex gap-1">
                  <button 
                    onClick={() => setCouponFilter('unused')}
                    className={`flex-1 py-2 text-[11px] font-black rounded-full transition-all ${couponFilter === 'unused' ? 'bg-white text-[#020d35] shadow-sm' : 'text-[#45464E]/60'}`}
                  >
                    ยังไม่ได้ใช้
                  </button>
                  <button 
                    onClick={() => setCouponFilter('used')}
                    className={`flex-1 py-2 text-[11px] font-black rounded-full transition-all ${couponFilter === 'used' ? 'bg-white text-[#020d35] shadow-sm' : 'text-[#45464E]/60'}`}
                  >
                    ใช้งานแล้ว
                  </button>
                </div>
              </div>

              <div className="overflow-y-auto px-4 pb-10 space-y-4">
                {collectedCoupons.filter(c => couponFilter === 'unused' ? c.status !== 'used' : c.status === 'used').length > 0 ? (
                  collectedCoupons.filter(c => couponFilter === 'unused' ? c.status !== 'used' : c.status === 'used').map((coupon, index) => (
                    <motion.div
                      key={coupon.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`bg-white rounded-[2rem] shadow-ambient border border-black/5 relative overflow-hidden flex flex-col ${coupon.status === 'used' ? 'opacity-40 grayscale' : ''}`}
                    >
                      {/* Ticket Cutout Design */}
                      <div className="p-6 flex items-center gap-4 relative">
                        <div className={`w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center shrink-0 border border-slate-100 ${coupon.status === 'used' ? 'text-slate-400' : 'text-[#020d35]'}`}>
                          {getIconComponent(coupon.iconName || (coupon.is_deal ? 'Zap' : 'Ticket'), 22)}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className={`font-black text-sm truncate ${coupon.status === 'used' ? 'text-slate-500' : 'text-[#020d35]'}`}>{coupon.title}</h4>
                          </div>
                          <p className={`text-[11px] font-bold opacity-60 truncate mt-0.5 ${coupon.status === 'used' ? 'text-slate-400' : 'text-[#45464E]'}`}>
                            {coupon.description}
                          </p>
                        </div>
                      </div>

                      {/* Dashed Divider with Ticket Punch Holes */}
                      <div className="relative h-px bg-dashed border-t-2 border-dashed border-slate-100 mx-6">
                        <div className="absolute -left-9 -top-2.5 w-5 h-5 rounded-full bg-[#F9F9F9] border-r border-black/5" />
                        <div className="absolute -right-9 -top-2.5 w-5 h-5 rounded-full bg-[#F9F9F9] border-l border-black/5" />
                      </div>

                      {/* Ticket Footer */}
                      <div className="px-6 py-4 bg-slate-50/50 flex justify-between items-center rounded-b-[2rem]">
                        <span className={`text-[10px] font-bold flex items-center gap-1 ${coupon.status === 'used' ? 'text-slate-500' : 'text-[#45464E]/60'}`}>
                          {coupon.status === 'used' ? (
                            <span>ใช้เมื่อ: {coupon.used_at_str || '-'}</span>
                          ) : (
                            <><Clock size={12} /> หมดอายุ: {coupon.expiry}</>
                          )}
                        </span>
                        <button
                          onClick={() => {
                            if (coupon.status !== 'used') {
                              onUseCoupon(coupon);
                              setShowCouponsModal(false);
                            }
                          }}
                          disabled={coupon.status === 'used'}
                          className={`text-white text-[10px] font-black px-5 py-2.5 rounded-full shadow-sm flex items-center gap-1 transition-all ${coupon.status === 'used' ? 'bg-slate-400' : 'bg-gradient-to-br from-[#18234a] to-[#020d35] active:scale-95'}`}
                        >
                          {coupon.status === 'used' ? 'ใช้แล้ว' : 'ใช้คูปอง'} {coupon.status !== 'used' && <ArrowRight size={12} />}
                        </button>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-16 bg-white rounded-[2.5rem] shadow-ambient border border-black/5 flex flex-col items-center justify-center p-8">
                    <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 mb-4 border border-slate-100">
                      <Ticket size={28} />
                    </div>
                    <h3 className="text-base font-black text-[#020d35] mb-1">ยังไม่มีคูปองที่เก็บไว้ค่ะ</h3>
                    <p className="text-xs font-bold text-[#45464E] opacity-60 max-w-[200px] leading-relaxed">
                      สะสมคะแนนเพื่อแลกรับส่วนลดและสิทธิพิเศษสุด Exclusive กันนะคะ ✨
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showPackagesModal && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="fixed inset-0 bg-[#0f1200]/40 backdrop-blur-sm z-[90]" 
              onClick={() => setShowPackagesModal(false)}
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed bottom-0 left-0 right-0 max-h-[85vh] bg-[#f9f9f9] rounded-t-[2.5rem] shadow-2xl z-[100] flex flex-col border-t border-white/20"
            >
              <div className="flex justify-center pt-3 pb-2 w-full sticky top-0 bg-[#f9f9f9] rounded-t-[2.5rem] z-10">
                <div className="w-12 h-1.5 bg-slate-200 rounded-full" />
              </div>
              <div className="flex items-center justify-between px-6 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-[#45464E]">
                    <Box size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-[#020d35]">แพ็คเกจของฉัน</h3>
                    <p className="text-[11px] font-bold text-[#45464E] opacity-60">มีอยู่ {customerPackages.length} รายการ</p>
                  </div>
                </div>
                <button onClick={() => setShowPackagesModal(false)} className="w-10 h-10 bg-white shadow-sm border border-slate-100 rounded-full flex items-center justify-center text-slate-500">
                  <X size={20} />
                </button>
              </div>
              <div className="overflow-y-auto px-4 pb-10 space-y-4">
                {customerPackages.length > 0 ? (
                  customerPackages.map((pkg, index) => {
                    const progress = (pkg.remaining_sessions / pkg.total_sessions) * 100;
                    return (
                      <motion.div
                        key={pkg.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="bg-white rounded-[2rem] shadow-ambient border border-black/5 overflow-hidden flex flex-col"
                      >
                        <div className="p-6 space-y-4">
                          <div className="flex justify-between items-start gap-4">
                            <div className="min-w-0 flex-1">
                              <span className="text-[9px] font-black text-[#5b21b6] bg-[#e9e5fa] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                                แพ็คเกจสะสม
                              </span>
                              <h4 className="font-black text-[#020d35] text-sm mt-1.5 truncate">{pkg.title}</h4>
                              <p className="text-[11px] font-bold text-[#45464E] opacity-60 mt-0.5 line-clamp-1">
                                {pkg.description}
                              </p>
                            </div>
                            <div className="text-right shrink-0">
                              <p className="text-[10px] font-bold text-slate-400 uppercase">คงเหลือ</p>
                              <p className="text-xl font-black text-[#020d35]">{pkg.remaining_sessions} / {pkg.total_sessions} ครั้ง</p>
                            </div>
                          </div>

                          {/* Progress Bar */}
                          <div className="w-full bg-[#e2e6f9]/50 h-2 rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${progress}%` }}
                              className="bg-gradient-to-r from-[#e9e5fa] to-[#7c3aed] h-full rounded-full"
                            />
                          </div>
                        </div>

                        {/* Footer */}
                        <div className="px-6 py-4 bg-slate-50/50 flex justify-between items-center rounded-b-[2rem] border-t border-slate-100">
                          <span className="text-[10px] font-bold text-[#45464E]/60 flex items-center gap-1">
                            <Clock size={12} /> ซื้อเมื่อ: {new Date(pkg.created_at).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: '2-digit' })}
                          </span>
                          <button
                            onClick={() => {
                              onUsePackage(pkg);
                              setShowPackagesModal(false);
                            }}
                            className="bg-gradient-to-br from-[#18234a] to-[#020d35] text-white text-[10px] font-black px-5 py-2.5 rounded-full shadow-sm active:scale-95 transition-all flex items-center gap-1"
                          >
                            ใช้งานแพ็คเกจ <Play size={10} className="fill-white" />
                          </button>
                        </div>
                      </motion.div>
                    );
                  })
                ) : (
                  <div className="text-center py-16 bg-white rounded-[2.5rem] shadow-ambient border border-black/5 flex flex-col items-center justify-center p-8">
                    <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 mb-4 border border-slate-100">
                      <Box size={28} />
                    </div>
                    <h3 className="text-base font-black text-[#020d35] mb-1">ยังไม่มีแพ็คเกจสะสมค่ะ</h3>
                    <p className="text-xs font-bold text-[#45464E] opacity-60 max-w-[200px] leading-relaxed">
                      เลือกซื้อแพ็คเกจสุดคุ้ม (เช่น ซื้อ 10 แถม 1) เพื่อรับสิทธิ์บริการราคาพิเศษได้ทันทีค่ะ ✨
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Promotions;