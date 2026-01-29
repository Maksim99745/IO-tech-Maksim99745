"use client";

import { useEffect, useState } from "react";
import { strapiApi } from "@/lib/api/strapi";
import { Service, TeamMember, Client } from "@/types";

export default function StrapiTest() {
  const [services, setServices] = useState<Service[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [apiUrl, setApiUrl] = useState<string>("");

  useEffect(() => {
    setApiUrl(process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337");
    
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Сначала проверяем через API route (Server-side)
        const testResponse = await fetch('/api/test-strapi');
        const testData = await testResponse.json();
        
        if (!testResponse.ok) {
          setError(`Server-side error: ${testData.error}\nDetails: ${JSON.stringify(testData, null, 2)}`);
          return;
        }

        // Если серверный запрос работает, делаем клиентские запросы
        const [servicesData, teamData, clientsData] = await Promise.all([
          strapiApi.getServices("en", 1, 10),
          strapiApi.getTeamMembers("en"),
          strapiApi.getClients("en"),
        ]);

        setServices(servicesData.data);
        setTeamMembers(teamData);
        setClients(clientsData);
      } catch (err: any) {
        setError(err.message || "Failed to fetch data from Strapi");
        console.error("Strapi API Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-brown-dark text-white p-6 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">🔌 Проверка подключения к Strapi...</h2>
          <p className="text-gray-300">Загрузка данных...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
      <div className="bg-red-900 text-white p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">❌ Ошибка 401: Unauthorized</h2>
        <p className="mb-2"><strong>Ошибка:</strong> {error}</p>
        <p className="mb-2"><strong>API URL:</strong> {apiUrl}</p>
        <div className="mt-4 text-sm">
          <p className="mb-2 font-bold">Это означает, что Permissions не настроены!</p>
          <p className="mb-2">Быстрое исправление:</p>
          <ol className="list-decimal list-inside space-y-2 mb-4">
            <li>Откройте Strapi Admin: <a href="http://localhost:1337/admin" target="_blank" className="text-blue-300 underline">http://localhost:1337/admin</a></li>
            <li>Settings → Users & Permissions plugin → Roles → Public</li>
            <li>Для каждой коллекции отметьте <strong>Read</strong></li>
            <li>Для Subscriber дополнительно отметьте <strong>Create</strong></li>
            <li><strong>Нажмите Save и дождитесь сохранения!</strong></li>
            <li>Перезапустите Strapi</li>
          </ol>
          <p className="text-xs text-gray-300">Подробная инструкция: см. STRAPI_QUICK_FIX.md</p>
        </div>
      </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-green-900 text-white p-6 rounded-lg mb-6">
        <h2 className="text-2xl font-bold mb-2">✅ Подключение к Strapi работает!</h2>
        <p className="text-gray-300"><strong>API URL:</strong> {apiUrl}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-brown-dark text-white p-4 rounded-lg">
          <h3 className="text-xl font-bold mb-2">Services</h3>
          <p className="text-3xl font-bold">{services.length}</p>
          <p className="text-sm text-gray-400 mt-2">
            {services.length === 0 ? "Нет данных" : "Услуг загружено"}
          </p>
        </div>

        <div className="bg-brown-dark text-white p-4 rounded-lg">
          <h3 className="text-xl font-bold mb-2">Team Members</h3>
          <p className="text-3xl font-bold">{teamMembers.length}</p>
          <p className="text-sm text-gray-400 mt-2">
            {teamMembers.length === 0 ? "Нет данных" : "Членов команды"}
          </p>
        </div>

        <div className="bg-brown-dark text-white p-4 rounded-lg">
          <h3 className="text-xl font-bold mb-2">Clients</h3>
          <p className="text-3xl font-bold">{clients.length}</p>
          <p className="text-sm text-gray-400 mt-2">
            {clients.length === 0 ? "Нет данных" : "Клиентов"}
          </p>
        </div>
      </div>

      {services.length > 0 && (
        <div className="mt-6 bg-gray-800 text-white p-4 rounded-lg">
          <h3 className="text-lg font-bold mb-2">Примеры Services:</h3>
          <ul className="space-y-2">
            {services.slice(0, 3).map((service) => (
              <li key={service.id} className="border-b border-gray-700 pb-2">
                <strong>{service.title}</strong>
                {service.description && (
                  <p className="text-sm text-gray-400 mt-1">{service.description.substring(0, 100)}...</p>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {teamMembers.length > 0 && (
        <div className="mt-6 bg-gray-800 text-white p-4 rounded-lg">
          <h3 className="text-lg font-bold mb-2">Примеры Team Members:</h3>
          <ul className="space-y-2">
            {teamMembers.slice(0, 3).map((member) => (
              <li key={member.id} className="border-b border-gray-700 pb-2">
                <strong>{member.name}</strong> - {member.role}
              </li>
            ))}
          </ul>
        </div>
      )}

      {clients.length > 0 && (
        <div className="mt-6 bg-gray-800 text-white p-4 rounded-lg">
          <h3 className="text-lg font-bold mb-2">Примеры Clients:</h3>
          <ul className="space-y-2">
            {clients.slice(0, 3).map((client) => (
              <li key={client.id} className="border-b border-gray-700 pb-2">
                <strong>{client.name}</strong>
                {client.company && <span className="text-gray-400"> - {client.company}</span>}
              </li>
            ))}
          </ul>
        </div>
      )}

      {services.length === 0 && teamMembers.length === 0 && clients.length === 0 && (
        <div className="mt-6 bg-yellow-900 text-white p-4 rounded-lg">
          <p className="mb-2">⚠️ Подключение работает, но данных нет.</p>
          <p className="text-sm">Заполните коллекции в Strapi Admin (см. STRAPI_TEST_DATA.md)</p>
        </div>
      )}
    </div>
  );
}
