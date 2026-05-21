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
    <div className="mt-8">
      {/* Header with Plus Jakarta Sans styling */}
      <div className="flex justify-between items-center mb-5 px-1">
        <h3 className="font-black text-xl text-primary tracking-tight flex items-center gap-2">
          คูปองของฉัน <span className="text-lg">🎫</span>
        </h3>
        <button 
          onClick={onViewAll} 
          className="text-sm text-[#FF4B91] font-black flex items-center gap-0.5 hover:opacity-80 transition-opacity"
        >
          ดูทั้งหมด <ChevronRight size={16} strokeWidth={3} />
        </button>
      </div>

      {coupons.length > 0 ? (
        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4 px-1">
          {coupons.map((coupon) => {
            const IconComponent = iconMap[coupon.iconName] || Ticket;
            return (
              <motion.div
                key={coupon.id}
                whileTap={{ scale: 0.98 }}
                onClick={onViewAll}
                className="flex-shrink-0 w-[280px] bg-white p-6 rounded-3xl shadow-ambient border-none flex items-center gap-4 transition-all"
              >
                <div className={`w-14 h-14 ${coupon.bg} rounded-2xl flex items-center justify-center shadow-inner shrink-0`}>
                  <IconComponent size={24} className="text-primary/70" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-black text-sm text-primary truncate leading-tight">{coupon.title}</h4>
                  <p className="text-[11px] font-bold text-surface-variant opacity-60 truncate mt-0.5">{coupon.description}</p>
                  <p className="text-[10px] text-[#FF4B91] font-black mt-1.5 uppercase tracking-wider">EXP: {coupon.expiry}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        /* Empty State matching the provided image exactly */
        <motion.div 
          whileTap={{ scale: 0.98 }}
          onClick={onViewAll}
          className="bg-[#FFE3BC]/20 p-8 rounded-3xl border-2 border-dashed border-[#FFE3BC]/60 flex items-center gap-6 cursor-pointer relative overflow-hidden group shadow-sm"
        >
          {/* Tonal Vessel for Icon */}
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-ambient shrink-0 transition-transform group-hover:scale-110 duration-500">
            <Ticket className="text-amber-500" size={32} />
          </div>
          
          <div className="space-y-1">
            <h4 className="font-black text-lg text-primary leading-tight">ยังไม่มีคูปองที่เก็บไว้</h4>
            <p className="text-sm font-bold text-surface-variant opacity-70">สะสมคะแนนเพื่อแลกรับส่วนลดสุดพิเศษ!</p>
          </div>
          
          {/* Subtle Liquid Glow */}
          <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-tertiary/5 rounded-full blur-2xl pointer-events-none" />
        </motion.div>
      )}
    </div>
  );
};

export default MyCouponsHomePreview;