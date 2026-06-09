"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Syringe, Calendar, AlertCircle, CheckCircle2, Clock, ChevronRight } from 'lucide-react';
import AnalogScaleIcon from './AnalogScaleIcon';

interface PetHealthOverviewProps {
  score: number;
  statusText: string;
  subStatusText: string;
  lastUpdate: string;
  weight: string;
  vaccineStatusText: string;
  vaccineStatusType: 'success' | 'warning' | 'danger' | 'upcoming';
  nextVaccineDays: number | null;
  nextVaccineName: string | null;
  nextVaccineDate: string | null;
  onActionClick: (type: string) => void;
}

const PetHealthOverview = ({ 
  score, 
  statusText, 
  subStatusText, 
  lastUpdate,
  weight,
  vaccineStatusText,
  vaccineStatusType,
  nextVaccineDays,
  nextVaccineName,
  nextVaccineDate,
  onActionClick 
}: PetHealthOverviewProps) => {

  // Get vaccine status color and icon
  const getVaccineStatusConfig = () => {
    switch (vaccineStatusType) {
      case 'danger':
        return {
          bg: 'bg-rose-50 border-rose-100',
          text: 'text-rose-600',
          icon: <AlertCircle size={18} className="text-rose-500" />
        };
      case 'warning':
        return {
          bg: 'bg-amber-50 border-amber-100',
          text: 'text-amber-600',
          icon: <AlertCircle size={18} className="text-amber-500" />
        };
      case 'upcoming':
        return {
          bg: 'bg-blue-50 border-blue-100',
          text: 'text-blue-600',
          icon: <Clock size={18} className="text-blue-500" />
        };
      case 'success':
      default:
        return {
          bg: 'bg-emerald-50 border-emerald-100',
          text: 'text-emerald-600',
          icon: <CheckCircle2 size={18} className="text-emerald-500" />
        };
    }
  };

  const vaccineConfig = getVaccineStatusConfig();

  return (
    <div className="space-y-6">
      {/* Main Health Score Card */}
      <div className="bg-white rounded-[2.5rem] p-6 shadow-ambient border border-black/5 relative overflow-hidden">
        <div className="absolute -right-10 -top-10 w-32 h-32 bg-tertiary/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex items-center justify-between gap-4 relative z-10">
          <div className="flex-1 space-y-2">
            <span className="text-[9px] font-black text-primary/40 uppercase tracking-widest">ภาพรวมสุขภาพสัตว์เลี้ยง</span>
            <h3 className="text-2xl font-black text-primary leading-tight tracking-tight">{statusText}</h3>
            <p className="text-xs font-bold text-surface-variant opacity-70">{subStatusText}</p>
            <p className="text-[10px] font-bold text-surface-variant opacity-40">อัปเดตล่าสุด: {lastUpdate}</p>
          </div>

          {/* Circular Progress */}
          <div className="relative w-24 h-24 flex items-center justify-center shrink-0">
            <div className="absolute inset-0 bg-tertiary/10 rounded-full blur-xl scale-90" />
            <svg className="w-full h-full -rotate-90 relative z-10" viewBox="0 0 100 100">
              <circle
                cx="50" cy="50" r="40"
                stroke="#F3F3F3"
                strokeWidth="8"
                fill="transparent"
              />
              <motion.circle
                cx="50" cy="50" r="40"
                stroke="#EAFD69"
                strokeWidth="8"
                fill="transparent"
                strokeDasharray={251.2}
                initial={{ strokeDashoffset: 251.2 }}
                animate={{ strokeDashoffset: 251.2 - (251.2 * score) / 100 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                strokeLinecap="round"
                style={{ filter: 'drop-shadow(0 0 4px rgba(234, 253, 105, 0.5))' }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
              <span className="text-2xl font-black text-primary leading-none tracking-tighter">{score}</span>
              <span className="text-[9px] font-black text-surface-variant opacity-40 uppercase">/100</span>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 gap-4">
        
        {/* Weight Dashboard Card */}
        <motion.div 
          whileTap={{ scale: 0.99 }}
          onClick={() => onActionClick('weight')}
          className="bg-white p-5 rounded-[2rem] shadow-ambient border border-black/5 flex flex-col justify-between gap-4 cursor-pointer hover:border-primary/10 transition-all relative overflow-hidden group"
        >
          <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl pointer-events-none" />
          
          <div className="flex justify-between items-start relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-500 shrink-0">
                <AnalogScaleIcon size={20} />
              </div>
              <div>
                <h4 className="font-black text-primary text-sm">น้ำหนักตัว</h4>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Weight Tracker</p>
              </div>
            </div>
            <div className="w-8 h-8 bg-slate-50 rounded-full flex items-center justify-center text-primary/40 group-hover:bg-primary group-hover:text-white transition-colors">
              <ChevronRight size={14} strokeWidth={3} />
            </div>
          </div>

          <div className="flex items-baseline gap-1.5 px-1 relative z-10">
            <span className="text-3xl font-black text-primary tracking-tighter">{weight || '-'}</span>
            <span className="text-xs font-bold text-slate-400 uppercase">กิโลกรัม (kg)</span>
          </div>
        </motion.div>

        {/* Vaccine Dashboard Card */}
        <motion.div 
          whileTap={{ scale: 0.99 }}
          onClick={() => onActionClick('vaccine')}
          className="bg-white p-5 rounded-[2rem] shadow-ambient border border-black/5 flex flex-col justify-between gap-4 cursor-pointer hover:border-primary/10 transition-all relative overflow-hidden group"
        >
          <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-pink-500/5 rounded-full blur-2xl pointer-events-none" />
          
          <div className="flex justify-between items-start relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-pink-50 rounded-xl flex items-center justify-center text-pink-500 shrink-0">
                <Syringe size={20} />
              </div>
              <div>
                <h4 className="font-black text-primary text-sm">สถานะวัคซีน</h4>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Vaccination Status</p>
              </div>
            </div>
            <div className="w-8 h-8 bg-slate-50 rounded-full flex items-center justify-center text-primary/40 group-hover:bg-primary group-hover:text-white transition-colors">
              <ChevronRight size={14} strokeWidth={3} />
            </div>
          </div>

          <div className="space-y-3 px-1 relative z-10">
            {/* Status Badge */}
            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold ${vaccineConfig.bg} ${vaccineConfig.text}`}>
              {vaccineConfig.icon}
              <span>{vaccineStatusText}</span>
            </div>

            {/* Countdown / Next Due Info */}
            {nextVaccineName ? (
              <div className="pt-2 border-t border-slate-50 flex justify-between items-center">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">สถานะการฉีดวัคซีน: {nextVaccineName}</p>
                  <p className="text-xs font-black text-primary mt-0.5">วันที่แนะนำ: {nextVaccineDate}</p>
                </div>
              </div>
            ) : vaccineStatusType === 'danger' ? (
              <div className="pt-2 border-t border-slate-50 flex items-center gap-2 text-rose-500">
                <AlertCircle size={16} />
                <p className="text-xs font-black">กรุณาพาน้องไปรับวัคซีนที่เกินกำหนดโดยเร็วที่สุดค่ะ</p>
              </div>
            ) : (
              <div className="pt-2 border-t border-slate-50">
                <p className="text-xs font-bold text-slate-400">น้องได้รับวัคซีนครบถ้วนตามกำหนดการปัจจุบันแล้วค่ะ ✨</p>
              </div>
            )}
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default PetHealthOverview;