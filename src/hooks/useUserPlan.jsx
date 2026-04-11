import { useState, useEffect } from 'react';
import { appClient } from '@/api/appClient';

export function useUserPlan() {
  const [isPro, setIsPro] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    appClient.auth.me().then(u => {
      const role = u?.role || 'user';
      setIsPro(role === 'pro' || role === 'admin' || role === 'agency');
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return { isPro, loading };
}
