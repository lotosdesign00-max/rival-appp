const fs = require('fs');
let content = fs.readFileSync('src/context/AppContext.tsx', 'utf8');

const regex = /\} else \{\s*setIsAuthenticated\(false\);\s*\}/g;

const replacement = `} else {
        // Only log out if not using telegram
        const currentProvider = StorageService.getItem('rival_auth_provider', null);
        if (currentProvider !== 'telegram') {
          setIsAuthenticated(false);
        }
      }`;

content = content.replace(regex, replacement);
fs.writeFileSync('src/context/AppContext.tsx', content);
console.log('Fixed onAuthStateChanged');
