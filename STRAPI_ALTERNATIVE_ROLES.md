# Альтернативные решения для Strapi API

## Вариант 1: Использовать Authenticated role

Если Public role не работает, попробуйте настроить Authenticated role:

1. **Settings** → **Users & Permissions plugin** → **Roles**
2. Найдите роль **Authenticated** (или создайте новую)
3. Настройте те же permissions (Read для всех, Create для Subscriber)
4. Создайте тестового пользователя и используйте его токен

Но это не подходит для публичного доступа.

---

## Вариант 2: Проверить настройки CORS

Возможно, проблема в CORS. Проверьте файл `strapi-backend/config/middlewares.ts`:

```typescript
export default [
  'strapi::logger',
  'strapi::errors',
  {
    name: 'strapi::security',
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          'connect-src': ["'self'", 'https:'],
          'img-src': ["'self'", 'data:', 'blob:', 'res.cloudinary.com'],
          'media-src': ["'self'", 'data:', 'blob:', 'res.cloudinary.com'],
          upgradeInsecureRequests: null,
        },
      },
    },
  },
  {
    name: 'strapi::cors',
    config: {
      enabled: true,
      origin: ['http://localhost:3000', 'http://localhost:1337'],
    },
  },
  'strapi::poweredBy',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];
```

---

## Вариант 3: Проверить логи Strapi

Посмотрите логи Strapi в терминале, где он запущен. Там могут быть подсказки о проблеме.

---

## Вариант 4: Проверить формат запроса

Попробуйте сделать запрос напрямую через браузер или curl:

```bash
# Без токена (Public role)
curl http://localhost:1337/api/services

# С токеном
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:1337/api/services
```

---

## Вариант 5: Пересоздать роль Public

1. Удалите роль Public
2. Создайте новую роль Public
3. Настройте permissions заново
4. Сохраните и перезапустите Strapi

---

## Вариант 6: Проверить версию Strapi

Возможно, в вашей версии Strapi есть баг с Public role. Проверьте версию:

```bash
cd strapi-backend
cat package.json | grep strapi
```

---

## Вариант 7: Использовать API через Server Components

Попробуйте делать запросы на сервере (в Server Components), а не на клиенте. Может быть проблема в CORS или в том, как браузер отправляет запросы.

---

## Самый простой вариант: Проверить в браузере

Откройте напрямую в браузере:
- http://localhost:1337/api/services

Если там тоже 401 - проблема точно в Strapi permissions.
Если там работает - проблема в коде фронтенда или CORS.
