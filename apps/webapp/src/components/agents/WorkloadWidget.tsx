import React, { useMemo } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  LinearProgress,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useInteractions, useAgents } from '../../api';

const WorkloadCard = styled(Card)(({ theme }) => ({
  backgroundColor: '#21222D',
  border: '1px solid rgba(148, 163, 184, 0.1)',
  borderRadius: 12,
  color: 'white',
  height: 'fit-content',
}));

const WorkloadBar = styled(LinearProgress)<{ workloadLevel: string }>(
  ({ workloadLevel }) => ({
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(148, 163, 184, 0.2)',
    '& .MuiLinearProgress-bar': {
      backgroundColor:
        workloadLevel === 'high'
          ? '#ef4444'
          : workloadLevel === 'medium'
          ? '#f59e0b'
          : '#10b981',
      borderRadius: 4,
    },
  })
);

// Analyzes agent workload distribution to identify capacity issues and rebalancing opportunities
export const AgentWorkloadWidget: React.FC = () => {
  const { data: interactionsData } = useInteractions();
  const { data: agentsData } = useAgents();

  // Process interaction data to calculate workload distribution across agents
  const workloadData = useMemo(() => {
    if (!interactionsData?.data?.data || !agentsData?.data?.data) {
      return {
        distribution: [],
        stats: { overloaded: 0, underutilized: 0, balanced: 0 },
      };
    }

    const interactions = interactionsData.data.data;
    const agents = agentsData.data.data;

    // Create agent lookup map for name resolution
    const agentMap = new Map(agents.map((agent) => [agent.id, agent.name]));

    // Count interactions per agent
    const agentInteractions = new Map<number, number>();
    interactions.forEach((interaction) => {
      if (interaction.agent_id) {
        agentInteractions.set(
          interaction.agent_id,
          (agentInteractions.get(interaction.agent_id) || 0) + 1
        );
      }
    });

    // Calculate distribution with workload levels
    const totalInteractions = interactions.length;
    const averagePerAgent = totalInteractions / agents.length;

    const distribution = Array.from(agentInteractions.entries())
      .map(([agentId, count]) => {
        const percentage = (count / totalInteractions) * 100;
        const workloadLevel =
          count > averagePerAgent * 1.5
            ? 'high'
            : count < averagePerAgent * 0.5
            ? 'low'
            : 'medium';

        return {
          agentId,
          agentName: agentMap.get(agentId) || 'Unknown',
          interactions: count,
          percentage,
          workloadLevel,
        };
      })
      .sort((a, b) => b.interactions - a.interactions)
      .slice(0, 8); // Show top 8 for space

    // Calculate summary stats
    const stats = {
      overloaded: distribution.filter((d) => d.workloadLevel === 'high').length,
      underutilized: distribution.filter((d) => d.workloadLevel === 'low')
        .length,
      balanced: distribution.filter((d) => d.workloadLevel === 'medium').length,
    };

    return { distribution, stats };
  }, [interactionsData, agentsData]);

  return (
    <WorkloadCard>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
          📊 Agent Workload Distribution
        </Typography>

        {/* Summary Stats */}
        <Box sx={{ display: 'flex', gap: 1, mb: 3, flexWrap: 'wrap' }}>
          <Chip
            label={`${workloadData.stats.overloaded} Overloaded`}
            size="small"
            sx={{ bgcolor: 'rgba(239, 68, 68, 0.2)', color: '#f87171' }}
          />
          <Chip
            label={`${workloadData.stats.balanced} Balanced`}
            size="small"
            sx={{ bgcolor: 'rgba(245, 158, 11, 0.2)', color: '#fbbf24' }}
          />
          <Chip
            label={`${workloadData.stats.underutilized} Underutilized`}
            size="small"
            sx={{ bgcolor: 'rgba(16, 185, 129, 0.2)', color: '#34d399' }}
          />
        </Box>

        {/* Workload Bars */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {workloadData.distribution.map((agent) => (
            <Box key={agent.agentId}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 1,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      backgroundColor: `hsl(${
                        (agent.agentId * 137.5) % 360
                      }, 70%, 60%)`,
                    }}
                  />
                  <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
                    {agent.agentName}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography
                    variant="caption"
                    sx={{ color: 'rgba(148, 163, 184, 0.8)' }}
                  >
                    {agent.interactions} interactions
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ color: 'white', fontWeight: 600, minWidth: 35 }}
                  >
                    {agent.percentage.toFixed(1)}%
                  </Typography>
                </Box>
              </Box>
              <WorkloadBar
                variant="determinate"
                value={agent.percentage}
                workloadLevel={agent.workloadLevel}
              />
            </Box>
          ))}
        </Box>

        {/* Insights */}
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
            💡 Insight
          </Typography>
          <Typography variant="body2" sx={{ fontSize: '0.875rem', mt: 0.5 }}>
            {workloadData.stats.overloaded > 0
              ? `Consider redistributing work from ${
                  workloadData.stats.overloaded
                } overloaded agent${
                  workloadData.stats.overloaded > 1 ? 's' : ''
                }`
              : workloadData.stats.underutilized > 0
              ? `${workloadData.stats.underutilized} agent${
                  workloadData.stats.underutilized > 1 ? 's' : ''
                } have capacity for additional interactions`
              : 'Workload is well distributed across the team'}
          </Typography>
        </Box>
      </CardContent>
    </WorkloadCard>
  );
};
