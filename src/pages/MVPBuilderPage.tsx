import MVPHero from '../components/mvp/MVPHero';
import WhyMVPFirst from '../components/mvp/WhyMVPFirst';
import MVPDeliverables from '../components/mvp/MVPDeliverables';
import MVPFramework from '../components/mvp/MVPFramework';
import MVPWhoThisIsFor from '../components/mvp/MVPWhoThisIsFor';
import MVPBottomCTA from '../components/mvp/MVPBottomCTA';

export default function MVPBuilderPage() {
  return (
    <div className="bg-white">
      <MVPHero />
      <WhyMVPFirst />
      <MVPDeliverables />
      <MVPFramework />
      <MVPWhoThisIsFor />
      <MVPBottomCTA />
    </div>
  );
}
