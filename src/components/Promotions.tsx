"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Ticket, Gift, Sparkles, Scissors, Clock, ChevronRight } from 'lucide-react';

interface PromotionsProps {
  userPoints: number;
}

const Promotions = ({ userPoints }: PromotionsProps) => {
  const coupons = [
    {
      id: 1,
      title: 'ส่วนลดอาบน้ำ-ตัดขน',
      description: 'ลดทันทีเมื่อใช้บริการ Full Service',
      value: '100.-',
      type: 'DISCOUNT',
      expiry: 'หมดเขต 30 มิ.ย. 67',
      icon: <Scissors size={24} />,
      color: 'from-pink-400 to-rose-500',
      bg: 'bg-rose-50',
      pointsRequired: 500, // Added point requirement
    },
    {
      id: 2,
      title: 'สปาโอโซน Buy 1 Get 1',
      description: 'ซื้อ 1 ครั้ง แถมฟรีอีก 1 ครั้งทันที',
      value: 'B1G1',
      type: 'FREE',
      expiry: 'หมดเขต 15 มิ.ย. 67',
      icon: <Sparkles size={24} />,
      color: 'from-amber-400 to-orange-500',
      bg: 'bg-amber-50',
      pointsRequired: 800, // Added point requirement
    },
    {
      id: 3,
      title: 'Welcome New Pet',
      description: 'ส่วนลด 20% สำหรับสมาชิกใหม่',
      value: '20%',
      type: 'PERCENT',
      expiry: 'ไม่มีวันหมดอายุ',
      icon: <Gift size={24} />,
      color: 'from-emerald-400 to-teal-500',
      bg: 'bg-emerald-50',
      pointsRequired: 0, // No points required for welcome coupon
    },
    {
      id: 4,
      title: 'ฟรี! ขนมขบเคี้ยว',
      description: 'รับขนมฟรี 1 ซองเมื่อมียอดครบ 500.-',
      value: 'FREE',
      type: 'GIFT',
      expiry: 'เฉพาะวันศุกร์เท่านั้น',
      icon: <Ticket size={24} />,
      color: 'from-blue-400 to-indigo-500',
      bg: 'bg-blue-50',
      pointsRequired: 300, // Added point requirement
    }
  ];

  return (
    <div className="space-y-6 pb-20">
      <div className="flex justify-between items-center px-1">
        <h2 className="text-xl font-bold text-slate-800">คูปองและสิทธิพิเศษ</h2>
        <div className="bg-white px-3 py-1 rounded-full border border-slate-100 shadow-sm">
          <span className="text-xs font-bold text-pink-500">มี {coupons.length} คูปอง</span>
        </div>
      </div>

      <div className="space-y-4">
        {coupons.map((coupon, index) => {
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
                <div className="mb-1 opacity-80">{coupon.icon}</div>
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
                    className={buttonClasses}
                    disabled={!canRedeem}
                  >
                    {canRedeem ? 'เก็บคูปอง' : `ต้องการ ${coupon.pointsRequired} แต้ม`}
                  </button>
                </div>
              </div>

              {/* Dashed Line Decor */}
              <div className="absolute left-28 top-0 bottom-0 border-l-2 border-dashed border-slate-100 z-0" />
            </motion.div>
          );
        })}
      </div>

      <div className="bg-white/40 p-6 rounded-[2.5rem] text-center border-2 border-dashed border-slate-200">
        <p className="text-xs text-slate-400">คุณมีแต้มสะสม <span className="text-pink-500 font-bold">{userPoints} แต้ม</span><br/>แลกรับคูปองส่วนลดเพิ่มเติมได้ที่เมนู "แลกของรางวัล"</p>
      </div>
    </div>
  );
};

export default Promotions;