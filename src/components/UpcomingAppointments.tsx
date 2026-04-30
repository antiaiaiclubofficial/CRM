"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Scissors, Bath, Sparkles, CalendarDays } from 'lucide-react';
import { format, isTomorrow, isToday } from 'date-fns';
import { th } from 'date-fns/locale';

interface Appointment {
  id: string;
  petName: string;
  service: string;
  startTime: string;
  status: string;
}

interface UpcomingAppointmentsProps {
  appointments: Appointment[];
  onViewAll: () => void;
}

const getServiceIcon = (serviceName: string) => {
  if (serviceName.includes('ตัดขน')) return { icon: <Scissors size={18} className="text-pink-500" />, bg: 'bg-pink-50' };
  if (serviceName.includes('อาบน้ำ')) return { icon: <Bath size={18} className="text-blue-500" />, bg: 'bg-blue-50' };
  if (serviceName.includes('สปา')) return { icon: <Sparkles size={18} className="text-amber-500" />, bg: 'bg-amber-50' };
  return { icon: <CalendarDays size={18} className="text-slate-500" />, bg: 'bg-slate-50' };
};

const formatAppointmentDate = (dateStr: string) => {
  const date = new Date(dateStr);
  let prefix = '';
  
  if (isToday(date)) prefix = 'วันนี้, ';
  else if (isTomorrow(date)) prefix = 'พรุ่งนี้, ';
  
  return prefix + format(date, 'd มิ.ย.', { locale: th });
};

const UpcomingAppointments = ({ appointments, onViewAll }: UpcomingAppointmentsProps) => {
  // Only show pending or confirmed appointments that are in the future
  const upcoming = appointments
    .filter(apt => apt.status === 'confirmed' || apt.status === 'pending')
    .slice(0, 5);

  return (
    <div className="mt-6">
      <div className="flex justify-between items-center mb-3 px-1">
        <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
          นัดหมายของฉัน <span className="text-base">📅</span>
        </h3>
        <button onClick={onViewAll} className="text-xs text-pink-500 font-medium">ดูทั้งหมด</button>
      </div>

      <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2 px-1">
        {upcoming.length > 0 ? (
          upcoming.map((apt) => {
            const { icon, bg } = getServiceIcon(apt.service);
            return (
              <motion.div
                key={apt.id}
                whileTap={{ scale: 0.98 }}
                onClick={onViewAll}
                className="flex-shrink-0 w-[280px] bg-white p-4 rounded-[2rem] border border-slate-50 shadow-sm flex items-center gap-4 cursor-pointer"
              >
                <div className={`w-14 h-14 ${bg} rounded-2xl flex items-center justify-center shrink-0`}>
                  {icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-sm text-slate-800 truncate">
                    {apt.service} - น้อง{apt.petName}
                  </h4>
                  <div className="flex items-center gap-3 mt-1.5">
                    <div className="flex items-center gap-1 text-[11px] font-medium text-slate-500">
                      <Calendar size={12} className="text-slate-400" />
                      {formatAppointmentDate(apt.startTime)}
                    </div>
                    <div className="flex items-center gap-1 text-[11px] font-medium text-slate-500">
                      <Clock size={12} className="text-slate-400" />
                      {format(new Date(apt.startTime), 'HH:mm')} น.
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })
        ) : (
          <motion.div 
            whileTap={{ scale: 0.98 }}
            onClick={onViewAll}
            className="w-full py-6 text-center bg-white/40 rounded-[2rem] border-2 border-dashed border-slate-200 cursor-pointer"
          >
            <p className="text-xs font-bold text-slate-400 uppercase tracking-tight">ไม่มีรายการนัดหมายเร็วๆ นี้ 🐾</p>
            <p className="text-[10px] text-pink-500 font-bold mt-1">จองคิวรับบริการได้ที่นี่!</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default UpcomingAppointments;