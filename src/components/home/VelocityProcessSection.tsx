import { motion } from 'motion/react';
import { 
  Compass, 
  Zap, 
  Link2, 
  Rocket, 
} from 'lucide-react';

/* ═══════════════════════════════════════════════════════════════
   Velocity Process Section — Light Luxury Editorial
   ═══════════════════════════════════════════════════════════════ 
   
   Design: Light editorial with subtle luxury touches
   Palette: Sun AI V3 luxury colors (sage + warm beige)
   Purpose: Elegant, structured, premium execution
   
   Color Mapping:
   - Background: #F4F3EE (warm beige)
   - Headlines: #1E3D36 (deep green)
   - Body text: #6B6B6B (muted gray)
   - Cards: #FFFFFF with #E5E5E5 borders
   - Accent: #2E6F5E (accent green for "8 Weeks")
   
   ═══════════════════════════════════════════════════════════════ */

const phases = [
  {
    weeks: "Week 1",
    title: "Strategy & Design",
    desc: "AI opportunity audit, roadmap prioritization, and system architecture.",
    icon: Compass,
  },
  {
    weeks: "Weeks 2–3",
    title: "System Architecture",
    desc: "UX flows, AI behavior design, and technical blueprint.",
    icon: Zap,
  },
  {
    weeks: "Weeks 4–7",
    title: "Build & Integrate",
    desc: "Production AI development with weekly sprint releases.",
    icon: Link2,
  },
  {
    weeks: "Week 8+",
    title: "Launch & Optimize",
    desc: "Deployment, team enablement, and continuous improvement.",
    icon: Rocket,
  }
];

export default function VelocityProcessSection() {
  return (
    <section 
      className="py-24 lg:py-32 relative overflow-hidden"
      style={{
        background: '#F4F3EE',
      }}
    >
      
      {/* Subtle Noise Texture Overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        
        {/* 1. Header */}
        <div className="text-center max-w-4xl mx-auto mb-24">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-block mb-6 px-4 py-1.5 rounded-full backdrop-blur-sm"
            style={{
              background: 'rgba(255, 255, 255, 0.6)',
              border: '1px solid rgba(30, 61, 54, 0.15)'
            }}
          >
            <span 
              className="text-sm font-medium tracking-wide uppercase"
              style={{ 
                color: '#2E6F5E',
                fontFamily: 'Inter, system-ui, sans-serif'
              }}
            >
              The Sun AI Velocity System
            </span>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl lg:text-6xl font-bold mb-6 tracking-tight leading-tight"
            style={{ 
              color: '#1E3D36',
              fontFamily: 'Inter, system-ui, sans-serif'
            }}
          >
            Build AI in{' '}
            <span style={{ color: '#2E6F5E' }}>
              8 Weeks
            </span>
            . <br className="hidden md:block" />
            Not 8 Months.
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl max-w-2xl mx-auto"
            style={{ 
              color: '#6B6B6B',
              fontFamily: 'Inter, system-ui, sans-serif',
              fontWeight: 400,
              lineHeight: 1.7
            }}
          >
            A proven acceleration system that takes your AI project from idea to production — fast.
          </motion.p>
        </div>

        {/* 2. Timeline */}
        <div className="relative">
          
          {/* Desktop Connecting Line (Hidden on Mobile) */}
          <div 
            className="hidden lg:block absolute top-[28px] left-0 right-0 h-[2px] w-[90%] mx-auto z-0"
            style={{
              background: 'rgba(30, 61, 54, 0.2)'
            }}
          />
          
          <div className="grid lg:grid-cols-4 gap-8 lg:gap-4 relative z-10">
            {phases.map((phase, i) => {
              const Icon = phase.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                  className="relative flex flex-col items-center text-center group"
                >
                  {/* Milestone Circle */}
                  <div 
                    className="w-14 h-14 rounded-full flex items-center justify-center mb-6 relative z-10 transition-all duration-300"
                    style={{
                      background: '#FFFFFF',
                      border: '2px solid #1E3D36',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)'
                    }}
                  >
                    <Icon 
                      className="w-6 h-6 transition-colors duration-300" 
                      style={{ color: '#1E3D36' }}
                    />
                  </div>

                  {/* Content Card */}
                  <div 
                    className="w-full rounded-2xl p-6 transition-all duration-300"
                    style={{
                      background: '#FFFFFF',
                      border: '1px solid #E5E5E5',
                      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04), 0 4px 12px rgba(0, 0, 0, 0.02)'
                    }}
                  >
                    <span 
                      className="text-xs font-semibold uppercase tracking-wider mb-2 block"
                      style={{ 
                        color: '#2E6F5E',
                        fontFamily: 'Inter, system-ui, sans-serif'
                      }}
                    >
                      {phase.weeks}
                    </span>
                    <h3 
                      className="text-xl font-semibold mb-2"
                      style={{ 
                        color: '#1E3D36',
                        fontFamily: 'Inter, system-ui, sans-serif'
                      }}
                    >
                      {phase.title}
                    </h3>
                    <p 
                      className="text-sm leading-relaxed"
                      style={{ 
                        color: '#6B6B6B',
                        fontFamily: 'Inter, system-ui, sans-serif'
                      }}
                    >
                      {phase.desc}
                    </p>
                  </div>

                  {/* Mobile Connector Line (Vertical) */}
                  {i !== phases.length - 1 && (
                    <div 
                      className="lg:hidden absolute top-14 bottom-0 left-1/2 w-[2px] -z-10 h-[calc(100%+2rem)]"
                      style={{ background: 'rgba(30, 61, 54, 0.15)' }}
                    />
                  )}
                  
                  {/* Hover effect styles */}
                  <style>
                    {`
                      .group:hover > div:first-child {
                        background: #2E6F5E !important;
                        border-color: #2E6F5E !important;
                        box-shadow: 
                          0 0 0 4px rgba(46, 111, 94, 0.1),
                          0 4px 12px rgba(46, 111, 94, 0.15) !important;
                        transform: scale(1.08);
                      }
                      .group:hover > div:first-child svg {
                        color: #FFFFFF !important;
                      }
                      .group:hover > div:last-of-type {
                        transform: translateY(-4px);
                        border-color: rgba(46, 111, 94, 0.3) !important;
                        box-shadow: 
                          0 4px 16px rgba(0, 0, 0, 0.08), 
                          0 0 0 1px rgba(46, 111, 94, 0.1) !important;
                      }
                    `}
                  </style>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* 3. Strengthening Copy */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="text-center mt-16 max-w-3xl mx-auto"
        >
          <p 
            className="mb-2"
            style={{ 
              color: '#1E3D36',
              fontFamily: 'Inter, system-ui, sans-serif',
              fontSize: '1rem',
              fontWeight: 500,
              letterSpacing: '0.02em'
            }}
          >
            Strategy. Architecture. Production. Optimization.
          </p>
          <p 
            style={{ 
              color: '#6B6B6B',
              fontFamily: 'Inter, system-ui, sans-serif',
              fontSize: '0.875rem',
              fontWeight: 400,
              lineHeight: 1.6
            }}
          >
            No wasted cycles. No over-engineering. No 8-month timelines.
          </p>
        </motion.div>

      </div>
      
      {/* Reduced Motion Support */}
      <style>
        {`
          @media (prefers-reduced-motion: reduce) {
            * {
              animation: none !important;
              transition: none !important;
            }
          }
        `}
      </style>
    </section>
  );
}