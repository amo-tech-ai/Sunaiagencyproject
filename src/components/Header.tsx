interface HeaderProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
}

export default function Header({ currentPage, setCurrentPage }: HeaderProps) {
  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'solutions', label: 'Solutions' },
    { id: 'industries', label: 'Industries' },
    { id: 'agents', label: 'AI Agents' },
    { id: 'projects', label: 'Projects' },
    { id: 'about', label: 'About' },
    { id: 'booking', label: 'Contact' },
  ];

  return (
    <header className="border-b border-gray-200 bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <button
            onClick={() => setCurrentPage('home')}
            className="text-xl tracking-tight hover:text-gray-600 transition-colors"
          >
            Sun AI Agency
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.slice(1, -1).map((item) => (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                className={`text-sm transition-colors ${
                  currentPage === item.id ? 'text-gray-900' : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                {item.label}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage('booking')}
              className="bg-gray-900 text-white px-6 py-2.5 text-sm hover:bg-gray-800 transition-colors"
            >
              Contact
            </button>
          </nav>

          {/* Mobile Navigation */}
          <nav className="md:hidden">
            <select
              value={currentPage}
              onChange={(e) => setCurrentPage(e.target.value)}
              className="text-sm border border-gray-300 px-3 py-2 bg-white"
            >
              {navItems.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
          </nav>
        </div>
      </div>
    </header>
  );
}