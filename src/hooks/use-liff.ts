import { useEffect, useState } from 'react';
import initLiff from '@line/liff';

// กำหนด LIFF ID เป็นค่าคงที่ใน Frontend ตามที่ร้องขอ
const LIFF_ID = '2009880118-LZxzQe3c';

export const useLiff = () => {
  const [isLiffReady, setIsLiffReady] = useState(false);
  const [isInClient, setIsInClient] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeLiff = async () => {
      try {
        // ใช้ LIFF ID ที่กำหนดไว้คงที่แทนการดึงจาก Backend
        await initLiff({ liffId: LIFF_ID });
        setIsLiffReady(true);
        setIsInClient(window.liff.isInClient());
      } catch (err) {
        console.error('Failed to initialize LIFF:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      }
    };

    initializeLiff();
  }, []);

  return { isLiffReady, isInClient, error };
};