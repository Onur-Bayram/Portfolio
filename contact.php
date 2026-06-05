<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=UTF-8');
header('Cache-Control: no-store');

const MAIL_RECIPIENT = 'onur-bayram@hotmail.de';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Allow: POST');
    http_response_code(405);
    echo json_encode(['ok' => false, 'message' => 'Method not allowed']);
    exit;
}

function clean_header_value(string $value): string
{
    return trim(preg_replace('/[\r\n]+/', ' ', $value) ?? '');
}

function resolve_sender_address(): string
{
    $host = strtolower((string) ($_SERVER['HTTP_HOST'] ?? 'onur-bayram.de'));
    $host = preg_replace('/:\d+$/', '', $host) ?? 'onur-bayram.de';
    $host = preg_replace('/^www\./', '', $host) ?? 'onur-bayram.de';

    if (!filter_var('noreply@' . $host, FILTER_VALIDATE_EMAIL)) {
        return 'noreply@onur-bayram.de';
    }

    return 'noreply@' . $host;
}

$honeypot = trim((string) ($_POST['website'] ?? $_POST['company'] ?? ''));
if ($honeypot !== '') {
    echo json_encode(['ok' => true]);
    exit;
}

$name = trim((string) ($_POST['name'] ?? ''));
$email = trim((string) ($_POST['email'] ?? ''));
$message = trim((string) ($_POST['message'] ?? ''));
$privacyAccepted = isset($_POST['privacy']) && $_POST['privacy'] !== '';

if ($name === '' || $email === '' || $message === '' || !$privacyAccepted) {
    http_response_code(422);
    echo json_encode(['ok' => false, 'message' => 'Missing required fields']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(422);
    echo json_encode(['ok' => false, 'message' => 'Invalid email address']);
    exit;
}

if (strlen($name) > 120 || strlen($email) > 254 || strlen($message) > 5000) {
    http_response_code(422);
    echo json_encode(['ok' => false, 'message' => 'Form data too long']);
    exit;
}

$safeName = clean_header_value($name);
$safeEmail = clean_header_value($email);
$senderAddress = resolve_sender_address();
$lineBreak = "\r\n";

$subject = 'Portfolio contact request from ' . $safeName;
$encodedSubject = '=?UTF-8?B?' . base64_encode($subject) . '?=';

$bodyLines = [
    'New portfolio contact request',
    '',
    'Name: ' . $safeName,
    'Email: ' . $safeEmail,
    '',
    'Message:',
    $message
];

$headers = [
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: 8bit',
    'From: Onur Bayram Portfolio <' . $senderAddress . '>',
    'Reply-To: ' . $safeEmail,
    'X-Mailer: PHP/' . PHP_VERSION
];

$mailOptions = '-f' . $senderAddress;
$mailSent = mail(
    MAIL_RECIPIENT,
    $encodedSubject,
    implode($lineBreak, $bodyLines),
    implode($lineBreak, $headers),
    $mailOptions
);

if (!$mailSent) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'message' => 'Mail could not be sent']);
    exit;
}

echo json_encode(['ok' => true, 'message' => 'Message sent']);
