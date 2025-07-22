import React, { useMemo } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Avatar,
  Divider,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import StarIcon from '@mui/icons-material/Star';
import WarningIcon from '@mui/icons-material/Warning';
import { useInteractions, useAgents } from '../../api';

const PerformanceCard = styled(Card)(({ theme }) => ({
  backgroundColor: '#21222D',
  border: '1px solid rgba(148, 163, 184, 0.1)',
  borderRadius: 12,
  color: 'white',
  height: 'fit-content',
}));

const MetricBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: theme.spacing(2),
  backgroundColor: 'rgba(148, 163, 184, 0.05)',
  borderRadius: 8,
  minWidth: 80,
}));

// Utility function to format duration in minutes and seconds
const formatDuration = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}m ${remainingSeconds}s`;
};

// Analyzes agent performance metrics to identify top performers and coaching opportunities
const AgentPerformanceWidget: React.FC = () => {
  const { data: interactionsData } = useInteractions();
  const { data: agentsData } = useAgents();

  // Process performance data to identify key metrics and insights
  const performanceData = useMemo(() => {
    if (!interactionsData?.data?.data || !agentsData?.data?.data) {
      return {
        topPerformer: null,
        needsSupport: null,
        teamAverage: { interactions: 0, avgLength: 0 },
        trends: { improving: 0, declining: 0 },
      };
    }

    const interactions = interactionsData.data.data;
    const agents = agentsData.data.data;

    // Create agent lookup map
    const agentMap = new Map(agents.map((agent) => [agent.id, agent.name]));

    // Calculate per-agent metrics
    const agentMetrics = new Map<
      number,
      {
        name: string;
        interactions: number;
        totalTime: number;
        avgLength: number;
      }
    >();

    interactions.forEach((interaction) => {
      if (interaction.agent_id) {
        const current = agentMetrics.get(interaction.agent_id) || {
          name: agentMap.get(interaction.agent_id) || 'Unknown',
          interactions: 0,
          totalTime: 0,
          avgLength: 0,
        };

        current.interactions += 1;
        current.totalTime += interaction.length_seconds || 0;
        current.avgLength = Math.round(
          current.totalTime / current.interactions
        );

        agentMetrics.set(interaction.agent_id, current);
      }
    });

    const agentPerformanceArray = Array.from(agentMetrics.entries()).map(
      ([id, metrics]) => ({
        agentId: id,
        ...metrics,
      })
    );

    // Find top performer (most interactions with reasonable avg time)
    const topPerformer = agentPerformanceArray
      .filter((agent) => agent.interactions > 0)
      .sort((a, b) => {
        // Score based on interactions count and efficiency (lower avg time is better)
        const scoreA = a.interactions * (10000 / Math.max(a.avgLength, 1));
        const scoreB = b.interactions * (10000 / Math.max(b.avgLength, 1));
        return scoreB - scoreA;
      })[0];

    // Find agent needing support (low interactions or very high avg time)
    const needsSupport = agentPerformanceArray
      .filter((agent) => agent.interactions > 0)
      .sort((a, b) => {
        // Score for needing support (low interactions or high avg time)
        const scoreA = a.interactions + 20000 / Math.max(a.avgLength, 1);
        const scoreB = b.interactions + 20000 / Math.max(b.avgLength, 1);
        return scoreA - scoreB;
      })[0];

    // Calculate team averages
    const totalInteractions = interactions.length;
    const totalTime = interactions.reduce(
      (sum, i) => sum + (i.length_seconds || 0),
      0
    );
    const teamAverage = {
      interactions: Math.round(totalInteractions / agents.length),
      avgLength: Math.round(totalTime / totalInteractions),
    };

    // Simulate trend analysis (in real app, you'd compare with historical data)
    const trends = {
      improving: Math.floor(agentPerformanceArray.length * 0.3), // ~30% improving
      declining: Math.floor(agentPerformanceArray.length * 0.15), // ~15% declining
    };

    return {
      topPerformer,
      needsSupport,
      teamAverage,
      trends,
      totalAgentsActive: agentPerformanceArray.length,
    };
  }, [interactionsData, agentsData]);

  return (
    <PerformanceCard>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
          ⭐ Performance Summary
        </Typography>

        {/* Team Metrics */}
        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <MetricBox>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#10b981' }}>
              {performanceData.teamAverage.interactions}
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: 'rgba(148, 163, 184, 0.8)', textAlign: 'center' }}
            >
              Avg Interactions
            </Typography>
          </MetricBox>

          <MetricBox>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#3b82f6' }}>
              {formatDuration(performanceData.teamAverage.avgLength)}
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: 'rgba(148, 163, 184, 0.8)', textAlign: 'center' }}
            >
              Avg Duration
            </Typography>
          </MetricBox>

          <MetricBox>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#f59e0b' }}>
              {performanceData.totalAgentsActive}
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: 'rgba(148, 163, 184, 0.8)', textAlign: 'center' }}
            >
              Active Agents
            </Typography>
          </MetricBox>
        </Box>

        {/* Top Performer */}
        {performanceData.topPerformer && (
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <StarIcon sx={{ color: '#fbbf24', fontSize: 20 }} />
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                Top Performer
              </Typography>
            </Box>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                p: 2,
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                borderRadius: 2,
              }}
            >
              <Avatar sx={{ width: 32, height: 32, bgcolor: '#10b981' }}>
                {performanceData.topPerformer.name.charAt(0)}
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {performanceData.topPerformer.name}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ color: 'rgba(148, 163, 184, 0.8)' }}
                >
                  {performanceData.topPerformer.interactions} interactions •{' '}
                  {formatDuration(performanceData.topPerformer.avgLength)} avg
                </Typography>
              </Box>
              <TrendingUpIcon sx={{ color: '#10b981' }} />
            </Box>
          </Box>
        )}

        <Divider sx={{ borderColor: 'rgba(148, 163, 184, 0.1)', mb: 3 }} />

        {/* Needs Support */}
        {performanceData.needsSupport && (
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <WarningIcon sx={{ color: '#f59e0b', fontSize: 20 }} />
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                Needs Support
              </Typography>
            </Box>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                p: 2,
                backgroundColor: 'rgba(245, 158, 11, 0.1)',
                borderRadius: 2,
              }}
            >
              <Avatar sx={{ width: 32, height: 32, bgcolor: '#f59e0b' }}>
                {performanceData.needsSupport.name.charAt(0)}
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {performanceData.needsSupport.name}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ color: 'rgba(148, 163, 184, 0.8)' }}
                >
                  {performanceData.needsSupport.interactions} interactions •{' '}
                  {formatDuration(performanceData.needsSupport.avgLength)} avg
                </Typography>
              </Box>
              <TrendingDownIcon sx={{ color: '#f59e0b' }} />
            </Box>
          </Box>
        )}

        {/* Performance Trends */}
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Chip
            icon={<TrendingUpIcon sx={{ fontSize: 16 }} />}
            label={`${performanceData.trends.improving} Improving`}
            size="small"
            sx={{ bgcolor: 'rgba(16, 185, 129, 0.2)', color: '#34d399' }}
          />
          <Chip
            icon={<TrendingDownIcon sx={{ fontSize: 16 }} />}
            label={`${performanceData.trends.declining} Declining`}
            size="small"
            sx={{ bgcolor: 'rgba(239, 68, 68, 0.2)', color: '#f87171' }}
          />
        </Box>

        {/* Insight */}
        <Box
          sx={{
            mt: 3,
            p: 2,
            backgroundColor: 'rgba(148, 163, 184, 0.05)',
            borderRadius: 2,
          }}
        >
          <Typography
            variant="caption"
            sx={{ color: 'rgba(148, 163, 184, 0.9)', fontWeight: 600 }}
          >
            💡 Recommendation
          </Typography>
          <Typography variant="body2" sx={{ fontSize: '0.875rem', mt: 0.5 }}>
            {performanceData.needsSupport
              ? `Consider pairing ${performanceData.needsSupport.name} with ${performanceData.topPerformer?.name} for mentoring`
              : 'Team performance is strong across all agents'}
          </Typography>
        </Box>
      </CardContent>
    </PerformanceCard>
  );
};

export default AgentPerformanceWidget;
