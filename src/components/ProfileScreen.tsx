import React, { useState, useMemo } from 'react';
import { useTranslation } from '../context/LanguageContext';
import { useApp } from '../context/AppContext';
import { getOrderStatusInfo } from '../utils/statusHelper';
import { 
  Edit2, 
  Star, 
  ArrowDownLeft, 
  ArrowUpRight, 
  Clock, 
  ShieldCheck, 
  Award, 
  Rocket, 
  CheckCircle2, 
  Zap, 
  Moon, 
  Bell, 
  Globe, 
  Lock, 
  HelpCircle, 
  ChevronRight, 
  X, 
  Check, 
  DollarSign, 
  Sparkles,
  User,
  Layers,
  Plus,
  Shield,
  Activity
} from 'lucide-react';
import { TopUpModal } from './TopUpModal';
import { WithdrawModal } from './WithdrawModal';
import { OrderRequest, OrderDetailData } from '../types';
import { CertificateModal } from './CertificateModal';
import { motion, AnimatePresence } from 'motion/react';

interface ProfileScreenProps {
  orders: OrderRequest[];
  onOpenCreateOrder: () => void;
  onOpenOrderDetail?: (order?: OrderDetailData) => void;
  onOpenMyOrders?: () => void;
  onOpenPro?: () => void;
  onOpenSupport?: () => void;
  onOpenEditProfile?: () => void;
  onOpenEmailSecurity?: () => void;
  onOpenConnectedAccounts?: () => void;
  onOpenAppearance?: () => void;
  onOpenPrivacy?: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = React.memo(({ 
  orders, 
  onOpenCreateOrder, 
  onOpenOrderDetail,
  onOpenMyOrders,
  onOpenPro,
  onOpenSupport,
  onOpenEditProfile,
  onOpenEmailSecurity,
  onOpenConnectedAccounts,
  onOpenAppearance,
  onOpenPrivacy
}) => {
  const { t, language, setLanguage } = useTranslation();
  const { 
    profile, 
    updateProfile, 
    settings, 
    updateSettings, 
    depositBalance, 
    withdrawBalance,
    authProvider,
    canBeDesigner,
    canChangeName,
    canChangeUsername,
    nextNameChangeDateFormatted,
    showToast,
    isAdmin,
    setIsAdminModalOpen,
    onlineUsersCount
  } = useApp();

  const name = profile.name;
  const handle = profile.username;
  const userRole = profile.userRole;
  const roleTitle = profile.roleTitle;
  const avatarUrl = profile.avatarUrl;

  const [editName, setEditName] = useState(profile.name);
  const [editHandle, setEditHandle] = useState(profile.username);
  const [editAvatarUrl, setEditAvatarUrl] = useState(profile.avatarUrl);

  const [devSecretTapCount, setDevSecretTapCount] = useState(0);

  const handleDevSecretTap = () => {
    setDevSecretTapCount(prev => {
      const next = prev + 1;
      if (next >= 5) {
        setIsAdminModalOpen(true);
        return 0;
      }
      return next;
    });
  };

  const balance = profile.balance;
  const starsCount = profile.starsCount;

  // Modals & Interactivity State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [isProModalOpen, setIsProModalOpen] = useState(false);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  
  // Deposit/Withdraw Amount Inputs
  const [amountInput, setAmountInput] = useState('');

  const handleDeposit = () => {
    const num = parseFloat(amountInput);
    if (!isNaN(num) && num > 0) {
      depositBalance(num);
      showToast(`Успешно пополнено на $${num.toFixed(2)}`);
      setAmountInput('');
      setIsDepositModalOpen(false);
    }
  };

  const handleWithdraw = () => {
    const num = parseFloat(amountInput);
    if (!isNaN(num) && num > 0) {
      const success = withdrawBalance(num);
      if (!success) {
        showToast(t('insufficient_funds_on_balance'));
        return;
      }
      showToast(`Успешный вывод $${num.toFixed(2)} на карту`);
      setAmountInput('');
      setIsWithdrawModalOpen(false);
    }
  };

  const handleSaveProfile = () => {
    setIsEditModalOpen(false);
    showToast(t('profile_successfully_updated'));
  };

  const { favorites, aiHistory, academyProgress } = useApp();
  const completedCertificatesCount = Object.keys(academyProgress || {}).length;

  // Dynamic user stats
  const stats = useMemo(() => [
    { label: 'PROJECTS', value: String(orders.length) },
    { label: 'ACTIVE', value: String(orders.filter(o => o.status !== 'Completed').length) },
    { label: 'FAVORITES', value: String(favorites.length) },
    { label: 'AI CREATIONS', value: String(aiHistory.length) }
  ], [orders.length, favorites.length, aiHistory.length]);

  return (
    <div
      className="space-y-5 pb-24 font-sans animate-in fade-in duration-300"
    >
      {/* TOP HEADER PROFILE CARD */}
      <div className="relative rounded-3xl bg-[#0c0c14] border border-zinc-800/90 p-6 shadow-2xl overflow-hidden group">
        {/* Subtle Grid Overlay Background Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#1f1f35_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none" />
        <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Edit Button at Top Right */}
        <button
          onClick={() => {
            if (onOpenEditProfile) {
              onOpenEditProfile();
            } else {
              setIsEditModalOpen(true);
            }
          }}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white flex items-center justify-center transition-all shadow-md active:scale-95"
          title={t('edit_profile')}
        >
          <Edit2 className="w-4 h-4" />
        </button>

        <div className="relative z-10 flex flex-col items-center text-center space-y-3 pt-2">
          {/* Avatar Container with Online Indicator */}
          <div className="relative">
            <div className="w-24 h-24 rounded-full p-1 bg-gradient-to-tr from-indigo-600 via-purple-500 to-indigo-400 shadow-xl shadow-indigo-950/80">
              <img
                src={avatarUrl}
                alt={name}
                referrerPolicy="no-referrer"
                className="w-full h-full rounded-full object-cover border-2 border-[#0c0c14]"
              />
            </div>
            {/* Glowing Online Indicator */}
            <span 
              className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-emerald-400 border-3 border-[#0c0c14] shadow-[0_0_10px_rgba(52,211,153,0.8)]" 
              title="Online"
            />
          </div>

          {/* Name & Handle */}
          <div className="space-y-0.5">
            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              {name}
            </h1>
            <p className="text-xs font-mono text-zinc-400">
              {handle}
            </p>
          </div>

          {/* Role Pill Badge (Clickable to change role) */}
          <button
            onClick={() => setIsRoleModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#141426] border border-indigo-500/40 text-indigo-300 font-mono text-[11px] font-bold tracking-wider hover:border-indigo-400 hover:bg-[#1a1a32] transition-all shadow-sm group"
          >
            <Star className="w-3.5 h-3.5 text-indigo-400 fill-indigo-400/30 group-hover:scale-110 transition-transform" />
            <span>{roleTitle}</span>
          </button>
        </div>
      </div>

      {/* STATS CARD (SINGLE CONTAINER LIST) */}
      <div className="rounded-2xl bg-[#0c0c14] border border-zinc-800/90 divide-y divide-zinc-800/80 overflow-hidden shadow-xl">
        {stats.map((st, idx) => (
          <div
            key={idx}
            className="p-4 flex items-center justify-between hover:bg-zinc-900/30 transition-colors"
          >
            <span className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider">
              {st.label}
            </span>
            <span className="text-base font-extrabold text-white font-sans tracking-tight">
              {st.value}
            </span>
          </div>
        ))}
      </div>

      {/* TOTAL BALANCE CARD */}
      <div className="p-5 rounded-3xl bg-[#0c0c14] border border-zinc-800/90 shadow-xl space-y-4 relative overflow-hidden">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 font-bold">
            {t('profile_balance')}
          </span>

          <span className="px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-200 font-mono text-[11px] font-bold flex items-center gap-1 shadow-sm">
            <Star className="w-3.5 h-3.5 text-indigo-400 fill-indigo-400/30" />
            <span>{starsCount}</span>
          </span>
        </div>

        <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-sans">
          ${balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>

        {/* Buttons: Deposit & Withdraw */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          <button
            onClick={() => setIsDepositModalOpen(true)}
            className="py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-indigo-600/30 transition-all active:scale-95 flex items-center justify-center gap-1.5"
          >
            <ArrowDownLeft className="w-4 h-4" />
            <span>{t('profile_deposit')}</span>
          </button>

          <button
            onClick={() => setIsWithdrawModalOpen(true)}
            className="py-3 rounded-2xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 hover:text-white font-bold text-xs uppercase tracking-wider transition-all active:scale-95 flex items-center justify-center gap-1.5"
          >
            <ArrowUpRight className="w-4 h-4" />
            <span>{t('profile_withdraw')}</span>
          </button>
        </div>
      </div>

      {/* ACTIVE ORDERS SECTION */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white tracking-tight">
            Active Orders
          </h2>
          <div className="flex items-center gap-3">
            {onOpenMyOrders && (
              <button
                onClick={onOpenMyOrders}
                className="text-xs font-mono text-indigo-400 hover:text-indigo-300 font-semibold transition-colors flex items-center gap-1"
              >
                <span>{t('all_orders')}{orders.length}) →</span>
              </button>
            )}
            <button
              onClick={onOpenCreateOrder}
              className="text-xs font-mono text-zinc-400 hover:text-white font-semibold transition-colors flex items-center gap-1"
            >
              <span>{t('new')}</span>
            </button>
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="p-6 rounded-3xl bg-[#0c0c14] border border-zinc-800/90 text-center space-y-3 shadow-xl">
            <div className="w-12 h-12 rounded-2xl bg-indigo-950/60 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mx-auto">
              <Layers className="w-6 h-6" />
            </div>
            <div className="space-y-1 max-w-xs mx-auto">
              <h4 className="text-sm font-bold text-white">{t('there_are_no_active_orders')}</h4>
              <p className="text-xs text-zinc-400">
                {t('create_your_first_application')}</p>
            </div>
            <button
              onClick={onOpenCreateOrder}
              className="px-4 py-2 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-indigo-600/30 active:scale-95 inline-flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{t('create_an_order')}</span>
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {orders.map((ord) => {
              const statusInfo = getOrderStatusInfo(ord.status);
              return (
                <div
                  key={ord.id}
                  onClick={() => onOpenOrderDetail?.({
                    id: ord.id,
                    title: ord.projectType,
                    status: ord.status,
                    price: ord.budget,
                    created: ord.createdAt,
                    deadline: ord.timeline || t('in_progress'),
                    progressPercent: statusInfo.progressPercent,
                    currentStepIndex: statusInfo.currentStepIndex,
                    designer: {
                      name: 'Rival Studio Team',
                      role: 'Lead Designer',
                      avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=200&q=80'
                    },
                    files: [],
                    timeline: [
                      { title: t('order_created'), time: ord.createdAt, active: true }
                    ],
                    designerNote: ord.notes
                  })}
                  className="p-4 rounded-2xl bg-[#0c0c14] border border-indigo-500/40 hover:border-indigo-400 transition-all shadow-lg flex items-center justify-between cursor-pointer group"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-indigo-400 font-bold text-xs">#{ord.id.slice(0, 8)}</span>
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold ${statusInfo.badgeClass}`}>
                        {statusInfo.simpleLabel}
                      </span>
                    </div>
                    <div className="font-bold text-white text-sm mt-0.5 group-hover:text-indigo-300 transition-colors">{ord.projectType}</div>
                  </div>
                  <span className="font-mono font-bold text-white text-sm">{ord.budget}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* SAVED CERTIFICATES SECTION */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white tracking-tight">
            Saved Certificates
          </h2>
          <span className="text-xs font-mono text-indigo-400 font-bold">{completedCertificatesCount} Earned</span>
        </div>

        {completedCertificatesCount === 0 ? (
          <div className="p-6 rounded-3xl bg-[#0c0c14] border border-zinc-800/90 text-center space-y-3 shadow-xl">
            <div className="w-12 h-12 rounded-2xl bg-indigo-950/60 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mx-auto">
              <Award className="w-6 h-6" />
            </div>
            <div className="space-y-1 max-w-xs mx-auto">
              <h4 className="text-sm font-bold text-white">{t('no_certificates_available')}</h4>
              <p className="text-xs text-zinc-400">
                {t('take_courses_at_rival_space_ac')}</p>
            </div>
          </div>
        ) : (
          <div 
            onClick={() => setShowCertificateModal(true)}
            className="p-4 rounded-3xl bg-[#0c0c14] border border-indigo-500/40 hover:border-indigo-400 transition-all flex items-center justify-between cursor-pointer group shadow-xl"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-indigo-950/80 border border-indigo-500/40 flex items-center justify-center text-indigo-400 group-hover:scale-105 transition-transform shadow-md">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white group-hover:text-indigo-300 transition-colors">
                    Spatial 3D & UI Design Master
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-[9px] font-mono text-emerald-400 font-bold">
                    VERIFIED
                  </span>
                </div>
                <p 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDevSecretTap();
                  }}
                  className="text-[11px] font-mono text-zinc-400 mt-0.5 select-none"
                >
                  Rival Space Academy • RSA-UI-02481
                </p>
              </div>
            </div>

            <ChevronRight className="w-5 h-5 text-zinc-500 group-hover:text-white transition-colors" />
          </div>
        )}
      </div>

      {/* RIVAL SPACE PRO CARD */}
      <div className="p-5 rounded-3xl bg-gradient-to-br from-[#121226] via-[#0e0e18] to-[#07070e] border border-indigo-500/30 shadow-xl flex items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-white">
              Rival Space Pro
            </h3>
            <span className="px-2 py-0.5 rounded bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 font-mono text-[9px] font-bold tracking-wider">
              ELITE
            </span>
          </div>
          <p className="text-xs text-zinc-400 leading-snug">
            Unlock exclusive design tools & spatial assets
          </p>
        </div>

        <button
          onClick={() => {
            if (onOpenPro) {
              onOpenPro();
            } else {
              setIsProModalOpen(true);
            }
          }}
          className="px-5 py-2.5 rounded-xl bg-white hover:bg-zinc-200 text-black font-extrabold text-xs uppercase tracking-wider shrink-0 shadow-lg transition-all active:scale-95"
        >
          UPGRADE
        </button>
      </div>

      {/* ADMIN CONTROL PANEL CARD (Only visible for admin / werb863@gmail.com) */}
      {isAdmin && (
        <div 
          onClick={() => setIsAdminModalOpen(true)}
          className="p-5 rounded-3xl bg-gradient-to-r from-emerald-950/70 via-teal-950/60 to-emerald-950/80 border border-emerald-500/40 shadow-xl flex items-center justify-between gap-4 cursor-pointer group hover:border-emerald-400 transition-all"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white group-hover:text-emerald-200 transition-colors">
                  Панель Администратора
                </h3>
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-300 font-mono text-[10px] font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  {onlineUsersCount} online
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                Загрузка работ, метрики, цены и объявление
              </p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-emerald-400/80 group-hover:translate-x-1 transition-transform" />
        </div>
      )}

      {/* --- MODAL 1: EDIT PROFILE --- */}
      {isEditModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200"
          onClick={() => setIsEditModalOpen(false)}
        >
          <div 
            className="w-full max-w-sm bg-[#0c0c14] border border-zinc-800 rounded-3xl p-5 space-y-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
              <h3 className="text-sm font-bold text-white">{t('edit_profile')}</h3>
              <button onClick={() => setIsEditModalOpen(false)} className="text-zinc-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-zinc-400 font-mono text-[10px] uppercase block mb-1">{t('name')}</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-zinc-400 font-mono text-[10px] uppercase block mb-1">{t('nickname')}</label>
                <input
                  type="text"
                  value={editHandle}
                  onChange={(e) => setEditHandle(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-zinc-400 font-mono text-[10px] uppercase block mb-1">{t('avatar_url')}</label>
                <input
                  type="text"
                  value={editAvatarUrl}
                  onChange={(e) => setEditAvatarUrl(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="pt-2 flex items-center gap-2">
              <button
                onClick={() => {
                  updateProfile({
                    name: editName,
                    username: editHandle,
                    avatarUrl: editAvatarUrl
                  });
                  setIsEditModalOpen(false);
                  showToast(t('profile_saved'));
                }}
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-all"
              >
                {t('save')}</button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL 2: ROLE CUSTOMIZER --- */}
      {isRoleModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200"
          onClick={() => setIsRoleModalOpen(false)}
        >
          <div 
            className="w-full max-w-sm bg-[#0c0c14] border border-zinc-800 rounded-3xl p-5 space-y-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
              <h3 className="text-sm font-bold text-white">{t('selecting_an_account_role')}</h3>
              <button onClick={() => setIsRoleModalOpen(false)} className="text-zinc-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-zinc-400">
              {t('in_rival_space_applications_yo')}</p>

            <div className="space-y-2">
              <button
                onClick={() => {
                  if (!canBeDesigner) {
                    showToast(t('the_designer_role_requires_the'));
                    return;
                  }
                  updateProfile({ userRole: 'designer', roleTitle: 'ELITE DESIGNER' });
                  setIsRoleModalOpen(false);
                  showToast(t('mode_designer'));
                }}
                className={`w-full p-3 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${
                  !canBeDesigner
                    ? 'bg-zinc-900/50 border-zinc-800/50 text-zinc-600 cursor-not-allowed opacity-75'
                    : userRole === 'designer' 
                    ? 'bg-indigo-950/80 border-indigo-500 text-white font-bold' 
                    : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:text-white'
                }`}
              >
                <div>
                  <div className={`font-bold ${!canBeDesigner ? 'text-zinc-500' : 'text-white'}`}>
                    🎨 Designer / 3D Artist {!canBeDesigner && '🔒'}
                  </div>
                  <div className="text-[10px] text-zinc-400 font-mono">{t('perform_3d_renderings_and_desi')}</div>
                </div>
                {userRole === 'designer' && <Check className="w-4 h-4 text-indigo-400" />}
              </button>

              <button
                onClick={() => {
                  updateProfile({ userRole: 'client', roleTitle: 'CLIENT / CUSTOMER' });
                  setIsRoleModalOpen(false);
                  showToast(t('mode_customer'));
                }}
                className={`w-full p-3 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${
                  userRole === 'client' 
                    ? 'bg-indigo-950/80 border-indigo-500 text-white font-bold' 
                    : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:text-white'
                }`}
              >
                <div>
                  <div className="font-bold text-white">💼 Client / Orderer</div>
                  <div className="text-[10px] text-zinc-400 font-mono">{t('order_virtual_environments_and')}</div>
                </div>
                {userRole === 'client' && <Check className="w-4 h-4 text-indigo-400" />}
              </button>

              <button
                onClick={() => {
                  if (!canBeDesigner) {
                    showToast(t('the_studio_lead_role_requires'));
                    return;
                  }
                  updateProfile({ userRole: 'lead', roleTitle: 'STUDIO LEAD' });
                  setIsRoleModalOpen(false);
                  showToast(t('mode_studio_lead'));
                }}
                className={`w-full p-3 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${
                  !canBeDesigner
                    ? 'bg-zinc-900/50 border-zinc-800/50 text-zinc-600 cursor-not-allowed opacity-75'
                    : userRole === 'lead' 
                    ? 'bg-indigo-950/80 border-indigo-500 text-white font-bold' 
                    : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:text-white'
                }`}
              >
                <div>
                  <div className={`font-bold ${!canBeDesigner ? 'text-zinc-500' : 'text-white'}`}>
                    🚀 Studio Lead {!canBeDesigner && '🔒'}
                  </div>
                  <div className="text-[10px] text-zinc-400 font-mono">{t('project_and_team_management')}</div>
                </div>
                {userRole === 'lead' && <Check className="w-4 h-4 text-indigo-400" />}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL 3: DEPOSIT --- */}
      {isDepositModalOpen && (
        <TopUpModal onClose={() => setIsDepositModalOpen(false)} />
      )}

      {/* --- MODAL 4: WITHDRAW --- */}
      {isWithdrawModalOpen && (
        <WithdrawModal onClose={() => setIsWithdrawModalOpen(false)} />
      )}

      {/* --- MODAL 5: PRO UPGRADE --- */}
      {isProModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200"
          onClick={() => setIsProModalOpen(false)}
        >
          <div 
            className="w-full max-w-sm bg-[#0c0c14] border border-indigo-500/40 rounded-3xl p-5 space-y-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-indigo-400" />
                <h3 className="text-sm font-bold text-white">Rival Space Pro</h3>
              </div>
              <button onClick={() => setIsProModalOpen(false)} className="text-zinc-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 text-xs text-zinc-300">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{t('unlimited_rendering_in_unreal')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{t('access_to_exclusive_8k_exr_gal')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{t('priority_of_calculations_on_cl')}</span>
              </div>
            </div>

            <button
              onClick={() => {
                setIsProModalOpen(false);
                showToast(t('welcome_to_rival_space_pro'));
              }}
              className="w-full py-3 rounded-xl bg-white text-black hover:bg-zinc-200 font-extrabold text-xs uppercase tracking-wider shadow-lg transition-all"
            >
              {t('activate_for_29_month')}</button>
          </div>
        </div>
      )}

      {/* SAVED CERTIFICATE DIPLOMA MODAL */}
      {showCertificateModal && (
        <CertificateModal
          onClose={() => setShowCertificateModal(false)}
        />
      )}
    </div>
  );
});
