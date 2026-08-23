import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Register from './Register';
import { useLiff } from '@/contexts/LiffContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { UniversalConfirmModal } from '@/components/auth/UniversalConfirmModal';
import { Customer } from '@/types';

const RegisterPage = () => {
  const { store, liffProfile, customer, membershipStatus } = useLiff();
  const navigate = useNavigate();
  
  const [showUniversalModal, setShowUniversalModal] = useState(false);
  const [foundCustomer, setFoundCustomer] = useState<Customer | null>(null);
  const [pendingFormData, setPendingFormData] = useState<any>(null);

  const handleSave = async (formData: any) => {
    if (!store || !liffProfile) return;
    
    try {
      // 1. ค้นหาว่ามีเบอร์โทรศัพท์นี้ในระบบหรือไม่
      const { data: existingByPhone } = await supabase
        .from('customers')
        .select('*')
        .eq('phone', formData.phone)
        .single();

      if (existingByPhone) {
        // พบเบอร์นี้ในระบบ -> เปิด Modal ให้ยืนยัน
        setFoundCustomer(existingByPhone as Customer);
        setPendingFormData(formData);
        setShowUniversalModal(true);
        return; // หยุดทำงานตรงนี้ รอ User กด Modal
      }

      // 2. ถ้าไม่พบเบอร์ในระบบ (ลูกค้าใหม่แกะกล่อง)
      const { data: newCustomer, error: createError } = await supabase
        .from('customers')
        .insert({
          line_user_id: liffProfile.userId,
          first_name: formData.firstName,
          last_name: formData.lastName,
          gender: formData.gender,
          age: formData.age,
          phone: formData.phone,
          email: formData.email,
          house_no: formData.houseNo,
          village_no: formData.moo,
          soi: formData.soi,
          road: formData.road,
          sub_district: formData.subDistrict,
          district: formData.district,
          province: formData.province,
          postal_code: formData.postalCode,
          address: formData.address,
        })
        .select()
        .single();
        
      if (createError) throw createError;

      // 3. เชื่อม store_customers
      // ตรวจสอบว่ามีอยู่แล้วหรือยัง
      const { data: existingGuestLink } = await supabase
        .from('store_customers')
        .select('id')
        .eq('store_id', store.id)
        .eq('customer_id', newCustomer.id)
        .single();

      if (existingGuestLink) {
        await supabase
          .from('store_customers')
          .update({ line_user_id: liffProfile.userId })
          .eq('id', existingGuestLink.id);
      } else {
        const { error: linkError } = await supabase
          .from('store_customers')
          .insert({
            store_id: store.id,
            customer_id: newCustomer.id,
            line_user_id: liffProfile.userId, // บันทึก line_user_id แยกตามร้าน
          });

        if (linkError) throw linkError;
      }

      handleSuccess();
      
    } catch (error: any) {
      console.error("Register Error:", error);
      toast.error(error.message || "เกิดข้อผิดพลาดในการสมัครสมาชิก");
      throw error;
    }
  };

  const handleConfirmUniversal = async () => {
    if (!store || !liffProfile || !foundCustomer || !pendingFormData) return;
    
    try {
      toast.loading("กำลังเชื่อมต่อข้อมูล...");
      // อัปเดตข้อมูลลูกค้าด้วยสิ่งที่เพิ่งพิมพ์มา
      await supabase
        .from('customers')
        .update({
          first_name: pendingFormData.firstName,
          last_name: pendingFormData.lastName,
          gender: pendingFormData.gender,
          age: pendingFormData.age,
          email: pendingFormData.email,
          house_no: pendingFormData.houseNo,
          village_no: pendingFormData.moo,
          soi: pendingFormData.soi,
          road: pendingFormData.road,
          sub_district: pendingFormData.subDistrict,
          district: pendingFormData.district,
          province: pendingFormData.province,
          postal_code: pendingFormData.postalCode,
          address: pendingFormData.address,
        })
        .eq('id', foundCustomer.id);

      // ตรวจสอบว่าเคยมี connection เดิมอยู่แล้วหรือไม่ (กรณีเก่าที่ line_user_id เป็น null)
      const { data: existingLink } = await supabase
        .from('store_customers')
        .select('id')
        .eq('store_id', store.id)
        .eq('customer_id', foundCustomer.id)
        .single();

      if (existingLink) {
        // อัปเดตข้อมูลเก่าให้มี line_user_id
        await supabase
          .from('store_customers')
          .update({ line_user_id: liffProfile.userId })
          .eq('id', existingLink.id);
      } else {
        // สร้าง connection ใหม่ใน store_customers
        const { error: linkError } = await supabase
          .from('store_customers')
          .insert({
            store_id: store.id,
            customer_id: foundCustomer.id,
            line_user_id: liffProfile.userId,
          });

        if (linkError) throw linkError;
      }

      setShowUniversalModal(false);
      handleSuccess();

    } catch (error: any) {
      console.error("Universal Linking Error:", error);
      toast.error(error.message || "เกิดข้อผิดพลาดในการเชื่อมต่อข้อมูล");
    }
  };

  const handleSuccess = () => {
    toast.success("สมัครสมาชิกสำเร็จ!");
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  if (!store || !liffProfile) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white p-4 shadow-sm text-center">
        {store.logo_url && (
          <img 
            src={store.logo_url} 
            alt={store.name} 
            className="h-16 w-16 mx-auto rounded-full object-cover mb-2"
          />
        )}
        <h1 className="text-xl font-bold text-gray-900">{store.name}</h1>
      </header>
      
      <main className="flex-1 w-full max-w-md mx-auto relative z-10 p-4">
        {/* ข้อความต้อนรับเดิมจะซ่อนไว้ก่อน เพราะระบบนี้เราจะไม่รู้ว่าเป็น global user จนกว่าจะพิมพ์เบอร์โทร */}
        <Register 
          lineProfile={{
            ...liffProfile,
            phone: liffProfile.phone || '', // ถ้ามี
            email: liffProfile.email || '', // ถ้ามี
          }} 
          initialData={customer}
          onSave={handleSave} 
          onSuccess={() => {}} 
        />
      </main>

      <UniversalConfirmModal 
        isOpen={showUniversalModal}
        customerName={foundCustomer ? `${foundCustomer.first_name} ${foundCustomer.last_name}` : ''}
        phone={foundCustomer?.phone || ''}
        onConfirm={handleConfirmUniversal}
        onCancel={() => setShowUniversalModal(false)}
      />
    </div>
  );
};

export default RegisterPage;
