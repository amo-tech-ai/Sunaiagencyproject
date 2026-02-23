import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router';
import { Menu, X } from 'lucide-react';

export default function Header() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

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
    <>
      <header className="bg-[#F1EEEA] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 md:h-18">
            {/* Logo + Hamburger pill (mobile) / Logo (desktop) */}
            <div className="flex items-center gap-3">
              {/* Mobile: Pill with hamburger + logo */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden flex items-center gap-2.5 bg-white/80 backdrop-blur-sm rounded-full pl-3 pr-4 py-2.5 shadow-sm hover:bg-white transition-colors"
                aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={mobileMenuOpen}
              >
                <div className="w-6 h-6 flex items-center justify-center">
                  {mobileMenuOpen ? (
                    <X className="w-5 h-5 text-[#0A211F]" />
                  ) : (
                    <Menu className="w-5 h-5 text-[#0A211F]" />
                  )}
                </div>
                <span className="text-[#0A211F] tracking-tight" style={{ fontSize: '1.05rem', fontWeight: 700 }}>
                  Sun AI
                </span>
              </button>

              {/* Desktop: Logo */}
              <Link
                to="/"
                className="hidden md:block text-[#0A211F] tracking-tight hover:opacity-70 transition-opacity"
                style={{ fontSize: '1.15rem', fontWeight: 700 }}
              >
                Sun AI Agency
              </Link>
            </div>

            {/* Desktop Navigation - BCG-style pill container */}
            <nav className="hidden md:flex items-center">
              <div className="flex items-center bg-white/60 backdrop-blur-sm rounded-full px-1.5 py-1.5 gap-0.5">
                {navItems.slice(1, -1).map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`px-4 py-1.5 rounded-full text-sm tracking-wide transition-all ${
                      isActive(item.path)
                        ? 'bg-[#0A211F]/8 text-[#0A211F]'
                        : 'text-[#0A211F]/60 hover:text-[#0A211F] hover:bg-[#0A211F]/4'
                    }`}
                    style={{ fontWeight: isActive(item.path) ? 500 : 400 }}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
              <Link
                to="/booking"
                className="ml-4 bg-[#0A211F] text-[#F1EEEA] px-6 py-2 rounded-full text-sm tracking-wide hover:bg-[#0A211F]/90 transition-colors"
                style={{ fontWeight: 500 }}
              >
                Contact
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-40 transition-opacity duration-300 md:hidden ${
          mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-[#0A211F]/20 backdrop-blur-sm"
          onClick={() => setMobileMenuOpen(false)}
        />

        {/* Menu Panel */}
        <div
          className={`absolute top-16 left-0 right-0 bg-[#F1EEEA] shadow-xl transition-transform duration-300 ease-out ${
            mobileMenuOpen ? 'translate-y-0' : '-translate-y-4'
          }`}
          style={{ maxHeight: 'calc(100dvh - 4rem)', overflowY: 'auto' }}
        >
          <nav className="px-6 py-6">
            {/* Primary nav links */}
            <div className="space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-4 py-3.5 rounded-xl transition-all ${
                    isActive(item.path)
                      ? 'bg-white/80 text-[#0A211F]'
                      : 'text-[#0A211F]/70 hover:bg-white/50 hover:text-[#0A211F]'
                  }`}
                >
                  <span
                    className="tracking-wide"
                    style={{ fontSize: '1.05rem', fontWeight: isActive(item.path) ? 600 : 400 }}
                  >
                    {item.label}
                  </span>
                  {isActive(item.path) && (
                    <div className="w-1.5 h-1.5 rounded-full bg-[#0A211F]" />
                  )}
                </Link>
              ))}
            </div>

            {/* Divider */}
            <div className="my-4 border-t border-[#0A211F]/10" />

            {/* Sub-pages */}
            <div className="space-y-1">
              <p
                className="px-4 py-2 text-[#0A211F]/40 uppercase tracking-widest"
                style={{ fontSize: '0.7rem', fontWeight: 600 }}
              >
                Industries
              </p>
              {[
                { path: '/industries/e-commerce', label: 'E-Commerce' },
                { path: '/industries/fashion', label: 'Fashion' },
                { path: '/industries/travel', label: 'Travel' },
              ].map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center px-4 py-2.5 rounded-xl text-sm transition-all ${
                    isActive(item.path)
                      ? 'bg-white/80 text-[#0A211F]'
                      : 'text-[#0A211F]/50 hover:bg-white/50 hover:text-[#0A211F]'
                  }`}
                  style={{ fontWeight: isActive(item.path) ? 500 : 400 }}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            {/* CTA Button */}
            <div className="mt-6 px-4">
              <Link
                to="/booking"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-center bg-[#0A211F] text-[#F1EEEA] py-3.5 rounded-full tracking-wide hover:bg-[#0A211F]/90 transition-colors"
                style={{ fontWeight: 500 }}
              >
                Get in Touch
              </Link>
            </div>
          </nav>
        </div>
      </div>
    </>
  );
}