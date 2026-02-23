import { useState } from 'react';
import { ArrowRight } from 'lucide-react';

export default function V2ProjectForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    projectType: '',
    timeline: '',
    budget: '',
    description: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Handle form submission
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <section className="bg-[#FAF8F6] py-24 lg:py-32">
      <div className="max-w-6xl mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left: Content */}
          <div className="space-y-8 lg:sticky lg:top-32">
            <div className="space-y-6">
              <div className="inline-block px-4 py-2 bg-[#84CC16]/10 border border-[#84CC16]/20">
                <span className="text-xs uppercase tracking-[0.2em] text-[#84CC16] font-medium">
                  Get Started
                </span>
              </div>
              
              <h2 className="font-['Playfair_Display'] text-4xl lg:text-6xl font-bold text-[#1A1A1A] leading-[1.05]">
                Let&apos;s build something exceptional
              </h2>
              
              <p className="text-xl text-[#666666] leading-relaxed font-['Lora']">
                Tell us about your vision and we'll respond within 24 hours with a tailored proposal and next steps.
              </p>
            </div>
            
            {/* Benefits */}
            <div className="space-y-6 pt-8 border-t border-[#EFE9E4]">
              {[
                { label: 'Response Time', value: 'Within 24 hours' },
                { label: 'Free Consultation', value: 'Strategy & Planning' },
                { label: 'No Commitment', value: 'Pressure-free process' },
              ].map((item, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="w-2 h-2 bg-[#84CC16] mt-2" />
                  <div>
                    <div className="text-sm uppercase tracking-wider text-[#666666] mb-1">{item.label}</div>
                    <div className="text-lg font-['Playfair_Display'] font-medium text-[#1A1A1A]">{item.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Right: Form */}
          <div>
            <form onSubmit={handleSubmit} className="bg-white border-2 border-[#EFE9E4] p-10 lg:p-12 space-y-6">
              {/* Row 1 */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="block text-xs font-medium text-[#666666] uppercase tracking-[0.2em]">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-[#FAF8F6] border border-[#EFE9E4] text-[#1A1A1A] focus:border-[#84CC16] focus:outline-none transition-colors font-['Lora']"
                    placeholder="John Smith"
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-xs font-medium text-[#666666] uppercase tracking-[0.2em]">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-[#FAF8F6] border border-[#EFE9E4] text-[#1A1A1A] focus:border-[#84CC16] focus:outline-none transition-colors font-['Lora']"
                    placeholder="john@company.com"
                  />
                </div>
              </div>
              
              {/* Row 2 */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="company" className="block text-xs font-medium text-[#666666] uppercase tracking-[0.2em]">
                    Company *
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    required
                    value={formData.company}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-[#FAF8F6] border border-[#EFE9E4] text-[#1A1A1A] focus:border-[#84CC16] focus:outline-none transition-colors font-['Lora']"
                    placeholder="Company Name"
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="projectType" className="block text-xs font-medium text-[#666666] uppercase tracking-[0.2em]">
                    Project Type *
                  </label>
                  <select
                    id="projectType"
                    name="projectType"
                    required
                    value={formData.projectType}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-[#FAF8F6] border border-[#EFE9E4] text-[#1A1A1A] focus:border-[#84CC16] focus:outline-none transition-colors font-['Lora']"
                  >
                    <option value="">Select type</option>
                    <option value="ai-product">AI Product</option>
                    <option value="ai-agent">AI Agent</option>
                    <option value="automation">Automation</option>
                    <option value="consulting">Consulting</option>
                  </select>
                </div>
              </div>
              
              {/* Row 3 */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="timeline" className="block text-xs font-medium text-[#666666] uppercase tracking-[0.2em]">
                    Timeline
                  </label>
                  <select
                    id="timeline"
                    name="timeline"
                    value={formData.timeline}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-[#FAF8F6] border border-[#EFE9E4] text-[#1A1A1A] focus:border-[#84CC16] focus:outline-none transition-colors font-['Lora']"
                  >
                    <option value="">Select timeline</option>
                    <option value="urgent">Urgent (1-2 months)</option>
                    <option value="near">Near-term (3-6 months)</option>
                    <option value="future">Future (6+ months)</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="budget" className="block text-xs font-medium text-[#666666] uppercase tracking-[0.2em]">
                    Budget Range
                  </label>
                  <select
                    id="budget"
                    name="budget"
                    value={formData.budget}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-[#FAF8F6] border border-[#EFE9E4] text-[#1A1A1A] focus:border-[#84CC16] focus:outline-none transition-colors font-['Lora']"
                  >
                    <option value="">Select budget</option>
                    <option value="25k">$25k - $50k</option>
                    <option value="50k">$50k - $100k</option>
                    <option value="100k">$100k - $250k</option>
                    <option value="250k">$250k+</option>
                  </select>
                </div>
              </div>
              
              {/* Description */}
              <div className="space-y-2">
                <label htmlFor="description" className="block text-xs font-medium text-[#666666] uppercase tracking-[0.2em]">
                  Project Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  required
                  rows={6}
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[#FAF8F6] border border-[#EFE9E4] text-[#1A1A1A] focus:border-[#84CC16] focus:outline-none transition-colors resize-none font-['Lora']"
                  placeholder="Tell us about your project goals, challenges, and what you're looking to achieve..."
                />
              </div>
              
              {/* Submit */}
              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full py-4 bg-[#84CC16] text-[#1A1A1A] font-medium text-base hover:bg-[#65A30D] transition-all hover:scale-105 inline-flex items-center justify-center gap-2 group"
                >
                  <span>Submit Inquiry</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
                <p className="text-xs text-[#666666] text-center mt-4 leading-relaxed">
                  By submitting, you agree to our privacy policy. We&apos;ll never share your information.
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}