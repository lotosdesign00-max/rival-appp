import fs from 'fs';
const file = 'src/translations.ts';
let content = fs.readFileSync(file, 'utf-8');

// Fix numeric starting keys
content = content.replace(/^[ \t]*([0-9][a-zA-Z0-9_]*):/gm, "    '$1':");

fs.writeFileSync(file, content);
