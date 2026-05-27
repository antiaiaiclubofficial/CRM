"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, Calendar, Info, Sparkles, Play, History, Award } from 'lucide-react';

interface PackageUsage {
  id: string;
  used_at: string;
  notes?: string;
}

interface CustomerPackage {
  id: string;
  title: string;
  description: string;
  total_sessions: number;
  remaining_sessions: number;
  status: string;
  expires_at?: string;
  usage_history?: PackageUsage[];
}

interface PackageUseModalProps {
  isOpen: boolean;
  onClose: () => void;
  customerPackage: CustomerPackage | null;
  onConfirmUse: (packageId: string) => Promise<void>;
}

const PackageUseModal = ({ isOpen, onClose, customerPackage, onConfirmUse }: PackageUseModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!customerPackage) return null;

  const handleUseSession = async () => {
    setIsSubmitting(true);
    try {
      await onConfirmUse(customerPackage.id);
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const progressPercentage = (customerPackage.remaining_sessions / customerPackage.total_sessions) * 100;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[80] flex items-end justify-center">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
          />
          <motion.div 
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="relative w-full max-w-[390px] bg-white rounded-t-[3.5rem] shadow-2xl max-h-[90vh] flex flex-col"
          >
            {/* Header */}
            <div className="pt-8 pb-4 px-8 flex justify-between items-center bg-white rounded-t-[3.5rem] shrink-0">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-0.5">Package Manager</p>
                <h3 className="font-bold text-xl text-slate-800">รายละเอียดแพ็คเกจ</h3>
              </div>
              <button 
                onClick={onClose} 
                className="p-2 bg-slate-100 rounded-full text-slate-400 active:scale-90 transition-transform"
              >
                <X size={20} />
              </button>
            </div>

            <div className="px-8 pb-10 overflow-y-auto no-scrollbar flex-1 space-y-6">
              {/* Package Card Preview */}
              <div className="bg-gradient-to-br from-[#18234a] to-[#020d35] p-6 rounded-3xl text-white relative overflow-hidden shadow-lg">
                <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-[#EAFD69]/10 rounded-full blur-2xl" />
                
                <div className="relative z-10 space-y-4">
                  <div>
                    <span className="text-[9px] font-black text-[#020d35] bg-[#EAFD69] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                      ACTIVE PACKAGE
                    </span>
                    <h4 className="text-lg font-black mt-2 leading-tight">{customerPackage.title}</h4>
                    <p className="text-xs text-white/60 mt-1">{customerPackage.description}</p>
                  </div>

                  <div className="bg-white/10 p-4 rounded-2xl border border-white/10">
                    <div className="flex justify-between items-end mb-2">
                      <span className="text-xs text-white/60 font-bold">จำนวนสิทธิ์คงเหลือ</span>
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-black text-[#EAFD69]">{customerPackage.remaining_sessions}</span>
                        <span className="text-xs text-white/40">/ {customerPackage.total_sessions} ครั้ง</span>
                      </div>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${progressPercentage}%` }}
                        className="bg-[#EAFD69] h-full rounded-full"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Usage History */}
              <div className="space-y-3">
                <h5 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <History size={16} className="text-pink-500" /> ประวัติการใช้งานแพ็คเกจ
                </h5>
                
                {customerPackage.usage_history && customerPackage.usage_history.length > 0 ? (
                  <div className="space-y-2 max-h-40 overflow-y-auto no-scrollbar pr-1">
                    {customerPackage.usage_history.map((usage, idx) => (
                      <div key={usage.id} className="flex justify-between items-center bg-slate-50 p-3 rounded-2xl border border-slate-100">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 bg-pink-50 rounded-lg flex items-center justify-center text-pink-500">
                            <Calendar size={14} />
                          </div>
                          <span className="text-xs font-bold text-slate-700">
                            ครั้งที่ {customerPackage.usage_history!.length - idx}
                          </span>
                        </div>
                        <span className="text-[10px] font-bold text-slate-400">
                          {new Date(usage.used_at).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: '2-digit', hour: '2-digit', minute: '2-digit' })} น.
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                    <p className="text-xs font-bold text-slate-400">ยังไม่มีประวัติการใช้งานแพ็คเกจนี้ค่ะ</p>
                  </div>
                )}
              </div>

              {/* Conditions */}
              <div className="space-y-3">
                <h5 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <Info size={16} className="text-pink-500" /> เงื่อนไขการใช้งานแพ็คเกจ
                </h5>
                <ul className="space-y-1.5">
                  <li className="text-xs text-slate-500 flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-pink-300 mt-1.5 shrink-0" />
                    กรุณาแจ้งพนักงานก่อนรับบริการเพื่อหักสิทธิ์ในระบบ
                  </li>
                  <li className="text-xs text-slate-500 flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-pink-300 mt-1.5 shrink-0" />
                    สิทธิ์ในแพ็คเกจไม่สามารถแลกเปลี่ยนเป็นเงินสดได้
                  </li>
                  {customerPackage.expires_at && (
                    <li className="text-xs text-slate-500 flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-pink-300 mt-1.5 shrink-0" />
                      แพ็คเกจหมดอายุวันที่ {new Date(customerPackage.expires_at).toLocaleDateString('th-TH', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </li>
                  )}
                </ul>
              </div>

              {/* Confirm Action */}
              <div className="space-y-4 pt-2">
                <div className="bg-amber-50 p-4 rounded-2xl border border-amber-100">
                  <p className="text-[10px] text-amber-700 font-bold text-center">
                    * สำหรับพนักงานร้านเท่านั้น: กรุณากดปุ่มด้านล่างเพื่อยืนยันการหักสิทธิ์บริการ 1 ครั้ง
                  </p>
                </div>
                <button 
                  onClick={handleUseSession}
                  disabled={isSubmitting || customerPackage.remaining_sessions <= 0}
                  className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <CheckCircle2 size={20} className="text-emerald-400" />
                  {isSubmitting ? 'กำลังบันทึก...' : 'ยืนยันการใช้บริการ (หัก 1 สิทธิ์)'}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default PackageUseModal;