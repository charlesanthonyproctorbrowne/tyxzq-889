import {
  Card,
  CardContent,
  Typography,
  Box,
  LinearProgress,
  Avatar,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import ThermostatIcon from '@mui/icons-material/Thermostat';

interface Props {
  location: string;
  temp: number;
}

// Styled card matching the team cards with dashed border and dark background
const WeatherCardContainer = styled(Card)(({ theme }) => ({
  background: '#21222D',
  border: '2px dashed rgba(148, 163, 184, 0.3)',
  borderRadius: 16,
  color: 'white',
  minHeight: 140,
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    borderColor: 'rgba(148, 163, 184, 0.5)',
    transform: 'translateY(-2px)',
  },
}));

// Custom styled linear progress with modern appearance
const ComfortProgress = styled(LinearProgress)<{ temp: number }>(
  ({ temp }) => ({
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(148, 163, 184, 0.2)',
    '& .MuiLinearProgress-bar': {
      backgroundColor:
        temp >= 30
          ? '#ef4444'
          : temp >= 25
          ? '#f59e0b'
          : temp >= 20
          ? '#10b981'
          : temp >= 15
          ? '#3b82f6'
          : temp >= 10
          ? '#06b6d4'
          : '#8b5cf6',
      borderRadius: 2,
    },
  })
);

// Determines temperature color coding with modern color palette
const getTempColor = (temp: number): string => {
  if (temp >= 30) return '#f87171';
  if (temp >= 20) return '#fbbf24';
  if (temp >= 10) return '#60a5fa';
  return '#22d3ee';
};

// Maps locations to weather icons with consistent styling
const getLocationConfig = (location: string) => {
  const configs: Record<
    string,
    { icon: string; gradient: string; type: string }
  > = {
    manchester: {
      icon: '🌧️',
      gradient: 'linear-gradient(135deg, #3b82f6, #1e40af)',
      type: 'Rainy',
    },
    melbourne: {
      icon: '☀️',
      gradient: 'linear-gradient(135deg, #f59e0b, #d97706)',
      type: 'Sunny',
    },
    nigeria: {
      icon: '🌤️',
      gradient: 'linear-gradient(135deg, #f97316, #ea580c)',
      type: 'Tropical',
    },
    durban: {
      icon: '⛅',
      gradient: 'linear-gradient(135deg, #6b7280, #4b5563)',
      type: 'Coastal',
    },
    barcelona: {
      icon: '🌦️',
      gradient: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
      type: 'Mediterranean',
    },
    miami: {
      icon: '🌴',
      gradient: 'linear-gradient(135deg, #10b981, #059669)',
      type: 'Tropical',
    },
  };

  const key = location.toLowerCase();
  return (
    configs[key] || {
      icon: '🌡️',
      gradient: 'linear-gradient(135deg, #6b7280, #4b5563)',
      type: 'Weather',
    }
  );
};

// Calculates comfort level with refined temperature ranges
const getComfortProgress = (
  temp: number
): { percentage: number; level: string } => {
  if (temp >= 30) return { percentage: 90, level: 'Hot' };
  if (temp >= 25) return { percentage: 75, level: 'Warm' };
  if (temp >= 20) return { percentage: 60, level: 'Perfect' };
  if (temp >= 15) return { percentage: 45, level: 'Cool' };
  if (temp >= 10) return { percentage: 30, level: 'Cold' };
  return { percentage: 15, level: 'Freezing' };
};

// Weather card component designed to match the dashboard aesthetic
export const WeatherCard = ({ location, temp }: Props) => {
  const config = getLocationConfig(location);
  const comfort = getComfortProgress(temp);

  return (
    <WeatherCardContainer>
      <CardContent sx={{ p: 2.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
          <Avatar
            sx={{
              width: 28,
              height: 28,
              background: config.gradient,
              fontSize: '0.875rem',
            }}
          >
            {config.icon}
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="body2"
              sx={{
                color: 'white',
                fontWeight: 600,
                textTransform: 'capitalize',
                fontSize: '0.875rem',
              }}
            >
              {location}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: 'rgba(148, 163, 184, 0.8)',
                fontSize: '0.75rem',
              }}
            >
              {config.type}
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: 2,
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: getTempColor(temp),
              fontSize: '2rem',
              lineHeight: 1,
            }}
          >
            {temp}°C
          </Typography>
          <ThermostatIcon
            sx={{ fontSize: 20, color: 'rgba(148, 163, 184, 0.6)' }}
          />
        </Box>

        <Box>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 1,
            }}
          >
            <Typography
              variant="caption"
              sx={{
                color: 'rgba(148, 163, 184, 0.9)',
                fontWeight: 500,
                fontSize: '0.75rem',
              }}
            >
              Comfort
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: getTempColor(temp),
                fontWeight: 600,
                fontSize: '0.75rem',
              }}
            >
              {comfort.level}
            </Typography>
          </Box>
          <ComfortProgress
            variant="determinate"
            value={comfort.percentage}
            temp={temp}
          />
        </Box>
      </CardContent>
    </WeatherCardContainer>
  );
};
