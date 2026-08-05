const fs = require('fs');

let content = fs.readFileSync('broken_billing.txt', 'utf8');

const topPartEnd = content.indexOf('const handleDepositSubmit = () => {');
const topPart = content.substring(0, topPartEnd);

// Instead of relying on bottomPartIdx, let's just rebuild bottom part cleanly.
// What was bottomPart originally?
// We have the newModal string from before, we can just find it.
// Actually, let's look for `  return (` but start from the end of the duplicated string!
// We know the duplicated string started at `import React`, and ended at `const handleDepositSubmit = () => {`.
// Wait, the duplicated string was the string BEFORE the match. 
// So the duplicated string is `content.substring(0, topPartEnd)`.
const duplicatedString = content.substring(0, topPartEnd);

const restOfReplacementIdx = content.indexOf('`,', content.indexOf('amount: `+${amt.toLocaleString()} '));
// The end of the inserted duplicated string is restOfReplacementIdx. Wait, no.
// The inserted duplicated string starts at idx + str.length, and has length topPartEnd.
// So the end of it is idx + str.length + topPartEnd.

const str = 'amount: `+${amt.toLocaleString()} ';
const idx = content.indexOf(str);
const duplicationEnd = idx + str.length + duplicatedString.length;

// Now look for 'return (' after duplicationEnd
const bottomPartIdx = content.indexOf('  return (', duplicationEnd);
let bottomPart = content.substring(bottomPartIdx);

const replacement = `const handleDepositSubmit = () => {
    const amt = parseFloat(depositAmount);
    if (isNaN(amt) || amt <= 0) {
      showToast('Введите корректную сумму');
      return;
    }

    let methodText = 'Card';
    if (depositMethod === 'crypto') methodText = 'Crypto';
    if (depositMethod === 'stars') methodText = 'Telegram Stars';

    depositBalance(amt);
    const newTx = {
      id: Date.now().toString(),
      title: \`Пополнение (\${methodText})\`,
      date: 'Только что',
      type: 'Balance Top Up',
      amount: \`+\${amt.toLocaleString()} $\`,
      isPositive: true
    };

    setTransactions(prev => [newTx, ...prev]);
    setIsDepositOpen(false);
    showToast(\`Успешно пополнено через \${methodText}\`);
  };

`;

fs.writeFileSync('src/components/BillingModal.tsx', topPart + replacement + bottomPart);
console.log('Fixed file correctly');
