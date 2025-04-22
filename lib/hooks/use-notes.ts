"use client"

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/lib/database.types';
import { useToast } from '@/hooks/use-toast';

type Note = Database['public']['Tables']['notes']['Row'];
type NewNote = Omit<Database['public']['Tables']['notes']['Insert'], 'id' | 'user_id' | 'created_at' | 'updated_at'>;

export function useNotes() {
  const supabase = createClientComponentClient<Database>();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const createNote = useMutation({
    mutationFn: async (newNote: NewNote) => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('No session');
      }
      
      const { data, error } = await supabase
        .from('notes')
        .insert({
          ...newNote,
          user_id: session.user.id,
        })
        .select('*')
        .single();
      
      if (error) {
        throw error;
      }
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      toast({
        title: 'Note created',
        description: 'Your note has been created successfully.',
      });
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Failed to create note',
        description: error.message || 'An error occurred while creating your note.',
      });
    },
  });
  
  const updateNote = useMutation({
    mutationFn: async ({ id, ...note }: Partial<Note> & { id: string }) => {
      const { data, error } = await supabase
        .from('notes')
        .update({
          ...note,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select('*')
        .single();
      
      if (error) {
        throw error;
      }
      
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      queryClient.invalidateQueries({ queryKey: ['note', data.id] });
      toast({
        title: 'Note updated',
        description: 'Your note has been updated successfully.',
      });
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Failed to update note',
        description: error.message || 'An error occurred while updating your note.',
      });
    },
  });
  
  const deleteNote = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('notes')
        .delete()
        .eq('id', id);
      
      if (error) {
        throw error;
      }
      
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      toast({
        title: 'Note deleted',
        description: 'Your note has been deleted successfully.',
      });
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Failed to delete note',
        description: error.message || 'An error occurred while deleting your note.',
      });
    },
  });
  
  const generateSummary = useMutation({
    mutationFn: async ({ id, content }: { id: string; content: string }) => {
      const response = await fetch('/api/summarize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to generate summary');
      }
      
      const { summary } = await response.json();
      
      // Update the note with the summary
      const { data, error } = await supabase
        .from('notes')
        .update({
          summary,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select('*')
        .single();
      
      if (error) {
        throw error;
      }
      
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      queryClient.invalidateQueries({ queryKey: ['note', data.id] });
      toast({
        title: 'Summary generated',
        description: 'AI has summarized your note successfully.',
      });
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Failed to generate summary',
        description: error.message || 'An error occurred while generating the summary.',
      });
    },
  });
  
  const useNote = (id: string) => {
    return useQuery({
      queryKey: ['note', id],
      queryFn: async () => {
        const { data, error } = await supabase
          .from('notes')
          .select('*')
          .eq('id', id)
          .single();
        
        if (error) {
          throw error;
        }
        
        return data;
      },
    });
  };
  
  return {
    createNote,
    updateNote,
    deleteNote,
    generateSummary,
    useNote,
  };
}