"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Phone, MapPin, Mail, Calendar, Check, Home, Sparkles } from 'lucide-react';

interface OwnerProfile {
  firstName: string;
  lastName: string;
  gender: string;
  age: string;
  phone: string;
  address: string;
  subDistrict: string;
  district: string;
  province: string;
  postalCode: string;
  email: string;
}

interface UserProfileEditProps {
  isOpen: boolean;
  onClose: () => void;
  profile: OwnerProfile;
  onSave: (updatedProfile: OwnerProfile) => void;
}

const UserProfileEdit = ({ isOpen, onClose, profile, onSave }: UserProfileEditProps) => {
  // Local state for split address fields
  const [addressParts, setAddressParts] = React.useState({
    houseNo: '',
    moo: '',
    soi: '',
    road: ''
  });
  
  const [formData, setFormData] = React.useState(profile);

  // Helper to parse the address string into parts
  const parseAddress = (addressStr: string) => {
    const parts = { houseNo: '', moo: '', soi: '', road: '' };
    if (!addressStr) return parts;

    const houseMatch = addressStr.match(/เลขที่\s*([^หมู่ซอยถนน]+)/);
    const mooMatch = addressStr.match(/หมู่\s*([^ซอยถนน]+)/);
    const soiMatch = addressStr.match(/ซอย\s*([^ถนน]+)/);
    const roadMatch = addressStr.match(/ถนน\s*(.+)/);

    if (houseMatch) parts.houseNo = houseMatch[1].trim();
    if (mooMatch) parts.moo = mooMatch[1].trim();
    if (soiMatch) parts.soi = soiMatch[1].trim();
    if (roadMatch) parts.road = roadMatch[1].trim();

    if (!houseMatch && !mooMatch && !soiMatch && !roadMatch) {
      parts.houseNo = addressStr;
    }

    return parts;
  };

  // Sync with prop when it opens
  React.useEffect(() => {
    if (isOpen) {
      setFormData(profile);
      setAddressParts(parseAddress(profile.address));
    }
  }, [isOpen, profile]);

  const handleSave = () => {
    const fullAddress = [
      addressParts.houseNo ? `เลขที่ ${addressParts.houseNo}` : '',
      addressParts.moo ? `หมู่ ${addressParts.moo}` : '',
      addressParts.soi ? `ซอย ${addressParts.soi}` : '',
      addressParts.road ? `ถนน ${addressParts.road}` : ''
    ].filter(Boolean).join(' ');

    onSave({
      ...formData,
      address: fullAddress
    });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center">
          {/* Premium Backdrop Blur */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleSave}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
          />
          
          {/* Liquid Glass Bottom Sheet */}
          <motion.div 
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="relative w-full max-w-[390px] bg-white/90 backdrop-blur-2xl rounded-t-[3.5rem] h-[88vh] overflow-hidden shadow-ambient flex flex-col border-t border-white/40"
          >
            {/* Drag Handle Indicator */}
            <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mt-4 shrink-0" />

            {/* Header */}
            <div className="flex justify-between items-center shrink-0 pt-4 pb-4 px-8 z-10">
              <div>
                <p className="text-[10px] font-black text-surface-variant opacity-40 uppercase tracking-[0.2em] mb-0.5">My Profile</p>
                <h3 className="font-black text-2xl text-primary tracking-tight">ข้อมูลส่วนตัว</h3>
              </div>
              <button 
                onClick={handleSave} 
                className="p-2.5 bg-primary/5 hover:bg-primary/10 rounded-full text-primary/60 transition-all active:scale-90"
              >
                <X size={18} strokeWidth={2.5} />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 space-y-6 px-6 pb-28 overflow-y-auto no-scrollbar pt-2">
              
              {/* Glass Vessel 1: General Info */}
              <div className="bg-white/60 backdrop-blur-md p-6 rounded-[2rem] shadow-ambient border border-white/40 space-y-5">
                <div className="flex items-center gap-2 pb-1 border-b border-primary/5">
                  <User size={16} className="text-primary/60" />
                  <h4 className="text-xs font-black text-primary uppercase tracking-wider">ข้อมูลทั่วไป</h4>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-surface-variant/60 uppercase tracking-widest px-1">ชื่อจริง</label>
                    <input 
                      type="text" 
                      value={formData.firstName}
                      onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                      className="w-full p-4 bg-surface-container-low/50 focus:bg-white rounded-2xl border-none focus:ring-2 focus:ring-primary/10 outline-none text-sm font-bold text-primary transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-surface-variant/60 uppercase tracking-widest px-1">นามสกุล</label>
                    <input 
                      type="text" 
                      value={formData.lastName}
                      onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                      className="w-full p-4 bg-surface-container-low/50 focus:bg-white rounded-2xl border-none focus:ring-2 focus:ring-primary/10 outline-none text-sm font-bold text-primary transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-surface-variant/60 uppercase tracking-widest px-1">เพศ</label>
                    <div className="relative">
                      <select 
                        value={formData.gender}
                        onChange={(e) => setFormData({...formData, gender: e.target.value})}
                        className="w-full p-4 bg-surface-container-low/50 focus:bg-white rounded-2xl border-none focus:ring-2 focus:ring-primary/10 outline-none text-sm font-bold text-primary transition-all appearance-none"
                      >
                        <option value="หญิง">หญิง</option>
                        <option value="ชาย">ชาย</option>
                        <option value="ไม่ระบุ">ไม่ระบุ</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-surface-variant/60 uppercase tracking-widest px-1">อายุ (ปี)</label>
                    <input 
                      type="number" 
                      value={formData.age}
                      onChange={(e) => setFormData({...formData, age: e.target.value})}
                      className="w-full p-4 bg-surface-container-low/50 focus:bg-white rounded-2xl border-none focus:ring-2 focus:ring-primary/10 outline-none text-sm font-bold text-primary transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Glass Vessel 2: Contact Info */}
              <div className="bg-white/60 backdrop-blur-md p-6 rounded-[2rem] shadow-ambient border border-white/40 space-y-5">
                <div className="flex items-center gap-2 pb-1 border-b border-primary/5">
                  <Phone size={16} className="text-primary/60" />
                  <h4 className="text-xs font-black text-primary uppercase tracking-wider">ข้อมูลการติดต่อ</h4>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-surface-variant/60 uppercase tracking-widest px-1">เบอร์โทรศัพท์</label>
                  <input 
                    type="tel" 
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    placeholder="08X-XXX-XXXX"
                    className="w-full p-4 bg-surface-container-low/50 focus:bg-white rounded-2xl border-none focus:ring-2 focus:ring-primary/10 outline-none text-sm font-bold text-primary transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-surface-variant/60 uppercase tracking-widest px-1">อีเมล</label>
                  <input 
                    type="email" 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="example@mail.com"
                    className="w-full p-4 bg-surface-container-low/50 focus:bg-white rounded-2xl border-none focus:ring-2 focus:ring-primary/10 outline-none text-sm font-bold text-primary transition-all"
                  />
                </div>
              </div>

              {/* Glass Vessel 3: Address Info */}
              <div className="bg-white/60 backdrop-blur-md p-6 rounded-[2rem] shadow-ambient border border-white/40 space-y-5">
                <div className="flex items-center gap-2 pb-1 border-b border-primary/5">
                  <MapPin size={16} className="text-primary/60" />
                  <h4 className="text-xs font-black text-primary uppercase tracking-wider">ข้อมูลที่อยู่</h4>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-surface-variant/60 uppercase tracking-widest px-1 flex items-center gap-1">
                      <Home size={10} /> เลขที่บ้าน
                    </label>
                    <input 
                      type="text" 
                      value={addressParts.houseNo}
                      onChange={(e) => setAddressParts({...addressParts, houseNo: e.target.value})}
                      placeholder="เช่น 123/4"
                      className="w-full p-4 bg-surface-container-low/50 focus:bg-white rounded-2xl border-none focus:ring-2 focus:ring-primary/10 outline-none text-sm font-bold text-primary transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-surface-variant/60 uppercase tracking-widest px-1">หมู่ที่</label>
                    <input 
                      type="text" 
                      value={addressParts.moo}
                      onChange={(e) => setAddressParts({...addressParts, moo: e.target.value})}
                      placeholder="เช่น 5"
                      className="w-full p-4 bg-surface-container-low/50 focus:bg-white rounded-2xl border-none focus:ring-2 focus:ring-primary/10 outline-none text-sm font-bold text-primary transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-surface-variant/60 uppercase tracking-widest px-1">ซอย</label>
                    <input 
                      type="text" 
                      value={addressParts.soi}
                      onChange={(e) => setAddressParts({...addressParts, soi: e.target.value})}
                      placeholder="เช่น สุขุมวิท 1"
                      className="w-full p-4 bg-surface-container-low/50 focus:bg-white rounded-2xl border-none focus:ring-2 focus:ring-primary/10 outline-none text-sm font-bold text-primary transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-surface-variant/60 uppercase tracking-widest px-1">ถนน</label>
                    <input 
                      type="text" 
                      value={addressParts.road}
                      onChange={(e) => setAddressParts({...addressParts, road: e.target.value})}
                      placeholder="เช่น รามคำแหง"
                      className="w-full p-4 bg-surface-container-low/50 focus:bg-white rounded-2xl border-none focus:ring-2 focus:ring-primary/10 outline-none text-sm font-bold text-primary transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-surface-variant/60 uppercase tracking-widest px-1">แขวง / ตำบล</label>
                    <input 
                      type="text" 
                      value={formData.subDistrict}
                      onChange={(e) => setFormData({...formData, subDistrict: e.target.value})}
                      placeholder="ตำบล"
                      className="w-full p-4 bg-surface-container-low/50 focus:bg-white rounded-2xl border-none focus:ring-2 focus:ring-primary/10 outline-none text-sm font-bold text-primary transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-surface-variant/60 uppercase tracking-widest px-1">เขต / อำเภอ</label>
                    <input 
                      type="text" 
                      value={formData.district}
                      onChange={(e) => setFormData({...formData, district: e.target.value})}
                      placeholder="อำเภอ"
                      className="w-full p-4 bg-surface-container-low/50 focus:bg-white rounded-2xl border-none focus:ring-2 focus:ring-primary/10 outline-none text-sm font-bold text-primary transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-surface-variant/60 uppercase tracking-widest px-1">จังหวัด</label>
                    <input 
                      type="text" 
                      value={formData.province}
                      onChange={(e) => setFormData({...formData, province: e.target.value})}
                      placeholder="จังหวัด"
                      className="w-full p-4 bg-surface-container-low/50 focus:bg-white rounded-2xl border-none focus:ring-2 focus:ring-primary/10 outline-none text-sm font-bold text-primary transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-surface-variant/60 uppercase tracking-widest px-1">รหัสไปรษณีย์</label>
                    <input 
                      type="text" 
                      value={formData.postalCode}
                      onChange={(e) => setFormData({...formData, postalCode: e.target.value})}
                      placeholder="10XXX"
                      className="w-full p-4 bg-surface-container-low/50 focus:bg-white rounded-2xl border-none focus:ring-2 focus:ring-primary/10 outline-none text-sm font-bold text-primary transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Premium Action Button */}
              <button 
                onClick={handleSave}
                className="w-full py-4.5 bg-gradient-to-br from-[#18234a] to-[#020d35] text-white rounded-full font-black shadow-ambient active:scale-95 transition-all flex items-center justify-center gap-2 border-none text-sm uppercase tracking-widest"
              >
                <Check size={18} strokeWidth={3} />
                บันทึกการเปลี่ยนแปลง
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default UserProfileEdit;