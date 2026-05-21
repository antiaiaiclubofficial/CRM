"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Phone, MapPin, Mail, Calendar, Check, ArrowRight, PawPrint, Home } from 'lucide-react';
import { toast } from 'sonner';

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
    phone: lineProfile?.phone || '',
    email: lineProfile?.email || '',
    // Split address fields
    houseNo: '',
    moo: '',
    soi: '',
    road: '',
    subDistrict: '',
    district: '',
    province: '',
    postalCode: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName || !formData.phone) {
      toast.error('กรุณากรอกข้อมูลที่จำเป็น (ชื่อ, นามสกุล, เบอร์โทร) ให้ครบถ้วนค่ะ');
      return;
    }
    
    setIsSubmitting(true);
    try {
      // Concatenate split address fields into one address string
      const fullAddress = [
        formData.houseNo ? `เลขที่ ${formData.houseNo}` : '',
        formData.moo ? `หมู่ ${formData.moo}` : '',
        formData.soi ? `ซอย ${formData.soi}` : '',
        formData.road ? `ถนน ${formData.road}` : ''
      ].filter(Boolean).join(' ');

      const dataToSave = {
        ...formData,
        address: fullAddress
      };

      await onSave(dataToSave);
      onSuccess();
    } catch (error) {
      console.error('Registration Error:', error);
      toast.error('เกิดข้อผิดพลาดในการลงทะเบียน กรุณาลองใหม่อีกครั้งค่ะ');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF9F0] flex flex-col items-center justify-center p-4 pb-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md space-y-6"
      >
        <div className="text-center space-y-2">
          <div className="w-20 h-20 bg-pink-100 rounded-3xl flex items-center justify-center mx-auto mb-4 border-2 border-black shadow-soft">
            <PawPrint size={40} className="text-pink-500" />
          </div>
          <h1 className="text-3xl font-black text-slate-800">ยินดีต้อนรับ!</h1>
          <p className="text-slate-500 font-medium">กรุณาลงทะเบียนเพื่อเริ่มสะสมคะแนนนะคะ ✨</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-[2.5rem] border-2 border-black shadow-soft space-y-5">
          {/* Name Section */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-500 px-1 flex items-center h-5">ชื่อ</label>
              <input 
                required
                type="text" 
                value={formData.firstName}
                onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                placeholder="ชื่อจริง"
                className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-pink-200 outline-none text-base font-bold"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-500 px-1 flex items-center h-5">นามสกุล</label>
              <input 
                required
                type="text" 
                value={formData.lastName}
                onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                placeholder="นามสกุล"
                className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-pink-200 outline-none text-base font-bold"
              />
            </div>
          </div>

          {/* Gender and Age Section */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-500 px-1 flex items-center h-5">เพศ</label>
              <select 
                value={formData.gender}
                onChange={(e) => setFormData({...formData, gender: e.target.value})}
                className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-pink-200 outline-none text-base font-bold appearance-none"
              >
                <option value="หญิง">หญิง</option>
                <option value="ชาย">ชาย</option>
                <option value="ไม่ระบุ">ไม่ระบุ</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-500 px-1 flex items-center h-5">อายุ</label>
              <input 
                type="number" 
                value={formData.age}
                onChange={(e) => setFormData({...formData, age: e.target.value})}
                placeholder="ปี"
                className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-pink-200 outline-none text-base font-bold"
              />
            </div>
          </div>

          {/* Contact Section */}
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-500 px-1 flex items-center gap-1 h-5">
                <Phone size={12} className="text-pink-500" /> เบอร์โทรศัพท์
              </label>
              <input 
                required
                type="tel" 
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                placeholder="08X-XXX-XXXX"
                className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-pink-200 outline-none text-base font-bold"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-500 px-1 flex items-center gap-1 h-5">
                <Mail size={12} className="text-pink-500" /> อีเมล (ถ้ามี)
              </label>
              <input 
                type="email" 
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder="example@email.com"
                className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-pink-200 outline-none text-base font-bold"
              />
            </div>
          </div>

          {/* Split Address Section */}
          <div className="space-y-4 pt-2 border-t border-slate-50">
            <label className="text-xs font-black text-slate-500 px-1 flex items-center gap-1 h-5">
              <MapPin size={12} className="text-pink-500" /> ข้อมูลที่อยู่
            </label>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-500 px-1 flex items-center gap-1 h-5">
                   <Home size={12} /> เลขที่บ้าน
                </label>
                <input 
                  type="text" 
                  value={formData.houseNo}
                  onChange={(e) => setFormData({...formData, houseNo: e.target.value})}
                  placeholder="เช่น 123/4"
                  className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-pink-200 outline-none text-base font-bold"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-500 px-1 flex items-center h-5">หมู่ที่</label>
                <input 
                  type="text" 
                  value={formData.moo}
                  onChange={(e) => setFormData({...formData, moo: e.target.value})}
                  placeholder="เช่น 5"
                  className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-pink-200 outline-none text-base font-bold"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-500 px-1 flex items-center h-5">ซอย</label>
                <input 
                  type="text" 
                  value={formData.soi}
                  onChange={(e) => setFormData({...formData, soi: e.target.value})}
                  placeholder="เช่น สุขุมวิท 1"
                  className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-pink-200 outline-none text-base font-bold"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-500 px-1 flex items-center h-5">ถนน</label>
                <input 
                  type="text" 
                  value={formData.road}
                  onChange={(e) => setFormData({...formData, road: e.target.value})}
                  placeholder="เช่น รามคำแหง"
                  className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-pink-200 outline-none text-base font-bold"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-500 px-1 flex items-center h-5">แขวง / ตำบล</label>
                <input 
                  type="text" 
                  value={formData.subDistrict}
                  onChange={(e) => setFormData({...formData, subDistrict: e.target.value})}
                  placeholder="ตำบล"
                  className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-pink-200 outline-none text-base font-bold"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-500 px-1 flex items-center h-5">เขต / อำเภอ</label>
                <input 
                  type="text" 
                  value={formData.district}
                  onChange={(e) => setFormData({...formData, district: e.target.value})}
                  placeholder="อำเภอ"
                  className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-pink-200 outline-none text-base font-bold"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-500 px-1 flex items-center h-5">จังหวัด</label>
                <input 
                  type="text" 
                  value={formData.province}
                  onChange={(e) => setFormData({...formData, province: e.target.value})}
                  placeholder="จังหวัด"
                  className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-pink-200 outline-none text-base font-bold"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-500 px-1 flex items-center h-5">รหัสไปรษณีย์</label>
                <input 
                  type="text" 
                  value={formData.postalCode}
                  onChange={(e) => setFormData({...formData, postalCode: e.target.value})}
                  placeholder="10XXX"
                  className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-pink-200 outline-none text-base font-bold"
                />
              </div>
            </div>
          </div>

          <button 
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black border-2 border-black shadow-[4px_4px_0px_0px_#000] active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isSubmitting ? "กำลังบันทึก..." : (
              <>
                เริ่มใช้งานเลย <ArrowRight size={20} strokeWidth={3} />
              </>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default Register;