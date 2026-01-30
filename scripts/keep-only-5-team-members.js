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

async function keepOnly5TeamMembers() {
  try {
    console.log('Fetching all team members...');
    
    const response = await api.get('/team-members', {
      params: {
        locale: 'en',
        populate: '*',
        'pagination[pageSize]': 100,
      },
    });

    const teamMembers = response.data?.data || [];
    console.log(`Found ${teamMembers.length} team members`);

    if (teamMembers.length <= 5) {
      console.log('Already have 5 or fewer team members. No action needed.');
      return;
    }

    const toKeep = teamMembers.slice(0, 5);
    const toDelete = teamMembers.slice(5);

    console.log(`Keeping ${toKeep.length} team members:`);
    toKeep.forEach((member, index) => {
      console.log(`  ${index + 1}. ${member.attributes?.name || member.name} (ID: ${member.id})`);
    });

    console.log(`\nDeleting ${toDelete.length} team members:`);
    for (const member of toDelete) {
      try {
        await api.delete(`/team-members/${member.id}`);
        console.log(`  ✓ Deleted: ${member.attributes?.name || member.name} (ID: ${member.id})`);
      } catch (error) {
        console.error(`  ✗ Failed to delete ${member.id}:`, error.response?.data || error.message);
      }
    }

    console.log('\n✅ Done! Only 5 team members remain.');
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
    process.exit(1);
  }
}

keepOnly5TeamMembers();
