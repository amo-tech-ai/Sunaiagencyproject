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
    <section ref={containerRef} className="bg-white py-32 md:py-40 relative overflow-hidden">
      {/* Parallax Background */}
      <motion.div 
        className="absolute inset-0 opacity-[0.02]"
        style={{ y }}
      >
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at center, rgba(132,204,22,0.4) 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }} />
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div 
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-block mb-6">
            <span className="text-xs uppercase tracking-widest text-[#84CC16] font-semibold font-['Lora']">
              Scroll-Driven Storytelling
            </span>
          </div>
          
          <h2 
            className="text-5xl md:text-6xl tracking-tight text-gray-900 mb-6"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            Real-World Workflows
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto font-['Lora']">
            Not theoretical — these are actual business processes automated end-to-end
          </p>
        </motion.div>

        <div className="space-y-32">
          {workflows.map((workflow, workflowIndex) => (
            <div key={workflowIndex} className="relative">
              {/* Workflow Header */}
              <motion.div
                className="mb-12"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8 }}
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 flex items-center justify-center bg-[#84CC16] text-gray-900">
                    <workflow.icon className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 
                      className="text-3xl md:text-4xl text-gray-900"
                      style={{ fontFamily: 'Playfair Display, serif' }}
                    >
                      {workflow.title}
                    </h3>
                    <p className="text-sm text-gray-500 font-['Lora']">Automated Workflow #{workflowIndex + 1}</p>
                  </div>
                </div>
                
                <div className="inline-block bg-gray-50 border-l-4 border-[#84CC16] px-6 py-4">
                  <p className="text-gray-600 font-['Lora']">
                    <span className="font-semibold text-gray-900">User:</span> {workflow.userQuery}
                  </p>
                </div>
              </motion.div>

              {/* Flowchart - Desktop Horizontal */}
              <div className="hidden lg:block relative">
                {/* Progress Line */}
                <motion.div
                  className="absolute top-24 left-0 right-0 h-1 bg-gray-200"
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 1.5, delay: 0.3 }}
                  style={{ transformOrigin: 'left' }}
                >
                  <motion.div
                    className="h-full bg-[#84CC16]"
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 1.5, delay: 0.5 }}
                    style={{ transformOrigin: 'left' }}
                  />
                </motion.div>

                <div className="grid grid-cols-4 gap-6">
                  {workflow.steps.map((step, stepIndex) => (
                    <motion.div
                      key={stepIndex}
                      className="relative"
                      initial={{ opacity: 0, y: 50 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-100px" }}
                      transition={{ duration: 0.6, delay: 0.6 + step.delay }}
                    >
                      {/* Step Number Circle */}
                      <motion.div
                        className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-12 h-12 flex items-center justify-center bg-[#84CC16] text-gray-900 text-lg font-bold z-10 border-4 border-white"
                        initial={{ scale: 0, rotate: -180 }}
                        whileInView={{ scale: 1, rotate: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.5, delay: 0.8 + step.delay, type: "spring" }}
                      >
                        {stepIndex + 1}
                      </motion.div>

                      {/* Step Card */}
                      <motion.div 
                        className="bg-white border-2 border-gray-200 p-6 pt-10 h-48 flex flex-col relative group hover:border-[#84CC16] transition-colors"
                        whileHover={{ y: -8, scale: 1.05 }}
                      >
                        {/* Glow Effect */}
                        <div className="absolute inset-0 bg-gradient-to-br from-[#84CC16]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        
                        {/* Icon */}
                        <div className="flex-shrink-0 mb-4 relative">
                          <div className="w-12 h-12 flex items-center justify-center bg-gray-50 border border-gray-200 group-hover:border-[#84CC16] group-hover:bg-[#84CC16]/10 transition-colors">
                            <step.icon className="w-6 h-6 text-gray-600 group-hover:text-[#84CC16] transition-colors" />
                          </div>
                        </div>
                        
                        {/* Text */}
                        <p className="text-sm text-gray-700 leading-relaxed font-['Lora'] relative">
                          {step.action}
                        </p>

                        {/* Corner Accent */}
                        <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-gray-200 group-hover:border-[#84CC16] transition-colors" />
                      </motion.div>

                      {/* Arrow Connector */}
                      {stepIndex < workflow.steps.length - 1 && (
                        <motion.div
                          className="absolute top-20 -right-5 z-20"
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true, margin: "-100px" }}
                          transition={{ duration: 0.5, delay: 1 + step.delay }}
                        >
                          <ArrowRight className={`w-10 h-10 text-[#84CC16]`} />
                        </motion.div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Flowchart - Mobile Vertical */}
              <div className="lg:hidden space-y-6">
                {workflow.steps.map((step, stepIndex) => (
                  <motion.div
                    key={stepIndex}
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.5, delay: step.delay }}
                  >
                    <div className="bg-white border-2 border-gray-200 p-6 relative hover:border-[#84CC16] transition-colors">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center bg-[#84CC16] text-gray-900 text-lg font-bold">
                          {stepIndex + 1}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <step.icon className="w-5 h-5 text-[#84CC16]" />
                            <span className="text-xs uppercase tracking-widest text-gray-500 font-['Lora']">
                              Step {stepIndex + 1}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700 leading-relaxed font-['Lora']">
                            {step.action}
                          </p>
                        </div>
                      </div>
                    </div>
                    {stepIndex < workflow.steps.length - 1 && (
                      <div className="flex justify-center py-2">
                        <ArrowRight className="w-6 h-6 text-[#84CC16] rotate-90" />
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>

              {/* Result Section */}
              <motion.div
                className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay: 1.5 }}
              >
                {/* Result Text */}
                <div className="bg-[#84CC16]/5 border-2 border-[#84CC16] p-8">
                  <div className="flex items-start gap-4">
                    <CheckCircle className="w-8 h-8 text-[#84CC16] flex-shrink-0 mt-1" />
                    <div>
                      <p className="text-xs uppercase tracking-widest text-gray-500 mb-2 font-['Lora']">Result</p>
                      <p className="text-gray-900 font-semibold text-xl font-['Lora']">{workflow.result}</p>
                    </div>
                  </div>
                </div>

                {/* Metric Card */}
                <div className="bg-[#0F3D3E] text-white p-8 relative overflow-hidden">
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0" style={{
                      backgroundImage: `radial-gradient(circle, white 1px, transparent 1px)`,
                      backgroundSize: '20px 20px'
                    }} />
                  </div>
                  <div className="relative">
                    <p className="text-sm uppercase tracking-widest mb-2 opacity-90">Impact Metric</p>
                    <p className="text-5xl font-bold mb-1" style={{ fontFamily: 'Playfair Display, serif' }}>
                      {workflow.metric}
                    </p>
                    <p className="text-sm opacity-90 font-['Lora']">{workflow.metricLabel}</p>
                  </div>
                </div>
              </motion.div>
            </div>
          ))}
        </div>

        {/* Final Insight */}
        <motion.div
          className="mt-32 text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-block bg-[#0F3D3E] text-white px-12 py-8 max-w-3xl relative overflow-hidden">
            <div className="absolute inset-0 opacity-5">
              <div className="absolute inset-0" style={{
                backgroundImage: `linear-gradient(45deg, transparent 25%, rgba(255,255,255,0.1) 25%, rgba(255,255,255,0.1) 50%, transparent 50%, transparent 75%, rgba(255,255,255,0.1) 75%)`,
                backgroundSize: '20px 20px'
              }} />
            </div>
            <div className="relative">
              <p className="text-2xl font-['Lora'] leading-relaxed">
                Every workflow is <span className="font-bold text-[#84CC16]">customizable</span>, <span className="font-bold text-[#84CC16]">scalable</span>, and <span className="font-bold text-[#84CC16]">production-ready</span>.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}