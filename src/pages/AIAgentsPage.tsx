import AIAgentsHero from '../components/ai-agents/AIAgentsHero';
import WhatAreAgents from '../components/ai-agents/WhatAreAgents';
import TheAgentSystem from '../components/ai-agents/TheAgentSystem';
import AIAgentsServicesGrid from '../components/ai-agents/AIAgentsServicesGrid';
import AIAgentsUseCases from '../components/ai-agents/AIAgentsUseCases';
import BuiltInAIAgents from '../components/ai-agents/BuiltInAIAgents';
import AIServicesGrid from '../components/web-design/AIServicesGrid';
import ExploreMore from '../components/web-design/ExploreMore';
import AIAgentsCTA from '../components/ai-agents/AIAgentsCTA';

export default function AIAgentsPage() {
  return (
    <div className="bg-white">
      <AIAgentsHero />
      <WhatAreAgents />
      <TheAgentSystem />
      <AIAgentsServicesGrid />
      <AIAgentsUseCases />
      <BuiltInAIAgents />
      <AIServicesGrid />
      <ExploreMore />
      <AIAgentsCTA />
    </div>
  );
}
