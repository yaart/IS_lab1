import ConfirmDialog from './ConfirmDialog';
import { useState } from 'react';
import {
  Card, CardContent, CardHeader, Typography, TextField, MenuItem,
  Button, Grid, Alert, Box
} from '@mui/material';
import {
  countByImpactSpeedEqual, countByImpactSpeedGreater,
  countByWeaponTypeLess, deleteHeroesWithoutToothpick, transferToLada,
  previewDeleteToothpick, previewTransferLada
} from '../api';

export default function SpecialOps({ onRefresh }) {
  const [op1val, setOp1val] = useState('');
  const [op2val, setOp2val] = useState('PISTOL');
  const [op3val, setOp3val] = useState('');
  const [res1, setRes1] = useState(null);
  const [res2, setRes2] = useState(null);
  const [res3, setRes3] = useState(null);
  const [res4, setRes4] = useState(null);
  const [res5, setRes5] = useState(null);

  const result = (r, prefix) => {
    if (!r) return null;
    const count = r.count ?? r.deletedCount ?? r.transferredCount;
    const items = r.items && r.items.length > 0 ? ` — ${r.items.join(', ')}` : '';
    return `${prefix}: ${count}${items}`;
  };

  const [confirm, setConfirm] = useState({ open: false, title: '', text: '', action: null });

  const execConfirm = async () => {
    const a = confirm.action;
    setConfirm({ open: false, title: "", text: "", action: null });
    if (a === "delHeroes") {
      const r = await deleteHeroesWithoutToothpick();
      setRes4(r);
      if (onRefresh) onRefresh();
    }
    if (a === "lada") {
      const r = await transferToLada();
      setRes5(r);
      if (onRefresh) onRefresh();
    }
  };

  return (
    <Box>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="1. Количество с impactSpeed =" subheader="Точное совпадение" />
            <CardContent>
              <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                <TextField size="small" type="number" label="impactSpeed" value={op1val}
                  onChange={e => setOp1val(e.target.value)} />
                <Button variant="contained" onClick={async () => {
                  const r = await countByImpactSpeedEqual(parseFloat(op1val));
                  setRes1(r);
                }}>Посчитать</Button>
              </Box>
              {res1 && <Alert severity="info">{result(res1, 'Количество')}</Alert>}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="2. Количество с weaponType меньше" />
            <CardContent>
              <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                <TextField size="small" select label="Weapon Type" value={op2val}
                  onChange={e => setOp2val(e.target.value)}>
                  {['PISTOL','KNIFE','BAT'].map(w => <MenuItem key={w} value={w}>{w}</MenuItem>)}
                </TextField>
                <Button variant="contained" onClick={async () => {
                  const r = await countByWeaponTypeLess(op2val);
                  setRes2(r);
                }}>Посчитать</Button>
              </Box>
              {res2 !== null && <Alert severity="info">{result(res2, 'Количество')}</Alert>}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="3. Количество с impactSpeed >" />
            <CardContent>
              <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                <TextField size="small" type="number" label="impactSpeed" value={op3val}
                  onChange={e => setOp3val(e.target.value)} />
                <Button variant="contained" onClick={async () => {
                  const r = await countByImpactSpeedGreater(parseFloat(op3val));
                  setRes3(r);
                }}>Посчитать</Button>
              </Box>
              {res3 !== null && <Alert severity="info">{result(res3, 'Количество')}</Alert>}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ borderTop: '3px solid #d32f2f' }}>
            <CardHeader title="4. Удалить героев без зубочисток"
              titleTypographyProps={{ color: 'error' }} />
            <CardContent>
              <Button variant="contained" color="error" onClick={async () => {
                const list = await previewDeleteToothpick();
                const names = list.length > 0 ? list.map(h => `#${h.id} (${h.name})`).join(', ') : 'нет объектов';
                setConfirm({ open: true, title: "Удаление героев", text: `Удалить следующих героев без зубочисток (${list.length}): ${names}?`, action: "delHeroes" });
              }}>Удалить</Button>
              {res4 !== null && <Alert severity="warning" sx={{ mt: 1 }}>
                {result(res4, 'Удалено')}
              </Alert>}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ borderTop: '3px solid #ed6c02' }}>
            <CardHeader title="5. Пересадить героев без машины на Lada Kalina"
              titleTypographyProps={{ color: 'warning.main' }} />
            <CardContent>
              <Button variant="contained" color="warning" onClick={async () => {
                const list = await previewTransferLada();
                const names = list.length > 0 ? list.map(h => `#${h.id} (${h.name})`).join(', ') : 'нет объектов';
                setConfirm({ open: true, title: "Пересадка", text: `Пересадить следующих героев без машины на Lada Kalina (${list.length}): ${names}?`, action: "lada" });
              }}>Пересадить</Button>
              {res5 !== null && <Alert severity="success" sx={{ mt: 1 }}>
                {result(res5, 'Пересажено')}
              </Alert>}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <ConfirmDialog open={confirm.open} title={confirm.title} text={confirm.text}
        onConfirm={execConfirm} onCancel={() => setConfirm({ open: false, title: "", text: "", action: null })} />
    </Box>
  );
}