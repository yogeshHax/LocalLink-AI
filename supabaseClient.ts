import { createClient } from '@supabase/supabase-js';

// Extracted from your provided JWT payload: 
// "ref": "rbrbreyexhbkqdiayupa" -> https://rbrbreyexhbkqdiayupa.supabase.co
const SUPABASE_URL = 'https://rbrbreyexhbkqdiayupa.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJicmJyZXlleGhia3FkaWF5dXBhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzExMTU1ODMsImV4cCI6MjA4NjY5MTU4M30.weE91QwdA7j2M0UAS2UERK_CM-heEjbTcDhBzEoPrC8';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);