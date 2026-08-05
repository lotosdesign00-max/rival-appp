import fs from 'fs';
const file = 'src/translations.ts';
let content = fs.readFileSync(file, 'utf-8');

// The easiest way is to parse the file line by line, keep track of keys seen within each block ('ru:', 'en:', etc.)
let newLines = [];
let currentLang = null;
let seenKeys = new Set();

const lines = content.split('\n');
for (let i = 0; i < lines.length; i++) {
  let line = lines[i];
  
  // check if entering a lang block
  const langMatch = line.match(/^  ([a-z]+): \{/);
  if (langMatch) {
    currentLang = langMatch[1];
    seenKeys = new Set();
    newLines.push(line);
    continue;
  }
  
  // check if exiting a block
  if (line.match(/^  \},?/)) {
    currentLang = null;
    newLines.push(line);
    continue;
  }
  
  // if inside a block, check for key
  if (currentLang) {
    const keyMatch = line.match(/^    '?([a-zA-Z0-9_]+)'?:\s*(.+)/);
    if (keyMatch) {
      const key = keyMatch[1];
      if (seenKeys.has(key)) {
        console.log(`Removing duplicate key ${key} in ${currentLang} at line ${i+1}`);
        continue; // skip this line
      } else {
        seenKeys.add(key);
      }
    }
  }
  
  newLines.push(line);
}

fs.writeFileSync(file, newLines.join('\n'));
