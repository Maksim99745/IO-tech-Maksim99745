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
const path = require('path');

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

const HOST = getWindowsHost();
const STRAPI_URL = process.env.STRAPI_URL || `http://${HOST}:1337`;
const API_URL = `${STRAPI_URL}/api`;

// Determine if we should use HTTPS
const useHttps = STRAPI_URL.startsWith('https://');
const httpModule = useHttps ? https : http;

console.log(`🔗 Using host: ${HOST}`);
// API Token - get from Strapi admin: Settings > API Tokens
// Or set environment variable: STRAPI_API_TOKEN=your_token_here
const API_TOKEN = process.env.STRAPI_API_TOKEN || '289d740187fa0d03c8654745ee4a584d9af62f75bec42f0fb7a0ec95a66c1b0897892e396b5e45c6e29236323d1dfff71840efbea7a1a4b39268fbbc3449187edaf0034264e55e2b91e0199a212b4810f6abbf454f5d2c729a794dac8e7a9b4980036f10a62ae4de8e04a0d59762eb4ad41bb01c78d842f8d5a8901abbcf02ad';

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

function makeRequest(url, method, data, headers = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const defaultHeaders = {
      'Content-Type': 'application/json',
      ...(API_TOKEN && { 'Authorization': `Bearer ${API_TOKEN}` })
    };
    
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port || (useHttps ? 443 : 80),
      path: urlObj.pathname + urlObj.search,
      method: method,
      headers: { ...defaultHeaders, ...headers }
    };

    const req = httpModule.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
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

    req.setTimeout(30000, () => {
      req.destroy();
      reject(new Error('Request timeout after 30s'));
    });

    if (data) {
      if (typeof data === 'string') {
        req.write(data);
      } else {
        req.write(JSON.stringify(data));
      }
    }
    req.end();
  });
}

// Upload image to Strapi Media Library
async function uploadImage(imagePath, alt = '') {
  return new Promise((resolve, reject) => {
    // Check if imagePath is a URL or local file
    const isUrl = imagePath.startsWith('http://') || imagePath.startsWith('https://');
    
    if (isUrl) {
      // Download image from URL first
      downloadImageFromUrl(imagePath).then(buffer => {
        uploadImageBuffer(buffer, path.basename(imagePath), alt)
          .then(resolve)
          .catch(reject);
      }).catch(reject);
      return;
    }

    // Read local file
    let fullPath;
    if (path.isAbsolute(imagePath)) {
      fullPath = imagePath;
    } else {
      // Script runs from strapi-backend/, so we need to go up one level to project root
      const projectRoot = path.join(__dirname, '../..'); // Go up from strapi-backend/scripts/ to project root
      const fileName = path.basename(imagePath);
      
      // Try multiple possible paths
      const possiblePaths = [
        path.join(projectRoot, imagePath), // From project root: public/assets/...
        path.join(projectRoot, 'public', 'assets', fileName), // Direct path to assets
        path.join(process.cwd(), imagePath), // From current working directory
        path.join(process.cwd(), '..', imagePath), // One level up from strapi-backend
      ];
      
      fullPath = possiblePaths.find(p => fs.existsSync(p));
      
      if (!fullPath) {
        fullPath = possiblePaths[0]; // Use first as default for error message
      }
    }
    
    if (!fs.existsSync(fullPath)) {
      reject(new Error(`Image file not found: ${fullPath}`));
      return;
    }

    const fileBuffer = fs.readFileSync(fullPath);
    const fileName = path.basename(fullPath);
    
    uploadImageBuffer(fileBuffer, fileName, alt)
      .then(resolve)
      .catch(reject);
  });
}

// Download image from URL
function downloadImageFromUrl(url) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const isHttps = url.startsWith('https://');
    const module = isHttps ? https : http;
    
    module.get(url, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error(`Failed to download image: ${res.statusCode}`));
        return;
      }
      
      const chunks = [];
      res.on('data', (chunk) => chunks.push(chunk));
      res.on('end', () => resolve(Buffer.concat(chunks)));
      res.on('error', reject);
    }).on('error', reject);
  });
}

// Upload image buffer to Strapi
function uploadImageBuffer(buffer, fileName, alt = '') {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(`${STRAPI_URL}/api/upload`);
    const boundary = '----WebKitFormBoundary' + Math.random().toString(36).substring(2);
    
    // Determine MIME type from file extension
    const ext = path.extname(fileName).toLowerCase().slice(1);
    const mimeTypes = {
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'png': 'image/png',
      'gif': 'image/gif',
      'webp': 'image/webp',
      'svg': 'image/svg+xml',
      'avif': 'image/avif'
    };
    const contentType = mimeTypes[ext] || 'image/jpeg';
    
    // Build multipart form data
    const parts = [];
    
    // Boundary start
    parts.push(Buffer.from(`--${boundary}\r\n`));
    
    // Content-Disposition header
    parts.push(Buffer.from(`Content-Disposition: form-data; name="files"; filename="${fileName}"\r\n`));
    
    // Content-Type header
    parts.push(Buffer.from(`Content-Type: ${contentType}\r\n`));
    
    // Empty line before content
    parts.push(Buffer.from('\r\n'));
    
    // File content
    parts.push(buffer);
    
    // Boundary end
    parts.push(Buffer.from(`\r\n--${boundary}--\r\n`));
    
    const formData = Buffer.concat(parts);

    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port || (useHttps ? 443 : 80),
      path: urlObj.pathname,
      method: 'POST',
      headers: {
        'Content-Type': `multipart/form-data; boundary=${boundary}`,
        'Content-Length': formData.length,
        ...(API_TOKEN && { 'Authorization': `Bearer ${API_TOKEN}` })
      }
    };

    const req = httpModule.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        res.destroy();
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try {
            const result = JSON.parse(body);
            // Strapi returns array of uploaded files
            const uploadedFile = Array.isArray(result) ? result[0] : (result.data?.[0] || result);
            resolve(uploadedFile);
          } catch (e) {
            reject(new Error(`Failed to parse response: ${body}`));
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

    req.setTimeout(60000, () => {
      req.destroy();
      reject(new Error('Upload timeout after 60s'));
    });

    req.write(formData);
    req.end();
  });
}

async function getExistingService(slug, locale) {
  try {
    const searchSlug = `${slug}${locale === 'ar' ? '-ar' : ''}`;
    const response = await makeRequest(`${API_URL}/services?filters[slug][$eq]=${searchSlug}`, 'GET');
    const services = response.data || [];
    return services.length > 0 ? services[0] : null;
  } catch (error) {
    return null;
  }
}

async function createService(service, locale) {
  // Check if service already exists
  const existing = await getExistingService(service.slug, locale);
  if (existing) {
    console.log(`⏭️  Service ${service.slug} (${locale}) already exists, skipping...`);
    return null;
  }
  
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
    // Strapi v5 returns data directly without attributes wrapper
    const memberName = member.name || member.attributes?.name || (member.data && member.data.name) || '';
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
    // Strapi v5 uses documentId for updates, fallback to id
    const id = existingMember.documentId || existingMember.id || existingMember.attributes?.id || (existingMember.data && (existingMember.data.documentId || existingMember.data.id));
    if (!id) {
      console.error(`Error: No ID found for team member ${member.name}`);
      return null;
    }
    try {
      const response = await makeRequest(`${API_URL}/team-members/${id}`, 'PUT', payload);
      return { ...response, updated: true };
    } catch (error) {
      console.error(`Error updating team member ${member.name} (ID: ${id}):`, error.message);
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
    // Strapi v5 returns data directly without attributes wrapper
    const clientName = client.name || client.attributes?.name || (client.data && client.data.name) || '';
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

async function createClient(client, imageIndex = null, images = [], existingClient = null) {
  const payload = {
    data: {
      name: client.name,
      position: client.position,
      company: client.company,
      testimonial: client.testimonial
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
  
  // If client exists, update it with image
  if (existingClient) {
    // Strapi v5 uses documentId for updates, fallback to id
    const id = existingClient.documentId || existingClient.id || existingClient.attributes?.id || (existingClient.data && (existingClient.data.documentId || existingClient.data.id));
    if (!id) {
      console.error(`Error: No ID found for client ${client.name}`);
      return null;
    }
    try {
      const response = await makeRequest(`${API_URL}/clients/${id}`, 'PUT', payload);
      return { ...response, updated: true };
    } catch (error) {
      console.error(`Error updating client ${client.name} (ID: ${id}):`, error.message);
      return null;
    }
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
    // Strapi v5 returns data directly without attributes wrapper
    const pageTitle = page.title || page.attributes?.title || (page.data && page.data.title) || '';
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

async function createHeroPage(page, locale, imageIndex = null, images = [], existingPage = null) {
  const payload = {
    data: {
      title: page.title[locale],
      subtitle: page.subtitle[locale],
      description: page.description[locale],
      ctaText: page.ctaText[locale],
      ctaLink: page.ctaLink[locale],
      mediaType: page.mediaType
    }
  };
  
  // Add media if available
  if (imageIndex !== null && images.length > 0 && images[imageIndex]) {
    const image = images[imageIndex];
    const imageId = image.id || image.attributes?.id;
    if (imageId) {
      payload.data.media = imageId;
    }
  }
  
  // If page exists, update it with media
  if (existingPage) {
    // Strapi v5 uses documentId for updates, fallback to id
    const id = existingPage.documentId || existingPage.id || existingPage.attributes?.id || (existingPage.data && (existingPage.data.documentId || existingPage.data.id));
    if (!id) {
      console.error(`Error: No ID found for hero page (${locale})`);
      return null;
    }
    try {
      const response = await makeRequest(`${API_URL}/pages/${id}`, 'PUT', payload);
      return { ...response, updated: true };
    } catch (error) {
      console.error(`Error updating hero page (${locale}) (ID: ${id}):`, error.message);
      return null;
    }
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

async function seedImages() {
  console.log('\n📸 Uploading images to Strapi Media Library...');
  
  // List of images to upload (from public/assets or URLs)
  // You can add more images here - they will be automatically assigned to team members, clients, and hero pages
  const imagesToUpload = [
    { path: 'public/assets/Image (6).png', alt: 'Team member photo' },
    { path: 'public/assets/depositphotos_153537908-stock-photo-arab-man-drink-coffee-in.jpg', alt: 'Team member photo' },
    // Add more images as needed - you can also use URLs:
    // { path: 'https://example.com/image.jpg', alt: 'Description' },
  ];
  
  // If no images specified, skip upload
  if (imagesToUpload.length === 0) {
    console.log('  ⏭️  No images specified for upload, skipping...');
    return [];
  }

  const uploadedImages = [];
  
  for (const image of imagesToUpload) {
    try {
      console.log(`  📤 Uploading: ${image.path}...`);
      const result = await uploadImage(image.path, image.alt);
      const imageId = result.id || result.data?.id;
      if (imageId) {
        uploadedImages.push({ id: imageId, ...result });
        console.log(`  ✅ Uploaded: ${image.path} (ID: ${imageId})`);
      } else {
        console.log(`  ⚠️  Uploaded but no ID returned: ${image.path}`);
      }
      await new Promise(resolve => setTimeout(resolve, 500)); // Delay between uploads
    } catch (error) {
      console.error(`  ❌ Error uploading ${image.path}:`, error.message);
    }
  }
  
  return uploadedImages;
}

async function seedData() {
  console.log('🌱 Starting data seeding...\n');
  console.log(`📡 Connecting to: ${STRAPI_URL}\n`);
  
  // First, upload images if needed
  const uploadedImages = await seedImages();

  // Create services (both English and Arabic versions) - only if they don't exist
  console.log('📋 Processing services...');
  for (const service of services) {
    // Check and create English version
    const enResult = await createService(service, 'en');
    if (enResult) console.log(`✅ Created service: ${service.title.en}`);
    
    // Check and create Arabic version
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
  
  // Get uploaded images (combine newly uploaded with existing)
  console.log('📸 Fetching uploaded images...');
  const existingImages = await getUploadedImages();
  const allImages = [...uploadedImages, ...existingImages];
  console.log(`✅ Found ${allImages.length} image(s) in Media Library (${uploadedImages.length} newly uploaded, ${existingImages.length} existing)`);
  
  // Get updated list after deletion (refresh to get correct IDs)
  const updatedExistingMembers = await getExistingTeamMembers();
  console.log(`📋 After cleanup: ${updatedExistingMembers.length} team member(s) remaining`);
  
  // Create or update team members with images
  let imageIndex = 0;
  for (const member of teamMembers) {
    const existingMember = await findTeamMemberByName(updatedExistingMembers, member.name);
    
    if (existingMember) {
      // Update existing member with image
      const result = await createTeamMember(member, imageIndex, allImages, existingMember);
      if (result) {
        const imageInfo = allImages[imageIndex] ? ` (image ${imageIndex + 1})` : '';
        console.log(`🔄 Updated team member: ${member.name}${imageInfo}`);
      }
    } else {
      // Create new member if doesn't exist
      const result = await createTeamMember(member, imageIndex, allImages, null);
      if (result) {
        const imageInfo = allImages[imageIndex] ? ` (image ${imageIndex + 1})` : '';
        console.log(`✅ Created team member: ${member.name}${imageInfo}`);
      }
    }
    
    imageIndex = (imageIndex + 1) % Math.max(allImages.length, 1); // Cycle through images
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
  
  // Create or update clients with images
  let clientImageIndex = 0;
  for (const client of clients) {
    const existingClient = await findClientByName(updatedExistingClients, client.name);
    if (existingClient) {
      const result = await createClient(client, clientImageIndex, allImages, existingClient);
      if (result) {
        const imageInfo = allImages[clientImageIndex] ? ` (image ${clientImageIndex + 1})` : '';
        console.log(`🔄 Updated client: ${client.name}${imageInfo}`);
      }
    } else {
      // Create new client if doesn't exist
      const result = await createClient(client, clientImageIndex, allImages, null);
      if (result) {
        const imageInfo = allImages[clientImageIndex] ? ` (image ${clientImageIndex + 1})` : '';
        console.log(`✅ Created client: ${client.name}${imageInfo}`);
      }
    }
    clientImageIndex = (clientImageIndex + 1) % Math.max(allImages.length, 1);
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
  
  // Create or update pages with images
  let pageImageIndex = 0;
  for (const page of heroPages) {
    // Check English version
    const existingEnPage = await findHeroPageByTitle(updatedExistingPages, page.title.en);
    const enResult = await createHeroPage(page, 'en', pageImageIndex, allImages, existingEnPage);
    if (enResult) {
      const imageInfo = allImages[pageImageIndex] ? ` (image ${pageImageIndex + 1})` : '';
      const action = enResult.updated ? 'Updated' : 'Created';
      console.log(`✅ ${action} hero page: ${page.title.en}${imageInfo}`);
    }
    
    // Check Arabic version (use same image)
    const existingArPage = await findHeroPageByTitle(updatedExistingPages, page.title.ar);
    const arResult = await createHeroPage(page, 'ar', pageImageIndex, allImages, existingArPage);
    if (arResult) {
      const imageInfo = allImages[pageImageIndex] ? ` (image ${pageImageIndex + 1})` : '';
      const action = arResult.updated ? 'Updated' : 'Created';
      console.log(`✅ ${action} hero page: ${page.title.ar}${imageInfo}`);
    }

    pageImageIndex = (pageImageIndex + 1) % Math.max(allImages.length, 1);
    await new Promise(resolve => setTimeout(resolve, 200));
  }

  console.log('\n✨ Data seeding completed!');
  console.log(`\n📊 Summary:`);
  console.log(`   - Services: ${services.length * 2} (${services.length} EN + ${services.length} AR)`);
  console.log(`   - Team Members: ${teamMembers.length} (5 EN + 5 AR)`);
  console.log(`   - Clients: ${clients.length} (5 EN + 5 AR)`);
  console.log(`   - Hero Pages: ${heroPages.length * 2} (${heroPages.length} EN + ${heroPages.length} AR)`);
  console.log(`\n✨ Images have been automatically uploaded and assigned!`);
}

// Run the seed script
seedData().catch(console.error);
