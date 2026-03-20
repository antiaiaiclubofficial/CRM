"use client";

import React, { useState } from 'react';
import { Plus, Edit2, X, Check, Trash2, Info, HeartPulse, Scale, Calendar, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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

interface PetManagementProps {
  pets: Pet[];
  onAdd: (pet: Omit<Pet, 'id'>) => void;
  onEdit: (id: number, updatedPet: Partial<Pet>) => void;
  onDelete: (id: number) => void;
}

const PetManagement = ({ pets, onAdd, onEdit, onDelete }: PetManagementProps) => {
  const [isEditing, setIsEditing] = useState<number | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState<Omit<Pet, 'id' | 'color'>>({
    name: '',
    type: 'สุนัข',
    breed: '',
    age: '',
    gender: 'ผู้',
    weight: '',
    medicalCondition: '',
    precautions: '',
    icon: '🐶'
  });

  const colors = ['bg-orange-100', 'bg-blue-100', 'bg-yellow-100', 'bg-pink-100', 'bg-purple-100', 'bg-green-100'];
  const petIcons: Record<string, string> = { 'สุนัข': '🐶', 'แมว': '🐱', 'กระต่าย': '🐰', 'หนูแฮมสเตอร์': '🐹', 'นก': '🦜' };

  const handleSave = () => {
    if (isAdding) {
      onAdd({ 
        ...formData, 
        color: colors[Math.floor(Math.random() * colors.length)],
        icon: petIcons[formData.type] || '🐾'
      });
      setIsAdding(false);
    } else if (isEditing !== null) {
      onEdit(isEditing, {
        ...formData,
        icon: petIcons[formData.type] || '🐾'
      });
      setIsEditing(null);
    }
  };

  const startEdit = (pet: Pet) => {
    setFormData({
      name: pet.name,
      type: pet.type,
      breed: pet.breed,
      age: pet.age,
      gender: pet.gender,
      weight: pet.weight,
      medicalCondition: pet.medicalCondition,
      precautions: pet.precautions,
      icon: pet.icon
    });
    setIsEditing(pet.id);
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-slate-800">จัดการสัตว์เลี้ยง</h2>
        <button 
          onClick={() => { 
            setIsAdding(true); 
            setFormData({ name: '', type: 'สุนัข', breed: '', age: '', gender: 'ผู้', weight: '', medicalCondition: '', precautions: '', icon: '🐶' }); 
          }}
          className="bg-pink-500 text-white p-2 rounded-2xl shadow-lg shadow-pink-200 active:scale-90 transition-transform"
        >
          <Plus size={20} />
        </button>
      </div>

      <div className="space-y-4">
        {pets.map((pet) => (
          <motion.div 
            layout
            key={pet.id}
            className="bg-white p-5 rounded-[2.5rem] shadow-sm border border-slate-50 flex flex-col gap-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 ${pet.color} rounded-2xl flex items-center justify-center text-2xl shadow-inner`}>
                  {pet.icon}
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-lg">{pet.name}</h4>
                  <p className="text-xs text-slate-500">{pet.type} • {pet.breed}</p>
                </div>
              </div>
              <div className="flex gap-1">
                <button onClick={() => startEdit(pet)} className="p-2 text-slate-400 hover:text-pink-500 transition-colors">
                  <Edit2 size={18} />
                </button>
                <button onClick={() => onDelete(pet.id)} className="p-2 text-slate-400 hover:text-red-500 transition-colors">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-2 py-2 border-t border-slate-50">
              <div className="text-center">
                <p className="text-[10px] text-slate-400 uppercase font-bold">อายุ</p>
                <p className="text-sm font-medium text-slate-700">{pet.age || '-'} ปี</p>
              </div>
              <div className="text-center border-x border-slate-50">
                <p className="text-[10px] text-slate-400 uppercase font-bold">เพศ</p>
                <p className="text-sm font-medium text-slate-700">{pet.gender}</p>
              </div>
              <div className="text-center">
                <p className="text-[10px] text-slate-400 uppercase font-bold">น้ำหนัก</p>
                <p className="text-sm font-medium text-slate-700">{pet.weight || '-'} kg</p>
              </div>
            </div>

            {(pet.medicalCondition || pet.precautions) && (
              <div className="bg-slate-50 rounded-2xl p-3 space-y-2">
                {pet.medicalCondition && (
                  <div className="flex gap-2 items-start">
                    <HeartPulse size={14} className="text-red-400 mt-0.5" />
                    <p className="text-[11px] text-slate-600"><span className="font-bold">โรค:</span> {pet.medicalCondition}</p>
                  </div>
                )}
                {pet.precautions && (
                  <div className="flex gap-2 items-start">
                    <Info size={14} className="text-amber-400 mt-0.5" />
                    <p className="text-[11px] text-slate-600"><span className="font-bold">ควรระวัง:</span> {pet.precautions}</p>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {(isAdding || isEditing !== null) && (
          <div className="fixed inset-0 z-50 flex items-end justify-center">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => { setIsAdding(false); setIsEditing(null); }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              className="relative w-full max-w-[390px] bg-white rounded-t-[3rem] p-8 max-h-[90vh] overflow-y-auto no-scrollbar shadow-2xl"
            >
              <div className="flex justify-between items-center mb-6 sticky top-0 bg-white py-2 z-10">
                <h3 className="font-bold text-xl">{isAdding ? 'เพิ่มสมาชิกใหม่' : 'แก้ไขข้อมูล'}</h3>
                <button onClick={() => { setIsAdding(false); setIsEditing(null); }} className="p-2 bg-slate-100 rounded-full text-slate-400">
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-5 pb-8">
                {/* Basic Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 px-2 flex items-center gap-1"><User size={12}/> ชื่อ</label>
                    <input 
                      type="text" 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="ชื่อน้อง"
                      className="w-full p-3.5 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-pink-200 outline-none text-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 px-2">ประเภท</label>
                    <select 
                      value={formData.type}
                      onChange={(e) => setFormData({...formData, type: e.target.value})}
                      className="w-full p-3.5 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-pink-200 outline-none text-sm appearance-none"
                    >
                      {Object.keys(petIcons).map(type => <option key={type} value={type}>{type}</option>)}
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 px-2">สายพันธุ์</label>
                  <input 
                    type="text" 
                    value={formData.breed}
                    onChange={(e) => setFormData({...formData, breed: e.target.value})}
                    placeholder="เช่น Golden Retriever"
                    className="w-full p-3.5 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-pink-200 outline-none text-sm"
                  />
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 px-2 flex items-center gap-1"><Calendar size={12}/> อายุ</label>
                    <input 
                      type="number" 
                      value={formData.age}
                      onChange={(e) => setFormData({...formData, age: e.target.value})}
                      placeholder="ปี"
                      className="w-full p-3.5 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-pink-200 outline-none text-sm text-center"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 px-2">เพศ</label>
                    <select 
                      value={formData.gender}
                      onChange={(e) => setFormData({...formData, gender: e.target.value})}
                      className="w-full p-3.5 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-pink-200 outline-none text-sm text-center appearance-none"
                    >
                      <option value="ผู้">ผู้</option>
                      <option value="เมีย">เมีย</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 px-2 flex items-center gap-1"><Scale size={12}/> นน.</label>
                    <input 
                      type="number" 
                      value={formData.weight}
                      onChange={(e) => setFormData({...formData, weight: e.target.value})}
                      placeholder="kg"
                      className="w-full p-3.5 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-pink-200 outline-none text-sm text-center"
                    />
                  </div>
                </div>

                {/* Medical & Special Care */}
                <div className="space-y-4 pt-2">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 px-2 flex items-center gap-1 text-red-500"><HeartPulse size={12}/> โรคประจำตัว</label>
                    <textarea 
                      value={formData.medicalCondition}
                      onChange={(e) => setFormData({...formData, medicalCondition: e.target.value})}
                      placeholder="ไม่มีให้ใส่ -"
                      className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-red-100 outline-none text-sm h-20 resize-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 px-2 flex items-center gap-1 text-amber-500"><Info size={12}/> ข้อควรระวัง / แพ้อาหาร</label>
                    <textarea 
                      value={formData.precautions}
                      onChange={(e) => setFormData({...formData, precautions: e.target.value})}
                      placeholder="ระบุสิ่งที่ร้านควรระวัง"
                      className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-amber-100 outline-none text-sm h-20 resize-none"
                    />
                  </div>
                </div>

                <button 
                  onClick={handleSave}
                  disabled={!formData.name || !formData.breed}
                  className="w-full py-4 bg-pink-500 text-white rounded-2xl font-bold shadow-lg shadow-pink-200 mt-4 disabled:opacity-50 disabled:shadow-none transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  <Check size={20} />
                  บันทึกข้อมูล
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PetManagement;