import WebAppsHero from '../components/web-apps/WebAppsHero';
import WhyAIWebApps from '../components/web-apps/WhyAIWebApps';
import WhatWeBuild from '../components/web-apps/WhatWeBuild';
import AIFeaturesBuiltIn from '../components/web-apps/AIFeaturesBuiltIn';
import ArchitectureSection from '../components/web-apps/ArchitectureSection';
import DeliveryProcess from '../components/web-apps/DeliveryProcess';
import PostLaunchSupport from '../components/web-apps/PostLaunchSupport';
import AIServicesGrid from '../components/web-design/AIServicesGrid';
import WebAppsCTA from '../components/web-apps/WebAppsCTA';

export default function WebAppsPage() {
  return (
    <div className="bg-white">
      <WebAppsHero />
      <WhyAIWebApps />
      <WhatWeBuild />
      <AIFeaturesBuiltIn />
      <ArchitectureSection />
      <DeliveryProcess />
      <PostLaunchSupport />
      <AIServicesGrid />
      <WebAppsCTA />
    </div>
  );
}
