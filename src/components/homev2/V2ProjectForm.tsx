// C-V2-08 — V2 Project Form
// BCG design system: off-white bg, charcoal text, Georgia serif, green accents, 4px radius

import { useState } from 'react';
import { ArrowRight } from 'lucide-react';

export default function V2ProjectForm() {
  const [formData, setFormData] = useState({
    name: '', email: '', company: '', projectType: '', timeline: '', budget: '', description: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const inputClass = "w-full px-4 py-3 border text-sm focus:outline-none transition-colors";
  const inputStyle = { backgroundColor: '#F5F5F0', borderColor: '#E8E8E4', color: '#1A1A1A', borderRadius: '4px' };

  return (
    <section className="py-20 lg:py-28" style={{ backgroundColor: '#F5F5F0' }}>
      <div className="max-w-[1120px] mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-14 items-start">
          {/* Left: Content */}
          <div className="space-y-7 lg:sticky lg:top-28">
            <div className="space-y-5">
              <div className="inline-block px-3.5 py-1.5 border" style={{ backgroundColor: 'rgba(0,135,90,0.08)', borderColor: 'rgba(0,135,90,0.15)', borderRadius: '4px' }}>
                <span className="text-xs tracking-widest uppercase" style={{ color: '#00875A', letterSpacing: '0.08em' }}>Get Started</span>
              </div>
              <h2 className="text-3xl lg:text-4xl leading-[1.05]" style={{ fontFamily: 'Georgia, serif', color: '#1A1A1A' }}>
                Let&apos;s build something exceptional
              </h2>
              <p className="text-lg leading-relaxed" style={{ color: '#6B6B63' }}>
                Tell us about your vision and we'll respond within 24 hours with a tailored proposal and next steps.
              </p>
            </div>

            <div className="space-y-5 pt-7 border-t" style={{ borderColor: '#E8E8E4' }}>
              {[
                { label: 'Response Time', value: 'Within 24 hours' },
                { label: 'Free Consultation', value: 'Strategy & Planning' },
                { label: 'No Commitment', value: 'Pressure-free process' },
              ].map((item, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-2 h-2 mt-2" style={{ backgroundColor: '#00875A' }} />
                  <div>
                    <div className="text-xs tracking-widest uppercase mb-1" style={{ color: '#6B6B63', letterSpacing: '0.06em' }}>{item.label}</div>
                    <div className="text-base" style={{ fontFamily: 'Georgia, serif', color: '#1A1A1A' }}>{item.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Form */}
          <div>
            <form onSubmit={handleSubmit} className="bg-white border p-8 lg:p-10 space-y-5" style={{ borderColor: '#E8E8E4', borderRadius: '4px' }}>
              <div className="grid md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label htmlFor="name" className="block text-xs tracking-widest uppercase" style={{ color: '#6B6B63', letterSpacing: '0.06em' }}>Full Name *</label>
                  <input type="text" id="name" name="name" required value={formData.name} onChange={handleChange} className={inputClass} style={inputStyle} placeholder="John Smith" />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="email" className="block text-xs tracking-widest uppercase" style={{ color: '#6B6B63', letterSpacing: '0.06em' }}>Email *</label>
                  <input type="email" id="email" name="email" required value={formData.email} onChange={handleChange} className={inputClass} style={inputStyle} placeholder="john@company.com" />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label htmlFor="company" className="block text-xs tracking-widest uppercase" style={{ color: '#6B6B63', letterSpacing: '0.06em' }}>Company *</label>
                  <input type="text" id="company" name="company" required value={formData.company} onChange={handleChange} className={inputClass} style={inputStyle} placeholder="Company Name" />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="projectType" className="block text-xs tracking-widest uppercase" style={{ color: '#6B6B63', letterSpacing: '0.06em' }}>Project Type *</label>
                  <select id="projectType" name="projectType" required value={formData.projectType} onChange={handleChange} className={inputClass} style={inputStyle}>
                    <option value="">Select type</option>
                    <option value="ai-product">AI Product</option>
                    <option value="ai-agent">AI Agent</option>
                    <option value="automation">Automation</option>
                    <option value="consulting">Consulting</option>
                  </select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label htmlFor="timeline" className="block text-xs tracking-widest uppercase" style={{ color: '#6B6B63', letterSpacing: '0.06em' }}>Timeline</label>
                  <select id="timeline" name="timeline" value={formData.timeline} onChange={handleChange} className={inputClass} style={inputStyle}>
                    <option value="">Select timeline</option>
                    <option value="urgent">Urgent (1-2 months)</option>
                    <option value="near">Near-term (3-6 months)</option>
                    <option value="future">Future (6+ months)</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="budget" className="block text-xs tracking-widest uppercase" style={{ color: '#6B6B63', letterSpacing: '0.06em' }}>Budget Range</label>
                  <select id="budget" name="budget" value={formData.budget} onChange={handleChange} className={inputClass} style={inputStyle}>
                    <option value="">Select budget</option>
                    <option value="25k">$25k - $50k</option>
                    <option value="50k">$50k - $100k</option>
                    <option value="100k">$100k - $250k</option>
                    <option value="250k">$250k+</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="description" className="block text-xs tracking-widest uppercase" style={{ color: '#6B6B63', letterSpacing: '0.06em' }}>Project Description *</label>
                <textarea id="description" name="description" required rows={6} value={formData.description} onChange={handleChange} className={`${inputClass} resize-none`} style={inputStyle} placeholder="Tell us about your project goals, challenges, and what you're looking to achieve..." />
              </div>

              <div className="pt-3">
                <button type="submit" className="w-full py-3.5 text-sm transition-all inline-flex items-center justify-center gap-2 group text-white" style={{ backgroundColor: '#00875A', borderRadius: '4px' }}>
                  <span>Submit Inquiry</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
                <p className="text-xs text-center mt-3 leading-relaxed" style={{ color: '#6B6B63' }}>
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
