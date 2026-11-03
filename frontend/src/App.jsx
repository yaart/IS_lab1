import { useState, useEffect } from 'react';
import { Box, AppBar, Toolbar, Typography, Chip, Container, Tabs, Tab } from '@mui/material';
import { connect, onChange } from './websocket';
import HumansTable from './components/HumansTable';
import SpecialOps from './components/SpecialOps';

export default function App() {
  const [tab, setTab] = useState(0);

  useEffect(() => {
    connect();
  }, []);

  return (
    <Box sx={{ minHeight: '100vh' }}>
      <AppBar position="sticky">
        <Toolbar sx={{ gap: 1 }}>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>IS-Lab1</Typography>
        </Toolbar>
        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          textColor="inherit"
          indicatorColor="secondary"
          sx={{ px: 2 }}
        >
          <Tab label="Таблица объектов" />
          <Tab label="Специальные операции" />
        </Tabs>
      </AppBar>
      <Container maxWidth="xl" sx={{ py: 3 }}>
        {tab === 0 && <HumansTable />}
        {tab === 1 && <SpecialOps />}
      </Container>
    </Box>
  );
}