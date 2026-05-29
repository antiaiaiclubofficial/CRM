"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Coins, ArrowUpRight, ArrowDownLeft, Calendar, Gift, Sparkles } from 'lucide-react';

interface PointsLog {
  id: string;
  points: number;
  action_type: string;
  description: string;
  created_at: string;
}

interface PointsHistoryProps {
  logs: PointsLog[];
  currentPoints: number;
}

const PointsHistory = ({ logs, currentPoints }: PointsHistoryProps) => {
  return (
    <div className="space-y-6">
      {/* Points Summary Card - Reduced Size */}
      <div className="bg-gradient-to-br from-[#18234a] to-[#020d35] p-4 rounded-2xl text-white relative overflow-hidden shadow-ambient">
        <div className="absolute -right-6 -bottom-6 w-20 h-20 bg-[#EAFD69]/10 rounded-full blur-2xl" />
        <div className="relative z-10 flex justify-between items-center">
          <div>
            <p className="text-[9px] font-black text-white/50 uppercase tracking-widest">คะแนนคงเหลือปัจจุบัน</p>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-2xl font-black text-[#EAFD69] tracking-tighter">
                {currentPoints.toLocaleString()}
              </span>
              <span className="text-[10px] font-bold text-white/70 uppercase">คะแนน</span>
            </div>
          </div>
          <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-[#EAFD69] border border-white/10">
            <Coins size={18} className="animate-pulse" />
          </div>
        </div>
      </div>

      {/* Logs List */}
      <div className="space-y-4">
        <div className="flex justify-between items-center px-1">
          <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">รายการเคลื่อนไหวคะแนน</h4>
          <span className="text-[10px] font-bold text-slate-400 uppercase">{logs.length} รายการ</span>
        </div>

        <div className="space-y-3">
          {logs.length > 0 ? (
            logs.map((log, index) => {
              const isEarn = log.points > 0;
              return (
                <motion.div
                  key={log.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white p-5 rounded-[2rem] shadow-ambient border border-black/5 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4 min-w-0 flex-1">
                    {/* Icon Vessel */}
                    <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${
                      isEarn ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                    }`}>
                      {isEarn ? <ArrowUpRight size={20} /> : <ArrowDownLeft size={20} />}
                    </div>

                    {/* Content */}
                    <div className="min-w-0 flex-1">
                      <h5 className="font-black text-primary text-sm truncate leading-tight">
                        {log.description}
                      </h5>
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1 mt-1">
                        <Calendar size={10} />
                        {new Date(log.created_at).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: '2-digit', hour: '2-digit', minute: '2-digit' })} น.
                      </span>
                    </div>
                  </div>

                  {/* Points Badge */}
                  <div className={`text-right shrink-0 font-black text-base ${
                    isEarn ? 'text-emerald-600' : 'text-rose-600'
                  }`}>
                    {isEarn ? '+' : ''}{log.points.toLocaleString()}
                  </div>
                </motion.div>
              );
            })
          ) : (
            <div className="text-center py-16 bg-white rounded-[3rem] shadow-ambient border border-white/40 p-8 flex flex-col items-center justify-center">
              <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 mb-4 border border-slate-100">
                <Coins size={28} />
              </div>
              <h3 className="text-base font-black text-primary mb-1">ยังไม่มีประวัติคะแนน</h3>
              <p className="text-xs font-bold text-surface-variant opacity-60 max-w-[200px] leading-relaxed">
                เมื่อคุณได้รับคะแนนจากการใช้บริการหรือแลกของรางวัล ประวัติจะแสดงที่นี่ค่ะ 🐾
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PointsHistory;