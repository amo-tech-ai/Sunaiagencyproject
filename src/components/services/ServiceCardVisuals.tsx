/**
 * Abstract AI-inspired SVG visuals for each service card.
 * Neural shapes, data waves, circuit patterns — no literal robot icons.
 */

interface VisualProps {
  variant: 'black' | 'teal' | 'light';
}

const accentColor = (v: VisualProps['variant']) =>
  v === 'light' ? '#0F3D3E' : '#5EEAD4';

// 1 — Neural Network mesh
export function NeuralMesh({ variant }: VisualProps) {
  const c = accentColor(variant);
  const o = variant === 'light' ? 0.12 : 0.25;
  return (
    <svg viewBox="0 0 200 140" fill="none" className="w-full h-full">
      {/* connections */}
      {[
        [30, 40, 100, 20],
        [100, 20, 170, 50],
        [30, 40, 80, 90],
        [80, 90, 170, 50],
        [80, 90, 140, 120],
        [170, 50, 140, 120],
        [100, 20, 140, 120],
        [30, 40, 140, 120],
      ].map(([x1, y1, x2, y2], i) => (
        <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={c} strokeOpacity={o} strokeWidth="1" />
      ))}
      {/* nodes */}
      {[
        [30, 40, 6],
        [100, 20, 8],
        [170, 50, 5],
        [80, 90, 7],
        [140, 120, 6],
      ].map(([cx, cy, r], i) => (
        <g key={i}>
          <circle cx={cx} cy={cy} r={Number(r) + 8} fill={c} fillOpacity={o * 0.4} />
          <circle cx={cx} cy={cy} r={r} fill={c} fillOpacity={0.6} />
        </g>
      ))}
    </svg>
  );
}

// 2 — Chat bubble wave
export function ChatWave({ variant }: VisualProps) {
  const c = accentColor(variant);
  return (
    <svg viewBox="0 0 200 140" fill="none" className="w-full h-full">
      <rect x="30" y="20" width="100" height="50" rx="14" fill={c} fillOpacity={0.12} />
      <rect x="42" y="35" width="46" height="4" rx="2" fill={c} fillOpacity={0.35} />
      <rect x="42" y="45" width="66" height="4" rx="2" fill={c} fillOpacity={0.25} />
      <rect x="42" y="55" width="30" height="4" rx="2" fill={c} fillOpacity={0.15} />
      <rect x="70" y="70" width="110" height="50" rx="14" fill={c} fillOpacity={0.18} />
      <rect x="82" y="85" width="56" height="4" rx="2" fill={c} fillOpacity={0.35} />
      <rect x="82" y="95" width="76" height="4" rx="2" fill={c} fillOpacity={0.25} />
      <circle cx="158" cy="95" r="3" fill={c} fillOpacity={0.4}>
        <animate attributeName="opacity" values="0.2;0.6;0.2" dur="1.5s" repeatCount="indefinite" />
      </circle>
      <circle cx="166" cy="95" r="3" fill={c} fillOpacity={0.3}>
        <animate attributeName="opacity" values="0.2;0.6;0.2" dur="1.5s" begin="0.3s" repeatCount="indefinite" />
      </circle>
      <circle cx="174" cy="95" r="3" fill={c} fillOpacity={0.2}>
        <animate attributeName="opacity" values="0.2;0.6;0.2" dur="1.5s" begin="0.6s" repeatCount="indefinite" />
      </circle>
    </svg>
  );
}

// 3 — WhatsApp / messaging waves
export function MessageRipple({ variant }: VisualProps) {
  const c = accentColor(variant);
  return (
    <svg viewBox="0 0 200 140" fill="none" className="w-full h-full">
      {[50, 38, 26, 14].map((r, i) => (
        <circle key={i} cx="100" cy="70" r={r} stroke={c} strokeOpacity={0.1 + i * 0.06} strokeWidth="1.5" fill="none" />
      ))}
      <rect x="82" y="52" width="36" height="36" rx="10" fill={c} fillOpacity={0.15} />
      <path d="M94 64 L100 64 L106 64 M92 70 L108 70 M96 76 L104 76" stroke={c} strokeOpacity={0.5} strokeWidth="2" strokeLinecap="round" />
      {/* signal dots */}
      {[0, 1, 2].map((i) => (
        <circle key={i} cx={140 + i * 14} cy={40 + i * 16} r="3" fill={c} fillOpacity={0.3 - i * 0.08}>
          <animate attributeName="r" values="2;4;2" dur="2s" begin={`${i * 0.4}s`} repeatCount="indefinite" />
        </circle>
      ))}
    </svg>
  );
}

// 4 — CRM / funnel data flow
export function DataFunnel({ variant }: VisualProps) {
  const c = accentColor(variant);
  return (
    <svg viewBox="0 0 200 140" fill="none" className="w-full h-full">
      <path d="M40 25 L160 25 L120 70 L120 115 L80 115 L80 70 Z" fill={c} fillOpacity={0.06} stroke={c} strokeOpacity={0.15} strokeWidth="1" />
      {/* data bars entering */}
      {[0, 1, 2, 3, 4].map((i) => (
        <rect key={i} x={55 + i * 20} y={32 + i * 2} width="10" height={4} rx="2" fill={c} fillOpacity={0.25 + i * 0.05} />
      ))}
      {/* droplets */}
      <circle cx="100" cy="95" r="4" fill={c} fillOpacity={0.4} />
      <circle cx="100" cy="108" r="3" fill={c} fillOpacity={0.25}>
        <animate attributeName="cy" values="108;118;108" dur="2s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.3;0;0.3" dur="2s" repeatCount="indefinite" />
      </circle>
    </svg>
  );
}

// 5 — MVP / rocket launch path
export function LaunchPath({ variant }: VisualProps) {
  const c = accentColor(variant);
  return (
    <svg viewBox="0 0 200 140" fill="none" className="w-full h-full">
      <path d="M30 120 Q70 110 90 80 Q110 50 130 40 Q160 25 180 20" stroke={c} strokeOpacity={0.2} strokeWidth="2" strokeDasharray="4 4" fill="none" />
      <path d="M30 120 Q70 110 90 80 Q110 50 130 40 Q160 25 180 20" stroke={c} strokeOpacity={0.35} strokeWidth="2" fill="none" strokeDashoffset="200" strokeDasharray="200">
        <animate attributeName="stroke-dashoffset" values="200;0" dur="3s" repeatCount="indefinite" />
      </path>
      {/* milestones */}
      {[
        [30, 120],
        [90, 80],
        [130, 40],
        [180, 20],
      ].map(([cx, cy], i) => (
        <g key={i}>
          <circle cx={cx} cy={cy} r={5 + i} fill={c} fillOpacity={0.1 + i * 0.08} />
          <circle cx={cx} cy={cy} r="3" fill={c} fillOpacity={0.5} />
        </g>
      ))}
    </svg>
  );
}

// 6 — Custom AI / brain circuit
export function BrainCircuit({ variant }: VisualProps) {
  const c = accentColor(variant);
  return (
    <svg viewBox="0 0 200 140" fill="none" className="w-full h-full">
      <ellipse cx="100" cy="70" rx="55" ry="45" stroke={c} strokeOpacity={0.1} strokeWidth="1" fill={c} fillOpacity={0.04} />
      {/* circuit traces */}
      {[
        'M60 50 L80 50 L80 70 L100 70',
        'M100 70 L120 70 L120 90 L140 90',
        'M80 70 L80 90 L60 90',
        'M100 70 L100 45 L130 45',
        'M100 70 L130 70 L130 55',
      ].map((d, i) => (
        <path key={i} d={d} stroke={c} strokeOpacity={0.2 + i * 0.04} strokeWidth="1.5" fill="none" strokeLinecap="round" />
      ))}
      {/* junction dots */}
      {[
        [80, 50], [80, 70], [100, 70], [120, 90], [60, 90], [100, 45], [130, 45], [130, 70], [130, 55], [140, 90],
      ].map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r="2.5" fill={c} fillOpacity={0.4} />
      ))}
      <circle cx="100" cy="70" r="5" fill={c} fillOpacity={0.35}>
        <animate attributeName="r" values="5;7;5" dur="2s" repeatCount="indefinite" />
        <animate attributeName="fillOpacity" values="0.35;0.15;0.35" dur="2s" repeatCount="indefinite" />
      </circle>
    </svg>
  );
}

// 7 — Industry grid / packages
export function IndustryGrid({ variant }: VisualProps) {
  const c = accentColor(variant);
  return (
    <svg viewBox="0 0 200 140" fill="none" className="w-full h-full">
      {/* 3x2 rounded rects */}
      {[
        [25, 20], [80, 20], [135, 20],
        [25, 75], [80, 75], [135, 75],
      ].map(([x, y], i) => (
        <g key={i}>
          <rect x={x} y={y} width="50" height="45" rx="8" fill={c} fillOpacity={0.06 + i * 0.02} stroke={c} strokeOpacity={0.12} strokeWidth="1" />
          <rect x={Number(x) + 12} y={Number(y) + 14} width={20 + (i % 3) * 4} height="3" rx="1.5" fill={c} fillOpacity={0.2} />
          <rect x={Number(x) + 12} y={Number(y) + 22} width={14 + (i % 2) * 8} height="3" rx="1.5" fill={c} fillOpacity={0.12} />
        </g>
      ))}
    </svg>
  );
}

// 8 — Web / lighthouse performance
export function WebPerformance({ variant }: VisualProps) {
  const c = accentColor(variant);
  return (
    <svg viewBox="0 0 200 140" fill="none" className="w-full h-full">
      {/* browser frame */}
      <rect x="30" y="15" width="140" height="100" rx="8" fill={c} fillOpacity={0.05} stroke={c} strokeOpacity={0.15} strokeWidth="1" />
      <rect x="30" y="15" width="140" height="16" rx="8" fill={c} fillOpacity={0.08} />
      <circle cx="42" cy="23" r="3" fill={c} fillOpacity={0.2} />
      <circle cx="52" cy="23" r="3" fill={c} fillOpacity={0.2} />
      <circle cx="62" cy="23" r="3" fill={c} fillOpacity={0.2} />
      {/* performance arc */}
      <path d="M80 85 A28 28 0 0 1 120 85" stroke={c} strokeOpacity={0.15} strokeWidth="4" fill="none" strokeLinecap="round" />
      <path d="M80 85 A28 28 0 0 1 118 80" stroke={c} strokeOpacity={0.45} strokeWidth="4" fill="none" strokeLinecap="round" />
      <text x="100" y="80" textAnchor="middle" fill={c} fillOpacity={0.5} style={{ fontSize: '10px', fontWeight: 600 }}>90+</text>
    </svg>
  );
}

// 9 — E-commerce cart / flow
export function EcomFlow({ variant }: VisualProps) {
  const c = accentColor(variant);
  return (
    <svg viewBox="0 0 200 140" fill="none" className="w-full h-full">
      {/* flow arrows */}
      <path d="M25 70 L60 70" stroke={c} strokeOpacity={0.2} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M90 70 L120 70" stroke={c} strokeOpacity={0.2} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M150 70 L180 70" stroke={c} strokeOpacity={0.2} strokeWidth="1.5" strokeLinecap="round" />
      <polygon points="58,66 64,70 58,74" fill={c} fillOpacity={0.25} />
      <polygon points="118,66 124,70 118,74" fill={c} fillOpacity={0.25} />
      <polygon points="178,66 184,70 178,74" fill={c} fillOpacity={0.25} />
      {/* nodes */}
      {[
        [25, 70, 'Browse'],
        [75, 70, 'Cart'],
        [135, 70, 'Pay'],
      ].map(([cx, cy, label], i) => (
        <g key={i}>
          <rect x={Number(cx) - 18} y={Number(cy) - 18} width="36" height="36" rx="10" fill={c} fillOpacity={0.08 + i * 0.04} stroke={c} strokeOpacity={0.15} strokeWidth="1" />
          <text x={cx as number} y={Number(cy) + 30} textAnchor="middle" fill={c} fillOpacity={0.35} style={{ fontSize: '9px' }}>{label as string}</text>
        </g>
      ))}
      {/* AI sparkle */}
      <circle cx="135" cy="45" r="8" fill={c} fillOpacity={0.1} />
      <text x="135" y="48" textAnchor="middle" fill={c} fillOpacity={0.4} style={{ fontSize: '9px' }}>AI</text>
    </svg>
  );
}

export const cardVisuals = [
  NeuralMesh,
  ChatWave,
  MessageRipple,
  DataFunnel,
  LaunchPath,
  BrainCircuit,
  IndustryGrid,
  WebPerformance,
  EcomFlow,
];