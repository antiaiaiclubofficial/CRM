"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Syringe, Check, Calendar, FileText, Sparkles, Info } from 'lucide-react';
import { toast } from 'sonner';

interface AddVaccineModalProps {
  isOpen: boolean;
  onClose: () => void;
  petName: string;
  petType?: string;
  onSave: (data: { title: string; date: string; next_due_date: string; description: string }) => Promise<void>;
}

interface VaccinePreset {
  title: string;
  ageLabel: string;
  nextDueOffsetDays?: number;
  description: string;
}

const dogPresets: VaccinePreset[] = [
  {
    title: "วัคซีนรวมป้องกัน 5 โรค ครั้งที่ 1",
    ageLabel: "8 สัปดาห์",
    nextDueOffsetDays: 28,
    description: "วัคซีนพื้นฐานเริ่มต้น (ป้องกันไข้หัด, ลำไส้อักเสบ, เลปโตสไปโรซิส, ตับอักเสบ, พาราอินฟูลเอนซ่า)"
  },
  {
    title: "วัคซีนรวมป้องกัน 5 โรค ครั้งที่ 2",
    ageLabel: "12 สัปดาห์",
    nextDueOffsetDays: 28,
    description: "กระตุ้นภูมิคุ้มกันครั้งที่ 2"
  },
  {
    title: "วัคซีนป้องกันโรคพิษสุนัขบ้า ครั้งที่ 1",
    ageLabel: "14 สัปดาห์",
    nextDueOffsetDays: 28,
    description: "วัคซีนไฟต์บังคับตามกฎหมาย"
  },
  {
    title: "วัคซีนรวมป้องกัน 5 โรค ครั้งที่ 3",
    ageLabel: "16 สัปดาห์",
    nextDueOffsetDays: 365,
    description: "กระตุ้นภูมิคุ้มกันครบรส"
  },
  {
    title: "วัคซีนป้องกันโรคพิษสุนัขบ้า ครั้งที่ 2",
    ageLabel: "18 สัปดาห์",
    nextDueOffsetDays: 365,
    description: "กระตุ้นภูมิคุ้มกันพิษสุนัขบ้า"
  },
  {
    title: "วัคซีนป้องกันโรคพิษสุนัขบ้า ครั้งที่ 3",
    ageLabel: "1 ปี",
    nextDueOffsetDays: 365,
    description: "กระตุ้นซ้ำทุกๆ 1 ปี"
  },
  {
    title: "วัคซีนโรคหลอดลมอักเสบติดต่อ (Bordetella)",
    ageLabel: "ทางเลือก",
    nextDueOffsetDays: 365,
    description: "ให้ผ่านทางรูจมูกหรือทางปาก เพื่อป้องกันโรคหลอดลมอักเสบติดต่อ"
  }
];

const catPresets: VaccinePreset[] = [
  {
    title: "วัคซีนรวมป้องกันโรคหัด + หวัดแมว ครั้งที่ 1",
    ageLabel: "8 สัปดาห์",
    nextDueOffsetDays: 28,
    description: "วัคซีนพื้นฐานเริ่มต้น"
  },
  {
    title: "วัคซีนรวมป้องกันโรคหัด + หวัดแมว ครั้งที่ 2",
    ageLabel: "12 สัปดาห์",
    nextDueOffsetDays: 28,
    description: "กระตุ้นภูมิคุ้มกันครั้งที่ 2"
  },
  {
    title: "วัคซีนป้องกันโรคพิษสุนัขบ้า ครั้งที่ 1",
    ageLabel: "14 สัปดาห์",
    nextDueOffsetDays: 28,
    description: "วัคซีนไฟต์บังคับตามกฎหมาย"
  },
  {
    title: "วัคซีนรวมป้องกันโรคหัด + หวัดแมว ครั้งที่ 3",
    ageLabel: "16 สัปดาห์",
    nextDueOffsetDays: 365,
    description: "ฉีดร่วมกับวัคซีนลิวคีเมีย ครั้งที่ 1"
  },
  {
    title: "วัคซีนลิวคีเมีย ครั้งที่ 1",
    ageLabel: "16 สัปดาห์",
    nextDueOffsetDays: 28,
    description: "ควรทำการตรวจหาเชื้อลิวคีเมียในกระแสเลือดก่อนฉีดเข็มแรกเสมอ"
  },
  {
    title: "วัคซีนป้องกันโรคพิษสุนัขบ้า ครั้งที่ 2",
    ageLabel: "18 สัปดาห์",
    nextDueOffsetDays: 365,
    description: "กระตุ้นภูมิคุ้มกันพิษสุนัขบ้า"
  },
  {
    title: "วัคซีนลิวคีเมีย ครั้งที่ 2",
    ageLabel: "20 สัปดาห์",
    nextDueOffsetDays: 365,
    description: "กระตุ้นภูมิคุ้มกันลิวคีเมีย"
  }
];

const getLocalDateString = (date = new Date()) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const AddVaccineModal = ({ isOpen, onClose, petName, petType, onSave }: AddVaccineModalProps) => {
  const [selectedPresetIndex, setSelectedPresetIndex] = useState<string>('custom');
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(getLocalDateString());
  const [nextDueDate, setNextDueDate] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isCat = petType?.toLowerCase() === 'cat' || petType === 'แมว';
  const presets = isCat ? catPresets : dogPresets;

  useEffect(() => {
    if (selectedPresetIndex === 'custom') {
      return;
    }

    const preset = presets[parseInt(selectedPresetIndex)];
    if (preset) {
      setTitle(preset.title);
      setDescription(preset.description);

      if (preset.nextDueOffsetDays && date) {
        const baseDate = new Date(date);
        baseDate.setDate(baseDate.getDate() + preset.nextDueOffsetDays);
        setNextDueDate(getLocalDateString(baseDate));
      } else {
        setNextDueDate('');
      }
    }
  }, [selectedPresetIndex, date, presets]);

  useEffect(() => {
    if (isOpen) {
      setSelectedPresetIndex('0');
      setDate(getLocalDateString());
      setNextDueDate('');
      setDescription('');
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalTitle = selectedPresetIndex === 'custom' ? title.trim() : presets[parseInt(selectedPresetIndex)]?.title;
    
    if (!finalTitle) {
      toast.error('กรุณาระบุชื่อวัคซีนด้วยค่ะ');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSave({
        title: finalTitle,
        date,
        next_due_date: nextDueDate,
        description: description.trim()
      });
      setTitle('');
      setNextDueDate('');
      setDescription('');
      onClose();
    } catch (error) {
      toast.error('เกิดข้อผิดพลาดในการบันทึกข้อมูลค่ะ');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[120] flex items-end justify-center">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
          />
          <motion.div 
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="relative w-full max-w-[390px] bg-white rounded-t-[3.5rem] shadow-2xl max-h-[92vh] flex flex-col border-none"
          >
            {/* Header */}
            <div className="pt-8 pb-4 px-8 flex justify-between items-center bg-white rounded-t-[3.5rem] shrink-0">
              <div>
                <h3 className="font-black text-xl text-slate-800">บันทึกวัคซีนใหม่</h3>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-0.5">
                  น้อง{petName} ({isCat ? 'โปรแกรมแมว 🐱' : 'โปรแกรมสุนัข 🐶'})
                </p>
              </div>
              <button 
                onClick={onClose} 
                className="p-2.5 bg-slate-100 rounded-full text-slate-400 active:scale-90 transition-transform"
              >
                <X size={18} strokeWidth={2.5} />
              </button>
            </div>

            {/* Form Content */}
            <form onSubmit={handleSubmit} className="px-8 pb-10 overflow-y-auto no-scrollbar flex-1 space-y-5">
              <div className="flex flex-col items-center py-2">
                <div className="w-14 h-14 bg-primary/5 rounded-[2rem] flex items-center justify-center text-primary shadow-inner">
                  <Syringe size={28} />
                </div>
              </div>

              {/* Preset Selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 px-1 flex items-center gap-1">
                  <Sparkles size={12} className="text-[#EAFD69] fill-[#EAFD69]" /> เลือกโปรแกรมวัคซีนแนะนำ
                </label>
                <select
                  value={selectedPresetIndex}
                  onChange={(e) => setSelectedPresetIndex(e.target.value)}
                  className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-primary/10 outline-none text-sm font-bold text-slate-800 transition-all appearance-none"
                >
                  {presets.map((preset, idx) => (
                    <option key={idx} value={idx.toString()}>
                      [{preset.ageLabel}] {preset.title}
                    </option>
                  ))}
                  <option value="custom">✍️ กำหนดเอง (ระบุชื่อวัคซีนเอง)</option>
                </select>
              </div>

              {/* Custom Title Input */}
              {selectedPresetIndex === 'custom' && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-1.5"
                >
                  <label className="text-xs font-bold text-slate-500 px-1">ชื่อวัคซีน / รายการ</label>
                  <input 
                    type="text" 
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="เช่น วัคซีนรวม 5 โรค, พิษสุนัขบ้า"
                    className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-primary/10 outline-none text-sm font-bold text-slate-800 transition-all"
                  />
                </motion.div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 px-1 flex items-center gap-1">
                    <Calendar size={12} /> วันที่ฉีด
                  </label>
                  <input 
                    type="date" 
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-primary/10 outline-none text-sm font-bold text-slate-800 transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 px-1 flex items-center gap-1">
                    <Calendar size={12} className="text-pink-500" /> นัดครั้งถัดไป
                  </label>
                  <input 
                    type="date" 
                    value={nextDueDate}
                    onChange={(e) => setNextDueDate(e.target.value)}
                    className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-primary/10 outline-none text-sm font-bold text-slate-800 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 px-1 flex items-center gap-1">
                  <FileText size={12} /> หมายเหตุ / สถานพยาบาล
                </label>
                <textarea 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="เช่น โรงพยาบาลสัตว์ทองหล่อ, คุณหมอสมชาย"
                  className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-primary/10 outline-none text-sm font-bold text-slate-800 transition-all min-h-[80px]"
                />
              </div>

              {/* Warning Note about Bathing */}
              <div className="bg-amber-50 p-4 rounded-2xl border-none flex gap-2.5 items-start">
                <Info size={16} className="text-amber-500 shrink-0 mt-0.5" />
                <p className="text-[10px] text-amber-700 font-bold leading-relaxed">
                  * ข้อควรปฏิบัติสำคัญ: งดการอาบน้ำให้น้องหมาและน้องแมวเป็นเวลาอย่างน้อย 7 วันหลังฉีดวัคซีน เพื่อความปลอดภัยของสัตว์เลี้ยงค่ะ
                </p>
              </div>

              {/* Submit Button (Signature Navy Gradient) */}
              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-gradient-to-br from-[#18234a] to-[#020d35] text-white rounded-full font-bold shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? 'กำลังบันทึก...' : <><Check size={20} className="text-[#EAFD69]" /> บันทึกข้อมูล</>}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AddVaccineModal;