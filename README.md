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

```bash
cd strapi-backend
node scripts/seed-data.js
```

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

## 📝 Notes

- **Local development:** Uses SQLite database (no external database setup needed)
- **Production:** Uses PostgreSQL database on Render
- All data is automatically seeded on first run
- API tokens are embedded in the code for easy setup
- No login required - everything works out of the box
