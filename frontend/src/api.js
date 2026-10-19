const BASE = '/api/human-beings';
const SPECIAL = '/api/special-operations';

export async function fetchHumans({ page, pageSize, sortBy, sortDir, filterName, filterMood, filterWeaponType, filterCarName }) {
  const params = new URLSearchParams({ page, size: pageSize, sortBy, sortDir });
  if (filterName) params.append('filterName', filterName);
  if (filterMood) params.append('filterMood', filterMood);
  if (filterWeaponType) params.append('filterWeaponType', filterWeaponType);
  if (filterCarName) params.append('filterCarName', filterCarName);
  const r = await fetch(`${BASE}?${params}`);
  return r.json();
}

export async function fetchHuman(id) {
  const r = await fetch(`${BASE}/${id}`);
  return r.json();
}

export async function createHuman(data) {
  const r = await fetch(BASE, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
  if (!r.ok) throw await r.json();
  return r.json();
}

export async function updateHuman(id, data) {
  const r = await fetch(`${BASE}/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
  if (!r.ok) throw await r.json();
  return r.json();
}

export async function deleteHuman(id) {
  const r = await fetch(`${BASE}/${id}`, { method: 'DELETE' });
  if (!r.ok) throw await r.json();
}

export async function countByImpactSpeedEqual(value) {
  const r = await fetch(`${SPECIAL}/count-by-impact-speed-equal?value=${value}`);
  return r.json();
}

export async function countByImpactSpeedGreater(value) {
  const r = await fetch(`${SPECIAL}/count-by-impact-speed-greater?value=${value}`);
  return r.json();
}

export async function countByWeaponTypeLess(value) {
  const r = await fetch(`${SPECIAL}/count-by-weapon-type-less?value=${value}`);
  return r.json();
}

export async function deleteHeroesWithoutToothpick() {
  const r = await fetch(`${SPECIAL}/delete-heroes-without-toothpick`, { method: 'DELETE' });
  return r.json();
}

export async function transferToLada() {
  const r = await fetch(`${SPECIAL}/transfer-heroes-to-lada`, { method: 'POST' });
  return r.json();
}