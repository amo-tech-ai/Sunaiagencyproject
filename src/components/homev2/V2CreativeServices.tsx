import { useRef, useState } from 'react';
import { motion } from 'motion/react';
import Slider from 'react-slick';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface V2CreativeServicesProps {
  onNavigate?: (page: string) => void;
}

export default function V2CreativeServices({ onNavigate }: V2CreativeServicesProps) {
  const sliderRef = useRef<Slider>(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  const services = [
    {
      title: 'Website Design',
      subtitle: 'Digital Experiences',
      description: 'Responsive, conversion-focused websites that elevate your brand and drive results.',
      image: 'https://images.unsplash.com/photo-1556755732-ae0506f4a7a2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0YWJsZXQlMjB3ZWJzaXRlJTIwZGVzaWduJTIwbW9ja3VwJTIwaGFuZHN8ZW58MXx8fHwxNzcwMjI4NjYwfDA&ixlib=rb-4.1.0&q=80&w=1080',
      color: 'from-[#2D1B1E] to-[#1A1A1A]',
      accentColor: 'text-[#84CC16]',
    },
    {
      title: 'Social Media Creative',
      subtitle: 'Brand Storytelling',
      description: 'Engaging social content that builds communities and amplifies your message.',
      image: 'https://images.unsplash.com/photo-1676282831194-f7dcd46eafef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2NpYWwlMjBtZWRpYSUyMGNyZWF0aXZlJTIwZGVzaWduJTIwY29sbGFnZXxlbnwxfHx8fDE3NzAyMjg2NjF8MA&ixlib=rb-4.1.0&q=80&w=1080',
      color: 'from-[#0A3D62] to-[#1B4F72]',
      accentColor: 'text-cyan-400',
    },
    {
      title: 'Email Design',
      subtitle: 'Direct Communication',
      description: 'Beautiful, responsive email campaigns that convert subscribers into customers.',
      image: 'https://images.unsplash.com/photo-1514473777127-61e2dc1dded3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWFydHBob25lJTIwZW1haWwlMjBkZXNpZ24lMjBkYXJrfGVufDF8fHx8MTc3MDIyODY2MXww&ixlib=rb-4.1.0&q=80&w=1080',
      color: 'from-[#1B4D3E] to-[#0F3D3E]',
      accentColor: 'text-emerald-400',
    },
    {
      title: 'Motion Design',
      subtitle: 'Dynamic Visuals',
      description: 'Captivating animations and motion graphics that bring your brand to life.',
      image: 'https://images.unsplash.com/photo-1705048804908-b4cdcd6ac0a8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3Rpb24lMjBncmFwaGljcyUyMGFuaW1hdGlvbiUyMG9yYW5nZXxlbnwxfHx8fDE3NzAyMjg2NjF8MA&ixlib=rb-4.1.0&q=80&w=1080',
      color: 'from-[#C0392B] to-[#E74C3C]',
      accentColor: 'text-orange-300',
    },
    {
      title: 'Video Production',
      subtitle: 'Cinematic Content',
      description: 'Professional video content that tells your story and connects with audiences.',
      image: 'https://images.unsplash.com/photo-1760637627486-3145b35f08ee?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWRlb2dyYXBoZXIlMjBjYW1lcmElMjBtb3VudGFpbiUyMGxhbmRzY2FwZXxlbnwxfHx8fDE3NzAyMjg2NjJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
      color: 'from-[#34495E] to-[#5D6D7E]',
      accentColor: 'text-blue-300',
    },
    {
      title: 'AI Agents',
      subtitle: 'Intelligent Systems',
      description: 'Custom AI agents that automate workflows and enhance business intelligence.',
      image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      color: 'from-[#0F3D3E] to-[#1B5A5E]',
      accentColor: 'text-[#84CC16]',
    },
  ];

  const settings = {
    dots: false,
    infinite: true,
    speed: 700,
    slidesToShow: 4,
    slidesToScroll: 1,
    centerMode: true,
    centerPadding: '0px',
    autoplay: true,
    autoplaySpeed: 4000,
    pauseOnHover: true,
    cssEase: 'cubic-bezier(0.22, 1, 0.36, 1)',
    beforeChange: (current: number, next: number) => setCurrentSlide(next),
    responsive: [
      {
        breakpoint: 1536,
        settings: {
          slidesToShow: 3,
          centerMode: true,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          centerMode: true,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          centerMode: true,
          centerPadding: '40px',
        },
      },
    ],
  };

  return (
    <section className="relative bg-[#0F3D3E] py-32 lg:py-40 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
      </div>

      <div className="max-w-[1600px] mx-auto px-6 lg:px-12 relative z-10">
        {/* Header */}
        <motion.div 
          className="max-w-4xl mx-auto text-center mb-20"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="inline-block px-4 py-2 bg-[#84CC16]/10 border border-[#84CC16]/20 mb-8">
            <span className="text-xs uppercase tracking-[0.2em] text-[#84CC16] font-medium">
              Easy & Hassle-Free
            </span>
          </div>
          
          <h2 className="font-['Playfair_Display'] text-5xl lg:text-7xl font-bold text-white leading-[1.05] mb-8">
            One subscription for access to{' '}
            <span className="italic">all our creative services</span>
          </h2>
          
          <p className="text-xl text-white/60 leading-relaxed font-['Lora'] max-w-2xl mx-auto">
            No matter your creative need, creating and submitting a project is easy and effortless
          </p>
        </motion.div>

        {/* Slider */}
        <div className="relative">
          <style dangerouslySetInnerHTML={{__html: `
            .creative-services-slider .slick-slide {
              padding: 0 12px;
              transition: all 0.5s cubic-bezier(0.22, 1, 0.36, 1);
            }
            
            .creative-services-slider .slick-slide > div {
              height: 100%;
            }
            
            .creative-services-slider .slick-center .service-card {
              transform: scale(1.05);
              z-index: 10;
            }
            
            .creative-services-slider .slick-track {
              display: flex;
              align-items: stretch;
            }
            
            @media (max-width: 640px) {
              .creative-services-slider .slick-center .service-card {
                transform: scale(1.02);
              }
            }
          `}} />

          <Slider ref={sliderRef} {...settings} className="creative-services-slider -mx-3">
            {services.map((service, index) => (
              <div key={index} className="h-full">
                <motion.div
                  className="service-card relative h-[500px] lg:h-[600px] overflow-hidden group cursor-pointer transition-all duration-700"
                  whileHover={{ y: -8 }}
                >
                  {/* Background Image */}
                  <div className="absolute inset-0">
                    <div 
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                      style={{ backgroundImage: `url(${service.image})` }}
                    />
                    {/* Gradient Overlay */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-80 group-hover:opacity-70 transition-opacity duration-700`} />
                  </div>

                  {/* Content */}
                  <div className="relative h-full flex flex-col justify-between p-8 lg:p-10">
                    {/* Top: Subtitle */}
                    <div>
                      <span className="text-xs uppercase tracking-[0.2em] text-white/60 font-medium">
                        {service.subtitle}
                      </span>
                    </div>

                    {/* Bottom: Title & Description */}
                    <div className="space-y-4">
                      <h3 className={`font-['Playfair_Display'] text-4xl lg:text-5xl font-bold italic leading-[1.1] ${service.accentColor} transition-colors duration-300`}>
                        {service.title}
                      </h3>
                      
                      <p className="text-base text-white/80 leading-relaxed font-['Lora'] max-w-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        {service.description}
                      </p>

                      {/* Arrow indicator */}
                      <div className="flex items-center gap-2 text-white/60 group-hover:text-[#84CC16] transition-colors">
                        <span className="text-sm uppercase tracking-[0.2em] font-medium">Learn More</span>
                        <span className="group-hover:translate-x-1 transition-transform">→</span>
                      </div>
                    </div>
                  </div>

                  {/* Border on hover */}
                  <div className="absolute inset-0 border-2 border-transparent group-hover:border-[#84CC16]/30 transition-colors duration-500" />
                </motion.div>
              </div>
            ))}
          </Slider>

          {/* Navigation Buttons */}
          <div className="flex justify-center items-center gap-4 mt-12">
            <button
              onClick={() => sliderRef.current?.slickPrev()}
              className="w-12 h-12 flex items-center justify-center border-2 border-white/20 text-white hover:border-[#84CC16] hover:text-[#84CC16] hover:bg-[#84CC16]/10 transition-all duration-300 group"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
            </button>

            {/* Slide Counter */}
            <div className="flex items-center gap-2">
              <span className="text-2xl font-['Playfair_Display'] font-bold text-[#84CC16]">
                {String(currentSlide + 1).padStart(2, '0')}
              </span>
              <span className="text-white/40 font-['Lora']">/</span>
              <span className="text-lg font-['Lora'] text-white/60">
                {String(services.length).padStart(2, '0')}
              </span>
            </div>

            <button
              onClick={() => sliderRef.current?.slickNext()}
              className="w-12 h-12 flex items-center justify-center border-2 border-white/20 text-white hover:border-[#84CC16] hover:text-[#84CC16] hover:bg-[#84CC16]/10 transition-all duration-300 group"
              aria-label="Next slide"
            >
              <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          {/* Progress Dots */}
          <div className="flex justify-center items-center gap-2 mt-8">
            {services.map((_, index) => (
              <button
                key={index}
                onClick={() => sliderRef.current?.slickGoTo(index)}
                className={`h-1 transition-all duration-500 ${
                  index === currentSlide
                    ? 'w-12 bg-[#84CC16]'
                    : 'w-6 bg-white/20 hover:bg-white/40'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <motion.div 
          className="text-center mt-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <button
            onClick={() => onNavigate?.('booking')}
            className="inline-block px-10 py-4 bg-[#84CC16] text-[#0F3D3E] font-medium uppercase tracking-[0.15em] text-sm hover:bg-white hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Start Your Project
          </button>
        </motion.div>
      </div>
    </section>
  );
}