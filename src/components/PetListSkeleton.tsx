"use client";

import React from 'react';
import { motion } from 'framer-motion';

const PetListSkeleton = () => {
  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-4 px-1">
        <div className="h-6 w-32 bg-slate-200 rounded-lg animate-pulse" />
        <div className="h-4 w-12 bg-slate-100 rounded-lg animate-pulse" />
      </div>
      
      <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4 px-1">
        {[1, 2, 3].map((i) => (
          <div 
            key={i}
            className="flex-shrink-0 w-32 bg-white p-4 rounded-3xl border border-slate-50"
          >
            <div className="w-16 h-16 rounded-full bg-slate-100 mx-auto mb-3 animate-pulse" />
            <div className="h-4 w-20 bg-slate-100 rounded mx-auto mb-2 animate-pulse" />
            <div className="h-3 w-16 bg-slate-50 rounded mx-auto animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PetListSkeleton;