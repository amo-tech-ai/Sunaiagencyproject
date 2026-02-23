import { Link, useLocation, useNavigate } from 'react-router';

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/solutions', label: 'Solutions' },
    { path: '/industries', label: 'Industries' },
    { path: '/agents', label: 'AI Agents' },
    { path: '/projects', label: 'Projects' },
    { path: '/about', label: 'About' },
    { path: '/booking', label: 'Contact' },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header className="border-b border-gray-200 bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <Link
            to="/"
            className="text-xl tracking-tight hover:text-gray-600 transition-colors"
          >
            Sun AI Agency
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.slice(1, -1).map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`text-sm transition-colors ${
                  isActive(item.path) ? 'text-gray-900' : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                {item.label}
              </Link>
            ))}
            <Link
              to="/booking"
              className="bg-gray-900 text-white px-6 py-2.5 text-sm hover:bg-gray-800 transition-colors"
            >
              Contact
            </Link>
          </nav>

          {/* Mobile Navigation */}
          <nav className="md:hidden">
            <select
              value={location.pathname}
              onChange={(e) => navigate(e.target.value)}
              className="text-sm border border-gray-300 px-3 py-2 bg-white"
            >
              {navItems.map((item) => (
                <option key={item.path} value={item.path}>
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
