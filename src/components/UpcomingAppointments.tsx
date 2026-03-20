"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Scissors, Bath } from 'lucide-react';

const UpcomingAppointments = () => {
  const appointments = [
    {
      id: 1,
      petName: 'น้องปุย',
      service: 'อาบน้ำตัดขน',
      date: 'พรุ่งนี้, 14 มิ.ย.',
      time: '13:00 น.',
      icon: <Scissors size={16} className="text-pink-500" />,
      bg: 'bg-pink-50'
    },
    {
      id: 2,
      petName: 'น้องกะทิ',
      service: 'อาบน้ำแปรงขน',
      date: '18 มิ.ย. 67',
      time: '10:30 น.',
      icon: <Bath size={16} className="text-blue-500" />,
      bg: 'bg-blue-50'
    }
  ];

  return (
    <div className="mt-6">
      <div className="flex justify-between items-center mb-3 px-1">
        <h3 className="font-bold text-lg text-slate-800">นัดหมายของฉัน 📅</h3>
        <button className="text-xs text-pink-500 font-medium">ดูทั้งหมด</button>
      </div>

      <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2 px-1">
        {appointments.map((apt) => (
          <motion.div
            key={apt.id}
            whileTap={{ scale: 0.98 }}
            className="flex-shrink-0 w-[260px] bg-white p-4 rounded-3xl border border-slate-50 shadow-sm flex items-center gap-4"
          >
            <div className={`w-12 h-12 ${apt.bg} rounded-2xl flex items-center justify-center`}>
              {apt.icon}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-sm text-slate-800 truncate">{apt.service} - {apt.petName}</h4>
              <div className="flex items-center gap-3 mt-1">
                <div className="flex items-center gap-1 text-[10px] text-slate-500">
                  <Calendar size={10} />
                  {apt.date}
                </div>
                <div className="flex items-center gap-1 text-[10px] text-slate-500">
                  <Clock size={10} />
                  {apt.time}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
        {appointments.length === 0 && (
          <div className="w-full py-4 text-center bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
            <p className="text-xs text-slate-400">ไม่มีรายการนัดหมายเร็วๆ นี้</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UpcomingAppointments;