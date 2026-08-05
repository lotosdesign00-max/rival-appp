const fs = require('fs');
let content = fs.readFileSync('broken_billing.txt', 'utf8');

const badStart = content.indexOf('import React, { useState, useEffect } from \'react\';', 100);
console.log('Bad start:', badStart);
// Find where the duplication ends.
// The duplication is basically the rest of the file from where $ was matched.
// The original replacement string was:
// ... amount: \`+\${amt.toLocaleString()} $\`, ...
// Since $\` (or $' ?) inserts the string that follows the matched substring.
// The matched substring was:
// const handleDepositSubmit = () => { ... setIsDepositOpen(false); showToast('Успешно пополнено'); };
// So what was inserted was everything AFTER the matched substring!
// Which means the original text of the matched substring is gone, but we replaced it intentionally!
// Wait, then the rest of the file is appended AGAIN?
// Let's check how many times "export const BillingModal" appears.
console.log('Count:', content.split('export const BillingModal').length - 1);
