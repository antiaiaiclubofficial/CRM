"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Crown, Star, Gem, Diamond, PawPrint, Check } from 'lucide-react';

interface MembershipTier {
  id: string;
  name: string;
  icon: React.ReactNode;
  colorClass: string;
  description: string;
  benefits: string[];
  minPoints: number;
}

const membershipTiers: MembershipTier[] = [
  {
    id: 'bronze',
    name: 'Bronze Member',
    icon: <PawPrint size={20} />,
    colorClass: 'bg-[#FFD8E4]',
    description: 'เริ่มต้นการดูแลที่ดีที่สุดสำหรับสัตว์เลี้ยงของคุณ',
    benefits: [
      'ส่วนลด 5% สำหรับบริการอาบน้ำ',
      'สะสมคะแนนทุกการใช้จ่าย',
      'รับข่าวสารโปรโมชั่นก่อนใคร',
    ],
    minPoints: 0,
  },
  {
    id: 'silver',
    name: 'Silver Member',
    icon: <Star size={20} />,
    colorClass: 'bg-[#B2F2BB]',
    description: 'ยกระดับการดูแลด้วยสิทธิพิเศษที่มากขึ้น',
    benefits: [
      'ส่วนลด 10% สำหรับบริการอาบน้ำและตัดขน',
      'คะแนนสะสม x1.5 เท่า',
      'จองคิวล่วงหน้าได้ 3 วัน',
      'ของขวัญวันเกิดสำหรับสัตว์เลี้ยง',
    ],
    minPoints: 300,
  },
  {
    id: 'gold',
    name: 'Gold Member',
    icon: <Crown size={20} />,
    colorClass: 'bg-[#FFE3BC]',
    description: 'สัมผัสประสบการณ์การดูแลระดับพรีเมียม',
    benefits: [
      'ส่วนลด 15% สำหรับทุกบริการ',
      'คะแนนสะสม x2 เท่า',
      'จองคิวล่วงหน้าได้ 7 วัน',
      'บริการสปาโอโซนฟรี 1 ครั้ง/ปี',
      'ที่ปรึกษาด้านการดูแลสัตว์เลี้ยงส่วนตัว',
    ],
    minPoints: 700,
  },
  {
    id: 'platinum',
    name: 'Platinum Member',
    icon: <Gem size={20} />,
    colorClass: 'bg-[#BBDEFB]',
    description: 'ที่สุดแห่งการดูแลเหนือระดับสำหรับคนพิเศษ',
    benefits: [
      'ส่วนลด 20% สำหรับทุกบริการ',
      'คะแนนสะสม x3 เท่า',
      'จองคิวล่วงหน้าได้ 14 วัน',
      'บริการรับ-ส่งสัตว์เลี้ยงฟรี (ในเขตที่กำหนด)',
      'เข้าร่วมกิจกรรมพิเศษสำหรับสมาชิก Platinum',
      'ของขวัญพิเศษประจำปี',
    ],
    minPoints: 1000,
  },
  {
    id: 'vip',
    name: 'VIP Member',
    icon: <Diamond size={20} />,
    colorClass: 'bg-[#E1BEE7]',
    description: 'เอกสิทธิ์สูงสุดสำหรับผู้ที่ต้องการสิ่งที่ดีที่สุด',
    benefits: [
      'ส่วนลด 25% สำหรับทุกบริการ',
      'คะแนนสะสม x4 เท่า',
      'จองคิวล่วงหน้าได้ 30 วัน',
      'บริการดูแลสัตว์เลี้ยงฉุกเฉิน 24 ชม.',
      'สิทธิพิเศษในการเข้าถึงบริการใหม่ก่อนใคร',
      'ของขวัญสุดหรูและบริการพิเศษเฉพาะบุคคล',
      'เชิญเข้าร่วมงานเลี้ยง VIP ประจำปี',
    ],
    minPoints: 2000,
  },
];

interface MembershipLevelsProps {
  totalAccumulatedPoints: number;
  redeemablePoints: number;
}

const MembershipLevels = ({ totalAccumulatedPoints }: MembershipLevelsProps) => {
  const sortedTiers = [...membershipTiers].sort((a, b) => a.minPoints - b.minPoints);

  let currentLevel: MembershipTier = sortedTiers[0];
  let nextLevel: MembershipTier | null = null;

  for (let i = 0; i < sortedTiers.length; i++) {
    if (totalAccumulatedPoints >= sortedTiers[i].minPoints) {
      currentLevel = sortedTiers[i];
    } else {
      nextLevel = sortedTiers[i];
      break;
    }
  }

  // Logic to put current level first and others after, making them very muted
  const orderedTiers = [
    currentLevel,
    ...sortedTiers.filter(t => t.id !== currentLevel.id)
  ];

  const pointsToNextLevel = nextLevel ? nextLevel.minPoints - totalAccumulatedPoints : 0;
  
  let progressPercentage = 0;
  if (nextLevel) {
    progressPercentage = (totalAccumulatedPoints / nextLevel.minPoints) * 100;
  } else {
    progressPercentage = 100;
  }
  progressPercentage = Math.min(100, Math.max(0, progressPercentage));

  const CurrentMembershipStatusCard = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`relative overflow-hidden p-6 rounded-[2.5rem] ${currentLevel.colorClass} border-2 border-black shadow-soft mb-8 text-black`}
    >
      <div className="absolute top-4 right-4 text-black/10">
        {React.cloneElement(currentLevel.icon as React.ReactElement, { size: 100 })}
      </div>

      <div className="relative z-10 space-y-4">
        <div className="flex flex-col items-center gap-1">
          <div className="bg-white border-2 border-black px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-wider mb-2">
            ระดับปัจจุบันของคุณ
          </div>
          <h3 className="text-3xl font-black">{currentLevel.name}</h3>
        </div>

        <div className="bg-white border-2 border-black p-4 rounded-3xl text-center">
          <div className="flex items-baseline justify-center gap-1">
            <span className="text-4xl font-black">{totalAccumulatedPoints.toLocaleString()}</span>
            <span className="text-sm font-bold text-slate-500"> / {nextLevel ? nextLevel.minPoints.toLocaleString() : 'MAX'} คะแนน</span>
          </div>
          
          <div className="mt-4 space-y-2">
            <div className="w-full bg-slate-100 border-2 border-black h-4 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="bg-black h-full"
              />
            </div>
            {nextLevel ? (
              <p className="text-[11px] font-bold text-slate-600 uppercase tracking-tight">
                อีก <span className="text-black font-black underline">{pointsToNextLevel.toLocaleString()}</span> คะแนน เพื่อเลื่อนเป็น <span className="text-black font-black underline">{nextLevel.name}</span>
              </p>
            ) : (
              <p className="text-[11px] font-bold text-slate-600 uppercase">
                คุณอยู่ในระดับสูงสุดแล้ว!
              </p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="space-y-6 pb-24">
      <div className="px-1 flex items-center justify-between">
        <h2 className="text-2xl font-black text-slate-800">ระดับสมาชิก</h2>
        <div className="bg-white border-2 border-black px-3 py-1 rounded-full shadow-sm text-xs font-bold">
          {membershipTiers.length} ระดับ
        </div>
      </div>
      
      <CurrentMembershipStatusCard />

      <div className="space-y-6">
        <h3 className="text-lg font-black text-slate-800 px-1">รายละเอียดและสิทธิประโยชน์</h3>
        {orderedTiers.map((tier, index) => { 
          const isCurrentLevel = tier.id === currentLevel.id;
          
          return (
            <motion.div
              key={tier.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`relative bg-white rounded-[2.5rem] border-2 shadow-soft overflow-hidden transition-all duration-300 ${
                !isCurrentLevel 
                  ? 'grayscale opacity-30 scale-[0.95] bg-slate-50 border-slate-200 shadow-none pointer-events-none' 
                  : 'border-black z-10 ring-4 ring-black/5'
              }`}
            >
              <div className={`p-5 border-b-2 ${isCurrentLevel ? 'border-black ' + tier.colorClass : 'border-slate-200 bg-slate-100'} flex items-center justify-between`}>
                <div className="flex items-center gap-3">
                   <div className={`w-12 h-12 border-2 rounded-2xl flex items-center justify-center shadow-sm ${isCurrentLevel ? 'bg-white border-black' : 'bg-slate-50 border-slate-200 text-slate-200'}`}>
                      {tier.icon}
                   </div>
                   <div>
                     <h4 className={`font-black ${isCurrentLevel ? 'text-black' : 'text-slate-300'}`}>{tier.name}</h4>
                     {isCurrentLevel && (
                       <span className="bg-black text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase">
                         ระดับปัจจุบัน
                       </span>
                     )}
                   </div>
                </div>
                <div className="text-right">
                  <p className={`text-[10px] font-bold uppercase ${isCurrentLevel ? 'text-black/60' : 'text-slate-200'}`}>คะแนนขั้นต่ำ</p>
                  <p className={`text-lg font-black ${isCurrentLevel ? 'text-black' : 'text-slate-300'}`}>{tier.minPoints.toLocaleString()}</p>
                </div>
              </div>

              <div className="p-5">
                <p className={`text-xs font-bold mb-4 ${isCurrentLevel ? 'text-slate-500' : 'text-slate-200'}`}>{tier.description}</p>
                <ul className="space-y-3">
                  {tier.benefits.map((benefit, bIndex) => (
                    <li key={bIndex} className={`flex items-start gap-3 text-sm font-bold ${isCurrentLevel ? 'text-slate-700' : 'text-slate-200'}`}>
                      <div className={`${isCurrentLevel ? 'bg-[#B2F2BB] border-black' : 'bg-slate-50 border-slate-200 text-slate-200'} border p-0.5 rounded-md mt-0.5`}>
                        <Check size={12} strokeWidth={4} />
                      </div>
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default MembershipLevels;