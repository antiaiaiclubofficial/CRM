"use client";

import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PetHealthOverview from './PetHealthOverview';
import PetWeightTracker from './PetWeightTracker';
import PetVaccineRecords from './PetVaccineRecords';

interface HealthLog {
  id: string;
  pet_id: string;
  type: 'weight' | 'vaccine' | 'medical' | 'other';
  title: string;
  value: string;
  date: string;
  description: string;
  created_at: string;
}

interface PetDetailViewProps {
  pet: {
    id: string;
    name: string;
    type: string;
    breed?: string;
    birthdate?: string;
  };
  healthLogs: HealthLog[];
  onAddLog: (type: 'weight' | 'vaccine', data: any) => Promise<void>;
  onDeleteLog: (id: string) => Promise<void>;
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

const PetDetailView = ({ pet, healthLogs, onAddLog, onDeleteLog }: PetDetailViewProps) => {
  const [activeTab, setActiveTab] = useState('overview');

  // กรองข้อมูลน้ำหนัก
  const weightLogs = healthLogs
    .filter(log => log.type === 'weight')
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  const currentWeight = weightLogs[0]?.value || '';

  // กรองข้อมูลวัคซีน
  const vaccineLogs = healthLogs
    .filter(log => log.type === 'vaccine')
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // คำนวณสถานะวัคซีนและประมาณการเข็มถัดไป
  let vaccineStatusText = 'ยังไม่มีประวัติวัคซีน';
  let vaccineStatusType: 'success' | 'warning' | 'danger' | 'upcoming' = 'warning';
  let nextVaccineDays: number | null = null;
  let nextVaccineName: string | null = null;
  let nextVaccineDate: string | null = null;

  if (vaccineLogs.length > 0) {
    const latestVaccine = vaccineLogs[0];
    
    // คำนวณวันประมาณการถัดไปจากวัคซีนล่าสุด
    const estimatedDateStr = estimateNextDueDate(latestVaccine.title, latestVaccine.date);
    
    if (estimatedDateStr) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const nextDate = new Date(estimatedDateStr);
      nextDate.setHours(0, 0, 0, 0);
      
      const diffTime = nextDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      nextVaccineDays = diffDays;
      nextVaccineDate = new Date(estimatedDateStr).toLocaleDateString('th-TH', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      // กำหนดชื่อเข็มถัดไปแบบประมาณการ
      if (latestVaccine.title.includes('ครั้งที่ 1')) {
        nextVaccineName = latestVaccine.title.replace('ครั้งที่ 1', 'ครั้งที่ 2 (ประมาณการ)');
      } else if (latestVaccine.title.includes('ครั้งที่ 2')) {
        nextVaccineName = latestVaccine.title.replace('ครั้งที่ 2', 'ครั้งที่ 3 (ประมาณการ)');
      } else {
        nextVaccineName = `${latestVaccine.title.split(' ครั้งที่')[0]} (กระตุ้นประจำปี)`;
      }

      if (diffDays < 0) {
        vaccineStatusText = `เกินกำหนดประมาณการมาแล้ว ${Math.abs(diffDays)} วัน`;
        vaccineStatusType = 'danger';
      } else if (diffDays <= 7) {
        vaccineStatusText = `ใกล้ถึงกำหนดประมาณการในอีก ${diffDays} วัน`;
        vaccineStatusType = 'warning';
      } else {
        vaccineStatusText = 'ได้รับวัคซีนตามกำหนดการล่าสุดแล้ว';
        vaccineStatusType = 'success';
      }
    }
  }

  // คำนวณคะแนนสุขภาพเบื้องต้น
  let healthScore = 100;
  let subStatusText = 'น้องสุขภาพแข็งแรงสมบูรณ์ดีค่ะ';
  
  if (!currentWeight) {
    healthScore -= 15;
  }
  if (vaccineLogs.length === 0) {
    healthScore -= 20;
  } else if (vaccineStatusType === 'danger') {
    healthScore -= 15;
  } else if (vaccineStatusType === 'warning') {
    healthScore -= 5;
  }

  const getStatusText = (score: number) => {
    if (score >= 90) return 'สุขภาพดีเยี่ยม ✨';
    if (score >= 75) return 'สุขภาพดีปกติ 👍';
    return 'ควรดูแลเพิ่มเติม 🩺';
  };

  return (
    <div className="w-full max-w-[390px] mx-auto bg-slate-50/50 min-h-screen pb-24">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 py-4">
          <TabsList className="grid w-full grid-cols-3 bg-slate-100/80 p-1 rounded-2xl">
            <TabsTrigger value="overview" className="rounded-xl font-bold text-xs py-2.5">ภาพรวม</TabsTrigger>
            <TabsTrigger value="weight" className="rounded-xl font-bold text-xs py-2.5">น้ำหนัก</TabsTrigger>
            <TabsTrigger value="vaccine" className="rounded-xl font-bold text-xs py-2.5">วัคซีน</TabsTrigger>
          </TabsList>
        </div>

        <div className="px-6 pt-6">
          <TabsContent value="overview" className="mt-0 outline-none">
            <PetHealthOverview 
              score={healthScore}
              statusText={getStatusText(healthScore)}
              subStatusText={subStatusText}
              lastUpdate={healthLogs[0] ? new Date(healthLogs[0].date).toLocaleDateString('th-TH') : 'ไม่มีข้อมูล'}
              weight={currentWeight}
              vaccineStatusText={vaccineStatusText}
              vaccineStatusType={vaccineStatusType}
              nextVaccineDays={nextVaccineDays}
              nextVaccineName={nextVaccineName}
              nextVaccineDate={nextVaccineDate}
              onActionClick={(tab) => setActiveTab(tab)}
            />
          </TabsContent>

          <TabsContent value="weight" className="mt-0 outline-none">
            <PetWeightTracker 
              petName={pet.name}
              logs={weightLogs}
              onAddWeight={(value, date) => onAddLog('weight', { value, date })}
              onDeleteWeight={onDeleteLog}
            />
          </TabsContent>

          <TabsContent value="vaccine" className="mt-0 outline-none">
            <PetVaccineRecords 
              petName={pet.name}
              petType={pet.type}
              logs={vaccineLogs}
              onAddVaccine={(data) => onAddLog('vaccine', data)}
              onDeleteVaccine={onDeleteLog}
            />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default PetDetailView;