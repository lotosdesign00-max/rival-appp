const fs = require('fs');
let content = fs.readFileSync('broken_billing.txt', 'utf8');

const str = 'amount: `+${amt.toLocaleString()} ';
const idx = content.indexOf(str);
if (idx !== -1) {
   const afterStr = content.substring(idx + str.length, idx + str.length + 100);
   console.log('Inserted:', afterStr);
}
