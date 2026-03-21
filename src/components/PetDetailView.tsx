"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Edit2, Trash2, Calendar, Scale, PawPrint, HeartPulse, Info, Scissors, Bath, Sparkles, ChevronRight } from 'lucide-react';
import PetIDCard from './PetIDCard'; // Import the new PetIDCard component

interface Pet {
  id: number;
  name: string;
  type: string;
  breed: string;
  age: string;
  gender: string;
  weight: string;
  medicalCondition: string;
  precautions: string;
  color: string;
  icon: string;
}

interface PetDetailViewProps {
  pet: Pet;
  onBack: () => void;
  onStartEdit: (pet: Pet) => void;
  onDeletePet: (id: number) => void;
}

const PetDetailView = ({ pet, onBack, onStartEdit, onDeletePet }: PetDetailViewProps) => {
  // Mock service history for the selected pet
  const serviceHistory = [
    {
      id: 1,
      date: '15 พ.ค. 2567',
      service: 'อาบน้ำตัดขน Full Service',
      price: '550',
      icon: <Scissors className="text-pink-500" />,
      bg: 'bg-pink-50'
    },
    {
      id: 2,
      date: '02 พ.ค. 2567',
      service: 'สปาโอโซนและนวดผ่อนคลาย',
      price: '890',
      icon: <Sparkles className="text-amber-500" />,
      bg: 'bg-amber-50'
    },
    {
      id: 3,
      date: '20 เม.ย. 2567',
      service: 'อาบน้ำกำจัดเห็บหมัด',
      price: '350',
      icon: <Bath className="text-blue-500" />,
      bg: 'bg-blue-50'
    }
  ].filter(item => item.id % 2 === (pet.id % 2)); // Simple filter to show different history for different pets

  const totalServices = serviceHistory.length;
  const totalCost = serviceHistory.reduce((sum, item) => sum + parseInt(item.price), 0);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6 pb-20"
    >
      {/* Header with Back button and Edit/Delete icons */}
      <div className="flex justify-between items-center mb-4">
        <button onClick={onBack} className="flex items-center gap-1 text-slate-500 hover:text-pink-500 transition-colors">
          <ArrowLeft size={20} />
          <span className="text-sm font-medium">กลับ</span>
        </button>
        <div className="flex gap-2">
          <button onClick={() => onStartEdit(pet)} className="p-2 text-slate-400 hover:text-pink-500 transition-colors">
            <Edit2 size={20} />
          </button>
          <button onClick={() => onDeletePet(pet.id)} className="p-2 text-slate-400 hover:text-red-500 transition-colors">
            <Trash2 size={20} />
          </button>
        </div>
      </div>

      {/* Pet ID Card Section */}
      <PetIDCard pet={pet} />

      {/* Service Summary */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-50 text-center">
          <p className="text-xs text-slate-500 mb-1">ใช้บริการทั้งหมด</p>
          <span className="text-2xl font-bold text-slate-800">{totalServices}</span>
          <span className="text-sm text-slate-600"> ครั้ง</span>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-50 text-center">
          <p className="text-xs text-slate-500 mb-1">ค่าใช้จ่ายรวม</p>
          <span className="text-2xl font-bold text-pink-500">฿{totalCost.toLocaleString()}</span>
        </div>
      </div>

      {/* Service History Section */}
      <div className="space-y-4 pt-4">
        <h3 className="text-lg font-bold text-slate-800">ประวัติการใช้บริการ</h3>
        {serviceHistory.length > 0 ? (
          serviceHistory.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white p-4 rounded-2xl shadow-sm border border-slate-50 flex items-center gap-4 group active:scale-[0.98] transition-all"
            >
              <div className={`w-12 h-12 ${item.bg} rounded-xl flex items-center justify-center text-lg shadow-inner`}>
                {item.icon}
              </div>
              <div className="flex-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">{item.date}</p>
                <h4 className="font-bold text-slate-800 text-sm">{item.service}</h4>
              </div>
              <span className="text-sm font-bold text-pink-500">฿{item.price}</span>
              <ChevronRight size={16} className="text-slate-300 group-hover:text-pink-400 transition-colors" />
            </motion.div>
          ))
        ) : (
          <div className="text-center py-6 text-slate-400">ไม่พบประวัติการใช้บริการสำหรับน้องตัวนี้</div>
        )}
      </div>
    </motion.div>
  );
};

export default PetDetailView;