# Deployment Setup Checklist

## Pre-Deployment Setup

### ✅ Repository Preparation

- [ ] Code is committed and pushed to GitHub
- [ ] All required files are present (`vercel.json`, `package.json`, etc.)
- [ ] No sensitive data in repository

### ✅ Service Accounts Setup

- [ ] **Database**: PostgreSQL provider account (Vercel Postgres, Neon, etc.)
- [ ] **Google OAuth**: Google Cloud Console project with OAuth credentials
- [ ] **GitHub OAuth**: GitHub OAuth App created
- [ ] **UploadThing**: Project created with API credentials
- [ ] **Stripe**: Account created with API keys
- [ ] **Resend**: Account created with API key
- [ ] **Inngest**: Project created with event keys

### ✅ Environment Variables

- [ ] `DATABASE_URL` - PostgreSQL connection string
- [ ] `NEXTAUTH_SECRET` - Generated secure random string
- [ ] `NEXTAUTH_URL` - Will be set to production URL after deployment
- [ ] `GOOGLE_CLIENT_ID` - From Google Cloud Console
- [ ] `GOOGLE_CLIENT_SECRET` - From Google Cloud Console
- [ ] `GITHUB_ID` - From GitHub OAuth App
- [ ] `GITHUB_SECRET` - From GitHub OAuth App
- [ ] `UPLOADTHING_SECRET` - From UploadThing dashboard
- [ ] `UPLOADTHING_APP_ID` - From UploadThing dashboard
- [ ] `STRIPE_SECRET_KEY` - From Stripe dashboard
- [ ] `STRIPE_WEBHOOK_SECRET` - Will be set after webhook setup
- [ ] `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - From Stripe dashboard
- [ ] `RESEND_API_KEY` - From Resend dashboard
- [ ] `INNGEST_EVENT_KEY` - From Inngest dashboard
- [ ] `INNGEST_SIGNING_KEY` - From Inngest dashboard

## Deployment Steps

### ✅ Vercel Deployment

- [ ] Connect GitHub repository to Vercel
- [ ] Configure build settings:
  - Framework: Next.js
  - Build Command: `prisma generate && prisma db push && next build`
  - Install Command: `pnpm install`
- [ ] Add all environment variables in Vercel dashboard
- [ ] Deploy project
- [ ] Note the deployment URL

### ✅ Post-Deployment Configuration

- [ ] Update `NEXTAUTH_URL` with production URL
- [ ] Update OAuth callback URLs in provider dashboards:
  - Google: `https://your-domain.vercel.app/api/auth/callback/google`
  - GitHub: `https://your-domain.vercel.app/api/auth/callback/github`
- [ ] Set up Stripe webhook endpoint: `https://your-domain.vercel.app/api/webhook/stripe`
- [ ] Update `STRIPE_WEBHOOK_SECRET` with webhook secret
- [ ] Test all functionality:
  - [ ] User registration/login
  - [ ] Job posting
  - [ ] File uploads
  - [ ] Payment flow
  - [ ] Email notifications

### ✅ Optional Enhancements

- [ ] Set up custom domain
- [ ] Configure SSL certificate
- [ ] Set up monitoring and analytics
- [ ] Configure error tracking (Sentry, etc.)
- [ ] Set up database backups
- [ ] Configure CDN for static assets

## Troubleshooting Checklist

### Build Issues

- [ ] All environment variables are set correctly
- [ ] Prisma schema is valid
- [ ] No TypeScript errors
- [ ] All dependencies are properly installed

### Runtime Issues

- [ ] Database connection is working
- [ ] OAuth providers are configured correctly
- [ ] API keys are valid and have proper permissions
- [ ] Webhook endpoints are accessible

### Performance Issues

- [ ] Database queries are optimized
- [ ] Images are properly optimized
- [ ] Static assets are cached
- [ ] API routes have proper timeout settings

## Security Checklist

- [ ] All API keys are production keys (not test keys)
- [ ] Environment variables are properly secured
- [ ] OAuth callback URLs are restricted to your domain
- [ ] Database connection uses SSL
- [ ] Webhook signatures are verified
- [ ] User authentication is working properly
- [ ] File uploads are properly validated
- [ ] Payment processing is secure

## Monitoring Setup

- [ ] Vercel Analytics enabled
- [ ] Database monitoring configured
- [ ] Stripe webhook monitoring
- [ ] Error tracking setup
- [ ] Performance monitoring
- [ ] Uptime monitoring

---

**Note**: Check off each item as you complete it. If you encounter issues, refer to the detailed guides in `DEPLOYMENT_GUIDE.md` and `ENVIRONMENT_VARIABLES.md`.
