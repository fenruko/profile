import { motion } from 'framer-motion';
import { Bot, ArrowRight } from 'lucide-react';

export function FeaturedProject() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold">Project</h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] as const }}
          className="relative"
        >
          <div 
            className="absolute -inset-1 rounded-3xl blur-xl opacity-20"
            style={{
              background: 'linear-gradient(135deg, #5865F2 0%, #EB459E 100%)',
            }}
          />

          <div className="relative card-glass rounded-3xl p-8 md:p-12 text-center">
            <motion.div
              className="w-24 h-24 md:w-32 md:h-32 mx-auto rounded-3xl flex items-center justify-center mb-6"
              style={{
                background: 'linear-gradient(135deg, #5865F2 0%, #EB459E 100%)',
              }}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <Bot className="w-12 h-12 md:w-16 md:h-16 text-white" />
            </motion.div>

            <div className="flex items-center justify-center gap-3 mb-4">
              <h3 className="text-3xl md:text-4xl font-bold">Rift</h3>
              <span className="px-2 py-0.5 rounded-md bg-[#5865F2] text-xs font-bold uppercase tracking-wide">
                Bot
              </span>
            </div>

            <p className="text-white/60 text-lg mb-8 max-w-md mx-auto">
              A Discord bot I built. Check it out.
            </p>

            <motion.a
              href="https://rift.baby"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white transition-all duration-300 group"
              style={{
                background: 'linear-gradient(135deg, #5865F2 0%, #EB459E 100%)',
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              rift.baby
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
