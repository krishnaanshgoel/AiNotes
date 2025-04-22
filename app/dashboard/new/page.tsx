"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useNotes } from '@/lib/hooks/use-notes';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

export default function NewNotePage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const { createNote } = useNotes();
  const router = useRouter();
  const { toast } = useToast();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast({
        variant: 'destructive',
        title: 'Title required',
        description: 'Please add a title to your note.',
      });
      return;
    }
    
    if (!content.trim()) {
      toast({
        variant: 'destructive',
        title: 'Content required',
        description: 'Please add some content to your note.',
      });
      return;
    }
    
    const { data } = await createNote.mutateAsync({
      title,
      content,
    });
    
    if (data?.id) {
      router.push(`/dashboard/note/${data.id}`);
    }
  };
  
  return (
    <div className="container py-6 md:py-10">
      <div className="mb-6">
        <Button variant="ghost" asChild className="mb-6">
          <Link href="/dashboard">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to notes
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Create New Note</h1>
      </div>
      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Note title"
              className="text-xl font-medium border-0 p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </CardHeader>
          <CardContent>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your note here..."
              className="min-h-[300px] border-0 p-0 focus-visible:ring-0 focus-visible:ring-offset-0 resize-none"
            />
          </CardContent>
          <CardFooter className="border-t px-6 py-4 flex justify-between">
            <Button variant="outline" type="button" onClick={() => router.push('/dashboard')}>
              Cancel
            </Button>
            <Button type="submit" disabled={createNote.isPending}>
              <Save className="h-4 w-4 mr-2" />
              {createNote.isPending ? 'Saving...' : 'Save Note'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}