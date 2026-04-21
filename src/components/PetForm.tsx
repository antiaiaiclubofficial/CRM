"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, HeartPulse, Calendar, Info, Check, Feather, Camera, Image as ImageIcon } from 'lucide-react';
import AnalogScaleIcon from './AnalogScaleIcon';

interface Pet {
  id: number;
  name: string;
  type: string;
  breed: string;
  age: string;
  gender: string;
  weight: string;
  medicalCondition: string;
  precautions: string;
  color: string;
  icon: string;
  furLength?: string;
  customPreferences?: { id: string; label: string; value: string; }[];
  imageUrl: string;
  cardBgColor: string;
  isFavorite?: boolean;
}

interface PetFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (pet: Omit<Pet, 'id'> | Pet) => void;
  initialData?: Pet | null;
}

const petIcons: Record<string, string> = { 'สุนัข': '🐶', 'แมว': '🐱', 'กระต่าย': '🐰', 'หนูแฮมสเตอร์': '🐹', 'นก': '🦜' };
const colors = ['bg-orange-100', 'bg-blue-100', 'bg-yellow-100', 'bg-pink-100', 'bg-purple-100', 'bg-green-100'];

type EditablePetFields = Omit<Pet, 'id' | 'color' | 'icon' | 'customPreferences' | 'cardBgColor' | 'isFavorite'>;

const PetForm = ({ isOpen, onClose, onSave, initialData }: PetFormProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState<EditablePetFields>({
    name: '',
    type: 'สุนัข',
    breed: '',
    age: '',
    gender: 'ผู้',
    weight: '',
    medicalCondition: '',
    precautions: '',
    furLength: '',
    imageUrl: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        type: initialData.type,
        breed: initialData.breed,
        age: initialData.age,
        gender: initialData.gender,
        weight: initialData.weight,
        medicalCondition: initialData.medicalCondition,
        precautions: initialData.precautions,
        furLength: initialData.furLength || '',
        imageUrl: initialData.imageUrl,
      });
    } else {
      setFormData({
        name: '',
        type: 'สุนัข',
        breed: '',
        age: '',
        gender: 'ผู้',
        weight: '',
        medicalCondition: '',
        precautions: '',
        furLength: '',
        imageUrl: '',
      });
    }
  }, [initialData, isOpen]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, imageUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    const medicalCondition = formData.medicalCondition.trim() || "-";
    const precautions = formData.precautions.trim() || "-";
    const imageUrl = formData.imageUrl || (formData.type === 'แมว' 
      ? 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=2043&auto=format&fit=crop' 
      : 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=1974&auto=format&fit=crop');

    const finalData = { ...formData, medicalCondition, precautions, imageUrl };

    if (initialData) {
      const updatedPet: Pet = {
        ...initialData,
        ...finalData,
        icon: petIcons[finalData.type] || '🐾',
      };
      onSave(updatedPet);
    } else {
      const defaultCardBgColors = ['#FFF9C4', '#FFCDD2', '#BBDEFB', '#C8E6C9', '#DCEDC8', '#E1BEE7'];
      const randomColor = defaultCardBgColors[Math.floor(Math.random() * defaultCardBgColors.length)];
      
      const newPet: Omit<Pet, 'id'> = {
        ...finalData,
        color: colors[Math.floor(Math.random() * colors.length)],
        icon: petIcons[finalData.type] || '🐾',
        customPreferences: [],
        cardBgColor: randomColor,
        isFavorite: false,
      };
      onSave(newPet);
    }
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
            onClick={onClose}
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
              <button onClick={onClose} className="p-2 bg-slate-100 rounded-full text-slate-400">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-6 px-8 pb-24">
              {/* Image Upload Section */}
              <div className="flex flex-col items-center gap-3">
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="relative w-28 h-28 rounded-full border-4 border-dashed border-pink-200 bg-pink-50 flex items-center justify-center overflow-hidden cursor-pointer group hover:border-pink-400 transition-colors shadow-inner"
                >
                  {formData.imageUrl ? (
                    <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center text-pink-300">
                      <Camera size={32} />
                      <span className="text-[10px] font-bold mt-1">อัปโหลดรูป</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                     <Camera size={24} className="text-white" />
                  </div>
                </div>
                <input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/*"
                  className="hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-4 items-end">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 px-1">ชื่อสัตว์เลี้ยง</label>
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="ชื่อน้อง"
                    className="w-full p-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-pink-200 focus:bg-white transition-all outline-none text-sm font-medium"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 px-1">ประเภท</label>
                  <select 
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                    className="w-full p-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-pink-200 focus:bg-white transition-all outline-none text-sm font-medium appearance-none"
                  >
                    {Object.keys(petIcons).map(type => <option key={type} value={type}>{type}</option>)}
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 px-1">สายพันธุ์</label>
                <input 
                  type="text" 
                  value={formData.breed}
                  onChange={(e) => setFormData({...formData, breed: e.target.value})}
                  placeholder="เช่น Golden Retriever"
                  className="w-full p-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-pink-200 focus:bg-white transition-all outline-none text-sm font-medium"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 flex items-center justify-center gap-1">
                    <Calendar size={14} className="text-slate-400" /> อายุ
                  </label>
                  <div className="relative group">
                    <input 
                      type="number" 
                      value={formData.age}
                      onChange={(e) => setFormData({...formData, age: e.target.value})}
                      placeholder="ปี"
                      className="w-full p-4 bg-slate-50 rounded-2xl text-center border-2 border-transparent focus:border-pink-200 focus:bg-white transition-all outline-none text-sm font-bold text-slate-700 placeholder:text-slate-300"
                    />
                    {formData.age && (
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400 pointer-events-none">ปี</span>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 flex items-center justify-center gap-1">
                    <User size={14} className="text-slate-400" /> เพศ
                  </label>
                  <select 
                    value={formData.gender}
                    onChange={(e) => setFormData({...formData, gender: e.target.value})}
                    className="w-full p-4 bg-slate-50 rounded-2xl text-center border-2 border-transparent focus:border-pink-200 focus:bg-white transition-all outline-none text-sm font-bold text-slate-700 appearance-none"
                  >
                    <option value="ผู้">ผู้</option>
                    <option value="เมีย">เมีย</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 flex items-center justify-center gap-1">
                    <AnalogScaleIcon size={14} className="text-slate-400" /> นน.
                  </label>
                  <div className="relative group">
                    <input 
                      type="number" 
                      value={formData.weight}
                      onChange={(e) => setFormData({...formData, weight: e.target.value})}
                      placeholder="kg"
                      className="w-full p-4 bg-slate-50 rounded-2xl text-center border-2 border-transparent focus:border-pink-200 focus:bg-white transition-all outline-none text-sm font-bold text-slate-700 placeholder:text-slate-300"
                    />
                    {formData.weight && (
                      <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400 pointer-events-none">kg</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 px-1 flex items-center gap-1 text-purple-500"><Feather size={14}/> ความยาวขน</label>
                <select 
                  value={formData.furLength}
                  onChange={(e) => setFormData({...formData, furLength: e.target.value})}
                  className="w-full p-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-purple-200 focus:bg-white transition-all outline-none text-sm font-medium appearance-none"
                >
                  <option value="">เลือกความยาวขน</option>
                  <option value="ขนสั้น">ขนสั้น</option>
                  <option value="ขนยาว">ขนยาว</option>
                </select>
              </div>

              <div className="space-y-4 pt-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 px-1 flex items-center gap-1 text-red-500"><HeartPulse size={14}/> โรคประจำตัว</label>
                  <textarea 
                    value={formData.medicalCondition}
                    onChange={(e) => setFormData({...formData, medicalCondition: e.target.value})}
                    placeholder="ระบุโรคประจำตัว"
                    className="w-full p-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-red-100 focus:bg-white transition-all outline-none text-sm font-medium h-24 resize-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 px-1 flex items-center gap-1 text-amber-500"><Info size={14}/> ข้อควรระวัง / แพ้อาหาร</label>
                  <textarea 
                    value={formData.precautions}
                    onChange={(e) => setFormData({...formData, precautions: e.target.value})}
                    placeholder="ระบุสิ่งที่ร้านควรระวังเป็นพิเศษ"
                    className="w-full p-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-amber-100 focus:bg-white transition-all outline-none text-sm font-medium h-24 resize-none"
                  />
                </div>
              </div>

              <button 
                onClick={handleSave}
                disabled={!formData.name || !formData.breed}
                className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold shadow-lg mt-4 disabled:opacity-50 transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                <Check size={20} />
                {initialData ? 'บันทึกการแก้ไข' : 'บันทึกข้อมูล'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default PetForm;