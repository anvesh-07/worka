# Environment Variables for Vercel Deployment

## Required Environment Variables

### Database

```env
DATABASE_URL=your_postgresql_database_url
```

### Authentication (NextAuth)

```env
NEXTAUTH_SECRET=your_nextauth_secret_key
NEXTAUTH_URL=https://your-domain.vercel.app
```

### OAuth Providers

```env
# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# GitHub OAuth
GITHUB_ID=your_github_client_id
GITHUB_SECRET=your_github_client_secret
```

### File Upload (UploadThing)

```env
UPLOADTHING_SECRET=your_uploadthing_secret
UPLOADTHING_APP_ID=your_uploadthing_app_id
```

### Payments (Stripe)

```env
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

### Email (Resend)

```env
RESEND_API_KEY=your_resend_api_key
```

### Background Jobs (Inngest)

```env
INNGEST_EVENT_KEY=your_inngest_event_key
INNGEST_SIGNING_KEY=your_inngest_signing_key
```

## How to Get These Credentials

### 1. Database (PostgreSQL)

- Use [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres) (recommended)
- Or [Neon](https://neon.tech), [Supabase](https://supabase.com), or any PostgreSQL provider

### 2. NextAuth Secret

Generate a secure random string:

```bash
openssl rand -base64 32
```

### 3. OAuth Providers

- **Google**: [Google Cloud Console](https://console.cloud.google.com/)
- **GitHub**: [GitHub Developer Settings](https://github.com/settings/developers)

### 4. UploadThing

- Go to [uploadthing.com](https://uploadthing.com)
- Create a new project
- Copy credentials from dashboard

### 5. Stripe

- Go to [stripe.com](https://stripe.com)
- Create an account and get API keys
- Set up webhook endpoint: `https://your-domain.vercel.app/api/webhook/stripe`

### 6. Resend

- Go to [resend.com](https://resend.com)
- Create an account and get API key

### 7. Inngest

- Go to [inngest.com](https://inngest.com)
- Create a new project
- Copy event key and signing key

## Vercel Deployment Steps

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add all environment variables in Vercel dashboard
4. Deploy!

## Important Notes

- Set `NEXTAUTH_URL` to your production domain after deployment
- Update OAuth callback URLs in provider dashboards
- Set up Stripe webhook endpoint after deployment
- Ensure all API keys are production keys (not test keys)
