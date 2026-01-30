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

const testClients = [
  {
    name: 'TechCorp',
    company: 'TechCorp Solutions',
    testimonial: 'Excellent service and innovative solutions.',
    locale: 'en',
  },
  {
    name: 'InnovateLab',
    company: 'InnovateLab Inc.',
    testimonial: 'Outstanding partnership and results.',
    locale: 'en',
  },
  {
    name: 'DigitalFlow',
    company: 'DigitalFlow Systems',
    testimonial: 'Professional team and great communication.',
    locale: 'en',
  },
  {
    name: 'CloudTech',
    company: 'CloudTech Industries',
    testimonial: 'Highly recommended for enterprise solutions.',
    locale: 'en',
  },
  {
    name: 'DataSphere',
    company: 'DataSphere Analytics',
    testimonial: 'Top-notch data analytics services.',
    locale: 'en',
  },
  {
    name: 'WebForge',
    company: 'WebForge Development',
    testimonial: 'Creative and efficient web development.',
    locale: 'en',
  },
  {
    name: 'AppVenture',
    company: 'AppVenture Mobile',
    testimonial: 'Best mobile app development experience.',
    locale: 'en',
  },
  {
    name: 'CodeCraft',
    company: 'CodeCraft Software',
    testimonial: 'Quality code and timely delivery.',
    locale: 'en',
  },
];

async function addTestClients() {
  try {
    console.log('Adding test clients to Strapi...\n');

    for (const client of testClients) {
      try {
        const response = await api.post('/clients', {
          data: {
            name: client.name,
            company: client.company,
            testimonial: client.testimonial,
            locale: client.locale,
          },
        });

        console.log(`✅ Added client: ${client.company} (ID: ${response.data?.data?.id || 'unknown'})`);
      } catch (error) {
        if (error.response?.status === 400 && error.response?.data?.error?.message?.includes('unique')) {
          console.log(`⚠️  Client "${client.company}" already exists, skipping...`);
        } else {
          console.error(`❌ Failed to add client "${client.company}":`, error.response?.data || error.message);
        }
      }
    }

    console.log('\n✅ Done! Test clients have been added.');
    console.log(`\nTotal clients added: ${testClients.length}`);
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
    process.exit(1);
  }
}

addTestClients();
