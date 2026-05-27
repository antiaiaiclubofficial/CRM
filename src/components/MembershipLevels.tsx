"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Crown, Star, Gem, Diamond, PawPrint, Check, Clock, ShieldCheck } from 'lucide-react';

interface MembershipLevelsProps {
  totalAccumulatedPoints: number;
  redeemablePoints: number;
  tierExpiry?: string;
  tiers?: any[];
}

const iconMap: Record<string, any> = {
  PawPrint: <PawPrint size={20} />,
  Star: <Star size={20} />,
  Crown: <Crown size={20} />,
  Gem: <Gem size={20} />,
  Diamond: <Diamond size={20} />,
};

const defaultTiers = [
  {
    id: 'bronze',
    tier_key: 'bronze',
    name: 'Bronze Member',
    icon_name: 'PawPrint',
    color_class: 'bg-[#FFD8E4]',
    description: 'เริ่มต้นการดูแลที่ดีที่สุดสำหรับสัตว์เลี้ยงของคุณ',
    benefits: [
      'ส่วนลด 5% สำหรับบริการอาบน้ำ',
      'สะสมคะแนนทุกการใช้จ่าย',
      'รับข่าวสารโปรโมชั่นก่อนใคร',
    ],
    min_points: 0,
  },
  {
    id: 'silver',
    tier_key: 'silver',
    name: 'Silver Member',
    icon_name: 'Star',
    color_class: 'bg-[#B2F2BB]',
    description: 'ยกระดับการดูแลด้วยสิทธิพิเศษที่มากขึ้น',
    benefits: [
      'ส่วนลด 10% สำหรับบริการอาบน้ำและตัดขน',
      'คะแนนสะสม x1.5 เท่า',
      'จองคิวล่วงหน้าได้ 3 วัน',
      'ของขวัญวันเกิดสำหรับสัตว์เลี้ยง',
    ],
    min_points: 300,
  },
  {
    id: 'gold',
    tier_key: 'gold',
    name: 'Gold Member',
    icon_name: 'Crown',
    color_class: 'bg-[#FFE3BC]',
    description: 'สัมผัสประสบการณ์การดูแลระดับพรีเมียม',
    benefits: [
      'ส่วนลด 15% สำหรับทุกบริการ',
      'คะแนนสะสม x2 เท่า',
      'จองคิวล่วงหน้าได้ 7 วัน',
      'บริการสปาโอโซนฟรี 1 ครั้ง/ปี',
      'ที่ปรึกษาด้านการดูแลสัตว์เลี้ยงส่วนตัว',
    ],
    min_points: 700,
  },
  {
    id: 'platinum',
    tier_key: 'platinum',
    name: 'Platinum Member',
    icon_name: 'Gem',
    color_class: 'bg-[#BBDEFB]',
    description: 'ที่สุดแห่งการดูแลเหนือระดับสำหรับคนพิเศษ',
    benefits: [
      'ส่วนลด 20% สำหรับทุกบริการ',
      'คะแนนสะสม x3 เท่า',
      'จองคิวล่วงหน้าได้ 14 วัน',
      'บริการรับ-ส่งสัตว์เลี้ยงฟรี (ในเขตที่กำหนด)',
      'เข้าร่วมกิจกรรมพิเศษสำหรับสมาชิก Platinum',
      'ของขวัญพิเศษประจำปี',
    ],
    min_points: 1000,
  },
  {
    id: 'vip',
    tier_key: 'vip',
    name: 'VIP Member',
    icon_name: 'Diamond',
    color_class: 'bg-[#E1BEE7]',
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
    min_points: 2000,
  },
];

const MembershipLevels = ({ totalAccumulatedPoints, tierExpiry, tiers }: MembershipLevelsProps) => {
  const activeTiers = tiers && tiers.length > 0 ? tiers : defaultTiers;
  const sortedTiers = [...activeTiers].sort((a, b) => a.min_points - b.min_points);

  let currentLevel: any = sortedTiers[0];
  let nextLevel: any | null = null;

  for (let i = 0; i < sortedTiers.length; i++) {
    if (totalAccumulatedPoints >= sortedTiers[i].min_points) {
      currentLevel = sortedTiers[i];
    } else {
      nextLevel = sortedTiers[i];
      break;
    }
  }

  const orderedTiers = [
    currentLevel,
    ...sortedTiers.filter(t => (t.tier_key || t.id) !== (currentLevel.tier_key || currentLevel.id))
  ];

  const pointsToNextLevel = nextLevel ? nextLevel.min_points - totalAccumulatedPoints : 0;
  
  let progressPercentage = 0;
  if (nextLevel) {
    progressPercentage = (totalAccumulatedPoints / nextLevel.min_points) * 100;
  } else {
    progressPercentage = 100;
  }
  progressPercentage = Math.min(100, Math.max(0, progressPercentage));

  // Find the "Max Points" for the current tier (which is the threshold for the next tier)
  const currentTierMaxPoints = nextLevel ? nextLevel.min_points : currentLevel.min_points;

  const currentIcon = iconMap[currentLevel.icon_name] || <PawPrint size={20} />;

  const CurrentMembershipStatusCard = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`relative overflow-hidden p-6 rounded-[2.5rem] ${currentLevel.color_class} border-2 border-black shadow-soft mb-8 text-black`}
    >
      <div className="absolute top-4 right-4 text-black/10">
        {React.cloneElement(currentIcon as React.ReactElement, { size: 100 })}
      </div>

      <div className="relative z-10 space-y-4">
        <div className="flex flex-col items-center gap-1">
          <div className="bg-white border-2 border-black px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-wider mb-2">
            ระดับปัจจุบันของคุณ
          </div>
          <h3 className="text-3xl font-black">{currentLevel.name}</h3>
          {tierExpiry && (
             <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-600 bg-white/40 px-3 py-1 rounded-full border border-black/10">
               <Clock size={12} />
               รักษาระดับถึง: <span className="text-black font-black underline">{tierExpiry}</span>
             </div>
          )}
        </div>

        <div className="bg-white border-2 border-black p-4 rounded-3xl text-center">
          <div className="flex items-baseline justify-center gap-1">
            <span className="text-4xl font-black">{totalAccumulatedPoints.toLocaleString()}</span>
            <span className="text-sm font-bold text-slate-500"> / {nextLevel ? nextLevel.min_points.toLocaleString() : 'MAX'} คะแนน</span>
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

        <div className="bg-white/60 p-3 rounded-2xl border border-black/5 flex items-start gap-3">
           <ShieldCheck size={20} className="text-emerald-600 shrink-0 mt-0.5" />
           <div>
              <p className="text-[11px] font-black text-black leading-tight">เงื่อนไขการรักษาระดับ</p>
              <p className="text-[10px] font-bold text-slate-600 leading-tight mt-1">
                สะสมให้ครบ <span className="text-black font-black underline">{currentTierMaxPoints.toLocaleString()}</span> คะแนน ภายในระยะที่กำหนดเพื่อรักษาระดับสมาชิก หรือสะสมเพิ่มเพื่อเลื่อนระดับ
              </p>
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
          {activeTiers.length} ระดับ
        </div>
      </div>
      
      <CurrentMembershipStatusCard />

      <div className="space-y-6">
        <h3 className="text-lg font-black text-slate-800 px-1">รายละเอียดและสิทธิประโยชน์</h3>
        {orderedTiers.map((tier, index) => { 
          const isCurrentLevel = (tier.tier_key || tier.id) === (currentLevel.tier_key || currentLevel.id);
          const tierIcon = iconMap[tier.icon_name] || <PawPrint size={20} />;
          const benefitsList = Array.isArray(tier.benefits) ? tier.benefits : [];
          
          return (
            <motion.div
              key={tier.id || tier.tier_key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`relative bg-white rounded-[2.5rem] border-2 shadow-soft overflow-hidden transition-all duration-300 ${
                !isCurrentLevel 
                  ? 'grayscale opacity-30 scale-[0.95] bg-slate-50 border-slate-200 shadow-none pointer-events-none' 
                  : 'border-black z-10 ring-4 ring-black/5'
              }`}
            >
              <div className={`p-5 border-b-2 ${isCurrentLevel ? 'border-black ' + tier.color_class : 'border-slate-200 bg-slate-100'} flex items-center justify-between`}>
                <div className="flex items-center gap-3">
                   <div className={`w-12 h-12 border-2 rounded-2xl flex items-center justify-center shadow-sm ${isCurrentLevel ? 'bg-white border-black' : 'bg-slate-50 border-slate-200 text-slate-200'}`}>
                      {tierIcon}
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
                  <p className={`text-lg font-black ${isCurrentLevel ? 'text-black' : 'text-slate-300'}`}>{tier.min_points.toLocaleString()}</p>
                </div>
              </div>

              <div className="p-5">
                <p className={`text-xs font-bold mb-4 ${isCurrentLevel ? 'text-slate-500' : 'text-slate-200'}`}>{tier.description}</p>
                <ul className="space-y-3">
                  {benefitsList.map((benefit: string, bIndex: number) => (
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