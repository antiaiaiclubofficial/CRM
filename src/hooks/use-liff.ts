import { useEffect, useState } from 'react';
import liff from '@line/liff';

const LIFF_ID = '2009880118-LZxzQe3c';

export const useLiff = () => {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeLiff = async () => {
      try {
        await liff.init({ liffId: LIFF_ID });
        
        if (!liff.isLoggedIn()) {
          // If accessed via web and not logged in, trigger LINE login redirect
          liff.login();
          return;
        }
        
        const userProfile = await liff.getProfile();
        setProfile(userProfile);
      } catch (err) {
        console.error('Failed to initialize LIFF:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    initializeLiff();
  }, []);

  return { profile, loading, error };
};