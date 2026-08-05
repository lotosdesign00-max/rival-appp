import React, { useState, useEffect } from 'react';
import { X, ShoppingCart, Upload, CheckCircle2, Sparkles, Send, FileText, Check, AlertCircle } from 'lucide-react';
import { OrderRequest } from '../types';
import { useTranslation } from '../context/LanguageContext';
import { useApp } from '../context/AppContext';

interface CreateOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialProjectTitle?: string;
  onOrderSubmitted: (order: OrderRequest) => boolean | void;
}

export const CreateOrderModal: React.FC<CreateOrderModalProps> = ({
  isOpen,
  onClose,
  initialProjectTitle = '',
  onOrderSubmitted
}) => {
  const { t } = useTranslation();
  const { profile, privacy, addNotification } = useApp();

  const [projectType, setProjectType] = useState(t('3d_architectural_environment'));
  const [environmentStyle, setEnvironmentStyle] = useState('Obsidian Dark Architecture');
  const [budget, setBudget] = useState('$1,000 - $2,500');
  const [timeline, setTimeline] = useState(t('1_2_weeks'));
  const [name, setName] = useState(profile?.name || '');
  const [email, setEmail] = useState(privacy?.email || '');
  const [telegram, setTelegram] = useState(profile?.username || '');
  const [notes, setNotes] = useState(
    initialProjectTitle ? `Запрос на основе проекта: ${initialProjectTitle}. ` : ''
  );
  const [files, setFiles] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    if (profile) {
      if (!name) setName(profile.name || '');
      if (!email && privacy?.email) setEmail(privacy.email);
      if (!telegram && profile.username) setTelegram(profile.username);
    }
  }, [profile, privacy]);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileNames = Array.from(e.target.files).map((f: File) => f.name);
      setFiles(prev => [...prev, ...fileNames]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!name.trim()) {
      setValidationError(t('please_enter_your_name'));
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setValidationError(t('please_enter_a_correct_email_a'));
      return;
    }

    const newId = 'RVL-' + Math.floor(100000 + Math.random() * 900000);
    const orderData: OrderRequest = {
      id: newId,
      projectType,
      environmentStyle,
      budget,
      timeline,
      notes,
      name,
      email,
      telegram,
      status: 'pending',
      createdAt: new Date().toLocaleDateString('ru-RU')
    };

    const success = onOrderSubmitted(orderData);
    if (success === false) {
      setValidationError(t('insufficient_funds_on_balance'));
      return;
    }

    setOrderId(newId);
    setSubmitted(true);

    addNotification(
      `Заказ #${newId} создан`,
      `Ваша заявка "${projectType}" на сумму ${budget} принята в обработку.`,
      'Orders'
    );
  };


  const resetForm = () => {
    setSubmitted(false);
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-2 sm:p-4 overflow-y-auto"
      style={{
        paddingTop: 'max(0.75rem, env(safe-area-inset-top, 0px), var(--tg-safe-area-inset-top, 0px))',
        paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom, 0px), var(--tg-safe-area-inset-bottom, 0px))'
      }}
    >
      <div 
        className="w-full max-w-2xl bg-[#0d0d14] border border-indigo-900/40 rounded-2xl overflow-hidden shadow-2xl text-zinc-100 max-h-[92vh] flex flex-col my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-zinc-800/80 bg-gradient-to-r from-[#12111d] to-[#161426]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
              <ShoppingCart className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                {t('order_modal_title')}
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  RIVAL STUDIO
                </span>
              </h2>
              <p className="text-xs text-zinc-400">{t('order_modal_subtitle')}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          /* Success Screen */
          <div className="p-8 text-center space-y-6 flex-1 flex flex-col justify-center items-center">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-white">{t('the_order_has_been_successfull')}</h3>
              <p className="text-sm text-zinc-400 max-w-md mx-auto">
                {t('your_order_number')}<span className="font-mono text-indigo-400 font-semibold">{orderId}</span>{t('a_manager_will_contact_you_wi')}</p>
            </div>
            <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-4 max-w-md w-full text-left text-xs space-y-2 font-mono">
              <div className="flex justify-between text-zinc-400">
                <span>{t('type')}</span>
                <span className="text-zinc-200 font-sans">{projectType}</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>{t('budget')}</span>
                <span className="text-indigo-300 font-sans">{budget}</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>{t('status')}</span>
                <span className="text-emerald-400 font-sans flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  {t('in_processing')}</span>
              </div>
            </div>
            <button
              onClick={resetForm}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all"
            >
              {t('return_to_rival_space')}</button>
          </div>
        ) : (
          /* Form Content */
          <form onSubmit={handleSubmit} className="overflow-y-auto p-4 sm:p-6 space-y-5">
            {/* Step 1: Project Type */}
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase tracking-wider text-zinc-400 block">
                {t('1_type_of_project')}</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  t('3d_architectural_environment'),
                  t('a_scene_in_unreal_engine_5'),
                  t('digital_twin_spatial_ui'),
                  t('vr_interactive_showroom')
                ].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setProjectType(type)}
                    className={`p-3 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${
                      projectType === type
                        ? 'bg-indigo-950/60 border-indigo-500 text-white shadow-sm shadow-indigo-500/20'
                        : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                    }`}
                  >
                    <span>{type}</span>
                    {projectType === type && <Check className="w-4 h-4 text-indigo-400 shrink-0" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Environment Style */}
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase tracking-wider text-zinc-400 block">
                {t('2_style_and_atmosphere')}</label>
              <select
                value={environmentStyle}
                onChange={(e) => setEnvironmentStyle(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-zinc-200 focus:outline-none focus:border-indigo-500"
              >
                <option value="Obsidian Dark Architecture">{t('obsidian_dark_architecture_dar')}</option>
                <option value="High-Tech Cyber Loft">{t('high_tech_cyber_loft_2088_neon')}</option>
                <option value="Subterranean Quartz Cave">{t('subterranean_quartz_sanctuary')}</option>
                <option value="Minimalist Industrial">{t('minimalist_industrial_concrete')}</option>
                <option value="Custom Specification">{t('individual_technical_specifica')}</option>
              </select>
            </div>

            {/* Step 3: Budget & Timeline */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-mono uppercase tracking-wider text-zinc-400 block">
                  {t('3_estimated_budget')}</label>
                <div className="grid grid-cols-2 gap-1.5">
                  {['$500 - $1,000', '$1,000 - $2,500', '$2,500 - $5,000', '$5,000+'].map((b) => (
                    <button
                      key={b}
                      type="button"
                      onClick={() => setBudget(b)}
                      className={`p-2 rounded-lg border text-center text-[11px] font-mono transition-all ${
                        budget === b
                          ? 'bg-indigo-600/30 border-indigo-500 text-indigo-200 font-semibold'
                          : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                      }`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-mono uppercase tracking-wider text-zinc-400 block">
                  {t('4_deadlines')}</label>
                <div className="grid grid-cols-3 gap-1.5">
                  {[t('3_5_days'), t('1_2_weeks'), t('1_month')].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setTimeline(t)}
                      className={`p-2 rounded-lg border text-center text-[11px] font-mono transition-all ${
                        timeline === t
                          ? 'bg-indigo-600/30 border-indigo-500 text-indigo-200 font-semibold'
                          : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* File Dropzone */}
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase tracking-wider text-zinc-400 block">
                {t('5_files_and_drawings_optional')}</label>
              <div className="border border-dashed border-zinc-800 hover:border-indigo-500/50 rounded-xl p-4 text-center bg-zinc-900/30 transition-colors cursor-pointer relative">
                <input
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <Upload className="w-6 h-6 text-zinc-500 mx-auto mb-1.5" />
                <p className="text-xs text-zinc-300">{t('drag_files_here_or')}<span className="text-indigo-400 underline">{t('select_on_device')}</span></p>
                <p className="text-[10px] text-zinc-500 mt-0.5">{t('dwg_fbx_obj_pdf_zip_up_to_500')}</p>
              </div>
              {files.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {files.map((file, idx) => (
                    <span key={idx} className="inline-flex items-center gap-1 text-[11px] bg-zinc-800 border border-zinc-700 px-2.5 py-1 rounded-md text-zinc-300 font-mono">
                      <FileText className="w-3 h-3 text-indigo-400" />
                      {file}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase tracking-wider text-zinc-400 block">
                {t('6_description_of_the_order_and')}</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={t('describe_your_tasks_requiremen')}
                rows={3}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-xs text-zinc-200 focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Client Contact Details */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-zinc-800/80">
              <div>
                <label className="text-[11px] text-zinc-400 mb-1 block">{t('your_name')}</label>
                <input
                  type="text"
                  required
                  placeholder={t('alexander')}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="text-[11px] text-zinc-400 mb-1 block">{t('email_for_contact')}</label>
                <input
                  type="email"
                  required
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="text-[11px] text-zinc-400 mb-1 block">{t('telegram_phone')}</label>
                <input
                  type="text"
                  placeholder="@username"
                  value={telegram}
                  onChange={(e) => setTelegram(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {validationError && (
              <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/50 text-red-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{validationError}</span>
              </div>
            )}

            {/* Footer Submit Bar */}
            <div className="pt-3 border-t border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-[11px] text-zinc-400">
                <AlertCircle className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>{t('calculation_of_specifications')}</span>
              </div>
              <button
                type="submit"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all"
              >
                <Send className="w-4 h-4" />
                <span>{t('send_a_request')}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
