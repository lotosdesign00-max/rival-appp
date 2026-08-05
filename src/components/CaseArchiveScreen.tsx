import React, { useState, useMemo } from 'react';
import { 
  Search, 
  ArrowUpRight, 
  Star, 
  Box, 
  Gamepad2, 
  Sparkles, 
  Check, 
  Filter, 
  ExternalLink, 
  ChevronRight,
  ShieldCheck,
  TrendingUp,
  Layers,
  Award
} from 'lucide-react';
import { CaseStudy } from '../types';
import { motion } from 'motion/react';
import { useTranslation } from "../context/LanguageContext";

interface CaseArchiveScreenProps {
  onOpenCaseDetail: (cs: CaseStudy) => void;
  onOpenCreateOrder: (projectTitle?: string) => void;
}

interface ArchiveCaseItem {
  id: string;
  badge: 'FEATURED' | 'TOP RATED' | 'POPULAR' | 'NEW';
  watermark?: string;
  categoryLabel: string;
  categoryKey: 'crypto' | 'streamers' | 'branding' | 'web3' | '3d';
  title: string;
  description: string;
  cost: string;
  timeline: string;
  image: string;
  fullCaseStudy: CaseStudy;
}

export const CaseArchiveScreen: React.FC<CaseArchiveScreenProps> = React.memo(({
  onOpenCaseDetail,
  onOpenCreateOrder
}) => {
    const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'crypto' | 'streamers' | 'branding' | 'web3' | '3d'>('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const categories = useMemo(() => [
    { key: 'all', label: 'All' },
    { key: 'crypto', label: 'Crypto' },
    { key: 'streamers', label: 'Streamers' },
    { key: 'branding', label: 'Branding' },
    { key: 'web3', label: 'Web3' },
    { key: '3d', label: '3D & Motion' },
  ], []);

  // Cases matching the exact content in the user's screenshot
  const archiveCases: ArchiveCaseItem[] = useMemo(() => [
    {
      id: 'project-zenith',
      badge: 'FEATURED',
      watermark: 'Case Details | Rival Space',
      categoryLabel: 'DEFI & WEB3',
      categoryKey: 'web3',
      title: 'Project Zenith',
      description: 'A revolutionary Web3 ecosystem designed for seamless digital asset management and decentralized governance.',
      cost: '$250k+',
      timeline: '12 Weeks',
      image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
      fullCaseStudy: {
        id: 'project-zenith',
        title: 'Project Zenith',
        subtitle: 'Revolutionary Web3 Ecosystem & DEX Interface',
        description: 'A revolutionary Web3 ecosystem designed for seamless digital asset management and decentralized governance.',
        tag: 'FEATURED CASE',
        image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
        category: 'spatial_ui',
        date: '2026-08-01',
        views: 24500,
        likes: 3820,
        client: 'Aether Labs',
        industry: 'DeFi & Web3',
        timeline: '12 Weeks',
        budget: '$250k+',
        challenge: 'Aether Labs needed a comprehensive overhaul of their decentralized exchange interface. The existing platform was highly technical, alienating retail users while failing to provide institutional clients with the dense data arrays they required.',
        solution: 'We implemented a \'progressive disclosure\' architecture, layering complexity so novice users experience a clean, Arc-browser inspired interface, while power users can unfurl dense, real-time analytics panels via precise micro-interactions.',
        metrics: [
          { value: '340%', label: '↑ Engagement', type: 'up' },
          { value: '$42M', label: 'TVL Increase', type: 'neutral' },
          { value: '-45%', label: 'Bounce Rate', type: 'down' },
          { value: '85k+', label: '↑ Audience Growth', type: 'up' }
        ],
        testimonial: {
          quote: 'Rival Space didn\'t just redesign our UI; they re-engineered how our users interact with decentralized finance. The precision in their execution and the atmospheric depth of the final product set a new standard in the Web3 space.',
          author: 'Elena Rostova',
          role: 'CEO, Aether Labs',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
        },
        stack: ['Figma', 'React', 'Blender', 'After Effects', 'Web3.js'],
        galleryImages: [
          'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1000&q=80',
          'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=600&q=80',
          'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=600&q=80'
        ],
        specs: {
          renderer: 'Unreal Engine 5.4 + WebGPU',
          lighting: 'Ray Traced Lumen',
          polygonCount: '4.2M polys',
          resolution: '8K Native EXR'
        },
        detailsText: 'Project Zenith combines high-performance WebGPU rendering with millisecond live Web3 RPC data feeds for next-generation asset management.'
      }
    },
    {
      id: 'nexus-v2',
      badge: 'TOP RATED',
      watermark: 'Case Archive | Rival Space',
      categoryLabel: 'WEB3 PLATFORM',
      categoryKey: 'web3',
      title: 'Nexus Exchange V2',
      description: 'Complete structural redesign increasing daily trading volume by 24% through streamlined user flows and advanced charting integration.',
      cost: '$12,500+',
      timeline: '4 Weeks',
      image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=800&q=80',
      fullCaseStudy: {
        id: 'nexus-v2',
        title: 'Nexus Exchange V2',
        subtitle: 'High-frequency Web3 Trading Ecosystem',
        description: 'Complete structural redesign increasing daily trading volume by 24% through streamlined user flows and advanced charting integration.',
        tag: 'WEB3 PLATFORM',
        image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=800&q=80',
        category: 'spatial_ui',
        date: '2026-07-28',
        views: 14200,
        likes: 1890,
        client: 'Nexus Protocol',
        industry: 'FinTech & Web3',
        timeline: '4 Weeks',
        budget: '$12,500+',
        challenge: 'Nexus Exchange needed to reduce user onboarding friction while maintaining real-time orderbook synchronization for high-frequency traders.',
        solution: 'Custom modular dashboard layout with drag-and-drop analytics panels and instant Web3 wallet authentication.',
        metrics: [
          { value: '+24%', label: '↑ Daily Volume', type: 'up' },
          { value: '1.2s', label: 'Avg Latency', type: 'neutral' },
          { value: '99.9%', label: 'Uptime', type: 'up' },
          { value: '120k', label: 'Active Traders', type: 'up' }
        ],
        testimonial: {
          quote: 'Working with Rival Space was seamless. The interface performance and design quality exceeded all our expectations.',
          author: 'Marcus Vance',
          role: 'CTO, Nexus Protocol',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'
        },
        stack: ['Figma', 'React', 'Tailwind', 'Ethers.js'],
        galleryImages: [
          'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1000&q=80',
          'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80'
        ],
        specs: {
          renderer: 'Three.js / WebGL 2.0',
          lighting: 'Neon Volumetric Shading',
          polygonCount: '1.5M polys',
          resolution: '4K Ultra HD'
        },
        detailsText: 'Nexus Exchange V2 represents a major leap in high-frequency decentralized trading interfaces.'
      }
    },
    {
      id: 'project-obsidian',
      badge: 'POPULAR',
      watermark: 'Case Archive | Rival Space',
      categoryLabel: 'CREATOR HUB',
      categoryKey: 'streamers',
      title: 'Project Obsidian',
      description: 'A bespoke, unified dashboard for a tier-1 streamer, consolidating analytics, community management, and monetization streams into a single interface.',
      cost: '$8,200+',
      timeline: '3 Weeks',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
      fullCaseStudy: {
        id: 'project-obsidian',
        title: 'Project Obsidian',
        subtitle: 'Tier-1 Creator Control Center',
        description: 'A bespoke, unified dashboard for a tier-1 streamer, consolidating analytics, community management, and monetization streams into a single interface.',
        tag: 'CREATOR HUB',
        image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
        category: 'interior',
        date: '2026-07-15',
        views: 9800,
        likes: 1240,
        client: 'Obsidian Media',
        industry: 'Streaming & Gaming',
        timeline: '3 Weeks',
        budget: '$8,200+',
        challenge: 'Managing multiple social platforms, chat streams, and sponsorships simultaneously caused cognitive overload during live broadcasts.',
        solution: 'Created an all-in-one broadcast telemetry hub featuring real-time stream overlays, twitch integration, and revenue widgets.',
        metrics: [
          { value: '500k+', label: 'Live Viewers', type: 'up' },
          { value: '+40%', label: 'Sub Retention', type: 'up' },
          { value: '0.1s', label: 'Alert Delay', type: 'neutral' },
          { value: '5/5', label: 'Creator Rating', type: 'up' }
        ],
        testimonial: {
          quote: 'The Obsidian dashboard changed how I stream. Everything I need is right at my fingertips with zero lag.',
          author: 'Alex River',
          role: 'Pro Streamer & Creator',
          avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80'
        },
        stack: ['Figma', 'React', 'OBS Studio', 'Blender'],
        galleryImages: [
          'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=600&q=80'
        ],
        specs: {
          renderer: 'Octane Render 2026',
          lighting: 'HDRI Architectural Studio',
          polygonCount: '2.8M polys',
          resolution: '4K ProRes 4444'
        },
        detailsText: 'Project Obsidian blends physical architectural aesthetics with digital streaming overlays.'
      }
    }
  ], []);

  // Filtered cases
  const filteredCases = useMemo(() => archiveCases.filter(c => {
    const matchesFilter = selectedFilter === 'all' || c.categoryKey === selectedFilter;
    const matchesSearch = c.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          c.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          c.categoryLabel.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  }), [archiveCases, selectedFilter, searchTerm]);

  // Recent archivals section items matching exact screenshot
  const recentArchivals = useMemo(() => [
    {
      id: 'solana-dex-ui',
      icon: Box,
      title: 'Solana DEX UI',
      description: 'High-frequency trading interface.',
      badge: 'NEW',
      badgeColor: 'text-indigo-400 border-indigo-500/40 bg-indigo-950/60'
    },
    {
      id: 'esports-rebrand',
      icon: Gamepad2,
      title: 'Esports Team Rebrand',
      description: 'Full identity and motion package.',
      badge: '2W AGO',
      badgeColor: 'text-zinc-400 border-zinc-800 bg-zinc-900'
    }
  ], []);

  return (
    <div
      className="space-y-6 pb-24 font-sans animate-in fade-in duration-300"
    >
      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-indigo-600 text-white font-mono text-xs px-4 py-2 rounded-full shadow-2xl border border-indigo-400 flex items-center gap-2 animate-bounce">
          <Sparkles className="w-4 h-4 text-yellow-300" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* HEADER TITLE & SUBTITLE (Centered as per screenshot) */}
      <div className="text-center space-y-2 pt-2 max-w-lg mx-auto px-2">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-sans">
          Case Archive
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
          Performance by Design. Exploring the architecture of digital success through our most impactful projects.
        </p>
      </div>

      {/* SEARCH INPUT BAR */}
      <div className="relative">
        <Search className="w-4 h-4 text-zinc-500 absolute left-4 top-3.5 pointer-events-none" />
        <input
          type="text"
          placeholder="Search archive..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-[#0c0c14] border border-zinc-800/90 rounded-2xl pl-11 pr-4 py-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500/70 transition-all shadow-inner"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="absolute right-3.5 top-3 text-xs text-zinc-500 hover:text-white font-mono"
          >
            Clear
          </button>
        )}
      </div>

      {/* HORIZONTAL CATEGORY FILTER PILLS */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        {categories.map((cat) => {
          const isSelected = selectedFilter === cat.key;
          return (
            <button
              key={cat.key}
              onClick={() => setSelectedFilter(cat.key as any)}
              className={`px-4 py-2 rounded-full text-xs font-mono font-medium transition-all shrink-0 active:scale-95 ${
                isSelected
                  ? 'bg-[#14142b] text-white border border-indigo-500/70 shadow-[0_0_12px_rgba(99,102,241,0.3)]'
                  : 'bg-[#0c0c14] text-zinc-400 border border-zinc-800/80 hover:border-zinc-700 hover:text-zinc-200'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* CASE STUDY CARDS LIST */}
      <div className="space-y-6">
        {filteredCases.length === 0 ? (
          <div className="p-8 text-center rounded-3xl bg-[#0c0c14] border border-zinc-800 space-y-2">
            <Filter className="w-8 h-8 text-zinc-600 mx-auto" />
            <p className="text-sm font-semibold text-white">{t('nothing_found')}</p>
            <p className="text-xs text-zinc-400">{t('try_changing_your_search_query')}</p>
          </div>
        ) : (
          filteredCases.map((item) => (
            <div
              key={item.id}
              onClick={() => onOpenCaseDetail(item.fullCaseStudy)}
              className="rounded-3xl bg-[#0c0c14] border border-zinc-800/90 overflow-hidden shadow-2xl hover:border-indigo-500/50 transition-all group cursor-pointer"
            >
              {/* Image Preview Container */}
              <div className="relative h-56 sm:h-64 w-full overflow-hidden bg-zinc-900">
                <img
                  src={item.image}
                  alt={item.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                
                {/* Subtle Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c14] via-transparent to-black/40" />

                {/* Top Overlay Badge & Watermark */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white font-mono text-[10px] font-bold flex items-center gap-1">
                    <Star className="w-3 h-3 text-amber-400 fill-amber-400/30" />
                    <span>{item.badge}</span>
                  </span>

                  <span className="text-[9px] font-mono text-zinc-300 opacity-80 tracking-widest hidden sm:inline-block">
                    {item.watermark || 'Case Archive | Rival Space'}
                  </span>
                </div>
              </div>

              {/* Card Body Content */}
              <div className="p-5 space-y-3">
                {/* Subtitle Category Label & Arrow Icon */}
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-indigo-400 uppercase tracking-wider">
                    {item.categoryLabel}
                  </span>

                  <div className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300 group-hover:text-white group-hover:bg-indigo-600 group-hover:border-indigo-500 transition-all">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>

                {/* Case Title */}
                <h2 className="text-xl font-extrabold text-white tracking-tight group-hover:text-indigo-300 transition-colors">
                  {item.title}
                </h2>

                {/* Case Description */}
                <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                  {item.description}
                </p>

                {/* Divider Line */}
                <div className="border-t border-zinc-800/80 pt-3 flex items-center gap-2">
                  <span className="px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800/90 text-zinc-300 font-mono text-[11px]">
                    Cost: {item.cost}
                  </span>
                  <span className="px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800/90 text-zinc-300 font-mono text-[11px]">
                    Timeline: {item.timeline}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* AGGREGATE METRICS SECTION (2x2 Grid from screenshot) */}
      <div className="space-y-3 pt-2">
        <h3 className="text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-400">
          AGGREGATE METRICS
        </h3>

        <div className="grid grid-cols-2 gap-3">
          {/* Card 1 */}
          <div className="p-5 rounded-3xl bg-[#0c0c14] border border-zinc-800/90 text-center space-y-1 shadow-lg">
            <div className="text-3xl font-extrabold text-white tracking-tight font-sans">
              142
            </div>
            <div className="text-xs text-zinc-400 font-medium">
              Projects Shipped
            </div>
          </div>

          {/* Card 2 */}
          <div className="p-5 rounded-3xl bg-[#0c0c14] border border-zinc-800/90 text-center space-y-1 shadow-lg">
            <div className="text-3xl font-extrabold text-white tracking-tight font-sans">
              4.9
            </div>
            <div className="text-xs text-zinc-400 font-medium">
              Client Rating
            </div>
          </div>

          {/* Card 3 */}
          <div className="p-5 rounded-3xl bg-[#0c0c14] border border-zinc-800/90 text-center space-y-1 shadow-lg">
            <div className="text-3xl font-extrabold text-white tracking-tight font-sans">
              86%
            </div>
            <div className="text-xs text-zinc-400 font-medium">
              Repeat Clients
            </div>
          </div>

          {/* Card 4 */}
          <div className="p-5 rounded-3xl bg-[#0c0c14] border border-zinc-800/90 text-center space-y-1 shadow-lg">
            <div className="text-3xl font-extrabold text-white tracking-tight font-sans">
              $12M+
            </div>
            <div className="text-xs text-zinc-400 font-medium">
              Client Rev Gen
            </div>
          </div>
        </div>
      </div>

      {/* RECENT ARCHIVALS SECTION */}
      <div className="space-y-3 pt-2">
        <h3 className="text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-400">
          RECENT ARCHIVALS
        </h3>

        <div className="space-y-2.5">
          {recentArchivals.map((arch) => {
            const IconComp = arch.icon;
            return (
              <div
                key={arch.id}
                onClick={() => {
                  onOpenCreateOrder(arch.title);
                  showToast(`Создание заказа на основе ${arch.title}`);
                }}
                className="p-3.5 rounded-2xl bg-[#0c0c14] border border-zinc-800/90 hover:border-zinc-700 transition-all flex items-center justify-between cursor-pointer group shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300 group-hover:text-indigo-400 group-hover:border-indigo-500/40 transition-colors shrink-0">
                    <IconComp className="w-5 h-5" />
                  </div>
                  <div className="space-y-0.5">
                    <h4 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">
                      {arch.title}
                    </h4>
                    <p className="text-xs text-zinc-400">
                      {arch.description}
                    </p>
                  </div>
                </div>

                <span className={`px-2.5 py-1 rounded-md border font-mono text-[10px] font-bold ${arch.badgeColor}`}>
                  {arch.badge}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
});
