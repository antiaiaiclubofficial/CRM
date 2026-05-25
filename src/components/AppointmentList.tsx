"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, ChevronRight, CheckCircle2, XCircle, Timer, Plus, CalendarDays } from 'lucide-react';

interface Appointment {
  id: string;
  petName: string;
  service: string;
  startTime: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
}

interface AppointmentListProps {
  appointments: Appointment[];
  onAddClick: () => void;
  onAppointmentClick: (appointment: Appointment) => void;
}

const statusConfig = {
  pending: { label: 'รอพิจารณา', icon: <Timer size={12} />, color: 'text-amber-600 bg-amber-50 border-amber-100' },
  confirmed: { label: 'ยืนยันแล้ว', icon: <CheckCircle2 size={12} />, color: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
  completed: { label: 'เสร็จสิ้น', icon: <CheckCircle2 size={12} />, color: 'text-blue-600 bg-blue-50 border-blue-100' },
  cancelled: { label: 'ยกเลิก', icon: <XCircle size={12} />, color: 'text-rose-600 bg-rose-50 border-rose-100' },
};

const AppointmentList = ({ appointments, onAddClick, onAppointmentClick }: AppointmentListProps) => {
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
    <div className="space-y-8 pb-24">
      {/* Header Section */}
      <div className="flex justify-between items-center px-1">
        <div>
          <h2 className="text-2xl font-black text-[#020d35] tracking-tight">นัดหมายของฉัน</h2>
          <p className="text-[11px] font-bold text-[#45464E] opacity-60 uppercase tracking-wider">Manage Bookings</p>
        </div>
        <motion.button 
          whileTap={{ scale: 0.95 }}
          onClick={onAddClick}
          className="bg-gradient-to-br from-[#18234a] to-[#020d35] text-white text-xs font-black px-5 py-3 rounded-full shadow-ambient flex items-center gap-1.5"
        >
          <Plus size={16} strokeWidth={3} />
          จองนัดหมาย
        </motion.button>
      </div>

      {/* Appointments List */}
      <div className="space-y-4">
        {appointments.length > 0 ? (
          appointments.map((apt, index) => {
            const config = statusConfig[apt.status] || statusConfig.pending;
            return (
              <motion.div
                key={apt.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onAppointmentClick(apt)}
                className="bg-white p-6 rounded-[2.5rem] shadow-ambient border border-black/5 relative overflow-hidden cursor-pointer flex items-center justify-between gap-4"
              >
                {/* Soft background glow */}
                <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-primary/5 rounded-full blur-2xl pointer-events-none" />

                <div className="flex items-center gap-4 min-w-0 flex-1">
                  <div className="w-14 h-14 bg-[#F3F3F3] rounded-2xl flex items-center justify-center text-[#020d35] shrink-0">
                    <CalendarDays size={24} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className={`text-[9px] font-black uppercase px-2.5 py-1 rounded-full border flex items-center gap-1 ${config.color}`}>
                        {config.icon} {config.label}
                      </span>
                    </div>
                    <h4 className="font-black text-[#020d35] text-base truncate leading-tight">น้อง{apt.petName}</h4>
                    <p className="text-[11px] font-bold text-[#45464E] opacity-60 flex items-center gap-1 mt-1">
                      <Clock size={12} /> {formatDate(apt.startTime)}
                    </p>
                  </div>
                </div>

                <div className="w-10 h-10 bg-[#F3F3F3] rounded-full flex items-center justify-center text-[#020d35] shrink-0">
                  <ChevronRight size={16} strokeWidth={3} />
                </div>
              </motion.div>
            );
          })
        ) : (
          <div className="text-center py-20 bg-white rounded-[3rem] shadow-ambient border border-black/5 p-8 flex flex-col items-center justify-center">
            <div className="w-16 h-16 bg-[#F3F3F3] rounded-2xl flex items-center justify-center text-slate-300 mb-4">
              <Calendar size={28} />
            </div>
            <h3 className="text-base font-black text-[#020d35] mb-1">ยังไม่มีรายการนัดหมาย</h3>
            <p className="text-xs font-bold text-[#45464E] opacity-60 max-w-[220px] leading-relaxed mb-6">
              จองคิวล่วงหน้าเพื่อรับบริการที่รวดเร็วและสะดวกสบายสำหรับสัตว์เลี้ยงของคุณค่ะ ✨
            </p>
            <motion.button 
              whileTap={{ scale: 0.95 }}
              onClick={onAddClick}
              className="bg-gradient-to-br from-[#18234a] to-[#020d35] text-white text-xs font-black px-6 py-3.5 rounded-full shadow-ambient"
            >
              จองนัดหมายครั้งแรกเลย 🐾
            </motion.button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentList;