param(
    [Parameter(Mandatory=$true)]
    [string]$ProjectRef,
    
    [Parameter(Mandatory=$false)]
    [string]$SupabaseUrl,
    
    [Parameter(Mandatory=$false)]
    [string]$AnonKey
)

Write-Host "🚀 Deploying Invoice Processing App to Supabase..." -ForegroundColor Green
Write-Host ""

# Check if Supabase CLI is installed
if (!(Get-Command "supabase" -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Supabase CLI not found. Please install it first:" -ForegroundColor Red
    Write-Host "npm install -g supabase" -ForegroundColor Yellow
    exit 1
}

# Initialize Supabase if not already done
if (!(Test-Path "supabase")) {
    Write-Host "📦 Initializing Supabase project..." -ForegroundColor Yellow
    supabase init
}

# Link to remote project
Write-Host "🔗 Linking to Supabase project: $ProjectRef" -ForegroundColor Yellow
supabase link --project-ref $ProjectRef

# Run migrations
Write-Host "🗄️ Running database migrations..." -ForegroundColor Yellow
supabase db push

# Deploy Edge Functions
Write-Host "⚡ Deploying Edge Functions..." -ForegroundColor Yellow
supabase functions deploy invoice-api --project-ref $ProjectRef

# Build and deploy frontend
Write-Host "🏗️ Building frontend..." -ForegroundColor Yellow
Set-Location client
npm install
npm run build

Write-Host "🌐 Deploying frontend to Supabase..." -ForegroundColor Yellow
# Note: Supabase hosting might not be available in all regions
# Alternative: Deploy to Vercel/Netlify
Write-Host "Frontend built successfully. Deploy the 'build' folder to your preferred hosting service." -ForegroundColor Cyan

Set-Location ..

Write-Host ""
Write-Host "✅ Deployment completed!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Next steps:" -ForegroundColor Cyan
Write-Host "1. Update your frontend environment variables with the backend URL" -ForegroundColor White
Write-Host "2. Test your Edge Function at: https://$ProjectRef.supabase.co/functions/v1/invoice-api/invoice" -ForegroundColor White
Write-Host "3. Deploy your frontend to Vercel, Netlify, or another hosting service" -ForegroundColor White
Write-Host ""
Write-Host "🔧 Environment Variables needed:" -ForegroundColor Yellow
Write-Host "REACT_APP_API_URL=https://$ProjectRef.supabase.co/functions/v1/invoice-api" -ForegroundColor White