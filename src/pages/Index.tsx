"use client";

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useLiff } from '@/hooks/use-liff';
import MembershipCard from '@/components/MembershipCard';
import PetList from '@/components/PetList';
import PetDetailView from '@/components/PetDetailView';
import PetForm from '@/components/PetForm';
import ServiceHistory from '@/components/ServiceHistory';
import Promotions from '@/components/Promotions';
import UpcomingAppointments from '@/components/UpcomingAppointments';
import UserProfileEdit from '@/components/UserProfileEdit';
import MembershipLevels from '@/components/MembershipLevels';
import ServiceHistoryDetail from '@/components/ServiceHistoryDetail';
import PetPreferenceForm from '@/components/PetPreferenceForm';
import PetManagement from '@/components/PetManagement';
import QRCodeModal from '@/components/QRCodeModal';
import MyCouponsHomePreview from '@/components/MyCouponsHomePreview';
import CouponUseModal from '@/components/CouponUseModal';
import HomeQuickActions from '@/components/HomeQuickActions';
import AppointmentList from '@/components/AppointmentList';
import AppointmentDetailModal from '@/components/AppointmentDetailModal';
import BookingForm from '@/components/BookingForm';
import Register from './Register';
import { Home, Award, PawPrint, Megaphone, Calendar, History, Scissors, Sparkles, PlusCircle, LogIn, FlaskConical } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

const formatDateThai = (dateString?: string) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: '2-digit' });
};

const Index = () => {
  const queryClient = useQueryClient();
  const { profile: lineProfile, loading: liffLoading } = useLiff();
  const [activeTab, setActiveTab] = useState('home');
  const [isProfileEditing, setIsProfileEditing] = useState(false);
  const [isQRCodeOpen, setIsQRCodeOpen] = useState(false);
  
  const [selectedPetId, setSelectedPetId] = useState<string | number | null>(null);
  const [selectedServiceId, setSelectedServiceId] = useState<string | number | null>(null);
  const [selectedAppointment, setSelectedAppointment] = useState<any | null>(null);
  
  const [isPetFormOpen, setIsPetFormOpen] = useState(false);
  const [petToEditId, setPetToEditId] = useState<string | number | null>(null);
  const [isPreferenceFormOpen, setIsPreferenceFormOpen] = useState(false);
  const [selectedCouponToUse, setSelectedCouponToUse] = useState<any | null>(null);
  const [isCouponUseModalOpen, setIsCouponUseModalOpen] = useState(false);
  const [isBookingFormOpen, setIsBookingFormOpen] = useState(false);
  const [isAppointmentDetailOpen, setIsAppointmentDetailOpen] = useState(false);
  
  const mainScrollRef = useRef<HTMLElement>(null);

  const { data: store, isLoading: storeLoading } = useQuery({
    queryKey: ['current_store'],
    queryFn: async () => {
      const targetStoreId = 'b0f3c613-f742-4c86-951a-eaa65c8b1667';
      const { data, error } = await supabase
        .from('stores')
        .select('*')
        .eq('id', targetStoreId)
        .maybeSingle();
        
      if (error || !data) {
        const { data: fallback } = await supabase.from('stores').select('*').limit(1).maybeSingle();
        return fallback;
      }
      return data;
    }
  });

  const { data: customerData, isLoading: profileLoading } = useQuery({
    queryKey: ['customer_profile', lineProfile?.userId, store?.id],
    queryFn: async () => {
      if (!lineProfile?.userId || !store?.id) return null;
      
      const { data: customer, error: customerError } = await supabase
        .from('customers')
        .select('*')
        .eq('line_user_id', lineProfile.userId)
        .maybeSingle();
      
      if (customerError) throw customerError;
      if (!customer) return null;

      const { data: membership, error: memberError } = await supabase
        .from('store_customers')
        .select('*')
        .eq('customer_id', customer.id)
        .eq('store_id', store.id)
        .maybeSingle();

      if (memberError) throw memberError;

      const { data: pets, error: petsError } = await supabase
        .from('pets')
        .select('*')
        .eq('customer_id', customer.id);

      const { data: coupons, error: couponError } = await supabase
        .from('customer_coupons')
        .select('*, coupon_templates(*)')
        .eq('customer_id', customer.id)
        .eq('store_id', store.id);

      const { data: deals, error: dealError } = await supabase
        .from('customers_deals')
        .select('*, deal_templates(*)')
        .eq('customer_id', customer.id)
        .eq('store_id', store.id);

      const { data: history, error: historyError } = await supabase
        .from('service_history')
        .select('*, pets(*)')
        .eq('customer_id', customer.id)
        .eq('store_id', store.id)
        .order('created_at', { ascending: false });

      const { data: appointments, error: aptError } = await supabase
        .from('appointments')
        .select('*, pets(*), services(*)')
        .eq('customer_id', customer.id)
        .order('start_time', { ascending: true });

      return {
        profile: customer,
        membership: membership,
        pets: (pets || []).map(p => ({
          ...p,
          imageUrl: p.image_url,
          cardBgColor: p.card_bg_color || '#FFD8E4',
          custom_preferences: p.custom_preferences || []
        })),
        coupons: coupons || [],
        deals: deals || [],
        history: history || [],
        appointments: appointments || []
      };
    },
    enabled: !!lineProfile?.userId && !!store?.id,
  });

  const { data: storeServices } = useQuery({
    queryKey: ['store_services', store?.id],
    queryFn: async () => {
      if (!store?.id) return [];
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('store_id', store.id);
      if (error) throw error;
      return data;
    },
    enabled: !!store?.id
  });

  const { data: couponTemplates } = useQuery({
    queryKey: ['coupon_templates', store?.id],
    queryFn: async () => {
      if (!store?.id) return [];
      const { data, error } = await supabase
        .from('coupon_templates')
        .select('*')
        .eq('store_id', store.id)
        .eq('is_active', true);
      if (error) throw error;
      return data;
    },
    enabled: !!store?.id
  });

  const { data: dealTemplates } = useQuery({
    queryKey: ['deal_templates', store?.id],
    queryFn: async () => {
      if (!store?.id) return [];
      const { data, error } = await supabase
        .from('deal_templates')
        .select('*')
        .eq('store_id', store.id)
        .eq('is_active', true);
      if (error) throw error;
      return data;
    },
    enabled: !!store?.id
  });

  const deleteAppointmentMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('appointments').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('ยกเลิกการนัดหมายเรียบร้อยแล้วค่ะ');
      queryClient.invalidateQueries({ queryKey: ['customer_profile'] });
    }
  });

  const registerMutation = useMutation({
    mutationFn: async (regData: any) => {
      if (!lineProfile?.userId || !store?.id) throw new Error("Missing LINE profile or store context");
      
      const { data: newCustomer, error: custError } = await supabase
        .from('customers')
        .insert([{
          line_user_id: lineProfile.userId,
          display_name: lineProfile.displayName,
          avatar_url: lineProfile.pictureUrl,
          first_name: regData.firstName,
          last_name: regData.lastName,
          phone: regData.phone,
          email: regData.email,
          gender: regData.gender,
          age: regData.age,
          address: regData.address,
          sub_district: regData.subDistrict,
          district: regData.district,
          province: regData.province,
          postal_code: regData.postalCode
        }])
        .select()
        .single();
        
      if (custError) throw custError;

      const { error: memberError } = await supabase
        .from('store_customers')
        .insert([{
          customer_id: newCustomer.id,
          store_id: store.id,
          points: 0,
          total_points: 0,
          tier: 'bronze'
        }]);
        
      if (memberError) throw memberError;
    },
    onSuccess: () => {
      toast.success('ลงทะเบียนเรียบร้อยแล้วค่ะ ยินดีต้อนรับนะคะ! ✨');
      queryClient.invalidateQueries({ queryKey: ['customer_profile'] });
    }
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (profileData: any) => {
      if (!customerData?.profile?.id) throw new Error("Missing customer ID");
      
      const dbData = {
        first_name: profileData.firstName,
        last_name: profileData.lastName,
        gender: profileData.gender,
        age: profileData.age,
        phone: profileData.phone,
        address: profileData.address,
        sub_district: profileData.subDistrict,
        district: profileData.district,
        province: profileData.province,
        postal_code: profileData.postalCode,
        email: profileData.email,
      };

      const { error } = await supabase
        .from('customers')
        .update(dbData)
        .eq('id', customerData.profile.id);
        
      if (error) throw error;
      return dbData;
    },
    onSuccess: (updatedData) => {
      queryClient.setQueryData(['customer_profile', lineProfile?.userId, store?.id], (oldData: any) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          profile: {
            ...oldData.profile,
            ...updatedData
          }
        };
      });
      toast.success('อัปเดตโปรไฟล์เรียบร้อยแล้วค่ะ ✨');
      queryClient.invalidateQueries({ queryKey: ['customer_profile'] });
    }
  });

  const bookAppointmentMutation = useMutation({
    mutationFn: async (bookingData: any) => {
      if (!customerData?.profile?.id || !store?.id) throw new Error("Missing data");
      const { error } = await supabase
        .from('appointments')
        .insert([{
          ...bookingData,
          customer_id: customerData.profile.id,
          store_id: store.id,
          status: 'pending'
        }]);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('ส่งคำขอจองนัดหมายเรียบร้อยแล้วค่ะ กรุณารอการยืนยันจากทางร้านนะคะ ✨');
      queryClient.invalidateQueries({ queryKey: ['customer_profile'] });
    }
  });

  const redeemCouponMutation = useMutation({
    mutationFn: async ({ template, pointsCost }: { template: any, pointsCost: number }) => {
      if (!customerData?.profile?.id || !store?.id) throw new Error("Missing data");
      const { error: ptErr = null } = await supabase.from('store_customers').update({ points: customerData.membership.points - pointsCost }).eq('customer_id', customerData.profile.id).eq('store_id', store.id);
      if (ptErr) throw ptErr;
      const expiry = new Date(); expiry.setDate(expiry.getDate() + (template.expiry_days || 30));
      const { error: cpErr = null } = await supabase.from('customer_coupons').insert([{ template_id: template.id, customer_id: customerData.profile.id, store_id: store.id, status: 'unused', expires_at: expiry.toISOString() }]);
      if (cpErr) throw cpErr;
    },
    onMutate: async ({ template, pointsCost }) => {
      await queryClient.cancelQueries({ queryKey: ['customer_profile', lineProfile?.userId, store?.id] });
      const previousData = queryClient.getQueryData(['customer_profile', lineProfile?.userId, store?.id]);
      
      queryClient.setQueryData(['customer_profile', lineProfile?.userId, store?.id], (old: any) => {
        if (!old) return old;
        const tempId = 'temp-' + Math.random();
        const expiry = new Date(); expiry.setDate(expiry.getDate() + (template.expiry_days || 30));
        
        return {
          ...old,
          membership: { ...old.membership, points: old.membership.points - pointsCost },
          coupons: [
            ...old.coupons,
            { 
              id: tempId, 
              template_id: template.id, 
              status: 'unused', 
              expires_at: expiry.toISOString(),
              coupon_templates: template 
            }
          ]
        };
      });
      return { previousData };
    },
    onError: (err, variables, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(['customer_profile', lineProfile?.userId, store?.id], context.previousData);
      }
      toast.error('เกิดข้อผิดพลาดในการแลกคูปองค่ะ');
    },
    onSuccess: () => { 
      toast.success('แลกคูปองเรียบร้อยแล้วค่ะ! 🎫'); 
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['customer_profile'] }); 
    }
  });

  const buyDealMutation = useMutation({
    mutationFn: async ({ template, pointsCost }: { template: any, pointsCost: number }) => {
      if (!customerData?.profile?.id || !store?.id) throw new Error("Missing data");
      const { error: ptErr = null } = await supabase.from('store_customers').update({ points: customerData.membership.points - pointsCost }).eq('customer_id', customerData.profile.id).eq('store_id', store.id);
      if (ptErr) throw ptErr;
      const expiry = new Date(); expiry.setDate(expiry.getDate() + (template.expiry_days || 7));
      const { error: dlErr } = await supabase.from('customers_deals').insert([{ template_id: template.id, customer_id: customerData.profile.id, store_id: store.id, status: 'unused', expires_at: expiry.toISOString() }]);
      if (dlErr) throw dlErr;
    },
    onMutate: async ({ template, pointsCost }) => {
      await queryClient.cancelQueries({ queryKey: ['customer_profile', lineProfile?.userId, store?.id] });
      const previousData = queryClient.getQueryData(['customer_profile', lineProfile?.userId, store?.id]);
      
      queryClient.setQueryData(['customer_profile', lineProfile?.userId, store?.id], (old: any) => {
        if (!old) return old;
        const tempId = 'temp-' + Math.random();
        const expiry = new Date(); expiry.setDate(expiry.getDate() + (template.expiry_days || 7));
        
        return {
          ...old,
          membership: { ...old.membership, points: old.membership.points - pointsCost },
          deals: [
            ...old.deals,
            { 
              id: tempId, 
              template_id: template.id, 
              status: 'unused', 
              expires_at: expiry.toISOString(),
              deal_templates: template 
            }
          ]
        };
      });
      return { previousData };
    },
    onError: (err, variables, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(['customer_profile', lineProfile?.userId, store?.id], context.previousData);
      }
      toast.error('เกิดข้อผิดพลาดในการซื้อดีลค่ะ');
    },
    onSuccess: () => { 
      toast.success('ซื้อดีลพิเศษเรียบร้อยแล้วค่ะ! ✨'); 
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['customer_profile'] }); 
    }
  });

  const confirmUseMutation = useMutation({
    mutationFn: async (item: any) => {
      if (item.id.toString().startsWith('temp-')) {
        throw new Error("ระบบกำลังซิงค์ข้อมูลคูปอง กรุณารอสักครู่แล้วลองใหม่นะคะ");
      }
      const table = item.is_deal ? 'customers_deals' : 'customer_coupons';
      const { error } = await supabase.from(table).update({ status: 'used', used_at: new Date().toISOString() }).eq('id', item.id);
      if (error) throw error;
    },
    onMutate: async (usedItem) => {
      setIsCouponUseModalOpen(false);
      setSelectedCouponToUse(null);

      await queryClient.cancelQueries({ queryKey: ['customer_profile', lineProfile?.userId, store?.id] });
      const previousData = queryClient.getQueryData(['customer_profile', lineProfile?.userId, store?.id]);
      
      queryClient.setQueryData(['customer_profile', lineProfile?.userId, store?.id], (old: any) => {
        if (!old) return old;
        if (usedItem.is_deal) {
          return {
            ...old,
            deals: old.deals.map((d: any) => d.id === usedItem.id ? { ...d, status: 'used' } : d)
          };
        } else {
          return {
            ...old,
            coupons: old.coupons.map((c: any) => c.id === usedItem.id ? { ...c, status: 'used' } : c)
          };
        }
      });
      
      return { previousData };
    },
    onError: (err: any, usedItem, context: any) => {
      if (context?.previousData) {
        queryClient.setQueryData(['customer_profile', lineProfile?.userId, store?.id], context.previousData);
      }
      toast.error(err.message || 'เกิดข้อผิดพลาด กรุณาลองใหมีกรั้งค่ะ');
    },
    onSuccess: () => { 
      toast.success('ใช้งานเรียบร้อยแล้วค่ะ ✨'); 
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['customer_profile'] }); 
    }
  });

  const petMutation = useMutation({
    mutationFn: async (pet: any) => {
      if (!customerData?.profile?.id) throw new Error("Missing customer ID");
      const { id, ...petData } = pet;
      if (id) {
        const { error } = await supabase.from('pets').update(petData).eq('id', id);
        if (error) throw error;
        return { ...petData, id };
      } else {
        const { data, error } = await supabase.from('pets').insert([{ ...petData, customer_id: customerData.profile.id }]).select().single();
        if (error) throw error;
        return data;
      }
    },
    onSuccess: () => { 
      toast.success('บันทึกข้อมูลสัตว์เลี้ยงเรียบร้อยแล้วค่ะ 🐾'); 
      queryClient.invalidateQueries({ queryKey: ['customer_profile'] }); 
    }
  });

  const deletePetMutation = useMutation({
    mutationFn: async (petId: string | number) => {
      const { error } = await supabase.from('pets').delete().eq('id', petId);
      if (error) throw error;
    },
    onSuccess: () => { 
      toast.success('ลบข้อมูลสัตว์เลี้ยงเรียบร้อยแล้วค่ะ'); 
      setSelectedPetId(null); 
      queryClient.invalidateQueries({ queryKey: ['customer_profile'] }); 
    }
  });

  const savePreferencesMutation = useMutation({
    mutationFn: async (preferences: any) => {
      if (!selectedPetId) throw new Error("No pet selected");
      const { error } = await supabase.from('pets').update({ custom_preferences: preferences }).eq('id', selectedPetId);
      if (error) throw error;
      return preferences;
    },
    onSuccess: (newPrefs) => {
      queryClient.setQueryData(['customer_profile', lineProfile?.userId, store?.id], (oldData: any) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          pets: oldData.pets.map((p: any) => p.id === selectedPetId ? { ...p, custom_preferences: newPrefs } : p)
        };
      });
      toast.success('บันทึกความชอบส่วนตัวเรียบร้อยแล้วค่ะ 🦴');
      queryClient.invalidateQueries({ queryKey: ['customer_profile'] });
    }
  });

  const toggleFavoriteMutation = useMutation({
    mutationFn: async ({ petId, currentFav }: { petId: string | number, currentFav: boolean }) => {
      const { error } = await supabase.from('pets').update({ is_favorite: !currentFav }).eq('id', petId);
      if (error) throw error;
      return !currentFav;
    },
    onMutate: async ({ petId, currentFav }) => {
      await queryClient.cancelQueries({ queryKey: ['customer_profile', lineProfile?.userId, store?.id] });
      const previousData = queryClient.getQueryData(['customer_profile', lineProfile?.userId, store?.id]);
      queryClient.setQueryData(['customer_profile', lineProfile?.userId, store?.id], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          pets: old.pets.map((p: any) => p.id === petId ? { ...p, is_favorite: !currentFav } : p)
        };
      });
      return { previousData };
    },
    onError: (err, variables, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(['customer_profile', lineProfile?.userId, store?.id], context.previousData);
      }
      toast.error('ไม่สามารถบันทึกรายการโปรดได้ค่ะ');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['customer_profile'] });
    }
  });

  const handleNavClick = (tab: string) => {
    setActiveTab(tab);
    mainScrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGoToMyCoupons = () => {
    setActiveTab('promo');
    setTimeout(() => {
      const element = document.getElementById('my-coupons-section');
      const container = mainScrollRef.current;
      if (element && container) {
        const top = element.offsetTop - 80; 
        container.scrollTo({ top, behavior: 'smooth' });
      }
    }, 500);
  };

  const handleAppointmentClick = (apt: any) => {
    setSelectedAppointment(apt);
    setIsAppointmentDetailOpen(true);
  };

  const petsList = useMemo(() => {
    const rawPets = customerData?.pets || [];
    // Priority 1: is_favorite, Priority 2: created_at (oldest first)
    return [...rawPets].sort((a, b) => {
      if (a.is_favorite !== b.is_favorite) {
        return a.is_favorite ? -1 : 1;
      }
      // If favorite status is same, sort by created_at date
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return dateA - dateB;
    });
  }, [customerData]);

  const selectedPetForDetail = useMemo(() => petsList.find(p => p.id === selectedPetId) || null, [petsList, selectedPetId]);

  const serviceHistory = useMemo(() => (customerData?.history || []).map(h => ({
    id: h.id,
    date: formatDateThai(h.created_at),
    petName: h.pets?.name || 'ไม่ระบุ',
    service: h.note || 'รับบริการทั่วไป',
    price: h.price?.toString() || '0',
    icon: <Scissors className="text-pink-500" />,
    bg: 'bg-pink-50',
    description: h.note,
  })), [customerData]);

  const appointmentHistory = useMemo(() => (customerData?.appointments || []).map(a => ({
    id: a.id,
    petName: a.pets?.name || 'ไม่ระบุ',
    petImage: a.pets?.image_url,
    petBreed: a.pets?.breed,
    service: a.services?.name || 'รับบริการนัดหมาย',
    servicePrice: a.services?.price,
    startTime: a.start_time,
    status: a.status,
    notes: a.notes
  })), [customerData]);

  const userInventory = useMemo(() => {
    const coupons = (customerData?.coupons || []).map(c => ({ id: c.id, template_id: c.template_id, title: c.coupon_templates?.title || 'คูปอง', description: c.coupon_templates?.description || `ดีลสุดพิเศษ`, expiry: formatDateThai(c.expires_at), raw_expiry: c.expires_at, iconName: c.coupon_templates?.icon_name || 'Ticket', bg: c.coupon_templates?.bg_color || 'bg-pink-50', is_used: c.status === 'used', is_deal: false, priority: 2 }));
    const deals = (customerData?.deals || []).map(d => ({ id: d.id, template_id: d.template_id, title: d.deal_templates?.title || 'ดีลพิเศษ', description: d.deal_templates?.description || `โปรโมชั่นเฉพาะคุณ`, expiry: formatDateThai(d.expires_at), raw_expiry: d.expires_at, iconName: d.deal_templates?.icon_name || 'Zap', bg: d.deal_templates?.bg_color || 'bg-amber-50', is_used: d.status === 'used', is_deal: true, priority: 1 }));
    return [...deals, ...coupons].sort((a, b) => a.priority - b.priority);
  }, [customerData]);

  const availableRedeemables = useMemo(() => (couponTemplates || []).map(t => ({ id: t.id, title: t.title, description: t.description || (t.points_required > 0 ? `แลกด้วย ${t.points_required} คะแนน` : 'โปรโมชั่นพิเศษ'), pointsRequired: t.points_required, expiry_days: t.expiry_days, expiry: `${t.expiry_days} วัน`, iconName: t.icon_name || 'Tag', bg: t.bg_color || (t.points_required === 0 ? 'bg-pink-50' : 'bg-rose-50') })), [couponTemplates]);
  const availableDeals = useMemo(() => (dealTemplates || []).map(t => ({ id: t.id, title: t.title, description: t.description, pointsRequired: t.points_required, expiry_days: t.expiry_days, expiry: `${t.expiry_days} วัน`, iconName: t.icon_name || 'Zap', bg: t.bg_color || 'bg-blue-50' })), [dealTemplates]);

  if (liffLoading || storeLoading || (lineProfile && profileLoading)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#FFF9F0] p-8 text-center">
        <PawPrint className="text-pink-400 animate-bounce" size={64} />
        <p className="mt-6 font-black text-slate-800 text-lg">กำลังเตรียมข้อมูล... 🐾</p>
      </div>
    );
  }

  if (lineProfile && !customerData?.profile && !profileLoading) {
    return <Register lineProfile={lineProfile} onSuccess={() => {}} onSave={async (data) => { await registerMutation.mutateAsync(data); }} />;
  }

  const ownerProfile = {
    firstName: customerData?.profile?.first_name || '',
    lastName: customerData?.profile?.last_name || '',
    gender: customerData?.profile?.gender || 'หญิง',
    age: customerData?.profile?.age || '',
    phone: customerData?.profile?.phone || '',
    address: customerData?.profile?.address || '',
    subDistrict: customerData?.profile?.sub_district || '',
    district: customerData?.profile?.district || '',
    province: customerData?.profile?.province || '',
    postalCode: customerData?.profile?.postal_code || '',
    email: customerData?.profile?.email || '',
  };

  const greetingName = customerData?.profile?.first_name || lineProfile?.displayName;

  return (
    <div className="w-full h-[100dvh] max-w-md mx-auto bg-[#FFF9F0] relative shadow-2xl flex flex-col font-['Prompt'] overflow-hidden border-x border-slate-100/50">
      <header className="px-6 pt-[calc(8px+env(safe-area-inset-top))] pb-[15px] flex justify-between items-center shrink-0 z-[50]">
        <div className="min-w-0 flex-1">
          <h1 className="text-xl font-black text-slate-800 truncate">{store?.name || 'Pet Care App'}</h1>
          <p className="text-slate-500 text-xs font-medium">สวัสดีค่ะ, คุณ {greetingName} ✨</p>
        </div>
        <motion.div whileTap={{ scale: 0.9 }} onClick={() => setIsProfileEditing(true)} className="w-12 h-12 rounded-full border-2 border-white shadow-md overflow-hidden bg-pink-100 cursor-pointer">
          <img src={customerData?.profile?.avatar_url || lineProfile?.pictureUrl} alt="Profile" className="w-full h-full object-cover"/>
        </motion.div>
      </header>

      <main ref={mainScrollRef} className="px-6 flex-1 pb-[calc(7rem+env(safe-area-inset-bottom))] overflow-y-scroll no-scrollbar touch-pan-y">
        <AnimatePresence mode="wait">
          {activeTab === 'home' && (
            <motion.div key="home" className="space-y-6">
              <MembershipCard totalAccumulatedPoints={customerData?.membership?.total_points || 0} redeemablePoints={customerData?.membership?.points || 0} ownerProfile={ownerProfile as any} onShowQR={() => setIsQRCodeOpen(true)} />
              <UpcomingAppointments appointments={appointmentHistory as any} onViewAll={() => handleNavClick('appointments')} />
              <HomeQuickActions 
                onCouponsClick={handleGoToMyCoupons} 
                onAppointmentClick={() => {
                  setActiveTab('appointments');
                  setIsBookingFormOpen(true);
                }} 
              />
              <PetList pets={petsList as any} onPetClick={(p: any) => { setSelectedPetId(p.id); setActiveTab('pets'); }} onViewAll={() => setActiveTab('pets')} />
              <MyCouponsHomePreview coupons={userInventory.filter(c => !c.is_used) as any} onViewAll={handleGoToMyCoupons} />
            </motion.div>
          )}

          {activeTab === 'appointments' && (
            <motion.div key="appointments-tab">
               <AppointmentList 
                 appointments={appointmentHistory as any} 
                 onAddClick={() => setIsBookingFormOpen(true)}
                 onAppointmentClick={handleAppointmentClick}
               />
            </motion.div>
          )}

          {activeTab === 'promo' && (
            <motion.div key="promo-tab">
               <Promotions userPoints={customerData?.membership?.points || 0} collectedCoupons={userInventory.filter(c => !c.is_used) as any} usedOrExpiredCoupons={userInventory.filter(c => c.is_used) as any} redeemableTemplates={availableRedeemables} dealTemplates={availableDeals} onRedeemCoupon={(c, cost) => redeemCouponMutation.mutate({ template: c, pointsCost: cost })} onBuyDeal={(d, cost) => buyDealMutation.mutate({ template: d, pointsCost: cost })} onUseCoupon={(item) => { setSelectedCouponToUse(item); setIsCouponUseModalOpen(true); }} />
            </motion.div>
          )}

          {activeTab === 'pets' && (
            <motion.div key="pets-tab">
              {selectedPetForDetail ? (
                <PetDetailView 
                  pet={selectedPetForDetail as any} 
                  onBack={() => setSelectedPetId(null)} 
                  onStartEdit={(p: any) => { setPetToEditId(p.id); setIsPetFormOpen(true); }} 
                  onDeletePet={(id) => deletePetMutation.mutate(id)} 
                  totalServiceCost={0} 
                  onViewServiceHistoryForPet={() => {}} 
                  onEditPreferences={() => setIsPreferenceFormOpen(true)} 
                  onToggleFavorite={() => toggleFavoriteMutation.mutate({ petId: selectedPetForDetail.id, currentFav: !!selectedPetForDetail.is_favorite })} 
                />
              ) : (
                <PetManagement 
                  pets={petsList as any} 
                  onBack={() => setActiveTab('home')} 
                  onViewDetails={(p: any) => setSelectedPetId(p.id)} 
                  onAddPet={() => { setPetToEditId(null); setIsPetFormOpen(true); }} 
                  onToggleFavorite={(petId, currentFav) => toggleFavoriteMutation.mutate({ petId, currentFav })}
                />
              )}
            </motion.div>
          )}

          {activeTab === 'history' && (
            <motion.div key="history-tab">
              <ServiceHistory historyData={serviceHistory as any} onServiceClick={(s) => setSelectedServiceId(s.id)} />
            </motion.div>
          )}
          
          {activeTab === 'level' && (
            <motion.div key="level-tab">
              <MembershipLevels totalAccumulatedPoints={customerData?.membership?.total_points || 0} redeemablePoints={customerData?.membership?.points || 0} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <QRCodeModal isOpen={isQRCodeOpen} onClose={() => setIsQRCodeOpen(false)} lineId={lineProfile?.displayName || ''} memberId={customerData?.profile?.phone || ''} />
      <PetForm isOpen={isPetFormOpen} onClose={() => setIsPetFormOpen(false)} onSave={(data) => petMutation.mutate(data)} initialData={petsList.find(p => p.id === petToEditId) as any} />
      <UserProfileEdit isOpen={isProfileEditing} onClose={() => setIsProfileEditing(false)} profile={ownerProfile as any} onSave={(data) => updateProfileMutation.mutate(data)} />
      <PetPreferenceForm isOpen={isPreferenceFormOpen} onClose={() => setIsPreferenceFormOpen(false)} onSave={(prefs) => savePreferencesMutation.mutate(prefs)} initialData={selectedPetForDetail?.custom_preferences} petName={selectedPetForDetail?.name || ''} />
      <CouponUseModal isOpen={isCouponUseModalOpen} onClose={() => setIsCouponUseModalOpen(false)} coupon={selectedCouponToUse} onConfirmUse={() => confirmUseMutation.mutate(selectedCouponToUse)} />
      <BookingForm isOpen={isBookingFormOpen} onClose={() => setIsBookingFormOpen(false)} pets={petsList as any} services={storeServices || []} onConfirm={async (data) => { await bookAppointmentMutation.mutateAsync(data); }} />
      <AppointmentDetailModal isOpen={isAppointmentDetailOpen} onClose={() => setIsAppointmentDetailOpen(false)} appointment={selectedAppointment} onDelete={(id) => deleteAppointmentMutation.mutate(id)} />

      <nav className="fixed bottom-[10px] left-6 right-6 max-w-[calc(theme(maxWidth.md)-3rem)] mx-auto bg-white/40 backdrop-blur-xl px-4 py-3 flex justify-between items-center rounded-full shadow-lg z-[40] border border-white/60">
        <NavButton active={activeTab === 'home'} icon={<Home size={22} />} onClick={() => handleNavClick('home')} />
        <NavButton active={activeTab === 'appointments'} icon={<Calendar size={22} />} onClick={() => handleNavClick('appointments')} />
        <NavButton active={activeTab === 'level'} icon={<Award size={22} />} onClick={() => handleNavClick('level')} />
        <NavButton active={activeTab === 'pets'} icon={<PawPrint size={22} />} onClick={() => handleNavClick('pets')} />
        <NavButton active={activeTab === 'promo'} icon={<Megaphone size={22} />} onClick={() => handleNavClick('promo')} />
        <NavButton active={activeTab === 'history'} icon={<History size={22} />} onClick={() => handleNavClick('history')} />
      </nav>
    </div>
  );
};

const NavButton = ({ active, icon, onClick }: { active: boolean; icon: any; onClick: () => void }) => (
  <button onClick={onClick} className="relative flex items-center justify-center w-10 h-10">
    {active && <motion.div layoutId="activeNavBg" className="absolute inset-0 bg-gradient-to-b from-[#FFA14A] to-[#FF4B91] rounded-full shadow-lg" transition={{ type: "spring", bounce: 0.2, duration: 0.6 }} />}
    <div className={`relative z-10 ${active ? 'text-white' : 'text-slate-600'}`}>{icon}</div>
  </button>
);

export default Index;