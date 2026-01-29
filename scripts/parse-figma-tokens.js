// Скрипт для парсинга дизайн-токенов из Figma
// Использование: node scripts/parse-figma-tokens.js figma-colors.json

const fs = require('fs');
const path = require('path');

function parseFigmaColors(jsonPath) {
  try {
    const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    
    // Парсим цвета в формат для Tailwind
    const colors = {};
    
    if (data.colors) {
      Object.entries(data.colors).forEach(([name, value]) => {
        // Преобразуем название цвета в формат kebab-case
        const key = name.toLowerCase().replace(/\s+/g, '-');
        colors[key] = value;
      });
    }
    
    return colors;
  } catch (error) {
    console.error('Ошибка при парсинге цветов:', error);
    return null;
  }
}

function parseFigmaTypography(jsonPath) {
  try {
    const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    
    const typography = {
      fontFamily: {},
      fontSize: {},
      fontWeight: {},
      lineHeight: {},
    };
    
    if (data.typography) {
      // Парсим типографику
      Object.entries(data.typography).forEach(([name, value]) => {
        const key = name.toLowerCase().replace(/\s+/g, '-');
        typography.fontSize[key] = `${value.fontSize}px`;
        typography.fontWeight[key] = value.fontWeight || '400';
        typography.lineHeight[key] = value.lineHeight || '1.5';
      });
    }
    
    return typography;
  } catch (error) {
    console.error('Ошибка при парсинге типографики:', error);
    return null;
  }
}

// Если скрипт запущен напрямую
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log('Использование: node scripts/parse-figma-tokens.js <colors.json> [typography.json]');
    process.exit(1);
  }
  
  const colorsPath = args[0];
  const typographyPath = args[1];
  
  if (colorsPath) {
    const colors = parseFigmaColors(colorsPath);
    if (colors) {
      console.log('Найденные цвета:');
      console.log(JSON.stringify(colors, null, 2));
    }
  }
  
  if (typographyPath) {
    const typography = parseFigmaTypography(typographyPath);
    if (typography) {
      console.log('\nНайденная типографика:');
      console.log(JSON.stringify(typography, null, 2));
    }
  }
}

module.exports = { parseFigmaColors, parseFigmaTypography };
