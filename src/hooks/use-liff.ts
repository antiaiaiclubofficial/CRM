import { useEffect, useState } from 'react';
import liff from '@line/liff';

const LIFF_ID = '2009880118-LZxzQe3c';

// Mock profile for testing outside LINE
const MOCK_PROFILE = {
  userId: 'U1234567890abcdef',
  displayName: 'Tester Elmony 🐾',
  pictureUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
  statusMessage: 'Testing the app locally',
  email: 'tester@example.com'
};

export const useLiff = () => {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeLiff = async () => {
      // Check if we are in a development environment or Elmony preview
      const isDev = window.location.hostname === 'localhost' || 
                    window.location.hostname.includes('elmony.com') ||
                    window.location.hostname.includes('web-preview.app');

      try {
        await liff.init({ liffId: LIFF_ID });
        
        if (liff.isLoggedIn()) {
          const userProfile = await liff.getProfile();
          setProfile(userProfile);
        } else if (isDev) {
          // If in dev mode and not logged in, use mock data instead of redirecting
          console.log('Using Mock Profile for testing...');
          setProfile(MOCK_PROFILE);
        } else {
          // Only redirect to login in real production environment
          liff.login();
          return;
        }
      } catch (err) {
        console.error('LIFF Init Error:', err);
        if (isDev) {
          setProfile(MOCK_PROFILE);
        } else {
          setError(err instanceof Error ? err.message : 'Unknown error');
        }
      } finally {
        setLoading(false);
      }
    };

    initializeLiff();
  }, []);

  return { profile, loading, error };
};