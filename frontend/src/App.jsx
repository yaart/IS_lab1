import { useState, useEffect } from 'react';
import { Box, AppBar, Toolbar, Typography, Chip, Container, Tabs, Tab } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import TableChartIcon from '@mui/icons-material/TableChart';
import BuildIcon from '@mui/icons-material/Build';
import { connect, onChange } from './websocket';
import HumansTable from './components/HumansTable';
import SpecialOps from './components/SpecialOps';

export default function App() {
  const [connected, setConnected] = useState(false);
  const [tick, setTick] = useState(0);
  const [tab, setTab] = useState(0);

  useEffect(() => {
    connect(setConnected);
    return onChange(() => setTick(t => t + 1));
  }, []);

  return (
    <Box sx={{ minHeight: '100vh' }}>
      <AppBar position="sticky">
        <Toolbar sx={{ gap: 1 }}>
          <PeopleIcon />
          <Typography variant="h6" sx={{ flexGrow: 1 }}>IS-Lab1</Typography>
          <Chip
            label={connected ? 'Подключено' : 'Нет связи'}
            color={connected ? 'success' : 'error'}
            size="small"
          />
        </Toolbar>
        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          textColor="inherit"
          indicatorColor="secondary"
          sx={{ px: 2 }}
        >
          <Tab icon={<TableChartIcon />} iconPosition="start" label="Таблица объектов" />
          <Tab icon={<BuildIcon />} iconPosition="start" label="Специальные операции" />
        </Tabs>
      </AppBar>
      <Container maxWidth="xl" sx={{ py: 3 }}>
        {tab === 0 && <HumansTable key={tick} />}
        {tab === 1 && <SpecialOps onRefresh={() => setTick(t => t + 1)} />}
      </Container>
    </Box>
  );
}