import { motion } from 'framer-motion';
import { Music, ExternalLink } from 'lucide-react';
import { useLanyard } from '@/hooks/useLanyard';
import { useEffect, useState } from 'react';

export function SpotifyCard() {
  const { data } = useLanyard();
  const [progress, setProgress] = useState(0);
  
  const isListening = data?.listening_to_spotify && data.spotify;
  const spotify = data?.spotify;

  useEffect(() => {
    if (!isListening || !spotify) return;

    const updateProgress = () => {
      const now = Date.now();
      const start = spotify.timestamps.start;
      const end = spotify.timestamps.end;
      const total = end - start;
      const current = now - start;
      const percentage = Math.min(100, Math.max(0, (current / total) * 100));
      setProgress(percentage);
    };

    updateProgress();
    const interval = setInterval(updateProgress, 1000);

    return () => clearInterval(interval);
  }, [isListening, spotify]);

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isListening || !spotify) {
    return (
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }}
            className="card-glass rounded-2xl p-8 flex items-center gap-6"
          >
            <div className="w-20 h-20 rounded-xl bg-white/5 flex items-center justify-center">
              <Music className="w-8 h-8 text-white/30" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white/60 mb-1">Not Listening</h3>
              <p className="text-white/40">Check back later to see what I am vibing to</p>
            </div>
          </motion.div>
        </div>
      </section>
    );
  }

  const trackUrl = `https://open.spotify.com/track/${spotify.track_id}`;
  const elapsed = Date.now() - spotify.timestamps.start;
  const total = spotify.timestamps.end - spotify.timestamps.start;

  return (
    <section className="py-16 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }}
          className="relative overflow-hidden rounded-2xl"
          style={{
            background: 'linear-gradient(135deg, rgba(29, 185, 84, 0.1) 0%, rgba(255, 255, 255, 0.03) 100%)',
            border: '1px solid rgba(29, 185, 84, 0.2)',
          }}
        >
          <div 
            className="absolute -top-20 -right-20 w-40 h-40 rounded-full blur-3xl opacity-30"
            style={{ backgroundColor: '#1DB954' }}
          />

          <div className="relative p-8">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-full bg-[#1DB954] flex items-center justify-center">
                <Music className="w-4 h-4 text-black" />
              </div>
              <span className="text-[#1DB954] font-semibold text-sm uppercase tracking-wider">
                Now Playing on Spotify
              </span>
            </div>

            <div className="flex flex-col md:flex-row gap-6">
              <motion.a
                href={trackUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="relative group flex-shrink-0"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <img
                  src={spotify.album_art_url}
                  alt={spotify.album}
                  className="w-32 h-32 md:w-40 md:h-40 rounded-xl shadow-2xl"
                />
                <div className="absolute inset-0 bg-black/40 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <ExternalLink className="w-8 h-8 text-white" />
                </div>
              </motion.a>

              <div className="flex-1 flex flex-col justify-center min-w-0">
                <a
                  href={trackUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group"
                >
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-2 truncate group-hover:text-[#1DB954] transition-colors">
                    {spotify.song}
                  </h3>
                </a>
                <p className="text-lg text-white/70 mb-1 truncate">
                  {spotify.artist}
                </p>
                <p className="text-sm text-white/50 mb-6 truncate">
                  on {spotify.album}
                </p>

                <div className="space-y-2">
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{
                        background: 'linear-gradient(90deg, #1DB954, #1ED760)',
                        width: `${progress}%`,
                      }}
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-white/40 font-mono">
                    <span>{formatTime(elapsed)}</span>
                    <span>{formatTime(total)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
