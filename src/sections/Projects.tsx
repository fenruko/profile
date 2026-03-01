import { motion } from 'framer-motion';
import { 
  Bot, 
  Code, 
  Database, 
  Globe, 
  Terminal, 
  Cpu,
  ExternalLink,
  Github
} from 'lucide-react';

interface Project {
  icon: React.ElementType;
  title: string;
  description: string;
  tags: string[];
  link?: string;
  github?: string;
  featured?: boolean;
}

const projects: Project[] = [
  {
    icon: Bot,
    title: 'Rift',
    description: 'A powerful Discord bot with advanced moderation, custom commands, and automation features.',
    tags: ['Discord.js', 'Node.js', 'TypeScript'],
    link: 'https://rift.baby',
    featured: true,
  },
  {
    icon: Terminal,
    title: 'CLI Tools',
    description: 'Collection of command-line utilities for developers to boost productivity.',
    tags: ['Go', 'Rust', 'Bash'],
    github: '#',
  },
  {
    icon: Database,
    title: 'Data API',
    description: 'RESTful API service for managing and querying structured data efficiently.',
    tags: ['Express', 'MongoDB', 'Redis'],
    github: '#',
  },
  {
    icon: Globe,
    title: 'Web Dashboard',
    description: 'Real-time analytics dashboard with beautiful visualizations.',
    tags: ['React', 'D3.js', 'WebSocket'],
    link: '#',
    github: '#',
  },
  {
    icon: Cpu,
    title: 'Automation Scripts',
    description: 'Smart automation tools for repetitive tasks and workflows.',
    tags: ['Python', 'Selenium', 'AWS'],
    github: '#',
  },
  {
    icon: Code,
    title: 'Open Source Libs',
    description: 'Utility libraries published for the developer community.',
    tags: ['TypeScript', 'npm', 'Jest'],
    github: '#',
  },
];

function ProjectCard({ project, index }: { project: Project; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ 
        duration: 0.5, 
        delay: index * 0.1,
        ease: [0.16, 1, 0.3, 1]
      }}
      className={`card-glass rounded-2xl p-6 group hover:-translate-y-1 transition-all duration-300 ${
        project.featured ? 'ring-1 ring-white/20' : ''
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
          <project.icon className="w-6 h-6 text-white/70" />
        </div>
        
        {/* Links */}
        <div className="flex gap-2">
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
            >
              <Github className="w-4 h-4 text-white/50" />
            </a>
          )}
          {project.link && (
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
            >
              <ExternalLink className="w-4 h-4 text-white/50" />
            </a>
          )}
        </div>
      </div>

      {/* Content */}
      <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-white/90 transition-colors">
        {project.title}
      </h3>
      <p className="text-white/60 text-sm leading-relaxed mb-4">
        {project.description}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-2">
        {project.tags.map((tag) => (
          <span
            key={tag}
            className="px-2 py-1 rounded-md bg-white/5 text-white/50 text-xs font-medium"
          >
            {tag}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

export function Projects() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-12"
        >
          <span className="text-white/50 text-sm uppercase tracking-wider font-medium">
            Portfolio
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2">
            Other Projects
          </h2>
          <p className="text-white/60 mt-4 max-w-xl mx-auto">
            A collection of projects I've built along my coding journey. 
            Each one taught me something new.
          </p>
        </motion.div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <ProjectCard key={project.title} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
