# Worka - Job Board Platform

A modern job board platform built with Next.js, featuring user authentication, job posting, file uploads, payments, and more.

## Features

- 🔐 **Authentication**: NextAuth with Google and GitHub OAuth
- 💼 **Job Management**: Post, edit, and manage job listings
- 📁 **File Uploads**: Upload company logos and documents with UploadThing
- 💳 **Payments**: Stripe integration for job posting payments
- 📧 **Email**: Resend integration for email notifications
- ⚡ **Background Jobs**: Inngest for job processing
- 🎨 **Modern UI**: Tailwind CSS with shadcn/ui components
- 🗄️ **Database**: PostgreSQL with Prisma ORM

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: NextAuth.js
- **File Upload**: UploadThing
- **Payments**: Stripe
- **Email**: Resend
- **Background Jobs**: Inngest
- **Package Manager**: pnpm

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm
- PostgreSQL database
- Accounts for required services (see deployment guide)

### Installation

1. Clone the repository:

```bash
git clone <your-repo-url>
cd worka
```

2. Install dependencies:

```bash
pnpm install
```

3. Set up environment variables:

```bash
cp .env.example .env.local
```

4. Configure your environment variables (see `ENVIRONMENT_VARIABLES.md`)

5. Set up the database:

```bash
pnpm prisma generate
pnpm prisma db push
```

6. Run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Deployment

### Quick Deploy to Vercel

1. **Prerequisites**: Set up all required services (see `DEPLOYMENT_GUIDE.md`)
2. **Deploy**: Run the deployment script:

```bash
chmod +x scripts/deploy.sh
./scripts/deploy.sh
```

### Manual Deployment

For detailed deployment instructions, see:

- [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) - Complete deployment guide
- [ENVIRONMENT_VARIABLES.md](./ENVIRONMENT_VARIABLES.md) - Environment variables reference

## Project Structure

```
worka/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── (mainLayout)/    # Main layout routes
│   │   ├── api/            # API routes
│   │   └── ...
│   ├── components/         # React components
│   │   ├── forms/          # Form components
│   │   ├── general/        # General components
│   │   ├── ui/             # shadcn/ui components
│   │   └── ...
│   ├── utils/              # Utility functions
│   └── ...
├── prisma/                 # Database schema
├── public/                 # Static assets
└── ...
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
