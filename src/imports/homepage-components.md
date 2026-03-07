Homepage Components
Specialized components from HomePageV3 with Spruced design palette.

Service Image Card (Hover Expand)
Spruced
Premium service card with image, short description, and hover-to-expand overlay with extended content and CTA

Usage: Homepage "Our Services" section — 3-column grid

KEY FEATURES
Default state: Image (220px) + title + short description + "Learn More" link
Hover state: Smooth slide-up overlay with beige background (#F4F3EE)
Extended description with staggered animation delays
Rounded corners (rounded-2xl) with subtle border
Optional badge overlay on image (e.g., "90+")
CODE EXAMPLE
<div className="group cursor-pointer rounded-2xl overflow-hidden">
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
</div>
Capability Card
Spruced
Minimal card with icon, title, and description for showcasing AI capabilities

Usage: Homepage "Our AI Solutions and Capabilities" section — 3-column grid

KEY FEATURES
Muted sage background (#DCE5DD)
Icon container with accent green backdrop (rgba(46,111,94,0.12))
Rounded corners (rounded-xl)
Hover lift effect (-translate-y-1)
Clean typography hierarchy
CODE EXAMPLE
<div className="rounded-xl p-8 bg-[#DCE5DD] hover:-translate-y-1 transition-all">
  <div className="w-10 h-10 rounded-lg bg-[rgba(46,111,94,0.12)] flex items-center justify-center mb-5">
    <Icon className="w-5 h-5 text-[#2E6F5E]" />
  </div>
  <h3 className="text-lg font-semibold text-[#1E3D36] mb-3">Title</h3>
  <p className="text-sm text-gray-600 leading-relaxed">Description</p>
</div>
Hero Section (Editorial)
Spruced
Two-column hero with headline, body, CTAs, and image

Usage: Homepage hero section — top of page

KEY FEATURES
Warm beige background (#F4F3EE)
Large Playfair Display headline (clamp 2.25rem to 3.5rem)
Deep green text (#1E3D36)
Two-button CTA pattern (Primary + Outline)
Image with rounded corners and decorative dot
Responsive grid (lg:grid-cols-2)
CODE EXAMPLE
<section className="bg-[#F4F3EE] pt-28 pb-24">
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
</section>
Credibility Band
Spruced
Full-width dark banner with centered messaging and key metric

Usage: Homepage credibility section — between major content blocks

KEY FEATURES
Deep green background (#1E3D36)
Eyebrow label with extreme letter-spacing
Large Playfair Display headline in white
Bold metric callout (e.g., "94% client satisfaction")
Centered text alignment
Generous vertical padding (py-20 to py-24)
CODE EXAMPLE
<section className="bg-[#1E3D36] py-20 text-center">
  <p className="text-white/40 uppercase tracking-[0.25em] text-xs mb-5">
    Trusted by teams scaling with AI
  </p>
  <h2 className="font-['Playfair_Display'] text-4xl text-white mb-6">
    Built for teams scaling with AI.
  </h2>
  <p className="text-white/50 text-xl">
    <span className="text-white font-bold">94%</span> client satisfaction
  </p>
</section>