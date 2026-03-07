// C-CB04 — Workflow Diagrams
// BCG design system: white bg, charcoal text, Georgia serif, green accents, 4px radius

import { ArrowRight, CheckCircle, Play, Zap, Database, Bell } from 'lucide-react';
import { motion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';

export default function WorkflowDiagrams() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);

  const workflows = [
    {
      title: 'Ecommerce Support',
      userQuery: '"Where is my order?"',
      icon: Database,
      steps: [
        { action: 'Looks up order in database', icon: Database, delay: 0 },
        { action: 'Confirms current status', icon: CheckCircle, delay: 0.15 },
        { action: 'Sends tracking link via SMS', icon: Bell, delay: 0.3 },
        { action: 'Updates CRM support ticket', icon: Zap, delay: 0.45 },
      ],
      result: 'Support tickets reduced by ~70%',
      metric: '70%',
      metricLabel: 'Fewer Tickets'
    },
    {
      title: 'Sales Qualification',
      userQuery: '"I\'m interested in your product"',
      icon: Zap,
      steps: [
        { action: 'Asks qualifying questions', icon: Play, delay: 0 },
        { action: 'Scores lead quality (1-10)', icon: CheckCircle, delay: 0.15 },
        { action: 'Books calendar slot automatically', icon: Database, delay: 0.3 },
        { action: 'Notifies sales rep via Slack', icon: Bell, delay: 0.45 },
      ],
      result: 'Faster speed-to-lead, higher close rate',
      metric: '3x',
      metricLabel: 'Faster Response'
    },
    {
      title: 'WhatsApp Concierge',
      userQuery: 'Messages business on WhatsApp',
      icon: Bell,
      steps: [
        { action: 'Instant reply (24/7 availability)', icon: Zap, delay: 0 },
        { action: 'Answers common questions from KB', icon: Database, delay: 0.15 },
        { action: 'Routes hot leads to human agent', icon: ArrowRight, delay: 0.3 },
        { action: 'Logs full conversation in CRM', icon: CheckCircle, delay: 0.45 },
      ],
      result: 'More conversations → more deals',
      metric: '24/7',
      metricLabel: 'Always Available'
    },
  ];

  return (
    <section ref={containerRef} className="py-24 md:py-32 relative overflow-hidden" style={{ backgroundColor: '#FFFFFF' }}>
      {/* Parallax Background */}
      <motion.div className="absolute inset-0 opacity-[0.02]" style={{ y }}>
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at center, rgba(0,135,90,0.4) 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }} />
      </motion.div>

      <div className="max-w-[1120px] mx-auto px-6 relative">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-block mb-5">
            <span className="text-xs tracking-widest uppercase" style={{ color: '#00875A', letterSpacing: '0.08em' }}>
              Scroll-Driven Storytelling
            </span>
          </div>

          <h2
            className="text-3xl md:text-4xl tracking-tight mb-5"
            style={{ fontFamily: 'Georgia, serif', color: '#1A1A1A' }}
          >
            Real-World Workflows
          </h2>

          <p className="text-lg max-w-3xl mx-auto" style={{ color: '#6B6B63' }}>
            Not theoretical — these are actual business processes automated end-to-end
          </p>
        </motion.div>

        <div className="space-y-24">
          {workflows.map((workflow, workflowIndex) => (
            <div key={workflowIndex} className="relative">
              {/* Workflow Header */}
              <motion.div
                className="mb-10"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8 }}
              >
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-14 h-14 flex items-center justify-center text-white" style={{ backgroundColor: '#00875A', borderRadius: '4px' }}>
                    <workflow.icon className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-2xl md:text-3xl" style={{ fontFamily: 'Georgia, serif', color: '#1A1A1A' }}>
                      {workflow.title}
                    </h3>
                    <p className="text-sm" style={{ color: '#6B6B63' }}>Automated Workflow #{workflowIndex + 1}</p>
                  </div>
                </div>

                <div className="inline-block border-l-3 px-5 py-3" style={{ backgroundColor: '#F5F5F0', borderLeftWidth: '3px', borderLeftColor: '#00875A' }}>
                  <p style={{ color: '#6B6B63' }}>
                    <span style={{ color: '#1A1A1A' }}>User:</span> {workflow.userQuery}
                  </p>
                </div>
              </motion.div>

              {/* Flowchart - Desktop Horizontal */}
              <div className="hidden lg:block relative">
                {/* Progress Line */}
                <motion.div
                  className="absolute top-24 left-0 right-0 h-0.5"
                  style={{ backgroundColor: '#E8E8E4' }}
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 1.5, delay: 0.3 }}
                >
                  <motion.div
                    className="h-full"
                    style={{ backgroundColor: '#00875A' }}
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 1.5, delay: 0.5 }}
                  />
                </motion.div>

                <div className="grid grid-cols-4 gap-5">
                  {workflow.steps.map((step, stepIndex) => (
                    <motion.div
                      key={stepIndex}
                      className="relative"
                      initial={{ opacity: 0, y: 50 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-100px" }}
                      transition={{ duration: 0.6, delay: 0.6 + step.delay }}
                    >
                      {/* Step Number */}
                      <motion.div
                        className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-10 h-10 flex items-center justify-center text-white text-sm z-10 border-4 border-white"
                        style={{ backgroundColor: '#00875A', borderRadius: '4px' }}
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.5, delay: 0.8 + step.delay, type: "spring" }}
                      >
                        {stepIndex + 1}
                      </motion.div>

                      {/* Step Card */}
                      <div className="border bg-white p-5 pt-10 h-44 flex flex-col relative group hover:border-[#00875A] transition-colors" style={{ borderColor: '#E8E8E4', borderRadius: '4px' }}>
                        <div className="flex-shrink-0 mb-3 relative">
                          <div className="w-10 h-10 flex items-center justify-center border bg-white group-hover:border-[#00875A] transition-colors" style={{ borderColor: '#E8E8E4', borderRadius: '4px' }}>
                            <step.icon className="w-5 h-5 group-hover:text-[#00875A] transition-colors" style={{ color: '#1A1A1A' }} />
                          </div>
                        </div>
                        <p className="text-sm leading-relaxed relative" style={{ color: '#1A1A1A' }}>
                          {step.action}
                        </p>
                      </div>

                      {/* Arrow Connector */}
                      {stepIndex < workflow.steps.length - 1 && (
                        <motion.div
                          className="absolute top-20 -right-4 z-20"
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true, margin: "-100px" }}
                          transition={{ duration: 0.5, delay: 1 + step.delay }}
                        >
                          <ArrowRight className="w-8 h-8" style={{ color: '#00875A' }} />
                        </motion.div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Flowchart - Mobile Vertical */}
              <div className="lg:hidden space-y-5">
                {workflow.steps.map((step, stepIndex) => (
                  <motion.div
                    key={stepIndex}
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.5, delay: step.delay }}
                  >
                    <div className="border bg-white p-5 relative hover:border-[#00875A] transition-colors" style={{ borderColor: '#E8E8E4', borderRadius: '4px' }}>
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center text-white text-sm" style={{ backgroundColor: '#00875A', borderRadius: '4px' }}>
                          {stepIndex + 1}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <step.icon className="w-4 h-4" style={{ color: '#00875A' }} />
                            <span className="text-xs tracking-widest uppercase" style={{ color: '#6B6B63', letterSpacing: '0.06em' }}>
                              Step {stepIndex + 1}
                            </span>
                          </div>
                          <p className="text-sm leading-relaxed" style={{ color: '#1A1A1A' }}>
                            {step.action}
                          </p>
                        </div>
                      </div>
                    </div>
                    {stepIndex < workflow.steps.length - 1 && (
                      <div className="flex justify-center py-2">
                        <ArrowRight className="w-5 h-5 rotate-90" style={{ color: '#00875A' }} />
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>

              {/* Result Section */}
              <motion.div
                className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-5"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay: 1.5 }}
              >
                {/* Result Text */}
                <div className="border-2 p-7" style={{ borderColor: '#00875A', backgroundColor: 'rgba(0,135,90,0.03)', borderRadius: '4px' }}>
                  <div className="flex items-start gap-4">
                    <CheckCircle className="w-7 h-7 flex-shrink-0 mt-1" style={{ color: '#00875A' }} />
                    <div>
                      <p className="text-xs tracking-widest uppercase mb-2" style={{ color: '#6B6B63', letterSpacing: '0.06em' }}>Result</p>
                      <p className="text-lg" style={{ color: '#1A1A1A' }}>{workflow.result}</p>
                    </div>
                  </div>
                </div>

                {/* Metric Card */}
                <div className="text-white p-7 relative overflow-hidden" style={{ backgroundColor: '#1A1A1A', borderRadius: '4px' }}>
                  <div className="relative">
                    <p className="text-xs tracking-widest uppercase mb-2" style={{ letterSpacing: '0.06em', color: 'rgba(245,245,240,0.5)' }}>Impact Metric</p>
                    <p className="text-4xl mb-1" style={{ fontFamily: 'Georgia, serif' }}>
                      {workflow.metric}
                    </p>
                    <p className="text-sm" style={{ color: 'rgba(245,245,240,0.6)' }}>{workflow.metricLabel}</p>
                  </div>
                </div>
              </motion.div>
            </div>
          ))}
        </div>

        {/* Final Insight */}
        <motion.div
          className="mt-24 text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-block text-white px-10 py-7 max-w-3xl relative overflow-hidden" style={{ backgroundColor: '#1A1A1A', borderRadius: '4px' }}>
            <div className="relative">
              <p className="text-xl leading-relaxed">
                Every workflow is <span style={{ color: '#00875A' }}>customizable</span>, <span style={{ color: '#00875A' }}>scalable</span>, and <span style={{ color: '#00875A' }}>production-ready</span>.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
