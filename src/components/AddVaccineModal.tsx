"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Syringe, Check, Calendar, FileText } from 'lucide-react';
import { toast } from 'sonner';

interface AddVaccineModalProps {
  isOpen: boolean;
  onClose: () => void;
  petName: string;
  onSave: (data: { title: string; date: string; next_due_date: string; description: string }) => Promise<void>;
}

// ฟังก์ชันช่วยแปลงวันที่ปัจจุบันให้เป็น YYYY-MM-DD ตาม Time Zone ของเครื่องผู้ใช้
const getLocalDateString = (date = new Date()) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const AddVaccineModal = ({ isOpen, onClose, petName, onSave }: AddVaccineModalProps) => {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(getLocalDateString()); // ใช้วันที่ตาม Time Zone ของเครื่องผู้ใช้
  const [nextDueDate, setNextDueDate] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error('กรุณาระบุชื่อวัคซีนด้วยค่ะ');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSave({
        title: title.trim(),
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
            className="relative w-full max-w-[390px] bg-white rounded-t-[3.5rem] shadow-2xl max-h-[90vh] flex flex-col"
          >
            {/* Header */}
            <div className="pt-8 pb-4 px-8 flex justify-between items-center bg-white rounded-t-[3.5rem] shrink-0">
              <div>
                <h3 className="font-black text-xl text-slate-800">บันทึกวัคซีนใหม่</h3>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-0.5">น้อง{petName}</p>
              </div>
              <button 
                onClick={onClose} 
                className="p-2 bg-slate-100 rounded-full text-slate-400 active:scale-90 transition-transform"
              >
                <X size={20} />
              </button>
            </div>

            {/* Form Content */}
            <form onSubmit={handleSubmit} className="px-8 pb-10 overflow-y-auto no-scrollbar flex-1 space-y-5">
              <div className="flex flex-col items-center py-4">
                <div className="w-16 h-16 bg-[#E0F7F9] rounded-[2rem] flex items-center justify-center text-[#2BC0D3] shadow-inner">
                  <Syringe size={32} />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 px-1">ชื่อวัคซีน / รายการ</label>
                <input 
                  type="text" 
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="เช่น วัคซีนรวม 5 โรค, พิษสุนัขบ้า"
                  className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-[#2BC0D3]/20 outline-none text-sm font-bold text-slate-800 transition-all"
                />
              </div>

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
                    className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-[#2BC0D3]/20 outline-none text-sm font-bold text-slate-800 transition-all"
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
                    className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-[#2BC0D3]/20 outline-none text-sm font-bold text-slate-800 transition-all"
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
                  className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-[#2BC0D3]/20 outline-none text-sm font-bold text-slate-800 transition-all min-h-[80px]"
                />
              </div>

              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? 'กำลังบันทึก...' : <><Check size={20} className="text-emerald-400" /> บันทึกข้อมูล</>}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AddVaccineModal;