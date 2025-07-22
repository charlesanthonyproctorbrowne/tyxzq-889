import {
  Box,
  Typography,
  IconButton,
  TextField,
  InputAdornment,
  Tabs,
  Tab,
} from '@mui/material';
import { useState } from 'react';
import { styled } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import LightModeIcon from '@mui/icons-material/LightMode';
import NightlightIcon from '@mui/icons-material/Nightlight';
import { Weather } from './weather/Weather';
import AgentReport from './reports/Agent';
import PerformanceWidget from './agents/PerformanceWidget';
import { AgentWorkloadWidget } from './agents/WorkloadWidget';

// Styled components for the layout
const AppContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  minHeight: '100vh',
  backgroundColor: theme.palette.background.default,
}));

const MainContent = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  backgroundColor: '#181922',
  color: 'white',
  display: 'flex',
  flexDirection: 'column',
}));

const TopBar = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(2, 3),
  borderBottom: '1px solid rgba(148, 163, 184, 0.1)',
}));

const ContentArea = styled(Box)(({ theme }) => ({
  flex: 1,
  padding: theme.spacing(3),
  display: 'flex',
  gap: theme.spacing(3),
}));

// Main dashboard layout component
export default function Dashboard() {
  const [activeWidget, setActiveWidget] = useState(0);
  return (
    <AppContainer>
      <MainContent>
        <TopBar>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Dashboard
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <TextField
              placeholder="Search"
              size="small"
              sx={{
                ml: 2,
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'rgba(148, 163, 184, 0.1)',
                  borderRadius: 2,
                  color: 'white',
                  '& fieldset': { borderColor: 'transparent' },
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: 'rgba(148, 163, 184, 0.6)' }} />
                  </InputAdornment>
                ),
              }}
            />

            <IconButton sx={{ color: 'white' }}>
              <LightModeIcon />
            </IconButton>
            <IconButton sx={{ color: 'white' }}>
              <NightlightIcon />
            </IconButton>
          </Box>
        </TopBar>

        <Box sx={{ px: 3, py: 2 }}>
          <Weather />
        </Box>

        <ContentArea>
          <Box sx={{ flex: 4 }}>
            <AgentReport />
          </Box>

          <Box sx={{ minWidth: 300 }}>
            <Tabs
              value={activeWidget}
              onChange={(_, value) => setActiveWidget(value)}
              sx={{
                mb: 2,
                '& .MuiTab-root': {
                  color: 'rgba(148, 163, 184, 0.8)',
                  minHeight: 40,
                },
                '& .Mui-selected': { color: '#60a5fa' },
                '& .MuiTabs-indicator': { backgroundColor: '#60a5fa' },
              }}
            >
              <Tab label="Performance" />
              <Tab label="Workload" />
            </Tabs>

            {activeWidget === 0 && <PerformanceWidget />}
            {activeWidget === 1 && <AgentWorkloadWidget />}
          </Box>
        </ContentArea>
      </MainContent>
    </AppContainer>
  );
}
