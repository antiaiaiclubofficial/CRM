"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, QrCode, Barcode, CheckCircle2, Info, Copy } from 'lucide-react';

interface Coupon {
  id: number;
  title: string;
  description: string;
  value: string;
  type: string;
  expiry: string;
  iconName: string;
  color: string;
  bg: string;
  conditions?: string[];
}

interface CouponUseModalProps {
  isOpen: boolean;
  onClose: () => void;
  coupon: Coupon | null;
  onConfirmUse: (couponId: number) => void;
}

const CouponUseModal = ({ isOpen, onClose, coupon, onConfirmUse }: CouponUseModalProps) => {
  if (!coupon) return null;

  const couponCode = "PET-" + Math.random().toString(36).substring(2, 8).toUpperCase();

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
            className="relative w-full max-w-[390px] bg-white rounded-t-[3.5rem] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
          >
            {/* Improved Sticky Header */}
            <div className="shrink-0 pt-8 pb-4 px-8 flex justify-between items-center bg-white border-b border-slate-50 sticky top-0 z-30">
              <h3 className="font-bold text-xl text-slate-800">ใช้คูปองส่วนลด</h3>
              <button 
                onClick={onClose} 
                className="p-2 bg-slate-100 rounded-full text-slate-400 active:scale-90 transition-all hover:bg-slate-200"
              >
                <X size={20} />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto no-scrollbar px-8 pb-10 pt-6">
              {/* Coupon Info Preview */}
              <div className="bg-pink-50 p-6 rounded-3xl border-2 border-dashed border-pink-200 mb-8 text-center relative overflow-hidden">
                <div className="absolute -top-4 -left-4 w-10 h-10 bg-white rounded-full" />
                <div className="absolute -top-4 -right-4 w-10 h-10 bg-white rounded-full" />
                <div className="absolute -bottom-4 -left-4 w-10 h-10 bg-white rounded-full" />
                <div className="absolute -bottom-4 -right-4 w-10 h-10 bg-white rounded-full" />
                
                <h4 className="text-2xl font-black text-pink-600 mb-1">{coupon.title}</h4>
                <p className="text-sm text-pink-500 font-medium">{coupon.description}</p>
                <p className="text-[10px] text-slate-400 mt-2 uppercase tracking-widest">Valid until {coupon.expiry}</p>
              </div>

              {/* QR & Barcode Section */}
              <div className="space-y-6 mb-8">
                <div className="flex flex-col items-center">
                  <div className="p-4 bg-white border-2 border-slate-100 rounded-3xl shadow-sm mb-4">
                    <QrCode size={120} className="text-slate-800" />
                  </div>
                  <div className="w-full h-16 bg-slate-50 rounded-2xl flex flex-col items-center justify-center border border-slate-100 relative overflow-hidden">
                    <Barcode size={180} className="text-slate-400 opacity-40 absolute" />
                    <span className="relative z-10 font-mono text-lg font-bold tracking-widest text-slate-800">{couponCode}</span>
                  </div>
                  <button className="flex items-center gap-1 text-[10px] font-bold text-pink-500 mt-2 hover:underline">
                    <Copy size={12} /> คัดลอกรหัส
                  </button>
                </div>
              </div>

              {/* Conditions */}
              <div className="space-y-3 mb-8">
                <h5 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <Info size={16} className="text-pink-500" /> เงื่อนไขการใช้งาน
                </h5>
                <ul className="space-y-2">
                  {(coupon.conditions || [
                    "กรุณาแสดงรหัสต่อพนักงานก่อนรับบริการ",
                    "ไม่สามารถแลกเปลี่ยนเป็นเงินสดได้",
                    "สามารถใช้ได้ 1 ครั้งต่อ 1 ใบเสร็จเท่านั้น",
                    "ทางร้านขอสงวนสิทธิ์ในการเปลี่ยนแปลงเงื่อนไขโดยไม่ต้องแจ้งให้ทราบล่วงหน้า"
                  ]).map((condition, idx) => (
                    <li key={idx} className="text-xs text-slate-500 flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-pink-300 mt-1.5 shrink-0" />
                      {condition}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Confirm Action for Shop */}
              <div className="space-y-4">
                <div className="bg-amber-50 p-4 rounded-2xl border border-amber-100">
                  <p className="text-[10px] text-amber-700 font-bold text-center">
                    * สำหรับพนักงานร้านเท่านั้น: กรุณากดปุ่มด้านล่างเพื่อยืนยันการใช้สิทธิ์
                  </p>
                </div>
                <button 
                  onClick={() => onConfirmUse(coupon.id)}
                  className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <CheckCircle2 size={20} className="text-emerald-400" />
                  ยืนยันการใช้บริการ (สำหรับพนักงาน)
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CouponUseModal;