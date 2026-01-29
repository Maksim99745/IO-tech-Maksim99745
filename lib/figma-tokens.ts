import fs from 'fs';
import path from 'path';

interface DesignToken {
  type: string;
  value: any;
  description?: string;
  [key: string]: any;
}

interface TokenCollection {
  [key: string]: DesignToken;
}

export function parseDesignTokens(filePath: string) {
  try {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(fileContent);
    
    const colors: Record<string, string> = {};
    const typography: Record<string, any> = {};
    const spacing: Record<string, string> = {};
    
    function extractTokens(collection: TokenCollection, prefix = '') {
      Object.entries(collection).forEach(([key, token]) => {
        const fullKey = prefix ? `${prefix}-${key}` : key;
        
        if (token.type === 'color' && token.value) {
          colors[fullKey] = token.value;
        } else if (token.type === 'typography' && token.value) {
          typography[fullKey] = token.value;
        } else if (token.type === 'dimension' && token.value) {
          spacing[fullKey] = token.value;
        }
      });
    }
    
    Object.values(data).forEach((collection: any) => {
      extractTokens(collection);
    });
    
    return { colors, typography, spacing };
  } catch (error) {
    console.error('Error parsing design tokens:', error);
    return { colors: {}, typography: {}, spacing: {} };
  }
}

const tokensPath = path.join(process.cwd(), 'design-tokens.tokens.json');
export const figmaTokens = parseDesignTokens(tokensPath);
