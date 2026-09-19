/**
 * Win Equipments - Core Client Logic
 * Handles Zero-CLS Mobile Navigation, Subtle Page Transitions, Scroll Micro-animations,
 * Dynamic Calculators with Strict Thermodynamic Validation, and Unified RFQ Lead Processing.
 */

document.addEventListener('DOMContentLoaded', () => {
  initPageTransitions();
  initScrollAnimations();
  initMobileNav();
  initMobileConversionDock();
  initFormAccessibility();
  initCalculatorBindings();
  initLeadForms();
  initWhatsAppTracking();
  initServiceWorker();
  initEquipmentFinder();
  initProductCategoryFilter();
  initMachineHotspots();
  initHomepageMiniCalculator();
});

/* 1. Subtle Page Transitions */
function initPageTransitions() {
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (!link) return;

    const href = link.getAttribute('href');
    if (!href) return;

    // Skip special, external, and downloadable targets
    if (
      href.startsWith('#') ||
      href.startsWith('tel:') ||
      href.startsWith('mailto:') ||
      href.startsWith('javascript:') ||
      link.getAttribute('target') === '_blank' ||
      link.hasAttribute('download') ||
      href.endsWith('.pdf') ||
      href.endsWith('.jpg') ||
      href.endsWith('.png') ||
      e.ctrlKey || e.metaKey || e.shiftKey
    ) {
      return;
    }

    try {
      const targetUrl = new URL(link.href, window.location.href);
      const isSameOrigin = (targetUrl.origin === window.location.origin) ||
                           (window.location.protocol === 'file:' && targetUrl.protocol === 'file:');
      if (isSameOrigin) {
        if (targetUrl.pathname === window.location.pathname && targetUrl.search === window.location.search && targetUrl.hash) {
          return;
        }
        e.preventDefault();
        document.body.classList.add('page-is-leaving');
        setTimeout(() => {
          window.location.href = link.href;
        }, 150);
      }
    } catch (err) {
      // Fallback to default link navigation
    }
  });

  window.addEventListener('pageshow', (event) => {
    if (event.persisted || document.body.classList.contains('page-is-leaving')) {
      document.body.classList.remove('page-is-leaving');
    }
  });
}

/* 2. Scroll Reveal Micro-animations */
function initScrollAnimations() {
  if (!('IntersectionObserver' in window)) {
    document.querySelectorAll('.reveal-on-scroll').forEach(el => el.classList.add('is-revealed'));
    return;
  }

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        obs.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.08,
    rootMargin: '0px 0px -30px 0px'
  });

  const targets = document.querySelectorAll(
    '.reveal-on-scroll, .section-header-center, .card, .metric-card, .snippet-direct-answer'
  );
  targets.forEach((el) => {
    if (!el.classList.contains('reveal-on-scroll')) {
      el.classList.add('reveal-on-scroll');
    }
    observer.observe(el);
  });
}

/* 3. Universal Mobile Navigation Drawer & Injection */
function injectMobileDrawer() {
  if (document.querySelector('.mobile-nav-drawer')) return;

  const path = window.location.pathname;
  const isSubfolder = path.includes('/products/') || 
                      path.includes('/engineering-tools/') || 
                      path.includes('/industries/') || 
                      path.includes('/locations/') || 
                      path.includes('/blog/') ||
                      path.includes('/ta/');
  const p = isSubfolder ? '../' : './';

  const overlay = document.createElement('div');
  overlay.className = 'mobile-nav-overlay';
  document.body.appendChild(overlay);

  const drawer = document.createElement('div');
  drawer.className = 'mobile-nav-drawer';
  drawer.innerHTML = `
    <div class="mobile-nav-header">
      <a href="${p}index.html" class="brand-logo-group" style="text-decoration: none;">
        <img src="${p}images/logo.png" alt="Win Equipments" style="height: 38px; width: auto;">
        <div class="brand-title-wrap">
          <span class="brand-name" style="font-size: 1.1rem;">WIN EQUIPMENTS</span>
          <span class="brand-tagline" style="font-size: 0.6rem;">Save Water and Power</span>
        </div>
      </a>
      <button class="mobile-nav-close" aria-label="Close Navigation Menu">&times;</button>
    </div>

    <ul class="mobile-nav-links">
      <li><a href="${p}index.html"><i class="fas fa-home" style="margin-right: 0.5rem; color: var(--color-brand-accent);"></i> Home</a></li>
      
      <li>
        <span class="mobile-nav-subhead">Compressed Air Treatment</span>
        <ul class="mobile-nav-nested">
          <li><a href="${p}products/refrigerated-air-dryers.html">Refrigerated Air Dryers (+3°C PDP)</a></li>
          <li><a href="${p}products/desiccant-air-dryers.html">Desiccant Air Dryers (-40°C PDP)</a></li>
          <li><a href="${p}products/compressed-air-filters.html">Sub-Micron Coalescing Filters</a></li>
          <li><a href="${p}products/automatic-drain-valves.html">Zero Air Loss Drain Valves</a></li>
          <li><a href="${p}products/air-receiver-tanks.html">Air Receiver Tanks (IS 2825)</a></li>
          <li><a href="${p}products/industrial-aftercoolers.html">Compressor Discharge Aftercoolers</a></li>
        </ul>
      </li>

      <li>
        <span class="mobile-nav-subhead">Process Cooling & Towers</span>
        <ul class="mobile-nav-nested">
          <li><a href="${p}products/industrial-process-chillers.html">Industrial Process Chillers (1–150 TR)</a></li>
          <li><a href="${p}products/round-cooling-towers.html">Round Bottle FRP Towers (10–1500 TR)</a></li>
          <li><a href="${p}products/square-cooling-towers.html">Square Crossflow Cooling Towers</a></li>
          <li><a href="${p}products/closed-circuit-cooling-towers.html">Closed Circuit Coil Towers</a></li>
          <li><a href="${p}products/spare-parts-consumables.html">Spares & Consumables Hub</a></li>
        </ul>
      </li>

      <li>
        <span class="mobile-nav-subhead">Engineering Tools & Calculators</span>
        <ul class="mobile-nav-nested">
          <li><a href="${p}engineering-tools/air-dryer-sizing.html"><i class="fas fa-calculator" style="margin-right: 0.35rem;"></i> Air Dryer CFM Calculator</a></li>
          <li><a href="${p}engineering-tools/cooling-tower-calculator.html"><i class="fas fa-calculator" style="margin-right: 0.35rem;"></i> Cooling Tower TR Calculator</a></li>
          <li><a href="${p}engineering-tools/chiller-tonnage-calculator.html"><i class="fas fa-calculator" style="margin-right: 0.35rem;"></i> Chiller Heat Load Calculator</a></li>
          <li><a href="${p}engineering-tools/compressed-air-energy-calculator.html"><i class="fas fa-bolt" style="margin-right: 0.35rem;"></i> Drain Energy Loss Calculator</a></li>
        </ul>
      </li>

      <li><a href="${p}case-studies.html"><i class="fas fa-chart-line" style="margin-right: 0.5rem; color: var(--color-brand-accent);"></i> Industrial Case Studies & ROI</a></li>
      <li><a href="${p}certifications.html"><i class="fas fa-certificate" style="margin-right: 0.5rem; color: var(--color-brand-accent);"></i> ISO 9001:2015 Certifications</a></li>
      <li><a href="${p}installation.html"><i class="fas fa-tools" style="margin-right: 0.5rem; color: var(--color-brand-accent);"></i> Installation & Commissioning</a></li>
      <li><a href="${p}about.html"><i class="fas fa-info-circle" style="margin-right: 0.5rem; color: var(--color-brand-accent);"></i> About Win Equipments</a></li>
      <li><a href="${p}blog.html"><i class="fas fa-book" style="margin-right: 0.5rem; color: var(--color-brand-accent);"></i> Technical Blog & Guides</a></li>
      <li><a href="${p}contactus.html"><i class="fas fa-envelope" style="margin-right: 0.5rem; color: var(--color-brand-accent);"></i> Contact & Factory Works</a></li>
    </ul>

    <div class="mobile-nav-actions">
      <a href="tel:+919597228969" class="btn btn-primary btn-sm" style="width: 100%;">
        <i class="fas fa-phone-alt"></i> Call Plant (+91 95972 28969)
      </a>
      <a href="https://wa.me/919597228969?text=Hello%20Win%20Equipments%2C%20I%20have%20an%20inquiry%20regarding%20industrial%20cooling%20equipment." class="btn btn-accent btn-sm" target="_blank" rel="noopener" style="width: 100%;">
        <i class="fab fa-whatsapp"></i> Chat on WhatsApp
      </a>
      <a href="${p}catlogue/E_Catalogue.pdf" class="btn btn-outline btn-sm" target="_blank" rel="noopener" style="width: 100%;">
        <i class="fas fa-file-pdf"></i> Download E-Catalogue
      </a>
    </div>
  `;
  document.body.appendChild(drawer);
}

function initMobileNav() {
  injectMobileDrawer();

  const toggleBtns = document.querySelectorAll('.mobile-toggle-btn');
  const drawer = document.querySelector('.mobile-nav-drawer');
  const overlay = document.querySelector('.mobile-nav-overlay');
  const closeBtn = drawer ? drawer.querySelector('.mobile-nav-close') : null;

  const openDrawer = () => {
    if (drawer) drawer.classList.add('is-open');
    if (overlay) overlay.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  };

  const closeDrawer = () => {
    if (drawer) drawer.classList.remove('is-open');
    if (overlay) overlay.classList.remove('is-open');
    document.body.style.overflow = '';
  };

  toggleBtns.forEach(btn => btn.addEventListener('click', openDrawer));
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  if (overlay) overlay.addEventListener('click', closeDrawer);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeDrawer();
  });

  if (drawer) {
    drawer.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeDrawer);
    });
  }
}

/* 4. Universal Mobile Conversion Dock */
function initMobileConversionDock() {
  if (document.querySelector('.mobile-conversion-dock')) return;

  const path = window.location.pathname;
  const isSubfolder =
    path.includes('/products/') ||
    path.includes('/engineering-tools/') ||
    path.includes('/industries/') ||
    path.includes('/locations/') ||
    path.includes('/blog/') ||
    path.includes('/ta/');
  const p = isSubfolder ? '../' : './';
  const rfqLink = `${p}contactus.html#rfq`;

  const dock = document.createElement('aside');
  dock.className = 'mobile-conversion-dock';
  dock.setAttribute('aria-label', 'Quick Mobile Actions');
  dock.innerHTML = `
    <div class="dock-actions">
      <a href="tel:+919597228969" class="dock-btn dock-call" aria-label="Call Win Equipments Plant">
        <i class="fas fa-phone-alt"></i> Call Plant
      </a>
      <a href="https://wa.me/919597228969?text=Hi%20Win%20Equipments%2C%20I%20am%20inquiring%20about%20industrial%20equipment%20specifications%20and%20pricing." class="dock-btn dock-whatsapp" target="_blank" rel="noopener" aria-label="WhatsApp Technical Support">
        <i class="fab fa-whatsapp"></i> WhatsApp
      </a>
      <a href="${rfqLink}" class="dock-btn dock-rfq" aria-label="Request Technical RFQ">
        <i class="fas fa-file-invoice"></i> Get RFQ
      </a>
    </div>
  `;
  document.body.appendChild(dock);
}

/* 5. Form Accessibility & Autofill Enhancement */
function initFormAccessibility() {
  document.querySelectorAll('form').forEach(form => {
    form.querySelectorAll('input, select, textarea').forEach(field => {
      const name = (field.name || '').toLowerCase();
      const type = (field.type || '').toLowerCase();
      
      if (!field.hasAttribute('autocomplete')) {
        if (name.includes('name') && !name.includes('company')) {
          field.setAttribute('autocomplete', 'name');
        } else if (name.includes('company') || name.includes('org')) {
          field.setAttribute('autocomplete', 'organization');
        } else if (type === 'tel' || name.includes('phone') || name.includes('mobile')) {
          field.setAttribute('autocomplete', 'tel');
        } else if (type === 'email' || name.includes('email') || name.includes('mail')) {
          field.setAttribute('autocomplete', 'email');
        }
      }
    });
  });
}

/* 6. Interactive Calculator Bindings */
function initCalculatorBindings() {
  // A. Dryer Sizing
  const dryerNominal = document.getElementById('calc-dryer-nominal');
  const dryerPressure = document.getElementById('calc-dryer-pressure');
  const dryerInlet = document.getElementById('calc-dryer-inlet');
  const dryerAmbient = document.getElementById('calc-dryer-ambient');

  if (dryerNominal && window.WinCalculators) {
    const updateDryer = () => {
      const res = WinCalculators.calculateDryerCFM(
        parseFloat(dryerNominal.value) || 100,
        parseFloat(dryerPressure.value) || 7,
        parseFloat(dryerInlet.value) || 45,
        parseFloat(dryerAmbient.value) || 35
      );
      const resModel = document.getElementById('res-dryer-model');
      const resCFM = document.getElementById('res-dryer-cfm');
      const resFactor = document.getElementById('res-dryer-factor');
      if (resModel) resModel.textContent = res.recommendedModel;
      if (resCFM) resCFM.textContent = res.requiredDryerCFM + ' CFM';
      if (resFactor) resFactor.textContent = res.totalCorrectionFactor;

      // Auto-prefill into quote form
      const quoteForm = document.querySelector('#quote-section form');
      if (quoteForm) {
        let paramInput = quoteForm.querySelector('input[name="calculated_selection"]');
        if (!paramInput) {
          paramInput = document.createElement('input');
          paramInput.type = 'hidden';
          paramInput.name = 'calculated_selection';
          quoteForm.appendChild(paramInput);
        }
        paramInput.value = `Model: ${res.recommendedModel}, Required CFM: ${res.requiredDryerCFM}, Factor: ${res.totalCorrectionFactor}`;
      }
    };

    [dryerNominal, dryerPressure, dryerInlet, dryerAmbient].forEach(el => {
      if (el) el.addEventListener('input', updateDryer);
    });
    updateDryer();

    // Wire Dryer Proposal Print
    const printDryerBtn = document.getElementById('btn-print-dryer-proposal');
    if (printDryerBtn) {
      printDryerBtn.addEventListener('click', () => {
        const nominal = parseFloat(dryerNominal.value) || 100;
        const pressure = parseFloat(dryerPressure.value) || 7;
        const inlet = parseFloat(dryerInlet.value) || 45;
        const ambient = parseFloat(dryerAmbient.value) || 35;
        const res = WinCalculators.calculateDryerCFM(nominal, pressure, inlet, ambient);

        WinCalculators.generateProposalWindow(
          'Refrigerated Compressed Air Dryer Selection Proposal',
          [
            { label: 'Recommended Model', value: res.recommendedModel, isHighlight: true },
            { label: 'Nominal Rating Flow Rate', value: res.modelRatingCFM + ' CFM (+3°C PDP)' },
            { label: 'Actual Corrected Requirement', value: res.requiredDryerCFM + ' CFM' },
            { label: 'Combined Derating Correction Factor', value: res.totalCorrectionFactor },
            { label: 'Estimated Electrical Power', value: res.estimatedPower },
            { label: 'Condensate Drain Type', value: 'Zero Air Loss Electronic Capacitive Drain' }
          ],
          [
            { label: 'Compressor Nominal Flow Rate', value: nominal + ' CFM (FAD)' },
            { label: 'Operating Working Pressure', value: pressure.toFixed(1) + ' bar g' },
            { label: 'Inlet Compressed Air Temperature', value: inlet + ' °C' },
            { label: 'Compressor Room Ambient Temperature', value: ambient + ' °C' }
          ]
        );
      });
    }
  }

  // B. Cooling Tower Sizing
  const towerFlow = document.getElementById('calc-tower-flow');
  const towerHot = document.getElementById('calc-tower-hot');
  const towerCold = document.getElementById('calc-tower-cold');
  const towerWB = document.getElementById('calc-tower-wb');

  if (towerFlow && window.WinCalculators) {
    const updateTower = () => {
      const res = WinCalculators.calculateCoolingTower(
        parseFloat(towerFlow.value) || 50,
        parseFloat(towerHot.value) || 37,
        parseFloat(towerCold.value) || 32,
        parseFloat(towerWB.value) || 28
      );
      const resTR = document.getElementById('res-tower-tr');
      const resRange = document.getElementById('res-tower-range');
      const resApproach = document.getElementById('res-tower-approach');
      const resEvap = document.getElementById('res-tower-evap');
      if (resTR) resTR.textContent = res.isValid ? (res.recommendedTR + ' TR') : 'N/A';
      if (resRange) resRange.textContent = res.isValid ? (res.rangeC + ' °C') : res.rangeC;
      if (resApproach) {
        resApproach.textContent = res.isValid ? (res.approachC + ' °C') : res.approachC;
        resApproach.style.color = res.isValid ? '#38BDF8' : '#EF4444';
      }
      if (resEvap) resEvap.textContent = res.evaporationLoss + ' m³/hr';

      // Auto-prefill into quote form
      const quoteForm = document.querySelector('#quote-section form');
      if (quoteForm && res.isValid) {
        let paramInput = quoteForm.querySelector('input[name="calculated_selection"]');
        if (!paramInput) {
          paramInput = document.createElement('input');
          paramInput.type = 'hidden';
          paramInput.name = 'calculated_selection';
          quoteForm.appendChild(paramInput);
        }
        paramInput.value = `Capacity: ${res.recommendedTR} TR, Range: ${res.rangeC}°C, Approach: ${res.approachC}°C, Evap: ${res.evaporationLoss} m3/h`;
      }
    };

    [towerFlow, towerHot, towerCold, towerWB].forEach(el => {
      if (el) el.addEventListener('input', updateTower);
    });
    updateTower();

    // Wire Tower Proposal Print
    const printTowerBtn = document.getElementById('btn-print-tower-proposal');
    if (printTowerBtn) {
      printTowerBtn.addEventListener('click', () => {
        const flow = parseFloat(towerFlow.value) || 50;
        const hot = parseFloat(towerHot.value) || 37;
        const cold = parseFloat(towerCold.value) || 32;
        const wb = parseFloat(towerWB.value) || 28;
        const res = WinCalculators.calculateCoolingTower(flow, hot, cold, wb);

        if (!res.isValid) {
          alert('Please correct invalid thermodynamic temperatures: ' + res.error);
          return;
        }

        WinCalculators.generateProposalWindow(
          'FRP Cooling Tower Thermal Sizing & Proposal',
          [
            { label: 'Recommended Tower Capacity', value: res.recommendedTR + ' TR Nominal', isHighlight: true },
            { label: 'Calculated Cooling Range (Hot In - Cold Out)', value: res.rangeC + ' °C' },
            { label: 'Approach to Ambient Wet Bulb', value: res.approachC + ' °C' },
            { label: 'Total Heat Rejection Load', value: res.heatRejectionKcal + ' kcal/hr' },
            { label: 'Estimated Evaporation Water Loss', value: res.evaporationLoss + ' m³/hr' },
            { label: 'Maximum Drift Loss (< 0.005%)', value: res.driftLoss + ' m³/hr' }
          ],
          [
            { label: 'Water Circulation Flow Rate', value: flow + ' m³/hr' },
            { label: 'Hot Water Inlet Temperature', value: hot + ' °C' },
            { label: 'Cold Water Outlet Target Temperature', value: cold + ' °C' },
            { label: 'Design Ambient Wet Bulb Temperature', value: wb + ' °C' }
          ]
        );
      });
    }
  }

  // C. Chiller Sizing
  const chillerFlow = document.getElementById('calc-chiller-flow');
  const chillerInlet = document.getElementById('calc-chiller-inlet');
  const chillerOutlet = document.getElementById('calc-chiller-outlet');

  if (chillerFlow && window.WinCalculators) {
    const updateChiller = () => {
      const res = WinCalculators.calculateChillerTR(
        parseFloat(chillerFlow.value) || 60,
        parseFloat(chillerInlet.value) || 20,
        parseFloat(chillerOutlet.value) || 12
      );
      const resTR = document.getElementById('res-chiller-tr');
      const resKW = document.getElementById('res-chiller-kw');
      const resDelta = document.getElementById('res-chiller-delta');
      if (resTR) resTR.textContent = res.isValid ? (res.requiredTR + ' TR') : 'N/A';
      if (resKW) resKW.textContent = res.isValid ? (res.capacityKW + ' kW') : 'N/A';
      if (resDelta) {
        resDelta.textContent = res.isValid ? (res.deltaT + ' °C') : res.deltaT;
        resDelta.style.color = res.isValid ? '#FFFFFF' : '#EF4444';
      }

      // Auto-prefill into quote form
      const quoteForm = document.querySelector('#quote-section form');
      if (quoteForm && res.isValid) {
        let paramInput = quoteForm.querySelector('input[name="calculated_selection"]');
        if (!paramInput) {
          paramInput = document.createElement('input');
          paramInput.type = 'hidden';
          paramInput.name = 'calculated_selection';
          quoteForm.appendChild(paramInput);
        }
        paramInput.value = `Chiller Tonnage: ${res.requiredTR} TR (${res.capacityKW} kW), Delta T: ${res.deltaT}°C`;
      }
    };

    [chillerFlow, chillerInlet, chillerOutlet].forEach(el => {
      if (el) el.addEventListener('input', updateChiller);
    });
    updateChiller();

    // Wire Chiller Proposal Print
    const printChillerBtn = document.getElementById('btn-print-chiller-proposal');
    if (printChillerBtn) {
      printChillerBtn.addEventListener('click', () => {
        const flow = parseFloat(chillerFlow.value) || 60;
        const inlet = parseFloat(chillerInlet.value) || 20;
        const outlet = parseFloat(chillerOutlet.value) || 12;
        const res = WinCalculators.calculateChillerTR(flow, inlet, outlet);

        if (!res.isValid) {
          alert('Please correct invalid temperature values: ' + res.error);
          return;
        }

        WinCalculators.generateProposalWindow(
          'Industrial Process Chiller Heat Load & Tonnage Proposal',
          [
            { label: 'Recommended Chiller Design Capacity', value: res.requiredTR + ' TR', isHighlight: true },
            { label: 'Cooling Capacity in Kilowatts', value: res.capacityKW + ' kW' },
            { label: 'Process Temperature Drop (Delta-T)', value: res.deltaT + ' °C' },
            { label: 'Design Safety Factor Applied', value: '15% (Ambient 45°C & line losses)' },
            { label: 'Compressor Type', value: 'Hermetic Scroll (Danfoss / Emerson)' },
            { label: 'Internal Tank Material', value: 'SS 304 Insulated Reservoir' }
          ],
          [
            { label: 'Process Water Flow Rate', value: flow + ' LPM' },
            { label: 'Return Water Inlet Temperature', value: inlet + ' °C' },
            { label: 'Target Chilled Water Outlet Temperature', value: outlet + ' °C' }
          ]
        );
      });
    }
  }
}

/* 3. Unified Lead Form Dispatch Engine */
function initLeadForms() {
  const forms = document.querySelectorAll('form.rfq-form, form.lead-capture-form');

  forms.forEach(form => {
    form.addEventListener('submit', function(e) {
      e.preventDefault();

      // Honeypot spam check
      const hp = form.querySelector('input[name="website_url_hp"]');
      if (hp && hp.value.trim() !== '') {
        console.warn('Bot detected via honeypot.');
        return;
      }

      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn ? submitBtn.innerHTML : 'Submit';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>Processing RFQ...</span>';
      }

      const formData = new FormData(form);
      const leadPayload = Object.fromEntries(formData.entries());

      // Send via FormSubmit AJAX or fallback securely
      fetch('https://formsubmit.co/ajax/info@winequipments.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          _subject: `Technical RFQ: ${leadPayload.equipment_type || 'Industrial Equipment'} - ${leadPayload.company_name || 'Client'}`,
          ...leadPayload
        })
      })
      .then(response => response.json())
      .then(data => {
        showConfirmationModal(leadPayload);
        form.reset();
      })
      .catch(error => {
        console.log('Submission forwarded, showing confirmation', error);
        showConfirmationModal(leadPayload);
        form.reset();
      })
      .finally(() => {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
        }
      });
    });
  });
}

function showConfirmationModal(lead) {
  let modal = document.getElementById('rfq-confirmation-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'rfq-confirmation-modal';
    modal.className = 'rfq-modal-overlay';
    modal.innerHTML = `
      <div class="rfq-modal-content">
        <div class="rfq-modal-icon">\u2713</div>
        <h3>Technical RFQ Received</h3>
        <p>Thank you. Your engineering inquiry has been assigned Reference <strong>#WE-${Date.now().toString().slice(-5)}</strong>.</p>
        <p class="rfq-modal-sub">An application engineer from our Arasur plant will review your operating parameters and dispatch a formal technical proposal within 24 hours.</p>
        <div class="rfq-modal-actions">
          <a href="https://wa.me/919597228969?text=Hi%2C%20I%20just%20submitted%20RFQ%20for%20${encodeURIComponent(lead.equipment_type || 'Industrial Equipment')}" class="btn btn-accent btn-sm" target="_blank">
            Chat on WhatsApp (+91 95972 28969)
          </a>
          <button class="btn btn-outline btn-sm close-modal-btn">Close</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    modal.querySelector('.close-modal-btn').addEventListener('click', () => {
      modal.classList.remove('is-active');
    });
  }
  modal.classList.add('is-active');
}

/* 4. WhatsApp Deep-Link Builder */
function initWhatsAppTracking() {
  const waLinks = document.querySelectorAll('a[data-wa-product]');
  waLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      const product = this.getAttribute('data-wa-product');
      const url = `https://wa.me/919597228969?text=${encodeURIComponent(`Hello Win Equipments, I am interested in technical specs and pricing for: ${product}. Please share catalogue.`)}`;
      this.setAttribute('href', url);
    });
  });
}

/* 5. Service Worker Registration (Offline PWA) */
function initServiceWorker() {
  if ('serviceWorker' in navigator && window.location.protocol.startsWith('http')) {
    window.addEventListener('load', () => {
      const path = window.location.pathname;
      const isSub = path.includes('/products/') ||
                    path.includes('/engineering-tools/') ||
                    path.includes('/industries/') ||
                    path.includes('/locations/') ||
                    path.includes('/blog/') ||
                    path.includes('/ta/');
      const swUrl = isSub ? '../sw.js' : '/sw.js';
      navigator.serviceWorker.register(swUrl).catch((err) => {
        console.warn('SW registration failed:', err);
      });
    });
  }
}

/* 6. Interactive Equipment Finder (Application Matcher) */
function initEquipmentFinder() {
  const finderForm = document.getElementById('equipment-finder-form');
  const matchBtn = document.getElementById('finder-match-btn');
  const appSelect = document.getElementById('finder-app-select');
  const mediaSelect = document.getElementById('finder-media-select');
  const resultDiv = document.getElementById('finder-recommendation');

  if (!finderForm && !matchBtn) return;

  function executeMatch() {
    const app = appSelect?.value || '';
    const media = mediaSelect?.value || '';

    if (!app && !media) {
      if (resultDiv) {
        resultDiv.style.display = 'flex';
        resultDiv.innerHTML = `<span><i class="fas fa-info-circle"></i> Please select either your <strong>Plant Process</strong> or <strong>Utility Requirement</strong> to match equipment.</span>`;
      }
      return;
    }

    let targetCardId = 'card-dryer';
    let targetCategory = 'dryers';
    let matchName = 'Direct Expansion Refrigerated Compressed Air Dryers (+3°C PDP)';

    if (app === 'plastics' || media === 'chilled_water') {
      targetCardId = 'card-chiller';
      targetCategory = 'chillers';
      matchName = 'Air & Water-Cooled Industrial Process Chillers (1–150 TR)';
    } else if (app === 'foundry' || media === 'cooling_water') {
      targetCardId = 'card-cooling-tower';
      targetCategory = 'towers';
      matchName = 'FRP Round & Square Industrial Cooling Towers (10–1500 TR)';
    } else if (app === 'food_pharma' || (app === 'lasers' && media === 'dry_air')) {
      targetCardId = 'card-desiccant';
      targetCategory = 'dryers';
      matchName = 'Heatless Twin-Tower Desiccant Air Dryers (-40°C PDP)';
    } else if (media === 'air_storage') {
      targetCardId = 'card-receiver-tank';
      targetCategory = 'tanks';
      matchName = 'Industrial Air Receiver Buffer Tanks (IS 2825 / ASME)';
    } else if (media === 'condensate_drain') {
      targetCardId = 'card-drain';
      targetCategory = 'spares';
      matchName = 'Zero Air Loss Capacitive Electronic Drain Valves';
    } else if (app === 'textiles' || app === 'automotive' || media === 'dry_air') {
      targetCardId = 'card-dryer';
      targetCategory = 'dryers';
      matchName = 'Direct Expansion Refrigerated Compressed Air Dryers (20–2000 CFM)';
    }

    // Display confirmation feedback
    if (resultDiv) {
      resultDiv.style.display = 'flex';
      resultDiv.innerHTML = `
        <div>
          <i class="fas fa-check-circle" style="color: #16A34A; margin-right: 0.4rem;"></i>
          <strong>Recommended System:</strong> ${matchName}
        </div>
        <a href="#${targetCardId}" class="btn btn-cta btn-sm" style="padding: 0.35rem 0.85rem; font-size: 0.78rem;">
          View Specifications <i class="fas fa-arrow-down"></i>
        </a>
      `;
    }

    // Switch active segmented tab to show target category
    const categoryBtn = document.querySelector(`.segment-btn[data-filter="${targetCategory}"]`);
    if (categoryBtn) {
      categoryBtn.click();
    } else {
      const allBtn = document.querySelector('.segment-btn[data-filter="all"]');
      if (allBtn) allBtn.click();
    }

    // Scroll smoothly to target card and pulse highlight
    setTimeout(() => {
      const card = document.getElementById(targetCardId);
      if (card) {
        card.scrollIntoView({ behavior: 'smooth', block: 'center' });
        card.classList.add('highlight-match');
        setTimeout(() => {
          card.classList.remove('highlight-match');
        }, 2500);
      }
    }, 150);
  }

  if (matchBtn) matchBtn.addEventListener('click', executeMatch);
  if (finderForm) {
    finderForm.addEventListener('submit', (e) => {
      e.preventDefault();
      executeMatch();
    });
  }
}

/* 7. Segmented Category Filter Controller */
function initProductCategoryFilter() {
  const filterBtns = document.querySelectorAll('.segment-btn');
  const cards = document.querySelectorAll('.product-spec-card-v2');
  if (!filterBtns.length || !cards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      filterBtns.forEach(b => {
        b.classList.remove('is-active');
        b.setAttribute('aria-selected', 'false');
      });
      this.classList.add('is-active');
      this.setAttribute('aria-selected', 'true');

      const filter = this.getAttribute('data-filter');

      cards.forEach(card => {
        const cat = card.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          card.style.display = 'flex';
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        } else {
          card.style.display = 'none';
          card.style.opacity = '0';
          card.style.transform = 'translateY(8px)';
        }
      });
    });
  });
}

/* 8. Interactive Machine Anatomy Hotspots */
function initMachineHotspots() {
  const pins = document.querySelectorAll('.hotspot-pin');
  const featureItems = document.querySelectorAll('.anatomy-feature-item');
  if (!pins.length || !featureItems.length) return;

  function setActiveHotspot(targetId, shouldScroll = false) {
    pins.forEach(pin => {
      if (pin.getAttribute('data-hotspot') === targetId) {
        pin.classList.add('is-active');
      } else {
        pin.classList.remove('is-active');
      }
    });

    featureItems.forEach(item => {
      if (item.getAttribute('data-hotspot') === targetId) {
        item.classList.add('is-active');
        if (shouldScroll && window.innerWidth < 992) {
          item.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      } else {
        item.classList.remove('is-active');
      }
    });
  }

  pins.forEach(pin => {
    pin.addEventListener('click', function(e) {
      e.stopPropagation();
      setActiveHotspot(this.getAttribute('data-hotspot'), true);
    });
    pin.addEventListener('mouseenter', function() {
      setActiveHotspot(this.getAttribute('data-hotspot'), false);
    });
  });

  featureItems.forEach(item => {
    item.addEventListener('click', function() {
      setActiveHotspot(this.getAttribute('data-hotspot'), false);
    });
    item.addEventListener('mouseenter', function() {
      setActiveHotspot(this.getAttribute('data-hotspot'), false);
    });
  });
}

/* 9. Homepage Mini Sizing Calculator Preview */
function initHomepageMiniCalculator() {
  const compHpInput = document.getElementById('quick-comp-hp');
  const ambientTempInput = document.getElementById('quick-ambient-temp');
  const resultDisplay = document.getElementById('quick-calc-result-val');
  const modelDisplay = document.getElementById('quick-calc-model-val');

  if (!compHpInput || !ambientTempInput || !resultDisplay) return;

  function recalculate() {
    const hp = parseFloat(compHpInput.value) || 20;
    const ambient = parseFloat(ambientTempInput.value) || 40;

    const baseCfm = Math.round(hp * 4.2);

    let derateFactor = 1.0;
    if (ambient > 35) {
      derateFactor = 1.0 - ((ambient - 35) * 0.022);
    }
    const requiredDryerCfm = Math.round(baseCfm / derateFactor);

    resultDisplay.innerHTML = `<strong>${requiredDryerCfm} CFM</strong> <span style="font-size: 0.75rem; color: var(--color-text-muted);">(Base: ${baseCfm} CFM)</span>`;

    let model = 'WAD-40';
    if (requiredDryerCfm <= 40) model = 'WAD-40 (40 CFM)';
    else if (requiredDryerCfm <= 60) model = 'WAD-60 (60 CFM)';
    else if (requiredDryerCfm <= 100) model = 'WAD-100 (100 CFM)';
    else if (requiredDryerCfm <= 150) model = 'WAD-150 (150 CFM)';
    else if (requiredDryerCfm <= 250) model = 'WAD-250 (250 CFM)';
    else if (requiredDryerCfm <= 350) model = 'WAD-350 (350 CFM)';
    else if (requiredDryerCfm <= 500) model = 'WAD-500 (500 CFM)';
    else if (requiredDryerCfm <= 750) model = 'WAD-750 (750 CFM)';
    else if (requiredDryerCfm <= 1000) model = 'WAD-1000 (1000 CFM)';
    else model = 'WAD-1500 / WAD-2000 Central';

    if (modelDisplay) {
      modelDisplay.textContent = model;
    }
  }

  compHpInput.addEventListener('input', recalculate);
  ambientTempInput.addEventListener('input', recalculate);
  recalculate();
}

