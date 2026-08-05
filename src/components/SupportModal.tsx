import React, { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronDown, 
  ChevronUp, 
  Bell, 
  Bot, 
  User, 
  CreditCard, 
  Briefcase, 
  Wrench, 
  Sparkles, 
  Send, 
  Mail, 
  MessageSquare, 
  FileText, 
  ArrowRight,
  X,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { ChatService, ChatSession } from '../services/ChatService';
import { ChatView } from './chat/ChatView';
import { useTranslation } from "../context/LanguageContext";

interface SupportModalProps {
  onClose: () => void;
  onOpenNotifications?: () => void;
  onOpenMessages?: (chatId?: string) => void;
}

interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export const SupportModal: React.FC<SupportModalProps> = ({ 
  onClose, 
  onOpenNotifications,
  onOpenMessages 
}) => {
    const { t } = useTranslation();

  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [isLoadingChat, setIsLoadingChat] = useState(false);

  const startSupportChat = async () => {
    setIsLoadingChat(true);
    try {
      const chat = await ChatService.getOrCreateChat('support', undefined, {
        participantName: 'Rival Support',
        participantAvatar: 'https://cdn3d.iconscout.com/3d/premium/thumb/customer-service-4993855-4161747.png'
      });
      if (chat && onOpenMessages) {
        onClose();
        onOpenMessages(chat.id);
      }
    } catch (e) {
      console.error(e);
      showToast('Failed to start chat');
    }
    setIsLoadingChat(false);
  };

  const [openFaqId, setOpenFaqId] = useState<string | null>('faq-1');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isAiChatOpen, setIsAiChatOpen] = useState(false);
  const [aiQuestion, setAiQuestion] = useState('');
  const [aiAnswer, setAiAnswer] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const faqs: FaqItem[] = [
    {
      id: 'faq-1',
      question: 'How do I upgrade to Pro?',
      answer: 'You can upgrade to Pro by visiting your Account Settings, navigating to the Billing tab, and selecting the "Upgrade to Pro" option.'
    },
    {
      id: 'faq-2',
      question: 'How do I upload project assets?',
      answer: 'Go to your active project space, click on the "Upload Assets" button, and drag & drop your files or select them from your device.'
    },
    {
      id: 'faq-3',
      question: 'How long does a design project take?',
      answer: 'Standard design requests are typically completed within 24 to 48 hours depending on complexity and revision rounds.'
    },
    {
      id: 'faq-4',
      question: 'How can I contact my designer?',
      answer: 'Use the Messages section in Rival Space to start a real-time chat direct with your assigned lead designer Alex Mercer.'
    },
    {
      id: 'faq-5',
      question: 'How do revisions work?',
      answer: 'Submit revision feedback directly on the design preview canvas. Pro members get unlimited revision iterations.'
    }
  ];

  const toggleFaq = (id: string) => {
    setOpenFaqId(prev => (prev === id ? null : id));
  };

  const handleAskAi = () => {
    if (!aiQuestion.trim()) return;
    setIsAiLoading(true);
    setAiAnswer(null);

    setTimeout(() => {
      setIsAiLoading(false);
      setAiAnswer(`Rival AI: Based on your query "${aiQuestion}", our designers and system operate 24/7. Your project files and licenses are active under your Pro workspace subscription.`);
    }, 1200);
  };

  
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#050508] font-sans animate-in fade-in duration-200">
      <div className="max-w-md mx-auto min-h-screen px-4 py-6 space-y-6 pb-28">
        
        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-indigo-600 text-white font-mono text-xs px-4 py-2 rounded-full shadow-2xl border border-indigo-400 flex items-center gap-2 animate-bounce">
            <Sparkles className="w-4 h-4 text-yellow-300" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* TOP NAVIGATION BAR */}
        <div className="flex items-center justify-between pt-1">
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors flex items-center justify-center active:scale-95"
            aria-label="Back"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <span className="text-xs font-mono font-bold tracking-widest text-zinc-300 uppercase">
            RIVAL SPACE
          </span>

          <button
            onClick={() => {
              if (onOpenNotifications) {
                onClose();
                onOpenNotifications();
              } else {
                showToast(t('notifications'));
              }
            }}
            className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors flex items-center justify-center active:scale-95 relative"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_6px_rgba(99,102,241,0.9)]" />
          </button>
        </div>

        {/* TOP ONLINE BADGE & PAGE TITLE */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-[11px] font-mono font-bold text-emerald-300 uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Support Online</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Support Center
          </h1>

          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed max-w-xs mx-auto">
            Get help whenever you need it.
          </p>
        </div>

        {/* HERO ASSISTANCE CARD */}
        <div className="p-6 rounded-3xl bg-gradient-to-b from-[#121222] via-[#0e0e1a] to-[#0b0b14] border border-indigo-500/30 shadow-xl space-y-4">
          <h2 className="text-xl font-extrabold text-white tracking-tight">
            Need assistance?
          </h2>

          <p className="text-xs text-zinc-300 leading-relaxed font-sans">
            Our team and AI assistant are here to help you solve problems faster.
          </p>

          <div className="space-y-2.5 pt-1">
            <button
              onClick={startSupportChat}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:opacity-90 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-indigo-600/30 transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <span>Contact Support</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setIsAiChatOpen(true)}
              className="w-full py-3.5 rounded-2xl bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-700/80 text-zinc-200 font-bold text-xs uppercase tracking-wider transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <span>AI Assistant</span>
              <Bot className="w-4 h-4 text-indigo-400" />
            </button>
          </div>
        </div>

        {/* HELP CATEGORIES LIST */}
        <div className="space-y-2.5">
          {/* 1. Account Issues */}
          <div 
            onClick={() => showToast(t('auto_0KDQsNC3'))}
            className="p-4 rounded-2xl bg-[#0e0e16] border border-zinc-800/90 hover:border-zinc-700 transition-all cursor-pointer flex items-center gap-3.5 group"
          >
            <div className="w-10 h-10 rounded-2xl bg-zinc-900 border border-zinc-800/80 flex items-center justify-center text-zinc-300 group-hover:text-white shrink-0">
              <User className="w-4 h-4 text-zinc-300" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white tracking-tight">Account Issues</h4>
              <p className="text-xs text-zinc-400">Login, security, and profile settings.</p>
            </div>
          </div>

          {/* 2. Payments */}
          <div 
            onClick={() => showToast(t('auto_0KDQsNC3'))}
            className="p-4 rounded-2xl bg-[#0e0e16] border border-zinc-800/90 hover:border-zinc-700 transition-all cursor-pointer flex items-center gap-3.5 group"
          >
            <div className="w-10 h-10 rounded-2xl bg-zinc-900 border border-zinc-800/80 flex items-center justify-center text-zinc-300 group-hover:text-white shrink-0">
              <CreditCard className="w-4 h-4 text-zinc-300" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white tracking-tight">Payments</h4>
              <p className="text-xs text-zinc-400">Invoices, billing, and subscriptions.</p>
            </div>
          </div>

          {/* 3. Project Help */}
          <div 
            onClick={() => showToast(t('auto_0KDQsNC3'))}
            className="p-4 rounded-2xl bg-[#0e0e16] border border-zinc-800/90 hover:border-zinc-700 transition-all cursor-pointer flex items-center gap-3.5 group"
          >
            <div className="w-10 h-10 rounded-2xl bg-zinc-900 border border-zinc-800/80 flex items-center justify-center text-zinc-300 group-hover:text-white shrink-0">
              <Briefcase className="w-4 h-4 text-zinc-300" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white tracking-tight">Project Help</h4>
              <p className="text-xs text-zinc-400">Managing designs and revisions.</p>
            </div>
          </div>

          {/* 4. Technical Support */}
          <div 
            onClick={() => showToast(t('auto_0KDQsNC3'))}
            className="p-4 rounded-2xl bg-[#0e0e16] border border-zinc-800/90 hover:border-zinc-700 transition-all cursor-pointer flex items-center gap-3.5 group"
          >
            <div className="w-10 h-10 rounded-2xl bg-zinc-900 border border-zinc-800/80 flex items-center justify-center text-zinc-300 group-hover:text-white shrink-0">
              <Wrench className="w-4 h-4 text-zinc-300" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white tracking-tight">Technical Support</h4>
              <p className="text-xs text-zinc-400">Bug reports and platform issues.</p>
            </div>
          </div>
        </div>

        {/* RIVAL AI SUPPORT CARD */}
        <div className="p-5 rounded-3xl bg-[#0e0e16] border border-zinc-800/90 shadow-xl space-y-3.5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/40 shrink-0">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight">
                Rival AI Support
              </h3>
              <p className="text-xs text-zinc-400">
                Instant answers powered by AI
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsAiChatOpen(true)}
            className="w-full py-3 rounded-2xl bg-[#141426] hover:bg-indigo-950/80 border border-indigo-500/40 text-indigo-300 font-bold text-xs uppercase tracking-wider transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <span>Ask AI</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* FREQUENTLY ASKED QUESTIONS SECTION */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-white tracking-tight px-1">
            Frequently Asked Questions
          </h3>

          <div className="rounded-3xl bg-[#0e0e16] border border-zinc-800/90 overflow-hidden divide-y divide-zinc-800/70 shadow-xl">
            {faqs.map(faq => {
              const isOpen = openFaqId === faq.id;

              return (
                <div key={faq.id} className="transition-colors">
                  <button
                    onClick={() => toggleFaq(faq.id)}
                    className="w-full p-4 flex items-center justify-between text-left hover:bg-zinc-900/40 transition-colors"
                  >
                    <span className="text-xs font-bold text-white pr-2">
                      {faq.question}
                    </span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-zinc-400 shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-zinc-400 shrink-0" />
                    )}
                  </button>

                  {isOpen && (
                    <div className="px-4 pb-4 pt-1 text-xs text-zinc-400 leading-relaxed font-sans border-t border-zinc-800/50 bg-[#090910]">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* YOUR REQUESTS SECTION */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-white tracking-tight px-1">
            Your Requests
          </h3>

          <div className="space-y-2">
            {/* Request 1 */}
            <div className="p-4 rounded-2xl bg-[#0e0e16] border border-zinc-800/90 flex items-center justify-between">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-zinc-900 border border-zinc-800/80 flex items-center justify-center text-zinc-300 shrink-0">
                  <FileText className="w-4 h-4 text-zinc-300" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-white">#RS-2048</span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 text-[9px] font-mono font-bold">
                      Resolved
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 mt-0.5">Payment issue</p>
                </div>
              </div>
            </div>

            {/* Request 2 */}
            <div className="p-4 rounded-2xl bg-[#0e0e16] border border-zinc-800/90 flex items-center justify-between">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-zinc-900 border border-zinc-800/80 flex items-center justify-center text-zinc-300 shrink-0">
                  <Wrench className="w-4 h-4 text-zinc-300" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-white">#RS-2051</span>
                    <span className="px-2 py-0.5 rounded-full bg-amber-950/80 border border-amber-500/40 text-amber-400 text-[9px] font-mono font-bold">
                      In Progress
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 mt-0.5">Project revision request</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* MORE WAYS TO CONTACT US */}
        <div className="space-y-3">
          <h3 className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-widest px-1">
            More ways to contact us
          </h3>

          <div className="space-y-2">
            <button
              onClick={() => showToast(t('auto_0JQtdGA0'))}
              className="w-full p-4 rounded-2xl bg-[#0e0e16] hover:bg-zinc-900 border border-zinc-800/90 text-xs font-bold text-white flex items-center justify-center gap-2 transition-all active:scale-95 shadow-sm"
            >
              <Send className="w-4 h-4 text-indigo-400" />
              <span>Telegram Support</span>
            </button>

            <button
              onClick={() => showToast(t('auto_0J7RgtC0'))}
              className="w-full p-4 rounded-2xl bg-[#0e0e16] hover:bg-zinc-900 border border-zinc-800/90 text-xs font-bold text-white flex items-center justify-center gap-2 transition-all active:scale-95 shadow-sm"
            >
              <Mail className="w-4 h-4 text-indigo-400" />
              <span>Email Support</span>
            </button>

            <button
              onClick={() => showToast(t('auto_0JQtdGA0'))}
              className="w-full p-4 rounded-2xl bg-[#0e0e16] hover:bg-zinc-900 border border-zinc-800/90 text-xs font-bold text-white flex items-center justify-center gap-2 transition-all active:scale-95 shadow-sm"
            >
              <MessageSquare className="w-4 h-4 text-indigo-400" />
              <span>Community</span>
            </button>
          </div>
        </div>

      </div>

      {/* AI CHAT INTERACTIVE MODAL */}
      {isAiChatOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-sm bg-[#0e0e18] border border-zinc-800 rounded-3xl p-5 space-y-4 text-white animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5 text-indigo-400" />
                <h3 className="text-sm font-bold">Rival AI Support Assistant</h3>
              </div>
              <button onClick={() => setIsAiChatOpen(false)} className="text-zinc-500 hover:text-zinc-300">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-xs text-zinc-400 font-mono">{t('auto_0JfQsNC0')}</label>
              <textarea
                rows={3}
                value={aiQuestion}
                onChange={(e) => setAiQuestion(e.target.value)}
                placeholder={t('auto_0J3QsNC0')}
                className="w-full p-3 rounded-2xl bg-zinc-900 border border-zinc-700 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500 resize-none"
              />
            </div>

            {aiAnswer && (
              <div className="p-3 rounded-xl bg-indigo-950/60 border border-indigo-500/40 text-xs text-indigo-200 leading-relaxed font-mono">
                {aiAnswer}
              </div>
            )}

            <button
              onClick={handleAskAi}
              disabled={isAiLoading}
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-indigo-600/30 transition-all active:scale-95 disabled:opacity-50"
            >
              {isAiLoading ? t('ai_thinks') : t('send_request')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
