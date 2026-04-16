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
  isFavorite?: boolean; // New: for the heart icon on Persian cat
}

interface PetManagementProps {
  pets: Pet[];
  onBack: () => void; // New prop for back button
  onViewDetails: (pet: Pet) => void; // Keep this for clicking on a card
  onAddPet: () => void; // New prop for adding a new pet
}

const PetManagement = ({ pets, onViewDetails, onAddPet }: PetManagementProps) => {
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
          className="p-2 bg-pink-100 text-pink-700 rounded-full active:scale-95 transition-all"
        >
          <Plus size={20} />
        </button>
      </div>

      {/* Masonry Layout for tight packing (like previous version) */}
      {/* Note: Columns fill top-to-bottom, so the visual 'Left-to-Right' flow is handled by the data order */}
      <div className="columns-2 gap-4 space-y-4">
        {pets.map((pet) => (
          <div key={pet.id} className="break-inside-avoid mb-4">
            <PetCategoryCard
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
            />
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default PetManagement;