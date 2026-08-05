import React, { useState } from 'react';
import { 
  ArrowLeft, 
  MoreHorizontal, 
  FileText, 
  Image as ImageIcon, 
  Paperclip, 
  Folder, 
  MessageSquare, 
  Sparkles, 
  Check, 
  Copy, 
  Share2, 
  X,
  Send,
  AlertCircle
} from 'lucide-react';
import { OrderDetailData } from '../types';
import { ChatService } from '../services/ChatService';
import { ChatView } from './chat/ChatView';
import { useTranslation } from "../context/LanguageContext";
import { getOrderStatusInfo } from '../utils/statusHelper';

interface OrderDetailModalProps {
  order?: OrderDetailData | null;
  onClose: () => void;
  onOpenMessages?: (chatId: string) => void;
}

export const OrderDetailModal: React.FC<OrderDetailModalProps> = ({ 
  order, 
  onClose,
  onOpenMessages
}) => {
    const { t } = useTranslation();

  const [activeChatId, setActiveChatId] = useState<string | null>(null);

  const startOrderChat = async () => {
    try {
      const chat = await ChatService.getOrCreateChat('order', currentOrder.id, {
        participantName: currentOrder.designer.name,
        participantAvatar: currentOrder.designer.avatar
      });
      if (chat) {
        if (onOpenMessages) {
          onClose();
          onOpenMessages(chat.id);
        } else {
          setActiveChatId(chat.id);
        }
      } else {
        showToast('Failed to start chat');
      }
    } catch (e) {
      console.error(e);
      showToast('Failed to start chat');
    }
  };

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isOptionsMenuOpen, setIsOptionsMenuOpen] = useState(false);
  const [isRevisionModalOpen, setIsRevisionModalOpen] = useState(false);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [revisionNotes, setRevisionNotes] = useState('');
  const [directMessageText, setDirectMessageText] = useState('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Default values matching the exact screenshot
  const defaultOrder: OrderDetailData = {
    id: 'ORD-9932',
    title: 'Cyber-Interface v2',
    status: 'In Progress',
    price: '$1,200',
    created: 'Oct 24',
    deadline: 'Nov 12',
    progressPercent: 65,
    currentStepIndex: 1, // 'Design' step active
    designer: {
      name: 'Alex Mercer',
      role: 'Lead Designer',
      avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=200&q=80'
    },
    files: [
      { id: 'f1', name: 'Project Brief', type: 'document', status: 'Ready' },
      { id: 'f2', name: 'References', type: 'image', status: 'Ready' },
      { id: 'f3', name: 'Preview v1', type: 'link', status: 'In Review' },
      { id: 'f4', name: 'Final Files', type: 'folder', status: 'Pending' }
    ],
    timeline: [
      { title: 'Preview Sent', time: 'Today', active: true },
      { title: 'Work Started', time: 'Yesterday' },
      { title: 'Designer Assigned', time: 'Oct 24, 11:30 AM' },
      { title: 'Order Created', time: 'Oct 24, 10:15 AM' }
    ],
    designerNote: '"Focusing on the glassmorphism depth and orbital animations for the main hero."'
  };

  const rawOrder = order || defaultOrder;
  const statusInfo = getOrderStatusInfo(rawOrder.status);
  const currentOrder: OrderDetailData = {
    id: rawOrder.id || 'ORD-9932',
    title: rawOrder.title || (rawOrder as any).projectType || 'Cyber-Interface v2',
    status: statusInfo.label,
    price: rawOrder.price || (rawOrder as any).budget || '$1,200',
    created: rawOrder.created || (rawOrder as any).createdAt || 'Oct 24',
    deadline: rawOrder.deadline || 'Nov 12',
    progressPercent: statusInfo.progressPercent,
    currentStepIndex: statusInfo.currentStepIndex,
    designer: {
      name: rawOrder.designer?.name || 'Rival Studio Team',
      role: rawOrder.designer?.role || 'Lead Designer',
      avatar: rawOrder.designer?.avatar || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=200&q=80'
    },
    files: rawOrder.files || [
      { id: 'f1', name: 'Project Brief', type: 'document', status: 'Ready' }
    ],
    timeline: rawOrder.timeline || [
      { title: t('order_created'), time: (rawOrder as any).createdAt || 'Today', active: true }
    ],
    designerNote: rawOrder.designerNote || (rawOrder as any).notes
  };

  const steps = [
    { label: 'Discovery', key: 'discovery' },
    { label: 'Design', key: 'design' },
    { label: 'Preview', key: 'preview' },
    { label: 'Revision', key: 'revision' },
    { label: 'Completed', key: 'completed' },
  ];

  const handleCopyId = () => {
    navigator.clipboard?.writeText(currentOrder.id);
    showToast(`Скопировано: ${currentOrder.id}`);
    setIsOptionsMenuOpen(false);
  };

  const handleSendRevision = (e: React.FormEvent) => {
    e.preventDefault();
    if (!revisionNotes.trim()) return;
    showToast(t('edits_have_been_successfully_s'));
    setRevisionNotes('');
    setIsRevisionModalOpen(false);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!directMessageText.trim()) return;
    const msg = directMessageText;
    setDirectMessageText('');
    setIsMessageModalOpen(false);

    try {
      const chat = await ChatService.getOrCreateChat('order', currentOrder.id, {
        participantName: currentOrder.designer.name,
        participantAvatar: currentOrder.designer.avatar
      });
      if (chat) {
        await ChatService.sendMessage(chat.id, msg);
        if (onOpenMessages) {
          onClose();
          onOpenMessages(chat.id);
        } else {
          setActiveChatId(chat.id);
        }
      }
    } catch (err) {
      console.error(err);
      showToast('Failed to send message');
    }
  };

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

  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl p-0 sm:p-4 overflow-y-auto">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-indigo-600 text-white font-mono text-xs px-4 py-2 rounded-full shadow-2xl border border-indigo-400 flex items-center gap-2 animate-bounce">
          <Sparkles className="w-4 h-4 text-yellow-300" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div 
        className="w-full max-w-lg bg-[#07070a] border border-zinc-800/90 rounded-none sm:rounded-3xl overflow-hidden shadow-2xl text-zinc-100 min-h-screen sm:min-h-0 sm:max-h-[92vh] flex flex-col my-auto relative animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* TOP BAR (Exact like screenshot) */}
        <div className="sticky top-0 z-30 flex items-center justify-between px-4 py-3.5 bg-[#07070a]/95 backdrop-blur-md border-b border-zinc-900">
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800/80 rounded-full transition-colors"
            aria-label="Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <h1 className="text-base font-bold text-white tracking-tight">
            Order Details
          </h1>

          <div className="relative">
            <button
              onClick={() => setIsOptionsMenuOpen(!isOptionsMenuOpen)}
              className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800/80 rounded-full transition-colors"
              aria-label="More options"
            >
              <MoreHorizontal className="w-5 h-5" />
            </button>

            {/* Options Dropdown */}
            {isOptionsMenuOpen && (
              <div className="absolute right-0 top-10 w-48 bg-[#0e0e16] border border-zinc-800 rounded-2xl shadow-2xl p-1.5 z-40 space-y-1">
                <button
                  onClick={handleCopyId}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs text-zinc-300 hover:text-white hover:bg-zinc-800/80 rounded-xl transition-colors text-left"
                >
                  <Copy className="w-4 h-4 text-indigo-400" />
                  <span>Copy Order ID</span>
                </button>

                <button
                  onClick={() => {
                    showToast(t('order_link_copied_to_clipboard'));
                    setIsOptionsMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs text-zinc-300 hover:text-white hover:bg-zinc-800/80 rounded-xl transition-colors text-left"
                >
                  <Share2 className="w-4 h-4 text-indigo-400" />
                  <span>Share Order</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* SCROLLABLE CONTENT AREA */}
        <div className="overflow-y-auto p-4 sm:p-5 space-y-6 pb-24 sm:pb-8 font-sans">

          {/* ORDER OVERVIEW CARD */}
          <div className="p-5 rounded-3xl bg-[#0e0e16] border border-zinc-800/90 shadow-xl space-y-4">
            {/* Top row: Order ID + In Progress Badge */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-zinc-500 tracking-wider">
                {currentOrder.id}
              </span>

              <span className="px-3 py-1 rounded-full bg-[#131326] border border-indigo-500/30 text-indigo-300 font-mono text-[11px] font-bold flex items-center gap-2 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-indigo-400 shadow-[0_0_8px_rgba(99,102,241,0.9)] animate-pulse" />
                <span>{currentOrder.status}</span>
              </span>
            </div>

            {/* Title */}
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {currentOrder.title}
            </h2>

            {/* Divider */}
            <div className="border-t border-zinc-800/80 pt-4" />

            {/* 3 Columns: Price / Created / Deadline */}
            <div className="grid grid-cols-3 gap-2">
              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 font-bold block">
                  PRICE
                </span>
                <span className="text-sm sm:text-base font-extrabold text-white font-sans block">
                  {currentOrder.price}
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 font-bold block">
                  CREATED
                </span>
                <span className="text-sm sm:text-base font-semibold text-zinc-200 block">
                  {currentOrder.created}
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 font-bold block">
                  DEADLINE
                </span>
                <span className="text-sm sm:text-base font-semibold text-zinc-200 block">
                  {currentOrder.deadline}
                </span>
              </div>
            </div>
          </div>

          {/* OVERALL PROGRESS SECTION */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-zinc-300">Overall Progress</span>
              <span className="text-indigo-400 font-mono text-sm">{currentOrder.progressPercent}%</span>
            </div>

            {/* STEP PROGRESS TRACKER */}
            <div className="pt-2 pb-1 relative">
              {/* Connecting Line */}
              <div className="absolute top-4 left-6 right-6 h-0.5 bg-zinc-800 -z-0" />
              <div 
                className="absolute top-4 left-6 h-0.5 bg-indigo-500 transition-all duration-500 -z-0" 
                style={{ width: `${(currentOrder.currentStepIndex / (steps.length - 1)) * 88}%` }}
              />

              {/* Dots & Labels */}
              <div className="flex items-center justify-between relative z-10">
                {steps.map((step, idx) => {
                  const isDone = idx < currentOrder.currentStepIndex;
                  const isActive = idx === currentOrder.currentStepIndex;

                  return (
                    <div key={step.key} className="flex flex-col items-center gap-2 group">
                      <div className="relative flex items-center justify-center">
                        {isActive ? (
                          <div className="w-6 h-6 rounded-full bg-indigo-950 border-2 border-indigo-400 flex items-center justify-center shadow-[0_0_12px_rgba(99,102,241,0.8)]">
                            <div className="w-2.5 h-2.5 rounded-full bg-indigo-400" />
                          </div>
                        ) : isDone ? (
                          <div className="w-4 h-4 rounded-full bg-indigo-500 flex items-center justify-center shadow-[0_0_8px_rgba(99,102,241,0.6)]">
                            <Check className="w-2.5 h-2.5 text-white" />
                          </div>
                        ) : (
                          <div className="w-3.5 h-3.5 rounded-full bg-zinc-700 border border-zinc-800" />
                        )}
                      </div>

                      <span className={`text-[11px] font-sans transition-colors ${
                        isActive 
                          ? 'text-indigo-300 font-bold' 
                          : isDone 
                            ? 'text-zinc-300 font-medium' 
                            : 'text-zinc-500'
                      }`}>
                        {step.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ASSIGNED DESIGNER CARD */}
          <div className="p-4 rounded-3xl bg-[#0e0e16] border border-zinc-800/90 shadow-lg flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src={currentOrder.designer.avatar}
                  alt={currentOrder.designer.name}
                  referrerPolicy="no-referrer"
                  className="w-12 h-12 rounded-full object-cover border border-indigo-500/40"
                />
                <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#0e0e16]" />
              </div>

              <div>
                <h3 className="text-sm font-bold text-white">
                  {currentOrder.designer.name}
                </h3>
                <p className="text-xs text-zinc-400 font-sans">
                  {currentOrder.designer.role}
                </p>
              </div>
            </div>

            <button
              onClick={startOrderChat}
              className="px-4 py-2 rounded-full border border-zinc-700 hover:border-indigo-500/60 bg-zinc-900/80 hover:bg-zinc-800 text-xs font-semibold text-zinc-200 hover:text-white transition-all active:scale-95"
            >
              Message
            </button>
          </div>

          {/* PROJECT FILES SECTION (2x2 Grid) */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white tracking-tight">
              Project Files
            </h3>

            <div className="grid grid-cols-2 gap-3">
              {currentOrder.files.map((file) => {
                const isInReview = file.status === 'In Review';
                const isReady = file.status === 'Ready';

                return (
                  <div
                    key={file.id}
                    onClick={() => showToast(`Открытие файла: ${file.name}`)}
                    className={`p-4 rounded-2xl bg-[#0e0e16] transition-all cursor-pointer space-y-3 shadow-md group ${
                      isInReview 
                        ? 'border border-indigo-500/60 shadow-[0_0_15px_rgba(99,102,241,0.15)]' 
                        : 'border border-zinc-800/80 hover:border-zinc-700'
                    }`}
                  >
                    <div className="text-zinc-300 group-hover:text-indigo-400 transition-colors">
                      {file.type === 'document' && <FileText className="w-5 h-5 text-indigo-400" />}
                      {file.type === 'image' && <ImageIcon className="w-5 h-5 text-indigo-400" />}
                      {file.type === 'link' && <Paperclip className="w-5 h-5 text-indigo-400" />}
                      {file.type === 'folder' && <Folder className="w-5 h-5 text-zinc-400" />}
                    </div>

                    <div className="space-y-0.5">
                      <h4 className="text-xs font-bold text-white truncate">
                        {file.name}
                      </h4>
                      <p className={`text-[11px] font-medium ${
                        isReady 
                          ? 'text-emerald-400' 
                          : isInReview 
                            ? 'text-indigo-400' 
                            : 'text-zinc-500'
                      }`}>
                        {file.status}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* TIMELINE SECTION */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white tracking-tight">
              Timeline
            </h3>

            <div className="space-y-4 pl-2 relative">
              {/* Timeline vertical guide line */}
              <div className="absolute top-2 bottom-2 left-3.5 w-0.5 bg-zinc-800" />

              {currentOrder.timeline.map((item, idx) => (
                <div key={idx} className="flex items-start gap-3.5 relative z-10">
                  <div className={`w-3.5 h-3.5 rounded-full mt-1 flex items-center justify-center shrink-0 ${
                    item.active 
                      ? 'bg-indigo-500 ring-4 ring-indigo-950 shadow-[0_0_10px_rgba(99,102,241,0.8)]' 
                      : 'bg-zinc-700'
                  }`} />

                  <div className="space-y-0.5">
                    <h4 className={`text-xs font-bold ${item.active ? 'text-white' : 'text-zinc-300'}`}>
                      {item.title}
                    </h4>
                    <p className="text-[11px] text-zinc-500">
                      {item.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* DESIGNER NOTE SECTION */}
          {currentOrder.designerNote && (
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-white tracking-tight">
                Designer Note
              </h3>

              <div className="p-4 rounded-2xl bg-gradient-to-br from-[#0e0e1a] to-[#121226] border border-zinc-800/90 shadow-lg">
                <p className="text-xs text-zinc-300 italic leading-relaxed font-sans">
                  {currentOrder.designerNote}
                </p>
              </div>
            </div>
          )}

          {/* BOTTOM ACTION BUTTONS */}
          <div className="space-y-3 pt-2">
            <button
              onClick={startOrderChat}
              className="w-full py-3.5 rounded-2xl bg-[#0e0e16] hover:bg-zinc-800 border border-zinc-800 text-white font-bold text-xs uppercase tracking-wider transition-all active:scale-95 shadow-md flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-4 h-4 text-zinc-400" />
              <span>Contact Designer</span>
            </button>

            <button
              onClick={() => setIsRevisionModalOpen(true)}
              className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-indigo-600/30 transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Request Revision</span>
            </button>
          </div>

        </div>
      </div>

      {/* REVISION MODAL */}
      {isRevisionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="w-full max-w-md bg-[#0c0c14] border border-zinc-800 rounded-3xl p-6 space-y-4 text-white animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-400" />
                <span>{t('request_edits')}</span>
              </h3>
              <button onClick={() => setIsRevisionModalOpen(false)} className="text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-zinc-400">
              {t('describe_in_more_detail_what_n')}</p>

            <form onSubmit={handleSendRevision} className="space-y-4">
              <textarea
                rows={4}
                value={revisionNotes}
                onChange={(e) => setRevisionNotes(e.target.value)}
                placeholder={t('for_example_change_the_backgro')}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-3.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
                required
              />

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsRevisionModalOpen(false)}
                  className="w-1/2 py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-xs font-semibold text-zinc-300"
                >
                  {t('cancel')}</button>
                <button
                  type="submit"
                  className="w-1/2 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{t('send')}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DIRECT MESSAGE MODAL */}
      {isMessageModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="w-full max-w-md bg-[#0c0c14] border border-zinc-800 rounded-3xl p-6 space-y-4 text-white animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src={currentOrder.designer.avatar} alt="Avatar" className="w-8 h-8 rounded-full" />
                <div>
                  <h3 className="text-sm font-bold">{currentOrder.designer.name}</h3>
                  <p className="text-[10px] text-emerald-400 font-mono">Online</p>
                </div>
              </div>
              <button onClick={() => setIsMessageModalOpen(false)} className="text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSendMessage} className="space-y-4">
              <textarea
                rows={3}
                value={directMessageText}
                onChange={(e) => setDirectMessageText(e.target.value)}
                placeholder={t('write_a_direct_message_to_the')}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
                required
              />

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{t('send_message')}</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
