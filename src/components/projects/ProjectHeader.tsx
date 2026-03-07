import { Project } from '../../lib/types/projects';

interface ProjectHeaderProps {
  project: Project;
}

export default function ProjectHeader({ project }: ProjectHeaderProps) {
  return (
    <div className="border-b pb-8 mb-16" style={{ borderColor: '#E8E8E4' }}>
      <h2
        className="text-3xl lg:text-4xl mb-4"
        style={{ fontFamily: 'Georgia, serif', color: '#1A1A1A' }}
      >
        {project.name}
      </h2>
      <p className="text-lg mb-6" style={{ color: '#6B6B63' }}>{project.tagline}</p>
      <div className="flex flex-wrap gap-3">
        {project.industry.map((tag, index) => (
          <span
            key={index}
            className="px-4 py-2 border text-xs tracking-widest uppercase"
            style={{ borderColor: '#E8E8E4', color: '#6B6B63', borderRadius: '4px', letterSpacing: '0.06em' }}
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}