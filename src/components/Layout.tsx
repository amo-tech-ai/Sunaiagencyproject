import { useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router';
import Header from './Header';
import Footer from './Footer';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <ScrollToTop />
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
