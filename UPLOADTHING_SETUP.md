# UploadThing Setup Guide

## Required Environment Variables

To fix the logo upload issues, you need to set up the following environment variables in your `.env.local` file:

```env
# UploadThing Configuration
UPLOADTHING_SECRET=your_uploadthing_secret_here
UPLOADTHING_APP_ID=your_uploadthing_app_id_here

# NextAuth Configuration (if not already set)
NEXTAUTH_SECRET=your_nextauth_secret_here
NEXTAUTH_URL=http://localhost:3000

# Database Configuration (if not already set)
DATABASE_URL=your_database_url_here
```

## How to Get UploadThing Credentials

1. Go to [uploadthing.com](https://uploadthing.com)
2. Sign up or log in to your account
3. Create a new project
4. Copy the `UPLOADTHING_SECRET` and `UPLOADTHING_APP_ID` from your project dashboard
5. Add them to your `.env.local` file

## Troubleshooting

### If you see "Please upload a logo" error:

- Check that the environment variables are properly set
- Check the browser console for any upload errors
- Verify that the user is authenticated (logged in)

### If image preview is not showing:

- Check that the image URL is being returned correctly from UploadThing
- Verify that the Next.js image configuration includes `utfs.io` domain
- Check browser console for any image loading errors

### Debug Information

The form now includes debug information that shows:

- Current logo URL state
- Form logo value
- Upload status

This will help identify where the issue is occurring.

## Testing the Upload

1. Make sure you're logged in
2. Go to the onboarding page
3. Select "Company" as user type
4. Try uploading an image
5. Check the debug information below the upload area
6. Check the browser console for any error messages
