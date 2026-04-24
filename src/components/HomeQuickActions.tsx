"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Megaphone } from 'lucide-react';

interface HomeQuickActionsProps {
  onPromoClick: () => void;
  onAppointmentClick: () => void;
}

const HomeQuickActions = ({ onPromoClick, onAppointmentClick }: HomeQuickActionsProps) => {
  return (
    <div className="grid grid-cols-2 gap-4 mt-4">
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={onAppointmentClick}
        className="flex items-center justify-center gap-3 p-4 bg-white rounded-[2rem] border border-slate-100 shadow-sm active:bg-slate-50 transition-all"
      >
        <div className="w-10 h-10 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600">
          <Calendar size={20} />
        </div>
        <span className="font-bold text-slate-700">นัดหมาย</span>
      </motion.button>

      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={onPromoClick}
        className="flex items-center justify-center gap-3 p-4 bg-white rounded-[2rem] border border-slate-100 shadow-sm active:bg-slate-50 transition-all"
      >
        <div className="w-10 h-10 bg-amber-100 rounded-2xl flex items-center justify-center text-amber-600">
          <Megaphone size={20} />
        </div>
        <span className="font-bold text-slate-700">โปรโมชั่น</span>
      </motion.button>
    </div>
  );
};

export default HomeQuickActions;