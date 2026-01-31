# IO Tech Test Assignment

Next.js application with Strapi CMS for a law firm.

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Create `.env.local` file in the project root:

```env
NEXT_PUBLIC_STRAPI_URL=https://your-strapi-server.com
NEXT_PUBLIC_STRAPI_TOKEN=6a4bbe922194d7e111e279a79f33937f2dd87009c777eb9418a7d10a84568173b56db9b3af19f147f6579dacd4fdf23ee7bd1ac11c884985e2c951c4042d28bd32f9994d1f38dc892627e238cc322ab31e3ebc28ab22f63156d97d8b86ea467d10df91aa6d95c8d49a1dfd6179ebabcb59589dc25e3cc6d635be97e38bef7327
```

**Note:** Replace `https://your-strapi-server.com` with the actual Strapi server URL after deployment.

### 3. Start Next.js

```bash
npm run dev
```

Application will be available at [http://localhost:3000](http://localhost:3000)

The application will connect to the remote Strapi server with all the data pre-configured.

## Deploying Strapi

To make Strapi accessible for reviewers, you need to deploy it. Options:

1. **Railway** (easiest): https://railway.app
   - Connect your GitHub repo
   - Deploy `strapi-backend` folder
   - Get the public URL

2. **Render**: https://render.com
   - Create new Web Service
   - Point to `strapi-backend` folder
   - Set build command: `npm install && npm run build`
   - Set start command: `npm start`

3. **Heroku**: https://heroku.com
   - Create new app
   - Deploy `strapi-backend` folder

After deployment, update `NEXT_PUBLIC_STRAPI_URL` in `.env.local` with your Strapi server URL.

## Technologies

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Redux Toolkit
- Strapi CMS
- i18next (AR/EN)

## Project Structure

```
├── app/              # Next.js pages
├── components/       # React components
├── lib/             # API and utilities
└── public/          # Static files
```
