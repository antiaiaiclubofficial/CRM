"use client";

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Pencil, Heart, PawPrint, Tag, Plus, HeartPulse, Trash2, AlertTriangle, X,
  LayoutGrid, Activity, History, FileText, Stethoscope, Syringe, ChevronRight, Scale
} from 'lucide-react';
import PetHealthOverview from './PetHealthOverview';
import PetWeightChart from './PetWeightChart';

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
  weight_history?: { date: string; weight: number; }[];
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
  const [showWeightDetail, setShowWeightDetail] = useState(false);

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

  // Mock weight history if none provided for better UX
  const weightHistory = pet.weight_history || [
    { date: '1 ม.ค.', weight: parseFloat(pet.weight) - 0.5 || 4.5 },
    { date: '15 ก.พ.', weight: parseFloat(pet.weight) - 0.2 || 4.8 },
    { date: '10 มี.ค.', weight: parseFloat(pet.weight) || 5.0 },
  ];

  const handleHealthAction = (type: string) => {
    if (type === 'weight') {
      setShowWeightDetail(true);
    } else {
      setActiveTab('health');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative bg-[#FFF9F0] pb-24"
    >
      {/* Top Section */}
      <div className="px-[2px] pt-0 flex flex-col">
        <div className="flex items-center">
          <button 
            onClick={showWeightDetail ? () => setShowWeightDetail(false) : onBack} 
            className="p-1 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <ArrowLeft size={30} strokeWidth={2.5} />
          </button>
        </div>

        {!showWeightDetail && (
          <div className="mt-[2px] mb-4 flex items-center gap-4">
            <div 
              onClick={() => onStartEdit(pet)}
              className="w-24 h-24 rounded-full overflow-hidden bg-slate-200 shrink-0 shadow-md cursor-pointer active:opacity-70 transition-opacity"
            >
              <img src={pet.image_url} alt={pet.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0" onClick={() => onStartEdit(pet)}>
              <h2 className="text-2xl font-black text-slate-800 leading-tight">{pet.name}</h2>
              <p className="text-sm font-bold text-slate-400 mt-0.5">
                {pet.type} • {pet.breed}
              </p>
              <p className="text-sm font-bold text-slate-400">
                {pet.age || '-'} • {pet.weight || '-'} กก.
              </p>
            </div>
            
            <div className="flex flex-col gap-2 pr-3">
              <button 
                onClick={() => onStartEdit(pet)}
                className="p-2 bg-white rounded-full border border-slate-100 shadow-sm text-slate-400 active:scale-90 transition-transform"
              >
                <Pencil size={18} strokeWidth={2.5} />
              </button>
              <button 
                onClick={onToggleFavorite}
                className={`p-2 rounded-full border shadow-sm active:scale-90 transition-all ${
                  pet.is_favorite 
                    ? 'bg-pink-50 border-pink-100 text-pink-500' 
                    : 'bg-white border-slate-100 text-slate-400'
                }`}
              >
                <Heart size={18} fill={pet.is_favorite ? "currentColor" : "none"} strokeWidth={2.5} />
              </button>
            </div>
          </div>
        )}
      </div>

      {showWeightDetail ? (
        <div className="px-[2px] pt-4">
           <div className="flex items-center gap-2 mb-6 px-1">
              <div className="p-2 bg-blue-100 rounded-2xl text-blue-600">
                <Scale size={20} />
              </div>
              <h3 className="text-2xl font-black text-slate-800">ประวัติน้ำหนัก: น้อง{pet.name}</h3>
           </div>
           <PetWeightChart data={weightHistory} petName={pet.name} />
        </div>
      ) : (
        <>
          {/* Tab Navigation */}
          <div className="px-[2px] mb-4">
            <div className="bg-white p-1 rounded-2xl flex gap-0.5 shadow-sm border border-slate-50 overflow-x-auto no-scrollbar">
              <TabButton active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} label="ภาพรวม" />
              <TabButton active={activeTab === 'health'} onClick={() => setActiveTab('health')} label="สุขภาพ" />
              <TabButton active={activeTab === 'history'} onClick={() => setActiveTab('history')} label="ประวัติ" />
              <TabButton active={activeTab === 'notes'} onClick={() => setActiveTab('notes')} label="โน้ต" />
            </div>
          </div>

          <div className="px-[2px] space-y-6">
            <AnimatePresence mode="wait">
              {activeTab === 'overview' && (
                <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                  <div className="px-1">
                    <PetHealthOverview 
                      score={healthData.score}
                      statusText={healthData.status}
                      subStatusText={healthData.subStatus}
                      lastUpdate="วันนี้"
                      onActionClick={handleHealthAction}
                    />
                  </div>
                </motion.div>
              )}

              {activeTab === 'health' && (
                <motion.div key="health" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 px-1">
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
                  
                  <div className="space-y-4 px-2">
                    <h3 className="text-lg font-black text-slate-800">ไทม์ไลน์สุขภาพ</h3>
                    <div className="relative pl-8 space-y-8 before:absolute before:left-[15px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                       <TimelineItem title="รับบริการอาบน้ำตัดขน" date="15 พ.ค. 2569" type="grooming" />
                       <TimelineItem title="ฉีดวัคซีนรวม (รายปี)" date="10 พ.ค. 2569" type="vaccine" />
                       <TimelineItem title="ตรวจสุขภาพประจำเดือน" date="1 พ.ค. 2569" type="checkup" />
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'history' && (
                <motion.div key="history" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center py-12 px-1">
                   <History size={48} className="mx-auto text-slate-200 mb-4" />
                   <p className="text-slate-400 font-bold">ยังไม่มีข้อมูลประวัติการรักษา</p>
                </motion.div>
              )}

              {activeTab === 'notes' && (
                <motion.div key="notes" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 px-1">
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

            <div className="pt-8 flex flex-col items-center gap-4 px-1">
              <button 
                onClick={() => setShowDeleteConfirm(true)}
                className="text-red-400 text-xs font-bold underline underline-offset-4 active:text-red-600 transition-colors"
              >
                ลบข้อมูลน้อง {pet.name}
              </button>
            </div>
          </div>
        </>
      )}

      <AnimatePresence>
        {showDeleteConfirm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-2">
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

const TabButton = ({ active, onClick, label }: { active: boolean, onClick: () => void, label: string }) => (
  <button 
    onClick={onClick}
    className={`flex-1 py-3 px-2 rounded-xl flex items-center justify-center gap-1 transition-all ${
      active ? 'bg-[#2D4A3E] text-white shadow-sm' : 'text-slate-400 font-bold hover:bg-slate-50'
    }`}
  >
    <span className="text-xs sm:text-sm font-black whitespace-nowrap">{label}</span>
  </button>
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