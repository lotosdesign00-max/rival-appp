import React, { useState, useEffect } from 'react';
import { Rocket, Send, User, Sparkles, ShieldCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { motion } from 'motion/react';
import { useTranslation } from "../context/LanguageContext";

interface AuthScreenProps {
  onLoginSuccess?: () => void;
  onOpenPrivacy?: () => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({
  onLoginSuccess,
  onOpenPrivacy
}) => {
    const { t } = useTranslation();
  const { login, showToast } = useApp();
  const [isLoggingIn, setIsLoggingIn] = useState<'telegram' | 'google' | null>(null);

  useEffect(() => {
    // Auto-login if we are inside Telegram Mini App
    const tgUser = (window as any).Telegram?.WebApp?.initDataUnsafe?.user;
    if (tgUser) {
      setIsLoggingIn('telegram');
      login('telegram', tgUser);
      setIsLoggingIn(null);
      if (onLoginSuccess) {
        onLoginSuccess();
      }
    }
  }, [login, onLoginSuccess]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      try {
        if (!event || !event.data || typeof event.data !== 'object') return;
        const data = event.data;
        if (data.type === 'OAUTH_AUTH_SUCCESS') {
          const userData = data.userData;
          login('google', userData);
          setIsLoggingIn(null);
          if (onLoginSuccess) {
            onLoginSuccess();
          }
        } else if (data.type === 'TG_AUTH_SUCCESS') {
          const userData = data.userData;
          login('telegram', userData);
          setIsLoggingIn(null);
          if (onLoginSuccess) {
            onLoginSuccess();
          }
        }
      } catch (e) {
        // Safe catch for cross-origin frame access restriction
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [login, onLoginSuccess]);

  const handleAuth = async (provider: 'telegram' | 'google') => {
    setIsLoggingIn(provider);
    
    if (provider === 'telegram') {
      const tgUser = (window as any).Telegram?.WebApp?.initDataUnsafe?.user;
      
      if (tgUser) {
        // We are inside Telegram Mini App, login immediately
        setTimeout(() => {
          login(provider, tgUser);
          setIsLoggingIn(null);
          if (onLoginSuccess) {
            onLoginSuccess();
          }
        }, 600);
      } else {
        // Outside Telegram, simulate Telegram Login Widget popup
        const authWindow = window.open(
          '',
          'telegram_oauth_popup',
          'width=400,height=500,menubar=no,toolbar=no,location=no,status=no'
        );
        
        if (authWindow) {
          authWindow.document.write(`
            <html>
              <head>
                <title>Telegram Login Simulation</title>
                <style>
                  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background: #fff; color: #000; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; margin: 0; }
                  button { background: #54A9EB; color: white; border: none; padding: 12px 24px; border-radius: 8px; font-size: 16px; font-weight: bold; cursor: pointer; }
                  button:hover { background: #4398d8; }
                </style>
              </head>
              <body>
                <h2>Log in with Telegram</h2>
                <p style="text-align: center; color: #666; margin-bottom: 24px; padding: 0 20px;">
                  This is a simulation.<br/>To use real Telegram login in a web browser, you need to provide a Telegram Bot username.
                </p>
                <button id="loginBtn">Log in as @test_user</button>
                <script>
                  document.getElementById('loginBtn').onclick = () => {
                    const mockUserData = {
                      id: Math.floor(Math.random() * 1000000),
                      first_name: 'Test',
                      last_name: 'User',
                      username: 'test_user',
                      photo_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'
                    };
                    if (window.opener) {
                      window.opener.postMessage({ 
                        type: 'TG_AUTH_SUCCESS', 
                        userData: mockUserData 
                      }, '*');
                      window.close();
                    }
                  };
                </script>
              </body>
            </html>
          `);
        } else {
          setIsLoggingIn(null);
          showToast(t('please_allow_login_pop_ups'));
        }

        const pollTimer = setInterval(() => {
          try {
            if (!authWindow || authWindow.closed) {
              clearInterval(pollTimer);
              setIsLoggingIn(null);
            }
          } catch (e) {
            clearInterval(pollTimer);
            setIsLoggingIn(null);
          }
        }, 500);
      }
    } else if (provider === 'google') {
      try {
        login('google');
        setIsLoggingIn(null);
        if (onLoginSuccess) {
          onLoginSuccess();
        }
      } catch (error) {
        console.error('Google OAuth error:', error);
        setIsLoggingIn(null);
        showToast(t('google_login_failed'));
      }
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-[#060609] text-white flex flex-col justify-between items-center px-5 py-8 relative overflow-hidden font-sans select-none selection:bg-indigo-500 selection:text-white"
    >
      {/* Dark Subtle Background Grid */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-40 z-0" 
        style={{
          backgroundImage: `linear-gradient(to right, rgba(255, 255, 255, 0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.04) 1px, transparent 1px)`,
          backgroundSize: '24px 24px'
        }}
      />

      {/* TOP BRAND SECTION */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.6 }}
        className="relative z-10 flex flex-col items-center pt-3 sm:pt-6"
      >
        {/* Top Rocket Container */}
        <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-zinc-900/90 border border-purple-500/30 shadow-[0_0_20px_rgba(168,85,247,0.2)] flex items-center justify-center text-white mb-3.5 backdrop-blur-md">
          <Rocket className="w-6 h-6 text-purple-200 -rotate-12" />
        </div>

        {/* Title */}
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-[0.18em] uppercase text-center font-sans">
          RIVAL SPACE
        </h1>

        {/* Subtitle */}
        <p className="text-[10px] sm:text-[11px] font-mono font-bold tracking-[0.35em] text-purple-400 uppercase text-center mt-1">
          DESIGN ECOSYSTEM
        </p>
      </motion.div>

      {/* CENTER HERO ARTWORK GRAPHIC MATCHING USER'S 3D PURPLE CRYSTAL PLANET IMAGE */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.8, type: 'spring', bounce: 0.4 }}
        className="relative z-10 my-auto py-4 flex items-center justify-center"
      >
        <div className="relative w-76 h-76 sm:w-88 sm:h-88 flex items-center justify-center group">
          
          {/* Subtle Circular Tech Accent Grid Ring blending smoothly into black space */}
          <div 
            className="absolute inset-0 rounded-full opacity-20 pointer-events-none transition-opacity duration-300 group-hover:opacity-30" 
            style={{
              backgroundImage: `radial-gradient(circle, rgba(168, 85, 247, 0.15) 0%, transparent 70%)`
            }}
          />

          {/* Ultra-Detailed SVG 3D Crystal Planet matching the reference render */}
          <svg className="w-72 h-72 sm:w-84 sm:h-84 relative z-10 drop-shadow-[0_0_25px_rgba(147,51,234,0.4)]" viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              {/* Facet Gradients for 3D Crystal Geodesic Sphere */}
              <linearGradient id="facetTopLeft" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.85" />
                <stop offset="35%" stopColor="#e9d5ff" />
                <stop offset="100%" stopColor="#9333ea" />
              </linearGradient>

              <linearGradient id="facetCenterGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f3e8ff" />
                <stop offset="50%" stopColor="#c084fc" />
                <stop offset="100%" stopColor="#6b21a8" />
              </linearGradient>

              <linearGradient id="facetDarkViolet" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#7e22ce" />
                <stop offset="70%" stopColor="#3b0764" />
                <stop offset="100%" stopColor="#1e1b4b" />
              </linearGradient>

              <linearGradient id="facetDeepShadow" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#581c87" />
                <stop offset="100%" stopColor="#090314" />
              </linearGradient>

              {/* Glowing Inner Core Sphere */}
              <radialGradient id="innerPurpleCore" cx="45%" cy="45%" r="55%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
                <stop offset="25%" stopColor="#f3e8ff" />
                <stop offset="55%" stopColor="#a855f7" />
                <stop offset="85%" stopColor="#6b21a8" />
                <stop offset="100%" stopColor="#2e1065" />
              </radialGradient>

              {/* Main Metallic Double Orbital Ring */}
              <linearGradient id="mainRingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f3e8ff" />
                <stop offset="20%" stopColor="#c084fc" />
                <stop offset="40%" stopColor="#2e1065" />
                <stop offset="65%" stopColor="#9333ea" />
                <stop offset="85%" stopColor="#312e81" />
                <stop offset="100%" stopColor="#e9d5ff" />
              </linearGradient>

              {/* Neon Blue/Purple Glass Shard Ring Gradient */}
              <linearGradient id="neonShardGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#818cf8" />
                <stop offset="50%" stopColor="#c084fc" />
                <stop offset="100%" stopColor="#e0e7ff" />
              </linearGradient>

              {/* Filters */}
              <filter id="neonPurpleGlow" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>

              <filter id="textGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* BACK ORBITAL FLOATING GLASS ARCS (SHARDS) */}
            <g opacity="0.8">
              {/* Upper Back Arc Segment 1 */}
              <path d="M 120 42 A 115 42 0 0 1 170 45" stroke="url(#neonShardGrad)" strokeWidth="5" strokeLinecap="round" opacity="0.65" transform="rotate(-26, 150, 150)" />
              {/* Upper Back Arc Segment 2 */}
              <path d="M 185 50 A 115 42 0 0 1 220 65" stroke="url(#mainRingGrad)" strokeWidth="6" strokeLinecap="round" opacity="0.75" transform="rotate(-26, 150, 150)" />
              {/* Left Back Arc */}
              <path d="M 45 110 A 115 42 0 0 1 65 80" stroke="url(#neonShardGrad)" strokeWidth="4" strokeLinecap="round" opacity="0.5" transform="rotate(-26, 150, 150)" />
            </g>

            {/* BACK HALF OF MAIN METALLIC RING */}
            <path 
              d="M 35 150 C 35 105, 265 105, 265 150" 
              stroke="url(#mainRingGrad)" 
              strokeWidth="9" 
              strokeLinecap="round" 
              opacity="0.7"
              transform="rotate(-26, 150, 150)"
            />
            {/* Inner Accent Line Back */}
            <path 
              d="M 42 150 C 42 112, 258 112, 258 150" 
              stroke="#c084fc" 
              strokeWidth="2" 
              opacity="0.8"
              transform="rotate(-26, 150, 150)"
            />

            {/* INNER GLOWING CORE SPHERE */}
            <circle cx="150" cy="150" r="72" fill="url(#innerPurpleCore)" />

            {/* 3D CRYSTAL GEODESIC ICOSAHEDRON FACETS */}
            <g stroke="#e9d5ff" strokeWidth="0.75" strokeOpacity="0.6">
              {/* Top Center Triangle (Specular Highlight) */}
              <polygon points="150,78 178,110 150,132" fill="url(#facetTopLeft)" />
              <polygon points="150,78 150,132 122,110" fill="url(#facetTopLeft)" />

              {/* Top Side Facets */}
              <polygon points="150,78 188,88 178,110" fill="url(#facetCenterGlow)" />
              <polygon points="150,78 112,88 122,110" fill="url(#facetTopLeft)" opacity="0.9" />

              {/* Middle Main Facing Triangles (Refractive Glass Core) */}
              <polygon points="150,132 178,110 202,142" fill="url(#facetCenterGlow)" />
              <polygon points="150,132 202,142 178,172" fill="url(#facetDarkViolet)" />
              <polygon points="150,132 178,172 150,186" fill="url(#facetCenterGlow)" />
              <polygon points="150,132 150,186 122,172" fill="url(#facetCenterGlow)" />
              <polygon points="150,132 122,172 98,142" fill="url(#facetDarkViolet)" />
              <polygon points="150,132 98,142 122,110" fill="url(#facetTopLeft)" />

              {/* Outer Edge Facets Right */}
              <polygon points="178,110 214,115 202,142" fill="url(#facetDarkViolet)" />
              <polygon points="202,142 222,148 178,172" fill="url(#facetDeepShadow)" />
              <polygon points="178,172 208,182 150,186" fill="url(#facetDeepShadow)" />

              {/* Outer Edge Facets Left */}
              <polygon points="122,110 86,115 98,142" fill="url(#facetDarkViolet)" />
              <polygon points="98,142 78,148 122,172" fill="url(#facetDeepShadow)" />
              <polygon points="122,172 92,182 150,186" fill="url(#facetDeepShadow)" />

              {/* Bottom Facets */}
              <polygon points="150,186 178,172 150,222" fill="url(#facetDeepShadow)" />
              <polygon points="150,186 122,172 150,222" fill="url(#facetDeepShadow)" />

              {/* Additional Inner Geometry Edge Lines */}
              <line x1="150" y1="78" x2="150" y2="186" stroke="#ffffff" strokeWidth="0.9" strokeOpacity="0.4" />
              <line x1="178" y1="110" x2="122" y2="172" stroke="#f3e8ff" strokeWidth="0.8" strokeOpacity="0.35" />
              <line x1="122" y1="110" x2="178" y2="172" stroke="#f3e8ff" strokeWidth="0.8" strokeOpacity="0.35" />
            </g>

            {/* BRIGHT SPECULAR GLOSS HIGHLIGHT OVERLAY */}
            <circle cx="150" cy="150" r="72" fill="url(#purpleGlossGrad)" />

            {/* FRONT HALF OF MAIN METALLIC ORBITAL RING */}
            <path 
              d="M 35 150 C 35 195, 265 195, 265 150" 
              stroke="url(#mainRingGrad)" 
              strokeWidth="11" 
              strokeLinecap="round"
              filter="url(#neonPurpleGlow)"
              transform="rotate(-26, 150, 150)"
            />

            {/* Inner Neon Blue/Purple Glow Core Line */}
            <path 
              d="M 40 150 C 40 191, 260 191, 260 150" 
              stroke="#e0e7ff" 
              strokeWidth="3" 
              strokeLinecap="round"
              opacity="0.95"
              transform="rotate(-26, 150, 150)"
            />

            {/* ENGRAVED GLOWING "RIVAL SPACE" TEXT ON THE RING */}
            <g transform="rotate(-26, 150, 150)">
              {/* Outer Text Glow Effect */}
              <text 
                x="165" 
                y="186" 
                fill="#ffffff" 
                fontSize="8.5" 
                fontFamily="monospace" 
                fontWeight="bold" 
                letterSpacing="4" 
                filter="url(#textGlow)"
              >
                RIVAL SPACE
              </text>
              {/* Crisp Foreground Cyan-Purple Text */}
              <text 
                x="165" 
                y="186" 
                fill="#e0e7ff" 
                fontSize="8.5" 
                fontFamily="monospace" 
                fontWeight="bold" 
                letterSpacing="4"
              >
                RIVAL SPACE
              </text>
            </g>

            {/* FRONT FLOATING GLASS ARCS (SHARDS) Orbiting Around */}
            <g transform="rotate(-26, 150, 150)">
              {/* Lower Right Outer Glass Bar 1 */}
              <path d="M 230 185 A 125 46 0 0 1 270 170" stroke="url(#neonShardGrad)" strokeWidth="6" strokeLinecap="round" filter="url(#textGlow)" opacity="0.9" />
              {/* Lower Right Outer Glass Bar 2 */}
              <path d="M 180 202 A 125 46 0 0 1 220 195" stroke="url(#mainRingGrad)" strokeWidth="7" strokeLinecap="round" opacity="0.85" />
              {/* Bottom Centered Arc */}
              <path d="M 100 200 A 125 46 0 0 1 150 205" stroke="url(#neonShardGrad)" strokeWidth="5" strokeLinecap="round" opacity="0.8" />
              {/* Upper Left Floating Shard 1 */}
              <path d="M 60 95 A 125 46 0 0 1 95 75" stroke="url(#neonShardGrad)" strokeWidth="6" strokeLinecap="round" opacity="0.85" />
              {/* Upper Left Floating Shard 2 */}
              <path d="M 110 68 A 125 46 0 0 1 135 64" stroke="url(#mainRingGrad)" strokeWidth="5" strokeLinecap="round" opacity="0.75" />
            </g>

            {/* Floating Sparkles & Light Nodes */}
            <circle cx="160" cy="85" r="2.5" fill="#ffffff" filter="url(#textGlow)" />
            <circle cx="215" cy="120" r="2" fill="#c084fc" />
            <circle cx="85" cy="180" r="2.5" fill="#818cf8" />
            <circle cx="240" cy="190" r="3" fill="#ffffff" filter="url(#textGlow)" />
          </svg>

        </div>
      </motion.div>

      {/* BOTTOM AUTH FORM SECTION */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="relative z-10 w-full max-w-sm mx-auto space-y-6 pb-2"
      >
        {/* Text Header */}
        <div className="text-center space-y-1.5">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Continue to Rival Space
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-xs mx-auto leading-relaxed font-sans">
            Sign in to synchronize your projects, AI history and profile.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3.5 pt-1">
          {/* Telegram Button */}
          <button
            onClick={() => handleAuth('telegram')}
            disabled={isLoggingIn !== null}
            className="w-full py-4 px-6 rounded-full bg-[#5b5bf0] hover:bg-[#4d4de8] active:scale-[0.98] text-white font-bold text-sm sm:text-base shadow-[0_0_28px_rgba(91,91,240,0.5)] flex items-center justify-center gap-3 transition-all duration-200 group relative overflow-hidden"
          >
            {isLoggingIn === 'telegram' ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Send className="w-5 h-5 text-white fill-white group-hover:translate-x-0.5 transition-transform shrink-0" />
                <span className="tracking-wide">Continue with Telegram</span>
              </>
            )}
          </button>

          {/* Google Button */}
          <button
            onClick={() => handleAuth('google')}
            disabled={isLoggingIn !== null}
            className="w-full py-4 px-6 rounded-full bg-[#0d0d14] hover:bg-[#141420] active:scale-[0.98] border border-zinc-800/90 text-white font-semibold text-sm sm:text-base flex items-center justify-center gap-3 transition-all duration-200 group shadow-lg"
          >
            {isLoggingIn === 'google' ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <User className="w-5 h-5 text-zinc-300 shrink-0" />
                <span className="tracking-wide">Continue with Google</span>
              </>
            )}
          </button>
        </div>

        {/* Footer Terms & Privacy */}
        <div className="pt-2 text-center">
          <p className="text-[11px] sm:text-xs text-zinc-400 max-w-xs mx-auto leading-normal">
            By continuing you agree to the{' '}
            <span 
              onClick={() => showToast(t('rival_space_terms_of_use'))}
              className="text-zinc-200 font-bold underline underline-offset-2 hover:text-white cursor-pointer transition-colors"
            >
              Terms of Service
            </span>{' '}
            and{' '}
            <span 
              onClick={() => {
                if (onOpenPrivacy) {
                  onOpenPrivacy();
                } else {
                  showToast(t('rival_space_privacy_policy'));
                }
              }}
              className="text-zinc-200 font-bold underline underline-offset-2 hover:text-white cursor-pointer transition-colors"
            >
              Privacy Policy
            </span>.
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};
