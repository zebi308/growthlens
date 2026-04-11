import { supabase } from '@/api/supabaseClient';
import { invokeLLM } from '@/api/llmClient';

const CREATED_DATE_FIELD = 'created_date';
const viteEnv = /** @type {any} */ (import.meta).env || {};

/** @param {string | undefined | null} sort */
const parseSort = (sort) => {
  if (!sort) {
    return { column: CREATED_DATE_FIELD, ascending: false };
  }

  const isDesc = String(sort).startsWith('-');
  const column = isDesc ? String(sort).slice(1) : String(sort);
  return { column, ascending: !isDesc };
};

/** @param {Record<string, any> | null | undefined} row */
const normalizeAnalysis = (row) => {
  if (!row) return row;
  return {
    ...row,
    created_date: row.created_date || row.created_at || null,
  };
};

/** @param {any} error */
const normalizeError = (error, fallbackMessage = 'Unexpected error') => {
  const wrapped = /** @type {any} */ (new Error(error?.message || fallbackMessage));
  wrapped.status = error?.status || 500;
  wrapped.data = error;
  return wrapped;
};

const auth = {
  async me() {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data?.user) {
      const err = /** @type {any} */ (normalizeError(error, 'Authentication required'));
      err.status = 401;
      throw err;
    }

    const user = data.user;
    return {
      id: user.id,
      email: user.email,
      full_name: user.user_metadata?.full_name || user.user_metadata?.name || null,
      role: user.user_metadata?.role || 'user',
    };
  },

  /** @param {string | undefined} redirectUrl */
  async logout(redirectUrl) {
    await supabase.auth.signOut();
    if (redirectUrl && typeof window !== 'undefined') {
      window.location.href = redirectUrl;
    }
  },

  /** @param {string | undefined} returnTo */
  redirectToLogin(returnTo) {
    const redirectBase = viteEnv.VITE_AUTH_REDIRECT_URL;
    if (redirectBase && typeof window !== 'undefined') {
      const separator = redirectBase.includes('?') ? '&' : '?';
      window.location.href = `${redirectBase}${separator}redirect_to=${encodeURIComponent(returnTo || window.location.href)}`;
      return;
    }

    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  },
};

const brandAnalysisEntity = {
  async list(sort = '-created_date', limit = null) {
    const { column, ascending } = parseSort(sort);
    let query = supabase
      .from('brand_analyses')
      .select('*')
      .order(column, { ascending });

    if (typeof limit === 'number') {
      query = query.limit(limit);
    }

    const { data, error } = await query;
    if (error) {
      throw normalizeError(error, 'Failed to fetch analyses');
    }

    return (data || []).map(normalizeAnalysis);
  },

  async filter(filters = {}, sort = '-created_date', limit = null) {
    const { column, ascending } = parseSort(sort);
    let query = supabase
      .from('brand_analyses')
      .select('*')
      .order(column, { ascending });

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        query = query.eq(key, value);
      }
    });

    if (typeof limit === 'number') {
      query = query.limit(limit);
    }

    const { data, error } = await query;
    if (error) {
      throw normalizeError(error, 'Failed to filter analyses');
    }

    return (data || []).map(normalizeAnalysis);
  },

  /** @param {Record<string, any>} payload */
  async create(payload) {
    const currentUser = await auth.me();
    const insertPayload = {
      ...payload,
      user_id: currentUser.id,
      created_by: payload.created_by || currentUser.email,
    };

    const { data, error } = await supabase
      .from('brand_analyses')
      .insert([insertPayload])
      .select('*')
      .single();

    if (error) {
      throw normalizeError(error, 'Failed to create analysis');
    }

    return normalizeAnalysis(data);
  },

  async update(/** @type {string} */ id, /** @type {Record<string, any>} */ payload) {
    const { data, error } = await supabase
      .from('brand_analyses')
      .update(payload)
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      throw normalizeError(error, 'Failed to update analysis');
    }

    return normalizeAnalysis(data);
  },
};

export const appClient = {
  auth,
  entities: {
    BrandAnalysis: brandAnalysisEntity,
  },
  integrations: {
    Core: {
      InvokeLLM: invokeLLM,
    },
  },
};
