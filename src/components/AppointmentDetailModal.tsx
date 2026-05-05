"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Clock, Scissors, QrCode, Trash2, AlertCircle, MapPin, CheckCircle2 } from 'lucide-react';
import { format } from 'date-fns';
import { th } from 'date-fns/locale';

interface Appointment {
  id: string;
  petName: string;
  service: string;
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
              <h3 className="font-black text-xl text-slate-800">รายละเอียดนัดหมาย</h3>
              <button 
                onClick={onClose} 
                className="p-2 bg-slate-100 rounded-full text-slate-400 active:scale-90 transition-transform"
              >
                <X size={20} />
              </button>
            </div>

            <div className="px-8 pb-12 space-y-8">
              {/* Status Banner */}
              <div className={`flex items-center justify-center gap-2 py-3 px-4 rounded-2xl border-2 border-slate-800 ${config.bg} ${config.color} font-black text-sm uppercase`}>
                {appointment.status === 'confirmed' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                {config.label}
              </div>

              {/* QR Code Section */}
              <div className="flex flex-col items-center">
                <div className="relative p-6 bg-white rounded-[2.5rem] border-2 border-slate-800 shadow-soft mb-4">
                  <div className="w-40 h-40 flex items-center justify-center bg-slate-50 rounded-xl overflow-hidden opacity-80">
                    <QrCode size={120} className="text-slate-800" />
                  </div>
                </div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">แสดง QR Code เพื่อเช็คอินที่หน้าร้าน</p>
              </div>

              {/* Info Cards */}
              <div className="space-y-4">
                <div className="bg-slate-50 p-5 rounded-3xl border-2 border-slate-800">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-white border-2 border-slate-800 rounded-2xl flex items-center justify-center text-pink-500">
                      <Scissors size={24} />
                    </div>
                    <div>
                      <h4 className="font-black text-slate-800">{appointment.service}</h4>
                      <p className="text-xs font-bold text-slate-500">น้อง{appointment.petName}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 border-t border-slate-200 pt-4">
                    <div className="flex items-center gap-2">
                      <Calendar size={16} className="text-pink-500" />
                      <span className="text-xs font-black text-slate-800">{format(date, 'd MMM yy', { locale: th })}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock size={16} className="text-pink-500" />
                      <span className="text-xs font-black text-slate-800">{format(date, 'HH:mm')} น.</span>
                    </div>
                  </div>
                </div>

                {appointment.notes && (
                  <div className="bg-white p-4 rounded-2xl border-2 border-slate-800 shadow-sm">
                    <h5 className="text-[10px] font-black text-slate-400 uppercase mb-1">หมายเหตุ:</h5>
                    <p className="text-xs font-bold text-slate-700">{appointment.notes}</p>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="pt-4 space-y-4">
                {appointment.status !== 'completed' && appointment.status !== 'cancelled' && (
                  <button 
                    onClick={() => {
                      if (window.confirm(`ยืนยันการยกเลิกนัดหมายของน้อง${appointment.petName} ใช่หรือไม่?`)) {
                        onDelete(appointment.id);
                        onClose();
                      }
                    }}
                    className="w-full py-4 flex items-center justify-center gap-2 bg-red-50 text-red-500 font-black rounded-2xl border-2 border-slate-800 shadow-soft active:translate-y-1 active:shadow-none transition-all"
                  >
                    <Trash2 size={20} />
                    ยกเลิกการจอง
                  </button>
                )}
                
                <button 
                  onClick={onClose}
                  className="w-full py-4 bg-slate-100 text-slate-800 font-black rounded-2xl border-2 border-slate-800 active:translate-y-1 transition-all"
                >
                  ปิดหน้าต่าง
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AppointmentDetailModal;