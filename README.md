# SmartCorp CRM

A clone of [smartcorptech.com](https://smartcorptech.com) with a hidden CRM dashboard for managing leads and follow-ups.

## Tech Stack

- **Frontend**: React 19 + TypeScript + Vite + Tailwind CSS v4 + shadcn/ui
- **Database**: Supabase (PostgreSQL)
- **Deployment**: Vercel (SPA + serverless API routes)
- **Sync**: Two-way Google Sheets ↔ Supabase sync

## Getting Started

### 1. Clone & Install

```bash
cd smartcorp-crm
npm install
```

### 2. Supabase Setup

1. Create a project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run the contents of `supabase/migration.sql`
3. Copy your project URL and anon key from **Settings → API**

### 3. Environment Variables

Copy `.env.example` to `.env` and fill in your Supabase credentials:

```bash
cp .env.example .env
```

### 4. Run Locally

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

## Secret Dashboard

**Double-click the logo** in the navbar to access the admin login.

- Password: `Martinez!123`
- Dashboard: `/dashboard` (Overview, Leads, Follow-ups)

## Google Sheets Two-Way Sync

### Setup

1. Create a Google Cloud service account
2. Share your Google Sheet with the service account email
3. Set the environment variables in Vercel (see `.env.example`)

### Sync Endpoint

```
POST /api/sync-sheets?direction=both
Authorization: Bearer Martinez!123
```

Directions: `both`, `db-to-sheet`, `sheet-to-db`

## Deployment (Vercel)

```bash
npm i -g vercel
vercel
```

Set all environment variables in Vercel Dashboard → Settings → Environment Variables.

## Project Structure

```
├── api/                    # Vercel serverless functions
│   └── sync-sheets.ts      # Google Sheets ↔ Supabase sync
├── public/assets/           # Static images, video, logo
├── src/
│   ├── components/          # UI components (shadcn/ui + custom)
│   ├── hooks/               # Custom React hooks
│   ├── lib/                 # Utilities, Supabase client, auth
│   ├── pages/               # Route pages + dashboard
│   ├── App.tsx              # Router
│   └── main.tsx             # Entry point
├── supabase/
│   └── migration.sql        # Database schema
└── vercel.json              # Vercel deployment config
```
