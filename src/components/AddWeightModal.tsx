"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Scale, Check } from 'lucide-react';
import { toast } from 'sonner';

interface AddWeightModalProps {
  isOpen: boolean;
  onClose: () => void;
  petName: string;
  onSave: (weight: number) => Promise<void>;
}

const AddWeightModal = ({ isOpen, onClose, petName, onSave }: AddWeightModalProps) => {
  const [weight, setWeight] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    const weightNum = parseFloat(weight);
    if (isNaN(weightNum) || weightNum <= 0) {
      toast.error('กรุณาระบุน้ำหนักที่ถูกต้องค่ะ');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSave(weightNum);
      setWeight('');
      onClose();
    } catch (error) {
      toast.error('เกิดข้อผิดพลาดในการบันทึกค่ะ');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center px-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="relative w-full max-w-xs bg-white rounded-[2.5rem] shadow-2xl p-8 border border-slate-100"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-black text-slate-800">บันทึกน้ำหนักน้อง{petName}</h3>
              <button onClick={onClose} className="p-1.5 bg-slate-100 rounded-full text-slate-400">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-6">
              <div className="relative">
                <input 
                  type="number" 
                  step="0.1"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="0.0"
                  autoFocus
                  className="w-full text-center text-4xl font-black py-4 bg-slate-50 rounded-2xl border-2 border-slate-100 focus:border-blue-500 outline-none transition-colors"
                />
                <span className="absolute right-6 top-1/2 -translate-y-1/2 font-black text-slate-400">kg</span>
              </div>

              <button 
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black shadow-lg shadow-blue-100 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? 'กำลังบันทึก...' : <><Check size={20} /> ยืนยันบันทึกน้ำหนัก</>}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AddWeightModal;