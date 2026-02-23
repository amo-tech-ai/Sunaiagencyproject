import { useNavigate } from 'react-router';
import { pageToPath } from '../lib/navigation';
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

export default function ChatbotsPage() {
  const nav = useNavigate();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handlePrimaryClick = () => {
    nav(pageToPath('booking'));
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
