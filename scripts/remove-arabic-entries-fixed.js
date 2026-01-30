const axios = require('axios');
const fs = require('fs');
const path = require('path');

let API_BASE_URL = 'http://localhost:1337';
let API_TOKEN = '';

try {
  const envPath = path.join(__dirname, '..', '.env.local');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const lines = envContent.split('\n');
    lines.forEach(line => {
      const match = line.match(/^([^=]+)=(.*)$/);
      if (match) {
        const key = match[1].trim();
        const value = match[2].trim();
        if (key === 'NEXT_PUBLIC_STRAPI_URL') {
          API_BASE_URL = value;
        } else if (key === 'NEXT_PUBLIC_STRAPI_TOKEN') {
          API_TOKEN = value;
        }
      }
    });
  }
} catch (error) {
  console.warn('Could not read .env.local, using defaults');
}

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
    ...(API_TOKEN && {
      Authorization: `Bearer ${API_TOKEN}`,
    }),
  },
});

function hasArabicCharacters(str) {
  if (!str) return false;
  const arabicRegex = /[\u0600-\u06FF]/;
  return arabicRegex.test(str);
}

async function removeArabicEntries() {
  try {
    console.log('Removing Arabic entries from Strapi...\n');

    const collections = ['team-members', 'clients'];
    
    for (const collection of collections) {
      console.log(`\nProcessing ${collection}...`);
      
      const response = await api.get(`/${collection}`, {
        params: {
          populate: '*',
          'pagination[pageSize]': 100,
        },
      });

      const items = response.data?.data || [];
      console.log(`Found ${items.length} total entries in ${collection}`);

      if (items.length === 0) {
        console.log(`No entries in ${collection}. Skipping...`);
        continue;
      }

      let arabicCount = 0;
      for (const item of items) {
        const data = item.attributes || item;
        const name = data.name || '';
        const locale = data.locale || item.locale || '';
        
        const isArabic = locale === 'ar' || hasArabicCharacters(name);
        
        if (isArabic) {
          try {
            await api.delete(`/${collection}/${item.id}`);
            console.log(`  ✓ Deleted Arabic entry: ${name || item.id} (ID: ${item.id}, locale: ${locale})`);
            arabicCount++;
          } catch (error) {
            console.error(`  ✗ Failed to delete ${item.id}:`, error.response?.data || error.message);
          }
        }
      }
      
      console.log(`Deleted ${arabicCount} Arabic entries from ${collection}`);
    }

    console.log('\n✅ Done! All Arabic entries have been removed.');
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
    process.exit(1);
  }
}

removeArabicEntries();
