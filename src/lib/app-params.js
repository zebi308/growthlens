const getAppParams = () => {
  const isNode = typeof window === 'undefined';
  const fromUrl = isNode ? '' : window.location.href;

  return {
    appId: import.meta.env.VITE_SUPABASE_PROJECT_ID || null,
    token: null,
    fromUrl,
    functionsVersion: null,
    appBaseUrl: import.meta.env.VITE_SUPABASE_URL || null,
  };
};

export const appParams = {
  ...getAppParams(),
};
