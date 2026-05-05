"use client";

import React from 'react';
import { motion, LayoutGroup } from 'framer-motion';
import { Ticket, Gift, Scissors, Sparkles, ShowerHead, Leaf, Hand, Tag, Heart, PawPrint, Crown, History, Award, LucideIcon, Zap, Clock } from 'lucide-react';

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

  const specialPromos = redeemableTemplates.filter(t => t.pointsRequired === 0);
  const regularRedeemables = redeemableTemplates.filter(t => t.pointsRequired > 0);

  return (
    <div className="space-y-8 pb-20">
      <LayoutGroup>
        {/* Exclusive Deals Section */}
        {dealTemplates.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-4 px-1">
              <Zap size={18} className="text-amber-500 fill-amber-500" />
              <h2 className="text-xl font-bold text-slate-800 uppercase tracking-tight">ดีลสุดพิเศษสำหรับคุณ</h2>
            </div>
            <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2 px-1">
              {dealTemplates.map((deal) => {
                const isCollected = collectedCoupons.some(c => c.template_id === deal.id && c.is_deal);
                return (
                  <motion.div
                    key={deal.id}
                    layout
                    whileTap={{ scale: isCollected ? 1 : 0.98 }}
                    className={`relative flex-shrink-0 w-[280px] h-40 ${deal.bg || 'bg-blue-50'} rounded-[2.5rem] p-6 overflow-hidden border-2 border-black shadow-soft ${isCollected ? 'grayscale opacity-40 pointer-events-none' : ''}`}
                  >
                    <Zap className="absolute -right-6 -bottom-6 w-32 h-32 text-black/5 rotate-12" />
                    <div className="relative z-10 flex flex-col justify-between h-full">
                      <div>
                        <div className="flex justify-between items-start">
                          <span className="text-[9px] font-black text-white bg-amber-500 border border-black px-2 py-0.5 rounded-full mb-2 inline-block">
                            HOT DEAL
                          </span>
                          <div className="flex items-center gap-1 bg-white/80 px-2 py-0.5 rounded-full border border-black/10">
                            <Crown size={10} className="text-amber-500" />
                            <span className="text-[10px] font-black text-slate-800">{deal.pointsRequired} pts</span>
                          </div>
                        </div>
                        <h3 className="text-lg font-black text-slate-800 leading-tight">
                          {deal.title}
                        </h3>
                        <p className="text-[10px] font-bold text-slate-600 opacity-80 mt-1 line-clamp-1">{deal.description}</p>
                      </div>
                      <div className="flex justify-between items-end">
                        <span className="text-[9px] font-bold text-slate-500">Exp: {deal.expiry}</span>
                        <button 
                          onClick={() => onBuyDeal(deal, deal.pointsRequired)}
                          disabled={isCollected || userPoints < deal.pointsRequired}
                          className={`text-[10px] font-black px-5 py-2 rounded-xl transition-all shadow-sm ${
                            isCollected
                              ? 'bg-slate-200 text-slate-500 border border-slate-300'
                              : userPoints < deal.pointsRequired
                              ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
                              : 'bg-white text-slate-800 border-2 border-black active:translate-y-0.5 active:shadow-none'
                          }`}
                        >
                          {isCollected ? 'ซื้อแล้ว' : userPoints < deal.pointsRequired ? 'คะแนนไม่พอ' : 'ซื้อดีลนี้'}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {/* Special Promotions Section */}
        {specialPromos.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-4 px-1">
              <Tag size={18} className="text-pink-500" />
              <h2 className="text-xl font-bold text-slate-800 uppercase tracking-tight">โปรโมชั่นพิเศษ</h2>
            </div>
            <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2 px-1">
              {specialPromos.map((promo) => {
                const isCollected = collectedCoupons.some(c => c.template_id === promo.id && !c.is_deal);
                return (
                  <motion.div
                    key={promo.id}
                    layout
                    whileTap={{ scale: isCollected ? 1 : 0.98 }}
                    className={`relative flex-shrink-0 w-[280px] h-36 ${promo.bg || 'bg-[#FFD8E4]'} rounded-[2rem] p-5 overflow-hidden border-2 border-black shadow-soft ${isCollected ? 'grayscale opacity-40 pointer-events-none' : ''}`}
                  >
                    <PawPrint className={`absolute -right-4 -bottom-4 w-24 h-24 text-black/5 opacity-50 rotate-12`} />
                    <div className="relative z-10 flex flex-col justify-between h-full">
                      <div>
                        <span className={`text-[9px] font-black text-slate-800 bg-white border border-black px-2 py-0.5 rounded-full mb-2 inline-block`}>
                          PROMO
                        </span>
                        <h3 className={`text-lg font-black text-slate-800 flex items-center gap-1`}>
                          {promo.title}
                        </h3>
                        <p className={`text-[10px] font-bold text-slate-600 opacity-80`}>{promo.description}</p>
                      </div>
                      <div className="flex justify-between items-end">
                        <span className={`text-[9px] font-bold text-slate-500 opacity-70`}>Valid: {promo.expiry}</span>
                        <button 
                          onClick={() => onRedeemCoupon(promo, 0)}
                          disabled={isCollected}
                          className={`text-[10px] font-black px-4 py-1.5 rounded-xl transition-all shadow-sm ${
                            isCollected
                              ? 'bg-slate-200 text-slate-500 border border-slate-300'
                              : `bg-white text-slate-800 border-2 border-black active:translate-y-0.5 active:shadow-none`
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

        {/* Redeem Points Section */}
        <div>
          <div className="flex items-center gap-2 mb-4 px-1">
            <Crown size={18} className="text-amber-500" />
            <h2 className="text-xl font-bold text-slate-800 uppercase tracking-tight">แลกคะแนนสะสม</h2>
          </div>
          <div className="space-y-3">
            {regularRedeemables.length > 0 ? (
              regularRedeemables.map((coupon) => {
                const canRedeem = userPoints >= coupon.pointsRequired;
                const isAlreadyCollected = collectedCoupons.some(c => c.template_id === coupon.id && !c.is_deal);
                const isDisabled = !canRedeem || isAlreadyCollected;

                return (
                  <motion.div
                    key={coupon.id}
                    layout
                    whileTap={{ scale: isDisabled ? 1 : 0.98 }}
                    className={`bg-white p-4 rounded-[2rem] border-2 border-black shadow-soft flex items-center gap-4 group ${isDisabled && !isAlreadyCollected ? 'opacity-40 grayscale' : ''}`}
                  >
                    <div className={`w-12 h-12 ${coupon.bg || 'bg-amber-50'} border-2 border-black rounded-2xl flex items-center justify-center text-xl shadow-sm`}>
                      {getIconComponent(coupon.iconName, 22)}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-black text-slate-800 text-sm">{coupon.title}</h4>
                      <p className="text-[10px] font-bold text-slate-500">{coupon.description}</p>
                      <p className="text-[10px] text-amber-600 font-black mt-0.5">
                        {coupon.pointsRequired} คะแนน
                      </p>
                    </div>
                    <button
                      onClick={() => onRedeemCoupon(coupon, coupon.pointsRequired)}
                      disabled={isDisabled}
                      className={`px-4 py-2 rounded-xl text-[10px] font-black border-2 border-black shadow-sm transition-all ${
                        isAlreadyCollected
                          ? 'bg-slate-100 text-slate-400 border-slate-300 shadow-none'
                          : !canRedeem
                          ? 'bg-slate-50 text-slate-300 border-slate-200'
                          : 'bg-pink-100 text-pink-700 active:translate-y-0.5 active:shadow-none'
                      }`}
                    >
                      {isAlreadyCollected ? 'แลกแล้ว' : canRedeem ? 'แลกเลย' : 'คะแนนไม่พอ'}
                    </button>
                  </motion.div>
                )
              })
            ) : (
              <div className="text-center py-6 border-2 border-dashed border-slate-300 rounded-[2rem] text-slate-400 font-bold text-[10px] uppercase">
                ไม่มีคูปองให้แลกในขณะนี้
              </div>
            )}
          </div>
        </div>

        {/* My Active Coupons Section */}
        <div id="my-coupons-section">
          <div className="flex items-center gap-2 mb-4 px-1">
            <Ticket size={18} className="text-pink-500" />
            <h2 className="text-xl font-bold text-slate-800 uppercase tracking-tight">คูปองของฉัน</h2>
          </div>
          <div className="space-y-3">
            {collectedCoupons.length > 0 ? (
              collectedCoupons.map((coupon, index) => (
                <motion.div
                  key={coupon.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`bg-white p-4 rounded-[2rem] border-2 border-black shadow-soft flex items-center gap-4 ${coupon.is_deal ? 'ring-2 ring-amber-400 ring-offset-2' : ''}`}
                >
                  <div className={`w-10 h-10 ${coupon.bg || 'bg-pink-50'} border-2 border-black rounded-xl flex items-center justify-center text-xl shadow-sm`}>
                    {getIconComponent(coupon.iconName || (coupon.is_deal ? 'Zap' : 'Ticket'), 20)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-black text-slate-800 text-sm">{coupon.title}</h4>
                      {coupon.is_deal && (
                        <span className="bg-amber-400 text-white text-[8px] font-black px-1.5 py-0.5 rounded-md uppercase">DEAL</span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-[9px] font-black text-pink-500 mt-0.5 uppercase tracking-tight">
                       <Clock size={10} strokeWidth={3} />
                       หมดอายุ: {coupon.expiry}
                    </div>
                  </div>
                  <button
                    onClick={() => onUseCoupon(coupon)}
                    className="bg-pink-100 text-pink-700 text-[10px] font-black px-4 py-2 rounded-xl border-2 border-black shadow-sm active:translate-y-0.5 active:shadow-none transition-all"
                  >
                    ใช้เลย
                  </button>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-6 border-2 border-dashed border-slate-300 rounded-[2rem] text-slate-400 font-bold text-xs uppercase">ยังไม่มีคูปองที่เก็บไว้ค่ะ</div>
            )}
          </div>
        </div>

        {/* Used/Expired Section */}
        {usedOrExpiredCoupons.length > 0 && (
          <div className="mt-8">
            <div className="flex items-center gap-2 mb-4 px-1">
              <History size={18} className="text-slate-500" />
              <h2 className="text-xl font-bold text-slate-800 uppercase tracking-tight opacity-50">ประวัติคูปอง</h2>
            </div>
            <div className="space-y-3">
              {usedOrExpiredCoupons.map((coupon, index) => (
                <motion.div
                  key={coupon.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-slate-50 p-4 rounded-[2rem] border-2 border-slate-200 flex items-center gap-4 opacity-40 grayscale pointer-events-none"
                >
                  <div className={`w-10 h-10 bg-white border-2 border-slate-200 rounded-xl flex items-center justify-center shadow-none`}>
                    {getIconComponent(coupon.iconName, 20)}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-slate-400 text-sm line-through">{coupon.title}</h4>
                    <p className="text-[9px] font-bold text-slate-400 uppercase">ใช้งานแล้วเมื่อ {coupon.expiry}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </LayoutGroup>
    </div>
  );
};

export default Promotions;