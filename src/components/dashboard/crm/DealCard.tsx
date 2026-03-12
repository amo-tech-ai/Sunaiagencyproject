// C07-DEAL-CARD — Compact deal card for kanban board
// Draggable via native HTML5 drag API. Shows title, value, contact, probability, days-in-stage.
// Stale indicators: >7 days amber border, >14 days red border, high-value green accent.

import type { Deal } from '../../../lib/types/crm-pipeline';
import { GripVertical } from 'lucide-react';

interface DealCardProps {
  deal: Deal;
  onClick: (deal: Deal) => void;
  onDragStart: (e: React.DragEvent, deal: Deal) => void;
}

function formatCurrency(value: number): string {
  if (value >= 1000) return `$${(value / 1000).toFixed(value % 1000 === 0 ? 0 : 1)}K`;
  return `$${value.toLocaleString()}`;
}

export default function DealCard({ deal, onClick, onDragStart }: DealCardProps) {
  const isHighValue = deal.value >= 10000;

  // Left border color based on status
  let borderColor = 'border-l-transparent';
  if (deal.isVeryStale) borderColor = 'border-l-red-500';
  else if (deal.isStale) borderColor = 'border-l-amber-500';
  else if (isHighValue) borderColor = 'border-l-[#00875A]';

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, deal)}
      onClick={() => onClick(deal)}
      className={`
        bg-white border border-[#E8E8E4] rounded-lg p-3 cursor-pointer
        hover:shadow-md hover:border-[#D4CFC8] transition-all duration-150
        border-l-[3px] ${borderColor}
        active:opacity-75 active:shadow-lg
      `}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter') onClick(deal); }}
      aria-label={`Deal: ${deal.title}, ${formatCurrency(deal.value)}`}
    >
      {/* Drag handle */}
      <div className="flex items-start gap-2">
        <GripVertical className="w-3.5 h-3.5 text-[#D4CFC8] mt-0.5 shrink-0 cursor-grab" />
        <div className="flex-1 min-w-0">
          {/* Title */}
          <p className="text-sm font-medium text-[#1A1A1A] leading-tight truncate">
            {deal.title}
          </p>

          {/* Value + Probability */}
          <div className="flex items-center gap-2 mt-1.5">
            <span className="text-sm font-semibold text-[#00875A]">
              {formatCurrency(deal.value)}
            </span>
            <span className="text-xs text-[#6B6B63]">
              {deal.probability}%
            </span>
          </div>

          {/* Contact */}
          {deal.contact_name && (
            <p className="text-xs text-[#9CA39B] mt-1 truncate">
              {deal.contact_name}
            </p>
          )}
          {!deal.contact_name && deal.client_name && (
            <p className="text-xs text-[#9CA39B] mt-1 truncate">
              {deal.client_name}
            </p>
          )}

          {/* Days in stage */}
          <div className="flex items-center gap-1.5 mt-1.5">
            <span className={`text-xs ${
              deal.isVeryStale ? 'text-red-600 font-medium' :
              deal.isStale ? 'text-amber-600 font-medium' :
              'text-[#9CA39B]'
            }`}>
              {deal.daysInStage === 0 ? 'Today' : `${deal.daysInStage}d`}
            </span>
            {deal.isStale && (
              <span className="text-xs">
                {deal.isVeryStale ? '\uD83D\uDD34' : '\u26A0\uFE0F'}
              </span>
            )}
          </div>

          {/* Agent health score (if available) */}
          {deal.healthScore !== undefined && (
            <div className="mt-2 pt-2 border-t border-[#F0F0EC]">
              <div className="flex items-center justify-between mb-1">
                <span className={`text-[10px] font-medium ${
                  deal.healthLabel === 'HIGH' ? 'text-[#00875A]' :
                  deal.healthLabel === 'MEDIUM' ? 'text-[#D97706]' :
                  'text-[#DC2626]'
                }`}>
                  Health: {deal.healthLabel || 'N/A'}
                </span>
                <span className="text-[10px] text-[#9CA39B] font-mono">
                  {deal.healthScore}%
                </span>
              </div>
              <div className="w-full h-1 rounded-full bg-[#F0F0EC]">
                <div
                  className="h-1 rounded-full transition-all duration-300"
                  style={{
                    width: `${deal.healthScore}%`,
                    backgroundColor:
                      deal.healthLabel === 'HIGH' ? '#00875A' :
                      deal.healthLabel === 'MEDIUM' ? '#D97706' :
                      '#DC2626',
                  }}
                />
              </div>
              {deal.healthInsight && (
                <p className="text-[10px] text-[#6B6B63] mt-1 leading-tight">
                  {deal.healthInsight}
                </p>
              )}
              {deal.scoringAgent && (
                <p className="text-[10px] text-[#9CA39B] mt-0.5">
                  Agent: {deal.scoringAgent}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}