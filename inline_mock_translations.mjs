import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Instead of importing, we will parse translations.ts
const transFile = 'src/translations.ts';
const transContent = fs.readFileSync(transFile, 'utf-8');

// extract the ru object
const ruBlockMatch = transContent.match(/ru:\s*\{([\s\S]*?)\},\s*en:/);
if (!ruBlockMatch) {
  console.error("Could not find ru block");
  process.exit(1);
}

const ruBlock = ruBlockMatch[1];
const ruDict = {};
const regex = /['"]?(auto_[a-zA-Z0-9]+)['"]?:\s*['"]([^'"]+)['"]/g;
let match;
while ((match = regex.exec(ruBlock)) !== null) {
  ruDict[match[1]] = match[2];
}

console.log(`Found ${Object.keys(ruDict).length} auto keys in ru translations`);

const mockFile = 'src/data/mockData.ts';
let mockContent = fs.readFileSync(mockFile, 'utf-8');

mockContent = mockContent.replace(/'(auto_[a-zA-Z0-9]+)'/g, (fullMatch, key) => {
  if (ruDict[key]) {
    return `'${ruDict[key]}'`;
  }
  return fullMatch;
});

fs.writeFileSync(mockFile, mockContent);
console.log("Mock data updated.");
