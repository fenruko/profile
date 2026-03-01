import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionTemplate, AnimatePresence } from 'framer-motion';
import { useLanyard, getAvatarUrl, getDisplayName, getAssetUrl } from '@/hooks/useLanyard';
import { Activity, Music, Gamepad2, Code, Zap, Globe, Smartphone, Monitor, Clock, History, ExternalLink, Cpu, Terminal } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Activity as DiscordActivity, SpotifyData } from '@/types/lanyard';

// --- Components ---

function ElapsedTime({ start }: { start: number }) {
  const [elapsed, setElapsed] = useState<string>('00:00');

  useEffect(() => {
    const update = () => {
      const now = Date.now();
      const diff = now - start;
      const seconds = Math.floor((diff / 1000) % 60);
      const minutes = Math.floor((diff / 1000 / 60) % 60);
      const hours = Math.floor(diff / 1000 / 60 / 60);
      
      if (hours > 0) {
        setElapsed(`${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
      } else {
        setElapsed(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
      }
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [start]);

  return <span className="font-mono text-xs opacity-80">{elapsed}</span>;
}

function ActivityCard({ activity, type }: { activity: any, type: 'spotify' | 'game' | 'code' }) {
  const isSpotify = type === 'spotify';
  let imageUrl = null;
  let smallImageUrl = null;

  if (isSpotify) {
    imageUrl = activity.album_art_url;
  } else {
    imageUrl = getAssetUrl(activity.application_id, activity.assets?.large_image);
    smallImageUrl = getAssetUrl(activity.application_id, activity.assets?.small_image);
  }

  if (!imageUrl) {
    if (type === 'code') imageUrl = 'https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/visual-studio-code/visual-studio-code.png';
  }

  return (
    <motion.div 
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="relative group flex items-center gap-4 p-4 bg-white/[0.05] border border-white/20 rounded-2xl backdrop-blur-2xl hover:bg-white/10 hover:border-white/40 transition-all min-w-[280px] shadow-2xl overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      
      <div className="relative shrink-0">
        <div className="w-16 h-16 rounded-xl overflow-hidden shadow-2xl bg-neutral-900 border border-white/10">
          {imageUrl ? (
            <img src={imageUrl} alt="Asset" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-white/10">
              {type === 'game' && <Gamepad2 className="w-8 h-8 opacity-50" />}
            </div>
          )}
        </div>
        {smallImageUrl && (
          <motion.div 
            initial={{ scale: 0 }} animate={{ scale: 1 }}
            className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full border-2 border-black bg-neutral-900 overflow-hidden shadow-xl"
          >
            <img src={smallImageUrl} alt="Small" className="w-full h-full object-cover" />
          </motion.div>
        )}
      </div>

      <div className="flex flex-col min-w-0 flex-1 relative z-10">
        <div className="flex items-center gap-2 mb-1">
          {isSpotify ? <Music className="w-3 h-3 text-green-400" /> : 
           type === 'code' ? <Code className="w-3 h-3 text-blue-400" /> : 
           <Gamepad2 className="w-3 h-3 text-purple-400" />}
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50 truncate">
            {isSpotify ? 'Spotify' : activity.name}
          </span>
        </div>
        
        <h3 className="text-sm font-bold text-white truncate leading-tight">
          {isSpotify ? activity.song : activity.details}
        </h3>
        
        <p className="text-[11px] text-white/50 truncate">
          {isSpotify ? activity.artist : activity.state}
        </p>

        {!isSpotify && activity.timestamps?.start && (
          <div className="flex items-center gap-1 mt-2 text-[10px] text-white/30 font-mono">
            <Clock className="w-3 h-3" />
            <ElapsedTime start={activity.timestamps.start} />
          </div>
        )}
      </div>
    </motion.div>
  );
}

function MusicHistory({ history }: { history: SpotifyData[] }) {
  if (history.length === 0) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="hidden md:flex absolute right-12 top-1/2 -translate-y-1/2 flex-col gap-6 w-72 z-[60]"
    >
      <div className="flex items-center gap-3 text-white/20 px-2">
        <div className="h-[1px] flex-1 bg-white/10" />
        <span className="text-[10px] font-mono uppercase tracking-[0.4em]">Tape_Log</span>
        <div className="h-[1px] flex-1 bg-white/10" />
      </div>
      
      {history.map((song, i) => (
        <motion.div 
          key={`${song.track_id}-${i}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="flex items-center gap-4 p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] hover:border-white/10 transition-all group cursor-default"
        >
          <div className="relative shrink-0">
            <img src={song.album_art_url} alt={song.album} className="w-12 h-12 rounded-lg opacity-40 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500 shadow-2xl" />
            <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors rounded-lg" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-bold text-white/60 group-hover:text-white transition-colors truncate">{song.song}</span>
            <span className="text-[10px] font-medium text-white/30 group-hover:text-white/50 transition-colors truncate">{song.artist}</span>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}

// --- Main Hero ---

export function Hero() {
  // --- VERIFICATION LOG ---
  console.log("%c [HERO V3] LOADED ", "background: #fff; color: #000; font-weight: bold;");

  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const { data } = useLanyard();
  const [musicHistory, setMusicHistory] = useState<SpotifyData[]>([]);
  const lastTrackId = useRef<string | null>(null);

  useEffect(() => {
    if (data?.spotify) {
      if (lastTrackId.current !== data.spotify.track_id) {
        setMusicHistory(prev => [data.spotify!, ...prev].slice(0, 5));
        lastTrackId.current = data.spotify.track_id;
      }
    }
  }, [data?.spotify]);

  const mouseX = useSpring(0, { stiffness: 300, damping: 50 });
  const mouseY = useSpring(0, { stiffness: 300, damping: 50 });
  const rotateX = useTransform(mouseY, [-500, 500], [15, -15]);
  const rotateY = useTransform(mouseX, [-500, 500], [-15, 15]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX - window.innerWidth / 2);
      mouseY.set(e.clientY - window.innerHeight / 2);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const scale = useTransform(scrollYProgress, [0, 0.8], [1, 3]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const blur = useTransform(scrollYProgress, [0, 0.5], [0, 30]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -500]);

  const status = data?.discord_status || 'offline';
  const activities = data?.activities || [];
  const spotify = data?.spotify;
  const otherActivities = activities.filter(a => a.id !== 'spotify:1' && a.name !== 'Spotify');

  return (
    <div ref={containerRef} className="h-[400vh] relative">
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-black flex flex-col items-center justify-center">
        
        {/* UNDENIABLE VERSION MARKER */}
        <div className="absolute top-4 left-4 z-[100] flex items-center gap-2 px-3 py-1 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded-full opacity-50">
          <Terminal className="w-3 h-3" />
          Build_v3.0_Active
        </div>

        {/* Scanline Overlay */}
        <div className="absolute inset-0 pointer-events-none z-[100] opacity-[0.05]"
          style={{ backgroundImage: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))', backgroundSize: '100% 2px, 3px 100%' }}
        />

        {/* Background Grid & Spotlight */}
        <div className="absolute inset-0 z-0">
          <div 
            className="absolute inset-0 opacity-[0.15]"
            style={{
              backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)',
              backgroundSize: '40px 40px',
            }}
          />
          <motion.div
            className="absolute w-[1200px] h-[1200px] bg-white/[0.05] rounded-full blur-[150px] pointer-events-none"
            style={{
              left: '50%', top: '50%',
              x: mouseX, y: mouseY,
              transform: 'translate(-50%, -50%)',
            }}
          />
        </div>

        {/* Floating Featured Badge (Rift Bot) */}
        <motion.a
          href="https://github.com/fenruko"
          target="_blank"
          style={{ x: useTransform(mouseX, [-500, 500], [30, -30]), y: useTransform(mouseY, [-500, 500], [30, -30]) }}
          className="absolute left-12 top-24 z-50 flex items-center gap-3 p-3 bg-white/10 border border-white/20 rounded-full backdrop-blur-2xl hover:bg-white text-black transition-all group shadow-2xl"
        >
          <img src="https://cdn.discordapp.com/avatars/1329184069426348052/6af3960600da4c720bf76d5346b9068b.png?size=1024" className="w-10 h-10 rounded-full border-2 border-black group-hover:scale-110 transition-transform" alt="Rift" />
          <span className="text-xs font-black uppercase tracking-widest pr-2">Rift Bot</span>
          <ExternalLink className="w-4 h-4" />
        </motion.a>

        <MusicHistory history={musicHistory.slice(1)} /> 

        {/* Core Content */}
        <motion.div 
          style={{ 
            scale, opacity, 
            filter: useMotionTemplate`blur(${blur}px)`, 
            y: contentY,
            rotateX, rotateY,
            perspective: 1000
          }}
          className="relative z-10 text-center px-4 flex flex-col items-center gap-12 w-full max-w-5xl"
        >
          {/* Avatar Area */}
          <div className="relative">
            <motion.div 
              animate={{ rotate: 360, scale: [1, 1.1, 1] }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              className="absolute -inset-12 border-2 border-dashed border-white/20 rounded-full opacity-30"
            />
            
            <div className="relative w-40 h-40 md:w-64 md:h-64 rounded-full overflow-hidden border-8 border-white ring-2 ring-black shadow-[0_0_100px_rgba(255,255,255,0.1)]">
              {data?.discord_user?.avatar ? (
                <img 
                  src={getAvatarUrl(data.discord_user.id, data.discord_user.avatar, 512)} 
                  alt="Avatar" 
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                />
              ) : (
                <div className="w-full h-full bg-neutral-900 flex items-center justify-center animate-pulse">
                   <Cpu className="w-16 h-16 text-white/10" />
                </div>
              )}
            </div>

            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex gap-4 bg-white text-black px-6 py-2 rounded-full border-4 border-black shadow-2xl font-black uppercase text-xs tracking-widest">
              {status}
              {data?.active_on_discord_mobile && <Smartphone className="w-4 h-4" />}
            </div>
          </div>

          {/* Typography */}
          <div className="space-y-4">
            <motion.h1 
              className="text-7xl md:text-[13rem] font-black tracking-tighter text-white leading-none drop-shadow-[0_0_30px_rgba(255,255,255,0.2)]"
            >
              {data?.discord_user ? getDisplayName(data.discord_user).toUpperCase() : 'LOADING'}
            </motion.h1>
            <div className="flex items-center justify-center gap-4">
              <div className="h-[2px] w-20 bg-white" />
              <p className="text-base md:text-xl text-white font-black tracking-[0.6em] uppercase">
                SYSTEM_OVERRIDE
              </p>
              <div className="h-[2px] w-20 bg-white" />
            </div>
          </div>

          {/* Activity Grid */}
          <div className="flex flex-wrap items-center justify-center gap-8 mt-4 w-full px-8">
            <AnimatePresence mode="popLayout">
              {spotify && <ActivityCard key="spotify" activity={spotify} type="spotify" />}
              {otherActivities.map((a) => (
                <ActivityCard key={a.id} activity={a} type={a.name === 'Visual Studio Code' ? 'code' : 'game'} />
              ))}
            </AnimatePresence>
          </div>

        </motion.div>

        {/* Progress Bar */}
        <div className="absolute left-12 bottom-12 h-64 w-[4px] bg-white/10 rounded-full">
          <motion.div 
            style={{ scaleY: scrollYProgress, transformOrigin: "top" }}
            className="w-full h-full bg-white rounded-full shadow-[0_0_15px_#fff]"
          />
        </div>

        {/* HUD Elements */}
        <div className="absolute right-12 bottom-12 text-right">
           <p className="text-xs font-black text-white uppercase tracking-[0.5em] mb-2">Build_Sequence: 003</p>
           <div className="flex items-center justify-end gap-2">
             <div className="w-12 h-2 bg-white" />
             <div className="w-4 h-2 bg-white/30" />
             <div className="w-4 h-2 bg-white/30" />
           </div>
        </div>
      </div>
    </div>
  );
}
