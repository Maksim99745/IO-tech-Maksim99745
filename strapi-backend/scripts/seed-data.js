/**
 * Seed script for populating Strapi with initial data
 * Run: node scripts/seed-data.js
 * 
 * Make sure Strapi is running on http://localhost:1337
 * 
 * To get API token:
 * 1. Open http://localhost:1337/admin
 * 2. Go to Settings > API Tokens
 * 3. Create a new token with "Full access" permissions
 * 4. Set STRAPI_API_TOKEN environment variable or update the token below
 */

const http = require('http');
const https = require('https');
const fs = require('fs');

// Auto-detect Windows host IP for WSL compatibility
function getWindowsHost() {
  if (process.env.STRAPI_HOST) {
    return process.env.STRAPI_HOST;
  }
  
  // Try to get Windows host IP from WSL resolv.conf
  try {
    const fs = require('fs');
    const resolvConf = fs.readFileSync('/etc/resolv.conf', 'utf8');
    const match = resolvConf.match(/nameserver\s+(\S+)/);
    if (match && match[1]) {
      return match[1];
    }
  } catch (e) {
    // Not in WSL or file doesn't exist
  }
  
  return 'localhost';
}

// Support both local and production Strapi URLs
const STRAPI_URL = process.env.STRAPI_URL || `http://${getWindowsHost()}:1337`;
const API_URL = `${STRAPI_URL}/api`;

console.log(`🔗 Using Strapi URL: ${STRAPI_URL}`);
// API Token - get from Strapi admin: Settings > API Tokens
// Or set environment variable: STRAPI_API_TOKEN=your_token_here
const API_TOKEN = process.env.STRAPI_API_TOKEN || '6fbdd1dd107e55abfca05fc9f746f04fd8e2739f1c7376032a0ac4703654257db16082ae3937da9b658395836017ed15e64c55c4b18f86c455fbbe3a89e203fbfc858ef5d9de2afa65cf6c9192c84dc6f0f248345791dc4cc9f144d392962e175ceaf5524c9e861dfb1ddb4c5a1899e63ce75f2f0dd14045dc0fe76d038e0732';

if (!API_TOKEN) {
  console.error('❌ Error: API token is required!');
  console.error('Please set STRAPI_API_TOKEN environment variable or update the token in the script.');
  console.error('Get token from: http://localhost:1337/admin > Settings > API Tokens');
  process.exit(1);
}

// Services data with detailed descriptions for service pages
const services = [
  {
    slug: 'legal-consultation-services',
    title: { en: 'Legal Consultation Services', ar: 'خدمات الاستشارات القانونية' },
    description: { 
      en: 'Comprehensive legal consultation services covering all aspects of business and personal law. Our experienced legal team provides expert advice tailored to your specific needs, helping you navigate complex legal matters with confidence.', 
      ar: 'خدمات استشارات قانونية شاملة تغطي جميع جوانب قانون الأعمال والقانون الشخصي. يقدم فريقنا القانوني ذو الخبرة المشورة الخبيرة المصممة خصيصًا لاحتياجاتك، مما يساعدك على التنقل في الأمور القانونية المعقدة بثقة.' 
    }
  },
  {
    slug: 'defense-in-all-cases',
    title: { en: 'Defense in All Cases', ar: 'الدفاع في جميع القضايا' },
    description: { 
      en: 'Comprehensive defense services for all types of legal cases including civil, criminal, commercial, and administrative matters. Our skilled attorneys provide strong representation and strategic defense strategies.', 
      ar: 'خدمات دفاع شاملة لجميع أنواع القضايا القانونية بما في ذلك القضايا المدنية والجنائية والتجارية والإدارية. يوفر محامونا المهرة تمثيلًا قويًا واستراتيجيات دفاع استراتيجية.' 
    }
  },
  {
    slug: 'contracts',
    title: { en: 'Contracts', ar: 'العقود' },
    description: { 
      en: 'Professional contract drafting, review, and negotiation services. We help businesses and individuals create legally sound agreements, review existing contracts, and negotiate favorable terms to protect your interests.', 
      ar: 'خدمات صياغة ومراجعة وتفاوض العقود المهنية. نساعد الشركات والأفراد على إنشاء اتفاقيات قانونية سليمة ومراجعة العقود الموجودة والتفاوض على شروط مواتية لحماية مصالحك.' 
    }
  },
  {
    slug: 'notarization',
    title: { en: 'Notarization', ar: 'التوثيق' },
    description: { 
      en: 'Official document notarization services for all types of legal documents. We provide certified notarization services to authenticate and validate your important documents according to local regulations.', 
      ar: 'خدمات توثيق الوثائق الرسمية لجميع أنواع الوثائق القانونية. نقدم خدمات التوثيق المعتمدة للمصادقة والتحقق من وثائقك المهمة وفقًا للوائح المحلية.' 
    }
  },
  {
    slug: 'insurance',
    title: { en: 'Insurance', ar: 'التأمين' },
    description: { 
      en: 'Specialized legal services for insurance matters including policy review, claims assistance, and dispute resolution. We help clients understand their insurance rights and navigate complex insurance claims processes.', 
      ar: 'خدمات قانونية متخصصة لشؤون التأمين بما في ذلك مراجعة السياسات ومساعدة المطالبات وتسوية المنازعات. نساعد العملاء على فهم حقوقهم التأمينية والتنقل في عمليات مطالبات التأمين المعقدة.' 
    }
  },
  {
    slug: 'banks-and-financial-institutions',
    title: { en: 'Banks and Financial Institutions', ar: 'البنوك والمؤسسات المالية' },
    description: { 
      en: 'Comprehensive legal services for banks and financial institutions including regulatory compliance, transaction documentation, and dispute resolution. We provide expert guidance on banking regulations and financial law.', 
      ar: 'خدمات قانونية شاملة للبنوك والمؤسسات المالية بما في ذلك الامتثال التنظيمي وتوثيق المعاملات وتسوية المنازعات. نقدم إرشادات خبيرة حول لوائح البنوك وقانون المالية.' 
    }
  },
  {
    slug: 'corporate-governance-services',
    title: { en: 'Corporate Governance Services', ar: 'خدمات حوكمة الشركات' },
    description: { 
      en: 'Expert corporate governance services to help companies establish effective governance structures, comply with regulations, and maintain transparency. We assist with board governance, compliance programs, and corporate policies.', 
      ar: 'خدمات حوكمة الشركات الخبيرة لمساعدة الشركات على إنشاء هياكل حوكمة فعالة والامتثال للوائح والحفاظ على الشفافية. نساعد في حوكمة مجلس الإدارة وبرامج الامتثال وسياسات الشركات.' 
    }
  },
  {
    slug: 'companies-liquidation',
    title: { en: 'Companies Liquidation', ar: 'تصفية الشركات' },
    description: { 
      en: 'Professional legal services for company liquidation and winding-up procedures. We guide businesses through the complex process of liquidation, ensuring compliance with all legal requirements and protecting stakeholder interests.', 
      ar: 'خدمات قانونية مهنية لتصفية الشركات وإجراءات التصفية. نوجه الشركات خلال عملية التصفية المعقدة، وضمان الامتثال لجميع المتطلبات القانونية وحماية مصالح أصحاب المصلحة.' 
    }
  },
  {
    slug: 'internal-regulations-for-companies',
    title: { en: 'Internal Regulations for Companies', ar: 'اللوائح الداخلية للشركات' },
    description: { 
      en: 'Drafting and reviewing internal regulations, bylaws, and corporate policies. We help companies create comprehensive internal governance documents that comply with local laws and best practices.', 
      ar: 'صياغة ومراجعة اللوائح الداخلية والأنظمة الأساسية وسياسات الشركات. نساعد الشركات على إنشاء وثائق حوكمة داخلية شاملة تمتثل للقوانين المحلية وأفضل الممارسات.' 
    }
  },
  {
    slug: 'services-for-companies-and-institutions',
    title: { en: 'Services for Companies and Institutions', ar: 'خدمات الشركات والمؤسسات' },
    description: { 
      en: 'Comprehensive legal services tailored for companies and institutions of all sizes. From startup formation to ongoing legal support, we provide end-to-end legal solutions for your business needs.', 
      ar: 'خدمات قانونية شاملة مصممة خصيصًا للشركات والمؤسسات من جميع الأحجام. من تأسيس الشركات الناشئة إلى الدعم القانوني المستمر، نقدم حلولًا قانونية شاملة لاحتياجات عملك.' 
    }
  },
  {
    slug: 'arbitration',
    title: { en: 'Arbitration', ar: 'التحكيم' },
    description: { 
      en: 'Expert arbitration and alternative dispute resolution services. We represent clients in arbitration proceedings and help resolve disputes efficiently outside of traditional court systems.', 
      ar: 'خدمات التحكيم وتسوية المنازعات البديلة الخبيرة. نمثل العملاء في إجراءات التحكيم ونساعد في حل المنازعات بكفاءة خارج أنظمة المحاكم التقليدية.' 
    }
  },
  {
    slug: 'intellectual-property',
    title: { en: 'Intellectual Property', ar: 'الملكية الفكرية' },
    description: { 
      en: 'Comprehensive intellectual property services including trademark registration, patent applications, copyright protection, and IP dispute resolution. We help protect and enforce your intellectual property rights.', 
      ar: 'خدمات الملكية الفكرية الشاملة بما في ذلك تسجيل العلامات التجارية وطلبات البراءات وحماية حقوق النشر وتسوية منازعات الملكية الفكرية. نساعد في حماية وإنفاذ حقوق الملكية الفكرية الخاصة بك.' 
    }
  },
  {
    slug: 'corporate-restructuring-and-reorganization',
    title: { en: 'Corporate Restructuring and Reorganization', ar: 'إعادة هيكلة وإعادة تنظيم الشركات' },
    description: { 
      en: 'Expert guidance for corporate restructuring and reorganization projects. We assist companies with mergers, acquisitions, divestitures, and organizational changes while ensuring legal compliance.', 
      ar: 'إرشادات خبيرة لمشاريع إعادة هيكلة وإعادة تنظيم الشركات. نساعد الشركات في عمليات الدمج والاستحواذ والتخلي عن الأصول والتغييرات التنظيمية مع ضمان الامتثال القانوني.' 
    }
  },
  {
    slug: 'establishing-national-and-foreign-companies',
    title: { en: 'Establishing National and Foreign Companies', ar: 'تأسيس الشركات الوطنية والأجنبية' },
    description: { 
      en: 'Complete legal services for establishing both national and foreign companies. We handle all aspects of company formation including registration, licensing, and compliance with local and international regulations.', 
      ar: 'خدمات قانونية كاملة لتأسيس الشركات الوطنية والأجنبية. نتعامل مع جميع جوانب تأسيس الشركات بما في ذلك التسجيل والترخيص والامتثال للوائح المحلية والدولية.' 
    }
  },
  {
    slug: 'commercial-agencies',
    title: { en: 'Commercial Agencies', ar: 'الوكالات التجارية' },
    description: { 
      en: 'Legal services for commercial agency registration, management, and dispute resolution. We help businesses establish and maintain commercial agency relationships in compliance with local regulations.', 
      ar: 'خدمات قانونية لتسجيل وإدارة وتسوية منازعات الوكالات التجارية. نساعد الشركات على إنشاء والحفاظ على علاقات الوكالة التجارية وفقًا للوائح المحلية.' 
    }
  },
  {
    slug: 'supporting-vision-2030',
    title: { en: 'Supporting Vision 2030', ar: 'دعم رؤية 2030' },
    description: { 
      en: 'Specialized legal services supporting Saudi Vision 2030 initiatives. We provide legal guidance for projects and businesses aligned with Vision 2030 goals, helping clients navigate regulatory frameworks and seize opportunities.', 
      ar: 'خدمات قانونية متخصصة تدعم مبادرات رؤية السعودية 2030. نقدم إرشادات قانونية للمشاريع والشركات المتماشية مع أهداف رؤية 2030، مما يساعد العملاء على التنقل في الأطر التنظيمية والاستفادة من الفرص.' 
    }
  }
];

// Team members data (5 English, 5 Arabic) - все имена мужские
const teamMembers = [
  // English
  { name: 'Ahmed Al-Saud', role: 'Senior Partner', email: 'ahmed@lawfirm.com', phone: '+966501234567', whatsapp: '+966501234567', locale: 'en' },
  { name: 'Omar Al-Rashid', role: 'Legal Advisor', email: 'omar@lawfirm.com', phone: '+966502345678', whatsapp: '+966502345678', locale: 'en' },
  { name: 'Mohammed Al-Zahrani', role: 'Corporate Lawyer', email: 'mohammed@lawfirm.com', phone: '+966503456789', whatsapp: '+966503456789', locale: 'en' },
  { name: 'Saeed Al-Mutairi', role: 'Litigation Attorney', email: 'saeed@lawfirm.com', phone: '+966504567890', whatsapp: '+966504567890', locale: 'en' },
  { name: 'Khalid Al-Otaibi', role: 'Contract Specialist', email: 'khalid@lawfirm.com', phone: '+966505678901', whatsapp: '+966505678901', locale: 'en' },
  // Arabic
  { name: 'أحمد السعود', role: 'شريك أول', email: 'ahmed@lawfirm.com', phone: '+966501234567', whatsapp: '+966501234567', locale: 'ar' },
  { name: 'عمر الراشد', role: 'مستشار قانوني', email: 'omar@lawfirm.com', phone: '+966502345678', whatsapp: '+966502345678', locale: 'ar' },
  { name: 'محمد الزهراني', role: 'محامي شركات', email: 'mohammed@lawfirm.com', phone: '+966503456789', whatsapp: '+966503456789', locale: 'ar' },
  { name: 'سعيد المطيري', role: 'محامي دعاوى', email: 'saeed@lawfirm.com', phone: '+966504567890', whatsapp: '+966504567890', locale: 'ar' },
  { name: 'خالد العتيبي', role: 'أخصائي عقود', email: 'khalid@lawfirm.com', phone: '+966505678901', whatsapp: '+966505678901', locale: 'ar' }
];

// Clients data (5 English, 5 Arabic)
const clients = [
  // English
  { name: 'John Smith', position: 'CEO', company: 'Tech Corp', testimonial: 'Excellent legal services. Highly recommended!', locale: 'en' },
  { name: 'Emily Johnson', position: 'Director', company: 'Finance Group', testimonial: 'Professional and reliable legal support.', locale: 'en' },
  { name: 'Michael Brown', position: 'Manager', company: 'Business Solutions', testimonial: 'Outstanding expertise in corporate law.', locale: 'en' },
  { name: 'David Wilson', position: 'Founder', company: 'Startup Inc', testimonial: 'Helped us navigate complex legal requirements.', locale: 'en' },
  { name: 'Robert Davis', position: 'President', company: 'Global Enterprises', testimonial: 'Top-notch legal consultation services.', locale: 'en' },
  // Arabic
  { name: 'محمد العلي', position: 'الرئيس التنفيذي', company: 'شركة التقنية', testimonial: 'خدمات قانونية ممتازة. أنصح بها بشدة!', locale: 'ar' },
  { name: 'فاطمة أحمد', position: 'مديرة', company: 'مجموعة المالية', testimonial: 'دعم قانوني مهني وموثوق.', locale: 'ar' },
  { name: 'خالد محمد', position: 'مدير', company: 'حلول الأعمال', testimonial: 'خبرة استثنائية في قانون الشركات.', locale: 'ar' },
  { name: 'سارة علي', position: 'مؤسسة', company: 'شركة الناشئة', testimonial: 'ساعدونا في التنقل في المتطلبات القانونية المعقدة.', locale: 'ar' },
  { name: 'عبدالله حسن', position: 'رئيس', company: 'المؤسسات العالمية', testimonial: 'خدمات استشارات قانونية من الطراز الأول.', locale: 'ar' }
];

// Hero section pages data (5 English, 5 Arabic)
const heroPages = [
  {
    title: { en: 'Expert Legal Services', ar: 'خدمات قانونية متخصصة' },
    subtitle: { en: 'Your Trusted Legal Partner', ar: 'شريكك القانوني الموثوق' },
    description: { 
      en: 'We are a leading law firm providing comprehensive legal services to individuals and businesses. Our experienced team of legal professionals is dedicated to delivering exceptional results and protecting your rights.', 
      ar: 'نحن مكتب محاماة رائد يقدم خدمات قانونية شاملة للأفراد والشركات. فريقنا من المحامين ذوي الخبرة ملتزم بتقديم نتائج استثنائية وحماية حقوقك.' 
    },
    ctaText: { en: 'Get Started', ar: 'ابدأ الآن' },
    ctaLink: { en: '#services', ar: '#services' },
    mediaType: 'image'
  },
  {
    title: { en: 'Comprehensive Legal Solutions', ar: 'حلول قانونية شاملة' },
    subtitle: { en: 'Protecting Your Rights', ar: 'حماية حقوقك' },
    description: { 
      en: 'From corporate law to personal legal matters, we provide expert guidance and representation. Our commitment to excellence ensures you receive the best legal support for all your needs.', 
      ar: 'من قانون الشركات إلى القضايا القانونية الشخصية، نقدم إرشادات وتمثيلًا خبيرًا. التزامنا بالتميز يضمن حصولك على أفضل دعم قانوني لجميع احتياجاتك.' 
    },
    ctaText: { en: 'Learn More', ar: 'اعرف المزيد' },
    ctaLink: { en: '#about', ar: '#about' },
    mediaType: 'image'
  },
  {
    title: { en: 'Experienced Legal Team', ar: 'فريق قانوني ذو خبرة' },
    subtitle: { en: 'Dedicated to Your Success', ar: 'ملتزمون بنجاحك' },
    description: { 
      en: 'With years of experience in various legal fields, our team brings expertise and dedication to every case. We understand the complexities of law and work tirelessly to achieve the best outcomes.', 
      ar: 'مع سنوات من الخبرة في مختلف المجالات القانونية، يجلب فريقنا الخبرة والتفاني إلى كل قضية. نفهم تعقيدات القانون ونعمل بلا كلل لتحقيق أفضل النتائج.' 
    },
    ctaText: { en: 'Contact Us', ar: 'اتصل بنا' },
    ctaLink: { en: '#contact', ar: '#contact' },
    mediaType: 'image'
  },
  {
    title: { en: 'Trusted Legal Advisors', ar: 'مستشارون قانونيون موثوقون' },
    subtitle: { en: 'Your Success is Our Priority', ar: 'نجاحك هو أولويتنا' },
    description: { 
      en: 'Building strong relationships with our clients is at the heart of what we do. We provide personalized legal services tailored to your unique situation and goals.', 
      ar: 'بناء علاقات قوية مع عملائنا هو في صميم ما نقوم به. نقدم خدمات قانونية مخصصة مصممة خصيصًا لحالتك وأهدافك الفريدة.' 
    },
    ctaText: { en: 'View Services', ar: 'عرض الخدمات' },
    ctaLink: { en: '#services', ar: '#services' },
    mediaType: 'image'
  },
  {
    title: { en: 'Excellence in Legal Practice', ar: 'التميز في الممارسة القانونية' },
    subtitle: { en: 'Innovative Legal Solutions', ar: 'حلول قانونية مبتكرة' },
    description: { 
      en: 'We combine traditional legal expertise with modern approaches to deliver innovative solutions. Our forward-thinking strategies help clients navigate today\'s complex legal landscape.', 
      ar: 'نجمع بين الخبرة القانونية التقليدية والنهج الحديثة لتقديم حلول مبتكرة. استراتيجياتنا ذات التفكير المستقبلي تساعد العملاء على التنقل في المشهد القانوني المعقد اليوم.' 
    },
    ctaText: { en: 'Get Consultation', ar: 'احصل على استشارة' },
    ctaLink: { en: '#contact', ar: '#contact' },
    mediaType: 'image'
  }
];

function makeRequest(url, method, data) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const isHttps = urlObj.protocol === 'https:';
    const requestModule = isHttps ? https : http;
    
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port || (isHttps ? 443 : 80),
      path: urlObj.pathname + urlObj.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        ...(API_TOKEN && { 'Authorization': `Bearer ${API_TOKEN}` })
      }
    };

    const req = requestModule.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        // Ensure connection is properly closed
        res.destroy();
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try {
            resolve(JSON.parse(body));
          } catch (e) {
            resolve(body);
          }
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${body}`));
        }
      });
    });

    req.on('error', (error) => {
      req.destroy();
      reject(error);
    });

    // Set timeout to prevent hanging connections (30 seconds)
    req.setTimeout(30000, () => {
      req.destroy();
      reject(new Error('Request timeout after 30s'));
    });

    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

async function createService(service, locale) {
  // For Strapi v5, create separate entries for each locale
  const payload = {
    data: {
      slug: `${service.slug}${locale === 'ar' ? '-ar' : ''}`,
      title: service.title[locale],
      description: service.description[locale]
    }
  };
  
  try {
    const response = await makeRequest(`${API_URL}/services`, 'POST', payload);
    return response;
  } catch (error) {
    // If service already exists (400 error with "must be unique"), skip it
    if (error.message.includes('400') && error.message.includes('unique')) {
      console.log(`⏭️  Service ${service.slug} (${locale}) already exists, skipping...`);
      return null;
    }
    console.error(`Error creating service ${service.slug} (${locale}):`, error.message);
    return null;
  }
}

async function getExistingTeamMembers() {
  try {
    const response = await makeRequest(`${API_URL}/team-members?pagination[pageSize]=100`, 'GET');
    return response.data || [];
  } catch (error) {
    console.error('Error fetching team members:', error.message);
    return [];
  }
}

async function findTeamMemberByName(existingMembers, name) {
  return existingMembers.find(member => {
    const memberName = member.attributes?.name || member.name || '';
    return memberName === name;
  });
}

async function deleteTeamMemberDuplicates(existingMembers) {
  if (existingMembers.length === 0) {
    return 0;
  }
  
  // Group by name
  const nameGroups = {};
  for (const member of existingMembers) {
    const name = member.attributes?.name || member.name || '';
    if (!name || name === '') continue;
    
    if (!nameGroups[name]) {
      nameGroups[name] = [];
    }
    nameGroups[name].push(member);
  }
  
  // Delete duplicates (keep first, delete rest)
  let deleted = 0;
  for (const [name, members] of Object.entries(nameGroups)) {
    if (members.length > 1) {
      console.log(`  Found ${members.length} duplicates for "${name}", keeping first, deleting ${members.length - 1}...`);
      // Keep first, delete others
      for (let i = 1; i < members.length; i++) {
        const member = members[i];
        const id = member.id || member.attributes?.id;
        
        if (!id) {
          console.error(`  ⚠️  No ID found for duplicate member "${name}"`);
          continue;
        }
        
        try {
          await makeRequest(`${API_URL}/team-members/${id}`, 'DELETE');
          deleted++;
          console.log(`  ✅ Deleted duplicate "${name}" (id: ${id})`);
        } catch (error) {
          console.error(`  ❌ Error deleting duplicate "${name}" (id: ${id}):`, error.message);
        }
        await new Promise(resolve => setTimeout(resolve, 300)); // Delay to prevent overloading
      }
    }
  }
  
  return deleted;
}

async function getUploadedImages() {
  try {
    // Get all uploaded images from Strapi Media Library
    const response = await makeRequest(`${API_URL}/upload/files?pagination[pageSize]=100`, 'GET');
    const files = response.data || response || [];
    
    // Filter only images
    const images = files.filter(file => {
      const mime = file.mime || file.attributes?.mime || '';
      return mime.startsWith('image/');
    });
    
    return images;
  } catch (error) {
    console.error('Error fetching uploaded images:', error.message);
    return [];
  }
}

async function createTeamMember(member, imageIndex = null, images = [], existingMember = null) {
  const payload = {
    data: {
      name: member.name,
      role: member.role,
      email: member.email,
      phone: member.phone,
      whatsapp: member.whatsapp
    }
  };
  
  // Add image if available
  if (imageIndex !== null && images.length > 0 && images[imageIndex]) {
    const image = images[imageIndex];
    const imageId = image.id || image.attributes?.id;
    if (imageId) {
      payload.data.image = imageId;
    }
  }
  
  // If member exists, update it instead of creating
  if (existingMember) {
    const id = existingMember.id;
    try {
      const response = await makeRequest(`${API_URL}/team-members/${id}`, 'PUT', payload);
      return { ...response, updated: true };
    } catch (error) {
      console.error(`Error updating team member ${member.name}:`, error.message);
      return null;
    }
  }
  
  // Create new member
  try {
    const response = await makeRequest(`${API_URL}/team-members`, 'POST', payload);
    return response;
  } catch (error) {
    // If member already exists (duplicate), skip
    if (error.message.includes('400') || error.message.includes('unique')) {
      console.log(`⏭️  Team member ${member.name} already exists, skipping...`);
      return null;
    }
    console.error(`Error creating team member ${member.name}:`, error.message);
    return null;
  }
}

async function getExistingClients() {
  try {
    const response = await makeRequest(`${API_URL}/clients?pagination[pageSize]=100`, 'GET');
    return response.data || [];
  } catch (error) {
    console.error('Error fetching clients:', error.message);
    return [];
  }
}

async function findClientByName(existingClients, name) {
  return existingClients.find(client => {
    const clientName = client.attributes?.name || client.name || '';
    return clientName === name;
  });
}

async function deleteClientDuplicates(existingClients) {
  if (existingClients.length === 0) {
    return 0;
  }
  
  // Group by name
  const nameGroups = {};
  for (const client of existingClients) {
    const name = client.attributes?.name || client.name || '';
    if (!name || name === '') continue;
    
    if (!nameGroups[name]) {
      nameGroups[name] = [];
    }
    nameGroups[name].push(client);
  }
  
  // Delete duplicates (keep first, delete rest)
  let deleted = 0;
  for (const [name, clients] of Object.entries(nameGroups)) {
    if (clients.length > 1) {
      console.log(`  Found ${clients.length} duplicates for "${name}", keeping first, deleting ${clients.length - 1}...`);
      // Keep first, delete others
      for (let i = 1; i < clients.length; i++) {
        const client = clients[i];
        const id = client.id || client.attributes?.id;
        
        if (!id) {
          console.error(`  ⚠️  No ID found for duplicate client "${name}"`);
          continue;
        }
        
        try {
          await makeRequest(`${API_URL}/clients/${id}`, 'DELETE');
          deleted++;
          console.log(`  ✅ Deleted duplicate "${name}" (id: ${id})`);
        } catch (error) {
          console.error(`  ❌ Error deleting duplicate "${name}" (id: ${id}):`, error.message);
        }
        await new Promise(resolve => setTimeout(resolve, 300)); // Delay to prevent overloading
      }
    }
  }
  
  return deleted;
}

async function createClient(client, existingClient = null) {
  const payload = {
    data: {
      name: client.name,
      position: client.position,
      company: client.company,
      testimonial: client.testimonial
    }
  };
  
  // If client exists, skip (don't update)
  if (existingClient) {
    return null;
  }
  
  try {
    const response = await makeRequest(`${API_URL}/clients`, 'POST', payload);
    return response;
  } catch (error) {
    // If client already exists, skip
    if (error.message.includes('400') || error.message.includes('unique')) {
      console.log(`⏭️  Client ${client.name} already exists, skipping...`);
      return null;
    }
    console.error(`Error creating client ${client.name}:`, error.message);
    return null;
  }
}

async function getExistingHeroPages() {
  try {
    const response = await makeRequest(`${API_URL}/pages?pagination[pageSize]=100`, 'GET');
    return response.data || [];
  } catch (error) {
    console.error('Error fetching hero pages:', error.message);
    return [];
  }
}

async function findHeroPageByTitle(existingPages, title) {
  return existingPages.find(page => {
    const pageTitle = page.attributes?.title || page.title || '';
    return pageTitle === title;
  });
}

async function deleteHeroPageDuplicates(existingPages) {
  if (existingPages.length === 0) {
    return 0;
  }
  
  // Group by title
  const titleGroups = {};
  for (const page of existingPages) {
    const title = page.attributes?.title || page.title || '';
    if (!title || title === '') continue;
    
    if (!titleGroups[title]) {
      titleGroups[title] = [];
    }
    titleGroups[title].push(page);
  }
  
  // Delete duplicates (keep first, delete rest)
  let deleted = 0;
  for (const [title, pages] of Object.entries(titleGroups)) {
    if (pages.length > 1) {
      console.log(`  Found ${pages.length} duplicates for "${title}", keeping first, deleting ${pages.length - 1}...`);
      // Keep first, delete others
      for (let i = 1; i < pages.length; i++) {
        const page = pages[i];
        const id = page.id || page.attributes?.id;
        
        if (!id) {
          console.error(`  ⚠️  No ID found for duplicate page "${title}"`);
          continue;
        }
        
        try {
          await makeRequest(`${API_URL}/pages/${id}`, 'DELETE');
          deleted++;
          console.log(`  ✅ Deleted duplicate "${title}" (id: ${id})`);
        } catch (error) {
          console.error(`  ❌ Error deleting duplicate "${title}" (id: ${id}):`, error.message);
        }
        await new Promise(resolve => setTimeout(resolve, 300)); // Delay to prevent overloading
      }
    }
  }
  
  return deleted;
}

async function createHeroPage(page, locale, existingPage = null) {
  const payload = {
    data: {
      title: page.title[locale],
      subtitle: page.subtitle[locale],
      description: page.description[locale],
      ctaText: page.ctaText[locale],
      ctaLink: page.ctaLink[locale],
      mediaType: page.mediaType
      // Note: media field should be uploaded manually via Strapi Admin panel
    }
  };
  
  // If page exists, skip (don't create duplicate)
  if (existingPage) {
    return null;
  }
  
  try {
    const response = await makeRequest(`${API_URL}/pages`, 'POST', payload);
    return response;
  } catch (error) {
    // If page already exists, skip
    if (error.message.includes('400') || error.message.includes('unique')) {
      console.log(`⏭️  Hero page "${page.title[locale]}" already exists, skipping...`);
      return null;
    }
    console.error(`Error creating hero page (${locale}):`, error.message);
    return null;
  }
}

async function checkIfDataExists() {
  try {
    // Check if we already have data by checking services count
    const servicesResponse = await makeRequest(`${API_URL}/services?pagination[pageSize]=1`, 'GET');
    const servicesCount = servicesResponse.data?.length || 0;
    
    // Check team members
    const teamResponse = await makeRequest(`${API_URL}/team-members?pagination[pageSize]=1`, 'GET');
    const teamCount = teamResponse.data?.length || 0;
    
    // If we have both services and team members, data already exists
    if (servicesCount > 0 && teamCount > 0) {
      return true;
    }
    return false;
  } catch (error) {
    // If check fails, assume no data exists
    return false;
  }
}

async function seedData() {
  console.log('🌱 Starting data seeding...\n');
  console.log(`📡 Connecting to: ${API_URL}\n`);
  
  // Check if data already exists
  console.log('🔍 Checking if data already exists...');
  const dataExists = await checkIfDataExists();
  
  if (dataExists) {
    console.log('✅ Data already exists in database. Skipping seed.\n');
    console.log('💡 To re-seed data, delete existing entries from Strapi Admin panel first.');
    return;
  }
  
  console.log('📝 No existing data found. Proceeding with seed...\n');

  // Create services (both English and Arabic versions)
  console.log('📋 Creating services...');
  for (const service of services) {
    // Create English version
    const enResult = await createService(service, 'en');
    if (enResult) console.log(`✅ Created service: ${service.title.en}`);
    
    // Create Arabic version
    const arResult = await createService(service, 'ar');
    if (arResult) console.log(`✅ Created service: ${service.title.ar}`);
    
    await new Promise(resolve => setTimeout(resolve, 200)); // Small delay
  }

  // Create team members (remove duplicates, check existence, add images)
  console.log('\n👥 Processing team members...');
  
  // Get existing members and remove duplicates
  const existingMembers = await getExistingTeamMembers();
  console.log(`📋 Found ${existingMembers.length} existing team member(s)`);
  
  const deletedDuplicates = await deleteTeamMemberDuplicates(existingMembers);
  if (deletedDuplicates > 0) {
    console.log(`🗑️  Deleted ${deletedDuplicates} duplicate team member(s)`);
  }
  
  // Get uploaded images
  console.log('📸 Fetching uploaded images...');
  const images = await getUploadedImages();
  console.log(`✅ Found ${images.length} image(s) in Media Library`);
  
  // Get updated list after deletion (refresh to get correct IDs)
  const updatedExistingMembers = await getExistingTeamMembers();
  console.log(`📋 After cleanup: ${updatedExistingMembers.length} team member(s) remaining`);
  
  // Create or update team members with images assigned in order
  let imageIndex = 0;
  for (const member of teamMembers) {
    const existingMember = await findTeamMemberByName(updatedExistingMembers, member.name);
    
    if (existingMember) {
      // Update existing member with image
      const result = await createTeamMember(member, imageIndex, images, existingMember);
      if (result) {
        const imageInfo = images[imageIndex] ? ` (image ${imageIndex + 1})` : '';
        console.log(`🔄 Updated team member: ${member.name}${imageInfo}`);
      }
    } else {
      // Create new member
      const result = await createTeamMember(member, imageIndex, images);
      if (result) {
        const imageInfo = images[imageIndex] ? ` (image ${imageIndex + 1})` : '';
        console.log(`✅ Created team member: ${member.name}${imageInfo}`);
      }
    }
    
    imageIndex = (imageIndex + 1) % images.length; // Cycle through images
    await new Promise(resolve => setTimeout(resolve, 200));
  }

  // Create clients (remove duplicates, check existence)
  console.log('\n💼 Processing clients...');
  
  // Get existing clients and remove duplicates
  const existingClients = await getExistingClients();
  console.log(`📋 Found ${existingClients.length} existing client(s)`);
  
  const deletedClientDuplicates = await deleteClientDuplicates(existingClients);
  if (deletedClientDuplicates > 0) {
    console.log(`🗑️  Deleted ${deletedClientDuplicates} duplicate client(s)`);
  }
  
  // Get updated list after deletion
  const updatedExistingClients = await getExistingClients();
  
  // Create only new clients
  for (const client of clients) {
    const existingClient = await findClientByName(updatedExistingClients, client.name);
    const result = await createClient(client, existingClient);
    if (result) {
      console.log(`✅ Created client: ${client.name}`);
    } else if (existingClient) {
      console.log(`⏭️  Client ${client.name} already exists, skipping...`);
    }
    await new Promise(resolve => setTimeout(resolve, 200));
  }

  // Create hero pages (remove duplicates, check existence)
  console.log('\n🎯 Processing hero pages...');
  
  // Get existing pages and remove duplicates
  const existingPages = await getExistingHeroPages();
  console.log(`📋 Found ${existingPages.length} existing hero page(s)`);
  
  const deletedPageDuplicates = await deleteHeroPageDuplicates(existingPages);
  if (deletedPageDuplicates > 0) {
    console.log(`🗑️  Deleted ${deletedPageDuplicates} duplicate hero page(s)`);
  }
  
  // Get updated list after deletion
  const updatedExistingPages = await getExistingHeroPages();
  
  // Create only new pages
  for (const page of heroPages) {
    // Check English version
    const existingEnPage = await findHeroPageByTitle(updatedExistingPages, page.title.en);
    const enResult = await createHeroPage(page, 'en', existingEnPage);
    if (enResult) {
      console.log(`✅ Created hero page: ${page.title.en}`);
    } else if (existingEnPage) {
      console.log(`⏭️  Hero page "${page.title.en}" already exists, skipping...`);
    }
    
    // Check Arabic version
    const existingArPage = await findHeroPageByTitle(updatedExistingPages, page.title.ar);
    const arResult = await createHeroPage(page, 'ar', existingArPage);
    if (arResult) {
      console.log(`✅ Created hero page: ${page.title.ar}`);
    } else if (existingArPage) {
      console.log(`⏭️  Hero page "${page.title.ar}" already exists, skipping...`);
    }
    
    await new Promise(resolve => setTimeout(resolve, 200));
  }

  console.log('\n✨ Data seeding completed!');
  console.log(`\n📊 Summary:`);
  console.log(`   - Services: ${services.length * 2} (${services.length} EN + ${services.length} AR)`);
  console.log(`   - Team Members: ${teamMembers.length} (5 EN + 5 AR)`);
  console.log(`   - Clients: ${clients.length} (5 EN + 5 AR)`);
  console.log(`   - Hero Pages: ${heroPages.length * 2} (${heroPages.length} EN + ${heroPages.length} AR)`);
  console.log(`\n⚠️  Note: Don't forget to upload media (image/video) for hero pages via Strapi Admin panel!`);
}

// Run the seed script
seedData().catch(console.error);
