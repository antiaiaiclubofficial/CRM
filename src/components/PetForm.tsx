"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, HeartPulse, Scale, Calendar, Info, Check, Feather } from 'lucide-react'; // Added Feather

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
  furLength?: string; // New field for fur length
  customPreferences?: { id: string; label: string; value: string; }[];
  imageUrl?: string; // Make optional
  locationLabel?: string; // Make optional
  statusLabel?: string; // Make optional
  cardBgColor?: string; // Make optional
  hasHeartIcon?: boolean; // Make optional
}

interface PetFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (pet: Omit<Pet, 'id'> | Pet) => void;
  initialData?: Pet | null;
}

const petIcons: Record<string, string> = { 'สุนัข': '🐶', 'แมว': '🐱', 'กระต่าย': '🐰', 'หนูแฮมสเตอร์': '🐹', 'นก': '🦜' };
const colors = ['bg-orange-100', 'bg-blue-100', 'bg-yellow-100', 'bg-pink-100', 'bg-purple-100', 'bg-green-100'];

const PetForm = ({ isOpen, onClose, onSave, initialData }: PetFormProps) => {
  const [formData, setFormData] = useState<Omit<Pet, 'id' | 'color' | 'customPreferences' | 'imageUrl' | 'locationLabel' | 'statusLabel' | 'cardBgColor' | 'hasHeartIcon'>>({ // Exclude new fields from formData as they are generated/defaulted
    name: '',
    type: 'สุนัข',
    breed: '',
    age: '',
    gender: 'ผู้',
    weight: '',
    medicalCondition: '',
    precautions: '',
    icon: '🐶',
    furLength: '', // Initialize new field
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
        icon: initialData.icon,
        furLength: initialData.furLength || '', // Set from initialData
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
        icon: '🐶',
        furLength: '',
      });
    }
  }, [initialData, isOpen]);

  const handleSave = () => {
    if (initialData) {
      // Editing existing pet, preserve existing customPreferences and new fields
      onSave({ ...initialData, ...formData, icon: petIcons[formData.type] || '🐾' });
    } else {
      // Adding new pet, initialize customPreferences as empty and provide defaults for new fields
      onSave({ 
        ...formData, 
        color: colors[Math.floor(Math.random() * colors.length)],
        icon: petIcons[formData.type] || '🐾',
        customPreferences: [], // Initialize as empty array for new pets
        imageUrl: 'https://via.placeholder.com/150/CCCCCC/000000?text=New+Pet', // Default image
        locationLabel: 'Unknown',
        statusLabel: 'New',
        cardBgColor: '#CCCCCC', // Default card background color
        hasHeartIcon: false,
      });
    }
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
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
              <h3 className="font-bold text-xl text-slate-800">{initialData ? 'แก้ไขข้อมูลสัตว์เลี้ยง' : 'เพิ่มสัตว์เลี้ยงใหม่'}</h3>
              <button onClick={onClose} className="p-2 bg-slate-100 rounded-full text-slate-400">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-5 pb-8">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 px-2 flex items-center gap-1"><User size={12}/> ชื่อ</label>
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="ชื่อน้อง"
                    className="w-full p-3.5 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-pink-200 outline-none text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 px-2">ประเภท</label>
                  <select 
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                    className="w-full p-3.5 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-pink-200 outline-none text-sm appearance-none"
                  >
                    {Object.keys(petIcons).map(type => <option key={type} value={type}>{type}</option>)}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 px-2">สายพันธุ์</label>
                <input 
                  type="text" 
                  value={formData.breed}
                  onChange={(e) => setFormData({...formData, breed: e.target.value})}
                  placeholder="เช่น Golden Retriever"
                  className="w-full p-3.5 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-pink-200 outline-none text-sm"
                />
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 px-2 flex items-center gap-1"><Calendar size={12}/> อายุ</label>
                  <input 
                    type="number" 
                    value={formData.age}
                    onChange={(e) => setFormData({...formData, age: e.target.value})}
                    placeholder="ปี"
                    className="w-full p-3.5 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-pink-200 outline-none text-sm text-center"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 px-2">เพศ</label>
                  <select 
                    value={formData.gender}
                    onChange={(e) => setFormData({...formData, gender: e.target.value})}
                    className="w-full p-3.5 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-pink-200 outline-none text-sm text-center appearance-none"
                  >
                    <option value="ผู้">ผู้</option>
                    <option value="เมีย">เมีย</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 px-2 flex items-center gap-1"><Scale size={12}/> นน.</label>
                  <input 
                    type="number" 
                    value={formData.weight}
                    onChange={(e) => setFormData({...formData, weight: e.target.value})}
                    placeholder="kg"
                    className="w-full p-3.5 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-pink-200 outline-none text-sm text-center"
                  />
                </div>
              </div>

              {/* Fur Length */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 px-2 flex items-center gap-1 text-purple-500"><Feather size={12}/> ความยาวขน</label>
                <select 
                  value={formData.furLength}
                  onChange={(e) => setFormData({...formData, furLength: e.target.value})}
                  className="w-full p-3.5 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-purple-100 outline-none text-sm appearance-none"
                >
                  <option value="">เลือก</option>
                  <option value="ขนสั้น">ขนสั้น</option>
                  <option value="ขนยาว">ขนยาว</option>
                </select>
              </div>

              {/* Medical & Special Care */}
              <div className="space-y-4 pt-2">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 px-2 flex items-center gap-1 text-red-500"><HeartPulse size={12}/> โรคประจำตัว</label>
                  <textarea 
                    value={formData.medicalCondition}
                    onChange={(e) => setFormData({...formData, medicalCondition: e.target.value})}
                    placeholder="ไม่มีให้ใส่ -"
                    className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-red-100 outline-none text-sm h-20 resize-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 px-2 flex items-center gap-1 text-amber-500"><Info size={12}/> ข้อควรระวัง / แพ้อาหาร</label>
                  <textarea 
                    value={formData.precautions}
                    onChange={(e) => setFormData({...formData, precautions: e.target.value})}
                    placeholder="ระบุสิ่งที่ร้านควรระวัง"
                    className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-amber-100 outline-none text-sm h-20 resize-none"
                  />
                </div>
              </div>

              <button 
                onClick={handleSave}
                disabled={!formData.name || !formData.breed}
                className="w-full py-4 bg-pink-500 text-white rounded-2xl font-bold shadow-lg shadow-pink-200 mt-4 disabled:opacity-50 disabled:shadow-none transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                <Check size={20} />
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