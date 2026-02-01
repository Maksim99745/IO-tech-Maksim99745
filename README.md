# IO Tech Test Assignment

Next.js application with Strapi CMS for a law firm.

## 🚀 Live Deployment

**Production URLs:**
- **Frontend (Next.js):** https://io-tech-maksim99745-1.onrender.com
- **Strapi Admin:** https://io-tech-maksim99745.onrender.com/admin
- **Strapi API:** https://io-tech-maksim99745.onrender.com/api

## 📋 Local Development Setup

### 1. Install Frontend Dependencies

```bash
npm install
```

### 2. Install and Start Strapi

```bash
cd strapi-backend
npm install
npm run develop
```

Strapi will be available at [http://localhost:1337](http://localhost:1337)

### 3. Seed Database (Optional)

The seed script automatically uploads images and creates all content:

```bash
cd strapi-backend
node scripts/seed-data.js
```

**Image Upload:**
- The script automatically uploads images from `public/assets/` to Strapi Media Library
- Images are automatically assigned to team members, clients, and hero pages
- You can add more images to `public/assets/` and update the `imagesToUpload` array in `seed-data.js`
- Images can also be URLs (the script will download them automatically)

### 4. Start Next.js

```bash
cd ..
npm run dev
```

Application will be available at [http://localhost:3000](http://localhost:3000)

## 🔑 Configuration

**No environment variables needed for local development!** 

All API tokens and configuration are pre-configured in the code:
- Strapi API token: `lib/constants.ts`
- Seed script token: `strapi-backend/scripts/seed-data.js`

For production deployment, set environment variables:
- `NEXT_PUBLIC_STRAPI_URL` - Strapi base URL
- `NEXT_PUBLIC_STRAPI_TOKEN` - Strapi API token

## 📦 Requirements

- Node.js 20+ 
- npm 6+

## 🛠️ Technologies

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Redux Toolkit
- Strapi CMS
- i18next (AR/EN)

## 🗄️ Database Configuration

### Local Development
- Uses SQLite (no setup needed)
- Database file: `strapi-backend/.tmp/data.db`

### Production (Render)
**⚠️ IMPORTANT: Use PostgreSQL to persist data!**

SQLite on Render's free tier uses ephemeral storage - **all data is lost when the server sleeps** (after 15 minutes of inactivity).

#### Setup PostgreSQL on Render:

1. **Create PostgreSQL Database:**
   - Go to Render Dashboard → New → PostgreSQL
   - Name: `strapi-base` (or any name)
   - Plan: Free
   - Region: Same as your Strapi service
   - Click "Create Database"

2. **Configure Strapi Service Environment Variables:**
   - Go to your Strapi service → Environment
   - Add these variables (example values from your PostgreSQL):
     ```
     DATABASE_CLIENT=postgres
     DATABASE_HOST=dpg-d5vbf7ili9vc73a4dck0-a
     DATABASE_PORT=5432
     DATABASE_NAME=pgstarapi
     DATABASE_USERNAME=pgstarapi_user
     DATABASE_PASSWORD=ETpYRF4HCsvhwzN4FqeLrkPT7mFIwPcm
     DATABASE_SSL=true
     ```
   - Copy actual values from your PostgreSQL service → "Connections" section
   - Use "Hostname" (internal) for `DATABASE_HOST` (not the external URL)

3. **Redeploy Strapi:**
   - After setting variables, redeploy the service
   - Strapi will automatically migrate to PostgreSQL
   - Your data will persist even when the server sleeps!

## 📝 Notes

- For local development, SQLite is used automatically
- For production, PostgreSQL is required to prevent data loss
- API tokens are embedded in the code for easy local setup

## ✅ Production Environment Variables

### Strapi Backend (Render)
All required environment variables are configured:
- PostgreSQL database connection
- Strapi secrets (APP_KEYS, JWT_SECRET, etc.)
- Server configuration (HOST, PORT)

### Frontend (Render)
- `NEXT_PUBLIC_STRAPI_URL` - Strapi API URL
- `NEXT_PUBLIC_STRAPI_TOKEN` - Strapi API token
- `PORT` - Server port (3000)

## 🎯 Next Steps

After deployment:
1. Wait for both services to start
2. Run the seed script to populate data:
   ```bash
   cd strapi-backend
   STRAPI_URL=https://io-tech-maksim99745.onrender.com node scripts/seed-data.js
   ```
3. Your data will persist in PostgreSQL even when servers sleep!
