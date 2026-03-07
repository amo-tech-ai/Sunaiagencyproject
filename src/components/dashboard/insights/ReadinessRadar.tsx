// C97-READINESS-RADAR — Radar chart showing 5 AI readiness dimensions
// Uses recharts RadarChart. BCG design: #00875A fill, #F5F5F0 bg, Georgia labels.
// Mobile-first: responsive width/height, 44px touch targets on legend items.

import type { ReadinessDimension } from '../../../lib/hooks/useDashboardData';
import {
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  Radar, ResponsiveContainer, Tooltip,
} from 'recharts';

interface ReadinessRadarProps {
  dimensions: ReadinessDimension[];
  overall: number;
}

export default function ReadinessRadar({ dimensions, overall }: ReadinessRadarProps) {
  if (dimensions.length === 0) {
    return (
      <div className="bg-white rounded border border-[#E8E8E4] p-6 text-center">
        <p className="text-sm text-[#6B6B63]">No readiness dimensions available yet.</p>
        <p className="text-xs text-[#9CA39B] mt-1">Complete the wizard assessment to see your radar.</p>
      </div>
    );
  }

  const chartData = dimensions.map(d => ({
    dimension: d.name.length > 14 ? d.name.slice(0, 12) + '...' : d.name,
    fullName: d.name,
    score: d.score,
    fullMark: 100,
  }));

  const scoreColor = overall >= 70 ? '#00875A' : overall >= 40 ? '#D97706' : '#DC2626';

  return (
    <div className="bg-white rounded border border-[#E8E8E4] p-4 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-[Georgia,serif] text-sm sm:text-base font-semibold text-[#1A1A1A]">
          Readiness Radar
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-xs text-[#9CA39B]">Overall</span>
          <span
            className="text-lg font-semibold font-mono"
            style={{ color: scoreColor }}
          >
            {overall}
          </span>
          <span className="text-xs text-[#9CA39B]">/100</span>
        </div>
      </div>

      <div className="w-full" style={{ height: 280 }}>
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={chartData} cx="50%" cy="50%" outerRadius="72%">
            <PolarGrid stroke="#E8E8E4" />
            <PolarAngleAxis
              dataKey="dimension"
              tick={{ fill: '#6B6B63', fontSize: 11 }}
            />
            <PolarRadiusAxis
              angle={90}
              domain={[0, 100]}
              tick={{ fill: '#9CA39B', fontSize: 9 }}
              tickCount={5}
            />
            <Radar
              name="Readiness"
              dataKey="score"
              stroke="#00875A"
              fill="#00875A"
              fillOpacity={0.15}
              strokeWidth={2}
            />
            <Tooltip
              content={({ payload }) => {
                if (!payload?.length) return null;
                const item = payload[0].payload;
                return (
                  <div className="bg-white border border-[#E8E8E4] rounded px-3 py-2 shadow-sm">
                    <p className="text-xs font-medium text-[#1A1A1A]">{item.fullName}</p>
                    <p className="text-sm font-mono" style={{ color: scoreColor }}>
                      {item.score}/100
                    </p>
                  </div>
                );
              }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Legend row */}
      <div className="flex flex-wrap gap-2 mt-3 justify-center">
        {dimensions.map(d => {
          const dimColor = d.score >= 70 ? '#00875A' : d.score >= 40 ? '#D97706' : '#DC2626';
          return (
            <div
              key={d.name}
              className="flex items-center gap-1.5 text-xs text-[#6B6B63] min-h-[32px] px-2 py-1 rounded bg-[#F5F5F0]"
              title={`${d.name}: ${d.score}/100`}
            >
              <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: dimColor }} />
              <span className="truncate max-w-[100px]">{d.name}</span>
              <span className="font-mono text-[10px]" style={{ color: dimColor }}>{d.score}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
