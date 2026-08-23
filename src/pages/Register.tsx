"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Phone, MapPin, Mail, ArrowRight, PawPrint, Home, Sparkles, Heart } from 'lucide-react';
import { toast } from 'sonner';

interface RegisterProps {
  lineProfile: any;
  initialData?: any;
  onSuccess: () => void;
  onSave: (data: any) => Promise<void>;
}

const Register = ({ lineProfile, initialData, onSuccess, onSave }: RegisterProps) => {
  const [formData, setFormData] = useState({
    firstName: initialData?.first_name || '',
    lastName: initialData?.last_name || '',
    gender: initialData?.gender || 'หญิง',
    age: initialData?.age || '',
    phone: initialData?.phone || lineProfile?.phone || '',
    email: initialData?.email || lineProfile?.email || '',
    houseNo: initialData?.house_no || '',
    moo: initialData?.moo || '',
    soi: initialData?.soi || '',
    road: initialData?.road || '',
    subDistrict: initialData?.sub_district || '',
    district: initialData?.district || '',
    province: initialData?.province || '',
    postalCode: initialData?.postal_code || '',
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
    <div className="min-h-screen bg-[#F9F9F9] relative flex flex-col items-center justify-center p-4 pb-12 overflow-hidden">
      {/* Liquid Background Blobs */}
      <div className="absolute top-[-10%] left-[-20%] w-[300px] h-[300px] bg-[#FFD8E4] rounded-full blur-[80px] opacity-60 pointer-events-none" />
      <div className="absolute bottom-[10%] right-[-20%] w-[350px] h-[350px] bg-[#EAFD69] rounded-full blur-[100px] opacity-40 pointer-events-none" />
      <div className="absolute top-[40%] right-[-10%] w-[250px] h-[250px] bg-[#d9d6fe] rounded-full blur-[90px] opacity-50 pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 150 }}
        className="w-full max-w-md space-y-8 relative z-10"
      >
        {/* Header Area */}
        <div className="text-center space-y-3">
          <div className="relative inline-block">
            {/* Halo Effect */}
            <div className="absolute inset-0 bg-[#EAFD69] rounded-[2rem] blur-xl opacity-40 scale-125 animate-pulse" />
            <div className="relative w-20 h-20 bg-gradient-to-br from-[#18234a] to-[#020d35] rounded-[2rem] flex items-center justify-center mx-auto shadow-ambient border border-white/20">
              <PawPrint size={36} className="text-[#EAFD69]" />
            </div>
          </div>
          <div className="space-y-1">
            <h1 className="text-3xl font-black text-[#020d35] tracking-tight flex items-center justify-center gap-2">
              สมัครสมาชิกใหม่ <Sparkles size={24} className="text-[#EAFD69] fill-[#EAFD69]" />
            </h1>
            <p className="text-[#45464E] text-xs font-bold uppercase tracking-[0.15em] opacity-70">
              Join our premium pet sanctuary
            </p>
          </div>
        </div>

        {/* Frosted Glass Form Container */}
        <form 
          onSubmit={handleSubmit} 
          className="bg-white/75 backdrop-blur-2xl p-8 rounded-[3rem] shadow-ambient border border-white/40 space-y-6"
        >
          {/* Section 1: General Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-1">
              <User size={16} className="text-[#020d35]/60" />
              <h4 className="text-[10px] font-black text-[#020d35] uppercase tracking-widest">ข้อมูลทั่วไป</h4>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-[#45464E] opacity-60 uppercase tracking-widest px-1">ชื่อจริง</label>
                <input 
                  required
                  type="text" 
                  value={formData.firstName}
                  onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                  placeholder="ชื่อ"
                  className="w-full p-4 bg-[#F3F3F3]/60 focus:bg-white rounded-2xl border-none focus:ring-2 focus:ring-[#020d35]/10 outline-none text-sm font-bold text-[#020d35] transition-all placeholder:text-slate-400"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-[#45464E] opacity-60 uppercase tracking-widest px-1">นามสกุล</label>
                <input 
                  required
                  type="text" 
                  value={formData.lastName}
                  onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                  placeholder="นามสกุล"
                  className="w-full p-4 bg-[#F3F3F3]/60 focus:bg-white rounded-2xl border-none focus:ring-2 focus:ring-[#020d35]/10 outline-none text-sm font-bold text-[#020d35] transition-all placeholder:text-slate-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-[#45464E] opacity-60 uppercase tracking-widest px-1">เพศ</label>
                <select 
                  value={formData.gender}
                  onChange={(e) => setFormData({...formData, gender: e.target.value})}
                  className="w-full p-4 bg-[#F3F3F3]/60 focus:bg-white rounded-2xl border-none focus:ring-2 focus:ring-[#020d35]/10 outline-none text-sm font-bold text-[#020d35] transition-all appearance-none"
                >
                  <option value="หญิง">หญิง</option>
                  <option value="ชาย">ชาย</option>
                  <option value="ไม่ระบุ">ไม่ระบุ</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-[#45464E] opacity-60 uppercase tracking-widest px-1">อายุ (ปี)</label>
                <input 
                  type="number" 
                  value={formData.age}
                  onChange={(e) => setFormData({...formData, age: e.target.value})}
                  placeholder="อายุ"
                  className="w-full p-4 bg-[#F3F3F3]/60 focus:bg-white rounded-2xl border-none focus:ring-2 focus:ring-[#020d35]/10 outline-none text-sm font-bold text-[#020d35] transition-all placeholder:text-slate-400"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Contact Info */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-2 pb-1">
              <Mail size={16} className="text-[#020d35]/60" />
              <h4 className="text-[10px] font-black text-[#020d35] uppercase tracking-widest">ข้อมูลการติดต่อ</h4>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-[#45464E] opacity-60 uppercase tracking-widest px-1 flex items-center gap-1">
                <Phone size={10} className="text-pink-500" /> เบอร์โทรศัพท์
              </label>
              <input 
                required
                type="tel" 
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                placeholder="08X-XXX-XXXX"
                className="w-full p-4 bg-[#F3F3F3]/60 focus:bg-white rounded-2xl border-none focus:ring-2 focus:ring-[#020d35]/10 outline-none text-sm font-bold text-[#020d35] transition-all placeholder:text-slate-400"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-[#45464E] opacity-60 uppercase tracking-widest px-1">อีเมล (ถ้ามี)</label>
              <input 
                type="email" 
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder="example@email.com"
                className="w-full p-4 bg-[#F3F3F3]/60 focus:bg-white rounded-2xl border-none focus:ring-2 focus:ring-[#020d35]/10 outline-none text-sm font-bold text-[#020d35] transition-all placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Section 3: Address Info */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-2 pb-1">
              <MapPin size={16} className="text-[#020d35]/60" />
              <h4 className="text-[10px] font-black text-[#020d35] uppercase tracking-widest">ข้อมูลที่อยู่</h4>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-[#45464E] opacity-60 uppercase tracking-widest px-1 flex items-center gap-1">
                   <Home size={10} /> เลขที่บ้าน
                </label>
                <input 
                  type="text" 
                  value={formData.houseNo}
                  onChange={(e) => setFormData({...formData, houseNo: e.target.value})}
                  placeholder="เช่น 123/4"
                  className="w-full p-4 bg-[#F3F3F3]/60 focus:bg-white rounded-2xl border-none focus:ring-2 focus:ring-[#020d35]/10 outline-none text-sm font-bold text-[#020d35] transition-all placeholder:text-slate-400"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-[#45464E] opacity-60 uppercase tracking-widest px-1">หมู่ที่</label>
                <input 
                  type="text" 
                  value={formData.moo}
                  onChange={(e) => setFormData({...formData, moo: e.target.value})}
                  placeholder="เช่น 5"
                  className="w-full p-4 bg-[#F3F3F3]/60 focus:bg-white rounded-2xl border-none focus:ring-2 focus:ring-[#020d35]/10 outline-none text-sm font-bold text-[#020d35] transition-all placeholder:text-slate-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-[#45464E] opacity-60 uppercase tracking-widest px-1">ซอย</label>
                <input 
                  type="text" 
                  value={formData.soi}
                  onChange={(e) => setFormData({...formData, soi: e.target.value})}
                  placeholder="เช่น สุขุมวิท 1"
                  className="w-full p-4 bg-[#F3F3F3]/60 focus:bg-white rounded-2xl border-none focus:ring-2 focus:ring-[#020d35]/10 outline-none text-sm font-bold text-[#020d35] transition-all placeholder:text-slate-400"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-[#45464E] opacity-60 uppercase tracking-widest px-1">ถนน</label>
                <input 
                  type="text" 
                  value={formData.road}
                  onChange={(e) => setFormData({...formData, road: e.target.value})}
                  placeholder="เช่น รามคำแหง"
                  className="w-full p-4 bg-[#F3F3F3]/60 focus:bg-white rounded-2xl border-none focus:ring-2 focus:ring-[#020d35]/10 outline-none text-sm font-bold text-[#020d35] transition-all placeholder:text-slate-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-[#45464E] opacity-60 uppercase tracking-widest px-1">แขวง / ตำบล</label>
                <input 
                  type="text" 
                  value={formData.subDistrict}
                  onChange={(e) => setFormData({...formData, subDistrict: e.target.value})}
                  placeholder="ตำบล"
                  className="w-full p-4 bg-[#F3F3F3]/60 focus:bg-white rounded-2xl border-none focus:ring-2 focus:ring-[#020d35]/10 outline-none text-sm font-bold text-[#020d35] transition-all placeholder:text-slate-400"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-[#45464E] opacity-60 uppercase tracking-widest px-1">เขต / อำเภอ</label>
                <input 
                  type="text" 
                  value={formData.district}
                  onChange={(e) => setFormData({...formData, district: e.target.value})}
                  placeholder="อำเภอ"
                  className="w-full p-4 bg-[#F3F3F3]/60 focus:bg-white rounded-2xl border-none focus:ring-2 focus:ring-[#020d35]/10 outline-none text-sm font-bold text-[#020d35] transition-all placeholder:text-slate-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-[#45464E] opacity-60 uppercase tracking-widest px-1">จังหวัด</label>
                <input 
                  type="text" 
                  value={formData.province}
                  onChange={(e) => setFormData({...formData, province: e.target.value})}
                  placeholder="จังหวัด"
                  className="w-full p-4 bg-[#F3F3F3]/60 focus:bg-white rounded-2xl border-none focus:ring-2 focus:ring-[#020d35]/10 outline-none text-sm font-bold text-[#020d35] transition-all placeholder:text-slate-400"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-[#45464E] opacity-60 uppercase tracking-widest px-1">รหัสไปรษณีย์</label>
                <input 
                  type="text" 
                  value={formData.postalCode}
                  onChange={(e) => setFormData({...formData, postalCode: e.target.value})}
                  placeholder="10XXX"
                  className="w-full p-4 bg-[#F3F3F3]/60 focus:bg-white rounded-2xl border-none focus:ring-2 focus:ring-[#020d35]/10 outline-none text-sm font-bold text-[#020d35] transition-all placeholder:text-slate-400"
                />
              </div>
            </div>
          </div>

          {/* Submit Button - Signature Navy Gradient */}
          <button 
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 bg-gradient-to-br from-[#18234a] to-[#020d35] text-white rounded-full font-black shadow-ambient active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 text-sm uppercase tracking-widest mt-4"
          >
            {isSubmitting ? "กำลังบันทึกข้อมูล..." : (
              <>
                เริ่มใช้งานเลย <ArrowRight size={18} strokeWidth={3} />
              </>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default Register;