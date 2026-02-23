import ChatbotsHero from './chatbots/ChatbotsHero';
import ProblemSolution from './chatbots/ProblemSolution';
import CapabilitiesGrid from './chatbots/CapabilitiesGrid';
import ChatbotInterfaceDemo from './chatbots/ChatbotInterfaceDemo';
import WorkflowDiagrams from './chatbots/WorkflowDiagrams';
import IndustryUseCases from './chatbots/IndustryUseCases';
import AgentSystemDiagram from './chatbots/AgentSystemDiagram';
import GeminiTechnology from './chatbots/GeminiTechnology';
import BusinessBenefits from './chatbots/BusinessBenefits';
import ChatbotsCTA from './chatbots/ChatbotsCTA';

interface ChatbotsPageProps {
  onNavigate?: (page: string) => void;
}

export default function ChatbotsPage({ onNavigate }: ChatbotsPageProps) {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handlePrimaryClick = () => {
    if (onNavigate) {
      onNavigate('booking');
    }
  };

  const handleSecondaryClick = () => {
    scrollToSection('use-cases');
  };

  return (
    <div>
      <ChatbotsHero 
        onPrimaryClick={handlePrimaryClick}
        onSecondaryClick={handleSecondaryClick}
      />
      
      <ProblemSolution />
      
      <CapabilitiesGrid />
      
      <ChatbotInterfaceDemo />
      
      <WorkflowDiagrams />
      
      <div id="use-cases">
        <IndustryUseCases />
      </div>
      
      <AgentSystemDiagram />
      
      <GeminiTechnology />
      
      <BusinessBenefits />
      
      <ChatbotsCTA 
        onPrimaryClick={handlePrimaryClick}
        onSecondaryClick={() => scrollToSection('use-cases')}
      />
    </div>
  );
}
