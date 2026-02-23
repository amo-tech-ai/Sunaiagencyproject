'use client';

import TravelHero from './travel/TravelHero';
import TravelIntro from './travel/TravelIntro';
import TravelStats from './travel/TravelStats';
import TravelApproach from './travel/TravelApproach';
import TravelFramework from './travel/TravelFramework';
import TravelServices from './travel/TravelServices';
import TravelROIChart from './travel/TravelROIChart';
import TravelInsights from './travel/TravelInsights';
import TravelCTA from './travel/TravelCTA';

interface TravelPageProps {
  onNavigate?: (page: string) => void;
}

export default function TravelPage({ onNavigate }: TravelPageProps) {
  return (
    <div className="bg-white">
      <TravelHero onNavigate={onNavigate} />
      <TravelIntro />
      <TravelStats />
      <TravelApproach />
      <TravelFramework />
      <TravelServices />
      <TravelROIChart />
      <TravelInsights />
      <TravelCTA onNavigate={onNavigate} />
    </div>
  );
}
