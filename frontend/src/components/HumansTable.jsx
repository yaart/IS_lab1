import { useState, useEffect, useCallback } from 'react';
import { Box, Button, TextField, MenuItem, Alert, Snackbar, Dialog, DialogTitle, DialogContent, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import { fetchHumans, deleteHuman } from '../api';
import HumanDialog from './HumanDialog';
import ConfirmDialog from './ConfirmDialog';

export default function HumansTable() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(() => Number(localStorage.getItem('pageSize')) || 10);
  const [sortModel, setSortModel] = useState([{ field: 'id', sort: 'asc' }]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [snack, setSnack] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [detail, setDetail] = useState(null);
  const [fn, setFn] = useState('');
  const [fm, setFm] = useState('');
  const [fw, setFw] = useState('');
  const [fc, setFc] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const sb = sortModel[0]?.field || 'id';
      const sd = sortModel[0]?.sort || 'asc';
      const data = await fetchHumans({ page, pageSize, sortBy: sb, sortDir: sd,
        filterName: fn, filterMood: fm, filterWeaponType: fw, filterCarName: fc });
      setRows(data.content || []);
      setTotal(data.totalElements || 0);
    } catch (e) { setSnack({ severity: 'error', text: 'Ошибка загрузки' }); }
    setLoading(false);
  }, [page, pageSize, sortModel, fn, fm, fw, fc]);

  useEffect(() => { load(); }, [load]);

  const requestDelete = (id) => { setDeleteTarget(id); setConfirmOpen(true); };
  const confirmDelete = async () => {
    setConfirmOpen(false);
    try { await deleteHuman(deleteTarget); setSnack({ severity: 'success', text: 'Успешно удалено' }); load(); }
    catch (e) { setSnack({ severity: 'error', text: e.message || 'Ошибка' }); }
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 70, type: 'number' },
    { field: 'name', headerName: 'Имя', width: 180 },
    { field: 'coordinates', headerName: 'Координаты', width: 160, sortable: false,
      valueGetter: (_, r) => r.coordinates ? '('+r.coordinates.x+', '+r.coordinates.y+')' : '-' },
    { field: 'creationDate', headerName: 'Создан', width: 180,
      valueGetter: (_, r) => r.creationDate ? new Date(r.creationDate).toLocaleString('ru-RU') : '-' },
    { field: 'realHero', headerName: 'Герой', width: 80, valueGetter: (_, r) => r.realHero ? 'Да' : 'Нет' },
    { field: 'hasToothpick', headerName: 'Зубочистка', width: 100, valueGetter: (_, r) => r.hasToothpick ? 'Да' : 'Нет' },
    { field: 'car', headerName: 'Машина', width: 150, sortable: false, valueGetter: (_, r) => r.car ? r.car.name : '-' },
    { field: 'mood', headerName: 'Настроение', width: 120 },
    { field: 'impactSpeed', headerName: 'Скорость', width: 130, type: 'number' },
    { field: 'weaponType', headerName: 'Оружие', width: 110 },
    { field: 'actions', headerName: '', width: 180, sortable: false, filterable: false,
      renderCell: (p) => (
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          <Button size="small" variant="outlined" onClick={() => { setEditId(p.row.id); setDialogOpen(true); }}>Изм.</Button>
          <Button size="small" variant="outlined" color="error" onClick={() => requestDelete(p.row.id)}>Уд.</Button>
        </Box>
      )
    },
  ];

  return (
    <Box>
      <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap', alignItems: 'center' }}>
        <TextField size="small" label="Имя" value={fn} onChange={e => { setFn(e.target.value); setPage(0); }} sx={{ width: 160 }} />
        <TextField size="small" label="Настроение" select value={fm} onChange={e => { setFm(e.target.value); setPage(0); }} sx={{ width: 150 }}>
          <MenuItem value="">Все</MenuItem>
          {['SADNESS','APATHY','CALM','FRENZY'].map(v => <MenuItem key={v} value={v}>{v}</MenuItem>)}
        </TextField>
        <TextField size="small" label="Оружие" select value={fw} onChange={e => { setFw(e.target.value); setPage(0); }} sx={{ width: 130 }}>
          <MenuItem value="">Все</MenuItem>
          {['PISTOL','KNIFE','BAT'].map(v => <MenuItem key={v} value={v}>{v}</MenuItem>)}
        </TextField>
        <TextField size="small" label="Машина" value={fc} onChange={e => { setFc(e.target.value); setPage(0); }} sx={{ width: 160 }} />
        <Box sx={{ flexGrow: 1 }} />
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => { setEditId(null); setDialogOpen(true); }}>Создать</Button>
      </Box>

      <DataGrid rows={rows} columns={columns} loading={loading}
        paginationModel={{ page, pageSize }}
        onPaginationModelChange={m => { setPage(m.page); setPageSize(m.pageSize); if(m.pageSize !== pageSize) localStorage.setItem('pageSize', m.pageSize); }}
        pageSizeOptions={[5,10,20,50]} rowCount={total}
        paginationMode="server" sortingMode="server" sortModel={sortModel} onSortModelChange={setSortModel}
        autoHeight disableRowSelectionOnClick
        onRowClick={(p) => setDetail(p.row)}
        sx={{ bgcolor: 'white', '& .MuiDataGrid-row': { cursor: 'pointer' } }} />

      <HumanDialog open={dialogOpen} editId={editId}
        onClose={() => setDialogOpen(false)} onSave={() => { setDialogOpen(false); load(); }} />

      <ConfirmDialog open={confirmOpen} title="Удаление" text={'Удалить #'+deleteTarget+'?'}
        onConfirm={confirmDelete} onCancel={() => setConfirmOpen(false)} />

      <Dialog open={!!detail} onClose={() => setDetail(null)} maxWidth="sm" fullWidth>
        <DialogTitle>HumanBeing #{detail?.id}</DialogTitle>
        <DialogContent>
          {detail && (
            <Box sx={{ mt: 1 }}>
              <Typography><strong>Имя:</strong> {detail.name}</Typography>
              <Typography><strong>Координаты:</strong> ({detail.coordinates?.x}, {detail.coordinates?.y}) [ID: {detail.coordinates?.id}]</Typography>
              <Typography><strong>Создан:</strong> {new Date(detail.creationDate).toLocaleString('ru-RU')}</Typography>
              <Typography><strong>Герой:</strong> {detail.realHero ? 'Да' : 'Нет'}</Typography>
              <Typography><strong>Зубочистка:</strong> {detail.hasToothpick ? 'Да' : 'Нет'}</Typography>
              <Typography><strong>Машина:</strong> {detail.car ? detail.car.name + ' [ID: ' + detail.car.id + ']' : 'Нет'}</Typography>
              <Typography><strong>Mood:</strong> {detail.mood || '—'}</Typography>
              <Typography><strong>Скорость удара:</strong> {detail.impactSpeed}</Typography>
              <Typography><strong>Оружие:</strong> {detail.weaponType}</Typography>
              <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                <Button variant="outlined" onClick={() => { setEditId(detail?.id); setDialogOpen(true); setDetail(null); }}>Изменить</Button>
                <Button variant="outlined" color="error" onClick={() => { setDeleteTarget(detail?.id); setConfirmOpen(true); setDetail(null); }}>Удалить</Button>
              </Box>
            </Box>
          )}
        </DialogContent>
      </Dialog>

      <Snackbar open={!!snack} autoHideDuration={3000} onClose={() => setSnack(null)}>
        {snack ? <Alert severity={snack.severity}>{snack.text}</Alert> : undefined}
      </Snackbar>
    </Box>
  );
}
