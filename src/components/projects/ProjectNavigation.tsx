import { useState, useEffect } from 'react';
import { Project } from '../../lib/types/projects';

interface ProjectNavigationProps {
  projects: Project[];
  activeProjectId?: string;
}

export default function ProjectNavigation({
  projects,
  activeProjectId,
}: ProjectNavigationProps) {
  const [activeId, setActiveId] = useState<string>(activeProjectId || projects[0]?.id);

  useEffect(() => {
    if (activeProjectId) {
      setActiveId(activeProjectId);
    }
  }, [activeProjectId]);

  const handleProjectClick = (projectId: string) => {
    setActiveId(projectId);
    const element = document.getElementById(projectId);
    if (element) {
      const offset = 100; // Account for sticky header
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });

      // Update URL hash
      window.history.replaceState(null, '', `#${projectId}`);
    }
  };

  return (
    <nav className="sticky top-0 z-40 bg-[#FDFCFB]/95 backdrop-blur-sm border-b border-[#EFE9E4] py-6">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-16">
        <div className="flex gap-4 overflow-x-auto no-scrollbar">
          {projects.map((project) => (
            <button
              key={project.id}
              onClick={() => handleProjectClick(project.id)}
              className={`px-6 py-3 whitespace-nowrap transition-all ${
                activeId === project.id
                  ? 'bg-[#1A1A1A] text-white'
                  : 'border border-[#EFE9E4] text-[#666666] hover:border-[#1A1A1A]'
              }`}
            >
              {project.name}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
