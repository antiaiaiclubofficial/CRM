import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Only initialize if both values are present to prevent crashes
export const supabase = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null as any;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Supabase configuration is missing. Please click 'Connect Supabase' button to set up your database.");
}