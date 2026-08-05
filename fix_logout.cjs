const fs = require('fs');
let content = fs.readFileSync('src/context/AppContext.tsx', 'utf8');

const replacement = `  const logout = async () => {
    try {
      await signOut(auth);
      setIsAuthenticated(false);
      setAuthProvider(null);
      setProfile(DEFAULT_PROFILE);
      setOrders([]);
      setFavorites([]);
      setAiHistory([]);
      setNotifications([]);
    } catch (err) {
      console.error(err);
    }
  };`;

content = content.replace(/const logout = async \([\s\S]*?console\.error\(err\);\s*\}\s*\};/m, replacement);
fs.writeFileSync('src/context/AppContext.tsx', content);
console.log('Fixed logout function in AppContext');
