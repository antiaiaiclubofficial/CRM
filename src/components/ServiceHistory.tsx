"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Scissors, Bath, Sparkles, Calendar, ChevronRight, X, Clock, DollarSign } from 'lucide-react';

interface ServiceHistoryItem {
  id: string | number;
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
    <div className="space-y-8 pb-24">
      {/* Header Section */}
      <div className="flex justify-between items-end px-1">
        <div>
          <p className="text-[10px] font-black text-surface-variant opacity-40 uppercase tracking-[0.2em] mb-1">Service Records</p>
          <h2 className="text-2xl font-black text-primary tracking-tight">ประวัติการใช้บริการ</h2>
        </div>
        <div className="bg-white px-4 py-1.5 rounded-full shadow-ambient border border-white/40">
          <span className="text-[10px] font-black text-primary uppercase tracking-wider">ทั้งหมด {filteredData.length} ครั้ง</span>
        </div>
      </div>

      {/* Filter Indicator */}
      {filterPetName && (
        <div className="flex items-center justify-between bg-white/80 backdrop-blur-md px-5 py-3 rounded-2xl shadow-ambient border border-white/40">
          <p className="text-xs font-bold text-surface-variant">
            แสดงผลเฉพาะ: <span className="text-primary font-black underline">น้อง{filterPetName}</span>
          </p>
          <button 
            onClick={onClearFilter}
            className="p-1.5 bg-slate-100 hover:bg-pink-50 rounded-full text-slate-400 hover:text-pink-500 transition-colors"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* History List */}
      <div className="space-y-4">
        {filteredData.length > 0 ? (
          filteredData.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => onServiceClick(item)}
              className="bg-white p-6 rounded-[2.5rem] shadow-ambient hover:shadow-glass border border-white/40 group active:scale-[0.99] transition-all cursor-pointer overflow-hidden relative"
            >
              {/* Soft background glow behind card */}
              <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-primary/5 rounded-full blur-2xl pointer-events-none" />

              <div className="flex items-center gap-5 relative z-10">
                {/* Icon Vessel */}
                <div className={`w-14 h-14 ${item.bg} rounded-2xl flex items-center justify-center text-2xl shadow-inner shrink-0`}>
                  {item.icon}
                </div>
                
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-[9px] font-black text-surface-variant opacity-40 uppercase tracking-widest flex items-center gap-1">
                      <Calendar size={10} /> {item.date}
                    </span>
                    <span className="text-sm font-black text-primary">฿{item.price}</span>
                  </div>
                  <h4 className="font-black text-primary text-sm truncate leading-tight">{item.service}</h4>
                  
                  {/* Pet Status Bubble */}
                  <div className="flex items-center gap-1.5 mt-2">
                    <span className="text-[9px] font-black px-2.5 py-0.5 rounded-full bg-secondary/10 text-primary uppercase tracking-wider">
                      {item.petName}
                    </span>
                  </div>
                </div>

                {/* Chevron Action */}
                <div className="w-9 h-9 bg-slate-50 rounded-full flex items-center justify-center text-primary/40 group-hover:bg-primary group-hover:text-white transition-colors shrink-0">
                  <ChevronRight size={14} strokeWidth={3} />
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="text-center py-16 bg-white rounded-[3rem] shadow-ambient border border-white/40 p-8 flex flex-col items-center justify-center">
            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 mb-4 border border-slate-100">
              <History size={28} />
            </div>
            <h3 className="text-base font-black text-primary mb-1">ยังไม่มีประวัติการใช้บริการ</h3>
            <p className="text-xs font-bold text-surface-variant opacity-60 max-w-[200px] leading-relaxed">
              เมื่อสัตว์เลี้ยงของคุณเข้ารับบริการที่ร้าน ประวัติจะแสดงที่นี่โดยอัตโนมัติค่ะ 🐾
            </p>
          </div>
        )}
      </div>

      {filteredData.length > 0 && (
        <div className="text-center py-4">
          <p className="text-[9px] font-black text-surface-variant opacity-30 uppercase tracking-[0.2em]">
            --- End of Records ---
          </p>
        </div>
      )}
    </div>
  );
};

export default ServiceHistory;