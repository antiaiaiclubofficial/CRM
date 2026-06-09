"use client";

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Pencil, Heart, PawPrint, Tag, Plus, HeartPulse, Trash2, AlertTriangle, X,
  LayoutGrid, Activity, History, FileText, Stethoscope, Syringe, ChevronRight, Scale, Scissors, Gift, Cake
} from 'lucide-react';
import PetHealthOverview from './PetHealthOverview';
import PetWeightChart from './PetWeightChart';
import PetVaccineRecords from './PetVaccineRecords';

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
  weight_history?: { id: string | number; date: string; weight: number; rawDate?: string; }[];
  vaccine_history?: { id: string; title: string; date: string; next_due_date?: string; description?: string; }[];
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
  onDeleteWeight: (historyId: string | number) => Promise<void>;
  onAddVaccine: (petId: string | number, data: { title: string; date: string; next_due_date: string; description: string }) => Promise<void>;
  onDeleteVaccine: (id: string) => Promise<void>;
  serviceHistory: any[];
}

const petEmojiMap: Record<string, string> = {
  'สุนัข': '🐶',
  'dog': '🐶',
  'แมว': '🐱',
  'cat': '🐱',
  'กระต่าย': '🐰',
  'rabbit': '🐰',
  'หนูแฮมสเตอร์': '🐹',
  'hamster': '🐹',
  'นก': '🦜',
  'bird': '🦜'
};

const getPetDefaultEmoji = (type?: string) => {
  if (!type) return '🐾';
  return petEmojiMap[type.toLowerCase()] || '🐾';
};

const PetDetailView = ({ 
  pet, 
  onBack, 
  onStartEdit, 
  onDeletePet, 
  onEditPreferences, 
  onToggleFavorite, 
  onAddWeight, 
  onDeleteWeight,
  onAddVaccine,
  onDeleteVaccine,
  serviceHistory
}: PetDetailViewProps) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showWeightDetail, setShowWeightDetail] = useState(false);
  const [showVaccineDetail, setShowVaccineDetail] = useState(false);

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
  const vaccineHistory = pet.vaccine_history || [];

  // ตรวจสอบว่าเป็นวันเกิดของน้องหรือไม่
  const isBirthday = useMemo(() => {
    if (!pet.birth_date) return false;
    const today = new Date();
    const birth = new Date(pet.birth_date);
    return today.getDate() === birth.getDate() && today.getMonth() === birth.getMonth();
  }, [pet.birth_date]);

  // คำนวณส่วนต่างน้ำหนักและวันที่ชั่งน้ำหนักครั้งก่อนหน้า
  const weightDiffInfo = useMemo(() => {
    const history = pet.weight_history || [];
    if (history.length < 2) return null;
    
    const latest = history[history.length - 1];
    const prev = history[history.length - 2];
    const diff = latest.weight - prev.weight;
    const formattedDiff = diff > 0 ? `+${diff.toFixed(1)}` : diff.toFixed(1);
    
    return {
      diff: formattedDiff,
      isGain: diff >= 0,
      prevDate: prev.date
    };
  }, [pet.weight_history]);

  // คำนวณข้อมูลวัคซีนถัดไปและจำนวนวันแนะนำ
  const nextVaccineInfo = useMemo(() => {
    if (!pet.vaccine_history || pet.vaccine_history.length === 0) {
      return null;
    }
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // กรองวัคซีนที่มีวันนัดหมายถัดไปในอนาคต
    const upcoming = pet.vaccine_history
      .filter(v => v.next_due_date)
      .map(v => {
        const dueDate = new Date(v.next_due_date!);
        dueDate.setHours(0, 0, 0, 0);
        const diffTime = dueDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return {
          title: v.title,
          dueDate,
          daysRemaining: diffDays,
          formattedDate: new Date(v.next_due_date!).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: '2-digit' })
        };
      })
      .filter(v => v.daysRemaining >= 0)
      .sort((a, b) => a.daysRemaining - b.daysRemaining);
      
    return upcoming[0] || null;
  }, [pet.vaccine_history]);

  // คำนวณสถานะวัคซีน
  const vaccineStatus = useMemo(() => {
    if (!pet.vaccine_history || pet.vaccine_history.length === 0) {
      return { text: "ยังไม่มีประวัติวัคซีน", type: "warning" as const };
    }
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let hasOverdue = false;
    let nextDue: Date | null = null;
    
    pet.vaccine_history.forEach(v => {
      if (v.next_due_date) {
        const dueDate = new Date(v.next_due_date);
        dueDate.setHours(0, 0, 0, 0);
        if (dueDate < today) {
          hasOverdue = true;
        } else {
          if (!nextDue || dueDate < nextDue) {
            nextDue = dueDate;
          }
        }
      }
    });

    // ค้นหาวัคซีนล่าสุดที่ฉีดแล้ว
    const sortedVaccines = [...pet.vaccine_history].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    const latestVaccine = sortedVaccines[0];
    const latestVaccineText = latestVaccine ? `ฉีดวัคซีน${latestVaccine.title}แล้ว` : "ได้รับวัคซีนแล้ว";
    
    if (hasOverdue) {
      return { text: "เกินกำหนดฉีดวัคซีน ⚠️", type: "danger" as const };
    }
    
    if (nextDue) {
      return { text: latestVaccineText, type: "upcoming" as const };
    }
    
    return { text: latestVaccineText, type: "success" as const };
  }, [pet.vaccine_history]);

  // รวมประวัติกิจกรรมสุขภาพทั้งหมดและจัดเรียงตามเวลาล่าสุด
  const timelineItems = useMemo(() => {
    const items: { id: string | number; title: string; date: string; rawDate: Date; type: 'vaccine' | 'weight' | 'grooming' }[] = [];

    // 1. ประวัติวัคซีน
    if (pet.vaccine_history) {
      pet.vaccine_history.forEach(v => {
        items.push({
          id: `vaccine-${v.id}`,
          title: `ฉีดวัคซีน: ${v.title}`,
          date: new Date(v.date).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: '2-digit' }),
          rawDate: new Date(v.date),
          type: 'vaccine'
        });
      });
    }

    // 2. ประวัติน้ำหนัก
    if (pet.weight_history) {
      pet.weight_history.forEach(w => {
        const rDate = w.rawDate ? new Date(w.rawDate) : new Date();
        items.push({
          id: `weight-${w.id}`,
          title: `บันทึกน้ำหนัก: ${w.weight} kg`,
          date: rDate.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: '2-digit' }),
          rawDate: rDate,
          type: 'weight'
        });
      });
    }

    // 3. ประวัติการรับบริการ (อาบน้ำตัดขน)
    const petServices = serviceHistory.filter(s => s.petName === pet.name);
    petServices.forEach(s => {
      const rDate = s.rawDate ? new Date(s.rawDate) : new Date();
      items.push({
        id: `service-${s.id}`,
        title: `รับบริการ: ${s.service}`,
        date: rDate.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: '2-digit' }),
        rawDate: rDate,
        type: 'grooming'
      });
    });

    // จัดเรียงจากใหม่ล่าสุดไปเก่าสุด
    return items.sort((a, b) => b.rawDate.getTime() - a.rawDate.getTime());
  }, [pet, serviceHistory]);

  const handleHealthAction = (type: string) => {
    if (type === 'weight') {
      setShowWeightDetail(true);
      setShowVaccineDetail(false);
    } else if (type === 'vaccine') {
      setShowVaccineDetail(true);
      setShowWeightDetail(false);
    } else {
      setActiveTab('health');
    }
  };

  // Define consistent slide animation for content
  const slideVariants = {
    initial: { x: 20, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: -20, opacity: 0 },
    transition: { type: "spring", damping: 25, stiffness: 300 }
  };

  const isSubViewOpen = showWeightDetail || showVaccineDetail;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative bg-surface pb-24"
    >
      {/* Compact Header Section */}
      <div className="px-1 pt-4">
        {isSubViewOpen ? (
          <div className="flex items-center gap-4 mb-8 px-2">
            <button 
              onClick={() => { setShowWeightDetail(false); setShowVaccineDetail(false); }} 
              className="w-10 h-10 flex items-center justify-center text-primary/40 hover:text-primary hover:bg-slate-100 rounded-full active:scale-90 transition-all shrink-0"
            >
              <ArrowLeft size={28} strokeWidth={2.5} />
            </button>
            <div className="flex-1 min-w-0">
               <h3 className="text-2xl font-black text-primary tracking-tight truncate">
                 {showWeightDetail ? `น้ำหนัก: ${pet.name}` : `วัคซีน: ${pet.name}`}
               </h3>
               <p className="text-[10px] font-black text-surface-variant opacity-40 uppercase tracking-[0.2em] mt-0.5">Physical Tracker</p>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-4 pl-2 pr-2 mb-6">
            <button 
              onClick={onBack} 
              className="w-10 h-10 flex items-center justify-center text-primary/40 hover:text-primary hover:bg-slate-100 rounded-full active:scale-90 transition-all shrink-0"
            >
              <ArrowLeft size={28} strokeWidth={2.5} />
            </button>
            
            <div className="flex-1 flex items-center gap-3 min-w-0">
              <div className="relative shrink-0">
                <div className="absolute inset-0 bg-tertiary/15 rounded-full blur-xl scale-125" />
                <div 
                  onClick={() => onStartEdit(pet)}
                  className="relative w-20 h-20 rounded-full overflow-hidden bg-white shadow-ambient border-none cursor-pointer active:scale-95 transition-all flex items-center justify-center"
                >
                  {pet.image_url ? (
                    <img src={pet.image_url} alt={pet.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-4xl">{getPetDefaultEmoji(pet.type)}</span>
                  )}
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
        <div className="px-4 pt-2">
           <PetWeightChart 
              data={weightHistory} 
              petName={pet.name} 
              onAddWeight={(w) => onAddWeight(pet.id, w)} 
              onDeleteWeight={onDeleteWeight}
            />
        </div>
      ) : showVaccineDetail ? (
        <div className="px-4 pt-2">
           <PetVaccineRecords 
              data={vaccineHistory} 
              petName={pet.name} 
              petType={pet.type}
              onAddVaccine={(data) => onAddVaccine(pet.id, data)} 
              onDeleteVaccine={onDeleteVaccine}
            />
        </div>
      ) : (
        <>
          {/* Tab Navigation */}
          <div className="px-1 mb-6">
            <div className="bg-white p-1 rounded-full flex gap-1 shadow-ambient border border-black/5 relative">
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
                  className="space-y-10"
                >
                  {/* Birthday Celebration Banner */}
                  {isBirthday && (
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="bg-gradient-to-r from-[#FFD8E4] via-[#FFE3BC] to-[#E1BEE7] p-6 rounded-[2.5rem] border-2 border-white shadow-ambient text-center relative overflow-hidden"
                    >
                      {/* Confetti decorative elements */}
                      <div className="absolute -left-4 -top-4 text-3xl opacity-20 select-none">🎈🎉✨</div>
                      <div className="absolute -right-4 -bottom-4 text-3xl opacity-20 select-none">🎁🎂🧁</div>
                      
                      <div className="relative z-10 flex flex-col items-center gap-3">
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm text-pink-500">
                          <Cake size={24} className="animate-bounce" />
                        </div>
                        <div>
                          <h4 className="text-lg font-black text-primary tracking-tight">
                            สุขสันต์วันเกิดนะค๊าบ! 🎉
                          </h4>
                          <p className="text-xs font-bold text-slate-700 mt-1 leading-relaxed">
                            วันนี้เป็นวันเกิดครบรอบ <span className="font-black text-pink-600 underline">{pet.age}</span> ของน้อง <span className="font-black text-primary">{pet.name}</span> ขอให้น้องมีความสุข สุขภาพแข็งแรง ร่าเริงสดใสในทุกๆ วันนะคะ! 🐾🎂
                          </p>
                        </div>
                        <div className="inline-flex items-center gap-1.5 bg-white/60 px-3.5 py-1.5 rounded-full border border-white/80 text-[10px] font-black text-pink-600 uppercase tracking-wider mt-1">
                          <Gift size={12} /> รับของขวัญวันเกิดพิเศษที่หน้าร้านได้เลยค่ะ!
                        </div>
                      </div>
                    </motion.div>
                  )}

                  <PetHealthOverview 
                    score={healthData.score}
                    statusText={healthData.status}
                    subStatusText={healthData.subStatus}
                    lastUpdate="วันนี้"
                    weight={pet.weight}
                    weightDiff={weightDiffInfo?.diff}
                    weightDiffIsGain={weightDiffInfo?.isGain}
                    prevWeightDate={weightDiffInfo?.prevDate}
                    vaccineStatusText={vaccineStatus.text}
                    vaccineStatusType={vaccineStatus.type}
                    nextVaccineDays={nextVaccineInfo ? nextVaccineInfo.daysRemaining : null}
                    nextVaccineName={nextVaccineInfo ? nextVaccineInfo.title : null}
                    nextVaccineDate={nextVaccineInfo ? nextVaccineInfo.formattedDate : null}
                    onActionClick={handleHealthAction}
                  />

                  <div className="pt-4 flex flex-col items-center gap-4">
                    <button 
                      onClick={() => setShowDeleteConfirm(true)}
                      className="text-red-500 font-black uppercase tracking-widest text-[10px] underline underline-offset-8 decoration-red-500/20 hover:decoration-red-500 transition-all"
                    >
                      ลบสัตว์เลี้ยง น้อง{pet.name}
                    </button>
                  </div>
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
                      <HealthItem label="สถานะวัคซีน" value={<span className={vaccineStatus.type === 'danger' ? 'text-rose-500 font-black' : 'text-primary'}>{vaccineStatus.text}</span>} />
                    </div>
                    <div className="mt-4 pt-4 border-t border-black/5">
                      <HealthItem label="ข้อควรระวัง" value={pet.precautions || 'ไม่มี'} />
                    </div>
                  </div>
                  
                  <div className="space-y-4 px-2">
                    <h3 className="text-lg font-bold text-primary tracking-tight">ไทม์ไลน์สุขภาพ</h3>
                    {timelineItems.length > 0 ? (
                      <div className="relative pl-10 space-y-8 before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-[2px] before:bg-surface-container">
                        {timelineItems.map((item) => (
                          <TimelineItem 
                            key={item.id}
                            title={item.title} 
                            date={item.date} 
                            type={item.type} 
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 bg-white rounded-xl border border-black/5">
                        <p className="text-xs font-bold text-surface-variant opacity-40 italic">ยังไม่มีประวัติกิจกรรมสุขภาพ</p>
                      </div>
                    )}
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

const TabButton = ({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) => (
  <button 
    onClick={onClick}
    className="relative flex-1 py-2.5 px-3 flex items-center justify-center gap-1 transition-colors duration-300 z-10 group"
  >
    {active && (
      <motion.div 
        layoutId="activeTabBg"
        className="absolute inset-0 bg-primary group-hover:bg-tertiary rounded-full shadow-lg transition-colors duration-300"
        transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
      />
    )}
    <span className={`relative z-10 whitespace-nowrap transition-colors duration-300 ${
      active ? 'text-white group-hover:text-primary font-bold' : 'text-primary/40 group-hover:text-primary font-black uppercase tracking-widest text-[10px]'
    }`}>
      {label}
    </span>
  </button>
);

const HealthItem = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="flex flex-col gap-0.5">
    <p className="text-[10px] font-black text-primary/40 uppercase tracking-widest">{label}</p>
    <div className="text-sm font-bold text-primary leading-tight">{value}</div>
  </div>
);

const TimelineItem = ({ title, date, type }: { title: string; date: string; type: string }) => (
  <div className="relative">
    <div className={`absolute -left-[51px] top-0 w-9 h-9 rounded-full border-4 border-white shadow-ambient flex items-center justify-center z-10 ${
      type === 'vaccine' ? 'bg-[#E0F7F9] text-[#2BC0D3]' : 
      type === 'grooming' ? 'bg-[#FFF0F3] text-[#FF5C8A]' : 
      type === 'weight' ? 'bg-[#F0F2FF] text-[#5C7CFF]' : 'bg-[#F2F9F0] text-[#64C44F]'
    }`}>
      {type === 'vaccine' ? <Syringe size={16} /> : 
       type === 'grooming' ? <Scissors size={16} /> : 
       type === 'weight' ? <Scale size={16} /> : <Stethoscope size={16} />}
    </div>
    <div>
      <h5 className="text-sm font-black text-primary tracking-tight">{title}</h5>
      <p className="text-[10px] font-bold text-primary/40 uppercase tracking-tight mt-0.5">{date}</p>
    </div>
  </div>
);

export default PetDetailView;