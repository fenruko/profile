import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionTemplate, AnimatePresence } from 'framer-motion';
import { useLanyard, getAvatarUrl, getDisplayName, getAssetUrl } from '@/hooks/useLanyard';
import { Activity, Music, Gamepad2, Code, Zap, Globe, Smartphone, Monitor, Clock, History } from 'lucide-react';
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
  
  // Resolve Image
  let imageUrl = null;
  let smallImageUrl = null;

  if (isSpotify) {
    imageUrl = activity.album_art_url;
  } else {
    imageUrl = getAssetUrl(activity.application_id, activity.assets?.large_image);
    smallImageUrl = getAssetUrl(activity.application_id, activity.assets?.small_image);
  }

  // Fallbacks
  if (!imageUrl) {
    if (type === 'code') imageUrl = 'https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/visual-studio-code/visual-studio-code.png';
    // generic game icon could go here
  }

  return (
    <motion.div 
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 20, opacity: 0 }}
      className="relative group flex items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md hover:bg-white/10 transition-all min-w-[300px] max-w-sm overflow-hidden"
    >
      <div className="relative shrink-0">
        <div className="w-16 h-16 rounded-xl overflow-hidden shadow-lg bg-neutral-900">
          {imageUrl ? (
            <img src={imageUrl} alt="Asset" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-white/10">
              {type === 'game' && <Gamepad2 className="w-8 h-8 opacity-50" />}
            </div>
          )}
        </div>
        {smallImageUrl && (
          <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full border-2 border-black bg-neutral-900 overflow-hidden" title={activity.assets?.small_text}>
            <img src={smallImageUrl} alt="Small Asset" className="w-full h-full object-cover" />
          </div>
        )}
      </div>

      <div className="flex flex-col min-w-0 flex-1">
        <div className="flex items-center gap-2 mb-1">
          {isSpotify ? <Music className="w-3 h-3 text-green-400" /> : 
           type === 'code' ? <Code className="w-3 h-3 text-blue-400" /> : 
           <Gamepad2 className="w-3 h-3 text-purple-400" />}
          <span className="text-xs font-bold uppercase tracking-wider text-white/50 truncate">
            {isSpotify ? 'Spotify' : activity.name}
          </span>
        </div>
        
        <h3 className="text-sm font-bold text-white truncate" title={isSpotify ? activity.song : activity.details}>
          {isSpotify ? activity.song : activity.details}
        </h3>
        
        <p className="text-xs text-white/60 truncate" title={isSpotify ? activity.artist : activity.state}>
          {isSpotify ? activity.artist : activity.state}
        </p>

        {/* Timestamps */}
        {!isSpotify && activity.timestamps?.start && (
          <div className="flex items-center gap-1 mt-2 text-xs text-white/40">
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
      className="hidden xl:flex absolute right-8 top-1/2 -translate-y-1/2 flex-col gap-4 w-64"
    >
      <div className="flex items-center gap-2 text-white/40 mb-2 px-2">
        <History className="w-4 h-4" />
        <span className="text-xs font-mono uppercase tracking-widest">Session History</span>
      </div>
      
      {history.map((song, i) => (
        <motion.div 
          key={`${song.track_id}-${i}`}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.1 }}
          className="flex items-center gap-3 p-2 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 transition-colors"
        >
          <img src={song.album_art_url} alt={song.album} className="w-10 h-10 rounded-md opacity-75 grayscale group-hover:grayscale-0 transition-all" />
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-medium text-white/80 truncate">{song.song}</span>
            <span className="text-[10px] text-white/50 truncate">{song.artist}</span>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}

// --- Main Hero ---

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const { data } = useLanyard();
  const [musicHistory, setMusicHistory] = useState<SpotifyData[]>([]);
  const lastTrackId = useRef<string | null>(null);

  // Music History Logic
  useEffect(() => {
    if (data?.spotify) {
      if (lastTrackId.current && lastTrackId.current !== data.spotify.track_id) {
        // Track changed, add previous (we don't have previous data unless we stored it, 
        // but actually we want to store the *current* one when it's about to change? 
        // Simpler: Just add the *new* one to history effectively or keep a running list.
        // Better: When track changes, we lose the old data. We should probably push to history *before* update?
        // Actually, we can just maintain a list of "seen" tracks.
      }
      
      if (lastTrackId.current !== data.spotify.track_id) {
        setMusicHistory(prev => {
          const newHistory = [data.spotify!, ...prev].slice(0, 5);
          // Remove duplicates if any (though track_id check handles unique events)
          return newHistory;
        });
        lastTrackId.current = data.spotify.track_id;
      }
    }
  }, [data?.spotify]);

  // Mouse position
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const mouseX = useSpring(0, { stiffness: 500, damping: 100 });
  const mouseY = useSpring(0, { stiffness: 500, damping: 100 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const targetX = clientX - (window.innerWidth / 2);
      const targetY = clientY - (window.innerHeight / 2);
      setMousePosition({ x: clientX, y: clientY });
      mouseX.set(targetX);
      mouseY.set(targetY);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  // Transforms
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.5]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const blur = useTransform(scrollYProgress, [0, 0.5], [0, 10]);
  const y = useTransform(scrollYProgress, [0, 1], [0, -50]);

  // Activity Filtering
  const status = data?.discord_status || 'offline';
  const activities = data?.activities || [];
  const spotify = data?.spotify;

  // Filter out Spotify from regular activities to avoid duplication if it appears in both
  const otherActivities = activities.filter(a => a.id !== 'spotify:1' && a.name !== 'Spotify');

  return (
    <div ref={containerRef} className="h-[150vh] relative">
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-black flex flex-col items-center justify-center">
        
        {/* Background */}
        <div className="absolute inset-0 z-0">
          <div 
            className="absolute inset-0 opacity-[0.15]"
            style={{
              backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)',
              backgroundSize: '40px 40px',
            }}
          />
          <motion.div
            className="absolute w-[800px] h-[800px] bg-white/[0.03] rounded-full blur-[100px] pointer-events-none"
            style={{
              left: '50%',
              top: '50%',
              x: mouseX,
              y: mouseY,
              transform: 'translate(-50%, -50%)',
            }}
          />
        </div>

        {/* Music History (Desktop) */}
        <MusicHistory history={musicHistory.slice(1)} /> 

        {/* Main Content */}
        <motion.div 
          style={{ scale, opacity, filter: useMotionTemplate`blur(${blur}px)`, y }}
          className="relative z-10 text-center px-4 flex flex-col items-center gap-8 w-full max-w-4xl"
        >
          {/* Avatar */}
          <div className="relative group">
            <div className={cn(
              "absolute -inset-4 rounded-full opacity-20 blur-xl transition-all duration-500",
              status === 'online' ? "bg-green-500" : 
              status === 'dnd' ? "bg-red-500" :
              status === 'idle' ? "bg-yellow-500" : "bg-gray-500"
            )} />
            
            <div className="relative w-32 h-32 md:w-48 md:h-48 rounded-full overflow-hidden border-2 border-white/10 ring-4 ring-black shadow-2xl">
              {data?.discord_user?.avatar ? (
                <img 
                  src={getAvatarUrl(data.discord_user.id, data.discord_user.avatar, 512)} 
                  alt="Avatar" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              ) : (
                <div className="w-full h-full bg-neutral-900 flex items-center justify-center">
                  <div className="w-20 h-20 rounded-full bg-white/10 animate-pulse" />
                </div>
              )}
            </div>

            {/* Platform Icons */}
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex gap-2 bg-black/80 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
              {data?.active_on_discord_mobile && <Smartphone className="w-3 h-3 text-white/60" />}
              {data?.active_on_discord_desktop && <Monitor className="w-3 h-3 text-white/60" />}
              {data?.active_on_discord_web && <Globe className="w-3 h-3 text-white/60" />}
            </div>
          </div>

          {/* Name & Title */}
          <div className="space-y-2">
            <h1 className="text-6xl md:text-9xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40">
              {data?.discord_user ? getDisplayName(data.discord_user) : 'LOADING...'}
            </h1>
            <p className="text-xl md:text-2xl text-white/40 font-mono tracking-widest uppercase">
              17-Year-Old Developer
            </p>
          </div>

          {/* ACTIVITY DOCK */}
          <div className="flex flex-wrap items-center justify-center gap-4 mt-8 w-full">
            <AnimatePresence mode="popLayout">
              {spotify && (
                <ActivityCard key="spotify" activity={spotify} type="spotify" />
              )}
              
              {otherActivities.map((activity) => (
                <ActivityCard 
                  key={activity.id} 
                  activity={activity} 
                  type={activity.name === 'Visual Studio Code' ? 'code' : 'game'} 
                />
              ))}
            </AnimatePresence>
          </div>

        </motion.div>

        {/* Scroll Indicator */}
        <motion.div 
          style={{ opacity: useTransform(scrollYProgress, [0, 0.2], [1, 0]) }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-xs font-mono text-white/30 uppercase tracking-widest">Scroll to explore</span>
          <div className="w-[1px] h-12 bg-gradient-to-b from-white/50 to-transparent" />
        </motion.div>
      </div>
    </div>
  );
}
