// Supabase 클라이언트 래퍼
// 사용법:
// 서버 전용 키(SERVICE ROLE)는 위험하므로 노출하지 마세요.
// 환경변수: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY (클라이언트용)
//            SUPABASE_SERVICE_ROLE_KEY (서버 전용, 선택)

import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// 서버사이드에서는 service role 키가 있으면 그것을 사용하도록 함
export const supabaseServer: SupabaseClient | null =
  supabaseServiceRole && supabaseUrl
    ? createClient(supabaseUrl, supabaseServiceRole)
    : supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

export default supabaseServer;
