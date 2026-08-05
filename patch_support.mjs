import fs from 'fs';
const file = 'src/components/SupportModal.tsx';
let content = fs.readFileSync(file, 'utf-8');

// add imports
content = content.replace("import { useTranslation }", "import { ChatService, ChatSession } from '../services/ChatService';\nimport { ChatView } from './chat/ChatView';\nimport { useTranslation }");

// add states
const statesToAdd = `
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [isLoadingChat, setIsLoadingChat] = useState(false);

  const startSupportChat = async () => {
    setIsLoadingChat(true);
    try {
      const chat = await ChatService.getOrCreateChat('support', undefined, {
        participantName: 'Rival Support',
        participantAvatar: 'https://cdn3d.iconscout.com/3d/premium/thumb/customer-service-4993855-4161747.png'
      });
      if (chat) {
        setActiveChatId(chat.id);
      }
    } catch (e) {
      console.error(e);
      showToast('Failed to start chat');
    }
    setIsLoadingChat(false);
  };
`;

content = content.replace("const { t } = useTranslation();", "const { t } = useTranslation();\n" + statesToAdd);

// change the Contact Support button behavior
content = content.replace(/onClick=\{\(\) => \{\n\s*if \(onOpenMessages\) \{\n\s*onClose\(\);\n\s*onOpenMessages\(\);\n\s*\} else \{\n\s*showToast\(t\('auto_0J7RgtC6'\)\);\n\s*\}\n\s*\}\}/g, "onClick={startSupportChat}");

// render the chat if activeChatId is set
const chatRender = `
  if (activeChatId) {
    return (
      <div className="fixed inset-0 z-50 bg-[#050508] flex flex-col font-sans animate-in fade-in slide-in-from-bottom-12 duration-300">
        <div className="flex-shrink-0 flex items-center justify-between p-4 border-b border-zinc-800/50 bg-[#0a0a0f] pt-[max(1rem,env(safe-area-inset-top))]">
          <button 
            onClick={() => setActiveChatId(null)}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex flex-col items-center">
            <h2 className="text-sm font-bold text-white tracking-wide">Rival Support</h2>
            <p className="text-[10px] text-emerald-400 font-mono tracking-wider">ONLINE</p>
          </div>
          <div className="w-10" />
        </div>
        <div className="flex-1 min-h-0">
          <ChatView chatId={activeChatId} participantName="Rival Support" participantAvatar="https://cdn3d.iconscout.com/3d/premium/thumb/customer-service-4993855-4161747.png" />
        </div>
      </div>
    );
  }
`;

content = content.replace("return (", chatRender + "\n  return (");

fs.writeFileSync(file, content);
