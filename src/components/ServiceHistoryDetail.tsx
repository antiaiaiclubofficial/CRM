"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Clock, DollarSign, FileText, Image, Info, PawPrint, Droplet, Sparkles, UserCog } from 'lucide-react';

interface ServiceDetail {
  id: string | number;
  date: string;
  petName: string;
  service: string;
  price: string;
  icon: React.ReactNode;
  bg: string;
  description: string;
  notes?: string;
  shampooUsed?: string;
  spaTreatment?: string;
  groomerNotes?: string;
  beforeAfterImages?: { before: string; after: string; }[];
}

interface ServiceHistoryDetailProps {
  service: ServiceDetail;
  onBack: () => void;
}

const ServiceHistoryDetail = ({ service, onBack }: ServiceHistoryDetailProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6 pb-24"
    >
      {/* Header with Back button */}
      <div className="flex items-center gap-4 mb-4">
        <button 
          onClick={onBack} 
          className="w-10 h-10 flex items-center justify-center text-primary/40 hover:text-primary hover:bg-slate-100 rounded-full active:scale-90 transition-all shrink-0"
        >
          <ArrowLeft size={28} strokeWidth={2.5} />
        </button>
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-black text-surface-variant opacity-40 uppercase tracking-[0.2em] mb-0.5">Service Details</p>
          <h3 className="text-2xl font-black text-primary tracking-tight truncate">รายละเอียดบริการ</h3>
        </div>
      </div>

      {/* Service Summary Card */}
      <div className="bg-white p-6 rounded-[2.5rem] shadow-ambient border border-white/40 relative overflow-hidden">
        <div className="absolute -right-6 -bottom-6 w-28 h-28 bg-primary/5 rounded-full blur-2xl pointer-events-none" />
        
        <div className="flex items-center gap-4 mb-5 relative z-10">
          <div className={`w-14 h-14 ${service.bg} rounded-2xl flex items-center justify-center text-2xl shadow-inner shrink-0`}>
            {service.icon}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-black text-primary text-lg leading-tight truncate">{service.service}</h3>
            <div className="flex items-center gap-1.5 mt-1.5">
              <span className="text-[9px] font-black px-2.5 py-0.5 rounded-full bg-secondary/10 text-primary uppercase tracking-wider">
                น้อง{service.petName}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 border-t border-slate-50 pt-4 relative z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-blue-50 rounded-xl flex items-center justify-center text-blue-500 shrink-0">
              <Calendar size={14} />
            </div>
            <div>
              <p className="text-[9px] font-bold text-slate-400 uppercase">วันที่รับบริการ</p>
              <p className="text-xs font-black text-primary">{service.date}</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-500 shrink-0">
              <DollarSign size={14} />
            </div>
            <div>
              <p className="text-[9px] font-bold text-slate-400 uppercase">ค่าบริการ</p>
              <p className="text-xs font-black text-primary">฿{service.price}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Service Description */}
      <div className="space-y-3">
        <h4 className="text-xs font-black text-surface-variant uppercase tracking-[0.2em] px-1">รายละเอียดบริการ</h4>
        <div className="bg-white p-6 rounded-[2rem] shadow-ambient border border-white/40">
          <p className="text-sm font-bold text-primary leading-relaxed">{service.description}</p>
        </div>
      </div>

      {/* Shampoo Used & Spa Treatment in 2 columns */}
      {(service.shampooUsed || service.spaTreatment) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {service.shampooUsed && (
            <div className="space-y-3">
              <h4 className="text-xs font-black text-surface-variant uppercase tracking-[0.2em] px-1">แชมพูที่ใช้</h4>
              <div className="bg-white p-5 rounded-[2rem] shadow-ambient border border-white/40 flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-50 rounded-xl flex items-center justify-center text-blue-500 shrink-0 mt-0.5">
                  <Droplet size={16} />
                </div>
                <div>
                  <p className="text-sm font-bold text-primary leading-relaxed">{service.shampooUsed}</p>
                </div>
              </div>
            </div>
          )}

          {service.spaTreatment && (
            <div className="space-y-3">
              <h4 className="text-xs font-black text-surface-variant uppercase tracking-[0.2em] px-1">ทรีทเมนต์สปา</h4>
              <div className="bg-white p-5 rounded-[2rem] shadow-ambient border border-white/40 flex items-start gap-3">
                <div className="w-8 h-8 bg-amber-50 rounded-xl flex items-center justify-center text-amber-500 shrink-0 mt-0.5">
                  <Sparkles size={16} />
                </div>
                <div>
                  <p className="text-sm font-bold text-primary leading-relaxed">{service.spaTreatment}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Notes (if any) */}
      {service.notes && (
        <div className="space-y-3">
          <h4 className="text-xs font-black text-surface-variant uppercase tracking-[0.2em] px-1">หมายเหตุจากเจ้าของ</h4>
          <div className="bg-white p-6 rounded-[2rem] shadow-ambient border border-white/40 relative overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-pink-500" />
            <p className="text-sm font-bold text-primary leading-relaxed pl-2">"{service.notes}"</p>
          </div>
        </div>
      )}

      {/* Groomer Notes (if any) */}
      {service.groomerNotes && (
        <div className="space-y-3">
          <h4 className="text-xs font-black text-surface-variant uppercase tracking-[0.2em] px-1">ข้อสังเกตจากช่าง</h4>
          <div className="bg-white p-6 rounded-[2rem] shadow-ambient border border-white/40 relative overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-emerald-500" />
            <p className="text-sm font-bold text-primary leading-relaxed pl-2">{service.groomerNotes}</p>
          </div>
        </div>
      )}

      {/* Before-After Images */}
      {service.beforeAfterImages && service.beforeAfterImages.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-xs font-black text-surface-variant uppercase tracking-[0.2em] px-1">รูปภาพ Before-After</h4>
          <div className="grid grid-cols-2 gap-4">
            {service.beforeAfterImages.map((images, index) => (
              <div key={index} className="bg-white p-4 rounded-[2rem] shadow-ambient border border-white/40 flex flex-col items-center gap-3">
                <div className="w-full">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5 text-center">ก่อนรับบริการ</p>
                  <img src={images.before} alt="Before" className="w-full h-28 object-cover rounded-2xl shadow-sm" />
                </div>
                <div className="w-full">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5 text-center">หลังรับบริการ</p>
                  <img src={images.after} alt="After" className="w-full h-28 object-cover rounded-2xl shadow-sm" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default ServiceHistoryDetail;