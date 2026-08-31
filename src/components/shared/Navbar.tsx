import { createClient } from '@/utils/supabase/server';
import { getTranslation } from '@/i18n/server';
import NavbarClient from '@/components/shared/NavbarClient';
import MobileBottomNav from '@/components/shared/MobileBottomNav';

export default async function Navbar() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const t = await getTranslation();

  return (
    <>
      <NavbarClient user={user} t={t} />
      <MobileBottomNav user={user} t={t} />
    </>
  );
}
