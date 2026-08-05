const fs = require('fs');

let content = fs.readFileSync('src/components/BillingModal.tsx', 'utf8');

// Update imports
content = content.replace('  Wallet\n} from \'lucide-react\';', '  Wallet,\n  Bitcoin,\n  Star,\n  Coins\n} from \'lucide-react\';');

// Add depositMethod state
content = content.replace("const [depositAmount, setDepositAmount] = useState('500');", "const [depositAmount, setDepositAmount] = useState('500');\n  const [depositMethod, setDepositMethod] = useState<'card' | 'crypto' | 'stars'>('card');");

// Update handleDepositSubmit
content = content.replace(/const handleDepositSubmit = \(\) => \{([\s\S]*?)\} \};/m, `const handleDepositSubmit = () => {
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
      title: \`Deposit via \${methodText}\`,
      date: 'Just now',
      type: 'Balance Top Up',
      amount: \`+\${amt.toLocaleString()} ₽\`,
      isPositive: true
    };

    setTransactions(prev => [newTx, ...prev]);
    setIsDepositOpen(false);
    showToast(\`Успешно пополнено через \${methodText}\`);
  };`);

// Update modal
const oldModal = `{/* DEPOSIT MODAL POPUP */}
      {isDepositOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-xs bg-[#0e0e18] border border-zinc-800 rounded-3xl p-5 space-y-4 text-white animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
              <h3 className="text-sm font-bold">Пополнение баланса</h3>
              <button onClick={() => setIsDepositOpen(false)} className="text-zinc-500 hover:text-zinc-300">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-xs text-zinc-400 font-mono">Сумма (USD)</label>
              <input
                type="number"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-zinc-900 border border-zinc-700 text-sm font-bold text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="grid grid-cols-3 gap-2">
              {['100', '500', '1000'].map(val => (
                <button
                  key={val}
                  onClick={() => setDepositAmount(val)}
                  className="py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-mono hover:border-indigo-500 text-zinc-300"
                >
                  +\${val}
                </button>
              ))}
            </div>

            <button
              onClick={handleDepositSubmit}
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-indigo-600/30"
            >
              Подтвердить
            </button>
          </div>
        </div>
      )}`;

const newModal = `{/* DEPOSIT MODAL POPUP */}
      {isDepositOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-sm bg-[#0e0e18] border border-zinc-800 rounded-3xl p-6 space-y-5 text-white animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
              <h3 className="text-base font-bold">Пополнение баланса</h3>
              <button onClick={() => setIsDepositOpen(false)} className="text-zinc-500 hover:text-zinc-300">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <label className="text-xs text-zinc-400 font-mono uppercase tracking-wider">Способ оплаты</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setDepositMethod('card')}
                  className={\`flex flex-col items-center justify-center gap-2 p-3 rounded-2xl border transition-all \${depositMethod === 'card' ? 'bg-indigo-600/20 border-indigo-500 text-indigo-400' : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700'}\`}
                >
                  <CreditCard className="w-5 h-5" />
                  <span className="text-[10px] font-bold uppercase">Карта</span>
                </button>
                <button
                  onClick={() => setDepositMethod('crypto')}
                  className={\`flex flex-col items-center justify-center gap-2 p-3 rounded-2xl border transition-all \${depositMethod === 'crypto' ? 'bg-indigo-600/20 border-indigo-500 text-indigo-400' : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700'}\`}
                >
                  <Bitcoin className="w-5 h-5" />
                  <span className="text-[10px] font-bold uppercase">Крипта</span>
                </button>
                <button
                  onClick={() => setDepositMethod('stars')}
                  className={\`flex flex-col items-center justify-center gap-2 p-3 rounded-2xl border transition-all \${depositMethod === 'stars' ? 'bg-indigo-600/20 border-indigo-500 text-indigo-400' : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700'}\`}
                >
                  <Star className="w-5 h-5" />
                  <span className="text-[10px] font-bold uppercase">Звёзды</span>
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-xs text-zinc-400 font-mono uppercase tracking-wider">Сумма (USD)</label>
              <div className="relative">
                <input
                  type="number"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  className="w-full pl-8 pr-4 py-3 rounded-2xl bg-zinc-900 border border-zinc-700 text-lg font-bold text-white focus:outline-none focus:border-indigo-500 transition-colors"
                />
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 font-bold">$</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {['100', '500', '1000'].map(val => (
                <button
                  key={val}
                  onClick={() => setDepositAmount(val)}
                  className="py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-mono font-bold hover:border-indigo-500 hover:text-indigo-400 text-zinc-300 transition-colors"
                >
                  +\${val}
                </button>
              ))}
            </div>

            <button
              onClick={handleDepositSubmit}
              className="w-full py-4 mt-2 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm uppercase tracking-wider shadow-xl shadow-indigo-600/30 transition-transform active:scale-95"
            >
              Оплатить {depositAmount || 0}$
            </button>
          </div>
        </div>
      )}`;

content = content.replace(oldModal, newModal);
fs.writeFileSync('src/components/BillingModal.tsx', content);
