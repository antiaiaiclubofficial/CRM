"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, HeartPulse, Calendar, Info, Check, Feather, Camera, AlertCircle, Palette, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface Pet {
  id?: string | number;
  name: string;
  type: string;
  breed: string;
  age: string;
  birth_date?: string;
  gender: string;
  weight: string;
  medical_condition: string;
  precautions: string;
  fur_length: string;
  image_url: string;
  card_bg_color?: string;
}

interface PetFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (pet: Pet) => void;
  initialData?: Pet | null;
}

const petIcons: Record<string, string> = { 'สุนัข': '🐶', 'แมว': '🐱', 'กระต่าย': '🐰', 'หนูแฮมสเตอร์': '🐹', 'นก': '🦜' };
const furLengths = ['ขนสั้น', 'ขนปานกลาง', 'ขนยาว', 'ขนยาวพิเศษ'];
const themeColors = [
  { name: 'Pink', value: '#FFD8E4' },
  { name: 'Peach', value: '#FFE3BC' },
  { name: 'Mint', value: '#B2F2BB' },
  { name: 'Blue', value: '#BBDEFB' },
  { name: 'Lavender', value: '#E1BEE7' },
  { name: 'Cream', value: '#FFF9F0' },
];

const calculateAgeString = (birthDate: string) => {
  if (!birthDate) return "";
  const today = new Date();
  const birth = new Date(birthDate);
  
  let years = today.getFullYear() - birth.getFullYear();
  let months = today.getMonth() - birth.getMonth();
  
  if (months < 0 || (months === 0 && today.getDate() < birth.getDate())) {
    years--;
    months += 12;
  }
  
  if (today.getDate() < birth.getDate()) {
    months--;
    if (months < 0) {
      years--;
      months += 12;
    }
  }

  if (years < 0) return "0 ปี 0 เดือน";
  return `${years} ปี ${months} เดือน`;
};

const PetForm = ({ isOpen, onClose, onSave, initialData }: PetFormProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState<Pet>({
    name: '',
    type: 'สุนัข',
    breed: '',
    age: '',
    birth_date: '',
    gender: 'ผู้',
    weight: '',
    medical_condition: '',
    precautions: '',
    fur_length: 'ขนสั้น',
    image_url: '',
    card_bg_color: '#FFD8E4',
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
          birth_date: initialData.birth_date || '',
          gender: initialData.gender || 'ผู้',
          weight: initialData.weight || '',
          medical_condition: initialData.medical_condition || '',
          precautions: initialData.precautions || '',
          fur_length: initialData.fur_length || 'ขนสั้น',
          image_url: initialData.image_url || '',
          card_bg_color: initialData.card_bg_color || '#FFD8E4',
        });
      } else {
        setFormData({
          name: '',
          type: 'สุนัข',
          breed: '',
          age: '',
          birth_date: '',
          gender: 'ผู้',
          weight: '',
          medical_condition: '',
          precautions: '',
          fur_length: 'ขนสั้น',
          image_url: '',
          card_bg_color: '#FFD8E4',
        });
      }
    }
  }, [initialData, isOpen]);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // จำกัดขนาดไฟล์ไม่เกิน 5MB
    if (file.size > 5 * 1024 * 1024) {
      toast.error('ขนาดรูปภาพต้องไม่เกิน 5MB ค่ะ');
      return;
    }

    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `pet_${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
      const filePath = `${fileName}`;

      // อัปโหลดไฟล์ไปยัง Supabase Storage Bucket ชื่อ 'pets'
      const { data, error } = await supabase.storage
        .from('pets')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (error) {
        console.error('Storage upload error:', error);
        throw error;
      }

      // ดึง Public URL ของรูปภาพที่อัปโหลดสำเร็จ
      const { data: { publicUrl } } = supabase.storage
        .from('pets')
        .getPublicUrl(filePath);

      setFormData(prev => ({ ...prev, image_url: publicUrl }));
      toast.success('อัปโหลดรูปภาพสำเร็จแล้วค่ะ');
    } catch (error: any) {
      console.error('Error uploading image:', error);
      toast.error('ไม่สามารถอัปโหลดรูปภาพได้ ระบบจะใช้รูปภาพตัวอย่างแทนชั่วคราวค่ะ');
      
      // Fallback ไปใช้รูปภาพตัวอย่างจาก Unsplash แทนการใช้ Base64 ที่ยาวเกินไป
      const fallbackUrl = `https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=200&h=200`;
      setFormData(prev => ({ ...prev, image_url: fallbackUrl }));
    } finally {
      setIsUploading(false);
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value;
    setFormData(prev => ({ 
      ...prev, 
      birth_date: date,
      age: calculateAgeString(date)
    }));
  };

  const executeSave = () => {
    if (!initialData && !formData.name.trim()) {
      onClose();
      return;
    }
    
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
            onClick={executeSave}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            className="relative w-full bg-white rounded-t-[3rem] h-[85vh] overflow-hidden shadow-2xl flex flex-col"
          >
            <div className="flex justify-between items-center shrink-0 bg-white pt-8 pb-4 px-8 z-10 rounded-t-[3rem]">
              <h3 className="font-bold text-xl text-slate-800">{initialData ? 'แก้ไขข้อมูลสัตว์เลี้ยง' : 'เพิ่มสัตว์เลี้ยงใหม่'}</h3>
              <button onClick={executeSave} className="p-2 bg-slate-100 rounded-full text-slate-400">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 space-y-6 px-8 pb-24 overflow-y-auto no-scrollbar">
              {/* Image & Color Selection */}
              <div className="flex flex-col items-center gap-6 pt-4">
                <div 
                  onClick={() => !isUploading && fileInputRef.current?.click()}
                  className="relative w-28 h-28 rounded-full border-4 border-slate-800 bg-slate-50 flex items-center justify-center overflow-hidden cursor-pointer shadow-soft"
                >
                  {isUploading ? (
                    <div className="flex flex-col items-center text-slate-400">
                      <Loader2 size={32} className="animate-spin text-pink-500" />
                      <span className="text-[10px] font-bold mt-1 uppercase">Uploading</span>
                    </div>
                  ) : formData.image_url ? (
                    <img src={formData.image_url} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center text-slate-300">
                      <Camera size={32} />
                      <span className="text-[10px] font-bold mt-1 uppercase">Photo</span>
                    </div>
                  )}
                  {!isUploading && (
                    <div className="absolute inset-0 bg-black/5 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <Camera size={20} className="text-white" />
                    </div>
                  )}
                </div>
                <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="hidden" />

                <div className="w-full space-y-3">
                  <label className="text-xs font-black text-slate-500 flex items-center gap-2 px-1 uppercase tracking-wider">
                    <Palette size={14} className="text-pink-500" /> เลือกสีพื้นหลังบัตร
                  </label>
                  <div className="flex justify-between items-center gap-2 p-3 bg-slate-50 rounded-3xl border-2 border-slate-100">
                    {themeColors.map((color) => (
                      <button
                        key={color.value}
                        onClick={() => setFormData({ ...formData, card_bg_color: color.value })}
                        className={`w-8 h-8 rounded-full border-2 transition-all ${
                          formData.card_bg_color === color.value 
                            ? 'border-slate-800 scale-110 shadow-sm' 
                            : 'border-transparent'
                        }`}
                        style={{ backgroundColor: color.value }}
                      >
                        {formData.card_bg_color === color.value && <Check size={14} className="mx-auto text-slate-800" />}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

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

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500">วันเกิด</label>
                  <input 
                    type="date" 
                    value={formData.birth_date}
                    onChange={handleDateChange}
                    className="w-full p-4 bg-slate-50 rounded-2xl outline-none font-bold"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500">อายุปัจจุบัน</label>
                  <div className="w-full p-4 bg-slate-100 rounded-2xl font-bold text-slate-500 text-sm flex items-center h-[56px]">
                    {formData.age || '-'}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
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

                <div className="space-y-1.5 pb-8">
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
                disabled={isUploading}
                className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black mt-4 shadow-lg active:scale-95 transition-all border-2 border-black mb-8 disabled:opacity-50"
              >
                {isUploading ? 'กำลังอัปโหลดรูปภาพ...' : 'บันทึกข้อมูล'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default PetForm;