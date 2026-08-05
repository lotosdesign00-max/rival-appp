import fs from 'fs';
const file = 'src/components/MessagesModal.tsx';
let content = fs.readFileSync(file, 'utf-8');

// add imports
content = content.replace("import { useTranslation }", "import { ChatService, ChatSession } from '../services/ChatService';\nimport { ChatView } from './chat/ChatView';\nimport { useTranslation }");

// Replace states
const statesToReplace = `
  const [conversations, setConversations] = useState<ChatSession[]>([]);
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const unsub = ChatService.subscribeToChats((chats) => {
      setConversations(chats);
    });
    return () => unsub();
  }, []);

  const filteredConversations = conversations.filter(c => 
    c.participantName?.toLowerCase().includes(searchQuery.toLowerCase())
  );
`;

const statePattern = /const \[conversations.*?\n\n  const activeConv = [^\n]+/s;
content = content.replace(statePattern, statesToReplace);

fs.writeFileSync(file, content);
