import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';

export function Footer() {
  return (
    <footer className="py-12 px-6 border-t border-white/5">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }}
          className="text-center"
        >
          <div className="mb-6">
            <h3 className="text-xl font-bold">rift.baby</h3>
          </div>

          <div className="flex justify-center gap-4 mb-8">
            <a
              href="#"
              className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
              aria-label="Discord"
            >
              <MessageCircle className="w-5 h-5 text-white/50" />
            </a>
          </div>

          <p className="text-white/30 text-sm">
            © {new Date().getFullYear()}
          </p>
        </motion.div>
      </div>
    </footer>
  );
}
