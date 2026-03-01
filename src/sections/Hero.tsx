import { motion } from 'framer-motion';
import { useLanyard, getAvatarUrl, getDisplayName, getStatusColor, getStatusLabel } from '@/hooks/useLanyard';
import type { DiscordStatus } from '@/types/lanyard';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  },
};

export function Hero() {
  const { data } = useLanyard();

  const status: DiscordStatus = data?.discord_status || 'offline';
  const statusColor = getStatusColor(status);
  const avatarUrl = data?.discord_user?.avatar 
    ? getAvatarUrl(data.discord_user.id, data.discord_user.avatar, 512)
    : null;
  const displayName = data?.discord_user ? getDisplayName(data.discord_user) : 'Loading...';
  const username = data?.discord_user?.username || '';

  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.02) 0%, transparent 70%)',
        }}
      />

      <motion.div
        className="text-center z-10 px-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="mb-8">
          <div className="relative inline-block">
            <div
              className="absolute inset-0 rounded-full status-ring-glow"
              style={{ 
                color: statusColor,
                transform: 'scale(1.15)',
              }}
            />
            
            <div
              className="absolute inset-0 rounded-full status-ring"
              style={{
                border: `4px solid ${statusColor}`,
                transform: 'scale(1.1)',
                boxShadow: `0 0 30px ${statusColor}40`,
              }}
            />
            
            <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden bg-white/5">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={displayName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="w-20 h-20 rounded-full bg-white/10 animate-pulse" />
                </div>
              )}
            </div>

            <div
              className="absolute bottom-2 right-2 w-6 h-6 rounded-full border-4 border-black"
              style={{ backgroundColor: statusColor }}
            />
          </div>
        </motion.div>

        <motion.h1 
          variants={itemVariants}
          className="text-4xl md:text-6xl font-extrabold tracking-tight mb-2"
        >
          {displayName}
        </motion.h1>

        <motion.p 
          variants={itemVariants}
          className="text-lg md:text-xl text-white/60 mb-4"
        >
          @{username}
        </motion.p>

        <motion.div variants={itemVariants} className="mb-6">
          <span
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium"
            style={{
              backgroundColor: `${statusColor}15`,
              color: statusColor,
              border: `1px solid ${statusColor}30`,
            }}
          >
            <span 
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ backgroundColor: statusColor }}
            />
            {getStatusLabel(status)}
          </span>
        </motion.div>

        <motion.p 
          variants={itemVariants}
          className="text-xl md:text-2xl text-white/80 max-w-xl mx-auto leading-relaxed"
        >
          17-year-old developer
        </motion.p>
      </motion.div>

      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.6 }}
      >
        <motion.div
          className="w-6 h-10 rounded-full border-2 border-white/20 flex justify-center pt-2"
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="w-1 h-2 bg-white/40 rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  );
}
