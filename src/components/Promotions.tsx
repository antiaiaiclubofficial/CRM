"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Ticket, Gift, Sparkles, Scissors, Clock, ChevronRight, LucideIcon } from 'lucide-react';

// Define the Coupon interface
interface Coupon {
  id: number;
  title: string;
  description: string;
  value: string;
  type: string;
  expiry: string;
  iconName: string; // Changed to string for easier state management
  color: string;
  bg: string;
  pointsRequired: number;
}

interface PromotionsProps {
  userPoints: number;
  collectedCoupons: Coupon[]; // New prop: list of coupons already collected by the user
  onCollectCoupon: (coupon: Coupon) => void; // New prop: function to call when a coupon is collected
}

// Map icon names to LucideIcon components
const iconMap: Record<string, LucideIcon> = {
  Scissors: Scissors,
  Sparkles: Sparkles,
  Gift: Gift,
  Ticket: Ticket,
};

// Helper function to get the icon component
const getIconComponent = (iconName: string, size: number) => {
  const IconComponent = iconMap[iconName];
  return IconComponent ? <IconComponent size={size} /> : null;
};

const Promotions = ({ userPoints, collectedCoupons, onCollectCoupon }: PromotionsProps) => {
  const [activeSection, setActiveSection] = useState<'available' | 'myCoupons'>('available');

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

  // Filter available coupons (not in collectedCoupons)
  const availableCoupons = allCoupons.filter(
    (coupon) => !collectedCoupons.some((c) => c.id === coupon.id)
  );

  return (
    <div className="space-y-6 pb-20">
      <div className="flex justify-between items-center px-1">
        <h2 className="text-xl font-bold text-slate-800">คูปองและสิทธิพิเศษ</h2>
        <div className="bg-white px-3 py-1 rounded-full border border-slate-100 shadow-sm">
          <span className="text-xs font-bold text-pink-500">มี {availableCoupons.length + collectedCoupons.length} คูปอง</span>
        </div>
      </div>

      {/* Section Toggle Buttons */}
      <div className="flex bg-slate-100 rounded-full p-1">
        <button
          onClick={() => setActiveSection('available')}
          className={`flex-1 py-2 rounded-full text-sm font-medium transition-colors ${
            activeSection === 'available' ? 'bg-white text-pink-500 shadow-sm' : 'text-slate-500'
          }`}
        >
          คูปองทั้งหมด ({availableCoupons.length})
        </button>
        <button
          onClick={() => setActiveSection('myCoupons')}
          className={`flex-1 py-2 rounded-full text-sm font-medium transition-colors ${
            activeSection === 'myCoupons' ? 'bg-white text-pink-500 shadow-sm' : 'text-slate-500'
          }`}
        >
          คูปองของฉัน ({collectedCoupons.length})
        </button>
      </div>

      {/* Available Coupons Section */}
      {activeSection === 'available' && (
        <div className="space-y-4">
          {availableCoupons.length > 0 ? (
            availableCoupons.map((coupon, index) => {
              const canRedeem = userPoints >= coupon.pointsRequired;
              const cardClasses = canRedeem 
                ? "relative flex h-32 bg-white rounded-[2rem] overflow-hidden shadow-sm border border-slate-50 cursor-pointer group"
                : "relative flex h-32 bg-white rounded-[2rem] overflow-hidden shadow-sm border border-slate-50 cursor-not-allowed opacity-50 grayscale";

              const buttonClasses = canRedeem
                ? "text-[10px] font-bold bg-slate-100 px-3 py-1 rounded-full text-slate-600 group-hover:bg-pink-500 group-hover:text-white transition-all"
                : "text-[10px] font-bold bg-slate-100 px-3 py-1 rounded-full text-slate-400 cursor-not-allowed";

              return (
                <motion.div
                  key={coupon.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileTap={canRedeem ? { scale: 0.98 } : {}}
                  className={cardClasses}
                >
                  {/* Left Section (Value) */}
                  <div className={`w-28 bg-gradient-to-br ${coupon.color} flex flex-col items-center justify-center text-white p-2 relative`}>
                    <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-white rounded-full z-10" />
                    <div className="mb-1 opacity-80">{getIconComponent(coupon.iconName, 24)}</div>
                    <span className="text-2xl font-black">{coupon.value}</span>
                    <span className="text-[10px] font-bold opacity-80 tracking-widest uppercase">{coupon.type}</span>
                  </div>

                  {/* Right Section (Details) */}
                  <div className="flex-1 p-4 flex flex-col justify-between relative">
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm mb-1 group-hover:text-pink-500 transition-colors">{coupon.title}</h4>
                      <p className="text-[11px] text-slate-500 line-clamp-2">{coupon.description}</p>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-1 text-[10px] font-medium text-slate-400">
                        <Clock size={10} />
                        {coupon.expiry}
                      </div>
                      <button 
                        onClick={() => onCollectCoupon(coupon)} // Call onCollectCoupon when button is clicked
                        disabled={!canRedeem}
                        className={buttonClasses}
                      >
                        {canRedeem ? 'เก็บคูปอง' : `ต้องการ ${coupon.pointsRequired} แต้ม`}
                      </button>
                    </div>
                  </div>

                  {/* Dashed Line Decor */}
                  <div className="absolute left-28 top-0 bottom-0 border-l-2 border-dashed border-slate-100 z-0" />
                </motion.div>
              );
            })
          ) : (
            <div className="text-center py-10 text-slate-400">ไม่มีคูปองให้เก็บแล้วค่ะ</div>
          )}
        </div>
      )}

      {/* My Coupons Section */}
      {activeSection === 'myCoupons' && (
        <div className="space-y-4">
          {collectedCoupons.length > 0 ? (
            collectedCoupons.map((coupon, index) => (
              <motion.div
                key={coupon.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileTap={{ scale: 0.98 }}
                className="relative flex h-32 bg-white rounded-[2rem] overflow-hidden shadow-sm border border-slate-50 cursor-pointer group"
              >
                {/* Left Section (Value) */}
                <div className={`w-28 bg-gradient-to-br ${coupon.color} flex flex-col items-center justify-center text-white p-2 relative`}>
                  <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-white rounded-full z-10" />
                  <div className="mb-1 opacity-80">{getIconComponent(coupon.iconName, 24)}</div>
                  <span className="text-2xl font-black">{coupon.value}</span>
                  <span className="text-[10px] font-bold opacity-80 tracking-widest uppercase">{coupon.type}</span>
                </div>

                {/* Right Section (Details) */}
                <div className="flex-1 p-4 flex flex-col justify-between relative">
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm mb-1">{coupon.title}</h4>
                    <p className="text-[11px] text-slate-500 line-clamp-2">{coupon.description}</p>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1 text-[10px] font-medium text-slate-400">
                      <Clock size={10} />
                      {coupon.expiry}
                    </div>
                    <button className="text-[10px] font-bold bg-pink-500 px-3 py-1 rounded-full text-white active:scale-95 transition-all">
                      ใช้คูปอง
                    </button>
                  </div>
                </div>

                {/* Dashed Line Decor */}
                <div className="absolute left-28 top-0 bottom-0 border-l-2 border-dashed border-slate-100 z-0" />
              </motion.div>
            ))
          ) : (
            <div className="text-center py-10 text-slate-400">คุณยังไม่มีคูปองที่เก็บไว้ค่ะ</div>
          )}
        </div>
      )}

      <div className="bg-white/40 p-6 rounded-[2.5rem] text-center border-2 border-dashed border-slate-200">
        <p className="text-xs text-slate-400">คุณมีแต้มสะสม <span className="text-pink-500 font-bold">{userPoints} แต้ม</span><br/>แลกรับคูปองส่วนลดเพิ่มเติมได้ที่เมนู "แลกของรางวัล"</p>
      </div>
    </div>
  );
};

export default Promotions;