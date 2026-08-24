import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import fs from 'fs'

dotenv.config({ path: '.env.local' })
// Read from .env if .env.local doesn't exist
if (!process.env.VITE_SUPABASE_URL) {
  dotenv.config({ path: '.env' })
}

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY)

async function run() {
  const { data, error } = await supabase.from('customer_coupons').select('*').limit(1)
  console.log('customer_coupons keys:', data && data[0] ? Object.keys(data[0]) : 'no data')
  
  const { data: d2, error: e2 } = await supabase.from('coupon_codes').select('*').limit(1)
  console.log('coupon_codes keys:', d2 && d2[0] ? Object.keys(d2[0]) : 'no data')
}
run()
