import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { cookies } from 'next/headers';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Database } from '@/lib/database.types';
import { StickyNote, BookOpen, Brain, UserPlus } from 'lucide-react';

export default async function Home() {
  const cookieStore = cookies();
  const supabase = createServerComponentClient<Database>({ cookies: () => cookieStore });
  
  const { data: { session } } = await supabase.auth.getSession();
  
  if (session) {
    redirect('/dashboard');
  }
  
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2 font-semibold">
            <StickyNote className="h-5 w-5" />
            <span>AI Notes</span>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm">
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild size="sm">
              <Link href="/signup">Sign Up</Link>
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                    AI-Powered Note Taking
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Create, organize, and summarize your notes with the help of AI. Boost your productivity with smart note management.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button asChild size="lg">
                    <Link href="/signup">Get Started</Link>
                  </Button>
                  <Button asChild variant="outline" size="lg">
                    <Link href="/login">Sign In</Link>
                  </Button>
                </div>
              </div>
              <div className="flex flex-col justify-center space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="flex flex-col items-start space-y-2 rounded-lg bg-muted p-4">
                    <BookOpen className="h-6 w-6 text-primary" />
                    <h3 className="text-lg font-medium">Write Notes</h3>
                    <p className="text-sm text-muted-foreground">
                      Create and edit notes with a simple, intuitive interface.
                    </p>
                  </div>
                  <div className="flex flex-col items-start space-y-2 rounded-lg bg-muted p-4">
                    <Brain className="h-6 w-6 text-primary" />
                    <h3 className="text-lg font-medium">AI Summarization</h3>
                    <p className="text-sm text-muted-foreground">
                      Let AI generate concise summaries of your long notes.
                    </p>
                  </div>
                  <div className="flex flex-col items-start space-y-2 rounded-lg bg-muted p-4">
                    <UserPlus className="h-6 w-6 text-primary" />
                    <h3 className="text-lg font-medium">User Accounts</h3>
                    <p className="text-sm text-muted-foreground">
                      Sign in with Google or email to access your notes anywhere.
                    </p>
                  </div>
                  <div className="flex flex-col items-start space-y-2 rounded-lg bg-muted p-4">
                    <StickyNote className="h-6 w-6 text-primary" />
                    <h3 className="text-lg font-medium">Easy Management</h3>
                    <p className="text-sm text-muted-foreground">
                      Organize and manage your notes with a clean, accessible interface.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}