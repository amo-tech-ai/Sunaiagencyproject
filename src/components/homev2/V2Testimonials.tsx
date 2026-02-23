export default function V2Testimonials() {
  const testimonials = [
    {
      quote: "Sun AI didn't just build a system—they transformed how we operate. The results exceeded every expectation.",
      author: 'Sarah Chen',
      role: 'Head of Operations',
      company: 'TechCorp',
      image: 'https://images.unsplash.com/photo-1610387694365-19fafcc86d86?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    },
    {
      quote: "Their strategic approach and technical excellence delivered measurable ROI faster than we thought possible.",
      author: 'Michael Rodriguez',
      role: 'VP of Innovation',
      company: 'FinanceHub',
      image: 'https://images.unsplash.com/photo-1737574821698-862e77f044c1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    },
    {
      quote: "Working with Sun AI felt like gaining an extension of our team. Their dedication to our success is unmatched.",
      author: 'Emily Watson',
      role: 'Chief Strategy Officer',
      company: 'HealthFirst',
      image: 'https://images.unsplash.com/photo-1758518727888-ffa196002e59?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    },
  ];

  return (
    <section className="bg-[#FAF8F6] py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <div className="max-w-3xl mb-20">
          <div className="inline-block px-4 py-2 bg-[#84CC16]/10 border border-[#84CC16]/20 mb-6">
            <span className="text-xs uppercase tracking-[0.2em] text-[#84CC16] font-medium">
              Client Stories
            </span>
          </div>
          
          <h2 className="font-['Playfair_Display'] text-4xl lg:text-6xl font-bold text-[#1A1A1A] leading-[1.05]">
            Trusted by industry leaders
          </h2>
        </div>
        
        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="group"
            >
              {/* Profile Image */}
              <div className="aspect-[3/4] mb-6 overflow-hidden relative">
                <img 
                  src={testimonial.image}
                  alt={testimonial.author}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                
                {/* Overlay with Company */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                  <div className="text-xs uppercase tracking-[0.2em] text-[#84CC16] font-medium">
                    {testimonial.company}
                  </div>
                </div>
              </div>
              
              {/* Quote */}
              <div className="space-y-6">
                <p className="text-lg text-[#1A1A1A] leading-relaxed font-['Lora']">
                  "{testimonial.quote}"
                </p>
                
                {/* Author */}
                <div className="space-y-1">
                  <div className="font-medium text-[#1A1A1A] font-['Playfair_Display'] text-lg">
                    {testimonial.author}
                  </div>
                  <div className="text-sm text-[#666666]">
                    {testimonial.role}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}