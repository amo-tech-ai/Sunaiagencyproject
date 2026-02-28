import SalesCRMHero from '../components/sales-crm/SalesCRMHero';
import SalesProblem from '../components/sales-crm/SalesProblem';
import HowItWorks from '../components/sales-crm/HowItWorks';
import KeyCapabilities from '../components/sales-crm/KeyCapabilities';
import CRMIntegrations from '../components/sales-crm/CRMIntegrations';
import CRMResults from '../components/sales-crm/CRMResults';
import AIServicesGrid from '../components/web-design/AIServicesGrid';
import SalesCRMCTA from '../components/sales-crm/SalesCRMCTA';

export default function SalesCRMPage() {
  return (
    <div className="bg-white">
      <SalesCRMHero />
      <SalesProblem />
      <HowItWorks />
      <KeyCapabilities />
      <CRMIntegrations />
      <CRMResults />
      <AIServicesGrid />
      <SalesCRMCTA />
    </div>
  );
}
