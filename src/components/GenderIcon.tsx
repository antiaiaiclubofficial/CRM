"use client";

import React from 'react';

interface GenderIconProps {
  size?: number;
  className?: string;
}

const GenderIcon = ({ size = 24, className = "" }: GenderIconProps) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 512 512" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      stroke="currentColor"
      strokeWidth="38"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Female Symbol - Top Left */}
      <circle cx="180" cy="150" r="90" />
      <path d="M180 240V340" />
      <path d="M130 290H230" />
      
      {/* Male Symbol - Bottom Right */}
      <circle cx="330" cy="360" r="90" />
      <path d="M394 296L460 230" />
      <path d="M400 230H460V290" />
    </svg>
  );
};

export default GenderIcon;