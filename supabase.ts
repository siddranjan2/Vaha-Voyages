
import { createClient } from '@supabase/supabase-js';

/**
 * Vite requires static property access for environment variables to be 
 * correctly replaced during the build process. 
 * Dynamic access like `import.meta.env[key]` will not work.
 */
const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL || '';
const supabaseAnonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || '';

// Log a warning if configuration is missing, but don't crash the whole app.
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "VAHA VOYAGES: Supabase configuration missing. \n" +
    "Ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set in your .env or hosting dashboard. \n" +
    "Falling back to local mock data."
  );
}

/**
 * Initialize the client. If variables are missing, we provide a valid-looking 
 * placeholder URL to prevent the `createClient` constructor from throwing an error.
 * The actual network requests will fail gracefully and the app will use MOCK_TRIPS fallback.
 */
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key'
);
