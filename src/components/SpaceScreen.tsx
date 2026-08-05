import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from '../context/LanguageContext';
import { useApp } from '../context/AppContext';
import { 
  Box, 
  Layers, 
  Sparkles, 
  Eye, 
  Zap, 
  Maximize2, 
  RotateCw, 
  Cpu, 
  Sliders, 
  Activity, 
  ShieldCheck, 
  Download, 
  Share2, 
  Play, 
  Pause,
  Grid,
  Sun,
  Flame,
  Monitor,
  Terminal,
  FolderOpen,
  ShoppingBag,
  ChevronRight,
  CheckCircle2,
  Compass,
  Code
} from 'lucide-react';
import { OrderDetailData, OrderRequest } from '../types';
import { motion } from 'motion/react';

interface SpaceScreenProps {
  onOpenCreateOrder: () => void;
  onOpenArchive?: () => void;
  onOpenMyOrders?: () => void;
  onOpenOrderDetail?: (orderData?: OrderDetailData) => void;
  userOrders?: OrderRequest[];
}

export const SpaceScreen: React.FC<SpaceScreenProps> = React.memo(({ 
  onOpenCreateOrder, 
  onOpenArchive,
  onOpenMyOrders,
  onOpenOrderDetail
}) => {
  const { t } = useTranslation();
  const { orders } = useApp();

  // Studio 3D Canvas State
  const [isPlaying, setIsPlaying] = useState(true);
  const [isWireframe, setIsWireframe] = useState(false);
  const [rotationAngle, setRotationAngle] = useState(45);
  const [lightingMode, setLightingMode] = useState<'neon' | 'studio' | 'cyberpunk'>('neon');
  const [activePreset, setActivePreset] = useState('Obsidian Cyber-Mesh');
  const [renderQuality, setRenderQuality] = useState<'4K' | '2K' | '1080p'>('4K');
  const [exposure, setExposure] = useState(85);
  const [glowIntensity, setGlowIntensity] = useState(70);

  // Simulated Realtime Telemetry
  const [fps, setFps] = useState(60);
  const [drawCalls, setDrawCalls] = useState(142);
  const [polyCount] = useState('184,200');
  const [memUsage, setMemUsage] = useState('1.4 GB');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Continuous rotation simulation
  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setRotationAngle(prev => (prev + 1) % 360);
        setFps(Math.floor(58 + Math.random() * 4));
        setDrawCalls(Math.floor(140 + Math.random() * 6));
      }, 50);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const studioPresets = useMemo(() => [
    { name: 'Obsidian Cyber-Mesh', tag: '3D Shader', color: 'from-indigo-600 to-purple-600' },
    { name: 'Minimalist Grid 3D', tag: 'Viewport Preset', color: 'from-blue-600 to-cyan-600' },
    { name: 'Glassmorphic Sphere', tag: 'Raytracing', color: 'from-emerald-600 to-teal-600' },
    { name: 'Quantum Neon HUD', tag: 'Spatial PBR', color: 'from-fuchsia-600 to-rose-600' },
  ], []);

  return (
    <div
      className="space-y-6 pb-28 font-sans animate-in fade-in duration-300"
    >
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-indigo-600 text-white font-mono text-xs px-4 py-2 rounded-full shadow-2xl border border-indigo-400 flex items-center gap-2 animate-bounce">
          <Sparkles className="w-4 h-4 text-yellow-300" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* HEADER BAR */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Rival Space
            </h1>
            <span className="px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 text-[10px] font-mono font-bold tracking-widest uppercase">
              STUDIO 3.0
            </span>
          </div>
          <p className="text-xs sm:text-sm text-zinc-400 mt-0.5">
            Interactive 3D workspace, viewport telemetry & asset pipeline.
          </p>
        </div>

        {/* Quick Link to My Orders */}
        {onOpenMyOrders && (
          <button
            onClick={onOpenMyOrders}
            className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-bold text-indigo-400 transition-all active:scale-95 shadow-lg group"
          >
            <ShoppingBag className="w-4 h-4 text-indigo-400 group-hover:scale-110 transition-transform" />
            <span className="hidden sm:inline">My Orders</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </button>
        )}
      </div>

      {/* MY ORDERS BANNER ACCESS */}
      <div
        onClick={onOpenMyOrders}
        className="p-4 rounded-3xl bg-gradient-to-r from-indigo-950/70 via-[#0e0e18] to-purple-950/70 border border-indigo-500/30 hover:border-indigo-500/60 transition-all cursor-pointer shadow-lg flex items-center justify-between group"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-300 group-hover:scale-105 transition-transform">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">
                Track Active Orders
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-indigo-500/30 text-indigo-300 text-[10px] font-mono font-semibold">
                {orders.length} Active
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">
              {orders.length > 0
                ? orders.map(o => o.projectType).slice(0, 2).join(', ') + (orders.length > 2 ? '...' : '')
                : t('auto_0KMg0LLQ')}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1 text-xs font-bold text-indigo-400 group-hover:translate-x-1 transition-transform">
          <span>Open</span>
          <ChevronRight className="w-4 h-4" />
        </div>
      </div>

      {/* MAIN 3D VIEWPORT CANVAS */}
      <div className="relative rounded-3xl bg-[#09090f] border border-zinc-800/90 overflow-hidden shadow-2xl">
        {/* Viewport Top Bar */}
        <div className="flex items-center justify-between px-4 py-3 bg-[#0c0c14] border-b border-zinc-800/80 text-xs">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
            </div>
            <span className="text-zinc-400 font-mono text-[11px] truncate max-w-[140px] sm:max-w-none">
              Viewport // {activePreset}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 font-mono text-[10px] font-bold">
              {fps} FPS
            </span>
            <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 font-mono text-[10px]">
              {renderQuality}
            </span>
          </div>
        </div>

        {/* 3D Canvas Visual Stage */}
        <div className="relative h-72 sm:h-96 w-full bg-gradient-to-b from-[#090912] via-[#0d0d18] to-[#06060a] flex items-center justify-center overflow-hidden">
          {/* Simulated 3D Grid floor */}
          <div 
            className="absolute inset-0 opacity-20 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"
            style={{
              perspective: '600px',
              transform: 'rotateX(60deg) scale(2)'
            }}
          />

          {/* Glowing Ambient Light Sphere */}
          <div 
            className={`absolute w-72 h-72 rounded-full filter blur-[90px] opacity-40 transition-colors duration-700 ${
              lightingMode === 'neon' ? 'bg-indigo-600' :
              lightingMode === 'cyberpunk' ? 'bg-fuchsia-600' : 'bg-blue-600'
            }`}
          />

          {/* 3D Wireframe / Solid Interactive Object Representation */}
          <div 
            className="relative transition-transform duration-75 flex items-center justify-center"
            style={{
              transform: `rotateY(${rotationAngle}deg) rotateX(15deg) scale(1.1)`
            }}
          >
            {/* Outer Orbital Ring */}
            <div className="absolute w-48 h-48 sm:w-60 sm:h-60 rounded-full border border-indigo-500/30 border-dashed animate-spin duration-[15000ms]" />
            <div className="absolute w-56 h-56 sm:w-72 sm:h-72 rounded-full border border-purple-500/20 border-dotted" />

            {/* Central 3D Cube / Interface Component Representation */}
            <div className={`w-32 h-32 sm:w-44 sm:h-44 rounded-2xl ${
              isWireframe 
                ? 'border-2 border-indigo-400 bg-indigo-950/20 shadow-[0_0_30px_rgba(99,102,241,0.5)]' 
                : 'bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-500 shadow-[0_0_50px_rgba(99,102,241,0.6)]'
            } backdrop-blur-md flex flex-col items-center justify-center p-4 text-center transition-all duration-300 relative overflow-hidden group`}>
              {/* Internal Glassmorphism Overlay */}
              <div className="absolute inset-0 bg-white/10 opacity-30 backdrop-blur-sm" />
              
              <Box className="w-10 h-10 sm:w-12 sm:h-12 text-white relative z-10 animate-pulse drop-shadow-md" />
              <span className="text-xs sm:text-sm font-bold text-white relative z-10 mt-2 tracking-tight">
                {activePreset}
              </span>
              <span className="text-[10px] text-indigo-200 font-mono relative z-10">
                {isWireframe ? 'Mesh: Wireframe' : 'Render: Realtime PBR'}
              </span>
            </div>
          </div>

          {/* Floating Controls Overlay on Canvas */}
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between pointer-events-auto">
            <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md p-1.5 rounded-2xl border border-white/10">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-2 text-zinc-300 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
                title={isPlaying ? 'Pause Rotation' : 'Play Rotation'}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>

              <button
                onClick={() => setIsWireframe(!isWireframe)}
                className={`p-2 rounded-xl transition-colors ${
                  isWireframe ? 'bg-indigo-600 text-white' : 'text-zinc-300 hover:text-white hover:bg-white/10'
                }`}
                title="Toggle Wireframe"
              >
                <Grid className="w-4 h-4" />
              </button>

              <button
                onClick={() => setRotationAngle(prev => (prev + 90) % 360)}
                className="p-2 text-zinc-300 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
                title="Rotate 90°"
              >
                <RotateCw className="w-4 h-4" />
              </button>
            </div>

            {/* Quality & Lighting selection */}
            <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md p-1.5 rounded-2xl border border-white/10">
              <button
                onClick={() => {
                  const modes: Array<'neon' | 'studio' | 'cyberpunk'> = ['neon', 'studio', 'cyberpunk'];
                  const nextIndex = (modes.indexOf(lightingMode) + 1) % modes.length;
                  setLightingMode(modes[nextIndex]);
                  showToast(`Освещение: ${modes[nextIndex].toUpperCase()}`);
                }}
                className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-zinc-200 font-mono font-semibold flex items-center gap-1.5"
              >
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                <span className="capitalize">{lightingMode}</span>
              </button>

              <button
                onClick={() => {
                  const qualities: Array<'4K' | '2K' | '1080p'> = ['4K', '2K', '1080p'];
                  const next = qualities[(qualities.indexOf(renderQuality) + 1) % qualities.length];
                  setRenderQuality(next);
                }}
                className="px-2.5 py-1.5 rounded-xl bg-indigo-600/40 text-indigo-300 border border-indigo-500/30 text-xs font-mono font-bold"
              >
                {renderQuality}
              </button>
            </div>
          </div>
        </div>

        {/* Viewport Bottom Controls & Adjustments */}
        <div className="p-4 bg-[#0c0c14] border-t border-zinc-800/80 grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="flex justify-between text-[11px] text-zinc-400 font-mono">
              <span>Exposure</span>
              <span>{exposure}%</span>
            </div>
            <input 
              type="range" 
              min="20" 
              max="150" 
              value={exposure} 
              onChange={(e) => setExposure(Number(e.target.value))}
              className="w-full accent-indigo-500 h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-[11px] text-zinc-400 font-mono">
              <span>Glow / Bloom</span>
              <span>{glowIntensity}%</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={glowIntensity} 
              onChange={(e) => setGlowIntensity(Number(e.target.value))}
              className="w-full accent-purple-500 h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* TELEMETRY INSPECTOR METRICS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-[#0e0e16] border border-zinc-800/90 space-y-1">
          <div className="flex items-center gap-1.5 text-zinc-400 text-xs">
            <Cpu className="w-3.5 h-3.5 text-indigo-400" />
            <span>Poly Count</span>
          </div>
          <p className="text-base sm:text-lg font-bold text-white font-mono">{polyCount}</p>
        </div>

        <div className="p-4 rounded-2xl bg-[#0e0e16] border border-zinc-800/90 space-y-1">
          <div className="flex items-center gap-1.5 text-zinc-400 text-xs">
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            <span>Draw Calls</span>
          </div>
          <p className="text-base sm:text-lg font-bold text-white font-mono">{drawCalls}</p>
        </div>

        <div className="p-4 rounded-2xl bg-[#0e0e16] border border-zinc-800/90 space-y-1">
          <div className="flex items-center gap-1.5 text-zinc-400 text-xs">
            <Zap className="w-3.5 h-3.5 text-yellow-400" />
            <span>VRAM</span>
          </div>
          <p className="text-base sm:text-lg font-bold text-white font-mono">{memUsage}</p>
        </div>

        <div className="p-4 rounded-2xl bg-[#0e0e16] border border-zinc-800/90 space-y-1">
          <div className="flex items-center gap-1.5 text-zinc-400 text-xs">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span>Shaders</span>
          </div>
          <p className="text-base sm:text-lg font-bold text-white font-mono">PBR Metal v4</p>
        </div>
      </div>

      {/* PRESETS & WORKSPACE PROJECTS SELECTION */}
      <div className="p-5 sm:p-6 rounded-3xl bg-[#0e0e16] border border-zinc-800/90 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-400" />
            Studio Presets & Workspaces
          </h2>
          {onOpenArchive && (
            <button
              onClick={onOpenArchive}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
            >
              Archive
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {studioPresets.map((preset) => (
            <div
              key={preset.name}
              onClick={() => {
                setActivePreset(preset.name);
                showToast(`Загружен пресет: ${preset.name}`);
              }}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                activePreset === preset.name
                  ? 'bg-indigo-950/40 border-indigo-500/60 shadow-lg shadow-indigo-600/10'
                  : 'bg-zinc-900/60 border-zinc-800/70 hover:border-zinc-700'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${preset.color} flex items-center justify-center text-white shrink-0`}>
                  <Box className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-white">{preset.name}</h4>
                  <p className="text-[11px] text-zinc-400 mt-0.5">{preset.tag}</p>
                </div>
              </div>

              {activePreset === preset.name && (
                <span className="w-2 h-2 rounded-full bg-indigo-400 shadow-[0_0_8px_rgba(99,102,241,0.9)] animate-pulse" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* BOTTOM CTA ACTION BUTTONS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          onClick={onOpenCreateOrder}
          className="w-full py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-indigo-600/30 transition-all active:scale-95 flex items-center justify-center gap-2"
        >
          <Sparkles className="w-4 h-4" />
          <span>Create New Order</span>
        </button>

        {onOpenArchive && (
          <button
            onClick={onOpenArchive}
            className="w-full py-4 rounded-2xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 font-bold text-xs uppercase tracking-wider transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <FolderOpen className="w-4 h-4 text-indigo-400" />
            <span>Open Case Archive</span>
          </button>
        )}
      </div>
    </div>
  );
});
