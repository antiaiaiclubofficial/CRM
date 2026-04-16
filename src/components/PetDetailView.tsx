"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, Edit2, Heart, MapPin, Tag, Plus 
} from 'lucide-react';

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
  furLength?: string;
  customPreferences?: { id: string; label: string; value: string; }[];
  imageUrl: string;
  isFavorite?: boolean;
}

interface PetDetailViewProps {
  pet: Pet;
  onBack: () => void;
  onStartEdit: (pet: Pet) => void;
  onDeletePet: (id: number) => void;
  totalServiceCost: number;
  onViewServiceHistoryForPet: (petName: string) => void;
  onEditPreferences: () => void;
  onToggleFavorite: () => void;
}

const PetDetailView = ({ pet, onBack, onEditPreferences, onToggleFavorite }: PetDetailViewProps) => {
  const getGenderDisplay = (gender: string) => {
    if (gender === 'ผู้') return 'Male';
    if (gender === 'เมีย') return 'Female';
    return 'Unknown';
  };

  const hasPreferences = pet.customPreferences && pet.customPreferences.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative min-h-screen bg-[#FFF9F0] pb-20"
    >
      {/* Back Button - Moved higher and increased Z-index */}
      <div className="absolute top-2 left-0 z-[60]">
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onBack();
          }} 
          className="p-2.5 bg-emerald-400 text-white rounded-xl shadow-lg active:scale-95 transition-transform"
        >
          <ArrowLeft size={24} />
        </button>
      </div>

      <div className="relative w-full h-64 flex items-center justify-center pt-16 pb-8 z-20">
        <div className="relative w-48 h-48 rounded-full border-[6px] border-amber-400 flex items-center justify-center overflow-hidden shadow-lg">
          <img src={pet.imageUrl} alt={pet.name} className="w-full h-full object-cover" />
        </div>
      </div>

      <div className="relative bg-white rounded-[2rem] p-6 mx-6 -mt-8 shadow-xl z-10 border-2 border-black shadow-soft">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">{pet.name}</h2>
            <p className="text-sm text-slate-500 flex items-center gap-1 mt-1">
              <MapPin size={14} className="text-slate-400" />
              {pet.breed} ({pet.type})
            </p>
          </div>
          <motion.button 
            whileTap={{ scale: 0.9 }}
            onClick={onToggleFavorite}
            className={`p-2 rounded-full transition-colors ${pet.isFavorite ? 'bg-pink-100 text-pink-500' : 'bg-slate-100 text-slate-400'}`}
          >
            <Heart size={20} fill={pet.isFavorite ? "currentColor" : "none"} />
          </motion.button>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-slate-50 p-3 rounded-xl text-center">
            <p className="text-lg font-bold text-slate-800">{pet.age} ปี</p>
            <p className="text-xs text-slate-500">Age</p>
          </div>
          <div className="bg-slate-50 p-3 rounded-xl text-center">
            <p className="text-lg font-bold text-slate-800">{getGenderDisplay(pet.gender)}</p>
            <p className="text-xs text-slate-500">Gender</p>
          </div>
          <div className="bg-slate-50 p-3 rounded-xl text-center">
            <p className="text-lg font-bold text-slate-800">{pet.weight} Kg</p>
            <p className="text-xs text-slate-500">Weight</p>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-bold text-slate-800 mb-2">Note :</h3>
          <div className="text-sm text-slate-700 space-y-1">
            {pet.medicalCondition && <p>โรคประจำตัว: <span className="font-medium">{pet.medicalCondition}</span></p>}
            {pet.precautions && <p>ข้อควรระวัง: <span className="font-medium">{pet.precautions}</span></p>}
            {(!pet.medicalCondition && !pet.precautions) && <p>ไม่มีข้อมูลเพิ่มเติม</p>}
          </div>
        </div>
      </div>

      <div className="pt-4 px-6">
        <h3 className="text-lg font-black text-slate-800 mb-4">{pet.name}'s collection</h3>
        
        <div className="bg-[#fff6ed] rounded-[2.5rem] border-t-8 border-[#c28856] relative shadow-lg border-2 border-[#c28856] shadow-soft">
          <div className="absolute -top-3 left-0 right-0 flex justify-around px-8">
            {[1,2,3,4,5].map(i => <div key={i} className="w-3 h-5 bg-[#c28856] rounded-full" />)}
          </div>

          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h4 className="text-lg font-black text-[#4A2C0F]">ความชอบส่วนตัว</h4>
              <button 
                onClick={onEditPreferences} 
                className="p-1.5 bg-[#D4B89A] rounded-full text-[#4A2C0F] hover:bg-[#E0C7A9] transition-colors"
              >
                <Edit2 size={16} />
              </button>
            </div>

            <div className="space-y-4">
              {hasPreferences ? (
                pet.customPreferences?.map((pref, index) => (
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
      </div>
    </motion.div>
  );
};

export default PetDetailView;