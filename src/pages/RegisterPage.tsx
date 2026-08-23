import React from 'react';
import { useNavigate } from 'react-router-dom';
import Register from './Register';
import { useLiff } from '@/contexts/LiffContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const RegisterPage = () => {
  const { store, liffProfile, customer, membershipStatus } = useLiff();
  const navigate = useNavigate();

  const handleSave = async (formData: any) => {
    if (!store || !liffProfile) return;
    
    try {
      let customerId = customer?.id;
      
      if (membershipStatus === 'global_user' && customerId) {
        // อัปเดตข้อมูลเพิ่มเติม
        await supabase
          .from('customers')
          .update({
            first_name: formData.firstName,
            last_name: formData.lastName,
            gender: formData.gender,
            age: formData.age,
            phone: formData.phone,
            email: formData.email,
            house_no: formData.houseNo,
            moo: formData.moo,
            soi: formData.soi,
            road: formData.road,
            sub_district: formData.subDistrict,
            district: formData.district,
            province: formData.province,
            postal_code: formData.postalCode,
          })
          .eq('id', customerId);
      } else {
        // สร้าง customer ใหม่ (สำหรับ guest)
        const { data: newCustomer, error: createError } = await supabase
          .from('customers')
          .insert({
            line_user_id: liffProfile.userId,
            first_name: formData.firstName,
            last_name: formData.lastName,
            phone: formData.phone,
            email: formData.email,
            // เพิ่ม field อื่นๆ ตามที่จำเป็น
          })
          .select()
          .single();
          
        if (createError) throw createError;
        customerId = newCustomer.id;
      }

      // 2. เชื่อม store_customers
      const { error: linkError } = await supabase
        .from('store_customers')
        .insert({
          store_id: store.id,
          customer_id: customerId,
        });

      if (linkError) throw linkError;

      // 3. รีโหลดหน้าเพื่อดึง State ใหม่ (จะกลายเป็น Member แล้วพาไป / อัตโนมัติ)
      window.location.reload();
      
    } catch (error: any) {
      console.error("Register Error:", error);
      toast.error(error.message || "เกิดข้อผิดพลาดในการสมัครสมาชิก");
      throw error;
    }
  };

  const handleSuccess = () => {
    toast.success("สมัครสมาชิกสำเร็จ!");
    // การ redirect จะจัดการใน AppContent เมื่อ isMember = true หลังจาก reload
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
        {membershipStatus === 'global_user' && (
          <div className="bg-blue-50 border border-blue-100 text-blue-800 p-4 rounded-xl mb-4 text-sm shadow-sm">
            <p className="font-semibold mb-1">พบข้อมูลของคุณในระบบแล้ว! 🎉</p>
            <p>คุณสามารถตรวจสอบความถูกต้องของข้อมูลด้านล่าง และกดยืนยันเพื่อสมัครเป็นสมาชิกของ {store.name} ได้ทันทีเลยครับ</p>
          </div>
        )}
        <Register 
          lineProfile={{
            ...liffProfile,
            phone: liffProfile.phone || '', // ถ้ามี
            email: liffProfile.email || '', // ถ้ามี
          }} 
          initialData={customer}
          onSave={handleSave} 
          onSuccess={handleSuccess} 
        />
      </main>
    </div>
  );
};

export default RegisterPage;
