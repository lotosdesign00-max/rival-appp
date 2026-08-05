const fs = require('fs');

let content = fs.readFileSync('src/components/BillingModal.tsx', 'utf8');

// Find the first instance of 'export const BillingModal'
const firstExport = content.indexOf('export const BillingModal');
// Find the next instance
const secondExport = content.indexOf('export const BillingModal', firstExport + 10);

if (secondExport !== -1) {
  // Let's find where the first one actually ends
  // It ends at `};\n` before the second export, or we can just find the duplicated `import React`
  const duplicateImport = content.indexOf('import React', 100);
  if (duplicateImport !== -1) {
    content = content.substring(0, duplicateImport);
    fs.writeFileSync('src/components/BillingModal.tsx', content);
    console.log('Trimmed duplicate block');
  }
}
