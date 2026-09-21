<?php
/**
 * Win Equipments – Production RFQ & Contact Mailer + Secure Lead Logger
 * Handles both:
 *   (A) AJAX JSON POST  → from js/main.js fetch()
 *   (B) Native HTML POST → <form action="/send_rfq.php" method="POST"> fallback
 *
 * Recipient : info@winequipments.com
 * Direct Line: +91 95972 28969 / +91 95972 28975
 */

/* ── configuration ──────────────────────────────────────────────── */
define('TO_EMAIL',        'info@winequipments.com');
define('SECONDARY_EMAIL', 'devasahithiyan@gmail.com');
define('FROM_EMAIL',      'info@winequipments.com');   // Verified domain email on cPanel
define('FROM_NAME',       'Win Equipments Website RFQ');
define('SITE_URL',        'https://winequipments.com');

/* ── helpers ─────────────────────────────────────────────────────── */
function clean(string $v): string {
    return htmlspecialchars(strip_tags(trim($v)), ENT_QUOTES, 'UTF-8');
}

function jsonResponse(bool $ok, string $msg, array $extra = []): void {
    header('Content-Type: application/json; charset=UTF-8');
    http_response_code($ok ? 200 : 400);
    echo json_encode(array_merge(['success' => $ok, 'message' => $msg], $extra));
    exit;
}

function redirectBack(bool $ok, string $page = '/contactus.html', string $refId = '', string $equipType = ''): void {
    $status = $ok ? 'success' : 'error';
    $targetPath = $page;
    $referer = $_POST['return_url'] ?? $_SERVER['HTTP_REFERER'] ?? '';
    if ($referer) {
        $parsed = parse_url($referer);
        if (!empty($parsed['path'])) {
            $targetPath = $parsed['path'];
        }
    }
    $url = SITE_URL . $targetPath . '?form=' . $status;
    if ($refId) {
        $url .= '&ref=' . urlencode($refId);
    }
    if ($equipType) {
        $url .= '&equipment=' . urlencode($equipType);
    }
    header('Location: ' . $url);
    exit;
}

/* ── request guards ───────────────────────────────────────────────── */
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: ' . SITE_URL . '/contactus.html');
    exit;
}

// Determine request type
// Determine request type
$contentType = $_SERVER['CONTENT_TYPE'] ?? '';
$isJson      = (strpos($contentType, 'application/json') !== false);
$isAjax      = $isJson 
             || (($_SERVER['HTTP_X_REQUESTED_WITH'] ?? '') === 'XMLHttpRequest')
             || (strpos($_SERVER['HTTP_ACCEPT'] ?? '', 'application/json') !== false);

// CORS: allow same-origin + winequipments.com
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if ($origin && (strpos($origin, 'winequipments.com') !== false || strpos($origin, 'localhost') !== false)) {
    header('Access-Control-Allow-Origin: ' . $origin);
}
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, X-Requested-With, Accept');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { 
    http_response_code(204); 
    exit; 
}

/* ── parse payload ────────────────────────────────────────────────── */
if ($isJson) {
    $raw  = file_get_contents('php://input');
    $data = json_decode($raw, true);
    if (!is_array($data)) {
        jsonResponse(false, 'Invalid form payload.');
    }
} else {
    $data = $_POST;
}

/* ── honeypot check (silent drop for spam bots) ───────────────────── */
if (!empty($data['website_url_hp'])) {
    if ($isAjax) jsonResponse(true, 'Inquiry received. Thank you.');
    redirectBack(true, '/contactus.html');
}

/* ── required field validation ────────────────────────────────────── */
$name     = clean($data['contact_name']  ?? $data['Name']        ?? $data['ContactName']  ?? '');
$company  = clean($data['company_name']  ?? $data['CompanyName'] ?? $data['CompanyLocation'] ?? '');
$phone    = clean($data['contact_phone'] ?? $data['Phone']       ?? '');
$rawEmail = $data['contact_email'] ?? $data['Email'] ?? '';
$email    = filter_var($rawEmail, FILTER_VALIDATE_EMAIL);

if (!$name || !$phone) {
    if ($isAjax) jsonResponse(false, 'Please provide your name and contact phone number.');
    redirectBack(false, '/contactus.html');
}

$displayEmail = $email ? $email : ($rawEmail ? clean($rawEmail) : 'Not provided');
$replyToEmail = $email ? $email : 'info@winequipments.com';

/* ── collect form fields ──────────────────────────────────────────── */
$skipFields = ['website_url_hp', '_subject', '_template', '_captcha', '_next', 'submit'];
$extraLines = '';
foreach ($data as $key => $val) {
    if (in_array($key, $skipFields, true)) continue;
    if (in_array($key, ['contact_name','company_name','contact_phone','contact_email',
                         'Name','CompanyName','CompanyLocation','Phone','Email'], true)) continue;
    $cleanKey = ucwords(str_replace(['_', '-'], ' ', $key));
    $extraLines .= "  {$cleanKey}: " . clean((string)$val) . "\n";
}

$equipType  = clean($data['equipment_type']       ?? $data['AuditFocus']    ?? $data['ChillerTonnage'] ?? $data['SparesCategory'] ?? 'Industrial Equipment');
$parameters = clean($data['operating_parameters'] ?? $data['Symptoms']      ?? $data['Requirements']   ?? $data['Notes'] ?? $data['MachineDetails'] ?? '');
$formSource = clean($data['form_source']          ?? $data['_page']         ?? 'Website');

/* ── handle drawing / document upload ────────────────────────────── */
$uploadedFileInfo = '';
$uploadedFilePath = '';
if (!empty($_FILES['drawing_file']['name']) && $_FILES['drawing_file']['error'] === UPLOAD_ERR_OK) {
    $fileTmpPath   = $_FILES['drawing_file']['tmp_name'];
    $fileName      = $_FILES['drawing_file']['name'];
    $fileSize      = $_FILES['drawing_file']['size'];
    $fileExtension = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));

    $allowedExtensions = ['pdf', 'dwg', 'dxf', 'step', 'stp', 'png', 'jpg', 'jpeg', 'doc', 'docx', 'zip'];
    $maxFileSize       = 10 * 1024 * 1024; // 10 MB

    if (in_array($fileExtension, $allowedExtensions, true) && $fileSize <= $maxFileSize) {
        $uploadDir = __DIR__ . '/uploads/';
        if (!is_dir($uploadDir)) {
            @mkdir($uploadDir, 0755, true);
        }
        $safeFileName = time() . '_' . preg_replace('/[^a-zA-Z0-9._-]/', '', $fileName);
        $destPath     = $uploadDir . $safeFileName;

        if (move_uploaded_file($fileTmpPath, $destPath)) {
            $uploadedFilePath = $destPath;
            $fileUrl = SITE_URL . '/uploads/' . $safeFileName;
            $uploadedFileInfo = "Attached Document : {$fileName} (" . round($fileSize / 1024) . " KB)\nDownload Link      : {$fileUrl}\n";
        }
    }
}

/* ── reference ID ─────────────────────────────────────────────────── */
$refId = 'WE-' . strtoupper(substr(md5(uniqid('', true)), 0, 6));

/* ── lead persistence: save to secure CSV on server ───────────────── */
$logFile = __DIR__ . '/leads_log_secure.csv';
$isNew = !file_exists($logFile);
$fp = @fopen($logFile, 'a');
if ($fp) {
    if ($isNew) {
        fputcsv($fp, ['Timestamp', 'Reference_ID', 'Name', 'Company', 'Phone', 'Email', 'Equipment_Type', 'Parameters', 'Source_Page', 'IP_Address', 'Extra_Fields']);
    }
    fputcsv($fp, [
        date('Y-m-d H:i:s'),
        $refId,
        $name,
        $company,
        $phone,
        $displayEmail,
        $equipType,
        $parameters,
        $formSource,
        $_SERVER['REMOTE_ADDR'] ?? 'Unknown',
        trim($extraLines)
    ]);
    fclose($fp);
}

/* ── compose email notification ───────────────────────────────────── */
$cadRequested = !empty($data['cad_drawings_requested']) || !empty($data['req_cad_drawings']);

$subject = "Technical RFQ [{$refId}]: {$equipType} – {$name} / {$company}";
if ($cadRequested) {
    $subject .= " [CAD Drawings Requested]";
}

$body  = "Win Equipments – New Technical RFQ / Inquiry\n";
$body .= str_repeat('=', 58) . "\n\n";
$body .= "Reference ID  : {$refId}\n";
$body .= "Source Page   : {$formSource}\n";
$body .= "Received At   : " . date('d M Y, H:i:s T') . "\n";
if ($cadRequested) {
    $body .= "CAD Drawings  : YES - 2D GA & Foundation Drawings Requested\n";
}
if (!empty($uploadedFileInfo)) {
    $body .= $uploadedFileInfo;
}
$body .= "\n";
$body .= "── Customer Contact Details ──\n";
$body .= "  Name    : {$name}\n";
$body .= "  Company : {$company}\n";
$body .= "  Phone   : {$phone}\n";
$body .= "  Email   : {$displayEmail}\n\n";
$body .= "── Requirement / Specifications ──\n";
$body .= "  Equipment : {$equipType}\n";
if ($parameters) {
    $body .= "  Details   : {$parameters}\n";
}
if ($extraLines) {
    $body .= "\n── Additional Specifications ──\n{$extraLines}";
}
$body .= "\n" . str_repeat('-', 58) . "\n";
$body .= "Direct Action:\n";
$body .= "  Call Customer : {$phone}\n";
$body .= "  WhatsApp      : https://wa.me/91" . preg_replace('/[^0-9]/', '', $phone) . "\n";
$body .= "  Email Reply   : {$displayEmail}\n";
$body .= str_repeat('=', 58) . "\n";
$body .= "Win Equipments | SF No: 4, 195 B, Kallangadu, Arasur Post, Coimbatore – 641407\n";
$body .= "Factory Tel: +91 95972 28969 / +91 95972 28975 | info@winequipments.com\n";

$headers  = "From: " . FROM_NAME . " <" . FROM_EMAIL . ">\r\n";
$headers .= "Reply-To: " . ($email ? "{$name} <{$email}>" : FROM_EMAIL) . "\r\n";
$headers .= "X-Mailer: PHP/" . phpversion() . "\r\n";
$headers .= "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

/* ── dispatch mail ────────────────────────────────────────────────── */
$allRecipients = TO_EMAIL . ', ' . SECONDARY_EMAIL;
$sent = @mail($allRecipients, $subject, $body, $headers);

if (!$sent) {
    error_log("[Win RFQ] mail() returned false for ref:{$refId} phone:{$phone}. Lead captured in CSV.");
}

/* ── response handling ────────────────────────────────────────────── */
if ($isAjax) {
    jsonResponse(true, "Thank you {$name}! Your RFQ [{$refId}] has been registered.", [
        'ref_id'         => $refId,
        'equipment_type' => $equipType,
        'contact_phone'  => $phone
    ]);
} else {
    redirectBack(true, '/contactus.html', $refId, $equipType);
}
