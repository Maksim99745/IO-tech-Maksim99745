# Импорт коллекций Strapi из файлов

## Как использовать:

1. **Откройте Strapi Admin:** http://localhost:1337/admin
2. **Перейдите в Content-Type Builder**
3. **Нажмите "Import from computer"**
4. **Выберите файлы по одному:**
   - `page.json`
   - `service.json`
   - `team-member.json`
   - `client.json`
   - `subscriber.json`

Или импортируйте все сразу, если Strapi поддерживает множественный импорт.

---

## Файлы для импорта:

- ✅ `page.json` - Page (HeroSection)
- ✅ `service.json` - Service (Services)
- ✅ `team-member.json` - Team Member (Team Members)
- ✅ `client.json` - Client (Clients)
- ✅ `subscriber.json` - Subscriber (Subscribers)

---

## После импорта:

1. Проверьте, что все коллекции созданы
2. Настройте Permissions:
   - Settings > Users & Permissions Plugin > Roles > Public
   - Для всех коллекций: find, findOne
   - Для Subscriber: также create
3. Заполните тестовыми данными (см. STRAPI_TEST_DATA.md)

---

## Если импорт не работает:

Используйте альтернативные методы:
- Strapi AI (см. STRAPI_AI_PROMPT.md)
- Ручное создание (см. STRAPI_SETUP.md)
