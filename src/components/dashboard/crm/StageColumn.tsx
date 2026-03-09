// C07-STAGE-COL — Kanban stage column with droppable zone
// Renders stage header (name, count, total value) + deal cards.
// Uses native HTML5 drag-and-drop for drop target highlighting.

import type { Deal, Stage } from '../../../lib/types/crm-pipeline';
import DealCard from './DealCard';
import { useState } from 'react';

interface StageColumnProps {
  stage: Stage;
  deals: Deal[];
  onDealClick: (deal: Deal) => void;
  onDealDragStart: (e: React.DragEvent, deal: Deal) => void;
  onDealDrop: (stageId: string) => void;
}

function formatCurrency(value: number): string {
  if (value >= 1000) return `$${(value / 1000).toFixed(value % 1000 === 0 ? 0 : 1)}K`;
  return `$${value.toLocaleString()}`;
}

export default function StageColumn({
  stage,
  deals,
  onDealClick,
  onDealDragStart,
  onDealDrop,
}: StageColumnProps) {
  const [isOver, setIsOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setIsOver(true);
  };

  const handleDragLeave = () => {
    setIsOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsOver(false);
    onDealDrop(stage.id);
  };

  return (
    <div
      className={`
        flex flex-col min-w-[240px] max-w-[280px] w-[260px] shrink-0
        bg-[#FAFAF8] rounded-lg border transition-colors duration-150
        ${isOver ? 'border-[#00875A] bg-[#00875A]/5' : 'border-[#E8E8E4]'}
      `}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Stage Header */}
      <div className="p-3 border-b border-[#E8E8E4]">
        <div className="flex items-center gap-2">
          <div
            className="w-2.5 h-2.5 rounded-full shrink-0"
            style={{ backgroundColor: stage.color }}
          />
          <h3 className="text-sm font-semibold text-[#1A1A1A] truncate">
            {stage.name}
          </h3>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs text-[#6B6B63]">
            {stage.dealCount} {stage.dealCount === 1 ? 'deal' : 'deals'}
          </span>
          {stage.totalValue > 0 && (
            <>
              <span className="text-xs text-[#D4CFC8]">&middot;</span>
              <span className="text-xs font-medium text-[#1A1A1A]">
                {formatCurrency(stage.totalValue)}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Deal Cards */}
      <div className="flex-1 p-2 space-y-2 overflow-y-auto max-h-[calc(100vh-380px)] min-h-[100px]">
        {deals.length === 0 && (
          <div className={`
            border-2 border-dashed rounded-lg p-4 text-center transition-colors
            ${isOver ? 'border-[#00875A] bg-[#00875A]/5' : 'border-[#E8E8E4]'}
          `}>
            <p className="text-xs text-[#9CA39B]">No deals</p>
          </div>
        )}
        {deals.map((deal) => (
          <DealCard
            key={deal.id}
            deal={deal}
            onClick={onDealClick}
            onDragStart={onDealDragStart}
          />
        ))}
      </div>
    </div>
  );
}
