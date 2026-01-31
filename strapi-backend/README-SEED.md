# Seed Data Script

## Quick Start

1. Make sure Strapi is running on `http://localhost:1337`
2. Run the script:

```bash
cd strapi-backend
node scripts/seed-data.js
```

## Smart Seeding

**The script automatically checks if data already exists!**

- ✅ If database is empty → seeds all data
- ⏭️ If data already exists → skips seeding (no duplicates)
- 🔄 Removes duplicates if found (keeps only unique entries)

## What gets created (only if database is empty)

### Services
- 17 services in English and Arabic
- Each service has slug, title, description

### Team Members
- 5 team members in English
- 5 team members in Arabic
- Total: 10 entries (with images assigned)

### Clients
- 5 clients in English
- 5 clients in Arabic
- Total: 10 entries

### Hero Pages
- 5 hero pages in English
- 5 hero pages in Arabic
- Total: 10 entries

## Force Re-seed

If you want to re-seed data (for example, after clearing database):

1. Delete entries from Strapi Admin panel, OR
2. Delete database file: `strapi-backend/.tmp/data.db` (SQLite)
3. Run seed script again

## Alternative method (via admin panel)

You can also add data manually:

1. Open http://localhost:1337/admin
2. Go to Content Manager
3. Select the collection (Services, Team Members, Clients, Pages)
4. Click "Create new entry"
5. Fill in the fields and save

## Notes

- API token is pre-configured in the script
- Script automatically detects and removes duplicates
- Safe to run multiple times - won't create duplicates
