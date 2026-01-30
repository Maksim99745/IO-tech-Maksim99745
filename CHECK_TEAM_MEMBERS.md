# Проверка Team Members в Strapi

## Проблема: "No team members available"

### Возможные причины:

1. **Нет данных в Strapi**
   - Откройте Strapi Admin: http://localhost:1337/admin
   - Перейдите в Content Manager → Team Member
   - Проверьте, есть ли записи
   - Если нет - создайте записи

2. **Проблема с локализацией**
   - Убедитесь, что записи созданы для нужной локали (en или ar)
   - Проверьте, что i18n включен для Team Member коллекции

3. **Проблема с правами доступа**
   - Settings → Users & Permissions → Roles → Public
   - Убедитесь, что для Team Member включены:
     - ✅ find (Read)
     - ✅ findOne (Read)

4. **Проблема с API**
   - Проверьте консоль браузера на ошибки
   - Проверьте, что Strapi запущен: http://localhost:1337
   - Проверьте API напрямую: http://localhost:1337/api/team-members?locale=en

### Быстрая проверка:

```bash
# Проверка через curl
curl http://localhost:1337/api/team-members?locale=en

# С токеном
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:1337/api/team-members?locale=en
```

### Решение:

1. **Добавьте данные в Strapi:**
   - Откройте Strapi Admin
   - Content Manager → Team Member
   - Создайте записи с:
     - name (обязательно)
     - role (обязательно)
     - image (опционально)
     - whatsapp, phone, email (опционально)

2. **Проверьте локализацию:**
   - Убедитесь, что записи созданы для локали "en"
   - Если используете "ar", создайте записи для "ar"

3. **Проверьте права:**
   - Settings → Users & Permissions → Roles → Public
   - Team Member → find, findOne должны быть включены

### Тест в браузере:

Откройте консоль браузера (F12) и проверьте:
- Есть ли ошибки при загрузке
- Что показывает `console.log("Team members received:", members)`
