import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'Thiếu VITE_SUPABASE_URL hoặc VITE_SUPABASE_ANON_KEY.\n' +
    'Tạo file .env ở thư mục gốc (copy từ .env.example) và điền thông tin project Supabase của bạn.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
