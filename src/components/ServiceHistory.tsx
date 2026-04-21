"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Scissors, Bath, Sparkles, Calendar, ChevronRight, X } from 'lucide-react';

interface ServiceHistoryItem {
  id: number;
  date: string;
  petName: string;
  service: string;
  price: string;
  icon: React.ReactNode;
  bg: string;
  description: string;
  notes?: string;
  shampooUsed?: string;
  spaTreatment?: string;
  groomerNotes?: string;
  beforeAfterImages?: { before: string; after: string; }[];
}

interface ServiceHistoryProps {
  historyData: ServiceHistoryItem[];
  filterPetName?: string | null;
  onClearFilter?: () => void;
  onServiceClick: (service: ServiceHistoryItem) => void;
}

const ServiceHistory = ({ historyData, filterPetName, onClearFilter, onServiceClick }: ServiceHistoryProps) => {

  const filteredData = filterPetName 
    ? historyData.filter(item => item.petName === filterPetName)
    : historyData;

  return (
    <div className="space-y-6 pb-20">
      <div className="flex justify-between items-center px-1">
        <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">ประวัติการใช้บริการ</h2>
        <div className="bg-white border-2 border-black px-3 py-1 rounded-full shadow-sm">
          <span className="text-[10px] font-black text-black uppercase">ทั้งหมด {filteredData.length} ครั้ง</span>
        </div>
      </div>

      {filterPetName && (
        <div className="flex items-center justify-between bg-white px-4 py-2 rounded-2xl border-2 border-black shadow-sm">
          <p className="text-[10px] font-black text-black uppercase">
            แสดงผลเฉพาะ: <span className="text-pink-500 underline">{filterPetName}</span>
          </p>
          <button 
            onClick={onClearFilter}
            className="p-1 bg-slate-100 hover:bg-pink-100 border border-black rounded-lg text-black transition-colors"
          >
            <X size={12} />
          </button>
        </div>
      )}

      <div className="space-y-4">
        {filteredData.length > 0 ? (
          filteredData.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => onServiceClick(item)}
              className="bg-white p-5 rounded-[2.5rem] border-2 border-black shadow-soft group active:translate-y-0.5 active:shadow-none transition-all cursor-pointer overflow-hidden relative"
            >
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 ${item.bg} border-2 border-black rounded-2xl flex items-center justify-center text-xl shadow-sm shrink-0`}>
                  {item.icon}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                      <Calendar size={10} /> {item.date}
                    </span>
                    <span className="text-sm font-black text-pink-500">฿{item.price}</span>
                  </div>
                  <h4 className="font-black text-slate-800 text-sm mb-0.5">{item.service}</h4>
                  <p className="text-[10px] font-bold text-slate-500 uppercase">
                    สำหรับ: <span className="text-black underline">{item.petName}</span>
                  </p>
                </div>
                <div className="p-2 border-2 border-black rounded-xl group-hover:bg-black group-hover:text-white transition-colors shrink-0">
                  <ChevronRight size={16} strokeWidth={3} />
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="text-center py-12 border-2 border-dashed border-slate-300 rounded-[2.5rem] bg-white/50">
            <p className="text-sm font-black text-slate-400 uppercase">ไม่พบประวัติการใช้บริการ</p>
          </div>
        )}
      </div>

      <div className="bg-slate-50 border-2 border-dashed border-slate-300 rounded-[2.5rem] p-8 text-center">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">--- สิ้นสุดรายการประวัติ ---</p>
      </div>
    </div>
  );
};

export default ServiceHistory;