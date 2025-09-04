# Supabase Deployment Guide

## Prerequisites

1. **Supabase Account**: Sign up at [supabase.com](https://supabase.com)
2. **Docker Hub Account**: For container registry
3. **Supabase CLI**: Install from [docs.supabase.com](https://supabase.com/docs/guides/cli)

## Step 1: Set up Supabase Project

1. Create a new project in Supabase dashboard
2. Note down your project details:
   - Project URL
   - Database URL
   - API Keys

## Step 2: Configure Database

Your Supabase PostgreSQL database will automatically handle the schema creation through JPA.

## Step 3: Deploy Backend

### Option A: Using Supabase Edge Functions (Recommended)

```bash
# Initialize Supabase in your project
supabase init

# Deploy edge function
supabase functions deploy invoice-api --project-ref YOUR_PROJECT_REF
```

### Option B: Using External Container Service

1. Build and push backend image:
```bash
cd server
docker build -t your-username/invoice-backend .
docker push your-username/invoice-backend
```

2. Deploy to your preferred container service (Railway, Render, etc.)

## Step 4: Deploy Frontend

### Option A: Supabase Hosting (Static)

```bash
# Build the frontend
cd client
npm run build

# Deploy to Supabase
supabase hosting deploy --project-ref YOUR_PROJECT_REF
```

### Option B: Vercel/Netlify

1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set publish directory: `build`
4. Add environment variables

## Environment Variables

### Backend
- `SUPABASE_DB_URL`: Your Supabase database URL
- `SUPABASE_DB_USERNAME`: Database username
- `SUPABASE_DB_PASSWORD`: Database password
- `FRONTEND_URL`: Your frontend URL

### Frontend
- `REACT_APP_API_URL`: Your backend API URL

## Local Testing with Supabase-like Environment

```bash
# Test with PostgreSQL locally
docker-compose -f docker-compose.supabase.yml up --build
```

## Production URLs

After deployment, your application will be available at:
- Frontend: `https://your-project-ref.supabase.co`
- Backend API: `https://your-backend-url.com`
- Database: Managed by Supabase

## Security Notes

1. Enable Row Level Security (RLS) in Supabase dashboard
2. Configure CORS properly for your domain
3. Use environment variables for all sensitive data
4. Enable SSL/HTTPS for production