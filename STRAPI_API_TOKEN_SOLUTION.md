# Решение через API Token (если Public не работает)

Если Public role все еще не работает после всех попыток, используем API Token.

---

## Шаг 1: Создайте API Token

1. В Strapi Admin: **Settings** → **API Tokens**
2. Нажмите **"Create new API Token"**
3. Заполните:
   - **Name:** `Frontend Access`
   - **Token type:** **Read-only** (или Full access, если нужен create для Subscribers)
   - **Token duration:** **Unlimited**
4. Нажмите **Save**
5. **Скопируйте токен** (он показывается только один раз!)

---

## Шаг 2: Добавьте токен в .env.local

```env
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
NEXT_PUBLIC_STRAPI_TOKEN=your_token_here
```

---

## Шаг 3: Обновите API клиент

Файл уже обновлен - токен будет использоваться автоматически, если указан в .env.local

---

## Шаг 4: Перезапустите Next.js

```bash
# Остановите Next.js (Ctrl+C)
npm run dev
```

---

## Проверка:

После этого API должен работать с токеном вместо Public role.
