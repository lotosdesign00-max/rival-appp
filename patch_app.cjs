const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

code = code.replace(
  'const [isSplashLoading, setIsSplashLoading] = useState(true);',
  `const [isSplashLoading, setIsSplashLoading] = useState(() => {
    if (typeof window !== 'undefined') {
      const hasSeen = sessionStorage.getItem('rival_has_seen_splash');
      if (hasSeen) return false;
      return true;
    }
    return true;
  });

  useEffect(() => {
    if (!isSplashLoading) {
      sessionStorage.setItem('rival_has_seen_splash', 'true');
    }
  }, [isSplashLoading]);`
);

fs.writeFileSync('src/App.tsx', code);
console.log('Patched App.tsx');
