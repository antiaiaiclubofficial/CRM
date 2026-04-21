"use client";

import React from 'react';

interface AnalogScaleIconProps {
  size?: number;
  className?: string;
}

const AnalogScaleIcon = ({ size = 24, className = "" }: AnalogScaleIconProps) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 512 512" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      stroke="currentColor"
      strokeWidth="32"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Top Plate */}
      <path d="M48 112C48 94.3 62.3 80 80 80H432C449.7 80 464 94.3 464 112V128C464 145.7 449.7 160 432 160H80C62.3 160 48 145.7 48 128V112Z" />
      <path d="M256 160V192" />
      
      {/* Body */}
      <path d="M128 192H384L416 416H96L128 192Z" />
      
      {/* Dial Circle */}
      <circle cx="256" cy="304" r="80" />
      
      {/* Dial Markings */}
      <path d="M256 224V240" />
      <path d="M256 368V384" />
      <path d="M176 304H192" />
      <path d="M320 304H336" />
      
      {/* Needle */}
      <path d="M256 304L296 264" />
      <circle cx="256" cy="304" r="8" fill="currentColor" stroke="none" />
      
      {/* Feet */}
      <path d="M128 416V448H384V416" />
    </svg>
  );
};

export default AnalogScaleIcon;