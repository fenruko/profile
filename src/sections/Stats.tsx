import { motion, useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { Calendar, User, Code2, Users } from 'lucide-react';

interface StatItemProps {
  icon: React.ElementType;
  value: number;
  suffix?: string;
  label: string;
  delay: number;
}

function StatItem({ icon: Icon, value, suffix = '', label, delay }: StatItemProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    const duration = 2000;
    const steps = 60;
    const increment = value / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [isInView, value]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] as const }}
      className="card-glass rounded-2xl p-6 text-center group hover:-translate-y-1 transition-transform duration-300"
    >
      <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mx-auto mb-4 group-hover:bg-white/10 transition-colors">
        <Icon className="w-6 h-6 text-white/70" />
      </div>
      <div className="font-mono text-4xl md:text-5xl font-bold mb-2">
        {count}{suffix}
      </div>
      <div className="text-white/50 text-sm">{label}</div>
    </motion.div>
  );
}

const stats = [
  { icon: Calendar, value: 2020, suffix: '', label: 'Joined Discord' },
  { icon: User, value: 17, suffix: '', label: 'Years Old' },
  { icon: Code2, value: 2026, suffix: '', label: 'Created Rift' },
  { icon: Users, value: 100, suffix: '+', label: 'Friends Made' },
];

export function Stats() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold">Quick Stats</h2>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {stats.map((stat, index) => (
            <StatItem
              key={stat.label}
              icon={stat.icon}
              value={stat.value}
              suffix={stat.suffix}
              label={stat.label}
              delay={index * 0.1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
