"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Clock, Scissors, QrCode, Trash2, AlertCircle, CheckCircle2, DollarSign, PawPrint } from 'lucide-react';
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
  pending: { label: 'รอพิจารณา', color: 'text-amber-500', bg: 'bg-amber-50' },
  confirmed: { label: 'ยืนยันแล้ว', color: 'text-emerald-500', bg: 'bg-emerald-50' },
  completed: { label: 'เสร็จสิ้น', color: 'text-blue-500', bg: 'bg-blue-50' },
  cancelled: { label: 'ยกเลิก', color: 'text-red-500', bg: 'bg-red-50' },
};

const AppointmentDetailModal = ({ isOpen, onClose, appointment, onDelete }: AppointmentDetailModalProps) => {
  if (!appointment) return null;

  const config = statusConfig[appointment.status];
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
            className="relative w-full max-w-[390px] bg-white rounded-t-[3.5rem] shadow-2xl max-h-[90vh] overflow-y-auto no-scrollbar"
          >
            {/* Header */}
            <div className="pt-8 pb-4 px-8 flex justify-between items-center sticky top-0 bg-white z-10 rounded-t-[3.5rem]">
              <h3 className="font-black text-xl text-slate-800 uppercase tracking-tight">รายละเอียดการจอง</h3>
              <button 
                onClick={onClose} 
                className="p-2 bg-slate-100 rounded-full text-slate-400 active:scale-90 transition-transform border border-slate-200"
              >
                <X size={20} />
              </button>
            </div>

            <div className="px-8 pb-12 space-y-6">
              {/* 1. QR Code Section */}
              <div className="flex flex-col items-center py-2">
                <div className="p-3 bg-white rounded-2xl border-2 border-slate-100 mb-2">
                  <QrCode size={110} className="text-slate-800" />
                </div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Booking ID: {appointment.id.split('-')[0].toUpperCase()}</p>
                <p className="text-[9px] font-bold text-pink-500 mt-1">แสดง QR เพื่อเช็คอินรับบริการ</p>
              </div>

              {/* 2. Pet & Status Section */}
              <div className="flex flex-col items-center py-0 gap-3  border-t border-slate-50">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full border-[4px] border-white shadow-lg overflow-hidden bg-slate-100">
                    <img 
                      src={appointment.petImage || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix'} 
                      alt={appointment.petName} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className={`absolute -bottom-1 -right-1 p-1.5 rounded-full border-2 border-white shadow-sm ${config.bg} ${config.color}`}>
                    {appointment.status === 'confirmed' ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
                  </div>
                </div>
                
                <div className="text-center">
                  <h4 className="text-lg font-black text-slate-800">น้อง{appointment.petName}</h4>
                  <p className="text-[12px] font-bold text-slate-500 uppercase tracking-tight">{appointment.petBreed || 'ไม่ระบุสายพันธุ์'}</p>
                </div>

                <div className={`px-4 py-1.5 rounded-full border-2 border-slate-800/10 ${config.bg} ${config.color} font-black text-[10px] uppercase tracking-widest`}>
                  {config.label}
                </div>
              </div>

              {/* 3. Full Details List with Shadow Soft */}
              <div className="space-y-5">
                <h5 className="text-lg font-black text-slate-900 uppercase px-1">ข้อมูลนัดหมาย</h5>
                
                <div className="bg-white rounded-[2rem] border-2 border-slate-800 shadow-soft overflow-hidden">
                  <div className="p-4 flex items-center gap-4 border-b border-slate-100">
                    <div className="w-10 h-10 bg-pink-50 rounded-xl flex items-center justify-center text-pink-500 shrink-0">
                      <Scissors size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">บริการที่เลือก</p>
                      <p className="text-sm font-black text-slate-800">{appointment.service}</p>
                    </div>
                  </div>

                  <div className="p-4 flex items-center gap-4 border-b border-slate-100">
                    <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-500 shrink-0">
                      <Calendar size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">วันที่นัดหมาย</p>
                      <p className="text-sm font-black text-slate-800">{format(date, 'd MMMM yyyy', { locale: th })}</p>
                    </div>
                  </div>

                  <div className="p-4 flex items-center gap-4 border-b border-slate-100">
                    <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-500 shrink-0">
                      <Clock size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">เวลาที่จองไว้</p>
                      <p className="text-sm font-black text-slate-800">{format(date, 'HH:mm')} น.</p>
                    </div>
                  </div>

                  <div className="p-4 flex items-center gap-4">
                    <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-500 shrink-0">
                      <DollarSign size={20} />
                    </div>
                    <div className="flex-1 flex justify-between items-center">
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase">ราคาประเมิน</p>
                        <p className="text-sm font-black text-slate-800">฿{appointment.servicePrice || 0}</p>
                      </div>
                      <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100 uppercase">จ่ายที่ร้าน</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notes with Shadow Soft */}
              {appointment.notes && (
                <div className="space-y-2">
                  <h5 className="text-sm font-black text-slate-900 uppercase px-1">หมายเหตุเพิ่มเติม</h5>
                  <div className="bg-white p-5 rounded-3xl border-2 border-slate-800 shadow-soft italic">
                    <p className="text-xs font-bold text-slate-600 leading-relaxed">"{appointment.notes}"</p>
                  </div>
                </div>
              )}

              {/* Danger Zone */}
              {appointment.status !== 'completed' && appointment.status !== 'cancelled' && (
                <div className="pt-4">
                  <button 
                    onClick={() => {
                      if (window.confirm(`ยืนยันการยกเลิกนัดหมายของน้อง${appointment.petName} ใช่หรือไม่?`)) {
                        onDelete(appointment.id);
                        onClose();
                      }
                    }}
                    className="w-full py-4 flex items-center justify-center gap-2 bg-red-50 text-red-500 font-black rounded-2xl border-2 border-slate-800 shadow-soft active:translate-y-0.5 active:shadow-none transition-all text-sm"
                  >
                    <Trash2 size={18} strokeWidth={3} />
                    ยกเลิกการจองนัดหมายนี้
                  </button>
                  <p className="text-xs text-center text-slate-900 font-bold mt-4 leading-tight">
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