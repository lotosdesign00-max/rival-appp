import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ArrowLeft, 
  RotateCcw, 
  Sparkles, 
  Wand2, 
  LayoutGrid, 
  Palette, 
  Check, 
  Copy, 
  Loader2, 
  X,
  Eye,
  Download,
  Share2,
  FileJson,
  FileText
} from 'lucide-react';
import { useTranslation } from "../context/LanguageContext";
import { exportAsJSON, exportAsFormattedDoc } from '../utils/exportUtils';

interface MoodboardGeneratorModalProps {
  onClose: () => void;
  onOpenCreateOrder?: (title?: string) => void;
}

export const MoodboardGeneratorModal: React.FC<MoodboardGeneratorModalProps> = ({
  onClose,
  onOpenCreateOrder
}) => {
    const { t } = useTranslation();
  const { showToast, addAIHistoryItem, useAICredit } = useApp();
  const [projectName, setProjectName] = useState('');
  const [keywords, setKeywords] = useState('');
  const [description, setDescription] = useState('');

  const [selectedStyle, setSelectedStyle] = useState('Dark UI');
  const [colorDirection, setColorDirection] = useState('Purple');

  const [isLoading, setIsLoading] = useState(false);
  const [generatedBoard, setGeneratedBoard] = useState<{
    title: string;
    style: string;
    colorScheme: string;
    images: { title: string; image: string; tag: string }[];
    palette: string[];
    vibeKeywords: string[];
  } | null>(null);

  const [copied, setCopied] = useState(false);

  const styleOptions = ['Dark UI', 'Cyberpunk', 'Minimal', 'Luxury', 'Glassmorphism', '3D'];

  const colorOptions = [
    { id: 'Dark', label: 'Dark', dotColor: 'bg-zinc-800 border-zinc-600', palette: ['#050508', '#14141e', '#27272a', '#6366f1', '#a1a1aa'] },
    { id: 'Purple', label: 'Purple', dotColor: 'bg-purple-500', palette: ['#0d0c1d', '#1a1936', '#8b5cf6', '#c084fc', '#f472b6'] },
    { id: 'Blue', label: 'Blue', dotColor: 'bg-blue-500', palette: ['#050b14', '#0c1a2e', '#3b82f6', '#06b6d4', '#93c5fd'] },
    { id: 'AI Choice', label: 'AI Choice', icon: true, palette: ['#050508', '#0c0c14', '#6366f1', '#8b5cf6', '#d4af37'] }
  ];

  // Dynamic Real-time Live Preview Calculation
  const livePreviewBoard = useMemo(() => {
    const finalProj = projectName.trim() || 'Project Obsidian';
    const finalKws = keywords.trim() ? keywords.split(',').map(s => s.trim()) : ['Minimal', 'Tech', 'Cinematic'];
    const matchedColor = colorOptions.find(c => c.id === colorDirection) || colorOptions[3];
    
    return {
      title: finalProj,
      style: selectedStyle,
      colorScheme: colorDirection,
      palette: matchedColor.palette,
      vibeKeywords: finalKws,
      tiles: [
        { title: `${finalProj} HUD`, tag: 'UI Layout', image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80' },
        { title: `${selectedStyle} Lighting`, tag: 'Lighting', image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80' },
        { title: `${colorDirection} Palette Asset`, tag: '3D Render', image: 'https://images.unsplash.com/photo-1600132806370-bf17e65e942f?auto=format&fit=crop&w=600&q=80' }
      ]
    };
  }, [projectName, keywords, selectedStyle, colorDirection]);

  const handleExportJSON = (board = generatedBoard || livePreviewBoard) => {
    exportAsJSON(`${board.title}_Moodboard.json`, {
      title: board.title,
      style: board.style,
      colorScheme: board.colorScheme,
      palette: board.palette,
      keywords: board.vibeKeywords,
      generatedAt: new Date().toISOString()
    });
    showToast('Moodboard экспортирован в JSON!');
  };

  const handleExportDoc = (board = generatedBoard || livePreviewBoard) => {
    const html = `
      <h2>Moodboard Specification</h2>
      <p><strong>Project Title:</strong> ${board.title}</p>
      <p><strong>Style:</strong> ${board.style}</p>
      <p><strong>Color Direction:</strong> ${board.colorScheme}</p>
      <p><strong>Vibe Keywords:</strong> ${board.vibeKeywords.join(', ')}</p>
      <h2>Color Tokens</h2>
      <div class="color-grid">
        ${board.palette.map(hex => `
          <div class="color-card">
            <div class="color-swatch" style="background-color:${hex}"></div>
            <div class="hex">${hex}</div>
          </div>
        `).join('')}
      </div>
    `;
    exportAsFormattedDoc(`${board.title}_Moodboard_Spec.html`, `${board.title} - Moodboard Spec`, html);
    showToast('Документ мудборда скачан!');
  };

  const handleGenerate = async () => {
    if (!useAICredit(1)) return;
    const finalProjectName = projectName.trim() || 'Project Obsidian';
    const finalKeywords = keywords.trim() || 'Minimal, Tech, Cinematic';
    const finalDesc = description.trim() || 'High-end dark mode interface with spatial visual assets.';

    setIsLoading(true);

    try {
      const promptPayload = `Create a complete visual moodboard design specification for:\n\nProject Name: ${finalProjectName}\nKeywords: ${finalKeywords}\nDescription: ${finalDesc}\nMoodboard Style: ${selectedStyle}\nColor Direction: ${colorDirection}\n\nReturn aesthetic concepts, color token hex values, visual composition rules, and spatial lighting guidelines.`;

      const res = await fetch('/api/ai/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: promptPayload }),
      });

      await res.json();

      setGeneratedBoard({
        title: finalProjectName,
        style: selectedStyle,
        colorScheme: colorDirection,
        palette: ['#050508', '#0c0c14', '#6366f1', '#8b5cf6', '#d4af37'],
        vibeKeywords: finalKeywords.split(',').map(s => s.trim()),
        images: [
          {
            title: 'Cyberpunk Interface HUD',
            tag: 'UI Layout',
            image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80'
          },
          {
            title: 'Spatial Mesh Gradient',
            tag: 'Texture & Lighting',
            image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80'
          },
          {
            title: 'Luxury Monogram Asset',
            tag: '3D Render',
            image: 'https://images.unsplash.com/photo-1600132806370-bf17e65e942f?auto=format&fit=crop&w=800&q=80'
          },
          {
            title: 'Analytics Data Dashboard',
            tag: 'Components',
            image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80'
          }
        ]
      });

      addAIHistoryItem({
        title: `${finalProjectName} Moodboard`,
        category: 'Moodboard',
        iconType: 'moodboard',
        image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80',
        colorSwatches: ['#050508', '#0c0c14', '#6366f1', '#8b5cf6'],
        details: `Style: ${selectedStyle}, Colors: ${colorDirection}`
      });
    } catch (err) {
      console.error(err);
      setGeneratedBoard({
        title: finalProjectName,
        style: selectedStyle,
        colorScheme: colorDirection,
        palette: ['#050508', '#0c0c14', '#6366f1', '#8b5cf6', '#a1a1aa'],
        vibeKeywords: ['Minimal', 'Tech', 'Cinematic'],
        images: [
          {
            title: 'Cyberpunk Interface HUD',
            tag: 'UI Layout',
            image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80'
          },
          {
            title: 'Spatial Mesh Gradient',
            tag: 'Texture',
            image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80'
          }
        ]
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyPalette = () => {
    if (generatedBoard) {
      navigator.clipboard.writeText(generatedBoard.palette.join(', '));
      setCopied(true);
      showToast(t('the_palette_has_been_copied_to'));
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
            Moodboard Generator
          </h1>

          <button
            onClick={() => showToast(t('history_of_generated_moodboard'))}
            className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors flex items-center justify-center active:scale-95"
            aria-label="History"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* GENERATE INSPIRATION HERO CARD */}
        <div className="rounded-3xl bg-gradient-to-b from-[#14122b] via-[#0c0c16] to-[#080810] border border-indigo-500/30 p-5 flex items-center gap-4 shadow-2xl relative overflow-hidden">
          {/* Subtle Glow */}
          <div className="absolute top-0 right-0 w-32 h-20 bg-indigo-500/15 rounded-full blur-2xl pointer-events-none" />

          {/* Sparkles Badge */}
          <div className="w-12 h-12 rounded-full bg-[#1b1742] border border-indigo-500/40 flex items-center justify-center text-indigo-300 shrink-0 shadow-[0_0_20px_rgba(99,102,241,0.3)]">
            <Sparkles className="w-5 h-5 text-indigo-300 animate-pulse" />
          </div>

          <div className="space-y-0.5 min-w-0">
            <h2 className="text-base font-extrabold text-white tracking-tight">
              Generate Inspiration
            </h2>
            <p className="text-xs text-zinc-400 leading-snug">
              Create AI moodboards for brands, interfaces and projects.
            </p>
          </div>
        </div>

        {/* PROJECT DETAILS SECTION */}
        <div className="space-y-2.5">
          <h3 className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-widest px-0.5">
            PROJECT DETAILS
          </h3>

          <div className="rounded-3xl bg-[#0c0c14] border border-zinc-800/90 p-4 space-y-3.5 shadow-xl">
            {/* 1. PROJECT NAME */}
            <div className="space-y-1">
              <label className="text-[10px] font-mono font-bold text-zinc-400 block">
                Project Name
              </label>
              <input
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="e.g. Project Obsidian"
                className="w-full bg-[#07070c] border border-zinc-800/90 rounded-2xl px-4 py-3 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-indigo-500/80 transition-colors"
              />
            </div>

            {/* 2. KEYWORDS */}
            <div className="space-y-1">
              <label className="text-[10px] font-mono font-bold text-zinc-400 block">
                Keywords
              </label>
              <input
                type="text"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                placeholder="Minimal, Tech, Cinematic..."
                className="w-full bg-[#07070c] border border-zinc-800/90 rounded-2xl px-4 py-3 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-indigo-500/80 transition-colors"
              />
            </div>

            {/* 3. DESCRIPTION (OPTIONAL) */}
            <div className="space-y-1">
              <label className="text-[10px] font-mono font-bold text-zinc-400 block">
                Description (Optional)
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the vibe..."
                className="w-full bg-[#07070c] border border-zinc-800/90 rounded-2xl px-4 py-3 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-indigo-500/80 transition-colors resize-none leading-relaxed"
              />
            </div>
          </div>
        </div>

        {/* MOODBOARD STYLE SECTION */}
        <div className="space-y-2.5">
          <h3 className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-widest px-0.5">
            MOODBOARD STYLE
          </h3>

          <div className="flex flex-wrap items-center gap-2">
            {styleOptions.map((style) => {
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

        {/* COLOR DIRECTION SECTION */}
        <div className="space-y-2.5">
          <h3 className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-widest px-0.5">
            COLOR DIRECTION
          </h3>

          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
            {colorOptions.map((opt) => {
              const isActive = colorDirection === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => setColorDirection(opt.id)}
                  className={`px-4 py-2.5 rounded-full text-xs font-bold flex items-center gap-2 transition-all active:scale-95 whitespace-nowrap ${
                    isActive
                      ? 'bg-indigo-600 text-white border border-indigo-400 shadow-lg shadow-indigo-600/30'
                      : 'bg-[#0c0c14] text-zinc-300 border border-zinc-800 hover:bg-zinc-900 hover:text-white'
                  }`}
                >
                  {opt.icon ? (
                    <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                  ) : (
                    <span className={`w-3 h-3 rounded-full border ${opt.dotColor}`} />
                  )}
                  <span>{opt.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* REAL-TIME VISUAL PREVIEW SECTION */}
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
                  {livePreviewBoard.title}
                </h4>
                <p className="text-[10px] font-mono text-indigo-300 font-bold uppercase">
                  {livePreviewBoard.style} • {livePreviewBoard.colorScheme}
                </p>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleExportJSON(livePreviewBoard)}
                  className="px-2.5 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 text-[10px] font-bold flex items-center gap-1"
                >
                  <FileJson className="w-3 h-3 text-amber-400" />
                  <span>JSON</span>
                </button>
                <button
                  onClick={() => handleExportDoc(livePreviewBoard)}
                  className="px-2.5 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 text-[10px] font-bold flex items-center gap-1"
                >
                  <FileText className="w-3 h-3 text-emerald-400" />
                  <span>PDF Spec</span>
                </button>
              </div>
            </div>

            {/* Live Palette Swatches */}
            <div className="grid grid-cols-5 gap-1.5">
              {livePreviewBoard.palette.map((hex, idx) => (
                <div key={idx} className="h-6 rounded-lg border border-white/10" style={{ backgroundColor: hex }} title={hex} />
              ))}
            </div>

            {/* Live Visual Asset Tiles */}
            <div className="grid grid-cols-3 gap-2">
              {livePreviewBoard.tiles.map((tile, idx) => (
                <div key={idx} className="rounded-xl overflow-hidden bg-black border border-zinc-800 relative group h-20">
                  <img src={tile.image} alt={tile.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-black/70 text-[8px] font-mono text-white font-bold">
                    {tile.tag}
                  </span>
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
                <span>Generating Moodboard...</span>
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4 text-white" />
                <span>Generate Moodboard</span>
              </>
            )}
          </button>
        </div>

      </div>

      {/* GENERATED MOODBOARD MODAL */}
      {generatedBoard && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200"
          onClick={() => setGeneratedBoard(null)}
        >
          <div
            className="w-full max-w-lg max-h-[90vh] bg-[#0c0c14] border border-zinc-800 rounded-3xl p-5 space-y-5 shadow-2xl relative flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Top Bar */}
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800 shrink-0">
              <div className="flex items-center gap-2">
                <LayoutGrid className="w-5 h-5 text-indigo-400" />
                <div>
                  <h3 className="text-sm font-extrabold text-white tracking-tight">
                    {generatedBoard.title}
                  </h3>
                  <p className="text-[10px] font-mono text-indigo-300 font-bold uppercase">
                    {generatedBoard.style} • {generatedBoard.colorScheme}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setGeneratedBoard(null)}
                className="w-8 h-8 rounded-full bg-zinc-900 text-zinc-400 hover:text-white flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable Body Content */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-1">
              {/* Color Swatches */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-wider">
                    COLOR PALETTE TOKENS
                  </span>
                  <button
                    onClick={handleCopyPalette}
                    className="text-[10px] font-mono font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                  >
                    {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copied ? 'Copied' : 'Copy All'}</span>
                  </button>
                </div>

                <div className="grid grid-cols-5 gap-2">
                  {generatedBoard.palette.map((hex, idx) => (
                    <div key={idx} className="space-y-1 text-center">
                      <div
                        className="h-10 rounded-xl border border-white/10 shadow-md"
                        style={{ backgroundColor: hex }}
                      />
                      <span className="text-[9px] font-mono text-zinc-400 font-bold block">
                        {hex}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Grid of Moodboard Images */}
              <div className="space-y-2">
                <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-wider block">
                  VISUAL ASSET TILES
                </span>

                <div className="grid grid-cols-2 gap-3">
                  {generatedBoard.images.map((item, idx) => (
                    <div
                      key={idx}
                      className="rounded-2xl bg-[#07070c] border border-zinc-800/90 overflow-hidden shadow-lg space-y-2 group"
                    >
                      <div className="h-32 w-full relative overflow-hidden bg-zinc-950">
                        <img
                          src={item.image}
                          alt={item.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[9px] font-mono text-white font-bold border border-white/10">
                          {item.tag}
                        </span>
                      </div>
                      <div className="px-3 pb-3">
                        <h4 className="text-xs font-bold text-white tracking-tight">
                          {item.title}
                        </h4>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="pt-2 border-t border-zinc-800 flex items-center gap-3 shrink-0">
              <button
                onClick={() => {
                  showToast(t('moodboard_saved_to_favorites'));
                  setGeneratedBoard(null);
                }}
                className="flex-1 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs transition-all active:scale-95 flex items-center justify-center gap-2 shadow-lg"
              >
                <Check className="w-4 h-4" />
                <span>Save Moodboard</span>
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};
