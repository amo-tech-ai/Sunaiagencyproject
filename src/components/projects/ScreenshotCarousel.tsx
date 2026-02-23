import { motion } from 'motion/react';
import { Screenshot } from '../../lib/types/projects';

interface ScreenshotCarouselProps {
  screenshots: Screenshot[];
}

export default function ScreenshotCarousel({
  screenshots,
}: ScreenshotCarouselProps) {
  return (
    <div className="space-y-6">
      {screenshots.map((screen, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.1 }}
          className="bg-white border border-[#EFE9E4] p-4 lg:p-6 hover:border-[#1A1A1A] transition-colors cursor-pointer"
        >
          <img
            src={screen.url}
            alt={screen.caption}
            className="w-full aspect-video object-cover"
          />
          <p className="text-sm text-[#999999] mt-3">{screen.caption}</p>
        </motion.div>
      ))}
    </div>
  );
}
