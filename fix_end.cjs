const fs = require('fs');
let content = fs.readFileSync('src/components/BillingModal.tsx', 'utf8');

// The file currently ends with `{isProcessing ? "Обработка..." : \`Оплатить ${depositAmount || 0}`
// Let's replace the last bit.

const badEnd = '              {isProcessing ? "Обработка..." : `Оплатить ${depositAmount || 0}';
const endIdx = content.indexOf(badEnd);
if (endIdx !== -1) {
  content = content.substring(0, endIdx) + 
`              {isProcessing ? "Обработка..." : \`Оплатить \${depositAmount || 0}$\`}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
`;
  fs.writeFileSync('src/components/BillingModal.tsx', content);
  console.log('Fixed end of file');
} else {
  console.log('Bad end not found');
}
