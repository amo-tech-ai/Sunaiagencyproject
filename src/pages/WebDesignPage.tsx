import WebDesignHero from '../components/web-design/WebDesignHero';
import WhyAIPowered from '../components/web-design/WhyAIPowered';
import AIServicesGrid from '../components/web-design/AIServicesGrid';
import PerformanceFirst from '../components/web-design/PerformanceFirst';
import BuiltInIntelligence from '../components/web-design/BuiltInIntelligence';
import WebDesignServicesGrid from '../components/web-design/WebDesignServicesGrid';
import WebDesignProcess from '../components/web-design/WebDesignProcess';
import ExploreMore from '../components/web-design/ExploreMore';
import WebDesignCTA from '../components/web-design/WebDesignCTA';

export default function WebDesignPage() {
  return (
    <div className="bg-white">
      <WebDesignHero />
      <WebDesignServicesGrid />
      <WhyAIPowered />
      <AIServicesGrid />
      <PerformanceFirst />
      <BuiltInIntelligence />
      <WebDesignProcess />
      <ExploreMore />
      <WebDesignCTA />
    </div>
  );
}