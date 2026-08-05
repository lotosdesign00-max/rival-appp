import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Share2, 
  Rocket, 
  Award, 
  ShieldCheck, 
  CheckCircle2, 
  Download, 
  Star, 
  Flame, 
  ArrowRight,
  Sparkles,
  ExternalLink,
  Check
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useTranslation } from "../context/LanguageContext";

interface CertificateModalProps {
  studentName?: string;
  moduleTitle?: string;
  courseTitle?: string;
  score?: string;
  date?: string;
  certId?: string;
  hash?: string;
  xpPoints?: number;
  unlockedBadge?: string;
  progressPercent?: number;
  onClose: () => void;
  onContinue?: () => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  studentName = 'Alex Mercer',
  moduleTitle = 'Advanced Grid Systems',
  courseTitle = 'Advanced UI Design',
  score = '90%',
  date = 'Oct 26, 2026',
  certId = 'RSA-UI-02481',
  hash = '0xF4A9...28BC',
  xpPoints = 250,
  unlockedBadge = 'Grid Master',
  progressPercent = 72,
  onClose,
  onContinue
}) => {
    const { t } = useTranslation();
  const { addNotification } = useApp();
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(true);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleVerify = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setIsVerified(true);
      showToast(t('the_certificate_has_been_confi'));
    }, 1200);
  };

  const handleShare = (platform: string) => {
    showToast(`Публикация сертификата в ${platform}...`);
  };

  const handleDownloadPDF = () => {
    showToast(t('downloading_the_certificate_pd'));
    addNotification(t('certificate_received'), `Сертификат "${moduleTitle}" сохранен в загрузки`, 'Academy');
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
            Certificate
          </h1>

          <button
            onClick={() => handleShare('Rival Space')}
            className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors flex items-center justify-center active:scale-95"
            aria-label="Share"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>

        {/* MAIN CERTIFICATE DIPLOMA CARD */}
        <div className="relative rounded-3xl bg-[#0e0e16] border border-zinc-800/90 p-6 space-y-6 text-center shadow-2xl overflow-hidden">
          {/* Subtle Shield Watermark in Background */}
          <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
            <Award className="w-64 h-64 text-indigo-400 stroke-[1]" />
          </div>

          {/* Academy Header Badge */}
          <div className="flex items-center justify-center gap-2 text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest relative z-10">
            <Rocket className="w-3.5 h-3.5 text-indigo-400" />
            <span>RIVAL SPACE ACADEMY</span>
          </div>

          {/* Certificate Title & Subtitle */}
          <div className="space-y-1 relative z-10">
            <h2 className="text-2xl font-black text-white tracking-tight leading-tight">
              Certificate of Completion
            </h2>
            <p className="text-xs text-zinc-400 font-sans italic">
              This certifies that
            </p>
          </div>

          {/* Student Name */}
          <div className="relative z-10 py-1">
            <h3 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-purple-200 to-indigo-400 tracking-tight">
              {studentName}
            </h3>
            <p className="text-xs text-zinc-400 font-sans mt-1">
              has successfully completed the module
            </p>
          </div>

          {/* Module Box */}
          <div className="p-4 rounded-2xl bg-[#090912] border border-zinc-800/80 space-y-1 relative z-10 shadow-inner">
            <h4 className="text-base font-bold text-white tracking-tight">
              {moduleTitle}
            </h4>
            <p className="text-[11px] font-mono text-indigo-300/90">
              Score: {score} • {courseTitle}
            </p>
          </div>

          {/* Certificate Footer Meta (Date, ID & Badge Thumbnail) */}
          <div className="flex items-end justify-between pt-2 border-t border-zinc-800/60 relative z-10 text-left">
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-zinc-500 uppercase block">Date</span>
              <p className="text-xs font-bold text-white">{date}</p>
              
              <div className="pt-1">
                <span className="text-[10px] font-mono text-zinc-500 block">ID: {certId}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Shield Seal Badge Icon */}
              <div className="w-11 h-11 rounded-2xl bg-indigo-950/90 border border-indigo-500/40 flex items-center justify-center text-indigo-400 shadow-lg shadow-indigo-500/20">
                <CheckCircle2 className="w-6 h-6 stroke-[2]" />
              </div>

              {/* Miniature Certificate Thumbnail */}
              <div className="w-12 h-9 rounded-lg bg-zinc-900 border border-zinc-800 overflow-hidden relative shadow-inner flex items-center justify-center p-1">
                <div className="w-full h-full rounded bg-indigo-950/60 border border-indigo-500/30 flex flex-col items-center justify-center">
                  <span className="text-[6px] font-mono text-indigo-300">CERT</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* BLOCKCHAIN VERIFICATION BOX */}
        <div className="p-4 rounded-3xl bg-[#0e0e16] border border-zinc-800/90 space-y-3.5 shadow-xl">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-white tracking-tight">
              Blockchain Verification
            </h3>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-[10px] font-mono font-bold text-emerald-400 flex items-center gap-1">
              <Check className="w-3 h-3 stroke-[3]" />
              Verified
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-[#090912] border border-zinc-800/80 flex items-center justify-between font-mono text-xs">
            <span className="text-zinc-400">Hash</span>
            <span className="text-indigo-300 font-bold">{hash}</span>
          </div>

          <button
            onClick={handleVerify}
            disabled={isVerifying}
            className="w-full py-3 rounded-2xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-white font-bold text-xs transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <ShieldCheck className={`w-4 h-4 text-indigo-400 ${isVerifying ? 'animate-spin' : ''}`} />
            <span>{isVerifying ? 'Verifying on-chain...' : 'Verify Certificate'}</span>
          </button>
        </div>

        {/* SHARE CERTIFICATE BOX */}
        <div className="p-4 rounded-3xl bg-[#0e0e16] border border-zinc-800/90 space-y-3 shadow-xl">
          <h3 className="text-xs font-bold text-white tracking-tight">
            Share Certificate
          </h3>

          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={() => handleShare('LinkedIn')}
              className="py-3 rounded-2xl bg-cyan-950/40 hover:bg-cyan-950/70 border border-cyan-800/60 text-cyan-300 font-bold text-xs transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              LinkedIn
            </button>
            <button
              onClick={() => handleShare('X (Twitter)')}
              className="py-3 rounded-2xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-white font-bold text-xs transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              X
            </button>
          </div>

          <button
            onClick={handleDownloadPDF}
            className="w-full py-3 rounded-2xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-white font-bold text-xs transition-all active:scale-95 flex items-center justify-center gap-2 shadow-md"
          >
            <Download className="w-4 h-4 text-zinc-400" />
            <span>Download PDF</span>
          </button>
        </div>

        {/* REWARDS EARNED BOX */}
        <div className="p-4 rounded-3xl bg-[#0e0e16] border border-zinc-800/90 space-y-3.5 shadow-xl">
          <div className="flex items-center gap-2 text-xs font-bold text-white">
            <Award className="w-4 h-4 text-indigo-400" />
            <span>Rewards Earned</span>
          </div>

          {/* Row 1: XP */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-[#090912] border border-zinc-800/80">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-indigo-950/80 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
                <Star className="w-4 h-4 fill-indigo-400" />
              </div>
              <span className="text-xs font-bold text-zinc-200">Experience Points</span>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-400">+{xpPoints} XP</span>
          </div>

          {/* Row 2: Badge */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-[#090912] border border-zinc-800/80">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-indigo-950/80 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
                <Flame className="w-4 h-4 fill-indigo-400" />
              </div>
              <span className="text-xs font-bold text-zinc-200">New Badge Unlocked</span>
            </div>
            <span className="text-xs font-bold text-purple-300">{unlockedBadge}</span>
          </div>

          {/* Progress Bar */}
          <div className="space-y-1.5 pt-1">
            <div className="flex items-center justify-between text-[11px] font-mono">
              <span className="text-zinc-400">Course Progress</span>
              <span className="font-bold text-white">{progressPercent}%</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-zinc-800/90 overflow-hidden">
              <div 
                className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* BOTTOM FIXED CTA BUTTON */}
        <div className="pt-1">
          <button
            onClick={() => {
              if (onContinue) {
                onContinue();
              } else {
                onClose();
              }
            }}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:opacity-90 text-white font-extrabold text-xs uppercase tracking-wider shadow-xl shadow-indigo-600/30 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <span>Continue Learning</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
