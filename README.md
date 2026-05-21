# TrailTales
https://trailtales-sandy.vercel.app/
A warm, editorial travel-journal platform. Next.js 14 (App Router) + TypeScript + Tailwind + Prisma (Postgres/Supabase) + NextAuth.js + Cloudinary.

## v1 scope shipped
- Email/password + Google OAuth (NextAuth.js)
- Multi-step trip creation form (6 steps: Basics → Transport → Stays → Cafes → Photos → Review)
- Feed with search, region/group/transport filters, skeletons, warm empty state
- Single post page with gallery + author panel
- Cloudinary photo uploads (up to 10 per post)
- Zod validation everywhere; React Hook Form; sonner toasts
- Mobile responsive, editorial design system (Playfair Display + DM Sans)

## Stack
- Next.js 14 (App Router)
- TypeScript (strict)
- Tailwind CSS (custom warm palette)
- Prisma + PostgreSQL (Supabase-compatible)
- NextAuth.js (Google + Credentials, JWT sessions, Prisma adapter)
- Cloudinary for image storage
- SWR for client data fetching

## Setup

```bash
# 1. install
npm install

# 2. env
cp .env.example .env
# fill in DATABASE_URL, NEXTAUTH_SECRET, GOOGLE_CLIENT_ID/SECRET, CLOUDINARY_*
# generate a secret with: openssl rand -base64 32

# 3. database
npx prisma migrate dev --name init
# (or `npx prisma db push` for a quick first push)

# 4. dev
npm run dev
```

Open http://localhost:3000.

## Environment variables

| Key | Notes |
|---|---|
| `DATABASE_URL` | Postgres URL. For Supabase, use the connection string from Project Settings → Database. |
| `NEXTAUTH_URL` | `http://localhost:3000` locally, full URL in prod |
| `NEXTAUTH_SECRET` | `openssl rand -base64 32` |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Google Cloud Console → OAuth 2.0 client. Authorized redirect URI: `${NEXTAUTH_URL}/api/auth/callback/google` |
| `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` | Cloudinary dashboard |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Same value as above (exposed to client) |





## Folder structure
```
app/
  (auth)/login | register
  api/auth/[...nextauth] | posts | posts/[id] | upload | register
  feed | create | post/[id]
components/  PostCard, Navbar, Footer, Providers
lib/         prisma, auth, cloudinary, utils, validations
prisma/      schema.prisma
```
