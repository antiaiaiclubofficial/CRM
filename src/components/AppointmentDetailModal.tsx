"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Clock, Scissors, QrCode, Trash2, CheckCircle2, DollarSign, AlertCircle } from 'lucide-react';
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
  pending: { label: 'รอพิจารณา', color: 'text-amber-600 bg-amber-50 border-amber-100' },
  confirmed: { label: 'ยืนยันแล้ว', color: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
  completed: { label: 'เสร็จสิ้น', color: 'text-blue-600 bg-blue-50 border-blue-100' },
  cancelled: { label: 'ยกเลิก', color: 'text-rose-600 bg-rose-50 border-rose-100' },
};

const AppointmentDetailModal = ({ isOpen, onClose, appointment, onDelete }: AppointmentDetailModalProps) => {
  if (!appointment) return null;

  const config = statusConfig[appointment.status] || statusConfig.pending;
  const date = new Date(appointment.startTime);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-end justify-center">
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
            className="relative w-full max-w-[390px] bg-white rounded-t-[3.5rem] shadow-2xl max-h-[90vh] overflow-y-auto no-scrollbar flex flex-col"
          >
            {/* Header */}
            <div className="pt-8 pb-4 px-8 flex justify-between items-center sticky top-0 bg-white z-10 rounded-t-[3.5rem]">
              <div>
                <h3 className="font-black text-xl text-[#020d35] tracking-tight">รายละเอียดการจอง</h3>
                <p className="text-[10px] font-bold text-[#45464E] opacity-50 uppercase tracking-widest">Booking Details</p>
              </div>
              <button 
                onClick={onClose} 
                className="p-2 bg-[#F3F3F3] rounded-full text-[#45464E]/60 active:scale-90 transition-transform"
              >
                <X size={20} />
              </button>
            </div>

            <div className="px-8 pb-12 space-y-6 overflow-y-auto no-scrollbar flex-1">
              {/* QR Code Section */}
              <div className="flex flex-col items-center py-2">
                <div className="relative p-6 bg-white rounded-[2.5rem] shadow-ambient border border-slate-100 mb-3 group">
                  {/* Decorative corners */}
                  <div className="absolute top-4 left-4 w-6 h-6 border-t-4 border-l-4 border-pink-500 rounded-tl-lg" />
                  <div className="absolute top-4 right-4 w-6 h-6 border-t-4 border-r-4 border-pink-500 rounded-tr-lg" />
                  <div className="absolute bottom-4 left-4 w-6 h-6 border-b-4 border-l-4 border-pink-500 rounded-bl-lg" />
                  <div className="absolute bottom-4 right-4 w-6 h-6 border-b-4 border-r-4 border-pink-500 rounded-br-lg" />
                  
                  <div className="p-2 bg-slate-50 rounded-2xl">
                    <QrCode size={120} className="text-[#020d35]" />
                  </div>
                </div>
                <p className="text-[10px] font-black text-[#45464E] opacity-40 uppercase tracking-widest">Booking ID: {appointment.id.split('-')[0].toUpperCase()}</p>
                <p className="text-[10px] font-bold text-pink-500 mt-1">แสดง QR เพื่อเช็คอินรับบริการ</p>
              </div>

              {/* Pet & Status Section */}
              <div className="flex flex-col items-center gap-3 pt-4 border-t border-slate-50">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full border-4 border-white shadow-ambient overflow-hidden bg-slate-100">
                    <img 
                      src={appointment.petImage || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix'} 
                      alt={appointment.petName} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                
                <div className="text-center">
                  <h4 className="text-lg font-black text-[#020d35]">น้อง{appointment.petName}</h4>
                  <p className="text-xs font-bold text-[#45464E] opacity-60 uppercase tracking-tight">{appointment.petBreed || 'ไม่ระบุสายพันธุ์'}</p>
                </div>

                <div className={`px-4 py-1.5 rounded-full border ${config.color} font-black text-[10px] uppercase tracking-widest`}>
                  {config.label}
                </div>
              </div>

              {/* Details List */}
              <div className="space-y-4">
                <h5 className="text-sm font-black text-[#020d35] uppercase tracking-wider px-1">ข้อมูลนัดหมาย</h5>
                
                <div className="bg-white rounded-[2.5rem] border border-black/5 shadow-ambient overflow-hidden">
                  <div className="p-5 flex items-center gap-4 border-b border-slate-50">
                    <div className="w-10 h-10 bg-pink-50 rounded-xl flex items-center justify-center text-pink-500 shrink-0">
                      <Scissors size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-[#45464E] opacity-50 uppercase">บริการที่เลือก</p>
                      <p className="text-sm font-black text-[#020d35]">{appointment.service}</p>
                    </div>
                  </div>

                  <div className="p-5 flex items-center gap-4 border-b border-slate-50">
                    <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-500 shrink-0">
                      <Calendar size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-[#45464E] opacity-50 uppercase">วันที่นัดหมาย</p>
                      <p className="text-sm font-black text-[#020d35]">{format(date, 'd MMMM yyyy', { locale: th })}</p>
                    </div>
                  </div>

                  <div className="p-5 flex items-center gap-4 border-b border-slate-50">
                    <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-500 shrink-0">
                      <Clock size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-[#45464E] opacity-50 uppercase">เวลาที่จองไว้</p>
                      <p className="text-sm font-black text-[#020d35]">{format(date, 'HH:mm')} น.</p>
                    </div>
                  </div>

                  <div className="p-5 flex items-center gap-4">
                    <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-500 shrink-0">
                      <DollarSign size={20} />
                    </div>
                    <div className="flex-1 flex justify-between items-center">
                      <div>
                        <p className="text-[10px] font-bold text-[#45464E] opacity-50 uppercase">ราคาประเมิน</p>
                        <p className="text-sm font-black text-[#020d35]">฿{appointment.servicePrice || 0}</p>
                      </div>
                      <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100 uppercase">จ่ายที่ร้าน</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {appointment.notes && (
                <div className="space-y-2">
                  <h5 className="text-sm font-black text-[#020d35] uppercase tracking-wider px-1">หมายเหตุเพิ่มเติม</h5>
                  <div className="bg-[#F3F3F3] p-5 rounded-[2rem] italic">
                    <p className="text-xs font-bold text-[#45464E] leading-relaxed">"{appointment.notes}"</p>
                  </div>
                </div>
              )}

              {/* Danger Zone */}
              {appointment.status !== 'completed' && appointment.status !== 'cancelled' && (
                <div className="pt-4 space-y-4">
                  <button 
                    onClick={() => {
                      if (window.confirm(`ยืนยันการยกเลิกนัดหมายของน้อง${appointment.petName} ใช่หรือไม่?`)) {
                        onDelete(appointment.id);
                        onClose();
                      }
                    }}
                    className="w-full py-4 flex items-center justify-center gap-2 bg-rose-50 text-rose-600 font-black rounded-2xl border border-rose-100 shadow-sm active:scale-95 transition-all text-sm"
                  >
                    <Trash2 size={18} strokeWidth={3} />
                    ยกเลิกการจองนัดหมายนี้
                  </button>
                  <p className="text-[10px] text-center text-[#45464E] opacity-60 font-bold leading-tight">
                    * กรุณายกเลิกก่อนเวลานัดหมายอย่างน้อย 2 ชม.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AppointmentDetailModal;