"use client"

import { useQuery } from '@tanstack/react-query';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/lib/database.types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';
import { ChevronRight, Sparkle as FileSparkle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

type Note = Database['public']['Tables']['notes']['Row'];

export function NotesList({ initialNotes }: { initialNotes: Note[] }) {
  const supabase = createClientComponentClient<Database>();
  
  const { data: notes } = useQuery({
    queryKey: ['notes'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('No session');
      }
      
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq('user_id', session.user.id)
        .order('updated_at', { ascending: false });
        
      if (error) {
        throw error;
      }
      
      return data;
    },
    initialData: initialNotes,
  });
  
  if (!notes || notes.length === 0) {
    return null;
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {notes.map((note) => (
        <Link href={`/dashboard/note/${note.id}`} key={note.id}>
          <Card className="h-full cursor-pointer transition-all hover:shadow-md overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex justify-between">
                <CardTitle className="line-clamp-1">{note.title}</CardTitle>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </div>
              <CardDescription>
                {formatDistanceToNow(new Date(note.updated_at), { addSuffix: true })}
              </CardDescription>
            </CardHeader>
            <CardContent className="text-sm">
              <p className="line-clamp-4">{note.content.replace(/(<([^>]+)>)/gi, '')}</p>
            </CardContent>
            <CardFooter>
              {note.summary && (
                <Badge variant="outline" className="flex items-center gap-1">
                  <FileSparkle className="h-3 w-3" />
                  AI Summary
                </Badge>
              )}
            </CardFooter>
          </Card>
        </Link>
      ))}
    </div>
  );
}