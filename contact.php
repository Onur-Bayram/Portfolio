<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=UTF-8');
header('Cache-Control: no-store');

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

$honeypot = trim((string) ($_POST['company'] ?? ''));
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

$recipient = 'onur-bayram@hotmail.de';
$safeName = clean_header_value($name);
$safeEmail = clean_header_value($email);

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
    'From: Portfolio Website <noreply@onur-bayram.de>',
    'Reply-To: ' . $safeEmail
];

$mailSent = mail(
    $recipient,
    $encodedSubject,
    implode(PHP_EOL, $bodyLines),
    implode(PHP_EOL, $headers)
);

if (!$mailSent) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'message' => 'Mail could not be sent']);
    exit;
}

echo json_encode(['ok' => true, 'message' => 'Message sent']);
