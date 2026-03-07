import WizardPage from './components/wizard/WizardPage';
import ProcessingPage from './components/wizard/ProcessingPage';
import ProposalPage from './components/wizard/ProposalPage';
import { createBrowserRouter, Link, Navigate } from 'react-router';
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
import { ServicesPage } from './components/services/ServicesPage';
import WebDesignPage from './pages/WebDesignPage';
import MVPBuilderPage from './pages/MVPBuilderPage';
import MVPv2Page from './pages/MVPv2Page';
import AIAgentsPage from './pages/AIAgentsPage';
import WebAppsPage from './pages/WebAppsPage';
import SalesCRMPage from './pages/SalesCRMPage';
import SitemapPage from './components/SitemapPage';
import ChatbotServicePage from './components/services/ChatbotServicePage';
import WhatsAppAIPage from './pages/WhatsAppAIPage';
import SupabaseArchitecturePage from './components/SupabaseArchitecturePage';
import AuthPage from './components/AuthPage';
import AuthCallbackPage from './components/AuthCallbackPage';

// Auth pages (alternate layout)
import AuthLayout from './components/auth/AuthLayout';
import LoginPage from './components/auth/LoginPage';
import SignupPage from './components/auth/SignupPage';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Dashboard imports — Phase 1 (shell) + Phase 2-5 (production pages)
import DashboardLayout from './components/dashboard/DashboardLayout';
import DashboardHome from './components/dashboard/DashboardHome';
import ProjectsList from './components/dashboard/ProjectsList';
import ProjectDetail from './components/dashboard/ProjectDetail';
import RoadmapPage from './components/dashboard/RoadmapPage';
import SettingsPageComponent from './components/dashboard/SettingsPage';
import InsightsPage from './components/dashboard/insights/InsightsPage';
import DashAgentsPage from './components/dashboard/agents/AgentsPage';
import ClientsListPage from './components/dashboard/clients/ClientsListPage';
import ClientDetailPage from './components/dashboard/clients/ClientDetailPage';
import {
  CRMPipelinePage,
  DocumentsPage, FinancialPage as DashFinancialPage, WorkflowsPage,
} from './components/dashboard/PlaceholderPage';

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
  // Wizard routes — standalone layout (no site header/footer)
  {
    path: '/wizard',
    Component: WizardPage,
    children: [
      { path: 'processing', Component: ProcessingPage },
      { path: 'proposal', Component: ProposalPage },
    ],
  },
  // Auth page — standalone layout (own brand panel)
  {
    path: '/login',
    Component: AuthPage,
  },
  // OAuth callback — handles redirect from Google/LinkedIn via Supabase
  {
    path: '/auth/callback',
    Component: AuthCallbackPage,
  },
  // Auth routes — split-screen layout with login/signup children
  {
    path: '/auth',
    Component: AuthLayout,
    children: [
      { path: 'login', Component: LoginPage },
      { path: 'signup', Component: SignupPage },
    ],
  },
  // Dashboard — authenticated area with sidebar layout
  {
    path: '/app',
    Component: ProtectedRoute,
    children: [
      {
        Component: DashboardLayout,
        children: [
          { index: true, element: <Navigate to="/app/dashboard" replace /> },
          { path: 'dashboard', Component: DashboardHome },
          // Phase 4: Projects — production pages
          { path: 'projects', Component: ProjectsList },
          { path: 'projects/:id', Component: ProjectDetail },
          // Phase 2: Roadmap — production page
          { path: 'roadmap', Component: RoadmapPage },
          // Phase 5: Settings — production page
          { path: 'settings', Component: SettingsPageComponent },
          // Phase 9: AI Insights — production page
          { path: 'insights', Component: InsightsPage },
          // Phase 6: Client Management CRM — production pages
          { path: 'clients', Component: ClientsListPage },
          { path: 'clients/:id', Component: ClientDetailPage },
          // Placeholder stubs — remaining phases
          { path: 'crm/pipelines', Component: CRMPipelinePage },
          { path: 'documents', Component: DocumentsPage },
          { path: 'financial', Component: DashFinancialPage },
          { path: 'workflows', Component: WorkflowsPage },
          // Phase 10: AI Agent Management — production page
          { path: 'agents', Component: DashAgentsPage },
        ],
      },
    ],
  },
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
      { path: 'services', Component: ServicesPage },
      { path: 'web-design', Component: WebDesignPage },
      { path: 'mvp-builder', Component: MVPBuilderPage },
      { path: 'mvp-v2', Component: MVPv2Page },
      { path: 'services/ai-agents', Component: AIAgentsPage },
      { path: 'ai-agents', Component: AIAgentsPage },
      { path: 'web-apps', Component: WebAppsPage },
      { path: 'sales-crm', Component: SalesCRMPage },
      { path: 'services/crm', Component: SalesCRMPage },
      { path: 'services/sales-crm', Component: SalesCRMPage },
      { path: 'sitemap', Component: SitemapPage },
      { path: 'services/chatbot', Component: ChatbotServicePage },
      { path: 'whatsapp-ai', Component: WhatsAppAIPage },
      { path: 'docs/supabase', Component: SupabaseArchitecturePage },
      { path: '*', Component: NotFound },
    ],
  },
]);
