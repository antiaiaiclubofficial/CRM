"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Phone, MapPin, Mail, Calendar, Check, ArrowRight, PawPrint } from 'lucide-react';

interface RegisterProps {
  lineProfile: any;
  onSuccess: () => void;
  onSave: (data: any) => Promise<void>;
}

const Register = ({ lineProfile, onSuccess, onSave }: RegisterProps) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    gender: 'หญิง',
    age: '',
    phone: lineProfile?.phone || '', // Pull from LIFF if available
    address: '',
    email: lineProfile?.email || '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName || !formData.phone) return;
    
    setIsSubmitting(true);
    try {
      await onSave(formData);
      onSuccess();
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF9F0] flex flex-col items-center justify-center p-6 pb-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md space-y-8"
      >
        <div className="text-center space-y-2">
          <div className="w-20 h-20 bg-pink-100 rounded-3xl flex items-center justify-center mx-auto mb-4 border-2 border-black shadow-soft">
            <PawPrint size={40} className="text-pink-500" />
          </div>
          <h1 className="text-3xl font-black text-slate-800">ยินดีต้อนรับ!</h1>
          <p className="text-slate-500 font-medium">กรุณาลงทะเบียนเพื่อเริ่มสะสมคะแนนนะคะ ✨</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-[3rem] border-2 border-black shadow-soft space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-500 px-1">ชื่อ</label>
              <input 
                required
                type="text" 
                value={formData.firstName}
                onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                placeholder="ชื่อจริง"
                className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-pink-200 outline-none text-sm font-bold"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-500 px-1">นามสกุล</label>
              <input 
                required
                type="text" 
                value={formData.lastName}
                onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                placeholder="นามสกุล"
                className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-pink-200 outline-none text-sm font-bold"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-500 px-1">เพศ</label>
              <select 
                value={formData.gender}
                onChange={(e) => setFormData({...formData, gender: e.target.value})}
                className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-pink-200 outline-none text-sm font-bold appearance-none"
              >
                <option value="หญิง">หญิง</option>
                <option value="ชาย">ชาย</option>
                <option value="ไม่ระบุ">ไม่ระบุ</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-500 px-1">อายุ</label>
              <input 
                type="number" 
                value={formData.age}
                onChange={(e) => setFormData({...formData, age: e.target.value})}
                placeholder="ปี"
                className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-pink-200 outline-none text-sm font-bold"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-500 px-1 flex items-center gap-1">
              <Phone size={12} className="text-pink-500" /> เบอร์โทรศัพท์
            </label>
            <input 
              required
              type="tel" 
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              placeholder="08X-XXX-XXXX"
              className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-pink-200 outline-none text-sm font-bold"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-500 px-1 flex items-center gap-1">
              <Mail size={12} className="text-pink-500" /> Email
            </label>
            <input 
              type="email" 
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              placeholder="example@mail.com"
              className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-pink-200 outline-none text-sm font-bold"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-500 px-1 flex items-center gap-1">
              <MapPin size={12} className="text-pink-500" /> ที่อยู่
            </label>
            <textarea 
              value={formData.address}
              onChange={(e) => setFormData({...formData, address: e.target.value})}
              placeholder="สำหรับจัดส่งของรางวัล..."
              className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-pink-200 outline-none text-sm font-bold h-20 resize-none"
            />
          </div>

          <button 
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black border-2 border-black shadow-[4px_4px_0px_0px_#000] active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isSubmitting ? "กำลังบันทึก..." : (
              <>
                เริ่มใช้งานเลย <ArrowRight size={20} />
              </>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default Register;