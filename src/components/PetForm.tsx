"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, HeartPulse, Calendar, Info, Check, Feather, Camera, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface Pet {
  id?: string | number;
  name: string;
  type: string;
  breed: string;
  age: string;
  gender: string;
  weight: string;
  medical_condition: string;
  precautions: string;
  fur_length: string;
  image_url: string;
}

interface PetFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (pet: Pet) => void;
  initialData?: Pet | null;
}

const petIcons: Record<string, string> = { 'สุนัข': '🐶', 'แมว': '🐱', 'กระต่าย': '🐰', 'หนูแฮมสเตอร์': '🐹', 'นก': '🦜' };
const furLengths = ['ขนสั้น', 'ขนปานกลาง', 'ขนยาว', 'ขนยาวพิเศษ'];

const PetForm = ({ isOpen, onClose, onSave, initialData }: PetFormProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState<Pet>({
    name: '',
    type: 'สุนัข',
    breed: '',
    age: '',
    gender: 'ผู้',
    weight: '',
    medical_condition: '',
    precautions: '',
    fur_length: 'ขนสั้น',
    image_url: '',
  });

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({
          id: initialData.id,
          name: initialData.name || '',
          type: initialData.type || 'สุนัข',
          breed: initialData.breed || '',
          age: initialData.age || '',
          gender: initialData.gender || 'ผู้',
          weight: initialData.weight || '',
          medical_condition: initialData.medical_condition || '',
          precautions: initialData.precautions || '',
          fur_length: initialData.fur_length || 'ขนสั้น',
          image_url: initialData.image_url || '',
        });
      } else {
        setFormData({
          name: '',
          type: 'สุนัข',
          breed: '',
          age: '',
          gender: 'ผู้',
          weight: '',
          medical_condition: '',
          precautions: '',
          fur_length: 'ขนสั้น',
          image_url: '',
        });
      }
    }
  }, [initialData, isOpen]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, image_url: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const executeSave = () => {
    // If it's a new pet and name is empty, we just close without saving
    if (!initialData && !formData.name.trim()) {
      onClose();
      return;
    }
    
    // If it's an edit and name is empty, we warn them
    if (initialData && !formData.name.trim()) {
      toast.error('กรุณาระบุชื่อสัตว์เลี้ยงด้วยค่ะ');
      return;
    }

    onSave(formData);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={executeSave} // Clicking backdrop saves
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            className="relative w-full max-w-[390px] bg-white rounded-t-[3rem] max-h-[90vh] overflow-y-auto no-scrollbar shadow-2xl"
          >
            <div className="flex justify-between items-center sticky top-0 bg-white pt-8 pb-4 px-8 z-10 rounded-t-[3rem]">
              <h3 className="font-bold text-xl text-slate-800">{initialData ? 'แก้ไขข้อมูลสัตว์เลี้ยง' : 'เพิ่มสัตว์เลี้ยงใหม่'}</h3>
              <button onClick={executeSave} className="p-2 bg-slate-100 rounded-full text-slate-400">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-6 px-8 pb-24">
              {/* Image Upload */}
              <div className="flex flex-col items-center gap-3">
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="relative w-28 h-28 rounded-full border-4 border-dashed border-pink-200 bg-pink-50 flex items-center justify-center overflow-hidden cursor-pointer"
                >
                  {formData.image_url ? (
                    <img src={formData.image_url} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center text-pink-300">
                      <Camera size={32} />
                      <span className="text-[10px] font-bold mt-1">อัปโหลดรูป</span>
                    </div>
                  )}
                </div>
                <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="hidden" />
              </div>

              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500">ชื่อสัตว์เลี้ยง</label>
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="ชื่อน้อง"
                    className="w-full p-4 bg-slate-50 rounded-2xl outline-none font-bold"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500">ประเภท</label>
                  <select 
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                    className="w-full p-4 bg-slate-50 rounded-2xl outline-none font-bold"
                  >
                    {Object.keys(petIcons).map(type => <option key={type} value={type}>{type}</option>)}
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500">สายพันธุ์</label>
                <input 
                  type="text" 
                  value={formData.breed}
                  onChange={(e) => setFormData({...formData, breed: e.target.value})}
                  placeholder="เช่น ชิวาวา, โกลเด้น"
                  className="w-full p-4 bg-slate-50 rounded-2xl outline-none font-bold"
                />
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 text-center block">อายุ (ปี)</label>
                  <input type="number" value={formData.age} onChange={(e) => setFormData({...formData, age: e.target.value})} className="w-full p-4 bg-slate-50 rounded-2xl text-center outline-none font-bold" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 text-center block">เพศ</label>
                  <select value={formData.gender} onChange={(e) => setFormData({...formData, gender: e.target.value})} className="w-full p-4 bg-slate-50 rounded-2xl outline-none font-bold">
                    <option value="ผู้">ผู้</option>
                    <option value="เมีย">เมีย</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 text-center block">นน. (kg)</label>
                  <input type="number" step="0.1" value={formData.weight} onChange={(e) => setFormData({...formData, weight: e.target.value})} className="w-full p-4 bg-slate-50 rounded-2xl text-center outline-none font-bold" />
                </div>
              </div>

              {/* Health Info Section */}
              <div className="space-y-4 pt-4 border-t border-slate-50">
                <h4 className="text-sm font-black text-slate-800 uppercase tracking-tight">ข้อมูลสุขภาพ</h4>
                
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 flex items-center gap-1">
                    <Feather size={14} className="text-purple-500" /> ความยาวขน
                  </label>
                  <select 
                    value={formData.fur_length}
                    onChange={(e) => setFormData({...formData, fur_length: e.target.value})}
                    className="w-full p-4 bg-slate-50 rounded-2xl outline-none font-bold"
                  >
                    {furLengths.map(len => <option key={len} value={len}>{len}</option>)}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 flex items-center gap-1">
                    <HeartPulse size={14} className="text-pink-500" /> โรคประจำตัว
                  </label>
                  <input 
                    type="text" 
                    value={formData.medical_condition}
                    onChange={(e) => setFormData({...formData, medical_condition: e.target.value})}
                    placeholder="ระบุโรคประจำตัว (ถ้ามี)"
                    className="w-full p-4 bg-slate-50 rounded-2xl outline-none font-bold"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 flex items-center gap-1">
                    <AlertCircle size={14} className="text-amber-500" /> ข้อควรระวัง / แพ้อาหาร
                  </label>
                  <input 
                    type="text" 
                    value={formData.precautions}
                    onChange={(e) => setFormData({...formData, precautions: e.target.value})}
                    placeholder="เช่น แพ้แชมพู, ห้ามตัดขนอุ้งเท้า"
                    className="w-full p-4 bg-slate-50 rounded-2xl outline-none font-bold"
                  />
                </div>
              </div>

              <button 
                onClick={executeSave}
                className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black mt-4 shadow-lg active:scale-95 transition-all border-2 border-black"
              >
                บันทึกข้อมูล
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default PetForm;