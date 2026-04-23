import { useState, useEffect } from 'react';
import liff from '@line/liff';
import { supabase } from '@/integrations/supabase/client';

export const useLiff = () => {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initLiff = async () => {
      try {
        // ดึง LIFF ID จาก Backend (Nest.JS)
        // โปรดเปลี่ยน URL ด้านล่างเป็น URL ของ Nest.JS Backend ของคุณ
        const response = await fetch('https://bubbling-silly-fading.ngrok-free.dev');
        const { liffId } = await response.json();

        if (!liffId) throw new Error('LIFF ID not found from backend');

        await liff.init({ liffId });

        if (!liff.isLoggedIn()) {
          liff.login();
          return;
        }

        const lineProfile = await liff.getProfile();
        
        // ตรวจสอบหรือสร้างโปรไฟล์ใน Supabase โดยใช้ line_id
        const { data: existingUser, error: fetchError } = await supabase
          .from('profiles')
          .select('*')
          .eq('line_id', lineProfile.userId)
          .maybeSingle();

        if (!existingUser) {
          // ไม่พบผู้ใช้ สร้างใหม่
          const { data: newUser, error: insertError } = await supabase
            .from('profiles')
            .insert([
              { 
                line_id: lineProfile.userId,
                first_name: lineProfile.displayName,
                avatar_url: lineProfile.pictureUrl,
                points: 0,
                total_points: 0
              }
            ])
            .select()
            .single();
          
          if (insertError) throw insertError;
          setProfile(newUser);
        } else {
          setProfile(existingUser);
        }

      } catch (err: any) {
        console.error('LIFF Init Error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    initLiff();
  }, []);

  return { profile, loading, error };
};