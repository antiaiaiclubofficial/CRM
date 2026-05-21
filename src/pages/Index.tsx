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
import HomeQuickActions from '@/components/HomeQuickActions';
import AppointmentList from '@/components/AppointmentList';
import AppointmentDetailModal from '@/components/AppointmentDetailModal';
import BookingForm from '@/components/BookingForm';
import Register from './Register';
import { Home, Award, PawPrint, Megaphone, Calendar, History, Scissors, LogOut } from 'lucide-react';
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
      const { data } = await supabase.from('stores').select('*').eq('id', targetStoreId).maybeSingle();
      if (!data) {
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
      
      const { data: customer } = await supabase.from('customers').select('*').eq('line_user_id', lineProfile.userId).maybeSingle();
      if (!customer) return null;

      const { data: membership } = await supabase.from('store_customers').select('*').eq('customer_id', customer.id).eq('store_id', store.id).maybeSingle();
      const { data: pets } = await supabase.from('pets').select('*').eq('customer_id', customer.id).order('created_at', { ascending: true });
      const { data: coupons } = await supabase.from('customer_coupons').select('*, coupon_templates(*)').eq('customer_id', customer.id).eq('store_id', store.id);
      const { data: deals } = await supabase.from('customers_deals').select('*, deal_templates(*)').eq('customer_id', customer.id).eq('store_id', store.id);
      const { data: history } = await supabase.from('service_history').select('*, pets(*)').eq('customer_id', customer.id).eq('store_id', store.id).order('created_at', { ascending: false });
      const { data: appointmentsData } = await supabase.from('appointments').select('*, pets(name, image_url, breed), services(name, price)').eq('customer_id', customer.id).order('start_time', { ascending: true });

      return {
        profile: customer,
        membership: membership,
        pets: (pets || []).map(p => ({ ...p, imageUrl: p.image_url, cardBgColor: p.card_bg_color || '#FFFFFF', custom_preferences: p.custom_preferences || [] })),
        coupons: coupons || [],
        deals: deals || [],
        history: history || [],
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

  // Sort pets: Favorites first, then by creation date (ascending - added first comes first)
  const sortedPets = useMemo(() => {
    if (!customerData?.pets) return [];
    return [...customerData.pets].sort((a, b) => {
      // Primary sort: is_favorite (true first)
      if (a.is_favorite && !b.is_favorite) return -1;
      if (!a.is_favorite && b.is_favorite) return 1;
      
      // Secondary sort: created_at (ascending - older first)
      const dateA = new Date(a.created_at || 0).getTime();
      const dateB = new Date(b.created_at || 0).getTime();
      return dateA - dateB;
    });
  }, [customerData?.pets]);

  const { data: storeServices } = useQuery({
    queryKey: ['store_services', store?.id],
    queryFn: async () => {
      if (!store?.id) return [];
      const { data } = await supabase.from('services').select('*').eq('store_id', store.id);
      return data || [];
    },
    enabled: !!store?.id
  });

  const { data: couponTemplates } = useQuery({
    queryKey: ['coupon_templates', store?.id],
    queryFn: async () => {
      if (!store?.id) return [];
      const { data } = await supabase.from('coupon_templates').select('*').eq('store_id', store.id).eq('is_active', true);
      return data || [];
    },
    enabled: !!store?.id
  });

  const { data: dealTemplates } = useQuery({
    queryKey: ['deal_templates', store?.id],
    queryFn: async () => {
      if (!store?.id) return [];
      const { data } = await supabase.from('deal_templates').select('*').eq('store_id', store.id).eq('is_active', true);
      return data || [];
    },
    enabled: !!store?.id
  });

  const registerMutation = useMutation({
    mutationFn: async (regData: any) => {
      if (!lineProfile?.userId || !store?.id) throw new Error("Missing context");
      const { data: newCustomer } = await supabase.from('customers').insert([{ line_user_id: lineProfile.userId, display_name: lineProfile.displayName, avatar_url: lineProfile.pictureUrl, ...regData }]).select().single();
      if (!newCustomer) throw new Error("Failed to create customer");
      await supabase.from('store_customers').insert([{ customer_id: newCustomer.id, store_id: store.id, points: 0, total_points: 0, tier: 'bronze' }]);
    },
    onSuccess: () => {
      toast.success('ลงทะเบียนเรียบร้อยแล้วค่ะ ✨');
      queryClient.invalidateQueries({ queryKey: ['customer_profile'] });
    }
  });

  const petMutation = useMutation({
    mutationFn: async (pet: any) => {
      const { id, ...petData } = pet;
      if (id) {
        const { data, error } = await supabase.from('pets').update(petData).eq('id', id).select().single();
        if (error) throw error;
        return data;
      } else {
        const { data, error } = await supabase.from('pets').insert([{ ...petData, customer_id: customerData?.profile?.id }]).select().single();
        if (error) throw error;
        return data;
      }
    },
    onMutate: async (newPet) => {
      await queryClient.cancelQueries({ queryKey: ['customer_profile'] });
      const previousProfile = queryClient.getQueryData(['customer_profile', lineProfile?.userId, store?.id]);

      queryClient.setQueryData(['customer_profile', lineProfile?.userId, store?.id], (old: any) => {
        if (!old) return old;
        const pets = [...old.pets];
        if (newPet.id) {
          const index = pets.findIndex(p => p.id === newPet.id);
          if (index !== -1) pets[index] = { ...pets[index], ...newPet };
        } else {
          const tempPet = { 
            ...newPet, 
            id: 'temp-' + Date.now(), 
            created_at: new Date().toISOString(),
            imageUrl: newPet.image_url,
            cardBgColor: newPet.card_bg_color || '#FFFFFF',
            custom_preferences: []
          };
          pets.push(tempPet);
        }
        return { ...old, pets };
      });

      return { previousProfile };
    },
    onError: (err, variables, context: any) => {
      if (context?.previousProfile) {
        queryClient.setQueryData(['customer_profile', lineProfile?.userId, store?.id], context.previousProfile);
      }
      toast.error('ไม่สามารถบันทึกข้อมูลได้ กรุณาลองใหม่อีกครั้งค่ะ');
    },
    onSuccess: () => { 
      toast.success('บันทึกข้อมูลเรียบร้อยค่ะ 🐾'); 
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
      toast.success('ลบข้อมูลสัตว์เลี้ยงเรียบร้อยแล้วค่ะ');
      setSelectedPetId(null);
      queryClient.invalidateQueries({ queryKey: ['customer_profile'] });
    },
    onError: () => {
      toast.error('ไม่สามารถลบข้อมูลได้ในขณะนี้ กรุณาลองใหม่อีกครั้งค่ะ');
    }
  });

  const toggleFavoriteMutation = useMutation({
    mutationFn: async ({ petId, isFavorite }: { petId: string | number, isFavorite: boolean }) => {
      const { error } = await supabase.from('pets').update({ is_favorite: isFavorite }).eq('id', petId);
      if (error) throw error;
      return { petId, isFavorite };
    },
    onMutate: async ({ petId, isFavorite }) => {
      await queryClient.cancelQueries({ queryKey: ['customer_profile'] });
      const previousProfile = queryClient.getQueryData(['customer_profile', lineProfile?.userId, store?.id]);

      queryClient.setQueryData(['customer_profile', lineProfile?.userId, store?.id], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          pets: old.pets.map((p: any) => 
            p.id === petId ? { ...p, is_favorite: isFavorite } : p
          )
        };
      });

      return { previousProfile };
    },
    onError: (err, variables, context: any) => {
      if (context?.previousProfile) {
        queryClient.setQueryData(['customer_profile', lineProfile?.userId, store?.id], context.previousProfile);
      }
      toast.error('ไม่สามารถอัปเดตสถานะได้ กรุณาลองใหม่อีกครั้งค่ะ');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['customer_profile'] });
    }
  });

  const bookAppointmentMutation = useMutation({
    mutationFn: async (appointmentData: any) => {
      if (!customerData?.profile?.id || !store?.id) throw new Error("Missing profile or store info");
      const { data, error } = await supabase.from('appointments').insert([{
        ...appointmentData,
        customer_id: customerData.profile.id,
        store_id: store.id,
        status: 'pending'
      }]);
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success('จองนัดหมายเรียบร้อยแล้วค่ะ กรุณารอการยืนยันจากทางร้านนะคะ');
      queryClient.invalidateQueries({ queryKey: ['customer_profile'] });
    }
  });

  const handleNavClick = (tab: string) => {
    setActiveTab(tab);
    mainScrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
    <div className="w-full h-[100dvh] max-w-md mx-auto bg-surface relative flex flex-col font-['Inter'] overflow-hidden">
      <header className="px-6 pt-[calc(8px+env(safe-area-inset-top))] pb-2 flex justify-between items-center shrink-0 z-[50]">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-black text-primary truncate leading-tight tracking-tight">{store?.name || 'Pet Care'}</h1>
          <p className="text-surface-variant text-xs font-semibold uppercase tracking-widest opacity-60">Hello, {customerData?.profile?.first_name || lineProfile?.displayName} 🐾</p>
        </div>
        <motion.div 
          whileTap={{ scale: 0.9 }} 
          onClick={() => setIsProfileEditing(true)} 
          className="w-14 h-14 rounded-2xl border-2 border-white shadow-ambient overflow-hidden bg-white cursor-pointer"
        >
          <img src={customerData?.profile?.avatar_url || lineProfile?.pictureUrl} alt="Profile" className="w-full h-full object-cover"/>
        </motion.div>
      </header>

      <main ref={mainScrollRef} className="px-4 flex-1 pb-[calc(7.5rem+env(safe-area-inset-bottom))] overflow-y-scroll no-scrollbar touch-pan-y">
        <AnimatePresence mode="wait">
          {activeTab === 'home' && (
            <motion.div key="home" className="space-y-8" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
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
              <PetList pets={sortedPets} onPetClick={(p: any) => { setSelectedPetId(p.id); setActiveTab('pets'); }} onViewAll={() => setActiveTab('pets')} />
              <MyCouponsHomePreview coupons={[]} onViewAll={() => setActiveTab('promo')} />
            </motion.div>
          )}

          {activeTab === 'appointments' && (
            <motion.div key="appointments-tab" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
               <AppointmentList appointments={customerData?.appointments || []} onAddClick={() => setIsBookingFormOpen(true)} onAppointmentClick={(apt) => { setSelectedAppointment(apt); setIsAppointmentDetailOpen(true); }} />
            </motion.div>
          )}

          {activeTab === 'promo' && (
            <motion.div key="promo-tab" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
               <Promotions userPoints={customerData?.membership?.points || 0} collectedCoupons={[]} usedOrExpiredCoupons={[]} redeemableTemplates={couponTemplates || []} dealTemplates={dealTemplates || []} onRedeemCoupon={() => {}} onBuyDeal={() => {}} onUseCoupon={() => {}} />
            </motion.div>
          )}

          {activeTab === 'pets' && (
            <motion.div key="pets-tab" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              {selectedPetId ? (
                <PetDetailView 
                  pet={sortedPets.find(p => p.id === selectedPetId)} 
                  onBack={() => setSelectedPetId(null)} 
                  onStartEdit={(p: any) => { setPetToEditId(p.id); setIsPetFormOpen(true); }} 
                  onDeletePet={(id) => deletePetMutation.mutate(id)} 
                  totalServiceCost={0} 
                  onViewServiceHistoryForPet={() => {}} 
                  onEditPreferences={() => setIsPreferenceFormOpen(true)} 
                  onToggleFavorite={() => {
                    const pet = sortedPets.find(p => p.id === selectedPetId);
                    if (pet) toggleFavoriteMutation.mutate({ petId: pet.id, isFavorite: !pet.is_favorite });
                  }} 
                />
              ) : (
                <PetManagement 
                  pets={sortedPets} 
                  onBack={() => setActiveTab('home')} 
                  onViewDetails={(p: any) => setSelectedPetId(p.id)} 
                  onAddPet={() => { setPetToEditId(null); setIsPetFormOpen(true); }} 
                  onToggleFavorite={(petId, currentFav) => toggleFavoriteMutation.mutate({ petId, isFavorite: !currentFav })}
                />
              )}
            </motion.div>
          )}

          {activeTab === 'history' && (
            <motion.div key="history-tab" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <ServiceHistory historyData={[]} onServiceClick={() => {}} />
            </motion.div>
          )}
          
          {activeTab === 'level' && (
            <motion.div key="level-tab" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <MembershipLevels totalAccumulatedPoints={customerData?.membership?.total_points || 0} redeemablePoints={customerData?.membership?.points || 0} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <nav className="fixed bottom-[20px] left-4 right-4 max-w-[calc(theme(maxWidth.md)-2rem)] mx-auto glass-effect px-6 py-4 flex justify-between items-center rounded-3xl shadow-ambient z-[40] border border-white/40">
        <NavButton active={activeTab === 'home'} icon={<Home size={22} />} onClick={() => handleNavClick('home')} />
        <NavButton active={activeTab === 'appointments'} icon={<Calendar size={22} />} onClick={() => handleNavClick('appointments')} />
        <NavButton active={activeTab === 'pets'} icon={<PawPrint size={22} />} onClick={() => handleNavClick('pets')} />
        <NavButton active={activeTab === 'promo'} icon={<Megaphone size={22} />} onClick={() => handleNavClick('promo')} />
        <NavButton active={activeTab === 'history'} icon={<History size={22} />} onClick={() => handleNavClick('history')} />
      </nav>

      <QRCodeModal isOpen={isQRCodeOpen} onClose={() => setIsQRCodeOpen(false)} lineId={lineProfile?.displayName || ''} memberId={customerData?.profile?.phone || ''} />
      <PetForm isOpen={isPetFormOpen} onClose={() => setIsPetFormOpen(false)} onSave={(data) => petMutation.mutate(data)} initialData={sortedPets.find(p => p.id === petToEditId)} />
      <BookingForm isOpen={isBookingFormOpen} onClose={() => setIsBookingFormOpen(false)} pets={sortedPets} services={storeServices || []} onConfirm={async (d) => { await bookAppointmentMutation.mutateAsync(d); }} />
      <UserProfileEdit isOpen={isProfileEditing} onClose={() => setIsProfileEditing(false)} profile={customerData?.profile as any} onSave={() => {}} />
    </div>
  );
};

const NavButton = ({ active, icon, onClick }: { active: boolean; icon: any; onClick: () => void }) => (
  <button onClick={onClick} className="relative flex items-center justify-center w-12 h-12">
    {active && <motion.div layoutId="activeNavBg" className="absolute inset-0 bg-primary rounded-2xl shadow-ambient" transition={{ type: "spring", bounce: 0.2, duration: 0.6 }} />}
    <div className={`relative z-10 ${active ? 'text-tertiary' : 'text-primary/40'}`}>{icon}</div>
  </button>
);

export default Index;