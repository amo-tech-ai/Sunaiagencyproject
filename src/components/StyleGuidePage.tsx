'use client';

import { motion, useInView } from 'motion/react';
import { useRef } from 'react';
import { Check, ArrowRight } from 'lucide-react';

interface StyleGuidePageProps {
  onNavigate?: (page: string) => void;
}

export default function StyleGuidePage({ onNavigate }: StyleGuidePageProps) {
  const heroRef = useRef(null);
  const heroInView = useInView(heroRef, { once: true });

  const colors = [
    {
      name: 'Dark Teal',
      hex: '#0F3D3E',
      usage: 'Hero sections, premium backgrounds',
      textColor: 'text-white',
    },
    {
      name: 'Lime Green',
      hex: '#84CC16',
      usage: 'CTAs, accents, highlights',
      textColor: 'text-gray-900',
    },
    {
      name: 'White',
      hex: '#FFFFFF',
      usage: 'Backgrounds, cards',
      textColor: 'text-gray-900',
      border: true,
    },
    {
      name: 'Light Gray',
      hex: '#F3F4F6',
      usage: 'Alternate sections, subtle backgrounds',
      textColor: 'text-gray-900',
    },
    {
      name: 'Gray 900',
      hex: '#111827',
      usage: 'Primary text, headings',
      textColor: 'text-white',
    },
    {
      name: 'Gray 600',
      hex: '#4B5563',
      usage: 'Secondary text, body copy',
      textColor: 'text-white',
    },
  ];

  const typography = [
    {
      family: 'Playfair Display',
      usage: 'Headlines, section titles',
      weights: ['Regular (400)', 'SemiBold (600)', 'Bold (700)'],
      example: 'Artificial Intelligence at Scale',
      className: "font-['Playfair_Display'] text-6xl",
    },
    {
      family: 'Lora',
      usage: 'Body text, navigation, UI elements',
      weights: ['Regular (400)', 'Medium (500)', 'SemiBold (600)'],
      example: 'Building sophisticated AI solutions for modern businesses',
      className: "font-['Lora'] text-lg",
    },
  ];

  const buttons = [
    {
      name: 'Primary CTA',
      className: 'bg-[#84CC16] text-gray-900 px-8 py-4 font-["Lora"] hover:bg-[#73b512] transition-colors',
      text: 'Get Started',
    },
    {
      name: 'Secondary CTA',
      className: 'border border-white text-white px-8 py-4 font-["Lora"] hover:bg-white hover:text-gray-900 transition-colors',
      text: 'Learn More',
    },
    {
      name: 'Text Link',
      className: 'text-gray-900 font-["Lora"] hover:text-[#84CC16] transition-colors inline-flex items-center gap-2',
      text: 'View Details',
      icon: true,
    },
  ];

  const components = [
    {
      name: 'Metric Card',
      description: 'Display key statistics and metrics',
    },
    {
      name: 'Service Card',
      description: 'Showcase services with images and descriptions',
    },
    {
      name: 'Framework Tab',
      description: 'BCG-style tabbed content frameworks',
    },
    {
      name: 'Insight Card',
      description: 'Editorial-style content cards with gradients',
    },
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section ref={heroRef} className="bg-[#0F3D3E] text-white py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="font-['Playfair_Display'] text-5xl lg:text-7xl mb-6">
              Visual System &<br />Brand Style Guide
            </h1>
            <p className="font-['Lora'] text-xl lg:text-2xl text-white/80 max-w-3xl">
              A comprehensive guide to the Sun AI Agency design system—colors, typography, components, and principles for creating premium, editorial-quality experiences.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Design Principles */}
      <section className="py-24 lg:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <h2 className="font-['Playfair_Display'] text-4xl lg:text-5xl text-gray-900 mb-16">
            Design Principles
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div>
              <div className="w-12 h-12 bg-[#84CC16] flex items-center justify-center mb-6">
                <Check className="w-6 h-6 text-gray-900" />
              </div>
              <h3 className="font-['Playfair_Display'] text-2xl text-gray-900 mb-4">
                Calm Luxury
              </h3>
              <p className="font-['Lora'] text-gray-600 leading-relaxed">
                Editorial-inspired design with sophisticated typography, professional photography, and refined visual hierarchy.
              </p>
            </div>
            <div>
              <div className="w-12 h-12 bg-[#84CC16] flex items-center justify-center mb-6">
                <Check className="w-6 h-6 text-gray-900" />
              </div>
              <h3 className="font-['Playfair_Display'] text-2xl text-gray-900 mb-4">
                Clean Minimal
              </h3>
              <p className="font-['Lora'] text-gray-600 leading-relaxed">
                No shadows, no rounded buttons. Focus on sharp edges, clear hierarchy, and purposeful whitespace.
              </p>
            </div>
            <div>
              <div className="w-12 h-12 bg-[#84CC16] flex items-center justify-center mb-6">
                <Check className="w-6 h-6 text-gray-900" />
              </div>
              <h3 className="font-['Playfair_Display'] text-2xl text-gray-900 mb-4">
                Premium Experience
              </h3>
              <p className="font-['Lora'] text-gray-600 leading-relaxed">
                High-end UI experiences with scroll-triggered animations, smooth transitions, and thoughtful storytelling.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Color Palette */}
      <section className="py-24 lg:py-32 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <h2 className="font-['Playfair_Display'] text-4xl lg:text-5xl text-gray-900 mb-4">
            Color Palette
          </h2>
          <p className="font-['Lora'] text-xl text-gray-600 mb-16 max-w-3xl">
            Our color system is anchored by dark teal and lime green, creating a sophisticated yet energetic foundation for all brand touchpoints.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {colors.map((color, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div
                  className={`h-48 ${color.border ? 'border border-gray-300' : ''}`}
                  style={{ backgroundColor: color.hex }}
                />
                <div className="mt-6">
                  <h3 className="font-['Playfair_Display'] text-2xl text-gray-900 mb-2">
                    {color.name}
                  </h3>
                  <p className="font-['Lora'] text-sm text-gray-900 font-semibold mb-2">
                    {color.hex}
                  </p>
                  <p className="font-['Lora'] text-sm text-gray-600">
                    {color.usage}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Typography */}
      <section className="py-24 lg:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <h2 className="font-['Playfair_Display'] text-4xl lg:text-5xl text-gray-900 mb-4">
            Typography
          </h2>
          <p className="font-['Lora'] text-xl text-gray-600 mb-16 max-w-3xl">
            We use Playfair Display for headlines and Lora for body text, creating an elegant editorial feel that's both readable and distinctive.
          </p>

          <div className="space-y-16">
            {typography.map((font, index) => (
              <div key={index} className="border border-gray-200 p-12">
                <div className="mb-8">
                  <h3 className="font-['Playfair_Display'] text-3xl text-gray-900 mb-2">
                    {font.family}
                  </h3>
                  <p className="font-['Lora'] text-gray-600 mb-4">{font.usage}</p>
                  <div className="flex gap-4 flex-wrap">
                    {font.weights.map((weight, idx) => (
                      <span key={idx} className="font-['Lora'] text-sm text-gray-500 px-3 py-1 border border-gray-300">
                        {weight}
                      </span>
                    ))}
                  </div>
                </div>
                <p className={`${font.className} text-gray-900`}>
                  {font.example}
                </p>
              </div>
            ))}
          </div>

          {/* Type Scale */}
          <div className="mt-16 border border-gray-200 p-12">
            <h3 className="font-['Playfair_Display'] text-3xl text-gray-900 mb-8">
              Type Scale
            </h3>
            <div className="space-y-6">
              <p className="font-['Playfair_Display'] text-6xl text-gray-900">H1 — 60px</p>
              <p className="font-['Playfair_Display'] text-5xl text-gray-900">H2 — 48px</p>
              <p className="font-['Playfair_Display'] text-4xl text-gray-900">H3 — 36px</p>
              <p className="font-['Playfair_Display'] text-3xl text-gray-900">H4 — 30px</p>
              <p className="font-['Lora'] text-xl text-gray-900">Body Large — 20px</p>
              <p className="font-['Lora'] text-base text-gray-900">Body — 16px</p>
              <p className="font-['Lora'] text-sm text-gray-900">Small — 14px</p>
            </div>
          </div>
        </div>
      </section>

      {/* Buttons & CTAs */}
      <section className="py-24 lg:py-32 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <h2 className="font-['Playfair_Display'] text-4xl lg:text-5xl text-gray-900 mb-4">
            Buttons & CTAs
          </h2>
          <p className="font-['Lora'] text-xl text-gray-600 mb-16 max-w-3xl">
            All buttons feature sharp corners, no shadows, and clear hover states. CTAs are purposeful and minimal.
          </p>

          <div className="space-y-12">
            {buttons.map((button, index) => (
              <div key={index} className="border border-gray-200 p-12 bg-white">
                <h3 className="font-['Playfair_Display'] text-2xl text-gray-900 mb-6">
                  {button.name}
                </h3>
                <button className={button.className}>
                  {button.text}
                  {button.icon && <ArrowRight className="w-5 h-5" />}
                </button>
                <div className="mt-6">
                  <code className="font-mono text-sm text-gray-600 bg-gray-100 px-3 py-1">
                    {button.className}
                  </code>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Component Library */}
      <section className="py-24 lg:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <h2 className="font-['Playfair_Display'] text-4xl lg:text-5xl text-gray-900 mb-4">
            Component Library
          </h2>
          <p className="font-['Lora'] text-xl text-gray-600 mb-16 max-w-3xl">
            Reusable components designed for consistency and premium quality across all pages and experiences.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {components.map((component, index) => (
              <div
                key={index}
                className="border border-gray-200 p-8 hover:border-[#84CC16] transition-colors"
              >
                <h3 className="font-['Playfair_Display'] text-2xl text-gray-900 mb-3">
                  {component.name}
                </h3>
                <p className="font-['Lora'] text-gray-600">
                  {component.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Spacing & Grid */}
      <section className="py-24 lg:py-32 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <h2 className="font-['Playfair_Display'] text-4xl lg:text-5xl text-gray-900 mb-4">
            Spacing & Grid
          </h2>
          <p className="font-['Lora'] text-xl text-gray-600 mb-16 max-w-3xl">
            Our 8px base unit creates consistent rhythm. Sections use 96px (py-24) or 128px (py-32) vertical padding.
          </p>

          <div className="border border-gray-200 p-12 bg-white">
            <div className="space-y-6">
              <div className="flex items-center gap-6">
                <div className="w-2 h-2 bg-[#84CC16]" />
                <span className="font-['Lora'] text-gray-900">8px — Base unit</span>
              </div>
              <div className="flex items-center gap-6">
                <div className="w-4 h-4 bg-[#84CC16]" />
                <span className="font-['Lora'] text-gray-900">16px — Small spacing</span>
              </div>
              <div className="flex items-center gap-6">
                <div className="w-6 h-6 bg-[#84CC16]" />
                <span className="font-['Lora'] text-gray-900">24px — Medium spacing</span>
              </div>
              <div className="flex items-center gap-6">
                <div className="w-12 h-12 bg-[#84CC16]" />
                <span className="font-['Lora'] text-gray-900">48px — Large spacing</span>
              </div>
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 bg-[#84CC16]" />
                <span className="font-['Lora'] text-gray-900">96px — Section padding</span>
              </div>
            </div>
          </div>

          {/* Grid System */}
          <div className="mt-12 border border-gray-200 p-12 bg-white">
            <h3 className="font-['Playfair_Display'] text-3xl text-gray-900 mb-8">
              12-Column Grid
            </h3>
            <p className="font-['Lora'] text-gray-600 mb-8">
              Max width: 1280px (max-w-7xl) with responsive padding
            </p>
            <div className="grid grid-cols-12 gap-4">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="bg-[#84CC16]/20 h-16 border border-[#84CC16]" />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Animation Principles */}
      <section className="py-24 lg:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <h2 className="font-['Playfair_Display'] text-4xl lg:text-5xl text-gray-900 mb-4">
            Animation & Motion
          </h2>
          <p className="font-['Lora'] text-xl text-gray-600 mb-16 max-w-3xl">
            Scroll-triggered animations create smooth storytelling. All animations use 0.8s duration with staggered delays for grouped elements.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="border border-gray-200 p-8">
              <h3 className="font-['Playfair_Display'] text-2xl text-gray-900 mb-3">
                Fade In Up
              </h3>
              <p className="font-['Lora'] text-gray-600 mb-4">
                Default entrance animation for sections and content blocks
              </p>
              <code className="font-mono text-sm text-gray-600 bg-gray-100 px-3 py-1 block">
                initial: opacity: 0, y: 40<br />
                animate: opacity: 1, y: 0
              </code>
            </div>
            <div className="border border-gray-200 p-8">
              <h3 className="font-['Playfair_Display'] text-2xl text-gray-900 mb-3">
                Staggered Delay
              </h3>
              <p className="font-['Lora'] text-gray-600 mb-4">
                Sequential reveal for lists and grouped elements
              </p>
              <code className="font-mono text-sm text-gray-600 bg-gray-100 px-3 py-1 block">
                delay: index * 0.1
              </code>
            </div>
          </div>
        </div>
      </section>

      {/* Usage Guidelines */}
      <section className="py-24 lg:py-32 bg-[#0F3D3E] text-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <h2 className="font-['Playfair_Display'] text-4xl lg:text-5xl mb-12">
            Usage Guidelines
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h3 className="font-['Playfair_Display'] text-2xl mb-4">Do's</h3>
              <ul className="space-y-3 font-['Lora']">
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#84CC16] flex-shrink-0 mt-1" />
                  <span>Use sharp corners and clean edges</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#84CC16] flex-shrink-0 mt-1" />
                  <span>Maintain generous whitespace</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#84CC16] flex-shrink-0 mt-1" />
                  <span>Use professional, high-quality imagery</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#84CC16] flex-shrink-0 mt-1" />
                  <span>Apply scroll animations consistently</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-['Playfair_Display'] text-2xl mb-4">Don'ts</h3>
              <ul className="space-y-3 font-['Lora']">
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 flex-shrink-0 mt-1 text-red-400">✕</span>
                  <span>No shadows or drop shadows</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 flex-shrink-0 mt-1 text-red-400">✕</span>
                  <span>No rounded buttons or cards</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 flex-shrink-0 mt-1 text-red-400">✕</span>
                  <span>Avoid cluttered layouts</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 flex-shrink-0 mt-1 text-red-400">✕</span>
                  <span>Don't use more than 3 colors per section</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 lg:py-32 bg-white">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="font-['Playfair_Display'] text-4xl lg:text-5xl text-gray-900 mb-6">
            Ready to Build Something Beautiful?
          </h2>
          <p className="font-['Lora'] text-xl text-gray-600 mb-12">
            Use this guide to create consistent, premium experiences across all touchpoints.
          </p>
          <button
            onClick={() => onNavigate?.('booking')}
            className="bg-[#84CC16] text-gray-900 px-8 py-4 font-['Lora'] hover:bg-[#73b512] transition-colors"
          >
            Get Started
          </button>
        </div>
      </section>
    </div>
  );
}
