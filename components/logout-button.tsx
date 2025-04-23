"use client"

import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Button } from '@/components/ui/button';
import { Database } from '@/lib/database.types';

export function LogoutButton() {
  const router = useRouter();
  const supabase = createClientComponentClient<Database>();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
    localStorage.clear();
    sessionStorage.clear();
    // router.refresh();
  };

  return (
    <Button variant="ghost" onClick={handleSignOut} size="sm">
      Logout
    </Button>
  );
}