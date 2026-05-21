"use client";

import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import { TrendingUp, Scale, Calendar } from 'lucide-react';

interface WeightEntry {
  date: string;
  weight: number;
}

interface PetWeightChartProps {
  data: WeightEntry[];
  petName: string;
}

const PetWeightChart = ({ data, petName }: PetWeightChartProps) => {
  const latestWeight = data.length > 0 ? data[data.length - 1].weight : 0;
  const initialWeight = data.length > 0 ? data[0].weight : 0;
  const weightDiff = (latestWeight - initialWeight).toFixed(1);
  const isGain = parseFloat(weightDiff) >= 0;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Stats Header */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-[2rem] border-2 border-slate-100 shadow-sm">
          <div className="flex items-center gap-2 mb-1">
            <Scale size={14} className="text-blue-500" />
            <span className="text-[10px] font-black text-slate-400 uppercase">น้ำหนักล่าสุด</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-slate-800">{latestWeight}</span>
            <span className="text-xs font-bold text-slate-400">kg</span>
          </div>
        </div>
        <div className="bg-white p-4 rounded-[2rem] border-2 border-slate-100 shadow-sm">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp size={14} className={isGain ? "text-emerald-500" : "text-rose-500"} />
            <span className="text-[10px] font-black text-slate-400 uppercase">การเปลี่ยนแปลง</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className={`text-2xl font-black ${isGain ? "text-emerald-600" : "text-rose-600"}`}>
              {isGain ? "+" : ""}{weightDiff}
            </span>
            <span className="text-xs font-bold text-slate-400">kg</span>
          </div>
        </div>
      </div>

      {/* Chart Container */}
      <div className="bg-white p-6 rounded-[2.5rem] border-2 border-slate-100 shadow-sm relative overflow-hidden">
        <div className="flex justify-between items-center mb-6">
          <h4 className="text-sm font-black text-slate-800 uppercase tracking-tight">กราฟแสดงน้ำหนัก</h4>
          <div className="bg-blue-50 px-3 py-1 rounded-full text-[9px] font-black text-blue-600 uppercase">
            ประวัติ 6 เดือนล่าสุด
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
              <XAxis 
                dataKey="date" 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fontWeight: 700, fill: '#94A3B8' }}
                dy={10}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fontWeight: 700, fill: '#94A3B8' }}
                domain={['dataMin - 1', 'dataMax + 1']}
              />
              <Tooltip 
                contentStyle={{ 
                  borderRadius: '16px', 
                  border: 'none', 
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                  padding: '12px'
                }}
                labelStyle={{ fontWeight: 800, marginBottom: '4px', fontSize: '12px' }}
                itemStyle={{ fontWeight: 700, color: '#3B82F6', fontSize: '12px' }}
              />
              <Area 
                type="monotone" 
                dataKey="weight" 
                stroke="#3B82F6" 
                strokeWidth={4}
                fillOpacity={1} 
                fill="url(#colorWeight)" 
                animationDuration={1500}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* History List */}
      <div className="space-y-3">
        <h4 className="text-sm font-black text-slate-800 px-1 uppercase tracking-tight">ประวัติการชั่งน้ำหนัก</h4>
        <div className="space-y-2">
          {data.slice().reverse().map((entry, i) => (
            <div key={i} className="bg-white p-4 rounded-2xl border border-slate-50 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400">
                  <Calendar size={16} />
                </div>
                <span className="text-sm font-bold text-slate-600">{entry.date}</span>
              </div>
              <span className="text-sm font-black text-slate-800">{entry.weight} kg</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default PetWeightChart;