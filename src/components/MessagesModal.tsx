import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, Search, CheckCheck
} from 'lucide-react';
import { useTranslation } from "../context/LanguageContext";
import { ChatService, ChatSession } from '../services/ChatService';
import { ChatView } from './chat/ChatView';

interface MessagesModalProps {
  onClose: () => void;
  initialChatId?: string;
}

export const MessagesModal: React.FC<MessagesModalProps> = ({ onClose, initialChatId }) => {
  const { t } = useTranslation();
  const [conversations, setConversations] = useState<ChatSession[]>([]);
  const [activeConvId, setActiveConvId] = useState<string | null>(initialChatId || null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (initialChatId) {
      setActiveConvId(initialChatId);
    }
  }, [initialChatId]);

  useEffect(() => {
    const unsub = ChatService.subscribeToChats((chats) => {
      setConversations(chats);
    });
    return () => unsub();
  }, []);

  const filteredConversations = conversations.filter(c => 
    c.participantName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const foundConv = conversations.find(c => c.id === activeConvId);
  const activeConv = foundConv || (activeConvId ? {
    id: activeConvId,
    type: 'order' as const,
    ownerId: 'user',
    participantName: 'Rival Studio Team',
    participantAvatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=200&q=80',
    updatedAt: new Date().toISOString()
  } : null);

  return (
    <div className="fixed inset-0 z-50 bg-[#050508] font-sans flex animate-in slide-in-from-right duration-300">
      
      {/* Sidebar - Chat List */}
      <div className={`w-full md:w-96 flex flex-col border-r border-zinc-800/50 bg-[#0a0a0f] ${activeConvId ? 'hidden md:flex' : 'flex'}`}>
        <div className="flex-shrink-0 p-4 border-b border-zinc-800/50 pt-[max(1.5rem,env(safe-area-inset-top))]">
          <div className="flex items-center gap-3 mb-6">
            <button 
              onClick={onClose}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-bold text-white tracking-tight">{t('messages')}</h1>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input 
              type="text" 
              placeholder={t('search_messages')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-900/80 border border-zinc-800 rounded-2xl pl-10 pr-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredConversations.length > 0 ? (
            <div className="px-2 py-3 space-y-1">
              {filteredConversations.map(conv => (
                <button
                  key={conv.id}
                  onClick={() => setActiveConvId(conv.id)}
                  className={`w-full flex items-start gap-3 p-3 rounded-2xl transition-all duration-200 text-left ${
                    activeConvId === conv.id ? 'bg-indigo-600/10' : 'hover:bg-zinc-900/50'
                  }`}
                >
                  <div className="relative flex-shrink-0">
                    <img 
                      src={conv.participantAvatar || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=200&q=80'} 
                      alt="" 
                      className="w-12 h-12 rounded-full object-cover border border-zinc-800"
                    />
                    <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-[#0a0a0f] rounded-full" />
                  </div>
                  
                  <div className="flex-1 min-w-0 pt-0.5">
                    <div className="flex justify-between items-center mb-1">
                      <h3 className="text-sm font-bold text-zinc-200 truncate">{conv.participantName}</h3>
                      <span className="text-[10px] text-zinc-500 font-medium">
                        {conv.updatedAt ? new Date(conv.updatedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ''}
                      </span>
                    </div>
                    <div className="flex justify-between items-center gap-2">
                      <p className="text-xs text-zinc-400 truncate flex-1 leading-relaxed">
                        {conv.lastMessageText || 'No messages yet'}
                      </p>
                      {conv.unreadCount && conv.unreadCount > 0 ? (
                        <span className="flex-shrink-0 w-5 h-5 rounded-full bg-indigo-500 flex items-center justify-center text-[10px] font-bold text-white shadow-lg shadow-indigo-500/20">
                          {conv.unreadCount}
                        </span>
                      ) : null}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto mb-4">
                <Search className="w-6 h-6 text-zinc-600" />
              </div>
              <p className="text-zinc-400 text-sm">{t('no_messages_found')}</p>
            </div>
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className={`flex-1 flex flex-col bg-[#050508] ${!activeConvId ? 'hidden md:flex' : 'flex'}`}>
        {activeConv ? (
          <>
            <div className="flex-shrink-0 flex items-center justify-between p-4 border-b border-zinc-800/50 bg-[#0a0a0f] pt-[max(1rem,env(safe-area-inset-top))] md:pt-4">
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setActiveConvId(null)}
                  className="md:hidden w-10 h-10 flex items-center justify-center rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <div className="relative">
                  <img src={activeConv.participantAvatar || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=200&q=80'} alt="" className="w-10 h-10 rounded-full" />
                  <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-[#0a0a0f] rounded-full" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-white">{activeConv.participantName}</h2>
                  <p className="text-[10px] text-emerald-400 font-mono tracking-wider">ONLINE</p>
                </div>
              </div>
            </div>
            
            <div className="flex-1 min-h-0">
              <ChatView 
                chatId={activeConv.id} 
                participantName={activeConv.participantName || 'Designer'} 
                participantAvatar={activeConv.participantAvatar} 
              />
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center hidden md:flex">
            <div className="w-20 h-20 rounded-full bg-zinc-900/50 border border-zinc-800/50 flex items-center justify-center mb-6">
              <CheckCheck className="w-8 h-8 text-zinc-600" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">{t('select_a_conversation')}</h3>
            <p className="text-sm text-zinc-500 max-w-xs">{t('choose_a_conversation_from_the_l')}</p>
          </div>
        )}
      </div>
    </div>
  );
};
