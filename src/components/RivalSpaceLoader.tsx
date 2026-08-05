import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Shield, Cpu, Zap } from 'lucide-react';

interface RivalSpaceLoaderProps {
  onComplete?: () => void;
  autoStart?: boolean;
}

export const RivalSpaceLoader: React.FC<RivalSpaceLoaderProps> = ({ 
  onComplete,
  autoStart = true 
}) => {
  const [phase, setPhase] = useState<
    'black' | 'point' | 'ring' | 'logo' | 'loading' | 'finish' | 'done'
  >('black');
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('INITIALIZING RIVAL OS...');
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Timeline Sequence Control (Total duration ~ 2.6s - 3.0s)
  useEffect(() => {
    if (!autoStart) return;

    // Step 1: Start black (0s)
    setPhase('black');
    setProgress(0);

    // Step 2: Point appears (200ms)
    const t1 = setTimeout(() => {
      setPhase('point');
    }, 200);

    // Step 3: Ring expands (500ms)
    const t2 = setTimeout(() => {
      setPhase('ring');
    }, 550);

    // Step 4: Logo fades in & scales (850ms)
    const t3 = setTimeout(() => {
      setPhase('logo');
    }, 850);

    // Step 5: Loading bar starts filling (1000ms - 2400ms)
    const t4 = setTimeout(() => {
      setPhase('loading');
    }, 1000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [autoStart]);

  // Smooth Progress Counter & Status Text updates
  useEffect(() => {
    if (phase !== 'loading' && phase !== 'logo') return;

    const startTime = Date.now();
    const duration = 1500; // 1.5s loading fill duration

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const currentProgress = Math.min(100, Math.floor((elapsed / duration) * 100));
      setProgress(currentProgress);

      if (currentProgress < 30) {
        setStatusText('INITIALIZING QUANTUM CORE...');
      } else if (currentProgress < 65) {
        setStatusText('CONNECTING SECURE OS NODES...');
      } else if (currentProgress < 90) {
        setStatusText('SYNCHRONIZING DIGITAL ASSETS...');
      } else {
        setStatusText('SYSTEM READY');
      }

      if (currentProgress >= 100) {
        clearInterval(interval);
        // Step 9: Finish sequence (logo flash & expansion glow)
        setPhase('finish');
        setTimeout(() => {
          setPhase('done');
          if (onComplete) onComplete();
        }, 500);
      }
    }, 20);

    return () => clearInterval(interval);
  }, [phase, onComplete]);

  // Orbiting Particles & Sweep Energy Canvas Animation (60 FPS)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Generate orbiting particles
    const particleCount = 28;
    const particles = Array.from({ length: particleCount }, (_, i) => {
      const angle = (i / particleCount) * Math.PI * 2;
      const radius = 90 + Math.random() * 80;
      const speed = (0.005 + Math.random() * 0.008) * (i % 2 === 0 ? 1 : -1);
      const size = 1.2 + Math.random() * 2;
      const alpha = 0.3 + Math.random() * 0.7;
      const isBlue = Math.random() > 0.4;
      return { angle, radius, speed, size, alpha, isBlue };
    });

    // Sweep laser scan line parameters
    let scanLineY = -100;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;

      // Draw Orbiting Particles (Phases: logo, loading, finish)
      if (phase === 'logo' || phase === 'loading' || phase === 'finish') {
        particles.forEach((p) => {
          p.angle += p.speed;
          const x = centerX + Math.cos(p.angle) * p.radius;
          const y = centerY + Math.sin(p.angle) * p.radius * 0.45; // slightly elliptical 3D tilt

          ctx.save();
          ctx.beginPath();
          ctx.arc(x, y, p.size, 0, Math.PI * 2);
          const color = p.isBlue ? 'rgba(96, 165, 250,' : 'rgba(123, 92, 255,';
          ctx.fillStyle = `${color}${p.alpha})`;
          ctx.shadowColor = p.isBlue ? '#3B82F6' : '#7B5CFF';
          ctx.shadowBlur = 10;
          ctx.fill();
          ctx.restore();
        });

        // Draw Thin Energy Scan Lines sweeping top to bottom
        scanLineY += 4;
        if (scanLineY > height + 100) scanLineY = -100;

        ctx.save();
        const scanGrad = ctx.createLinearGradient(0, scanLineY, width, scanLineY);
        scanGrad.addColorStop(0, 'rgba(123, 92, 255, 0)');
        scanGrad.addColorStop(0.3, 'rgba(123, 92, 255, 0.15)');
        scanGrad.addColorStop(0.5, 'rgba(96, 165, 250, 0.4)');
        scanGrad.addColorStop(0.7, 'rgba(123, 92, 255, 0.15)');
        scanGrad.addColorStop(1, 'rgba(123, 92, 255, 0)');

        ctx.strokeStyle = scanGrad;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(0, scanLineY);
        ctx.lineTo(width, scanLineY);
        ctx.stroke();
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [phase]);

  if (phase === 'done') return null;

  return (
    <AnimatePresence>
      <motion.div
        key="rival-loader-screen"
        initial={{ opacity: 1 }}
        animate={{ opacity: phase === 'finish' ? 0.95 : 1 }}
        exit={{ opacity: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }}
        className="fixed inset-0 z-[9999] bg-[#030305] flex flex-col items-center justify-center overflow-hidden font-sans select-none"
      >
        {/* Canvas for Orbiting Particles & Energy Sweep Lines */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none z-10"
        />

        {/* Ambient Breathing Background Glow */}
        <motion.div
          animate={{
            scale: phase === 'finish' ? [1, 1.4, 1.8] : [1, 1.15, 1],
            opacity: phase === 'finish' ? [0.6, 0.9, 0] : [0.35, 0.6, 0.35],
          }}
          transition={{
            duration: phase === 'finish' ? 0.5 : 2.5,
            repeat: phase === 'finish' ? 0 : Infinity,
            ease: 'easeInOut',
          }}
          className="absolute w-[500px] h-[500px] rounded-full bg-radial from-[#7B5CFF]/30 via-[#3B82F6]/15 to-transparent blur-[90px] pointer-events-none"
        />

        {/* Secondary Deep Blue Atmosphere Layer */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(30,27,75,0.4),transparent_70%)] pointer-events-none" />

        {/* FINE GRID LINES BACKGROUND */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1d360a_1px,transparent_1px),linear-gradient(to_bottom,#1f1d360a_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

        {/* CENTER CONTAINER */}
        <div className="relative z-20 flex flex-col items-center justify-center px-6">
          
          {/* STEP 2: Tiny Glowing Center Point */}
          {(phase === 'point' || phase === 'ring') && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ 
                scale: phase === 'point' ? [0, 1.5, 1] : 2, 
                opacity: phase === 'point' ? [0, 1, 0.8] : 0.4
              }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="absolute w-4 h-4 rounded-full bg-[#7B5CFF] shadow-[0_0_30px_#7B5CFF,0_0_60px_#3B82F6] z-30"
            />
          )}

          {/* STEP 3: Expanding Soft Ring */}
          {(phase === 'ring' || phase === 'logo' || phase === 'loading' || phase === 'finish') && (
            <motion.div
              initial={{ scale: 0.2, opacity: 0 }}
              animate={{
                scale: phase === 'finish' ? 2.5 : 1,
                opacity: phase === 'finish' ? 0 : [0, 0.8, 0.5],
              }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="absolute w-48 h-48 rounded-full border border-[#7B5CFF]/40 shadow-[0_0_40px_rgba(123,92,255,0.35)] pointer-events-none"
            />
          )}

          {/* STEP 4: Rival Space Logo & Emblem */}
          {(phase === 'logo' || phase === 'loading' || phase === 'finish') && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 10 }}
              animate={{ 
                scale: phase === 'finish' ? 1.05 : 1, 
                opacity: 1, 
                y: 0 
              }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center space-y-5 text-center"
            >
              {/* Metallic Glass Emblem Icon */}
              <div className="relative group">
                {/* Outer Glow Halo */}
                <div className="absolute -inset-2 rounded-3xl bg-gradient-to-r from-[#7B5CFF] via-[#3B82F6] to-[#A855F7] opacity-40 blur-lg animate-pulse" />
                
                <div className="relative w-20 h-20 rounded-3xl bg-[#090814]/90 border border-white/15 p-0.5 shadow-2xl backdrop-blur-xl flex items-center justify-center overflow-hidden">
                  {/* Glass Shimmer Highlight Line */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none" />

                  {/* Core Emblem graphic */}
                  <div className="w-full h-full rounded-[22px] bg-gradient-to-b from-[#181636] to-[#0a0918] flex items-center justify-center relative">
                    {/* Concentric Orbital Rings */}
                    <div className="absolute w-12 h-12 rounded-full border border-[#7B5CFF]/60 border-t-transparent animate-spin" style={{ animationDuration: '6s' }} />
                    <div className="absolute w-8 h-8 rounded-full border border-[#3B82F6]/70 border-b-transparent animate-spin" style={{ animationDuration: '3s', animationDirection: 'reverse' }} />
                    
                    {/* Glowing Center Core */}
                    <div className="w-4 h-4 rounded-full bg-gradient-to-tr from-[#7B5CFF] to-[#60A5FA] shadow-[0_0_15px_#7B5CFF]" />
                  </div>
                </div>
              </div>

              {/* RIVAL SPACE Wordmark */}
              <div className="space-y-1">
                <motion.h1 
                  animate={{
                    textShadow: phase === 'finish' 
                      ? '0 0 25px rgba(123,92,255,0.9), 0 0 50px rgba(96,165,250,0.8)' 
                      : '0 0 15px rgba(123,92,255,0.4)',
                  }}
                  className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-100 to-indigo-200 tracking-[0.25em] uppercase font-sans"
                >
                  Rival Space
                </motion.h1>
                <div className="flex items-center justify-center gap-2 text-[10px] font-mono tracking-[0.3em] text-[#7B5CFF] font-semibold uppercase">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#7B5CFF] animate-ping" />
                  <span>Digital OS v3.4</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 8: Sleek Loading Progress Indicator */}
          {(phase === 'loading' || phase === 'finish') && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="mt-8 flex flex-col items-center space-y-3 w-64"
            >
              {/* Progress Bar Container */}
              <div className="relative w-full h-1.5 rounded-full bg-zinc-900/90 border border-zinc-800/80 overflow-hidden shadow-inner p-[1px]">
                {/* Filled Gradient Bar */}
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-[#7B5CFF] via-[#a855f7] to-[#3B82F6] relative shadow-[0_0_12px_#7B5CFF]"
                  style={{ width: `${progress}%` }}
                  transition={{ ease: 'easeOut' }}
                >
                  {/* Leading Light Head Sparkle */}
                  <div className="absolute right-0 top-0 bottom-0 w-3 bg-white blur-[2px] rounded-full shadow-[0_0_8px_#ffffff]" />
                </motion.div>
              </div>

              {/* Status & Percentage Row */}
              <div className="flex items-center justify-between w-full text-[10px] font-mono text-zinc-400 font-medium">
                <span className="tracking-wider uppercase text-zinc-400 truncate max-w-[180px]">
                  {statusText}
                </span>
                <span className="font-bold text-[#7B5CFF] tracking-widest">
                  {progress}%
                </span>
              </div>
            </motion.div>
          )}
        </div>

        {/* BOTTOM DIGITAL OS FOOTER BRANDING */}
        <div className="absolute bottom-6 z-20 flex items-center gap-2 text-[10px] font-mono text-zinc-400 tracking-widest uppercase opacity-70">
          <Cpu className="w-3.5 h-3.5 text-[#7B5CFF]" />
          <span>NEURAL ARCHITECTURE CORE • 60 FPS</span>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
