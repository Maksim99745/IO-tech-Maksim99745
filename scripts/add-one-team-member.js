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

const teamMemberData = {
  name: 'Sarah Johnson',
  role: 'Tax Lawyer',
  email: 'sarah.johnson@example.com',
  phone: '+1234567890',
  locale: 'en'
};

async function addTeamMember() {
  try {
    console.log('Adding team member to Strapi...\n');

    const response = await api.post('/team-members', { data: teamMemberData });
    console.log(`✅ Added team member: ${teamMemberData.name} (ID: ${response.data.data.id})`);
    console.log(`   Role: ${teamMemberData.role}`);
    console.log(`\n✅ Done! Team member has been added.`);
  } catch (error) {
    console.error('❌ Failed to add team member:', error.response?.data || error.message);
    if (error.response?.data) {
      console.error('Error details:', JSON.stringify(error.response.data, null, 2));
    }
    process.exit(1);
  }
}

addTeamMember();
