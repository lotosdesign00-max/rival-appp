const fs = require('fs');

let content = fs.readFileSync('src/context/AppContext.tsx', 'utf8');

const replacement = `  const login = async (provider: 'telegram' | 'google' = 'google', passedUserData?: any) => {
    try {
      if (provider === 'google') {
        const providerAuth = new GoogleAuthProvider();
        await signInWithPopup(auth, providerAuth);
      } else if (provider === 'telegram') {
        setIsAuthenticated(true);
        setAuthProvider('telegram');
        if (passedUserData) {
          setProfile(prev => ({
            ...prev,
            name: passedUserData.first_name ? \`\${passedUserData.first_name} \${passedUserData.last_name || ''}\`.trim() : 'Telegram User',
            username: passedUserData.username || '',
            avatarUrl: passedUserData.photo_url || prev.avatarUrl
          }));
        }
      }
    } catch (err) {
      console.error(err);
      showToast('Error logging in');
    }
  };`;

content = content.replace(/const login = async \([\s\S]*?showToast\('Error logging in'\);\s*\}\s*\};/m, replacement);

fs.writeFileSync('src/context/AppContext.tsx', content);
console.log('Fixed login function in AppContext');
