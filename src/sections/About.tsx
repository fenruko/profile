import { motion } from 'framer-motion';

const milestones = [
  {
    year: '2020',
    title: 'Joined Discord',
    description: 'Started my journey',
  },
  {
    year: '2026',
    title: 'Created Rift',
    description: 'Built my Discord bot',
  },
];

export function About() {
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
          <h2 className="text-3xl md:text-4xl font-bold">About</h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }}
          className="card-glass rounded-2xl p-8 mb-8"
        >
          <p className="text-lg text-white/80 leading-relaxed text-center">
            I am a 17-year-old coder. I joined Discord in 2020, made a lot of friends, 
            and built Rift — a Discord bot at rift.baby.
          </p>
        </motion.div>

        <div className="relative">
          <div className="absolute left-4 top-0 bottom-0 w-px bg-white/10" />

          <div className="space-y-6">
            {milestones.map((milestone, index) => (
              <motion.div
                key={milestone.year}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ 
                  duration: 0.4, 
                  delay: index * 0.1,
                  ease: [0.16, 1, 0.3, 1] as const
                }}
                className="relative pl-12"
              >
                <div className="absolute left-0 top-1 w-8 h-8 rounded-full bg-black border-2 border-white/20 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-white/60" />
                </div>

                <div className="card-glass rounded-xl p-4">
                  <span className="text-white/40 text-sm font-mono">{milestone.year}</span>
                  <h4 className="font-semibold text-white mt-1">{milestone.title}</h4>
                  <p className="text-sm text-white/50 mt-1">{milestone.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
