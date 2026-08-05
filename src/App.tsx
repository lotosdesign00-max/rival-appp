import React, { useState, useEffect, Suspense, lazy, useCallback } from 'react';
import { NavTab, CaseStudy, OrderRequest, OrderDetailData } from './types';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { RivalSpaceLoader } from './components/RivalSpaceLoader';
import { AuthScreen } from './components/AuthScreen';
import { LanguageProvider, useTranslation } from './context/LanguageContext';
import { AppProvider, useApp } from './context/AppContext';
import { ChatService } from './services/ChatService';
import { motion, AnimatePresence } from 'motion/react';

// Lazy loaded screens for strong optimization
const HomeScreen = lazy(() => import('./components/HomeScreen').then(module => ({ default: module.HomeScreen })));
const GalleryScreen = lazy(() => import('./components/GalleryScreen').then(module => ({ default: module.GalleryScreen })));
const AcademyScreen = lazy(() => import('./components/AcademyScreen').then(module => ({ default: module.AcademyScreen })));
const ReviewsScreen = lazy(() => import('./components/ReviewsScreen').then(module => ({ default: module.ReviewsScreen })));
const AIAssistantScreen = lazy(() => import('./components/AIAssistantScreen').then(module => ({ default: module.AIAssistantScreen })));
const ExploreScreen = lazy(() => import('./components/ExploreScreen').then(module => ({ default: module.ExploreScreen })));
const SpaceScreen = lazy(() => import('./components/SpaceScreen').then(module => ({ default: module.SpaceScreen })));
const CaseArchiveScreen = lazy(() => import('./components/CaseArchiveScreen').then(module => ({ default: module.CaseArchiveScreen })));
const ProfileScreen = lazy(() => import('./components/ProfileScreen').then(module => ({ default: module.ProfileScreen })));

// Lazy loaded modals for strong optimization
const CaseDetailModal = lazy(() => import('./components/CaseDetailModal').then(module => ({ default: module.CaseDetailModal })));
const CreateOrderModal = lazy(() => import('./components/CreateOrderModal').then(module => ({ default: module.CreateOrderModal })));
const SearchModal = lazy(() => import('./components/SearchModal').then(module => ({ default: module.SearchModal })));
const OrderDetailModal = lazy(() => import('./components/OrderDetailModal').then(module => ({ default: module.OrderDetailModal })));
const MyOrdersModal = lazy(() => import('./components/MyOrdersModal').then(module => ({ default: module.MyOrdersModal })));
const NotificationsModal = lazy(() => import('./components/NotificationsModal').then(module => ({ default: module.NotificationsModal })));
const MessagesModal = lazy(() => import('./components/MessagesModal').then(module => ({ default: module.MessagesModal })));
const SettingsModal = lazy(() => import('./components/SettingsModal').then(module => ({ default: module.SettingsModal })));
const BillingModal = lazy(() => import('./components/BillingModal').then(module => ({ default: module.BillingModal })));
const ProModal = lazy(() => import('./components/ProModal').then(module => ({ default: module.ProModal })));
const SupportModal = lazy(() => import('./components/SupportModal').then(module => ({ default: module.SupportModal })));
const EditProfileModal = lazy(() => import('./components/EditProfileModal').then(module => ({ default: module.EditProfileModal })));
const EmailSecurityModal = lazy(() => import('./components/EmailSecurityModal').then(module => ({ default: module.EmailSecurityModal })));
const ConnectedAccountsModal = lazy(() => import('./components/ConnectedAccountsModal').then(module => ({ default: module.ConnectedAccountsModal })));
const AppearanceModal = lazy(() => import('./components/AppearanceModal').then(module => ({ default: module.AppearanceModal })));
const PrivacyModal = lazy(() => import('./components/PrivacyModal').then(module => ({ default: module.PrivacyModal })));
const LanguageModal = lazy(() => import('./components/LanguageModal').then(module => ({ default: module.LanguageModal })));
const AdminPanelModal = lazy(() => import('./components/AdminPanelModal').then(module => ({ default: module.AdminPanelModal })));

function AppContent() {
  const { language } = useTranslation();
  const { orders, addOrder, settings, unreadNotificationsCount, isAuthenticated, isAdmin, isAdminModalOpen, setIsAdminModalOpen } = useApp();
  const [isSplashLoading, setIsSplashLoading] = useState(() => {
    if (typeof window !== 'undefined') {
      const hasSeen = sessionStorage.getItem('rival_has_seen_splash');
      if (hasSeen) return false;
      return true;
    }
    return true;
  });

  useEffect(() => {
    if (!isSplashLoading) {
      sessionStorage.setItem('rival_has_seen_splash', 'true');
    }
  }, [isSplashLoading]);
  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [selectedCase, setSelectedCase] = useState<CaseStudy | null>(null);
  const [isCreateOrderOpen, setIsCreateOrderOpen] = useState(false);
  const [initialProjectTitle, setInitialProjectTitle] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const handleOpenMessagesWithChat = async (chatId?: string) => {
    let targetId = chatId;
    if (!targetId) {
      try {
        const chat = await ChatService.getOrCreateChat('support', undefined, {
          participantName: 'Rival Support',
          participantAvatar: 'https://cdn3d.iconscout.com/3d/premium/thumb/customer-service-4993855-4161747.png'
        });
        targetId = chat?.id;
      } catch (e) {
        console.error(e);
      }
    }
    setMessagesInitialChatId(targetId);
    setIsMessagesOpen(true);
  };

  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isMessagesOpen, setIsMessagesOpen] = useState(false);
  const [messagesInitialChatId, setMessagesInitialChatId] = useState<string | undefined>();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isBillingOpen, setIsBillingOpen] = useState(false);
  const [isProOpen, setIsProOpen] = useState(false);
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isEmailSecurityOpen, setIsEmailSecurityOpen] = useState(false);
  const [isConnectedAccountsOpen, setIsConnectedAccountsOpen] = useState(false);
  const [isAppearanceOpen, setIsAppearanceOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState<string>(() => {
    return localStorage.getItem('rival_space_lang') || 'ru';
  });

  // Order Detail & My Orders Modal State
  const [isOrderDetailOpen, setIsOrderDetailOpen] = useState(false);
  const [selectedOrderDetail, setSelectedOrderDetail] = useState<OrderDetailData | null>(null);
  const [isMyOrdersOpen, setIsMyOrdersOpen] = useState(false);

  // Initialize Telegram WebApp API safely
  useEffect(() => {
    const tg = (window as any).Telegram?.WebApp;
    if (tg) {
      try {
        tg.ready();
        tg.expand();
        if (typeof tg.enableClosingConfirmation === 'function') {
          tg.enableClosingConfirmation();
        }
        if (typeof tg.setHeaderColor === 'function') {
          tg.setHeaderColor('#07070a');
        }
        if (typeof tg.setBackgroundColor === 'function') {
          tg.setBackgroundColor('#07070a');
        }
      } catch (err) {
        console.warn('Telegram WebApp initialization notice:', err);
      }
    }
  }, []);

  const handleOpenCreateOrder = useCallback((projectTitle?: string) => {
    if (projectTitle) {
      setInitialProjectTitle(projectTitle);
    } else {
      setInitialProjectTitle('');
    }
    setIsCreateOrderOpen(true);
  }, []);

  const handleOrderSubmitted = useCallback((newOrder: OrderRequest) => {
    return addOrder(newOrder);
  }, [addOrder]);

  // If application is done loading splash loader but user is not authenticated, show AuthScreen
  if (!isSplashLoading && !isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#07070a] text-zinc-100 font-sans relative antialiased">
        <div className="relative z-10 w-full max-w-md mx-auto min-h-screen flex flex-col bg-[#060609] border-x border-zinc-900/60 shadow-2xl">
          <AuthScreen onOpenPrivacy={() => setIsPrivacyOpen(true)} />
        </div>
        <Suspense fallback={null}>
          {isPrivacyOpen && (
            <PrivacyModal onClose={() => setIsPrivacyOpen(false)} />
          )}
        </Suspense>
      </div>
    );
  }

  // Animation variants for screen transitions
  const screenVariants = {
    initial: { opacity: 0, y: 10, scale: 0.98 },
    animate: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] } },
    exit: { opacity: 0, scale: 0.98, transition: { duration: 0.2, ease: 'easeIn' } }
  };

  return (
    <div className="min-h-screen bg-[#07070a] text-zinc-100 font-sans relative antialiased selection:bg-indigo-500 selection:text-white">
      {/* Rival Space Digital OS Splash Loader Animation */}
      {isSplashLoading && (
        <RivalSpaceLoader onComplete={() => setIsSplashLoading(false)} />
      )}

      {/* Background Subtle Grid Pattern matching the screenshot */}
      {settings.gridBg && (
        <div 
          className="fixed inset-0 pointer-events-none opacity-40 z-0" 
          style={{
            backgroundImage: `linear-gradient(to right, rgba(255, 255, 255, 0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.04) 1px, transparent 1px)`,
            backgroundSize: '24px 24px'
          }}
        />
      )}

      {/* Main Container constrained to max-w-md matching Notifications & Settings screens */}
      <div className="relative z-10 w-full max-w-md mx-auto min-h-screen flex flex-col bg-[#08080c]/90 border-x border-zinc-900/60 shadow-2xl">
        {/* Sticky Top Navbar */}
        <Navbar
          onOpenSettings={() => setIsSettingsOpen(true)}
          onOpenNotifications={() => setIsNotificationsOpen(true)}
          onNavigateHome={() => setActiveTab('home')}
          onOpenSearch={() => setIsSearchOpen(true)}
          onOpenAdmin={() => setIsAdminModalOpen(true)}
          unreadNotificationsCount={unreadNotificationsCount}
        />

        {/* Dynamic Screen View Content with Telegram bottom safe area padding */}
        <main className="flex-1 relative px-3.5 sm:px-5 pt-2 pb-[calc(5.5rem+max(env(safe-area-inset-bottom,0px),var(--tg-safe-area-inset-bottom,0px)))]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              variants={screenVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="w-full h-full"
            >
              {activeTab === 'home' && (
                <Suspense fallback={<RivalSpaceLoader />}>
                  <HomeScreen
                    onNavigateTab={(tab) => setActiveTab(tab)}
                    onOpenCaseDetail={(cs) => setSelectedCase(cs)}
                    onOpenCreateOrder={() => handleOpenCreateOrder()}
                    onOpenMessages={handleOpenMessagesWithChat}
                  />
                </Suspense>
              )}

              {activeTab === 'gallery' && (
                <Suspense fallback={<RivalSpaceLoader />}>
                  <GalleryScreen
                    onOpenCreateOrder={(title) => handleOpenCreateOrder(title)}
                  />
                </Suspense>
              )}

              {activeTab === 'academy' && (
                <Suspense fallback={<RivalSpaceLoader />}>
                  <AcademyScreen onOpenMessages={handleOpenMessagesWithChat} />
                </Suspense>
              )}

              {activeTab === 'reviews' && (
                <Suspense fallback={<RivalSpaceLoader />}>
                  <ReviewsScreen />
                </Suspense>
              )}

              {activeTab === 'ai' && (
                <Suspense fallback={<RivalSpaceLoader />}>
                  <AIAssistantScreen
                    onOpenCreateOrder={(title) => handleOpenCreateOrder(title)}
                    onOpenPro={() => setIsProOpen(true)}
                  />
                </Suspense>
              )}

              {activeTab === 'explore' && (
                <Suspense fallback={<RivalSpaceLoader />}>
                  <ExploreScreen
                    onOpenCaseDetail={(cs) => setSelectedCase(cs)}
                    onOpenCreateOrder={(title) => handleOpenCreateOrder(title)}
                    onOpenPro={() => setIsProOpen(true)}
                  />
                </Suspense>
              )}

              {activeTab === 'space' && (
                <Suspense fallback={<RivalSpaceLoader />}>
                  <SpaceScreen
                    onOpenCreateOrder={() => handleOpenCreateOrder()}
                    onOpenArchive={() => setActiveTab('case_archive')}
                    onOpenMyOrders={() => setIsMyOrdersOpen(true)}
                    onOpenOrderDetail={(ordData) => {
                      if (ordData) {
                        setSelectedOrderDetail(ordData);
                      } else {
                        setSelectedOrderDetail(null);
                      }
                      setIsOrderDetailOpen(true);
                    }}
                    userOrders={orders}
                  />
                </Suspense>
              )}

              {activeTab === 'case_archive' && (
                <Suspense fallback={<RivalSpaceLoader />}>
                  <CaseArchiveScreen
                    onOpenCaseDetail={(cs) => setSelectedCase(cs)}
                    onOpenCreateOrder={(title) => handleOpenCreateOrder(title)}
                  />
                </Suspense>
              )}

              {activeTab === 'profile' && (
                <Suspense fallback={<RivalSpaceLoader />}>
                  <ProfileScreen
                    orders={orders}
                    onOpenCreateOrder={() => handleOpenCreateOrder()}
                    onOpenMyOrders={() => setIsMyOrdersOpen(true)}
                    onOpenPro={() => setIsProOpen(true)}
                    onOpenSupport={() => setIsSupportOpen(true)}
                    onOpenEditProfile={() => setIsEditProfileOpen(true)}
                    onOpenEmailSecurity={() => setIsEmailSecurityOpen(true)}
                    onOpenConnectedAccounts={() => setIsConnectedAccountsOpen(true)}
                    onOpenAppearance={() => setIsAppearanceOpen(true)}
                    onOpenPrivacy={() => setIsPrivacyOpen(true)}
                    onOpenOrderDetail={(ordData) => {
                      if (ordData) {
                        setSelectedOrderDetail(ordData);
                      } else {
                        setSelectedOrderDetail(null);
                      }
                      setIsOrderDetailOpen(true);
                    }}
                  />
                </Suspense>
              )}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Fixed Bottom Navigation Bar */}
        <BottomNav
          activeTab={activeTab}
          onTabChange={(tab) => setActiveTab(tab)}
          onOpenCreateOrder={() => handleOpenCreateOrder()}
        />
      </div>

      {/* Modals & Drawers */}
      <Suspense fallback={null}>
        {isMyOrdersOpen && (
          <MyOrdersModal
            onClose={() => setIsMyOrdersOpen(false)}
            onOpenCreateOrder={() => handleOpenCreateOrder()}
            onOpenOrderDetail={(ordData) => {
              if (ordData) {
                setSelectedOrderDetail(ordData);
              } else {
                setSelectedOrderDetail(null);
              }
              setIsOrderDetailOpen(true);
            }}
            userOrders={orders}
          />
        )}

        {/* Modals & Drawers */}
        <CaseDetailModal
          caseStudy={selectedCase}
          onClose={() => setSelectedCase(null)}
          onOpenOrder={(title) => handleOpenCreateOrder(title)}
        />

        {isOrderDetailOpen && (
          <OrderDetailModal
            order={selectedOrderDetail}
            onClose={() => setIsOrderDetailOpen(false)}
            onOpenMessages={(chatId) => {
              setIsOrderDetailOpen(false);
              handleOpenMessagesWithChat(chatId);
            }}
          />
        )}

        <CreateOrderModal
          isOpen={isCreateOrderOpen}
          onClose={() => setIsCreateOrderOpen(false)}
          initialProjectTitle={initialProjectTitle}
          onOrderSubmitted={handleOrderSubmitted}
        />

        <SearchModal
          isOpen={isSearchOpen}
          onClose={() => setIsSearchOpen(false)}
          onSelectCase={(cs) => setSelectedCase(cs)}
          onNavigateTab={(tab) => setActiveTab(tab)}
        />

        {isNotificationsOpen && (
          <NotificationsModal
            onClose={() => setIsNotificationsOpen(false)}
            onOpenMessages={(chatId) => {
              setIsNotificationsOpen(false);
              handleOpenMessagesWithChat(chatId);
            }}
          />
        )}

        {isMessagesOpen && (
          <MessagesModal
            initialChatId={messagesInitialChatId}
            onClose={() => {
              setIsMessagesOpen(false);
              setMessagesInitialChatId(undefined);
            }}
          />
        )}

        {isSettingsOpen && (
          <SettingsModal
            onClose={() => setIsSettingsOpen(false)}
            onOpenBilling={() => setIsBillingOpen(true)}
            onOpenPro={() => setIsProOpen(true)}
            onOpenSupport={() => setIsSupportOpen(true)}
            onOpenEditProfile={() => setIsEditProfileOpen(true)}
            onOpenEmailSecurity={() => setIsEmailSecurityOpen(true)}
            onOpenConnectedAccounts={() => setIsConnectedAccountsOpen(true)}
            onOpenAppearance={() => setIsAppearanceOpen(true)}
            onOpenPrivacy={() => setIsPrivacyOpen(true)}
            onOpenLanguage={() => setIsLanguageOpen(true)}
            onOpenNotifications={() => setIsNotificationsOpen(true)}
            currentLanguage={currentLanguage}
            onReplayLoader={() => setIsSplashLoading(true)}
          />
        )}

        {isBillingOpen && (
          <BillingModal
            onClose={() => setIsBillingOpen(false)}
            onOpenNotifications={() => setIsNotificationsOpen(true)}
            onOpenPro={() => setIsProOpen(true)}
          />
        )}

        {isProOpen && (
          <ProModal
            onClose={() => setIsProOpen(false)}
          />
        )}

        {isSupportOpen && (
          <SupportModal
            onClose={() => setIsSupportOpen(false)}
            onOpenNotifications={() => setIsNotificationsOpen(true)}
            onOpenMessages={handleOpenMessagesWithChat}
          />
        )}

        {isEditProfileOpen && (
          <EditProfileModal
            onClose={() => setIsEditProfileOpen(false)}
          />
        )}

        {isEmailSecurityOpen && (
          <EmailSecurityModal
            onClose={() => setIsEmailSecurityOpen(false)}
          />
        )}

        {isConnectedAccountsOpen && (
          <ConnectedAccountsModal
            onClose={() => setIsConnectedAccountsOpen(false)}
          />
        )}

        {isAppearanceOpen && (
          <AppearanceModal
            onClose={() => setIsAppearanceOpen(false)}
          />
        )}

        {isPrivacyOpen && (
          <PrivacyModal
            onClose={() => setIsPrivacyOpen(false)}
          />
        )}

        {isLanguageOpen && (
          <LanguageModal
            onClose={() => setIsLanguageOpen(false)}
            currentLanguage={currentLanguage}
            onSelectLanguage={(langCode) => setCurrentLanguage(langCode)}
          />
        )}

        {isAdminModalOpen && (
          <AdminPanelModal
            onClose={() => setIsAdminModalOpen(false)}
            onOpenMessages={handleOpenMessagesWithChat}
          />
        )}
      </Suspense>
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </LanguageProvider>
  );
}
