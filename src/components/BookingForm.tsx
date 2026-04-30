"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, ChevronLeft, Calendar as CalendarIcon, Clock, Scissors, Check, Info, AlertCircle, PawPrint } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { th } from 'date-fns/locale';
import { toast } from 'sonner';

interface Pet {
  id: string;
  name: string;
  imageUrl: string;
  breed: string;
}

interface Service {
  id: string;
  name: string;
  price: number;
  description: string;
}

interface BookingFormProps {
  isOpen: boolean;
  onClose: () => void;
  pets: Pet[];
  services: Service[];
  onConfirm: (data: any) => Promise<void>;
}

const timeSlots = [
  '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'
];

const BookingForm = ({ isOpen, onClose, pets, services, onConfirm }: BookingFormProps) => {
  const [step, setStep] = useState(1);
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [notes, setNotes] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNext = () => setStep(prev => prev + 1);
  const handleBack = () => setStep(prev => prev - 1);

  const handleSubmit = async () => {
    if (!selectedPet || !selectedService || !selectedDate || !selectedTime || !agreed) return;
    
    setIsSubmitting(true);
    try {
      const [hours, minutes] = selectedTime.split(':');
      const startTime = new Date(selectedDate);
      startTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

      await onConfirm({
        pet_id: selectedPet.id,
        service_id: selectedService.id,
        start_time: startTime.toISOString(),
        notes: notes
      });
      onClose();
      // Reset form
      setStep(1);
      setSelectedPet(null);
      setSelectedService(null);
      setSelectedTime(null);
      setNotes('');
      setAgreed(false);
    } catch (error) {
      toast.error('เกิดข้อผิดพลาดในการจอง กรุณาลองใหม่อีกครั้งค่ะ');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            className="relative w-full max-w-[390px] bg-white rounded-t-[3rem] h-[85vh] overflow-hidden shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex justify-between items-center shrink-0 bg-white pt-8 pb-4 px-8 z-10 rounded-t-[3rem] border-b border-slate-50">
              <div className="flex items-center gap-3">
                 {step > 1 && (
                   <button onClick={handleBack} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                     <ChevronLeft size={20} />
                   </button>
                 )}
                 <h3 className="font-black text-xl text-slate-800">จองนัดหมาย</h3>
              </div>
              <button onClick={onClose} className="p-2 bg-slate-100 rounded-full text-slate-400">
                <X size={20} />
              </button>
            </div>

            {/* Step Content */}
            <div className="flex-1 px-8 py-6 overflow-y-auto no-scrollbar">
              {step === 1 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <PawPrint size={18} className="text-pink-500" />
                    <h4 className="font-bold text-slate-700">เลือกสัตว์เลี้ยง</h4>
                  </div>
                  <div className="grid grid-cols-2 gap-4 pb-4">
                    {pets.map(pet => (
                      <button
                        key={pet.id}
                        onClick={() => { setSelectedPet(pet); handleNext(); }}
                        className={`p-4 rounded-3xl border-2 transition-all flex flex-col items-center gap-2 ${selectedPet?.id === pet.id ? 'border-pink-500 bg-pink-50' : 'border-slate-100 bg-white'}`}
                      >
                        <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow-sm">
                          <img src={pet.imageUrl} alt={pet.name} className="w-full h-full object-cover" />
                        </div>
                        <span className="font-bold text-sm">{pet.name}</span>
                      </button>
                    ))}
                    {pets.length === 0 && (
                      <div className="col-span-2 py-8 text-center bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                        <p className="text-sm text-slate-400">กรุณาเพิ่มสัตว์เลี้ยงก่อนจองนะคะ</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Scissors size={18} className="text-pink-500" />
                    <h4 className="font-bold text-slate-700">เลือกประเภทบริการ</h4>
                  </div>
                  <div className="space-y-3 pb-4">
                    {services.map(service => (
                      <button
                        key={service.id}
                        onClick={() => { setSelectedService(service); handleNext(); }}
                        className={`w-full p-4 rounded-[2rem] border-2 transition-all text-left flex justify-between items-center ${selectedService?.id === service.id ? 'border-pink-500 bg-pink-50' : 'border-slate-100 bg-white'}`}
                      >
                        <div>
                          <p className="font-black text-slate-800">{service.name}</p>
                          <p className="text-[10px] text-slate-500 mt-1">{service.description}</p>
                        </div>
                        <span className="font-black text-pink-500">฿{service.price}</span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <CalendarIcon size={18} className="text-pink-500" />
                      <h4 className="font-bold text-slate-700">เลือกวันที่</h4>
                    </div>
                    <div className="bg-slate-50 p-2 rounded-3xl flex justify-center">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        disabled={(date) => date < new Date() || date.getDay() === 0}
                        locale={th}
                        className="rounded-md border-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-3 pb-4">
                    <div className="flex items-center gap-2">
                      <Clock size={18} className="text-pink-500" />
                      <h4 className="font-bold text-slate-700">เลือกเวลา</h4>
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      {timeSlots.map(time => (
                        <button
                          key={time}
                          onClick={() => setSelectedTime(time)}
                          className={`py-2 rounded-xl border-2 font-bold text-xs transition-all ${selectedTime === time ? 'border-pink-500 bg-pink-50 text-pink-600' : 'border-slate-100 bg-white text-slate-600'}`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    disabled={!selectedDate || !selectedTime}
                    onClick={handleNext}
                    className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black shadow-lg disabled:opacity-50 mt-4 mb-8"
                  >
                    ดูสรุปรายละเอียด
                  </button>
                </motion.div>
              )}

              {step === 4 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6 pb-12">
                  <div className="bg-slate-50 p-6 rounded-[2.5rem] border-2 border-black shadow-soft space-y-4">
                    <h4 className="font-black text-center text-slate-800 border-b border-black/5 pb-2 uppercase tracking-widest text-xs">สรุปการจอง</h4>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500 font-bold">สัตว์เลี้ยง:</span>
                        <span className="font-black text-slate-800">น้อง{selectedPet?.name}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500 font-bold">บริการ:</span>
                        <span className="font-black text-slate-800">{selectedService?.name}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500 font-bold">วัน-เวลา:</span>
                        <span className="font-black text-slate-800">
                          {selectedDate && format(selectedDate, 'd MMM yy', { locale: th })} • {selectedTime} น.
                        </span>
                      </div>
                      <div className="flex justify-between items-center pt-2 border-t border-black/5">
                        <span className="text-slate-500 font-bold">ราคาสุทธิ:</span>
                        <span className="text-lg font-black text-pink-500">฿{selectedService?.price}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-xs font-bold text-slate-500 px-1">โน๊ตถึงร้าน (ถ้ามี)</label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="เช่น ระบุช่างที่ต้องการ หรือข้อควรระวังพิเศษ"
                      className="w-full p-4 bg-slate-50 rounded-2xl outline-none text-sm font-medium border border-slate-100 min-h-[80px]"
                    />
                  </div>

                  <div className="bg-amber-50 p-4 rounded-2xl border border-amber-100">
                    <div className="flex gap-2 items-start">
                      <Info size={16} className="text-amber-500 shrink-0 mt-0.5" />
                      <div className="text-[10px] text-amber-700 font-bold leading-relaxed">
                        * กรุณามาก่อนเวลานัดหมาย 15 นาที หากมาช้าเกิน 30 นาที ทางร้านขอสงวนสิทธิ์ในการยกเลิกนัดหมาย
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 px-1">
                    <button 
                      onClick={() => setAgreed(!agreed)}
                      className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${agreed ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300'}`}
                    >
                      {agreed && <Check size={14} strokeWidth={4} />}
                    </button>
                    <p className="text-[11px] font-bold text-slate-500">
                      ฉันยอมรับ <span className="text-slate-800 underline">เงื่อนไขการรับบริการ</span> และข้อตกลงข้างต้น
                    </p>
                  </div>

                  <button
                    disabled={!agreed || isSubmitting}
                    onClick={handleSubmit}
                    className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black shadow-lg shadow-slate-200 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isSubmitting ? 'กำลังส่งข้อมูล...' : <><Check size={20} /> ยืนยันการจอง</>}
                  </button>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default BookingForm;