"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Phone, MapPin, Mail, Calendar, Check } from 'lucide-react';

interface OwnerProfile {
  firstName: string;
  lastName: string;
  gender: string;
  age: string;
  phone: string;
  address: string;
  email: string;
}

interface UserProfileEditProps {
  isOpen: boolean;
  onClose: () => void;
  profile: OwnerProfile;
  onSave: (updatedProfile: OwnerProfile) => void;
}

const UserProfileEdit = ({ isOpen, onClose, profile, onSave }: UserProfileEditProps) => {
  const [formData, setFormData] = React.useState(profile);

  const handleSave = () => {
    onSave(formData);
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
            {/* Improved Sticky Header */}
            <div className="flex justify-between items-center sticky top-0 bg-white pt-8 pb-4 px-8 z-10 rounded-t-[3rem]">
              <h3 className="font-bold text-xl text-slate-800">ข้อมูลส่วนตัวเจ้าของ</h3>
              <button onClick={onClose} className="p-2 bg-slate-100 rounded-full text-slate-400">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-5 px-8 pb-24"> {/* Increased bottom padding */}
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

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 px-2 flex items-center gap-1"><MapPin size={12}/> ที่อยู่</label>
                <textarea 
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-pink-200 outline-none text-base h-24 resize-none"
                  placeholder="บ้านเลขที่, ถนน, แขวง/ตำบล..."
                />
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