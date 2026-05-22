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

  // Define consistent slide animation
  const slideVariants = {
    initial: { x: 20, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: -20, opacity: 0 },
    transition: { type: "spring", damping: 25, stiffness: 300 }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative bg-surface pb-24"
    >
      {/* Compact Header Section */}
      <div className="px-1 pt-4">
        {showWeightDetail ? (
          <div className="flex items-center gap-3 mb-6 px-2">
            <button 
              onClick={() => setShowWeightDetail(false)} 
              className="p-1 text-primary/40 hover:text-primary transition-colors"
            >
              <ArrowLeft size={28} strokeWidth={2.5} />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 shadow-sm">
                <Scale size={20} />
              </div>
              <h3 className="text-xl font-black text-primary tracking-tight">น้ำหนัก: {pet.name}</h3>
            </div>
          </div>
        ) : (
          <div className="flex items-start gap-2 pl-0 pr-2 mb-6">
            <button 
              onClick={onBack} 
              className="mt-1 p-1 text-primary/40 hover:text-primary transition-colors shrink-0"
            >
              <ArrowLeft size={32} strokeWidth={2.5} />
            </button>
            
            <div className="flex-1 flex items-center gap-3 min-w-0">
              <div className="relative shrink-0">
                <div className="absolute inset-0 bg-tertiary/15 rounded-full blur-xl scale-125" />
                <div 
                  onClick={() => onStartEdit(pet)}
                  className="relative w-20 h-20 rounded-full overflow-hidden bg-white shadow-ambient border-none cursor-pointer active:scale-95 transition-all"
                >
                  <img src={pet.image_url} alt={pet.name} className="w-full h-full object-cover" />
                </div>
              </div>
              
              <div className="flex-1 min-w-0" onClick={() => onStartEdit(pet)}>
                <h2 className="text-2xl font-black text-primary leading-tight tracking-tight uppercase truncate">{pet.name}</h2>
                <p className="text-xs font-bold text-surface-variant opacity-60 mt-0.5 truncate">
                  {pet.type} • {pet.breed}
                </p>
                <p className="text-xs font-bold text-surface-variant opacity-60">
                  {pet.age || '-'} • {pet.weight || '-'} กก.
                </p>
              </div>
            </div>
            
            <div className="flex flex-col gap-2">
              <button 
                onClick={() => onStartEdit(pet)}
                className="p-2.5 bg-white rounded-full shadow-ambient text-primary/40 hover:text-primary active:scale-90 transition-all border border-black/5"
              >
                <Pencil size={18} strokeWidth={2.5} />
              </button>
              <button 
                onClick={onToggleFavorite}
                className={`p-2.5 rounded-full shadow-ambient active:scale-90 transition-all border border-black/5 ${
                  pet.is_favorite 
                    ? 'bg-white text-pink-500' 
                    : 'bg-white text-primary/40'
                }`}
              >
                <Heart size={18} fill={pet.is_favorite ? "currentColor" : "none"} strokeWidth={2.5} />
              </button>
            </div>
          </div>
        )}
      </div>

      {showWeightDetail ? (
        <div className="px-1 pt-2">
           <PetWeightChart 
              data={weightHistory} 
              petName={pet.name} 
              onAddWeight={(w) => onAddWeight(pet.id, w)} 
            />
        </div>
      ) : (
        <>
          {/* Tab Navigation */}
          <div className="px-1 mb-6">
            <div className="bg-white p-1.5 rounded-full flex gap-1 shadow-ambient border border-black/5">
              <TabButton active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} label="ภาพรวม" />
              <TabButton active={activeTab === 'health'} onClick={() => setActiveTab('health')} label="สุขภาพ" />
              <TabButton active={activeTab === 'history'} onClick={() => setActiveTab('history')} label="ประวัติ" />
              <TabButton active={activeTab === 'notes'} onClick={() => setActiveTab('notes')} label="โน้ต" />
            </div>
          </div>

          <div className="px-1 space-y-6">
            <AnimatePresence mode="wait">
              {activeTab === 'overview' && (
                <motion.div 
                  key="overview" 
                  initial={slideVariants.initial} 
                  animate={slideVariants.animate} 
                  exit={slideVariants.exit} 
                  transition={slideVariants.transition}
                  className="space-y-6"
                >
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
                <motion.div 
                  key="health" 
                  initial={slideVariants.initial} 
                  animate={slideVariants.animate} 
                  exit={slideVariants.exit} 
                  transition={slideVariants.transition}
                  className="space-y-6"
                >
                  <div className="bg-white rounded-xl p-6 shadow-ambient border border-black/5">
                    <h3 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
                      <HeartPulse size={20} className="text-pink-500" /> รายละเอียดสุขภาพ
                    </h3>
                    <div className="grid grid-cols-2 gap-6">
                      <HealthItem label="โรคประจำตัว" value={pet.medical_condition || 'ไม่มี'} />
                      <HealthItem label="ความยาวขน" value={pet.fur_length || '-'} />
                    </div>
                    <div className="mt-4 pt-4 border-t border-black/5">
                      <HealthItem label="ข้อควรระวัง" value={pet.precautions || 'ไม่มี'} />
                    </div>
                  </div>
                  
                  <div className="space-y-4 px-2">
                    <h3 className="text-lg font-bold text-primary tracking-tight">ไทม์ไลน์สุขภาพ</h3>
                    <div className="relative pl-10 space-y-8 before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-[2px] before:bg-surface-container">
                       <TimelineItem title="รับบริการอาบน้ำตัดขน" date="15 พ.ค. 2569" type="grooming" />
                       <TimelineItem title="ฉีดวัคซีนรวม (รายปี)" date="10 พ.ค. 2569" type="vaccine" />
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'history' && (
                <motion.div 
                  key="history" 
                  initial={slideVariants.initial} 
                  animate={slideVariants.animate} 
                  exit={slideVariants.exit} 
                  transition={slideVariants.transition}
                  className="py-20 text-center"
                >
                   <div className="w-16 h-16 bg-surface-container-low rounded-full flex items-center justify-center mx-auto mb-4">
                     <History size={28} className="text-primary/10" />
                   </div>
                   <p className="text-primary/30 font-black uppercase tracking-widest text-[10px]">ยังไม่มีข้อมูลประวัติการรักษา</p>
                </motion.div>
              )}

              {activeTab === 'notes' && (
                <motion.div 
                  key="notes" 
                  initial={slideVariants.initial} 
                  animate={slideVariants.animate} 
                  exit={slideVariants.exit} 
                  transition={slideVariants.transition}
                  className="space-y-6"
                >
                   <div className="bg-white p-6 rounded-xl shadow-ambient border border-black/5">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="text-lg font-bold text-primary tracking-tight">ความชอบส่วนตัว</h4>
                        <button onClick={onEditPreferences} className="p-2 bg-surface-container-low rounded-full text-surface-variant">
                          <Pencil size={16} />
                        </button>
                      </div>
                      <div className="space-y-3">
                        {pet.custom_preferences?.length ? (
                          pet.custom_preferences.map((pref, i) => (
                            <div key={i} className="flex items-center gap-3 bg-surface-container-low p-3 rounded-lg">
                              <Tag size={16} className="text-tertiary-fixed-dim" />
                              <span className="text-xs font-black text-primary uppercase">{pref.label}: {pref.value}</span>
                            </div>
                          ))
                        ) : (
                          <p className="text-xs font-bold text-surface-variant opacity-40 italic text-center py-4">ยังไม่ได้ระบุความชอบส่วนตัว</p>
                        )}
                      </div>
                   </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="pt-8 flex flex-col items-center gap-4">
              <button 
                onClick={() => setShowDeleteConfirm(true)}
                className="text-red-500 font-black uppercase tracking-widest text-[10px] underline underline-offset-8 decoration-red-500/20 hover:decoration-red-500 transition-all"
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
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="relative w-full max-sm bg-white rounded-xl shadow-ambient p-8 text-center border border-black/5">
               <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <AlertTriangle size={40} className="text-red-500" />
               </div>
               <h3 className="text-xl font-black text-primary mb-2 tracking-tight">ยืนยันการลบ?</h3>
               <p className="text-xs font-medium text-surface-variant opacity-70 mb-8 leading-relaxed">ข้อมูลทั้งหมดของน้อง {pet.name} จะหายไปอย่างถาวร</p>
               <div className="space-y-3">
                  <button onClick={() => { onDeletePet(pet.id); setShowDeleteConfirm(false); }} className="w-full py-4 bg-red-500 text-white rounded-lg font-black uppercase tracking-widest text-xs shadow-lg shadow-red-500/10 active:scale-95 transition-all">ยืนยันการลบ</button>
                  <button onClick={() => setShowDeleteConfirm(false)} className="w-full py-4 bg-surface-container-low text-primary rounded-lg font-black uppercase tracking-widest text-xs active:scale-95 transition-all">ยกเลิก</button>
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
    className={`flex-1 py-2.5 px-3 rounded-full flex items-center justify-center gap-1 transition-all duration-300 ${
      active ? 'bg-primary text-white shadow-lg' : 'text-primary/40 font-black uppercase tracking-widest text-[10px] hover:bg-surface-container-low'
    }`}
  >
    <span className="whitespace-nowrap">{label}</span>
  </button>
);

const HealthItem = ({ label, value }: { label: string, value: string }) => (
  <div className="flex flex-col gap-0.5">
    <p className="text-[10px] font-black text-primary/40 uppercase tracking-widest">{label}</p>
    <p className="text-sm font-bold text-primary leading-tight">{value}</p>
  </div>
);

const TimelineItem = ({ title, date, type }: { title: string, date: string, type: string }) => (
  <div className="relative">
    <div className={`absolute -left-[51px] top-0 w-9 h-9 rounded-full border-4 border-white shadow-ambient flex items-center justify-center z-10 ${
      type === 'vaccine' ? 'bg-[#E0F7F9] text-[#2BC0D3]' : 
      type === 'grooming' ? 'bg-[#FFF0F3] text-[#FF5C8A]' : 'bg-[#F2F9F0] text-[#64C44F]'
    }`}>
      {type === 'vaccine' ? <Syringe size={16} /> : type === 'grooming' ? <FileText size={16} /> : <Stethoscope size={16} />}
    </div>
    <div>
      <h5 className="text-sm font-black text-primary tracking-tight">{title}</h5>
      <p className="text-[10px] font-bold text-primary/40 uppercase tracking-tight mt-0.5">{date}</p>
    </div>
  </div>
);

export default PetDetailView;