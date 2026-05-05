"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Scissors, Bath, ChevronRight, AlertCircle, CheckCircle2, XCircle, Timer } from 'lucide-react';

interface Appointment {
  id: string;
  petName: string;
  service: string;
  startTime: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
}

interface AppointmentListProps {
  appointments: Appointment[];
  onAddClick: () => void;
}

const statusConfig = {
  pending: { label: 'รอพิจารณา', icon: <Timer size={12} />, color: 'text-amber-500', bg: 'bg-amber-50' },
  confirmed: { label: 'ยืนยันแล้ว', icon: <CheckCircle2 size={12} />, color: 'text-emerald-500', bg: 'bg-emerald-50' },
  completed: { label: 'เสร็จสิ้น', icon: <CheckCircle2 size={12} />, color: 'text-blue-500', bg: 'bg-blue-50' },
  cancelled: { label: 'ยกเลิก', icon: <XCircle size={12} />, color: 'text-red-500', bg: 'bg-red-50' },
};

const AppointmentList = ({ appointments, onAddClick }: AppointmentListProps) => {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('th-TH', { 
      day: 'numeric', 
      month: 'short', 
      year: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }) + ' น.';
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex justify-between items-center px-1">
        <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">นัดหมายของฉัน</h2>
        <button 
          onClick={onAddClick}
          className="bg-pink-500 text-white text-xs font-black px-5 py-2.5 rounded-2xl border-2 border-slate-800 shadow-soft active:translate-y-0.5 active:shadow-none transition-all"
        >
          จองนัดหมาย
        </button>
      </div>

      <div className="space-y-4">
        {appointments.length > 0 ? (
          appointments.map((apt, index) => {
            const config = statusConfig[apt.status];
            return (
              <motion.div
                key={apt.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-5 rounded-[2.5rem] border-2 border-slate-800 shadow-soft relative overflow-hidden"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 bg-slate-50 border-2 border-slate-800 rounded-2xl flex items-center justify-center text-xl shrink-0`}>
                    <Calendar className="text-slate-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full border border-slate-800/10 flex items-center gap-1 ${config.bg} ${config.color}`}>
                        {config.icon} {config.label}
                      </span>
                    </div>
                    <h4 className="font-black text-slate-800 text-sm mb-0.5 truncate">น้อง{apt.petName}</h4>
                    <p className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1">
                      <Clock size={10} /> {formatDate(apt.startTime)}
                    </p>
                  </div>
                  <div className="p-2 border-2 border-slate-800 rounded-xl shrink-0">
                    <ChevronRight size={16} strokeWidth={3} />
                  </div>
                </div>
              </motion.div>
            );
          })
        ) : (
          <div className="text-center py-20 border-2 border-dashed border-slate-300 rounded-[2.5rem] bg-white/50">
            <Calendar size={48} className="mx-auto text-slate-200 mb-4" />
            <p className="text-sm font-black text-slate-400 uppercase">ยังไม่มีรายการนัดหมาย</p>
            <button 
              onClick={onAddClick}
              className="mt-4 text-pink-500 font-black text-xs underline underline-offset-4"
            >
              จองนัดหมายครั้งแรกได้ที่นี่ ✨
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentList;