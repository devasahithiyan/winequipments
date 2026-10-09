/* Catalogue sizing rules. Pure functions shared by the UI and boundary tests. */
const positive = n => Number.isFinite(n) && n > 0;
const close = (a, b) => Math.abs(a - b) < 1e-7;
const factor = (table, value) => table?.find(point => close(point[0], value))?.[1];
const fmt = (n, places = 2) => Number(n.toFixed(places)).toLocaleString('en-IN');
const entry = (label, value, unit = '') => [label, `${value}${unit ? ' ' + unit : ''}`];
export function calculate(kind, v, D) {
  const invalid = message => ({state: 'invalid', message});
  const empty = message => ({state: 'empty', message});
  const finish = result => {
    if (!positive(result.value) || result.rows.some(([, value]) => /Infinity|NaN/.test(value))) return invalid('These figures are too large. Check the units and enter your actual duty.');
    return {...result, state: result.model ? 'match' : 'review'};
  };
  if (kind === 'dryer') {
    if (!['cfm', 'hp'].includes(v.flowMode)) return invalid('Choose actual compressor CFM or an HP estimate.');
    const fromHp = v.flowMode === 'hp';
    if ((fromHp ? v.hp : v.cfm) === null) return empty('Enter the compressor capacity to calculate the required dryer size.');
    if (!positive(fromHp ? v.hp : v.cfm)) return invalid(`Enter a ${fromHp ? 'compressor HP' : 'CFM flow'} greater than zero.`);
    const cfm = fromHp ? v.hp * 4 : v.cfm;
    if (!['ref', 'A', 'M'].includes(v.dry)) return invalid('Choose the required pressure dew point.');
    const inputs = [entry('Compressor flow', fmt(cfm), 'CFM'), ...(fromHp ? [entry('Compressor power', fmt(v.hp), 'HP; estimated at 4 CFM/HP')] : [])];
    if (v.dry !== 'ref') {
      if (!Number.isFinite(v.desInlet) || !positive(v.desPressure)) return invalid('Enter the desiccant dryer inlet temperature and a pressure greater than zero.');
      const rated = close(v.desInlet, 38) && close(v.desPressure, 7);
      const pick = rated && !fromHp ? D.whd.find(r => r.cfm >= cfm) : null;
      return finish({product: 'desiccant-air-dryers', value: cfm, unit: 'CFM', label: 'Desiccant dryer flow required', model: pick ? `${pick.model} ${v.dry}` : '', anchor: pick?.model, url: D.whd_url,
        modelNote: pick ? `${pick.cfm} CFM at 38 °C inlet, 7 bar g` : '',
        inputs: [...inputs, entry('Pressure dew point', v.dry === 'A' ? '−20 °C, activated alumina' : '−40 °C, molecular sieve'), entry('Inlet temperature', v.desInlet, '°C'), entry('Inlet pressure', v.desPressure, 'bar g')],
        rows: [entry('Rating basis', '38 °C inlet, 7 bar g')],
        message: fromHp ? 'HP gives an approximate flow. Send the nameplate FAD so an engineer can confirm a dryer.' : !rated ? 'These conditions differ from the WHD rating basis. An engineer must check the capacity and dew point.' : !pick ? 'This flow exceeds the listed WHD models. Ask for a larger or multiple-unit selection.' : 'Preliminary catalogue match. An engineer will confirm the duty and purge-air allowance.'});
    }
    const keys = ['inlet', 'ambient', 'pressure', 'dew'];
    const factors = keys.map((key, index) => factor(D.factors[index], v[key]));
    if (!factors.every(positive)) return invalid('Choose inlet, ambient, pressure and dew-point values from the listed catalogue conditions.');
    const k = factors.reduce((a, b) => a * b, 1), nominal = cfm / k;
    const pick = !fromHp ? D.wrd.find(r => r.cfm + 1e-7 >= nominal) : null;
    return finish({product: 'refrigerated-air-dryers', value: nominal, unit: 'CFM', label: 'Nominal dryer capacity needed', model: pick?.model || '', url: D.wrd_url,
      modelNote: pick ? `${pick.cfm} CFM rated at standard conditions` : '',
      inputs: [...inputs, entry('Inlet temperature', v.inlet, '°C'), entry('Ambient temperature', v.ambient, '°C'), entry('Inlet pressure', v.pressure, 'bar g'), entry('Pressure dew point', v.dew, '°C PDP')],
      rows: [entry('Actual compressor flow', fmt(cfm), 'CFM'), entry('Combined catalogue factor', k.toFixed(3))],
      message: fromHp ? 'HP gives an approximate flow. Confirm the nameplate FAD before selecting a model.' : !pick ? 'The required capacity exceeds the listed WRD models. Ask for a larger or multiple-unit selection.' : 'Preliminary catalogue match using the listed correction factors. An engineer will confirm the selection.'});
  }
  if (kind === 'chiller') {
    if (!['water', 'kw'].includes(v.loadMode)) return invalid('Choose water flow or a known heat load.');
    const known = v.loadMode === 'kw';
    if ((known ? v.kw : v.lpm) === null) return empty(`Enter ${known ? 'the heat load in kW' : 'the process water flow'} to calculate the duty.`);
    if (!positive(known ? v.kw : v.lpm) || (!known && !positive(v.dt))) return invalid('Enter a positive heat load, or water flow and temperature rise greater than zero.');
    const fo = factor(D.factors[0], v.out), fa = factor(D.factors[1], v.amb);
    if (!positive(fo) || !positive(fa)) return invalid('Choose outlet and ambient temperatures from the listed catalogue conditions.');
    const tr = known ? v.kw / 3.517 : v.lpm * v.dt / 50.4, nominal = tr / (fo * fa);
    const pick = D.wcp.find(r => r.tr + 1e-7 >= nominal);
    const flowReview = !known && pick && v.lpm > pick.lpm;
    return finish({product: 'industrial-process-chillers', value: tr, unit: 'TR', label: 'Calculated heat load', model: flowReview ? '' : pick?.model || '', url: D.url,
      modelNote: pick ? `${pick.tr} TR at 15 °C outlet, 40 °C ambient` : '',
      inputs: [...(known ? [entry('Known heat load', fmt(v.kw), 'kW')] : [entry('Process water flow', fmt(v.lpm), 'LPM'), entry('Process temperature rise', fmt(v.dt), '°C')]), entry('Water outlet temperature', v.out, '°C'), entry('Ambient temperature', v.amb, '°C')],
      rows: [entry('Heat load', fmt(tr * 3.517), 'kW'), entry('Outlet × ambient factor', `${fo} × ${fa}`), entry('Nominal capacity needed', fmt(nominal), 'TR')],
      message: flowReview ? `Your flow exceeds the ${pick.lpm} LPM rating of the heat-load candidate. An engineer must check the pump and evaporator before selecting a model.` : !pick ? 'The required capacity exceeds the listed WCP models. Ask for a larger or multiple-unit selection.' : 'Preliminary catalogue match for water. An engineer will confirm fluid, pressure, flow and duty.'});
  }
  if (kind === 'tower') {
    if (v.flow === null) return empty('Enter the circulating water flow and site temperatures.');
    if (!positive(v.flow) || ![v.tin, v.tout, v.wb].every(Number.isFinite)) return invalid('Enter a positive water flow and all three temperatures.');
    if (v.tin <= v.tout) return invalid('Hot water must be warmer than the required cold water.');
    if (v.tout <= v.wb) return invalid('Required cold water must be warmer than the site wet bulb. Increase the target or ask an engineer about another cooling method.');
    if (v.tout <= 0 || v.tin >= 100) return invalid('This water calculation requires cold water above 0 °C and hot water below 100 °C. Ask an engineer for other fluids or conditions.');
    if (!['round', 'square'].includes(v.shape)) return invalid('Choose a round or square tower.');
    const range = v.tin - v.tout, approach = v.tout - v.wb;
    const tr = v.flow * range * 1000 / 3024;
    const supported = close(range, 5) && approach >= 4 && v.tin <= 55;
    const pick = supported ? D[v.shape].find(r => r.tr + 1e-7 >= tr && r.m3hr >= v.flow) : null;
    return finish({product: `${v.shape}-cooling-towers`, value: tr, unit: 'TR', label: 'Calculated heat load', model: pick?.model || '', url: D[`${v.shape}_url`],
      modelNote: pick ? `${pick.tr} TR, ${pick.m3hr} m³/hr rated; L fills` : '',
      inputs: [entry('Water flow', fmt(v.flow), 'm³/hr'), entry('Hot water', v.tin, '°C'), entry('Required cold water', v.tout, '°C'), entry('Site wet bulb', v.wb, '°C'), entry('Tower shape', v.shape)],
      rows: [entry('Cooling range', fmt(range), '°C'), entry('Approach to wet bulb', fmt(approach), '°C'), entry('Estimated evaporation', fmt(.00085 * 1.8 * v.flow * range), 'm³/hr')],
      message: !supported ? 'Heat-load estimate only. Catalogue flow matching here requires a 5 °C range, at least 4 °C approach and L-fill temperatures up to 55 °C. Your duty needs an engineering selection; no correction factor has been assumed.' : !pick ? 'This duty exceeds the listed WCT models. Ask for a larger or multi-cell selection.' : 'Preliminary catalogue match at a 5 °C range and at least 4 °C approach. An engineer will confirm site conditions and water quality.'});
  }
  return invalid('Choose a supported sizing tool.');
}
