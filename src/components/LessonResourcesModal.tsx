import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Download, 
  Folder, 
  CheckCircle2, 
  FileText, 
  FileCode, 
  Archive, 
  Video, 
  Sparkles, 
  ArrowRight,
  Layers,
  Check
} from 'lucide-react';
import { useTranslation } from "../context/LanguageContext";

interface ResourceItem {
  id: string;
  name: string;
  type: string;
  size: string;
  icon: 'fig' | 'pdf' | 'zip' | 'mp4';
  downloaded: boolean;
  selected: boolean;
}

interface LessonResourcesModalProps {
  lessonTitle?: string;
  lessonNumber?: number | string;
  onClose: () => void;
  onOpenAI?: () => void;
}

export const LessonResourcesModal: React.FC<LessonResourcesModalProps> = ({
  lessonTitle = 'Advanced Grid Systems',
  lessonNumber = '7',
  onClose,
  onOpenAI
}) => {
    const { t } = useTranslation();
  const [activeFilter, setActiveFilter] = useState('UI Files');
  const [availableOffline, setAvailableOffline] = useState(true);
  const [isDownloadingAll, setIsDownloadingAll] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(60);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [resources, setResources] = useState<ResourceItem[]>([
    {
      id: 'r1',
      name: 'Advanced_Grid_Master.fig',
      type: 'FIG',
      size: '42.5 MB',
      icon: 'fig',
      downloaded: true,
      selected: true
    },
    {
      id: 'r2',
      name: 'Design_System_Guidelines.pdf',
      type: 'PDF',
      size: '8.2 MB',
      icon: 'pdf',
      downloaded: false,
      selected: true
    },
    {
      id: 'r3',
      name: 'UI_Asset_Pack_v2.zip',
      type: 'ZIP',
      size: '156 MB',
      icon: 'zip',
      downloaded: false,
      selected: true
    },
    {
      id: 'r4',
      name: 'Grid_Layout_Demo.mp4',
      type: 'MP4',
      size: '41.3 MB',
      icon: 'mp4',
      downloaded: false,
      selected: false
    }
  ]);

  const filters = ['UI Files', 'Templates', 'Icons', 'Assets', 'Fonts'];

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const toggleSelect = (id: string) => {
    setResources(prev =>
      prev.map(item =>
        item.id === id ? { ...item, selected: !item.selected } : item
      )
    );
  };

  const selectedCount = resources.filter(r => r.selected).length;

  const handleDownloadSelected = () => {
    if (selectedCount === 0) {
      showToast(t('select_files_to_download'));
      return;
    }
    setIsDownloadingAll(true);
    setDownloadProgress(20);
    showToast(`Загрузка ${selectedCount} файлов началась...`);

    const interval = setInterval(() => {
      setDownloadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsDownloadingAll(false);
          setResources(rList => rList.map(r => r.selected ? { ...r, downloaded: true } : r));
          showToast(t('all_selected_resources_have_be'));
          return 100;
        }
        return prev + 20;
      });
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#050508] font-sans animate-in fade-in duration-200">
      <div className="max-w-md mx-auto min-h-screen px-4 py-6 space-y-5 pb-28">

        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-indigo-600 text-white font-mono text-xs px-4 py-2 rounded-full shadow-2xl border border-indigo-400 flex items-center gap-2 animate-bounce">
            <Sparkles className="w-4 h-4 text-yellow-300" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* TOP HEADER BAR */}
        <div className="flex items-center justify-between pt-1">
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors flex items-center justify-center active:scale-95"
            aria-label="Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <h1 className="text-base font-bold text-white tracking-tight">
            Lesson Resources
          </h1>

          <button
            onClick={handleDownloadSelected}
            className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors flex items-center justify-center active:scale-95"
            aria-label="Download All"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>

        {/* TOP LESSON INFO CARD */}
        <div className="p-5 rounded-3xl bg-[#0e0e16] border border-zinc-800/90 space-y-4 shadow-xl">
          <div className="space-y-1">
            <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest block">
              LESSON {lessonNumber}
            </span>
            <h2 className="text-xl font-extrabold text-white tracking-tight">
              {lessonTitle}
            </h2>
          </div>

          <div className="flex items-center gap-2 text-xs text-zinc-400 font-sans">
            <Folder className="w-4 h-4 text-zinc-400" />
            <span>14 resources included</span>
            <span>•</span>
            <span>248 MB</span>
          </div>

          {/* Progress Bar Container */}
          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-400 font-sans">Downloading resources...</span>
              <span className="font-mono font-bold text-indigo-400">{downloadProgress}%</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-zinc-800/90 overflow-hidden">
              <div 
                className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300 shadow-[0_0_10px_rgba(99,102,241,0.5)]"
                style={{ width: `${downloadProgress}%` }}
              />
            </div>
          </div>
        </div>

        {/* FILTER PILLS */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          {filters.map((filter) => {
            const isActive = activeFilter === filter;
            return (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all active:scale-95 ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 border border-indigo-500'
                    : 'bg-[#0e0e16] text-zinc-300 border border-zinc-800 hover:bg-zinc-900 hover:text-white'
                }`}
              >
                {filter}
              </button>
            );
          })}
        </div>

        {/* RESOURCE FILE CARDS LIST */}
        <div className="space-y-3">
          {resources.map((file) => (
            <div
              key={file.id}
              onClick={() => toggleSelect(file.id)}
              className={`p-4 rounded-2xl border transition-all flex items-center justify-between cursor-pointer shadow-md ${
                file.selected
                  ? 'bg-[#0e0e18] border-indigo-500/80 shadow-[0_0_15px_rgba(99,102,241,0.15)]'
                  : 'bg-[#0e0e16] border-zinc-800/90 hover:border-zinc-700'
              }`}
            >
              <div className="flex items-center gap-3.5">
                {/* File Icon Box */}
                <div className="w-11 h-11 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0">
                  {file.icon === 'fig' && <Layers className="w-5 h-5 text-indigo-400" />}
                  {file.icon === 'pdf' && <FileText className="w-5 h-5 text-red-400" />}
                  {file.icon === 'zip' && <Archive className="w-5 h-5 text-cyan-400" />}
                  {file.icon === 'mp4' && <Video className="w-5 h-5 text-purple-400" />}
                </div>

                <div className="space-y-1">
                  <h3 className="text-xs font-bold text-white tracking-tight">
                    {file.name}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="px-1.5 py-0.5 rounded bg-zinc-800 text-[10px] font-mono font-bold text-zinc-300">
                      {file.type}
                    </span>
                    <span className="text-[11px] font-mono text-zinc-400">
                      {file.size}
                    </span>
                  </div>
                </div>
              </div>

              {/* Checkmark or Download Icon */}
              <div>
                {file.downloaded || file.selected ? (
                  <div className="w-8 h-8 rounded-full bg-indigo-950/80 border border-indigo-500/50 flex items-center justify-center text-indigo-400 shadow-md">
                    <Check className="w-4 h-4 stroke-[3]" />
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white">
                    <Download className="w-4 h-4" />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* AI RESOURCE GENERATION BANNER */}
        <div className="p-5 rounded-3xl bg-[#0e0e16] border border-zinc-800/90 space-y-3 shadow-xl">
          <div className="flex items-center gap-2 text-white font-bold text-sm">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span>Need additional resources?</span>
          </div>
          <p className="text-xs text-zinc-400 font-sans leading-relaxed">
            Generate custom grid templates or placeholder assets specific to your project requirements.
          </p>

          <button
            onClick={() => {
              if (onOpenAI) {
                onClose();
                onOpenAI();
              } else {
                showToast(t('rival_ai_generator_opens'));
              }
            }}
            className="w-full py-3 rounded-2xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-white font-bold text-xs transition-all active:scale-95 flex items-center justify-center gap-2 shadow-md"
          >
            <span>Generate with Rival AI</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* STATS & OFFLINE TOGGLE */}
        <div className="p-4 rounded-3xl bg-[#0e0e16] border border-zinc-800/90 space-y-3 shadow-xl text-xs">
          <div className="flex items-center justify-between text-zinc-300">
            <span className="font-sans">Downloaded</span>
            <span className="font-mono font-bold text-white">8/14 Files</span>
          </div>

          <div className="flex items-center justify-between text-zinc-300 border-t border-zinc-800/60 pt-3">
            <span className="font-sans">Storage Used</span>
            <span className="font-mono font-bold text-white">186 MB</span>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-zinc-800/60">
            <span className="font-bold text-white">Available Offline</span>
            <button
              onClick={() => {
                setAvailableOffline(!availableOffline);
                showToast(!availableOffline ? t('offline_mode_enabled') : t('offline_mode_is_disabled'));
              }}
              className={`w-12 h-6 rounded-full transition-colors relative ${
                availableOffline ? 'bg-indigo-600' : 'bg-zinc-800'
              }`}
            >
              <div 
                className={`w-5 h-5 rounded-full bg-white transition-transform absolute top-0.5 ${
                  availableOffline ? 'translate-x-6' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>
        </div>

        {/* BOTTOM FIXED PRIMARY ACTION BUTTON */}
        <div className="pt-1">
          <button
            onClick={handleDownloadSelected}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:opacity-90 text-white font-extrabold text-xs uppercase tracking-wider shadow-xl shadow-indigo-600/30 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <span>Download Selected ({selectedCount})</span>
            <Download className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
