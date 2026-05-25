"use client";

import React from 'react';
import { motion, LayoutGroup } from 'framer-motion';
import { 
  Ticket, Scissors, Sparkles, Gift, ShowerHead, Leaf, Hand, Tag, Heart, 
  History, Crown, PawPrint, Award, LucideIcon, Zap, Clock, ChevronRight 
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

  const specialPromos = redeemableTemplates.filter(t => t.pointsRequired === 0);
  const regularRedeemables = redeemableTemplates.filter(t => t.pointsRequired > 0);

  return (
    <div className="space-y-10 pb-24">
      <LayoutGroup>
        {/* Header Points Display Card */}
        <motion.div 
          layout
          className="bg-gradient-to-br from-[#18234a] to-[#020d35] rounded-[3rem] p-8 text-white relative overflow-hidden shadow-ambient"
        >
          <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-[#EAFD69]/10 rounded-full blur-3xl" />
          <div className="relative z-10 flex justify-between items-center">
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest">คะแนนสะสมของคุณ</p>
              <div className="flex items-baseline gap-1.5">
                <span className="text-4xl font-black text-[#EAFD69] leading-none tracking-tighter">
                  {userPoints.toLocaleString()}
                </span>
                <span className="text-[10px] font-black text-white/70 uppercase">คะแนน</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-[#EAFD69]">
              <Crown size={24} />
            </div>
          </div>
        </motion.div>

        {/* Exclusive Deals Section */}
        {dealTemplates.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 px-1">
              <div className="w-8 h-8 bg-[#EAFD69]/10 rounded-xl flex items-center justify-center text-[#EAFD69]">
                <Zap size={18} className="fill-[#EAFD69]" />
              </div>
              <div>
                <h2 className="text-xl font-black text-[#020d35] tracking-tight">ดีลสุดพิเศษสำหรับคุณ</h2>
                <p className="text-[11px] font-bold text-[#45464E] opacity-60 uppercase tracking-wider">Exclusive Hot Deals</p>
              </div>
            </div>
            
            <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2 px-1">
              {dealTemplates.map((deal) => {
                const isCollected = collectedCoupons.some(c => c.template_id === deal.id && c.is_deal);
                return (
                  <motion.div
                    key={deal.id}
                    layout
                    whileTap={{ scale: isCollected ? 1 : 0.98 }}
                    className={`relative flex-shrink-0 w-[290px] h-44 bg-white rounded-[3rem] p-8 overflow-hidden shadow-ambient transition-all ${
                      isCollected ? 'opacity-40 pointer-events-none' : ''
                    }`}
                  >
                    {/* Soft glow background */}
                    <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-[#EAFD69]/5 rounded-full blur-2xl" />
                    
                    <div className="relative z-10 flex flex-col justify-between h-full">
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-[9px] font-black text-[#020d35] bg-[#EAFD69] px-2.5 py-1 rounded-full uppercase tracking-wider">
                            HOT DEAL
                          </span>
                          <span className="text-[10px] font-black text-[#020d35] bg-[#F3F3F3] px-2.5 py-1 rounded-full">
                            {deal.pointsRequired} pts
                          </span>
                        </div>
                        <h3 className="text-base font-black text-[#020d35] leading-tight truncate">
                          {deal.title}
                        </h3>
                        <p className="text-[11px] font-bold text-[#45464E] opacity-70 mt-1 line-clamp-2 leading-relaxed">
                          {deal.description}
                        </p>
                      </div>
                      
                      <div className="flex justify-between items-center pt-2">
                        <span className="text-[9px] font-bold text-[#45464E]/50">Exp: {deal.expiry}</span>
                        <button 
                          onClick={() => onBuyDeal(deal, deal.pointsRequired)}
                          disabled={isCollected || userPoints < deal.pointsRequired}
                          className={`text-[10px] font-black px-5 py-2.5 rounded-[3rem] transition-all shadow-sm ${
                            isCollected
                              ? 'bg-[#F3F3F3] text-[#45464E]/40'
                              : userPoints < deal.pointsRequired
                              ? 'bg-[#F3F3F3] text-[#45464E]/30 cursor-not-allowed'
                              : 'bg-gradient-to-br from-[#18234a] to-[#020d35] text-white active:scale-95'
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
          <div className="space-y-4">
            <div className="flex items-center gap-2 px-1">
              <div className="w-8 h-8 bg-[#d9d6fe] rounded-xl flex items-center justify-center text-[#5c5b7d]">
                <Tag size={18} />
              </div>
              <div>
                <h2 className="text-xl font-black text-[#020d35] tracking-tight">โปรโมชั่นพิเศษ</h2>
                <p className="text-[11px] font-bold text-[#45464E] opacity-60 uppercase tracking-wider">Special Offers</p>
              </div>
            </div>

            <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2 px-1">
              {specialPromos.map((promo) => {
                const isCollected = collectedCoupons.some(c => c.template_id === promo.id && !c.is_deal);
                return (
                  <motion.div
                    key={promo.id}
                    layout
                    whileTap={{ scale: isCollected ? 1 : 0.98 }}
                    className={`relative flex-shrink-0 w-[290px] h-40 bg-white rounded-[3rem] p-8 overflow-hidden shadow-ambient transition-all ${
                      isCollected ? 'opacity-40 pointer-events-none' : ''
                    }`}
                  >
                    <div className="absolute -right-6 -bottom-6 w-28 h-28 bg-[#d9d6fe]/10 rounded-full blur-2xl" />
                    
                    <div className="relative z-10 flex flex-col justify-between h-full">
                      <div>
                        <span className="text-[9px] font-black text-[#5c5b7d] bg-[#d9d6fe] px-2.5 py-1 rounded-full uppercase tracking-wider mb-2 inline-block">
                          PROMO
                        </span>
                        <h3 className="text-base font-black text-[#020d35] leading-tight truncate">
                          {promo.title}
                        </h3>
                        <p className="text-[11px] font-bold text-[#45464E] opacity-70 mt-1 line-clamp-1">
                          {promo.description}
                        </p>
                      </div>
                      
                      <div className="flex justify-between items-center pt-2">
                        <span className="text-[9px] font-bold text-[#45464E]/50">Valid: {promo.expiry}</span>
                        <button 
                          onClick={() => onRedeemCoupon(promo, 0)}
                          disabled={isCollected}
                          className={`text-[10px] font-black px-5 py-2.5 rounded-[3rem] transition-all shadow-sm ${
                            isCollected
                              ? 'bg-[#F3F3F3] text-[#45464E]/40'
                              : 'bg-gradient-to-br from-[#18234a] to-[#020d35] text-white active:scale-95'
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
        <div className="space-y-4">
          <div className="flex items-center gap-2 px-1">
            <div className="w-8 h-8 bg-[#EAFD69]/10 rounded-xl flex items-center justify-center text-[#020d35]">
              <Crown size={18} />
            </div>
            <div>
              <h2 className="text-xl font-black text-[#020d35] tracking-tight">แลกคะแนนสะสม</h2>
              <p className="text-[11px] font-bold text-[#45464E] opacity-60 uppercase tracking-wider">Redeem Rewards</p>
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
                    layout
                    whileTap={{ scale: isDisabled ? 1 : 0.98 }}
                    className={`bg-white p-6 rounded-[3rem] shadow-ambient flex items-center gap-4 transition-all ${
                      isDisabled && !isAlreadyCollected ? 'opacity-50' : ''
                    }`}
                  >
                    <div className="w-14 h-14 bg-[#F3F3F3] rounded-[2rem] flex items-center justify-center text-[#020d35] shrink-0">
                      {getIconComponent(coupon.iconName, 24)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h4 className="font-black text-[#020d35] text-sm truncate">{coupon.title}</h4>
                      <p className="text-[11px] font-bold text-[#45464E] opacity-70 truncate mt-0.5">
                        {coupon.description}
                      </p>
                      <span className="inline-block text-[10px] text-[#020d35] font-black bg-[#EAFD69] px-2 py-0.5 rounded-full mt-1.5">
                        {coupon.pointsRequired} คะแนน
                      </span>
                    </div>
                    
                    <button
                      onClick={() => onRedeemCoupon(coupon, coupon.pointsRequired)}
                      disabled={isDisabled}
                      className={`px-5 py-2.5 rounded-[3rem] text-[10px] font-black transition-all shadow-sm shrink-0 ${
                        isAlreadyCollected
                          ? 'bg-[#F3F3F3] text-[#45464E]/40'
                          : !canRedeem
                          ? 'bg-[#F3F3F3] text-[#45464E]/30'
                          : 'bg-gradient-to-br from-[#18234a] to-[#020d35] text-white active:scale-95'
                      }`}
                    >
                      {isAlreadyCollected ? 'แลกแล้ว' : canRedeem ? 'แลกเลย' : 'คะแนนไม่พอ'}
                    </button>
                  </motion.div>
                )
              })
            ) : (
              <div className="text-center py-10 bg-[#F3F3F3] rounded-[3rem] text-[#45464E]/40 font-bold text-xs uppercase tracking-wider">
                ไม่มีคูปองให้แลกในขณะนี้
              </div>
            )}
          </div>
        </div>

        {/* My Active Coupons Section */}
        <div id="my-coupons-section" className="space-y-4">
          <div className="flex items-center gap-2 px-1">
            <div className="w-8 h-8 bg-[#d9d6fe] rounded-xl flex items-center justify-center text-[#5c5b7d]">
              <Ticket size={18} />
            </div>
            <div>
              <h2 className="text-xl font-black text-[#020d35] tracking-tight">คูปองของฉัน</h2>
              <p className="text-[11px] font-bold text-[#45464E] opacity-60 uppercase tracking-wider">My Active Coupons</p>
            </div>
          </div>

          <div className="space-y-4">
            {collectedCoupons.length > 0 ? (
              collectedCoupons.map((coupon, index) => (
                <motion.div
                  key={coupon.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`bg-white p-6 rounded-[3rem] shadow-ambient flex items-center gap-4 relative overflow-hidden ${
                    coupon.is_deal ? 'ring-2 ring-[#EAFD69]' : ''
                  }`}
                >
                  <div className="w-12 h-12 bg-[#F3F3F3] rounded-[2rem] flex items-center justify-center text-[#020d35] shrink-0">
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
                    <div className="flex items-center gap-1 text-[10px] font-bold text-[#45464E] opacity-60 mt-1">
                      <Clock size={12} />
                      หมดอายุ: {coupon.expiry}
                    </div>
                  </div>
                  
                  <button
                    onClick={() => onUseCoupon(coupon)}
                    className="bg-gradient-to-br from-[#18234a] to-[#020d35] text-white text-[10px] font-black px-5 py-2.5 rounded-[3rem] shadow-sm active:scale-95 transition-all shrink-0"
                  >
                    ใช้เลย
                  </button>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-10 bg-[#F3F3F3] rounded-[3rem] text-[#45464E]/40 font-bold text-xs uppercase tracking-wider">
                ยังไม่มีคูปองที่เก็บไว้ค่ะ
              </div>
            )}
          </div>
        </div>
      </LayoutGroup>
    </div>
  );
};

export default Promotions;