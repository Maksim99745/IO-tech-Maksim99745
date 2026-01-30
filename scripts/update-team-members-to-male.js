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

const maleNames = [
  'John Smith',
  'Michael Brown',
  'David Wilson',
  'James Anderson',
  'Robert Taylor',
  'William Martinez'
];

async function updateTeamMembersToMale() {
  try {
    console.log('Fetching team members...\n');

    const response = await api.get('/team-members', {
      params: {
        populate: '*',
        'pagination[pageSize]': 100,
      },
    });

    const items = response.data?.data || [];
    console.log(`Found ${items.length} team members\n`);

    if (items.length === 0) {
      console.log('No team members found.');
      return;
    }

    // Фильтруем только английские записи
    const englishItems = items.filter((item) => {
      const data = item.attributes || item;
      const name = data.name || '';
      const arabicRegex = /[\u0600-\u06FF]/;
      return !arabicRegex.test(name);
    });

    console.log(`Found ${englishItems.length} English team members\n`);

    for (let i = 0; i < englishItems.length && i < maleNames.length; i++) {
      const item = englishItems[i];
      const data = item.attributes || item;
      const newName = maleNames[i];
      const itemId = item.documentId || item.id;
      
      if (data.name === newName) {
        console.log(`✓ ${data.name} - already has male name, skipping`);
        continue;
      }

      try {
        const updateData = {
          name: newName,
          role: data.role,
        };
        
        if (data.email) updateData.email = data.email;
        if (data.phone) updateData.phone = data.phone;
        if (data.whatsapp) updateData.whatsapp = data.whatsapp;
        
        await api.put(`/team-members/${itemId}`, { data: updateData });
        console.log(`✓ Updated: "${data.name}" → "${newName}" (ID: ${itemId})`);
      } catch (error) {
        console.error(`✗ Failed to update ${itemId}:`, error.response?.data || error.message);
      }
    }

    console.log('\n✅ Done! All team members have been updated to male names.');
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
    process.exit(1);
  }
}

updateTeamMembersToMale();
