"use client";

import React from 'react';
import { Plus, PawPrint } from 'lucide-react';
import { motion } from 'framer-motion';
import PetCategoryCard from './PetCategoryCard';

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
  cardBgColor: string;
  isFavorite?: boolean;
}

interface PetManagementProps {
  pets: Pet[];
  onBack: () => void;
  onViewDetails: (pet: Pet) => void;
  onAddPet: () => void;
  onToggleFavorite?: (petId: number, currentFav: boolean) => void;
}

const PetManagement = ({ pets, onViewDetails, onAddPet, onToggleFavorite }: PetManagementProps) => {
  const leftColumnPets = pets.filter((_, index) => index % 2 === 0);
  const rightColumnPets = pets.filter((_, index) => index % 2 !== 0);

  const handleToggleFav = (e: React.MouseEvent, petId: number, currentFav: boolean) => {
    e.stopPropagation(); // กันไม่ให้กดแล้วไปหน้า Detail
    onToggleFavorite?.(petId, currentFav);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6 pb-20"
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-4 px-1">
        <h2 className="text-xl font-bold text-slate-800">สัตว์เลี้ยงของฉัน</h2>
        <button 
          onClick={onAddPet}
          className="p-2 bg-pink-100 text-pink-700 rounded-full active:scale-95 transition-all border border-pink-200"
        >
          <Plus size={20} />
        </button>
      </div>

      {pets.length > 0 ? (
        <div className="flex gap-4 items-start">
          {/* Left Column */}
          <div className="flex-1 space-y-4">
            {leftColumnPets.map((pet) => (
              <PetCategoryCard
                key={pet.id}
                pet={{
                  id: pet.id,
                  name: pet.name,
                  breed: pet.breed,
                  imageUrl: pet.imageUrl,
                  weight: pet.weight,
                  gender: pet.gender,
                  cardBgColor: pet.cardBgColor,
                  isFavorite: pet.isFavorite
                }}
                onClick={() => onViewDetails(pet)}
                onToggleFavorite={handleToggleFav}
              />
            ))}
          </div>

          {/* Right Column */}
          <div className="flex-1 space-y-4">
            {rightColumnPets.map((pet) => (
              <PetCategoryCard
                key={pet.id}
                pet={{
                  id: pet.id,
                  name: pet.name,
                  breed: pet.breed,
                  imageUrl: pet.imageUrl,
                  weight: pet.weight,
                  gender: pet.gender,
                  cardBgColor: pet.cardBgColor,
                  isFavorite: pet.isFavorite
                }}
                onClick={() => onViewDetails(pet)}
                onToggleFavorite={handleToggleFav}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-24 h-24 bg-white border-2 border-dashed border-slate-200 rounded-full flex items-center justify-center mb-6 shadow-sm"
          >
            <PawPrint size={48} className="text-slate-300" />
          </motion.div>
          <h3 className="text-lg font-bold text-slate-800 mb-2">ยังไม่มีเด็กๆ ในสังกัดเลยค่ะ 🏠</h3>
          <p className="text-sm text-slate-500 mb-8 leading-relaxed">
            มาลงทะเบียนน้องๆ เพื่อเก็บประวัติสุขภาพ<br/>และรับสิทธิพิเศษสุด Exclusive กันนะคะ ✨
          </p>
          <button
            onClick={onAddPet}
            className="px-10 py-4 bg-pink-500 text-white rounded-2xl font-black shadow-lg shadow-pink-200 active:translate-y-0.5 active:shadow-none transition-all flex items-center gap-2 border-2 border-black"
          >
            <Plus size={20} strokeWidth={3} /> เพิ่มสมาชิกคนสำคัญ
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default PetManagement;