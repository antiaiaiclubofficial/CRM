"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Phone, MapPin, Mail, Calendar, Check, Home } from 'lucide-react';

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

    // Simple parsing logic based on labels used in Register.tsx
    const houseMatch = addressStr.match(/เลขที่\s*([^หมู่ซอยถนน]+)/);
    const mooMatch = addressStr.match(/หมู่\s*([^ซอยถนน]+)/);
    const soiMatch = addressStr.match(/ซอย\s*([^ถนน]+)/);
    const roadMatch = addressStr.match(/ถนน\s*(.+)/);

    if (houseMatch) parts.houseNo = houseMatch[1].trim();
    if (mooMatch) parts.moo = mooMatch[1].trim();
    if (soiMatch) parts.soi = soiMatch[1].trim();
    if (roadMatch) parts.road = roadMatch[1].trim();

    // Fallback: if no labels found, put everything in houseNo
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
    // Reconstruct the address string
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
            className="relative w-full max-w-[390px] bg-white rounded-t-[3rem] max-h-[90vh] overflow-y-auto no-scrollbar shadow-2xl"
          >
            {/* Header */}
            <div className="flex justify-between items-center sticky top-0 bg-white pt-8 pb-4 px-8 z-10 rounded-t-[3rem]">
              <h3 className="font-bold text-xl text-slate-800">ข้อมูลส่วนตัว</h3>
              <button onClick={onClose} className="p-2 bg-slate-100 rounded-full text-slate-400">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-5 px-8 pb-24">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 px-2 flex items-center gap-1 h-4">
                    <User size={12}/> ชื่อ
                  </label>
                  <input 
                    type="text" 
                    value={formData.firstName}
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                    className="w-full p-3.5 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-pink-200 outline-none text-base"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 px-2 flex items-center gap-1 h-4">
                    <span className="w-3" /> นามสกุล
                  </label>
                  <input 
                    type="text" 
                    value={formData.lastName}
                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                    className="w-full p-3.5 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-pink-200 outline-none text-base"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 px-2 flex items-center gap-1 h-4"><User size={12}/> เพศ</label>
                  <select 
                    value={formData.gender}
                    onChange={(e) => setFormData({...formData, gender: e.target.value})}
                    className="w-full p-3.5 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-pink-200 outline-none text-base appearance-none"
                  >
                    <option value="หญิง">หญิง</option>
                    <option value="ชาย">ชาย</option>
                    <option value="ไม่ระบุ">ไม่ระบุ</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 px-2 flex items-center gap-1 h-4"><Calendar size={12}/> อายุ</label>
                  <input 
                    type="number" 
                    value={formData.age}
                    onChange={(e) => setFormData({...formData, age: e.target.value})}
                    className="w-full p-3.5 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-pink-200 outline-none text-base"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 px-2 flex items-center gap-1"><Phone size={12}/> เบอร์โทรศัพท์</label>
                <input 
                  type="tel" 
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  placeholder="08X-XXX-XXXX"
                  className="w-full p-3.5 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-pink-200 outline-none text-base"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 px-2 flex items-center gap-1"><Mail size={12}/> Email</label>
                <input 
                  type="email" 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="example@mail.com"
                  className="w-full p-3.5 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-pink-200 outline-none text-base"
                />
              </div>

              {/* Split Address Section */}
              <div className="space-y-4 pt-2 border-t border-slate-50">
                <label className="text-xs font-bold text-slate-500 px-2 flex items-center gap-1">
                  <MapPin size={12} className="text-pink-500" /> ข้อมูลที่อยู่
                </label>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 px-2 flex items-center gap-1">
                      <Home size={10} /> เลขที่บ้าน
                    </label>
                    <input 
                      type="text" 
                      value={addressParts.houseNo}
                      onChange={(e) => setAddressParts({...addressParts, houseNo: e.target.value})}
                      placeholder="เช่น 123/4"
                      className="w-full p-3.5 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-pink-200 outline-none text-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 px-2">หมู่ที่</label>
                    <input 
                      type="text" 
                      value={addressParts.moo}
                      onChange={(e) => setAddressParts({...addressParts, moo: e.target.value})}
                      placeholder="เช่น 5"
                      className="w-full p-3.5 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-pink-200 outline-none text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 px-2">ซอย</label>
                    <input 
                      type="text" 
                      value={addressParts.soi}
                      onChange={(e) => setAddressParts({...addressParts, soi: e.target.value})}
                      placeholder="เช่น สุขุมวิท 1"
                      className="w-full p-3.5 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-pink-200 outline-none text-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 px-2">ถนน</label>
                    <input 
                      type="text" 
                      value={addressParts.road}
                      onChange={(e) => setAddressParts({...addressParts, road: e.target.value})}
                      placeholder="เช่น รามคำแหง"
                      className="w-full p-3.5 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-pink-200 outline-none text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 px-2">แขวง / ตำบล</label>
                    <input 
                      type="text" 
                      value={formData.subDistrict}
                      onChange={(e) => setFormData({...formData, subDistrict: e.target.value})}
                      placeholder="ตำบล"
                      className="w-full p-3.5 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-pink-200 outline-none text-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 px-2">เขต / อำเภอ</label>
                    <input 
                      type="text" 
                      value={formData.district}
                      onChange={(e) => setFormData({...formData, district: e.target.value})}
                      placeholder="อำเภอ"
                      className="w-full p-3.5 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-pink-200 outline-none text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 px-2">จังหวัด</label>
                    <input 
                      type="text" 
                      value={formData.province}
                      onChange={(e) => setFormData({...formData, province: e.target.value})}
                      placeholder="จังหวัด"
                      className="w-full p-3.5 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-pink-200 outline-none text-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 px-2">รหัสไปรษณีย์</label>
                    <input 
                      type="text" 
                      value={formData.postalCode}
                      onChange={(e) => setFormData({...formData, postalCode: e.target.value})}
                      placeholder="10XXX"
                      className="w-full p-3.5 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-pink-200 outline-none text-sm"
                    />
                  </div>
                </div>
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

export default UserProfileEdit;