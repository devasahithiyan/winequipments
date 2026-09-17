/**
 * Win Equipments - Engineering Thermodynamic Sizing Engines
 * Validated against ISO 8573-1, ASHRAE, and CTI standards.
 */

const WinCalculators = {
  /**
   * 1. Compressed Air Dryer CFM Sizing Engine
   */
  calculateDryerCFM: function(nominalCFM, pressureBar, inletTempC, ambientTempC) {
    if (nominalCFM <= 0 || isNaN(nominalCFM)) {
      return {
        isValid: false,
        error: "Nominal CFM must be greater than 0",
        nominalCFM: 0,
        totalCorrectionFactor: "0.00",
        requiredDryerCFM: 0,
        recommendedModel: "WED-20",
        modelRatingCFM: 20,
        estimatedPower: "0.25 kW"
      };
    }

    // Pressure Correction Factor (Cp) - 7 bar g base = 1.00
    const pressureTable = [
      { p: 4, f: 0.77 }, { p: 5, f: 0.86 }, { p: 6, f: 0.93 },
      { p: 7, f: 1.00 }, { p: 8, f: 1.06 }, { p: 10, f: 1.15 },
      { p: 12, f: 1.23 }, { p: 14, f: 1.30 }, { p: 16, f: 1.35 }
    ];
    let cp = 1.00;
    const p = Math.max(1, pressureBar);
    for (let i = 0; i < pressureTable.length - 1; i++) {
      if (p >= pressureTable[i].p && p <= pressureTable[i+1].p) {
        const ratio = (p - pressureTable[i].p) / (pressureTable[i+1].p - pressureTable[i].p);
        cp = pressureTable[i].f + ratio * (pressureTable[i+1].f - pressureTable[i].f);
        break;
      }
    }
    if (p > 16) cp = 1.38;
    if (p < 4) cp = 0.70;

    // Inlet Temp Correction Factor (Ct) - 38-40°C base = 1.00
    let ct = 1.00;
    if (inletTempC <= 30) ct = 1.20;
    else if (inletTempC <= 35) ct = 1.10;
    else if (inletTempC <= 40) ct = 1.00;
    else if (inletTempC <= 45) ct = 0.85;
    else if (inletTempC <= 50) ct = 0.72;
    else ct = 0.60;

    // Ambient Temp Correction Factor (Ca) - 35°C base = 1.00
    let ca = 1.00;
    if (ambientTempC <= 25) ca = 1.12;
    else if (ambientTempC <= 30) ca = 1.06;
    else if (ambientTempC <= 35) ca = 1.00;
    else if (ambientTempC <= 40) ca = 0.90;
    else ca = 0.80;

    const totalFactor = cp * ct * ca;
    const requiredDryerCFM = Math.round(nominalCFM / totalFactor);

    // Standard Win Equipments Models
    const models = [
      { model: 'WED-20', cfm: 20, power: '0.25 kW' },
      { model: 'WED-30', cfm: 30, power: '0.35 kW' },
      { model: 'WED-50', cfm: 50, power: '0.45 kW' },
      { model: 'WED-75', cfm: 75, power: '0.65 kW' },
      { model: 'WED-100', cfm: 100, power: '0.85 kW' },
      { model: 'WED-150', cfm: 150, power: '1.20 kW' },
      { model: 'WED-200', cfm: 200, power: '1.50 kW' },
      { model: 'WED-300', cfm: 300, power: '2.10 kW' },
      { model: 'WED-500', cfm: 500, power: '3.60 kW' },
      { model: 'WED-750', cfm: 750, power: '5.20 kW' },
      { model: 'WED-1000', cfm: 1000, power: '6.80 kW' },
      { model: 'WED-1500', cfm: 1500, power: '10.5 kW' },
      { model: 'WED-2000', cfm: 2000, power: '14.0 kW' }
    ];

    let recommended = models[models.length - 1];
    for (const m of models) {
      if (m.cfm >= requiredDryerCFM) {
        recommended = m;
        break;
      }
    }

    return {
      isValid: true,
      nominalCFM: nominalCFM,
      totalCorrectionFactor: totalFactor.toFixed(2),
      requiredDryerCFM: requiredDryerCFM,
      recommendedModel: recommended.model,
      modelRatingCFM: recommended.cfm,
      estimatedPower: recommended.power
    };
  },

  /**
   * 2. FRP Cooling Tower Sizing & Approach Engine
   */
  calculateCoolingTower: function(flowM3Hr, hotWaterInC, coldWaterOutC, wetBulbC) {
    const range = hotWaterInC - coldWaterOutC;
    const approach = coldWaterOutC - wetBulbC;

    // Thermodynamic validity checks
    if (coldWaterOutC <= wetBulbC) {
      return {
        isValid: false,
        error: "Cold water temperature cannot be less than or equal to ambient wet-bulb temperature.",
        rangeC: range.toFixed(1),
        approachC: "Invalid (Approach \u2264 0\u00B0C)",
        heatRejectionKcal: "0",
        recommendedTR: "N/A",
        evaporationLoss: "0.00",
        driftLoss: "0.000"
      };
    }

    if (hotWaterInC <= coldWaterOutC) {
      return {
        isValid: false,
        error: "Hot water inlet temperature must be greater than cold water outlet temperature.",
        rangeC: "Invalid (Range \u2264 0\u00B0C)",
        approachC: approach.toFixed(1),
        heatRejectionKcal: "0",
        recommendedTR: "N/A",
        evaporationLoss: "0.00",
        driftLoss: "0.000"
      };
    }
    
    // Heat Rejection (kcal/hr) = Flow (m³/hr) * 1000 kg/m³ * 1 kcal/kg°C * Range (°C)
    const heatKcalHr = flowM3Hr * 1000 * range;
    // Standard Commercial Cooling Tower Ton (3,900 kcal/hr nominal with compressor heat)
    const coolingTR = Math.round(heatKcalHr / 3900);

    // Evaporation Loss: approx 0.00085 * Flow * Range * 1.8 (m³/hr)
    const evapLossM3Hr = (0.00085 * flowM3Hr * range * 1.8).toFixed(2);
    // Drift Loss with high-efficiency drift eliminators (< 0.005%)
    const driftLossM3Hr = (flowM3Hr * 0.00005).toFixed(3);

    return {
      isValid: true,
      rangeC: range.toFixed(1),
      approachC: approach.toFixed(1),
      heatRejectionKcal: heatKcalHr.toLocaleString(),
      recommendedTR: Math.max(coolingTR, 5),
      evaporationLoss: evapLossM3Hr,
      driftLoss: driftLossM3Hr
    };
  },

  /**
   * 3. Industrial Process Chiller Tonnage Engine
   */
  calculateChillerTR: function(flowLPM, inletTempC, targetOutletTempC) {
    const deltaT = inletTempC - targetOutletTempC;

    if (inletTempC <= targetOutletTempC) {
      return {
        isValid: false,
        error: "Process return water temperature must be greater than target chilled outlet temperature.",
        deltaT: "Invalid (\u0394T \u2264 0\u00B0C)",
        requiredTR: "N/A",
        capacityKW: "N/A"
      };
    }

    if (flowLPM <= 0 || isNaN(flowLPM)) {
      return {
        isValid: false,
        error: "Water flow rate must be greater than 0 LPM.",
        deltaT: deltaT.toFixed(1),
        requiredTR: "N/A",
        capacityKW: "N/A"
      };
    }

    // Formula: TR = (LPM * DeltaT * 4.186 kJ/kg°C) / 211 kJ/min per TR
    // Adding 15% safety factor for ambient conditions & heat gain in piping
    const rawTR = (flowLPM * deltaT * 4.186) / 211;
    const designTR = (rawTR * 1.15).toFixed(1);
    const capacityKW = (designTR * 3.517).toFixed(1);

    return {
      isValid: true,
      deltaT: deltaT.toFixed(1),
      requiredTR: designTR,
      capacityKW: capacityKW
    };
  },

  /**
   * 4. Compressed Air Energy & Drain Loss Calculator Engine
   */
  calculateDrainSavings: function(compressorCFM, operatingHoursYear, electricityTariff, numDrains) {
    const cfmLossPerTimerDrain = 4.0;
    const totalCFMLost = cfmLossPerTimerDrain * numDrains;
    const kwLoss = totalCFMLost * 0.18;
    const annualKWhLost = Math.round(kwLoss * operatingHoursYear);
    const annualCostINR = Math.round(annualKWhLost * electricityTariff);
    const co2Kg = Math.round(annualKWhLost * 0.82);

    return {
      isValid: true,
      totalCFMLost: totalCFMLost.toFixed(1),
      annualKWhLost: annualKWhLost.toLocaleString(),
      annualCostINR: annualCostINR.toLocaleString(),
      co2Kg: co2Kg.toLocaleString(),
      paybackMonths: Math.max(1, Math.round((numDrains * 6500 / (annualCostINR / 12 || 1)) * 10) / 10)
    };
  },

  /**
   * 5. Generate Branded Equipment Sizing Proposal (Print / PDF)
   */
  generateProposalWindow: function(proposalTitle, equipmentDetails, inputParams) {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Please allow popups to generate your official engineering proposal sheet.');
      return;
    }
    
    const today = new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });
    const proposalRef = 'WE-PROP-' + Math.floor(100000 + Math.random() * 900000);

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${proposalTitle} - Win Equipments</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; padding: 40px; color: #0F172A; line-height: 1.5; font-size: 14px; }
    .header { border-bottom: 2px solid #0E7490; padding-bottom: 20px; display: flex; justify-content: space-between; align-items: flex-start; }
    .brand-title { font-size: 24px; font-weight: 800; color: #0E2540; letter-spacing: -0.02em; }
    .brand-tagline { font-size: 11px; font-weight: 700; color: #008253; text-transform: uppercase; letter-spacing: 0.08em; margin-top: 3px; }
    .company-nap { font-size: 11px; color: #64748B; text-align: right; line-height: 1.4; }
    .doc-meta { display: flex; justify-content: space-between; margin: 25px 0; padding: 12px 16px; background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 6px; font-size: 13px; }
    .section-title { font-size: 15px; font-weight: 700; color: #0E2540; border-bottom: 1px solid #E2E8F0; padding-bottom: 6px; margin: 25px 0 15px; text-transform: uppercase; letter-spacing: 0.04em; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
    th, td { padding: 10px 14px; border: 1px solid #CBD5E1; text-align: left; }
    th { background: #F1F5F9; font-weight: 600; width: 40%; color: #334155; }
    td { font-weight: 500; }
    .highlight-row { background: #ECFEFF; }
    .highlight-row td { color: #0E7490; font-weight: 700; font-size: 16px; }
    .footer { margin-top: 40px; border-top: 1px solid #E2E8F0; padding-top: 20px; font-size: 11px; color: #64748B; display: flex; justify-content: space-between; }
    .action-btn { background: #0E7490; color: #fff; border: none; padding: 10px 20px; font-size: 14px; font-weight: 600; border-radius: 6px; cursor: pointer; margin-bottom: 20px; }
    @media print { .action-btn { display: none; } body { padding: 0; } }
  </style>
</head>
<body>
  <button class="action-btn" onclick="window.print()">Print / Save as PDF</button>

  <div class="header">
    <div>
      <div class="brand-title">WIN EQUIPMENTS</div>
      <div class="brand-tagline">Save Water and Power • ISO 9001:2015 Certified Works</div>
    </div>
    <div class="company-nap">
      <strong>Registered Plant Works:</strong><br>
      SF No: 4, 195 B, Kallangadu, Arasur Post<br>
      Coimbatore – 641407, Tamil Nadu, India<br>
      Phone: +91 95972 28969 / +91 95972 28975<br>
      Web: https://winequipments.com • Email: marketing@winequipments.com
    </div>
  </div>

  <div class="doc-meta">
    <div><strong>Proposal Ref:</strong> ${proposalRef}</div>
    <div><strong>Equipment Group:</strong> ${proposalTitle}</div>
    <div><strong>Date Generated:</strong> ${today}</div>
  </div>

  <div class="section-title">1. Customer Operating Parameters Entered</div>
  <table>
    ${inputParams.map(p => `<tr><th>${p.label}</th><td>${p.value}</td></tr>`).join('')}
  </table>

  <div class="section-title">2. Thermodynamic Sizing & Selection Analysis</div>
  <table>
    ${equipmentDetails.map(d => `<tr class="${d.isHighlight ? 'highlight-row' : ''}"><th>${d.label}</th><td>${d.value}</td></tr>`).join('')}
  </table>

  <div class="section-title">3. Standard Manufacturer Guarantee & Next Steps</div>
  <p style="font-size: 12px; color: #475569; line-height: 1.6;">
    This technical sizing document is generated based on standard thermodynamic formulas (ISO 8573-1 / CTI / ASHRAE). Win Equipments provides a <strong>12-Month Comprehensive On-Site Warranty</strong> with emergency 24/7 service support across Coimbatore, Tiruppur, Hosur, Chennai, and Bengaluru. For formal commercial quotation, customized voltage options (e.g. 380V/60Hz export), or CAD dimensional fitment drawings, contact our engineering office at <strong>+91 95972 28969</strong> or email <strong>marketing@winequipments.com</strong>.
  </p>

  <div class="footer">
    <div>Certified under ISO 9001:2015 (IAF & DAC Accredited) • GSTIN: 33AJWPA2797B1Z7</div>
    <div>Page 1 of 1 • Win Equipments Arasur Works</div>
  </div>
</body>
</html>
    `;

    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
  }
};

// Universal Export
if (typeof window !== 'undefined') {
  window.WinCalculators = WinCalculators;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = WinCalculators;
}
