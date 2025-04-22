import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Database } from '@/lib/database.types';

export async function POST(request: Request) {
  try {
    // Check if the user is authenticated
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient<Database>({ cookies: () => cookieStore });
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      return new NextResponse(
        JSON.stringify({ message: 'Unauthorized' }),
        { status: 401 }
      );
    }

    // Get the content from the request body
    const { content } = await request.json();

    if (!content || content.length < 10) {
      return new NextResponse(
        JSON.stringify({ message: 'Content is too short for summarization' }),
        { status: 400 }
      );
    }

    // Call the Groq API for summarization
    const groqApiKey = process.env.GROQ_API_KEY;
    if (!groqApiKey) {
      return new NextResponse(
        JSON.stringify({ message: 'API key for summarization service is not configured' }),
        { status: 500 }
      );
    }

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${groqApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama3-8b-8192',
        messages: [
          {
            role: 'system',
            content: 'You are an AI assistant that summarizes text. Create a concise summary that captures the main points of the content. Keep the summary clear and informative.'
          },
          {
            role: 'user',
            content: `Please summarize the following text in a concise way (about 2-3 paragraphs maximum):\n\n${content}`
          }
        ],
        temperature: 0.3,
        max_tokens: 512,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return new NextResponse(
        JSON.stringify({ message: `Error from AI service: ${errorData.error?.message || 'Unknown error'}` }),
        { status: response.status }
      );
    }

    const data = await response.json();
    const summary = data.choices[0].message.content.trim();

    return new NextResponse(
      JSON.stringify({ summary }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in summarize API:', error);
    return new NextResponse(
      JSON.stringify({ message: 'Internal server error' }),
      { status: 500 }
    );
  }
}