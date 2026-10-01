require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
async function run() {
  const { data: bookings, error: bErr } = await supabase.from('bookings').select('user_id').limit(1);
  const userId = bookings && bookings.length ? bookings[0].user_id : '5e3e4df6-2e88-4228-a6d1-e6e73715e219';

  const { data: dest, error: dErr } = await supabase.from('destinations').select('id, title').ilike('title', '%Prambanan%').single();
  console.log('dest', dest.id);
  
  const today = new Date().toISOString().split('T')[0];
  const { error: insErr } = await supabase.from('bookings').insert({
    user_id: userId,
    destination_id: dest.id,
    booking_date: today,
    date: today,
    guests: 475,
    status: 'confirmed',
    total_price: 1000000
  });
  console.log('insErr', insErr);
}
run();
