"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Syringe } from 'lucide-react';
import AnalogScaleIcon from './AnalogScaleIcon';

interface PetHealthOverviewProps {
  score: number;
  statusText: string;
  subStatusText: string;
  lastUpdate: string;
  onActionClick: (type: string) => void;
}

const PetHealthOverview = ({ score, statusText, subStatusText, lastUpdate, onActionClick }: PetHealthOverviewProps) => {
  return (
    <div className="bg-surface-container-lowest rounded-xl p-8 shadow-ambient space-y-8">
      <div>
        <h3 className="text-xl font-bold text-primary tracking-tight">ภาพรวมสุขภาพ</h3>
        <p className="text-[12px] font-medium text-surface-variant opacity-60">อัปเดตล่าสุด {lastUpdate}</p>
      </div>

      <div className="flex items-center justify-between gap-4">
        {/* Status Box (Left) */}
        <div className="flex-1 bg-tertiary/10 rounded-lg p-5 flex items-center gap-4 border border-tertiary/20">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
            <Heart size={24} className="text-[#FF9F0A] fill-[#FF9F0A]" />
          </div>
          <div>
            <h4 className="text-lg font-black text-primary leading-tight">{statusText}</h4>
            <p className="text-[11px] font-bold text-surface-variant opacity-70">{subStatusText}</p>
          </div>
        </div>

        {/* Health Score Circle (Right) */}
        <div className="relative w-28 h-28 flex items-center justify-center shrink-0">
          <div className="absolute inset-0 bg-tertiary/20 rounded-full blur-xl scale-90" />
          <svg className="w-full h-full -rotate-90 relative z-10" viewBox="0 0 100 100">
            <circle
              cx="50" cy="50" r="42"
              stroke="#F3F3F3"
              strokeWidth="10"
              fill="transparent"
            />
            <motion.circle
              cx="50" cy="50" r="42"
              stroke="#EAFD69"
              strokeWidth="10"
              fill="transparent"
              strokeDasharray={263.8}
              initial={{ strokeDashoffset: 263.8 }}
              animate={{ strokeDashoffset: 263.8 - (263.8 * score) / 100 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              strokeLinecap="round"
              style={{ filter: 'drop-shadow(0 0 4px rgba(234, 253, 105, 0.8))' }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
            <span className="text-3xl font-black text-primary leading-none tracking-tighter">{score}</span>
            <span className="text-[10px] font-black text-surface-variant opacity-40 uppercase">/100</span>
          </div>
        </div>
      </div>

      {/* Quick Actions Grid (Horizontal Layout) */}
      <div className="grid grid-cols-2 gap-3">
        <HealthActionCard 
          icon={<AnalogScaleIcon size={18} />} 
          label="น้ำหนัก" 
          onClick={() => onActionClick('weight')} 
          color="bg-[#F0F2FF]" 
          iconColor="text-[#5C7CFF]"
        />
        <HealthActionCard 
          icon={<Syringe size={18} />} 
          label="วัคซีน" 
          onClick={() => onActionClick('vaccine')} 
          color="bg-[#E0F7F9]" 
          iconColor="text-[#2BC0D3]"
        />
      </div>
    </div>
  );
};

const HealthActionCard = ({ icon, label, onClick, color, iconColor }: { icon: any, label: string, onClick: () => void, color: string, iconColor: string }) => (
  <button 
    onClick={onClick}
    className={`${color} rounded-xl p-3.5 flex flex-row items-center justify-center gap-3 group active:scale-95 transition-all shadow-sm border border-black/5 w-full`}
  >
    <div className={`w-10 h-10 bg-white rounded-lg flex items-center justify-center ${iconColor} shadow-sm group-hover:scale-110 transition-transform shrink-0`}>
      {icon}
    </div>
    <span className="text-sm font-black text-primary uppercase tracking-tight">{label}</span>
  </button>
);

export default PetHealthOverview;