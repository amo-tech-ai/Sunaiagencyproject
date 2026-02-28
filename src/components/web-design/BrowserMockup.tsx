import { motion } from 'motion/react';

interface BrowserMockupProps {
  imageSrc?: string;
  showLighthouseBadge?: boolean;
  badgeScore?: number;
}

export default function BrowserMockup({ 
  imageSrc, 
  showLighthouseBadge = true, 
  badgeScore = 94 
}: BrowserMockupProps) {
  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.3 }}
      whileHover={{ boxShadow: '0 0 40px rgba(132,204,22,0.1)' }}
    >
      {/* Browser Frame */}
      <div className="border-2 border-white/20 bg-white/5 backdrop-blur-sm overflow-hidden">
        {/* Browser Top Bar */}
        <div className="h-10 bg-white/10 flex items-center px-4 border-b border-white/20">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500" />
            <div className="w-3 h-3 bg-yellow-500" />
            <div className="w-3 h-3 bg-green-500" />
          </div>
        </div>

        {/* Browser Content */}
        <div className="aspect-[4/3] bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
          {imageSrc ? (
            <img 
              src={imageSrc} 
              alt="Website Preview" 
              className="w-full h-full object-cover"
            />
          ) : (
            // Placeholder preview
            <div className="w-full h-full p-8">
              {/* Fake website preview */}
              <div className="bg-white h-full border border-gray-300 p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
                  <div className="w-24 h-6 bg-[#0F3D3E]" />
                  <div className="flex gap-3">
                    <div className="w-16 h-4 bg-gray-300" />
                    <div className="w-16 h-4 bg-gray-300" />
                    <div className="w-16 h-4 bg-[#84CC16]" />
                  </div>
                </div>

                {/* Hero Section */}
                <div className="mb-6">
                  <div className="w-3/4 h-8 bg-gray-800 mb-3" />
                  <div className="w-2/3 h-6 bg-gray-800 mb-4" />
                  <div className="w-full h-3 bg-gray-300 mb-2" />
                  <div className="w-5/6 h-3 bg-gray-300 mb-4" />
                  <div className="w-32 h-10 bg-[#84CC16]" />
                </div>

                {/* Chatbot Widget (Open) */}
                <div className="absolute bottom-6 right-6 w-56 bg-white border-2 border-[#84CC16] shadow-lg">
                  <div className="bg-[#0F3D3E] text-white px-3 py-2 text-xs font-['Lora']">
                    AI Assistant
                  </div>
                  <div className="p-3 space-y-2">
                    <div className="bg-gray-100 p-2 text-[10px]">
                      How can I help you today?
                    </div>
                    <div className="bg-[#84CC16]/20 p-2 text-[10px] text-right">
                      Tell me about your services
                    </div>
                  </div>
                  <div className="border-t border-gray-200 p-2">
                    <div className="h-6 bg-gray-100 border border-gray-300" />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Lighthouse Badge */}
      {showLighthouseBadge && (
        <motion.div
          className="absolute -bottom-8 -right-8 w-20 h-20 bg-[#84CC16] border-4 border-white flex items-center justify-center"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.6, delay: 0.8, type: 'spring' }}
        >
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900" style={{ fontFamily: 'Playfair Display, serif' }}>
              {badgeScore}
            </div>
            <div className="text-[8px] uppercase tracking-wider text-gray-900 font-['Lora']">
              Score
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
