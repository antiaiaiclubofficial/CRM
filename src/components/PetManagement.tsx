"use client";

import React from 'react';
import { Plus } from 'lucide-react'; // Import Plus icon
import { motion } from 'framer-motion';
import PetCategoryCard from './PetCategoryCard'; // Import the new card component

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
  color: string; // Existing: for old icon background
  icon: string; // Existing: Emoji icon
  furLength?: string;
  customPreferences?: { id: string; label: string; value: string; }[];
  imageUrl: string; // New: URL for the pet's image
  cardBgColor: string; // New: Specific hex color for the inner background
  hasHeartIcon?: boolean; // New: for the heart icon on Persian cat
}

interface PetManagementProps {
  pets: Pet[];
  onBack: () => void; // New prop for back button
  onViewDetails: (pet: Pet) => void; // Keep this for clicking on a card
  onAddPet: () => void; // New prop for adding a new pet
}

const PetManagement = ({ pets, onBack, onViewDetails, onAddPet }: PetManagementProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6 pb-20"
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-4"> {/* Changed to justify-between and items-center */}
        <h2 className="text-xl font-bold text-slate-800">สัตว์เลี้ยงของฉัน</h2>
        <button 
          onClick={onAddPet}
          className="p-2 bg-pink-100 text-pink-700 rounded-full active:scale-95 transition-all"
        >
          <Plus size={20} />
        </button>
      </div>

      {/* Pet Grid */}
      <div className="grid grid-cols-2 gap-4">
        {pets.map((pet) => (
          <PetCategoryCard
            key={pet.id}
            pet={pet}
            onClick={() => onViewDetails(pet)}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default PetManagement;