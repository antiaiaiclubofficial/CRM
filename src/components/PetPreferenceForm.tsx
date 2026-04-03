"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Plus, Trash2, Tag } from 'lucide-react';

interface CustomPreference {
  id: string;
  label: string;
  value: string;
}

interface PetPreferenceFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (preferences: CustomPreference[]) => void;
  initialData?: CustomPreference[];
  petName: string;
}

const generateUniqueId = () => Math.random().toString(36).substring(2, 9);

const PetPreferenceForm = ({ isOpen, onClose, onSave, initialData, petName }: PetPreferenceFormProps) => {
  const [preferences, setPreferences] = useState<CustomPreference[]>([]);
  const [newPreferenceLabel, setNewPreferenceLabel] = useState('');
  const [newPreferenceValue, setNewPreferenceValue] = useState('');

  useEffect(() => {
    if (isOpen) {
      const dataWithIds = initialData?.map(pref => ({ ...pref, id: pref.id || generateUniqueId() })) || [];
      setPreferences(dataWithIds);
      setNewPreferenceLabel('');
      setNewPreferenceValue('');
    }
  }, [initialData, isOpen]);

  const handlePreferenceChange = (id: string, field: 'label' | 'value', newValue: string) => {
    setPreferences(prev =>
      prev.map(pref =>
        pref.id === id ? { ...pref, [field]: newValue } : pref
      )
    );
  };

  const handleAddPreference = () => {
    if (newPreferenceLabel.trim() && newPreferenceValue.trim()) {
      setPreferences(prev => [
        ...prev,
        { id: generateUniqueId(), label: newPreferenceLabel.trim(), value: newPreferenceValue.trim() }
      ]);
      setNewPreferenceLabel('');
      setNewPreferenceValue('');
    }
  };

  const handleRemovePreference = (id: string) => {
    setPreferences(prev => prev.filter(pref => pref.id !== id));
  };

  const handleSave = () => {
    const filteredPreferences = preferences.filter(p => p.label.trim() && p.value.trim());
    onSave(filteredPreferences);
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
            className="relative w-full max-w-[390px] bg-white rounded-t-[3rem] py-8 max-h-[90vh] overflow-y-auto no-scrollbar shadow-2xl"
          >
            <div className="flex justify-between items-center mb-6 sticky top-0 bg-white px-6 py-2 z-10">
              <h3 className="font-bold text-xl text-slate-800 flex-1 min-w-0 break-words pr-2">ความชอบส่วนตัวของน้อง{petName}</h3>
              <button onClick={onClose} className="p-2 bg-slate-100 rounded-full text-slate-400 flex-shrink-0">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-5 pb-8 px-6">
              {preferences.length > 0 && (
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-slate-600">รายการความชอบที่มีอยู่</h4>
                  {preferences.map((pref) => (
                    <div key={pref.id} className="flex items-center gap-2 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                      {/* Changed to w-0 flex-grow */}
                      <input 
                        type="text" 
                        value={pref.label}
                        onChange={(e) => handlePreferenceChange(pref.id, 'label', e.target.value)}
                        placeholder="หัวข้อ (เช่น แชมพูที่ชอบ)"
                        className="w-0 flex-grow p-2 bg-white rounded-xl border border-slate-100 focus:ring-1 focus:ring-pink-200 outline-none text-sm"
                      />
                      {/* Changed to w-0 flex-grow */}
                      <input 
                        type="text" 
                        value={pref.value}
                        onChange={(e) => handlePreferenceChange(pref.id, 'value', e.target.value)}
                        placeholder="รายละเอียด"
                        className="w-0 flex-grow p-2 bg-white rounded-xl border border-slate-100 focus:ring-1 focus:ring-pink-200 outline-none text-sm"
                      />
                      <button 
                        onClick={() => handleRemovePreference(pref.id)}
                        className="p-2 bg-red-100 rounded-full text-red-500 hover:bg-red-200 transition-colors flex-shrink-0"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="space-y-4 pt-4 border-t border-slate-100">
                <h4 className="text-sm font-bold text-slate-600">เพิ่มความชอบใหม่</h4>
                <div className="space-y-2">
                  <input 
                    type="text" 
                    value={newPreferenceLabel}
                    onChange={(e) => setNewPreferenceLabel(e.target.value)}
                    placeholder="หัวข้อ (เช่น ของเล่นที่ชอบ)"
                    className="w-full p-3.5 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-pink-200 outline-none text-sm"
                  />
                  <input 
                    type="text" 
                    value={newPreferenceValue}
                    onChange={(e) => setNewPreferenceValue(e.target.value)}
                    placeholder="รายละเอียด (เช่น ลูกบอลยางสีแดง)"
                    className="w-full p-3.5 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-pink-200 outline-none text-sm"
                  />
                </div>
                <button 
                  onClick={handleAddPreference}
                  disabled={!newPreferenceLabel.trim() || !newPreferenceValue.trim()}
                  className="w-full py-3 bg-pink-100 text-pink-700 rounded-2xl font-bold transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Plus size={18} /> เพิ่มรายการ
                </button>
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