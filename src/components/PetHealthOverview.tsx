"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Syringe, Calendar, AlertCircle, CheckCircle2, Clock, ChevronRight, X, AlertTriangle } from 'lucide-react';
import AnalogScaleIcon from './AnalogScaleIcon';

interface PetHealthOverviewProps {
  score: number;
  statusText: string;
  subStatusText: string;
  lastUpdate: string;
  weight: string;
  weightDiff?: string;
  weightDiffIsGain?: boolean;
  prevWeightDate?: string;
  vaccineStatusText: string;
  vaccineStatusType: 'success' | 'warning' | 'danger' | 'upcoming';
  nextVaccineDays: number | null;
  nextVaccineName: string | null;
  nextVaccineDate: string | null;
  onActionClick: (type: string) => void;
  vaccineHistory?: any[];
  petType?: string;
}

const dogMilestones = [
  { step: 1, title: "วัคซีนรวมป้องกัน 5 โรค ครั้งที่ 1", age: "8 สัปดาห์", desc: "วัคซีนพื้นฐานเริ่มต้น (ป้องกันไข้หัด, ลำไส้อักเสบ, เลปโตสไปโรซิส, ตับอักเสบ, พาราอินฟูลเอนซ่า)" },
  { step: 2, title: "วัคซีนรวมป้องกัน 5 โรค ครั้งที่ 2", age: "12 สัปดาห์", desc: "กระตุ้นภูมิคุ้มกันครั้งที่ 2" },
  { step: 3, title: "วัคซีนป้องกันโรคพิษสุนัขบ้า ครั้งที่ 1", age: "14 สัปดาห์", desc: "วัคซีนไฟต์บังคับตามกฎหมาย" },
  { step: 4, title: "วัคซีนรวมป้องกัน 5 โรค ครั้งที่ 3", age: "16 สัปดาห์", desc: "กระตุ้นภูมิคุ้มกันครบรส" },
  { step: 5, title: "วัคซีนป้องกันโรคพิษสุนัขบ้า ครั้งที่ 2", age: "18 สัปดาห์", desc: "กระตุ้นภูมิคุ้มกันพิษสุนัขบ้า" }
];

const catMilestones = [
  { step: 1, title: "วัคซีนรวมป้องกันโรคหัด + หวัดแมว ครั้งที่ 1", age: "8 สัปดาห์", desc: "วัคซีนพื้นฐานเริ่มต้นเพื่อสร้างภูมิคุ้มกัน" },
  { step: 2, title: "วัคซีนรวมป้องกันโรคหัด + หวัดแมว ครั้งที่ 2", age: "12 สัปดาห์", desc: "กระตุ้นภูมิคุ้มกันครั้งที่ 2" },
  { step: 3, title: "วัคซีนป้องกันโรคพิษสุนัขบ้า ครั้งที่ 1", age: "14 สัปดาห์", desc: "วัคซีนไฟต์บังคับตามกฎหมาย" },
  { step: 4, title: "วัคซีนรวมป้องกันโรคหัด + หวัดแมว ครั้งที่ 3", age: "16 สัปดาห์", desc: "ฉีดร่วมกับวัคซีนลิวคีเมีย ครั้งที่ 1" },
  { step: 5, title: "วัคซีนป้องกันโรคพิษสุนัขบ้า ครั้งที่ 2", age: "18 สัปดาห์", desc: "กระตุ้นภูมิคุ้มกันพิษสุนัขบ้า" }
];

const PetHealthOverview = ({ 
  score, 
  statusText, 
  subStatusText, 
  lastUpdate,
  weight,
  weightDiff,
  weightDiffIsGain,
  prevWeightDate,
  vaccineStatusText,
  vaccineStatusType,
  nextVaccineDays,
  nextVaccineName,
  onActionClick,
  vaccineHistory = [],
  petType = 'สุนัข'
}: PetHealthOverviewProps) => {
  const [selectedMilestoneStep, setSelectedMilestoneStep] = useState<number | null>(null);

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

  const isCat = petType?.toLowerCase() === 'cat' || petType === 'แมว';
  const milestones = isCat ? catMilestones : dogMilestones;
  const milestoneLabels = isCat 
    ? ["เข็ม 1 (8 สัปดาห์)", "เข็ม 2 (12 สัปดาห์)", "เข็ม 3 (14 สัปดาห์)", "เข็ม 4 (16 สัปดาห์)", "เข็ม 5 (18 สัปดาห์)"]
    : ["เข็ม 1 (8 สัปดาห์)", "เข็ม 2 (12 สัปดห์)", "เข็ม 3 (14 สัปดาห์)", "เข็ม 4 (16 สัปดาห์)", "เข็ม 5 (18 สัปดาห์)"];

  // ค้นหาข้อมูลการฉีดจริงของวัคซีนแต่ละเข็ม
  const getVaccineExecution = (stepNum: number) => {
    return vaccineHistory.find(v => {
      const title = v.title || '';
      if (isCat) {
        if (stepNum === 1) return title.includes('ครั้งที่ 1') && (title.includes('หัด') || title.includes('หวัดแมว'));
        if (stepNum === 2) return title.includes('ครั้งที่ 2') && (title.includes('หัด') || title.includes('หวัดแมว'));
        if (stepNum === 3) return title.includes('พิษสุนัขบ้า') && title.includes('ครั้งที่ 1');
        if (stepNum === 4) return title.includes('ครั้งที่ 3') && (title.includes('หัด') || title.includes('หวัดแมว'));
        if (stepNum === 5) return title.includes('พิษสุนัขบ้า') && title.includes('ครั้งที่ 2');
      } else {
        if (stepNum === 1) return title.includes('ครั้งที่ 1') && title.includes('5 โรค');
        if (stepNum === 2) return title.includes('ครั้งที่ 2') && title.includes('5 โรค');
        if (stepNum === 3) return title.includes('พิษสุนัขบ้า') && title.includes('ครั้งที่ 1');
        if (stepNum === 4) return title.includes('ครั้งที่ 3') && title.includes('5 โรค');
        if (stepNum === 5) return title.includes('พิษสุนัขบ้า') && title.includes('ครั้งที่ 2');
      }
      return false;
    });
  };

  const completedStepsList = [1, 2, 3, 4, 5].map(step => !!getVaccineExecution(step));
  const completedCount = completedStepsList.filter(Boolean).length;

  // คำนวณเปอร์เซ็นต์ความคืบหน้าโดยอิงจากเข็มสูงสุดที่ฉีดแล้ว
  const highestCompletedStep = completedStepsList.reduce((highest, completed, idx) => completed ? idx + 1 : highest, 0);
  const progressPercentage = highestCompletedStep > 1 ? ((highestCompletedStep - 1) / 4) * 100 : 0;

  const selectedMilestoneInfo = selectedMilestoneStep 
    ? milestones.find(m => m.step === selectedMilestoneStep) 
    : null;
  const selectedMilestoneExecution = selectedMilestoneStep 
    ? getVaccineExecution(selectedMilestoneStep) 
    : null;

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
            <div className="w-8 h-8 bg-slate-50 rounded-full flex items-center justify-center text-primary/40 group-hover:bg-[#EAFD69] group-hover:text-primary transition-colors">
              <ChevronRight size={14} strokeWidth={3} />
            </div>
          </div>

          <div className="flex justify-between items-baseline px-1 relative z-10">
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-black text-primary tracking-tighter">{weight || '-'}</span>
              <span className="text-xs font-bold text-slate-400 uppercase">กิโลกรัม (kg)</span>
            </div>
            {weightDiff && (
              <div className="flex flex-col items-end gap-1">
                <div className={`flex items-center gap-1 text-xs font-black px-3 py-1 rounded-full ${
                  weightDiffIsGain ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                }`}>
                  <span>{weightDiff} kg</span>
                </div>
                {prevWeightDate && (
                  <span className="text-[9px] font-bold text-slate-400">
                    จากวันที่: {prevWeightDate}
                  </span>
                )}
              </div>
            )}
          </div>
        </motion.div>

        {/* Vaccine Dashboard Card - Hoverable & Clickable Entire Card */}
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
            <div className="w-8 h-8 bg-slate-50 rounded-full flex items-center justify-center text-primary/40 group-hover:bg-[#EAFD69] group-hover:text-primary transition-colors">
              <ChevronRight size={14} strokeWidth={3} />
            </div>
          </div>

          <div className="space-y-4 px-1 relative z-10">
            {/* Status Header with Progress */}
            <div className="flex justify-between items-start gap-2">
              <div className="flex flex-col">
                <span className="text-xs font-black text-primary tracking-tight">
                  สถานะล่าสุด
                </span>
                <span className="text-[9px] text-slate-400 font-bold mt-0.5">
                  (จิ้มเพื่อดูรายละเอียด)
                </span>
              </div>
              <span className="text-xs font-black text-pink-600 bg-pink-50 px-3 py-1 rounded-full whitespace-nowrap shrink-0">
                {completedCount}/5 เข็ม
              </span>
            </div>

            {/* Status Badge - Full Width */}
            <div className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl border text-xs font-bold ${vaccineConfig.bg} ${vaccineConfig.text} w-full`}>
              <div className="shrink-0">{vaccineConfig.icon}</div>
              <span className="leading-relaxed break-words">{vaccineStatusText}</span>
            </div>

            {/* Milestone Progress Bar - Unified Column Layout */}
            <div className="relative pt-2 pb-0">
              {/* Background Line - Centered vertically at 20px (8px padding-top + 12px half of dot height) */}
              {/* Adjusted left/right to 12px (half of w-6 dot width) to perfectly align with dot centers */}
              <div className="absolute left-[17px] right-[17px] top-[20px] -translate-y-1/7 h-1 bg-slate-100 rounded-full z-0" />
              {/* Active Progress Line - Centered vertically at 20px */}
              <div className="absolute left-[17px] right-[17px] top-[20px] -translate-y-1/2 h-1 z-0 overflow-hidden rounded-full">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercentage}%` }}
                  className="h-full bg-pink-500 rounded-full"
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </div>
              
              <div className="relative z-10 flex justify-between items-start">
                {[1, 2, 3, 4, 5].map((step, idx) => {
                  const isCompleted = completedStepsList[idx];
                  const label = milestoneLabels[idx];
                  const mainLabel = `เข็ม ${step}`;
                  const subLabel = label.includes('(') ? label.substring(label.indexOf('(')) : '';

                  return (
                    <button 
                      key={step} 
                      onClick={(e) => {
                        e.stopPropagation(); // ป้องกันการเปิดหน้าประวัติวัคซีนเมื่อกดเลือกเข็ม
                        setSelectedMilestoneStep(step);
                      }}
                      className="flex flex-col items-center flex-1 min-w-0 focus:outline-none group"
                    >
                      {/* Dot */}
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-500 group-active:scale-95 ${
                        isCompleted 
                          ? 'bg-pink-500 border-pink-500 text-white scale-110 shadow-sm' 
                          : 'bg-white border-slate-200 text-slate-300 hover:border-pink-300'
                      }`}>
                        {isCompleted ? (
                          <CheckCircle2 size={10} className="text-white" />
                        ) : (
                          <span className="text-[8px] font-black">{step}</span>
                        )}
                      </div>
                      
                      {/* Label */}
                      <div className="text-center mt-1.5 flex flex-col items-center w-full px-0.5">
                        <span className={`text-[9px] font-black leading-none transition-colors duration-500 whitespace-nowrap ${
                          isCompleted ? 'text-pink-600' : 'text-slate-400'
                        }`}>
                          {mainLabel}
                        </span>
                        {subLabel && (
                          <span className="text-[8px] font-bold text-slate-400 opacity-80 mt-1 whitespace-nowrap">
                            {subLabel}
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Countdown / Next Due Info */}
            {nextVaccineName ? (
              <div className="pt-2 border-t border-slate-50 flex justify-between items-center">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">สถานะการฉีดวัคซีน: {nextVaccineName}</p>
                  {nextVaccineDays !== null ? (
                    <p className="text-xs font-black text-primary mt-0.5">
                      {nextVaccineDays < 0 
                        ? `เกินกำหนดมาแล้ว ${Math.abs(nextVaccineDays)} วัน` 
                        : `คำแนะนำ: อีก ${nextVaccineDays} วันควรฉีดเข็มถัดไป`}
                    </p>
                  ) : (
                    <p className="text-xs font-black text-primary mt-0.5">
                      แนะนำให้พาน้องไปรับวัคซีนเข็มแรกตามกำหนดการค่ะ
                    </p>
                  )}
                </div>
              </div>
            ) : vaccineStatusType === 'danger' ? (
              <div className="pt-2 border-t border-slate-50 flex items-center gap-2 text-rose-500">
                <AlertCircle size={16} />
                <p className="text-xs font-black">กรุณาพาน้องไปรับวัคซีนที่เกินกำหนดโดยเร็วที่สุดค่ะ</p>
              </div>
            ) : vaccineStatusType === 'warning' ? (
              <div className="pt-2 border-t border-slate-50 flex items-center gap-2 text-amber-600">
                <AlertCircle size={16} />
                <p className="text-xs font-black">ยังไม่มีประวัติการรับวัคซีนในระบบค่ะ แนะนำให้เริ่มบันทึกข้อมูลวัคซีน</p>
              </div>
            ) : completedCount < 5 ? (
              <div className="pt-2.5 border-t border-slate-100 flex items-center gap-2 text-slate-500">
                <AlertCircle size={14} className="text-pink-500 shrink-0" />
                <p className="text-xs font-bold leading-relaxed">ยังมีวัคซีนแนะนำที่ยังไม่ได้รับค่ะ แนะนำให้พาน้องไปรับวัคซีนตามกำหนดการนะคะ 🐾</p>
              </div>
            ) : (
              <div className="pt-2 border-t border-slate-50">
                <p className="text-xs font-bold text-slate-400">น้องได้รับวัคซีนครบถ้วนตามกำหนดการปัจจุบันแล้วค่ะ ✨</p>
              </div>
            )}
          </div>
        </motion.div>

      </div>

      {/* Milestone Detail Overlay */}
      <AnimatePresence>
        {selectedMilestoneStep !== null && selectedMilestoneInfo && (
          <div className="fixed inset-0 z-[130] flex items-center justify-center px-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedMilestoneStep(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
            />
            <motion.div 
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              className="relative w-full max-w-[320px] bg-white rounded-[2.5rem] shadow-2xl p-8 text-center border-none z-10"
            >
              <button 
                onClick={() => setSelectedMilestoneStep(null)}
                className="absolute top-6 right-6 p-2 bg-slate-100 rounded-full text-slate-400 active:scale-90 transition-transform"
              >
                <X size={16} />
              </button>

              <div className="w-16 h-16 bg-pink-50 rounded-[2rem] flex items-center justify-center mx-auto mb-4 text-pink-500">
                <Syringe size={32} />
              </div>

              <span className="text-[10px] font-black text-pink-500 bg-pink-50 px-3 py-1 rounded-full uppercase tracking-wider">
                เข็มที่ {selectedMilestoneStep} (อายุ {selectedMilestoneInfo.age})
              </span>

              <h3 className="text-lg font-black text-primary mt-4 mb-2 leading-tight">
                {selectedMilestoneInfo.title}
              </h3>
              
              <p className="text-xs font-bold text-slate-500 leading-relaxed mb-6">
                {selectedMilestoneInfo.desc}
              </p>

              <div className="border-t border-slate-100 pt-4">
                {selectedMilestoneExecution ? (
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full flex items-center gap-1">
                      <CheckCircle2 size={12} /> ฉีดแล้วเมื่อวันที่
                    </span>
                    <span className="text-sm font-black text-primary mt-1">
                      {new Date(selectedMilestoneExecution.date).toLocaleDateString('th-TH', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </span>
                    {selectedMilestoneExecution.description && (
                      <span className="text-[10px] font-medium text-slate-400 mt-1">
                        ({selectedMilestoneExecution.description})
                      </span>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-[10px] font-black text-rose-600 bg-rose-50 px-3 py-1 rounded-full flex items-center gap-1">
                      <AlertTriangle size={12} /> ยังไม่ได้ฉีด
                    </span>
                    <p className="text-[10px] font-bold text-slate-400 mt-2 leading-relaxed">
                      แนะนำให้พาน้องไปรับวัคซีนตามกำหนดการเพื่อสุขภาพที่ดีค่ะ
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PetHealthOverview;