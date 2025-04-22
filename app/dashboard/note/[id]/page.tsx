"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useNotes } from '@/lib/hooks/use-notes';
import { Button } from '@/components/ui/button';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { ArrowLeft, Save, Trash2, Sparkles, Sparkle as FileSparkle } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

export default function NotePage({ params }: { params: { id: string } }) {
  const { id } = params;
  const { useNote, updateNote, deleteNote, generateSummary } = useNotes();
  const { data: note, isLoading, isError } = useNote(id);
  const router = useRouter();
  
  const [title, setTitle] = useState(note?.title || '');
  const [content, setContent] = useState(note?.content || '');
  const [isEditing, setIsEditing] = useState(false);
  
  if (isLoading) {
    return <div className="container py-10">Loading note...</div>;
  }
  
  if (isError || !note) {
    return (
      <div className="container py-10">
        <p className="text-destructive">Error loading note</p>
        <Button asChild className="mt-4">
          <Link href="/dashboard">Back to dashboard</Link>
        </Button>
      </div>
    );
  }
  
  const handleSaveChanges = async () => {
    await updateNote.mutateAsync({
      id: note.id,
      title,
      content,
    });
    setIsEditing(false);
  };
  
  const handleDelete = async () => {
    await deleteNote.mutateAsync(note.id);
    router.push('/dashboard');
  };
  
  const handleGenerateSummary = async () => {
    await generateSummary.mutateAsync({
      id: note.id,
      content: note.content,
    });
  };
  
  // Update local state when note is loaded
  if (note && title !== note.title) {
    setTitle(note.title);
  }
  
  if (note && content !== note.content) {
    setContent(note.content);
  }
  
  return (
    <div className="container py-6 md:py-10">
      <div className="mb-6">
        <Button variant="ghost" asChild className="mb-6">
          <Link href="/dashboard">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to notes
          </Link>
        </Button>
      </div>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          {isEditing ? (
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-xl font-medium border-0 p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          ) : (
            <h1 className="text-2xl font-bold">{note.title}</h1>
          )}
          
          <div className="flex items-center gap-2">
            {!isEditing && note.summary && (
              <Badge variant="outline" className="flex items-center gap-1">
                <FileSparkle className="h-3 w-3" />
                AI Summary
              </Badge>
            )}
            
            {!isEditing && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setIsEditing(true)}
              >
                Edit
              </Button>
            )}
            
            {isEditing && (
              <>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </Button>
                <Button 
                  size="sm" 
                  onClick={handleSaveChanges}
                  disabled={updateNote.isPending}
                >
                  <Save className="h-4 w-4 mr-2" />
                  {updateNote.isPending ? 'Saving...' : 'Save'}
                </Button>
              </>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {note.summary ? (
            <Tabs defaultValue="content">
              <TabsList className="mb-4">
                <TabsTrigger value="content">Content</TabsTrigger>
                <TabsTrigger value="summary">AI Summary</TabsTrigger>
              </TabsList>
              <TabsContent value="content">
                {isEditing ? (
                  <Textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="min-h-[300px] border-0 p-0 focus-visible:ring-0 focus-visible:ring-offset-0 resize-none"
                  />
                ) : (
                  <div className="whitespace-pre-wrap">{note.content}</div>
                )}
              </TabsContent>
              <TabsContent value="summary">
                <div className="p-4 rounded-md bg-muted">
                  <h3 className="text-md font-semibold mb-2 flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-primary" />
                    AI-Generated Summary
                  </h3>
                  <div className="whitespace-pre-wrap">{note.summary}</div>
                </div>
              </TabsContent>
            </Tabs>
          ) : (
            <>
              {isEditing ? (
                <Textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="min-h-[300px] border-0 p-0 focus-visible:ring-0 focus-visible:ring-offset-0 resize-none"
                />
              ) : (
                <div className="whitespace-pre-wrap">{note.content}</div>
              )}
            </>
          )}
        </CardContent>
        <CardFooter className="border-t px-6 py-4 flex justify-between">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Note
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete your note.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          
          {!note.summary && !isEditing && (
            <Button 
              variant="outline" 
              onClick={handleGenerateSummary}
              disabled={generateSummary.isPending}
            >
              <Sparkles className="h-4 w-4 mr-2" />
              {generateSummary.isPending ? 'Generating...' : 'Generate AI Summary'}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}