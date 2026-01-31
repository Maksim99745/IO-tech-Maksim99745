# IO Tech Test Assignment

Next.js application with Strapi CMS for a law firm.

## 🚀 Quick Start (Automated Setup)

**One command to rule them all!** Just run:

```bash
# Linux/Mac
chmod +x setup.sh
./setup.sh

# OR using Node.js (works on all platforms)
node setup.js
```

This will automatically:
1. ✅ Install all dependencies (Frontend + Strapi)
2. ✅ Start Strapi server
3. ✅ Wait for Strapi to be ready
4. ✅ Start Next.js application
5. ✅ Open browser automatically

**Note:** Data should already be on your deployed server. If you need to seed data locally, run:
```bash
cd strapi-backend
node scripts/seed-data.js
```

**That's it!** No configuration needed. Everything is pre-configured.

### Access Points

- **Frontend:** http://localhost:3000
- **Strapi Admin:** http://localhost:1337/admin

### Stopping Servers

Press `Ctrl+C` in the terminal to stop all servers.

---

## 📋 Manual Setup (if needed)

If you prefer manual setup:

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

**No environment variables needed!** 

All API tokens and configuration are pre-configured in the code:
- Strapi API token: `lib/constants.ts`
- Seed script token: `strapi-backend/scripts/seed-data.js`

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

- The project uses SQLite database (no external database setup needed)
- All data is automatically seeded on first run
- API tokens are embedded in the code for easy setup
- No login required - everything works out of the box

## 🚀 Deployment

For deployment instructions, see [DEPLOY.md](./DEPLOY.md)

Quick deployment:
- **Next.js** → Vercel
- **Strapi** → Railway / Render
- **Auto-deploy** → GitHub Actions
