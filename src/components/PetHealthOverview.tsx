"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Syringe, Pill, Activity, Stethoscope, ChevronRight } from 'lucide-react';

interface PetHealthOverviewProps {
  score: number;
  statusText: string;
  subStatusText: string;
  lastUpdate: string;
  onActionClick: (type: string) => void;
}

const PetHealthOverview = ({ score, statusText, subStatusText, lastUpdate, onActionClick }: PetHealthOverviewProps) => {
  // การคำนวณสีตามคะแนน
  const getScoreColor = (s: number) => {
    if (s >= 80) return 'text-emerald-600 stroke-emerald-600';
    if (s >= 50) return 'text-amber-500 stroke-amber-500';
    return 'text-red-500 stroke-red-500';
  };

  const circleColor = score >= 80 ? '#059669' : score >= 50 ? '#f59e0b' : '#ef4444';

  return (
    <div className="bg-white rounded-[2.5rem] p-8 border-2 border-slate-100 shadow-sm space-y-8">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-black text-slate-800">ภาพรวมสุขภาพ</h3>
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-amber-100 rounded-full flex items-center justify-center">
            <Heart size={28} className="text-amber-600 fill-amber-600" />
          </div>
          <div>
            <h4 className="text-lg font-black text-slate-800">{statusText}</h4>
            <p className="text-xs font-bold text-slate-500">{subStatusText}</p>
          </div>
        </div>

        {/* Health Score Circle */}
        <div className="relative w-24 h-24 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90">
            <circle
              cx="48" cy="48" r="40"
              stroke="#F1F5F9"
              strokeWidth="8"
              fill="transparent"
            />
            <motion.circle
              cx="48" cy="48" r="40"
              stroke={circleColor}
              strokeWidth="8"
              fill="transparent"
              strokeDasharray={251.2}
              initial={{ strokeDashoffset: 251.2 }}
              animate={{ strokeDashoffset: 251.2 - (251.2 * score) / 100 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-black text-slate-800 leading-none">{score}</span>
            <span className="text-[10px] font-bold text-slate-400">/100</span>
          </div>
        </div>
      </div>

      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
        อัปเดตล่าสุด {lastUpdate}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-4 gap-2 pt-2">
        <HealthActionButton icon={<Syringe size={20} />} label="วัคซีน" onClick={() => onActionClick('vaccine')} color="bg-emerald-50 text-emerald-600" />
        <HealthActionButton icon={<Pill size={20} />} label="ยา" onClick={() => onActionClick('medicine')} color="bg-rose-50 text-rose-600" />
        <HealthActionButton icon={<Activity size={20} />} label="น้ำหนัก" onClick={() => onActionClick('weight')} color="bg-blue-50 text-blue-600" />
        <HealthActionButton icon={<Stethoscope size={20} />} label="ตรวจสุขภาพ" onClick={() => onActionClick('checkup')} color="bg-slate-50 text-slate-600" />
      </div>
    </div>
  );
};

const HealthActionButton = ({ icon, label, onClick, color }: { icon: any, label: string, onClick: () => void, color: string }) => (
  <button 
    onClick={onClick}
    className="flex flex-col items-center gap-2 group"
  >
    <div className={`w-14 h-14 ${color} rounded-full flex items-center justify-center shadow-sm border border-black/5 group-active:scale-90 transition-all`}>
      {icon}
    </div>
    <span className="text-[10px] font-black text-slate-500 uppercase tracking-tight">{label}</span>
  </button>
);

export default PetHealthOverview;