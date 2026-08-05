import fs from 'fs';

const mockFile = 'src/data/mockData.ts';
let content = fs.readFileSync(mockFile, 'utf-8');

// Replace t('xxx') with 'xxx'
content = content.replace(/t\('([^']+)'\)/g, "'$1'");

// Remove import { useTranslation } ...
content = content.replace(/import \{ useTranslation \} from "\.\.\/context\/LanguageContext";/g, '');

fs.writeFileSync(mockFile, content);
