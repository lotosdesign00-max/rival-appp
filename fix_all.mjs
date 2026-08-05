import fs from 'fs';
const file = 'src/translations.ts';
let content = fs.readFileSync(file, 'utf-8');
content = content.replace(/^[ \t]*[a-zA-Z0-9_]+_[ \t]*\n/gm, "");
fs.writeFileSync(file, content);
