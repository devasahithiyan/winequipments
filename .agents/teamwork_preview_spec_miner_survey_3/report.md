# TECHNICAL SPECIFICATION & CONTENT MINING REPORT: WIN EQUIPMENTS PUBLICATIONS

**Document ID**: WE-SPEC-SURVEY-3-2026  
**Investigator**: Survey Explorer 3 (Product Specifications & Content Miner)  
**Date**: September 20, 2026  
**Scope**: 11 Publication-Grade Print PDF Catalogues (10 Individual Product Brochures + 1 Master E-Catalogue)  
**Target Directory**: `/Users/devasahithiyan/Desktop/Win equipments/catlogue/`  

---

## 1. Executive Summary & Specification Mining Overview

Win Equipments (Arasur Works, Coimbatore, India) is an ISO 9001:2015 certified manufacturer of industrial compressed air treatment equipment, process chillers, cooling towers, and pressure vessels founded in 2008 by Mr. Ramasamy Ananthakumar. 

This survey mined and synthesized all product specifications, engineering dimensions, operational parameters, working principles, application domains, competitor benchmarks, media assets, and canonical URLs across three authoritative source layers:
1. **Existing Publication PDFs**: 13 legacy/current PDF brochures located in `catlogue/` and root `E_Catalogue.pdf`.
2. **Canonical Web Architecture**: 15 product landing pages (`products/*.html`), `about.html`, `certifications.html`, `contactus.html`, and `sitemap.xml`.
3. **Physical Media Assets**: 26 product photographs in `images/Products/` along with corporate logos and certification marks in `images/`.

All mined data has been mapped into definitive page-by-page blueprints for the 10 individual product brochures (4–6 pages each) and the Master E-Catalogue (16 pages), adhering to strict industrial graphic standards comparable to Atlas Copco, Kaeser, and Grundfos.

---

## 2. Mandatory Contact Hygiene & Brand Identity Rules

All 11 publications must strictly conform to the following contact hygiene and brand standards.

### 2.1 Approved Corporate Identity & Mandatory Elements
- **Company Legal Name**: Win Equipments
- **Tagline**: Save Water and Power
- **Manufacturing Facility & Registered Office**:  
  `SF No: 4, 195 B, Kallangadu, Arasur Post, Coimbatore – 641407, Tamil Nadu, India`
- **Mandatory Direct Telephones**:  
  `+91 95972 28969` / `+91 95972 28975`
- **Mandatory Corporate Email**:  
  `info@winequipments.com`
- **Mandatory Website**:  
  `winequipments.com` (or `www.winequipments.com`)
- **Accreditation / Certifications**:  
  - ISO 9001:2015 Quality Management System
  - IAF (International Accreditation Forum) Accredited
  - DAC (Dubai Accreditation Center) Recognized (GCC Desert Specification Rated)
- **Corporate Brand Palette**:
  - Primary Deep Navy: `#0E2540` (Headings, primary banners, footers, dark backgrounds)
  - Technical Accent Sky Blue: `#0284C7` (Table headers, callout borders, KPI highlights, icons)
  - Background Neutral: `#F4F6F9` (Shaded table rows, callout box backdrops)
  - Pure White: `#FFFFFF` (Page canvas, contrast text)
  - Slate Body Text: `#334155` or `#1E293B` (Crisp legible body typography)

### 2.2 Banned / Strictly Forbidden Contact Information
The following historical or legacy contact numbers are **strictly forbidden** across all generated PDFs. Verification audits via `pdftotext` must return **zero** occurrences:
- ❌ `9597228978` (Defunct mobile number)
- ❌ `0422-2562975` (Obsolete landline with STD code)
- ❌ `2562975` (Obsolete local landline number)

---

## 3. Authoritative Features Discovered

| # | Category | Feature | Description | Inputs | Outputs | Error Behavior | Discovered Via |
|---|----------|---------|-------------|--------|---------|----------------|----------------|
| 1 | Air Dryers | 3-in-1 Modular Heat Exchanger | Integrates air-to-air regenerator, direct-expansion evaporator, and moisture demister in one compact aluminum block. | Compressed air up to 50°C, 4–16 bar g | Cooled air at constant +3°C PDP, condensed liquid water | Delta P alarm if >0.2 bar; coil freeze-up if HGBV fails | `catlogue/refrigeration air dryer.pdf`, `products/refrigerated-air-dryers.html` |
| 2 | Air Dryers | Hot Gas Bypass Modulation | Modulates refrigeration capacity across 0–100% flow variations using mechanical pressure-balanced injection. | Varying downstream air flow rate (0–100%) | Stable evaporator suction pressure/temperature | Coil freeze-up or overheating if valve loses calibration | `catlogue/refrigeration air dryer.pdf`, `products/refrigerated-air-dryers.html` |
| 3 | Air Dryers | Zero Air Loss Capacitive Drain | Electronic capacitive level sensing exhausts accumulated condensate without venting compressed air. | Liquid condensate accumulation | 100% water discharge, 0 CFM air loss | Alarm indicator if discharge port clogs | `catlogue/Automatic-Drain-Valve.pdf`, `products/automatic-drain-valves.html` |
| 4 | Desiccant Dryers | Twin-Tower PSA Cycle | Pressure Swing Adsorption cycle using spherical activated alumina desiccant on 8-minute timer. | Moist compressed air at 7–16 bar g | Ultra-dry air at -40°C to -70°C PDP, purge exhaust | High PDP alarm if purge valve jams; desiccant dusting if pre-filter fails | `catlogue/Desiccant air dryer.pdf`, `products/desiccant-air-dryers.html` |
| 5 | Desiccant Dryers | Dew Point Dependent Switching (DDS) | Capacitive ceramic hygrometer pauses cycle when desiccant bed is lightly loaded, slashing purge air. | Real-time dew point reading | Variable cycle time; purge air < 5% | Fallback to fixed 8-minute cycle if sensor fails | `catlogue/Desiccant air dryer.pdf`, `products/desiccant-air-dryers.html` |
| 6 | Chillers | SS304 Internal Buffer Reservoir | Insulated stainless steel hydraulic buffer tank dampening sudden thermal load spikes. | Returning warm process water | Stabilized supply water at setpoint ±0.5°C | Low level cutoff interlock protects pump from cavitation | `catlogue/chiller.pdf`, `products/industrial-process-chillers.html` |
| 7 | Chillers | Scroll Compression Technology | Hermetic Copeland / Danfoss scroll compressors with internal motor protection and vibration dampening. | Refrigerant gas R410A / R407C | High-pressure vapor, high COP (>4.5) | HP/LP trip switches cut circuit on pressure anomalies | `catlogue/chiller.pdf`, `products/industrial-process-chillers.html` |
| 8 | Specialized Chillers | Pure Titanium Gr. 2 Immersion Coils | Chemically impervious titanium heat exchangers resisting 20% sulfuric, chromic, and oxalic acid baths. | Aggressive anodizing acid bath at 15–20°C | Precision cooling during high-amperage rectification | Anodize bath burning if temperature rises above 22°C | `catlogue/specialized chillers.pdf`, `products/anodizing-chillers.html` |
| 9 | Specialized Chillers | Dual Redundant (N+1) Circuits | Two independent refrigeration and pumping circuits for hospital MRI and CT scanner uptime. | Continuous diagnostic scanner heat load | 100% cooling uptime; auto-failover to Circuit 2 | Auto-failover initiates if Circuit 1 compressor trips | `catlogue/specialized chillers.pdf`, `products/medical-scan-chillers.html` |
| 10 | Specialized Chillers | Emergency City Water Auto-Bypass | Motorized 3-way valve opens municipal water to cold heads if facility electrical power fails completely. | Total plant blackout / UPS activation | Cold head cooling sustained, prevents helium quench | Cryogenic boil-off (>₹30L cost) if bypass fails | `catlogue/specialized chillers.pdf`, `products/medical-scan-chillers.html` |
| 11 | Ice Machines | Stationary Vertical SUS304 Drum | Fixed vertical food-grade stainless evaporator drum with rotating internal spiral cutter. | Chilled water spray at 15–20°C | Subcooled dry flakes (-5°C to -8°C, 1.5–2.2mm) | Water starvation switch stops compressor if feed cuts | `catlogue/ice flake machine.pdf`, `products/ice-flake-machines.html` |
| 12 | Cooling Towers | Self-Rotating Alloy Sprinkler | Low-friction rotary head distributing water via jet reaction without motorized drive. | Water inlet flow at 0.5–1.0 bar | Uniform 360° droplet distribution across PVC fills | Scale accumulation causes rotation stall if untreated | `catlogue/Cooling-towers.pdf`, `products/round-cooling-towers.html` |
| 13 | Cooling Towers | Modular Square Multi-Cell Setup | Modular square crossflow cells with unpressurized top gravity basins and walk-in access doors. | Warm industrial process water | Cold water at 32°C (4°C approach to wet bulb) | Cell isolation valve allows online nozzle cleaning | `catlogue/Cooling-towers.pdf`, `products/square-cooling-towers.html` |
| 14 | Closed Circuit Towers | Continuous HDG / SS304 Serpentine Coils | Closed-circuit evaporative coil isolating process water from atmospheric contaminants and scaling. | Pure closed-loop demineralized cooling water | 100% scale-free heat rejection to atmosphere | Freeze damage in sub-zero ambient if undrained | `catlogue/Coil cooling tower.pdf`, `products/closed-circuit-cooling-towers.html` |
| 15 | Air Receivers | Boiler-Quality SA 516 Gr. 70 Fabrication | Automated submerged arc welded pressure vessels designed to IS 2825 Class II & ASME Sec VIII Div 1. | Pulsating compressor discharge air | Smooth pressure reservoir, bulk water knockout | Safety valve lifts at 1.1× design pressure | `catlogue/Air-Receiver.pdf`, `products/air-receiver-tanks.html` |
| 16 | Air Filters | 4-Stage Progressive Filtration (P/X/Y/A) | Borosilicate microfiber coalescing and activated carbon elements removing particles to 0.01μ, oil to 0.003 ppm. | Oil-laden and wet compressed air | ISO 8573-1 Class 1 purity air | Pop-up DP indicator extends red flag when ΔP >0.35 bar | `catlogue/Filters.pdf`, `products/compressed-air-filters.html` |
| 17 | Automatic Drains | Contactless Capacitive Level Detection | Non-mechanical liquid level sensor sensing through housing wall without floats or levers. | Saturated condensate slurry | Zero air loss automatic liquid discharge | Built-in test button verifies valve operation | `catlogue/Automatic-Drain-Valve.pdf`, `products/automatic-drain-valves.html` |
| 18 | Quality Systems | 4-Stage Factory Acceptance Testing (FAT) | 1.5× Hydrostatic proof test, Helium mass-spectrometer leak test, 8-hour calorimeter load run, Megger electrical test. | Raw fabricated assemblies | Certified test documentation and FAT stamp | Rejection and re-brazing if helium leak detected | `catlogue/E_Catalogue.pdf`, `about.html`, `certifications.html` |

---

## 4. Observed Edge Cases & Technical Behaviors

| # | Feature | Input / Operational Condition | Observed Behavior & Engineering Mitigation |
|---|---------|-------------------------------|--------------------------------------------|
| 1 | Refrigerated Dryer | Inlet air temperature reaches 50°C (extreme tropical peak) | Air flow capacity drops by multiplier Ct = 0.72. Dryer must be selected using sizing formula: `Required Dryer CFM = Compressor CFM ÷ (Cp × Ct × Ca)`. |
| 2 | Refrigerated Dryer | Air pressure drops from 7.0 bar g to 4.0 bar g | Flow velocity increases through heat exchanger; pressure correction factor Cp = 0.77. Sizing must be scaled up by 30%. |
| 3 | Desiccant Dryer | Saturated oil aerosols enter desiccant towers without pre-filter | Activated alumina pores become oil-blinded, permanently degrading desiccant and raising PDP above 0°C. Mandatory upstream Grade Y (0.01μ) coalescing filter prevents this. |
| 4 | Desiccant Dryer | Power failure occurs during decompression cycle | Fail-safe pneumatic switching valves default to closed position, holding vessel pressure and preventing rapid bed fluidization. |
| 5 | Process Chiller | Thermal load drops to 10% during mould changeover | Hot gas bypass valve modulates refrigerant vapor into evaporator, maintaining constant suction pressure and preventing coil freeze-up without compressor hunting. |
| 6 | Process Chiller | Leaving fluid temperature set below +4°C | Pure water will freeze inside plate heat exchanger. Ethylene or propylene glycol brine (20–40% concentration) is strictly required to lower freezing point down to -15°C. |
| 7 | Medical Chiller | Facility main power cuts out while MRI scanner is active | Motorized 3-way bypass valve trips open to municipal city water supply under spring return, continuously cooling the cold head and preventing catastrophic helium quench. |
| 8 | Anodizing Chiller | Sulfuric acid electrolyte reaches +24°C due to rectifier surge | Titanium immersion coils rapidly pull bath back to +18°C. If bath exceeds +22°C, anodized oxide pores dissolve, ruining workpiece surface finish. |
| 9 | Ice Flake Machine | Inlet water supply cut off during active harvesting | Low-water float interlock instantly disengages compressor and gearmotor within 5 seconds, preventing scraper blade dry-galling on stainless drum wall. |
| 10 | Cooling Tower | Ambient wet-bulb temperature rises to 29.5°C during monsoon | Approach temperature widens from 4°C to 5.5°C; cold water leaves at 35°C instead of 32°C. Sizing must account for regional design wet-bulb peaks. |
| 11 | Closed Circuit Tower | Process fluid is pure deionized (DI) water for laser resonator | Hot-dip galvanized tubes cannot be used due to zinc ion leaching into DI loop. 100% SUS304 or SUS316L stainless steel serpentine coil bundles are required. |
| 12 | Air Receiver Tank | High-pressure PET stretch blow molding operation at 40 bar g | Standard IS 2825 Class II 10 bar shell is unsafe. Heavy-wall SA 516 Gr. 70 vessel with full 100% radiographic weld inspection and 60 bar hydrostatic proof test is required. |
| 13 | Filter Element | High differential pressure across saturated coalescer (>0.7 bar) | Top-mounted red pop-up differential indicator triggers; if ignored, coalescing sleeve may burst, contaminating downstream air header with oil slurry. |
| 14 | Automatic Drain | Heavy rust slurry and pipe scale discharges into solenoid valve | Upstream integrated ball-valve mesh strainer captures debris before the pilot orifice, preventing stuck-open valve failure. |

---

## 5. Media & Visual Assets Directory

All image files have been verified in the local workspace.

### 5.1 Product Hero & Secondary Photography
| Product / Publication | Primary Hero Photo Path | Secondary / Detail Photo Paths |
|-----------------------|-------------------------|--------------------------------|
| 1. Refrigerated Air Dryers | `images/Products/Refrigiratedairdryer1.png` | `images/Products/refrigiratedairdryer2.png`, `images/Products/refrigiratedairdryer3.png` |
| 2. Desiccant Air Dryers | `images/Products/dessicantdryer.png` | *(Schematic / P&ID flow diagram)* |
| 3. Industrial Process Chillers | `images/Products/chiller.png` | `images/Products/Sodachiller.png`, `images/Products/sodachiller2.png` |
| 4. Specialized Chillers | `images/Products/electroplatingchiller.png` | `images/Products/medicalchiller.png`, `images/Products/spotchilling.png` |
| 5. Ice Flake Machines | `images/Products/ice-flake-machine.jpg` *(See Warning below)* | *(Schematic / Drum cross-section)* |
| 6. Round & Square Cooling Towers | `images/Products/coolingtower.png` (Round) | `images/Products/Squarecoolingtower1.png` (Square), `images/Products/coolingtower2.png`, `coolingtower3.png` |
| 7. Closed Circuit Cooling Towers | `images/Products/coilcooling.png` | `images/Products/coilcooling2.png` |
| 8. Air Receiver Tanks | `images/Products/Airreciever.png` | `images/Products/airreciever2.png`, `images/Products/airreciever3.png` |
| 9. Compressed Air Filters | `images/Products/compressedairfilters.png` | `images/Products/compressedairfilters2.png`, `compressedairfilters3.png` |
| 10. Automatic Drain Valves | `images/Products/drainvalve.png` | *(Cutaway diagram / internal sensor diagram)* |
| 11. Master E-Catalogue | Multi-product collage (Dryer + Chiller + Tower + Receiver) | `images/about_us.jpg`, `images/about_us_2.jpg`, `images/banner_opt.jpg` |

> **⚠️ CRITICAL ASSET NOTICE FOR ICE FLAKE MACHINES**:  
> The file `images/Products/ice-flake-machine.jpg` is referenced in `products/ice-flake-machines.html` but was not initially present in `images/Products/`. It resides inside `catlogue/ice flake machine.pdf` as an embedded 249 KB high-resolution JPEG (`X28.jpg`). The implementation agent must extract this stream to `images/Products/ice-flake-machine.jpg` or embed the raw binary to prevent broken image boxes.

### 5.2 Corporate Logos & Accreditation Badges
- **Corporate Logo**: `images/logo.png` (Win Equipments crest + typography)
- **ISO 9001:2015 Badge**: `images/iso.png` (Quality Management System seal)
- **IAF Accreditation**: `images/iaf.png` (International Accreditation Forum)
- **DAC Accreditation**: `images/dac.png` (Dubai Accreditation Center)
- **Facility Photo**: `images/about_us.jpg` (Arasur Works manufacturing floor)

---

## 6. Canonical URLs & QR Code Routing Directory

Every brochure and the Master E-Catalogue includes high-contrast QR codes pointing to live, canonical product URLs on `winequipments.com`:

| Publication | Target Canonical URL | Verified Route & Status |
|-------------|----------------------|-------------------------|
| 1. Refrigerated Air Dryers | `https://winequipments.com/products/refrigerated-air-dryers.html` | Verified in `sitemap.xml` (Priority 0.95) |
| 2. Desiccant Air Dryers | `https://winequipments.com/products/desiccant-air-dryers.html` | Verified in `sitemap.xml` (Priority 0.90) |
| 3. Industrial Process Chillers | `https://winequipments.com/products/industrial-process-chillers.html` | Verified in `sitemap.xml` (Priority 0.95) |
| 4. Specialized Chillers | `https://winequipments.com/products/anodizing-chillers.html` *(Also covers medical-scan & acid-cooling)* | Verified in `sitemap.xml` (Priority 0.92) |
| 5. Ice Flake Machines | `https://winequipments.com/products/ice-flake-machines.html` | Verified in `sitemap.xml` (Priority 0.92) |
| 6. Round & Square Cooling Towers | `https://winequipments.com/products/round-cooling-towers.html` *(And square-cooling-towers.html)* | Verified in `sitemap.xml` (Priority 0.95) |
| 7. Closed Circuit Cooling Towers | `https://winequipments.com/products/closed-circuit-cooling-towers.html` | Verified in `sitemap.xml` (Priority 0.90) |
| 8. Air Receiver Tanks | `https://winequipments.com/products/air-receiver-tanks.html` | Verified in `sitemap.xml` (Priority 0.90) |
| 9. Compressed Air Filters | `https://winequipments.com/products/compressed-air-filters.html` | Verified in `sitemap.xml` (Priority 0.85) |
| 10. Automatic Drain Valves | `https://winequipments.com/products/automatic-drain-valves.html` | Verified in `sitemap.xml` (Priority 0.85) |
| 11. Master E-Catalogue | `https://winequipments.com/` *(Main Portal & Sizing Calculators)* | Verified in `sitemap.xml` (Priority 1.00) |

---

## 7. Individual Product Brochure Blueprints (10 Publications)

Each brochure is architected as a publication-grade, 4- to 6-page A4 print layout (210mm × 297mm). The blueprints below specify exact content, layout structure, engineering tables, and copy.

```
================================================================================
PRODUCT 1: REFRIGERATED COMPRESSED AIR DRYERS (WRD SERIES)
Output File: catlogue/refrigeration air dryer.pdf
================================================================================
```

### Page 1 — Cover
- **Header Banner**: Win Equipments Navy Header with Logo (`images/logo.png`), Tagline "Save Water and Power", and ISO 9001:2015 / IAF / DAC certification badges.
- **Series Identifier**: COMPRESSED AIR TREATMENT SYSTEMS • WRD SERIES (20 TO 2,000 CFM)
- **Primary Title**: High-Efficiency Refrigerated Air Dryers
- **Tagline**: Non-Cycling Direct-Expansion Technology Delivering Constant +3°C Pressure Dew Point Under Extreme Tropical Ambient Conditions.
- **Hero Image**: Full-bleed / 45% page area hero photograph of `images/Products/Refrigiratedairdryer1.png`.
- **4 Key Performance Badges**:
  - `+3°C PDP`: ISO 8573-1 Class 4 Moisture Purity
  - `20–2,000 CFM`: Comprehensive Standard Model Range
  - `50°C MAX INLET`: Heavy Tropical Heat Exchanger Sizing
  - `ZERO AIR LOSS`: Electronic Capacitive Condensate Drain
- **Footer**: Win Equipments | SF No: 4, 195 B, Kallangadu, Arasur Post, Coimbatore – 641407 | Page 1 of 4

### Page 2 — Thermodynamic Architecture & Engineering Benefits
- **Title**: Advanced 3-in-1 Thermodynamic Architecture & System Integration
- **Working Principle Narrative**: Saturated compressed air enters the air-to-air regenerator where it is precooled by outgoing chilled dry air, reducing refrigeration compressor electrical power by up to 40%. The precooling process also reheats outgoing air to prevent factory distribution pipes from sweating. Precooled air then enters the direct-expansion evaporator where it is chilled to +3°C, causing water vapor to condense into large droplets. A high-efficiency stainless steel centrifugal demister separator isolates 99%+ of water droplets, which are automatically evacuated via a zero-air-loss capacitive drain.
- **P&ID Process Schematic Box**: Compressor → Aftercooler → Wet Receiver → Pre-Filter (3μ) → WRD Dryer (+3°C PDP) → Micro-Filter (0.01μ) → Dry Buffer Receiver → Ring Main.
- **3–5 Key Engineering Advantages**:
  1. *3-in-1 Aluminum Modular Exchanger*: Integrates regenerator, evaporator, and separator in a monoblock aluminum structure; eliminates interconnecting pipe friction (<0.2 bar ΔP).
  2. *Hot Gas Bypass Capacity Modulation*: Automatically injects hot discharge gas into the evaporator during low flow, maintaining stable +3°C dew point from 0% to 100% pneumatic load without coil freeze-up.
  3. *Copeland / Danfoss Refrigeration Systems*: Hermetic compressors charged with eco-friendly R134a or R407C, equipped with thermal overload protection and vibration dampening.
  4. *Capacitive Zero-Air-Loss Drain*: Electronic level sensing vents water only, saving over ₹42,000 in compressed air power per compressor annually.
- **Footer**: Win Equipments | Refrigerated Air Dryers • WRD Series | Page 2 of 4

### Page 3 — Engineering Specifications Matrix
- **Title**: WRD Series Technical Data (20 to 2,000 CFM)
- **Standard Design Conditions**: Operating pressure 7.0 bar g, Max design 16.0 bar g, Air inlet 45°C, Ambient 35°C, Pressure dew point +3°C.
- **Complete Specification Table**:

| Model No. | Nominal CFM | Flow m³/hr | Power kW | Supply Voltage | In/Out Conn | Dimensions (L×W×H mm) | Weight kg |
|-----------|-------------|------------|----------|----------------|-------------|-----------------------|-----------|
| WRD 20 S | 20 CFM | 34 | 0.45 kW | 230V / 1Ph / 50Hz | 1/2" BSP | 450 × 450 × 550 | 38 kg |
| WRD 30 S | 30 CFM | 51 | 0.45 kW | 230V / 1Ph / 50Hz | 1/2" BSP | 450 × 450 × 550 | 40 kg |
| WRD 40 S | 40 CFM | 68 | 0.45 kW | 230V / 1Ph / 50Hz | 1/2" BSP | 450 × 450 × 550 | 42 kg |
| WRD 60 S | 60 CFM | 102 | 0.65 kW | 230V / 1Ph / 50Hz | 1" BSP | 500 × 550 × 750 | 55 kg |
| WRD 80 S | 80 CFM | 136 | 0.65 kW | 230V / 1Ph / 50Hz | 1" BSP | 500 × 550 × 750 | 58 kg |
| WRD 100 S | 100 CFM | 170 | 0.85 kW | 230V / 1Ph / 50Hz | 1" BSP | 500 × 550 × 750 | 60 kg |
| WRD 125 S | 125 CFM | 212 | 0.85 kW | 230V / 1Ph / 50Hz | 1.5" BSP | 500 × 550 × 750 | 65 kg |
| WRD 150 S | 150 CFM | 255 | 1.10 kW | 230V / 1Ph / 50Hz | 1.5" BSP | 600 × 650 × 900 | 90 kg |
| WRD 200 S | 200 CFM | 340 | 1.25 kW | 230V / 1Ph / 50Hz | 1.5" BSP | 600 × 650 × 900 | 95 kg |
| WRD 250 S | 250 CFM | 425 | 1.65 kW | 230V / 1Ph / 50Hz | 2" BSP | 600 × 650 × 900 | 105 kg |
| WRD 300 S | 300 CFM | 510 | 1.65 kW | 230V / 1Ph / 50Hz | 2" BSP | 600 × 650 × 900 | 110 kg |
| WRD 400 S | 400 CFM | 680 | 2.20 kW | 230V / 1Ph / 50Hz | 2.5" BSP | 800 × 800 × 1100 | 180 kg |
| WRD 500 S | 500 CFM | 850 | 2.20 kW | 230V / 1Ph / 50Hz | 2.5" BSP | 800 × 800 × 1100 | 190 kg |
| WRD 600 S | 600 CFM | 1,020 | 3.50 kW | 415V / 3Ph / 50Hz | 3" Flange | 1200 × 850 × 1350 | 280 kg |
| WRD 750 S | 750 CFM | 1,275 | 3.50 kW | 415V / 3Ph / 50Hz | 3" Flange | 1200 × 850 × 1350 | 300 kg |
| WRD 1000 S | 1,000 CFM | 1,700 | 5.50 kW | 415V / 3Ph / 50Hz | 4" Flange | 1500 × 1000 × 1500 | 450 kg |
| WRD 1250 T | 1,250 CFM | 2,125 | 6.50 kW | 415V / 3Ph / 50Hz | 4" Flange | 1500 × 1000 × 1500 | 500 kg |
| WRD 1600 T | 1,600 CFM | 2,720 | 8.50 kW | 415V / 3Ph / 50Hz | 6" Flange | 1800 × 1200 × 1600 | 650 kg |
| WRD 2000 T | 2,000 CFM | 3,400 | 10.50 kW | 415V / 3Ph / 50Hz | 6" Flange | 1800 × 1200 × 1600 | 750 kg |

- **Engineering Selection Multipliers**:
  - `Sizing Formula: Required Dryer CFM = Compressor CFM ÷ (Cp × Ct × Ca)`
  - Pressure Multiplier ($C_p$): 4.0 bar (0.77), 5.0 bar (0.86), 6.0 bar (0.93), 7.0 bar (1.00), 10.0 bar (1.15), 14.0 bar (1.28).
  - Inlet Temp Multiplier ($C_t$): 30°C (1.20), 35°C (1.10), 40°C (1.00), 45°C (0.85), 50°C (0.72).
  - Ambient Temp Multiplier ($C_a$): 25°C (1.12), 30°C (1.06), 35°C (1.00), 40°C (0.90), 45°C (0.80).
- **Footer**: Win Equipments | Refrigerated Air Dryers • WRD Series | Page 3 of 4

### Page 4 — Applications, Competitor Benchmark & Contact / QR
- **Industrial Applications Grid**:
  - *Textile Spinning & Weaving*: Protects electronic yarn clearers, autoconers, and air-jet nozzles from moisture droplets and oil stains.
  - *CNC Machining Centers*: Guarantees dry pneumatic tool changing, spindle taper purging, and workholding chuck clamping.
  - *Automotive Clear-Coat Paint*: Prevents solvent popping, fisheyes, and moisture cratering in automated painting robots.
  - *Laser Cutting Assist Gas*: Protects expensive laser optics, cutting nozzles, and protective glass from oil vapor and fogging.
  - *PET Blow Molding*: Pre-treats high-pressure booster feeds, preventing water contamination in preform molds.
- **Competitor Benchmark Row**:
  - *Win WRD vs. Imported European Brands (Atlas Copco FX / Kaeser Secotec)*: Win WRD features oversized tropical condensing coils rated for 50°C Indian summer ambient conditions without de-rating, heavy-gauge powder-coated steel casing, zero-loss electronic drain as standard, and local Coimbatore spares availability at 40% lower operational lifecycle cost.
- **Contact Hygiene Block & QR Routing**:
  - Manufacturing Facility: SF No: 4, 195 B, Kallangadu, Arasur Post, Coimbatore – 641407, Tamil Nadu, India
  - Telephones: `+91 95972 28969` / `+91 95972 28975`
  - Email: `info@winequipments.com` | Website: `winequipments.com`
  - QR Code: Resolves to `https://winequipments.com/products/refrigerated-air-dryers.html`
- **Footer**: Win Equipments | Refrigerated Air Dryers • WRD Series | Page 4 of 4

---

```
================================================================================
PRODUCT 2: HEATLESS DESICCANT AIR DRYERS (WHD SERIES)
Output File: catlogue/Desiccant air dryer.pdf
================================================================================
```

### Page 1 — Cover
- **Header**: Win Equipments Corporate Header, Logo, Tagline "Save Water and Power", ISO 9001:2015, IAF & DAC Seals.
- **Series Identifier**: CRITICAL CLEAN AIR TREATMENT • WHD SERIES (300 TO 2,000 CFM)
- **Primary Title**: Heatless Twin-Tower Desiccant Air Dryers
- **Tagline**: Pressure Swing Adsorption (PSA) Technology Delivering Guaranteed -40°C to -70°C Pressure Dew Point for Ultra-Critical Applications.
- **Hero Image**: Hero photograph of `images/Products/dessicantdryer.png` (40%+ page area).
- **4 Key Performance Badges**:
  - `-40°C PDP`: ISO 8573-1 Class 2 Sub-Zero Moisture Standard (-70°C Class 1 Option)
  - `PSA CYCLE`: Automated 8-Minute Pressure Swing Adsorption
  - `ACTIVATED ALUMINA`: High-Crush Strength Spherical Media (>20% Water Retention)
  - `LOW NOISE`: Dual Heavy-Duty Depressurization Silencers (<75 dBA)
- **Footer**: Win Equipments | Desiccant Air Dryers • WHD Series | Page 1 of 4

### Page 2 — Working Principle & Engineering Advantages
- **Working Principle Narrative**: The WHD series operates on an automated Pressure Swing Adsorption (PSA) cycle utilizing dual vertical carbon steel pressure vessels. Wet compressed air passes upward through the online adsorbing tower, where spherical activated alumina desiccant traps water molecules within microscopic pores via van der Waals forces, dropping dew point to -40°C. Concurrently, 12–15% of dried effluent air is expanded to atmospheric pressure through an orifice into the off-line tower, stripping adsorbed moisture from the desiccant bed and exhausting through heavy-duty acoustic mufflers. An automated solid-state PLC controller cycles towers every 4 minutes (8-minute complete cycle) with controlled repressurization to prevent desiccant bed fluidization and dusting.
- **Engineering Advantages**:
  1. *High-Crush Strength Media*: 4–8mm spherical activated alumina desiccant with high surface area (>340 m²/g) and zero chemical dusting.
  2. *Angle-Seat Pneumatic Switching Valves*: Long-life actuator valves rated for >1,000,000 switching operations without seat leakage.
  3. *Dew Point Dependent Switching (DDS) Option*: In-line ceramic capacitive hygrometer delays tower changeover when inlet moisture load is low, cutting purge air loss from 15% to <5%.
  4. *Integrated Dual Filtration Package*: Upstream 0.01μ coalescing filter (residual oil <0.01 ppm) protects desiccant from oil fouling; downstream 1.0μ particulate filter protects process lines.
- **Footer**: Win Equipments | Desiccant Air Dryers • WHD Series | Page 2 of 4

### Page 3 — Engineering Specifications Matrix
- **Title**: WHD Series Technical Data (300 to 2,000 CFM)
- **Standard Ratings**: Operating pressure 7.0 to 16.0 bar g, Inlet air temp 35°C to 45°C, Outlet PDP -40°C (optional -70°C with 13X Molecular Sieve), Bed ΔP <0.25 bar.
- **Complete Specification Table**:

| Model Code | CFM | Flow m³/hr | Rated Pressure | Flange Connection | Control Voltage | Dimensions (L×W×H mm) | Weight kg |
|------------|-----|------------|----------------|-------------------|-----------------|-----------------------|-----------|
| WHD - 030 | 300 CFM | 510 | 7–16 bar g | 1½" NB Flange | 220V / 1Ph / 50Hz | 1450 × 1100 × 2500 | 450 kg |
| WHD - 040 | 400 CFM | 680 | 7–16 bar g | 2" NB Flange | 220V / 1Ph / 50Hz | 1450 × 1200 × 2500 | 630 kg |
| WHD - 050 | 500 CFM | 850 | 7–16 bar g | 3" NB Flange | 220V / 1Ph / 50Hz | 1650 × 1250 × 2300 | 720 kg |
| WHD - 060 | 600 CFM | 1,020 | 7–16 bar g | 3" NB Flange | 220V / 1Ph / 50Hz | 1650 × 1250 × 2500 | 910 kg |
| WHD - 075 | 750 CFM | 1,275 | 7–16 bar g | 3" NB Flange | 220V / 1Ph / 50Hz | 1800 × 1300 × 2600 | 1,120 kg |
| WHD - 100 | 1,000 CFM | 1,700 | 7–16 bar g | 4" NB Flange | 220V / 1Ph / 50Hz | 2000 × 1400 × 2700 | 1,450 kg |
| WHD - 150 | 1,500 CFM | 2,550 | 7–16 bar g | 5" NB Flange | 220V / 1Ph / 50Hz | 2300 × 1600 × 2900 | 2,100 kg |
| WHD - 200 | 2,000 CFM | 3,400 | 7–16 bar g | 6" NB Flange | 220V / 1Ph / 50Hz | 2600 × 1800 × 3100 | 2,850 kg |

- **Pressure Vessel Standards**: Fabricated to IS 2825 Class II and ASME Section VIII Division 1 with 100% radiographic weld testing, 1.5× hydrostatic pressure qualification, and third-party inspection certificates.
- **Footer**: Win Equipments | Desiccant Air Dryers • WHD Series | Page 3 of 4

### Page 4 — Applications, Benchmark & Contact / QR
- **Applications**: Pharmaceutical API bulk manufacturing, semiconductor and micro-electronics cleanrooms, cryogenic air separation plants, robotic clear-coat automotive painting, fiber laser cutting assist gas, offshore pneumatic instrumentation.
- **Competitor Benchmark**: Unlike standard commercial twin-tower dryers that use lightweight schedule piping and lossy manual drains, Win WHD provides heavy-wall ASME certified vessels, high-torque pneumatic angle seat valves, low-velocity bed distribution diffusing screen headers, and low-purge DDS control options.
- **Contact Hygiene Block**:
  - SF No: 4, 195 B, Kallangadu, Arasur Post, Coimbatore – 641407, Tamil Nadu, India
  - Phone: `+91 95972 28969` / `+91 95972 28975`
  - Email: `info@winequipments.com` | Website: `winequipments.com`
  - QR Code: Resolves to `https://winequipments.com/products/desiccant-air-dryers.html`
- **Footer**: Win Equipments | Desiccant Air Dryers • WHD Series | Page 4 of 4

---

```
================================================================================
PRODUCT 3: INDUSTRIAL PROCESS WATER CHILLERS (WCP SERIES)
Output File: catlogue/chiller.pdf
================================================================================
```

### Page 1 — Cover
- **Header**: Win Equipments Logo, Tagline "Save Water and Power", ISO 9001:2015, IAF & DAC Seals.
- **Series Identifier**: PROCESS THERMAL MANAGEMENT SYSTEMS • WCP SERIES (0.5 TO 50 TR)
- **Primary Title**: High-Precision Industrial Process Chillers
- **Tagline**: Packaged Closed-Loop Air & Water-Cooled Chillers with Integrated SS304 Buffer Reservoir & Stainless Centrifugal Circulation Pumps.
- **Hero Image**: Hero photo `images/Products/chiller.png` or `images/Products/Sodachiller.png`.
- **4 Key Performance Badges**:
  - `±0.5°C STABILITY`: Digital Microprocessor PID Regulation (+5°C to +25°C)
  - `SS304 BUFFER TANK`: 15L to 700L Internal Reservoir Dampens Thermal Spikes
  - `SCROLL / SCREW`: Copeland & Danfoss Hermetic Scroll Compressors
  - `ECO R410A / R407C`: Non-Ozone Depleting High-COP Refrigerants
- **Footer**: Win Equipments | Industrial Process Chillers • WCP Series | Page 1 of 4

### Page 2 — Working Principle & Engineering Advantages
- **Working Principle Narrative**: Closed-loop recirculating chillers engineered for continuous 24/7 industrial duty. High-efficiency Copeland or Danfoss hermetic scroll compressors circulate eco-friendly refrigerant through an air-cooled microchannel/fin-tube condenser (or water-cooled shell & tube condenser) and electronic expansion valve into a high-grade 316 stainless steel brazed plate evaporator. Process fluid is drawn from an oversized internal SS304 insulated buffer tank by an all-stainless centrifugal circulating pump, delivered to industrial heat sources at setpoint, and returned. The generous buffer volume absorbs sudden heat dumping from mold injection cycles or laser bursts, eliminating compressor short-cycling.
- **Key Engineering Advantages**:
  1. *Complete SS304 Wetted Hydronic Loop*: Buffer reservoir, evaporator plates, and pump impellers are non-ferrous stainless steel, preventing rust and particulate clogging in high-precision machinery.
  2. *Modulating Hot Gas Bypass*: Automatically modulates capacity down to 10% load, maintaining precise ±0.5°C setpoint stability without compressor hunting.
  3. *Dual Independent Circuits (≥15 TR)*: Incorporates two completely independent refrigeration circuits with dual compressors for N+1 operational reliability.
  4. *Digital Telemetry & Safety*: Microprocessor panel with RS-485 Modbus RTU communication, anti-freeze interlock, high/low pressure trips, and phase monitoring.
- **Footer**: Win Equipments | Industrial Process Chillers • WCP Series | Page 2 of 4

### Page 3 — Engineering Specifications Matrix
- **Title**: WCP Series Technical Data (0.5 to 50 TR)
- **Standard Ratings**: 12°C leaving water, 7°C delta T, 35°C ambient air temperature.

| Model Code | Capacity TR | Cooling kW | Comp Power kW | Supply Voltage | Water Flow LPM | Pump HP | Tank Liters | Connection Size |
|------------|-------------|------------|---------------|----------------|----------------|---------|-------------|-----------------|
| WCP 005 | 0.5 TR | 1.7 kW | 0.9 kW | 230V / 1Ph / 50Hz | 6 LPM | 0.5 HP | 15 L | 3/4" BSP |
| WCP 010 | 1.0 TR | 3.5 kW | 1.5 kW | 230V / 1Ph / 50Hz | 10 LPM | 0.5 HP | 25 L | 3/4" BSP |
| WCP 020 | 2.0 TR | 7.0 kW | 2.5 kW | 230V / 1Ph / 50Hz | 21 LPM | 0.75 HP | 40 L | 1" BSP |
| WCP 030 | 3.0 TR | 10.5 kW | 3.4 kW | 415V / 3Ph / 50Hz | 32 LPM | 1.0 HP | 60 L | 1" BSP |
| WCP 050 | 5.0 TR | 17.5 kW | 6.0 kW | 415V / 3Ph / 50Hz | 52 LPM | 1.5 HP | 80 L | 1.25" BSP |
| WCP 075 | 7.5 TR | 26.3 kW | 8.5 kW | 415V / 3Ph / 50Hz | 78 LPM | 2.0 HP | 120 L | 1.5" BSP |
| WCP 100 | 10.0 TR | 35.1 kW | 11.2 kW | 415V / 3Ph / 50Hz | 105 LPM | 3.0 HP | 160 L | 2" BSP |
| WCP 150 | 15.0 TR | 52.7 kW | 16.5 kW | 415V / 3Ph / 50Hz | 158 LPM | 3.0 HP | 250 L | 2" BSP |
| WCP 200 | 20.0 TR | 70.3 kW | 22.0 kW | 415V / 3Ph / 50Hz | 210 LPM | 5.0 HP | 350 L | 2.5" BSP |
| WCP 300 | 30.0 TR | 105.5 kW | 33.0 kW | 415V / 3Ph / 50Hz | 315 LPM | 7.5 HP | 450 L | 3" Flange |
| WCP 500 | 50.0 TR | 175.8 kW | 54.0 kW | 415V / 3Ph / 50Hz | 525 LPM | 10.0 HP | 700 L | 4" Flange |

*(Note: Custom engineered chillers available up to 150 TR with semi-hermetic screw compressors).*
- **Footer**: Win Equipments | Industrial Process Chillers • WCP Series | Page 3 of 4

### Page 4 — Applications, Benchmark & Contact / QR
- **Applications**: Plastic injection molding & extrusion tooling, high-power fiber laser resonators & optics, CNC electro-spindles, chemical reactor jacketing, brewery & dairy pasteurization, vacuum coating systems.
- **Competitor Benchmark**: Unlike imported European chillers with vulnerable copper evaporators and complex proprietary electronics, Win WCP includes an integrated SS304 buffer tank and stainless pump in a compact footprint, tropical condensers rated for 45°C ambient, and readily available Danfoss/Copeland components with pan-India service.
- **Contact Hygiene Block**:
  - SF No: 4, 195 B, Kallangadu, Arasur Post, Coimbatore – 641407, Tamil Nadu, India
  - Phone: `+91 95972 28969` / `+91 95972 28975`
  - Email: `info@winequipments.com` | Website: `winequipments.com`
  - QR Code: Resolves to `https://winequipments.com/products/industrial-process-chillers.html`
- **Footer**: Win Equipments | Industrial Process Chillers • WCP Series | Page 4 of 4

---

```
================================================================================
PRODUCT 4: SPECIALIZED PROCESS CHILLERS (WAN, WMS, WAC SERIES)
Output File: catlogue/specialized chillers.pdf
================================================================================
```

### Page 1 — Cover
- **Header**: Win Equipments Logo, Tagline "Save Water and Power", ISO 9001:2015, IAF & DAC Seals.
- **Series Identifier**: SEVERE CHEMICAL & HEALTHCARE THERMAL ENGINEERING
- **Primary Title**: Specialized Application Process Chillers
- **Tagline**: Custom Titanium Anodizing Chillers, N+1 Redundant Medical Scan Chillers & Severe Chemical Acid Cooling Systems.
- **Hero Image**: Hero photo `images/Products/electroplatingchiller.png` or `medicalchiller.png`.
- **3 Specialized Pillars Callout**:
  - `WAN SERIES`: Grade 2 Pure Titanium Anodizing Chillers (2 to 100+ TR)
  - `WMS SERIES`: Redundant N+1 Hospital MRI / CT Scan Chillers with City Water Auto-Bypass (3 to 30 TR)
  - `WAC SERIES`: Hastelloy C-276 / PTFE Severe Acid Process Chillers (2 to 150 TR)
- **Footer**: Win Equipments | Specialized Process Chillers | Page 1 of 4

### Page 2 — Titanium Anodizing Chillers (WAN Series)
- **Title**: WAN Series Pure Titanium Anodizing Chillers (2 to 100+ TR)
- **Working Principle & Metallurgy**: Architectural and hardcoat anodizing generates extreme exothermic heat during high-amperage DC rectification in 15–20% sulfuric acid baths. Win WAN chillers utilize Grade 2 pure Titanium seamless immersion drop-in coils or external Titanium plate heat exchangers. Sized to maintain Type II conventional anodizing at +18°C to +21°C, or Type III hardcoat anodizing at -2°C to +4°C with propylene glycol brine.
- **Rectifier Sizing Formula**: `Required TR = (Rectifier Volts × Amps × 3.412) / 12,000 × 1.15`
- **WAN Technical Table**:

| Model Code | Capacity TR | Cooling kW | Rectifier Current (15–18V) | Evaporator Metallurgy | Compressor Make | Acid Flow LPM | Refrigerant |
|------------|-------------|------------|----------------------------|-----------------------|-----------------|---------------|-------------|
| WAN 020 | 2.0 TR | 7.0 kW | Up to 350 A | Pure Titanium Gr. 2 Coil/PHE | Copeland Scroll | 25 LPM | R410A / R407C |
| WAN 030 | 3.0 TR | 10.5 kW | Up to 600 A | Pure Titanium Gr. 2 Coil/PHE | Copeland Scroll | 35 LPM | R410A / R407C |
| WAN 050 | 5.0 TR | 17.5 kW | Up to 1,000 A | Pure Titanium Gr. 2 Coil/PHE | Copeland Scroll | 55 LPM | R410A / R407C |
| WAN 075 | 7.5 TR | 26.3 kW | Up to 1,500 A | Pure Titanium Gr. 2 Coil/PHE | Copeland / Danfoss | 80 LPM | R410A / R407C |
| WAN 100 | 10.0 TR | 35.1 kW | Up to 2,000 A | Pure Titanium Gr. 2 Coil/PHE | Copeland / Danfoss | 110 LPM | R410A / R407C |
| WAN 150 | 15.0 TR | 52.7 kW | Up to 3,000 A | Pure Titanium Gr. 2 Coil/PHE | Dual Copeland Scroll | 160 LPM | R410A / R407C |
| WAN 200 | 20.0 TR | 70.3 kW | Up to 4,000 A | Pure Titanium Gr. 2 Coil/PHE | Dual Copeland / Danfoss | 215 LPM | R410A / R407C |
| WAN 300 | 30.0 TR | 105.5 kW | Up to 6,000 A | Pure Titanium Shell & Tube | Bitzer Semi-Hermetic | 320 LPM | R407C / R134a |
| WAN 500 | 50.0 TR | 175.8 kW | Up to 10,000 A | Pure Titanium Shell & Tube | Bitzer / Frascold Semi-Herm | 530 LPM | R407C / R134a |
| WAN 1000 | 100.0 TR | 351.6 kW | Up to 20,000 A | Pure Titanium Shell & Tube | Twin Semi-Herm / Screw | 1,050 LPM | R407C / R134a |

- **Footer**: Win Equipments | Specialized Process Chillers • WAN Series | Page 2 of 4

### Page 3 — Medical Scan Chillers (WMS Series)
- **Title**: WMS Series Clinical MRI, CT & Radiotherapy Chillers (3 to 30 TR)
- **Zero-Downtime Mission & Architecture**: Superconducting MRI magnets (GE, Siemens, Philips) rely on liquid helium cold heads. Chiller shutdown causes helium boil-off costing over ₹30 Lakhs. Win WMS chillers feature dual independent refrigeration circuits (2 × 100% or 2 × 50% capacity), dual SS316 pumps with auto-rotation, motorized city water emergency auto-bypass, and ultra-quiet acoustics (<65 dBA).
- **WMS Technical Table**:

| Model Code | Capacity TR | Cooling kW | Redundant Compressors | Dual SS316 Pumps | Flow Rating | Buffer Tank | Bypass Valve | Noise Level |
|------------|-------------|------------|-----------------------|------------------|-------------|-------------|--------------|-------------|
| WMS 030 | 3.0 TR | 10.5 kW | 2 × 1.5 TR Hermetic Scroll | 2 × 0.75 HP SS316 | 32 LPM @ 3.5 bar | 80 L SS304 | 1" Motorized | <62 dBA |
| WMS 050 | 5.0 TR | 17.5 kW | 2 × 2.5 TR Hermetic Scroll | 2 × 1.5 HP SS316 | 52 LPM @ 3.8 bar | 120 L SS304 | 1.25" Motorized | <63 dBA |
| WMS 075 | 7.5 TR | 26.3 kW | 2 × 3.8 TR Hermetic Scroll | 2 × 2.0 HP SS316 | 78 LPM @ 4.0 bar | 180 L SS304 | 1.5" Motorized | <64 dBA |
| WMS 100 | 10.0 TR | 35.1 kW | 2 × 5.0 TR Hermetic Scroll | 2 × 3.0 HP SS316 | 105 LPM @ 4.2 bar | 250 L SS304 | 1.5" Motorized | <65 dBA |
| WMS 150 | 15.0 TR | 52.7 kW | 2 × 7.5 TR Hermetic Scroll | 2 × 4.0 HP SS316 | 160 LPM @ 4.5 bar | 350 L SS304 | 2" Motorized | <66 dBA |
| WMS 200 | 20.0 TR | 70.3 kW | 2 × 10.0 TR Hermetic Scroll | 2 × 5.5 HP SS316 | 210 LPM @ 4.5 bar | 500 L SS304 | 2.5" Motorized | <67 dBA |
| WMS 300 | 30.0 TR | 105.5 kW | 2 × 15.0 TR Hermetic Scroll | 2 × 7.5 HP SS316 | 315 LPM @ 4.8 bar | 750 L SS304 | 3" Motorized | <68 dBA |

- **Footer**: Win Equipments | Specialized Process Chillers • WMS Series | Page 3 of 4

### Page 4 — Acid Cooling Chillers (WAC Series), Benchmark & Contact / QR
- **Title**: WAC Series Chemical Acid Process Chillers (2 to 150 TR)
- **Chemical Metallurgy**: Designed for pickling acid baths (HCl, H2SO4, HNO3), battery formation tanks, and exothermic chemical reactors. Built with Pure Titanium Gr. 2, Hastelloy C-276, or PTFE fluoropolymer heat exchangers and sealless PVDF magnetic drive pumps.
- **WAC Technical Table Summary**: Models WAC 020 (2 TR, 25 LPM) to WAC 1500 (150 TR, 1,650 LPM), Copeland scroll / Bitzer semi-hermetic / Hanbell screw compressors, eco R410A / R407C / R134a.
- **Competitor Benchmark**: Conventional chillers corrode within weeks in acid atmospheres. Win Equipments engineers custom metallurgy with 100% in-house titanium TIG welding, sealless pumps, and hermetic electrical cabinets with positive purge options.
- **Contact Hygiene Block**:
  - SF No: 4, 195 B, Kallangadu, Arasur Post, Coimbatore – 641407, Tamil Nadu, India
  - Phone: `+91 95972 28969` / `+91 95972 28975`
  - Email: `info@winequipments.com` | Website: `winequipments.com`
  - QR Code: Resolves to `https://winequipments.com/products/anodizing-chillers.html`
- **Footer**: Win Equipments | Specialized Process Chillers • WAC Series | Page 4 of 4

---

```
================================================================================
PRODUCT 5: INDUSTRIAL ICE FLAKE MACHINES (WFI SERIES)
Output File: catlogue/ice flake machine.pdf
================================================================================
```

### Page 1 — Cover
- **Header**: Win Equipments Logo, Tagline "Save Water and Power", ISO 9001:2015, IAF & DAC Seals.
- **Series Identifier**: COMMERCIAL & INDUSTRIAL ICE PLANTS • WFI SERIES (1 TO 30 TONS/DAY)
- **Primary Title**: Heavy-Duty Industrial Ice Flake Machines
- **Tagline**: Continuous Production of Sub-Cooled Dry Ice Flakes (-5°C to -8°C) with Stationary Vertical SUS304 Evaporator Drums & Bitzer Compressors.
- **Hero Image**: Hero photo `images/Products/ice-flake-machine.jpg` (extracted from PDF asset).
- **4 Key Performance Badges**:
  - `1–30 TPD`: Daily Ice Production Range (1,000 kg to 30,000 kg / 24h)
  - `-5°C TO -8°C`: Subcooled, Dry, Non-Clumping Flakes (1.5–2.2 mm)
  - `STATIONARY DRUM`: Zero Dynamic Rotary Seals, Zero Refrigerant Leaks
  - `SUS304 DRUM`: Food-Grade Stainless Steel Wetted Evaporator
- **Footer**: Win Equipments | Industrial Ice Flake Machines • WFI Series | Page 1 of 4

### Page 2 — Working Principle & Engineering Advantages
- **Working Principle Narrative**: Water is pumped from a lower stainless reservoir to an overhead rotary water distribution pan, spraying an even film onto the inner vertical wall of a stationary cylindrical evaporator drum. Low-temperature refrigerant evaporating inside the jacketed drum freezes the film instantly into sub-cooled ice (-5°C to -8°C). A high-strength stainless steel helical scraper blade, driven by a heavy-duty cycloidal gearmotor, rotates and cleanly shears the frozen sheet off the wall. The dry, brittle flakes drop through the open bottom into a storage bin or conveying screw.
- **Stationary Drum vs. Conventional Rotating Drum**: Conventional flake ice machines rotate the entire heavy drum, necessitating high-pressure mechanical rotary seals that inevitably fail and vent costly refrigerant. Win Equipments' stationary drum keeps all refrigerant piping 100% rigid and brazed—guaranteeing lifetime leak-free operation.
- **Key Engineering Advantages**:
  1. *Sub-Cooled Non-Clumping Flakes*: 1.5–2.2 mm thick flat flakes with no sharp edges provide 3× faster cooling contact than block ice without bruising fish skin or poultry meat.
  2. *Bitzer Semi-Hermetic / Screw Compressors*: Engineered for low evaporation temperatures (-22°C) with internal oil separators and electronic protection.
  3. *Water-Cooled Shell & Tube Condenser*: Highly cleanable condenser paired with a Win cooling tower ensures full tonnage even during 45°C tropical ambient weather.
  4. *Complete Turnkey Integration*: Compatible with Win stainless steel storage bunkers, automatic screw rakes, and cold rooms.
- **Footer**: Win Equipments | Industrial Ice Flake Machines • WFI Series | Page 2 of 4

### Page 3 — Engineering Specifications Matrix
- **Title**: WFI Series Technical Data (1 to 30 Tons/Day)
- **Standard Ratings**: Water inlet 20°C, Ambient air 35°C, Evaporation temp -22°C, Ice output temp -5°C to -8°C.

| Model Code | Daily Output TPD | Daily Output kg/24h | Power kW | Compressor Make & HP | Condenser Type | Water Inlet | Dimensions (L×W×H mm) |
|------------|------------------|---------------------|----------|----------------------|----------------|-------------|-----------------------|
| WFI 010 | 1 TPD | 1,000 kg | 4.8 kW | Danfoss / Bitzer (5 HP) | Air / Water Cooled | 1/2" BSP | 1350 × 1050 × 980 |
| WFI 020 | 2 TPD | 2,000 kg | 8.5 kW | Bitzer Semi-Hermetic (8.5 HP) | Water-Cooled Shell & Tube | 3/4" BSP | 1550 × 1200 × 1150 |
| WFI 030 | 3 TPD | 3,000 kg | 12.5 kW | Bitzer Semi-Hermetic (12 HP) | Water-Cooled Shell & Tube | 3/4" BSP | 1750 × 1350 × 1250 |
| WFI 050 | 5 TPD | 5,000 kg | 19.5 kW | Bitzer Semi-Hermetic (20 HP) | Water-Cooled Shell & Tube | 1" BSP | 2100 × 1500 × 1550 |
| WFI 100 | 10 TPD | 10,000 kg | 38.0 kW | Bitzer Semi-Hermetic (40 HP) | Water-Cooled Shell & Tube | 1.25" BSP | 2600 × 1800 × 1850 |
| WFI 150 | 15 TPD | 15,000 kg | 56.0 kW | Twin Bitzer Semi-Hermetic | Water-Cooled Shell & Tube | 1.5" BSP | 3200 × 2000 × 2100 |
| WFI 200 | 20 TPD | 20,000 kg | 74.0 kW | Bitzer Screw / Twin Recip | Water-Cooled Shell & Tube | 2" BSP | 3600 × 2200 × 2300 |
| WFI 300 | 30 TPD | 30,000 kg | 110.0 kW | Bitzer / Hanbell Screw | Water-Cooled Shell & Tube | 2.5" BSP | 4200 × 2400 × 2600 |

- **Footer**: Win Equipments | Industrial Ice Flake Machines • WFI Series | Page 3 of 4

### Page 4 — Applications, Benchmark & Contact / QR
- **Applications**: Commercial marine fisheries & fishing harbor cold storage, commercial poultry processing & abattoirs, mass concrete batching pre-cooling (dams, highway bridges, nuclear foundations), chemical dye synthesis & diazotization reactions, commercial bakery dough mixing.
- **Competitor Benchmark**: Compared to conventional rotating-drum ice generators that leak refrigerant within 12–18 months, Win WFI's stationary vertical drum, SUS304 food-grade construction, and Bitzer compressors deliver over 15 years of uninterrupted duty.
- **Contact Hygiene Block**:
  - SF No: 4, 195 B, Kallangadu, Arasur Post, Coimbatore – 641407, Tamil Nadu, India
  - Phone: `+91 95972 28969` / `+91 95972 28975`
  - Email: `info@winequipments.com` | Website: `winequipments.com`
  - QR Code: Resolves to `https://winequipments.com/products/ice-flake-machines.html`
- **Footer**: Win Equipments | Industrial Ice Flake Machines • WFI Series | Page 4 of 4

---

```
================================================================================
PRODUCT 6: ROUND & SQUARE COOLING TOWERS (WCT SERIES)
Output File: catlogue/Cooling-towers.pdf
================================================================================
```

### Page 1 — Cover
- **Header**: Win Equipments Logo, Tagline "Save Water and Power", ISO 9001:2015, IAF & DAC Seals.
- **Series Identifier**: EVAPORATIVE HEAT REJECTION SYSTEMS • WCT SERIES (10 TO 1,500 TR)
- **Primary Title**: Round & Square Induced-Draft FRP Cooling Towers
- **Tagline**: Aerodynamic Bottle Counterflow & Modular Square Crossflow Towers Engineered for Extreme Industrial Heat Loads.
- **Hero Image**: Hero photo `images/Products/coolingtower.png` (Round Bottle) and `Squarecoolingtower1.png` (Square Modular).
- **4 Key Performance Badges**:
  - `10–1,500 TR`: Capacity per Unit / Modular Multi-Cell Arrays
  - `CTI BASELINE`: 37°C In / 32°C Out @ 28°C Wet Bulb (4°C Approach)
  - `VIRGIN PVC`: High-Surface Honeycomb Film Fills (Resists up to 55°C)
  - `CORROSION PROOF`: Marine-Grade Isophthalic Polyester FRP Casing
- **Footer**: Win Equipments | Cooling Towers • WCT Series | Page 1 of 4

### Page 2 — Round Bottle Counterflow Towers (WCT-RL Series)
- **Title**: WCT-RL Round Bottle Counterflow Series (10 to 500 TR)
- **Working Principle & Architecture**: Aerodynamic cylindrical FRP casing minimizes internal air resistance. Hot process water enters a self-rotating aluminum alloy/brass sprinkler head rotating under water pressure, distributing a uniform blanket across thermoformed virgin PVC honeycomb fills. Air is drawn countercurrently from 360° bottom louvers by a direct-drive axial aerofoil fan, discharging saturated vapor vertically.
- **WCT-RL Technical Table (10 to 500 TR)**:

| Model Code | TR | Water Flow m³/hr | Motor HP | Fan RPM | Fan Dia mm | In/Out Pipe | Dimensions (Dia × H mm) | Oper Wt kg |
|------------|----|------------------|----------|---------|------------|-------------|-------------------------|------------|
| WCT 010 RL | 10 TR | 6 m³/hr | 0.5 HP | 1440 | 450 mm | 1½" / 1½" | Ø 930 × H 1690 | 280 kg |
| WCT 015 RL | 15 TR | 9 m³/hr | 0.5 HP | 1440 | 500 mm | 1½" / 1½" | Ø 1030 × H 1740 | 340 kg |
| WCT 020 RL | 20 TR | 12 m³/hr | 0.75 HP | 1440 | 550 mm | 2" / 2" | Ø 1130 × H 1800 | 410 kg |
| WCT 030 RL | 30 TR | 18 m³/hr | 1.0 HP | 1440 | 650 mm | 2" / 2" | Ø 1330 × H 1920 | 550 kg |
| WCT 050 RL | 50 TR | 30 m³/hr | 1.5 HP | 960 | 800 mm | 2½" / 2½" | Ø 1650 × H 2150 | 850 kg |
| WCT 075 RL | 75 TR | 45 m³/hr | 2.0 HP | 960 | 950 mm | 3" / 3" | Ø 1950 × H 2300 | 1,250 kg |
| WCT 100 RL | 100 TR | 60 m³/hr | 3.0 HP | 960 | 1100 mm | 4" / 4" | Ø 2250 × H 2500 | 1,650 kg |
| WCT 150 RL | 150 TR | 90 m³/hr | 5.0 HP | 960 | 1350 mm | 5" / 5" | Ø 2750 × H 2800 | 2,400 kg |
| WCT 200 RL | 200 TR | 120 m³/hr | 7.5 HP | 720 | 1550 mm | 6" / 6" | Ø 3150 × H 3100 | 3,200 kg |
| WCT 300 RL | 300 TR | 180 m³/hr | 10.0 HP | 720 | 1900 mm | 8" / 8" | Ø 3850 × H 3500 | 4,800 kg |
| WCT 500 RL | 500 TR | 300 m³/hr | 15.0 HP | 720 | 2400 mm | 10" / 10" | Ø 4800 × H 4100 | 7,800 kg |

- **Footer**: Win Equipments | Cooling Towers • WCT-RL Series | Page 2 of 4

### Page 3 — Square Modular Crossflow Towers (WCT-SL Series)
- **Title**: WCT-SL Square Modular Crossflow Series (10 to 500 TR per cell)
- **Working Principle & Architecture**: Rectangular pultruded FRP frame with hanging PVC fill packs. Features unpressurized open gravity distribution basins on top with metering orifices, allowing maintenance technicians to inspect and clean basins during active operation without turning off circulation pumps. Includes walk-in internal access doors. Cells can be clustered side-by-side up to 2,000 TR.
- **WCT-SL Technical Table (10 to 500 TR)**:

| Model Code | TR | Water Flow m³/hr | Motor HP | Air Flow CFM | In/Out Pipe | Dimensions (L×W×H mm) | Oper Wt kg |
|------------|----|------------------|----------|--------------|-------------|-----------------------|------------|
| WCT 010 SL | 10 TR | 6 m³/hr | 0.5 HP | 2,500 CFM | 1½" / 1½" | 930 × 930 × 1690 | 280 kg |
| WCT 015 SL | 15 TR | 9 m³/hr | 0.5 HP | 3,200 CFM | 1½" / 1½" | 1030 × 1030 × 1740 | 340 kg |
| WCT 020 SL | 20 TR | 12 m³/hr | 0.75 HP | 4,200 CFM | 2" / 2" | 1130 × 1130 × 1800 | 410 kg |
| WCT 030 SL | 30 TR | 18 m³/hr | 1.0 HP | 6,000 CFM | 2" / 2" | 1330 × 1330 × 1920 | 550 kg |
| WCT 050 SL | 50 TR | 30 m³/hr | 1.5 HP | 9,500 CFM | 2½" / 2½" | 1650 × 1650 × 2150 | 850 kg |
| WCT 075 SL | 75 TR | 45 m³/hr | 2.0 HP | 14,000 CFM | 3" / 3" | 1950 × 1950 × 2300 | 1,250 kg |
| WCT 100 SL | 100 TR | 60 m³/hr | 3.0 HP | 18,500 CFM | 4" / 4" | 2250 × 2250 × 2500 | 1,650 kg |
| WCT 150 SL | 150 TR | 90 m³/hr | 5.0 HP | 27,000 CFM | 5" / 5" | 2750 × 2750 × 2800 | 2,400 kg |
| WCT 200 SL | 200 TR | 120 m³/hr | 7.5 HP | 35,000 CFM | 6" / 6" | 3150 × 3150 × 3100 | 3,200 kg |
| WCT 300 SL | 300 TR | 180 m³/hr | 10.0 HP | 52,000 CFM | 8" / 8" | 3850 × 3850 × 3500 | 4,800 kg |
| WCT 500 SL | 500 TR | 300 m³/hr | 15.0 HP | 85,000 CFM | 10" / 10" | 4800 × 4800 × 4100 | 7,800 kg |

- **Footer**: Win Equipments | Cooling Towers • WCT-SL Series | Page 3 of 4

### Page 4 — Applications, Benchmark & Contact / QR
- **Applications**: Plastic injection molding and blow molding machines, water-cooled screw air compressors, induction melting furnace jackets, diesel generator jacket cooling, chemical and pharmaceutical process condensers, central HVAC chiller plants.
- **Competitor Benchmark**: Unlike low-grade commercial towers using brittle recycled PVC fills and thin orthophthalic resin, Win Equipments uses heavy-gauge isophthalic resin infused with UV inhibitors, 100% virgin thermoformed PVC fills rated to 55°C, and stainless steel hardware for a 20+ year outdoor service life.
- **Contact Hygiene Block**:
  - SF No: 4, 195 B, Kallangadu, Arasur Post, Coimbatore – 641407, Tamil Nadu, India
  - Phone: `+91 95972 28969` / `+91 95972 28975`
  - Email: `info@winequipments.com` | Website: `winequipments.com`
  - QR Code: Resolves to `https://winequipments.com/products/round-cooling-towers.html`
- **Footer**: Win Equipments | Cooling Towers • WCT Series | Page 4 of 4

---

```
================================================================================
PRODUCT 7: COIL / CLOSED CIRCUIT COOLING TOWERS (WCC SERIES)
Output File: catlogue/Coil cooling tower.pdf
================================================================================
```

### Page 1 — Cover
- **Header**: Win Equipments Logo, Tagline "Save Water and Power", ISO 9001:2015, IAF & DAC Seals.
- **Series Identifier**: CRITICAL CLOSED-LOOP THERMAL REJECTION • WCC SERIES (40 TO 150 TR)
- **Primary Title**: Closed Circuit Evaporative Coil Cooling Towers
- **Tagline**: 100% Contamination-Free Indirect Cooling for Induction Furnaces, Continuous Casters & Vacuum Furnaces.
- **Hero Image**: Hero photo `images/Products/coilcooling.png` or `coilcooling2.png`.
- **4 Key Performance Badges**:
  - `100% CLOSED LOOP`: Zero Airborne Dust, Zero Scaling, Zero Process Water Fouling
  - `HDG / SS304 COILS`: Heavy-Duty Seamless Tubes Tested to 2.5 MPa (25 bar g)
  - `INDIRECT EVAPORATIVE`: High Heat Rejection with Minimal Water Consumption
  - `<0.005% DRIFT`: High-Efficiency Cellular Drift Eliminators
- **Footer**: Win Equipments | Closed Circuit Cooling Towers • WCC Series | Page 1 of 4

### Page 2 — Working Principle & Engineering Advantages
- **Working Principle Narrative**: Process fluid (demineralized water, glycol, or quench fluid) circulates exclusively inside a heavy-duty prime-surface serpentine heat exchange bundle, completely isolated from airborne contaminants. A secondary spray water circuit draws water from the tower basin and deluges the outer surface of the coils via non-clog nozzles. Induced-draft axial fans pull ambient air across the wet coils, causing a small portion of the spray water to evaporate. This sensible and latent heat transfer cools the internal process fluid without exposing it to atmospheric dirt, algae, or lime scale.
- **Key Engineering Advantages**:
  1. *Complete Elimination of Furnace Coil Scaling*: Prevents lime scale formation inside costly copper induction coils, thyristor heat sinks, and water jackets, preventing furnace coil burnouts.
  2. *Hot-Dip Galvanized / SUS304 Coil Metallurgy*: Entire serpentine steel bundle is hot-dip galvanized to ASTM A123 after fabrication, coating both external tubes and tube bends with a thick zinc barrier (optional 100% SUS304/SUS316L for DI loops).
  3. *Dual High-Efficiency Fans*: Redundant dual axial fans run at low speed (720–960 RPM) for quiet operation and lower electrical draw.
  4. *Low Make-Up Water Consumption*: Recirculating spray water deluge system consumes only evaporative make-up water, cutting industrial water consumption by over 90% compared to open once-through systems.
- **Footer**: Win Equipments | Closed Circuit Cooling Towers • WCC Series | Page 2 of 4

### Page 3 — Engineering Specifications Matrix
- **Title**: WCC Series Technical Data (40 to 150 TR)
- **Standard Ratings**: Entering fluid 37°C, Leaving fluid 32°C, Wet-bulb temp 28°C, Coil test pressure 2.5 MPa (25 bar g).

| Model Code | Capacity TR | Fan Motors | Fan RPM | Fan Dia mm | In/Out Pipe NB | Internal Coil Volume | Dimensions (L×W×H mm) |
|------------|-------------|------------|---------|------------|----------------|----------------------|-----------------------|
| WCC 40 | 40 TR | 3.0 HP × 2 | 960 RPM | 1060 mm | 3" / 3" | 72 Liters | 3300 × 1500 × 1400 |
| WCC 50 | 50 TR | 3.0 HP × 2 | 960 RPM | 1060 mm | 3" / 3" | 90 Liters | 3300 × 1700 × 1400 |
| WCC 60 | 60 TR | 5.0 HP × 2 | 960 RPM | 1060 mm | 3" / 3" | 110 Liters | 3500 × 1500 × 1400 |
| WCC 75 | 75 TR | 3.0 HP × 2 | 960 RPM | 1060 mm | 4" / 4" | 135 Liters | 3300 × 2000 × 1400 |
| WCC 80 | 80 TR | 5.0 HP × 2 | 960 RPM | 1200 mm | 4" / 4" | 150 Liters | 3300 × 1500 × 1700 |
| WCC 100 | 100 TR | 5.0 HP × 2 | 960 RPM | 1200 mm | 4" / 4" | 180 Liters | 3600 × 2400 × 1600 |
| WCC 150 | 150 TR | 7.5 HP × 2 | 720 RPM | 1400 mm | 6" / 6" | 270 Liters | 4200 × 2800 × 1800 |

- **Footer**: Win Equipments | Closed Circuit Cooling Towers • WCC Series | Page 3 of 4

### Page 4 — Applications, Benchmark & Contact / QR
- **Applications**: Steel and non-ferrous induction melting & heating furnaces, continuous casting machines (CCM), vacuum heat treatment furnaces, high-power fiber laser resonators, high-frequency induction hardening machines, power plant turbine oil coolers.
- **Competitor Benchmark**: Imported closed-circuit towers (BAC, Evapco) carry immense import duties, long lead times, and expensive replacement coils. Win WCC delivers identical closed-loop thermal rejection with robust Indian-manufactured heavy-gauge steel and fiberglass, supported by Coimbatore engineers.
- **Contact Hygiene Block**:
  - SF No: 4, 195 B, Kallangadu, Arasur Post, Coimbatore – 641407, Tamil Nadu, India
  - Phone: `+91 95972 28969` / `+91 95972 28975`
  - Email: `info@winequipments.com` | Website: `winequipments.com`
  - QR Code: Resolves to `https://winequipments.com/products/closed-circuit-cooling-towers.html`
- **Footer**: Win Equipments | Closed Circuit Cooling Towers • WCC Series | Page 4 of 4

---

```
================================================================================
PRODUCT 8: AIR RECEIVER BUFFER TANKS (WRV SERIES)
Output File: catlogue/Air-Receiver.pdf
================================================================================
```

### Page 1 — Cover
- **Header**: Win Equipments Logo, Tagline "Save Water and Power", ISO 9001:2015, IAF & DAC Seals.
- **Series Identifier**: PNEUMATIC ENERGY STORAGE VESSELS • WRV SERIES (250 TO 10,000 L)
- **Primary Title**: Industrial Air Receiver Buffer Tanks
- **Tagline**: Vertical & Horizontal Boiler-Quality Carbon Steel Vessels Certified to IS 2825 Class II & ASME Section VIII Div 1.
- **Hero Image**: Hero photo `images/Products/Airreciever.png` (40%+ page area).
- **4 Key Performance Badges**:
  - `IS 2825 / ASME VIII`: Certified Pressure Vessel Design Standards
  - `1.5× HYDRO TEST`: Hydrostatically Qualified with 60-Minute Dwell
  - `SA 516 GR. 70`: Certified Boiler-Quality High-Tensile Carbon Steel Plate
  - `SAFETY KIT INCLUDED`: Calibrated Gauge, ASME Safety Valve & Drain Cock
- **Footer**: Win Equipments | Air Receiver Tanks • WRV Series | Page 1 of 4

### Page 2 — Working Principle & Engineering Fabrication Rigor
- **Working Principle Narrative**: Air receiver tanks act as a pneumatic flywheel in compressed air systems. Positioned downstream of compressors, they dampen pressure pulsations from reciprocating or screw compressors, provide buffer storage during sudden surges in pneumatic consumption, prevent compressor motor short-cycling, and allow air to cool and precipitate bulk moisture before reaching dryers and filters.
- **Fabrication & Quality Standards**:
  1. *Submerged Arc Welding (SAW)*: Automatic SAW longitudinal and circumferential weld seams ensure uniform penetration and eliminate manual welding defects.
  2. *Torispherical Dished Ends*: Precision 2:1 semi-ellipsoidal pressed and flanged dished ends distribute pressure stress evenly across vessel walls.
  3. *Corrosion Protection*: Grit blasted to SA 2.5 followed by high-build anti-corrosive epoxy primer and polyurethane finish. Internal epoxy lining available for wet sumps.
  4. *Complete Certified Accessories Kit*: Dispatched with an ASME-compliant spring-loaded safety relief valve, calibrated dial glycerine pressure gauge, and bottom manual drain ball valve.
- **Footer**: Win Equipments | Air Receiver Tanks • WRV Series | Page 2 of 4

### Page 3 — Engineering Specifications Matrix
- **Title**: WRV Series Technical Data (250 to 1,000 Liters Standard Models)
- **Design Standards**: IS 2825 Class II / ASME Sec VIII Div 1, 100% NDT Radiography on T-joints, 1.5× Hydrostatic Test.

| Model Code | Capacity Liters | Working Pressure | Design Pressure | Hydro Test Pressure | Outer Dia mm | Height mm | Connection Size | Inspection Access |
|------------|-----------------|------------------|-----------------|---------------------|--------------|-----------|-----------------|-------------------|
| WRV 025 (7 bar) | 250 L | 7.0 bar g | 8.0 bar g | 12.0 bar g | 490 mm | 1,620 mm | 3/4" BSP | Hand Hole |
| WRV 025 (10 bar)| 250 L | 10.0 bar g | 11.0 bar g | 16.5 bar g | 490 mm | 1,620 mm | 3/4" BSP | Hand Hole |
| WRV 050 (7 bar) | 500 L | 7.0 bar g | 8.0 bar g | 12.0 bar g | 650 mm | 1,850 mm | 1" BSP | Hand Hole |
| WRV 050 (10 bar)| 500 L | 10.0 bar g | 11.0 bar g | 16.5 bar g | 650 mm | 1,850 mm | 1" BSP | Hand Hole |
| WRV 050 (16 bar)| 500 L | 16.0 bar g | 17.6 bar g | 26.4 bar g | 650 mm | 1,850 mm | 1" BSP | Hand Hole |
| WRV 100 (7 bar) | 1,000 L | 7.0 bar g | 8.0 bar g | 12.0 bar g | 850 mm | 2,150 mm | 1.5" BSP | Man Hole |
| WRV 100 (10 bar)| 1,000 L | 10.0 bar g | 11.0 bar g | 16.5 bar g | 850 mm | 2,150 mm | 1.5" BSP | Man Hole |
| WRV 100 (16 bar)| 1,000 L | 16.0 bar g | 17.6 bar g | 26.4 bar g | 850 mm | 2,150 mm | 1.5" BSP | Man Hole |

*(Note: Custom engineered vertical and horizontal vessels available up to 10,000 Liters and pressures up to 40 bar g for PET blow molding, as well as SUS304 / SUS316L stainless steel vessels for food and pharma).*
- **Footer**: Win Equipments | Air Receiver Tanks • WRV Series | Page 3 of 4

### Page 4 — Applications, Benchmark & Contact / QR
- **Applications**: Central compressor room buffer storage, PET bottle blow molding (high pressure 40 bar), cement and fly ash pneumatic conveying systems, textile weaving mill airjet loom lines, laser cutting assist gas accumulators.
- **Competitor Benchmark**: Unlike uncertified fabricators who use scrap plate and skip radiographic testing, Win Equipments uses 100% mill-certified boiler quality steel, automatic SAW welding, and provides stamped third-party inspection (TPI) hydro-test certificates with every vessel.
- **Contact Hygiene Block**:
  - SF No: 4, 195 B, Kallangadu, Arasur Post, Coimbatore – 641407, Tamil Nadu, India
  - Phone: `+91 95972 28969` / `+91 95972 28975`
  - Email: `info@winequipments.com` | Website: `winequipments.com`
  - QR Code: Resolves to `https://winequipments.com/products/air-receiver-tanks.html`
- **Footer**: Win Equipments | Air Receiver Tanks • WRV Series | Page 4 of 4

---

```
================================================================================
PRODUCT 9: COMPRESSED AIR LINE FILTERS (WMF SERIES)
Output File: catlogue/Filters.pdf
================================================================================
```

### Page 1 — Cover
- **Header**: Win Equipments Logo, Tagline "Save Water and Power", ISO 9001:2015, IAF & DAC Seals.
- **Series Identifier**: COMPRESSED AIR PURIFICATION • WMF SERIES (40 TO 1,000 CFM)
- **Primary Title**: High-Efficiency In-Line Compressed Air Filters
- **Tagline**: Multi-Grade Particulate, Coalescing & Activated Carbon Adsorption Filters Delivering ISO 8573-1 Class 1 Air Quality.
- **Hero Image**: Hero photo `images/Products/compressedairfilters.png`.
- **4 Key Performance Badges**:
  - `0.01 MICRON`: High-Efficiency Microglass Borosilicate Filtration
  - `<0.003 PPM`: Residual Oil Aerosol Down to Food/Pharma Cleanliness
  - `DIE-CAST ALUMINUM`: Corrosion-Resistant Powder Coated Housing (16 bar g)
  - `DP INDICATOR`: Differential Pressure Visual Monitoring Gauge
- **Footer**: Win Equipments | Compressed Air Filters • WMF Series | Page 1 of 4

### Page 2 — Filtration Principles & Sequential Filter Grades
- **Working Principle Narrative**: Saturated compressed air carries liquid water, oil aerosols, atmospheric dust, and pipe scale. WMF series in-line filters utilize pleated borosilicate micro-glass filter elements with a 96% void volume. Solid particles are trapped via direct interception and inertial impaction, while oil and water aerosols are coalesced into droplets via Brownian diffusion and gravity-drained into the sump, evacuating via an automatic float drain.
- **4 Sequential Filtration Grades**:
  1. *Grade P (Coarse Pre-Filter)*: 3.0 micron particulate removal; removes bulk liquid water droplets, rust scale, and large dust.
  2. *Grade X / Grade G (Particulate Filter)*: 1.0 micron filtration; residual oil content <0.5 mg/m³ (0.5 ppm).
  3. *Grade Y / Grade C (Fine Coalescing Filter)*: 0.01 micron filtration; residual oil content <0.01 mg/m³ (0.01 ppm).
  4. *Grade A / Grade V (Activated Carbon Vapor Filter)*: 0.003 micron adsorption bed; removes oil vapors and hydrocarbon odors down to <0.003 mg/m³ for direct food, dairy, and breathing air contact.
- **Engineering Features**:
  - Modular tie-rod coupling brackets allowing multi-filter combination banks (e.g., Grade P + Grade Y + Grade A).
  - Built-in automatic float drain valve (or zero air loss capacitive drain integration).
  - Pop-up differential pressure indicator signalling element saturation.
- **Footer**: Win Equipments | Compressed Air Filters • WMF Series | Page 2 of 4

### Page 3 — Engineering Specifications Matrix
- **Title**: WMF Series Technical Data (40 to 1,000 CFM)
- **Standard Ratings**: Operating pressure 7.0 bar g, Max body pressure 16.0 bar g, Operating temp 1.5°C to 65°C.

| Model Code | Nominal CFM | Flow Rate m³/hr | Port Connection BSP | Available Grades | Housing Material | Standard Drain |
|------------|-------------|-----------------|---------------------|------------------|------------------|----------------|
| WMF 004 | 40 CFM | 68.5 m³/hr | 1/2" BSP | Grade P, X, Y, A | Die-Cast Aluminum | Auto Float Drain |
| WMF 008 | 80 CFM | 136 m³/hr | 3/4" BSP | Grade P, X, Y, A | Die-Cast Aluminum | Auto Float Drain |
| WMF 012 | 120 CFM | 204 m³/hr | 1" BSP | Grade P, X, Y, A | Die-Cast Aluminum | Auto Float Drain |
| WMF 016 | 160 CFM | 272 m³/hr | 1" BSP | Grade P, X, Y, A | Die-Cast Aluminum | Auto Float Drain |
| WMF 020 | 200 CFM | 340 m³/hr | 1.5" BSP | Grade P, X, Y, A | Die-Cast Aluminum | Auto Float Drain |
| WMF 030 | 300 CFM | 510 m³/hr | 1.5" BSP | Grade P, X, Y, A | Die-Cast Aluminum | Auto Float Drain |
| WMF 050 | 500 CFM | 850 m³/hr | 2" BSP | Grade P, X, Y, A | Die-Cast Aluminum | Auto Float Drain |
| WMF 065 | 650 CFM | 1,105 m³/hr | 2.5" BSP | Grade P, X, Y, A | Die-Cast Aluminum | Auto Float Drain |
| WMF 080 | 800 CFM | 1,360 m³/hr | 3" BSP | Grade P, X, Y, A | Die-Cast Aluminum | Auto Float Drain |
| WMF 100 | 1,000 CFM | 1,700 m³/hr | 3" BSP | Grade P, X, Y, A | Die-Cast Aluminum | Auto Float Drain |

*(Note: Custom fabricated carbon steel and SS316 flanged filters available up to 5,000 CFM and 40 bar g).*
- **Footer**: Win Equipments | Compressed Air Filters • WMF Series | Page 3 of 4

### Page 4 — Applications, Benchmark & Contact / QR
- **Applications**: High-precision fiber laser cutting heads, pharmaceutical blister packaging and fluidics, automotive spray paint booths, hospital surgical air systems, electronics assembly lines, food and beverage packaging lines.
- **Competitor Benchmark**: Compared to imported filter brands (Parker Domnick Hunter, Donaldson) with costly proprietary replacement cartridges, Win WMF housings utilize universal ISO standard element geometry with premium borosilicate media, cutting ongoing element replacement costs by over 50%.
- **Contact Hygiene Block**:
  - SF No: 4, 195 B, Kallangadu, Arasur Post, Coimbatore – 641407, Tamil Nadu, India
  - Phone: `+91 95972 28969` / `+91 95972 28975`
  - Email: `info@winequipments.com` | Website: `winequipments.com`
  - QR Code: Resolves to `https://winequipments.com/products/compressed-air-filters.html`
- **Footer**: Win Equipments | Compressed Air Filters • WMF Series | Page 4 of 4

---

```
================================================================================
PRODUCT 10: AUTOMATIC DRAIN VALVES (WADV SERIES)
Output File: catlogue/Automatic-Drain-Valve.pdf
================================================================================
```

### Page 1 — Cover
- **Header**: Win Equipments Logo, Tagline "Save Water and Power", ISO 9001:2015, IAF & DAC Seals.
- **Series Identifier**: CONDENSATE DISCHARGE SYSTEMS • WADV SERIES
- **Primary Title**: Automatic Zero Air Loss & Electronic Timer Drain Valves
- **Tagline**: High-Reliability Condensate Evacuation for Air Receivers, Dryers, Filters & Drop Legs Up to 40 bar g.
- **Hero Image**: Hero photo `images/Products/drainvalve.png`.
- **4 Key Performance Badges**:
  - `ZERO AIR LOSS`: Capacitive Level Detection Discharges Condensate with 0 CFM Air Loss
  - `FORGED BRASS BODY`: Heavy-Duty Industrial Construction Rated up to 16/40 bar g
  - `IP65 ENCLOSURE`: Waterproof & Dust-Tight Protection for Harsh Plant Floors
  - `INTEGRATED STRAINER`: Stainless Steel Mesh Strainer Prevents Orifice Clogging
- **Footer**: Win Equipments | Automatic Drain Valves • WADV Series | Page 1 of 4

### Page 2 — Working Principles & Energy Economics
- **Working Principles Narrative**:
  1. *Capacitive Zero-Air-Loss Drain (WADV-Z16)*: Uses a contactless electronic capacitive sensor to detect water levels inside an aluminum reservoir. When condensate reaches the high level, a pilot solenoid valve lifts a diaphragm, discharging only liquid water. The valve reseats before any compressed air can escape.
  2. *Electronic Timer Drain (WADV-T16)*: Features an adjustable solid-state cycle timer (0.5–10 sec ON / 0.5–45 min OFF) driving a heavy-duty direct-acting solenoid valve with manual test button and isolation ball-valve strainer.
- **Energy Payback Analysis**:
  - A cracked manual 1/4" drain valve left open to bleed water continuously blows approximately 28 CFM of compressed air at 7 bar. At typical compressor power of 0.2 kW/CFM, this wastes ~5.6 kW continuously, costing over ₹1,20,000 annually.
  - Even a timer drain blowing 4 CFM during its blast cycle wastes ~₹38,000 annually.
  - Installing a Win WADV-Z16 zero-air-loss valve completely eliminates air waste, paying for itself in under 3 weeks.
- **Key Engineering Features**:
  - Non-mechanical capacitive sensing—no moving floats to jam with oil emulsion or sludge.
  - Built-in stainless mesh strainer traps rust scale and pipe debris before reaching valve seat.
  - Integrated manual override test button.
- **Footer**: Win Equipments | Automatic Drain Valves • WADV Series | Page 2 of 4

### Page 3 — Engineering Specifications Matrix
- **Title**: WADV Series Technical Data & Selection Matrix
- **Operating Pressure Range**: 0 to 40 bar g.

| Model Code | Technology Mechanism | Operating Pressure | Port Size | Discharge Cycle Timing | Electrical Supply | Compressed Air Loss | Body Material |
|------------|----------------------|--------------------|-----------|------------------------|-------------------|---------------------|---------------|
| WADV-T16 | Electronic Timer Solenoid | 0 to 16 bar g | 1/2" BSP Female | 0.5–10s ON / 0.5–45m OFF adj. | 230V AC / 1Ph / 50Hz | ~4 CFM during blast | Forged Brass |
| WADV-Z16 | Capacitive Zero-Air-Loss | 0.8 to 16 bar g | 1/2" BSP Female | Automatic Level Sensing | 230V AC or 24V DC | 0.0 CFM (Zero Air Loss) | Forged Brass / Aluminum |
| WADV-HP40 | High-Pressure Timer Drain | 0 to 40 bar g | 1/2" BSP Female | 0.5–10s ON / 0.5–45m OFF adj. | 230V AC / 1Ph / 50Hz | High-Pressure Rated | Stainless Steel / Brass |

- **Footer**: Win Equipments | Automatic Drain Valves • WADV Series | Page 3 of 4

### Page 4 — Applications, Benchmark & Contact / QR
- **Applications**: Air receiver bottom drains, refrigerated dryer internal moisture separators, coalescing filter bowls, intercooler and aftercooler drains, compressed air header drop legs.
- **Competitor Benchmark**: Cheap unbranded timer drains feature thin plastic housings, no strainers, and fail stuck-open, rapidly depressurizing entire plant air headers. Win WADV valves feature forged brass construction, high-power IP65 solenoid coils, and built-in stainless strainers for rugged industrial reliability.
- **Contact Hygiene Block**:
  - SF No: 4, 195 B, Kallangadu, Arasur Post, Coimbatore – 641407, Tamil Nadu, India
  - Phone: `+91 95972 28969` / `+91 95972 28975`
  - Email: `info@winequipments.com` | Website: `winequipments.com`
  - QR Code: Resolves to `https://winequipments.com/products/automatic-drain-valves.html`
- **Footer**: Win Equipments | Automatic Drain Valves • WADV Series | Page 4 of 4

---

## 8. Master E-Catalogue Blueprint (16 Pages)

The Master E-Catalogue (`catlogue/E_Catalogue.pdf`) is the flagship publication of Win Equipments. Architected across **16 pages**, it provides a complete overview of corporate capabilities, turnkey engineering, quality systems, and all product lines.

```
================================================================================
MASTER E-CATALOGUE: 16-PAGE PUBLICATION BLUEPRINT
Output File: catlogue/E_Catalogue.pdf
================================================================================
```

### Page 1 — Master Corporate Cover
- **Brand Header**: Win Equipments Navy Banner, Primary Corporate Logo (`images/logo.png`), Tagline "Save Water and Power".
- **Badges**: ISO 9001:2015 Seal (`images/iso.png`), IAF Logo (`images/iaf.png`), DAC Accreditation (`images/dac.png`).
- **Main Title**: MASTER ENGINEERING E-CATALOGUE
- **Subtitle**: Industrial Compressed Air Treatment, Process Water Chillers & Evaporative Cooling Towers
- **Visual Centerpiece**: Master hero collage composed of 4 key machines: Refrigerated Dryer (`Refrigiratedairdryer1.png`), Process Chiller (`chiller.png`), FRP Cooling Tower (`coolingtower.png`), and Air Receiver Tank (`Airreciever.png`).
- **Pillar Highlights Box**:
  - *Air Treatment*: Refrigerated Dryers (20–2000 CFM), Desiccant Dryers (-40°C PDP), In-Line Microfilters, Zero-Loss Drains.
  - *Process Thermal Management*: Air & Water Cooled Chillers (0.5–150 TR), Titanium Anodizing & Medical Scan Chillers, Ice Flake Plants (1–30 TPD).
  - *Evaporative Heat Rejection*: Round Bottle & Square Crossflow FRP Towers (10–1500 TR), Closed-Circuit Coil Towers (10–500 TR).
- **Corporate Metadata**: SF No: 4, 195 B, Kallangadu, Arasur Post, Coimbatore – 641407, Tamil Nadu, India | Telephones: `+91 95972 28969` / `+91 95972 28975` | Email: `info@winequipments.com` | Catalogue Ref: WE-MEC-2026-V5 | Page 1 of 16

### Page 2 — Corporate Profile & Engineering Heritage
- **Title**: Corporate Profile & Manufacturing Infrastructure
- **Subtitle**: 17+ Years of Engineering Excellence in Industrial Air Treatment & Thermal Systems
- **Company Narrative**: Founded in 2008 by Mr. Ramasamy Ananthakumar (Chief Engineer & Managing Director), Win Equipments operates an advanced manufacturing plant at Arasur, Coimbatore, on the National Highway 544 industrial corridor. Spanning advanced CNC sheet metal fabrication, ASME-compliant automated welding cells, cleanroom refrigeration brazing lines, and dynamic testing bays, Win Equipments has delivered over 1,200+ turnkey systems across India, alongside capital equipment exports to Kuwait, Oman, Jordan, and the UAE.
- **Visuals**: Facility photo `images/about_us.jpg` and `images/about_us_2.jpg`.
- **4 Operational Pillars**:
  1. *Turnkey Engineering*: Custom P&ID engineering, pipe sizing, and mechanical integration.
  2. *Desert-Rated Reliability*: Equipment designed for 50°C tropical summer ambient operation without performance derating.
  3. *Energy & Water Conservation*: Zero-loss drain valves, high-COP scroll compression, and closed-loop evaporative towers that conserve over 90% water.
  4. *Rapid Field Service*: 24/7 service network with dedicated engineers based in Coimbatore, Chennai, Bangalore, Tirupur, and Hosur.
- **Footer**: Win Equipments | Master E-Catalogue • Corporate Profile | Page 2 of 16

### Page 3 — Quality Assurance, Standards & Testing Protocol
- **Title**: Quality Systems, Standards & 4-Stage Testing Rigor
- **Subtitle**: Zero-Defect Manufacturing Protocol Under ISO 9001:2015 QMS
- **Quality Certifications Spread**:
  - ISO 9001:2015 Certification Details (IAF & DAC recognized).
  - Compliance with Indian Standards (IS 2825 Class I/II) and ASME Section VIII Division 1 for pressure vessels.
  - CTI (Cooling Technology Institute) performance baseline for evaporative heat rejection.
  - ISO 8573-1 Compressed Air Purity Classifications (Class 1 to Class 4).
- **4-Stage Factory Acceptance Testing (FAT) Protocol**:
  1. *Hydrostatic Proof Testing*: 1.5× maximum allowable working pressure held for a minimum 60-minute dwell period on all pressure vessels and cooling coils.
  2. *Helium Mass-Spectrometry Leak Detection*: Refrigerant circuits undergo vacuum helium leak detection, guaranteeing zero loss across machine lifespan.
  3. *Continuous 8-Hour Full-Load Calorimeter Trial*: Live performance verification measuring compressor motor draw, cooling capacity, cycle timing, and safety interlocks.
  4. *Electrical Insulation & Megger Testing*: High-voltage dielectric testing of all electrical panels, contactors, and motors prior to dispatch.
- **Footer**: Win Equipments | Master E-Catalogue • Quality Assurance | Page 3 of 16

### Page 4 — Product Pillar 1: Refrigerated Air Dryers (WRD Series)
- **Header**: COMPRESSED AIR TREATMENT • WRD SERIES (20 TO 2,000 CFM)
- **Title**: High-Efficiency Refrigerated Compressed Air Dryers
- **Condensed Blueprint**:
  - 3-in-1 Aluminum monoblock heat exchanger (regenerator, evaporator, demister separator).
  - Constant +3°C pressure dew point (ISO 8573-1 Class 4).
  - Modulating hot gas bypass valve for 0–100% pneumatic flow stability without freeze-ups.
  - Capacitive zero-air-loss condensate drain valve included as standard.
- **Condensed Specification Table (Key Models)**:

| Model Code | CFM | Flow m³/hr | Power kW | Voltage | Connection | Dimensions (mm) | Weight |
|------------|-----|------------|----------|---------|------------|-----------------|--------|
| WRD 20 S | 20 CFM | 34 | 0.45 kW | 230V / 1Ph | 1/2" BSP | 450 × 450 × 550 | 38 kg |
| WRD 60 S | 60 CFM | 102 | 0.65 kW | 230V / 1Ph | 1" BSP | 500 × 550 × 750 | 55 kg |
| WRD 100 S | 100 CFM | 170 | 0.85 kW | 230V / 1Ph | 1" BSP | 500 × 550 × 750 | 60 kg |
| WRD 200 S | 200 CFM | 340 | 1.25 kW | 230V / 1Ph | 1.5" BSP | 600 × 650 × 900 | 95 kg |
| WRD 300 S | 300 CFM | 510 | 1.65 kW | 230V / 1Ph | 2" BSP | 600 × 650 × 900 | 110 kg |
| WRD 500 S | 500 CFM | 850 | 2.20 kW | 230V / 1Ph | 2.5" BSP | 800 × 800 × 1100 | 190 kg |
| WRD 1000 S | 1,000 CFM | 1,700 | 5.50 kW | 415V / 3Ph | 4" Flange | 1500 × 1000 × 1500 | 450 kg |
| WRD 2000 T | 2,000 CFM | 3,400 | 10.50 kW | 415V / 3Ph | 6" Flange | 1800 × 1200 × 1600 | 750 kg |

- **Image**: `images/Products/Refrigiratedairdryer1.png`.
- **Footer**: Win Equipments | Master E-Catalogue • Refrigerated Air Dryers | Page 4 of 16

### Page 5 — Product Pillar 2: Desiccant Air Dryers (WHD Series)
- **Header**: CRITICAL AIR TREATMENT • WHD SERIES (300 TO 2,000 CFM)
- **Title**: Heatless Twin-Tower Desiccant Air Dryers
- **Condensed Blueprint**:
  - Pressure Swing Adsorption (PSA) technology delivering guaranteed -40°C PDP (optional -70°C).
  - High-crush-strength activated alumina media (>20% dynamic water retention).
  - Low-noise exhaust silencers (<75 dBA).
  - Included upstream coalescing pre-filter (0.01μ) and downstream particulate after-filter (1.0μ).
- **Condensed Specification Table**:

| Model Code | CFM | Flow m³/hr | Operating Pressure | Connection | Dimensions (mm) | Weight kg |
|------------|-----|------------|--------------------|------------|-----------------|-----------|
| WHD - 030 | 300 CFM | 510 | 7–16 bar g | 1½" NB Flange | 1450 × 1100 × 2500 | 450 kg |
| WHD - 050 | 500 CFM | 850 | 7–16 bar g | 3" NB Flange | 1650 × 1250 × 2300 | 720 kg |
| WHD - 075 | 750 CFM | 1,275 | 7–16 bar g | 3" NB Flange | 1800 × 1300 × 2600 | 1,120 kg |
| WHD - 100 | 1,000 CFM | 1,700 | 7–16 bar g | 4" NB Flange | 2000 × 1400 × 2700 | 1,450 kg |
| WHD - 150 | 1,500 CFM | 2,550 | 7–16 bar g | 5" NB Flange | 2300 × 1600 × 2900 | 2,100 kg |
| WHD - 200 | 2,000 CFM | 3,400 | 7–16 bar g | 6" NB Flange | 2600 × 1800 × 3100 | 2,850 kg |

- **Image**: `images/Products/dessicantdryer.png`.
- **Footer**: Win Equipments | Master E-Catalogue • Desiccant Air Dryers | Page 5 of 16

### Page 6 — Product Pillar 3: Industrial Process Chillers (WCP Series)
- **Header**: PROCESS THERMAL MANAGEMENT • WCP SERIES (0.5 TO 50 TR)
- **Title**: Packaged Closed-Loop Industrial Process Chillers
- **Condensed Blueprint**:
  - High-precision ±0.5°C digital regulation from +5°C to +25°C.
  - Integrated SS304 buffer tank (15L to 700L) and stainless centrifugal circulation pump.
  - Copeland / Danfoss scroll compressors with dual circuits on 15 TR and above.
- **Condensed Specification Table**:

| Model Code | TR | kW Cooling | Water Flow LPM | Pump HP | Tank Liters | Dimensions (mm) | In/Out Conn |
|------------|----|------------|----------------|---------|-------------|-----------------|-------------|
| WCP 005 | 0.5 TR | 1.7 kW | 6 LPM | 0.5 HP | 15 L | 550 × 450 × 650 | 3/4" BSP |
| WCP 010 | 1.0 TR | 3.5 kW | 10 LPM | 0.5 HP | 25 L | 650 × 550 × 850 | 3/4" BSP |
| WCP 020 | 2.0 TR | 7.0 kW | 21 LPM | 0.75 HP | 40 L | 750 × 600 × 1050 | 1" BSP |
| WCP 050 | 5.0 TR | 17.5 kW | 52 LPM | 1.5 HP | 80 L | 1000 × 750 × 1250 | 1.25" BSP |
| WCP 100 | 10.0 TR | 35.1 kW | 105 LPM | 3.0 HP | 160 L | 1350 × 900 × 1450 | 2" BSP |
| WCP 200 | 20.0 TR | 70.3 kW | 210 LPM | 5.0 HP | 350 L | 1750 × 1100 × 1650 | 2.5" BSP |
| WCP 300 | 30.0 TR | 105.5 kW | 315 LPM | 7.5 HP | 450 L | 2200 × 1300 × 1850 | 3" Flange |
| WCP 500 | 50.0 TR | 175.8 kW | 525 LPM | 10.0 HP | 700 L | 2800 × 1500 × 2050 | 4" Flange |

- **Image**: `images/Products/chiller.png`.
- **Footer**: Win Equipments | Master E-Catalogue • Process Chillers | Page 6 of 16

### Page 7 — Product Pillar 4: Specialized Process Chillers (WAN, WMS, WAC Series)
- **Header**: SPECIALIZED THERMAL PROCESSES • CUSTOM ENGINEERED
- **Title**: Specialized Anodizing, Medical Scan & Acid Cooling Chillers
- **Condensed Blueprint**:
  - *WAN Anodizing Series*: Grade 2 Pure Titanium immersion coils/PHEs for 20% sulfuric acid baths; sized up to 20,000A rectifiers.
  - *WMS Medical Series*: Dual N+1 redundant circuits for MRI/CT cooling with motorized city water emergency auto-bypass to protect liquid helium.
  - *WAC Acid Cooling Series*: Pure Titanium, Hastelloy C-276, and PTFE exchangers with sealless PVDF magnetic drive pumps.
- **Specification Summary Matrix**:

| Series | Application Focus | Tonnage Range | Wetted Metallurgy | Temp Range | Redundancy Feature |
|--------|-------------------|---------------|-------------------|------------|--------------------|
| WAN Series | Aluminum Anodizing & Electroplating | 2 to 100+ TR | Pure Titanium Gr. 2 | -2°C to +21°C | High-capacity acid coil / PHE |
| WMS Series | Clinical MRI / CT / LINAC Imaging | 3 to 30 TR | SS316L / Copper | +8°C to +15°C (±0.2°C)| N+1 Dual circuits + Auto City Bypass |
| WAC Series | Pickling Acid & Battery Formation | 2 to 150 TR | Hastelloy C276 / PTFE | -5°C to +15°C | Sealless Magnetic Drive PVDF Pumps |

- **Images**: `images/Products/electroplatingchiller.png`, `images/Products/medicalchiller.png`.
- **Footer**: Win Equipments | Master E-Catalogue • Specialized Chillers | Page 7 of 16

### Page 8 — Product Pillar 5: Industrial Ice Flake Machines (WFI Series)
- **Header**: COMMERCIAL & INDUSTRIAL ICE PLANTS • WFI SERIES (1 TO 30 TPD)
- **Title**: Heavy-Duty Industrial Ice Flake Machines
- **Condensed Blueprint**:
  - Stationary vertical SUS304 food-grade evaporator drum eliminating high-pressure dynamic seals and refrigerant leaks.
  - Bitzer / Danfoss compressors with water-cooled shell-and-tube condensers.
  - Sub-cooled dry ice flakes (-5°C to -8°C, 1.5–2.2 mm) for rapid chilling without mechanical damage to produce/fish.
- **Condensed Specification Table**:

| Model Code | Daily Output TPD | Daily Output kg/24h | Power kW | Compressor Make & HP | Condenser Type | Skid Dimensions (mm) |
|------------|------------------|---------------------|----------|----------------------|----------------|----------------------|
| WFI 010 | 1 TPD | 1,000 kg | 4.8 kW | Danfoss / Bitzer (5 HP) | Air / Water Cooled | 1350 × 1050 × 980 |
| WFI 020 | 2 TPD | 2,000 kg | 8.5 kW | Bitzer Semi-Herm (8.5 HP) | Water Cooled Shell & Tube | 1550 × 1200 × 1150 |
| WFI 050 | 5 TPD | 5,000 kg | 19.5 kW | Bitzer Semi-Herm (20 HP) | Water Cooled Shell & Tube | 2100 × 1500 × 1550 |
| WFI 100 | 10 TPD | 10,000 kg | 38.0 kW | Bitzer Semi-Herm (40 HP) | Water Cooled Shell & Tube | 2600 × 1800 × 1850 |
| WFI 200 | 20 TPD | 20,000 kg | 74.0 kW | Bitzer Screw / Twin Recip| Water Cooled Shell & Tube | 3600 × 2200 × 2300 |
| WFI 300 | 30 TPD | 30,000 kg | 110.0 kW | Bitzer / Hanbell Screw | Water Cooled Shell & Tube | 4200 × 2400 × 2600 |

- **Image**: `images/Products/ice-flake-machine.jpg`.
- **Footer**: Win Equipments | Master E-Catalogue • Ice Flake Machines | Page 8 of 16

### Page 9 — Product Pillar 6: Round & Square Cooling Towers (WCT Series)
- **Header**: EVAPORATIVE HEAT REJECTION • WCT SERIES (10 TO 1,500 TR)
- **Title**: Round Bottle & Square Crossflow FRP Cooling Towers
- **Condensed Blueprint**:
  - UV-resistant isophthalic FRP casing with 100% virgin PVC honeycomb fills.
  - *WCT-RL (Round Bottle)*: Self-rotating alloy sprinkler distributing water evenly without motorized nozzles.
  - *WCT-SL (Square Crossflow)*: Open gravity distribution basins cleanable during operation; walk-in access doors.
- **Condensed Specification Table**:

| Model Code | Nominal TR | Water Flow m³/hr | Motor HP | Fan RPM | Round Dia × H (mm) | Square L×W×H (mm) | Oper Wt |
|------------|------------|------------------|----------|---------|---------------------|-------------------|---------|
| WCT 010 | 10 TR | 6 m³/hr | 0.5 HP | 1440 | Ø 930 × 1690 | 930 × 930 × 1690 | 280 kg |
| WCT 025 | 25 TR | 15 m³/hr | 0.75 HP | 1440 | Ø 1250 × 1750 | 1250 × 1250 × 1750 | 450 kg |
| WCT 050 | 50 TR | 30 m³/hr | 1.5 HP | 960 | Ø 1650 × 2150 | 1650 × 1650 × 2150 | 850 kg |
| WCT 100 | 100 TR | 60 m³/hr | 3.0 HP | 960 | Ø 2250 × 2500 | 2250 × 2250 × 2500 | 1,650 kg |
| WCT 200 | 200 TR | 120 m³/hr | 7.5 HP | 720 | Ø 3150 × 3100 | 3150 × 3150 × 3100 | 3,200 kg |
| WCT 500 | 500 TR | 300 m³/hr | 15.0 HP | 720 | Ø 4800 × 4100 | 4800 × 4800 × 4100 | 7,800 kg |

- **Images**: `images/Products/coolingtower.png`, `images/Products/Squarecoolingtower1.png`.
- **Footer**: Win Equipments | Master E-Catalogue • Cooling Towers | Page 9 of 16

### Page 10 — Product Pillar 7: Closed Circuit Coil Cooling Towers (WCC Series)
- **Header**: CRITICAL CLOSED LOOP HEAT REJECTION • WCC SERIES (40 TO 150 TR)
- **Title**: Closed Circuit Evaporative Coil Cooling Towers
- **Condensed Blueprint**:
  - Completely closed circuit isolating process fluid from atmospheric air, dust, and algae.
  - Continuous smooth-bend serpentine tubing hot-dip galvanized to ASTM A123 or SUS304 stainless steel.
  - Secondary deluge spray water circuit providing evaporative cooling with minimal water consumption.
- **Condensed Specification Table**:

| Model Code | Capacity TR | Fan Motors | Fan RPM | In/Out Pipe NB | Coil Volume Liters | Dimensions (L×W×H mm) |
|------------|-------------|------------|---------|----------------|--------------------|-----------------------|
| WCC 40 | 40 TR | 3.0 HP × 2 | 960 RPM | 3" / 3" | 72 L | 3300 × 1500 × 1400 |
| WCC 50 | 50 TR | 3.0 HP × 2 | 960 RPM | 3" / 3" | 90 L | 3300 × 1700 × 1400 |
| WCC 75 | 75 TR | 3.0 HP × 2 | 960 RPM | 4" / 4" | 135 L | 3300 × 2000 × 1400 |
| WCC 100 | 100 TR | 5.0 HP × 2 | 960 RPM | 4" / 4" | 180 L | 3600 × 2400 × 1600 |
| WCC 150 | 150 TR | 7.5 HP × 2 | 720 RPM | 6" / 6" | 270 L | 4200 × 2800 × 1800 |

- **Image**: `images/Products/coilcooling.png`.
- **Footer**: Win Equipments | Master E-Catalogue • Closed Circuit Towers | Page 10 of 16

### Page 11 — Product Pillars 8 & 10: Air Receivers & Automatic Drain Valves
- **Header**: PNEUMATIC AUXILIARIES • WRV & WADV SERIES
- **Title**: Air Receiver Tanks & Automatic Condensate Drain Valves
- **Air Receiver Section (WRV Series)**:
  - Boiler quality SA 516 Gr. 70 carbon steel plate fabricated to IS 2825 Class II and ASME Sec VIII Div 1.
  - 100% NDT weld radiography, 1.5× hydrostatic test, complete with safety kit (gauge, safety valve, drain cock).
  - Sizes: 250L to 10,000L; working pressures 7, 10, 16, and 40 bar g.
- **Automatic Drain Valves Section (WADV Series)**:
  - Capacitive Zero-Air-Loss Drain (WADV-Z16): Electronic level sensing discharges 100% water with 0 CFM air loss, saving ₹38,000+ per year.
  - Electronic Timer Drain (WADV-T16): Adjustable dual timer (0.5–10s ON / 0.5–45m OFF) with integrated stainless strainer.
  - High Pressure Drain (WADV-HP40): Rated to 40 bar g for PET blow molding compressor systems.
- **Images**: `images/Products/Airreciever.png`, `images/Products/drainvalve.png`.
- **Footer**: Win Equipments | Master E-Catalogue • Air Receivers & Drain Valves | Page 11 of 16

### Page 12 — Product Pillar 9 & Consumables: Air Filters & Spare Parts Hub
- **Header**: FILTRATION & CONSUMABLES • WMF SERIES & OEM SPARES
- **Title**: High-Efficiency Microfilters & OEM Consumables Hub
- **Air Filters Section (WMF Series)**:
  - Die-cast aluminum housings rated to 16 bar g with differential pressure pop-up indicators.
  - Grades: Grade P (3μ pre-filter), Grade X (1μ particulate), Grade Y (0.01μ coalescer), Grade A (activated carbon vapor).
  - Flow ratings from 40 to 1,000 CFM (up to 5,000 CFM flanged).
- **OEM Spares & Consumables Hub**:
  - *Activated Alumina*: 3–5mm and 4–8mm spherical media (>340 m²/g) in 25/50 kg HDPE bags.
  - *Molecular Sieve 13X / 4A*: Premium synthetic zeolite for deep drying (-70°C PDP).
  - *Filter Cartridges*: Replacement coalescing and particulate elements compatible with Win, Trident, and Domnick Hunter.
  - *Refrigeration Components*: Danfoss thermostatic expansion valves, Copeland scroll compressors, pressure switches, and solenoid coils in stock at Coimbatore.
- **Image**: `images/Products/compressedairfilters.png`.
- **Footer**: Win Equipments | Master E-Catalogue • Filters & OEM Consumables | Page 12 of 16

### Page 13 — Turnkey Compressor Room P&ID & System Engineering
- **Title**: Complete Compressor Room P&ID Architecture & Sizing Engineering
- **Subtitle**: Optimized Layout for Pressure Stability, Energy Efficiency & Moisture Removal
- **P&ID Engineering Flow Architecture**:
  - Air Compressor (Screw / Reciprocating) → Water-Cooled Aftercooler (<45°C) → Wet Buffer Receiver (with WADV-Z16 Zero Loss Drain) → Grade P Pre-Filter (3.0μ) → WRD Refrigerated Dryer (+3°C PDP) / WHD Desiccant Dryer (-40°C PDP) → Grade Y Coalescing Micro-Filter (0.01μ) → Grade A Carbon Filter (0.003μ) → Dry Air Receiver Tank → Factory Ring Main Header.
- **Thermodynamic Sizing Formulation**:
  - Formula: `Required Dryer CFM = Compressor Free Air Delivery (CFM) ÷ (Cp × Ct × Ca)`
  - Full multiplier reference tables for Pressure ($C_p$), Inlet Air Temperature ($C_t$), and Ambient Temperature ($C_a$).
  - Pipe Sizing Velocity Guidelines: Main headers designed for <6 m/s air velocity; ring main loop eliminates branch line pressure drop.
- **Footer**: Win Equipments | Master E-Catalogue • System Engineering | Page 13 of 16

### Page 14 — Industry Application Matrix & Solutions Guide
- **Title**: Comprehensive Industry Application Matrix
- **Subtitle**: Cross-Reference Engineering Solutions Across Key Manufacturing Sectors
- **Cross-Reference Matrix Table**:

| Industry Sector | Recommended Air Dryers | Recommended Chillers | Recommended Cooling Towers | Auxiliary Systems |
|-----------------|------------------------|----------------------|----------------------------|-------------------|
| **Textile Spinning & Weaving** | WRD (200–2,000 CFM) | WCP (Water-cooled central) | WCT-RL / WCT-SL (100–500 TR) | WRV 1,000–5,000 L, WADV-Z16 |
| **Plastic Injection & Extrusion**| WRD (60–500 CFM) | WCP Series (5–50 TR) | WCT-RL Series (20–200 TR) | WADV-Z16 Drains |
| **Automotive & Ancillaries** | WHD (-40°C for paint)| WCP / WCC Series | WCC Closed Circuit Towers | WMF Grade Y+A Filters |
| **Pharmaceutical & API** | WHD (-40°C to -70°C) | WCP / WAC Acid Units | WCT-SL Modular Towers | SUS304 Receivers & Grade A |
| **Steel & Induction Furnaces** | WRD Series | WCP Industrial | WCC Closed-Loop Coil Towers | WRV Pressure Accumulators |
| **Food, Dairy & Beverage** | WHD + WMF Grade A | WCP / Glycol (-10°C) | WCT-RL FRP Towers | Food-grade SUS304 Tanks |
| **Commercial Fisheries** | WRD Series | WCP Chilled Water | WCT-RL Condenser Towers | WFI Flake Ice (1–30 TPD) |
| **Hospital Diagnostic Scanners**| — | WMS Series (N+1 dual)| WCT Closed Circuit Towers | City Water Auto-Bypass Skid |
| **Laser Cutting & Fabrication**| WHD / WRD (High Press)| WCP (Dual circuit) | — | WMF 0.01μ Filters, WRV 40 bar |

- **Footer**: Win Equipments | Master E-Catalogue • Industry Solutions | Page 14 of 16

### Page 15 — Pan-India Field Service, AMC & Warehousing
- **Title**: Nationwide Service Network, Spares Depot & Lifecycle AMC
- **Subtitle**: Direct Factory Engineering Support Across India's Premier Industrial Corridors
- **Regional Service Corridors**:
  - *Coimbatore HQ & Factory Depot*: Central Arasur plant, rapid mobile response teams across Western Tamil Nadu.
  - *Chennai & Sriperumbudur*: Dedicated support for automotive OEMs, electronics hubs, and port facilities.
  - *Bangalore & Hosur Corridor*: Support for precision CNC machining, aerospace, and tooling clusters.
  - *Tirupur & Erode Textile Belts*: Same-day breakdown attendance for spinning mills and processing houses.
  - *Kerala & All-India Corridors*: Direct support for seafood processing, plastic molding, and chemical processing.
- **Factory Warehousing & AMC Support**:
  - Over ₹50 Lakhs in original spare parts inventory in Arasur (desiccant, filter elements, Danfoss valves, scroll compressors).
  - Annual Maintenance Contracts (AMC) with scheduled quarterly audits, thermodynamic leak detection, and compressor health telemetry.
- **Footer**: Win Equipments | Master E-Catalogue • Service & Support | Page 15 of 16

### Page 16 — Corporate Back Cover & Technical Consultation RFQ
- **Header**: WIN EQUIPMENTS • ENGINEERING EXCELLENCE SINCE 2008
- **Corporate Seal & Badges**: ISO 9001:2015 Seal, IAF Accreditation Mark, DAC Recognized Mark.
- **Factory & Works Coordinates**:
  - **Company**: Win Equipments
  - **Registered Plant Address**: SF No: 4, 195 B, Kallangadu, Arasur Post, Coimbatore – 641407, Tamil Nadu, India
  - **Direct Telephones**: `+91 95972 28969` / `+91 95972 28975`
  - **Official Inquiries**: `info@winequipments.com`
  - **Web Portal**: `winequipments.com`
  - **GPS Plant Geolocation**: Latitude 11.0507° N, Longitude 77.1084° E (NH544 Avinashi Road corridor)
- **Interactive QR Portal**:
  - High-contrast 3cm × 3cm QR Code resolving to `https://winequipments.com/` for instant RFQ submission, dimensional CAD submittals, and online sizing calculator tools.
- **Copyright & Integrity Disclaimer**:
  - © 2026 Win Equipments. All rights reserved. Continuous engineering research may result in specification updates without prior notice. Products manufactured under ISO 9001:2015 quality management procedures.
- **Footer**: Win Equipments | Master E-Catalogue • Contact & Registered Works | Page 16 of 16

---

## 9. Implementation Pre-Flight Checklist & Quality Audit Instructions

The downstream builder agents must execute against the following pre-flight requirements:

1. **Page Count Compliance**:
   - Individual Product Brochures (10 PDFs): Exactly 4 pages (or 6 pages where expanded options exist).
   - Master E-Catalogue (1 PDF): Exactly 16 pages (or 12–16 pages per specification).
2. **Contact Hygiene Verification Command**:
   Execute text extraction across all 11 generated PDFs to ensure banned numbers are 100% absent and mandatory numbers are 100% present:
   ```bash
   python3 -c "
   import pypdf, glob, sys
   banned = ['9597228978', '0422-2562975', '2562975']
   required = ['95972 28969', '95972 28975', 'info@winequipments.com']
   for f in glob.glob('catlogue/*.pdf'):
       reader = pypdf.PdfReader(f)
       text = ' '.join([p.extract_text() or '' for p in reader.pages])
       for b in banned:
           if b in text:
               print(f'CRITICAL FAIL: {b} found in {f}')
               sys.exit(1)
       for r in required:
           if r not in text:
               print(f'CRITICAL FAIL: Missing {r} in {f}')
               sys.exit(1)
   print('ALL 11 PDFS PASSED CONTACT HYGIENE AUDIT')
   "
   ```
3. **Print-First CSS Architecture**:
   - Use `@page { size: A4 portrait; margin: 15mm; }`
   - Use physical units (`mm`, `pt`) for print styling. Do NOT use web-centric `vh`, `vw`, or flexible scrollbars.
   - Embed base64-encoded SVG QR codes pointing to the canonical product URLs identified in Section 6.
   - Ensure all image paths resolve locally via absolute or relative filesystem paths.
4. **Missing Asset Extraction**:
   - Extract `X28.jpg` from `catlogue/ice flake machine.pdf` to `images/Products/ice-flake-machine.jpg` prior to HTML rendering of the Ice Flake Machine brochure.
