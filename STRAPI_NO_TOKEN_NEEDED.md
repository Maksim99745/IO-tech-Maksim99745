# Токен НЕ нужен для Public role!

## Важно понимать:

**Public role** - это роль для **анонимного доступа** через API. Токен для неё **НЕ нужен**!

Токены нужны только для:
- **API Tokens** - для программного доступа с правами
- **Transfer Tokens** - для миграций
- **Авторизованных пользователей** - для доступа с правами пользователя

---

## Если все еще ошибка 401:

Проблема **НЕ в токене**, а в **Permissions**!

### Проверьте:

1. **Откройте роль Public:**
   - Settings → Users & Permissions plugin → Roles → Public → Edit

2. **Прокрутите до раздела "Permissions"**

3. **Убедитесь, что для КАЖДОЙ коллекции отмечено:**
   - ✅ **Read** (галочка должна быть активной, не серой!)

4. **Попробуйте:**
   - Снять все галочки
   - Сохранить
   - Поставить галочки заново
   - Сохранить еще раз

5. **Перезапустите Strapi:**
   ```bash
   cd strapi-backend
   # Ctrl+C
   npm run develop
   ```

---

## Проверка в браузере:

Откройте напрямую в браузере:
- http://localhost:1337/api/services

**Если видите JSON** (даже `{"data":[]}`) - permissions работают!  
**Если видите 401** - permissions не применены.

---

## Альтернатива: Использовать API Token (если Public не работает)

Если Public role все еще не работает, можно создать API Token:

1. Settings → API Tokens → Create new API Token
2. Name: "Frontend Access"
3. Token type: **Read-only** (или Full access)
4. Duration: Unlimited
5. Скопируйте токен

Затем добавьте в `.env.local`:
```env
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
NEXT_PUBLIC_STRAPI_TOKEN=your_token_here
```

И обновите `lib/api/strapi.ts`:
```typescript
const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    "Content-Type": "application/json",
    ...(process.env.NEXT_PUBLIC_STRAPI_TOKEN && {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
    }),
  },
});
```

Но это **не рекомендуется** - лучше исправить Public role!
