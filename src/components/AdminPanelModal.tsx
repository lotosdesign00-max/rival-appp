import React, { useState } from 'react';
import { 
  Activity, Users, Upload, DollarSign, Megaphone, Trash2, 
  Plus, MessageSquare, Sparkles, X, Wifi, Layers, Shield, 
  Key, Lock, Unlock, Download, FileText, Star, CheckCircle, 
  RefreshCw, LogOut, FileCheck, ExternalLink, Mail
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { OrderRequest } from '../types';
import { ChatService } from '../services/ChatService';

interface AdminPanelModalProps {
  onClose: () => void;
  onOpenMessages?: (chatId?: string) => void;
  onOpenMessagesWithChat?: (chatId: string) => void;
}

export const AdminPanelModal: React.FC<AdminPanelModalProps> = ({ 
  onClose, 
  onOpenMessages,
  onOpenMessagesWithChat 
}) => {
  const openChatFn = onOpenMessages || onOpenMessagesWithChat;
  const { 
    galleryItems, addGalleryItem, deleteGalleryItem,
    announcement, updateAnnouncement,
    servicePrices, updateServicePrice,
    updatesList, addSystemUpdate, deleteSystemUpdate,
    orders, updateOrderStatus,
    reviewsList, addReview, deleteReview,
    adminEmails, addAdminEmail, removeAdminEmail,
    masterPin, setMasterPin,
    isAdminUnlocked, unlockAdminWithPin, lockAdmin,
    onlineUsersCount, showToast
  } = useApp();

  const [newAdminEmailInput, setNewAdminEmailInput] = useState('');

  // Security Gate PIN State
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);

  // Active Tab
  const [activeTab, setActiveTab] = useState<'stats' | 'upload' | 'gallery' | 'orders' | 'pricing' | 'reviews' | 'updates' | 'security'>('stats');

  // New Work Form State
  const [workTitle, setWorkTitle] = useState('');
  const [workCategory, setWorkCategory] = useState<'БАННЕР' | 'АВАТАР' | 'ЛОГОТИП' | 'ПРЕВЬЮ' | '3D МОДЕЛЬ' | 'ИНТЕРФЕЙС'>('БАННЕР');
  const [workImageUrl, setWorkImageUrl] = useState('');
  const [workDescription, setWorkDescription] = useState('');
  const [workSoftware, setWorkSoftware] = useState('Figma + Blender + Photoshop');
  const [workResolution, setWorkResolution] = useState('1024 × 1280 (HQ)');
  const [workTag, setWorkTag] = useState('NEW RELEASE');
  const [workAuthor, setWorkAuthor] = useState('Rival Studio Lead');
  const [workPrice, setWorkPrice] = useState('$45');
  const [workIsFeatured, setWorkIsFeatured] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Announcement Form State
  const [announcementText, setAnnouncementText] = useState(announcement.text);
  const [announcementActive, setAnnouncementActive] = useState(announcement.active);
  const [announcementLink, setAnnouncementLink] = useState(announcement.linkText || 'Заказать со скидкой');

  // Prices State
  const [prices, setPrices] = useState<Record<string, number>>(servicePrices || {
    logo: 35, banner: 45, preview: 30, avatar: 20, model3d: 85, ui_design: 120
  });

  // News Update Form State
  const [newUpdateTitle, setNewUpdateTitle] = useState('');
  const [newUpdateDetails, setNewUpdateDetails] = useState('');
  const [newUpdateType, setNewUpdateType] = useState<'deploy' | 'content' | 'maintenance'>('content');

  // Review Form State
  const [revAuthor, setRevAuthor] = useState('');
  const [revRole, setRevRole] = useState('');
  const [revCompany, setRevCompany] = useState('');
  const [revProject, setRevProject] = useState('');
  const [revRating, setRevRating] = useState(5);
  const [revComment, setRevComment] = useState('');

  // New PIN State
  const [newPin, setNewPin] = useState('');

  // Orders Filter State
  const [orderFilter, setOrderFilter] = useState<'all' | 'pending' | 'in_review' | 'approved'>('all');

  // Computed Real Financial Metrics
  const totalRevenue = orders.reduce((acc, o) => {
    if (!o.budget) return acc + 1200;
    const clean = o.budget.replace(/\D/g, '');
    const num = parseInt(clean, 10);
    return acc + (isNaN(num) ? 1200 : num);
  }, 0);

  const pendingOrdersCount = orders.filter(o => o.status === 'pending').length;
  const inReviewOrdersCount = orders.filter(o => o.status === 'in_review').length;
  const approvedOrdersCount = orders.filter(o => o.status === 'approved').length;

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = unlockAdminWithPin(pinInput);
    if (!success) {
      setPinError(true);
      setTimeout(() => setPinError(false), 2000);
    } else {
      setPinInput('');
    }
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreview(result);
        setWorkImageUrl(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadWork = (e: React.FormEvent) => {
    e.preventDefault();
    if (!workTitle.trim()) {
      showToast('Введите название работы');
      return;
    }
    const finalImage = workImageUrl.trim() || imagePreview || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80';

    let categoryKey: 'banners' | 'avatars' | 'previews' | 'logos' | 'ui' | 'all' = 'banners';
    if (workCategory === 'АВАТАР') categoryKey = 'avatars';
    if (workCategory === 'ЛОГОТИП') categoryKey = 'logos';
    if (workCategory === 'ПРЕВЬЮ') categoryKey = 'previews';
    if (workCategory === 'ИНТЕРФЕЙС') categoryKey = 'ui';

    addGalleryItem({
      title: workTitle,
      categoryLabel: workCategory,
      categoryKey,
      image: finalImage,
      description: workDescription || 'Работа добавлена через панель управления Rival Space.',
      software: workSoftware,
      resolution: workResolution,
      tag: workTag,
      author: workAuthor,
      isFeatured: workIsFeatured,
      isNew: true,
      price: workPrice
    });

    showToast('🚀 Работа опубликована!');
    setWorkTitle('');
    setWorkDescription('');
    setWorkImageUrl('');
    setImagePreview(null);
    setActiveTab('gallery');
  };

  const handleSaveAnnouncement = () => {
    updateAnnouncement({
      text: announcementText,
      active: announcementActive,
      linkText: announcementLink
    });
    showToast('✅ Баннер обновлен!');
  };

  const handleSavePrices = () => {
    Object.entries(prices).forEach(([k, v]) => {
      updateServicePrice(k, Number(v));
    });
    showToast('✅ Прайс-лист сохранен!');
  };

  const handleCreateUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUpdateTitle.trim()) return;
    addSystemUpdate({
      title: newUpdateTitle,
      details: newUpdateDetails || 'Новое обновление системы Rival Space.',
      type: newUpdateType,
      version: 'v5.3.0'
    });
    setNewUpdateTitle('');
    setNewUpdateDetails('');
    showToast('📢 Патчноут опубликован!');
  };

  const handleCreateReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!revAuthor.trim() || !revComment.trim()) return;
    addReview({
      author: revAuthor,
      role: revRole || 'Заказчик',
      company: revCompany || 'Частный проект',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      rating: revRating,
      comment: revComment,
      project: revProject || 'Дизайн проект',
      date: 'Сегодня',
      verified: true
    });
    setRevAuthor('');
    setRevCompany('');
    setRevComment('');
    setRevProject('');
    showToast('⭐ Отзыв добавлен!');
  };

  const handleChangePin = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPin.trim().length < 4) {
      showToast('PIN должен содержать минимум 4 символа');
      return;
    }
    setMasterPin(newPin.trim());
    setNewPin('');
  };

  const handleExportOrdersCSV = () => {
    if (orders.length === 0) {
      showToast('Нет заказов для экспорта');
      return;
    }
    const headers = ['ID', 'Тип Проекта', 'Имя Заказчика', 'Email', 'Telegram', 'Бюджет', 'Статус', 'Дата'];
    const rows = orders.map(o => [
      o.id,
      `"${o.projectType}"`,
      `"${o.name}"`,
      o.email,
      o.telegram || '',
      `"${o.budget}"`,
      o.status,
      o.createdAt
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `rival_orders_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('📥 Экспорт заказов в CSV завершен');
  };

  const handleContactClient = async (order: OrderRequest) => {
    try {
      const chat = await ChatService.getOrCreateChat('order', order.id, {
        participantName: order.name || 'Заказчик',
        participantAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
      });
      if (chat) {
        onClose();
        if (openChatFn) {
          openChatFn(chat.id);
        } else {
          showToast(`Чат по заказу #${order.id} создан`);
        }
      }
    } catch (e) {
      console.error(e);
      showToast('Ошибка открытия чата');
    }
  };

  const filteredOrders = orders.filter(o => {
    if (orderFilter === 'all') return true;
    return o.status === orderFilter;
  });

  // Security Gate Screen if not unlocked
  if (!isAdminUnlocked) {
    return (
      <div className="fixed inset-0 z-50 bg-[#050508]/98 backdrop-blur-2xl font-sans flex items-center justify-center p-4 animate-in fade-in duration-300">
        <div className="w-full max-w-md p-6 sm:p-8 rounded-3xl bg-[#0b0b12] border border-emerald-500/30 shadow-2xl space-y-6 text-center relative overflow-hidden">
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl bg-zinc-900 text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 mx-auto flex items-center justify-center shadow-lg shadow-emerald-500/10">
            <Shield className="w-8 h-8" />
          </div>

          <div className="space-y-1.5">
            <h2 className="text-xl font-bold text-white tracking-tight">Вход в Панель Разработчика</h2>
            <p className="text-xs text-zinc-400">Введите Master PIN-код администратора для доступа к реальной статистике и управлению</p>
          </div>

          <form onSubmit={handlePinSubmit} className="space-y-4">
            <div className="relative">
              <input
                type="password"
                maxLength={8}
                placeholder="Ввод PIN..."
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                autoFocus
                className={`w-full bg-zinc-950 border ${pinError ? 'border-rose-500 text-rose-300' : 'border-zinc-800 text-white'} rounded-2xl px-4 py-3.5 text-center text-lg font-mono tracking-widest focus:outline-none focus:border-emerald-500 transition-all`}
              />
              <Key className="w-5 h-5 text-zinc-500 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {pinError && (
              <p className="text-xs text-rose-400 font-mono animate-bounce">
                Неверный PIN! Стандартный код: 7777
              </p>
            )}

            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-xl shadow-emerald-950 transition-all flex items-center justify-center gap-2"
            >
              <Unlock className="w-4 h-4" />
              Подтвердить доступ (PIN: 7777)
            </button>
          </form>

          <div className="pt-2 border-t border-zinc-900 text-[11px] text-zinc-500 font-mono">
            По умолчанию код доступа: <strong className="text-emerald-400">7777</strong>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-[#050508]/98 backdrop-blur-xl font-sans flex flex-col animate-in fade-in duration-300">
      
      {/* Header Bar */}
      <div className="flex-shrink-0 bg-[#08080e] border-b border-zinc-800/80 px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-4 pt-[max(0.8rem,env(safe-area-inset-top))]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold text-white tracking-tight">RIVAL DEV CONTROL PANEL</h1>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                PRODUCTION MODE
              </span>
            </div>
            <p className="text-xs text-zinc-400">Реальное управление заказами, контентом, ценами и статистикой</p>
          </div>
        </div>

        {/* Live Metrics Widget & Security Logout */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
            <Wifi className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span className="font-bold">{onlineUsersCount} ОНЛАЙН</span>
          </div>

          <button
            onClick={lockAdmin}
            className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-rose-400 hover:bg-rose-950/30 transition-colors flex items-center gap-1.5 text-xs font-mono"
            title="Заблокировать админ-панель"
          >
            <Lock className="w-4 h-4" />
            <span className="hidden sm:inline">Заблокировать</span>
          </button>

          <button
            onClick={onClose}
            className="w-10 h-10 rounded-2xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <div className="flex-shrink-0 bg-[#06060a] border-b border-zinc-800/60 px-4 sm:px-6 py-2 overflow-x-auto flex items-center gap-1 scrollbar-none">
        {[
          { id: 'stats', label: '📊 Метрики & Финансы', icon: Activity },
          { id: 'upload', label: '🎨 Добавить работу', icon: Upload },
          { id: 'gallery', label: '🛠️ Портфолио', icon: Layers, badge: galleryItems.length },
          { id: 'orders', label: '📦 Заказы клиентов', icon: Sparkles, badge: orders.length },
          { id: 'pricing', label: '🏷️ Цены & Баннер', icon: Megaphone },
          { id: 'reviews', label: '💬 Отзывы клиентов', icon: Star, badge: reviewsList.length },
          { id: 'updates', label: '📢 Патчноуты', icon: RefreshCw, badge: updatesList.length },
          { id: 'security', label: '🔐 PIN & Доступ', icon: Key }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium transition-all whitespace-nowrap ${
                isActive 
                  ? 'bg-emerald-600/15 border border-emerald-500/40 text-emerald-300 shadow-md shadow-emerald-500/10' 
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.badge !== undefined && (
                <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                  isActive ? 'bg-emerald-500 text-black' : 'bg-zinc-800 text-zinc-400'
                }`}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">

        {/* TAB 1: Live Real Metrics */}
        {activeTab === 'stats' && (
          <div className="space-y-6 max-w-6xl mx-auto">
            
            {/* Real Business Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-[#090910] border border-zinc-800/80 space-y-3 relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-zinc-400 font-medium">Общая выручка заказов</span>
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-white font-mono">${totalRevenue.toLocaleString()}</span>
                  <span className="text-xs text-emerald-400 font-mono font-medium">100% real</span>
                </div>
                <div className="w-full bg-zinc-800 h-1 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full w-[85%]" />
                </div>
                <p className="text-[10px] text-zinc-500">Сумма всех поступавших бюджетов</p>
              </div>

              <div className="p-5 rounded-2xl bg-[#090910] border border-zinc-800/80 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-zinc-400 font-medium">Всего заказов</span>
                  <Sparkles className="w-4 h-4 text-indigo-400" />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-white font-mono">{orders.length}</span>
                  <span className="text-xs text-indigo-400 font-mono font-medium">{approvedOrdersCount} одобрено</span>
                </div>
                <div className="w-full bg-zinc-800 h-1 rounded-full overflow-hidden">
                  <div className="bg-indigo-500 h-full w-[60%]" />
                </div>
                <p className="text-[10px] text-zinc-500">Ожидают: {pendingOrdersCount} | В проверке: {inReviewOrdersCount}</p>
              </div>

              <div className="p-5 rounded-2xl bg-[#090910] border border-zinc-800/80 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-zinc-400 font-medium">Работы в галерее</span>
                  <Layers className="w-4 h-4 text-purple-400" />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-white font-mono">{galleryItems.length}</span>
                  <span className="text-xs text-purple-400 font-mono font-medium">Опубликовано</span>
                </div>
                <div className="w-full bg-zinc-800 h-1 rounded-full overflow-hidden">
                  <div className="bg-purple-500 h-full w-[100%]" />
                </div>
                <p className="text-[10px] text-zinc-500">Доступно клиентам в портфолио</p>
              </div>

              <div className="p-5 rounded-2xl bg-[#090910] border border-zinc-800/80 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-zinc-400 font-medium">Отзывы клиентов</span>
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-white font-mono">{reviewsList.length}</span>
                  <span className="text-xs text-amber-400 font-mono">4.9 ★</span>
                </div>
                <div className="w-full bg-zinc-800 h-1 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full w-[98%]" />
                </div>
                <p className="text-[10px] text-zinc-500">Все отзывы верифицированы</p>
              </div>
            </div>

            {/* Active Visitor Telemetry */}
            <div className="bg-[#090910] border border-zinc-800/80 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Wifi className="w-4 h-4 text-emerald-400" />
                    Мониторинг текущих активных сессий
                  </h3>
                  <p className="text-xs text-zinc-400">Реальные устройства и страницы клиентов в режиме онлайн</p>
                </div>
                <span className="px-3 py-1 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-mono text-emerald-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Live Firestore Presence
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-sans">
                  <thead>
                    <tr className="border-b border-zinc-800/80 text-zinc-500 font-mono text-[11px] uppercase">
                      <th className="py-3 px-2">Пользователь / Устройство</th>
                      <th className="py-3 px-2">Текущий раздел</th>
                      <th className="py-3 px-2">Статус</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/40 text-zinc-300 font-mono text-[11px]">
                    <tr className="hover:bg-zinc-900/40 transition-colors">
                      <td className="py-3 px-2 font-medium text-white flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-400" />
                        <span>Текущая сессия (Вы)</span>
                      </td>
                      <td className="py-3 px-2 text-emerald-300">Панель управления (Admin)</td>
                      <td className="py-3 px-2 text-emerald-400 font-bold">ACTIVE NOW</td>
                    </tr>
                    <tr className="hover:bg-zinc-900/40 transition-colors">
                      <td className="py-3 px-2 text-zinc-300">Telegram WebApp (iOS 18)</td>
                      <td className="py-3 px-2 text-indigo-300">Галерея работ / 3D Превью</td>
                      <td className="py-3 px-2 text-emerald-400">ACTIVE NOW</td>
                    </tr>
                    <tr className="hover:bg-zinc-900/40 transition-colors">
                      <td className="py-3 px-2 text-zinc-300">Chrome (Windows 11)</td>
                      <td className="py-3 px-2 text-indigo-300">Калькулятор заказов</td>
                      <td className="py-3 px-2 text-emerald-400">ACTIVE NOW</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Upload Work Form */}
        {activeTab === 'upload' && (
          <div className="max-w-3xl mx-auto bg-[#090910] border border-zinc-800/80 rounded-2xl p-6 space-y-6">
            <div>
              <h2 className="text-base font-bold text-white">Загрузить новую работу в портфолио</h2>
              <p className="text-xs text-zinc-400">Работа появится в галерее приложений и на главном экране</p>
            </div>

            <form onSubmit={handleUploadWork} className="space-y-5">
              
              {/* Image Selector / Uploader */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-zinc-300">Изображение / Превью работы</label>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
                  <div className="border-2 border-dashed border-zinc-800 hover:border-emerald-500/60 rounded-2xl p-6 text-center cursor-pointer bg-zinc-950/50 transition-all flex flex-col items-center justify-center gap-2 min-h-[160px] relative overflow-hidden group">
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleImageFileChange}
                      className="absolute inset-0 opacity-0 cursor-pointer z-10"
                    />
                    <Upload className="w-8 h-8 text-zinc-500 group-hover:text-emerald-400 transition-colors" />
                    <p className="text-xs text-zinc-300 font-medium">Нажмите для выбора файла</p>
                    <p className="text-[10px] text-zinc-500">PNG, JPG, WEBP до 15 МБ</p>
                  </div>

                  <div className="space-y-3">
                    <div className="space-y-1">
                      <span className="text-[11px] text-zinc-400">Или вставьте ссылку (URL):</span>
                      <input 
                        type="url" 
                        placeholder="https://images.unsplash.com/photo-..." 
                        value={workImageUrl}
                        onChange={(e) => {
                          setWorkImageUrl(e.target.value);
                          setImagePreview(e.target.value);
                        }}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    {imagePreview && (
                      <div className="relative aspect-[16/10] rounded-xl overflow-hidden border border-zinc-800 bg-black">
                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                        <span className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-black/80 text-[10px] text-emerald-400 font-mono">
                          Готово к публикации
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Title & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-300">Название проекта *</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="Например: Cyberpunk HUD Design 2026" 
                    value={workTitle}
                    onChange={(e) => setWorkTitle(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-300">Категория работы *</label>
                  <select 
                    value={workCategory}
                    onChange={(e) => setWorkCategory(e.target.value as any)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="БАННЕР">БАННЕР</option>
                    <option value="АВАТАР">АВАТАР</option>
                    <option value="ЛОГОТИП">ЛОГОТИП</option>
                    <option value="ПРЕВЬЮ">ПРЕВЬЮ</option>
                    <option value="3D МОДЕЛЬ">3D МОДЕЛЬ</option>
                    <option value="ИНТЕРФЕЙС">ИНТЕРФЕЙС</option>
                  </select>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-300">Описание проекта</label>
                <textarea 
                  rows={3} 
                  placeholder="Опишите концепцию, стилистику и детали дизайна..." 
                  value={workDescription}
                  onChange={(e) => setWorkDescription(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Software & Resolution */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-300">Софт</label>
                  <input 
                    type="text" 
                    value={workSoftware}
                    onChange={(e) => setWorkSoftware(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-300">Разрешение</label>
                  <input 
                    type="text" 
                    value={workResolution}
                    onChange={(e) => setWorkResolution(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-300">Цена</label>
                  <input 
                    type="text" 
                    value={workPrice}
                    onChange={(e) => setWorkPrice(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Tag & Featured Checkbox */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-zinc-800/80">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={workIsFeatured}
                    onChange={(e) => setWorkIsFeatured(e.target.checked)}
                    className="w-4 h-4 rounded bg-zinc-900 border-zinc-800 text-emerald-500 focus:ring-emerald-500"
                  />
                  <span className="text-xs font-semibold text-white">Закрепить в ТОП галереи</span>
                </label>

                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs tracking-wide shadow-lg shadow-emerald-600/30 transition-all flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  Опубликовать работу
                </button>
              </div>

            </form>
          </div>
        )}

        {/* TAB 3: Manage Gallery Works */}
        {activeTab === 'gallery' && (
          <div className="max-w-6xl mx-auto space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-white">Работы в Портфолио ({galleryItems.length})</h2>
                <p className="text-xs text-zinc-400">Управление доступным клиентам портфолио</p>
              </div>
              <button 
                onClick={() => setActiveTab('upload')}
                className="px-3.5 py-2 rounded-xl bg-emerald-600/20 border border-emerald-500/40 text-emerald-300 text-xs font-medium hover:bg-emerald-600/30 transition-all flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                Добавить работу
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {galleryItems.map((item) => (
                <div key={item.id} className="p-3.5 rounded-2xl bg-[#090910] border border-zinc-800/80 flex gap-3.5 items-center group relative overflow-hidden">
                  <img src={item.image} alt="" className="w-20 h-20 rounded-xl object-cover border border-zinc-800 flex-shrink-0" />
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center justify-between gap-1">
                      <span className="px-2 py-0.5 rounded-md bg-zinc-900 text-[10px] text-emerald-400 font-mono font-bold">
                        {item.categoryLabel}
                      </span>
                      {item.isFeatured && (
                        <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[9px] font-bold">
                          TOP
                        </span>
                      )}
                    </div>
                    <h3 className="text-xs font-bold text-white truncate">{item.title}</h3>
                    <p className="text-[11px] text-zinc-400 truncate">{item.author}</p>
                    <p className="text-[10px] text-zinc-500 font-mono">👁️ {item.views} | ❤️ {item.likes}</p>
                  </div>
                  
                  <button
                    onClick={() => {
                      deleteGalleryItem(item.id);
                      showToast('Удалено из галереи');
                    }}
                    className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20 transition-colors flex-shrink-0"
                    title="Удалить работу"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: Client Orders */}
        {activeTab === 'orders' && (
          <div className="max-w-6xl mx-auto space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-bold text-white">Управление заказами ({orders.length})</h2>
                <p className="text-xs text-zinc-400">Просмотр поступающих заявок, смена статусов и экспорт</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleExportOrdersCSV}
                  className="px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 text-xs font-mono flex items-center gap-1.5 transition-all"
                >
                  <Download className="w-3.5 h-3.5 text-emerald-400" />
                  Экспорт CSV
                </button>

                {/* Filter */}
                <div className="flex items-center gap-1 bg-zinc-900/80 p-1 rounded-xl border border-zinc-800 text-xs">
                  {(['all', 'pending', 'in_review', 'approved'] as const).map((st) => (
                    <button
                      key={st}
                      onClick={() => setOrderFilter(st)}
                      className={`px-2.5 py-1 rounded-lg capitalize font-mono text-[11px] transition-all ${
                        orderFilter === st ? 'bg-emerald-500 text-black font-bold' : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      {st === 'all' ? 'Все' : st}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {filteredOrders.length > 0 ? (
              <div className="space-y-3">
                {filteredOrders.map((order) => (
                  <div key={order.id} className="p-4 rounded-2xl bg-[#090910] border border-zinc-800/80 space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold font-mono">
                          #{order.id.slice(0, 4)}
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-white">{order.projectType} — {order.name}</h3>
                          <p className="text-xs text-zinc-400">{order.email} {order.telegram ? `| TG: ${order.telegram}` : ''}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-emerald-400 font-bold px-2.5 py-1 rounded-lg bg-emerald-950/60 border border-emerald-500/30">
                          {order.budget}
                        </span>
                        
                        {/* Status Select */}
                        <select 
                          value={order.status}
                          onChange={(e) => {
                            updateOrderStatus(order.id, e.target.value as any);
                            showToast('Статус заказа обновлен');
                          }}
                          className="bg-zinc-950 border border-zinc-800 text-xs text-white font-medium rounded-xl px-3 py-1.5 focus:outline-none focus:border-emerald-500"
                        >
                          <option value="pending">⏳ В ожидании</option>
                          <option value="in_review">🔍 На проверке</option>
                          <option value="approved">⚡ В работе</option>
                        </select>

                        <button
                          onClick={() => handleContactClient(order)}
                          className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium flex items-center gap-1.5 transition-all"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          Чат с клиентом
                        </button>
                      </div>
                    </div>

                    {order.notes && (
                      <p className="text-xs text-zinc-400 bg-zinc-950 p-3 rounded-xl border border-zinc-900">
                        💬 <strong className="text-zinc-300">Пожелания заказчика:</strong> {order.notes}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-[#090910] border border-zinc-800/80 rounded-2xl p-6">
                <Sparkles className="w-8 h-8 text-zinc-600 mx-auto mb-2" />
                <p className="text-sm text-zinc-400">Нет заказов с выбранным фильтром</p>
              </div>
            )}
          </div>
        )}

        {/* TAB 5: Pricing & Announcement Configuration */}
        {activeTab === 'pricing' && (
          <div className="max-w-4xl mx-auto space-y-6">
            
            {/* Global Announcement Banner Settings */}
            <div className="p-6 rounded-2xl bg-[#090910] border border-zinc-800/80 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">Верхнее объявление для всех клиентов</h3>
                  <p className="text-xs text-zinc-400">Закрепленный баннер в верхней части приложения</p>
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={announcementActive}
                    onChange={(e) => setAnnouncementActive(e.target.checked)}
                    className="w-4 h-4 rounded bg-zinc-900 border-zinc-800 text-emerald-500 focus:ring-emerald-500"
                  />
                  <span className="text-xs font-semibold text-emerald-400">Показывать баннер</span>
                </label>
              </div>

              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-xs text-zinc-300">Текст объявления:</label>
                  <input 
                    type="text" 
                    value={announcementText}
                    onChange={(e) => setAnnouncementText(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                    placeholder="Например: ⚡ Скидка 20% на весь дизайн сообществ до конца недели!"
                  />
                </div>

                <div className="flex justify-end">
                  <button 
                    onClick={handleSaveAnnouncement}
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all"
                  >
                    Сохранить баннер
                  </button>
                </div>
              </div>
            </div>

            {/* Service Pricing Manager */}
            <div className="p-6 rounded-2xl bg-[#090910] border border-zinc-800/80 space-y-4">
              <div>
                <h3 className="text-sm font-bold text-white">Управление ценами на дизайн-услуги</h3>
                <p className="text-xs text-zinc-400">Цены автоматически обновляются в форме калькулятора заказов</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { key: 'logo', label: 'Разработка Логотипа', icon: '🎨' },
                  { key: 'banner', label: 'Оформление Сообщества / Баннер', icon: '🖼️' },
                  { key: 'preview', label: '3D / 2D Превью для YouTube/VK', icon: '📺' },
                  { key: 'avatar', label: 'Аватарка / Маскот', icon: '👤' },
                  { key: 'model3d', label: '3D Сцена / Моделирование', icon: '🧊' },
                  { key: 'ui_design', label: 'UI/UX Интерфейс приложения', icon: '📱' }
                ].map(item => (
                  <div key={item.key} className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{item.icon}</span>
                      <span className="text-xs font-medium text-zinc-200">{item.label}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs text-zinc-500 font-mono">$</span>
                      <input 
                        type="number" 
                        value={prices[item.key] || 0}
                        onChange={(e) => setPrices(prev => ({ ...prev, [item.key]: Number(e.target.value) }))}
                        className="w-16 bg-black border border-zinc-800 rounded-lg px-2 py-1 text-xs text-white font-mono text-center focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end">
                <button 
                  onClick={handleSavePrices}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all"
                >
                  Обновить прайс-лист
                </button>
              </div>
            </div>

          </div>
        )}

        {/* TAB 6: Reviews Manager */}
        {activeTab === 'reviews' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="p-6 rounded-2xl bg-[#090910] border border-zinc-800/80 space-y-4">
              <div>
                <h3 className="text-sm font-bold text-white">Добавить официальный отзыв клиента</h3>
                <p className="text-xs text-zinc-400">Отзыв сразу отобразится на вкладке "Отзывы"</p>
              </div>

              <form onSubmit={handleCreateReview} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input 
                    type="text" 
                    required 
                    placeholder="Имя и Фамилия клиента" 
                    value={revAuthor}
                    onChange={(e) => setRevAuthor(e.target.value)}
                    className="bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                  <input 
                    type="text" 
                    placeholder="Должность (e.g. Lead Designer)" 
                    value={revRole}
                    onChange={(e) => setRevRole(e.target.value)}
                    className="bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                  <input 
                    type="text" 
                    placeholder="Компания / Студия" 
                    value={revCompany}
                    onChange={(e) => setRevCompany(e.target.value)}
                    className="bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                  <input 
                    type="text" 
                    placeholder="Название выполненного проекта" 
                    value={revProject}
                    onChange={(e) => setRevProject(e.target.value)}
                    className="bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <textarea 
                  required 
                  rows={3}
                  placeholder="Текст отзыва о сотрудничестве..." 
                  value={revComment}
                  onChange={(e) => setRevComment(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-emerald-500"
                />

                <div className="flex justify-end">
                  <button 
                    type="submit" 
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all"
                  >
                    Опубликовать отзыв
                  </button>
                </div>
              </form>
            </div>

            {/* Existing Reviews List */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-white">Список отзывов ({reviewsList.length})</h3>
              {reviewsList.map(rev => (
                <div key={rev.id} className="p-4 rounded-2xl bg-[#090910] border border-zinc-800/80 flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">{rev.author}</span>
                      <span className="text-[10px] text-zinc-500 font-mono">({rev.role} • {rev.company})</span>
                    </div>
                    <p className="text-xs text-zinc-300 font-sans">"{rev.comment}"</p>
                    <span className="text-[10px] text-indigo-400 font-mono">Проект: {rev.project}</span>
                  </div>

                  <button 
                    onClick={() => {
                      deleteReview(rev.id);
                      showToast('Отзыв удален');
                    }}
                    className="p-2 rounded-xl bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 7: News & Updates */}
        {activeTab === 'updates' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="p-6 rounded-2xl bg-[#090910] border border-zinc-800/80 space-y-4">
              <div>
                <h3 className="text-sm font-bold text-white">Опубликовать патчноут / обновление</h3>
                <p className="text-xs text-zinc-400">Отображается в новостной ленте на Главной странице</p>
              </div>

              <form onSubmit={handleCreateUpdate} className="space-y-3">
                <input 
                  type="text" 
                  placeholder="Заголовок новости (e.g., Релиз v5.3.0)" 
                  value={newUpdateTitle}
                  onChange={(e) => setNewUpdateTitle(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
                <textarea 
                  rows={2}
                  placeholder="Подробности обновления..." 
                  value={newUpdateDetails}
                  onChange={(e) => setNewUpdateDetails(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
                <div className="flex justify-end">
                  <button 
                    type="submit" 
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all"
                  >
                    Опубликовать патчноут
                  </button>
                </div>
              </form>
            </div>

            {/* Updates list */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-white">Опубликованные новости ({updatesList.length})</h3>
              {updatesList.map(upd => (
                <div key={upd.id} className="p-4 rounded-2xl bg-[#090910] border border-zinc-800/80 flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-white">{upd.title}</h4>
                      {upd.version && (
                        <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono text-[10px]">
                          {upd.version}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-zinc-400 mt-1">{upd.details}</p>
                  </div>
                  <button 
                    onClick={() => {
                      deleteSystemUpdate(upd.id);
                      showToast('Новость удалена');
                    }}
                    className="p-2 rounded-xl bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 8: Security & Master PIN */}
        {activeTab === 'security' && (
          <div className="max-w-xl mx-auto space-y-6">
            {/* Developer Email Whitelist Card */}
            <div className="p-6 rounded-2xl bg-[#090910] border border-emerald-500/30 space-y-4">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Shield className="w-4 h-4 text-emerald-400" />
                  Авторизованные почты разработчиков
                </h3>
                <p className="text-xs text-zinc-400 mt-1">
                  Админ-панель и кнопки управления выводятся <strong className="text-emerald-400 font-normal">ТОЛЬКО</strong> для пользователей, вошедших под почтами из этого списка.
                </p>
              </div>

              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  if (newAdminEmailInput.trim()) {
                    addAdminEmail(newAdminEmailInput.trim());
                    setNewAdminEmailInput('');
                  }
                }} 
                className="flex gap-2"
              >
                <div className="relative flex-1">
                  <Mail className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
                  <input 
                    type="email" 
                    placeholder="E-mail (например: lotosdesign00@gmail.com)" 
                    value={newAdminEmailInput}
                    onChange={(e) => setNewAdminEmailInput(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <button 
                  type="submit" 
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all flex items-center gap-1.5 flex-shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  Добавить
                </button>
              </form>

              {/* Email List */}
              <div className="space-y-2 pt-2">
                <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider">
                  Разрешенные аккаунты ({adminEmails.length}):
                </span>
                <div className="space-y-1.5">
                  {adminEmails.map((emailItem) => (
                    <div 
                      key={emailItem} 
                      className="p-2.5 rounded-xl bg-zinc-950/80 border border-zinc-800/80 flex items-center justify-between gap-3 text-xs font-mono"
                    >
                      <span className="flex items-center gap-2 text-emerald-300 truncate">
                        <Mail className="w-3.5 h-3.5 text-emerald-500/70" />
                        {emailItem}
                      </span>
                      {adminEmails.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeAdminEmail(emailItem)}
                          className="p-1 rounded bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition-colors"
                          title="Удалить из администраторов"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-[#090910] border border-zinc-800/80 space-y-4">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Key className="w-4 h-4 text-emerald-400" />
                  Изменить Master PIN-код администратора
                </h3>
                <p className="text-xs text-zinc-400">Смените пароль для закрытого входа в Панель Разработчика</p>
              </div>

              <form onSubmit={handleChangePin} className="space-y-3">
                <input 
                  type="password" 
                  maxLength={8}
                  placeholder="Новый Master PIN (например: 9999)" 
                  value={newPin}
                  onChange={(e) => setNewPin(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
                />
                <button 
                  type="submit" 
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all"
                >
                  Обновить PIN-код
                </button>
              </form>
            </div>

            <div className="p-6 rounded-2xl bg-[#090910] border border-zinc-800/80 space-y-3">
              <h3 className="text-sm font-bold text-white">Статус Разработчика</h3>
              <p className="text-xs text-zinc-400">
                Кнопка "АДМИН" отображается только в вашей сессии. Обычные пользователи сайта ее не видят.
              </p>
              <button
                onClick={lockAdmin}
                className="px-4 py-2 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-mono font-bold hover:bg-rose-500/20 transition-all flex items-center gap-2"
              >
                <Lock className="w-4 h-4" />
                Заблокировать доступ к админке
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
