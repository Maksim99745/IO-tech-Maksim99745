# Тестовые данные для Strapi

## Примеры данных для заполнения коллекций

### 1. Pages (HeroSection)

**EN:**
```json
{
  "title": "Law Firm is one of the leading legal offices",
  "subtitle": "Exceptional advisory services for individuals and companies",
  "description": "Our mission is to provide comprehensive and specialized legal support",
  "ctaText": "Read more",
  "ctaLink": "/services",
  "mediaType": "image",
  "locale": "en"
}
```

**AR:**
```json
{
  "title": "مكتب المحاماة هو أحد المكاتب القانونية الرائدة",
  "subtitle": "خدمات استشارية استثنائية للأفراد والشركات",
  "description": "مهمتنا هي تقديم الدعم القانوني الشامل والمتخصص",
  "ctaText": "اقرأ المزيد",
  "ctaLink": "/services",
  "mediaType": "image",
  "locale": "ar"
}
```

---

### 2. Services (примеры)

**Legal Consultation Services:**
```json
{
  "slug": "legal-consultation-services",
  "title": "Legal Consultation Services",
  "description": "Comprehensive legal consultations covering all legal aspects",
  "content": "At Law Firm, we provide comprehensive legal consultations covering all legal aspects that our clients may encounter in their daily lives or business activities...",
  "locale": "en"
}
```

**Foreign Investment Services:**
```json
{
  "slug": "foreign-investment-services",
  "title": "Foreign Investment Services",
  "description": "Expert guidance for foreign investors",
  "locale": "en"
}
```

**Contracts:**
```json
{
  "slug": "contracts",
  "title": "Contracts",
  "description": "Drafting and reviewing all types of contracts",
  "locale": "en"
}
```

*И так далее для всех 18 услуг из дизайна*

---

### 3. Team Members (примеры)

**Member 1:**
```json
{
  "name": "Mohammed Bin Hinay Al-Ghamdi",
  "role": "Senior Partner",
  "email": "mohammed@lawfirm.com",
  "phone": "+966 50 123 4567",
  "whatsapp": "+966 50 123 4567",
  "locale": "en"
}
```

**Member 2:**
```json
{
  "name": "Ahmed Al-Saud",
  "role": "Legal Advisor",
  "email": "ahmed@lawfirm.com",
  "phone": "+966 50 234 5678",
  "whatsapp": "+966 50 234 5678",
  "locale": "en"
}
```

**Member 3:**
```json
{
  "name": "Khalid Al-Rashid",
  "role": "Corporate Lawyer",
  "email": "khalid@lawfirm.com",
  "phone": "+966 50 345 6789",
  "whatsapp": "+966 50 345 6789",
  "locale": "en"
}
```

---

### 4. Clients (примеры)

**Client 1:**
```json
{
  "name": "Mohammed Saif",
  "position": "CEO",
  "company": "Tech Solutions Inc.",
  "testimonial": "With the help of the hospitable staff of Al Safar and Partners I was able to get my work done without any hassle. The help I received helped me a great deal to overcome the issues that I faced. I was always updated about my case and my queries never went unanswered.",
  "locale": "en"
}
```

**Client 2:**
```json
{
  "name": "Sarah Al-Mansouri",
  "position": "Director",
  "company": "Global Investments",
  "testimonial": "Excellent service and professional team. They provided comprehensive legal support for our international expansion.",
  "locale": "en"
}
```

---

## Инструкция по заполнению

1. **Откройте Strapi Admin:** http://localhost:1337/admin
2. **Создайте коллекции** согласно STRAPI_COLLECTIONS.md
3. **Заполните данные:**
   - Сначала создайте Pages (HeroSection)
   - Затем Services (все 18 услуг)
   - Затем Team Members (минимум 3)
   - Затем Clients (минимум 2-3)
4. **Загрузите медиа:**
   - Фоновое изображение для HeroSection (городской пейзаж)
   - Фото для Team Members
   - Фото для Clients
   - Изображения для Services (опционально)

## Важно:

- Все поля с `locale` должны иметь значения "en" и "ar" для мультиязычности
- Slug для Services должен быть уникальным и URL-friendly
- Email для Subscribers должен быть уникальным
- Медиа файлы загружаются через Media Library в Strapi
