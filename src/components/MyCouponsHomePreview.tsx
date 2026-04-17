"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Ticket, Scissors, Sparkles, Gift, ShowerHead, Leaf, Hand, Tag, Heart, ChevronRight } from 'lucide-react';

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

interface MyCouponsHomePreviewProps {
  coupons: Coupon[];
  onViewAll: () => void;
}

const iconMap: Record<string, any> = {
  Scissors, Sparkles, Gift, Ticket, ShowerHead, Leaf, Hand, Tag, Heart
};

const MyCouponsHomePreview = ({ coupons, onViewAll }: MyCouponsHomePreviewProps) => {
  return (
    <div className="mt-2">
      <div className="flex justify-between items-center mb-3 px-1">
        <h3 className="font-bold text-lg text-slate-800">คูปองของฉัน 🎫</h3>
        <button onClick={onViewAll} className="text-xs text-pink-500 font-medium flex items-center gap-0.5">
          ดูทั้งหมด <ChevronRight size={12} />
        </button>
      </div>

      {coupons.length > 0 ? (
        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2 px-1">
          {coupons.map((coupon) => {
            const IconComponent = iconMap[coupon.iconName] || Ticket;
            return (
              <motion.div
                key={coupon.id}
                whileTap={{ scale: 0.98 }}
                onClick={onViewAll}
                className="flex-shrink-0 w-[260px] bg-white p-4 rounded-3xl border border-slate-50 shadow-sm flex items-center gap-4"
              >
                <div className={`w-12 h-12 ${coupon.bg} rounded-2xl flex items-center justify-center shadow-inner`}>
                  <IconComponent size={20} className="text-slate-700" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-sm text-slate-800 truncate">{coupon.title}</h4>
                  <div className="flex items-center gap-2 mt-0.5">
                    <p className="text-[10px] text-slate-500 truncate">{coupon.description}</p>
                  </div>
                  <p className="text-[9px] text-pink-500 font-bold mt-1">หมดอายุ {coupon.expiry}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <motion.div 
          whileTap={{ scale: 0.98 }}
          onClick={onViewAll}
          className="bg-[#FFE3BC]/30 p-5 rounded-[2rem] border-2 border-dashed border-[#FFE3BC]/50 flex items-center gap-4 cursor-pointer"
        >
          <div className="p-3 bg-white rounded-2xl shadow-sm">
            <Ticket className="text-amber-500" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-slate-800">ยังไม่มีคูปองที่เก็บไว้</h4>
            <p className="text-xs text-slate-600">สะสมคะแนนเพื่อแลกรับส่วนลดสุดพิเศษ!</p>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default MyCouponsHomePreview;