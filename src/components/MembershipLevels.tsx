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
  minPoints: number; // Added minPoints to define tier requirements
}

const membershipTiers: MembershipTier[] = [
  {
    id: 'bronze',
    name: 'Bronze Member',
    icon: <PawPrint size={20} />,
    colorClass: 'bg-amber-700',
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
    colorClass: 'bg-slate-400',
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
    colorClass: 'bg-amber-500',
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
    colorClass: 'bg-blue-400',
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
    colorClass: 'bg-purple-600',
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
  userPoints: number;
}

const MembershipLevels = ({ userPoints }: MembershipLevelsProps) => {
  // Sort tiers by minPoints to ensure correct level determination
  const sortedTiers = [...membershipTiers].sort((a, b) => a.minPoints - b.minPoints);

  let currentLevel: MembershipTier = sortedTiers[0]; // Default to Bronze
  let nextLevel: MembershipTier | null = null;

  for (let i = 0; i < sortedTiers.length; i++) {
    if (userPoints >= sortedTiers[i].minPoints) {
      currentLevel = sortedTiers[i];
    } else {
      nextLevel = sortedTiers[i];
      break;
    }
  }

  const pointsToNextLevel = nextLevel ? nextLevel.minPoints - userPoints : 0;
  const currentLevelMinPoints = currentLevel.minPoints;
  const nextLevelMinPoints = nextLevel ? nextLevel.minPoints : currentLevel.minPoints + 1; // Prevent division by zero if max level
  
  let progressPercentage = 0;
  if (nextLevel) {
    const pointsRange = nextLevelMinPoints - currentLevelMinPoints;
    const pointsEarnedInCurrentTier = userPoints - currentLevelMinPoints;
    progressPercentage = (pointsEarnedInCurrentTier / pointsRange) * 100;
  } else {
    progressPercentage = 100; // Max level reached
  }
  progressPercentage = Math.min(100, Math.max(0, progressPercentage)); // Ensure it's between 0 and 100

  // Sub-component for the current membership status card
  const CurrentMembershipStatusCard = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden p-6 rounded-[2rem] bg-gradient-to-br from-amber-500 to-amber-700 shadow-xl shadow-amber-200/50 text-white"
    >
      {/* Watermark Crown */}
      <Crown className="absolute -right-4 -top-4 w-32 h-32 text-white/20 rotate-12" />
      <Crown className="absolute -left-8 -bottom-8 w-24 h-24 text-white/10 -rotate-12" />

      <div className="relative z-10 text-center space-y-3">
        <Crown size={40} className="mx-auto text-white/90 mb-2" />
        <p className="text-sm font-medium text-white/80">ระดับปัจจุบันของคุณ</p>
        <h3 className="text-3xl font-bold mb-4">{currentLevel.name}</h3>

        <div className="flex items-baseline justify-center gap-1 mb-4">
          <span className="text-4xl font-bold">{userPoints}</span>
          <span className="text-lg text-white/80"> / {nextLevel ? nextLevel.minPoints : 'MAX'} คะแนน</span>
        </div>

        <div className="w-full bg-white/30 h-3 rounded-full overflow-hidden mb-2">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="bg-white h-full rounded-full"
          />
        </div>
        {nextLevel ? (
          <p className="text-xs text-white/80 font-medium">
            อีก <span className="font-bold">{pointsToNextLevel}</span> คะแนน เพื่อเลื่อนเป็น <span className="font-bold">{nextLevel.name}</span>
          </p>
        ) : (
          <p className="text-xs text-white/80 font-medium">
            คุณอยู่ในระดับสูงสุดแล้ว!
          </p>
        )}
      </div>
    </motion.div>
  );

  return (
    <div className="space-y-6 pb-20">
      <h2 className="text-xl font-bold text-slate-800 px-1">ระดับสมาชิกและสิทธิประโยชน์</h2>
      <p className="text-sm text-slate-500 px-1">เลือกแผนที่ใช่ เพื่อการดูแลที่ดีที่สุดสำหรับเพื่อนซี้สี่ขาของคุณ</p>

      {/* Current Membership Status Card */}
      <CurrentMembershipStatusCard />

      <div className="space-y-4">
        {membershipTiers.map((tier, index) => (
          <motion.div
            key={tier.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-50 flex flex-col"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className={`w-14 h-14 ${tier.colorClass} rounded-2xl flex items-center justify-center text-white text-2xl shadow-inner`}>
                {tier.icon}
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-lg">{tier.name}</h3>
                <p className="text-xs text-slate-500">{tier.description}</p>
              </div>
            </div>
            <div className="border-t border-slate-50 pt-4">
              <ul className="space-y-2">
                {tier.benefits.map((benefit, bIndex) => (
                  <li key={bIndex} className="flex items-start gap-2 text-sm text-slate-700">
                    <Check size={16} className="text-pink-500 flex-shrink-0 mt-0.5" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="bg-white/40 p-6 rounded-[2.5rem] text-center border-2 border-dashed border-slate-200">
        <p className="text-xs text-slate-400">
          ต้องการอัปเกรดระดับสมาชิก? <span className="text-pink-500 font-bold">ติดต่อเรา</span> เพื่อสอบถามข้อมูลเพิ่มเติม
        </p>
      </div>
    </div>
  );
};

export default MembershipLevels;