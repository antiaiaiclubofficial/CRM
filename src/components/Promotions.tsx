"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { 
  Ticket, Scissors, Sparkles, Gift, ShowerHead, Leaf, Hand, Tag, Heart, 
  History, Crown, PawPrint, Award, LucideIcon, Zap, Clock, ChevronRight,
  Coins, CheckCircle2, AlertCircle, ArrowRight
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
  collectedCoupons: any[];
  usedOrExpiredCoupons: any[];
  redeemableTemplates: any[];
  dealTemplates: any[];
  onRedeemCoupon: (template: any, pointsCost: number) => void;
  onBuyDeal: (template: any, pointsCost: number) => void;
  onUseCoupon: (coupon: any) => void;
}

const iconMap: Record<string, LucideIcon> = {
  Scissors, Sparkles, Gift, Ticket, ShowerHead, Leaf, Hand, Tag, Heart, History, Crown, PawPrint, Award, Zap
};

const getIconComponent = (iconName: string, size: number, className?: string) => {
  const IconComponent = iconMap[iconName] || Ticket;
  return <IconComponent size={size} className={className} />;
};

const Promotions = ({ 
  userPoints, 
  collectedCoupons, 
  usedOrExpiredCoupons, 
  redeemableTemplates,
  dealTemplates,
  onRedeemCoupon, 
  onBuyDeal,
  onUseCoupon
}: PromotionsProps) => {
  const [activeTab, setActiveTab] = useState<'redeem' | 'my-coupons'>('redeem');

  const specialPromos = redeemableTemplates.filter(t => t.pointsRequired === 0);
  const regularRedeemables = redeemableTemplates.filter(t => t.pointsRequired > 0);

  return (
    <div className="space-y-8 pb-24">
      {/* Premium Glassmorphic Points Card - Compact Version */}
      <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#18234a] to-[#020d35] p-6 text-white shadow-ambient border border-white/10">
        {/* Glowing Liquid Blobs */}
        <div className="absolute -right-10 -top-10 w-32 h-32 bg-[#EAFD69]/15 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -left-10 -bottom-10 w-24 h-24 bg-pink-500/5 rounded-full blur-2xl" />

        <div className="relative z-10 flex justify-between items-center">
          <div className="space-y-1">
            <span className="text-[10px] font-black text-white/50 uppercase tracking-[0.2em] flex items-center gap-1.5">
              <Coins size={12} className="text-[#EAFD69]" /> คะแนนสะสมของคุณ
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-black text-[#EAFD69] tracking-tighter leading-none">
                {userPoints.toLocaleString()}
              </span>
              <span className="text-[10px] font-bold text-white/70 uppercase tracking-wider">คะแนน</span>
            </div>
          </div>
          <div className="w-11 h-11 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center text-[#EAFD69] border border-white/20 shadow-inner">
            <Crown size={20} className="animate-bounce" style={{ animationDuration: '3s' }} />
          </div>
        </div>
      </div>

      {/* Sliding Tab Switcher */}
      <div className="bg-white p-1.5 rounded-full flex gap-1.5 shadow-ambient border border-black/5 relative">
        <button 
          onClick={() => setActiveTab('redeem')}
          className="relative flex-1 py-3.5 px-4 flex items-center justify-center gap-2 transition-colors duration-300 z-10 group"
        >
          {activeTab === 'redeem' && (
            <motion.div 
              layoutId="promoTabBg"
              className="absolute inset-0 bg-primary group-hover:bg-tertiary rounded-full shadow-lg transition-colors duration-300"
              transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
            />
          )}
          <span className={`relative z-10 text-xs font-black uppercase tracking-wider transition-colors duration-300 ${
            activeTab === 'redeem' ? 'text-white group-hover:text-primary' : 'text-primary/50 group-hover:text-primary'
          }`}>
            แลกรับรางวัล
          </span>
        </button>
        <button 
          onClick={() => setActiveTab('my-coupons')}
          className="relative flex-1 py-3.5 px-4 flex items-center justify-center gap-2 transition-colors duration-300 z-10 group"
        >
          {activeTab === 'my-coupons' && (
            <motion.div 
              layoutId="promoTabBg"
              className="absolute inset-0 bg-primary group-hover:bg-tertiary rounded-full shadow-lg transition-colors duration-300"
              transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
            />
          )}
          <span className={`relative z-10 text-xs font-black uppercase tracking-wider transition-colors duration-300 ${
            activeTab === 'my-coupons' ? 'text-white group-hover:text-primary' : 'text-primary/50 group-hover:text-primary'
          }`}>
            คูปองของฉัน ({collectedCoupons.length})
          </span>
        </button>
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'redeem' ? (
          <motion.div
            key="redeem-tab"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="space-y-10"
          >
            {/* Exclusive Deals Section */}
            {dealTemplates.length > 0 && (
              <div className="space-y-5">
                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 bg-[#EAFD69]/10 rounded-xl flex items-center justify-center text-[#020d35]">
                      <Zap size={18} className="fill-[#EAFD69] text-[#020d35]" />
                    </div>
                    <div>
                      <h2 className="text-lg font-black text-[#020d35] tracking-tight">ดีลสุดพิเศษสำหรับคุณ</h2>
                      <p className="text-[10px] font-bold text-[#45464E] opacity-50 uppercase tracking-widest">Exclusive Hot Deals</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4 px-1">
                  {dealTemplates.map((deal) => {
                    const isCollected = collectedCoupons.some(c => c.template_id === deal.id && c.is_deal);
                    return (
                      <motion.div
                        key={deal.id}
                        whileTap={{ scale: isCollected ? 1 : 0.98 }}
                        className={`relative flex-shrink-0 w-[280px] bg-white rounded-[2.5rem] p-6 overflow-hidden shadow-ambient border border-black/5 flex flex-col justify-between h-48 transition-all ${
                          isCollected ? 'opacity-50' : ''
                        }`}
                      >
                        {/* Soft glow background */}
                        <div className="absolute -right-6 -bottom-6 w-28 h-28 bg-[#EAFD69]/10 rounded-full blur-2xl" />
                        
                        <div className="relative z-10">
                          <div className="flex justify-between items-center mb-3">
                            <span className="text-[9px] font-black text-[#020d35] bg-[#EAFD69] px-3 py-1 rounded-full uppercase tracking-wider">
                              HOT DEAL
                            </span>
                            <span className="text-[10px] font-black text-[#020d35] bg-slate-100 px-3 py-1 rounded-full">
                              {deal.pointsRequired} pts
                            </span>
                          </div>
                          <h3 className="text-sm font-black text-[#020d35] leading-tight truncate">
                            {deal.title}
                          </h3>
                          <p className="text-[11px] font-bold text-[#45464E] opacity-70 mt-1.5 line-clamp-2 leading-relaxed">
                            {deal.description}
                          </p>
                        </div>
                        
                        <div className="relative z-10 flex justify-between items-center pt-3 border-t border-slate-50">
                          <span className="text-[9px] font-bold text-[#45464E]/50 flex items-center gap-1">
                            <Clock size={10} /> Exp: {deal.expiry}
                          </span>
                          <button 
                            onClick={() => onBuyDeal(deal, deal.pointsRequired)}
                            disabled={isCollected || userPoints < deal.pointsRequired}
                            className={`text-[10px] font-black px-4 py-2 rounded-full transition-all shadow-sm ${
                              isCollected
                                ? 'bg-slate-100 text-slate-400'
                                : userPoints < deal.pointsRequired
                                ? 'bg-slate-100 text-slate-300 cursor-not-allowed'
                                : 'bg-gradient-to-br from-[#18234a] to-[#020d35] text-white active:scale-95'
                            }`}
                          >
                            {isCollected ? 'ซื้อแล้ว' : userPoints < deal.pointsRequired ? 'คะแนนไม่พอ' : 'ซื้อดีลนี้'}
                          </button>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Special Promotions Section */}
            {specialPromos.length > 0 && (
              <div className="space-y-5">
                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 bg-[#d9d6fe] rounded-xl flex items-center justify-center text-[#5c5b7d]">
                      <Tag size={18} />
                    </div>
                    <div>
                      <h2 className="text-lg font-black text-[#020d35] tracking-tight">โปรโมชั่นพิเศษ</h2>
                      <p className="text-[10px] font-bold text-[#45464E] opacity-50 uppercase tracking-widest">Special Offers</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4 px-1">
                  {specialPromos.map((promo) => {
                    const isCollected = collectedCoupons.some(c => c.template_id === promo.id && !c.is_deal);
                    return (
                      <motion.div
                        key={promo.id}
                        whileTap={{ scale: isCollected ? 1 : 0.98 }}
                        className={`relative flex-shrink-0 w-[280px] bg-white rounded-[2.5rem] p-6 overflow-hidden shadow-ambient border border-black/5 flex flex-col justify-between h-44 transition-all ${
                          isCollected ? 'opacity-50' : ''
                        }`}
                      >
                        <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-[#d9d6fe]/10 rounded-full blur-2xl" />
                        
                        <div className="relative z-10">
                          <span className="text-[9px] font-black text-[#5c5b7d] bg-[#d9d6fe] px-3 py-1 rounded-full uppercase tracking-wider mb-3 inline-block">
                            PROMO
                          </span>
                          <h3 className="text-sm font-black text-[#020d35] leading-tight truncate">
                            {promo.title}
                          </h3>
                          <p className="text-[11px] font-bold text-[#45464E] opacity-70 mt-1.5 line-clamp-1">
                            {promo.description}
                          </p>
                        </div>
                        
                        <div className="relative z-10 flex justify-between items-center pt-3 border-t border-slate-50">
                          <span className="text-[9px] font-bold text-[#45464E]/50 flex items-center gap-1">
                            <Clock size={10} /> Valid: {promo.expiry}
                          </span>
                          <button 
                            onClick={() => onRedeemCoupon(promo, 0)}
                            disabled={isCollected}
                            className={`text-[10px] font-black px-4 py-2 rounded-full transition-all shadow-sm ${
                              isCollected
                                ? 'bg-slate-100 text-slate-400'
                                : 'bg-gradient-to-br from-[#18234a] to-[#020d35] text-white active:scale-95'
                            }`}
                          >
                            {isCollected ? 'เก็บแล้ว' : 'เก็บโปรโมชั่น'}
                          </button>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Redeem Points Section */}
            <div className="space-y-5">
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 bg-[#EAFD69]/10 rounded-xl flex items-center justify-center text-[#020d35]">
                    <Award size={18} />
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-[#020d35] tracking-tight">แลกคะแนนสะสม</h2>
                    <p className="text-[10px] font-bold text-[#45464E] opacity-50 uppercase tracking-widest">Redeem Rewards</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {regularRedeemables.length > 0 ? (
                  regularRedeemables.map((coupon) => {
                    const canRedeem = userPoints >= coupon.pointsRequired;
                    const isAlreadyCollected = collectedCoupons.some(c => c.template_id === coupon.id && !c.is_deal);
                    const isDisabled = !canRedeem || isAlreadyCollected;

                    return (
                      <motion.div
                        key={coupon.id}
                        whileTap={{ scale: isDisabled ? 1 : 0.98 }}
                        className={`bg-white p-5 rounded-[2rem] shadow-ambient flex items-center gap-4 border border-black/5 transition-all ${
                          isDisabled && !isAlreadyCollected ? 'opacity-60' : ''
                        }`}
                      >
                        <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-[#020d35] shrink-0 border border-slate-100">
                          {getIconComponent(coupon.iconName, 22)}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h4 className="font-black text-[#020d35] text-sm truncate">{coupon.title}</h4>
                          <p className="text-[11px] font-bold text-[#45464E] opacity-60 truncate mt-0.5">
                            {coupon.description}
                          </p>
                          <span className="inline-flex text-[9px] text-[#020d35] font-black bg-[#EAFD69] px-2.5 py-0.5 rounded-full mt-1.5">
                            {coupon.pointsRequired} คะแนน
                          </span>
                        </div>
                        
                        <button
                          onClick={() => onRedeemCoupon(coupon, coupon.pointsRequired)}
                          disabled={isDisabled}
                          className={`px-4 py-2.5 rounded-full text-[10px] font-black transition-all shadow-sm shrink-0 ${
                            isAlreadyCollected
                              ? 'bg-slate-100 text-slate-400'
                              : !canRedeem
                              ? 'bg-slate-100 text-slate-300'
                              : 'bg-gradient-to-br from-[#18234a] to-[#020d35] text-white active:scale-95'
                          }`}
                        >
                          {isAlreadyCollected ? 'แลกแล้ว' : canRedeem ? 'แลกเลย' : 'คะแนนไม่พอ'}
                        </button>
                      </motion.div>
                    )
                  })
                ) : (
                  <div className="text-center py-12 bg-slate-50 rounded-[2rem] text-slate-400 font-bold text-xs uppercase tracking-wider border border-dashed border-slate-200">
                    ไม่มีคูปองให้แลกในขณะนี้
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="my-coupons-tab"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="space-y-5"
          >
            {collectedCoupons.length > 0 ? (
              collectedCoupons.map((coupon, index) => (
                <motion.div
                  key={coupon.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`bg-white rounded-[2rem] shadow-ambient border border-black/5 relative overflow-hidden flex flex-col ${
                    coupon.is_deal ? 'ring-2 ring-[#EAFD69]' : ''
                  }`}
                >
                  {/* Ticket Cutout Design */}
                  <div className="p-6 flex items-center gap-4 relative">
                    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-[#020d35] shrink-0 border border-slate-100">
                      {getIconComponent(coupon.iconName || (coupon.is_deal ? 'Zap' : 'Ticket'), 22)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-black text-[#020d35] text-sm truncate">{coupon.title}</h4>
                        {coupon.is_deal && (
                          <span className="bg-[#EAFD69] text-[#020d35] text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                            DEAL
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] font-bold text-[#45464E] opacity-60 truncate mt-0.5">
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
                    <span className="text-[10px] font-bold text-[#45464E]/60 flex items-center gap-1">
                      <Clock size={12} /> หมดอายุ: {coupon.expiry}
                    </span>
                    <button
                      onClick={() => onUseCoupon(coupon)}
                      className="bg-gradient-to-br from-[#18234a] to-[#020d35] text-white text-[10px] font-black px-5 py-2.5 rounded-full shadow-sm active:scale-95 transition-all flex items-center gap-1"
                    >
                      ใช้คูปอง <ArrowRight size={12} />
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
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Promotions;