"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Ticket, PlusCircle, Sparkles } from 'lucide-react';

interface HomeQuickActionsProps {
  onCouponsClick: () => void;
  onAppointmentClick: () => void;
}

const HomeQuickActions = ({ onCouponsClick, onAppointmentClick }: HomeQuickActionsProps) => {
  return (
    <div className="grid grid-cols-2 gap-5 mt-6">
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={onAppointmentClick}
        className="flex flex-col items-center justify-center gap-3 p-8 bg-tertiary rounded-3xl shadow-ambient border-none transition-all relative overflow-hidden group"
      >
        <div className="absolute top-[-10%] right-[-10%] w-20 h-20 bg-white/20 rounded-full blur-xl group-hover:scale-150 transition-transform" />
        <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center text-tertiary shadow-lg">
          <Calendar size={28} strokeWidth={2.5} />
        </div>
        <span className="font-black text-primary text-sm uppercase tracking-widest">Book Now</span>
      </motion.button>

      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={onCouponsClick}
        className="flex flex-col items-center justify-center gap-3 p-8 bg-surface-lowest rounded-3xl shadow-ambient border-none transition-all relative overflow-hidden group"
      >
        <div className="absolute top-[-10%] right-[-10%] w-20 h-20 bg-primary/5 rounded-full blur-xl group-hover:scale-150 transition-transform" />
        <div className="w-14 h-14 bg-surface-low rounded-2xl flex items-center justify-center text-primary shadow-sm">
          <Ticket size={28} strokeWidth={2.5} />
        </div>
        <span className="font-black text-primary text-sm uppercase tracking-widest">My Deals</span>
      </motion.button>
    </div>
  );
};

export default HomeQuickActions;