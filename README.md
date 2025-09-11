# AI-Powered Student Platform

A comprehensive Next.js 14 application for students featuring AI-powered study assistance, placement preparation, networking, and learning tracking.

## Features

- **Dashboard**: Real-time learning progress and daily summaries
- **AI Assistant**: Chat with Gemini AI and PDF summarization via RunPod
- **Study Materials**: Upload PDFs, organize by subjects/topics, inline PDF viewing
- **Placement Prep**: AI resume review, mock interviews, job insights
- **Networking**: Connect with peers and alumni
- **Study Groups**: Collaborative learning with real-time messaging
- **Learning Tracker**: Task management with calendar heatmap visualization
- **Profile**: User management and progress tracking

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Auth & Storage**: Supabase
- **AI Services**: Google Gemini API, RunPod Serverless
- **UI**: Tailwind CSS, Framer Motion
- **PDF Handling**: react-pdf-viewer, pdf-parse
- **Validation**: Zod

## Setup Instructions

### 1. Environment Variables

Create a `.env.local` file in the root directory:

```bash
# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/student_platform"

# Supabase
NEXT_PUBLIC_SUPABASE_URL="your-supabase-url"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-supabase-service-role-key"

# AI Services
GEMINI_API_KEY="your-gemini-api-key"
RUNPOD_API_KEY="your-runpod-api-key"
RUNPOD_ENDPOINT_ID="your-runpod-endpoint-id"

# Job Data API
JOBDATA_API_KEY="your-jobdata-api-key"

# Environment
NODE_ENV="development"
```

### 2. Database Setup

```bash
# Install dependencies
npm install

# Generate Prisma client
npm run db:generate

# Push database schema
npm run db:push

# Seed the database with sample data
npm run db:seed
```

### 3. Supabase Configuration

#### Create Storage Buckets

1. Go to your Supabase dashboard
2. Navigate to Storage
3. Create a bucket named `materials`
4. Set it to public

#### Set up Row Level Security (RLS)

Enable RLS on your tables and create policies. Example for study_materials:

```sql
-- Enable RLS
ALTER TABLE study_materials ENABLE ROW LEVEL SECURITY;

-- Policy for users to see their own materials
CREATE POLICY "Users can view own materials" ON study_materials
  FOR SELECT USING (auth.uid()::text = owner_id);

-- Policy for users to insert their own materials
CREATE POLICY "Users can insert own materials" ON study_materials
  FOR INSERT WITH CHECK (auth.uid()::text = owner_id);
```

### 4. AI Service Setup

#### Google Gemini API
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create an API key
3. Add it to your `.env.local` as `GEMINI_API_KEY`

#### RunPod Serverless
1. Sign up at [RunPod](https://runpod.io)
2. Create a serverless endpoint with an LLM model
3. Get your API key and endpoint ID
4. Add them to your `.env.local`

#### Simple Job Data API
1. Sign up at [Simple Job Data API](https://simplejobdata.com)
2. Get your API key
3. Add it to your `.env.local` as `JOBDATA_API_KEY`

### 5. Run the Application

```bash
# Development mode
npm run dev

# Production build
npm run build
npm start
```

The application will be available at `http://localhost:3000`

## Project Structure

```
├── app/
│   ├── (tabs)/                 # Tab-based routes
│   │   ├── dashboard/
│   │   ├── ai-assistant/
│   │   ├── study-materials/
│   │   ├── placement-prep/
│   │   ├── networking/
│   │   ├── study-groups/
│   │   ├── learning-tracker/
│   │   └── profile/
│   ├── api/                    # API routes
│   │   ├── dashboard/
│   │   ├── ai/
│   │   ├── study/
│   │   ├── placement/
│   │   ├── groups/
│   │   └── tracker/
│   └── auth/                   # Authentication pages
├── lib/
│   ├── services/               # Business logic
│   ├── db.ts                   # Prisma client
│   ├── supabaseClient.ts       # Supabase clients
│   ├── auth.ts                 # Auth helpers
│   ├── responses.ts            # API response helpers
│   └── validation.ts           # Zod schemas
├── components/
│   ├── pdf/                    # PDF viewer components
│   ├── tracker/                # Calendar heatmap
│   ├── groups/                 # Group messaging
│   └── auth/                   # Authentication forms
├── prisma/
│   └── schema.prisma           # Database schema
└── scripts/
    └── seed.ts                 # Database seeding
```

## API Endpoints

### Dashboard
- `GET /api/dashboard/recent-activity` - Get today's progress and weekly stats

### AI Services
- `POST /api/ai/chat` - Chat with AI assistant
- `POST /api/ai/summarize` - Summarize PDF content

### Study Materials
- `POST /api/study/upload` - Upload PDF materials
- `POST /api/study/link` - Add YouTube/web links
- `GET /api/study/list` - List materials with filters

### Placement Prep
- `POST /api/placement/resume/review` - AI resume review
- `POST /api/placement/mock/start` - Start mock interview
- `POST /api/placement/mock/answer` - Submit interview answer
- `POST /api/placement/mock/finish` - Complete interview with AI review
- `GET /api/placement/insights` - Get job market insights

### Study Groups
- `GET /api/groups/[groupId]/messages` - Get group messages
- `POST /api/groups/[groupId]/messages` - Send message

### Learning Tracker
- `GET /api/tracker/tasks` - Get user tasks
- `POST /api/tracker/tasks` - Create new task
- `PATCH /api/tracker/task/[id]` - Update task
- `DELETE /api/tracker/task/[id]` - Delete task
- `GET /api/tracker/calendar` - Get calendar heatmap data

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Manual Deployment

1. Build the application: `npm run build`
2. Set up PostgreSQL database
3. Configure environment variables
4. Run migrations: `npm run db:push`
5. Start the application: `npm start`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details