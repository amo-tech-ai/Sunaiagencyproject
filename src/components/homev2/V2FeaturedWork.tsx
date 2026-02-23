interface V2FeaturedWorkProps {
  onNavigate?: (page: string) => void;
}

export default function V2FeaturedWork({ onNavigate }: V2FeaturedWorkProps) {
  const projects = [
    {
      title: 'Enterprise AI Platform',
      category: 'Financial Services',
      image: 'https://images.unsplash.com/photo-1768483538267-fce52de424d5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      size: 'large', // spans 2 columns
    },
    {
      title: 'Healthcare Analytics',
      category: 'Healthcare',
      image: 'https://images.unsplash.com/photo-1759661966728-4a02e3c6ed91?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      size: 'medium',
    },
    {
      title: 'Smart Automation',
      category: 'Legal Tech',
      image: 'https://images.unsplash.com/photo-1582138825658-fb952c08b282?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      size: 'medium',
    },
    {
      title: 'E-commerce AI',
      category: 'Retail',
      image: 'https://images.unsplash.com/photo-1660165458059-57cfb6cc87e5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      size: 'medium',
    },
    {
      title: 'Workspace Intelligence',
      category: 'Enterprise',
      image: 'https://images.unsplash.com/photo-1742440710193-3547e0b9d4db?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      size: 'medium',
    },
    {
      title: 'Product Design System',
      category: 'Design',
      image: 'https://images.unsplash.com/photo-1569380619385-78d6254c7e62?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      size: 'large',
    },
  ];

  return (
    <section className="bg-white py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <div className="inline-block px-4 py-2 bg-[#84CC16]/10 border border-[#84CC16]/20 mb-6">
            <span className="text-xs uppercase tracking-[0.2em] text-[#84CC16] font-medium">
              Featured Work
            </span>
          </div>
          
          <h2 className="font-['Playfair_Display'] text-4xl lg:text-6xl font-bold text-[#1A1A1A] leading-[1.05] mb-6">
            We love making things
          </h2>
          
          <p className="text-xl text-[#666666] leading-relaxed font-['Lora']">
            Real AI products deployed across industries, delivering measurable business outcomes.
          </p>
        </div>
        
        {/* Masonry Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <div 
              key={index}
              className={`group cursor-pointer relative overflow-hidden ${
                project.size === 'large' ? 'md:col-span-2' : ''
              } ${index === 0 ? 'md:row-span-2' : ''}`}
              onClick={() => onNavigate?.('projects')}
            >
              {/* Image */}
              <div className={`relative overflow-hidden ${
                project.size === 'large' && index === 0 ? 'aspect-[4/5]' : 
                project.size === 'large' ? 'aspect-[21/9]' : 
                'aspect-square'
              }`}>
                <img 
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-8 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <div className="text-xs uppercase tracking-[0.2em] text-[#84CC16] font-medium mb-2">
                      {project.category}
                    </div>
                    <h3 className="text-2xl font-['Playfair_Display'] font-bold text-white">
                      {project.title}
                    </h3>
                  </div>
                </div>
              </div>
              
              {/* Always Visible Title (Mobile) */}
              <div className="md:hidden mt-4 space-y-2">
                <div className="text-xs uppercase tracking-[0.2em] text-[#84CC16] font-medium">
                  {project.category}
                </div>
                <h3 className="text-xl font-['Playfair_Display'] font-bold text-[#1A1A1A]">
                  {project.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
        
        {/* View All Link */}
        <div className="text-center mt-16">
          <button
            onClick={() => onNavigate?.('projects')}
            className="px-8 py-4 border-2 border-[#1A1A1A] text-[#1A1A1A] font-medium text-base hover:bg-[#1A1A1A] hover:text-white transition-colors inline-flex items-center gap-2"
          >
            <span>View All Projects</span>
            <span className="text-[#84CC16]">→</span>
          </button>
        </div>
      </div>
    </section>
  );
}