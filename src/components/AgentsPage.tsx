import { useNavigate } from 'react-router';
import { pageToPath } from '../lib/navigation';
import AgentsHero from './agents/AgentsHero';
import AgentDefinition from './agents/AgentDefinition';
import AgentSystemDiagram from './agents/AgentSystemDiagram';
import AgentTypesGrid from './agents/AgentTypesGrid';
import HumanControl from './agents/HumanControl';
import UseCases from './agents/UseCases';
import IndustryExamples from './agents/IndustryExamples';
import OutcomesSection from './agents/OutcomesSection';
import AgentsCTA from './agents/AgentsCTA';

export default function AgentsPage() {
  const nav = useNavigate();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleExploreClick = () => {
    scrollToSection('system-diagram');
  };

  const handleLearnMoreClick = () => {
    scrollToSection('agent-types');
  };

  const handleWizardClick = () => {
    nav(pageToPath('booking'));
  };

  return (
    <div>
      <AgentsHero 
        onExploreClick={handleExploreClick}
        onLearnMoreClick={handleLearnMoreClick}
      />
      
      <AgentDefinition />
      
      <div id="system-diagram">
        <AgentSystemDiagram />
      </div>
      
      <div id="agent-types">
        <AgentTypesGrid />
      </div>
      
      <HumanControl />
      
      <UseCases />
      
      <IndustryExamples />
      
      <OutcomesSection />
      
      <AgentsCTA onWizardClick={handleWizardClick} />
    </div>
  );
}
