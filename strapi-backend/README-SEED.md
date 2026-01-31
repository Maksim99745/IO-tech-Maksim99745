# Seed Data Script

## Quick Start

1. Make sure Strapi is running on `http://localhost:1337`
2. Run the script:

```bash
cd strapi-backend
node scripts/seed-data.js
```

## What gets created

### Services
- 17 services in English and Arabic
- Each service has slug, title, description

### Team Members
- 6 team members in English
- 6 team members in Arabic
- Total: 12 entries

### Clients
- 5 clients in English
- 5 clients in Arabic
- Total: 10 entries

## Alternative method (via admin panel)

If the script doesn't work, you can add data manually:

1. Open http://localhost:1337/admin
2. Go to Content Manager
3. Select the collection (Services, Team Members, Clients)
4. Click "Create new entry"
5. Fill in the fields and save

## Notes

- If the API token has changed, update it in the script or use the `STRAPI_API_TOKEN` environment variable
- For localized entries, you may need to enable the i18n plugin in Strapi
- Make sure all collections are created and accessible via API
