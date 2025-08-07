#!/bin/bash

# Worka Vercel Deployment Script
echo "🚀 Starting Worka deployment to Vercel..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI is not installed. Please install it first:"
    echo "npm i -g vercel"
    exit 1
fi

# Check if all required files exist
echo "📁 Checking required files..."
required_files=("package.json" "next.config.ts" "prisma/schema.prisma" "vercel.json")
for file in "${required_files[@]}"; do
    if [ ! -f "$file" ]; then
        echo "❌ Missing required file: $file"
        exit 1
    fi
done

echo "✅ All required files found"

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "⚠️  Warning: .env.local not found"
    echo "Please create .env.local with your environment variables before deploying"
    echo "See ENVIRONMENT_VARIABLES.md for required variables"
fi

# Check if git repository is clean
if [ -n "$(git status --porcelain)" ]; then
    echo "⚠️  Warning: You have uncommitted changes"
    echo "Please commit your changes before deploying"
    read -p "Continue anyway? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Deploy to Vercel
echo "🚀 Deploying to Vercel..."
vercel --prod

echo "✅ Deployment complete!"
echo ""
echo "📋 Next steps:"
echo "1. Set up your environment variables in Vercel dashboard"
echo "2. Configure your OAuth providers with the new callback URLs"
echo "3. Set up Stripe webhook endpoint"
echo "4. Test your application"
echo ""
echo "📚 See DEPLOYMENT_GUIDE.md for detailed instructions" 