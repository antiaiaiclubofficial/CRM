"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Ticket } from 'lucide-react';

interface HomeQuickActionsProps {
  onCouponsClick: () => void;
  onAppointmentClick: () => void;
}

const HomeQuickActions = ({ onCouponsClick, onAppointmentClick }: HomeQuickActionsProps) => {
  return (
    <div className="grid grid-cols-2 gap-3 mt-6">
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={onAppointmentClick}
        className="flex items-center justify-center gap-3 p-4 bg-tertiary rounded-2xl shadow-sm border-none transition-all relative overflow-hidden group h-14"
      >
        <div className="w-8 h-8 bg-primary rounded-xl flex items-center justify-center text-tertiary shadow-sm shrink-0">
          <Calendar size={18} strokeWidth={2.5} />
        </div>
        <span className="font-black text-primary text-[11px] uppercase tracking-wider truncate">Book Now</span>
      </motion.button>

      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={onCouponsClick}
        className="flex items-center justify-center gap-3 p-4 bg-white rounded-2xl shadow-sm border-none transition-all relative overflow-hidden group h-14"
      >
        <div className="w-8 h-8 bg-surface-low rounded-xl flex items-center justify-center text-primary shadow-sm shrink-0">
          <Ticket size={18} strokeWidth={2.5} />
        </div>
        <span className="font-black text-primary text-[11px] uppercase tracking-wider truncate">My Deals</span>
      </motion.button>
    </div>
  );
};

export default HomeQuickActions;