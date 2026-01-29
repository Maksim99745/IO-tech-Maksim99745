const fs = require('fs');
const path = require('path');

function parseDesignTokens(filePath) {
  try {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    const colors = {};
    const typography = {};
    const spacing = {};
    const other = {};
    
    function processValue(key, value, prefix = '') {
      const fullKey = prefix ? `${prefix}-${key}` : key;
      
      if (value.type === 'color' && value.value) {
        colors[fullKey] = value.value;
      } else if (value.type === 'typography' && value.value) {
        typography[fullKey] = value.value;
      } else if (value.type === 'dimension' && value.value) {
        spacing[fullKey] = value.value;
      } else if (typeof value === 'object' && value !== null) {
        if (value.value !== undefined) {
          other[fullKey] = value.value;
        }
        Object.keys(value).forEach(subKey => {
          if (subKey !== 'type' && subKey !== 'value' && subKey !== 'extensions') {
            processValue(subKey, value[subKey], fullKey);
          }
        });
      }
    }
    
    Object.keys(data).forEach(collectionName => {
      const collection = data[collectionName];
      Object.keys(collection).forEach(tokenName => {
        processValue(tokenName, collection[tokenName]);
      });
    });
    
    return { colors, typography, spacing, other };
  } catch (error) {
    console.error('Ошибка при парсинге токенов:', error);
    return null;
  }
}

function generateTailwindConfig(tokens) {
  if (!tokens) return null;
  
  const config = {
    colors: {},
    fontSize: {},
    spacing: {},
  };
  
  Object.entries(tokens.colors).forEach(([key, value]) => {
    const cleanKey = key.toLowerCase().replace(/\s+/g, '-');
    config.colors[cleanKey] = value;
  });
  
  Object.entries(tokens.spacing).forEach(([key, value]) => {
    const cleanKey = key.toLowerCase().replace(/\s+/g, '-');
    config.spacing[cleanKey] = value;
  });
  
  return config;
}

if (require.main === module) {
  const filePath = process.argv[2] || './design-tokens.tokens.json';
  
  console.log('Парсинг дизайн-токенов из:', filePath);
  const tokens = parseDesignTokens(filePath);
  
  if (tokens) {
    console.log('\n=== Найденные цвета ===');
    console.log(JSON.stringify(tokens.colors, null, 2));
    
    console.log('\n=== Найденная типографика ===');
    console.log(JSON.stringify(tokens.typography, null, 2));
    
    console.log('\n=== Найденные отступы ===');
    console.log(JSON.stringify(tokens.spacing, null, 2));
    
    console.log('\n=== Другие токены ===');
    console.log(JSON.stringify(tokens.other, null, 2));
    
    const tailwindConfig = generateTailwindConfig(tokens);
    console.log('\n=== Конфигурация для Tailwind ===');
    console.log(JSON.stringify(tailwindConfig, null, 2));
  }
}

module.exports = { parseDesignTokens, generateTailwindConfig };
