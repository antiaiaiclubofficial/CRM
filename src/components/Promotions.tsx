"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Ticket, Gift, Scissors, Sparkles, ShowerHead, Leaf, Hand, Tag, Heart, PawPrint, Crown, History, LucideIcon } from 'lucide-react';

// Define the Coupon interface
interface Coupon {
  id: number;
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

// Interface for Special Promotions
interface SpecialPromotionItem {
  id: number;
  tag: 'HOT' | 'EXCLUSIVE';
  title: string;
  description: string;
  expiry: string;
  bgColor: string;
  textColor: string;
  buttonColor: string;
  buttonTextColor: string;
  pawPrintColor: string;
  iconName?: string;
}

interface UsedCoupon extends Coupon {
  usedDate?: string;
}

interface PromotionsProps {
  userPoints: number;
  collectedCoupons: Coupon[];
  usedOrExpiredCoupons: UsedCoupon[];
  onRedeemCoupon: (coupon: Coupon, pointsCost: number) => void;
  onUseCoupon: (couponId: number) => void;
  collectedSpecialPromos: number[]; // Changed from usedSpecialPromotions
  onCollectSpecialPromotion: (promo: Coupon) => void; // Changed logic to pass coupon object
}

// Map icon names to LucideIcon components
const iconMap: Record<string, LucideIcon> = {
  Scissors, Sparkles, Gift, Ticket, ShowerHead, Leaf, Hand, Tag, Heart, History, Crown, PawPrint
};

// Helper function to get the icon component
const getIconComponent = (iconName: string, size: number, className?: string) => {
  const IconComponent = iconMap[iconName];
  return IconComponent ? <IconComponent size={size} className={className} /> : null;
};

const Promotions = ({ 
  userPoints, 
  collectedCoupons, 
  usedOrExpiredCoupons, 
  onRedeemCoupon, 
  onUseCoupon, 
  collectedSpecialPromos, 
  onCollectSpecialPromotion 
}: PromotionsProps) => {
  
  // Data for Special Promotions - defined here to map easily to Coupons
  const specialPromotionsData: SpecialPromotionItem[] = [
    {
      id: 201, // Use unique IDs that won't clash with redeemable ones
      tag: 'HOT',
      title: 'สปาคู่รัก',
      description: 'พาน้องมา 2 ตัว ลด 30%',
      expiry: '31 มี.ค. 69',
      bgColor: 'bg-[#FFD8E4]',
      textColor: 'text-pink-800',
      buttonColor: 'bg-pink-200',
      buttonTextColor: 'text-pink-700',
      pawPrintColor: 'text-pink-200',
      iconName: 'Heart',
    },
    {
      id: 202,
      tag: 'EXCLUSIVE',
      title: 'สมาชิก Gold',
      description: 'ฟรี! สปาผิวพรรณ',
      expiry: '15 เม.ย. 69',
      bgColor: 'bg-[#FFE3BC]',
      textColor: 'text-amber-800',
      buttonColor: 'bg-amber-200',
      buttonTextColor: 'text-amber-700',
      pawPrintColor: 'text-amber-200',
      iconName: 'Sparkles',
    },
  ];

  // Helper to convert SpecialPromo to Coupon format
  const convertToCoupon = (promo: SpecialPromotionItem): Coupon => ({
    id: promo.id,
    title: promo.title,
    description: promo.description,
    value: promo.tag === 'HOT' ? '30%' : 'FREE',
    type: promo.tag === 'HOT' ? 'PERCENT' : 'GIFT',
    expiry: promo.expiry,
    iconName: promo.iconName || 'Ticket',
    color: promo.tag === 'HOT' ? 'from-pink-400 to-rose-500' : 'from-amber-400 to-orange-500',
    bg: promo.bgColor,
    pointsRequired: 0,
  });

  const memberDealsData = [
    { id: 1, discountPercentage: 24, iconName: 'ShowerHead', serviceName: 'อาบน้ำ + ตัดขน', currentPrice: '฿990', originalPrice: '฿1,300', membershipLevelRequired: 'ทุกระดับ', bgColor: 'bg-emerald-50', iconColor: 'text-emerald-500' },
    { id: 2, discountPercentage: 28, iconName: 'Leaf', serviceName: 'แพ็คเกจสปาพรีเมียม', currentPrice: '฿1,799', originalPrice: '฿2,500', membershipLevelRequired: 'Gold ขึ้นไป', bgColor: 'bg-purple-50', iconColor: 'text-purple-500' },
  ];

  const redeemableCouponsData: Coupon[] = [
    { id: 101, title: 'ส่วนลด 100.-', description: 'สำหรับบริการใดก็ได้', value: '100.-', type: 'DISCOUNT', expiry: '31 ธ.ค. 67', iconName: 'Tag', color: 'from-pink-400 to-rose-500', bg: 'bg-rose-50', pointsRequired: 500 },
    { id: 102, title: 'ฟรี! แชมพูพรีเมียม', description: 'เมื่อใช้บริการอาบน้ำ', value: 'FREE', type: 'GIFT', expiry: '31 ธ.ค. 67', iconName: 'ShowerHead', color: 'from-emerald-400 to-teal-500', bg: 'bg-emerald-50', pointsRequired: 800 },
  ];

  return (
    <div className="space-y-8 pb-20">
      {/* Special Promotions Section */}
      <div>
        <div className="flex items-center gap-2 mb-4 px-1">
          <Tag size={18} className="text-pink-500" />
          <h2 className="text-xl font-bold text-slate-800">โปรโมชั่นพิเศษ</h2>
        </div>
        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2 px-1">
          {specialPromotionsData.map((promo) => {
            const isCollected = collectedSpecialPromos.includes(promo.id);
            return (
              <motion.div
                key={promo.id}
                whileTap={{ scale: isCollected ? 1 : 0.98 }}
                className={`relative flex-shrink-0 w-[280px] h-36 ${promo.bgColor} rounded-[2rem] p-5 overflow-hidden shadow-sm border border-slate-50 ${isCollected ? 'opacity-60 grayscale' : ''}`}
              >
                <PawPrint className={`absolute -right-4 -bottom-4 w-24 h-24 ${promo.pawPrintColor} opacity-50 rotate-12`} />
                <PawPrint className={`absolute -left-8 -top-8 w-16 h-16 ${promo.pawPrintColor} opacity-30 -rotate-12`} />

                <div className="relative z-10 flex flex-col justify-between h-full">
                  <div>
                    <span className={`text-[10px] font-bold ${promo.textColor} bg-white/60 backdrop-blur-sm px-2 py-0.5 rounded-full mb-2 inline-block`}>
                      {promo.tag}
                    </span>
                    <h3 className={`text-lg font-bold ${promo.textColor} flex items-center gap-1`}>
                      {promo.title} {promo.iconName && getIconComponent(promo.iconName, 18, promo.textColor)}
                    </h3>
                    <p className={`text-xs ${promo.textColor} opacity-80`}>{promo.description}</p>
                  </div>
                  <div className="flex justify-between items-end">
                    <span className={`text-[10px] ${promo.textColor} opacity-70`}>{promo.expiry}</span>
                    <button 
                      onClick={() => onCollectSpecialPromotion(convertToCoupon(promo))}
                      disabled={isCollected}
                      className={`text-xs font-bold px-4 py-1.5 rounded-full transition-all ${
                        isCollected
                          ? 'bg-slate-100 text-slate-500 cursor-not-allowed'
                          : `${promo.buttonColor} ${promo.buttonTextColor} active:scale-95 shadow-sm`
                      }`}
                    >
                      {isCollected ? 'เก็บแล้ว' : 'เก็บ'}
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* My Coupons Section */}
      <div>
        <div className="flex items-center gap-2 mb-4 px-1">
          <Ticket size={18} className="text-pink-500" />
          <h2 className="text-xl font-bold text-slate-800">คูปองของฉัน</h2>
        </div>
        <div className="space-y-3">
          {collectedCoupons.length > 0 ? (
            collectedCoupons.map((coupon, index) => (
              <motion.div
                key={coupon.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileTap={{ scale: 0.98 }}
                className="bg-white p-4 rounded-2xl shadow-sm border border-slate-50 flex items-center gap-4 group"
              >
                <div className={`w-10 h-10 ${coupon.bg} rounded-lg flex items-center justify-center text-xl shadow-inner`}>
                  {getIconComponent(coupon.iconName, 20)}
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-slate-800 text-sm">{coupon.title}</h4>
                  <p className="text-xs text-slate-500">{coupon.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-400 font-medium">{coupon.expiry}</span>
                  <button
                    onClick={() => onUseCoupon(coupon.id)}
                    className="bg-pink-100 text-pink-700 text-xs font-bold px-3 py-1.5 rounded-full active:scale-95 transition-all"
                  >
                    ใช้เลย
                  </button>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-6 text-slate-400">คุณยังไม่มีคูปองที่เก็บไว้ค่ะ</div>
          )}
        </div>
      </div>

      {/* Redeem Points Section */}
      <div>
        <div className="flex items-center gap-2 mb-4 px-1">
          <Crown size={18} className="text-amber-500" />
          <h2 className="text-xl font-bold text-slate-800">แลกคะแนนเป็นส่วนลด</h2>
        </div>
        <div className="space-y-3">
          {redeemableCouponsData.map((coupon, index) => {
            const canRedeem = userPoints >= coupon.pointsRequired;
            const isAlreadyCollected = collectedCoupons.some(c => c.id === coupon.id);
            const isDisabled = !canRedeem || isAlreadyCollected;

            return (
              <motion.div
                key={coupon.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileTap={{ scale: isDisabled ? 1 : 0.98 }}
                className={`bg-white p-4 rounded-2xl shadow-sm border border-slate-50 flex items-center gap-4 group ${isDisabled ? 'opacity-50 grayscale' : ''}`}
              >
                <div className={`w-10 h-10 ${coupon.bg} rounded-lg flex items-center justify-center text-xl shadow-inner`}>
                  {getIconComponent(coupon.iconName, 20)}
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-slate-800 text-sm">{coupon.title}</h4>
                  <p className="text-xs text-slate-500">{coupon.description}</p>
                  <p className="text-[10px] text-slate-400 font-medium mt-1">
                    ใช้ {coupon.pointsRequired} คะแนน
                  </p>
                </div>
                <button
                  onClick={() => onRedeemCoupon(coupon, coupon.pointsRequired)}
                  disabled={isDisabled}
                  className={`text-xs font-bold px-3 py-1.5 rounded-full transition-all ${
                    isDisabled
                      ? 'bg-slate-100 text-slate-500 cursor-not-allowed'
                      : 'bg-pink-100 text-pink-700 active:scale-95'
                  }`}
                >
                  {isAlreadyCollected ? 'แลกแล้ว' : 'แลกเลย'}
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Used/Expired Section */}
      <div>
        <div className="flex items-center gap-2 mb-4 px-1">
          <History size={18} className="text-slate-500" />
          <h2 className="text-xl font-bold text-slate-800">คูปองที่ใช้แล้ว/หมดอายุ</h2>
        </div>
        <div className="space-y-3">
          {usedOrExpiredCoupons.length > 0 ? (
            usedOrExpiredCoupons.map((coupon, index) => (
              <motion.div
                key={coupon.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white p-4 rounded-2xl shadow-sm border border-slate-50 flex items-center gap-4 opacity-60 grayscale"
              >
                <div className={`w-10 h-10 ${coupon.bg} rounded-lg flex items-center justify-center text-xl shadow-inner`}>
                  {getIconComponent(coupon.iconName, 20)}
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-slate-800 text-sm line-through">{coupon.title}</h4>
                  <p className="text-xs text-slate-500">{coupon.description}</p>
                </div>
                <span className="text-[10px] text-slate-400 font-medium">
                  {coupon.usedDate ? `ใช้เมื่อ: ${coupon.usedDate}` : `หมดอายุ: ${coupon.expiry}`}
                </span>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-6 text-slate-400">ไม่มีคูปองที่ใช้แล้วหรือหมดอายุค่ะ</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Promotions;