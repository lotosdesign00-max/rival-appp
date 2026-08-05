const fs = require('fs');

let content = fs.readFileSync('src/components/BillingModal.tsx', 'utf8');

const oldSubmit = `const handleDepositSubmit = () => {
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
      title: \\\`Пополнение (\\\${methodText})\\\`,
      date: 'Только что',
      type: 'Balance Top Up',
      amount: \\\`+\\\${amt.toLocaleString()} $\\\`,
      isPositive: true
    };

    setTransactions(prev => [newTx, ...prev]);
    setIsDepositOpen(false);
    showToast(\\\`Успешно пополнено через \\\${methodText}\\\`);
  };`;

// Wait, doing an exact match with backticks is hard. Let's just find the function.
// Since it's async now, we'll replace the body.

content = content.replace(/const handleDepositSubmit = \(\) => \{[\s\S]*?showToast\(`Успешно пополнено через \$\{methodText\}`\);\s*\};/g, `const [isProcessing, setIsProcessing] = useState(false);
  const handleDepositSubmit = async () => {
    const amt = parseFloat(depositAmount);
    if (isNaN(amt) || amt <= 0) {
      showToast('Введите корректную сумму');
      return;
    }

    setIsProcessing(true);
    try {
      let endpoint = '/api/payments/card';
      if (depositMethod === 'crypto') endpoint = '/api/payments/crypto';
      if (depositMethod === 'stars') endpoint = '/api/payments/stars';

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: amt })
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Payment failed');
      
      if (depositMethod === 'stars' && (window as any).Telegram?.WebApp) {
        (window as any).Telegram.WebApp.openInvoice(data.url, (status: string) => {
          if (status === 'paid') {
            depositBalance(amt);
            showToast('Успешно оплачено звездами');
            setIsDepositOpen(false);
          } else {
            showToast('Оплата отменена');
          }
        });
      } else {
        window.location.href = data.url;
      }
    } catch (err: any) {
      console.error(err);
      showToast(err.message || 'Ошибка платежа. Проверьте настройки (.env)');
    } finally {
      setIsProcessing(false);
    }
  };`);

// Also update button to show processing state.
content = content.replace('Оплатить {depositAmount || 0}$', '{isProcessing ? "Обработка..." : `Оплатить ${depositAmount || 0}$`}');
content = content.replace('onClick={handleDepositSubmit}', 'onClick={handleDepositSubmit}\n              disabled={isProcessing}');
content = content.replace('className="w-full py-4 mt-2 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm uppercase tracking-wider shadow-xl shadow-indigo-600/30 transition-transform active:scale-95"', 'className={`w-full py-4 mt-2 rounded-2xl font-bold text-sm uppercase tracking-wider shadow-xl shadow-indigo-600/30 transition-all active:scale-95 ${isProcessing ? "bg-indigo-500/50 text-white/50 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-500 text-white"}`}');

fs.writeFileSync('src/components/BillingModal.tsx', content);
console.log('Client fixed');
