"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Clock, Scissors, QrCode, Trash2, CheckCircle2, DollarSign, AlertTriangle, Sparkles } from 'lucide-react';
import { format } from 'date-fns';
import { th } from 'date-fns/locale';

interface Appointment {
  id: string;
  petName: string;
  petImage?: string;
  petBreed?: string;
  service: string;
  servicePrice?: number;
  startTime: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
}

interface AppointmentDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: Appointment | null;
  onDelete: (id: string) => void;
}

const statusConfig = {
  pending: { 
    label: 'รอพิจารณา', 
    color: 'text-amber-600 bg-amber-50 border-amber-100/50',
    glow: 'shadow-[0_0_12px_rgba(217,119,6,0.15)]'
  },
  confirmed: { 
    label: 'ยืนยันแล้ว', 
    color: 'text-emerald-600 bg-emerald-50 border-emerald-100/50',
    glow: 'shadow-[0_0_12px_rgba(16,185,129,0.15)]'
  },
  completed: { 
    label: 'เสร็จสิ้น', 
    color: 'text-blue-600 bg-blue-50 border-blue-100/50',
    glow: 'shadow-[0_0_12px_rgba(59,130,246,0.15)]'
  },
  cancelled: { 
    label: 'ยกเลิก', 
    color: 'text-rose-600 bg-rose-50 border-rose-100/50',
    glow: 'shadow-[0_0_12px_rgba(239,68,68,0.15)]'
  },
};

const AppointmentDetailModal = ({ isOpen, onClose, appointment, onDelete }: AppointmentDetailModalProps) => {
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  if (!appointment) return null;

  const config = statusConfig[appointment.status] || statusConfig.pending;
  const date = new Date(appointment.startTime);

  const handleConfirmCancel = () => {
    onDelete(appointment.id);
    setShowCancelConfirm(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-end justify-center">
          {/* Premium Backdrop Blur */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
          />
          
          {/* Bottom Sheet Container */}
          <motion.div 
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="relative w-full bg-white rounded-t-[3.5rem] shadow-2xl max-h-[92vh] overflow-y-auto no-scrollbar flex flex-col border-t border-white/20"
          >
            {/* Drag Handle Indicator */}
            <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mt-4 shrink-0" />

            {/* Header */}
            <div className="pt-4 pb-4 px-8 flex justify-between items-center sticky top-0 bg-white/90 backdrop-blur-md z-10">
              <div>
                <h3 className="font-black text-2xl text-[#020d35] tracking-tight">รายละเอียดการจอง</h3>
                <p className="text-[10px] font-black text-surface-variant opacity-40 uppercase tracking-[0.2em] mt-0.5">Booking Details</p>
              </div>
              <button 
                onClick={onClose} 
                className="p-2.5 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-400 hover:text-slate-600 active:scale-90 transition-all"
              >
                <X size={18} strokeWidth={2.5} />
              </button>
            </div>

            <div className="px-8 pb-12 space-y-8 overflow-y-auto no-scrollbar flex-1">
              
              {/* Premium Ticket-Style QR Code Section */}
              <div className="relative bg-gradient-to-br from-slate-50 to-slate-100/50 rounded-[2.5rem] p-6 border border-slate-100 shadow-sm overflow-hidden flex flex-col items-center">
                {/* Decorative Ticket Cutouts */}
                <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full border-r border-slate-100" />
                <div className="absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full border-l border-slate-100" />
                
                {/* Glowing Background Blob */}
                <div className="absolute -right-10 -top-10 w-32 h-32 bg-tertiary/10 rounded-full blur-2xl pointer-events-none" />
                
                <div className="relative p-5 bg-white rounded-3xl shadow-ambient border border-slate-50 mb-4 group">
                  {/* Decorative corners */}
                  <div className="absolute top-3 left-3 w-5 h-5 border-t-4 border-l-4 border-pink-500 rounded-tl-md" />
                  <div className="absolute top-3 right-3 w-5 h-5 border-t-4 border-r-4 border-pink-500 rounded-tr-md" />
                  <div className="absolute bottom-3 left-3 w-5 h-5 border-b-4 border-l-4 border-pink-500 rounded-bl-md" />
                  <div className="absolute bottom-3 right-3 w-5 h-5 border-b-4 border-r-4 border-pink-500 rounded-br-md" />
                  
                  <div className="p-1 bg-white rounded-xl">
                    <QrCode size={110} className="text-[#020d35]" />
                  </div>
                </div>
                
                <div className="text-center space-y-1 relative z-10">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">
                    Booking ID: {appointment.id.split('-')[0].toUpperCase()}
                  </p>
                  <p className="text-xs font-black text-pink-500 flex items-center gap-1 justify-center">
                    <Sparkles size={12} className="animate-pulse" /> แสดง QR เพื่อเช็คอินรับบริการ
                  </p>
                </div>
              </div>

              {/* Pet & Status Section */}
              <div className="flex items-center gap-4 p-5 bg-white rounded-[2.5rem] border border-black/5 shadow-ambient">
                <div className="relative shrink-0">
                  <div className="absolute inset-0 bg-tertiary/15 rounded-full blur-xl scale-110" />
                  <div className="relative w-16 h-16 rounded-full border-2 border-white shadow-sm overflow-hidden bg-slate-100">
                    <img 
                      src={appointment.petImage || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix'} 
                      alt={appointment.petName} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <h4 className="text-lg font-black text-[#020d35] truncate">น้อง{appointment.petName}</h4>
                  <p className="text-xs font-bold text-slate-400 truncate uppercase tracking-tight">
                    {appointment.petBreed || 'ไม่ระบุสายพันธุ์'}
                  </p>
                </div>

                <div className={`px-4 py-1.5 rounded-full border ${config.color} ${config.glow} font-black text-[10px] uppercase tracking-widest shrink-0`}>
                  {config.label}
                </div>
              </div>

              {/* Details List */}
              <div className="space-y-4">
                <h5 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] px-1">ข้อมูลนัดหมาย</h5>
                
                <div className="bg-white rounded-[2.5rem] border border-black/5 shadow-ambient overflow-hidden divide-y divide-slate-50">
                  <div className="p-5 flex items-center gap-4">
                    <div className="w-10 h-10 bg-pink-50 rounded-xl flex items-center justify-center text-pink-500 shrink-0">
                      <Scissors size={18} strokeWidth={2.5} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">บริการที่เลือก</p>
                      <p className="text-sm font-black text-[#020d35] mt-0.5">{appointment.service}</p>
                    </div>
                  </div>

                  <div className="p-5 flex items-center gap-4">
                    <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-500 shrink-0">
                      <Calendar size={18} strokeWidth={2.5} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">วันที่นัดหมาย</p>
                      <p className="text-sm font-black text-[#020d35] mt-0.5">{format(date, 'd MMMM yyyy', { locale: th })}</p>
                    </div>
                  </div>

                  <div className="p-5 flex items-center gap-4">
                    <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-500 shrink-0">
                      <Clock size={18} strokeWidth={2.5} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">เวลาที่จองไว้</p>
                      <p className="text-sm font-black text-[#020d35] mt-0.5">{format(date, 'HH:mm')} น.</p>
                    </div>
                  </div>

                  <div className="p-5 flex items-center gap-4">
                    <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-500 shrink-0">
                      <DollarSign size={18} strokeWidth={2.5} />
                    </div>
                    <div className="flex-1 flex justify-between items-center">
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">ราคาประเมิน</p>
                        <p className="text-sm font-black text-[#020d35] mt-0.5">฿{appointment.servicePrice || 0}</p>
                      </div>
                      <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100 uppercase tracking-wider">
                        จ่ายที่ร้าน
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {appointment.notes && (
                <div className="space-y-3">
                  <h5 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] px-1">หมายเหตุเพิ่มเติม</h5>
                  <div className="bg-slate-50 p-5 rounded-[2rem] border border-slate-100 relative overflow-hidden">
                    <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-pink-500" />
                    <p className="text-xs font-bold text-slate-600 leading-relaxed pl-2">
                      "{appointment.notes}"
                    </p>
                  </div>
                </div>
              )}

              {/* Danger Zone */}
              {appointment.status !== 'completed' && appointment.status !== 'cancelled' && (
                <div className="pt-4 space-y-4">
                  <button 
                    onClick={() => setShowCancelConfirm(true)}
                    className="w-full py-4 flex items-center justify-center gap-2 bg-rose-50 hover:bg-rose-100 text-rose-600 font-black rounded-2xl border border-rose-100 shadow-sm active:scale-95 transition-all text-xs uppercase tracking-widest"
                  >
                    <Trash2 size={16} strokeWidth={3} />
                    ยกเลิกการจองนัดหมายนี้
                  </button>
                  <p className="text-[10px] text-center text-slate-400 font-bold leading-tight">
                    * กรุณายกเลิกก่อนเวลานัดหมายอย่างน้อย 2 ชม.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}

      {/* Custom Confirmation Modal for Cancellation */}
      <AnimatePresence>
        {showCancelConfirm && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center px-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCancelConfirm(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
            />
            <motion.div 
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              className="relative w-full max-w-[320px] bg-white rounded-[2.5rem] shadow-2xl p-8 text-center border border-black/5 z-[160]"
            >
              <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertTriangle size={40} className="text-rose-500" />
              </div>
              <h3 className="text-xl font-black text-[#020d35] mb-2 tracking-tight">ยืนยันการยกเลิก?</h3>
              <p className="text-xs font-medium text-slate-500 mb-8 leading-relaxed">
                คุณต้องการยกเลิกการจองนัดหมายของ <br/>
                <span className="font-black text-[#020d35]">น้อง{appointment.petName}</span> ใช่หรือไม่?
              </p>
              <div className="space-y-3">
                <button 
                  onClick={handleConfirmCancel}
                  className="w-full py-4 bg-rose-500 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg shadow-rose-500/10 active:scale-95 transition-all"
                >
                  ยืนยันการยกเลิก
                </button>
                <button 
                  onClick={() => setShowCancelConfirm(false)}
                  className="w-full py-4 bg-slate-100 text-[#020d35] rounded-2xl font-black uppercase tracking-widest text-xs active:scale-95 transition-all"
                >
                  เก็บนัดหมายไว้
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </AnimatePresence>
  );
};

export default AppointmentDetailModal;