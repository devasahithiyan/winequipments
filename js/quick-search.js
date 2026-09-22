/**
 * Win Equipments – Global Technical Model & Spec Quick Search (Ctrl+K)
 * Fast client-side fuzzy model lookups across all 10 product lines and engineering tools.
 */

(function () {
  'use strict';

  if (window.__WIN_SEARCH_INITIALIZED__) return;
  window.__WIN_SEARCH_INITIALIZED__ = true;

  const isSubdir = window.location.pathname.split('/').filter(Boolean).length >= 2;
  const prefix = isSubdir ? '../' : '';

  // Technical Search Database
  const SEARCH_DATABASE = [
    // Product Series
    { type: 'Product', title: 'Refrigerated Compressed Air Dryers', sub: 'WRD Series • 20 to 2,000 CFM • +3°C Dew Point', tag: '20-2000 CFM', url: prefix + 'products/refrigerated-air-dryers.html' },
    { type: 'Product', title: 'Heatless Desiccant Air Dryers', sub: 'WHD Series • 20 to 1,500 CFM • -40°C to -70°C PDP', tag: '-40°C PDP', url: prefix + 'products/desiccant-air-dryers.html' },
    { type: 'Product', title: 'Industrial Process Water Chillers', sub: 'WCP Series • 1 to 150 TR • Air & Water Cooled', tag: '1-150 TR', url: prefix + 'products/industrial-process-chillers.html' },
    { type: 'Product', title: 'Anodizing Process Chillers', sub: 'WAN Series • Titanium Exchanger for Sulfuric Acid Baths', tag: 'Titanium', url: prefix + 'products/anodizing-chillers.html' },
    { type: 'Product', title: 'Medical Scan Chillers (MRI / CT)', sub: 'WMS Series • Dual Redundant Refrigeration Circuits', tag: 'Medical', url: prefix + 'products/medical-scan-chillers.html' },
    { type: 'Product', title: 'Severe Service Acid Cooling Chillers', sub: 'WAC Series • Hastelloy & Titanium Corrosion-Proof', tag: 'Acid Proof', url: prefix + 'products/acid-cooling-chillers.html' },
    { type: 'Product', title: 'Round Bottle FRP Cooling Towers', sub: 'WCT Series • 10 to 1,500 TR • 360° Aerodynamic Intake', tag: '10-1500 TR', url: prefix + 'products/round-cooling-towers.html' },
    { type: 'Product', title: 'Square Modular Cooling Towers', sub: 'Crossflow Multi-cell Modular Expansion Basin', tag: 'Modular', url: prefix + 'products/square-cooling-towers.html' },
    { type: 'Product', title: 'Closed-Circuit Evaporative Towers', sub: 'WCC Series • Indirect Cooling with Zero Contamination', tag: 'Closed Loop', url: prefix + 'products/closed-circuit-cooling-towers.html' },
    { type: 'Product', title: 'Industrial Flake Ice Machines', sub: 'WFI Series • 0.5 to 30 Tons/Day • -6°C to -8°C Flakes', tag: '0.5-30 TPD', url: prefix + 'products/ice-flake-machines.html' },
    { type: 'Product', title: 'Air Receiver Pressure Tanks', sub: 'WRV Series • 250L to 10,000L • IS 2825 & ASME Sec VIII', tag: '250L-10000L', url: prefix + 'products/air-receiver-tanks.html' },
    { type: 'Product', title: 'Compressed Air Line Filters', sub: 'WMF Series • 0.01μm Oil Coalescing & Particulate', tag: '0.01 Micron', url: prefix + 'products/compressed-air-filters.html' },
    { type: 'Product', title: 'Automatic Condensate Drain Valves', sub: 'WADV Series • Zero-Air-Loss & Electronic Timer', tag: 'Zero Loss', url: prefix + 'products/automatic-drain-valves.html' },
    { type: 'Product', title: 'Industrial Aftercoolers', sub: 'High-temp compressor discharge air & water aftercooling', tag: 'Aftercoolers', url: prefix + 'products/industrial-aftercoolers.html' },
    { type: 'Product', title: 'Spares, Desiccant & Consumables', sub: 'Activated Alumina, Filter Elements, PVC Fills & Valves', tag: 'Spare Parts', url: prefix + 'products/spare-parts-consumables.html' },

    // Key Models
    { type: 'Model', title: 'WRD 20 S / WRD 40 S', sub: '20–40 CFM Refrigerated Dryer • 0.45 kW • 1/2" BSP', tag: 'Air Dryer', url: prefix + 'products/refrigerated-air-dryers.html#rfq-section' },
    { type: 'Model', title: 'WRD 60 S / WRD 80 S', sub: '60–80 CFM Refrigerated Dryer • 0.65 kW • 3/4" BSP', tag: 'Air Dryer', url: prefix + 'products/refrigerated-air-dryers.html#rfq-section' },
    { type: 'Model', title: 'WRD 100 S / WRD 150 S', sub: '100–150 CFM Refrigerated Dryer • 1.1 kW • 1" BSP', tag: 'Air Dryer', url: prefix + 'products/refrigerated-air-dryers.html#rfq-section' },
    { type: 'Model', title: 'WRD 200 S / WRD 300 S', sub: '200–300 CFM Refrigerated Dryer • 1.8 kW • 1.5" BSP', tag: 'Air Dryer', url: prefix + 'products/refrigerated-air-dryers.html#rfq-section' },
    { type: 'Model', title: 'WRD 500 S / WRD 750 S', sub: '500–750 CFM Central Plant Dryer • 4.5 kW • 2" Flanged', tag: 'Air Dryer', url: prefix + 'products/refrigerated-air-dryers.html#rfq-section' },
    { type: 'Model', title: 'WRD 1000 S / WRD 2000 S', sub: '1,000–2,000 CFM Heavy Duty Central Dryer • 3" Flanged', tag: 'Air Dryer', url: prefix + 'products/refrigerated-air-dryers.html#rfq-section' },
    { type: 'Model', title: 'WHD-030 / WHD-050', sub: '300–500 CFM Desiccant Dryer • -40°C Dew Point', tag: 'Desiccant', url: prefix + 'products/desiccant-air-dryers.html#rfq-section' },
    { type: 'Model', title: 'WHD-100 / WHD-150', sub: '1,000–1,500 CFM Desiccant Dryer • Twin Tower Heatless', tag: 'Desiccant', url: prefix + 'products/desiccant-air-dryers.html#rfq-section' },
    { type: 'Model', title: 'WCP 010 / WCP 020', sub: '1.0–2.0 TR Compact Packaged Chiller • Copeland Scroll', tag: 'Chiller', url: prefix + 'products/industrial-process-chillers.html#rfq-section' },
    { type: 'Model', title: 'WCP 050 / WCP 075', sub: '5.0–7.5 TR Industrial Chiller • SS304 Tank & BPHE', tag: 'Chiller', url: prefix + 'products/industrial-process-chillers.html#rfq-section' },
    { type: 'Model', title: 'WCP 100 / WCP 150', sub: '10.0–15.0 TR Process Chiller • Digital PID Controller', tag: 'Chiller', url: prefix + 'products/industrial-process-chillers.html#rfq-section' },
    { type: 'Model', title: 'WCT 010 / WCT 050', sub: '10–50 TR Round Bottle FRP Cooling Tower • Rotating Sprinkler', tag: 'Cooling Tower', url: prefix + 'products/round-cooling-towers.html#rfq-section' },
    { type: 'Model', title: 'WCT 100 / WCT 500', sub: '100–500 TR Industrial FRP Tower • High-TDS Resistant', tag: 'Cooling Tower', url: prefix + 'products/round-cooling-towers.html#rfq-section' },
    { type: 'Model', title: 'WADV-Z16 Zero Loss Drain', sub: 'Capacitive electronic condensate drain • Zero compressed air loss', tag: 'Auto Drain', url: prefix + 'products/automatic-drain-valves.html#rfq-section' },
    { type: 'Model', title: 'WADV-T16 Timer Drain', sub: 'Electronic solenoid timer drain with integrated ball valve strainer', tag: 'Auto Drain', url: prefix + 'products/automatic-drain-valves.html#rfq-section' },

    // Engineering Calculators
    { type: 'Tool', title: 'Air Dryer CFM Sizing Calculator', sub: 'Calculate required dryer CFM with pressure & temperature correction', tag: 'Calculator', url: prefix + 'engineering-tools/air-dryer-sizing.html' },
    { type: 'Tool', title: 'Chiller Tonnage & Heat Load Calculator', sub: 'Convert water flow (LPM) and temperature drop (ΔT) to required TR', tag: 'Calculator', url: prefix + 'engineering-tools/chiller-tonnage-calculator.html' },
    { type: 'Tool', title: 'Cooling Tower TR & Flow Calculator', sub: 'Determine cooling tower capacity, range, and evaporation loss', tag: 'Calculator', url: prefix + 'engineering-tools/cooling-tower-calculator.html' },
    { type: 'Tool', title: 'Compressed Air Drain Energy Loss Calculator', sub: 'Calculate annual electrical power lost through open condensate drains', tag: 'Calculator', url: prefix + 'engineering-tools/compressed-air-energy-calculator.html' },

    // Downloads
    { type: 'PDF', title: 'Refrigerated Air Dryer Brochure (PDF)', sub: 'Official 5-page publication-grade brochure with full spec matrix', tag: 'Brochure', url: prefix + 'catlogue/refrigeration air dryer.pdf' },
    { type: 'PDF', title: 'Industrial Process Chiller Brochure (PDF)', sub: 'Official 5-page technical brochure with dimensions and power ratings', tag: 'Brochure', url: prefix + 'catlogue/chiller.pdf' },
    { type: 'PDF', title: 'Round & Square Cooling Tower Brochure (PDF)', sub: 'Official 5-page catalogue for FRP cooling towers', tag: 'Brochure', url: prefix + 'catlogue/Cooling-towers.pdf' },
    { type: 'PDF', title: 'Master E-Catalogue (Complete Product Range)', sub: 'Comprehensive 16-page catalogue of all Win Equipments products', tag: 'Master PDF', url: prefix + 'catlogue/E_Catalogue.pdf' }
  ];

  let overlay, input, resultsList, selectedIndex = -1;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initQuickSearch);
  } else {
    initQuickSearch();
  }

  function initQuickSearch() {
    createSearchDOM();
    bindSearchEvents();
    injectNavSearchButton();
  }

  function createSearchDOM() {
    overlay = document.createElement('div');
    overlay.id = 'winSearchOverlay';
    overlay.className = 'win-search-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.innerHTML = `
      <div class="win-search-modal">
        <div class="win-search-input-wrap">
          <i class="fas fa-search"></i>
          <input type="text" class="win-search-input" id="winSearchInput" placeholder="Search models, CFM, TR, dryers, chillers, brochures..." autocomplete="off">
          <span class="win-search-badge">ESC to close</span>
        </div>
        <div class="win-search-results" id="winSearchResults"></div>
        <div class="win-search-footer">
          <div><i class="fas fa-microchip" style="color:#0284C7;margin-right:0.3rem;"></i> Win Equipments Engineering Index</div>
          <div class="win-search-shortcuts">
            <span><kbd>↑</kbd> <kbd>↓</kbd> to navigate</span>
            <span><kbd>Enter</kbd> to select</span>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);

    input = overlay.querySelector('#winSearchInput');
    resultsList = overlay.querySelector('#winSearchResults');
  }

  function bindSearchEvents() {
    // Keyboard shortcuts
    document.addEventListener('keydown', function (e) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        openSearch();
      } else if (e.key === 'Escape' && overlay.classList.contains('is-active')) {
        closeSearch();
      } else if (e.key === '/' && !isInputFocused() && !overlay.classList.contains('is-active')) {
        e.preventDefault();
        openSearch();
      } else if (overlay.classList.contains('is-active')) {
        handleSearchNavigation(e);
      }
    });

    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) closeSearch();
    });

    input.addEventListener('input', function () {
      renderSearchResults(input.value.trim());
    });
  }

  function isInputFocused() {
    const active = document.activeElement;
    return active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA' || active.isContentEditable);
  }

  function injectNavSearchButton() {
    const navContainers = document.querySelectorAll('.header-content, .top-bar .container');
    if (!navContainers.length) return;

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'win-search-nav-btn';
    btn.setAttribute('aria-label', 'Search models and specs');
    btn.innerHTML = `<i class="fas fa-search"></i> <span>Search specs...</span> <kbd>Ctrl K</kbd>`;
    btn.addEventListener('click', openSearch);

    // Insert into header actions if available
    const headerAction = document.querySelector('.header-content div[style*="display: flex"]');
    if (headerAction) {
      headerAction.insertBefore(btn, headerAction.firstChild);
    }
  }

  function openSearch() {
    overlay.classList.add('is-active');
    renderSearchResults(input.value.trim());
    setTimeout(() => input.focus(), 100);
  }

  function closeSearch() {
    overlay.classList.remove('is-active');
    selectedIndex = -1;
  }

  function renderSearchResults(query) {
    resultsList.innerHTML = '';
    selectedIndex = -1;

    let filtered = SEARCH_DATABASE;
    if (query) {
      const q = query.toLowerCase();
      filtered = SEARCH_DATABASE.filter(item => {
        return item.title.toLowerCase().includes(q) ||
               item.sub.toLowerCase().includes(q) ||
               item.tag.toLowerCase().includes(q) ||
               item.type.toLowerCase().includes(q);
      });
    } else {
      // Show top curated items initially
      filtered = SEARCH_DATABASE.slice(0, 8);
    }

    if (!filtered.length) {
      resultsList.innerHTML = `
        <div class="win-search-empty">
          <i class="fas fa-search" style="font-size: 1.5rem; color: #CBD5E1; margin-bottom: 0.5rem; display: block;"></i>
          No matching models or documents found for "<strong>${escapeHTML(query)}</strong>".<br>
          <span style="font-size: 0.8rem; color: #94A3B8;">Try searching "150 CFM", "Chiller", "WCT", "Desiccant", or "Brochure".</span>
        </div>
      `;
      return;
    }

    // Group items by type
    const groups = {};
    filtered.forEach(item => {
      if (!groups[item.type]) groups[item.type] = [];
      groups[item.type].push(item);
    });

    let itemIndex = 0;
    for (const [groupName, items] of Object.entries(groups)) {
      const groupHeader = document.createElement('div');
      groupHeader.className = 'win-search-group-title';
      groupHeader.textContent = groupName + 's';
      resultsList.appendChild(groupHeader);

      items.forEach(item => {
        const link = document.createElement('a');
        link.href = item.url;
        link.className = 'win-search-item';
        link.dataset.index = itemIndex++;
        link.innerHTML = `
          <div class="win-search-item-main">
            <span class="win-search-item-title">${highlightMatch(item.title, query)}</span>
            <span class="win-search-item-sub">${highlightMatch(item.sub, query)}</span>
          </div>
          <span class="win-search-item-tag">${escapeHTML(item.tag)}</span>
        `;
        link.addEventListener('click', () => closeSearch());
        resultsList.appendChild(link);
      });
    }

    // Preselect first item
    highlightSelectedItem(0);
  }

  function handleSearchNavigation(e) {
    const items = resultsList.querySelectorAll('.win-search-item');
    if (!items.length) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      selectedIndex = (selectedIndex + 1) % items.length;
      highlightSelectedItem(selectedIndex);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      selectedIndex = (selectedIndex - 1 + items.length) % items.length;
      highlightSelectedItem(selectedIndex);
    } else if (e.key === 'Enter') {
      if (selectedIndex >= 0 && items[selectedIndex]) {
        e.preventDefault();
        items[selectedIndex].click();
      }
    }
  }

  function highlightSelectedItem(idx) {
    const items = resultsList.querySelectorAll('.win-search-item');
    items.forEach((it, i) => {
      if (i === idx) {
        it.classList.add('is-selected');
        it.scrollIntoView({ block: 'nearest' });
      } else {
        it.classList.remove('is-selected');
      }
    });
    selectedIndex = idx;
  }

  function highlightMatch(text, query) {
    if (!query) return escapeHTML(text);
    const escapedQ = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escapedQ})`, 'gi');
    return escapeHTML(text).replace(regex, '<mark style="background:#BAE6FD;color:#0369A1;padding:0 2px;border-radius:2px;">$1</mark>');
  }

  function escapeHTML(str) {
    return (str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
})();
