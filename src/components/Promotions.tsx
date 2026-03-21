"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Ticket, Gift, Sparkles, Scissors, Clock, ChevronRight, LucideIcon, ShowerHead, Leaf, Hand, Tag, Heart, PawPrint, Crown } from 'lucide-react';

// Define the Coupon interface (reused for collected coupons)
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

// New interface for Special Promotions
interface SpecialPromotionItem {
  id: number;
  tag: 'HOT' | 'EXCLUSIVE';
  title: string;
  description: string;
  expiry: string;
  bgColor: string; // Tailwind class for background
  textColor: string; // Tailwind class for text
  buttonColor: string; // Tailwind class for button background
  buttonTextColor: string; // Tailwind class for button text
  pawPrintColor: string; // Tailwind class for paw print watermark
  iconName?: string; // Optional icon for the title
}

// New interface for Member Deals
interface MemberDealItem {
  id: number;
  discountPercentage: number;
  iconName: string; // Lucide icon name
  serviceName: string;
  currentPrice: string;
  originalPrice: string;
  membershipLevelRequired: string; // e.g., "ทุกระดับ", "Gold ขึ้นไป"
  bgColor: string; // Tailwind class for background
  iconColor: string; // Tailwind class for icon color
}

interface PromotionsProps {
  userPoints: number;
  collectedCoupons: Coupon[];
  onCollectCoupon: (coupon: Coupon) => void;
}

// Map icon names to LucideIcon components
const iconMap: Record<string, LucideIcon> = {
  Scissors: Scissors,
  Sparkles: Sparkles,
  Gift: Gift,
  Ticket: Ticket,
  ShowerHead: ShowerHead,
  Leaf: Leaf,
  Hand: Hand,
  Tag: Tag,
  Heart: Heart,
};

// Helper function to get the icon component
const getIconComponent = (iconName: string, size: number, className?: string) => {
  const IconComponent = iconMap[iconName];
  return IconComponent ? <IconComponent size={size} className={className} /> : null;
};

const Promotions = ({ userPoints, collectedCoupons, onCollectCoupon }: PromotionsProps) => {
  // Mock data for Special Promotions
  const specialPromotionsData: SpecialPromotionItem[] = [
    {
      id: 1,
      tag: 'HOT',
      title: 'สปาคู่รัก',
      description: 'พาน้องมา 2 ตัว ลด 30%',
      expiry: 'ถึง 31 มี.ค. 69',
      bgColor: 'bg-[#FFD8E4]', // Light Pink
      textColor: 'text-pink-800',
      buttonColor: 'bg-pink-200',
      buttonTextColor: 'text-pink-700',
      pawPrintColor: 'text-pink-200',
      iconName: 'Heart',
    },
    {
      id: 2,
      tag: 'EXCLUSIVE',
      title: 'สมาชิก Gold',
      description: 'ฟรี! สปาผิวพรรณ',
      expiry: 'ถึง 15 เม.ย. 69',
      bgColor: 'bg-[#FFE3BC]', // Light Amber
      textColor: 'text-amber-800',
      buttonColor: 'bg-amber-200',
      buttonTextColor: 'text-amber-700',
      pawPrintColor: 'text-amber-200',
    },
    // Add more special promotions here
  ];

  // Mock data for Member Deals (these are direct offers, not collectable coupons)
  const memberDealsData: MemberDealItem[] = [
    {
      id: 1,
      discountPercentage: 24,
      iconName: 'ShowerHead',
      serviceName: 'อาบน้ำ + ตัดขน',
      currentPrice: '฿990',
      originalPrice: '฿1,300',
      membershipLevelRequired: 'ทุกระดับ',
      bgColor: 'bg-emerald-50',
      iconColor: 'text-emerald-500',
    },
    {
      id: 2,
      discountPercentage: 28,
      iconName: 'Leaf',
      serviceName: 'แพ็คเกจสปาพรีเมียม',
      currentPrice: '฿1,799',
      originalPrice: '฿2,500',
      membershipLevelRequired: 'Gold ขึ้นไป',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-500',
    },
    {
      id: 3,
      discountPercentage: 36,
      iconName: 'Hand',
      serviceName: 'ทำเล็บ + สปาเท้า',
      currentPrice: '฿450',
      originalPrice: '฿700',
      membershipLevelRequired: 'ทุกระดับ',
      bgColor: 'bg-orange-50',
      iconColor: 'text-orange-500',
    },
    {
      id: 4,
      discountPercentage: 33,
      iconName: 'Sparkles',
      serviceName: 'แต่งตัว + ถ่ายรูป',
      currentPrice: '฿999',
      originalPrice: '฿1,500',
      membershipLevelRequired: 'Platinum',
      bgColor: 'bg-pink-50',
      iconColor: 'text-pink-500',
    },
  ];

  // The allCoupons array is kept for the 'onCollectCoupon' logic,
  // even if it's not directly displayed in a 'collectable' section in this new UI.
  const allCoupons: Coupon[] = [
    {
      id: 1,
      title: 'ส่วนลดอาบน้ำ-ตัดขน',
      description: 'ลดทันทีเมื่อใช้บริการ Full Service',
      value: '100.-',
      type: 'DISCOUNT',
      expiry: 'หมดเขต 30 มิ.ย. 67',
      iconName: 'Scissors',
      color: 'from-pink-400 to-rose-500',
      bg: 'bg-rose-50',
      pointsRequired: 500,
    },
    {
      id: 2,
      title: 'สปาโอโซน Buy 1 Get 1',
      description: 'ซื้อ 1 ครั้ง แถมฟรีอีก 1 ครั้งทันที',
      value: 'B1G1',
      type: 'FREE',
      expiry: 'หมดเขต 15 มิ.ย. 67',
      iconName: 'Sparkles',
      color: 'from-amber-400 to-orange-500',
      bg: 'bg-amber-50',
      pointsRequired: 800,
    },
    {
      id: 3,
      title: 'Welcome New Pet',
      description: 'ส่วนลด 20% สำหรับสมาชิกใหม่',
      value: '20%',
      type: 'PERCENT',
      expiry: 'ไม่มีวันหมดอายุ',
      iconName: 'Gift',
      color: 'from-emerald-400 to-teal-500',
      bg: 'bg-emerald-50',
      pointsRequired: 0,
    },
    {
      id: 4,
      title: 'ฟรี! ขนมขบเคี้ยว',
      description: 'รับขนมฟรี 1 ซองเมื่อมียอดครบ 500.-',
      value: 'FREE',
      type: 'GIFT',
      expiry: 'เฉพาะวันศุกร์เท่านั้น',
      iconName: 'Ticket',
      color: 'from-blue-400 to-indigo-500',
      bg: 'bg-blue-50',
      pointsRequired: 300,
    }
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
          {specialPromotionsData.map((promo) => (
            <motion.div
              key={promo.id}
              whileTap={{ scale: 0.98 }}
              className={`relative flex-shrink-0 w-[280px] h-36 ${promo.bgColor} rounded-[2rem] p-5 overflow-hidden shadow-sm border border-slate-50`}
            >
              {/* Paw print watermark */}
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
                  <button className={`text-xs font-bold ${promo.buttonTextColor} ${promo.buttonColor} px-3 py-1.5 rounded-full active:scale-95 transition-all`}>
                    ใช้เลย
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
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
                <span className="text-[10px] text-slate-400 font-medium">{coupon.expiry}</span>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-6 text-slate-400">คุณยังไม่มีคูปองที่เก็บไว้ค่ะ</div>
          )}
        </div>
      </div>

      {/* Deals for Members Section */}
      <div>
        <div className="flex items-center gap-2 mb-4 px-1">
          <Gift size={18} className="text-pink-500" />
          <h2 className="text-xl font-bold text-slate-800">ดีลสำหรับสมาชิก</h2>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {memberDealsData.map((deal, index) => (
            <motion.div
              key={deal.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileTap={{ scale: 0.98 }}
              className="relative bg-white p-4 rounded-3xl shadow-sm border border-slate-50 flex flex-col items-center text-center"
            >
              <span className="absolute top-3 right-3 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                -{deal.discountPercentage}%
              </span>
              <div className={`w-16 h-16 ${deal.bgColor} rounded-full flex items-center justify-center text-2xl ${deal.iconColor} mb-3 shadow-inner`}>
                {getIconComponent(deal.iconName, 28)}
              </div>
              <h4 className="font-bold text-slate-800 text-sm mb-1">{deal.serviceName}</h4>
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-lg font-bold text-pink-500">{deal.currentPrice}</span>
                <span className="text-xs text-slate-400 line-through">{deal.originalPrice}</span>
              </div>
              <div className="flex items-center gap-1 text-[10px] text-slate-500 font-medium">
                <Crown size={10} className="text-amber-500" />
                {deal.membershipLevelRequired}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* The allCoupons and onCollectCoupon logic is preserved, but not directly exposed in this UI.
          If you need a section for users to 'collect' coupons for points, please let me know! */}
    </div>
  );
};

export default Promotions;