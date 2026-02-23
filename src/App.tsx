import { useState } from 'react';
import HomePage from './components/HomePage';
import HomePageV2 from './components/HomePageV2';
import SolutionsPage from './components/SolutionsPage';
import IndustriesPage from './components/IndustriesPage';
import AboutPage from './components/AboutPage';
import ProcessPage from './components/ProcessPage';
import CaseStudiesPage from './components/CaseStudiesPage';
import BookingPage from './components/BookingPage';
import ProcessPageV12 from './components/process/v12/ProcessPageV12';
import ProjectsPage from './components/ProjectsPage';
import AgentsPage from './components/AgentsPage';
import ChatbotsPage from './components/ChatbotsPage';
import EcommercePage from './components/EcommercePage';
import FashionPage from './components/FashionPage';
import TravelPage from './components/TravelPage';
import StyleGuidePage from './components/StyleGuidePage';
import SectionsPage from './components/SectionsPage';
import Header from './components/Header';
import Footer from './components/Footer';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home-v2');

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />;
      case 'home-v2':
        return <HomePageV2 onNavigate={setCurrentPage} />;
      case 'solutions':
        return <SolutionsPage />;
      case 'industries':
        return <IndustriesPage />;
      case 'about':
        return <AboutPage />;
      case 'process':
        return <ProcessPage />;
      case 'process-v12':
        return <ProcessPageV12 onNavigate={setCurrentPage} />;
      case 'projects':
        return <ProjectsPage onNavigate={setCurrentPage} />;
      case 'agents':
        return <AgentsPage onNavigate={setCurrentPage} />;
      case 'ai-agents':
        return <AgentsPage onNavigate={setCurrentPage} />;
      case 'chatbots':
        return <ChatbotsPage onNavigate={setCurrentPage} />;
      case 'ai-chatbots':
        return <ChatbotsPage onNavigate={setCurrentPage} />;
      case 'industries/e-commerce':
      case 'ecommerce':
        return <EcommercePage onNavigate={setCurrentPage} />;
      case 'industries/fashion':
      case 'fashion':
        return <FashionPage onNavigate={setCurrentPage} />;
      case 'industries/travel':
      case 'travel':
        return <TravelPage onNavigate={setCurrentPage} />;
      case 'case-studies':
        return <CaseStudiesPage />;
      case 'booking':
        return <BookingPage />;
      case 'style-guide':
        return <StyleGuidePage onNavigate={setCurrentPage} />;
      case 'sections':
        return <SectionsPage onNavigate={setCurrentPage} />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Header currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <main>{renderPage()}</main>
      <Footer setCurrentPage={setCurrentPage} />
    </div>
  );
}