import React, { useState, useMemo } from 'react';
import { 
  ArrowLeft, 
  History, 
  Sparkles, 
  Wand2, 
  RefreshCw, 
  Download, 
  Check, 
  Copy, 
  Loader2, 
  X,
  Layers,
  ZoomIn,
  FileJson,
  FileText,
  Eye,
  Sliders
} from 'lucide-react';
import { AIHistoryModal } from './AIHistoryModal';
import { useApp } from '../context/AppContext';
import { useTranslation } from "../context/LanguageContext";
import { exportAsJSON, exportAsFormattedDoc, exportAsSVG } from '../utils/exportUtils';

interface LogoGeneratorModalProps {
  onClose: () => void;
  onOpenCreateOrder?: (title?: string) => void;
}

interface LogoConcept {
  id: string;
  title: string;
  style: string;
  image: string;
  svgMarkup?: string;
}

export const LogoGeneratorModal: React.FC<LogoGeneratorModalProps> = ({
  onClose,
  onOpenCreateOrder
}) => {
    const { t } = useTranslation();
  const { addAIHistoryItem, useAICredit, showToast } = useApp();

  const [brandName, setBrandName] = useState('');
  const [industry, setIndustry] = useState('');
  const [shortDescription, setShortDescription] = useState('');

  const [selectedStyle, setSelectedStyle] = useState('Minimal');
  const [selectedColorStyle, setSelectedColorStyle] = useState('AI Choice');

  const [isLoading, setIsLoading] = useState(false);
  const [selectedConceptId, setSelectedConceptId] = useState<string>('c1');
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(false);

  const logoStyles = ['Minimal', 'Tech', 'Cyberpunk', 'Luxury', 'Monogram', 'Geometric'];

  const colorStyles = [
    { id: 'AI Choice', label: 'AI Choice', icon: true, primary: '#6366f1', secondary: '#8b5cf6' },
    { id: 'Dark', label: 'Dark', dotColor: 'bg-zinc-800 border-zinc-600', primary: '#f4f4f5', secondary: '#a1a1aa' },
    { id: 'Blue', label: 'Blue', dotColor: 'bg-blue-500', primary: '#3b82f6', secondary: '#06b6d4' },
    { id: 'Gold', label: 'Gold', dotColor: 'bg-amber-500', primary: '#eab308', secondary: '#d4af37' }
  ];

  // Live SVG Generator function
  const createSVGMarkup = (brand: string, style: string, color: string, variant = 0) => {
    const cleanBrand = brand.trim() || 'Rival Space';
    const initial = (cleanBrand[0] || 'R').toUpperCase();
    const secondInitial = cleanBrand.split(' ')[1]?.[0]?.toUpperCase() || cleanBrand[1]?.toUpperCase() || 'S';
    
    let color1 = '#6366f1';
    let color2 = '#8b5cf6';
    if (color === 'Dark') { color1 = '#e4e4e7'; color2 = '#71717a'; }
    if (color === 'Blue') { color1 = '#3b82f6'; color2 = '#06b6d4'; }
    if (color === 'Gold') { color1 = '#f59e0b'; color2 = '#d4af37'; }

    if (variant === 1) { const tmp = color1; color1 = color2; color2 = tmp; }

    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
      <defs>
        <linearGradient id="logoGrad-${variant}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${color1}" />
          <stop offset="100%" stop-color="${color2}" />
        </linearGradient>
        <radialGradient id="glowGrad-${variant}" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="${color1}" stop-opacity="0.25" />
          <stop offset="100%" stop-color="#050508" stop-opacity="0" />
        </radialGradient>
      </defs>
      <rect width="400" height="400" fill="#07070c" rx="40" />
      <circle cx="200" cy="200" r="150" fill="url(#glowGrad-${variant})" />
      ${
        style === 'Minimal' ? `
          <circle cx="200" cy="200" r="90" fill="none" stroke="url(#logoGrad-${variant})" stroke-width="8" />
          <text x="200" y="225" font-family="'Plus Jakarta Sans', sans-serif" font-weight="800" font-size="76" fill="#ffffff" text-anchor="middle">${initial}</text>
        ` : style === 'Cyberpunk' ? `
          <polygon points="200,80 300,140 300,260 200,320 100,260 100,140" fill="none" stroke="url(#logoGrad-${variant})" stroke-width="6" />
          <polygon points="200,110 270,155 270,245 200,290 130,245 130,155" fill="none" stroke="${color2}" stroke-width="2" stroke-dasharray="4 4" />
          <text x="200" y="220" font-family="'JetBrains Mono', monospace" font-weight="900" font-size="64" fill="#ffffff" text-anchor="middle">${initial}${secondInitial}</text>
        ` : style === 'Luxury' ? `
          <rect x="110" y="110" width="180" height="180" rx="20" transform="rotate(45 200 200)" fill="none" stroke="url(#logoGrad-${variant})" stroke-width="4" />
          <circle cx="200" cy="200" r="70" fill="none" stroke="${color1}" stroke-width="2" />
          <text x="200" y="225" font-family="'Playfair Display', serif" font-weight="700" font-size="70" fill="#ffffff" text-anchor="middle">${initial}</text>
        ` : style === 'Geometric' ? `
          <g transform="translate(200,200)">
            <rect x="-60" y="-60" width="120" height="120" rx="16" fill="url(#logoGrad-${variant})" opacity="0.8" />
            <rect x="-40" y="-40" width="120" height="120" rx="16" fill="none" stroke="#ffffff" stroke-width="4" />
          </g>
          <text x="200" y="220" font-family="'Plus Jakarta Sans', sans-serif" font-weight="800" font-size="54" fill="#ffffff" text-anchor="middle">${initial}</text>
        ` : `
          <circle cx="200" cy="200" r="100" fill="none" stroke="url(#logoGrad-${variant})" stroke-width="12" stroke-linecap="round" stroke-dasharray="400 100" />
          <text x="200" y="228" font-family="'Plus Jakarta Sans', sans-serif" font-weight="900" font-size="82" fill="#ffffff" text-anchor="middle">${initial}</text>
        `
      }
      <text x="200" y="340" font-family="'Plus Jakarta Sans', sans-serif" font-weight="700" font-size="18" fill="#a1a1aa" text-anchor="middle" letter-spacing="4">${cleanBrand.toUpperCase()}</text>
    </svg>`;
  };

  // Real-time live generated preview
  const livePreviewSVG = useMemo(() => {
    return createSVGMarkup(brandName, selectedStyle, selectedColorStyle, 0);
  }, [brandName, selectedStyle, selectedColorStyle]);

  const defaultConcepts: LogoConcept[] = [
    {
      id: 'c1',
      title: 'Stylized Vector Monogram',
      style: 'Minimal',
      image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'c2',
      title: 'Futuristic Crest & Emblem',
      style: 'Cyberpunk',
      image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'c3',
      title: 'Luxury Satin Monogram',
      style: 'Luxury',
      image: 'https://images.unsplash.com/photo-1600132806370-bf17e65e942f?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'c4',
      title: 'Isometric Geometric Node',
      style: 'Geometric',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80'
    }
  ];

  const [concepts, setConcepts] = useState<LogoConcept[]>(defaultConcepts);

  const handleGenerateLogos = async () => {
    if (!useAICredit(1)) return;
    setIsLoading(true);
    const finalBrand = brandName.trim() || 'Rival Space';

    try {
      const promptPayload = `Generate 4 distinct logo concepts for brand "${finalBrand}" in ${industry || 'Tech'} industry. Style: ${selectedStyle}, Color: ${selectedColorStyle}. Description: ${shortDescription}`;

      const res = await fetch('/api/api/ai/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: promptPayload }),
      }).catch(() => null);

      const newConcepts: LogoConcept[] = [
        {
          id: `c1-${Date.now()}`,
          title: `${finalBrand} ${selectedStyle} Monogram`,
          style: selectedStyle,
          image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
          svgMarkup: createSVGMarkup(finalBrand, selectedStyle, selectedColorStyle, 0)
        },
        {
          id: `c2-${Date.now()}`,
          title: `${finalBrand} Cyber Crest`,
          style: selectedStyle,
          image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80',
          svgMarkup: createSVGMarkup(finalBrand, selectedStyle === 'Minimal' ? 'Cyberpunk' : selectedStyle, selectedColorStyle, 1)
        },
        {
          id: `c3-${Date.now()}`,
          title: `${finalBrand} Premium Emblem`,
          style: selectedStyle,
          image: 'https://images.unsplash.com/photo-1600132806370-bf17e65e942f?auto=format&fit=crop&w=600&q=80',
          svgMarkup: createSVGMarkup(finalBrand, 'Luxury', selectedColorStyle, 2)
        },
        {
          id: `c4-${Date.now()}`,
          title: `${finalBrand} Geometric Poly`,
          style: selectedStyle,
          image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80',
          svgMarkup: createSVGMarkup(finalBrand, 'Geometric', selectedColorStyle, 3)
        }
      ];

      setConcepts(newConcepts);

      // Add to AI History
      addAIHistoryItem({
        title: `${finalBrand} Logo Set`,
        category: 'Logos',
        image: newConcepts[0].image,
        iconType: 'logo',
        details: `Style: ${selectedStyle}, Industry: ${industry || 'Tech'}`
      });

      showToast(`Сгенерировано 4 концепта для "${finalBrand}"!`);
    } catch (err) {
      console.error(err);
      showToast(t('new_logo_concepts_uploaded'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadSVG = () => {
    const finalBrand = brandName.trim() || 'Rival_Space';
    const svgContent = createSVGMarkup(finalBrand, selectedStyle, selectedColorStyle, 0);
    exportAsSVG(`${finalBrand}_Logo_${selectedStyle}.svg`, svgContent);
    showToast(`Векторный логотип ${finalBrand}.svg скачан!`);
  };

  const handleExportJSON = () => {
    const finalBrand = brandName.trim() || 'Rival Space';
    exportAsJSON(`${finalBrand}_Logo_Spec.json`, {
      brandName: finalBrand,
      industry: industry || 'Tech',
      description: shortDescription,
      style: selectedStyle,
      colorStyle: selectedColorStyle,
      generatedAt: new Date().toISOString(),
      concepts: concepts.map(c => ({ title: c.title, style: c.style }))
    });
    showToast('Конфигурация логотипа экспортирована в JSON');
  };

  const handleExportDoc = () => {
    const finalBrand = brandName.trim() || 'Rival Space';
    const html = `
      <h2>Logo Design Specification</h2>
      <p><strong>Brand:</strong> ${finalBrand}</p>
      <p><strong>Industry:</strong> ${industry || 'General'}</p>
      <p><strong>Selected Style:</strong> ${selectedStyle}</p>
      <p><strong>Color Theme:</strong> ${selectedColorStyle}</p>
      <p><strong>Description:</strong> ${shortDescription || 'N/A'}</p>
      <h2>Vector Preview</h2>
      <div style="max-w:300px; margin:20px 0;">
        ${livePreviewSVG}
      </div>
    `;
    exportAsFormattedDoc(`${finalBrand}_Logo_Specification.html`, `${finalBrand} - Logo Spec`, html);
    showToast('Документ спецификации логотипа скачан!');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#050508] font-sans animate-in fade-in duration-200">
      <div className="max-w-md mx-auto min-h-screen px-4 py-5 space-y-5 pb-28 relative">

        {/* TOP NAVBAR HEADER */}
        <div className="flex items-center justify-between pt-1">
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors flex items-center justify-center active:scale-95"
            aria-label="Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <h1 className="text-base font-extrabold text-white tracking-tight">
            Logo Generator
          </h1>

          <button
            onClick={() => setShowHistory(true)}
            className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors flex items-center justify-center active:scale-95"
            aria-label="History"
          >
            <History className="w-4 h-4" />
          </button>
        </div>

        {/* TOP HERO BANNER CARD */}
        <div className="rounded-3xl bg-gradient-to-b from-[#14122b] via-[#0c0c16] to-[#080810] border border-indigo-500/30 p-6 text-center space-y-4 shadow-2xl relative overflow-hidden">
          {/* Ambient Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-20 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none" />

          {/* Sparkles Icon Pill */}
          <div className="w-12 h-12 rounded-full bg-[#1b1742] border border-indigo-500/40 flex items-center justify-center text-indigo-300 mx-auto shadow-[0_0_20px_rgba(99,102,241,0.3)]">
            <Sparkles className="w-5 h-5 text-indigo-300 animate-pulse" />
          </div>

          <div className="space-y-1.5 max-w-xs mx-auto">
            <h2 className="text-xl font-extrabold text-white tracking-tight">
              Generate Logos with AI
            </h2>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Create premium logo concepts in seconds.
            </p>
          </div>

          {/* Primary Action Button inside Hero Card */}
          <button
            onClick={handleGenerateLogos}
            disabled={isLoading}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:opacity-95 text-white font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-indigo-600/30 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Generating Logos...</span>
              </>
            ) : (
              <span>Generate Logo</span>
            )}
          </button>
        </div>

        {/* LOGO INFORMATION SECTION */}
        <div className="space-y-2.5">
          <h3 className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-widest px-0.5">
            LOGO INFORMATION
          </h3>

          <div className="rounded-3xl bg-[#0c0c14] border border-zinc-800/90 p-4 space-y-3.5 shadow-xl">
            {/* Brand Name */}
            <div className="space-y-1">
              <label className="text-[10px] font-mono font-bold text-zinc-400 block">
                Brand Name
              </label>
              <input
                type="text"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                placeholder="e.g. Rival Space"
                className="w-full bg-[#07070c] border border-zinc-800/90 rounded-2xl px-4 py-3 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-indigo-500/80 transition-colors"
              />
            </div>

            {/* Industry */}
            <div className="space-y-1">
              <label className="text-[10px] font-mono font-bold text-zinc-400 block">
                Industry
              </label>
              <input
                type="text"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                placeholder="e.g. Technology, Fashion"
                className="w-full bg-[#07070c] border border-zinc-800/90 rounded-2xl px-4 py-3 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-indigo-500/80 transition-colors"
              />
            </div>

            {/* Short Description */}
            <div className="space-y-1">
              <label className="text-[10px] font-mono font-bold text-zinc-400 block">
                Short Description
              </label>
              <textarea
                rows={3}
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
                placeholder="Briefly describe your brand's vibe..."
                className="w-full bg-[#07070c] border border-zinc-800/90 rounded-2xl px-4 py-3 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-indigo-500/80 transition-colors resize-none leading-relaxed"
              />
            </div>
          </div>
        </div>

        {/* LOGO STYLE SECTION */}
        <div className="space-y-2.5">
          <h3 className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-widest px-0.5">
            LOGO STYLE
          </h3>

          <div className="flex flex-wrap items-center gap-2">
            {logoStyles.map((style) => {
              const isActive = selectedStyle === style;
              return (
                <button
                  key={style}
                  onClick={() => setSelectedStyle(style)}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all active:scale-95 ${
                    isActive
                      ? 'bg-indigo-600 text-white border border-indigo-400 shadow-lg shadow-indigo-600/30'
                      : 'bg-[#0c0c14] text-zinc-300 border border-zinc-800 hover:bg-zinc-900 hover:text-white'
                  }`}
                >
                  {style}
                </button>
              );
            })}
          </div>
        </div>

        {/* COLOR STYLE SECTION */}
        <div className="space-y-2.5">
          <h3 className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-widest px-0.5">
            COLOR STYLE
          </h3>

          <div className="flex items-center gap-2">
            {colorStyles.map((c) => {
              const isActive = selectedColorStyle === c.id;
              return (
                <button
                  key={c.id}
                  onClick={() => setSelectedColorStyle(c.id)}
                  className={`px-4 py-2.5 rounded-full text-xs font-bold flex items-center gap-2 transition-all active:scale-95 ${
                    isActive
                      ? 'bg-indigo-600 text-white border border-indigo-400 shadow-lg shadow-indigo-600/30'
                      : 'bg-[#0c0c14] text-zinc-300 border border-zinc-800 hover:bg-zinc-900 hover:text-white'
                  }`}
                >
                  {c.icon ? (
                    <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                  ) : (
                    <span className={`w-3 h-3 rounded-full border ${c.dotColor}`} />
                  )}
                  <span>{c.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* REAL-TIME VECTOR LOGO PREVIEW CARD */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between px-0.5">
            <h3 className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-indigo-400" />
              Real-Time Vector Preview
            </h3>
            <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-500/30 animate-pulse">
              LIVE PREVIEW
            </span>
          </div>

          <div className="rounded-3xl bg-[#0c0c14] border border-indigo-500/30 p-4 space-y-4 shadow-2xl relative overflow-hidden">
            <div className="h-56 w-full rounded-2xl bg-[#07070c] border border-zinc-800 p-4 flex items-center justify-center relative shadow-inner">
              <div 
                className="w-48 h-48 transition-all duration-300"
                dangerouslySetInnerHTML={{ __html: livePreviewSVG }}
              />
              <span className="absolute bottom-3 left-3 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md text-[10px] font-mono text-indigo-300 font-bold border border-white/10">
                {selectedStyle} • {selectedColorStyle}
              </span>
            </div>

            {/* Quick Export Bar */}
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={handleDownloadSVG}
                className="py-2.5 px-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-[11px] transition-all flex items-center justify-center gap-1 shadow-md active:scale-95"
              >
                <Download className="w-3.5 h-3.5" />
                <span>SVG Vector</span>
              </button>

              <button
                onClick={handleExportJSON}
                className="py-2.5 px-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 hover:text-white font-bold text-[11px] transition-all flex items-center justify-center gap-1 active:scale-95"
              >
                <FileJson className="w-3.5 h-3.5 text-amber-400" />
                <span>JSON</span>
              </button>

              <button
                onClick={handleExportDoc}
                className="py-2.5 px-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 hover:text-white font-bold text-[11px] transition-all flex items-center justify-center gap-1 active:scale-95"
              >
                <FileText className="w-3.5 h-3.5 text-emerald-400" />
                <span>PDF Spec</span>
              </button>
            </div>
          </div>
        </div>

        {/* GENERATED CONCEPTS SECTION */}
        <div className="space-y-3">
          <h3 className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-widest px-0.5">
            GENERATED CONCEPTS
          </h3>

          <div className="rounded-3xl bg-[#0c0c14] border border-zinc-800/90 p-4 space-y-4 shadow-xl">
            {/* 2x2 Grid of Concepts */}
            <div className="grid grid-cols-2 gap-3">
              {concepts.map((concept, index) => {
                const isSelected = selectedConceptId === concept.id;
                return (
                  <div
                    key={concept.id}
                    onClick={() => setSelectedConceptId(concept.id)}
                    className={`h-36 rounded-2xl border transition-all cursor-pointer relative overflow-hidden group flex items-center justify-center bg-[#07070c] ${
                      isSelected
                        ? 'border-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.35)] ring-2 ring-indigo-500/40'
                        : 'border-zinc-800/90 hover:border-zinc-700'
                    }`}
                  >
                    {concept.svgMarkup ? (
                      <div 
                        className="w-full h-full p-2 flex items-center justify-center"
                        dangerouslySetInnerHTML={{ __html: concept.svgMarkup }}
                      />
                    ) : (
                      <img
                        src={concept.image}
                        alt={concept.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90"
                      />
                    )}
                    
                    {/* Hover Zoom preview trigger */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (concept.svgMarkup) {
                          setZoomedImage(`data:image/svg+xml;utf8,${encodeURIComponent(concept.svgMarkup)}`);
                        } else {
                          setZoomedImage(concept.image);
                        }
                      }}
                      className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <ZoomIn className="w-3.5 h-3.5" />
                    </button>

                    {isSelected && (
                      <div className="absolute top-2 left-2 w-6 h-6 rounded-full bg-indigo-600 border border-indigo-300 flex items-center justify-center text-white shadow-md">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Bottom Action Row: Regenerate & Download */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <button
                onClick={handleGenerateLogos}
                disabled={isLoading}
                className="py-3 rounded-2xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 hover:text-white text-xs font-bold transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-indigo-400' : ''}`} />
                <span>Regenerate</span>
              </button>

              <button
                onClick={handleDownloadSVG}
                className="py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-extrabold shadow-lg shadow-indigo-600/30 transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>Download SVG</span>
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* FULL IMAGE PREVIEW MODAL */}
      {zoomedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in duration-200"
          onClick={() => setZoomedImage(null)}
        >
          <div
            className="relative max-w-lg w-full bg-[#0c0c14] border border-zinc-800 rounded-3xl p-4 space-y-3 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2">
              <span className="text-xs font-extrabold text-white">Logo Concept HD Preview</span>
              <button
                onClick={() => setZoomedImage(null)}
                className="p-1 rounded-full text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="rounded-2xl overflow-hidden border border-zinc-800 bg-black">
              <img
                src={zoomedImage}
                alt="Logo Concept HD"
                referrerPolicy="no-referrer"
                className="w-full h-80 object-cover"
              />
            </div>
          </div>
        </div>
      )}

      {/* AI HISTORY MODAL */}
      {showHistory && (
        <AIHistoryModal
          onClose={() => setShowHistory(false)}
          onOpenCreateOrder={onOpenCreateOrder}
        />
      )}
    </div>
  );
};
