# Vercel Deployment Guide for Worka

## Prerequisites

1. **GitHub Account**: Your code must be in a GitHub repository
2. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
3. **All Service Accounts**: Set up accounts for all required services

## Step 1: Prepare Your Repository

1. Make sure all your code is committed and pushed to GitHub
2. Ensure you have the following files in your repository:
   - `vercel.json` (created)
   - `package.json`
   - `next.config.ts`
   - `prisma/schema.prisma`

## Step 2: Set Up Required Services

### 2.1 Database (PostgreSQL)

**Recommended: Vercel Postgres**

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Create a new Postgres database
3. Copy the connection string

**Alternative: Neon**

1. Go to [neon.tech](https://neon.tech)
2. Create a new project
3. Copy the connection string

### 2.2 OAuth Providers

#### Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (for development)
   - `https://your-domain.vercel.app/api/auth/callback/google` (for production)

#### GitHub OAuth

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Create a new OAuth App
3. Add callback URLs:
   - `http://localhost:3000/api/auth/callback/github` (for development)
   - `https://your-domain.vercel.app/api/auth/callback/github` (for production)

### 2.3 UploadThing

1. Go to [uploadthing.com](https://uploadthing.com)
2. Create a new project
3. Copy `UPLOADTHING_SECRET` and `UPLOADTHING_APP_ID`

### 2.4 Stripe

1. Go to [stripe.com](https://stripe.com)
2. Create an account
3. Get your API keys from the dashboard
4. Set up webhook endpoint (after deployment)

### 2.5 Resend

1. Go to [resend.com](https://resend.com)
2. Create an account
3. Get your API key

### 2.6 Inngest

1. Go to [inngest.com](https://inngest.com)
2. Create a new project
3. Copy event key and signing key

## Step 3: Deploy to Vercel

### 3.1 Connect Repository

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository
4. Select the repository

### 3.2 Configure Project

1. **Framework Preset**: Next.js (should auto-detect)
2. **Root Directory**: `./` (leave as default)
3. **Build Command**: `prisma generate && prisma db push && next build`
4. **Install Command**: `pnpm install`
5. **Output Directory**: `.next` (leave as default)

### 3.3 Add Environment Variables

Add all the environment variables from `ENVIRONMENT_VARIABLES.md`:

```env
# Database
DATABASE_URL=your_postgresql_connection_string

# NextAuth
NEXTAUTH_SECRET=your_generated_secret
NEXTAUTH_URL=https://your-domain.vercel.app

# OAuth Providers
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GITHUB_ID=your_github_client_id
GITHUB_SECRET=your_github_client_secret

# UploadThing
UPLOADTHING_SECRET=your_uploadthing_secret
UPLOADTHING_APP_ID=your_uploadthing_app_id

# Stripe
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key

# Resend
RESEND_API_KEY=your_resend_api_key

# Inngest
INNGEST_EVENT_KEY=your_inngest_event_key
INNGEST_SIGNING_KEY=your_inngest_signing_key
```

### 3.4 Deploy

1. Click "Deploy"
2. Wait for the build to complete
3. Note your deployment URL

## Step 4: Post-Deployment Setup

### 4.1 Update OAuth Callback URLs

After deployment, update your OAuth provider callback URLs with your actual domain:

- Google: `https://your-domain.vercel.app/api/auth/callback/google`
- GitHub: `https://your-domain.vercel.app/api/auth/callback/github`

### 4.2 Set Up Stripe Webhook

1. Go to your Stripe Dashboard
2. Navigate to Webhooks
3. Add endpoint: `https://your-domain.vercel.app/api/webhook/stripe`
4. Select events: `checkout.session.completed`
5. Copy the webhook secret and update `STRIPE_WEBHOOK_SECRET`

### 4.3 Test Your Application

1. Visit your deployed URL
2. Test user registration/login
3. Test job posting functionality
4. Test file uploads
5. Test payment flow (use Stripe test cards)

## Step 5: Custom Domain (Optional)

1. In Vercel dashboard, go to your project settings
2. Navigate to "Domains"
3. Add your custom domain
4. Update DNS settings as instructed
5. Update `NEXTAUTH_URL` and OAuth callback URLs

## Troubleshooting

### Build Errors

- Check that all environment variables are set
- Ensure Prisma schema is valid
- Check for TypeScript errors

### Database Connection Issues

- Verify `DATABASE_URL` is correct
- Ensure database is accessible from Vercel
- Check if database requires SSL

### OAuth Issues

- Verify callback URLs are correct
- Check that OAuth credentials are valid
- Ensure `NEXTAUTH_URL` is set correctly

### File Upload Issues

- Verify UploadThing credentials
- Check that user is authenticated
- Ensure proper CORS settings

## Monitoring

1. **Vercel Analytics**: Enable in project settings
2. **Error Tracking**: Consider adding Sentry
3. **Database Monitoring**: Use your database provider's monitoring tools
4. **Stripe Dashboard**: Monitor payments and webhooks

## Security Checklist

- [ ] All environment variables are set
- [ ] OAuth callback URLs are secure
- [ ] Stripe webhook is properly configured
- [ ] Database connection uses SSL
- [ ] API keys are production keys (not test keys)
- [ ] Custom domain has SSL certificate
