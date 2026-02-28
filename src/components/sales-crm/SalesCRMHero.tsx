import { motion, useInView } from 'motion/react';
import { useRef } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function SalesCRMHero() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const pipelineStages = [
    { name: 'New', deals: [
      { company: 'Acme Corp', value: '$45K', score: 87, next: 'Discovery call booked' },
      { company: 'TechStart Inc', value: '$32K', score: 74, next: 'Awaiting response' }
    ]},
    { name: 'Qualified', deals: [
      { company: 'DataFlow', value: '$78K', score: 92, next: 'Demo scheduled' }
    ]},
    { name: 'Proposal', deals: [
      { company: 'CloudSync', value: '$120K', score: 89, next: 'Proposal sent' }
    ]},
    { name: 'Negotiation', deals: [
      { company: 'InnovateLabs', value: '$95K', score: 85, next: 'Terms review' }
    ]},
    { name: 'Closed', deals: [
      { company: 'BuildRight', value: '$67K', score: 91, next: 'Contract signed ✓' }
    ]}
  ];

  const activityFeed = [
    { action: 'Email sent', time: '2m ago', type: 'auto' },
    { action: 'Meeting booked', time: '15m ago', type: 'manual' },
    { action: 'Proposal generated', time: '1h ago', type: 'ai' }
  ];

  return (
    <section ref={ref} className="relative min-h-screen flex items-center overflow-hidden" style={{ backgroundColor: '#0E3E1B' }}>
      {/* Animated Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.03]"
           style={{
             backgroundImage: `linear-gradient(#7EF473 1px, transparent 1px), linear-gradient(90deg, #7EF473 1px, transparent 1px)`,
             backgroundSize: '60px 60px'
           }} />

      {/* Content */}
      <div className="relative z-10 w-full max-w-[1200px] mx-auto px-6 lg:px-8 py-32">
        <div className="grid grid-cols-1 lg:grid-cols-[55fr_45fr] gap-12 items-center">
          {/* Left Column - Copy */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -40 }}
            transition={{ duration: 0.8 }}
          >
            {/* Eyebrow */}
            <div className="mb-6">
              <span className="text-xs uppercase tracking-[0.2em] text-[#7EF473] font-semibold" style={{ fontFamily: 'system-ui, -apple-system' }}>
                AI SALES CRM
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-5xl lg:text-7xl xl:text-8xl mb-6 text-[#FAF9F5] leading-[1.1]"
                style={{ fontFamily: 'Georgia, serif' }}>
              A Sales CRM That Sells for You
            </h1>

            {/* Subhead */}
            <p className="text-lg lg:text-xl text-[#FAF9F5]/80 mb-10 leading-relaxed"
               style={{ fontFamily: 'system-ui, -apple-system' }}>
              AI-powered lead capture, intelligent scoring, automated outreach, and proposal generation — so your sales team focuses on closing, not data entry. Every lead tracked. Every follow-up sent. Every opportunity scored. Automatically.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <button className="bg-[#7EF473] text-[#0E3E1B] px-8 py-4 rounded-full font-semibold hover:bg-[#6DE362] hover:shadow-lg hover:shadow-[#7EF473]/30 transition-all duration-300 flex items-center justify-center gap-2"
                      style={{ fontFamily: 'system-ui, -apple-system' }}>
                See the CRM in Action (Demo)
                <ArrowRight className="w-5 h-5" />
              </button>
              <button className="border-2 border-[#FAF9F5]/20 text-[#FAF9F5] px-8 py-4 rounded-full font-semibold hover:bg-white/5 hover:border-[#FAF9F5]/40 transition-all duration-300 backdrop-blur-sm"
                      style={{ fontFamily: 'system-ui, -apple-system' }}>
                Book a Sales Strategy Call
              </button>
            </div>

            {/* Trust Line */}
            <p className="text-sm text-[#FAF9F5]/60"
               style={{ fontFamily: 'system-ui, -apple-system' }}>
              Clients average <strong className="text-[#7EF473]">3x pipeline velocity</strong> within 90 days of deployment
            </p>
          </motion.div>

          {/* Right Column - CRM Dashboard Mockup */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 40 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hidden lg:block"
          >
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-2xl">
              {/* Dashboard Header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-white text-lg font-semibold" style={{ fontFamily: 'system-ui, -apple-system' }}>
                  Sales Pipeline
                </h3>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#7EF473]" />
                  <span className="text-xs text-[#7EF473]" style={{ fontFamily: 'system-ui, -apple-system' }}>
                    AI Active
                  </span>
                </div>
              </div>

              {/* Pipeline Columns - Scrollable Horizontal */}
              <div className="flex gap-3 overflow-x-auto pb-4" style={{ scrollbarWidth: 'thin' }}>
                {pipelineStages.map((stage, stageIndex) => (
                  <motion.div
                    key={stageIndex}
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ duration: 0.6, delay: 0.4 + stageIndex * 0.1 }}
                    className="flex-shrink-0 w-44"
                  >
                    {/* Stage Header */}
                    <div className="bg-white/5 rounded-lg px-3 py-2 mb-3">
                      <span className="text-white/80 text-xs font-semibold" style={{ fontFamily: 'system-ui, -apple-system' }}>
                        {stage.name}
                      </span>
                      <span className="text-white/50 text-xs ml-2">
                        {stage.deals.length}
                      </span>
                    </div>

                    {/* Deal Cards */}
                    <div className="space-y-2">
                      {stage.deals.map((deal, dealIndex) => (
                        <motion.div
                          key={dealIndex}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
                          transition={{ duration: 0.4, delay: 0.6 + stageIndex * 0.1 + dealIndex * 0.05 }}
                          className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-3 hover:border-[#7EF473]/50 transition-all cursor-pointer"
                        >
                          <div className="text-white text-sm font-medium mb-1" style={{ fontFamily: 'system-ui, -apple-system' }}>
                            {deal.company}
                          </div>
                          <div className="text-[#7EF473] text-lg font-bold mb-2" style={{ fontFamily: 'Georgia, serif' }}>
                            {deal.value}
                          </div>
                          
                          {/* AI Score Badge */}
                          <div className="flex items-center gap-2 mb-2">
                            <div className="bg-[#7EF473] text-[#0E3E1B] px-2 py-0.5 rounded-full text-xs font-bold flex items-center gap-1">
                              <Sparkles className="w-3 h-3" />
                              {deal.score}
                            </div>
                          </div>

                          <div className="text-white/60 text-xs" style={{ fontFamily: 'system-ui, -apple-system' }}>
                            {deal.next}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Activity Timeline Panel */}
              <div className="mt-6 pt-6 border-t border-white/10">
                <h4 className="text-white/80 text-xs font-semibold mb-3 uppercase tracking-wider" style={{ fontFamily: 'system-ui, -apple-system' }}>
                  Recent Activity
                </h4>
                <div className="space-y-2">
                  {activityFeed.map((activity, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
                      transition={{ duration: 0.4, delay: 1 + index * 0.1 }}
                      className="flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${
                          activity.type === 'ai' ? 'bg-[#7EF473]' : 
                          activity.type === 'auto' ? 'bg-blue-400' : 
                          'bg-white/40'
                        }`} />
                        <span className="text-white/70" style={{ fontFamily: 'system-ui, -apple-system' }}>
                          {activity.action}
                        </span>
                        {activity.type === 'ai' && (
                          <span className="text-[#7EF473] text-[10px] font-bold px-1.5 py-0.5 bg-[#7EF473]/10 rounded">
                            AI
                          </span>
                        )}
                      </div>
                      <span className="text-white/40" style={{ fontFamily: 'system-ui, -apple-system' }}>
                        {activity.time}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
