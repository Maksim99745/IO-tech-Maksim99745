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

async function checkStructure() {
  try {
    const response = await api.get('/team-members', {
      params: {
        populate: '*',
        'pagination[pageSize]': 10,
      },
    });

    const items = response.data?.data || [];
    if (items.length > 0) {
      console.log('First team member structure:');
      console.log(JSON.stringify(items[0], null, 2));
    }
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

checkStructure();
