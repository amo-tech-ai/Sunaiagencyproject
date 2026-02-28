import MVPv2Hero from '../components/mvpv2/MVPv2Hero';
import MVPv2ProcessTimeline from '../components/mvpv2/MVPv2ProcessTimeline';
import WhyMVPFirst from '../components/mvpv2/WhyMVPFirst';
import MVPv2Services from '../components/mvpv2/MVPv2Services';
import MVPv2Framework from '../components/mvpv2/MVPv2Framework';
import MVPv2WhoThisIsFor from '../components/mvpv2/MVPv2WhoThisIsFor';
import MVPv2CTA from '../components/mvpv2/MVPv2CTA';

export default function MVPv2Page() {
  return (
    <div className="bg-white">
      <MVPv2Hero />
      <WhyMVPFirst />
      <MVPv2Services />
      <MVPv2Framework />
      <MVPv2WhoThisIsFor />
      <MVPv2ProcessTimeline />
      <MVPv2CTA />
    </div>
  );
}