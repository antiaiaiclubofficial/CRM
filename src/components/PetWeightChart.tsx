"use client";

import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import { TrendingUp, Calendar, Plus } from 'lucide-react';
import AddWeightModal from './AddWeightModal';
import AnalogScaleIcon from './AnalogScaleIcon';

interface WeightEntry {
  date: string;
  weight: number;
}

interface PetWeightChartProps {
  data: WeightEntry[];
  petName: string;
  onAddWeight: (weight: number) => Promise<void>;
}

const PetWeightChart = ({ data, petName, onAddWeight }: PetWeightChartProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const latestWeight = data.length > 0 ? data[data.length - 1].weight : 0;
  const previousWeight = data.length > 1 ? data[data.length - 2].weight : latestWeight;
  const weightDiff = (latestWeight - previousWeight).toFixed(1);
  const isGain = parseFloat(weightDiff) >= 0;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* Visual Header / Summary Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-ambient relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-16 h-16 bg-primary/5 rounded-full blur-xl group-hover:scale-150 transition-transform duration-700" />
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-surface-container-low rounded-xl flex items-center justify-center text-primary">
               <AnalogScaleIcon size={16} />
            </div>
            <span className="text-[10px] font-black text-surface-variant opacity-60 uppercase tracking-widest">น้ำหนักปัจจุบัน</span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-black text-primary tracking-tighter">{latestWeight}</span>
            <span className="text-sm font-bold text-surface-variant opacity-40 uppercase">kg</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-ambient relative overflow-hidden group">
          <div className={`absolute -right-4 -top-4 w-16 h-16 ${isGain ? 'bg-emerald-500/5' : 'bg-rose-500/5'} rounded-full blur-xl group-hover:scale-150 transition-transform duration-700`} />
          <div className="flex items-center gap-2 mb-2">
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${isGain ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
               <TrendingUp size={16} />
            </div>
            <span className="text-[10px] font-black text-surface-variant opacity-60 uppercase tracking-widest">การเปลี่ยนแปลง</span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className={`text-3xl font-black tracking-tighter ${isGain ? "text-emerald-600" : "text-rose-600"}`}>
              {isGain ? "+" : ""}{weightDiff}
            </span>
            <span className="text-sm font-bold text-surface-variant opacity-40 uppercase">kg</span>
          </div>
        </div>
      </div>

      {/* Main Chart Card */}
      <div className="bg-white p-8 rounded-xl shadow-ambient relative overflow-hidden">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h4 className="text-lg font-black text-primary tracking-tight">กราฟการเจริญเติบโต</h4>
            <p className="text-[11px] font-bold text-surface-variant opacity-50 uppercase tracking-widest">Weight Distribution Timeline</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="w-12 h-12 bg-tertiary text-primary rounded-2xl shadow-lg shadow-tertiary/20 flex items-center justify-center active:scale-90 transition-all"
          >
            <Plus size={24} strokeWidth={3} />
          </button>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ left: -20, right: 10 }}>
              <defs>
                <linearGradient id="liquidGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#18234A" stopOpacity={0.15}/>
                  <stop offset="95%" stopColor="#18234A" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke="#f3f3f3" strokeDasharray="10 10" />
              <XAxis 
                dataKey="date" 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fontWeight: 800, fill: '#45464E', opacity: 0.4 }}
                dy={15}
              />
              <YAxis 
                domain={['auto', 'auto']}
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fontWeight: 800, fill: '#45464E', opacity: 0.4 }}
                width={40}
              />
              <Tooltip 
                cursor={{ stroke: '#18234A', strokeWidth: 1, strokeDasharray: '5 5' }}
                contentStyle={{ 
                  borderRadius: '2rem', 
                  border: 'none', 
                  boxShadow: '0 20px 40px rgba(24, 35, 74, 0.08)',
                  padding: '16px',
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(10px)'
                }}
                labelStyle={{ fontWeight: 900, marginBottom: '4px', fontSize: '12px', color: '#18234A', textTransform: 'uppercase' }}
                itemStyle={{ fontWeight: 700, color: '#18234A', fontSize: '12px' }}
              />
              <Area 
                type="monotone" 
                dataKey="weight" 
                stroke="#18234A" 
                strokeWidth={5}
                fillOpacity={1} 
                fill="url(#liquidGradient)" 
                animationDuration={2000}
                animationEasing="ease-in-out"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <button 
        onClick={() => setIsModalOpen(true)}
        className="w-full py-5 bg-tertiary text-primary rounded-xl font-black uppercase tracking-widest text-[14px] shadow-lg shadow-tertiary/20 active:scale-95 active:shadow-none transition-all flex items-center justify-center gap-3"
      >
        <AnalogScaleIcon size={18} /> บันทึกน้ำหนักล่าสุด
      </button>

      <div className="space-y-4">
        <div className="flex justify-between items-center px-1">
          <h4 className="text-sm font-black text-primary uppercase tracking-widest">ประวัติน้ำหนัก</h4>
          <span className="text-[10px] font-bold text-surface-variant opacity-40 uppercase">{data.length} รายการ</span>
        </div>
        
        <div className="space-y-3">
          {data.slice().reverse().map((entry, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white p-5 rounded-lg shadow-ambient flex justify-between items-center"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-surface-container-low rounded-2xl flex items-center justify-center text-surface-variant">
                  <Calendar size={18} />
                </div>
                <div>
                  <span className="text-sm font-black text-primary">{entry.date}</span>
                  <p className="text-[9px] font-bold text-surface-variant opacity-40 uppercase">Scheduled Check</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-black text-primary">{entry.weight}</span>
                <span className="text-[10px] font-bold text-surface-variant opacity-40 uppercase">kg</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <AddWeightModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        petName={petName} 
        onSave={onAddWeight} 
      />
    </motion.div>
  );
};

export default PetWeightChart;