
import { createClient } from '@supabase/supabase-js';

/**
 * VAHA VOYAGES - Supabase Connectivity Node
 * 
 * To integrate with Netlify, add these to your Environment Variables:
 * 1. VITE_SUPABASE_URL
 * 2. VITE_SUPABASE_ANON_KEY
 */

// Safe access using optional chaining to prevent "Cannot read properties of undefined"
const env = (import.meta as any).env;
const supabaseUrl = env?.VITE_SUPABASE_URL || '';
const supabaseAnonKey = env?.VITE_SUPABASE_ANON_KEY || '';

// Export configuration status for the UI to provide feedback
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey && !supabaseUrl.includes('placeholder'));

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key'
);
