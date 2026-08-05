const fs = require('fs');
let content = fs.readFileSync('src/components/ProfileScreen.tsx', 'utf8');

// 1. Add import
if (!content.includes("import { TopUpModal }")) {
  content = content.replace(
    "import { OrderRequest, OrderDetailData }",
    "import { TopUpModal } from './TopUpModal';\nimport { OrderRequest, OrderDetailData }"
  );
}

// 2. Replace MODAL 3: DEPOSIT block
const startComment = "{/* --- MODAL 3: DEPOSIT --- */}";
const endComment = "{/* --- MODAL 4: WITHDRAW --- */}";

const startIdx = content.indexOf(startComment);
const endIdx = content.indexOf(endComment);

if (startIdx !== -1 && endIdx !== -1) {
  const replacement = `${startComment}\n      {isDepositModalOpen && (\n        <TopUpModal onClose={() => setIsDepositModalOpen(false)} />\n      )}\n\n      `;
  content = content.substring(0, startIdx) + replacement + content.substring(endIdx);
  fs.writeFileSync('src/components/ProfileScreen.tsx', content);
  console.log("Updated ProfileScreen successfully");
} else {
  console.log("Could not find MODAL 3 or MODAL 4 block");
}
