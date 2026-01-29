# Промпт для Strapi AI

## 📋 Скопируйте весь текст ниже в Strapi AI:

---

```
Создай 5 коллекций для сайта юридической фирмы с мультиязычностью:

КОЛЛЕКЦИЯ 1: Page
- Display name: Page
- API ID: page (singular) / pages (plural)
- Поля:
  * title: Text, Short text, Required
  * subtitle: Text, Short text
  * description: Text, Long text
  * ctaText: Text, Short text
  * ctaLink: Text, Short text
  * media: Media, Single, Images and Videos
  * mediaType: Enumeration (values: image, video)
  * locale: Text, Short text, Required

КОЛЛЕКЦИЯ 2: Service
- Display name: Service
- API ID: service / services
- Поля:
  * slug: Text, Short text, Required, Unique
  * title: Text, Short text, Required
  * description: Text, Long text
  * content: Rich text
  * image: Media, Single, Images
  * locale: Text, Short text, Required

КОЛЛЕКЦИЯ 3: Team Member
- Display name: Team Member
- API ID: team-member / team-members
- Поля:
  * name: Text, Short text, Required
  * role: Text, Short text, Required
  * image: Media, Single, Images
  * whatsapp: Text, Short text
  * phone: Text, Short text
  * email: Email
  * locale: Text, Short text, Required

КОЛЛЕКЦИЯ 4: Client
- Display name: Client
- API ID: client / clients
- Поля:
  * name: Text, Short text, Required
  * position: Text, Short text
  * company: Text, Short text
  * testimonial: Text, Long text, Required
  * image: Media, Single, Images
  * locale: Text, Short text, Required

КОЛЛЕКЦИЯ 5: Subscriber
- Display name: Subscriber
- API ID: subscriber / subscribers
- Поля:
  * email: Email, Required, Unique

После создания всех коллекций настрой permissions:
- Settings > Users & Permissions Plugin > Roles > Public
- Для всех коллекций (Page, Service, Team Member, Client, Subscriber): разреши find и findOne
- Для Subscriber дополнительно разреши: create
```

---

## Как использовать:

1. Откройте Strapi Admin: http://localhost:1337/admin
2. Найдите **Strapi AI** (обычно в правом верхнем углу или в меню)
3. Скопируйте промпт выше
4. Вставьте в Strapi AI
5. Дождитесь создания коллекций

---

## Альтернативный короткий промпт:

Если первый не работает, попробуйте более короткий:

```
Создай коллекции для сайта юридической фирмы:

1. Page - для HeroSection (title, subtitle, description, ctaText, ctaLink, media, mediaType, locale)
2. Service - услуги (slug unique, title, description, content, image, locale)
3. Team Member - команда (name, role, image, whatsapp, phone, email, locale)
4. Client - клиенты и отзывы (name, position, company, testimonial, image, locale)
5. Subscriber - подписки (email unique)

Все коллекции должны поддерживать мультиязычность через поле locale.
Настрой permissions: Public role может find/findOne все коллекции, и create для Subscriber.
```

---

## После создания через AI:

1. Проверьте, что все коллекции созданы
2. Проверьте permissions в Settings > Users & Permissions Plugin > Roles > Public
3. Заполните тестовыми данными (см. STRAPI_TEST_DATA.md)
