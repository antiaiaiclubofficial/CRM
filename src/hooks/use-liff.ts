"use client";

import { useState, useEffect } from 'react';
import liff from '@line/liff';

export const useLiff = () => {
  const [profile, setProfile] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initLiff = async () => {
      try {
        // Fetch LIFF ID from your NestJS Backend
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/config/liff-id`);
        const { liffId } = await response.json();

        await liff.init({ liffId });
        
        if (!liff.isLoggedIn()) {
          liff.login();
          return;
        }

        const userProfile = await liff.getProfile();
        setProfile(userProfile);
      } catch (err: any) {
        console.error('LIFF init error:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    initLiff();
  }, []);

  return { profile, liff, isLoading, error };
};