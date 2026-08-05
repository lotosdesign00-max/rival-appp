import React, { useState, useEffect, useRef } from 'react';
import { ChatService, ChatMessage, ChatSession } from '../../services/ChatService';
import { Send, Paperclip, File as FileIcon, X, Check, CheckCheck, Loader2 } from 'lucide-react';
import { auth } from '../../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useApp } from '../../context/AppContext';

interface ChatViewProps {
  chatId: string;
  participantName: string;
  participantAvatar?: string;
}

export const ChatView: React.FC<ChatViewProps> = ({ chatId, participantName, participantAvatar }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [chatInfo, setChatInfo] = useState<ChatSession | null>(null);
  const [text, setText] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [user, setUser] = useState(auth.currentUser);
  const { profile } = useApp();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, u => setUser(u));
    return () => unsub();
  }, []);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!chatId) return;
    const unsubMessages = ChatService.subscribeToMessages(chatId, (msgs) => {
      setMessages(msgs);
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
      
      // mark unread as read if sent by other
      if (user) {
        const unreadIds = msgs.filter(m => !m.read && m.senderId !== user.uid).map(m => m.id);
        if (unreadIds.length > 0) {
          ChatService.markAsRead(chatId, unreadIds);
        }
      }
    });
    const unsubChat = ChatService.subscribeToChat(chatId, (chat) => {
      setChatInfo(chat);
    });
    
    return () => {
      unsubMessages();
      unsubChat();
    };
  }, [chatId, user]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!text.trim() && !file) || isSending) return;
    
    const sendingText = text;
    const sendingFile = file;

    setText('');
    setFile(null);
    setIsSending(true);

    const tempMsg: ChatMessage = {
      id: 'temp_' + Date.now(),
      senderId: user?.uid || 'guest_user',
      timestamp: new Date().toISOString(),
      text: sendingText || undefined,
      fileUrl: sendingFile ? URL.createObjectURL(sendingFile) : undefined,
      fileName: sendingFile?.name,
      fileType: sendingFile?.type,
      read: false,
      ownerId: user?.uid || 'guest_user'
    };

    setMessages(prev => {
      if (prev.some(m => m.id === tempMsg.id)) return prev;
      return [...prev, tempMsg];
    });
    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);

    try {
      await ChatService.sendMessage(chatId, sendingText, sendingFile || undefined);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSending(false);
    }
  };
  
  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
    ChatService.setTyping(chatId);
  };

  const isAdminTyping = chatInfo && chatInfo.adminTypingUntil && chatInfo.adminTypingUntil > Date.now();

  return (
    <div className="flex flex-col h-full bg-[#050508]">
      {/* Messages list */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 font-sans">
        {messages.map(msg => {
          const isMe = msg.senderId === user?.uid || msg.senderId === 'me' || (!user && msg.senderId === 'guest_user');
          const isOther = !isMe;
          const timeFormatted = msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '';

          if (isMe) {
            return (
              <div key={msg.id} className="flex justify-end items-start w-full gap-2.5">
                <div className="flex flex-col items-end max-w-[85%] sm:max-w-[75%] space-y-1">
                  <div className="p-3.5 rounded-2xl rounded-tr-xs bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-md shadow-indigo-600/10">
                    {msg.fileUrl && (
                      <div className="mb-2">
                        {msg.fileType?.startsWith('image/') ? (
                          <img src={msg.fileUrl} alt="Attached" className="rounded-xl max-w-full h-auto max-h-52 object-cover border border-indigo-400/30" />
                        ) : (
                          <a href={msg.fileUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 bg-black/30 p-2.5 rounded-xl text-xs hover:bg-black/40 transition-colors">
                            <FileIcon className="w-4 h-4 text-indigo-300" />
                            <span className="truncate max-w-[160px]">{msg.fileName}</span>
                          </a>
                        )}
                      </div>
                    )}
                    {msg.text && <p className="text-sm break-words whitespace-pre-wrap leading-relaxed">{msg.text}</p>}
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] text-zinc-400 font-mono pr-1">
                    <span>{timeFormatted}</span>
                    {msg.read ? (
                      <CheckCheck className="w-3.5 h-3.5 text-indigo-400" />
                    ) : (
                      <Check className="w-3.5 h-3.5 text-zinc-400" />
                    )}
                  </div>
                </div>
                <img 
                  src={profile?.avatarUrl || user?.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.uid || 'guest'}`} 
                  alt="" 
                  className="w-8 h-8 rounded-full flex-shrink-0 object-cover border border-zinc-700/60 shadow-sm mt-0.5 bg-zinc-800" 
                />
              </div>
            );
          }

          return (
            <div key={msg.id} className="flex justify-start items-start w-full gap-2.5">
              <img 
                src={participantAvatar || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=200&q=80'} 
                alt="" 
                className="w-8 h-8 rounded-full flex-shrink-0 object-cover border border-zinc-700/60 shadow-sm mt-0.5" 
              />
              <div className="flex flex-col items-start max-w-[85%] sm:max-w-[75%] space-y-1">
                <span className="text-[11px] font-bold text-zinc-400 px-1 font-sans">
                  {participantName || 'Rival Studio Team'}
                </span>
                <div className="p-3.5 rounded-2xl rounded-tl-xs bg-[#151522] border border-zinc-800/80 text-zinc-100 shadow-md">
                  {msg.fileUrl && (
                    <div className="mb-2">
                      {msg.fileType?.startsWith('image/') ? (
                        <img src={msg.fileUrl} alt="Attached" className="rounded-xl max-w-full h-auto max-h-52 object-cover border border-zinc-700/50" />
                      ) : (
                        <a href={msg.fileUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 bg-black/40 p-2.5 rounded-xl text-xs hover:bg-black/60 transition-colors">
                          <FileIcon className="w-4 h-4 text-zinc-400" />
                          <span className="truncate max-w-[160px]">{msg.fileName}</span>
                        </a>
                      )}
                    </div>
                  )}
                  {msg.text && <p className="text-sm break-words whitespace-pre-wrap leading-relaxed">{msg.text}</p>}
                </div>
                <div className="text-[10px] font-mono text-zinc-500 px-1">
                  {timeFormatted}
                </div>
              </div>
            </div>
          );
        })}
        {isAdminTyping && (
          <div className="flex justify-start items-start w-full gap-2.5">
            <img 
              src={participantAvatar || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=200&q=80'} 
              alt="" 
              className="w-8 h-8 rounded-full flex-shrink-0 object-cover border border-zinc-700/60 shadow-sm mt-0.5" 
            />
            <div className="bg-[#151522] border border-zinc-800/80 rounded-2xl rounded-tl-xs p-3.5 flex items-center gap-1.5 shadow-md">
              <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
              <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
              <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* File Preview */}
      {file && (
        <div className="px-4 py-2 border-t border-zinc-800 bg-[#0c0c14] flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center">
            {file.type.startsWith('image/') ? (
              <img src={URL.createObjectURL(file)} alt="" className="w-full h-full object-cover rounded-lg" />
            ) : (
              <FileIcon className="w-5 h-5 text-zinc-400" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-zinc-200 truncate">{file.name}</p>
            <p className="text-xs text-zinc-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
          </div>
          <button onClick={() => setFile(null)} className="p-2 text-zinc-400 hover:text-white rounded-full hover:bg-zinc-800">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Input */}
      <form onSubmit={handleSend} className="p-4 border-t border-zinc-800 bg-[#0c0c14] flex items-center gap-3 relative pb-[max(1rem,env(safe-area-inset-bottom))]">
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          onChange={(e) => {
            if (e.target.files?.[0]) setFile(e.target.files[0]);
          }} 
        />
        <button 
          type="button" 
          onClick={() => fileInputRef.current?.click()}
          className="p-2.5 text-zinc-400 hover:text-white rounded-full hover:bg-zinc-800 transition-colors"
        >
          <Paperclip className="w-5 h-5" />
        </button>
        <div className="flex-1 relative">
          <input
            type="text"
            value={text}
            onChange={handleTyping}
            placeholder="Write a message..."
            className="w-full bg-zinc-900 border border-zinc-800 rounded-full pl-4 pr-12 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all"
          />
          <button 
            type="submit"
            disabled={(!text.trim() && !file) || isSending}
            className="absolute right-1.5 top-1.5 bottom-1.5 aspect-square bg-indigo-600 hover:bg-indigo-500 disabled:bg-zinc-800 disabled:text-zinc-500 text-white rounded-full flex items-center justify-center transition-colors"
          >
            {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4 ml-0.5" />}
          </button>
        </div>
      </form>
    </div>
  );
};
