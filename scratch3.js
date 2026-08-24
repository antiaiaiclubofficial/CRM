import { createClient } from '@supabase/supabase-js'

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY)

async function run() {
  const { data, error } = await supabase.from('coupon_codes').select('status').limit(10)
  console.log('coupon_codes statuses:', data)
  
  const { data: c, error: e } = await supabase.from('customer_coupons').select('status').limit(10)
  console.log('customer_coupons statuses:', c)
}
run()
