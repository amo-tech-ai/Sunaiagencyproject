'use client';

import { motion, useInView } from 'motion/react';
import { useRef } from 'react';
import { Check, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router';
import { pageToPath } from '../lib/navigation';
import WebDesignServicesGrid from './web-design/WebDesignServicesGrid';
import WebDesignProcess from './web-design/WebDesignProcess';
import StyleGuideComponentsShowcase from './style-guide/StyleGuideComponents';
import WebDesignHero from './web-design/WebDesignHero';
import ExploreMore from './web-design/ExploreMore';
import OurServicesGrid from './home/OurServicesGrid';
import GanttChart from './style-guide/GanttChart';

export default function StyleGuidePage() {
  const nav = useNavigate();
  const onNavigate = (page: string) => nav(pageToPath(page));
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

  const sprucedColors = [
    {
      name: 'Warm Beige',
      hex: '#F4F3EE',
      usage: 'Light backgrounds, homepage sections',
      textColor: 'text-gray-900',
    },
    {
      name: 'Deep Green',
      hex: '#1E3D36',
      usage: 'Headlines, primary text on light backgrounds',
      textColor: 'text-white',
    },
    {
      name: 'Muted Sage',
      hex: '#DCE5DD',
      usage: 'Subtle cards, secondary backgrounds',
      textColor: 'text-gray-900',
    },
    {
      name: 'Accent Green',
      hex: '#2E6F5E',
      usage: 'Accents, highlights, secondary CTAs',
      textColor: 'text-white',
    },
    {
      name: 'Lime Green',
      hex: '#84CC16',
      usage: 'Energy accents, animations, CTAs',
      textColor: 'text-gray-900',
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

  const homepageComponents = [
    {
      name: 'Service Image Card (Hover Expand)',
      palette: 'Spruced',
      description: 'Premium service card with image, short description, and hover-to-expand overlay with extended content and CTA',
      features: [
        'Default state: Image (220px) + title + short description + "Learn More" link',
        'Hover state: Smooth slide-up overlay with beige background (#F4F3EE)',
        'Extended description with staggered animation delays',
        'Rounded corners (rounded-2xl) with subtle border',
        'Optional badge overlay on image (e.g., "90+")',
      ],
      usage: 'Homepage "Our Services" section — 3-column grid',
      code: `<div className="group cursor-pointer rounded-2xl overflow-hidden">
  {/* Default State */}
  <div className="transition-opacity group-hover:opacity-0">
    <img className="h-[220px] object-cover" />
    <div className="p-6">
      <h3 className="font-['Playfair_Display'] text-xl mb-2">Title</h3>
      <p className="text-sm text-gray-600 mb-4">Short description</p>
      <span className="text-sm text-[#2E6F5E]">Learn More →</span>
    </div>
  </div>
  
  {/* Hover State */}
  <div className="absolute inset-0 bg-[#F4F3EE] translate-y-full group-hover:translate-y-0">
    <h3>Title</h3>
    <p>Extended description</p>
    <button className="bg-[#1E3D36]">LEARN MORE</button>
  </div>
</div>`,
    },
    {
      name: 'Capability Card',
      palette: 'Spruced',
      description: 'Minimal card with icon, title, and description for showcasing AI capabilities',
      features: [
        'Muted sage background (#DCE5DD)',
        'Icon container with accent green backdrop (rgba(46,111,94,0.12))',
        'Rounded corners (rounded-xl)',
        'Hover lift effect (-translate-y-1)',
        'Clean typography hierarchy',
      ],
      usage: 'Homepage "Our AI Solutions and Capabilities" section — 3-column grid',
      code: `<div className="rounded-xl p-8 bg-[#DCE5DD] hover:-translate-y-1 transition-all">
  <div className="w-10 h-10 rounded-lg bg-[rgba(46,111,94,0.12)] flex items-center justify-center mb-5">
    <Icon className="w-5 h-5 text-[#2E6F5E]" />
  </div>
  <h3 className="text-lg font-semibold text-[#1E3D36] mb-3">Title</h3>
  <p className="text-sm text-gray-600 leading-relaxed">Description</p>
</div>`,
    },
    {
      name: 'Hero Section (Editorial)',
      palette: 'Spruced',
      description: 'Two-column hero with headline, body, CTAs, and image',
      features: [
        'Warm beige background (#F4F3EE)',
        'Large Playfair Display headline (clamp 2.25rem to 3.5rem)',
        'Deep green text (#1E3D36)',
        'Two-button CTA pattern (Primary + Outline)',
        'Image with rounded corners and decorative dot',
        'Responsive grid (lg:grid-cols-2)',
      ],
      usage: 'Homepage hero section — top of page',
      code: `<section className="bg-[#F4F3EE] pt-28 pb-24">
  <div className="grid lg:grid-cols-2 gap-16 items-center">
    <div>
      <h1 className="font-['Playfair_Display'] text-6xl text-[#1E3D36] mb-6">
        Build intelligent AI products
      </h1>
      <p className="text-lg text-gray-600 mb-10">Description</p>
      <div className="flex gap-4">
        <button className="bg-[#1E3D36] text-white px-6 py-3">Primary CTA</button>
        <button className="border-2 border-[#1E3D36] text-[#1E3D36] px-6 py-3">Secondary</button>
      </div>
    </div>
    <div className="rounded-2xl overflow-hidden">
      <img className="w-full h-full object-cover" />
    </div>
  </div>
</section>`,
    },
    {
      name: 'Credibility Band',
      palette: 'Spruced',
      description: 'Full-width dark banner with centered messaging and key metric',
      features: [
        'Deep green background (#1E3D36)',
        'Eyebrow label with extreme letter-spacing',
        'Large Playfair Display headline in white',
        'Bold metric callout (e.g., "94% client satisfaction")',
        'Centered text alignment',
        'Generous vertical padding (py-20 to py-24)',
      ],
      usage: 'Homepage credibility section — between major content blocks',
      code: `<section className="bg-[#1E3D36] py-20 text-center">
  <p className="text-white/40 uppercase tracking-[0.25em] text-xs mb-5">
    Trusted by teams scaling with AI
  </p>
  <h2 className="font-['Playfair_Display'] text-4xl text-white mb-6">
    Built for teams scaling with AI.
  </h2>
  <p className="text-white/50 text-xl">
    <span className="text-white font-bold">94%</span> client satisfaction
  </p>
</section>`,
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
            Color Palettes
          </h2>
          <p className="font-['Lora'] text-xl text-gray-600 mb-8 max-w-3xl">
            Sun AI Agency uses two complementary color systems to create versatile, premium experiences across different contexts.
          </p>

          {/* Palette Usage Guide */}
          <div className="mb-16 border border-gray-200 bg-white p-8">
            <h3 className="font-['Playfair_Display'] text-2xl text-gray-900 mb-6">
              When to Use Each Palette
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-['Lora'] text-lg text-gray-900 font-semibold mb-3">
                  Primary Palette (Dark Teal + Lime)
                </h4>
                <ul className="space-y-2 font-['Lora'] text-gray-600">
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-[#84CC16] flex-shrink-0 mt-1" />
                    <span>Dark hero sections with high contrast</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-[#84CC16] flex-shrink-0 mt-1" />
                    <span>Technical/product pages</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-[#84CC16] flex-shrink-0 mt-1" />
                    <span>Bold, energetic messaging</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-[#84CC16] flex-shrink-0 mt-1" />
                    <span>CTA-focused sections</span>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-['Lora'] text-lg text-gray-900 font-semibold mb-3">
                  Spruced Palette (Warm Beige + Green)
                </h4>
                <ul className="space-y-2 font-['Lora'] text-gray-600">
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-[#2E6F5E] flex-shrink-0 mt-1" />
                    <span>Light, editorial homepage sections</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-[#2E6F5E] flex-shrink-0 mt-1" />
                    <span>Luxury, calm luxury aesthetic</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-[#2E6F5E] flex-shrink-0 mt-1" />
                    <span>Content-heavy storytelling pages</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-[#2E6F5E] flex-shrink-0 mt-1" />
                    <span>Approachable, sophisticated tone</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Primary Palette */}
          <h3 className="font-['Playfair_Display'] text-3xl text-gray-900 mb-4">
            Primary Palette
          </h3>
          <p className="font-['Lora'] text-lg text-gray-600 mb-12 max-w-3xl">
            Dark teal and lime green create a sophisticated yet energetic foundation—perfect for technical sections and bold hero moments.
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

          {/* Spruced Colors */}
          <h3 className="font-['Playfair_Display'] text-3xl text-gray-900 mt-16 mb-4">
            Spruced Palette
          </h3>
          <p className="font-['Lora'] text-lg text-gray-600 mb-12 max-w-3xl">
            These colors add a touch of elegance and warmth to your design, enhancing the overall aesthetic.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sprucedColors.map((color, index) => (
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

          {/* Homepage Components */}
          <h3 className="font-['Playfair_Display'] text-3xl text-gray-900 mt-16 mb-4">
            Homepage Components
          </h3>
          <p className="font-['Lora'] text-lg text-gray-600 mb-12 max-w-3xl">
            Specialized components from HomePageV3 with Spruced design palette.
          </p>

          <div className="space-y-8">
            {homepageComponents.map((component, index) => (
              <div
                key={index}
                className="border border-gray-200 bg-white hover:border-[#84CC16] transition-colors"
              >
                <div className="p-8 border-b border-gray-200 bg-gray-50">
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="font-['Playfair_Display'] text-2xl text-gray-900">
                      {component.name}
                    </h4>
                    <span className="text-xs font-['Lora'] font-semibold text-[#2E6F5E] bg-[#DCE5DD] px-3 py-1 rounded-full">
                      {component.palette}
                    </span>
                  </div>
                  <p className="font-['Lora'] text-gray-600 mb-4">
                    {component.description}
                  </p>
                  <p className="font-['Lora'] text-sm text-gray-500">
                    <span className="font-semibold">Usage:</span> {component.usage}
                  </p>
                </div>

                <div className="p-8">
                  <h5 className="font-['Lora'] text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">
                    Key Features
                  </h5>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-6">
                    {component.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 font-['Lora'] text-sm text-gray-600">
                        <Check className="w-4 h-4 text-[#84CC16] flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <h5 className="font-['Lora'] text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">
                    Code Example
                  </h5>
                  <pre className="bg-gray-900 p-6 rounded overflow-x-auto">
                    <code className="font-mono text-xs text-gray-100 whitespace-pre">
                      {component.code}
                    </code>
                  </pre>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Component Examples - Live Interactive */}
      <StyleGuideComponentsShowcase />

      {/* 01 — Web Design Services Grid */}
      <section className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
          <div className="flex items-baseline gap-4 mb-4">
            <span className="font-['Lora'] text-sm font-semibold text-[#84CC16] tracking-wider">01</span>
            <h2 className="font-['Playfair_Display'] text-4xl lg:text-5xl text-gray-900">
              Web Design Services Grid
            </h2>
          </div>
          <p className="font-['Lora'] text-sm font-semibold text-gray-500 mb-2">
            Component Name: <code className="font-mono text-xs bg-gray-200 px-2 py-1">web-design-services</code>
          </p>
          <p className="font-['Lora'] text-xl text-gray-600 mb-8 max-w-3xl">
            Premium AI-powered web design service cards with sliding hover overlay. 3x2 grid featuring luxury animations and style guide compliance.
          </p>
        </div>
      </section>
      <WebDesignServicesGrid />

      {/* 02 — Web Design Process Timeline */}
      <section className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
          <div className="flex items-baseline gap-4 mb-4">
            <span className="font-['Lora'] text-sm font-semibold text-[#84CC16] tracking-wider">02</span>
            <h2 className="font-['Playfair_Display'] text-4xl lg:text-5xl text-gray-900">
              Process Timeline
            </h2>
          </div>
          <p className="font-['Lora'] text-sm font-semibold text-gray-500 mb-2">
            Component Name: <code className="font-mono text-xs bg-gray-200 px-2 py-1">process-timeline</code>
          </p>
          <p className="font-['Lora'] text-xl text-gray-600 mb-8 max-w-3xl">
            4-phase web design process visualization with interactive cards, timeline connector, and staggered animations.
          </p>
        </div>
      </section>
      <WebDesignProcess />

      {/* 03 — Hero Section */}
      <section className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
          <div className="flex items-baseline gap-4 mb-4">
            <span className="font-['Lora'] text-sm font-semibold text-[#84CC16] tracking-wider">03</span>
            <h2 className="font-['Playfair_Display'] text-4xl lg:text-5xl text-gray-900">
              Cinematic Hero Section
            </h2>
          </div>
          <p className="font-['Lora'] text-sm font-semibold text-gray-500 mb-2">
            Component Name: <code className="font-mono text-xs bg-gray-200 px-2 py-1">hero-cinematic</code>
          </p>
          <p className="font-['Lora'] text-xl text-gray-600 mb-8 max-w-3xl">
            Premium cinematic hero with floating device mockups, editorial typography, and luxury feel. Features 3D transforms and parallax effects.
          </p>
        </div>
      </section>
      <WebDesignHero />

      {/* 04 — Explore More Section */}
      <section className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
          <div className="flex items-baseline gap-4 mb-4">
            <span className="font-['Lora'] text-sm font-semibold text-[#84CC16] tracking-wider">04</span>
            <h2 className="font-['Playfair_Display'] text-4xl lg:text-5xl text-gray-900">
              Explore More Section
            </h2>
          </div>
          <p className="font-['Lora'] text-sm font-semibold text-gray-500 mb-2">
            Component Name: <code className="font-mono text-xs bg-gray-200 px-2 py-1">explore-more</code>
          </p>
          <p className="font-['Lora'] text-xl text-gray-600 mb-8 max-w-3xl">
            BCG-style editorial layout with 60/40 grid split, large rounded corners, and asymmetric card arrangement.
          </p>
        </div>
      </section>
      <ExploreMore />

      {/* 05 — Our Services Grid (Homepage) */}
      <section className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
          <div className="flex items-baseline gap-4 mb-4">
            <span className="font-['Lora'] text-sm font-semibold text-[#84CC16] tracking-wider">05</span>
            <h2 className="font-['Playfair_Display'] text-4xl lg:text-5xl text-gray-900">
              Our Services in Digital, Technology, and Data
            </h2>
          </div>
          <p className="font-['Lora'] text-sm font-semibold text-gray-500 mb-2">
            Component Name: <code className="font-mono text-xs bg-gray-200 px-2 py-1">services</code>
          </p>
          <p className="font-['Lora'] text-xl text-gray-600 mb-8 max-w-3xl">
            Premium hover-to-expand service cards with image, short description, and animated overlay with extended content. Features Spruced palette colors and smooth cubic-bezier easing.
          </p>
          <div className="space-y-4 font-['Lora'] text-sm text-gray-600">
            <div className="flex items-start gap-2">
              <Check className="w-4 h-4 text-[#84CC16] flex-shrink-0 mt-0.5" />
              <span><strong>9 service cards</strong> in 3-column responsive grid</span>
            </div>
            <div className="flex items-start gap-2">
              <Check className="w-4 h-4 text-[#84CC16] flex-shrink-0 mt-0.5" />
              <span><strong>220px image height</strong> with object-cover cropping</span>
            </div>
            <div className="flex items-start gap-2">
              <Check className="w-4 h-4 text-[#84CC16] flex-shrink-0 mt-0.5" />
              <span><strong>Hover overlay</strong> slides up with extended description (#F4F3EE background)</span>
            </div>
            <div className="flex items-start gap-2">
              <Check className="w-4 h-4 text-[#84CC16] flex-shrink-0 mt-0.5" />
              <span><strong>Staggered animation</strong> with 500ms duration and cubic-bezier easing</span>
            </div>
            <div className="flex items-start gap-2">
              <Check className="w-4 h-4 text-[#84CC16] flex-shrink-0 mt-0.5" />
              <span><strong>Optional badge</strong> overlay (e.g., "90+" for web development)</span>
            </div>
          </div>
        </div>
      </section>
      <OurServicesGrid />

      {/* 06 — Gantt Chart */}
      <section className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
          <div className="flex items-baseline gap-4 mb-4">
            <span className="font-['Lora'] text-sm font-semibold text-[#84CC16] tracking-wider">06</span>
            <h2 className="font-['Playfair_Display'] text-4xl lg:text-5xl text-gray-900">
              Gantt Chart Timeline
            </h2>
          </div>
          <p className="font-['Lora'] text-sm font-semibold text-gray-500 mb-2">
            Component Name: <code className="font-mono text-xs bg-gray-200 px-2 py-1">gantt-chart</code>
          </p>
          <p className="font-['Lora'] text-xl text-gray-600 mb-8 max-w-3xl">
            MVP deliverables timeline visualization with animated horizontal bars. Features 6-week schedule with color-coded phases and smooth left-to-right animations.
          </p>
          <div className="space-y-4 font-['Lora'] text-sm text-gray-600">
            <div className="flex items-start gap-2">
              <Check className="w-4 h-4 text-[#84CC16] flex-shrink-0 mt-0.5" />
              <span><strong>6-week timeline</strong> with responsive week labels</span>
            </div>
            <div className="flex items-start gap-2">
              <Check className="w-4 h-4 text-[#84CC16] flex-shrink-0 mt-0.5" />
              <span><strong>Animated bars</strong> with scaleX animation from left to right</span>
            </div>
            <div className="flex items-start gap-2">
              <Check className="w-4 h-4 text-[#84CC16] flex-shrink-0 mt-0.5" />
              <span><strong>Color-coded phases</strong> - Lime green for planning/polish, dark teal for development</span>
            </div>
            <div className="flex items-start gap-2">
              <Check className="w-4 h-4 text-[#84CC16] flex-shrink-0 mt-0.5" />
              <span><strong>Rounded corners</strong> (rounded-xl) on all bars</span>
            </div>
            <div className="flex items-start gap-2">
              <Check className="w-4 h-4 text-[#84CC16] flex-shrink-0 mt-0.5" />
              <span><strong>Staggered delays</strong> for sequential bar animation</span>
            </div>
          </div>
        </div>
      </section>
      <GanttChart />

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