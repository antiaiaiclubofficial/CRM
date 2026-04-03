"use client";

import React from 'react';
import { X } from 'lucide-react';
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
}

const PetManagement = ({ pets, onBack, onViewDetails }: PetManagementProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6 pb-20"
    >
      {/* Header */}
      <div className="flex justify-center items-center mb-6"> {/* Changed to justify-center */}
        <h2 className="text-xl font-bold text-slate-800">สัตว์เลี้ยงของฉัน</h2> {/* Removed -ml-10 */}
      </div>

      {/* Removed Subtitle */}
      {/* <p className="text-center text-slate-500 text-sm mb-6">All pet categories cat near you</p> */}

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