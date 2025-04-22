# AI Notes App

A fully-featured note-taking application with AI-powered summarization capabilities built with Next.js, Supabase, and the Groq API.

## Features

- **User Authentication**: Sign up and login with email/password or Google
- **Note Management**: Create, edit, and delete notes
- **AI Summarization**: Generate concise summaries of your notes using the Groq API
- **Responsive Design**: Works on all devices from mobile to desktop
- **Dark/Light Theme**: Toggle between light and dark mode

## Tech Stack

- **Frontend**: Next.js 13 (App Router), TypeScript, Tailwind CSS, Shadcn UI
- **State Management**: React Query for server state
- **Backend**: Supabase for authentication and data storage
- **AI Integration**: Groq API for note summarization

## Getting Started

### Prerequisites

- Node.js 18+ 
- A Supabase account
- A Groq API key

### Setup

1. Clone the repository
```bash
git clone https://github.com/yourusername/ai-notes-app.git
cd ai-notes-app
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables by creating a `.env.local` file:
```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
GROQ_API_KEY=your-groq-api-key
```

4. Run the migration to create the notes table in Supabase:
- Log into your Supabase dashboard
- Go to SQL Editor
- Create a new query and paste the content of `supabase/migrations/create_notes_table.sql`
- Run the query to create the table and set up row-level security

5. Start the development server
```bash
npm run dev
```

## Deployment

The app can be easily deployed to Vercel by connecting your GitHub repository.

## License

This project is licensed under the MIT License.