import V2Hero from './homev2/V2Hero';
import V2ValueSection from './homev2/V2ValueSection';
import V2MetricsSection from './homev2/V2MetricsSection';
import V2IndustriesStrip from './homev2/V2IndustriesStrip';
import V2ServicesGrid from './homev2/V2ServicesGrid';
import V2CreativeServices from './homev2/V2CreativeServices';
import V2HowItWorks from './homev2/V2HowItWorks';
import V2HighlightCards from './homev2/V2HighlightCards';
import V2CapabilityFramework from './homev2/V2CapabilityFramework';
import V2ProcessSection from './homev2/V2ProcessSection';
import V2ProjectForm from './homev2/V2ProjectForm';
import V2FinalCTA from './homev2/V2FinalCTA';

interface HomePageV2Props {
  onNavigate?: (page: string) => void;
}

export default function HomePageV2({ onNavigate }: HomePageV2Props) {
  return (
    <div className="bg-[#FDFCFB]">
      {/* Hero Section */}
      <V2Hero onNavigate={onNavigate} />
      
      {/* Support / Value Section */}
      <V2ValueSection />
      
      {/* Results & Metrics */}
      <V2MetricsSection />
      
      {/* 2024 Highlights - Data Cards */}
      <V2HighlightCards onNavigate={onNavigate} />
      
      {/* Capability Framework - Strategic Diagram */}
      <V2CapabilityFramework onNavigate={onNavigate} />
      
      {/* Industries Strip */}
      <V2IndustriesStrip onNavigate={onNavigate} />
      
      {/* Services Grid */}
      <V2ServicesGrid onNavigate={onNavigate} />
      
      {/* Creative Services Slider */}
      <V2CreativeServices onNavigate={onNavigate} />
      
      {/* How It Works - Animated Timeline */}
      <V2HowItWorks onNavigate={onNavigate} />
      
      {/* Start Project Form */}
      <V2ProjectForm />
      
      {/* Final CTA */}
      <V2FinalCTA onNavigate={onNavigate} />
    </div>
  );
}