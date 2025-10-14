# Google OAuth Setup Guide for StudyBuddy

## 🚀 Quick Setup Steps

### 1. Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Create a new project
4. Wait for it to finish setting up

### 2. Get Your Supabase Credentials
1. Go to your Supabase project dashboard
2. Click "Settings" → "API"
3. Copy these values:
   - **Project URL** (e.g., `https://your-project-id.supabase.co`)
   - **Anon public key** (starts with `eyJ...`)

### 3. Create .env.local File
Create a file called `.env.local` in your project root with:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

### 4. Set Up Google OAuth
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing one
3. Enable Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
5. Choose "Web application"
6. Add these URLs:
   - **Authorized JavaScript origins**: `http://localhost:3000`
   - **Authorized redirect URIs**: 
     - `http://localhost:3000/auth/callback`
     - `https://your-project-id.supabase.co/auth/v1/callback`

### 5. Configure Supabase
1. Go to your Supabase dashboard
2. Click "Authentication" → "Providers"
3. Enable "Google" provider
4. Add your Google OAuth credentials:
   - **Client ID**: From Google Cloud Console
   - **Client Secret**: From Google Cloud Console
5. Set **Redirect URL**: `https://your-project-id.supabase.co/auth/v1/callback`

### 6. Test the Setup
1. Restart your development server: `npm run dev`
2. Click "Sign in to save your progress"
3. Click "Continue with Google"
4. You should be redirected to Google sign-in!

## 🔧 Troubleshooting

### Common Issues:
- **"Invalid redirect URI"**: Make sure redirect URIs match exactly
- **"Client ID not found"**: Double-check your Google OAuth setup
- **"Supabase URL required"**: Make sure .env.local is created correctly

### For Production:
When deploying, update your Google OAuth settings:
- Add your production domain to authorized origins
- Update redirect URIs to include your production URL

## ✅ Success Indicators
- Google sign-in button shows loading state
- Redirects to Google OAuth page
- Returns to your app after authentication
- User email appears in the top-right corner
