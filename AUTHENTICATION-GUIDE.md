# Authentication & User Management Guide

## Overview

Squants now features a complete authentication and user management system with the following capabilities:

### ✅ Features Implemented

1. **Multi-Method Authentication**
   - Regular email/password registration with email verification
   - Google OAuth integration
   - Microsoft/Azure AD OAuth integration

2. **User Profiles**
   - Profile photo upload/edit/remove
   - Bio/status display (max 200 characters)
   - User search functionality
   - Public profile viewing

3. **User Interface**
   - Grand cosmos-themed login page with dark blue-to-purple gradient
   - User profile icon in navigation banner
   - User menu dropdown
   - Profile editing page
   - User search page
   - Dashboard for authenticated users

---

## Setup Instructions

### 1. Environment Variables

Create or update `.env.local` with the following:

```bash
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-generated-secret-key

# Database
DATABASE_URL=file:./dev.db

# Email Configuration (for email verification)
EMAIL_USER=mcsurendar2explore@gmail.com
EMAIL_PASSWORD=your-app-specific-password

# Google OAuth (from Google Cloud Console)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Microsoft Azure AD OAuth (from Azure Portal)
AZURE_AD_CLIENT_ID=your-azure-client-id
AZURE_AD_CLIENT_SECRET=your-azure-client-secret
AZURE_AD_TENANT_ID=common
```

### 2. Generate NextAuth Secret

```bash
openssl rand -base64 32
```

Copy the output and set it as `NEXTAUTH_SECRET` in `.env.local`

### 3. Set Up Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable Google+ API
4. Go to Credentials → Create OAuth 2.0 Client ID
5. Set Authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (development)
   - `https://yourdomain.com/api/auth/callback/google` (production)
6. Copy Client ID and Client Secret to `.env.local`

### 4. Set Up Microsoft Azure AD OAuth

1. Go to [Azure Portal](https://portal.azure.com/)
2. Create a new app registration
3. Add a client secret
4. Configure redirect URIs:
   - `http://localhost:3000/api/auth/callback/azure-ad` (development)
   - `https://yourdomain.com/api/auth/callback/azure-ad` (production)
5. Copy values to `.env.local`

### 5. Set Up Email Verification

For Gmail:
1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password: https://myaccount.google.com/apppasswords
3. Use this as `EMAIL_PASSWORD` in `.env.local`

Alternative email providers:
```bash
# Outlook/Office 365
EMAIL_USER=your-email@outlook.com
EMAIL_PASSWORD=your-password

# Custom SMTP
SMTP_HOST=smtp.yourserver.com
SMTP_PORT=587
```

### 6. Database Setup

The app uses SQLite by default. To initialize:

```bash
npm run prisma:migrate
```

---

## User Flows

### Regular Registration

1. User visits `/login`
2. Clicks "Sign Up"
3. Enters: First Name, Last Name, Username, Email, Password, Confirm Password
4. Verification email sent to user
5. User clicks link in email to verify
6. Can now log in with email/password

### Google Login

1. User clicks "Continue with Google"
2. Redirected to Google auth
3. After approval, user profile created/linked
4. Redirected to dashboard

### Microsoft Login

1. User clicks "Continue with Microsoft"
2. Redirected to Azure AD auth
3. After approval, user profile created/linked
4. Redirected to dashboard

### Profile Management

1. Logged-in users click their avatar in the header
2. Select "View Profile"
3. Click "Edit Profile" to update:
   - First Name, Last Name
   - Bio/Status (max 200 chars)
   - Profile Photo (upload/remove)
4. Changes saved immediately

### User Search

1. Navigate to `/search`
2. Search by:
   - First Name
   - Last Name
   - Username
   - Email
3. Click on user to view their public profile

---

## API Routes

### Authentication
- `POST /api/auth/signin` - Sign in
- `POST /api/auth/signup` - Sign up
- `POST /api/auth/signout` - Sign out
- `GET /api/auth/session` - Get current session
- `GET /api/verify-email` - Verify email token

### User Profiles
- `GET /api/user/profile` - Get current user profile
- `PUT /api/user/profile` - Update current user profile
- `GET /api/user/[id]` - Get public user profile
- `GET /api/user/search?q=query` - Search users

---

## Database Schema

### User Model

```prisma
model User {
  id                 String    @id @default(cuid())
  email              String    @unique
  username           String    @unique
  password           String?   // null for OAuth users
  firstName          String?
  lastName           String?
  profilePhoto       String?   // URL to profile photo
  bio                String?   // Short description/status
  emailVerified      Boolean   @default(false)
  emailVerificationToken String? @unique
  emailVerificationExpires DateTime?
  authProvider       String    @default("email") // "email", "google", "microsoft"
  googleId           String?   @unique
  microsoftId        String?   @unique
  createdAt          DateTime  @default(now())
  updatedAt          DateTime  @updatedAt
  papers             Paper[]
  explanations       Explanation[]
  comments           Comment[]
  sessions           Session[]
}
```

---

## Frontend Pages

### `/login`
- Grand cosmos-themed login page
- Email/password form with validation
- OAuth buttons (Google, Microsoft)
- Toggle between login/signup modes
- Email verification confirmation message

### `/dashboard`
- Personalized dashboard for authenticated users
- Quick links to all major features
- User profile stats preview

### `/profile`
- Current user's profile with edit capabilities
- Profile photo with upload/remove options
- Bio/status editor (200 char limit)
- Activity statistics
- Sign out button

### `/search`
- User search interface
- Real-time search results
- Click to view user profiles
- Shows username, bio, verification status

### `/users/[id]`
- Public user profile page
- Display user info (name, username, bio, photo)
- Show contribution stats
- Verification badge

---

## Security Features

✅ **Password Security**
- Passwords hashed with bcryptjs (10 rounds)
- Minimum validation on frontend
- HTTPS only in production (auto on Vercel)

✅ **Email Verification**
- One-time tokens with 24-hour expiry
- Prevents unauthorized account creation
- Links sent via enterprise email

✅ **Session Management**
- JWT-based sessions with 30-day expiry
- Secure HTTP-only cookies (production)
- CSRF protection via NextAuth

✅ **OAuth Security**
- No password storage for OAuth users
- Account linking with `allowDangerousEmailAccountLinking`
- Provider-specific ID tracking

✅ **Data Privacy**
- User data encrypted at rest (SQLite)
- Profile photos stored securely
- PII protected with proper access controls

---

## Testing

Run tests:
```bash
npm test
```

Test suites include:
- Login page rendering
- OAuth button integration
- Sign up/login form validation
- Profile management flow

---

## Deployment

### Vercel Deployment

1. Set environment variables in Vercel dashboard:
   - `NEXTAUTH_URL=https://yourdomain.com`
   - `NEXTAUTH_SECRET=your-secret`
   - OAuth credentials
   - Email configuration

2. Auto-deploys with `git push origin main`

### Environment-Specific URLs

```bash
# Development
NEXTAUTH_URL=http://localhost:3000

# Production
NEXTAUTH_URL=https://squants.com

# OAuth Callbacks
# Development: http://localhost:3000/api/auth/callback/[provider]
# Production: https://squants.com/api/auth/callback/[provider]
```

---

## Troubleshooting

### Email Verification Not Sending

**Issue**: Verification emails not received
**Solution**:
- Check `EMAIL_USER` and `EMAIL_PASSWORD` in `.env.local`
- For Gmail, verify app-specific password is used
- Check spam folder
- Verify email service credentials

### OAuth Login Failing

**Issue**: "Invalid credentials" or "Authorization failed"
**Solution**:
- Verify Client ID and Secret in `.env.local`
- Check OAuth redirect URIs match exactly
- Ensure NEXTAUTH_URL matches deployment URL
- Check browser console for specific errors

### Profile Photo Not Uploading

**Issue**: Photo upload fails silently
**Solution**:
- Check file size (recommend < 5MB)
- Verify CORS settings if using external storage
- Check browser console for errors
- Ensure database write permissions

### Session Not Persisting

**Issue**: User logged out after page refresh
**Solution**:
- Verify `NEXTAUTH_SECRET` is set correctly
- Check cookies are not being blocked
- Clear browser cache and cookies
- Verify database connection

---

## Future Enhancements

- [ ] Two-factor authentication (2FA)
- [ ] Social media linking (Twitter, GitHub)
- [ ] Role-based access control (RBAC)
- [ ] User notifications and follow system
- [ ] Advanced profile analytics
- [ ] Password reset functionality
- [ ] Account deletion option
- [ ] Privacy settings and visibility controls

---

## Support

For issues or questions:
1. Check this guide first
2. Review test files for examples
3. Check NextAuth documentation: https://next-auth.js.org
4. Open an issue on GitHub

---

Generated: December 7, 2025
Last Updated: Complete auth system implementation
