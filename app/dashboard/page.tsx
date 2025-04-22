import { cookies } from 'next/headers';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/lib/database.types';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { Suspense } from 'react';
import { NotesList } from '@/components/notes-list';
import { EmptyNotes } from '@/components/empty-notes';

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const supabase = createServerComponentClient<Database>({ cookies: () => cookieStore });
  
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    return null;
  }

  const { data: notes } = await supabase
    .from('notes')
    .select('*')
    .eq('user_id', session.user.id)
    .order('updated_at', { ascending: false });

  return (
    <div className="container py-6 md:py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Your Notes</h1>
        <Button asChild>
          <Link href="/dashboard/new">
            <Plus className="h-4 w-4 mr-2" />
            New Note
          </Link>
        </Button>
      </div>
      <Suspense fallback={<div>Loading notes...</div>}>
        {notes && notes.length > 0 ? (
          <NotesList initialNotes={notes} />
        ) : (
          <EmptyNotes />
        )}
      </Suspense>
    </div>
  );
}