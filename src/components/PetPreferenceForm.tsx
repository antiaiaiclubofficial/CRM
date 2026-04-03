"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Droplet, Sparkles } from 'lucide-react';

interface PetPreferences {
  shampooPreference?: string;
  spaPreference?: string;
}

interface PetPreferenceFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (preferences: PetPreferences) => void;
  initialData?: PetPreferences;
  petName: string; // To display in the title
}

const PetPreferenceForm = ({ isOpen, onClose, onSave, initialData, petName }: PetPreferenceFormProps) => {
  const [formData, setFormData] = useState<PetPreferences>({
    shampooPreference: '',
    spaPreference: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        shampooPreference: initialData.shampooPreference || '',
        spaPreference: initialData.spaPreference || '',
      });
    } else {
      setFormData({
        shampooPreference: '',
        spaPreference: '',
      });
    }
  }, [initialData, isOpen]);

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            className="relative w-full max-w-[390px] bg-white rounded-t-[3rem] p-8 max-h-[90vh] overflow-y-auto no-scrollbar shadow-2xl"
          >
            <div className="flex justify-between items-center mb-6 sticky top-0 bg-white py-2 z-10">
              <h3 className="font-bold text-xl text-slate-800">ความชอบส่วนตัวของน้อง{petName}</h3>
              <button onClick={onClose} className="p-2 bg-slate-100 rounded-full text-slate-400">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-5 pb-8">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 px-2 flex items-center gap-1 text-blue-500"><Droplet size={12}/> แชมพูที่ชอบ</label>
                <input 
                  type="text" 
                  value={formData.shampooPreference}
                  onChange={(e) => setFormData({...formData, shampooPreference: e.target.value})}
                  placeholder="เช่น กลิ่นลาเวนเดอร์"
                  className="w-full p-3.5 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-blue-100 outline-none text-sm"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 px-2 flex items-center gap-1 text-purple-500"><Sparkles size={12}/> สปาที่ชอบ</label>
                <input 
                  type="text" 
                  value={formData.spaPreference}
                  onChange={(e) => setFormData({...formData, spaPreference: e.target.value})}
                  placeholder="เช่น สปาโคลนเดดซี"
                  className="w-full p-3.5 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-purple-100 outline-none text-sm"
                />
              </div>

              <button 
                onClick={handleSave}
                className="w-full py-4 bg-pink-500 text-white rounded-2xl font-bold shadow-lg shadow-pink-200 mt-4 transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                <Check size={20} />
                บันทึกการเปลี่ยนแปลง
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default PetPreferenceForm;