"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Scale, Check, Weight } from 'lucide-react';
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
        <div className="fixed inset-0 z-[120] flex items-center justify-center px-6">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-primary/40 backdrop-blur-xl"
          />
          <motion.div 
            initial={{ scale: 0.9, y: 40, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 40, opacity: 0 }}
            className="relative w-full max-w-[340px] bg-white rounded-xl shadow-ambient p-10 text-center"
          >
            <div className="absolute top-6 right-6">
              <button 
                onClick={onClose} 
                className="p-2 bg-surface-container-low rounded-full text-primary/30 hover:text-primary active:scale-90 transition-all"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-surface-container-low rounded-[2rem] flex items-center justify-center text-primary mb-6 shadow-inner">
                <Weight size={32} />
              </div>
              <h3 className="text-2xl font-black text-primary tracking-tight mb-1">น้ำหนักใหม่</h3>
              <p className="text-xs font-bold text-surface-variant opacity-50 uppercase tracking-widest mb-8">บันทึกน้ำหนักน้อง{petName}</p>
            </div>

            <div className="space-y-8">
              <div className="relative group">
                <input 
                  type="number" 
                  step="0.1"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="0.0"
                  autoFocus
                  className="w-full text-center text-5xl font-black py-6 bg-surface-container-low rounded-lg outline-none group-focus-within:bg-white group-focus-within:shadow-ambient transition-all text-primary placeholder:text-primary/10"
                />
                <span className="absolute right-8 top-1/2 -translate-y-1/2 font-black text-primary/20 text-lg uppercase">kg</span>
              </div>

              <button 
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full py-5 bg-tertiary text-primary rounded-xl font-black shadow-lg shadow-tertiary/20 active:scale-95 active:shadow-none transition-all flex items-center justify-center gap-3 disabled:opacity-50 text-sm uppercase tracking-widest"
              >
                {isSubmitting ? 'กำลังบันทึก...' : <><Check size={20} strokeWidth={3} /> ยืนยันข้อมูล</>}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AddWeightModal;