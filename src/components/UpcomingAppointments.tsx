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

const getServiceIcon = (serviceName: string = '') => {
  const name = serviceName || '';
  if (name.includes('ตัดขน')) return { icon: <Scissors size={16} className="text-pink-500" />, bg: 'bg-pink-50' };
  if (name.includes('อาบน้ำ')) return { icon: <Bath size={16} className="text-blue-500" />, bg: 'bg-blue-50' };
  if (name.includes('สปา')) return { icon: <Sparkles size={16} className="text-amber-500" />, bg: 'bg-amber-50' };
  return { icon: <CalendarDays size={16} className="text-slate-500" />, bg: 'bg-slate-50' };
};

const formatAppointmentDateTime = (dateStr: string) => {
  const date = new Date(dateStr);
  let datePart = '';
  
  if (isToday(date)) {
    datePart = 'วันนี้, ';
  } else if (isTomorrow(date)) {
    datePart = 'พรุ่งนี้, ';
  }
  
  datePart += format(date, 'd MMM yy', { locale: th });
  const timePart = format(date, 'HH:mm');
  
  return `${datePart} • ${timePart} น.`;
};

const UpcomingAppointments = ({ appointments, onViewAll }: UpcomingAppointmentsProps) => {
  const upcoming = appointments
    .filter(apt => apt.status === 'confirmed' || apt.status === 'pending')
    .slice(0, 5);

  return (
    <div className="mt-6">
      <div className="flex justify-between items-center mb-3 px-1">
        <h3 className="font-extrabold text-base text-primary tracking-tight flex items-center gap-2">
          Scheduled <span className="text-sm">📅</span>
        </h3>
        <button onClick={onViewAll} className="text-[10px] text-primary font-black uppercase tracking-widest opacity-50">View All</button>
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
                className="flex-shrink-0 w-[240px] bg-white p-4 rounded-[2rem] border-none shadow-ambient flex items-center gap-3 cursor-pointer"
              >
                <div className={`w-12 h-12 ${bg} rounded-2xl flex items-center justify-center shrink-0`}>
                  {icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-black text-[13px] text-primary truncate leading-tight">
                    {apt.service} - {apt.petName}
                  </h4>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex items-center gap-1 text-[10px] font-bold text-surface-variant opacity-60">
                      <Calendar size={10} />
                      {formatAppointmentDateTime(apt.startTime)}
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
            className="w-full py-5 text-center bg-surface-low rounded-[2rem] cursor-pointer"
          >
            <p className="text-[10px] font-black text-primary opacity-30 uppercase tracking-widest">No active bookings 🐾</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default UpcomingAppointments;