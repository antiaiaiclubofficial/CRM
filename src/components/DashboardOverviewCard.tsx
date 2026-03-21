"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Crown, PawPrint, Calendar, Clock, Scissors, Bath, ChevronRight } from 'lucide-react';

interface Pet {
  id: number;
  name: string;
  type: string;
  breed: string;
  color: string;
  icon: string;
}

interface Appointment {
  id: number;
  petName: string;
  service: string;
  date: string;
  time: string;
  icon: React.ReactNode;
  bg: string;
}

interface OwnerProfile {
  firstName: string;
  lastName: string;
  gender: string;
  age: string;
  phone: string;
  address: string;
  email: string;
}

interface DashboardOverviewCardProps {
  ownerProfile: OwnerProfile;
  userPoints: number;
  pets: Pet[];
  upcomingAppointments: Appointment[];
  onViewAllPets: () => void;
  onViewAllAppointments: () => void;
}

const DashboardOverviewCard = ({
  ownerProfile,
  userPoints,
  pets,
  upcomingAppointments,
  onViewAllPets,
  onViewAllAppointments,
}: DashboardOverviewCardProps) => {
  const nextAppointment = upcomingAppointments.length > 0 ? upcomingAppointments[0] : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden p-6 rounded-[2rem] bg-gradient-to-br from-[#FFD8E4] via-[#FFE3BC] to-[#B2F2BB] shadow-xl shadow-pink-100/50 space-y-6"
    >
      {/* Watermark Paw Prints */}
      <PawPrint className="absolute -right-4 -top-4 w-32 h-32 text-white/20 rotate-12" />
      <PawPrint className="absolute -left-8 -bottom-8 w-24 h-24 text-white/10 -rotate-12" />

      <div className="relative z-10 space-y-6">
        {/* Membership Info */}
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-sm font-medium text-slate-600">สมาชิกระดับ</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="bg-white/90 px-3 py-1 rounded-full text-xs font-bold text-amber-600 flex items-center gap-1">
                <Crown size={12} fill="currentColor" />
                GOLD MEMBER
              </span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-500">ID: PET-8899</p>
            <p className="font-bold text-slate-800">คุณ{ownerProfile.firstName} {ownerProfile.lastName}</p>
          </div>
        </div>

        <div className="mb-4">
          <p className="text-xs text-slate-600 mb-1">คะแนนสะสมของคุณ</p>
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-bold text-slate-800">{userPoints.toLocaleString()}</span>
            <span className="text-sm text-slate-600">Points</span>
          </div>
        </div>

        <div className="w-full bg-white/40 h-3 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: '80%' }} // Assuming 80% progress for Gold
            transition={{ duration: 1, ease: "easeOut" }}
            className="bg-white h-full rounded-full"
          />
        </div>
        <p className="text-[10px] text-slate-600 text-center font-medium">
          อีก 250 คะแนน เพื่อเลื่อนเป็น <span className="text-slate-800 font-bold">Platinum Member</span>
        </p>

        {/* Upcoming Appointment Summary */}
        {nextAppointment && (
          <motion.div
            whileTap={{ scale: 0.98 }}
            className="bg-white p-4 rounded-2xl shadow-sm border border-slate-50 flex items-center gap-4 mt-6 cursor-pointer group"
            onClick={onViewAllAppointments}
          >
            <div className={`w-12 h-12 ${nextAppointment.bg} rounded-xl flex items-center justify-center text-lg`}>
              {nextAppointment.icon}
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-sm text-slate-800 truncate">{nextAppointment.service} - {nextAppointment.petName}</h4>
              <div className="flex items-center gap-3 mt-1">
                <div className="flex items-center gap-1 text-[10px] text-slate-500">
                  <Calendar size={10} />
                  {nextAppointment.date}
                </div>
                <div className="flex items-center gap-1 text-[10px] text-slate-500">
                  <Clock size={10} />
                  {nextAppointment.time}
                </div>
              </div>
            </div>
            <ChevronRight size={16} className="text-slate-300 group-hover:text-pink-400 transition-colors" />
          </motion.div>
        )}
        {!nextAppointment && (
          <div className="bg-white/50 border-2 border-dashed border-slate-200 rounded-2xl p-4 text-center mt-6">
            <p className="text-xs text-slate-400">ไม่มีรายการนัดหมายเร็วๆ นี้</p>
          </div>
        )}

        {/* Pet Summary */}
        <motion.div
          whileTap={{ scale: 0.98 }}
          className="bg-white p-4 rounded-2xl shadow-sm border border-slate-50 flex items-center justify-between mt-4 cursor-pointer group"
          onClick={onViewAllPets}
        >
          <div className="flex items-center gap-3">
            <PawPrint size={20} className="text-pink-500" />
            <p className="text-sm font-medium text-slate-700">คุณมีสัตว์เลี้ยง <span className="font-bold">{pets.length}</span> ตัว</p>
          </div>
          <ChevronRight size={16} className="text-slate-300 group-hover:text-pink-400 transition-colors" />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default DashboardOverviewCard;