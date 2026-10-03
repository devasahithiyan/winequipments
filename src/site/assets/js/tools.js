/* Sizing calculators. All ratings come from the catalogue data embedded in #tool-data. */
(() => {
  const form = document.querySelector('[data-tool]');
  const out = document.querySelector('[data-tool-out]');
  const dataEl = document.getElementById('tool-data');
  if (!form || !out || !dataEl) return;
  const D = JSON.parse(dataEl.textContent);
  const kind = form.dataset.tool;
  const num = (n) => { const v = parseFloat(form.elements[n]?.value); return Number.isFinite(v) ? v : NaN; };
  const f1 = (v, d = 1) => Number(v).toLocaleString('en-IN', { maximumFractionDigits: d });
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const modelId = (m) => m.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

  const render = ({ value, unit, label, model, modelNote, url, rows = [], warn, anchor }) => {
    out.innerHTML = `
      <p class="t-result__label">${esc(label)}</p>
      <p class="t-result__big">${value}<span>${esc(unit)}</span></p>
      ${rows.length ? `<dl class="t-result__rows">${rows.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${v}</dd></div>`).join('')}</dl>` : ''}
      ${model ? `<div class="t-result__model"><p>Matching model</p><strong>${esc(model)}</strong>${modelNote ? `<span>${modelNote}</span>` : ''}</div>` : ''}
      ${warn ? `<p class="t-result__warn">${warn}</p>` : ''}
      <div class="btn-row">
        <a class="btn btn--primary" href="#quote" ${model ? `data-quote-model="${esc(model)}"` : 'data-quote-link'}>${model ? 'Quote this model' : 'Ask our engineers'}</a>
        ${model && url ? `<a class="btn btn--secondary" href="${url}#${modelId(anchor || model)}">Model details</a>` : ''}
      </div>`;
  };
  const empty = (msg = 'Enter your figures to see the matching model.') => { out.innerHTML = `<p class="t-result__label">Result</p><p class="t-result__empty">${msg}</p>`; };

  const calc = () => {
    if (kind === 'dryer') {
      let cfm = num('cfm');
      const hp = num('hp');
      let fromHp = false;
      if (!(cfm > 0) && hp > 0) { cfm = hp * 4; fromHp = true; }
      if (!(cfm > 0)) return empty();
      const dry = form.querySelector('input[name="dry"]:checked').value;
      if (dry !== 'ref') {
        const pick = D.whd.find((r) => r.cfm >= cfm);
        return render({
          label: 'Desiccant dryer flow required', value: f1(cfm, 0), unit: 'CFM',
          rows: [['Dew point', dry === 'A' ? '−20 °C PDP, activated alumina' : '−40 °C PDP, molecular sieve'], ['Rated at', '38 °C inlet, 7 bar g']].concat(fromHp ? [['Flow estimated from', `${f1(hp)} HP × 4 CFM`]] : []),
          model: pick ? `${pick.model} ${dry}` : '', modelNote: pick ? `${f1(pick.cfm, 0)} CFM rated` : '', url: D.whd_url, anchor: pick ? pick.model : '',
          warn: pick ? '' : `Above the largest standard WHD (${f1(D.whd[D.whd.length - 1].cfm, 0)} CFM). Our engineers will propose a solution.`
        });
      }
      const fac = ['inlet', 'ambient', 'pressure', 'dew'].map((n) => parseFloat(form.elements[n].value));
      const k = fac.reduce((a, b) => a * b, 1);
      const nominal = cfm / k;
      const pick = D.wrd.find((r) => r.cfm >= nominal);
      return render({
        label: 'Dryer nominal capacity needed', value: f1(nominal, 0), unit: 'CFM',
        rows: [['Compressor flow', `${f1(cfm, 0)} CFM${fromHp ? ` (from ${f1(hp)} HP)` : ''}`], ['C1 × C2 × C3 × C4', `${fac.map((x) => x.toFixed(2)).join(' × ')} = ${k.toFixed(3)}`]],
        model: pick ? pick.model : '', modelNote: pick ? `${f1(pick.cfm, 0)} CFM rated at standard conditions` : '', url: D.wrd_url,
        warn: pick ? '' : `Above the largest standard WRD (${f1(D.wrd[D.wrd.length - 1].cfm, 0)} CFM). Our engineers will propose a larger or multiple-dryer solution.`
      });
    }
    if (kind === 'chiller') {
      const lpm = num('lpm'), dt = num('dt'), kw = num('kw');
      let tr;
      if (kw > 0) tr = kw / 3.517;
      else if (lpm > 0 && dt > 0) tr = (lpm * dt) / 50.4;
      else return empty();
      const fo = parseFloat(form.elements.out.value), fa = parseFloat(form.elements.amb.value);
      const nominal = tr / (fo * fa);
      const pick = D.wcp.find((r) => r.tr >= nominal);
      const flowWarn = pick && lpm > 0 && !(kw > 0) && lpm > pick.lpm ? ` Your flow (${f1(lpm, 0)} LPM) is above this model's rated ${pick.lpm} LPM; our engineers will check the pump and evaporator.` : '';
      return render({
        label: 'Heat load', value: f1(tr, 2), unit: 'TR',
        rows: [['Heat load in kW', f1(tr * 3.517, 1)], ['Outlet × ambient factor', `${fo} × ${fa}`], ['Nominal capacity needed', `${f1(nominal, 2)} TR`]],
        model: pick ? pick.model : '', modelNote: pick ? `${pick.tr} TR at 15 °C outlet, 40 °C ambient` : '', url: D.url,
        warn: (pick ? '' : 'Above the largest standard WCP (20 TR). Our engineers will propose a larger or multiple-unit solution.') + flowWarn
      });
    }
    // cooling tower
    const flow = num('flow'), tin = num('tin'), tout = num('tout'), wb = num('wb');
    if (!(flow > 0) || !Number.isFinite(tin) || !Number.isFinite(tout)) return empty();
    const range = tin - tout;
    if (!(range > 0)) return empty('The hot water temperature must be above the cold water temperature.');
    const tr = (flow * range * 1000) / 3024;
    const shape = form.querySelector('input[name="shape"]:checked').value;
    const list = D[shape];
    const pick = list.find((r) => r.tr >= tr && r.m3hr >= flow);
    const fill = tin <= 55 ? 'L (low-temperature fills)' : tin <= 85 ? 'H (high-temperature fills)' : 'P (polypropylene rings)';
    const code = tin <= 55 ? 'L' : tin <= 85 ? 'H' : 'P';
    const evap = 0.00085 * 1.8 * flow * range;
    const approach = Number.isFinite(wb) ? tout - wb : NaN;
    const model = pick ? pick.model.replace(/\s[RS]L$/, ` ${shape === 'round' ? 'R' : 'S'}${code}`) : '';
    return render({
      label: 'Heat load', value: f1(tr, 1), unit: 'TR',
      rows: [['Range', `${f1(range)} °C`], ['Approach to wet bulb', Number.isFinite(approach) ? `${f1(approach)} °C` : '–'], ['Fill type', fill], ['Evaporation loss', `${f1(evap, 2)} m³/hr`]],
      model, anchor: pick ? pick.model : '', modelNote: pick ? `${pick.tr} TR, ${pick.m3hr} m³/hr rated` : '', url: D[`${shape}_url`],
      warn: (Number.isFinite(approach) && approach < 4 ? 'Your cold water target is closer than 4 °C to the wet bulb. WCT towers are rated at wet bulb + 4 °C, so ask our engineers for a special selection. ' : '') +
        (pick ? '' : 'Above the largest standard WCT (300 TR, 180 m³/hr). Our engineers will propose a multi-cell solution.')
    });
  };
  form.addEventListener('input', calc);
  form.addEventListener('change', calc);
  calc();
})();
