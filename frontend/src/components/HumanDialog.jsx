import { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, MenuItem, FormControlLabel, Switch, Grid
} from '@mui/material';
import { fetchHuman, createHuman, updateHuman } from '../api';

const MOODS = ['SADNESS','APATHY','CALM','FRENZY'];
const WEAPONS = ['PISTOL','KNIFE','BAT'];

export default function HumanDialog({ open, editId, onClose, onSave }) {
  const [n, setN] = useState('');
  const [w, setW] = useState('');
  const [cx, setCx] = useState('');
  const [cy, setCy] = useState('0');
  const [ci, setCi] = useState('');
  const [uc, setUc] = useState(false);
  const [ca, setCa] = useState('');
  const [cai, setCai] = useState('');
  const [uca, setUca] = useState(false);
  const [m, setM] = useState('');
  const [s, setS] = useState('0');
  const [rh, setRh] = useState(false);
  const [ht, setHt] = useState(false);
  const [errs, setErrs] = useState({});
  const [l, setL] = useState(false);
  const [clist, setClist] = useState([]);
  const [crlist, setCrlist] = useState([]);

  useEffect(() => {
    if (!open) return;
    fetch('/api/coordinates').then(r=>r.json()).then(setClist);
    fetch('/api/cars').then(r=>r.json()).then(setCrlist);
    if (editId) {
      fetchHuman(editId).then(h => {
        setN(h.name||'');
        setW(h.weaponType||'');
        setCx(h.coordinates ? h.coordinates.x : '');
        setCy(h.coordinates ? h.coordinates.y : '0');
        setCi(h.coordinates ? h.coordinates.id : '');
        setUc(true);
        setCa(h.car ? h.car.name : '');
        setCai(h.car ? h.car.id : '');
        setUca(!!h.car);
        setM(h.mood||'');
        setS(h.impactSpeed ? String(h.impactSpeed) : '0');
        setRh(h.realHero||false);
        setHt(h.hasToothpick||false);
      });
    } else {
      setN(''); setW(''); setCx(''); setCy('0'); setCi('');
      setUc(false); setCa(''); setCai(''); setUca(false);
      setM(''); setS('0'); setRh(false); setHt(false);
    }
    setErrs({});
  }, [open, editId]);

  const save = async () => {
    if (!n.trim()) { setErrs({name:"Имя обязательно"}); return; }
    if (!w) { setErrs({weaponType:"Тип оружия обязателен"}); return; }

    if(!uc) {
      const xv = parseFloat(cx);
      const yv = parseFloat(cy);
      if(isNaN(xv)) { setErrs({"coordinates.x":"X — введите число"}); return; }
      if(xv > 256) { setErrs({"coordinates.x":"X должен быть ≤ 256"}); return; }
      if(isNaN(yv)) { setErrs({"coordinates.y":"Y — введите число"}); return; }
      if(yv <= -533) { setErrs({"coordinates.y":"Y должен быть > -533"}); return; }
    }

    const sv = parseFloat(s);
    if(isNaN(sv)) { setErrs({impactSpeed:"Скорость удара — введите число"}); return; }
    if(sv > 738) { setErrs({impactSpeed:"Скорость удара должна быть ≤ 738"}); return; }

    const coords = (uc && ci)
      ? { existingId: parseInt(ci) }
      : { x: parseFloat(cx)||0, y: parseFloat(cy)||0 };

    let car = null;
    if (uca && cai) {
      car = { existingId: parseInt(cai) };
    } else if (ca.trim()) {
      car = { name: ca.trim() };
    }

    const payload = {
      name: n.trim(),
      coordinates: coords,
      realHero: rh,
      hasToothpick: ht,
      car,
      mood: m||null,
      impactSpeed: parseFloat(s)||0,
      weaponType: w,
    };

    setL(true);
    try {
      if (editId) await updateHuman(editId, payload);
      else await createHuman(payload);
      onSave();
    } catch (ex) {
      if (ex.errors && typeof ex.errors === 'object') {
        setErrs(ex.errors);
      } else {
        setErrs({_general: ex.message||'Ошибка сервера'});
      }
    }
    setL(false);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {editId ? 'Редактировать #'+editId : 'Создать HumanBeing'}
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 0.5 }}>
          <Grid item xs={7}>
            <TextField fullWidth label="Имя *" value={n} helperText={errs.name||""} error={!!errs.name||!n.trim()}
              onChange={e => setN(e.target.value)} size="small" />
          </Grid>
          <Grid item xs={5}>
            <TextField fullWidth select label="Оружие *" value={w}
              onChange={e => setW(e.target.value)} helperText={errs.weaponType||""} error={!!errs.weaponType||!w} size="small">
              <MenuItem value="">—</MenuItem>
              {WEAPONS.map(v => <MenuItem key={v} value={v}>{v}</MenuItem>)}
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={<Switch checked={uc} onChange={e => setUc(e.target.checked)} />}
              label="Использовать существующие координаты" />
          </Grid>
          {uc ? (
            <Grid item xs={12}>
              <TextField fullWidth select label="Координаты" value={ci}
                onChange={e => setCi(e.target.value)} size="small">
                <MenuItem value="">— выберите —</MenuItem>
                {clist.map(v => <MenuItem key={v.id} value={v.id}>#{v.id} ({v.x}, {v.y})</MenuItem>)}
              </TextField>
            </Grid>
          ) : (
            <>
              <Grid item xs={6}>
                <TextField fullWidth label="X (макс 256)" value={cx} inputProps={{max:256}} helperText={errs["coordinates.x"]||""} error={!!errs["coordinates.x"]}
                  onChange={e => setCx(e.target.value)} type="number" size="small" />
              </Grid>
              <Grid item xs={6}>
                <TextField fullWidth label="Y (> -533)" value={cy} inputProps={{min:-532}} helperText={errs["coordinates.y"]||""} error={!!errs["coordinates.y"]}
                  onChange={e => setCy(e.target.value)} type="number" size="small" />
              </Grid>
            </>
          )}
          <Grid item xs={12}>
            <FormControlLabel
              control={<Switch checked={uca} onChange={e => setUca(e.target.checked)} />}
              label="Использовать существующую машину" />
          </Grid>
          {uca ? (
            <Grid item xs={12}>
              <TextField fullWidth select label="Машина" value={cai}
                onChange={e => setCai(e.target.value)} size="small">
                <MenuItem value="">— выберите —</MenuItem>
                {crlist.map(v => <MenuItem key={v.id} value={v.id}>{v.name||'#С' + v.id}</MenuItem>)}
              </TextField>
            </Grid>
          ) : (
            <Grid item xs={12}>
              <TextField fullWidth label="Название машины" value={ca}
                onChange={e => setCa(e.target.value)} size="small" />
            </Grid>
          )}
          <Grid item xs={4}>
            <TextField fullWidth select label="Настроение" value={m}
              onChange={e => setM(e.target.value)} size="small">
              <MenuItem value="">Нет</MenuItem>
              {MOODS.map(v => <MenuItem key={v} value={v}>{v}</MenuItem>)}
            </TextField>
          </Grid>
          <Grid item xs={4}>
            <TextField fullWidth label="Скорость удара" value={s} inputProps={{max:738}} helperText={errs.impactSpeed||""} error={!!errs.impactSpeed}
              onChange={e => setS(e.target.value)} type="number" size="small" />
          </Grid>
          <Grid item xs={4}>
            <FormControlLabel
              control={<Switch checked={rh} onChange={e => setRh(e.target.checked)} />}
              label="Герой" />
            <FormControlLabel
              control={<Switch checked={ht} onChange={e => setHt(e.target.checked)} />}
              label="Зубочистка" />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => { onClose(); setN(''); setW(''); }}>Отмена</Button>
        <Button variant="contained" onClick={save} disabled={l}>
          {editId ? 'Сохранить' : 'Создать'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}