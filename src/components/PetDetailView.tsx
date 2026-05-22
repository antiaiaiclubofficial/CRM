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
  onAddWeight: (petId: string | number, weight: number) => Promise<void>;
}

const PetDetailView = ({ pet, onBack, onStartEdit, onDeletePet, onEditPreferences, onToggleFavorite, onAddWeight }: PetDetailViewProps) => {
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

  const weightHistory = pet.weight_history || [];

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
      className="relative bg-surface pb-24"
    >
      {/* Top Section / Header */}
      <div className="px-1 pt-2 flex flex-col">
        <div className="flex items-center mb-4">
          <button 
            onClick={showWeightDetail ? () => setShowWeightDetail(false) : onBack} 
            className="p-1 text-primary/40 hover:text-primary transition-colors"
          >
            <ArrowLeft size={32} strokeWidth={2.5} />
          </button>
        </div>

        {!showWeightDetail && (
          <div className="flex items-center gap-6 px-2 mb-8">
            <div className="relative shrink-0">
              <div className="absolute inset-0 bg-tertiary/15 rounded-full blur-xl scale-125" />
              <div 
                onClick={() => onStartEdit(pet)}
                className="relative w-28 h-28 rounded-full overflow-hidden bg-white shadow-ambient border-none cursor-pointer active:scale-95 transition-all"
              >
                <img src={pet.image_url} alt={pet.name} className="w-full h-full object-cover" />
              </div>
            </div>
            
            <div className="flex-1 min-w-0" onClick={() => onStartEdit(pet)}>
              <h2 className="text-3xl font-black text-primary leading-tight tracking-tight uppercase">{pet.name}</h2>
              <p className="text-sm font-bold text-surface-variant opacity-60 mt-0.5">
                {pet.type} • {pet.breed}
              </p>
              <p className="text-sm font-bold text-surface-variant opacity-60">
                {pet.age || '-'} • {pet.weight || '-'} กก.
              </p>
            </div>
            
            <div className="flex flex-col gap-3">
              <button 
                onClick={() => onStartEdit(pet)}
                className="p-3 bg-white rounded-full shadow-ambient text-primary/40 hover:text-primary active:scale-90 transition-all border border-black/5"
              >
                <Pencil size={20} strokeWidth={2.5} />
              </button>
              <button 
                onClick={onToggleFavorite}
                className={`p-3 rounded-full shadow-ambient active:scale-90 transition-all border border-black/5 ${
                  pet.is_favorite 
                    ? 'bg-white text-pink-500' 
                    : 'bg-white text-primary/40'
                }`}
              >
                <Heart size={20} fill={pet.is_favorite ? "currentColor" : "none"} strokeWidth={2.5} />
              </button>
            </div>
          </div>
        )}
      </div>

      {showWeightDetail ? (
        <div className="px-1 pt-4">
           <div className="flex items-center gap-3 mb-8 px-2">
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 shadow-sm">
                <Scale size={24} />
              </div>
              <h3 className="text-2xl font-black text-primary tracking-tight">ประวัติน้ำหนัก: น้อง{pet.name}</h3>
           </div>
           <PetWeightChart 
              data={weightHistory} 
              petName={pet.name} 
              onAddWeight={(w) => onAddWeight(pet.id, w)} 
            />
        </div>
      ) : (
        <>
          {/* Tab Navigation (Pill Shaped) */}
          <div className="px-1 mb-8">
            <div className="bg-white p-1.5 rounded-full flex gap-1 shadow-ambient border border-black/5">
              <TabButton active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} label="ภาพรวม" />
              <TabButton active={activeTab === 'health'} onClick={() => setActiveTab('health')} label="สุขภาพ" />
              <TabButton active={activeTab === 'history'} onClick={() => setActiveTab('history')} label="ประวัติ" />
              <TabButton active={activeTab === 'notes'} onClick={() => setActiveTab('notes')} label="โน้ต" />
            </div>
          </div>

          <div className="px-1 space-y-8">
            <AnimatePresence mode="wait">
              {activeTab === 'overview' && (
                <motion.div key="overview" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="space-y-8">
                  <PetHealthOverview 
                    score={healthData.score}
                    statusText={healthData.status}
                    subStatusText={healthData.subStatus}
                    lastUpdate="วันนี้"
                    onActionClick={handleHealthAction}
                  />
                </motion.div>
              )}

              {activeTab === 'health' && (
                <motion.div key="health" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                  <div className="bg-white rounded-xl p-8 shadow-ambient border border-black/5">
                    <h3 className="text-xl font-bold text-primary mb-6 flex items-center gap-2">
                      <HeartPulse size={24} className="text-pink-500" /> รายละเอียดสุขภาพ
                    </h3>
                    <div className="space-y-6">
                      <HealthItem label="โรคประจำตัว" value={pet.medical_condition || 'ไม่มี'} />
                      <HealthItem label="ข้อควรระวัง" value={pet.precautions || 'ไม่มี'} />
                      <HealthItem label="ความยาวขน" value={pet.fur_length || '-'} />
                    </div>
                  </div>
                  
                  <div className="space-y-6 px-4">
                    <h3 className="text-xl font-bold text-primary tracking-tight">ไทม์ไลน์สุขภาพ</h3>
                    <div className="relative pl-10 space-y-10 before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-[2px] before:bg-surface-container">
                       <TimelineItem title="รับบริการอาบน้ำตัดขน" date="15 พ.ค. 2569" type="grooming" />
                       <TimelineItem title="ฉีดวัคซีนรวม (รายปี)" date="10 พ.ค. 2569" type="vaccine" />
                       <TimelineItem title="ตรวจสุขภาพประจำเดือน" date="1 พ.ค. 2569" type="checkup" />
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'history' && (
                <motion.div key="history" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-24 text-center">
                   <div className="w-20 h-20 bg-surface-container-low rounded-full flex items-center justify-center mx-auto mb-6">
                     <History size={32} className="text-primary/10" />
                   </div>
                   <p className="text-primary/30 font-black uppercase tracking-widest text-xs">ยังไม่มีข้อมูลประวัติการรักษา</p>
                </motion.div>
              )}

              {activeTab === 'notes' && (
                <motion.div key="notes" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                   <div className="bg-white p-8 rounded-xl shadow-ambient border border-black/5">
                      <div className="flex justify-between items-center mb-6">
                        <h4 className="text-xl font-bold text-primary tracking-tight">ความชอบส่วนตัว</h4>
                        <button onClick={onEditPreferences} className="p-2 bg-surface-container-low rounded-full text-surface-variant">
                          <Pencil size={18} />
                        </button>
                      </div>
                      <div className="space-y-4">
                        {pet.custom_preferences?.length ? (
                          pet.custom_preferences.map((pref, i) => (
                            <div key={i} className="flex items-center gap-4 bg-surface-container-low p-4 rounded-lg">
                              <Tag size={18} className="text-tertiary-fixed-dim" />
                              <span className="text-sm font-black text-primary uppercase">{pref.label}: {pref.value}</span>
                            </div>
                          ))
                        ) : (
                          <p className="text-sm font-bold text-surface-variant opacity-40 italic text-center py-4">ยังไม่ได้ระบุความชอบส่วนตัว</p>
                        )}
                      </div>
                   </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="pt-12 flex flex-col items-center gap-4">
              <button 
                onClick={() => setShowDeleteConfirm(true)}
                className="text-red-500 font-black uppercase tracking-widest text-[11px] underline underline-offset-8 decoration-red-500/20 hover:decoration-red-500 transition-all"
              >
                ลบข้อมูลน้อง {pet.name}
              </button>
            </div>
          </div>
        </>
      )}

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowDeleteConfirm(false)} className="absolute inset-0 bg-primary/60 backdrop-blur-md" />
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="relative w-full max-w-sm bg-white rounded-xl shadow-ambient p-10 text-center border border-black/5">
               <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-8">
                  <AlertTriangle size={48} className="text-red-500" />
               </div>
               <h3 className="text-2xl font-black text-primary mb-3 tracking-tight">ยืนยันการลบ?</h3>
               <p className="text-sm font-medium text-surface-variant opacity-70 mb-10 leading-relaxed">ข้อมูลทั้งหมดของน้อง {pet.name} จะหายไปอย่างถาวรและไม่สามารถกู้คืนได้</p>
               <div className="space-y-4">
                  <button onClick={() => { onDeletePet(pet.id); setShowDeleteConfirm(false); }} className="w-full py-5 bg-red-500 text-white rounded-lg font-black uppercase tracking-widest shadow-lg shadow-red-500/10 active:scale-95 transition-all">ยืนยันการลบ</button>
                  <button onClick={() => setShowDeleteConfirm(false)} className="w-full py-5 bg-surface-container-low text-primary rounded-lg font-black uppercase tracking-widest active:scale-95 transition-all">ยกเลิก</button>
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
    className={`flex-1 py-3 px-4 rounded-full flex items-center justify-center gap-1 transition-all duration-300 ${
      active ? 'bg-primary text-white shadow-lg' : 'text-primary/40 font-black uppercase tracking-widest text-[11px] hover:bg-surface-container-low'
    }`}
  >
    <span className="whitespace-nowrap">{label}</span>
  </button>
);

const HealthItem = ({ label, value }: { label: string, value: string }) => (
  <div className="flex flex-col gap-1">
    <p className="text-[11px] font-black text-primary/40 uppercase tracking-widest">{label}</p>
    <p className="text-base font-bold text-primary">{value}</p>
  </div>
);

const TimelineItem = ({ title, date, type }: { title: string, date: string, type: string }) => (
  <div className="relative">
    <div className={`absolute -left-[51px] top-0 w-10 h-10 rounded-full border-4 border-white shadow-ambient flex items-center justify-center z-10 ${
      type === 'vaccine' ? 'bg-[#E0F7F9] text-[#2BC0D3]' : 
      type === 'grooming' ? 'bg-[#FFF0F3] text-[#FF5C8A]' : 'bg-[#F2F9F0] text-[#64C44F]'
    }`}>
      {type === 'vaccine' ? <Syringe size={18} /> : type === 'grooming' ? <FileText size={18} /> : <Stethoscope size={18} />}
    </div>
    <div>
      <h5 className="text-base font-black text-primary tracking-tight">{title}</h5>
      <p className="text-[11px] font-bold text-primary/40 uppercase tracking-tight mt-0.5">{date}</p>
    </div>
  </div>
);

export default PetDetailView;