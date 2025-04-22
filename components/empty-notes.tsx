import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function EmptyNotes() {
  return (
    <Card className="border-dashed">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          <span>No notes yet</span>
        </CardTitle>
        <CardDescription>
          Create your first note to get started
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center p-8 space-y-3">
          <p className="text-center text-muted-foreground">
            Start writing notes and use AI to summarize important information
          </p>
          <Button asChild>
            <Link href="/dashboard/new">
              <Plus className="h-4 w-4 mr-2" />
              Create your first note
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}