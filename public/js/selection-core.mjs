/* Accept only bounded, non-contact selection records for known products/models. */
const clean = (value, limit = 180) => typeof value === 'string' ? value.replace(/[\u0000-\u001f]/g, ' ').trim().slice(0, limit) : '';
export function normalizeSelection(raw, products) {
  if (!raw || raw.version !== 1 || !Object.hasOwn(products, raw.product)) return null;
  const product = products[raw.product];
  const model = clean(raw.model, 70);
  if (model && !product.models.includes(model)) return null;
  const inputs = Array.isArray(raw.inputs) ? raw.inputs.slice(0, 12).filter(row => Array.isArray(row) && row.length === 2).map(([a, b]) => [clean(a, 80), clean(b)]).filter(([a, b]) => a && b) : [];
  const result = clean(raw.result, 240), note = clean(raw.note, 500);
  if (!model && !inputs.length && !result) return null;
  return {version: 1, product: raw.product, model, inputs, result, note};
}
export function selectionText(record, products) {
  return [`Product: ${products[record.product].name}`, ...(record.model ? [`Model: ${record.model}`] : []), ...record.inputs.map(([label, value]) => `${label}: ${value}`), record.result, record.note].filter(Boolean).join('\n');
}
export function selectionFromUrl(search, products) {
  try { const value = new URLSearchParams(search).get('selection'); return value && value.length <= 5000 ? normalizeSelection(JSON.parse(value), products) : null; } catch { return null; }
}
export function withSelection(path, record) {
  const url = new URL(path, 'https://winequipments.com');
  url.searchParams.set('selection', JSON.stringify(record));
  return url.pathname + url.search + url.hash;
}
