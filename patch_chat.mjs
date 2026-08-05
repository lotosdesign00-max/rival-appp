import fs from 'fs';
const file = 'src/components/chat/ChatView.tsx';
let content = fs.readFileSync(file, 'utf-8');

// Replace import
content = content.replace("import { useAuth } from '../../context/AuthContext';", "import { auth } from '../../firebase';\nimport { onAuthStateChanged } from 'firebase/auth';");

// Replace useAuth hook
content = content.replace("const { user } = useAuth();", "const [user, setUser] = useState(auth.currentUser);\n\n  useEffect(() => {\n    const unsub = onAuthStateChanged(auth, u => setUser(u));\n    return () => unsub();\n  }, []);");

fs.writeFileSync(file, content);
