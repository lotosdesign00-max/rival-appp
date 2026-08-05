import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ArrowLeft, 
  SquarePen, 
  Bot, 
  Sparkles, 
  Layout, 
  Image as ImageIcon, 
  Pencil, 
  Wrench, 
  Plus, 
  Mic, 
  MicOff,
  Volume2,
  VolumeX,
  ArrowUp, 
  Loader2, 
  Copy, 
  Check, 
  X,
  Send
} from 'lucide-react';
import { useTranslation } from "../context/LanguageContext";

interface RivalAIChatModalProps {
  onClose: () => void;
  onOpenCreateOrder?: (title?: string) => void;
}

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  image?: string;
  timestamp: string;
}

export const RivalAIChatModal: React.FC<RivalAIChatModalProps> = ({
  onClose,
  onOpenCreateOrder
}) => {
    const { t } = useTranslation();
  const { showToast, addAIHistoryItem, useAICredit } = useApp();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm1',
      sender: 'user',
      text: 'Create a futuristic dashboard for a crypto platform.',
      timestamp: '10:42 AM'
    },
    {
      id: 'm2',
      sender: 'ai',
      text: 'Sure. Here is a suggested creative direction for a futuristic crypto dashboard:',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
      timestamp: '10:42 AM'
    }
  ]);

  const [inputPrompt, setInputPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Speech Recognition (Voice Input) setup
  const toggleVoiceInput = () => {
    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      showToast('Голосовой ввод остановлен');
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      showToast('Ваш браузер не поддерживает голосовой ввод');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'ru-RU'; // Default language

      recognition.onstart = () => {
        setIsListening(true);
        showToast('Слушаю ваш голосовой промпт...');
      };

      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setInputPrompt(transcript);
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
        if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
          showToast('Микрофон заблокирован. Разрешите доступ в браузере или откройте приложение в отдельной вкладке');
        } else {
          showToast(`Голосовой ввод недоступен: ${event.error}`);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (e) {
      console.error(e);
      setIsListening(false);
      showToast('Не удалось запустить микрофон');
    }
  };

  // Text-To-Speech (Voice Output) setup
  const speakMessage = (msgId: string, text: string) => {
    if (!('speechSynthesis' in window)) {
      showToast('Синтез речи не поддерживается браузером');
      return;
    }

    if (speakingMessageId === msgId) {
      window.speechSynthesis.cancel();
      setSpeakingMessageId(null);
      showToast('Озвучка остановлена');
      return;
    }

    window.speechSynthesis.cancel(); // Stop any active speech

    // Clean text from markdown markers for clear speech
    const cleanText = text.replace(/[*#`_]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    utterance.onstart = () => {
      setSpeakingMessageId(msgId);
    };

    utterance.onend = () => {
      setSpeakingMessageId(null);
    };

    utterance.onerror = () => {
      setSpeakingMessageId(null);
    };

    window.speechSynthesis.speak(utterance);
    showToast('Озвучивание ответа нейросети...');
  };

  const suggestionChips = [
    { label: 'Improve my portfolio', icon: Sparkles, prompt: 'How can I organize my UX portfolio to attract high-paying Web3 clients?' },
    { label: 'Generate landing page', icon: Layout, prompt: 'Generate a high-converting dark landing page layout for an AI SaaS platform.' },
    { label: 'Design critique', icon: ImageIcon, prompt: 'Give me a detailed visual critique on dark glassmorphism UI cards.' },
    { label: 'Create logo', icon: Pencil, prompt: 'Suggest 3 minimalist geometric logo ideas for a fintech startup.' },
    { label: 'Improve UX', icon: Wrench, prompt: 'What are the top 5 UX micro-interactions to increase mobile checkout conversion?' }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (customText?: string) => {
    const textToSend = customText || inputPrompt;
    if (!textToSend.trim()) return;

    if (!useAICredit(1)) return;

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputPrompt('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: textToSend }),
      });

      const data = await res.json();
      const aiReply = data.result || 'Here is the design recommendation based on your prompt.';

      let attachedImg: string | undefined = undefined;
      if (textToSend.toLowerCase().includes('dashboard') || textToSend.toLowerCase().includes('ui')) {
        attachedImg = 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80';
      } else if (textToSend.toLowerCase().includes('logo') || textToSend.toLowerCase().includes('brand')) {
        attachedImg = 'https://images.unsplash.com/photo-1600132806370-bf17e65e942f?auto=format&fit=crop&w=800&q=80';
      }

      const aiMsg: Message = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: aiReply,
        image: attachedImg,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, aiMsg]);
      addAIHistoryItem({
        title: textToSend.length > 25 ? textToSend.substring(0, 25) + '...' : textToSend,
        category: 'Chat',
        iconType: 'chat',
        details: aiReply
      });
    } catch (err) {
      console.error(err);
      const aiMsg: Message = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: `### Rival AI Design Direction\n\n1. **Visual Hierarchy**: Focus on high contrast obsidian dark canvas (#050508) with electric indigo (#6366f1) primary accent.\n2. **Component Architecture**: Use 24px container padding, 16px corner radius, and subtle hairline border overlays.\n3. **Typography pairing**: Plus Jakarta Sans for headers + JetBrains Mono for telemetry.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, aiMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetChat = () => {
    setMessages([]);
    showToast(t('auto_0JTQuNCw'));
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#050508] font-sans animate-in fade-in duration-200">
      <div className="max-w-md mx-auto min-h-screen px-4 py-4 space-y-4 pb-28 relative flex flex-col justify-between">

        {/* TOP NAVBAR HEADER */}
        <div className="flex items-center justify-between pt-1 relative z-20">
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors flex items-center justify-center active:scale-95"
            aria-label="Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <h1 className="text-base font-extrabold text-white tracking-tight">
            Rival AI Chat
          </h1>

          <button
            onClick={handleResetChat}
            className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 text-indigo-400 hover:text-indigo-300 hover:bg-zinc-800 transition-colors flex items-center justify-center active:scale-95"
            aria-label="New Chat"
          >
            <SquarePen className="w-4 h-4" />
          </button>
        </div>

        {/* MAIN SCROLLABLE BODY CONTENT */}
        <div className="flex-1 space-y-5 pt-2">

          {/* AI AVATAR CIRCLE */}
          <div className="flex justify-center pt-2">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-indigo-950 via-indigo-900 to-purple-900 border border-indigo-500/40 flex items-center justify-center text-indigo-400 shadow-[0_0_30px_rgba(99,102,241,0.35)] relative">
              <Bot className="w-10 h-10 text-indigo-300" />
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-indigo-600 border border-indigo-400 flex items-center justify-center">
                <Sparkles className="w-3 h-3 text-white" />
              </div>
            </div>
          </div>

          {/* GREETING CARD */}
          <div className="rounded-3xl bg-[#0e0e16] border border-zinc-800/90 p-5 text-center space-y-2 shadow-xl">
            <h2 className="text-lg font-extrabold text-white tracking-tight flex items-center justify-center gap-1.5">
              <span>Hi Alex</span>
              <span className="text-base">👋</span>
              <span>, I'm Rival AI.</span>
            </h2>
            <p className="text-xs text-zinc-400 leading-relaxed max-w-xs mx-auto">
              Your creative design assistant. Ask me anything about UI, branding, UX, motion design or creative strategy.
            </p>
          </div>

          {/* QUICK SUGGESTION CHIPS */}
          <div className="flex flex-wrap justify-center gap-2 pt-1">
            {suggestionChips.map((chip, idx) => {
              const IconComp = chip.icon;
              return (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(chip.prompt)}
                  className="px-3.5 py-2 rounded-full bg-[#0c0c14] hover:bg-zinc-900 border border-zinc-800/90 hover:border-zinc-700 text-zinc-300 hover:text-white text-xs font-semibold flex items-center gap-2 transition-all active:scale-95 shadow-sm"
                >
                  <IconComp className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{chip.label}</span>
                </button>
              );
            })}
          </div>

          {/* CHAT MESSAGES THREAD */}
          <div className="space-y-4 pt-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                {/* USER BUBBLE */}
                {msg.sender === 'user' ? (
                  <div className="max-w-[85%] p-4 rounded-3xl rounded-tr-md bg-gradient-to-r from-indigo-600 to-indigo-500 text-white text-xs sm:text-sm font-medium leading-relaxed shadow-lg shadow-indigo-600/20">
                    {msg.text}
                  </div>
                ) : (
                  /* AI BUBBLE CARD */
                  <div className="max-w-[92%] p-4 rounded-3xl rounded-tl-md bg-[#0c0c14] border border-zinc-800/90 text-xs sm:text-sm text-zinc-200 leading-relaxed space-y-3 shadow-xl relative group">
                    <p className="whitespace-pre-wrap">{msg.text}</p>

                    {/* ATTACHED IMAGE PREVIEW */}
                    {msg.image && (
                      <div className="rounded-2xl overflow-hidden border border-zinc-800 relative group bg-zinc-950 mt-2">
                        <img
                          src={msg.image}
                          alt="AI Concept"
                          referrerPolicy="no-referrer"
                          className="w-full h-44 object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-3">
                          <span className="text-[10px] font-mono text-indigo-300 font-bold bg-black/60 px-2 py-1 rounded-full border border-white/10">
                            AI GENERATED DASHBOARD PREVIEW
                          </span>
                        </div>
                      </div>
                    )}

                    {/* AI Message Action Bar (TTS Voice Output + Copy) */}
                    <div className="flex items-center justify-between pt-1 text-[10px] font-mono text-zinc-500 border-t border-zinc-900">
                      <button
                        onClick={() => speakMessage(msg.id, msg.text)}
                        className={`flex items-center gap-1.5 px-2 py-1 rounded-full transition-colors ${
                          speakingMessageId === msg.id
                            ? 'bg-indigo-600 text-white animate-pulse'
                            : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white'
                        }`}
                        title="Озвучить ответ"
                      >
                        {speakingMessageId === msg.id ? (
                          <VolumeX className="w-3.5 h-3.5" />
                        ) : (
                          <Volume2 className="w-3.5 h-3.5 text-indigo-400" />
                        )}
                        <span>{speakingMessageId === msg.id ? 'Стоп' : 'Озвучить'}</span>
                      </button>

                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(msg.text);
                          showToast('Ответ скопирован');
                        }}
                        className="p-1 rounded text-zinc-500 hover:text-zinc-300 transition-colors"
                        title="Скопировать"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
                <span className="text-[9px] font-mono text-zinc-600 px-2 pt-1">
                  {msg.timestamp}
                </span>
              </div>
            ))}

            {/* AI LOADING THINKING STATE */}
            {isLoading && (
              <div className="flex items-center gap-2 text-xs font-mono text-indigo-400 p-3 rounded-2xl bg-[#0c0c14] border border-zinc-800 max-w-xs">
                <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
                <span>Rival AI is thinking...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

        </div>

        {/* BOTTOM FIXED INPUT BAR */}
        <div className="sticky bottom-2 z-30 pt-3">
          <div className="p-2 rounded-full bg-[#0c0c14] border border-zinc-800 shadow-2xl flex items-center gap-2 backdrop-blur-lg">
            {/* Attachment Plus Button */}
            <button
              onClick={() => showToast(t('auto_0JRgNC40'))}
              className="w-9 h-9 rounded-full bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center transition-colors active:scale-95 shrink-0"
              aria-label="Add Attachment"
            >
              <Plus className="w-5 h-5" />
            </button>

            {/* Input Field */}
            <input
              type="text"
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSendMessage();
              }}
              placeholder="Ask Rival AI..."
              className="flex-1 bg-transparent text-xs text-white placeholder-zinc-500 focus:outline-none px-1"
            />

            {/* Mic Voice Button */}
            <button
              onClick={toggleVoiceInput}
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-all active:scale-95 shrink-0 ${
                isListening
                  ? 'bg-rose-600 text-white animate-pulse shadow-[0_0_15px_rgba(225,29,72,0.6)]'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
              }`}
              aria-label="Voice input"
              title={isListening ? 'Остановить запись' : 'Голосовой ввод'}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            {/* Send Button */}
            <button
              onClick={() => handleSendMessage()}
              disabled={isLoading || !inputPrompt.trim()}
              className="w-10 h-10 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center shadow-lg shadow-indigo-600/30 transition-all active:scale-95 shrink-0 disabled:opacity-40"
              aria-label="Send message"
            >
              <ArrowUp className="w-5 h-5 stroke-[2.5]" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
