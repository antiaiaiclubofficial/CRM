"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Pencil, Heart, PawPrint, Tag, Plus, HeartPulse, Trash2, AlertTriangle, X
} from 'lucide-react';

interface Pet {
  id: string | number;
  name: string;
  type: string;
  breed: string;
  age: string;
  birth_date?: string;
  gender: string;
  weight: string;
  medical_condition: string;
  precautions: string;
  color: string;
  icon: string;
  fur_length?: string;
  custom_preferences?: { id: string; label: string; value: string; }[];
  image_url: string;
  is_favorite?: boolean;
}

interface PetDetailViewProps {
  pet: Pet;
  onBack: () => void;
  onStartEdit: (pet: Pet) => void;
  onDeletePet: (id: string | number) => void;
  totalServiceCost: number;
  onViewServiceHistoryForPet: (petName: string) => void;
  onEditPreferences: () => void;
  onToggleFavorite: () => void;
}

const PetDetailView = ({ pet, onBack, onStartEdit, onDeletePet, onEditPreferences, onToggleFavorite }: PetDetailViewProps) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const hasPreferences = pet.custom_preferences && pet.custom_preferences.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative bg-[#FFF9F0] pb-24"
    >
      <div className="absolute top-2 left-2 right-2 flex justify-between items-center z-[60]">
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onBack();
          }} 
          className="p-2.5 bg-emerald-400 text-white rounded-xl shadow-lg active:scale-95 transition-transform"
        >
          <ArrowLeft size={24} />
        </button>
        
        <button 
          onClick={() => onStartEdit(pet)} 
          className="p-2.5 bg-slate-900 text-white rounded-xl shadow-lg active:scale-95 transition-transform flex items-center gap-1 px-3"
        >
          <Pencil size={18} />
          <span className="text-xs font-bold">แก้ไข</span>
        </button>
      </div>

      <div className="relative w-full h-64 flex items-center justify-center pt-16 pb-8 z-20">
        <div className="relative w-48 h-48 rounded-full border-[6px] border-amber-400 flex items-center justify-center overflow-hidden shadow-lg">
          <img src={pet.image_url} alt={pet.name} className="w-full h-full object-cover" />
        </div>
      </div>

      <div className="relative bg-white rounded-[2rem] p-6 mx-6 -mt-8 shadow-xl z-10 border-2 border-slate-800 shadow-soft">
        <div className="flex justify-between items-start mb-4">
          <div className="min-w-0 flex-1 pr-2">
            <h2 className="text-2xl font-black text-slate-800 truncate">{pet.name}</h2>
            <p className="text-sm text-slate-500 flex items-center gap-1.5 mt-1">
              <PawPrint size={14} className="text-slate-400" />
              <span className="truncate">{pet.breed} ({pet.type})</span>
            </p>
          </div>
          <motion.button 
            whileTap={{ scale: 0.9 }}
            onClick={onToggleFavorite}
            className={`p-2 rounded-full transition-colors border-2 shrink-0 ${pet.is_favorite ? 'bg-pink-100 text-pink-500 border-pink-200' : 'bg-slate-50 text-slate-400 border-slate-100'}`}
          >
            <Heart size={20} fill={pet.is_favorite ? "currentColor" : "none"} />
          </motion.button>
        </div>

        <div className="grid grid-cols-3 gap-2 mb-6">
          <div className="bg-slate-50 py-4 px-2 rounded-2xl text-center border border-slate-100 flex flex-col justify-center">
            <p className="text-sm font-black text-slate-800 mb-1 leading-tight">{pet.age || '-'}</p>
            <p className="text-[11px] font-black text-slate-400 uppercase tracking-wider">อายุ</p>
          </div>
          <div className="bg-slate-50 py-4 px-1 rounded-2xl text-center border border-slate-100 flex flex-col justify-center min-w-0">
            <p className="text-xl font-black text-slate-800 mb-1 truncate">
              {pet.gender}
            </p>
            <p className="text-[11px] font-black text-slate-400 uppercase tracking-wider">เพศ</p>
          </div>
          <div className="bg-slate-50 py-4 px-2 rounded-2xl text-center border border-slate-100 flex flex-col justify-center">
            <div className="flex items-baseline justify-center gap-0.5 mb-1">
              <span className="text-2xl font-black text-slate-800">{pet.weight}</span>
              <span className="text-xs font-bold text-slate-800">Kg</span>
            </div>
            <p className="text-[11px] font-black text-slate-400 uppercase tracking-wider">น้ำหนัก</p>
          </div>
        </div>

        <div className="mb-6 space-y-3">
          <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
            <HeartPulse size={18} className="text-pink-500" /> ข้อมูลสุขภาพ
          </h3>
          <div className="bg-slate-50/50 p-6 rounded-[2rem] border border-slate-100 space-y-4">
            <div className="flex items-baseline gap-1">
              <span className="font-bold text-slate-400 text-xs tracking-tight shrink-0">ความยาวขน :</span>
              <span className="font-black text-slate-800 text-[13px] tracking-tight">{pet.fur_length || '-'}</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="font-bold text-slate-400 text-xs tracking-tight shrink-0">วันเกิด :</span>
              <span className="font-black text-slate-800 text-[13px] tracking-tight">{pet.birth_date || '-'}</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="font-bold text-slate-400 text-xs tracking-tight shrink-0">โรคประจำตัว :</span>
              <span className="font-black text-slate-800 text-[13px] tracking-tight">{pet.medical_condition || '-'}</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="font-bold text-slate-400 text-xs tracking-tight shrink-0">ข้อควรระวัง :</span>
              <span className="font-black text-slate-800 text-[13px] tracking-tight">{pet.precautions || '-'}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-6 px-6">
        <h3 className="text-lg font-black text-slate-800 mb-4">{pet.name}'s collection</h3>
        
        <div className="bg-[#fff6ed] rounded-[2.5rem] border-t-8 border-[#c28856] relative shadow-lg border-2 border-[#c28856] shadow-soft mb-8">
          <div className="absolute -top-3 left-0 right-0 flex justify-around px-8">
            {[1,2,3,4,5].map(i => <div key={i} className="w-3 h-5 bg-[#c28856] rounded-full" />)}
          </div>

          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h4 className="text-lg font-black text-[#4A2C0F]">ความชอบส่วนตัว</h4>
              <button 
                onClick={onEditPreferences} 
                className="p-1.5 bg-[#D4B89A] rounded-full text-[#4A2C0F] hover:bg-[#E0C7A9] transition-colors border border-black/10"
              >
                <Pencil size={16} />
              </button>
            </div>

            <div className="space-y-4">
              {hasPreferences ? (
                pet.custom_preferences?.map((pref, index) => (
                  <div key={index} className="flex items-center gap-3 bg-white p-4 rounded-2xl shadow-sm border border-slate-50">
                    <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center text-slate-500 text-xl shadow-inner">
                      <Tag size={20} /> 
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 font-medium">{pref.label}</p>
                      <p className="font-bold text-slate-800 text-sm">{pref.value}</p>
                    </div>
                  </div>
                ))
              ) : (
                <button 
                  onClick={onEditPreferences} 
                  className="w-full py-4 text-center text-[#4A2C0F] text-sm bg-[#F0E6D2] rounded-2xl border border-[#D4B89A] hover:bg-[#E0C7A9] transition-colors flex items-center justify-center gap-2"
                >
                  <Plus size={16} /> เพิ่มความชอบส่วนตัว
                </button>
              )}
            </div>
          </div>
        </div>

        <button 
          onClick={() => setShowDeleteConfirm(true)}
          className="w-full py-4 flex items-center justify-center gap-2 bg-red-50 text-red-500 font-bold rounded-2xl border-2 border-red-100 hover:bg-red-100 transition-colors active:scale-95"
        >
          <Trash2 size={20} />
          ลบข้อมูลสัตว์เลี้ยง
        </button>
      </div>

      <AnimatePresence>
        {showDeleteConfirm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDeleteConfirm(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="relative w-full max-w-xs bg-white rounded-[2.5rem] border-[3px] border-slate-800 shadow-soft p-8 text-center overflow-hidden"
            >
               <div className="w-20 h-20 bg-red-100 border-2 border-slate-800 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm">
                  <AlertTriangle size={40} className="text-red-600" />
               </div>
               <h3 className="text-2xl font-black text-slate-800 mb-3">ยืนยันการลบ?</h3>
               <p className="text-sm font-bold text-slate-500 mb-8 leading-relaxed">
                  คุณแน่ใจหรือไม่ว่าต้องการลบข้อมูลของ <span className="text-red-500 underline decoration-2 underline-offset-4">น้อง{pet.name}</span> ออกจากระบบ?
               </p>
               <div className="space-y-4">
                  <button 
                    onClick={() => {
                      onDeletePet(pet.id);
                      setShowDeleteConfirm(false);
                    }}
                    className="w-full py-4 bg-red-500 text-white rounded-2xl font-black border-2 border-slate-800 shadow-[4px_4px_0px_0px_#000] active:translate-y-1 active:shadow-none transition-all"
                  >
                    ยืนยันการลบข้อมูล
                  </button>
                  <button 
                    onClick={() => setShowDeleteConfirm(false)}
                    className="w-full py-4 bg-white text-slate-800 rounded-2xl font-black border-2 border-slate-800 shadow-[4px_4px_0px_0px_#E2E8F0] active:translate-y-1 active:shadow-none transition-all"
                  >
                    ยกเลิก
                  </button>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default PetDetailView;