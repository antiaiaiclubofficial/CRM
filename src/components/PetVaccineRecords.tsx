"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Syringe, Calendar, Plus, Trash2, AlertTriangle, Clock, Info } from 'lucide-react';
import AddVaccineModal from './AddVaccineModal';

interface VaccineLog {
  id: string;
  title: string;
  date: string;
  next_due_date?: string;
  description?: string;
}

interface PetVaccineRecordsProps {
  data: VaccineLog[];
  petName: string;
  onAddVaccine: (data: { title: string; date: string; next_due_date: string; description: string }) => Promise<void>;
  onDeleteVaccine: (id: string) => Promise<void>;
}

const PetVaccineRecords = ({ data, petName, onAddVaccine, onDeleteVaccine }: PetVaccineRecordsProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const handleConfirmDelete = async () => {
    if (deleteConfirmId) {
      await onDeleteVaccine(deleteConfirmId);
      setDeleteConfirmId(null);
    }
  };

  // จัดเรียงข้อมูลตามวันที่ฉีดล่าสุดขึ้นก่อน
  const sortedData = [...data].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // ค้นหาวัคซีนที่มีนัดหมายครั้งถัดไปที่ใกล้ที่สุด
  const upcomingVaccine = data
    .filter(v => v.next_due_date && new Date(v.next_due_date) >= new Date())
    .sort((a, b) => new Date(a.next_due_date!).getTime() - new Date(b.next_due_date!).getTime())[0];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Upcoming Vaccine Alert Card */}
      {upcomingVaccine && (
        <div className="bg-gradient-to-br from-[#E0F7F9] to-[#B2EBF2] p-5 rounded-[2rem] border border-[#80DEEA] shadow-sm relative overflow-hidden">
          <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-[#2BC0D3]/10 rounded-full blur-2xl" />
          <div className="flex items-start gap-4 relative z-10">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-[#2BC0D3] shrink-0 shadow-sm">
              <Clock size={20} />
            </div>
            <div>
              <span className="text-[9px] font-black text-[#00838F] bg-white/60 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                นัดหมายครั้งถัดไป
              </span>
              <h4 className="font-black text-[#006064] text-sm mt-1.5">
                {upcomingVaccine.title}
              </h4>
              <p className="text-xs font-bold text-[#00838F] mt-1">
                วันที่นัด: {new Date(upcomingVaccine.next_due_date!).toLocaleDateString('th-TH', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Header & Add Button */}
      <div className="bg-white p-6 rounded-xl shadow-ambient relative overflow-hidden">
        <div className="flex justify-between items-center">
          <div>
            <h4 className="text-lg font-black text-primary tracking-tight">ประวัติการรับวัคซีน</h4>
            <p className="text-[11px] font-bold text-surface-variant opacity-50 uppercase tracking-widest">Vaccination Timeline</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="w-12 h-12 bg-[#E0F7F9] text-[#2BC0D3] rounded-2xl shadow-lg shadow-[#2BC0D3]/10 flex items-center justify-center active:scale-90 transition-all"
          >
            <Plus size={24} strokeWidth={3} />
          </button>
        </div>
      </div>

      {/* Vaccine Timeline List */}
      <div className="space-y-4">
        <div className="flex justify-between items-center px-1">
          <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">รายการวัคซีนทั้งหมด</h4>
          <span className="text-[10px] font-bold text-slate-400 uppercase">{data.length} รายการ</span>
        </div>

        <div className="space-y-3">
          {sortedData.length > 0 ? (
            sortedData.map((entry, i) => (
              <motion.div 
                key={entry.id} 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white p-5 rounded-[2rem] shadow-ambient flex justify-between items-center group border border-black/5"
              >
                <div className="flex items-center gap-4 min-w-0 flex-1">
                  <div className="w-11 h-11 bg-[#E0F7F9] rounded-2xl flex items-center justify-center text-[#2BC0D3] shrink-0">
                    <Syringe size={20} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h5 className="font-black text-primary text-sm truncate leading-tight">{entry.title}</h5>
                    <p className="text-[10px] font-bold text-slate-400 mt-1 flex items-center gap-1">
                      <Calendar size={10} />
                      {new Date(entry.date).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: '2-digit' })}
                      {entry.next_due_date && (
                        <span className="text-pink-500 font-black ml-1">
                          • นัดถัดไป: {new Date(entry.next_due_date).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: '2-digit' })}
                        </span>
                      )}
                    </p>
                    {entry.description && (
                      <p className="text-[10px] font-medium text-slate-500 mt-1 truncate">
                        {entry.description}
                      </p>
                    )}
                  </div>
                </div>
                <button 
                  onClick={() => setDeleteConfirmId(entry.id)}
                  className="w-10 h-10 flex items-center justify-center text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-all active:scale-90 shrink-0"
                  title="ลบข้อมูล"
                >
                  <Trash2 size={18} />
                </button>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-16 bg-white rounded-[2.5rem] shadow-ambient border border-black/5 p-8 flex flex-col items-center justify-center">
              <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 mb-4 border border-slate-100">
                <Syringe size={28} />
              </div>
              <h3 className="text-base font-black text-primary mb-1">ยังไม่มีประวัติวัคซีน</h3>
              <p className="text-xs font-bold text-surface-variant opacity-60 max-w-[200px] leading-relaxed">
                บันทึกประวัติวัคซีนของน้องเพื่อช่วยเตือนความจำและติดตามสุขภาพอย่างใกล้ชิดค่ะ 🐾
              </p>
            </div>
          )}
        </div>
      </div>

      <AddVaccineModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        petName={petName} 
        onSave={onAddVaccine} 
      />

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirmId && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center px-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeleteConfirmId(null)}
              className="absolute inset-0 bg-primary/60 backdrop-blur-md"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-[320px] bg-white rounded-[2.5rem] shadow-ambient p-8 text-center border border-black/5"
            >
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertTriangle size={32} className="text-red-500" />
              </div>
              <h3 className="text-xl font-black text-primary mb-2">ยืนยันการลบ?</h3>
              <p className="text-xs font-medium text-surface-variant opacity-70 mb-8 leading-relaxed">
                คุณต้องการลบข้อมูลประวัติวัคซีน <br/>
                <span className="font-black text-primary">
                  {data.find(d => d.id === deleteConfirmId)?.title}
                </span> ใช่หรือไม่?
              </p>
              <div className="space-y-3">
                <button 
                  onClick={handleConfirmDelete}
                  className="w-full py-4 bg-red-500 text-white rounded-lg font-black uppercase tracking-widest text-xs active:scale-95 transition-all"
                >
                  ยืนยันการลบ
                </button>
                <button 
                  onClick={() => setDeleteConfirmId(null)}
                  className="w-full py-4 bg-surface-container-low text-primary rounded-lg font-black uppercase tracking-widest text-xs active:scale-95 transition-all"
                >
                  ยกเลิก
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default PetVaccineRecords;