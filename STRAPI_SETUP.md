# Настройка Strapi CMS

## Установка

```bash
npx create-strapi-app@latest strapi-backend --quickstart
```

Дождитесь установки и создания админа.

---

## Создание коллекций

### Вариант 1: Импорт из файлов (самый быстрый) ⚡⚡

1. Откройте Strapi Admin: http://localhost:1337/admin
2. Перейдите в **Content-Type Builder**
3. Нажмите **"Import from computer"**
4. Выберите файлы из папки `strapi-schemas/`:
   - `page.json`
   - `service.json`
   - `team-member.json`
   - `client.json`
   - `subscriber.json`

**Время:** ~1-2 минуты

**Файлы:** См. папку `strapi-schemas/`

---

### Вариант 2: Через Strapi AI ⚡

1. Откройте Strapi Admin: http://localhost:1337/admin
2. Найдите **Strapi AI** (в правом верхнем углу или в меню)
3. Скопируйте промпт из **STRAPI_AI_PROMPT.md**
4. Вставьте в Strapi AI и дождитесь создания

**Время:** ~2-3 минуты

---

### Вариант 3: Ручное создание (10-15 минут)

**Откройте:** http://localhost:1337/admin → **Content-Type Builder** → **Create new collection type**

**Откройте:** http://localhost:1337/admin → **Content-Type Builder** → **Create new collection type**

### 1. Page (для HeroSection)

**Display name:** `Page`  
**API ID:** `page` / `pages`

**Поля (Add another field для каждого):**

1. `title` → Text → Short text → ✅ Required
2. `subtitle` → Text → Short text
3. `description` → Text → Long text
4. `ctaText` → Text → Short text
5. `ctaLink` → Text → Short text
6. `media` → Media → Single → Images, Videos
7. `mediaType` → Enumeration → Values: `image` и `video` (по одному на строку)
8. `locale` → Text → Short text → ✅ Required

**Save**

---

### 2. Service

**Display name:** `Service`  
**API ID:** `service` / `services`

**Поля:**

1. `slug` → Text → Short text → ✅ Required → ✅ Unique
2. `title` → Text → Short text → ✅ Required
3. `description` → Text → Long text
4. `content` → Rich text
5. `image` → Media → Single → Images
6. `locale` → Text → Short text → ✅ Required

**Save**

---

### 3. Team Member

**Display name:** `Team Member`  
**API ID:** `team-member` / `team-members`

**Поля:**

1. `name` → Text → Short text → ✅ Required
2. `role` → Text → Short text → ✅ Required
3. `image` → Media → Single → Images
4. `whatsapp` → Text → Short text
5. `phone` → Text → Short text
6. `email` → Email
7. `locale` → Text → Short text → ✅ Required

**Save**

---

### 4. Client

**Display name:** `Client`  
**API ID:** `client` / `clients`

**Поля:**

1. `name` → Text → Short text → ✅ Required
2. `position` → Text → Short text
3. `company` → Text → Short text
4. `testimonial` → Text → Long text → ✅ Required
5. `image` → Media → Single → Images
6. `locale` → Text → Short text → ✅ Required

**Save**

---

### 5. Subscriber

**Display name:** `Subscriber`  
**API ID:** `subscriber` / `subscribers`

**Поля:**

1. `email` → Email → ✅ Required → ✅ Unique

**Save**

---

## Настройка Permissions

**Важно:** После импорта коллекций нужно настроить permissions!

1. **Settings** (шестеренка внизу слева)
2. **Users & Permissions plugin** (в списке плагинов)
3. **Roles**
4. **Если есть роль "Public"** - откройте её
5. **Если НЕТ роли "Public"** - создайте:
   - Нажмите **"Add new role"**
   - Name: `Public`
   - Description: `Public access for API`
   - **Save**

В разделе **Permissions** для каждой коллекции (Page, Service, Team Member, Client, Subscriber):
- ✅ Отметьте **Read** (в Strapi v4+ это включает find и findOne)

Для **Subscriber** дополнительно:
- ✅ Отметьте **Create**

**ВАЖНО:** Нажмите **Save** и дождитесь сохранения! Без сохранения будет ошибка 401.

**Детальная инструкция:** См. `STRAPI_PERMISSIONS.md`

---

## Переменная окружения

Создайте `.env.local` в корне Next.js проекта:

```env
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
```

---

## Готово! ✅

Теперь можно заполнять коллекции данными. Примеры в `STRAPI_TEST_DATA.md`
