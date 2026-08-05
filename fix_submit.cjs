const fs = require('fs');

let content = fs.readFileSync('src/components/BillingModal.tsx', 'utf8');

const regex = /const handleDepositSubmit = \(\) => \{[\s\S]*?showToast\('Успешно[^']+'\);\s*\n\s*\};/;
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
    const newTx: Transaction = {
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
  };`;

// Try an easier replace
content = content.replace(/const handleDepositSubmit = \(\) => \{[\s\S]*?setTransactions\(prev => \[newTx, \.\.\.prev\]\);\s*setIsDepositOpen\(false\);\s*showToast\('Успешно пополнено'\);\s*\};/g, replacement);

if (content.includes("showToast('Успешно пополнено');")) {
    content = content.replace(/const handleDepositSubmit = \(\) => \{[\s\S]*?showToast\('Успешно пополнено'\);\s*\};/g, replacement);
}

// Since I might not know the exact old body:
content = content.replace(/const handleDepositSubmit = \(\) => \{[\s\S]*?setIsDepositOpen\(false\);\s*\n\s*\};/, replacement);

fs.writeFileSync('src/components/BillingModal.tsx', content);
console.log('done');
