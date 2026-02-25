import { createBrowserRouter, Link } from 'react-router';
import Layout from './components/Layout';
import HomePageV2 from './components/HomePageV2';
import HomePage from './components/HomePage';
import SolutionsPage from './components/SolutionsPage';
import IndustriesPage from './components/IndustriesPage';
import AboutPage from './components/AboutPage';
import ProcessPageV12 from './components/process/v12/ProcessPageV12';
import ProjectsPage from './components/ProjectsPage';
import AgentsPage from './components/AgentsPage';
import ChatbotsPage from './components/ChatbotsPage';
import EcommercePage from './components/EcommercePage';
import FashionPage from './components/FashionPage';
import TravelPage from './components/TravelPage';
import CaseStudiesPage from './components/CaseStudiesPage';
import BookingPage from './components/BookingPage';
import StyleGuidePage from './components/StyleGuidePage';
import SectionsPage from './components/SectionsPage';
import HomePageV3 from './components/HomePageV3';
import FinancialPage from './components/FinancialPage';

function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl tracking-tight mb-4">404</h1>
        <p className="text-xl text-gray-500 mb-8">Page not found</p>
        <Link
          to="/"
          className="px-8 py-3 bg-gray-900 text-white hover:bg-gray-800 transition-colors inline-block"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Layout,
    children: [
      { index: true, Component: HomePageV3 },
      { path: 'home-v1', Component: HomePage },
      { path: 'home-v4', Component: HomePageV2 },
      { path: 'solutions', Component: SolutionsPage },
      { path: 'industries', Component: IndustriesPage },
      { path: 'industries/e-commerce', Component: EcommercePage },
      { path: 'industries/fashion', Component: FashionPage },
      { path: 'industries/travel', Component: TravelPage },
      { path: 'about', Component: AboutPage },
      { path: 'process', Component: ProcessPageV12 },
      { path: 'projects', Component: ProjectsPage },
      { path: 'agents', Component: AgentsPage },
      { path: 'chatbots', Component: ChatbotsPage },
      { path: 'case-studies', Component: CaseStudiesPage },
      { path: 'booking', Component: BookingPage },
      { path: 'style-guide', Component: StyleGuidePage },
      { path: 'sections', Component: SectionsPage },
      { path: 'financial', Component: FinancialPage },
      { path: '*', Component: NotFound },
    ],
  },
]);