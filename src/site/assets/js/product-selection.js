/* Same-range comparisons keep the original catalogue table available. */
const compare = document.querySelector('[data-model-compare]');
if (compare) {
  compare.hidden = false;
  const spec = JSON.parse(compare.querySelector('[data-comparison-data]').textContent);
  const choices = [...compare.querySelectorAll('[data-compare-choice]')];
  const status = compare.querySelector('[data-compare-status]');
  const output = compare.querySelector('[data-compare-output]');
  function render() {
    const names = choices.map(select => select.value).filter(Boolean);
    output.replaceChildren();
    if (new Set(names).size !== names.length) { status.textContent = 'Choose different models to compare.'; return; }
    if (names.length < 2) { status.textContent = 'Choose two models to see their specifications side by side.'; return; }
    status.textContent = names.length + ' models compared at catalogue rating conditions.';
    const rows = names.map(name => spec.rows.find(row => row.model === name));
    const table = document.createElement('table'); table.className = 'selection-comparison'; table.style.setProperty('--comparison-count', names.length);
    const caption = table.createCaption(); caption.textContent = 'Catalogue model comparison';
    const head = table.createTHead().insertRow();
    let th = document.createElement('th'); th.scope = 'col'; th.textContent = 'Specification'; head.append(th);
    for (const name of names) { th = document.createElement('th'); th.scope = 'col'; th.textContent = name; head.append(th); }
    const body = table.createTBody();
    for (const column of spec.columns.slice(1)) {
      const tr = body.insertRow(); const label = document.createElement('th'); label.scope = 'row'; label.textContent = column.label + (column.unit ? ' (' + column.unit + ')' : ''); tr.append(label);
      for (const row of rows) { const td = tr.insertCell(); td.dataset.model = row.model; const value = row[column.key]; td.textContent = value == null || value === '' ? '—' : Array.isArray(value) ? value.join(' × ') : String(value); }
    }
    const tr = body.insertRow(); const label = document.createElement('th'); label.scope = 'row'; label.textContent = 'Enquire'; tr.append(label);
    for (const name of names) { const td = tr.insertCell(); const link = document.createElement('a'); link.href = '#quote'; link.dataset.quoteModel = name; link.textContent = 'Choose ' + name; td.append(link); }
    const wrap = document.createElement('div'); wrap.className = 'comparison-scroll'; wrap.tabIndex = 0; wrap.setAttribute('role', 'region'); wrap.setAttribute('aria-label', 'Model comparison, scrollable'); wrap.append(table); output.append(wrap);
  }
  choices.forEach(select => select.addEventListener('change', render));
}
