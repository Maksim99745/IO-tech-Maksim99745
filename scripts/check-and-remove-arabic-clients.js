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

async function checkAndRemoveArabicClients() {
  try {
    console.log('Checking for Arabic clients in Strapi...\n');

    const response = await api.get('/clients', {
      params: {
        populate: '*',
        'pagination[pageSize]': 100,
      },
    });

    const items = response.data?.data || [];
    console.log(`Found ${items.length} total clients\n`);

    if (items.length === 0) {
      console.log('No clients found. Skipping...');
      return;
    }

    let arabicCount = 0;
    for (const item of items) {
      const data = item.attributes || item;
      const name = data.name || '';
      const testimonial = data.testimonial || '';
      const locale = data.locale || item.locale || '';
      
      const hasArabicInName = hasArabicCharacters(name);
      const hasArabicInTestimonial = hasArabicCharacters(testimonial);
      const isArabic = locale === 'ar' || hasArabicInName || hasArabicInTestimonial;
      
      if (isArabic) {
        console.log(`Found Arabic client:`);
        console.log(`  ID: ${item.id}`);
        console.log(`  Name: ${name}`);
        console.log(`  Testimonial preview: ${testimonial.substring(0, 50)}...`);
        console.log(`  Locale: ${locale || 'not set'}`);
        console.log(`  Has Arabic in name: ${hasArabicInName}`);
        console.log(`  Has Arabic in testimonial: ${hasArabicInTestimonial}`);
        
        try {
          await api.delete(`/clients/${item.id}`);
          console.log(`  ✓ Deleted\n`);
          arabicCount++;
        } catch (error) {
          console.error(`  ✗ Failed to delete:`, error.response?.data || error.message);
          console.log('');
        }
      }
    }
    
    console.log(`\n✅ Done! Deleted ${arabicCount} Arabic clients.`);
    console.log(`Remaining clients: ${items.length - arabicCount}`);
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
    process.exit(1);
  }
}

checkAndRemoveArabicClients();
