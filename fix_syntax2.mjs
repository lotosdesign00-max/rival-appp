import fs from 'fs';
const file = 'src/translations.ts';
let content = fs.readFileSync(file, 'utf-8');

// There is a line with just "    settings_" which caused the error
content = content.replace(/^[ \t]*settings_[ \t]*\n/gm, "");

fs.writeFileSync(file, content);
