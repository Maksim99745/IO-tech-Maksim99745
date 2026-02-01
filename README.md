# IO Tech Test Assignment

Next.js application with Strapi CMS for a law firm.

## 🚀 Live Deployment

**Production URLs:**
- **Frontend (Next.js):** https://io-tech-maksim99745-1.onrender.com
- **Strapi Admin:** https://io-tech-maksim99745.onrender.com/admin
- **Strapi API:** https://io-tech-maksim99745.onrender.com/api

> ⚠️ **Important Note:** This project is deployed on a free hosting plan. After 10-15 minutes of inactivity, the server goes to sleep. When you first access the application, it may take a few minutes for the server to wake up and start responding. This is normal behavior for free hosting tiers. Please be patient during the initial load.

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

### 4. Start Next.js

```bash
cd ..
npm run dev
```

Application will be available at [http://localhost:3000](http://localhost:3000)

## 🛠️ Technologies

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Redux Toolkit
- Strapi CMS
- i18next (AR/EN)
- PostgreSQL

