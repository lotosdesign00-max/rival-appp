const fs = require('fs');

let content = fs.readFileSync('src/components/BillingModal.tsx', 'utf8');

// Replace {isDepositOpen && ( ... )} with TopUpModal
const startStr = "{isDepositOpen && (";
const endStr = "      )}"; // Note: this is risky if there are multiple.
// Let's use string manipulation more safely.
const startIdx = content.indexOf("{isDepositOpen && (");

if (startIdx !== -1) {
  // Let's find the matching div closure.
  // Actually, we can just replace everything from "{isDepositOpen && (" up to the end of the file.
  // The end of the file should just be "    </div>\n  );\n};\n"
  const replacement = `{isDepositOpen && <TopUpModal onClose={() => setIsDepositOpen(false)} />}\n    </div>\n  );\n};\n`;
  content = content.substring(0, startIdx) + replacement;
  
  if (!content.includes("import { TopUpModal }")) {
      content = content.replace("import React,", "import React, { useState, useEffect } from 'react';\nimport { TopUpModal } from './TopUpModal';");
  }
  
  fs.writeFileSync('src/components/BillingModal.tsx', content);
  console.log("Updated BillingModal successfully");
} else {
  console.log("Could not find isDepositOpen block");
}
