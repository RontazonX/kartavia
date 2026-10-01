require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function run() {
  const { data, error } = await supabase
    .from('destinations')
    .select('id, title, crowd_level')
    .limit(1);

  if (error) {
    console.error('Error fetching:', error);
    return;
  }

  const dest = data[0];
  console.log('Found destination:', dest);

  const { error: updateError } = await supabase
    .from('destinations')
    .update({ crowd_level: 'Crowded' })
    .eq('id', dest.id);

  if (updateError) {
    console.error('Error updating:', updateError);
  } else {
    console.log('Successfully updated', dest.title, 'to Crowded');
  }
}

run();
