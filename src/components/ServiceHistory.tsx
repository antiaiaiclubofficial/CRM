"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Scissors, Bath, Sparkles, Calendar, ChevronRight } from 'lucide-react';

const ServiceHistory = () => {
  const historyData = [
    {
      id: 1,
      date: '15 พ.ค. 2567',
      petName: 'น้องปุย',
      service: 'อาบน้ำตัดขน Full Service',
      price: '550',
      icon: <Scissors className="text-pink-500" />,
      bg: 'bg-pink-50'
    },
    {
      id: 2,
      date: '02 พ.ค. 2567',
      petName: 'น้องกะทิ',
      service: 'สปาโอโซนและนวดผ่อนคลาย',
      price: '890',
      icon: <Sparkles className="text-amber-500" />,
      bg: 'bg-amber-50'
    },
    {
      id: 3,
      date: '20 เม.ย. 2567',
      petName: 'น้องปุย',
      service: 'อาบน้ำกำจัดเห็บหมัด',
      price: '350',
      icon: <Bath className="text-blue-500" />,
      bg: 'bg-blue-50'
    }
  ];

  return (
    <div className="space-y-6 pb-20">
      <div className="flex justify-between items-center px-1">
        <h2 className="text-xl font-bold text-slate-800">ประวัติการใช้บริการ</h2>
        <div className="bg-white px-3 py-1 rounded-full border border-slate-100 shadow-sm">
          <span className="text-xs font-bold text-slate-500">ทั้งหมด 12 ครั้ง</span>
        </div>
      </div>

      <div className="space-y-4">
        {historyData.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white p-5 rounded-[2.5rem] shadow-sm border border-slate-50 group active:scale-[0.98] transition-all"
          >
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 ${item.bg} rounded-2xl flex items-center justify-center text-xl shadow-inner`}>
                {item.icon}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                    <Calendar size={10} /> {item.date}
                  </span>
                  <span className="text-sm font-bold text-pink-500">฿{item.price}</span>
                </div>
                <h4 className="font-bold text-slate-800 text-sm mb-0.5">{item.service}</h4>
                <p className="text-xs text-slate-500">สำหรับ: <span className="text-slate-700 font-medium">{item.petName}</span></p>
              </div>
              <ChevronRight size={18} className="text-slate-300 group-hover:text-pink-400 transition-colors" />
            </div>
          </motion.div>
        ))}
      </div>

      <div className="bg-white/50 border-2 border-dashed border-slate-200 rounded-[2.5rem] p-8 text-center">
        <p className="text-sm text-slate-400">สิ้นสุดรายการประวัติ</p>
      </div>
    </div>
  );
};

export default ServiceHistory;