import { useState } from 'react';
import { motion } from 'motion/react';
import { Target, Zap, Cog, Users, Database, TrendingUp, Sparkles } from 'lucide-react';

interface V2AIMaturityFrameworkProps {
  onNavigate?: (page: string) => void;
}

type MaturityStage = 'laggard' | 'scaling' | 'future-built';

interface StrategyPillar {
  icon: React.ElementType;
  title: string;
  subtitle: string;
}

interface StageCard {
  stage: MaturityStage;
  title: string;
  subtitle: string;
  actions: string[];
}

export default function V2AIMaturityFramework({ onNavigate }: V2AIMaturityFrameworkProps) {
  const [activeStage, setActiveStage] = useState<MaturityStage | null>(null);

  const strategyPillars: StrategyPillar[] = [
    {
      icon: Target,
      title: 'Pursue a multiyear strategic ambition',
      subtitle: 'Long-term value creation',
    },
    {
      icon: Zap,
      title: 'Reshape and invent with impact',
      subtitle: 'High-ROI transformation',
    },
    {
      icon: Cog,
      title: 'Implement an AI-first operating model',
      subtitle: 'Accelerated execution',
    },
    {
      icon: Users,
      title: 'Secure and enable necessary talent',
      subtitle: 'Organizational readiness',
    },
    {
      icon: Database,
      title: 'Use fit-for-purpose technology and data',
      subtitle: 'Scalable architecture',
    },
  ];

  const scalingStage: StageCard = {
    stage: 'scaling',
    title: 'Move up to scaling',
    subtitle: 'Develop AI strategy, advance AI capabilities, and scale AI effectively',
    actions: [
      'Set up an AI program with an ambitious top-down value target',
      'Ensure leadership commitment to AI transformation and tactical usage',
      'Prioritize high-ROI workflows in a rigorously tracked roadmap',
      'Select one or two business domains for end-to-end AI first conversion',
      'Establish an AI delivery office as accelerator tracking progress and value',
      'Set up joint business/IT teams for prioritized workflows with clear KPIs',
      'Support practical application of AI tools in day-to-day work',
      'Start an AI upskilling effort with protected time',
      'Define guardrails and set up for a scalable, modular AI architecture',
      'Leverage AI workflows to implement and enhance the AI architecture',
    ],
  };

  const futureBuiltStage: StageCard = {
    stage: 'future-built',
    title: 'Move up to future-built',
    subtitle: 'Take the forefront of AI innovation and cutting-edge AI capabilities, generating substantial value',
    actions: [
      'Focus on achieving the concrete path to value that you defined',
      'Advance in forward-looking capabilities such as agentic AI',
      'Scale AI workflows to unlock P&L impact across functions',
      'Invent new end-to-end AI-first workflows to shape the market',
      'Scale the AI ecosystem with long-term partnerships so all participants have skin in the game',
      'Empower teams to own AI solutions with joint business/IT ownership',
      'Ensure enterprise-wide access and adoption of AI tools and workflows',
      'Double down on workforce transformation to prepare for agentic AI',
      'Drive enterprise-wide deployment of AI platforms at scale',
      'Refine data and architecture management to increase effectiveness',
    ],
  };

  const maturityStages = [
    { id: 'laggard' as MaturityStage, label: 'Laggard', position: 0 },
    { id: 'scaling' as MaturityStage, label: 'Scaling', position: 50 },
    { id: 'future-built' as MaturityStage, label: 'Future-built', position: 100 },
  ];

  return (
    <section className="relative bg-[#FAF8F6] py-24 lg:py-32 overflow-hidden">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
        {/* Header */}
        <motion.div
          className="mb-16 lg:mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-block px-4 py-1.5 bg-[#84CC16]/10 mb-6">
            <span className="text-xs font-medium text-[#0F3D3E] uppercase tracking-[0.2em]">
              EXHIBIT 2
            </span>
          </div>
          <h2 className="font-['Playfair_Display'] text-4xl lg:text-5xl font-bold text-[#0F3D3E] leading-tight max-w-5xl">
            The Future-Built Playbook for Climbing the AI Maturity Curve
          </h2>
        </motion.div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-12 lg:gap-16">
          
          {/* Left Sidebar: Strategy Pillars */}
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            {strategyPillars.map((pillar, index) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={index}
                  className="flex gap-4 group cursor-default"
                >
                  <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-[#0F3D3E]/60 group-hover:text-[#0F3D3E] transition-colors" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="font-['Lora'] text-base font-semibold text-[#0F3D3E] leading-snug mb-1">
                      {pillar.title}
                    </h3>
                    <p className="font-['Lora'] text-sm text-[#0F3D3E]/60 leading-relaxed">
                      {pillar.subtitle}
                    </p>
                  </div>
                </div>
              );
            })}
          </motion.div>

          {/* Right: Maturity Stages */}
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            {/* Scaling Stage */}
            <StageSection
              stage={scalingStage}
              isActive={activeStage === 'scaling'}
              onHover={() => setActiveStage('scaling')}
              onLeave={() => setActiveStage(null)}
              accentColor="#84CC16"
            />

            {/* Future-Built Stage */}
            <StageSection
              stage={futureBuiltStage}
              isActive={activeStage === 'future-built'}
              onHover={() => setActiveStage('future-built')}
              onLeave={() => setActiveStage(null)}
              accentColor="#65A30D"
            />

            {/* Maturity Curve Progress Bar */}
            <div className="mt-16 pt-8 border-t border-[#0F3D3E]/10">
              <div className="relative">
                {/* Progress Line */}
                <div className="absolute top-6 left-0 right-0 h-0.5 bg-[#0F3D3E]/10" />
                <div 
                  className="absolute top-6 left-0 h-0.5 bg-[#84CC16] transition-all duration-700"
                  style={{ 
                    width: activeStage === 'future-built' ? '100%' : activeStage === 'scaling' ? '50%' : '0%' 
                  }}
                />

                {/* Stage Markers */}
                <div className="relative flex justify-between items-start">
                  {maturityStages.map((stage, index) => (
                    <div
                      key={stage.id}
                      className="flex flex-col items-center"
                      style={{ width: index === 0 ? 'auto' : index === 2 ? 'auto' : '50%' }}
                    >
                      <div 
                        className={`w-3 h-3 rounded-full border-2 transition-all duration-500 ${
                          activeStage === stage.id
                            ? 'bg-[#84CC16] border-[#84CC16] scale-125'
                            : 'bg-white border-[#0F3D3E]/30'
                        }`}
                      />
                      <span 
                        className={`mt-3 text-sm font-['Lora'] font-medium transition-colors ${
                          activeStage === stage.id ? 'text-[#84CC16]' : 'text-[#0F3D3E]/60'
                        }`}
                      >
                        {stage.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Footer Attribution */}
        <motion.div
          className="mt-16 pt-8 border-t border-[#0F3D3E]/10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <p className="text-xs text-[#0F3D3E]/50 font-['Lora']">
            Source: StartupAI Strategic Framework
          </p>
        </motion.div>
      </div>
    </section>
  );
}

// Stage Section Component
interface StageSectionProps {
  stage: StageCard;
  isActive: boolean;
  onHover: () => void;
  onLeave: () => void;
  accentColor: string;
}

function StageSection({ stage, isActive, onHover, onLeave, accentColor }: StageSectionProps) {
  return (
    <div
      className="group"
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    >
      {/* Stage Header */}
      <div 
        className="inline-block px-6 py-3 mb-6 transition-all duration-500"
        style={{ 
          backgroundColor: isActive ? accentColor : `${accentColor}20`,
        }}
      >
        <h3 
          className="font-['Playfair_Display'] text-2xl lg:text-3xl font-bold transition-colors"
          style={{ color: isActive ? 'white' : '#0F3D3E' }}
        >
          {stage.title}
        </h3>
      </div>

      {/* Stage Subtitle */}
      <p className="font-['Lora'] text-base lg:text-lg text-[#0F3D3E]/70 leading-relaxed mb-8 max-w-3xl">
        {stage.subtitle}
      </p>

      {/* Action Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {stage.actions.map((action, index) => (
          <ActionCard
            key={index}
            text={action}
            isParentActive={isActive}
            delay={index * 0.05}
          />
        ))}
      </div>
    </div>
  );
}

// Action Card Component
interface ActionCardProps {
  text: string;
  isParentActive: boolean;
  delay: number;
}

function ActionCard({ text, isParentActive, delay }: ActionCardProps) {
  return (
    <motion.div
      className={`
        bg-white p-6 
        border border-[#0F3D3E]/10
        transition-all duration-500
        hover:border-[#84CC16]/40
        hover:shadow-sm
        ${isParentActive ? 'border-[#84CC16]/20' : ''}
      `}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-1.5 h-1.5 bg-[#84CC16] mt-2" style={{ borderRadius: '1px' }} />
        <p className="font-['Lora'] text-sm lg:text-base text-[#0F3D3E]/80 leading-relaxed">
          {text}
        </p>
      </div>
    </motion.div>
  );
}
