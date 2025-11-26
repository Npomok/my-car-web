import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('กรุณาใส่ค่า Supabase URL และ Key ในไฟล์ .env.local ก่อนนะครับ')
}

export const supabase = createClient(supabaseUrl, supabaseKey)