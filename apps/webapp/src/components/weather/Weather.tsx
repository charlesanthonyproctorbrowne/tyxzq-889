import { Box } from '@mui/material';
import { useWeather } from '../../api';
import { WeatherCard } from './WeatherCard';

export const Weather = () => {
  const { data } = useWeather();
  const locationTemps = data?.data.data;

  return (
    <Box
      sx={{
        display: 'flex',
        gap: 2,
        mb: 3,
        overflowX: 'auto',
        paddingBottom: 1,
        '&::-webkit-scrollbar': {
          height: 6,
        },
        '&::-webkit-scrollbar-track': {
          backgroundColor: '#374151',
          borderRadius: 3,
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: '#6b7280',
          borderRadius: 3,
          '&:hover': {
            backgroundColor: '#9ca3af',
          },
        },
      }}
    >
      {locationTemps?.map((locationTemp, i) => (
        <Box key={i} sx={{ minWidth: 220, flexShrink: 0 }}>
          <WeatherCard
            location={locationTemp.location ?? 'Loading...'}
            temp={locationTemp.temp ?? 0}
          />
        </Box>
      ))}
    </Box>
  );
};
