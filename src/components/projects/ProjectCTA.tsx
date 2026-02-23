interface ProjectCTAProps {
  projectName: string;
  onViewCaseStudy?: () => void;
  onStartProject?: () => void;
}

export default function ProjectCTA({
  projectName,
  onViewCaseStudy,
  onStartProject,
}: ProjectCTAProps) {
  return (
    <div className="mt-12 pt-8 border-t border-[#EFE9E4] flex flex-col sm:flex-row gap-4">
      <button
        onClick={onViewCaseStudy}
        className="px-8 py-4 bg-[#1A1A1A] text-white font-bold hover:bg-[#333] transition-all"
      >
        View Full Case Study
      </button>
      <button
        onClick={onStartProject}
        className="px-8 py-4 border border-[#1A1A1A] text-[#1A1A1A] font-bold hover:bg-[#1A1A1A] hover:text-white transition-all"
      >
        Start Similar Project
      </button>
    </div>
  );
}
