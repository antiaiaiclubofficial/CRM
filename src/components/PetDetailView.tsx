"use client";

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Pencil, Heart, PawPrint, Tag, Plus, HeartPulse, Trash2, AlertTriangle, X,
  LayoutGrid, Activity, History, FileText, Stethoscope, Syringe
} from 'lucide-react';
import PetHealthOverview from './PetHealthOverview';

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
  const [activeTab, setActiveTab] = useState('overview');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const healthData = useMemo(() => {
    let score = 70;
    if (pet.weight) score += 10;
    if (!pet.medical_condition) score += 15;
    if (pet.age && parseInt(pet.age) < 5) score += 5;
    
    score = Math.min(100, score);

    let status = "สุขภาพดี";
    let subStatus = "ดูแลดีมากเลย!";
    if (score < 80) { status = "ปานกลาง"; subStatus = "อย่าลืมพาน้องไปตรวจสุขภาพนะคะ"; }
    if (score < 50) { status = "ควรระวัง"; subStatus = "แนะนำให้ปรึกษาสัตวแพทย์ค่ะ"; }

    return { score, status, subStatus };
  }, [pet]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative bg-[#FFF9F0] pb-24 pt-16"
    >
      {/* Top Header Controls */}
      <div className="absolute top-4 left-6 right-6 flex justify-between items-center z-[60]">
        <button 
          onClick={onBack} 
          className="p-2.5 bg-white/80 backdrop-blur-md text-slate-800 rounded-2xl shadow-sm active:scale-95 transition-all border border-slate-100"
        >
          <ArrowLeft size={24} />
        </button>
        
        <button 
          onClick={() => onStartEdit(pet)} 
          className="p-2.5 bg-slate-900 text-white rounded-2xl shadow-lg active:scale-95 transition-transform flex items-center gap-1.5 px-4"
        >
          <Pencil size={18} />
          <span className="text-sm font-bold">แก้ไขข้อมูล</span>
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="px-6 mb-6 mt-4">
        <div className="bg-white/50 backdrop-blur-sm p-1.5 rounded-full flex gap-1 border border-black/5 shadow-sm">
          <TabButton active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} label="ภาพรวม" icon={<LayoutGrid size={14} />} />
          <TabButton active={activeTab === 'health'} onClick={() => setActiveTab('health')} label="สุขภาพ" icon={<Activity size={14} />} />
          <TabButton active={activeTab === 'history'} onClick={() => setActiveTab('history')} label="ประวัติ" icon={<History size={14} />} />
          <TabButton active={activeTab === 'notes'} onClick={() => setActiveTab('notes')} label="โน้ต" icon={<FileText size={14} />} />
        </div>
      </div>

      <div className="px-6 space-y-6">
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div 
              key="overview"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {/* Refactored Pet Main Info Card */}
              <div className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-slate-50 flex flex-col sm:flex-row gap-6 items-center sm:items-start">
                {/* Image Section - Now on the left */}
                <div className="relative shrink-0">
                  <div className="w-32 h-32 rounded-[2.5rem] overflow-hidden border-4 border-amber-400 shadow-md">
                    <img src={pet.image_url} alt={pet.name} className="w-full h-full object-cover" />
                  </div>
                </div>

                {/* Info Section - Now on the right */}
                <div className="flex-1 min-w-0 w-full">
                  <div className="flex justify-between items-start mb-4">
                    <div className="min-w-0 pr-2">
                      <h2 className="text-3xl font-black text-slate-800 truncate leading-tight">{pet.name}</h2>
                      <p className="text-sm text-slate-500 font-bold flex items-center gap-1.5 mt-1">
                        <PawPrint size={14} className="text-slate-400" />
                        <span className="truncate">{pet.breed}</span>
                      </p>
                    </div>
                    <button 
                      onClick={onToggleFavorite} 
                      className={`p-3 rounded-full transition-all ${
                        pet.is_favorite 
                          ? 'bg-pink-50 text-pink-500' 
                          : 'bg-slate-50 text-slate-300'
                      }`}
                    >
                      <Heart size={24} fill={pet.is_favorite ? "currentColor" : "none"} strokeWidth={pet.is_favorite ? 2 : 2.5} />
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                     <InfoBox value={pet.age || '-'} label="อายุ" />
                     <InfoBox value={pet.gender} label="เพศ" />
                     <InfoBox value={`${pet.weight} Kg`} label="น้ำหนัก" />
                  </div>
                </div>
              </div>

              <PetHealthOverview 
                score={healthData.score}
                statusText={healthData.status}
                subStatusText={healthData.subStatus}
                lastUpdate="วันนี้"
                onActionClick={(type) => setActiveTab('health')}
              />
            </motion.div>
          )}

          {activeTab === 'health' && (
            <motion.div key="health" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-50">
                <h3 className="text-lg font-black text-slate-800 mb-4 flex items-center gap-2">
                  <HeartPulse size={20} className="text-pink-500" /> รายละเอียดสุขภาพ
                </h3>
                <div className="space-y-4">
                  <HealthItem label="โรคประจำตัว" value={pet.medical_condition || 'ไม่มี'} />
                  <HealthItem label="ข้อควรระวัง" value={pet.precautions || 'ไม่มี'} />
                  <HealthItem label="ความยาวขน" value={pet.fur_length || '-'} />
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-black text-slate-800 px-2">ไทม์ไลน์สุขภาพ</h3>
                <div className="relative pl-8 space-y-8 before:absolute before:left-[15px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                   <TimelineItem title="รับบริการอาบน้ำตัดขน" date="15 พ.ค. 2569" type="grooming" />
                   <TimelineItem title="ฉีดวัคซีนรวม (รายปี)" date="10 พ.ค. 2569" type="vaccine" />
                   <TimelineItem title="ตรวจสุขภาพประจำเดือน" date="1 พ.ค. 2569" type="checkup" />
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'history' && (
            <motion.div key="history" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center py-12">
               <History size={48} className="mx-auto text-slate-200 mb-4" />
               <p className="text-slate-400 font-bold">ยังไม่มีข้อมูลประวัติการรักษา</p>
            </motion.div>
          )}

          {activeTab === 'notes' && (
            <motion.div key="notes" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
               <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-lg font-black text-slate-800">ความชอบส่วนตัว</h4>
                    <button onClick={onEditPreferences} className="p-1.5 bg-slate-100 rounded-full text-slate-500">
                      <Pencil size={16} />
                    </button>
                  </div>
                  <div className="space-y-3">
                    {pet.custom_preferences?.map((pref, i) => (
                      <div key={i} className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <Tag size={16} className="text-pink-500" />
                        <span className="text-sm font-bold text-slate-700">{pref.label}: {pref.value}</span>
                      </div>
                    ))}
                  </div>
               </div>
            </motion.div>
          )}
        </AnimatePresence>

        <button 
          onClick={() => setShowDeleteConfirm(true)}
          className="w-full py-4 flex items-center justify-center gap-2 bg-red-50 text-red-500 font-bold rounded-2xl border border-red-100 mt-8 active:scale-95 transition-transform"
        >
          <Trash2 size={20} />
          ลบข้อมูลสัตว์เลี้ยง
        </button>
      </div>

      <AnimatePresence>
        {showDeleteConfirm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowDeleteConfirm(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="relative w-full max-w-xs bg-white rounded-[2.5rem] shadow-2xl p-8 text-center border border-slate-100">
               <div className="w-20 h-20 bg-red-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
                  <AlertTriangle size={40} className="text-red-600" />
               </div>
               <h3 className="text-2xl font-black text-slate-800 mb-2">ยืนยันการลบ?</h3>
               <p className="text-sm text-slate-500 mb-8">ข้อมูลของน้อง {pet.name} จะหายไปอย่างถาวร</p>
               <div className="space-y-3">
                  <button onClick={() => { onDeletePet(pet.id); setShowDeleteConfirm(false); }} className="w-full py-4 bg-red-500 text-white rounded-2xl font-black shadow-lg shadow-red-100 active:translate-y-1 transition-all">ยืนยันการลบ</button>
                  <button onClick={() => setShowDeleteConfirm(false)} className="w-full py-4 bg-slate-100 text-slate-600 rounded-2xl font-black active:translate-y-1 transition-all">ยกเลิก</button>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const TabButton = ({ active, onClick, label, icon }: { active: boolean, onClick: () => void, label: string, icon: any }) => (
  <button 
    onClick={onClick}
    className={`flex-1 py-2 px-3 rounded-full flex items-center justify-center gap-1.5 transition-all ${
      active ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-500 hover:bg-white/50'
    }`}
  >
    {icon}
    <span className="text-[11px] font-black">{label}</span>
  </button>
);

const InfoBox = ({ value, label }: { value: string, label: string }) => (
  <div className="bg-slate-50/50 py-3 px-1 rounded-2xl text-center border border-slate-50">
    <p className="text-sm font-black text-slate-800 leading-tight mb-1 whitespace-pre-line">{value}</p>
    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{label}</p>
  </div>
);

const HealthItem = ({ label, value }: { label: string, value: string }) => (
  <div className="flex flex-col gap-1">
    <p className="text-[11px] font-black text-slate-400 uppercase tracking-wider">{label}</p>
    <p className="text-sm font-bold text-slate-700">{value}</p>
  </div>
);

const TimelineItem = ({ title, date, type }: { title: string, date: string, type: string }) => (
  <div className="relative">
    <div className={`absolute -left-[41px] top-0 w-7 h-7 rounded-full border-2 border-white shadow-sm flex items-center justify-center z-10 ${
      type === 'vaccine' ? 'bg-emerald-500 text-white' : 
      type === 'grooming' ? 'bg-pink-500 text-white' : 'bg-blue-500 text-white'
    }`}>
      {type === 'vaccine' ? <Syringe size={14} /> : type === 'grooming' ? <FileText size={14} /> : <Stethoscope size={14} />}
    </div>
    <div>
      <h5 className="text-sm font-black text-slate-800">{title}</h5>
      <p className="text-[10px] font-bold text-slate-400 mt-0.5">{date}</p>
    </div>
  </div>
);

export default PetDetailView;