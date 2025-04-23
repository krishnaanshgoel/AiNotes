import { cookies } from 'next/headers';
import { createServerActionClient } from '@supabase/auth-helpers-nextjs';
import { redirect } from 'next/navigation';
import { Database } from '@/lib/database.types';

export async function GET() {
  const supabase = createServerActionClient<Database>({ cookies });

  await supabase.auth.signOut();
  localStorage.clear(); // if you’re storing anything session-related
sessionStorage.clear(); // clears session + cookie on server
  redirect('/login'); // or wherever you want
}
