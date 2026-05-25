"use client";

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar as CalendarIcon, Clock, ChevronRight, CheckCircle2, XCircle, Timer, Plus, CalendarDays, AlertCircle } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { format, isSameDay, parseISO } from 'date-fns';
import { th } from 'date-fns/locale';

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
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  // Format time helper
  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return format(date, 'HH:mm') + ' น.';
  };

  // Filter appointments for the selected date
  const filteredAppointments = useMemo(() => {
    if (!selectedDate) return [];
    return appointments.filter(apt => {
      const aptDate = parseISO(apt.startTime);
      return isSameDay(aptDate, selectedDate);
    });
  }, [appointments, selectedDate]);

  // Get all dates that have appointments to highlight them on the calendar
  const appointmentDates = useMemo(() => {
    return appointments.map(apt => parseISO(apt.startTime));
  }, [appointments]);

  return (
    <div className="space-y-6 pb-24">
      {/* Header Section */}
      <div className="flex justify-between items-center px-1">
        <div>
          <h2 className="text-2xl font-black text-[#020d35] tracking-tight">ตารางนัดหมาย</h2>
          <p className="text-[11px] font-bold text-[#45464E] opacity-60 uppercase tracking-wider">Interactive Schedule</p>
        </div>
        <motion.button 
          whileTap={{ scale: 0.95 }}
          onClick={onAddClick}
          className="bg-gradient-to-br from-[#18234a] to-[#020d35] text-white text-xs font-black px-5 py-3 rounded-full shadow-ambient flex items-center gap-1.5"
        >
          <Plus size={16} strokeWidth={3} />
          จองคิว
        </motion.button>
      </div>

      {/* Top Half: Interactive Calendar (Centered with custom dot indicators) */}
      <div className="bg-white p-6 rounded-[2.5rem] shadow-ambient border border-black/5 flex justify-center items-center">
        <div className="w-full max-w-sm flex justify-center">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            locale={th}
            className="rounded-md border-none mx-auto"
            components={{
              DayContent: (props) => {
                const hasApt = appointmentDates.some(date => isSameDay(date, props.date));
                return (
                  <div className="relative flex flex-col items-center justify-center w-full h-full">
                    <span className="z-10">{props.date.getDate()}</span>
                    {hasApt && (
                      <span className="absolute bottom-1 w-1.5 h-1.5 bg-pink-500 rounded-full shadow-[0_0_4px_rgba(236,72,153,0.6)]" />
                    )}
                  </div>
                );
              }
            }}
          />
        </div>
      </div>

      {/* Bottom Half: Appointment Details for Selected Date */}
      <div className="space-y-4">
        <div className="flex justify-between items-center px-1">
          <h3 className="text-sm font-black text-[#020d35] uppercase tracking-wider">
            {selectedDate ? format(selectedDate, 'd MMMM yyyy', { locale: th }) : 'เลือกวันที่'}
          </h3>
          <span className="text-[10px] font-bold text-[#45464E] opacity-50 uppercase">
            {filteredAppointments.length} รายการ
          </span>
        </div>

        <AnimatePresence mode="wait">
          <motion.div 
            key={selectedDate ? selectedDate.toString() : 'empty'}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
          >
            {filteredAppointments.length > 0 ? (
              filteredAppointments.map((apt) => {
                const config = statusConfig[apt.status] || statusConfig.pending;
                return (
                  <motion.div
                    key={apt.id}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onAppointmentClick(apt)}
                    className="bg-white p-6 rounded-[2.5rem] shadow-ambient border border-black/5 relative overflow-hidden cursor-pointer flex items-center justify-between gap-4"
                  >
                    <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-primary/5 rounded-full blur-2xl pointer-events-none" />

                    <div className="flex items-center gap-4 min-w-0 flex-1">
                      <div className="w-12 h-12 bg-[#F3F3F3] rounded-2xl flex items-center justify-center text-[#020d35] shrink-0">
                        <Clock size={20} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full border flex items-center gap-1 ${config.color}`}>
                            {config.icon} {config.label}
                          </span>
                        </div>
                        <h4 className="font-black text-[#020d35] text-sm truncate leading-tight">น้อง{apt.petName}</h4>
                        <p className="text-[11px] font-bold text-[#45464E] opacity-60 mt-0.5">
                          {apt.service} • {formatTime(apt.startTime)}
                        </p>
                      </div>
                    </div>

                    <div className="w-8 h-8 bg-[#F3F3F3] rounded-full flex items-center justify-center text-[#020d35] shrink-0">
                      <ChevronRight size={14} strokeWidth={3} />
                    </div>
                  </motion.div>
                );
              })
            ) : (
              <div className="text-center py-12 bg-white rounded-[2.5rem] shadow-ambient border border-black/5 p-6 flex flex-col items-center justify-center">
                <div className="w-12 h-12 bg-[#F3F3F3] rounded-2xl flex items-center justify-center text-slate-300 mb-3">
                  <CalendarIcon size={20} />
                </div>
                <h4 className="text-sm font-black text-[#020d35] mb-1">ไม่มีนัดหมายในวันนี้</h4>
                <p className="text-[11px] font-bold text-[#45464E] opacity-60 max-w-[200px] leading-relaxed mb-4">
                  คุณสามารถจองคิวล่วงหน้าสำหรับวันนี้ได้ทันทีค่ะ
                </p>
                <motion.button 
                  whileTap={{ scale: 0.95 }}
                  onClick={onAddClick}
                  className="bg-gradient-to-br from-[#18234a] to-[#020d35] text-white text-[10px] font-black px-4 py-2.5 rounded-full shadow-ambient"
                >
                  จองคิววันนี้นะคะ 🐾
                </motion.button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AppointmentList;