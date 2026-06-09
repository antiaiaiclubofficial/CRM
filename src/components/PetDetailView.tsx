"use client";

import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Edit, Trash2, Heart } from 'lucide-react';
import PetHealthOverview from './PetHealthOverview';
import PetWeightChart from './PetWeightChart';
import PetVaccineRecords from './PetVaccineRecords';
import PetIDCard from './PetIDCard';

interface PetDetailViewProps {
  pet: {
    id: string | number;
    name: string;
    type: string;
    breed?: string;
    age?: string;
    birth_date?: string;
    gender?: string;
    weight?: string;
    medical_condition?: string;
    precautions?: string;
    fur_length?: string;
    image_url?: string;
    card_bg_color?: string;
    is_favorite?: boolean;
    weight_history?: Array<{ id: string | number; date: string; weight: number }>;
    vaccine_history?: Array<{ id: string; title: string; date: string; next_due_date?: string; description?: string }>;
  };
  onBack: () => void;
  onStartEdit: (pet: any) => void;
  onDeletePet: (id: any) => void;
  totalServiceCost?: number;
  onViewServiceHistoryForPet?: () => void;
  onEditPreferences?: () => void;
  onToggleFavorite: () => void;
  onAddWeight: (id: any, weight: number) => Promise<void>;
  onDeleteWeight: (historyId: any) => Promise<void>;
  onAddVaccine: (id: any, data: any) => Promise<void>;
  onDeleteVaccine: (id: any) => Promise<void>;
  serviceHistory?: any[];
}

// ฟังก์ชันช่วยคำนวณประมาณการวันฉีดวัคซีนเข็มถัดไป
const estimateNextDueDate = (title: string, dateStr: string): string => {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return '';

  const titleLower = title.toLowerCase();
  let daysToAdd = 365; // ค่าเริ่มต้นเป็นกระตุ้นรายปี (365 วัน)

  // ถ้าเป็นเข็มแรกๆ ของลูกหมา/ลูกแมว มักจะห่างกัน 4 สัปดาห์ (28 วัน)
  if (titleLower.includes('ครั้งที่ 1') || titleLower.includes('เข็มที่ 1') || titleLower.includes('1st')) {
    daysToAdd = 28;
  } else if (titleLower.includes('ครั้งที่ 2') || titleLower.includes('เข็มที่ 2') || titleLower.includes('2nd')) {
    daysToAdd = 28;
  }

  const nextDate = new Date(date.getTime() + daysToAdd * 24 * 60 * 60 * 1000);
  
  // แปลงกลับเป็น YYYY-MM-DD
  const year = nextDate.getFullYear();
  const month = String(nextDate.getMonth() + 1).padStart(2, '0');
  const day = String(nextDate.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const PetDetailView = ({ 
  pet, 
  onBack, 
  onStartEdit, 
  onDeletePet, 
  onToggleFavorite, 
  onAddWeight, 
  onDeleteWeight, 
  onAddVaccine, 
  onDeleteVaccine 
}: PetDetailViewProps) => {
  const [activeTab, setActiveTab] = useState('overview');

  // กรองข้อมูลน้ำหนัก
  const weightLogs = pet.weight_history || [];
  const currentWeight = weightLogs.length > 0 ? weightLogs[weightLogs.length - 1].weight.toString() : (pet.weight || '');

  // กรองข้อมูลวัคซีน
  const vaccineLogs = pet.vaccine_history || [];

  // คำนวณสถานะวัคซีนเบื้องต้น
  let vaccineStatusText = 'ยังไม่มีประวัติวัคซีน';
  let vaccineStatusType: 'success' | 'warning' | 'danger' | 'upcoming' = 'warning';
  let nextVaccineName: string | null = null;
  let nextVaccineDate: string | null = null;

  const isCat = pet.type === 'แมว';

  if (vaccineLogs.length > 0) {
    const latestVaccine = vaccineLogs[vaccineLogs.length - 1];
    vaccineStatusText = 'ได้รับวัคซีนตามกำหนดการล่าสุดแล้ว';
    vaccineStatusType = 'success';

    // คำนวณวันประมาณการถัดไปจากวัคซีนล่าสุด
    const estimatedDateStr = estimateNextDueDate(latestVaccine.title, latestVaccine.date);
    
    if (estimatedDateStr) {
      const nextDate = new Date(estimatedDateStr);
      nextVaccineDate = nextDate.toLocaleDateString('th-TH', {
        day: 'numeric',
        month: 'short',
        year: '2-digit'
      });

      // กำหนดชื่อเข็มถัดไปแบบประมาณการ
      if (latestVaccine.title.includes('ครั้งที่ 1')) {
        nextVaccineName = latestVaccine.title.replace('ครั้งที่ 1', 'ครั้งที่ 2');
      } else if (latestVaccine.title.includes('ครั้งที่ 2')) {
        nextVaccineName = latestVaccine.title.replace('ครั้งที่ 2', 'ครั้งที่ 3');
      } else {
        nextVaccineName = `${latestVaccine.title.split(' ครั้งที่')[0]} (กระตุ้นประจำปี)`;
      }
    }
  } else {
    // หากยังไม่มีประวัติวัคซีนเลย แนะนำเข็มแรกตามประเภทสัตว์เลี้ยง
    nextVaccineName = isCat ? 'วัคซีนรวมหัด+หวัดแมว เข็มที่ 1' : 'วัคซีนรวม 5 โรค เข็มที่ 1';
    nextVaccineDate = 'แนะนำที่อายุ 8 สัปดาห์';
  }

  // คำนวณคะแนนสุขภาพเบื้องต้น
  let healthScore = 100;
  let subStatusText = 'น้องสุขภาพแข็งแรงสมบูรณ์ดีค่ะ';
  
  if (!currentWeight) {
    healthScore -= 15;
  }
  if (vaccineLogs.length === 0) {
    healthScore -= 20;
  }

  const getStatusText = (score: number) => {
    if (score >= 90) return 'สุขภาพดีเยี่ยม ✨';
    if (score >= 75) return 'สุขภาพดีปกติ 👍';
    return 'ควรดูแลเพิ่มเติม 🩺';
  };

  const mappedPetForCard = {
    id: typeof pet.id === 'number' ? pet.id : parseInt(pet.id) || 0,
    name: pet.name,
    type: pet.type,
    breed: pet.breed || '',
    age: pet.age || '',
    birth_date: pet.birth_date,
    gender: pet.gender || '',
    weight: pet.weight || '',
    medicalCondition: pet.medical_condition || '',
    precautions: pet.precautions || '',
    color: pet.card_bg_color || '#FFD8E4',
    icon: pet.type === 'แมว' ? '🐱' : '🐶',
    furLength: pet.fur_length,
    customPreferences: []
  };

  return (
    <div className="w-full max-w-[390px] mx-auto bg-slate-50/50 min-h-screen pb-24">
      {/* Header with Back, Favorite, Edit, and Delete buttons */}
      <div className="flex items-center justify-between px-6 py-4 bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <ArrowLeft size={20} />
          </button>
          <h3 className="font-bold text-lg text-slate-800">รายละเอียดน้อง{pet.name}</h3>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={onToggleFavorite} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <Heart size={20} className={pet.is_favorite ? 'text-pink-500 fill-pink-500' : 'text-slate-400'} />
          </button>
          <button onClick={() => onStartEdit(pet)} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-blue-500">
            <Edit size={20} />
          </button>
          <button onClick={() => onDeletePet(pet.id)} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-red-500">
            <Trash2 size={20} />
          </button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 py-4">
          <TabsList className="grid w-full grid-cols-3 bg-slate-100/80 p-1 rounded-2xl">
            <TabsTrigger value="overview" className="rounded-xl font-bold text-xs py-2.5">ภาพรวม</TabsTrigger>
            <TabsTrigger value="weight" className="rounded-xl font-bold text-xs py-2.5">น้ำหนัก</TabsTrigger>
            <TabsTrigger value="vaccine" className="rounded-xl font-bold text-xs py-2.5">วัคซีน</TabsTrigger>
          </TabsList>
        </div>

        <div className="px-6 pt-6">
          <TabsContent value="overview" className="mt-0 outline-none space-y-6">
            <PetIDCard pet={mappedPetForCard} />
            <PetHealthOverview 
              score={healthScore}
              statusText={getStatusText(healthScore)}
              subStatusText={subStatusText}
              lastUpdate={weightLogs.length > 0 ? weightLogs[weightLogs.length - 1].date : 'ไม่มีข้อมูล'}
              weight={currentWeight}
              vaccineStatusText={vaccineStatusText}
              vaccineStatusType={vaccineStatusType}
              nextVaccineName={nextVaccineName}
              nextVaccineDate={nextVaccineDate}
              onActionClick={(tab) => setActiveTab(tab)}
            />
          </TabsContent>

          <TabsContent value="weight" className="mt-0 outline-none">
            <PetWeightChart 
              petName={pet.name}
              data={weightLogs}
              onAddWeight={async (w) => {
                await onAddWeight(pet.id, w);
              }}
              onDeleteWeight={async (historyId) => {
                await onDeleteWeight(historyId);
              }}
            />
          </TabsContent>

          <TabsContent value="vaccine" className="mt-0 outline-none">
            <PetVaccineRecords 
              petName={pet.name}
              petType={pet.type}
              data={vaccineLogs}
              onAddVaccine={async (data) => {
                await onAddVaccine(pet.id, data);
              }}
              onDeleteVaccine={async (id) => {
                await onDeleteVaccine(id);
              }}
            />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default PetDetailView;