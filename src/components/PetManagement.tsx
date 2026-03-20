"use client";

import React, { useState } from 'react';
import { Plus, Edit2, X, Check, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Pet {
  id: number;
  name: string;
  breed: string;
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
  const [formData, setFormData] = useState({ name: '', breed: '', icon: '🐶' });

  const colors = ['bg-orange-100', 'bg-blue-100', 'bg-yellow-100', 'bg-pink-100', 'bg-purple-100', 'bg-green-100'];
  const icons = ['🐶', '🐱', '🐕', '🐈', '🐰', '🐹'];

  const handleSave = () => {
    if (isAdding) {
      onAdd({ ...formData, color: colors[Math.floor(Math.random() * colors.length)] });
      setIsAdding(false);
    } else if (isEditing !== null) {
      onEdit(isEditing, formData);
      setIsEditing(null);
    }
    setFormData({ name: '', breed: '', icon: '🐶' });
  };

  const startEdit = (pet: Pet) => {
    setFormData({ name: pet.name, breed: pet.breed, icon: pet.icon });
    setIsEditing(pet.id);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-slate-800">จัดการสัตว์เลี้ยง</h2>
        <button 
          onClick={() => { setIsAdding(true); setFormData({ name: '', breed: '', icon: '🐶' }); }}
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
            className="bg-white p-4 rounded-[2rem] shadow-sm border border-slate-50 flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 ${pet.color} rounded-2xl flex items-center justify-center text-2xl shadow-inner`}>
                {pet.icon}
              </div>
              <div>
                <h4 className="font-bold text-slate-800">{pet.name}</h4>
                <p className="text-xs text-slate-500">{pet.breed}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => startEdit(pet)} className="p-2 text-slate-400 hover:text-pink-500 transition-colors">
                <Edit2 size={18} />
              </button>
              <button onClick={() => onDelete(pet.id)} className="p-2 text-slate-400 hover:text-red-500 transition-colors">
                <Trash2 size={18} />
              </button>
            </div>
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
              className="relative w-full max-w-[390px] bg-white rounded-t-[3rem] p-8 pb-12 shadow-2xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-xl">{isAdding ? 'เพิ่มสมาชิกใหม่' : 'แก้ไขข้อมูล'}</h3>
                <button onClick={() => { setIsAdding(false); setIsEditing(null); }} className="p-2 bg-slate-100 rounded-full text-slate-400">
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex justify-center gap-3 mb-6">
                  {icons.map(icon => (
                    <button 
                      key={icon}
                      onClick={() => setFormData({...formData, icon})}
                      className={`w-12 h-12 text-2xl rounded-2xl flex items-center justify-center transition-all ${formData.icon === icon ? 'bg-pink-100 scale-110 shadow-md ring-2 ring-pink-500' : 'bg-slate-50 opacity-50'}`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 px-2">ชื่อสัตว์เลี้ยง</label>
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="เช่น น้องโคล่า"
                    className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-pink-200 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 px-2">สายพันธุ์</label>
                  <input 
                    type="text" 
                    value={formData.breed}
                    onChange={(e) => setFormData({...formData, breed: e.target.value})}
                    placeholder="เช่น Golden Retriever"
                    className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-pink-200 outline-none"
                  />
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