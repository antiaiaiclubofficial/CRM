"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, QrCode, Share2, Download, Copy } from 'lucide-react';

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  ownerName: string;
  memberId: string;
}

const QRCodeModal = ({ isOpen, onClose, ownerName, memberId }: QRCodeModalProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[70] flex items-end justify-center">
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
            className="relative w-full max-w-[390px] bg-white rounded-t-[3.5rem] shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="pt-8 pb-4 px-8 flex justify-between items-center">
              <h3 className="font-bold text-xl text-slate-800">QR Code สมาชิก</h3>
              <button 
                onClick={onClose} 
                className="p-2 bg-slate-100 rounded-full text-slate-400 active:scale-90 transition-transform"
              >
                <X size={20} />
              </button>
            </div>

            <div className="px-8 pb-12 flex flex-col items-center">
              {/* Profile Info */}
              <div className="text-center mb-8">
                <p className="text-sm text-slate-500 mb-1">แสดงต่อพนักงานเพื่อสะสมคะแนน</p>
                <h4 className="text-xl font-bold text-slate-800">คุณ{ownerName}</h4>
                <div className="inline-flex items-center gap-2 bg-slate-50 px-3 py-1 rounded-full border border-slate-100 mt-2">
                  <span className="text-xs font-medium text-slate-500">ID: {memberId}</span>
                  <button className="text-pink-500 hover:text-pink-600 transition-colors">
                    <Copy size={12} />
                  </button>
                </div>
              </div>

              {/* QR Code Container */}
              <div className="relative p-8 bg-white rounded-[2.5rem] shadow-2xl shadow-pink-100 border-2 border-slate-50 mb-8 group">
                {/* Decorative corners */}
                <div className="absolute top-4 left-4 w-8 h-8 border-t-4 border-l-4 border-pink-500 rounded-tl-xl" />
                <div className="absolute top-4 right-4 w-8 h-8 border-t-4 border-r-4 border-pink-500 rounded-tr-xl" />
                <div className="absolute bottom-4 left-4 w-8 h-8 border-b-4 border-l-4 border-pink-500 rounded-bl-xl" />
                <div className="absolute bottom-4 right-4 w-8 h-8 border-b-4 border-r-4 border-pink-500 rounded-br-xl" />
                
                <div className="w-48 h-48 bg-slate-50 rounded-2xl flex items-center justify-center overflow-hidden">
                  {/* Placeholder for QR Code - In a real app, this would be a generated QR */}
                  <div className="relative w-40 h-40 grid grid-cols-4 grid-rows-4 gap-1 p-1 opacity-80">
                    {[...Array(16)].map((_, i) => (
                      <div 
                        key={i} 
                        className={`rounded-sm ${Math.random() > 0.4 ? 'bg-slate-800' : 'bg-transparent'}`} 
                      />
                    ))}
                    <div className="absolute inset-0 flex items-center justify-center">
                       <div className="bg-white p-2 rounded-xl shadow-md border border-slate-100">
                          <QrCode size={32} className="text-pink-500" />
                       </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="grid grid-cols-2 gap-4 w-full">
                <button className="flex items-center justify-center gap-2 py-3.5 bg-slate-50 text-slate-700 rounded-2xl font-bold text-sm active:scale-95 transition-all">
                  <Share2 size={18} className="text-pink-500" />
                  แชร์ QR
                </button>
                <button className="flex items-center justify-center gap-2 py-3.5 bg-slate-50 text-slate-700 rounded-2xl font-bold text-sm active:scale-95 transition-all">
                  <Download size={18} className="text-pink-500" />
                  บันทึกรูป
                </button>
              </div>
            </div>

            {/* Bottom Decoration */}
            <div className="h-2 w-20 bg-slate-200 rounded-full mx-auto mb-4" />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default QRCodeModal;