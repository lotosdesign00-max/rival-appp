import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ArrowLeft, 
  RotateCcw, 
  Sparkles, 
  Palette, 
  Layers, 
  Type, 
  Check, 
  Copy, 
  Loader2, 
  X,
  FileText,
  ShieldCheck,
  Zap,
  Eye,
  Download,
  FileJson
} from 'lucide-react';
import { useTranslation } from "../context/LanguageContext";
import { exportAsJSON, exportAsFormattedDoc } from '../utils/exportUtils';

interface BrandGeneratorModalProps {
  onClose: () => void;
  onOpenCreateOrder?: (title?: string) => void;
}

export const BrandGeneratorModal: React.FC<BrandGeneratorModalProps> = ({
  onClose,
  onOpenCreateOrder
}) => {
    const { t } = useTranslation();
  const { showToast, addAIHistoryItem, useAICredit } = useApp();
  const [brandName, setBrandName] = useState('');
  const [industry, setIndustry] = useState('');
  const [description, setDescription] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [generatedBrand, setGeneratedBrand] = useState<{
    name: string;
    tagline: string;
    colors: { name: string; hex: string; role: string }[];
    typography: { heading: string; body: string; mono: string };
    logoConcept: string;
    brandValues: string[];
    fullText: string;
  } | null>(null);

  // Real-Time Brand System Spec Calculation
  const liveBrandSpec = useMemo(() => {
    const name = brandName.trim() || 'Rival Space';
    const ind = industry.trim() || 'Tech & Creative';
    return {
      name,
      tagline: `Pioneering Next-Gen ${ind} Systems`,
      colors: [
        { name: 'Base Canvas', hex: '#050508', role: 'Background' },
        { name: 'Electric Accent', hex: '#6366f1', role: 'Primary' },
        { name: 'Satin Gold', hex: '#d4af37', role: 'Trim' },
        { name: 'Glow Purple', hex: '#8b5cf6', role: 'Highlight' }
      ],
      typography: { heading: 'Plus Jakarta Sans', body: 'Inter', mono: 'JetBrains Mono' },
      logoConcept: `Minimalist interlocking vector emblem representing ${name} digital precision.`
    };
  }, [brandName, industry]);

  const handleExportJSON = (brand = generatedBrand || liveBrandSpec) => {
    exportAsJSON(`${brand.name}_Brandbook.json`, {
      name: brand.name,
      tagline: brand.tagline,
      colors: brand.colors,
      typography: brand.typography,
      logoConcept: brand.logoConcept,
      generatedAt: new Date().toISOString()
    });
    showToast('Брендбук экспортирован в JSON!');
  };

  const handleExportDoc = (brand = generatedBrand || liveBrandSpec) => {
    const html = `
      <h2>Brand Identity Book & Specification</h2>
      <p><strong>Brand Name:</strong> ${brand.name}</p>
      <p><strong>Tagline:</strong> "${brand.tagline}"</p>
      <p><strong>Industry:</strong> ${industry || 'Tech & Digital'}</p>
      <h2>Color Token System</h2>
      <div class="color-grid">
        ${brand.colors.map(c => `
          <div class="color-card">
            <div class="color-swatch" style="background-color:${c.hex}"></div>
            <div style="font-weight:700; color:#fff; font-size:12px;">${c.name}</div>
            <div class="hex">${c.hex}</div>
            <div style="font-size:10px; color:#a1a1aa;">${c.role}</div>
          </div>
        `).join('')}
      </div>
      <h2>Typography Scale</h2>
      <p><strong>Headings:</strong> ${brand.typography.heading}</p>
      <p><strong>Body:</strong> ${brand.typography.body}</p>
      <p><strong>Code / Monospace:</strong> ${brand.typography.mono}</p>
      <h2>Logo & Emblem Concept</h2>
      <p>${brand.logoConcept}</p>
    `;
    exportAsFormattedDoc(`${brand.name}_Brandbook.html`, `${brand.name} - Brandbook`, html);
    showToast('Документ брендбука скачан!');
  };

  const handleGenerate = async () => {
    if (!useAICredit(1)) return;
    const finalBrandName = brandName.trim() || 'Rival Space';
    const finalIndustry = industry.trim() || 'Technology & Digital Art';
    const finalDesc = description.trim() || 'A high-end platform for designers, crypto protocols, and creative assets.';

    setIsLoading(true);

    try {
      const promptPayload = `Act as an expert Brand Identity Strategist & Art Director. Create a complete, luxurious brand identity system for:\n\nBrand Name: ${finalBrandName}\nIndustry: ${finalIndustry}\nDescription: ${finalDesc}\n\nPlease generate a structured brand identity containing:\n1. Brand Tagline / Motto\n2. Primary, Secondary & Accent Color Tokens with Hex Codes\n3. Typography Pairing Scale (H1 Display, Body, Telemetry/Mono)\n4. Logo Icon & Emblem Concept\n5. Core Brand Values (3 key pillars)\n6. Brand Tone of Voice`;

      const res = await fetch('/api/ai/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: promptPayload }),
      });

      const data = await res.json();
      const rawResult = data.result || '';

      setGeneratedBrand({
        name: finalBrandName,
        tagline: 'Empowering the Next Generation of Digital Creators',
        colors: [
          { name: 'Obsidian Black', hex: '#050508', role: 'Base Canvas' },
          { name: 'Electric Indigo', hex: '#6366f1', role: 'Primary Accent' },
          { name: 'Satin Gold', hex: '#d4af37', role: 'Luxury Trim' },
          { name: 'Cyber Violet', hex: '#8b5cf6', role: 'Glow Highlight' },
        ],
        typography: {
          heading: 'Plus Jakarta Sans (700 Bold / 800 ExtraBold)',
          body: 'Inter (400 Regular / 500 Medium)',
          mono: 'JetBrains Mono (600 SemiBold)'
        },
        logoConcept: 'Geometric interlocking lettermark with 1px precise vector strokes and floating orbital nodes.',
        brandValues: ['Precision Craftsmanship', 'Futuristic Minimal', 'Uncompromising Quality'],
        fullText: rawResult || `### Brand Identity Spec: ${finalBrandName}\n\n**Industry:** ${finalIndustry}\n\n**Tagline:** Empowering Next-Gen Digital Creators\n\n**Color Palette:**\n- Base Canvas: #050508\n- Primary Accent: #6366f1\n- Satin Gold Trim: #d4af37\n- Cyber Highlight: #8b5cf6\n\n**Logo Concept:** Minimalist geometric interlocking emblem with subtle 1px glow outlines.`
      });

      addAIHistoryItem({
        title: `${finalBrandName} Identity Spec`,
        category: 'Brand',
        iconType: 'brand',
        details: `Tagline: Empowering Next-Gen Digital Creators`
      });
    } catch (err) {
      console.error(err);
      setGeneratedBrand({
        name: finalBrandName,
        tagline: 'Pioneering Creative Digital Systems',
        colors: [
          { name: 'Obsidian Canvas', hex: '#050508', role: 'Background' },
          { name: 'Electric Indigo', hex: '#6366f1', role: 'Primary Brand' },
          { name: 'Neon Purple', hex: '#8b5cf6', role: 'Accent' },
          { name: 'Neutral Zinc', hex: '#a1a1aa', role: 'Sub-text' },
        ],
        typography: {
          heading: 'Plus Jakarta Sans',
          body: 'Inter',
          mono: 'JetBrains Mono'
        },
        logoConcept: 'Interlocking geometric emblem representing spatial UI and digital precision.',
        brandValues: ['Minimalist Elegance', 'Peak Performance', 'Futuristic Vision'],
        fullText: `### Brand Identity Spec: ${finalBrandName}\n\n**Tagline:** Pioneering Creative Digital Systems\n\n**Palette:** #050508 (Base), #6366f1 (Primary), #8b5cf6 (Accent)`
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (generatedBrand) {
      navigator.clipboard.writeText(generatedBrand.fullText);
      setCopied(true);
      showToast(t('the_brand_book_has_been_copied'));
      setTimeout(() => setCopied(false), 2000);
    }
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
            Brand Generator
          </h1>

          <button
            onClick={() => showToast(t('history_of_generated_brands'))}
            className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors flex items-center justify-center active:scale-95"
            aria-label="History"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* HERO BANNER CARD */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-b from-[#16132e] via-[#0d0c1b] to-[#080812] border border-indigo-500/30 p-6 space-y-4 shadow-2xl">
          {/* Ambient Glow */}
          <div className="absolute top-0 left-10 w-36 h-20 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

          {/* Sparkles Icon Pill */}
          <div className="w-12 h-12 rounded-full bg-[#1b1742] border border-indigo-500/40 flex items-center justify-center text-indigo-300 shadow-[0_0_20px_rgba(99,102,241,0.3)]">
            <Sparkles className="w-5 h-5 text-indigo-300 animate-pulse" />
          </div>

          <div className="space-y-1.5">
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-tight">
              Build a complete brand identity with AI
            </h2>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Generate logos, colors, typography and brand systems in seconds.
            </p>
          </div>
        </div>

        {/* BRAND INFORMATION SECTION */}
        <div className="space-y-3">
          <h3 className="text-base font-extrabold text-white tracking-tight px-0.5">
            Brand Information
          </h3>

          <div className="rounded-3xl bg-[#0c0c14] border border-zinc-800/90 p-4 space-y-4 shadow-xl">
            {/* 1. BRAND NAME */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-wider block">
                BRAND NAME
              </label>
              <input
                type="text"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                placeholder="e.g. Rival Space"
                className="w-full bg-[#07070c] border border-zinc-800/90 rounded-2xl px-4 py-3.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-indigo-500/80 transition-colors"
              />
            </div>

            {/* 2. INDUSTRY */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-wider block">
                INDUSTRY
              </label>
              <input
                type="text"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                placeholder="e.g. Technology, Fashion, Finance"
                className="w-full bg-[#07070c] border border-zinc-800/90 rounded-2xl px-4 py-3.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-indigo-500/80 transition-colors"
              />
            </div>

            {/* 3. SHORT DESCRIPTION */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-wider block">
                SHORT DESCRIPTION
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what your brand does..."
                className="w-full bg-[#07070c] border border-zinc-800/90 rounded-2xl px-4 py-3.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-indigo-500/80 transition-colors resize-none leading-relaxed"
              />
            </div>
          </div>
        </div>

        {/* REAL-TIME VISUAL BRAND SYSTEM PREVIEW */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between px-0.5">
            <h3 className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-indigo-400" />
              Real-Time Visual Preview
            </h3>
            <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-500/30 animate-pulse">
              LIVE PREVIEW
            </span>
          </div>

          <div className="rounded-3xl bg-[#0c0c14] border border-indigo-500/30 p-4 space-y-3.5 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-extrabold text-white tracking-tight">
                  {liveBrandSpec.name}
                </h4>
                <p className="text-[10px] font-mono text-indigo-300 font-bold">
                  "{liveBrandSpec.tagline}"
                </p>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleExportJSON(liveBrandSpec)}
                  className="px-2.5 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 text-[10px] font-bold flex items-center gap-1"
                >
                  <FileJson className="w-3 h-3 text-amber-400" />
                  <span>JSON</span>
                </button>
                <button
                  onClick={() => handleExportDoc(liveBrandSpec)}
                  className="px-2.5 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 text-[10px] font-bold flex items-center gap-1"
                >
                  <FileText className="w-3 h-3 text-emerald-400" />
                  <span>PDF Book</span>
                </button>
              </div>
            </div>

            {/* Live Color Tokens preview */}
            <div className="grid grid-cols-4 gap-2">
              {liveBrandSpec.colors.map((c, idx) => (
                <div key={idx} className="p-2 rounded-xl bg-[#07070c] border border-zinc-800 text-center space-y-1">
                  <div className="h-6 rounded-lg border border-white/10" style={{ backgroundColor: c.hex }} />
                  <span className="text-[9px] font-mono text-zinc-400 block font-bold truncate">{c.hex}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* BOTTOM FIXED CTA BUTTON */}
        <div className="pt-2">
          <button
            onClick={handleGenerate}
            disabled={isLoading}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:opacity-90 text-white font-extrabold text-xs uppercase tracking-wider shadow-2xl shadow-indigo-600/40 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Generating Brand Identity...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-white" />
                <span>Generate Brand Identity</span>
              </>
            )}
          </button>
        </div>

      </div>

      {/* GENERATED BRAND IDENTITY MODAL */}
      {generatedBrand && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200"
          onClick={() => setGeneratedBrand(null)}
        >
          <div
            className="w-full max-w-lg max-h-[90vh] bg-[#0c0c14] border border-zinc-800 rounded-3xl p-5 space-y-5 shadow-2xl relative flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800 shrink-0">
              <div className="flex items-center gap-2">
                <Palette className="w-5 h-5 text-indigo-400" />
                <div>
                  <h3 className="text-sm font-extrabold text-white tracking-tight">
                    {generatedBrand.name}
                  </h3>
                  <p className="text-[10px] font-mono text-indigo-300 font-bold">
                    BRAND SYSTEM SPEC
                  </p>
                </div>
              </div>
              <button
                onClick={() => setGeneratedBrand(null)}
                className="w-8 h-8 rounded-full bg-zinc-900 text-zinc-400 hover:text-white flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-1">
              {/* Tagline */}
              <div className="p-3.5 rounded-2xl bg-indigo-950/60 border border-indigo-500/30 text-center">
                <span className="text-[10px] font-mono text-indigo-300 uppercase tracking-widest block font-bold mb-0.5">
                  BRAND MOTTO / TAGLINE
                </span>
                <p className="text-xs font-bold text-white italic">
                  "{generatedBrand.tagline}"
                </p>
              </div>

              {/* Color Tokens Palette */}
              <div className="space-y-2">
                <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-wider block">
                  COLOR PALETTE TOKENS
                </span>

                <div className="grid grid-cols-2 gap-2">
                  {generatedBrand.colors.map((c, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-2xl bg-[#07070c] border border-zinc-800 flex items-center gap-3"
                    >
                      <div
                        className="w-8 h-8 rounded-xl border border-white/20 shrink-0 shadow-md"
                        style={{ backgroundColor: c.hex }}
                      />
                      <div className="min-w-0">
                        <span className="text-xs font-bold text-white block truncate">
                          {c.name}
                        </span>
                        <span className="text-[10px] font-mono font-bold text-indigo-400 block">
                          {c.hex}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Logo Concept */}
              <div className="p-4 rounded-2xl bg-[#07070c] border border-zinc-800/90 space-y-1.5">
                <div className="flex items-center gap-2 text-zinc-300 font-bold text-xs">
                  <Layers className="w-4 h-4 text-indigo-400" />
                  <span>Logo & Emblem Concept</span>
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed font-sans">
                  {generatedBrand.logoConcept}
                </p>
              </div>

              {/* Typography */}
              <div className="p-4 rounded-2xl bg-[#07070c] border border-zinc-800/90 space-y-2">
                <div className="flex items-center gap-2 text-zinc-300 font-bold text-xs">
                  <Type className="w-4 h-4 text-purple-400" />
                  <span>Typography Hierarchy</span>
                </div>

                <div className="space-y-1 text-xs font-mono text-zinc-300">
                  <div className="flex justify-between">
                    <span className="text-zinc-500">HEADINGS:</span>
                    <span className="font-bold text-white">{generatedBrand.typography.heading}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">BODY:</span>
                    <span className="font-bold text-white">{generatedBrand.typography.body}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">CODE / MONO:</span>
                    <span className="font-bold text-indigo-300">{generatedBrand.typography.mono}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Bottom Actions */}
            <div className="pt-2 border-t border-zinc-800 flex items-center gap-3 shrink-0">
              <button
                onClick={handleCopy}
                className="flex-1 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs transition-all active:scale-95 flex items-center justify-center gap-2 shadow-lg"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copied!' : 'Copy Brand Spec'}</span>
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};
