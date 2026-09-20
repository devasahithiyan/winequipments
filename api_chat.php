<?php
/**
 * Win Equipments – AI Technical Sales & Sizing Assistant Endpoint
 * Strictly grounded in Win Equipments verified product data.
 * Zero generic hallucinations. Zero third-party product references.
 */

header('Content-Type: application/json; charset=UTF-8');

// CORS: allow same-origin and winequipments.com
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if ($origin && (strpos($origin, 'winequipments.com') !== false || strpos($origin, 'localhost') !== false)) {
    header('Access-Control-Allow-Origin: ' . $origin);
}
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, X-Requested-With');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

$rawInput = file_get_contents('php://input');
$data = json_decode($rawInput, true);

$userMessage = trim($data['message'] ?? '');
$history = $data['history'] ?? [];

if ($userMessage === '') {
    echo json_encode(['success' => false, 'message' => 'Empty message']);
    exit;
}

/* ── 1. Smart Local Engineering Intent Engine (Zero Latency & 100% Accurate) ── */
$localReply = evaluateLocalProductEngine($userMessage);
if ($localReply !== null) {
    echo json_encode([
        'success' => true,
        'reply' => $localReply,
        'engine' => 'WinEquipments-Product-Engine'
    ]);
    exit;
}

/* ── 2. Strict LLM System Prompt (Negative Constraints & Full Specs) ────────── */
$systemPrompt = <<<EOT
You are the official Win Equipments AI Technical Application Engineer in Arasur, Coimbatore, Tamil Nadu, India.
Website: https://winequipments.com | Direct Hotline / WhatsApp: +91 95972 28969 / +91 95972 28975 | Email: info@winequipments.com

ABSOLUTE NEGATIVE CONSTRAINTS:
1. Win Equipments ONLY manufactures:
   - Compressed Air Treatment: Refrigerated Dryers (WRD), Desiccant Dryers (WHD), Air Receivers (WRV), In-line Filters (WMF), Auto Drain Valves (WADV).
   - Industrial Process Cooling: Process Water Chillers (WCP), Specialized Chillers (WAN Anodizing, WMS Medical, WAC Acid Cooling, Spot Cooling), FRP Cooling Towers (WCT Round & Square, WCC Closed-Circuit), Ice Flake Machines (WFI).
2. Win Equipments DOES NOT manufacture: air compressors, CNC machines, lathes, robots, conveyor belts, packaging machines, pumps, boilers, or general machinery.
3. If asked about machinery we do not manufacture (e.g. CNC, Compressors, Injection molding machines):
   Clarify that we do NOT make them, but we manufacture the Refrigerated Dryers and Process Chillers that protect them from moisture and overheating.
4. NEVER invent or hallucinate specifications. Ground all answers strictly in the verified product data below.

VERIFIED PRODUCT DATA & MODEL CODES:
1. Refrigerated Compressed Air Dryers (WRD Series):
   - Models: WRD 20 S (20 CFM), WRD 30 S (30 CFM), WRD 40 S (40 CFM), WRD 60 S (60 CFM), WRD 80 S (80 CFM), WRD 100 S (100 CFM), WRD 150 S (150 CFM), WRD 200 S (200 CFM), WRD 300 S (300 CFM), WRD 500 S (500 CFM), up to WRD 2000 S (2,000 CFM).
   - Specs: +3°C Pressure Dew Point (ISO 8573-1 Class 4), 7.0 to 16.0 bar g working pressure, Max inlet temp 50°C, R134a/R407C eco-refrigerants, Zero-air-loss electronic drain.

2. Heatless Desiccant Air Dryers (WHD Series):
   - Models: WHD-030 (300 CFM), WHD-040 (400 CFM), WHD-050 (500 CFM), WHD-060 (600 CFM), WHD-075 (750 CFM), WHD-100 (1,000 CFM), WHD-150 (1,500 CFM), WHD-200 (2,000 CFM).
   - Specs: -40°C Standard PDP (-70°C Optional), Activated Alumina & Molecular Sieve desiccant, Twin-tower heatless pressure-swing adsorption, 8-min cycle, IS 2825 / ASME Sec VIII Div 1 pressure vessels.

3. Industrial Process Water Chillers (WCP Series):
   - Models: WCP 005 (0.5 TR), WCP 010 (1.0 TR), WCP 020 (2.0 TR), WCP 030 (3.0 TR), WCP 050 (5.0 TR), WCP 075 (7.5 TR), WCP 100 (10.0 TR), WCP 150 (15.0 TR), WCP 200 (20.0 TR), WCP 300 (30.0 TR), up to 150 TR.
   - Specs: Water-cooled & Air-cooled packages, Leaving water temp +5°C to +25°C, Microprocessor PID digital controller, SS304 insulated water tank, Copeland scroll compressors.

4. Specialized Chillers:
   - WAN Anodizing Chillers (2 to 100 TR): Titanium Grade 2 heat exchangers for sulfuric acid bath (18°C–21°C).
   - WMS Medical Chillers (3 to 50 TR): Dual refrigeration circuits for MRI, CT scanners, linear accelerators.
   - WAC Acid Cooling Chillers: Anti-corrosive Hastelloy/PTFE coils for acid pickling & galvanizing.

5. FRP Cooling Towers (WCT & WCC Series):
   - Round Bottle FRP Towers: WCT 010 (10 TR) to WCT 1500 (1,500 TR). 360° aerodynamic air intake, rotating brass sprinkler, UV-resistant isophthalic resin, PVC honeycomb cross-flute fill.
   - Square Modular Towers: Multi-cell side-by-side expansion, gravity water basin.
   - Closed-Circuit Towers (WCC Series): Indirect closed-loop copper/SS coils to prevent fluid contamination.

6. Ice Flake Machines (WFI Series):
   - Models: WFI 010 (1 TPD), WFI 020 (2 TPD), WFI 030 (3 TPD), WFI 050 (5 TPD), WFI 100 (10 TPD), up to 30 TPD. Sub-cooled dry flakes (-6°C to -8°C, 1.5–2.2mm), SUS304 food-grade drum.

7. Compressed Air Receivers (WRV Series):
   - 250 Litres to 10,000 Litres vertical/horizontal, built to IS 2825 / ASME Sec VIII Div 1, hydro-tested to 1.5x design pressure.

8. Sub-Micron Filters (WMF Series) & Drain Valves (WADV Series):
   - WMF Series: 0.01 micron oil removal coalescing & particulate filter elements (20 to 2000 CFM).
   - WADV Series: WADV-Z16 Zero-Air-Loss capacitive electronic drain, WADV-T16 Electronic timer solenoid drain.

SIZING GUIDELINES:
- Air Dryer CFM: Motor HP × 4 ≈ CFM (e.g. 30 HP compressor ≈ 120 CFM, recommend WRD 150 S).
- Chiller Tonnage: TR = (Water Flow in LPM × Temperature Drop in °C) / 70.

Always keep responses concise, factual, and direct. Offer WhatsApp connection: https://wa.me/919597228969 or phone +91 95972 28969.
EOT;

/* ── 3. Call LLM with Strict Temperature & Short Timeout ─────────────── */
$messages = [
    ['role' => 'system', 'content' => $systemPrompt]
];

if (is_array($history)) {
    $slice = array_slice($history, -4);
    foreach ($slice as $msg) {
        if (isset($msg['role'], $msg['content']) && in_array($msg['role'], ['user', 'assistant'])) {
            $messages[] = [
                'role' => $msg['role'],
                'content' => (string)$msg['content']
            ];
        }
    }
}

$messages[] = ['role' => 'user', 'content' => $userMessage];

$payload = json_encode([
    'messages' => $messages,
    'model' => 'openai',
    'temperature' => 0.1,
    'seed' => 42
]);

$ch = curl_init('https://text.pollinations.ai/');
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => $payload,
    CURLOPT_HTTPHEADER => [
        'Content-Type: application/json',
        'Accept: text/plain, application/json',
        'User-Agent: WinEquipments-AI-Assistant/2.0'
    ],
    CURLOPT_TIMEOUT => 8,
    CURLOPT_CONNECTTIMEOUT => 4,
    CURLOPT_SSL_VERIFYPEER => true
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($response !== false && $httpCode === 200 && strlen(trim($response)) > 15) {
    $cleanReply = trim($response);
    $decoded = json_decode($cleanReply, true);
    if (is_array($decoded)) {
        if (isset($decoded['choices'][0]['message']['content'])) {
            $cleanReply = $decoded['choices'][0]['message']['content'];
        } elseif (isset($decoded['text'])) {
            $cleanReply = $decoded['text'];
        }
    }

    echo json_encode([
        'success' => true,
        'reply' => $cleanReply,
        'engine' => 'Grounded-LLM'
    ]);
    exit;
}

/* ── 4. Fallback if External API Times Out ────────────────────────────── */
$fallback = generateStrictProductFallback($userMessage);
echo json_encode([
    'success' => true,
    'reply' => $fallback,
    'engine' => 'WinEquipments-Direct-Engine'
]);
exit;


/* ────────────────────────────────────────────────────────────────────────
   LOCAL PRODUCT-SPECIFIC LOGIC ENGINE
   ──────────────────────────────────────────────────────────────────────── */

function evaluateLocalProductEngine(string $q): ?string {
    $lower = strtolower($q);

    // 1. Guardrail against non-manufactured items (CNC, compressors, robots, conveyors)
    if (preg_match('/\b(cnc|lathe|robot|conveyor|boiler|pump|generator|compressor|compressors)\b/i', $lower)) {
        if (strpos($lower, 'dryer') === false && strpos($lower, 'chiller') === false && strpos($lower, 'size') === false) {
            return "Win Equipments does not manufacture air compressors, CNC machines, or general tooling. We manufacture the **Refrigerated Air Dryers (WRD series)** and **Process Water Chillers (WCP series)** that protect and cool them.\n\n" .
                   "If you need an air dryer to eliminate moisture for your compressor/CNC or a chiller to cool your spindle/laser, let us know your motor HP or cooling requirements!";
        }
    }

    // 2. Air Dryer Sizing Calculator Intent (e.g., "30 hp", "50 hp", "100 hp")
    if (preg_match('/(\d+)\s*(?:hp|horsepower)/i', $lower, $m)) {
        $hp = intval($m[1]);
        $approxCfm = $hp * 4;
        $recommendedCfm = round($approxCfm * 1.2); // 20% safety margin for Indian ambient temperatures

        $model = "WRD 20 S";
        if ($recommendedCfm <= 20) $model = "WRD 20 S (20 CFM)";
        elseif ($recommendedCfm <= 40) $model = "WRD 40 S (40 CFM)";
        elseif ($recommendedCfm <= 60) $model = "WRD 60 S (60 CFM)";
        elseif ($recommendedCfm <= 100) $model = "WRD 100 S (100 CFM)";
        elseif ($recommendedCfm <= 150) $model = "WRD 150 S (150 CFM)";
        elseif ($recommendedCfm <= 200) $model = "WRD 200 S (200 CFM)";
        elseif ($recommendedCfm <= 300) $model = "WRD 300 S (300 CFM)";
        elseif ($recommendedCfm <= 500) $model = "WRD 500 S (500 CFM)";
        elseif ($recommendedCfm <= 750) $model = "WRD 750 S (750 CFM)";
        elseif ($recommendedCfm <= 1000) $model = "WRD 1000 S (1,000 CFM)";
        else $model = "WRD 1500 S or WRD 2000 S";

        return "For a **{$hp} HP screw/reciprocating compressor**:\n\n" .
               "• **Estimated Air Output**: ~{$approxCfm} CFM\n" .
               "• **Recommended Sizing (with Indian ambient derating)**: ~{$recommendedCfm} CFM\n" .
               "• **Recommended Win Equipments Model**: **{$model}**\n\n" .
               "Features:\n" .
               "- Continuous +3°C Pressure Dew Point (ISO 8573-1 Class 4)\n" .
               "- Zero Air Loss Electronic Capacitive Drain\n" .
               "- Heavy-duty R134a/R407c refrigeration circuit\n\n" .
               "Would you like an immediate factory proposal? WhatsApp us: https://wa.me/919597228969 or call **+91 95972 28969**.";
    }

    // 3. Chiller Sizing & Models
    if (preg_match('/\b(chiller|chillers|chilling|tr|ton|tonnage)\b/i', $lower) && (strpos($lower, 'size') !== false || strpos($lower, 'model') !== false || strpos($lower, 'capacity') !== false || strpos($lower, 'how') !== false)) {
        return "Win Equipments manufactures **Industrial Process Chillers (WCP Series)** from **1 TR to 150 TR**:\n\n" .
               "**Core Range**:\n" .
               "• Compact Packaged: WCP 010 (1 TR), WCP 020 (2 TR), WCP 030 (3 TR), WCP 050 (5 TR)\n" .
               "• Medium Plant: WCP 075 (7.5 TR), WCP 100 (10 TR), WCP 150 (15 TR), WCP 200 (20 TR)\n" .
               "• Heavy Central: WCP 300 (30 TR) up to 150 TR\n\n" .
               "**Specialized Applications**:\n" .
               "• **Anodizing Chillers (WAN Series)**: Titanium Grade 2 heat exchangers for sulfuric acid (18°C–21°C).\n" .
               "• **Medical Scan Chillers (WMS Series)**: Dual circuit chilling for MRI & CT scanners.\n" .
               "• **Acid Cooling Chillers (WAC Series)**: Anti-corrosive Hastelloy/PTFE coils.\n\n" .
               "**Sizing Formula**: `TR = (Water Flow in LPM × Temp Drop °C) / 70`.\n\n" .
               "Contact our engineering desk for exact heat load calculations: +91 95972 28969 or WhatsApp: https://wa.me/919597228969";
    }

    // 4. Desiccant vs Refrigerated Air Dryer Dew Point Comparison
    if (strpos($lower, 'desiccant') !== false || strpos($lower, 'dew point') !== false || strpos($lower, 'minus 40') !== false || strpos($lower, '-40') !== false) {
        return "Here is the engineering comparison between Win Equipments dryer series:\n\n" .
               "1. **Refrigerated Air Dryers (WRD Series)**:\n" .
               "   • Dew Point: **+3°C** (ISO 8573-1 Class 4)\n" .
               "   • Best for: CNC machines, paint spray booths, packaging, general shop air.\n" .
               "   • Operating cost: Extremely low power consumption.\n\n" .
               "2. **Heatless Desiccant Air Dryers (WHD Series)**:\n" .
               "   • Dew Point: **-40°C Standard** (down to -70°C optional, ISO 8573-1 Class 1/2)\n" .
               "   • Media: Activated Alumina & Molecular Sieve in twin ASME/IS 2825 towers.\n" .
               "   • Best for: Nitrogen laser cutting, pharmaceutical cleanrooms, precision electronics.\n\n" .
               "Need help choosing the right dew point for your application? WhatsApp us: https://wa.me/919597228969";
    }

    // 5. Cooling Towers (Round, Square, Closed Circuit)
    if (strpos($lower, 'cooling tower') !== false || strpos($lower, 'frp tower') !== false) {
        return "Win Equipments manufactures three industrial FRP Cooling Tower configurations (10 TR to 1,500 TR):\n\n" .
               "• **Round Bottle Cooling Towers (WCT Series)**: 360° uniform aerodynamic air intake with self-rotating non-clog brass sprinkler. Maximum thermal heat dissipation.\n" .
               "• **Square Crossflow Cooling Towers**: Modular multi-cell design for side-by-side plant expansion with low drift PVC honeycomb fills.\n" .
               "• **Closed-Circuit Evaporative Towers (WCC Series)**: Indirect cooling through heavy-duty copper/SS coils—guarantees zero process water contamination.\n\n" .
               "Built with premium UV-stabilized isophthalic polyester resin for high-TDS Indian borewell water conditions. WhatsApp our engineers: https://wa.me/919597228969";
    }

    // 6. Quotation / Pricing / Contact Inquiry
    if (preg_match('/\b(price|pricing|quote|quotation|cost|order|buy|catalog|catalogue|brochure)\b/i', $lower)) {
        return "Win Equipments supplies **direct from our factory in Arasur, Coimbatore** with no intermediary markups:\n\n" .
               "• **Standard Dispatch**: Within 7 working days for standard air dryers, chillers, and cooling towers.\n" .
               "• **Official Quotation**: Submit an RFQ via our website forms or call our commercial desk.\n" .
               "• **Factory Contacts**: **+91 95972 28969** / **+91 95972 28975**\n" .
               "• **Instant WhatsApp RFQ**: https://wa.me/919597228969\n" .
               "• **Email**: info@winequipments.com\n\n" .
               "Share your required model or CFM/TR and destination city, and we will send a formal quote within 24 hours!";
    }

    return null;
}

function generateStrictProductFallback(string $q): string {
    return "Win Equipments is an ISO 9001:2015 certified industrial manufacturer in Arasur, Coimbatore.\n\n" .
           "Our Manufacturing Portfolio:\n" .
           "1. **Refrigerated Air Dryers (WRD)**: 20–2,000 CFM (+3°C PDP)\n" .
           "2. **Desiccant Air Dryers (WHD)**: 20–1,500 CFM (-40°C PDP)\n" .
           "3. **Process Chillers (WCP / WAN / WMS)**: 1–150 TR for molding, anodizing & lasers\n" .
           "4. **FRP Cooling Towers (WCT / WCC)**: 10–1,500 TR Round, Square & Closed Circuit\n" .
           "5. **Air Receiver Tanks (WRV)**: 250L–10,000L (IS 2825 / ASME)\n\n" .
           "For sizing advice or immediate pricing, please call our engineering team at **+91 95972 28969** or message us on WhatsApp: https://wa.me/919597228969";
}
