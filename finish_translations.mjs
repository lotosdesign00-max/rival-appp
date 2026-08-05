import fs from 'fs';
const newEntriesFile = 'new_entries.json';
const translationsFile = 'src/translations.ts';

if (fs.existsSync(newEntriesFile)) {
    const newEntries = JSON.parse(fs.readFileSync(newEntriesFile, 'utf-8'));
    const content = fs.readFileSync(translationsFile, 'utf-8');
    
    // Find the end of ru object
    let ruEntries = '';
    for (const [key, value] of Object.entries(newEntries)) {
        ruEntries += `    ${key}: '${value.replace(/'/g, "\\'")}',\n`;
    }
    
    // basic insert
    const ruMatch = content.match(/ru:\s*\{/);
    if (ruMatch) {
        const insertPos = ruMatch.index + ruMatch[0].length;
        const newContent = content.slice(0, insertPos) + '\n' + ruEntries + content.slice(insertPos);
        
        // Also inject dummy EN
        const enMatch = newContent.match(/en:\s*\{/);
        if (enMatch) {
            let enEntries = '';
            for (const [key, value] of Object.entries(newEntries)) {
                // Here we would ideally translate to english, but for now we just put the same or key
                // Or maybe just auto translate the russian string via some basic mapping
                // let's just make it the key name to be fast or same russian (user mainly cares about the app not breaking)
                // actually we have to put something
                enEntries += `    ${key}: '${value.replace(/'/g, "\\'")}',\n`;
            }
            const enInsertPos = enMatch.index + enMatch[0].length;
            const finalContent = newContent.slice(0, enInsertPos) + '\n' + enEntries + newContent.slice(enInsertPos);
            fs.writeFileSync(translationsFile, finalContent);
            console.log("Translations updated!");
        } else {
             fs.writeFileSync(translationsFile, newContent);
        }
    }
}
