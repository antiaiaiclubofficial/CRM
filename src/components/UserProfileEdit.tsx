"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Phone, MapPin, Mail, Check, Home, Sparkles } from 'lucide-react';
import { searchAddressByDistrict, searchAddressByAmphoe, searchAddressByProvince, searchAddressByZipcode } from 'thai-address-database';

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
  
  // Thai Address Auto-suggest state
  const [suggestions, setSuggestions] = React.useState<any[]>([]);
  const [activeField, setActiveField] = React.useState<string | null>(null);

  const handleAddressChange = (field: 'subDistrict' | 'district' | 'province' | 'postalCode', value: string) => {
    setFormData({ ...formData, [field]: value });
    
    if (!value) {
      setSuggestions([]);
      return;
    }

    let results = [];
    if (field === 'subDistrict') results = searchAddressByDistrict(value);
    else if (field === 'district') results = searchAddressByAmphoe(value);
    else if (field === 'province') results = searchAddressByProvince(value);
    else if (field === 'postalCode') results = searchAddressByZipcode(value);

    setSuggestions(results.slice(0, 5)); // Limit to 5 suggestions
  };

  const handleSelectSuggestion = (suggestion: any) => {
    setFormData({
      ...formData,
      subDistrict: suggestion.district,
      district: suggestion.amphoe,
      province: suggestion.province,
      postalCode: suggestion.zipcode.toString()
    });
    setSuggestions([]);
    setActiveField(null);
  };

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
            className="relative w-full bg-[#F9F9F9] rounded-t-[3.5rem] h-[88vh] overflow-hidden shadow-ambient flex flex-col border-t border-white/40"
          >
            {/* Liquid Background Blobs inside Bottom Sheet */}
            <div className="absolute top-[-10%] left-[-20%] w-[200px] h-[200px] bg-[#FFD8E4] rounded-full blur-[60px] opacity-50 pointer-events-none" />
            <div className="absolute bottom-[10%] right-[-20%] w-[250px] h-[250px] bg-[#EAFD69] rounded-full blur-[80px] opacity-30 pointer-events-none" />
            <div className="absolute top-[40%] right-[-10%] w-[180px] h-[180px] bg-[#d9d6fe] rounded-full blur-[70px] opacity-40 pointer-events-none" />

            {/* Drag Handle Indicator */}
            <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mt-4 shrink-0 relative z-10" />

            {/* Header */}
            <div className="flex justify-between items-center shrink-0 pt-4 pb-4 px-8 z-10 relative">
              <div>
                <h3 className="font-black text-2xl text-primary tracking-tight flex items-center gap-2">
                  ข้อมูลส่วนตัว <Sparkles size={18} className="text-[#EAFD69] fill-[#EAFD69]" />
                </h3>
                <p className="text-[10px] font-black text-surface-variant opacity-40 uppercase tracking-[0.2em] mt-0.5">My Profile</p>
              </div>
              <button 
                onClick={handleSave} 
                className="p-2.5 bg-primary/5 hover:bg-primary/10 rounded-full text-primary/60 transition-all active:scale-90"
              >
                <X size={18} strokeWidth={2.5} />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 space-y-6 px-6 pb-6 overflow-y-auto no-scrollbar pt-2 relative z-10">
              
              {/* Section 1: General Info */}
              <div className="bg-white/75 backdrop-blur-2xl p-6 rounded-[2.5rem] shadow-ambient border border-white/40 space-y-5">
                <div className="flex items-center gap-2 pb-1 border-b border-pink-100">
                  <User size={16} className="text-pink-500" />
                  <h4 className="text-[10px] font-black text-pink-600 uppercase tracking-widest">ข้อมูลทั่วไป</h4>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-[#45464E] opacity-60 uppercase tracking-widest px-1">ชื่อจริง</label>
                    <input 
                      type="text" 
                      value={formData.firstName}
                      onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                      className="w-full p-4 bg-[#F3F3F3]/60 focus:bg-white rounded-2xl border-none focus:ring-2 focus:ring-pink-200 outline-none text-sm font-bold text-[#020d35] transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-[#45464E] opacity-60 uppercase tracking-widest px-1">นามสกุล</label>
                    <input 
                      type="text" 
                      value={formData.lastName}
                      onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                      className="w-full p-4 bg-[#F3F3F3]/60 focus:bg-white rounded-2xl border-none focus:ring-2 focus:ring-pink-200 outline-none text-sm font-bold text-[#020d35] transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-[#45464E] opacity-60 uppercase tracking-widest px-1">เพศ</label>
                    <select 
                      value={formData.gender}
                      onChange={(e) => setFormData({...formData, gender: e.target.value})}
                      className="w-full p-4 bg-[#F3F3F3]/60 focus:bg-white rounded-2xl border-none focus:ring-2 focus:ring-pink-200 outline-none text-sm font-bold text-[#020d35] transition-all appearance-none"
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
                      className="w-full p-4 bg-[#F3F3F3]/60 focus:bg-white rounded-2xl border-none focus:ring-2 focus:ring-pink-200 outline-none text-sm font-bold text-[#020d35] transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Contact Info */}
              <div className="bg-white/75 backdrop-blur-2xl p-6 rounded-[2.5rem] shadow-ambient border border-white/40 space-y-5">
                <div className="flex items-center gap-2 pb-1 border-b border-blue-100">
                  <Mail size={16} className="text-blue-500" />
                  <h4 className="text-[10px] font-black text-blue-600 uppercase tracking-widest">ข้อมูลการติดต่อ</h4>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-[#45464E] opacity-60 uppercase tracking-widest px-1 flex items-center gap-1">
                    <Phone size={10} className="text-blue-500" /> เบอร์โทรศัพท์
                  </label>
                  <input 
                    type="tel" 
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    placeholder="08X-XXX-XXXX"
                    className="w-full p-4 bg-[#F3F3F3]/60 focus:bg-white rounded-2xl border-none focus:ring-2 focus:ring-blue-200 outline-none text-sm font-bold text-[#020d35] transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-[#45464E] opacity-60 uppercase tracking-widest px-1">อีเมล</label>
                  <input 
                    type="email" 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="example@mail.com"
                    className="w-full p-4 bg-[#F3F3F3]/60 focus:bg-white rounded-2xl border-none focus:ring-2 focus:ring-blue-200 outline-none text-sm font-bold text-[#020d35] transition-all"
                  />
                </div>
              </div>

              {/* Section 3: Address Info */}
              <div className="bg-white/75 backdrop-blur-2xl p-6 rounded-[2.5rem] shadow-ambient border border-white/40 space-y-5">
                <div className="flex items-center gap-2 pb-1 border-b border-emerald-100">
                  <MapPin size={16} className="text-emerald-500" />
                  <h4 className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">ข้อมูลที่อยู่</h4>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-[#45464E] opacity-60 uppercase tracking-widest px-1">
                      <Home size={10} className="text-emerald-500 inline-block align-text-top mr-1" /> เลขที่บ้าน
                    </label>
                    <input 
                      type="text" 
                      value={addressParts.houseNo}
                      onChange={(e) => setAddressParts({...addressParts, houseNo: e.target.value})}
                      placeholder="เช่น 123/4"
                      className="w-full p-4 bg-[#F3F3F3]/60 focus:bg-white rounded-2xl border-none focus:ring-2 focus:ring-emerald-200 outline-none text-sm font-bold text-[#020d35] transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-[#45464E] opacity-60 uppercase tracking-widest px-1">หมู่ที่</label>
                    <input 
                      type="text" 
                      value={addressParts.moo}
                      onChange={(e) => setAddressParts({...addressParts, moo: e.target.value})}
                      placeholder="เช่น 5"
                      className="w-full p-4 bg-[#F3F3F3]/60 focus:bg-white rounded-2xl border-none focus:ring-2 focus:ring-emerald-200 outline-none text-sm font-bold text-[#020d35] transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-[#45464E] opacity-60 uppercase tracking-widest px-1">ซอย</label>
                    <input 
                      type="text" 
                      value={addressParts.soi}
                      onChange={(e) => setAddressParts({...addressParts, soi: e.target.value})}
                      placeholder="เช่น สุขุมวิท 1"
                      className="w-full p-4 bg-[#F3F3F3]/60 focus:bg-white rounded-2xl border-none focus:ring-2 focus:ring-emerald-200 outline-none text-sm font-bold text-[#020d35] transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-[#45464E] opacity-60 uppercase tracking-widest px-1">ถนน</label>
                    <input 
                      type="text" 
                      value={addressParts.road}
                      onChange={(e) => setAddressParts({...addressParts, road: e.target.value})}
                      placeholder="เช่น รามคำแหง"
                      className="w-full p-4 bg-[#F3F3F3]/60 focus:bg-white rounded-2xl border-none focus:ring-2 focus:ring-emerald-200 outline-none text-sm font-bold text-[#020d35] transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5 relative">
                    <label className="text-[10px] font-black text-[#45464E] opacity-60 uppercase tracking-widest px-1">แขวง / ตำบล</label>
                    <input 
                      type="text" 
                      value={formData.subDistrict}
                      onChange={(e) => handleAddressChange('subDistrict', e.target.value)}
                      onFocus={() => { setActiveField('subDistrict'); handleAddressChange('subDistrict', formData.subDistrict); }}
                      onBlur={() => setTimeout(() => setActiveField(null), 200)}
                      placeholder="ตำบล"
                      className="w-full p-4 bg-[#F3F3F3]/60 focus:bg-white rounded-2xl border-none focus:ring-2 focus:ring-emerald-200 outline-none text-sm font-bold text-[#020d35] transition-all"
                    />
                    <AnimatePresence>
                      {activeField === 'subDistrict' && suggestions.length > 0 && (
                        <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="absolute top-[calc(100%+4px)] left-0 right-0 bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden z-[60]">
                          {suggestions.map((s, i) => (
                            <div key={i} onClick={() => handleSelectSuggestion(s)} className="p-3 hover:bg-slate-50 cursor-pointer border-b border-slate-50 last:border-0">
                               <p className="text-xs font-bold text-[#020d35]">{s.district} » {s.amphoe} » {s.province}</p>
                               <p className="text-[10px] text-slate-400">{s.zipcode}</p>
                            </div>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  <div className="space-y-1.5 relative">
                    <label className="text-[10px] font-black text-[#45464E] opacity-60 uppercase tracking-widest px-1">เขต / อำเภอ</label>
                    <input 
                      type="text" 
                      value={formData.district}
                      onChange={(e) => handleAddressChange('district', e.target.value)}
                      onFocus={() => { setActiveField('district'); handleAddressChange('district', formData.district); }}
                      onBlur={() => setTimeout(() => setActiveField(null), 200)}
                      placeholder="อำเภอ"
                      className="w-full p-4 bg-[#F3F3F3]/60 focus:bg-white rounded-2xl border-none focus:ring-2 focus:ring-emerald-200 outline-none text-sm font-bold text-[#020d35] transition-all"
                    />
                    <AnimatePresence>
                      {activeField === 'district' && suggestions.length > 0 && (
                        <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="absolute top-[calc(100%+4px)] left-0 right-0 bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden z-[60]">
                          {suggestions.map((s, i) => (
                            <div key={i} onClick={() => handleSelectSuggestion(s)} className="p-3 hover:bg-slate-50 cursor-pointer border-b border-slate-50 last:border-0">
                               <p className="text-xs font-bold text-[#020d35]">{s.district} » {s.amphoe} » {s.province}</p>
                               <p className="text-[10px] text-slate-400">{s.zipcode}</p>
                            </div>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5 relative">
                    <label className="text-[10px] font-black text-[#45464E] opacity-60 uppercase tracking-widest px-1">จังหวัด</label>
                    <input 
                      type="text" 
                      value={formData.province}
                      onChange={(e) => handleAddressChange('province', e.target.value)}
                      onFocus={() => { setActiveField('province'); handleAddressChange('province', formData.province); }}
                      onBlur={() => setTimeout(() => setActiveField(null), 200)}
                      placeholder="จังหวัด"
                      className="w-full p-4 bg-[#F3F3F3]/60 focus:bg-white rounded-2xl border-none focus:ring-2 focus:ring-emerald-200 outline-none text-sm font-bold text-[#020d35] transition-all"
                    />
                    <AnimatePresence>
                      {activeField === 'province' && suggestions.length > 0 && (
                        <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="absolute top-[calc(100%+4px)] left-0 right-0 bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden z-[60]">
                          {suggestions.map((s, i) => (
                            <div key={i} onClick={() => handleSelectSuggestion(s)} className="p-3 hover:bg-slate-50 cursor-pointer border-b border-slate-50 last:border-0">
                               <p className="text-xs font-bold text-[#020d35]">{s.district} » {s.amphoe} » {s.province}</p>
                               <p className="text-[10px] text-slate-400">{s.zipcode}</p>
                            </div>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  <div className="space-y-1.5 relative">
                    <label className="text-[10px] font-black text-[#45464E] opacity-60 uppercase tracking-widest px-1">รหัสไปรษณีย์</label>
                    <input 
                      type="text" 
                      value={formData.postalCode}
                      onChange={(e) => handleAddressChange('postalCode', e.target.value)}
                      onFocus={() => { setActiveField('postalCode'); handleAddressChange('postalCode', formData.postalCode); }}
                      onBlur={() => setTimeout(() => setActiveField(null), 200)}
                      placeholder="10XXX"
                      className="w-full p-4 bg-[#F3F3F3]/60 focus:bg-white rounded-2xl border-none focus:ring-2 focus:ring-emerald-200 outline-none text-sm font-bold text-[#020d35] transition-all"
                    />
                    <AnimatePresence>
                      {activeField === 'postalCode' && suggestions.length > 0 && (
                        <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="absolute top-[calc(100%+4px)] right-0 w-[200%] max-w-[280px] bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden z-[60]">
                          {suggestions.map((s, i) => (
                            <div key={i} onClick={() => handleSelectSuggestion(s)} className="p-3 hover:bg-slate-50 cursor-pointer border-b border-slate-50 last:border-0">
                               <p className="text-xs font-bold text-[#020d35]">{s.district} » {s.amphoe} » {s.province}</p>
                               <p className="text-[10px] text-slate-400">{s.zipcode}</p>
                            </div>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>

            </div>

            {/* Sticky Footer for Save Button */}
            <div className="p-4 bg-white/90 backdrop-blur-2xl border-t border-slate-100/50 shrink-0 pb-[calc(1rem+env(safe-area-inset-bottom))] relative z-10">
              <button 
                onClick={handleSave}
                className="w-full py-4 bg-gradient-to-br from-[#18234a] to-[#020d35] text-white rounded-full font-black shadow-ambient active:scale-95 transition-all flex items-center justify-center gap-2 border-none text-sm uppercase tracking-widest"
              >
                <Check size={18} strokeWidth={3} className="text-[#EAFD69]" />
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