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

const serviceData = {
  slug: 'legal-consultation',
  title: 'Legal Consultation Services',
  description: 'Law Firm is one of the leading legal offices that offer exceptional advisory services for both individuals and companies. Our mission is to provide comprehensive and specialized legal support to meet our clients\' needs and offer the best legal solutions in various cases and legal fields, we provide our legal consultations services as a follow:',
  content: JSON.stringify({
    footer: 'At Law Firm, we aim to provide the best legal services to ensure your rights and offer effective legal solutions. Contact us today to receive professional and comprehensive legal consultation.',
    subsections: [
      {
        title: 'General Legal Consultations',
        description: 'At Law Firm, we provide comprehensive legal consultations covering all legal aspects that our clients may encounter in their daily lives or business activities. Our goal is to offer accurate legal advice based on a deep understanding of local and international laws.',
        items: []
      },
      {
        title: 'Corporate Legal Consultations',
        description: 'We at the Law Firm understand the importance of legal consultations for companies in building and enhancing their businesses.\nOur advisory services about:',
        items: [
          '- Establishing and registering companies.',
          '- All kinds of contracts and agreements.',
          '- Commercial disputes.',
          '- Compliance with local and international laws and regulations.'
        ]
      },
      {
        title: 'Individual Legal Consultations',
        description: 'Law Firm offers customized advisory services for individuals, including:',
        items: [
          '- Family issues such as divorce, alimony, and custody.',
          '- Real estate matters like buying, selling, and renting properties.',
          '- Employment issues such as hiring and wrongful termination.',
          '- Criminal cases and defending personal rights.'
        ]
      }
    ]
  }),
  locale: 'en'
};

async function addServiceWithSubsections() {
  try {
    console.log('Adding service with subsections to Strapi...\n');

    const response = await api.post('/services', { data: serviceData });
    console.log(`✅ Added service: ${serviceData.title} (ID: ${response.data.data.id})`);
    
    const parsedContent = JSON.parse(serviceData.content);
    const subsectionsCount = parsedContent.subsections ? parsedContent.subsections.length : 0;
    console.log(`\n✅ Done! Service has been added with ${subsectionsCount} subsections.`);
  } catch (error) {
    console.error('❌ Failed to add service:', error.response?.data || error.message);
    if (error.response?.data) {
      console.error('Error details:', JSON.stringify(error.response.data, null, 2));
    }
    process.exit(1);
  }
}

addServiceWithSubsections();
