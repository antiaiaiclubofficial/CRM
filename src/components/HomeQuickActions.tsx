"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Ticket, Box } from 'lucide-react';

interface HomeQuickActionsProps {
  onCouponsClick: () => void;
  onAppointmentClick: () => void;
  onPackagesClick: () => void;
}

const HomeQuickActions = ({ onCouponsClick, onAppointmentClick, onPackagesClick }: HomeQuickActionsProps) => {
  return (
    <div className="grid grid-cols-3 gap-2 mt-6">
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={onAppointmentClick}
        className="flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2 p-3 bg-tertiary rounded-2xl shadow-sm border-none transition-all relative overflow-hidden group h-16"
      >
        <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center text-tertiary shadow-sm shrink-0">
          <Calendar size={14} strokeWidth={2.5} />
        </div>
        <span className="font-black text-primary text-[9px] uppercase tracking-wider truncate">Book Now</span>
      </motion.button>

      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={onCouponsClick}
        className="flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2 p-3 bg-white rounded-2xl shadow-sm border-none transition-all relative overflow-hidden group h-16"
      >
        <div className="w-7 h-7 bg-surface-low rounded-lg flex items-center justify-center text-primary shadow-sm shrink-0">
          <Ticket size={14} strokeWidth={2.5} />
        </div>
        <span className="font-black text-primary text-[9px] uppercase tracking-wider truncate">My Deals</span>
      </motion.button>

      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={onPackagesClick}
        className="flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2 p-3 bg-white rounded-2xl shadow-sm border-none transition-all relative overflow-hidden group h-16"
      >
        <div className="w-7 h-7 bg-surface-low rounded-lg flex items-center justify-center text-primary shadow-sm shrink-0">
          <Box size={14} strokeWidth={2.5} />
        </div>
        <span className="font-black text-primary text-[9px] uppercase tracking-wider truncate">My Package</span>
      </motion.button>
    </div>
  );
};

export default HomeQuickActions;