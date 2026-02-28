import { motion, useInView } from 'motion/react';
import { useRef, useEffect, useState } from 'react';

interface LighthouseGaugeProps {
  score: number;
  label: string;
  delay?: number;
}

export default function LighthouseGauge({ score, label, delay = 0 }: LighthouseGaugeProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [currentScore, setCurrentScore] = useState(0);

  // Animate the score number counting up
  useEffect(() => {
    if (isInView) {
      const timer = setTimeout(() => {
        const interval = setInterval(() => {
          setCurrentScore(prev => {
            if (prev >= score) {
              clearInterval(interval);
              return score;
            }
            return prev + 1;
          });
        }, 15);
        return () => clearInterval(interval);
      }, delay * 1000);
      return () => clearTimeout(timer);
    }
  }, [isInView, score, delay]);

  // Calculate the stroke-dasharray for circular progress
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;

  return (
    <motion.div
      ref={ref}
      className="flex flex-col items-center"
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.6, delay }}
    >
      {/* SVG Circular Gauge */}
      <div className="relative w-32 h-32">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
          {/* Background circle */}
          <circle
            cx="60"
            cy="60"
            r={radius}
            stroke="#E5E7EB"
            strokeWidth="8"
            fill="none"
          />
          
          {/* Progress circle */}
          <motion.circle
            cx="60"
            cy="60"
            r={radius}
            stroke="#84CC16"
            strokeWidth="8"
            fill="none"
            strokeLinecap="square"
            initial={{ strokeDasharray: circumference, strokeDashoffset: circumference }}
            animate={isInView ? {
              strokeDashoffset: circumference - progress
            } : {
              strokeDashoffset: circumference
            }}
            transition={{ duration: 1.2, delay, ease: 'easeOut' }}
          />
        </svg>

        {/* Score number in center */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span 
            className="text-4xl font-bold text-gray-900"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            {currentScore}
          </span>
        </div>
      </div>

      {/* Label */}
      <p className="mt-4 text-sm text-gray-600 font-['Lora']">
        {label}
      </p>
    </motion.div>
  );
}
