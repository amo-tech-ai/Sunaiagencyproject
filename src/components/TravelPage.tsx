import { useNavigate } from 'react-router';
import { pageToPath } from '../lib/navigation';
import TravelHero from './travel/TravelHero';
import TravelIntro from './travel/TravelIntro';
import TravelStats from './travel/TravelStats';
import TravelApproach from './travel/TravelApproach';
import TravelFramework from './travel/TravelFramework';
import TravelServices from './travel/TravelServices';
import TravelROIChart from './travel/TravelROIChart';
import TravelInsights from './travel/TravelInsights';
import TravelCTA from './travel/TravelCTA';

export default function TravelPage() {
  const nav = useNavigate();
  const onNavigate = (page: string) => nav(pageToPath(page));

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
