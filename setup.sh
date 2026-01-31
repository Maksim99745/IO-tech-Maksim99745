#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  IO Tech - Automated Setup Script${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed. Please install Node.js 20+ first.${NC}"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 20 ]; then
    echo -e "${RED}❌ Node.js version 20+ is required. Current version: $(node -v)${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Node.js $(node -v) detected${NC}"
echo ""

# Step 1: Install Frontend dependencies
echo -e "${YELLOW}📦 Step 1/5: Installing Frontend dependencies...${NC}"
if [ ! -d "node_modules" ]; then
    npm install
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Failed to install frontend dependencies${NC}"
        exit 1
    fi
    echo -e "${GREEN}✅ Frontend dependencies installed${NC}"
else
    echo -e "${GREEN}✅ Frontend dependencies already installed${NC}"
fi
echo ""

# Step 2: Install Strapi dependencies
echo -e "${YELLOW}📦 Step 2/5: Installing Strapi dependencies...${NC}"
cd strapi-backend
if [ ! -d "node_modules" ]; then
    npm install
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Failed to install Strapi dependencies${NC}"
        exit 1
    fi
    echo -e "${GREEN}✅ Strapi dependencies installed${NC}"
else
    echo -e "${GREEN}✅ Strapi dependencies already installed${NC}"
fi
cd ..
echo ""

# Step 3: Start Strapi in background
echo -e "${YELLOW}🚀 Step 3/5: Starting Strapi server...${NC}"
cd strapi-backend

# Kill any existing Strapi process
pkill -f "strapi develop" 2>/dev/null || true
sleep 2

# Start Strapi in background
npm run develop > ../strapi.log 2>&1 &
STRAPI_PID=$!
echo $STRAPI_PID > ../strapi.pid

cd ..

# Wait for Strapi to be ready
echo -e "${YELLOW}⏳ Waiting for Strapi to start (this may take 30-60 seconds)...${NC}"
STRAPI_READY=false
for i in {1..60}; do
    if curl -s http://localhost:1337/admin > /dev/null 2>&1; then
        STRAPI_READY=true
        break
    fi
    echo -n "."
    sleep 1
done
echo ""

if [ "$STRAPI_READY" = false ]; then
    echo -e "${RED}❌ Strapi failed to start. Check strapi.log for details.${NC}"
    kill $STRAPI_PID 2>/dev/null || true
    exit 1
fi

echo -e "${GREEN}✅ Strapi is running on http://localhost:1337${NC}"
echo ""

# Step 4: Start Next.js
echo -e "${YELLOW}🚀 Step 4/4: Starting Next.js application...${NC}"
echo -e "${YELLOW}💡 Note: If you need to seed data, run: cd strapi-backend && node scripts/seed-data.js${NC}"
echo ""
echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  Setup Complete!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "${BLUE}📱 Frontend:${NC} http://localhost:3000"
echo -e "${BLUE}🔧 Strapi Admin:${NC} http://localhost:1337/admin"
echo ""
echo -e "${YELLOW}Starting Next.js server...${NC}"
echo -e "${YELLOW}Press Ctrl+C to stop all servers${NC}"
echo ""

# Open browser after a delay
(sleep 3 && (
    if command -v xdg-open &> /dev/null; then
        xdg-open http://localhost:3000 2>/dev/null
    elif command -v open &> /dev/null; then
        open http://localhost:3000 2>/dev/null
    elif command -v start &> /dev/null; then
        start http://localhost:3000 2>/dev/null
    fi
)) &

# Start Next.js (this will block)
npm run dev

# Cleanup on exit
trap "echo ''; echo -e '${YELLOW}Stopping servers...${NC}'; kill \$(cat strapi.pid 2>/dev/null) 2>/dev/null || true; rm -f strapi.pid; exit" INT TERM
