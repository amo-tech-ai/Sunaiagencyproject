import { Link } from 'react-router';

export default function Footer() {
  const companyLinks = [
    { path: '/about', label: 'About' },
    { path: '/process', label: 'Process' },
    { path: '/projects', label: 'Projects' },
    { path: '/booking', label: 'Contact' },
  ];

  const servicesLinks = [
    { path: '/services', label: 'Services' },
    { path: '/solutions', label: 'Solutions' },
    { path: '/chatbots', label: 'AI Chatbots' },
    { path: '/web-design', label: 'Web Design' },
    { path: '/mvp-builder', label: 'MVP Builder' },
    { path: '/mvp-v2', label: 'MVP Builder V2' },
    { path: '/industries', label: 'Industries' },
    { path: '/case-studies', label: 'Case Studies' },
  ];

  const agentsLinks = [
    { path: '/agents', label: 'AI Agents Overview' },
    { path: '/agents#agent-types', label: 'Agent Types' },
    { path: '/agents#system-diagram', label: 'How Agents Work' },
  ];

  const homeLinks = [
    { path: '/home-v1', label: 'Home V1' },
    { path: '/', label: 'Home V2 (Luxury)' },
    { path: '/home-v3', label: 'Home V3 (Spruced)' },
  ];

  const industriesLinks = [
    { path: '/industries/e-commerce', label: 'E-Commerce' },
    { path: '/industries/fashion', label: 'Fashion' },
    { path: '/industries/travel', label: 'Travel & Tourism' },
    { path: '/financial', label: 'Financial' },
  ];

  const resourcesLinks = [
    { path: '/style-guide', label: 'Style Guide' },
  ];

  const renderLinks = (links: { path: string; label: string }[]) => (
    <div className="space-y-3">
      {links.map((link) => (
        <Link
          key={link.path + link.label}
          to={link.path}
          className="block text-sm text-[#0A211F]/50 hover:text-[#0A211F] transition-colors text-left"
        >
          {link.label}
        </Link>
      ))}
    </div>
  );

  return (
    <footer className="border-t border-[#0A211F]/10 bg-[#F1EEEA] text-[#0A211F]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          {/* Brand */}
          <div className="md:col-span-4">
            <p className="text-xl tracking-tight mb-4">Sun AI Agency</p>
            <p className="text-sm text-[#0A211F]/50 leading-relaxed">
              Premium AI services for businesses. We build real systems that solve real problems.
            </p>
          </div>

          {/* Navigation Columns */}
          <div className="md:col-span-8">
            <div className="grid grid-cols-2 md:grid-cols-6 gap-8">
              {/* Company Column */}
              <div>
                <h3 className="text-sm font-medium text-[#0A211F] mb-4 uppercase tracking-wider">
                  Company
                </h3>
                {renderLinks(companyLinks)}
              </div>

              {/* Services Column */}
              <div>
                <h3 className="text-sm font-medium text-[#0A211F] mb-4 uppercase tracking-wider">
                  Services
                </h3>
                {renderLinks(servicesLinks)}
              </div>

              {/* Industries Column */}
              <div>
                <h3 className="text-sm font-medium text-[#0A211F] mb-4 uppercase tracking-wider">
                  Industries
                </h3>
                {renderLinks(industriesLinks)}
              </div>

              {/* Agents Column */}
              <div>
                <h3 className="text-sm font-medium text-[#0A211F] mb-4 uppercase tracking-wider">
                  AI Agents
                </h3>
                {renderLinks(agentsLinks)}
              </div>

              {/* Home Column */}
              <div>
                <h3 className="text-sm font-medium text-[#0A211F] mb-4 uppercase tracking-wider">
                  Home
                </h3>
                {renderLinks(homeLinks)}
              </div>

              {/* Resources Column */}
              <div>
                <h3 className="text-sm font-medium text-[#0A211F] mb-4 uppercase tracking-wider">
                  Resources
                </h3>
                {renderLinks(resourcesLinks)}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-[#0A211F]/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-[#0A211F]/40">
            &copy; 2026 Sun AI Agency. All rights reserved.
          </p>
          <div className="flex gap-6">
            <button className="text-sm text-[#0A211F]/40 hover:text-[#0A211F] transition-colors">
              Privacy
            </button>
            <button className="text-sm text-[#0A211F]/40 hover:text-[#0A211F] transition-colors">
              Terms
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}