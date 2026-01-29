const fs = require('fs');
const path = require('path');

function extractDesignTokens(cssPath) {
  const cssContent = fs.readFileSync(cssPath, 'utf8');
  
  const tokens = {
    colors: new Set(),
    typography: {
      fontFamily: new Set(),
      fontSizes: new Set(),
      fontWeights: new Set(),
      lineHeights: new Set(),
    },
    spacing: new Set(),
    borderRadius: new Set(),
    breakpoints: {
      mobile: '768px',
      desktop: '1440px',
    },
  };
  
  // Извлекаем CSS переменные
  const cssVars = {};
  const varRegex = /--([^:]+):\s*([^;]+);/g;
  let match;
  while ((match = varRegex.exec(cssContent)) !== null) {
    const [, name, value] = match;
    cssVars[name.trim()] = value.trim();
  }
  
  // Извлекаем цвета (rgba, rgb, hex)
  const colorRegex = /rgba?\([^)]+\)|#[0-9a-fA-F]{3,8}/gi;
  const colorMatches = cssContent.match(colorRegex);
  if (colorMatches) {
    colorMatches.forEach(color => {
      const normalized = color.toLowerCase();
      if (!normalized.includes('transparent')) {
        tokens.colors.add(normalized);
      }
    });
  }
  
  // Извлекаем font-family
  const fontFamilyRegex = /font-family:\s*['"]?([^'";]+)['"]?/gi;
  const fontMatches = cssContent.match(fontFamilyRegex);
  if (fontMatches) {
    fontMatches.forEach(match => {
      const family = match.replace(/font-family:\s*/i, '').replace(/['";]/g, '').trim();
      if (family && !family.includes('var(')) {
        tokens.typography.fontFamily.add(family);
      }
    });
  }
  
  // Извлекаем font-size
  const fontSizeRegex = /font-size:\s*(\d+px)/gi;
  const fontSizeMatches = cssContent.match(fontSizeRegex);
  if (fontSizeMatches) {
    fontSizeMatches.forEach(match => {
      const size = match.replace(/font-size:\s*/i, '').trim();
      tokens.typography.fontSizes.add(size);
    });
  }
  
  // Извлекаем font-weight
  const fontWeightRegex = /font-weight:\s*(\d+|normal|bold|medium|light)/gi;
  const fontWeightMatches = cssContent.match(fontWeightRegex);
  if (fontWeightMatches) {
    fontWeightMatches.forEach(match => {
      const weight = match.replace(/font-weight:\s*/i, '').trim();
      tokens.typography.fontWeights.add(weight);
    });
  }
  
  // Извлекаем line-height
  const lineHeightRegex = /line-height:\s*(\d+px)/gi;
  const lineHeightMatches = cssContent.match(lineHeightRegex);
  if (lineHeightMatches) {
    lineHeightMatches.forEach(match => {
      const height = match.replace(/line-height:\s*/i, '').trim();
      tokens.typography.lineHeights.add(height);
    });
  }
  
  // Извлекаем spacing (padding, margin)
  const spacingRegex = /(?:padding|margin|gap)(?:-top|-right|-bottom|-left)?:\s*(\d+px)/gi;
  const spacingMatches = cssContent.match(spacingRegex);
  if (spacingMatches) {
    spacingMatches.forEach(match => {
      const spacing = match.match(/\d+px/);
      if (spacing) {
        tokens.spacing.add(spacing[0]);
      }
    });
  }
  
  // Извлекаем border-radius
  const borderRadiusRegex = /border-radius:\s*(\d+px)/gi;
  const borderRadiusMatches = cssContent.match(borderRadiusRegex);
  if (borderRadiusMatches) {
    borderRadiusMatches.forEach(match => {
      const radius = match.replace(/border-radius:\s*/i, '').trim();
      tokens.borderRadius.add(radius);
    });
  }
  
  // Конвертируем rgba в hex где возможно
  const colorMap = {};
  Array.from(tokens.colors).forEach(color => {
    if (color.startsWith('rgba')) {
      const rgbaMatch = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)/);
      if (rgbaMatch) {
        const [, r, g, b] = rgbaMatch;
        const hex = `#${[r, g, b].map(x => parseInt(x).toString(16).padStart(2, '0')).join('')}`;
        colorMap[color] = hex;
      }
    }
  });
  
  return {
    colors: Array.from(tokens.colors).map(c => colorMap[c] || c),
    cssVars,
    typography: {
      fontFamily: Array.from(tokens.typography.fontFamily),
      fontSizes: Array.from(tokens.typography.fontSizes).sort((a, b) => parseInt(a) - parseInt(b)),
      fontWeights: Array.from(tokens.typography.fontWeights),
      lineHeights: Array.from(tokens.typography.lineHeights).sort((a, b) => parseInt(a) - parseInt(b)),
    },
    spacing: Array.from(tokens.spacing).sort((a, b) => parseInt(a) - parseInt(b)),
    borderRadius: Array.from(tokens.borderRadius).sort((a, b) => parseInt(a) - parseInt(b)),
    breakpoints: tokens.breakpoints,
  };
}

function generateTailwindConfig(tokens) {
  // Определяем основные цвета
  const brownColors = tokens.colors.filter(c => {
    if (c.startsWith('#')) {
      const hex = c.replace('#', '');
      const r = parseInt(hex.substr(0, 2), 16);
      const g = parseInt(hex.substr(2, 2), 16);
      const b = parseInt(hex.substr(4, 2), 16);
      // Brown цвета обычно имеют низкие значения и r > g, b
      return r < 150 && g < 100 && b < 100;
    }
    return false;
  });
  
  const whiteColor = tokens.colors.find(c => c === '#ffffff' || c === 'rgba(255, 255, 255, 1)') || '#ffffff';
  const blackColor = tokens.colors.find(c => c === '#000000' || c === 'rgba(0, 0, 0, 1)') || '#000000';
  
  // Основной brown цвет
  const mainBrown = brownColors[0] || '#4b2615'; // rgba(75, 38, 21) = #4b2615
  
  const config = {
    colors: {
      brown: {
        dark: mainBrown,
        DEFAULT: mainBrown,
        light: '#8b6f47',
      },
      white: whiteColor,
      black: blackColor,
    },
    fontFamily: {
      sans: tokens.typography.fontFamily.length > 0 
        ? [tokens.typography.fontFamily[0].split(',')[0].replace(/'/g, ''), 'sans-serif']
        : ['Inter', 'sans-serif'],
    },
    fontSize: {},
    fontWeight: {},
    lineHeight: {},
    spacing: {},
    borderRadius: {},
    screens: {
      mobile: tokens.breakpoints.mobile,
      desktop: tokens.breakpoints.desktop,
    },
  };
  
  // Добавляем размеры шрифтов
  tokens.typography.fontSizes.forEach((size, index) => {
    const key = `text-${index + 1}`;
    config.fontSize[key] = size;
  });
  
  // Добавляем веса шрифтов
  const weightMap = {
    'normal': '400',
    'medium': '500',
    'bold': '700',
  };
  tokens.typography.fontWeights.forEach(weight => {
    const numericWeight = weightMap[weight] || weight;
    config.fontWeight[weight] = numericWeight;
  });
  
  // Добавляем line heights
  tokens.typography.lineHeights.forEach((height, index) => {
    const key = `leading-${index + 1}`;
    config.lineHeight[key] = height;
  });
  
  // Добавляем spacing
  tokens.spacing.forEach((space, index) => {
    const key = `spacing-${index + 1}`;
    config.spacing[key] = space;
  });
  
  // Добавляем border radius
  tokens.borderRadius.forEach((radius, index) => {
    const key = `rounded-${index + 1}`;
    config.borderRadius[key] = radius;
  });
  
  return config;
}

if (require.main === module) {
  const cssPath = process.argv[2] || './parced design/styles.css';
  
  console.log('Парсинг CSS из:', cssPath);
  const tokens = extractDesignTokens(cssPath);
  
  console.log('\n=== Найденные цвета ===');
  console.log(JSON.stringify(tokens.colors, null, 2));
  
  console.log('\n=== CSS переменные ===');
  console.log(JSON.stringify(tokens.cssVars, null, 2));
  
  console.log('\n=== Типографика ===');
  console.log(JSON.stringify(tokens.typography, null, 2));
  
  console.log('\n=== Spacing ===');
  console.log(JSON.stringify(tokens.spacing, null, 2));
  
  console.log('\n=== Border Radius ===');
  console.log(JSON.stringify(tokens.borderRadius, null, 2));
  
  const tailwindConfig = generateTailwindConfig(tokens);
  console.log('\n=== Конфигурация для Tailwind ===');
  console.log(JSON.stringify(tailwindConfig, null, 2));
  
  // Сохраняем в файл
  fs.writeFileSync(
    path.join(process.cwd(), 'extracted-tokens.json'),
    JSON.stringify({ tokens, tailwindConfig }, null, 2)
  );
  console.log('\n✅ Токены сохранены в extracted-tokens.json');
}

module.exports = { extractDesignTokens, generateTailwindConfig };
