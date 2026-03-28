// AI Team section — fetches agent matches (API + local fallback) and renders grid
// Extracted from StepExecutiveSummary + StepLaunchProject to avoid duplication

import { useState, useEffect, useRef, useMemo } from 'react';
import { Users } from 'lucide-react';
import { matchAgents } from '../../wizard/data/agentData';
import { agentCatalogApi } from '../../../lib/supabase';
import { AgentTeamGrid } from './AgentTeamGrid';
import type { AgentTeamCardAgent } from './AgentTeamCard';

interface AITeamSectionProps {
  industry: string;
  goals: string[];
  companySize: string;
  systemIds: string[];
  companyName?: string;
  heading?: string;
  animationDelay?: number;
  status?: 'active' | 'standby' | 'working';
}

export function AITeamSection({
  industry,
  goals,
  companySize,
  systemIds,
  companyName = '',
  heading = 'Your AI Team',
  animationDelay = 0,
  status = 'active',
}: AITeamSectionProps) {
  // Local matching (immediate, deterministic)
  const localTeam = useMemo(() => {
    if (systemIds.length === 0) return [];
    return matchAgents(systemIds, industry, companyName);
  }, [systemIds, industry, companyName]);

  // AI-powered matching (async, from POST /agents/match)
  const [aiTeam, setAiTeam] = useState<AgentTeamCardAgent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fetchedRef = useRef(false);

  useEffect(() => {
    if (fetchedRef.current || systemIds.length === 0) return;
    fetchedRef.current = true;

    async function fetchAiTeam() {
      setLoading(true);
      setError(null);
      try {
        const { data, error: apiError } = await agentCatalogApi.match({
          industry,
          goals,
          companySize,
          systemIds,
        });
        if (apiError) {
          console.warn('[AITeamSection] API match error (using local):', apiError);
          setError(apiError);
        } else if (data?.matches) {
          setAiTeam(data.matches.map((m: any) => ({
            slug: m.slug,
            name: m.name,
            emoji: m.emoji || '🤖',
            division: m.division || '',
            role: m.role || '',
            firstTask: m.firstTask || m.reason || '',
            fitScore: m.fitScore,
            reason: m.reason,
          })));
        }
      } catch (e) {
        console.warn('[AITeamSection] API match exception (using local):', e);
        setError(String(e));
      } finally {
        setLoading(false);
      }
    }
    fetchAiTeam();
  }, [industry, goals, companySize, systemIds]);

  // Use AI-matched team if available, otherwise local
  const displayTeam: AgentTeamCardAgent[] = useMemo(() => {
    if (aiTeam.length > 0) return aiTeam;
    return localTeam.map(a => ({
      slug: a.id,
      name: a.name,
      emoji: '🤖',
      division: a.division,
      role: a.role,
      firstTask: a.task,
    }));
  }, [aiTeam, localTeam]);

  if (displayTeam.length === 0 && !loading) return null;

  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <Users className="w-4 h-4" style={{ color: '#00875A' }} />
        <p className="text-xs tracking-widest uppercase" style={{ color: '#00875A', letterSpacing: '0.08em' }}>
          {heading}
        </p>
      </div>
      <p className="text-sm mb-4" style={{ color: '#6B6B63' }}>
        {aiTeam.length > 0
          ? 'AI-matched specialists curated for your industry, goals, and selected systems:'
          : 'Specialists assembled for your project:'}
      </p>
      <AgentTeamGrid
        agents={displayTeam}
        loading={loading}
        error={error}
        status={status}
        animationDelay={animationDelay}
      />
    </div>
  );
}
