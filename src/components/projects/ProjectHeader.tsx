import { Project } from '../../lib/types/projects';

interface ProjectHeaderProps {
  project: Project;
}

export default function ProjectHeader({ project }: ProjectHeaderProps) {
  return (
    <div className="border-b border-[#EFE9E4] pb-8 mb-16">
      <h2
        className="text-4xl lg:text-5xl text-[#1A1A1A] mb-4"
        style={{ fontFamily: 'Playfair Display, serif' }}
      >
        {project.name}
      </h2>
      <p className="text-xl text-[#666666] font-light mb-6">{project.tagline}</p>
      <div className="flex flex-wrap gap-3">
        {project.industry.map((tag, index) => (
          <span
            key={index}
            className="px-4 py-2 border border-[#EFE9E4] text-xs uppercase tracking-widest text-[#999999]"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}
