import { createClient } from '@supabase/supabase-js';
import { publicCloudConfig } from './publicConfig.ts';
const url=import.meta.env.VITE_SUPABASE_URL??publicCloudConfig.url,key=import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY??publicCloudConfig.publishableKey;
export const cloudConfigured=Boolean(url?.startsWith('https://')&&key?.startsWith('sb_publishable_'));
export const supabase=cloudConfigured?createClient(url,key,{auth:{flowType:'pkce',persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}}):null;
