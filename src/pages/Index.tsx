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
import PetPreferenceForm from '@/components/PetPreferenceForm';
import PetManagement from '@/components/PetManagement';
import QRCodeModal from '@/components/QRCodeModal';
import MyCouponsHomePreview from '@/components/MyCouponsHomePreview';
import CouponUseModal from '@/components/CouponUseModal';
import PackageUseModal from '@/components/PackageUseModal';
import HomeQuickActions from '@/components/HomeQuickActions';
import AppointmentList from '@/components/AppointmentList';
import AppointmentDetailModal from '@/components/AppointmentDetailModal';
import BookingForm from '@/components/BookingForm';
import Register from './Register';
import { Home, Award, PawPrint, Megaphone, Calendar, History, Scissors, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

const Index = () => {
  const queryClient = useQueryClient();
  const { profile: lineProfile, loading: liffLoading } = useLiff();
  const [activeTab, setActiveTab] = useState('home');
  const [isProfileEditing, setIsProfileEditing] = useState(false);
  const [isQRCodeOpen, setIsQRCodeOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  const [selectedPetId, setSelectedPetId] = useState<string | number | null>(null);
  const [selectedAppointment, setSelectedAppointment] = useState<any | null>(null);
  
  const [isPetFormOpen, setIsPetFormOpen] = useState(false);
  const [petToEdit, setPetToEdit] = useState<any | null>(null);
  const [isPreferenceFormOpen, setIsPreferenceFormOpen] = useState(false);
  const [selectedCouponToUse, setSelectedCouponToUse] = useState<any | null>(null);
  const [isCouponUseModalOpen, setIsCouponUseModalOpen] = useState(false);
  const [selectedPackageToUse, setSelectedPackageToUse] = useState<any | null>(null);
  const [isPackageUseModalOpen, setIsPackageUseModalOpen] = useState(false);
  const [isBookingFormOpen, setIsBookingFormOpen] = useState(false);
  const [isAppointmentDetailOpen, setIsAppointmentDetailOpen] = useState(false);
  
  const mainScrollRef = useRef<HTMLDivElement>(null);

  // Handle Scroll Effect
  useEffect(() => {
    const handleScroll = () => {
      if (mainScrollRef.current) {
        setIsScrolled(mainScrollRef.current.scrollTop > 5);
      }
    };
    const scrollContainer = mainScrollRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll);
    }
    return () => scrollContainer?.removeEventListener('scroll', handleScroll);
  }, []);

  const { data: store, isLoading: storeLoading } = useQuery({
    queryKey: ['current_store'],
    queryFn: async () => {
      const targetStoreId = 'b0f3c613-f742-4c86-951a-eaa65c8b1667';
      const { data } = await supabase.from('stores').select('*').eq('id', targetStoreId).maybeSingle();
      return data;
    }
  });

  const { data: customerData, isLoading: profileLoading } = useQuery({
    queryKey: ['customer_profile', lineProfile?.userId, store?.id],
    queryFn: async () => {
      if (!lineProfile?.userId || !store?.id) return null;
      
      const { data: customer } = await supabase.from('customers').select('*').eq('line_user_id', lineProfile.userId).maybeSingle();
      if (!customer) return null;

      const { data: membership } = await supabase.from('store_customers').select('*').eq('customer_id', customer.id).eq('store_id', store.id).maybeSingle();
      const { data: petsData } = await supabase.from('pets').select('*').eq('customer_id', customer.id).order('is_favorite', { ascending: false }).order('created_at', { ascending: true });
      
      const petIds = (petsData || []).map(p => p.id);
      const { data: weightHistory } = await supabase.from('pet_weight_history').select('*').in('pet_id', petIds).order('date', { ascending: true });

      const pets = (petsData || []).map(p => ({
        ...p,
        imageUrl: p.image_url,
        cardBgColor: p.card_bg_color || '#FFFFFF',
        custom_preferences: p.custom_preferences || [],
        weight_history: (weightHistory || [])
          .filter(wh => wh.pet_id === p.id)
          .map(wh => ({
            id: wh.id,
            date: new Date(wh.date).toLocaleDateString('th-TH', { day: 'numeric', month: 'short' }),
            weight: parseFloat(wh.weight)
          }))
      }));

      const { data: coupons } = await supabase.from('customer_coupons').select('*, coupon_templates(*)').eq('customer_id', customer.id).eq('store_id', store.id).eq('status', 'unused');
      const { data: deals } = await supabase.from('customers_deals').select('*, deal_templates(*)').eq('customer_id', customer.id).eq('store_id', store.id).eq('status', 'unused');
      
      const { data: appointmentsData } = await supabase.from('appointments').select('*, pets(name, image_url, breed), services(name, price)').eq('customer_id', customer.id).order('start_time', { ascending: true });

      // Fetch customer packages with templates and usage history
      const { data: packagesData } = await supabase
        .from('customer_packages')
        .select('*, package_templates(*)')
        .eq('customer_id', customer.id)
        .eq('store_id', store.id)
        .eq('status', 'active');

      const packageIds = (packagesData || []).map(p => p.id);
      const { data: usageHistory } = await supabase
        .from('package_usage_history')
        .select('*')
        .in('customer_package_id', packageIds)
        .order('used_at', { ascending: false });

      const customerPackages = (packagesData || []).map(pkg => ({
        id: pkg.id,
        title: pkg.package_templates?.title || 'แพ็คเกจสะสม',
        description: pkg.package_templates?.description || '',
        total_sessions: pkg.total_sessions,
        remaining_sessions: pkg.remaining_sessions,
        status: pkg.status,
        expires_at: pkg.expires_at,
        created_at: pkg.created_at,
        usage_history: (usageHistory || []).filter(uh => uh.customer_package_id === pkg.id)
      }));

      const myCoupons = [
        ...(coupons || []).map(c => ({
          ...c,
          title: c.coupon_templates?.title,
          description: c.coupon_templates?.description,
          iconName: c.coupon_templates?.icon_name,
          bg: c.coupon_templates?.bg_color,
          pointsRequired: c.coupon_templates?.points_required,
          expiry: new Date(c.expires_at).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: '2-digit' }),
          is_deal: false
        })),
        ...(deals || []).map(d => ({
          ...d,
          title: d.deal_templates?.title,
          description: d.deal_templates?.description,
          iconName: d.deal_templates?.icon_name,
          bg: d.deal_templates?.bg_color,
          pointsRequired: d.deal_templates?.points_required,
          expiry: new Date(d.expires_at).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: '2-digit' }),
          is_deal: true
        }))
      ];

      return {
        profile: customer,
        membership: membership,
        pets,
        myCoupons,
        customerPackages,
        appointments: (appointmentsData || []).map(apt => ({
          id: apt.id,
          petName: apt.pets?.name || 'Unknown',
          petImage: apt.pets?.image_url,
          petBreed: apt.pets?.breed,
          service: apt.services?.name || 'General Service',
          servicePrice: apt.services?.price,
          startTime: apt.start_time,
          status: apt.status,
          notes: apt.notes
        }))
      };
    },
    enabled: !!lineProfile?.userId && !!store?.id,
  });

  const { data: services } = useQuery({
    queryKey: ['services', store?.id],
    queryFn: async () => {
      if (!store?.id) return [];
      const { data } = await supabase.from('services').select('*').eq('store_id', store.id);
      return data || [];
    },
    enabled: !!store?.id
  });

  const displayServices = useMemo(() => {
    const defaultServices = [
      { id: '1', name: 'อาบน้ำสุนัข/แมว', price: 350, description: 'อาบน้ำ เป่าขน ตัดเล็บ เช็ดหู' },
      { id: '2', name: 'ตัดขนสไตล์แฟชั่น', price: 550, description: 'ออกแบบทรงขนโดยช่างมืออาชีพ' },
      { id: '3', name: 'สปาโอโซนบำรุงผิวหนัง', price: 450, description: 'ช่วยฟื้นฟูผิวหนังและเส้นขนให้นุ่มสลวย' }
    ];
    return services && services.length > 0 ? services : defaultServices;
  }, [services]);

  const { data: couponTemplates } = useQuery({
    queryKey: ['coupon_templates', store?.id],
    queryFn: async () => {
      if (!store?.id) return [];
      const { data } = await supabase.from('coupon_templates').select('*').eq('store_id', store.id).eq('is_active', true);
      return (data || []).map(t => ({
        ...t,
        iconName: t.icon_name,
        bg: t.bg_color,
        pointsRequired: t.points_required,
        expiry: `${t.expiry_days} วัน`
      }));
    },
    enabled: !!store?.id
  });

  const { data: dealTemplates } = useQuery({
    queryKey: ['deal_templates', store?.id],
    queryFn: async () => {
      if (!store?.id) return [];
      const { data } = await supabase.from('deal_templates').select('*').eq('store_id', store.id).eq('is_active', true);
      return (data || []).map(t => ({
        ...t,
        iconName: t.icon_name,
        bg: t.bg_color,
        pointsRequired: t.points_required,
        expiry: `${t.expiry_days} วัน`
      }));
    },
    enabled: !!store?.id
  });

  const { data: packageTemplates } = useQuery({
    queryKey: ['package_templates', store?.id],
    queryFn: async () => {
      if (!store?.id) return [];
      const { data } = await supabase.from('package_templates').select('*').eq('store_id', store.id).eq('is_active', true);
      return data || [];
    },
    enabled: !!store?.id
  });

  const favoriteMutation = useMutation({
    mutationFn: async ({ petId, isFavorite }: { petId: string | number, isFavorite: boolean }) => {
      const { error } = await supabase
        .from('pets')
        .update({ is_favorite: !isFavorite })
        .eq('id', petId);
      if (error) throw error;
    },
    onMutate: async ({ petId, isFavorite }) => {
      await queryClient.cancelQueries({ queryKey: ['customer_profile'] });
      const previousData = queryClient.getQueryData(['customer_profile', lineProfile?.userId, store?.id]);
      queryClient.setQueryData(['customer_profile', lineProfile?.userId, store?.id], (old: any) => {
        if (!old) return old;
        const updatedPets = old.pets.map((p: any) => 
          p.id === petId ? { ...p, is_favorite: !isFavorite } : p
        );
        const sortedPets = [...updatedPets].sort((a, b) => {
          if (a.is_favorite === b.is_favorite) {
            return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
          }
          return a.is_favorite ? -1 : 1;
        });
        return { ...old, pets: sortedPets };
      });
      return { previousData };
    },
    onError: (err, variables, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(['customer_profile', lineProfile?.userId, store?.id], context.previousData);
      }
      toast.error('ไม่สามารถเปลี่ยนสถานะรายการโปรดได้ค่ะ');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['customer_profile'] });
    }
  });

  const deletePetMutation = useMutation({
    mutationFn: async (petId: string | number) => {
      const { error } = await supabase.from('pets').delete().eq('id', petId);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('ลบข้อมูลเรียบร้อยแล้วค่ะ');
      setSelectedPetId(null);
      queryClient.invalidateQueries({ queryKey: ['customer_profile'] });
    },
    onError: () => {
      toast.error('เกิดข้อผิดพลาดในการลบข้อมูลค่ะ');
    }
  });

  const createAppointmentMutation = useMutation({
    mutationFn: async (bookingData: any) => {
      const customerId = customerData?.profile?.id;
      const storeId = store?.id;
      if (!customerId || !storeId) throw new Error("Missing context");

      const { error } = await supabase.from('appointments').insert([{
        customer_id: customerId,
        store_id: storeId,
        pet_id: bookingData.pet_id,
        service_id: bookingData.service_id,
        start_time: bookingData.start_time,
        notes: bookingData.notes,
        status: 'pending'
      }]);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('ส่งคำขอจองคิวเรียบร้อยแล้วค่ะ รอพนักงานยืนยันนะคะ 📅');
      queryClient.invalidateQueries({ queryKey: ['customer_profile'] });
    },
    onError: () => {
      toast.error('เกิดข้อผิดพลาดในการจองคิว กรุณาลองใหม่อีกครั้งค่ะ');
    }
  });

  const cancelAppointmentMutation = useMutation({
    mutationFn: async (appointmentId: string) => {
      const { error } = await supabase.from('appointments').delete().eq('id', appointmentId);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('ยกเลิกการจองเรียบร้อยแล้วค่ะ 📅');
      queryClient.invalidateQueries({ queryKey: ['customer_profile'] });
    },
    onError: () => {
      toast.error('เกิดข้อผิดพลาดในการยกเลิกการจองค่ะ');
    }
  });

  const redeemMutation = useMutation({
    mutationFn: async ({ template, points, type }: { template: any, points: number, type: 'coupon' | 'deal' | 'package' }) => {
      const customerId = customerData?.profile?.id;
      const storeId = store?.id;
      if (!customerId || !storeId) throw new Error("Missing context");

      // Only deduct points for coupons and deals, packages are cash-only
      if (type !== 'package') {
        const currentPoints = customerData?.membership?.points || 0;
        if (currentPoints < points) throw new Error("คะแนนไม่เพียงพอค่ะ");

        const { error: pointsError } = await supabase
          .from('store_customers')
          .update({ points: currentPoints - points })
          .eq('customer_id', customerId)
          .eq('store_id', storeId);
        if (pointsError) throw pointsError;
      }

      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + (template.expiry_days || 365)); // Packages valid for 1 year by default

      if (type === 'coupon') {
        await supabase.from('customer_coupons').insert([{
          template_id: template.id,
          customer_id: customerId,
          store_id: storeId,
          expires_at: expiresAt.toISOString(),
          status: 'unused'
        }]);
      } else if (type === 'deal') {
        await supabase.from('customers_deals').insert([{
          template_id: template.id,
          customer_id: customerId,
          store_id: storeId,
          expires_at: expiresAt.toISOString(),
          status: 'unused'
        }]);
      } else if (type === 'package') {
        await supabase.from('customer_packages').insert([{
          template_id: template.id,
          customer_id: customerId,
          store_id: storeId,
          total_sessions: template.total_sessions,
          remaining_sessions: template.total_sessions,
          expires_at: expiresAt.toISOString(),
          status: 'active'
        }]);
      }
    },
    onSuccess: (data, variables) => {
      if (variables.type === 'package') {
        toast.success('ซื้อแพ็คเกจเรียบร้อยแล้วค่ะ! ดูได้ที่เมนู "แพ็คเกจของฉัน" นะคะ 📦');
      } else {
        toast.success('แลกรับเรียบร้อยแล้วค่ะ! ดูได้ที่เมนู "คูปองของฉัน" นะคะ 🎫');
      }
      queryClient.invalidateQueries({ queryKey: ['customer_profile'] });
    },
    onError: (error: any) => {
      toast.error(error.message || 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้งค่ะ');
    }
  });

  const usePackageSessionMutation = useMutation({
    mutationFn: async (packageId: string) => {
      const pkg = customerData?.customerPackages?.find(p => p.id === packageId);
      if (!pkg || pkg.remaining_sessions <= 0) throw new Error("สิทธิ์คงเหลือไม่เพียงพอ");

      const newRemaining = pkg.remaining_sessions - 1;
      const newStatus = newRemaining === 0 ? 'completed' : 'active';

      // Update remaining sessions
      const { error: updateError } = await supabase
        .from('customer_packages')
        .update({ remaining_sessions: newRemaining, status: newStatus })
        .eq('id', packageId);
      if (updateError) throw updateError;

      // Insert usage history
      const { error: historyError } = await supabase
        .from('package_usage_history')
        .insert([{ customer_package_id: packageId, notes: 'หักสิทธิ์การใช้งานบริการ' }]);
      if (historyError) throw historyError;
    },
    onSuccess: () => {
      toast.success('หักสิทธิ์การใช้งานแพ็คเกจเรียบร้อยแล้วค่ะ 🐾');
      queryClient.invalidateQueries({ queryKey: ['customer_profile'] });
    },
    onError: (error: any) => {
      toast.error(error.message || 'เกิดข้อผิดพลาดในการหักสิทธิ์ค่ะ');
    }
  });

  const registerMutation = useMutation({
    mutationFn: async (regData: any) => {
      if (!lineProfile?.userId || !store?.id) throw new Error("Missing context");
      
      // Map camelCase fields from form to snake_case database columns
      const dbData = {
        line_user_id: lineProfile.userId,
        display_name: lineProfile.displayName,
        avatar_url: lineProfile.pictureUrl,
        first_name: regData.firstName,
        last_name: regData.lastName,
        gender: regData.gender,
        age: regData.age?.toString(),
        phone: regData.phone,
        email: regData.email,
        address: regData.address,
        sub_district: regData.subDistrict,
        district: regData.district,
        province: regData.province,
        postal_code: regData.postalCode,
        house_no: regData.houseNo,
        village_no: regData.moo,
        soi: regData.soi,
        road: regData.road
      };

      const { data: newCustomer, error: customerError } = await supabase
        .from('customers')
        .insert([dbData])
        .select()
        .single();
        
      if (customerError) throw customerError;
      if (!newCustomer) throw new Error("Failed to create customer");

      const { error: membershipError } = await supabase
        .from('store_customers')
        .insert([{ 
          customer_id: newCustomer.id, 
          store_id: store.id, 
          points: 0, 
          total_points: 0, 
          tier: 'bronze' 
        }]);
        
      if (membershipError) throw membershipError;
    },
    onSuccess: () => {
      toast.success('ลงทะเบียนเรียบร้อยแล้วค่ะ ✨');
      queryClient.invalidateQueries({ queryKey: ['customer_profile'] });
    }
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (updatedProfile: any) => {
      const customerId = customerData?.profile?.id;
      if (!customerId) throw new Error("Missing customer ID");
      
      const { error } = await supabase
        .from('customers')
        .update({
          first_name: updatedProfile.firstName,
          last_name: updatedProfile.lastName,
          gender: updatedProfile.gender,
          age: updatedProfile.age,
          phone: updatedProfile.phone,
          address: updatedProfile.address,
          sub_district: updatedProfile.subDistrict,
          district: updatedProfile.district,
          province: updatedProfile.province,
          postal_code: updatedProfile.postalCode,
          email: updatedProfile.email
        })
        .eq('id', customerId);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('อัปเดตข้อมูลส่วนตัวเรียบร้อยแล้วค่ะ ✨');
      queryClient.invalidateQueries({ queryKey: ['customer_profile'] });
    },
    onError: () => {
      toast.error('เกิดข้อผิดพลาดในการอัปเดตข้อมูลค่ะ');
    }
  });

  const petMutation = useMutation({
    mutationFn: async (pet: any) => {
      const { id, weight, ...petData } = pet;
      let result;
      
      if (id) {
        result = await supabase.from('pets').update({ ...petData, weight }).eq('id', id).select().single();
      } else {
        result = await supabase.from('pets').insert([{ ...petData, weight, customer_id: customerData?.profile?.id }]).select().single();
      }

      const savedPetId = id || result.data?.id;

      if (savedPetId && weight) {
        const weightNum = parseFloat(weight);
        if (!isNaN(weightNum)) {
          const today = new Date().toISOString().split('T')[0];
          const { data: existing } = await supabase
            .from('pet_weight_history')
            .select('*')
            .eq('pet_id', savedPetId)
            .eq('date', today)
            .maybeSingle();

          if (existing) {
            await supabase.from('pet_weight_history').update({ weight: weightNum }).eq('id', existing.id);
          } else {
            await supabase.from('pet_weight_history').insert([{
              pet_id: savedPetId,
              weight: weightNum,
              date: today
            }]);
          }
        }
      }

      return result;
    },
    onSuccess: () => {
      toast.success('บันทึกข้อมูลเรียบร้อยค่ะ 🐾');
      setPetToEdit(null);
      setIsPetFormOpen(false);
      queryClient.invalidateQueries({ queryKey: ['customer_profile'] });
    }
  });

  const weightMutation = useMutation({
    mutationFn: async ({ petId, weight }: { petId: string | number, weight: number }) => {
      // Update the main pet weight
      await supabase.from('pets').update({ weight: weight.toString() }).eq('id', petId);
      
      const today = new Date().toISOString().split('T')[0];
      
      // Check for existing record for today
      const { data: existing } = await supabase
        .from('pet_weight_history')
        .select('id')
        .eq('pet_id', petId)
        .eq('date', today)
        .maybeSingle();

      if (existing) {
        // Update today's record
        return await supabase
          .from('pet_weight_history')
          .update({ weight })
          .eq('id', existing.id);
      } else {
        // Insert new record for today
        return await supabase
          .from('pet_weight_history')
          .insert([{ pet_id: petId, weight: weight, date: today }]);
      }
    },
    onSuccess: () => {
      toast.success('บันทึกน้ำหนักเรียบร้อยแล้วค่ะ ⚖️');
      queryClient.invalidateQueries({ queryKey: ['customer_profile'] });
    }
  });

  const deleteWeightMutation = useMutation({
    mutationFn: async (historyId: string | number) => {
      const { error } = await supabase.from('pet_weight_history').delete().eq('id', historyId);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('ลบประวัติน้ำหนักเรียบร้อยแล้วค่ะ');
      queryClient.invalidateQueries({ queryKey: ['customer_profile'] });
    },
    onError: () => {
      toast.error('เกิดข้อผิดพลาดในการลบข้อมูลค่ะ');
    }
  });

  const handleNavClick = (tab: string) => {
    setActiveTab(tab);
    mainScrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartEditPet = (pet: any) => {
    setPetToEdit(pet);
    setIsPetFormOpen(true);
  };

  const handleAddPetClick = () => {
    setPetToEdit(null);
    setIsPetFormOpen(true);
  };

  const mappedProfile = useMemo(() => {
    const p = customerData?.profile;
    return {
      firstName: p?.first_name || '',
      lastName: p?.last_name || '',
      gender: p?.gender || 'หญิง',
      age: p?.age || '',
      phone: p?.phone || '',
      address: p?.address || '',
      subDistrict: p?.sub_district || '',
      district: p?.district || '',
      province: p?.province || '',
      postalCode: p?.postal_code || '',
      email: p?.email || ''
    };
  }, [customerData?.profile]);

  if (liffLoading || storeLoading || (lineProfile && profileLoading)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-surface p-8 text-center">
        <PawPrint className="text-primary animate-pulse" size={64} />
        <p className="mt-6 font-extrabold text-primary text-lg">LOADING YOUR SANCTUARY...</p>
      </div>
    );
  }

  if (lineProfile && !customerData?.profile && !profileLoading) {
    return <Register lineProfile={lineProfile} onSuccess={() => {}} onSave={async (data) => { await registerMutation.mutateAsync(data); }} />;
  }

  return (
    <div className="w-full h-[100dvh] max-md:max-w-md mx-auto bg-surface relative overflow-hidden">
      <div 
        ref={mainScrollRef} 
        className="h-full w-full overflow-y-scroll no-scrollbar touch-pan-y relative"
      >
        <header 
          className={`sticky top-0 px-6 pt-[calc(10px+env(safe-area-inset-top))] pb-3 flex justify-between items-center shrink-0 z-[50] transition-all duration-500 rounded-b-[2.5rem] ${
            isScrolled ? 'glass-effect shadow-ambient' : 'bg-[#F9F9F9]/80 backdrop-blur-md pt-4'
          }`}
        >
          <div className="min-w-0 flex-1">
            <h1 className="text-xl font-black text-primary truncate leading-tight tracking-tight uppercase">{store?.name || 'Pet Care'}</h1>
            <p className="text-surface-variant text-[12px] font-black uppercase tracking-[0.2em] opacity-60">Hello, {customerData?.profile?.first_name || lineProfile?.displayName} ✨</p>
          </div>
          <motion.div 
            whileTap={{ scale: 0.9 }} 
            onClick={() => setIsProfileEditing(true)} 
            className="w-12 h-12 rounded-2xl border-2 border-white shadow-ambient overflow-hidden bg-white cursor-pointer"
          >
            <img src={customerData?.profile?.avatar_url || lineProfile?.pictureUrl} alt="Profile" className="w-full h-full object-cover"/>
          </motion.div>
        </header>

        <main className="px-4 pb-[calc(8.5rem+env(safe-area-inset-bottom))] pt-0">
          <AnimatePresence mode="wait">
            {activeTab === 'home' && (
              <motion.div key="home" className="space-y-10" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <MembershipCard 
                  totalAccumulatedPoints={customerData?.membership?.total_points || 0} 
                  redeemablePoints={customerData?.membership?.points || 0} 
                  ownerProfile={customerData?.profile as any} 
                  onShowQR={() => setIsQRCodeOpen(true)}
                  onTierClick={() => handleNavClick('level')}
                />
                <UpcomingAppointments appointments={customerData?.appointments || []} onViewAll={() => handleNavClick('appointments')} />
                <HomeQuickActions 
                  onCouponsClick={() => setActiveTab('promo')} 
                  onAppointmentClick={() => { setActiveTab('appointments'); setIsBookingFormOpen(true); }} 
                />
                <PetList 
                  pets={customerData?.pets || []} 
                  onPetClick={(p: any) => { setSelectedPetId(p.id); setActiveTab('pets'); }} 
                  onViewAll={() => setActiveTab('pets')} 
                  onToggleFavorite={(e, id, fav) => {
                    e.stopPropagation();
                    favoriteMutation.mutate({ petId: id, isFavorite: fav });
                  }}
                />
                <MyCouponsHomePreview coupons={customerData?.myCoupons?.slice(0, 5) || []} onViewAll={() => { setActiveTab('promo'); setTimeout(() => { document.getElementById('my-coupons-section')?.scrollIntoView({ behavior: 'smooth' }); }, 100); }} />
              </motion.div>
            )}

            {activeTab === 'appointments' && (
              <motion.div key="appointments-tab" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                 <AppointmentList appointments={customerData?.appointments || []} onAddClick={() => setIsBookingFormOpen(true)} onAppointmentClick={(apt) => { setSelectedAppointment(apt); setIsAppointmentDetailOpen(true); }} />
              </motion.div>
            )}

            {activeTab === 'promo' && (
              <motion.div key="promo-tab" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                 <Promotions 
                   userPoints={customerData?.membership?.points || 0} 
                   totalAccumulatedPoints={customerData?.membership?.total_points || 0}
                   collectedCoupons={customerData?.myCoupons || []} 
                   usedOrExpiredCoupons={[]} 
                   redeemableTemplates={couponTemplates || []} 
                   dealTemplates={dealTemplates || []} 
                   packageTemplates={packageTemplates || []}
                   customerPackages={customerData?.customerPackages || []}
                   onRedeemCoupon={(t, p) => redeemMutation.mutate({ template: t, points: p, type: 'coupon' })} 
                   onBuyDeal={(t, p) => redeemMutation.mutate({ template: t, points: p, type: 'deal' })} 
                   onBuyPackage={(t) => redeemMutation.mutate({ template: t, points: 0, type: 'package' })}
                   onUseCoupon={(c) => { setSelectedCouponToUse(c); setIsCouponUseModalOpen(true); }} 
                   onUsePackage={(pkg) => { setSelectedPackageToUse(pkg); setIsPackageUseModalOpen(true); }}
                 />
              </motion.div>
            )}

            {activeTab === 'pets' && (
              <motion.div key="pets-tab" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                {selectedPetId ? (
                  <PetDetailView 
                    pet={customerData?.pets?.find(p => p.id === selectedPetId)} 
                    onBack={() => setSelectedPetId(null)} 
                    onStartEdit={(pet) => handleStartEditPet(pet)} 
                    onDeletePet={(id) => deletePetMutation.mutate(id)} 
                    totalServiceCost={0} 
                    onViewServiceHistoryForPet={() => {}} 
                    onEditPreferences={() => {}} 
                    onToggleFavorite={() => {
                      const pet = customerData?.pets?.find(p => p.id === selectedPetId);
                      if (pet) favoriteMutation.mutate({ petId: pet.id, isFavorite: !!pet.is_favorite });
                    }}
                    onAddWeight={async (id, w) => { await weightMutation.mutateAsync({ petId: id, weight: w }); }}
                    onDeleteWeight={async (historyId) => { await deleteWeightMutation.mutateAsync(historyId); }}
                  />
                ) : (
                  <PetManagement 
                    pets={customerData?.pets || []} 
                    onBack={() => setActiveTab('home')} 
                    onViewDetails={(p: any) => setSelectedPetId(p.id)} 
                    onAddPet={handleAddPetClick}
                    onToggleFavorite={(id, fav) => favoriteMutation.mutate({ petId: id, isFavorite: fav })}
                  />
                )}
              </motion.div>
            )}
            
            {activeTab === 'level' && (
              <motion.div key="level-tab" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <MembershipLevels totalAccumulatedPoints={customerData?.membership?.total_points || 0} redeemablePoints={customerData?.membership?.points || 0} />
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      <nav className="fixed bottom-[20px] left-5 right-5 max-w-[calc(theme(maxWidth.md)-2.5rem)] mx-auto glass-effect px-4 py-2 flex justify-between items-center rounded-3xl shadow-ambient z-[40] border border-white/20">
        <NavButton active={activeTab === 'home'} icon={<Home size={18} />} onClick={() => handleNavClick('home')} />
        <NavButton active={activeTab === 'appointments'} icon={<Calendar size={18} />} onClick={() => handleNavClick('appointments')} />
        <NavButton active={activeTab === 'pets'} icon={<PawPrint size={18} />} onClick={() => handleNavClick('pets')} />
        <NavButton active={activeTab === 'promo'} icon={<Megaphone size={18} />} onClick={() => handleNavClick('promo')} />
        <NavButton active={activeTab === 'history'} icon={<History size={18} />} onClick={() => handleNavClick('history')} />
      </nav>

      <QRCodeModal isOpen={isQRCodeOpen} onClose={() => setIsQRCodeOpen(false)} lineId={lineProfile?.displayName || ''} memberId={customerData?.profile?.phone || ''} />
      <PetForm isOpen={isPetFormOpen} onClose={() => setIsPetFormOpen(false)} onSave={(data) => petMutation.mutate(data)} initialData={petToEdit} />
      <BookingForm isOpen={isBookingFormOpen} onClose={() => setIsBookingFormOpen(false)} pets={customerData?.pets || []} services={displayServices} onConfirm={async (data) => { await createAppointmentMutation.mutateAsync(data); }} />
      <CouponUseModal isOpen={isCouponUseModalOpen} onClose={() => setIsCouponUseModalOpen(false)} coupon={selectedCouponToUse} onConfirmUse={() => {}} />
      <PackageUseModal isOpen={isPackageUseModalOpen} onClose={() => setIsPackageUseModalOpen(false)} customerPackage={selectedPackageToUse} onConfirmUse={async (id) => { await usePackageSessionMutation.mutateAsync(id); }} />
      <AppointmentDetailModal isOpen={isAppointmentDetailOpen} onClose={() => setIsAppointmentDetailOpen(false)} appointment={selectedAppointment} onDelete={(id) => cancelAppointmentMutation.mutate(id)} />
      <UserProfileEdit isOpen={isProfileEditing} onClose={() => setIsProfileEditing(false)} profile={mappedProfile} onSave={(data) => updateProfileMutation.mutate(data)} />
    </div>
  );
};

const NavButton = ({ active, icon, onClick }: { active: boolean; icon: any; onClick: () => void }) => (
  <button onClick={onClick} className="relative flex items-center justify-center w-10 h-10 group">
    {active && <motion.div layoutId="activeNavBg" className="absolute inset-0 bg-primary group-hover:bg-tertiary rounded-2xl shadow-ambient transition-colors duration-300" transition={{ type: "spring", bounce: 0.2, duration: 0.6 }} />}
    <div className={`relative z-10 transition-colors duration-300 ${active ? 'text-tertiary group-hover:text-primary' : 'text-primary/40 group-hover:text-primary'}`}>{icon}</div>
  </button>
);

export default Index;