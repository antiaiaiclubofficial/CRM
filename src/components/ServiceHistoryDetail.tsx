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
      className="space-y-6 pb-20"
    >
      {/* Header with Back button */}
      <div className="flex justify-between items-center mb-4">
        <button onClick={onBack} className="flex items-center gap-1 text-slate-500 hover:text-pink-500 transition-colors">
          <ArrowLeft size={20} />
          <span className="text-sm font-medium">กลับ</span>
        </button>
      </div>

      {/* Service Summary Card */}
      <div className="bg-white p-5 rounded-[2.5rem] shadow-sm border border-slate-50">
        <div className="flex items-center gap-4 mb-4">
          <div className={`w-14 h-14 ${service.bg} rounded-2xl flex items-center justify-center text-xl shadow-inner`}>
            {service.icon}
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-slate-800 text-lg">{service.service}</h3>
            <p className="text-xs text-slate-500">สำหรับ: <span className="text-slate-700 font-medium">{service.petName}</span></p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-y-2 text-sm border-t border-slate-50 pt-4">
          <div className="flex items-center gap-2 text-slate-600">
            <Calendar size={16} className="text-pink-500" />
            <span className="font-medium">วันที่: <span className="font-bold">{service.date}</span></span>
          </div>
          <div className="flex items-center gap-2 text-slate-600">
            <DollarSign size={16} className="text-pink-500" />
            <span className="font-medium">ราคา: <span className="font-bold">฿{service.price}</span></span>
          </div>
        </div>
      </div>

      {/* Service Description */}
      <div className="space-y-3">
        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <FileText size={20} className="text-pink-500" /> รายละเอียดบริการ
        </h3>
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-50">
          <p className="text-sm text-slate-700">{service.description}</p>
        </div>
      </div>

      {/* Shampoo Used & Spa Treatment in 2 columns */}
      {(service.shampooUsed || service.spaTreatment) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {service.shampooUsed && (
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <Droplet size={20} className="text-blue-500" /> แชมพูที่ใช้
              </h3>
              <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-50">
                <p className="text-sm text-slate-700">{service.shampooUsed}</p>
              </div>
            </div>
          )}

          {service.spaTreatment && (
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <Sparkles size={20} className="text-amber-500" /> ทรีทเมนต์สปา
              </h3>
              <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-50">
                <p className="text-sm text-slate-700">{service.spaTreatment}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Notes (if any) */}
      {service.notes && (
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Info size={20} className="text-purple-500" /> หมายเหตุจากเจ้าของ
          </h3>
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-50">
            <p className="text-sm text-slate-700">{service.notes}</p>
          </div>
        </div>
      )}

      {/* Groomer Notes (if any) */}
      {service.groomerNotes && (
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <UserCog size={20} className="text-emerald-500" /> ข้อสังเกตจากช่าง
          </h3>
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-50">
            <p className="text-sm text-slate-700">{service.groomerNotes}</p>
          </div>
        </div>
      )}

      {/* Before-After Images */}
      {service.beforeAfterImages && service.beforeAfterImages.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Image size={20} className="text-pink-500" /> รูปภาพ Before-After
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {service.beforeAfterImages.map((images, index) => (
              <div key={index} className="bg-white p-3 rounded-2xl shadow-sm border border-slate-50 flex flex-col items-center gap-2">
                <img src={images.before} alt="Before" className="w-full h-24 object-cover rounded-lg mb-1" />
                <p className="text-xs font-medium text-slate-500">ก่อน</p>
                <img src={images.after} alt="After" className="w-full h-24 object-cover rounded-lg mt-2" />
                <p className="text-xs font-medium text-slate-500">หลัง</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default ServiceHistoryDetail;