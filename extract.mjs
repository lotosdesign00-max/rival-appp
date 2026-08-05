import fs from 'fs';
import path from 'path';

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
    });
}

const cyrillicPattern = /[\u0400-\u04FF]+/;
const strings = new Set();

// A very naive parser for JSX Text, Single Quotes, Double Quotes, Backticks
walkDir('./src/components', (filePath) => {
    if (!filePath.endsWith('.tsx') && !filePath.endsWith('.ts')) return;
    const content = fs.readFileSync(filePath, 'utf-8');
    
    // Match JSX text: >...<
    const jsxMatches = content.matchAll(/>([^<{]*?[\u0400-\u04FF]+[^<{]*?)</g);
    for (const match of jsxMatches) {
        strings.add(match[1].trim());
    }

    // Match single quotes
    const sqMatches = content.matchAll(/'([^'\n]*?[\u0400-\u04FF]+[^'\n]*?)'/g);
    for (const match of sqMatches) {
        strings.add(match[1].trim());
    }

    // Match double quotes
    const dqMatches = content.matchAll(/"([^"\n]*?[\u0400-\u04FF]+[^"\n]*?)"/g);
    for (const match of dqMatches) {
        strings.add(match[1].trim());
    }

    // Match backticks
    const btMatches = content.matchAll(/`([^`]*?[\u0400-\u04FF]+[^`]*?)`/g);
    for (const match of btMatches) {
        strings.add(match[1].trim().replace(/\n/g, ' '));
    }
});

console.log(JSON.stringify(Array.from(strings), null, 2));
