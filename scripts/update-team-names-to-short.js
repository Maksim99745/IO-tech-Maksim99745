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

async function updateTeamNamesToShort() {
  console.log('Fetching team members...');
  try {
    const response = await api.get('/team-members', {
      params: {
        populate: '*',
        'pagination[pageSize]': 100,
      },
    });

    const teamMembers = response.data?.data || [];
    console.log(`Found ${teamMembers.length} team members`);

    const shortMaleNames = [
      "Ahmed Al-Mansoori",
      "Khalid Al-Fahad",
      "Yousef Al-Hamad",
      "Faisal Al-Ghamdi",
      "Omar Al-Zahrani",
      "Mohammed Al-Ghamdi",
      "Abdullah Al-Rashid",
      "Hassan Al-Saud",
      "Saud Al-Qahtani",
      "Nasser Al-Dossari"
    ];

    const englishItems = teamMembers.filter((item) => {
      const data = item.attributes || item;
      const name = data.name || '';
      return !hasArabicCharacters(name);
    });

    console.log(`Found ${englishItems.length} English team members`);

    for (let i = 0; i < englishItems.length; i++) {
      const member = englishItems[i];
      const newName = shortMaleNames[i % shortMaleNames.length];
      try {
        await api.put(`/team-members/${member.id}`, { data: { name: newName } });
        console.log(`  ✓ Updated: ${member.attributes?.name || member.name} (ID: ${member.id}) to ${newName}`);
      } catch (error) {
        console.error(`  ✗ Failed to update ${member.id}:`, error.response?.data || error.message);
      }
    }
    console.log('\n✅ Done! All team members have been updated to short one-line names.');
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
    process.exit(1);
  }
}

updateTeamNamesToShort();
