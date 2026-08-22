import React from 'react';
import { useNavigate } from 'react-router-dom';
import Register from './Register';
import { useLiff } from '@/contexts/LiffContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const RegisterPage = () => {
  const { store, liffProfile } = useLiff();
  const navigate = useNavigate();

  const handleSave = async (formData: any) => {
    if (!store || !liffProfile) return;
    
    try {
      // 1. ตรวจสอบว่ามี customer นี้ในระบบหรือยัง
      let customerId;
      const { data: existingCustomer } = await supabase
        .from('customers')
        .select('id')
        .eq('line_user_id', liffProfile.userId)
        .single();
        
      if (existingCustomer) {
        customerId = existingCustomer.id;
        // อัปเดตข้อมูลเพิ่มเติม
        await supabase
          .from('customers')
          .update({
            first_name: formData.firstName,
            last_name: formData.lastName,
            phone: formData.phone,
            email: formData.email,
          })
          .eq('id', customerId);
      } else {
        // สร้าง customer ใหม่
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
      
      <main className="flex-1 w-full max-w-md mx-auto">
        <Register 
          lineProfile={{
            ...liffProfile,
            phone: liffProfile.phone || '', // ถ้ามี
            email: liffProfile.email || '', // ถ้ามี
          }} 
          onSave={handleSave} 
          onSuccess={handleSuccess} 
        />
      </main>
    </div>
  );
};

export default RegisterPage;
