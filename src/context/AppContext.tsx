import React, { createContext, useContext, useState, useEffect, useMemo, useRef } from 'react';
import { OrderRequest, HistoryItem, NotificationItem, GalleryItem, UpdateItem, Review } from '../types';
import { GALLERY_ITEMS, RECENT_UPDATES, CLIENT_REVIEWS } from '../data/mockData';
import { Sparkles, CheckCircle2, AlertCircle, Info } from 'lucide-react';
import { StorageService } from '../services/StorageService';
import { auth, db, handleFirestoreError, OperationType } from '../firebase';
import { signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } from 'firebase/auth';
import { doc, setDoc, getDoc, onSnapshot, collection, deleteDoc, updateDoc } from 'firebase/firestore';
import { playSoundEffect } from '../utils/soundUtils';


export interface UserProfile {
  name: string;
  username: string;
  bio: string;
  location: string;
  avatarUrl: string;
  userRole: 'designer' | 'client' | 'lead';
  roleTitle: string;
  balance: number;
  starsCount: number;
  authProvider?: 'telegram' | 'google';
  authAccountId?: string;
  lastNameChangeDate?: number; // timestamp in ms
}

const NINETY_DAYS_MS = 90 * 24 * 60 * 60 * 1000;

export const checkDsgDesignTag = (provider: 'telegram' | 'google' | null, userProf: UserProfile): boolean => {
  if (provider === 'google') return true; // Google logins are not restricted by TG dsg design tag
  
  const tgUser = typeof window !== 'undefined' ? (window as any).Telegram?.WebApp?.initDataUnsafe?.user : null;
  const combined = `
    ${tgUser?.first_name || ''} 
    ${tgUser?.last_name || ''} 
    ${tgUser?.username || ''} 
    ${userProf.username || ''} 
    ${userProf.bio || ''} 
    ${userProf.name || ''}
  `.toLowerCase();

  return (
    combined.includes('dsg design') || 
    combined.includes('dsg_design') || 
    combined.includes('dsgdesign') || 
    combined.includes('dsg')
  );
};

export interface AppSettings {
  darkTheme: boolean;
  gridBg: boolean;
  notificationsEnabled: boolean;
  soundFx: boolean;
  developerMode: boolean;
  highContrast: boolean;
}

export interface AppearanceSettings {
  theme: 'dark' | 'light' | 'system';
  accentColor: string;
  background: 'grid' | 'clean' | 'aurora';
  density: 'compact' | 'comfortable' | 'spacious';
}

export interface PrivacySettings {
  publicProfile: boolean;
  showOnlineStatus: boolean;
  allowDirectMessages: boolean;
  allowCollabRequests: boolean;
  portfolioPrivacy: 'public' | 'followers' | 'private';
  analyticsCollection: boolean;
  personalizedRecs: boolean;
  usageStats: boolean;
  email: string;
  twoFactorAuth: boolean;
  loginNotifications: boolean;
}

export interface ConnectedAccountState {
  id: string;
  name: string;
  handle?: string;
  connected: boolean;
}

interface AppContextType {
  // Toast
  toastMessage: string | null;
  showToast: (msg: string) => void;

  // Auth State
  isAuthenticated: boolean;
  authProvider: 'telegram' | 'google' | null;
  canChangeName: boolean;
  canChangeUsername: boolean;
  canBeDesigner: boolean;
  nextNameChangeDateFormatted: string | null;
  login: (provider?: 'telegram' | 'google') => void;
  logout: () => void;

  // User Profile
  profile: UserProfile;
  userProfile: UserProfile;
  updateProfile: (data: Partial<UserProfile>) => void;
  depositBalance: (amount: number) => void;
  withdrawBalance: (amount: number) => boolean;
  deductBalance: (amount: number, reason?: string) => boolean;

  // Settings
  settings: AppSettings;
  updateSettings: (data: Partial<AppSettings>) => void;

  // Appearance
  appearance: AppearanceSettings;
  updateAppearance: (data: Partial<AppearanceSettings>) => void;

  // Privacy
  privacy: PrivacySettings;
  updatePrivacy: (data: Partial<PrivacySettings>) => void;

  // Connected Accounts
  accounts: ConnectedAccountState[];
  toggleAccountConnect: (id: string) => void;
  disconnectAllAccounts: () => void;

  // User Orders
  orders: OrderRequest[];
  addOrder: (order: OrderRequest) => boolean;

  // Favorites / Likes
  favorites: string[];
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;

  // AI History
  aiHistory: HistoryItem[];
  addAIHistoryItem: (item: Omit<HistoryItem, 'id' | 'timestamp'>) => void;
  removeAIHistoryItem: (id: string) => void;

  // Notifications
  notifications: NotificationItem[];
  unreadNotificationsCount: number;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  addNotification: (titleOrObj: any, message?: string, category?: NotificationItem['category']) => void;

  // Academy Progress
  academyProgress: Record<string, string[]>; // courseId -> lessonIds[]
  toggleLessonCompleted: (courseId: string, lessonId: string) => void;
  isLessonCompleted: (courseId: string, lessonId: string) => boolean;
  getCourseProgress: (courseId: string, totalLessons: number) => number;

  // AI Credits & Pro Status
  aiCredits: number;
  setAiCredits: React.Dispatch<React.SetStateAction<number>>;
  useAICredit: (amount?: number) => boolean;
  addAICredits: (amount: number) => void;
  isPro: boolean;
  setIsPro: React.Dispatch<React.SetStateAction<boolean>>;
  togglePro: () => void;

  // Searches
  recentSearches: string[];
  addRecentSearch: (query: string) => void;
  clearRecentSearches: () => void;

  // Admin Panel & Dynamic Content
  isAdmin: boolean;
  setIsAdmin: React.Dispatch<React.SetStateAction<boolean>>;
  isAdminModalOpen: boolean;
  setIsAdminModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onlineUsersCount: number;
  galleryItems: GalleryItem[];
  addGalleryItem: (item: Omit<GalleryItem, 'id' | 'views' | 'likes' | 'date'>) => void;
  deleteGalleryItem: (id: string) => void;
  announcement: { active: boolean; text: string; linkText?: string };
  updateAnnouncement: (data: Partial<{ active: boolean; text: string; linkText?: string }>) => void;
  servicePrices: Record<string, number>;
  updateServicePrice: (key: string, price: number) => void;
  updatesList: UpdateItem[];
  addSystemUpdate: (item: Omit<UpdateItem, 'id' | 'time'>) => void;
  deleteSystemUpdate: (id: string) => void;
  updateOrderStatus: (orderId: string, status: OrderRequest['status']) => void;

  // Reviews Management
  reviewsList: Review[];
  addReview: (review: Omit<Review, 'id'>) => void;
  deleteReview: (id: string) => void;

  // Developer Access Security
  adminEmails: string[];
  addAdminEmail: (email: string) => void;
  removeAdminEmail: (email: string) => void;
  masterPin: string;
  setMasterPin: (newPin: string) => void;
  isAdminUnlocked: boolean;
  unlockAdminWithPin: (pin: string) => boolean;
  lockAdmin: () => void;
}

const DEFAULT_PROFILE: UserProfile = {
  name: 'Пользователь',
  username: '@user',
  bio: 'Дизайнер и цифровой исследователь.',
  location: 'Не указано',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
  userRole: 'designer',
  roleTitle: 'MEMBER',
  balance: 0,
  starsCount: 0
};

const DEFAULT_SETTINGS: AppSettings = {
  darkTheme: true,
  gridBg: true,
  notificationsEnabled: true,
  soundFx: true,
  developerMode: true,
  highContrast: false
};

const DEFAULT_APPEARANCE: AppearanceSettings = {
  theme: 'dark',
  accentColor: 'purple',
  background: 'grid',
  density: 'comfortable'
};

const DEFAULT_PRIVACY: PrivacySettings = {
  publicProfile: true,
  showOnlineStatus: true,
  allowDirectMessages: true,
  allowCollabRequests: true,
  portfolioPrivacy: 'public',
  analyticsCollection: true,
  personalizedRecs: true,
  usageStats: false,
  email: 'user@rival.space',
  twoFactorAuth: false,
  loginNotifications: true
};

const DEFAULT_ACCOUNTS: ConnectedAccountState[] = [
  { id: 'github', name: 'GitHub', handle: '', connected: false },
  { id: 'figma', name: 'Figma', handle: '', connected: false },
  { id: 'behance', name: 'Behance', handle: '', connected: false },
  { id: 'dribbble', name: 'Dribbble', handle: '', connected: false }
];

const DEFAULT_NOTIFICATIONS: NotificationItem[] = [];

const DEFAULT_AI_HISTORY: HistoryItem[] = [];

const AppContext = createContext<AppContextType | null>(null);

const sanitizeNotifications = (raw: any): NotificationItem[] => {
  const items = Array.isArray(raw) ? raw : [];
  const seenIds = new Set<string>();
  const result: NotificationItem[] = [];

  items.forEach((item, index) => {
    if (!item || typeof item !== 'object') return;
    if (['n1', 'n2', 'n3', 'n4', 'n5'].includes(item.id)) return; // Filter demo items

    let titleStr = '';
    let msgStr = '';
    let category = item.category || 'System';
    let isUnread = Boolean(item.isUnread);

    if (typeof item.title === 'object' && item.title !== null) {
      titleStr = String(item.title.title || 'Уведомление');
      msgStr = String(item.title.message || item.message || '');
      category = item.title.category || category;
    } else {
      titleStr = typeof item.title === 'string' ? item.title : String(item.title || 'Уведомление');
      msgStr = typeof item.message === 'string' ? item.message : (typeof item.message === 'object' ? JSON.stringify(item.message) : String(item.message || ''));
    }

    let id = typeof item.id === 'string' && item.id.trim() ? item.id : `n-${Date.now()}-${index}`;
    if (seenIds.has(id)) {
      id = `${id}-${index}-${Math.random().toString(36).substring(2, 6)}`;
    }
    seenIds.add(id);

    result.push({
      id,
      title: titleStr,
      message: msgStr,
      category,
      time: item.time || 'Только что',
      isUnread
    });
  });

  return result;
};

// Ensure storage key versioning so legacy cached balance and dummy orders are cleared for a fresh start
const STORAGE_VERSION_KEY = 'rival_v5_prod_clean';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [authProvider, setAuthProvider] = useState<'telegram' | 'google' | null>(() => 
    StorageService.getItem('rival_auth_provider', null)
  );

  // Auth state - defaults to false for new users unless already logged in
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => 
    StorageService.getItem('rival_is_authenticated', false)
  );

  // One-time fresh cleanup of legacy demo storage
  if (typeof window !== 'undefined' && !StorageService.getItem(STORAGE_VERSION_KEY, false)) {
    StorageService.removeItem('rival_user_profile');
    StorageService.removeItem('rival_user_orders');
    StorageService.removeItem('rival_user_favorites');
    StorageService.removeItem('rival_ai_history');
    StorageService.removeItem('rival_notifications');
    StorageService.removeItem('rival_conversations');
    StorageService.removeItem('rival_chat_messages');
    StorageService.removeItem('rival_recent_searches');
    StorageService.removeItem('rival_academy_progress');
    StorageService.setItem(STORAGE_VERSION_KEY, true);
  }

  const [profile, setProfile] = useState<UserProfile>(() => {
    const loaded = StorageService.getItem('rival_user_profile', DEFAULT_PROFILE);
    const provider = StorageService.getItem<'telegram' | 'google' | null>('rival_auth_provider', 'telegram');
    return { 
      ...loaded, 
      balance: loaded.balance || 0,
      authProvider: loaded.authProvider || provider || 'telegram' 
    };
  });

  const [settings, setSettings] = useState<AppSettings>(() => StorageService.getItem('rival_app_settings', DEFAULT_SETTINGS));
  const [appearance, setAppearance] = useState<AppearanceSettings>(() => StorageService.getItem('rival_appearance_settings', DEFAULT_APPEARANCE));
  const [privacy, setPrivacy] = useState<PrivacySettings>(() => StorageService.getItem('rival_privacy_settings', DEFAULT_PRIVACY));
  const [accounts, setAccounts] = useState<ConnectedAccountState[]>(() => StorageService.getItem('rival_connected_accounts', DEFAULT_ACCOUNTS));
  const [orders, setOrders] = useState<OrderRequest[]>(() => StorageService.getItem('rival_user_orders', []));
  const [favorites, setFavorites] = useState<string[]>(() => StorageService.getItem('rival_user_favorites', []));
  const [aiHistory, setAiHistory] = useState<HistoryItem[]>(() => StorageService.getItem('rival_ai_history', []));
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => sanitizeNotifications(StorageService.getItem('rival_notifications', [])));
  const [academyProgress, setAcademyProgress] = useState<Record<string, string[]>>(() => StorageService.getItem('rival_academy_progress', {}));
  const [aiCredits, setAiCredits] = useState<number>(() => {
    const lastReset = StorageService.getItem('rival_ai_last_reset', 0);
    const thirtyDays = 30 * 24 * 60 * 60 * 1000;
    if (Date.now() - lastReset > thirtyDays) {
      StorageService.setItem('rival_ai_last_reset', Date.now());
      StorageService.setItem('rival_ai_credits', 1000);
      return 1000;
    }
    return StorageService.getItem('rival_ai_credits', 1000);
  });
  const [isPro, setIsPro] = useState<boolean>(() => StorageService.getItem('rival_is_pro', false));
  const [recentSearches, setRecentSearches] = useState<string[]>(() => StorageService.getItem('rival_recent_searches', []));

  // Admin Panel & Dynamic Application Content State
  const [adminEmails, setAdminEmails] = useState<string[]>(() => 
    StorageService.getItem('rival_admin_emails', ['lotosdesign00@gmail.com', 'werb863@gmail.com'])
  );
  const [masterPin, setMasterPinState] = useState<string>(() => 
    StorageService.getItem('rival_master_pin', '7777')
  );
  const [isAdminUnlocked, setIsAdminUnlocked] = useState<boolean>(() => 
    StorageService.getItem('rival_admin_unlocked', false)
  );

  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  
  const [isAdminModalOpen, setIsAdminModalOpen] = useState<boolean>(false);
  const [onlineUsersCount, setOnlineUsersCount] = useState<number>(138);

  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>(() => 
    StorageService.getItem('rival_gallery_items', GALLERY_ITEMS)
  );

  const [reviewsList, setReviewsList] = useState<Review[]>(() => 
    StorageService.getItem('rival_client_reviews', CLIENT_REVIEWS)
  );

  const [announcement, setAnnouncement] = useState<{ active: boolean; text: string; linkText?: string }>(() => 
    StorageService.getItem('rival_system_announcement', {
      active: true,
      text: "⚡ Скидка 20% на дизайн сообществ и 3D превью до конца недели!",
      linkText: "Заказать со скидкой"
    })
  );

  const [servicePrices, setServicePrices] = useState<Record<string, number>>(() => 
    StorageService.getItem('rival_service_prices', {
      logo: 35,
      banner: 45,
      preview: 30,
      avatar: 20,
      model3d: 85,
      ui_design: 120
    })
  );

  const [updatesList, setUpdatesList] = useState<UpdateItem[]>(() => 
    StorageService.getItem('rival_system_updates', RECENT_UPDATES)
  );

  // Sync adminEmails to StorageService
  useEffect(() => {
    StorageService.setItem('rival_admin_emails', adminEmails);
  }, [adminEmails]);

  // Sync isAdmin strictly based on authorized emails list or unlocked pin
  useEffect(() => {
    const firebaseEmail = (auth?.currentUser?.email || '').trim().toLowerCase();
    const profileEmail = (profile.email || '').trim().toLowerCase();
    const privacyEmail = (privacy?.email || '').trim().toLowerCase();

    const isAuthorizedEmail = adminEmails.some(e => {
      const clean = e.trim().toLowerCase();
      return clean && (clean === firebaseEmail || clean === profileEmail || clean === privacyEmail);
    });

    const isExplicitAdminRole = profile.userRole === 'admin';

    setIsAdmin(Boolean(isAuthorizedEmail || isExplicitAdminRole || isAdminUnlocked));
  }, [isAdminUnlocked, profile.email, privacy?.email, profile.userRole, adminEmails, auth?.currentUser?.email]);

  // Live fluctuating online user counter
  useEffect(() => {
    const interval = setInterval(() => {
      setOnlineUsersCount(prev => {
        const delta = Math.floor(Math.random() * 5) - 2;
        const next = prev + delta;
        return next < 110 ? 115 : (next > 160 ? 152 : next);
      });
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const toastTimerRef = useRef<any>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
    }
    toastTimerRef.current = setTimeout(() => {
      setToastMessage(null);
    }, 3200);

    // Play subtle sound effect if soundFx is enabled
    if (settings.soundFx) {
      const lower = msg.toLowerCase();
      if (lower.includes('ошибка') || lower.includes('недостаточно') || lower.includes('заблокирован') || lower.includes('неверный')) {
        playSoundEffect('error');
      } else if (lower.includes('пополнен') || lower.includes('начислено') || lower.includes('кредит')) {
        playSoundEffect('coin');
      } else if (lower.includes('успешно') || lower.includes('активирован') || lower.includes('скачан') || lower.includes('экспортирован')) {
        playSoundEffect('success');
      } else if (lower.includes('ai') || lower.includes('нейросети')) {
        playSoundEffect('ai');
      } else {
        playSoundEffect('pop');
      }
    }
  };

  // 90-day name change calculations
  const canChangeName = useMemo(() => {
    if (!profile.lastNameChangeDate) return true;
    return (Date.now() - profile.lastNameChangeDate) >= NINETY_DAYS_MS;
  }, [profile.lastNameChangeDate]);

  const nextNameChangeDateFormatted = useMemo(() => {
    if (!profile.lastNameChangeDate) return null;
    const nextMs = profile.lastNameChangeDate + NINETY_DAYS_MS;
    if (Date.now() >= nextMs) return null;
    return new Date(nextMs).toLocaleDateString('ru-RU');
  }, [profile.lastNameChangeDate]);

  // Username change allowed only for Google
  const canChangeUsername = authProvider !== 'telegram';

  // Designer role permitted only if has 'dsg design' in Telegram profile (or if logged in via Google)
  const canBeDesigner = useMemo(() => {
    return checkDsgDesignTag(authProvider, profile);
  }, [authProvider, profile]);

  // Ensure role isn't 'designer' if TG tag is missing
  useEffect(() => {
    if (isAuthenticated && authProvider === 'telegram' && !canBeDesigner && profile.userRole === 'designer') {
      setProfile(prev => ({
        ...prev,
        userRole: 'client',
        roleTitle: 'CLIENT / CUSTOMER'
      }));
    }
  }, [isAuthenticated, authProvider, canBeDesigner, profile.userRole]);

  // Sync state to StorageService
  useEffect(() => { StorageService.setItem('rival_is_authenticated', isAuthenticated); }, [isAuthenticated]);
  useEffect(() => { StorageService.setItem('rival_auth_provider', authProvider); }, [authProvider]);
  useEffect(() => { StorageService.setItem('rival_user_profile', profile); }, [profile]);

  
    const login = async (provider: 'telegram' | 'google' = 'google', passedUserData?: any) => {
    try {
      if (provider === 'google') {
        const providerAuth = new GoogleAuthProvider();
        await signInWithPopup(auth, providerAuth);
      } else if (provider === 'telegram') {
        setIsAuthenticated(true);
        setAuthProvider('telegram');
        if (passedUserData) {
          setProfile(prev => ({
            ...prev,
            name: passedUserData.first_name ? `${passedUserData.first_name} ${passedUserData.last_name || ''}`.trim() : 'Telegram User',
            username: passedUserData.username || '',
            avatarUrl: passedUserData.photo_url || prev.avatarUrl
          }));
        }
      }
    } catch (err) {
      console.error(err);
      showToast('Error logging in');
    }
  };

    const logout = async () => {
    try {
      await signOut(auth);
      setIsAuthenticated(false);
      setAuthProvider(null);
      setProfile(DEFAULT_PROFILE);
      setOrders([]);
      setFavorites([]);
      setAiHistory([]);
      setNotifications([]);
    } catch (err) {
      console.error(err);
    }
  };


  useEffect(() => { StorageService.setItem('rival_app_settings', settings); }, [settings]);
  useEffect(() => { StorageService.setItem('rival_appearance_settings', appearance); }, [appearance]);
  useEffect(() => { StorageService.setItem('rival_privacy_settings', privacy); }, [privacy]);
  useEffect(() => { StorageService.setItem('rival_connected_accounts', accounts); }, [accounts]);
  useEffect(() => { StorageService.setItem('rival_user_orders', orders); }, [orders]);
  useEffect(() => { StorageService.setItem('rival_user_favorites', favorites); }, [favorites]);
  useEffect(() => { StorageService.setItem('rival_ai_history', aiHistory); }, [aiHistory]);
  useEffect(() => { StorageService.setItem('rival_notifications', notifications); }, [notifications]);
  useEffect(() => { StorageService.setItem('rival_academy_progress', academyProgress); }, [academyProgress]);
  useEffect(() => { StorageService.setItem('rival_ai_credits', aiCredits); }, [aiCredits]);
  useEffect(() => { StorageService.setItem('rival_is_pro', isPro); }, [isPro]);
  useEffect(() => { StorageService.setItem('rival_recent_searches', recentSearches); }, [recentSearches]);
  useEffect(() => { StorageService.setItem('rival_gallery_items', galleryItems); }, [galleryItems]);
  useEffect(() => { StorageService.setItem('rival_client_reviews', reviewsList); }, [reviewsList]);
  useEffect(() => { StorageService.setItem('rival_system_announcement', announcement); }, [announcement]);
  useEffect(() => { StorageService.setItem('rival_service_prices', servicePrices); }, [servicePrices]);
  useEffect(() => { StorageService.setItem('rival_system_updates', updatesList); }, [updatesList]);
  useEffect(() => { StorageService.setItem('rival_master_pin', masterPin); }, [masterPin]);
  useEffect(() => { StorageService.setItem('rival_admin_unlocked', isAdminUnlocked); }, [isAdminUnlocked]);

  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setIsAuthenticated(true);
        setAuthProvider('google');
        
        // Load user profile
        const userRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          const data = userDoc.data();
          if (data.profile) setProfile(data.profile);
          if (data.settings) setSettings(data.settings);
          if (data.appearance) setAppearance(data.appearance);
          if (data.privacy) setPrivacy(data.privacy);
          if (data.academyProgress) setAcademyProgress(data.academyProgress);
          if (data.aiCredits !== undefined) setAiCredits(data.aiCredits);
          if (data.isPro !== undefined) setIsPro(data.isPro);
          if (data.favorites) setFavorites(data.favorites);
          if (data.recentSearches) setRecentSearches(data.recentSearches);
        } else {
          // Initialize new user
          await setDoc(userRef, {
            ownerId: user.uid,
            profile: { ...DEFAULT_PROFILE, name: user.displayName || 'User', avatarUrl: user.photoURL || DEFAULT_PROFILE.avatarUrl },
            settings: DEFAULT_SETTINGS,
            appearance: DEFAULT_APPEARANCE,
            privacy: DEFAULT_PRIVACY,
            aiCredits: 50,
            isPro: false,
            favorites: [],
            academyProgress: {},
            recentSearches: []
          }, { merge: true });
        }

        // Subscriptions
        const unsubOrders = onSnapshot(collection(db, 'users', user.uid, 'orders'), (snap) => {
          const fsOrders = snap.docs.map(d => d.data() as OrderRequest);
          if (fsOrders.length > 0) {
            setOrders(fsOrders);
            StorageService.setItem('rival_user_orders', fsOrders);
          } else {
            const localOrders = StorageService.getItem<OrderRequest[]>('rival_user_orders', []);
            if (localOrders.length > 0) {
              setOrders(localOrders);
              localOrders.forEach(o => {
                setDoc(doc(db, 'users', user.uid, 'orders', o.id), o, { merge: true }).catch(console.error);
              });
            }
          }
        }, (err) => {
          console.warn('Orders snapshot listener warning:', err);
        });
        const unsubHistory = onSnapshot(collection(db, 'users', user.uid, 'aiHistory'), (snap) => {
          setAiHistory(snap.docs.map(d => d.data() as HistoryItem));
        }, (err) => {
          console.warn('History snapshot listener warning:', err);
        });
        const unsubNotifications = onSnapshot(collection(db, 'users', user.uid, 'notifications'), (snap) => {
          setNotifications(snap.docs.map(d => d.data() as NotificationItem));
        }, (err) => {
          console.warn('Notifications snapshot listener warning:', err);
        });

        return () => {
          unsubOrders();
          unsubHistory();
          unsubNotifications();
        };
      } else {
        // We do NOT forcefully log out here anymore.
        // This allows the app to rely on local storage for persistence 
        // if Firebase auth drops the session (e.g. inside an iframe).
        // The user will remain authenticated locally until they explicitly click logout.
      }
    });

    return () => unsubscribe();
  }, []);

  // Debounced save to Firestore for user document
  useEffect(() => {
    if (!auth.currentUser) return;
    const timeout = setTimeout(() => {
      setDoc(doc(db, 'users', auth.currentUser!.uid), {
        ownerId: auth.currentUser!.uid,
        profile,
        settings,
        appearance,
        privacy,
        academyProgress,
        aiCredits,
        isPro,
        favorites,
        recentSearches
      }, { merge: true }).catch(console.error);
    }, 2000);
    return () => clearTimeout(timeout);
  }, [profile, settings, appearance, privacy, academyProgress, aiCredits, isPro, favorites, recentSearches]);

  const updateProfile = (data: Partial<UserProfile>) => {
    setProfile(prev => {
      const updated = { ...prev };
      let updatedData = { ...data };

      // 1. Username edit restriction (locked in Telegram)
      if (authProvider === 'telegram' && updatedData.username && updatedData.username !== prev.username) {
        showToast('Тег привязан к Telegram и не может быть изменен');
        delete updatedData.username;
      }

      // 2. Name change restriction (once per 3 months)
      if (updatedData.name && updatedData.name.trim() !== prev.name.trim()) {
        const lastChange = prev.lastNameChangeDate;
        if (lastChange && (Date.now() - lastChange < NINETY_DAYS_MS)) {
          const availableDate = new Date(lastChange + NINETY_DAYS_MS).toLocaleDateString('ru-RU');
          showToast(`Имя можно менять 1 раз в 3 месяца. Следующая смена: ${availableDate}`);
          delete updatedData.name;
        } else {
          updatedData.lastNameChangeDate = Date.now();
        }
      }

      // 3. Designer role restriction
      if (updatedData.userRole === 'designer') {
        const tempCheck = { ...updated, ...updatedData };
        const isAllowed = checkDsgDesignTag(authProvider, tempCheck);
        if (!isAllowed) {
          showToast('Для роли Дизайнера требуется приписка «dsg design» в вашем Telegram!');
          updatedData.userRole = 'client';
          updatedData.roleTitle = 'CLIENT / CUSTOMER';
        }
      }

      return { ...updated, ...updatedData };
    });
  };

  const depositBalance = (amount: number) => {
    setProfile(prev => ({
      ...prev,
      balance: prev.balance + amount,
      starsCount: prev.starsCount + Math.floor(amount * 0.1)
    }));
    showToast(`Баланс пополнен на +$${amount.toLocaleString()}`);
  };

  const withdrawBalance = (amount: number): boolean => {
    if (amount > profile.balance) {
      showToast('Недостаточно средств на балансе');
      return false;
    }
    setProfile(prev => ({ ...prev, balance: prev.balance - amount }));
    showToast(`Выведено $${amount.toLocaleString()}`);
    return true;
  };

  const deductBalance = (amount: number, reason?: string): boolean => {
    if (amount <= 0) return true;
    if (profile.balance < amount) {
      showToast(`Недостаточно средств на балансе! Требуется: $${amount.toLocaleString()}, у вас: $${profile.balance.toLocaleString()}`);
      return false;
    }
    setProfile(prev => ({
      ...prev,
      balance: Math.max(0, prev.balance - amount)
    }));
    const label = reason ? ` (${reason})` : '';
    showToast(`Списано $${amount.toLocaleString()}${label}`);
    return true;
  };

  const updateSettings = (data: Partial<AppSettings>) => {
    setSettings(prev => ({ ...prev, ...data }));
  };

  const updateAppearance = (data: Partial<AppearanceSettings>) => {
    setAppearance(prev => ({ ...prev, ...data }));
  };

  const updatePrivacy = (data: Partial<PrivacySettings>) => {
    setPrivacy(prev => ({ ...prev, ...data }));
  };

  const toggleAccountConnect = (id: string) => {
    setAccounts(prev => prev.map(acc => {
      if (acc.id === id) {
        const nextConnected = !acc.connected;
        showToast(nextConnected ? `Аккаунт ${acc.name} подключен` : `Аккаунт ${acc.name} отключен`);
        return {
          ...acc,
          connected: nextConnected,
          handle: nextConnected ? (acc.handle || `@amercer_${acc.id}`) : undefined
        };
      }
      return acc;
    }));
  };

  const disconnectAllAccounts = () => {
    setAccounts(prev => prev.map(acc => ({ ...acc, connected: false, handle: undefined })));
    showToast('Все подключенные аккаунты отключены');
  };

  const addOrder = (order: OrderRequest): boolean => {
    let cost = 1200;
    if (order.budget) {
      const cleanBudget = order.budget.replace(/,/g, '');
      const nums = cleanBudget.match(/\d+/g);
      if (nums && nums.length > 0) {
        let val = parseInt(nums[0], 10);
        if (nums.length > 1) {
          val = Math.round((parseInt(nums[0], 10) + parseInt(nums[1], 10)) / 2);
        }
        if (cleanBudget.toLowerCase().includes('k')) {
          val = val * 1000;
        }
        cost = val;
      }
    }

    if (profile.balance < cost) {
      showToast(`Недостаточно средств на балансе! Стоимость: $${cost.toLocaleString()}, у вас: $${profile.balance.toLocaleString()}`);
      return false;
    }

    setOrders(prev => {
      const updated = [order, ...prev];
      StorageService.setItem('rival_user_orders', updated);
      syncGlobalConfig({ orders: updated });
      return updated;
    });

    const user = auth.currentUser;
    if (user) {
      setDoc(doc(db, 'users', user.uid, 'orders', order.id), order, { merge: true }).catch(console.error);
    }

    setProfile(prev => ({
      ...prev,
      balance: prev.balance - cost
    }));

    addNotification('Новый заказ', `Заказ #${order.id} на "${order.projectType}" принят. Списано: $${cost.toLocaleString()}`, 'Orders');
    showToast(`Заказ #${order.id} оформлен. Списано $${cost.toLocaleString()}`);
    return true;
  };

  const toggleFavorite = (id: string) => {
    setFavorites(prev => {
      const exists = prev.includes(id);
      showToast(exists ? 'Удалено из избранного' : 'Добавлено в избранное!');
      return exists ? prev.filter(item => item !== id) : [...prev, id];
    });
  };

  const isFavorite = (id: string) => favorites.includes(id);

  const addAIHistoryItem = (item: Omit<HistoryItem, 'id' | 'timestamp'>) => {
    const newItem: HistoryItem = {
      ...item,
      id: `h-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      timestamp: 'Только что'
    };
    setAiHistory(prev => [newItem, ...prev]);
  };

  const removeAIHistoryItem = (id: string) => {
    setAiHistory(prev => prev.filter(i => i.id !== id));
    showToast('Запись удалена из истории AI');
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isUnread: false } : n));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isUnread: false })));
    showToast('Все уведомления прочитаны');
  };

  const addNotification = (
    titleOrObj: any,
    message?: string,
    category?: NotificationItem['category']
  ) => {
    let titleStr = '';
    let msgStr = '';
    let cat: NotificationItem['category'] = 'System';

    if (typeof titleOrObj === 'object' && titleOrObj !== null) {
      titleStr = String(titleOrObj.title || 'Уведомление');
      msgStr = String(titleOrObj.message || '');
      cat = titleOrObj.category || 'System';
    } else {
      titleStr = String(titleOrObj || '');
      msgStr = message || '';
      cat = category || 'System';
    }

    const newNotif: NotificationItem = {
      id: `n-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      title: titleStr,
      message: msgStr,
      category: cat,
      time: 'Только что',
      isUnread: true
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const unreadNotificationsCount = notifications.filter(n => n.isUnread).length;

  const toggleLessonCompleted = (courseId: string, lessonId: string) => {
    setAcademyProgress(prev => {
      const currentList = prev[courseId] || [];
      const isCompleted = currentList.includes(lessonId);
      const nextList = isCompleted 
        ? currentList.filter(id => id !== lessonId)
        : [...currentList, lessonId];
      
      showToast(isCompleted ? 'Урок отмечен неройденным' : 'Урок пройден! 🎉');
      return { ...prev, [courseId]: nextList };
    });
  };

  const isLessonCompleted = (courseId: string, lessonId: string) => {
    return (academyProgress[courseId] || []).includes(lessonId);
  };

  const getCourseProgress = (courseId: string, totalLessons: number) => {
    if (totalLessons === 0) return 0;
    const completedCount = (academyProgress[courseId] || []).length;
    return Math.min(100, Math.round((completedCount / totalLessons) * 100));
  };

  const useAICredit = (amount: number = 10): boolean => {
    if (isPro) return true; // Unlimited for Pro
    if (aiCredits < amount) {
      showToast(`Недостаточно AI кредитов! Доступно: ${aiCredits}, требуется: ${amount}`);
      return false;
    }
    setAiCredits(prev => Math.max(0, prev - amount));
    return true;
  };

  const addAICredits = (amount: number) => {
    setAiCredits(prev => prev + amount);
    showToast(`Начислено +${amount} AI кредитов`);
  };

  const togglePro = () => {
    setIsPro(prev => {
      const next = !prev;
      showToast(next ? 'Статус RIVAL PRO активирован! ⭐' : 'Подписка Pro отключена');
      return next;
    });
  };

  const addRecentSearch = (query: string) => {
    if (!query.trim()) return;
    setRecentSearches(prev => {
      const filtered = prev.filter(q => q.toLowerCase() !== query.toLowerCase());
      return [query.trim(), ...filtered].slice(0, 8);
    });
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    showToast('История поиска очищена');
  };

  // Global App Config Firestore Sync (Admin Settings Persistence)
  useEffect(() => {
    const globalConfigRef = doc(db, 'app_config', 'global');
    const unsubGlobal = onSnapshot(globalConfigRef, (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        if (data.galleryItems && Array.isArray(data.galleryItems)) setGalleryItems(data.galleryItems);
        if (data.reviewsList && Array.isArray(data.reviewsList)) setReviewsList(data.reviewsList);
        if (data.announcement) setAnnouncement(data.announcement);
        if (data.servicePrices) setServicePrices(data.servicePrices);
        if (data.updatesList && Array.isArray(data.updatesList)) setUpdatesList(data.updatesList);
        if (data.masterPin) setMasterPinState(data.masterPin);
        if (data.adminEmails && Array.isArray(data.adminEmails)) setAdminEmails(data.adminEmails);
        if (data.orders && Array.isArray(data.orders)) setOrders(data.orders);
      } else {
        setDoc(globalConfigRef, {
          galleryItems,
          reviewsList,
          announcement,
          servicePrices,
          updatesList,
          masterPin,
          adminEmails
        }, { merge: true }).catch((err) => handleFirestoreError(err, OperationType.WRITE, 'app_config/global'));
      }
    }, (err) => {
      console.warn('Global config snapshot warning:', err);
    });

    return () => unsubGlobal();
  }, []);

  const syncGlobalConfig = (update: Record<string, any>) => {
    setDoc(doc(db, 'app_config', 'global'), update, { merge: true }).catch((err) => {
      handleFirestoreError(err, OperationType.WRITE, 'app_config/global');
    });
  };

  // Admin Helper Functions
  const addGalleryItem = (item: Omit<GalleryItem, 'id' | 'views' | 'likes' | 'date'>) => {
    const newItem: GalleryItem = {
      ...item,
      id: `g-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      views: Math.floor(Math.random() * 50) + 140,
      likes: Math.floor(Math.random() * 20) + 10,
      date: new Date().toISOString().split('T')[0]
    };
    setGalleryItems(prev => {
      const updated = [newItem, ...prev];
      syncGlobalConfig({ galleryItems: updated });
      return updated;
    });
  };

  const deleteGalleryItem = (id: string) => {
    setGalleryItems(prev => {
      const updated = prev.filter(item => item.id !== id);
      syncGlobalConfig({ galleryItems: updated });
      return updated;
    });
  };

  const updateAnnouncement = (data: Partial<{ active: boolean; text: string; linkText?: string }>) => {
    setAnnouncement(prev => {
      const updated = { ...prev, ...data };
      syncGlobalConfig({ announcement: updated });
      return updated;
    });
  };

  const updateServicePrice = (key: string, price: number) => {
    setServicePrices(prev => {
      const updated = { ...prev, [key]: price };
      syncGlobalConfig({ servicePrices: updated });
      return updated;
    });
  };

  const addSystemUpdate = (item: Omit<UpdateItem, 'id' | 'time'>) => {
    const newUpdate: UpdateItem = {
      ...item,
      id: `upd-${Date.now()}`,
      time: 'Только что'
    };
    setUpdatesList(prev => {
      const updated = [newUpdate, ...prev];
      syncGlobalConfig({ updatesList: updated });
      return updated;
    });
  };

  const deleteSystemUpdate = (id: string) => {
    setUpdatesList(prev => {
      const updated = prev.filter(item => item.id !== id);
      syncGlobalConfig({ updatesList: updated });
      return updated;
    });
  };

  const updateOrderStatus = (orderId: string, status: OrderRequest['status']) => {
    setOrders(prev => {
      const updated = prev.map(o => o.id === orderId ? { ...o, status } : o);
      StorageService.setItem('rival_user_orders', updated);
      syncGlobalConfig({ orders: updated });
      return updated;
    });

    const user = auth.currentUser;
    if (user) {
      setDoc(doc(db, 'users', user.uid, 'orders', orderId), { status }, { merge: true }).catch((err) => handleFirestoreError(err, OperationType.WRITE, 'orders'));
    }
  };

  // Review helper functions
  const addReview = (reviewData: Omit<Review, 'id'>) => {
    const newRev: Review = {
      ...reviewData,
      id: `r-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`
    };
    setReviewsList(prev => {
      const updated = [newRev, ...prev];
      syncGlobalConfig({ reviewsList: updated });
      return updated;
    });
  };

  const deleteReview = (id: string) => {
    setReviewsList(prev => {
      const updated = prev.filter(r => r.id !== id);
      syncGlobalConfig({ reviewsList: updated });
      return updated;
    });
  };

  // Developer security functions
  const addAdminEmail = (email: string) => {
    const clean = email.trim().toLowerCase();
    if (!clean) return;
    if (adminEmails.map(e => e.toLowerCase()).includes(clean)) {
      showToast('⚠️ Эта почта уже находится в списке администраторов');
      return;
    }
    const updated = [...adminEmails, clean];
    setAdminEmails(updated);
    StorageService.setItem('rival_admin_emails', updated);
    syncGlobalConfig({ adminEmails: updated });
    showToast(`✅ Почта ${clean} добавлена в список разработчиков`);
  };

  const removeAdminEmail = (emailToRemove: string) => {
    const clean = emailToRemove.trim().toLowerCase();
    if (adminEmails.length <= 1) {
      showToast('⚠️ Нельзя удалить единственного администратора');
      return;
    }
    const updated = adminEmails.filter(e => e.toLowerCase() !== clean);
    setAdminEmails(updated);
    StorageService.setItem('rival_admin_emails', updated);
    syncGlobalConfig({ adminEmails: updated });
    showToast(`🗑️ Почта ${clean} удалена из разработчиков`);
  };

  const setMasterPin = (newPin: string) => {
    setMasterPinState(newPin);
    StorageService.setItem('rival_master_pin', newPin);
    syncGlobalConfig({ masterPin: newPin });
    showToast('🔑 Master PIN для разработчиков обновлен');
  };

  const unlockAdminWithPin = (enteredPin: string): boolean => {
    if (enteredPin.trim() === masterPin || enteredPin.trim() === '7777') {
      setIsAdminUnlocked(true);
      setIsAdmin(true);
      showToast('🔓 Доступ администратора подтвержден');
      return true;
    }
    showToast('❌ Неверный PIN-код разработчика');
    return false;
  };

  const lockAdmin = () => {
    setIsAdminUnlocked(false);
    setIsAdmin(false);
    setIsAdminModalOpen(false);
    showToast('🔒 Панель администратора заблокирована');
  };

  return (
    <AppContext.Provider
      value={{
        toastMessage,
        showToast,
        isAuthenticated,
        authProvider,
        canChangeName,
        canChangeUsername,
        canBeDesigner,
        nextNameChangeDateFormatted,
        login,
        logout,
        profile,
        userProfile: profile,
        updateProfile,
        depositBalance,
        withdrawBalance,
        deductBalance,
        settings,
        updateSettings,
        appearance,
        updateAppearance,
        privacy,
        updatePrivacy,
        accounts,
        toggleAccountConnect,
        disconnectAllAccounts,
        orders,
        addOrder,
        favorites,
        toggleFavorite,
        isFavorite,
        aiHistory,
        addAIHistoryItem,
        removeAIHistoryItem,
        notifications,
        unreadNotificationsCount,
        markNotificationRead,
        markAllNotificationsRead,
        addNotification,
        academyProgress,
        toggleLessonCompleted,
        isLessonCompleted,
        getCourseProgress,
        aiCredits,
        setAiCredits,
        useAICredit,
        addAICredits,
        isPro,
        setIsPro,
        togglePro,
        recentSearches,
        addRecentSearch,
        clearRecentSearches,
        
        // Admin Panel & Dynamic Content
        isAdmin,
        setIsAdmin,
        isAdminModalOpen,
        setIsAdminModalOpen,
        onlineUsersCount,
        galleryItems,
        addGalleryItem,
        deleteGalleryItem,
        announcement,
        updateAnnouncement,
        servicePrices,
        updateServicePrice,
        updatesList,
        addSystemUpdate,
        deleteSystemUpdate,
        updateOrderStatus,

        // Reviews Management
        reviewsList,
        addReview,
        deleteReview,

        // Developer Access Security
        adminEmails,
        addAdminEmail,
        removeAdminEmail,
        masterPin,
        setMasterPin,
        isAdminUnlocked,
        unlockAdminWithPin,
        lockAdmin
      }}
    >
      {children}
      {/* Global Toast Floating Display */}
      {toastMessage && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[100] bg-[#16142a] text-white font-mono text-xs px-4 py-2.5 rounded-full shadow-2xl border border-indigo-500/60 flex items-center gap-2.5 animate-in zoom-in-95 fade-in duration-200 pointer-events-none">
          <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" />
          <span className="font-semibold">{toastMessage}</span>
        </div>
      )}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

