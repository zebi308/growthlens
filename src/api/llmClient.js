import { supabase } from '@/api/supabaseClient';

const DEFAULT_FUNCTION_NAME = 'invoke-llm';

export async function invokeLLM(payload) {
  const functionName = import.meta.env.VITE_SUPABASE_LLM_FUNCTION_NAME || DEFAULT_FUNCTION_NAME;

  const { data, error } = await supabase.functions.invoke(functionName, {
    body: payload,
  });

  if (error) {
    const wrappedError = new Error(error.message || 'LLM invocation failed');
    wrappedError.status = error.status || 500;
    wrappedError.data = error;
    throw wrappedError;
  }

  return data;
}
