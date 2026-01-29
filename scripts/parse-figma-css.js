const fs = require('fs');
const path = require('path');

function parseFigmaCSS(cssContent) {
  const colors = new Set();
  const typography = {};
  const spacing = {};
  const other = {};
  
  // Извлекаем цвета (hex, rgb, rgba)
  const colorRegex = /#([0-9a-fA-F]{3,8})|rgba?\([^)]+\)/g;
  const colorMatches = cssContent.match(colorRegex);
  if (colorMatches) {
    colorMatches.forEach(color => colors.add(color));
  }
  
  // Извлекаем font-family
  const fontFamilyRegex = /font-family:\s*([^;]+);/gi;
  const fontMatches = cssContent.match(fontFamilyRegex);
  if (fontMatches) {
    typography.fontFamily = fontMatches[0].replace(/font-family:\s*/i, '').replace(/;$/, '').trim();
  }
  
  // Извлекаем font-size
  const fontSizeRegex = /font-size:\s*([^;]+);/gi;
  const fontSizeMatches = cssContent.match(fontSizeRegex);
  if (fontSizeMatches) {
    typography.fontSizes = [...new Set(fontSizeMatches.map(m => m.replace(/font-size:\s*/i, '').replace(/;$/, '').trim()))];
  }
  
  // Извлекаем font-weight
  const fontWeightRegex = /font-weight:\s*([^;]+);/gi;
  const fontWeightMatches = cssContent.match(fontWeightRegex);
  if (fontWeightMatches) {
    typography.fontWeights = [...new Set(fontWeightMatches.map(m => m.replace(/font-weight:\s*/i, '').replace(/;$/, '').trim()))];
  }
  
  // Извлекаем line-height
  const lineHeightRegex = /line-height:\s*([^;]+);/gi;
  const lineHeightMatches = cssContent.match(lineHeightRegex);
  if (lineHeightMatches) {
    typography.lineHeights = [...new Set(lineHeightMatches.map(m => m.replace(/line-height:\s*/i, '').replace(/;$/, '').trim()))];
  }
  
  // Извлекаем padding и margin
  const spacingRegex = /(padding|margin|gap):\s*([^;]+);/gi;
  const spacingMatches = cssContent.match(spacingRegex);
  if (spacingMatches) {
    spacingMatches.forEach(match => {
      const [property, value] = match.split(':').map(s => s.trim());
      const cleanValue = value.replace(/;$/, '');
      if (!spacing[property]) {
        spacing[property] = [];
      }
      spacing[property].push(cleanValue);
    });
  }
  
  // Извлекаем border-radius
  const borderRadiusRegex = /border-radius:\s*([^;]+);/gi;
  const borderRadiusMatches = cssContent.match(borderRadiusRegex);
  if (borderRadiusMatches) {
    other.borderRadius = [...new Set(borderRadiusMatches.map(m => m.replace(/border-radius:\s*/i, '').replace(/;$/, '').trim()))];
  }
  
  return {
    colors: Array.from(colors),
    typography,
    spacing,
    other
  };
}

function generateTailwindFromCSS(tokens) {
  const config = {
    colors: {},
    fontSize: {},
    spacing: {},
    borderRadius: {},
  };
  
  // Обрабатываем цвета
  tokens.colors.forEach((color, index) => {
    if (color.startsWith('#')) {
      // Определяем название цвета по значению
      const colorName = getColorName(color);
      config.colors[colorName] = color;
    } else if (color.startsWith('rgb')) {
      config.colors[`custom-${index}`] = color;
    }
  });
  
  // Обрабатываем типографику
  if (tokens.typography.fontSizes) {
    tokens.typography.fontSizes.forEach((size, index) => {
      config.fontSize[`text-${index + 1}`] = size;
    });
  }
  
  // Обрабатываем spacing
  Object.entries(tokens.spacing).forEach(([property, values]) => {
    const uniqueValues = [...new Set(values)];
    uniqueValues.forEach((value, index) => {
      const key = `${property}-${index}`;
      config.spacing[key] = value;
    });
  });
  
  return config;
}

function getColorName(hex) {
  // Простое определение цвета по hex
  const colorMap = {
    '#ffffff': 'white',
    '#ffffffff': 'white',
    '#000000': 'black',
    '#000000ff': 'black',
  };
  
  return colorMap[hex.toLowerCase()] || hex;
}

if (require.main === module) {
  const filePath = process.argv[2];
  
  if (!filePath) {
    console.log('Использование: node scripts/parse-figma-css.js <css-file>');
    process.exit(1);
  }
  
  try {
    const cssContent = fs.readFileSync(filePath, 'utf8');
    const tokens = parseFigmaCSS(cssContent);
    
    console.log('=== Найденные цвета ===');
    console.log(JSON.stringify(tokens.colors, null, 2));
    
    console.log('\n=== Найденная типографика ===');
    console.log(JSON.stringify(tokens.typography, null, 2));
    
    console.log('\n=== Найденные отступы ===');
    console.log(JSON.stringify(tokens.spacing, null, 2));
    
    console.log('\n=== Другие свойства ===');
    console.log(JSON.stringify(tokens.other, null, 2));
    
    const tailwindConfig = generateTailwindFromCSS(tokens);
    console.log('\n=== Конфигурация для Tailwind ===');
    console.log(JSON.stringify(tailwindConfig, null, 2));
    
  } catch (error) {
    console.error('Ошибка:', error.message);
    process.exit(1);
  }
}

module.exports = { parseFigmaCSS, generateTailwindFromCSS };
