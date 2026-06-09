"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Syringe, Calendar, Plus, Trash2, AlertTriangle, Clock, CheckCircle2, X } from 'lucide-react';
import AddVaccineModal from './AddVaccineModal';

interface VaccineLog {
  id: string;
  title: string;
  date: string;
  next_due_date?: string;
  description?: string;
}

interface PetVaccineRecordsProps {
  data: VaccineLog[];
  petName: string;
  petType?: string;
  onAddVaccine: (data: { title: string; date: string; next_due_date: string; description: string }) => Promise<void>;
  onDeleteVaccine: (id: string) => Promise<void>;
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

const PetVaccineRecords = ({ data, petName, petType, onAddVaccine, onDeleteVaccine }: PetVaccineRecordsProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [selectedMilestoneStep, setSelectedMilestoneStep] = useState<number | null>(null);

  const handleConfirmDelete = async () => {
    if (deleteConfirmId) {
      await onDeleteVaccine(deleteConfirmId);
      setDeleteConfirmId(null);
    }
  };

  // จัดเรียงข้อมูลตามวันที่ฉีดล่าสุดขึ้นก่อน
  const sortedData = [...data].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // ค้นหาวัคซีนที่มีนัดหมายครั้งถัดไปที่ใกล้ที่สุด
  const upcomingVaccine = data
    .filter(v => v.next_due_date && new Date(v.next_due_date) >= new Date())
    .sort((a, b) => new Date(a.next_due_date!).getTime() - new Date(b.next_due_date!).getTime())[0];

  const isCat = petType?.toLowerCase() === 'cat' || petType === 'แมว';
  const milestones = isCat ? catMilestones : dogMilestones;
  const milestoneLabels = isCat 
    ? ["เข็ม 1 (8 สัปดาห์)", "เข็ม 2 (12 สัปดาห์)", "เข็ม 3 (14 สัปดาห์)", "เข็ม 4 (16 สัปดาห์)", "เข็ม 5 (18 สัปดาห์)"]
    : ["เข็ม 1 (8 สัปดาห์)", "เข็ม 2 (12 สัปดาห์)", "เข็ม 3 (14 สัปดาห์)", "เข็ม 4 (16 สัปดาห์)", "เข็ม 5 (18 สัปดาห์)"];

  // ค้นหาข้อมูลการฉีดจริงของวัคซีนแต่ละเข็ม
  const getVaccineExecution = (stepNum: number) => {
    return data.find(v => {
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
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header & Add Button (Lime Spark CTA) */}
      <div className="bg-white p-6 rounded-[2.5rem] shadow-ambient relative overflow-hidden">
        <div className="flex justify-between items-center">
          <div>
            <h4 className="text-lg font-black text-primary tracking-tight">ประวัติการรับวัคซีน</h4>
            <p className="text-[11px] font-bold text-surface-variant opacity-50 uppercase tracking-widest">Vaccination Timeline</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="w-12 h-12 bg-[#EAFD69] text-[#020d35] rounded-2xl shadow-lg shadow-[#EAFD69]/20 flex items-center justify-center active:scale-90 transition-all"
          >
            <Plus size={24} strokeWidth={3} />
          </button>
        </div>
      </div>

      {/* Milestone Progress Card - Unified Column Layout */}
      <div className="bg-white p-6 rounded-[2.5rem] shadow-ambient border border-black/5 space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-xs font-black text-primary tracking-normal">โปรแกรมวัคซีนแนะนำ (จิ้มเพื่อดูรายละเอียด)</span>
          <span className="text-xs font-black text-pink-500 bg-pink-50 px-3 py-1 rounded-full">
            สำเร็จ {completedCount}/5 เข็ม
          </span>
        </div>

        <div className="relative py-4">
          {/* Background Line - Centered vertically at 30px (16px padding-top + 14px half of dot height) */}
          {/* Adjusted left/right to 14px (half of w-7 dot width) to perfectly align with dot centers */}
          <div className="absolute left-[14px] right-[14px] top-[30px] -translate-y-0/5 h-1 bg-slate-100 rounded-full z-0" />
          {/* Active Progress Line - Centered vertically at 30px */}
          <div className="absolute left-[14px] right-[14px] top-[30px] -translate-y-1 h-1 z-0 overflow-hidden rounded-full">
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
                  onClick={() => setSelectedMilestoneStep(step)}
                  className="flex flex-col items-center flex-1 min-w-0 focus:outline-none group"
                >
                  {/* Dot */}
                  <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all duration-300 group-active:scale-95 ${
                    isCompleted 
                      ? 'bg-pink-500 border-pink-500 text-white scale-110 shadow-md' 
                      : 'bg-white border-slate-200 text-slate-300 hover:border-pink-300'
                  }`}>
                    {isCompleted ? (
                      <CheckCircle2 size={14} className="text-white" />
                    ) : (
                      <span className="text-xs font-black">{step}</span>
                    )}
                  </div>
                  
                  {/* Label */}
                  <div className="text-center mt-3 flex flex-col items-center w-full px-0.5">
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
      </div>

      {/* Upcoming Vaccine Alert Card (Signature Navy Gradient + Lime Spark Text) */}
      {upcomingVaccine && (
        <div className="bg-gradient-to-br from-[#18234a] to-[#020d35] p-6 rounded-[2.5rem] shadow-ambient relative overflow-hidden text-white">
          {/* Soft liquid glow background */}
          <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-[#EAFD69]/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -left-6 -top-6 w-24 h-24 bg-white/5 rounded-full blur-xl pointer-events-none" />
          
          <div className="flex items-start gap-4 relative z-10">
            <div className="w-11 h-11 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center text-[#EAFD69] shrink-0 border border-white/10">
              <Clock size={20} />
            </div>
            <div className="space-y-1">
              <span className="text-[9px] font-black text-[#020d35] bg-[#EAFD69] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                เข็มถัดไป
              </span>
              <h4 className="font-black text-white text-base mt-2 leading-tight">
                {upcomingVaccine.title}
              </h4>
              <p className="text-xs font-bold text-white/70">
                วันที่นัด: <span className="text-[#EAFD69] font-black">{new Date(upcomingVaccine.next_due_date!).toLocaleDateString('th-TH', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Vaccine Timeline List */}
      <div className="space-y-4">
        <div className="flex justify-between items-center px-1">
          <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">รายการวัคซีนทั้งหมด</h4>
          <span className="text-[10px] font-bold text-slate-400 uppercase">{data.length} รายการ</span>
        </div>

        <div className="space-y-3">
          {sortedData.length > 0 ? (
            sortedData.map((entry, i) => (
              <motion.div 
                key={entry.id} 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white p-5 rounded-[2rem] shadow-ambient flex justify-between items-center group border-none"
              >
                <div className="flex items-center gap-4 min-w-0 flex-1">
                  <div className="w-11 h-11 bg-primary/5 rounded-2xl flex items-center justify-center text-primary shrink-0">
                    <Syringe size={20} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h5 className="font-black text-primary text-sm truncate leading-tight">{entry.title}</h5>
                    <p className="text-[10px] font-bold text-slate-400 mt-1 flex items-center gap-1">
                      <Calendar size={10} />
                      {new Date(entry.date).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: '2-digit' })}
                      {entry.next_due_date && (
                        <span className="text-pink-500 font-black ml-1">
                          • เข็มถัดไป: {new Date(entry.next_due_date).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: '2-digit' })}
                        </span>
                      )}
                    </p>
                    {entry.description && (
                      <p className="text-[10px] font-medium text-slate-500 mt-1 truncate">
                        {entry.description}
                      </p>
                    )}
                  </div>
                </div>
                <button 
                  onClick={() => setDeleteConfirmId(entry.id)}
                  className="w-10 h-10 flex items-center justify-center text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-all active:scale-90 shrink-0"
                  title="ลบข้อมูล"
                >
                  <Trash2 size={18} />
                </button>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-16 bg-white rounded-[2.5rem] shadow-ambient border-none p-8 flex flex-col items-center justify-center">
              <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 mb-4">
                <Syringe size={28} />
              </div>
              <h3 className="text-base font-black text-primary mb-1">ยังไม่มีประวัติวัคซีน</h3>
              <p className="text-xs font-bold text-surface-variant opacity-60 max-w-[200px] leading-relaxed">
                บันทึกประวัติวัคซีนของน้องเพื่อช่วยเตือนความจำและติดตามสุขภาพอย่างใกล้ชิดค่ะ 🐾
              </p>
            </div>
          )}
        </div>
      </div>

      <AddVaccineModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        petName={petName} 
        petType={petType}
        onSave={onAddVaccine} 
      />

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

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirmId && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center px-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeleteConfirmId(null)}
              className="absolute inset-0 bg-primary/60 backdrop-blur-md"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-[320px] bg-white rounded-[2.5rem] shadow-ambient p-8 text-center border-none"
            >
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertTriangle size={32} className="text-red-500" />
              </div>
              <h3 className="text-xl font-black text-primary mb-2">ยืนยันการลบ?</h3>
              <p className="text-xs font-medium text-surface-variant opacity-70 mb-8 leading-relaxed">
                คุณต้องการลบข้อมูลประวัติวัคซีน <br/>
                <span className="font-black text-primary">
                  {data.find(d => d.id === deleteConfirmId)?.title}
                </span> ใช่หรือไม่?
              </p>
              <div className="space-y-3">
                <button 
                  onClick={handleConfirmDelete}
                  className="w-full py-4 bg-red-500 text-white rounded-lg font-black uppercase tracking-widest text-xs active:scale-95 transition-all"
                >
                  ยืนยันการลบ
                </button>
                <button 
                  onClick={() => setDeleteConfirmId(null)}
                  className="w-full py-4 bg-surface-container-low text-primary rounded-lg font-black uppercase tracking-widest text-xs active:scale-95 transition-all"
                >
                  ยกเลิก
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default PetVaccineRecords;