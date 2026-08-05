const fs = require('fs');
let content = fs.readFileSync('src/components/BillingModal.tsx', 'utf8');

const target = "import React, { useState, useEffect } from 'react';import { TopUpModal } from './TopUpModal'; { useState, useEffect } from 'react';";
content = content.replace(target, "import React, { useState, useEffect } from 'react';\nimport { TopUpModal } from './TopUpModal';");

// If it's multiline or has \n instead:
content = content.replace(/import React, \{ useState, useEffect \} from 'react';\n?import \{ TopUpModal \} from '\.\/TopUpModal'; \{ useState, useEffect \} from 'react';/g, "import React, { useState, useEffect } from 'react';\nimport { TopUpModal } from './TopUpModal';");

fs.writeFileSync('src/components/BillingModal.tsx', content);
