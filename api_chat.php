<?php
/**
 * Win Equipments – AI Technical Sales & Sizing Assistant Endpoint
 * Powered by Free LLM Inference Engine with Zero-Key Instant Fallback
 * Knowledge Base: Compressed Air Dryers, Industrial Chillers, Cooling Towers, Receivers
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

/* ── Technical Knowledge Base System Prompt ────────────────────────── */
$systemPrompt = <<<EOT
You are the Win Equipments AI Application Engineer, an expert technical consultant for Win Equipments (ISO 9001:2015 certified manufacturer of industrial thermal and compressed air equipment in Arasur, Coimbatore, Tamil Nadu, India, established in 2008). Tagline: "Save Water and Power".

YOUR ROLE:
Provide precise, helpful engineering advice, equipment sizing calculations, and product recommendations to plant engineers, factory owners, and procurement managers. Keep responses concise, authoritative, professional, and practical.

COMPANY & CONTACT INFORMATION:
- Factory / Works: SF No: 4, 195 B, Kallangadu, Arasur Post, Coimbatore – 641407, Tamil Nadu, India.
- Phone / WhatsApp: +91 95972 28969 / +91 95972 28975
- Email: info@winequipments.com
- Website: https://winequipments.com
- Delivery: Direct manufacturer pricing with dispatch across Tamil Nadu, Karnataka, Kerala, Andhra Pradesh, and all India.

PRODUCT PORTFOLIO & SPECIFICATIONS:
1. Refrigerated Compressed Air Dryers (WRD Series):
   - Capacity: 20 CFM to 2,000 CFM
   - Pressure Dew Point: +3°C (ISO 8573-1 Class 4)
   - Max Inlet Temp: 50°C, Operating Pressure: 7 to 16 bar
   - Eco-friendly Refrigerants: R134a / R407c, Zero air loss electronic drain valve
   - Best for: CNC machines, powder coating, textile looms, general plant air

2. Heatless Desiccant Air Dryers (WHD Series):
   - Capacity: 20 CFM to 1,500 CFM
   - Pressure Dew Point: -40°C to -70°C (ISO 8573-1 Class 1/2)
   - Media: Activated Alumina & Molecular Sieve desiccant
   - Twin-tower heatless pressure-swing adsorption, 10-minute cycle
   - Best for: Pharmaceutical, electronic cleanrooms, laser cutting (nitrogen assist), critical instrumentation

3. Industrial Process Chillers (WCP Series):
   - Capacity: 1 TR to 150 TR
   - Types: Air-Cooled & Water-Cooled chillers
   - Compressors: Emerson Copeland Scroll or Danfoss
   - Heat Exchanger: Stainless Steel 304 tank with immersion coil or Brazed Plate (BPHE)
   - Temperature Range: +5°C to +25°C with micro-processor PID controller
   - Best for: Plastic injection molding, laser cutting optics, CNC machining, chemical reactor cooling

4. Specialized Chillers:
   - Anodizing Chillers: Titanium/PHE evaporator for sulfuric acid baths (18°C–22°C)
   - Medical & Scan Chillers: Ultra-reliable dual-circuit chilling for MRI, CT scanners, linear accelerators
   - Acid Cooling Chillers: Anti-corrosive Hastelloy/Titanium for chemical pickling & electroplating
   - Spot Cooling Chillers: Precision temperature targeting for induction hardening & lasers

5. FRP Industrial Cooling Towers (WCT Series):
   - Round Bottle Cooling Towers (10 TR to 1,500 TR): 360° aerodynamic air intake, rotating brass sprinkler, lightweight UV-stabilized isophthalic FRP casing
   - Square Modular Crossflow Towers: Multi-cell modular expansion, gravity water basin, low drift loss
   - Closed-Circuit Cooling Towers: Indirect closed-loop copper/SS coils to prevent process fluid contamination

6. Flake Ice Machines (WFI Series):
   - Capacity: 0.5 to 20 Tons per 24 hours
   - Sub-cooled dry ice flakes (-6°C to -8°C, 1.5–2.2mm thickness)
   - Best for: Seafood export, concrete batching for dams/highways, chemical dye reaction cooling

7. Air Receivers & Accessories:
   - Air Receiver Tanks (WRV Series): 250L to 5,000L vertical/horizontal, built to IS 2825 / ASME Section VIII, hydro-tested to 1.5x working pressure
   - Sub-Micron Air Filters (WMF Series): 0.01 micron oil removal coalescing & particulate filters
   - Automatic Drain Valves (WADV Series): Zero Air Loss capacitive electronic drains (WADV-ZL16) and timer solenoid drains

ENGINEERING SIZING FORMULAS:
- Air Dryer CFM: Compressor Motor HP × 4 ≈ CFM (e.g., 30 HP screw compressor = ~120 CFM; select WRD-150-S dryer for margin).
- Chiller Tonnage: TR = (Water Flow in LPM × (Inlet Temp °C - Outlet Temp °C)) / 70.
- Cooling Tower Water Flow: 1 TR of cooling tower requires approx. 13.5 LPM (3 GPM) water circulation.

BEHAVIOR RULES:
- Provide direct answers with model names and numbers where appropriate.
- Always offer to connect the customer with our Coimbatore engineers on WhatsApp (+91 95972 28969) or submit an official RFQ on the site for exact quotation.
- If the customer asks for a quote, price, or custom sizing, prompt them to share their requirement (equipment type, CFM/TR, phone number) or click the RFQ form.
- Be polite, technically accurate, and proud of Win Equipments Indian manufacturing heritage.
EOT;

/* ── Build Conversation History for Free LLM API ──────────────────── */
$messages = [
    ['role' => 'system', 'content' => $systemPrompt]
];

// Add last 6 exchanges from conversation history
if (is_array($history)) {
    $slice = array_slice($history, -6);
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

/* ── Call Free Pollinations / Open-Inference Endpoint ─────────────── */
$payload = json_encode([
    'messages' => $messages,
    'model' => 'openai',
    'temperature' => 0.4,
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
        'User-Agent: WinEquipments-AI-Assistant/1.0'
    ],
    CURLOPT_TIMEOUT => 25,
    CURLOPT_CONNECTTIMEOUT => 8,
    CURLOPT_SSL_VERIFYPEER => true
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curlError = curl_error($ch);
curl_close($ch);

if ($response !== false && $httpCode === 200 && strlen(trim($response)) > 10) {
    $cleanReply = trim($response);
    // If the API returned JSON with a 'text' or 'choices' property
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
        'engine' => 'Free-LLM'
    ]);
    exit;
}

/* ── Fallback Knowledge Engine (Offline / API Timeout Guard) ───────── */
$fallbackReply = generateFallbackResponse($userMessage);
echo json_encode([
    'success' => true,
    'reply' => $fallbackReply,
    'engine' => 'Knowledge-Base-Engine'
]);
exit;

/* ── Fallback Rule-Based Technical Expert ─────────────────────────── */
function generateFallbackResponse(string $q): string {
    $lower = strtolower($q);

    if (strpos($lower, 'dryer') !== false || strpos($lower, 'cfm') !== false || strpos($lower, 'dew point') !== false) {
        return "Win Equipments manufactures two primary compressed air dryer series in Arasur, Coimbatore:\n\n" .
               "1. **Refrigerated Air Dryers (WRD Series)**: 20 to 2,000 CFM with continuous +3°C pressure dew point (ISO 8573-1 Class 4). Ideal for CNC, powder coating, and general plant air.\n" .
               "2. **Heatless Desiccant Dryers (WHD Series)**: 20 to 1,500 CFM with -40°C to -70°C dew point for pharma, electronics, and laser cutting.\n\n" .
               "Quick rule of thumb: Compressor Motor HP × 4 ≈ required CFM (e.g. 50 HP compressor ≈ 200 CFM dryer).\n\n" .
               "Would you like an immediate proposal? You can call us directly at +91 95972 28969 or WhatsApp our engineers: https://wa.me/919597228969";
    }

    if (strpos($lower, 'chiller') !== false || strpos($lower, 'ton') !== false || strpos($lower, 'tr') !== false) {
        return "Our Industrial Process Chillers (WCP Series) range from **1 TR to 150 TR** in air-cooled and water-cooled configurations:\n\n" .
               "- Precise PID digital temperature control (+5°C to +25°C)\n" .
               "- SS 304 reservoir tanks and brazed plate heat exchangers (BPHE)\n" .
               "- Specialized chillers available for Anodizing, Acid Cooling, Medical MRI/CT, and Spot Cooling.\n\n" .
               "Sizing Formula: `TR = (Flow Rate in LPM × Temp Drop °C) / 70`.\n\n" .
               "Let us know your water flow and inlet/outlet temperature requirements, or chat on WhatsApp (+91 95972 28969)!";
    }

    if (strpos($lower, 'cooling tower') !== false || strpos($lower, 'frp') !== false || strpos($lower, 'tower') !== false) {
        return "Win Equipments manufactures heavy-duty FRP Cooling Towers from **10 TR to 1,500 TR**:\n\n" .
               "- **Round Bottle Towers**: 360-degree aerodynamic air intake with non-clog rotary sprinkler.\n" .
               "- **Square Crossflow Towers**: Modular multi-cell design for easy plant expansion.\n" .
               "- **Closed-Circuit Towers**: Indirect closed-loop cooling for zero contamination.\n\n" .
               "Built with UV-stabilized isophthalic polyester resin for 20+ year operating life under high-TDS hard water conditions.";
    }

    if (strpos($lower, 'price') !== false || strpos($lower, 'quote') !== false || strpos($lower, 'cost') !== false || strpos($lower, 'quotation') !== false) {
        return "Win Equipments provides direct factory-to-user pricing with no dealer markups. To receive a formal technical proposal within 24 hours:\n\n" .
               "- Click the **Get Quote** button on any product page\n" .
               "- Or message us directly on WhatsApp: https://wa.me/919597228969\n" .
               "- Or call our sales engineers at **+91 95972 28969** / **+91 95972 28975**.";
    }

    if (strpos($lower, 'ice') !== false || strpos($lower, 'flake') !== false) {
        return "Our Industrial Ice Flake Machines (WFI Series) produce **0.5 to 20 Tons/Day** of sub-cooled dry ice flakes (-6°C to -8°C) with stationary vertical evaporator drums. Widely used in seafood export, chemical dye processing, and concrete cooling.";
    }

    return "Hello! I am the Win Equipments AI Technical Assistant. We are an ISO 9001:2015 certified manufacturer of industrial compressed air dryers (20–2000 CFM), process chillers (1–150 TR), FRP cooling towers (10–1500 TR), and ice flake machines based in Coimbatore, Tamil Nadu.\n\n" .
           "How can I assist you today? You can ask me to size an air dryer or chiller, request technical specs, or connect with our engineering team directly at **+91 95972 28969**.";
}
