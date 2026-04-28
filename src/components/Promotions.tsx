"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Ticket, Gift, Scissors, Sparkles, ShowerHead, Leaf, Hand, Tag, Heart, PawPrint, Crown, History, Award, LucideIcon, Zap } from 'lucide-react';

// Define the Coupon/Deal interface
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
}

interface PromotionsProps {
  userPoints: number;
  collectedCoupons: any[];
  usedOrExpiredCoupons: any[];
  redeemableTemplates: any[];
  // New props for deals
  dealTemplates: any[];
  collectedDeals: any[];
  onRedeemCoupon: (template: any, pointsCost: number) => void;
  onUseCoupon: (couponId: string | number) => void;
  onRedeemDeal: (template: any) => void;
  onUseDeal: (dealId: string | number) => void;
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
  collectedDeals,
  onRedeemCoupon, 
  onUseCoupon,
  onRedeemDeal,
  onUseDeal
}: PromotionsProps) => {

  const specialPromos = redeemableTemplates.filter(t => t.pointsRequired === 0);
  const regularRedeemables = redeemableTemplates.filter(t => t.pointsRequired > 0);

  return (
    <div className="space-y-8 pb-20">
      {/* 1. Special Promotions Section */}
      {specialPromos.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4 px-1">
            <Award size={18} className="text-pink-500" />
            <h2 className="text-xl font-bold text-slate-800 uppercase tracking-tight">โปรโมชั่นพิเศษ</h2>
          </div>
          <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2 px-1">
            {specialPromos.map((promo) => {
              const isCollected = collectedCoupons.some(c => c.template_id === promo.id);
              return (
                <motion.div
                  key={promo.id}
                  whileTap={{ scale: isCollected ? 1 : 0.98 }}
                  className={`relative flex-shrink-0 w-[280px] h-36 ${promo.bg || 'bg-[#FFD8E4]'} rounded-[2rem] p-5 overflow-hidden border-2 border-black shadow-soft ${isCollected ? 'grayscale opacity-40' : ''}`}
                >
                  <PawPrint className="absolute -right-4 -bottom-4 w-24 h-24 text-black/5 opacity-50 rotate-12" />
                  <div className="relative z-10 flex flex-col justify-between h-full">
                    <div>
                      <span className="text-[9px] font-black text-slate-800 bg-white border border-black px-2 py-0.5 rounded-full mb-2 inline-block">HOT</span>
                      <h3 className="text-lg font-black text-slate-800">{promo.title}</h3>
                      <p className="text-[10px] font-bold text-slate-600 opacity-80">{promo.description}</p>
                    </div>
                    <div className="flex justify-between items-end">
                      <span className="text-[9px] font-bold text-slate-500 opacity-70">Valid: {promo.expiry}</span>
                      <button 
                        onClick={() => onRedeemCoupon(promo, 0)}
                        disabled={isCollected}
                        className={`text-[10px] font-black px-4 py-1.5 rounded-xl transition-all shadow-sm ${
                          isCollected ? 'bg-slate-200 text-slate-400 border border-slate-300' : 'bg-white text-slate-800 border-2 border-black active:translate-y-0.5'
                        }`}
                      >
                        {isCollected ? 'เก็บแล้ว' : 'เก็บโปรโมชั่น'}
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. Deal Discounts Section (NEW) */}
      {dealTemplates.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4 px-1">
            <Zap size={18} className="text-blue-500" />
            <h2 className="text-xl font-bold text-slate-800 uppercase tracking-tight">ดีลส่วนลดสุดคุ้ม</h2>
          </div>
          <div className="space-y-3">
            {dealTemplates.map((deal) => {
              const isCollected = collectedDeals.some(d => d.template_id === deal.id);
              return (
                <motion.div
                  key={deal.id}
                  whileTap={{ scale: isCollected ? 1 : 0.98 }}
                  className={`bg-white p-4 rounded-[2rem] border-2 border-black shadow-soft flex items-center gap-4 ${isCollected ? 'opacity-60' : ''}`}
                >
                  <div className={`w-12 h-12 ${deal.bg || 'bg-blue-50'} border-2 border-black rounded-2xl flex items-center justify-center text-xl shadow-sm`}>
                    {getIconComponent(deal.iconName, 22, "text-blue-600")}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-black text-slate-800 text-sm">{deal.title}</h4>
                    <p className="text-[10px] font-bold text-slate-500">{deal.description}</p>
                  </div>
                  <button
                    onClick={() => isCollected ? onUseDeal(collectedDeals.find(d => d.template_id === deal.id).id) : onRedeemDeal(deal)}
                    className={`px-4 py-2 rounded-xl text-[10px] font-black border-2 border-black shadow-sm transition-all ${
                      isCollected ? 'bg-blue-100 text-blue-700' : 'bg-white text-slate-800'
                    }`}
                  >
                    {isCollected ? 'ใช้เลย' : 'เก็บดีล'}
                  </button>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. Redeem Points Section */}
      <div>
        <div className="flex items-center gap-2 mb-4 px-1">
          <Crown size={18} className="text-amber-500" />
          <h2 className="text-xl font-bold text-slate-800 uppercase tracking-tight">แลกคะแนนสะสม</h2>
        </div>
        <div className="space-y-3">
          {regularRedeemables.map((coupon) => {
            const canRedeem = userPoints >= coupon.pointsRequired;
            const isAlreadyCollected = collectedCoupons.some(c => c.template_id === coupon.id);
            const isDisabled = !canRedeem || isAlreadyCollected;
            return (
              <motion.div key={coupon.id} className={`bg-white p-4 rounded-[2rem] border-2 border-black shadow-soft flex items-center gap-4 ${isDisabled && !isAlreadyCollected ? 'opacity-40 grayscale' : ''}`}>
                <div className={`w-12 h-12 ${coupon.bg || 'bg-amber-50'} border-2 border-black rounded-2xl flex items-center justify-center text-xl shadow-sm`}>
                  {getIconComponent(coupon.iconName, 22)}
                </div>
                <div className="flex-1">
                  <h4 className="font-black text-slate-800 text-sm">{coupon.title}</h4>
                  <p className="text-[10px] font-bold text-slate-500">{coupon.description}</p>
                  <p className="text-[10px] text-amber-600 font-black mt-0.5">{coupon.pointsRequired} คะแนน</p>
                </div>
                <button
                  onClick={() => onRedeemCoupon(coupon, coupon.pointsRequired)}
                  disabled={isDisabled}
                  className={`px-4 py-2 rounded-xl text-[10px] font-black border-2 border-black shadow-sm ${
                    isAlreadyCollected ? 'bg-slate-100 text-slate-400 border-slate-300 shadow-none' : !canRedeem ? 'bg-slate-50 text-slate-300 border-slate-200' : 'bg-pink-100 text-pink-700'
                  }`}
                >
                  {isAlreadyCollected ? 'แลกแล้ว' : canRedeem ? 'แลกเลย' : 'คะแนนไม่พอ'}
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* 4. My Active Coupons Section */}
      <div id="my-coupons-section">
        <div className="flex items-center gap-2 mb-4 px-1">
          <Ticket size={18} className="text-pink-500" />
          <h2 className="text-xl font-bold text-slate-800 uppercase tracking-tight">คูปองของฉัน</h2>
        </div>
        <div className="space-y-3">
          {collectedCoupons.length > 0 ? (
            collectedCoupons.map((coupon) => (
              <motion.div key={coupon.id} className="bg-white p-4 rounded-[2rem] border-2 border-black shadow-soft flex items-center gap-4">
                <div className={`w-10 h-10 ${coupon.bg || 'bg-pink-50'} border-2 border-black rounded-xl flex items-center justify-center text-xl shadow-sm`}>
                  {getIconComponent(coupon.iconName, 20)}
                </div>
                <div className="flex-1">
                  <h4 className="font-black text-slate-800 text-sm">{coupon.title}</h4>
                  <p className="text-[10px] font-bold text-slate-500">{coupon.description}</p>
                </div>
                <button onClick={() => onUseCoupon(coupon.id)} className="bg-pink-100 text-pink-700 text-[10px] font-black px-4 py-2 rounded-xl border-2 border-black shadow-sm">ใช้เลย</button>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-6 border-2 border-dashed border-slate-300 rounded-[2rem] text-slate-400 font-bold text-xs uppercase">ยังไม่มีคูปองที่เก็บไว้ค่ะ</div>
          )}
        </div>
      </div>

      {/* 5. Used/Expired Section */}
      {usedOrExpiredCoupons.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4 px-1">
            <History size={18} className="text-slate-500" />
            <h2 className="text-xl font-bold text-slate-800 uppercase tracking-tight opacity-50">ประวัติคูปอง</h2>
          </div>
          <div className="space-y-3">
            {usedOrExpiredCoupons.map((coupon) => (
              <motion.div key={coupon.id} className="bg-slate-50 p-4 rounded-[2rem] border-2 border-slate-200 flex items-center gap-4 opacity-40 grayscale pointer-events-none">
                <div className="w-10 h-10 bg-white border-2 border-slate-200 rounded-xl flex items-center justify-center shadow-none">
                  {getIconComponent(coupon.iconName, 20)}
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-slate-400 text-sm line-through">{coupon.title}</h4>
                  <p className="text-[9px] font-bold text-slate-400 uppercase">ใช้งานแล้ว</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Promotions;