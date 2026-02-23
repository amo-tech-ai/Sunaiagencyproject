interface FooterProps {
  setCurrentPage: (page: string) => void;
}

export default function Footer({ setCurrentPage }: FooterProps) {
  const companyLinks = [
    { id: 'about', label: 'About' },
    { id: 'process', label: 'Process' },
    { id: 'projects', label: 'Projects' },
    { id: 'booking', label: 'Contact' },
  ];

  const servicesLinks = [
    { id: 'solutions', label: 'Solutions' },
    { id: 'chatbots', label: 'AI Chatbots' },
    { id: 'industries', label: 'Industries' },
    { id: 'case-studies', label: 'Case Studies' },
  ];

  const agentsLinks = [
    { id: 'agents', label: 'AI Agents Overview' },
    { id: 'agents', label: 'Agent Types', hash: '#agent-types' },
    { id: 'agents', label: 'How Agents Work', hash: '#system-diagram' },
  ];

  const homeLinks = [
    { id: 'home', label: 'Home V1' },
    { id: 'home-v2', label: 'Home V2 (Luxury)' },
  ];

  const industriesLinks = [
    { id: 'ecommerce', label: 'E-Commerce' },
    { id: 'fashion', label: 'Fashion' },
    { id: 'travel', label: 'Travel & Tourism' },
  ];

  const resourcesLinks = [
    { id: 'style-guide', label: 'Style Guide' },
  ];

  return (
    <footer className="border-t border-gray-800 bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          {/* Brand */}
          <div className="md:col-span-4">
            <p className="text-xl tracking-tight mb-4">Sun AI Agency</p>
            <p className="text-sm text-gray-400 leading-relaxed">
              Premium AI services for businesses. We build real systems that solve real problems.
            </p>
          </div>

          {/* Navigation Columns */}
          <div className="md:col-span-8">
            <div className="grid grid-cols-2 md:grid-cols-6 gap-8">
              {/* Company Column */}
              <div>
                <h3 className="text-sm font-medium text-white mb-4 uppercase tracking-wider">
                  Company
                </h3>
                <div className="space-y-3">
                  {companyLinks.map((link) => (
                    <button
                      key={link.id}
                      onClick={() => setCurrentPage(link.id)}
                      className="block text-sm text-gray-400 hover:text-white transition-colors text-left"
                    >
                      {link.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Services Column */}
              <div>
                <h3 className="text-sm font-medium text-white mb-4 uppercase tracking-wider">
                  Services
                </h3>
                <div className="space-y-3">
                  {servicesLinks.map((link) => (
                    <button
                      key={link.id}
                      onClick={() => setCurrentPage(link.id)}
                      className="block text-sm text-gray-400 hover:text-white transition-colors text-left"
                    >
                      {link.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Industries Column */}
              <div>
                <h3 className="text-sm font-medium text-white mb-4 uppercase tracking-wider">
                  Industries
                </h3>
                <div className="space-y-3">
                  {industriesLinks.map((link) => (
                    <button
                      key={link.id}
                      onClick={() => setCurrentPage(link.id)}
                      className="block text-sm text-gray-400 hover:text-white transition-colors text-left"
                    >
                      {link.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Agents Column */}
              <div>
                <h3 className="text-sm font-medium text-white mb-4 uppercase tracking-wider">
                  AI Agents
                </h3>
                <div className="space-y-3">
                  {agentsLinks.map((link, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentPage(link.id)}
                      className="block text-sm text-gray-400 hover:text-white transition-colors text-left"
                    >
                      {link.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Home Column */}
              <div>
                <h3 className="text-sm font-medium text-white mb-4 uppercase tracking-wider">
                  Home
                </h3>
                <div className="space-y-3">
                  {homeLinks.map((link) => (
                    <button
                      key={link.id}
                      onClick={() => setCurrentPage(link.id)}
                      className="block text-sm text-gray-400 hover:text-white transition-colors text-left"
                    >
                      {link.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Resources Column */}
              <div>
                <h3 className="text-sm font-medium text-white mb-4 uppercase tracking-wider">
                  Resources
                </h3>
                <div className="space-y-3">
                  {resourcesLinks.map((link) => (
                    <button
                      key={link.id}
                      onClick={() => setCurrentPage(link.id)}
                      className="block text-sm text-gray-400 hover:text-white transition-colors text-left"
                    >
                      {link.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500">
            © 2026 Sun AI Agency. All rights reserved.
          </p>
          <div className="flex gap-6">
            <button className="text-sm text-gray-500 hover:text-white transition-colors">
              Privacy
            </button>
            <button className="text-sm text-gray-500 hover:text-white transition-colors">
              Terms
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}