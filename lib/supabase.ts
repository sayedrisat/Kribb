import {createClient} from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL as string;
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_KEY as string;

export const  supabase = createClient(supabaseUrl, supabaseKey)

export function createClerkSubpabaseClient(getToken: () => Promise<string|null>) {
  return createClient(supabaseUrl, supabaseKey, {
    async accessToken(){
        return getToken()
    }
  });
}
