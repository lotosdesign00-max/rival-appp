import React from 'react';
import { 
  X, 
  ArrowRight, 
  AlertTriangle, 
  Lightbulb, 
  TrendingUp, 
  Clock, 
  UserPlus, 
  Star, 
  Code, 
  Layers, 
  Box, 
  Sparkles, 
  LayoutGrid,
  Search,
  User,
  ExternalLink
} from 'lucide-react';
import { CaseStudy } from '../types';

interface CaseDetailModalProps {
  caseStudy: CaseStudy | null;
  onClose: () => void;
  onOpenOrder: (projectTitle?: string) => void;
}

export const CaseDetailModal: React.FC<CaseDetailModalProps> = ({ 
  caseStudy, 
  onClose, 
  onOpenOrder 
}) => {
  if (!caseStudy) return null;

  // Defaults matching exact values from screenshot if not explicitly provided
  const client = caseStudy.client || 'Aether Labs';
  const industry = caseStudy.industry || 'DeFi & Web3';
  const timeline = caseStudy.timeline || '12 Weeks';
  const budget = caseStudy.budget || '$250k+';

  const challengeText = caseStudy.challenge || 
    "Aether Labs needed a comprehensive overhaul of their decentralized exchange interface. The existing platform was highly technical, alienating retail users while failing to provide institutional clients with the dense data arrays they required.";

  const solutionText = caseStudy.solution || 
    "We implemented a 'progressive disclosure' architecture, layering complexity so novice users experience a clean, Arc-browser inspired interface, while power users can unfurl dense, real-time analytics panels via precise micro-interactions.";

  const metrics = caseStudy.metrics || [
    { value: '340%', label: '↑ Engagement', type: 'up' },
    { value: '$42M', label: 'TVL Increase', type: 'neutral' },
    { value: '-45%', label: 'Bounce Rate', type: 'down' },
    { value: '85k+', label: '↑ Audience Growth', type: 'up' }
  ];

  const testimonial = caseStudy.testimonial || {
    quote: "Rival Space didn't just redesign our UI; they re-engineered how our users interact with decentralized finance. The precision in their execution and the atmospheric depth of the final product set a new standard in the Web3 space.",
    author: "Elena Rostova",
    role: "CEO, Aether Labs",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
  };

  const stackList = caseStudy.stack || ['Figma', 'React', 'Blender', 'After Effects', 'Web3.js'];

  const gallery = caseStudy.galleryImages && caseStudy.galleryImages.length >= 3 
    ? caseStudy.galleryImages 
    : [
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=600&q=80"
      ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl p-0 sm:p-4 overflow-y-auto">
      <div 
        className="w-full max-w-xl bg-[#09090e] border border-zinc-800/90 rounded-none sm:rounded-3xl overflow-hidden shadow-2xl text-zinc-100 min-h-screen sm:min-h-0 sm:max-h-[92vh] flex flex-col my-auto relative animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* TOP BRAND NAVIGATION HEADER (Exact like screenshot) */}
        <div className="sticky top-0 z-30 flex items-center justify-between px-4 py-3.5 bg-[#09090e]/95 backdrop-blur-md border-b border-zinc-900">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300">
              <User className="w-4 h-4" />
            </div>
            <span className="text-base font-bold tracking-tight text-white font-sans">
              Rival Space
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800/80 rounded-full transition-colors"
              aria-label="Close modal"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* SCROLLABLE MAIN BODY */}
        <div className="overflow-y-auto p-4 sm:p-6 space-y-6 pb-20 sm:pb-8 font-sans">
          
          {/* HERO BANNER CARD */}
          <div className="relative rounded-3xl overflow-hidden border border-zinc-800/90 bg-zinc-950 p-6 sm:p-8 space-y-3 shadow-2xl">
            {/* Background Image with Overlay */}
            <img
              src={caseStudy.image}
              alt={caseStudy.title}
              referrerPolicy="no-referrer"
              className="absolute inset-0 w-full h-full object-cover opacity-35 mix-blend-luminosity scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#09090e] via-[#09090e]/70 to-transparent" />

            {/* Badge */}
            <div className="relative z-10">
              <span className="px-3 py-1 rounded-full bg-indigo-950/80 border border-indigo-500/40 text-indigo-300 font-mono text-[10px] font-bold tracking-wider uppercase inline-flex items-center gap-1.5 shadow-sm">
                <Sparkles className="w-3 h-3 text-indigo-400" />
                {caseStudy.tag || 'FEATURED CASE'}
              </span>
            </div>

            {/* Case Title */}
            <h1 className="relative z-10 text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              {caseStudy.title}
            </h1>

            {/* Subtitle / Description */}
            <p className="relative z-10 text-xs sm:text-sm text-zinc-300 leading-relaxed max-w-lg">
              {caseStudy.description}
            </p>
          </div>

          {/* 4 METADATA CARDS (2x2 Grid) */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 rounded-2xl bg-[#0e0e16] border border-zinc-800/80 space-y-1">
              <span className="text-xs text-zinc-400 font-sans block">Client</span>
              <span className="text-sm sm:text-base font-bold text-white block truncate">{client}</span>
            </div>

            <div className="p-4 rounded-2xl bg-[#0e0e16] border border-zinc-800/80 space-y-1">
              <span className="text-xs text-zinc-400 font-sans block">Industry</span>
              <span className="text-sm sm:text-base font-bold text-white block truncate">{industry}</span>
            </div>

            <div className="p-4 rounded-2xl bg-[#0e0e16] border border-zinc-800/80 space-y-1">
              <span className="text-xs text-zinc-400 font-sans block">Timeline</span>
              <span className="text-sm sm:text-base font-bold text-white block truncate">{timeline}</span>
            </div>

            <div className="p-4 rounded-2xl bg-[#0e0e16] border border-zinc-800/80 space-y-1">
              <span className="text-xs text-zinc-400 font-sans block">Budget</span>
              <span className="text-sm sm:text-base font-bold text-white block truncate">{budget}</span>
            </div>
          </div>

          {/* THE CHALLENGE BLOCK */}
          <div className="p-5 rounded-3xl bg-[#0e0e16] border border-zinc-800/90 relative overflow-hidden space-y-2 border-l-4 border-l-indigo-500">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-indigo-400" />
              <h3 className="text-xs font-mono font-bold tracking-widest text-indigo-300 uppercase">
                THE CHALLENGE
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-sans">
              {challengeText}
            </p>
          </div>

          {/* THE SOLUTION BLOCK */}
          <div className="p-5 rounded-3xl bg-[#0e0e16] border border-zinc-800/90 space-y-2">
            <div className="flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-indigo-400" />
              <h3 className="text-xs font-mono font-bold tracking-widest text-indigo-300 uppercase">
                THE SOLUTION
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-sans">
              {solutionText}
            </p>
          </div>

          {/* VISUAL SHOWCASE MEDIA GALLERY */}
          <div className="space-y-3">
            {/* Top Main Image */}
            <div className="rounded-3xl overflow-hidden border border-zinc-800/90 bg-zinc-900 shadow-xl">
              <img
                src={gallery[0]}
                alt="Main Showcase"
                referrerPolicy="no-referrer"
                className="w-full aspect-[16/10] object-cover hover:scale-102 transition-transform duration-500"
              />
            </div>

            {/* Bottom 2 Side-by-Side Images */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl overflow-hidden border border-zinc-800/90 bg-zinc-900 shadow-md">
                <img
                  src={gallery[1]}
                  alt="Network Mesh"
                  referrerPolicy="no-referrer"
                  className="w-full aspect-[4/3] object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>

              <div className="rounded-2xl overflow-hidden border border-zinc-800/90 bg-zinc-900 shadow-md">
                <img
                  src={gallery[2]}
                  alt="Mobile Mockup"
                  referrerPolicy="no-referrer"
                  className="w-full aspect-[4/3] object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
          </div>

          {/* IMPACT METRICS SECTION (2x2 Grid) */}
          <div className="space-y-3 pt-2">
            <h3 className="text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-400">
              IMPACT
            </h3>

            <div className="grid grid-cols-2 gap-3">
              {metrics.map((m, idx) => (
                <div key={idx} className="p-5 rounded-3xl bg-[#0e0e16] border border-zinc-800/90 space-y-2 shadow-lg">
                  <div className="text-zinc-400">
                    {idx === 0 && <TrendingUp className="w-5 h-5 text-indigo-400" />}
                    {idx === 1 && <LayoutGrid className="w-5 h-5 text-indigo-400" />}
                    {idx === 2 && <Clock className="w-5 h-5 text-indigo-400" />}
                    {idx === 3 && <UserPlus className="w-5 h-5 text-indigo-400" />}
                  </div>
                  <div>
                    <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-sans">
                      {m.value}
                    </div>
                    <div className="text-xs text-zinc-400 font-medium mt-0.5">
                      {m.label}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* TESTIMONIAL CARD */}
          <div className="p-6 rounded-3xl bg-[#0e0e16] border border-zinc-800/90 relative overflow-hidden space-y-4 shadow-xl">
            {/* Watermark Quote Icon */}
            <div className="absolute right-4 bottom-2 text-7xl font-serif text-zinc-800/30 select-none pointer-events-none">
              ”
            </div>

            {/* Stars */}
            <div className="flex items-center gap-1.5 text-zinc-300">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-zinc-300 text-zinc-300" />
              ))}
            </div>

            {/* Quote Text */}
            <p className="text-xs sm:text-sm italic text-zinc-200 leading-relaxed font-sans relative z-10">
              "{testimonial.quote}"
            </p>

            {/* Author Info */}
            <div className="flex items-center gap-3 pt-2 border-t border-zinc-800/60 relative z-10">
              <img
                src={testimonial.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"}
                alt={testimonial.author}
                referrerPolicy="no-referrer"
                className="w-10 h-10 rounded-full object-cover border border-zinc-700"
              />
              <div>
                <h4 className="text-sm font-bold text-white">{testimonial.author}</h4>
                <p className="text-xs text-zinc-400">{testimonial.role}</p>
              </div>
            </div>
          </div>

          {/* STACK SECTION */}
          <div className="space-y-3 pt-2">
            <h3 className="text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-400">
              STACK
            </h3>

            <div className="flex flex-wrap items-center gap-2">
              {stackList.map((st, i) => (
                <span 
                  key={i}
                  className="px-3.5 py-2 rounded-full bg-[#0e0e16] border border-zinc-800/90 text-zinc-300 font-mono text-xs flex items-center gap-2"
                >
                  {st === 'Figma' && <Layers className="w-3.5 h-3.5 text-indigo-400" />}
                  {st === 'React' && <Code className="w-3.5 h-3.5 text-indigo-400" />}
                  {st === 'Blender' && <Box className="w-3.5 h-3.5 text-indigo-400" />}
                  {st === 'After Effects' && <Sparkles className="w-3.5 h-3.5 text-indigo-400" />}
                  {st === 'Web3.js' && <Box className="w-3.5 h-3.5 text-indigo-400" />}
                  {st}
                </span>
              ))}
            </div>
          </div>

          {/* PRIMARY CTA BUTTON */}
          <div className="pt-4 space-y-2 text-center">
            <button
              onClick={() => {
                onClose();
                onOpenOrder(caseStudy.title);
              }}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm sm:text-base shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2.5 transition-all active:scale-[0.98] group"
            >
              <span>Start Similar Project</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>

            <p className="text-[11px] font-mono text-zinc-400">
              Typical response time: 2–4 hours
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};
