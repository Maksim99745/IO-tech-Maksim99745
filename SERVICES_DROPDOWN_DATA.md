# Данные для Services Dropdown

## Структура услуг (4 колонки):

### Колонка 1:
- Legal Consultation Services
- Foreign Investment Services
- Contracts
- Notarization
- Insurance

### Колонка 2:
- ...and Defense in All Cases
- Banks and Financial Institutions
- Corporate Governance Services
- Companies Liquidation
- Internal Regulations for Companies

### Колонка 3:
- Services for Companies and Institutions
- Arbitration
- Intellectual Property
- Corporate Restructuring and Reorganization

### Колонка 4:
- Establishing National and Foreign Companies
- Commercial Agencies
- Supporting Vision 2030
- Estates

## Обновление в Strapi:

Если нужно обновить данные в Strapi, создайте записи Services с такими slug:

1. `legal-consultation`
2. `foreign-investment`
3. `contracts`
4. `notarization`
5. `insurance`
6. `defense`
7. `banks-financial`
8. `corporate-governance`
9. `companies-liquidation`
10. `internal-regulations`
11. `companies-institutions`
12. `arbitration`
13. `intellectual-property`
14. `corporate-restructuring`
15. `establishing-companies`
16. `commercial-agencies`
17. `vision-2030`
18. `estates`

## Текущая реализация:

Сейчас dropdown использует статичный список услуг. Если нужно получать данные из Strapi, можно обновить компонент для использования API.
