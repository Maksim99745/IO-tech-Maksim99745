const fs = require('fs');
const path = require('path');

function improvedParse(cssPath) {
  const cssContent = fs.readFileSync(cssPath, 'utf8');
  
  const tokens = {
    colors: new Map(),
    cssVariables: {},
    typography: {
      fontFamily: new Set(),
      fontSizes: new Set(),
      fontWeights: new Set(),
      lineHeights: new Set(),
    },
    spacing: new Set(),
    borderRadius: new Set(),
    borders: new Set(),
  };
  
  // Правильно извлекаем CSS переменные из :root
  const rootBlock = cssContent.match(/:root\s*\{([^}]+)\}/);
  if (rootBlock) {
    const rootContent = rootBlock[1];
    const varRegex = /--([^:]+):\s*([^;]+);/g;
    let match;
    while ((match = varRegex.exec(rootContent)) !== null) {
      const [, name, value] = match;
      tokens.cssVariables[name.trim()] = value.trim();
    }
  }
  
  // Извлекаем все цвета (rgba, rgb, hex)
  const colorRegex = /(?:background-color|color|border-color|fill|border|stroke):\s*(rgba?\([^)]+\)|#[0-9a-fA-F]{3,8})/gi;
  const colorMatches = cssContent.match(colorRegex);
  if (colorMatches) {
    colorMatches.forEach(match => {
      const colorMatch = match.match(/(rgba?\([^)]+\)|#[0-9a-fA-F]{3,8})/i);
      if (colorMatch) {
        const color = colorMatch[1].toLowerCase();
        // Конвертируем rgba в hex
        if (color.startsWith('rgba') || color.startsWith('rgb')) {
          const rgbaMatch = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)/);
          if (rgbaMatch) {
            const [, r, g, b] = rgbaMatch;
            const hex = `#${[r, g, b].map(x => parseInt(x).toString(16).padStart(2, '0')).join('')}`;
            tokens.colors.set(hex, { rgba: color, hex });
          }
        } else {
          tokens.colors.set(color, { hex: color });
        }
      }
    });
  }
  
  // Извлекаем font-family
  const fontFamilyRegex = /font-family:\s*['"]?([^'";,]+)['"]?/gi;
  const fontMatches = cssContent.match(fontFamilyRegex);
  if (fontMatches) {
    fontMatches.forEach(match => {
      const family = match.replace(/font-family:\s*/i, '').replace(/['";,]/g, '').trim();
      if (family && !family.includes('var(') && family.length > 2) {
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
  const fontWeightRegex = /font-weight:\s*(\d+|normal|bold|medium|light|regular)/gi;
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
  
  // Извлекаем spacing
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
  const borderRadiusRegex = /border-radius:\s*(\d+px|\d+%|9999px)/gi;
  const borderRadiusMatches = cssContent.match(borderRadiusRegex);
  if (borderRadiusMatches) {
    borderRadiusMatches.forEach(match => {
      const radius = match.replace(/border-radius:\s*/i, '').trim();
      tokens.borderRadius.add(radius);
    });
  }
  
  // Извлекаем border widths
  const borderWidthRegex = /border(?:-width)?:\s*(\d+)px/gi;
  const borderWidthMatches = cssContent.match(borderWidthRegex);
  if (borderWidthMatches) {
    borderWidthMatches.forEach(match => {
      const width = match.match(/\d+px/);
      if (width) {
        tokens.borders.add(width[0]);
      }
    });
  }
  
  return {
    colors: Array.from(tokens.colors.entries()).map(([hex, data]) => ({
      hex,
      ...data
    })),
    cssVariables: tokens.cssVariables,
    typography: {
      fontFamily: Array.from(tokens.typography.fontFamily),
      fontSizes: Array.from(tokens.typography.fontSizes).sort((a, b) => parseInt(a) - parseInt(b)),
      fontWeights: Array.from(tokens.typography.fontWeights),
      lineHeights: Array.from(tokens.typography.lineHeights).sort((a, b) => parseInt(a) - parseInt(b)),
    },
    spacing: Array.from(tokens.spacing).sort((a, b) => parseInt(a) - parseInt(b)),
    borderRadius: Array.from(tokens.borderRadius).sort((a, b) => {
      const aNum = parseInt(a);
      const bNum = parseInt(b);
      return aNum - bNum;
    }),
    borders: Array.from(tokens.borders).sort((a, b) => parseInt(a) - parseInt(b)),
  };
}

function analyzeHTMLStructure(htmlDir) {
  const files = fs.readdirSync(htmlDir).filter(f => f.endsWith('.html'));
  const components = {};
  
  files.forEach(file => {
    const content = fs.readFileSync(path.join(htmlDir, file), 'utf8');
    const classNameRegex = /class="([^"]+)"/g;
    const classes = new Set();
    let match;
    
    while ((match = classNameRegex.exec(content)) !== null) {
      const classNames = match[1].split(/\s+/);
      classNames.forEach(cls => classes.add(cls));
    }
    
    components[file] = {
      classes: Array.from(classes),
      hasText: content.includes('<p') || content.includes('<span'),
      hasImages: content.includes('<img'),
      hasForms: content.includes('<input') || content.includes('Email') || content.includes('Subscribe'),
    };
  });
  
  return components;
}

if (require.main === module) {
  const cssPath = process.argv[2] || './parced design/styles.css';
  const htmlDir = path.dirname(cssPath);
  
  console.log('🔍 Улучшенный парсинг CSS...\n');
  const tokens = improvedParse(cssPath);
  
  console.log('=== CSS Переменные ===');
  console.log(JSON.stringify(tokens.cssVariables, null, 2));
  
  console.log('\n=== Все найденные цвета ===');
  console.log(JSON.stringify(tokens.colors, null, 2));
  
  console.log('\n=== Типографика ===');
  console.log(JSON.stringify(tokens.typography, null, 2));
  
  console.log('\n=== Spacing ===');
  console.log(JSON.stringify(tokens.spacing, null, 2));
  
  console.log('\n=== Border Radius ===');
  console.log(JSON.stringify(tokens.borderRadius, null, 2));
  
  console.log('\n=== Border Widths ===');
  console.log(JSON.stringify(tokens.borders, null, 2));
  
  console.log('\n🔍 Анализ HTML структуры...\n');
  const htmlStructure = analyzeHTMLStructure(htmlDir);
  
  console.log('=== Структура компонентов ===');
  console.log(JSON.stringify(htmlStructure, null, 2));
  
  // Сохраняем улучшенные токены
  const output = {
    tokens,
    htmlStructure,
    timestamp: new Date().toISOString(),
  };
  
  fs.writeFileSync(
    path.join(process.cwd(), 'improved-tokens.json'),
    JSON.stringify(output, null, 2)
  );
  
  console.log('\n✅ Улучшенные токены сохранены в improved-tokens.json');
}

module.exports = { improvedParse, analyzeHTMLStructure };
