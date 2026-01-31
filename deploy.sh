#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  IO Tech - Deployment Guide${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

echo -e "${YELLOW}📋 Deployment Checklist:${NC}"
echo ""
echo -e "${GREEN}1. Strapi CMS Deployment:${NC}"
echo "   - Railway: https://railway.app"
echo "   - Render: https://render.com"
echo "   - Or VPS (DigitalOcean, AWS, etc.)"
echo ""
echo -e "${GREEN}2. Next.js Frontend Deployment:${NC}"
echo "   - Vercel: https://vercel.com"
echo ""
echo -e "${GREEN}3. Configuration:${NC}"
echo "   - Set NEXT_PUBLIC_STRAPI_URL in Vercel"
echo "   - Set NEXT_PUBLIC_STRAPI_TOKEN in Vercel"
echo "   - Configure CORS in Strapi"
echo ""
echo -e "${YELLOW}📖 For detailed instructions, see: DEPLOY.md${NC}"
echo ""
echo -e "${BLUE}Quick Commands:${NC}"
echo ""
echo -e "${GREEN}Deploy to Vercel (if Vercel CLI installed):${NC}"
echo "  vercel --prod"
echo ""
echo -e "${GREEN}Deploy Strapi to Railway:${NC}"
echo "  1. Go to railway.app"
echo "  2. New Project → Deploy from GitHub"
echo "  3. Select repo → Set root: strapi-backend"
echo ""
echo -e "${GREEN}Setup GitHub Actions (automatic deploy):${NC}"
echo "  1. Add secrets in GitHub repo settings"
echo "  2. Push to main branch"
echo "  3. Actions will auto-deploy"
echo ""
