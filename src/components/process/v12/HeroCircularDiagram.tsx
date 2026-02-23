import { motion } from 'motion/react';
import { Rocket, Code, Layers, ShieldCheck } from 'lucide-react';
import { useState, useEffect } from 'react';

interface IconPosition {
  id: string;
  icon: typeof Rocket;
  label: string;
  angle: number;
}

const ICONS: IconPosition[] = [
  { id: 'launch', icon: Rocket, label: 'Launch', angle: 45 },
  { id: 'design', icon: Code, label: 'Design', angle: 135 },
  { id: 'build', icon: Layers, label: 'Build', angle: 225 },
  { id: 'test', icon: ShieldCheck, label: 'Test', angle: 315 },
];

export default function HeroCircularDiagram() {
  const [activeIconId, setActiveIconId] = useState<string | null>(null);
  const radius = 140; // Distance from center to icons

  // Calculate icon positions
  const getIconPosition = (angle: number) => {
    const radian = (angle - 90) * (Math.PI / 180);
    return {
      x: Math.cos(radian) * radius,
      y: Math.sin(radian) * radius,
    };
  };

  // Determine which icon should be active based on arc rotation
  useEffect(() => {
    const interval = setInterval(() => {
      const elapsed = Date.now() % 8000; // 8 second loop
      const currentAngle = (elapsed / 8000) * 360;

      // Find closest icon
      const activeIcon = ICONS.reduce((closest, icon) => {
        const diff = Math.abs(currentAngle - icon.angle);
        const closestDiff = Math.abs(currentAngle - closest.angle);
        return diff < closestDiff ? icon : closest;
      });

      // Only activate if arc is within 20 degrees
      const angleDiff = Math.abs(currentAngle - activeIcon.angle);
      if (angleDiff < 20 || angleDiff > 340) {
        setActiveIconId(activeIcon.id);
      } else {
        setActiveIconId(null);
      }
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full max-w-[400px] aspect-square mx-auto">
      {/* Center Circle */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-[280px] h-[280px] border-2 border-neutral-700 rounded-full flex items-center justify-center">
          <div className="text-center">
            <div className="text-5xl font-bold text-white mb-2">8 Weeks</div>
            <div className="text-xs font-bold uppercase tracking-widest text-[#F59E0B]">
              Delivery Cycle
            </div>
          </div>

          {/* Rotating Orange Arc */}
          <svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 280 280"
            style={{ transform: 'rotate(-90deg)' }}
          >
            <motion.circle
              cx="140"
              cy="140"
              r="138"
              fill="none"
              stroke="#F59E0B"
              strokeWidth="3"
              strokeDasharray="60 807" // Creates arc (60px visible, rest invisible)
              strokeLinecap="round"
              initial={{ rotate: 0 }}
              animate={{ rotate: 360 }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: 'linear',
              }}
              style={{ transformOrigin: '140px 140px' }}
            />
          </svg>
        </div>
      </div>

      {/* Icons around the circle */}
      {ICONS.map((iconItem) => {
        const position = getIconPosition(iconItem.angle);
        const Icon = iconItem.icon;
        const isActive = activeIconId === iconItem.id;

        return (
          <motion.div
            key={iconItem.id}
            className="absolute"
            style={{
              left: '50%',
              top: '50%',
              transform: `translate(calc(-50% + ${position.x}px), calc(-50% + ${position.y}px))`,
            }}
            animate={
              isActive
                ? {
                    scale: [1, 1.15, 1],
                  }
                : {}
            }
            transition={{ duration: 0.4, ease: 'easeOut' }}
          >
            <div className="flex flex-col items-center gap-2">
              <motion.div
                className="w-12 h-12 rounded-full border-2 border-white/20 flex items-center justify-center bg-white/5"
                animate={
                  isActive
                    ? {
                        boxShadow: [
                          '0 0 0px rgba(245, 158, 11, 0)',
                          '0 0 20px rgba(245, 158, 11, 0.5)',
                          '0 0 0px rgba(245, 158, 11, 0)',
                        ],
                      }
                    : {}
                }
                transition={{ duration: 0.4 }}
              >
                <Icon className="w-6 h-6 text-white" />
              </motion.div>
              <motion.div
                className={`text-xs font-medium transition-colors duration-300 ${
                  isActive ? 'text-[#F59E0B]' : 'text-neutral-400'
                }`}
              >
                {iconItem.label}
              </motion.div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
