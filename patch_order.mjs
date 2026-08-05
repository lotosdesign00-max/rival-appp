import fs from 'fs';
const file = 'src/components/OrderDetailModal.tsx';
let content = fs.readFileSync(file, 'utf-8');

// add imports
content = content.replace("import { useTranslation }", "import { ChatService } from '../services/ChatService';\nimport { ChatView } from './chat/ChatView';\nimport { useTranslation }");

// add states
const statesToAdd = `
  const [activeChatId, setActiveChatId] = useState<string | null>(null);

  const startOrderChat = async () => {
    try {
      const chat = await ChatService.getOrCreateChat('order', currentOrder.id, {
        participantName: currentOrder.designer.name,
        participantAvatar: currentOrder.designer.avatar
      });
      if (chat) {
        setActiveChatId(chat.id);
        setIsMessageModalOpen(false);
      }
    } catch (e) {
      console.error(e);
      showToast('Failed to start chat');
    }
  };
`;

content = content.replace("const { t } = useTranslation();", "const { t } = useTranslation();\n" + statesToAdd);

// replace the Message button click
content = content.replace("onClick={() => setIsMessageModalOpen(true)}", "onClick={startOrderChat}");

// render the full screen chat
const chatRender = `
  if (activeChatId) {
    return (
      <div className="fixed inset-0 z-50 bg-[#050508] flex flex-col font-sans animate-in slide-in-from-right duration-300">
        <div className="flex-shrink-0 flex items-center justify-between p-4 border-b border-zinc-800/50 bg-[#0a0a0f] pt-[max(1rem,env(safe-area-inset-top))]">
          <button 
            onClick={() => setActiveChatId(null)}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex flex-col items-center">
            <h2 className="text-sm font-bold text-white tracking-wide">{currentOrder.designer.name}</h2>
            <p className="text-[10px] text-emerald-400 font-mono tracking-wider">ONLINE</p>
          </div>
          <div className="w-10" />
        </div>
        <div className="flex-1 min-h-0">
          <ChatView chatId={activeChatId} participantName={currentOrder.designer.name} participantAvatar={currentOrder.designer.avatar} />
        </div>
      </div>
    );
  }
`;

content = content.replace("return (", chatRender + "\n  return (");

fs.writeFileSync(file, content);
