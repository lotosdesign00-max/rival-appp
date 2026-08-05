const fs = require('fs');

let content = fs.readFileSync('src/components/BillingModal.tsx', 'utf8');

// Update imports
content = content.replace(/import\s*\{\s*ChevronLeft,[\s\S]*?\}\s*from\s*'lucide-react';/, `import { 
  ChevronLeft, 
  ChevronRight,
  Bell, 
  Menu, 
  Check, 
  Plus, 
  Download, 
  ShieldCheck, 
  MoreVertical, 
  CreditCard, 
  Sparkles, 
  ArrowDownRight, 
  ArrowUpRight,
  ArrowLeft,
  ArrowRight,
  X,
  Wallet,
  Bitcoin,
  Star,
  Coins
} from 'lucide-react';`);

const startTag = '{isDepositOpen && (';
const endTag = '      )}'; // Be careful with exact spacing, better use regex or substring.

const startIdx = content.indexOf('{isDepositOpen && (');
if (startIdx !== -1) {
  // Find the matching end. It should be before the last `</div>` of the component.
  // Actually, there is `  );` right after it.
  const endIdx = content.indexOf('</div>\n  );\n};', startIdx);
  if (endIdx !== -1) {
    const newBlock = `{isDepositOpen && (
        <div className="fixed inset-0 z-[60] overflow-y-auto bg-[#050508] font-sans animate-in slide-in-from-right duration-300">
          <div className="max-w-md mx-auto min-h-screen px-4 py-6 space-y-6 pb-32 flex flex-col">
            
            {/* TOP HEADER */}
            <div className="flex items-center justify-between pt-1 relative">
              <button
                onClick={() => setIsDepositOpen(false)}
                className="w-10 h-10 rounded-full text-zinc-300 hover:text-white transition-colors flex items-center justify-center active:scale-95 absolute left-0"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <h1 className="text-lg font-bold text-white w-full text-center">Top Up Balance</h1>
            </div>

            {/* CURRENT BALANCE CARD */}
            <div className="relative p-6 rounded-[2rem] bg-[#12121A] border border-zinc-800/80 shadow-2xl overflow-hidden mt-6 flex flex-col items-center justify-center py-10">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-500/20 via-[#12121A]/0 to-[#12121A]/0"></div>
              <span className="text-[11px] font-bold tracking-widest text-zinc-400 uppercase relative z-10 mb-2">
                CURRENT BALANCE
              </span>
              <div className="text-4xl font-extrabold text-white tracking-tight relative z-10 flex items-center">
                <span className="text-zinc-500 mr-2">$</span>
                {profile.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>

            {/* CUSTOM AMOUNT */}
            <div className="space-y-2 mt-6">
              <label className="text-[11px] font-bold tracking-widest text-zinc-400 uppercase ml-1">
                CUSTOM AMOUNT
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  placeholder="Enter custom amount"
                  className="w-full pl-12 pr-4 py-4 rounded-3xl bg-[#12121A] border border-zinc-800 text-white placeholder-zinc-600 focus:outline-none focus:border-indigo-500 transition-colors text-base"
                />
                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-300 text-xl font-medium">$</span>
              </div>
            </div>

            {/* SELECT AMOUNT */}
            <div className="space-y-3 mt-6">
              <label className="text-[11px] font-bold tracking-widest text-zinc-400 uppercase ml-1">
                SELECT AMOUNT
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {['10', '25', '50', '100', '250', 'Custom'].map(val => (
                  <button
                    key={val}
                    onClick={() => {
                      if (val !== 'Custom') {
                        setDepositAmount(val);
                      } else {
                        setDepositAmount('');
                      }
                    }}
                    className={\`py-3.5 rounded-3xl border text-sm font-medium transition-all \${
                      (val === 'Custom' ? depositAmount === '' : depositAmount === val)
                        ? 'bg-indigo-950/40 border-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.2)]'
                        : 'bg-[#12121A] border-zinc-800 text-zinc-300 hover:border-zinc-600'
                    }\`}
                  >
                    {val === 'Custom' ? 'Custom' : \`$\${val}\`}
                  </button>
                ))}
              </div>
            </div>

            {/* PAYMENT METHOD */}
            <div className="space-y-3 mt-6">
              <label className="text-[11px] font-bold tracking-widest text-zinc-400 uppercase ml-1">
                PAYMENT METHOD
              </label>
              <div className="space-y-3">
                {/* Bank Card */}
                <button 
                  onClick={() => setDepositMethod('card')}
                  className={\`w-full p-4 rounded-3xl border flex items-center justify-between transition-all \${
                    depositMethod === 'card' ? 'bg-indigo-950/20 border-indigo-500' : 'bg-[#12121A] border-zinc-800 hover:border-zinc-700'
                  }\`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-blue-900/30 flex items-center justify-center overflow-hidden border border-blue-800/50">
                      <CreditCard className="w-6 h-6 text-blue-400" />
                    </div>
                    <div className="text-left">
                      <div className="text-sm font-bold text-white">Bank Card</div>
                      <div className="text-xs text-zinc-400 mt-0.5">Visa, Mastercard, Apple Pay</div>
                    </div>
                  </div>
                  {depositMethod === 'card' ? (
                    <div className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  ) : (
                    <ChevronRight className="w-5 h-5 text-zinc-500" />
                  )}
                </button>

                {/* Crypto */}
                <button 
                  onClick={() => setDepositMethod('crypto')}
                  className={\`w-full p-4 rounded-3xl border flex items-center justify-between transition-all \${
                    depositMethod === 'crypto' ? 'bg-indigo-950/20 border-indigo-500' : 'bg-[#12121A] border-zinc-800 hover:border-zinc-700'
                  }\`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-purple-900/30 flex items-center justify-center border border-purple-800/50">
                      <Bitcoin className="w-6 h-6 text-purple-400" />
                    </div>
                    <div className="text-left">
                      <div className="text-sm font-bold text-white">Crypto</div>
                      <div className="text-xs text-zinc-400 mt-0.5">BTC, ETH, USDT</div>
                    </div>
                  </div>
                  {depositMethod === 'crypto' ? (
                    <div className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  ) : (
                    <ChevronRight className="w-5 h-5 text-zinc-500" />
                  )}
                </button>

                {/* Telegram Stars */}
                <button 
                  onClick={() => setDepositMethod('stars')}
                  className={\`w-full p-4 rounded-3xl border flex items-center justify-between transition-all \${
                    depositMethod === 'stars' ? 'bg-indigo-950/20 border-indigo-500' : 'bg-[#12121A] border-zinc-800 hover:border-zinc-700'
                  }\`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-[#12121A] flex items-center justify-center border border-indigo-500/30">
                      <Star className="w-6 h-6 text-indigo-400 fill-indigo-400" />
                    </div>
                    <div className="text-left flex flex-col items-start">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white">Telegram Stars</span>
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-indigo-500 text-white tracking-wider">FASTEST</span>
                      </div>
                      <div className="text-xs text-zinc-400 mt-0.5">Instant top-up via bot</div>
                    </div>
                  </div>
                  {depositMethod === 'stars' ? (
                    <div className="w-6 h-6 rounded-full bg-transparent border-2 border-zinc-600 flex items-center justify-center">
                      <div className="w-4 h-4 rounded-full bg-white flex items-center justify-center">
                         <Check className="w-3 h-3 text-black stroke-[3]" />
                      </div>
                    </div>
                  ) : (
                    <ChevronRight className="w-5 h-5 text-zinc-500" />
                  )}
                </button>
              </div>
            </div>

            {/* SUMMARY */}
            <div className="space-y-4 mt-8 pb-20 px-2">
              <h3 className="text-[11px] font-bold tracking-widest text-zinc-400 uppercase">
                SUMMARY
              </h3>
              <div className="flex justify-between text-sm">
                <span className="text-zinc-300">Amount</span>
                <span className="text-white">$\${parseFloat(depositAmount || '0').toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-zinc-300">Processing Fee (0%)</span>
                <span className="text-white">$0.00</span>
              </div>
              <div className="h-px bg-zinc-800 w-full my-1"></div>
              <div className="flex justify-between text-base font-bold">
                <span className="text-white">Total to pay</span>
                <span className="text-white">$\${parseFloat(depositAmount || '0').toFixed(2)}</span>
              </div>
              
              <div className="flex justify-center mt-4">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#12121A] border border-zinc-800 text-[10px] text-zinc-400 font-medium">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Secure Payments: AES-256 Encrypted</span>
                </div>
              </div>
            </div>

            {/* BOTTOM BUTTON */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#050508] via-[#050508] to-transparent pb-8">
              <button
                onClick={handleDepositSubmit}
                disabled={isProcessing || !depositAmount || parseFloat(depositAmount) <= 0}
                className={\`w-full max-w-md mx-auto py-4 rounded-2xl font-bold text-base flex items-center justify-center gap-2 transition-all active:scale-[0.98] \${
                  (isProcessing || !depositAmount || parseFloat(depositAmount) <= 0)
                    ? 'bg-[#5b5bf0]/50 text-white/50 cursor-not-allowed' 
                    : 'bg-[#5b5bf0] hover:bg-[#4d4de8] text-white shadow-[0_0_20px_rgba(91,91,240,0.3)]'
                }\`}
              >
                {isProcessing ? 'Processing...' : 'Continue'}
                {!isProcessing && <ArrowRight className="w-5 h-5" />}
              </button>
            </div>

          </div>
        </div>
      )}
`;
    content = content.substring(0, startIdx) + newBlock + '\n' + content.substring(endIdx);
    fs.writeFileSync('src/components/BillingModal.tsx', content);
    console.log('Successfully replaced deposit modal');
  } else {
    console.log('Could not find end of deposit modal');
  }
} else {
  console.log('Could not find start of deposit modal');
}
