<?php

// CORS headers (for Angular / frontend apps)
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=utf-8");

// ------------------------------------------------------------
// WICHTIG:
// Deine eigene Adresse in Zeile 15 setzen!
// ------------------------------------------------------------

// Public recipient. The technical sender must belong to this domain for IONOS mail().
$siteEmail = "onur-bayram@hotmail.de";
$fromEmail = "noreply@onur-bayram.de";

switch ($_SERVER['REQUEST_METHOD']) {

    case 'OPTIONS':
        // Preflight request
        http_response_code(200);
        exit;

    case 'POST':
        // Read raw JSON payload
        $json = file_get_contents('php://input');
        $params = json_decode($json);

        // Saubere JSON-Fehlerprüfung
        if (json_last_error() !== JSON_ERROR_NONE) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'Invalid JSON']);
            exit;
        }

        $email = $params->email ?? '';
        $name = $params->name ?? '';
        $userMessage = $params->message ?? '';

        // Basic validation
        if (!filter_var($email, FILTER_VALIDATE_EMAIL) || strpos($email, '..') !== false || empty($name) || empty($userMessage)) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'Invalid input data']);
            exit;
        }

        // Sanitize content
        $safeName = htmlspecialchars($name, ENT_QUOTES, 'UTF-8');
        $safeEmail = htmlspecialchars($email, ENT_QUOTES, 'UTF-8');
        $safeMessage = nl2br(htmlspecialchars($userMessage, ENT_QUOTES, 'UTF-8'));

        // Empfängeradresse (nutzt die oben definierte Mail)
        $recipient = $siteEmail;
        $subject = 'Website Contact Form';

        $mailBody = "
            <strong>Name:</strong> {$safeName}<br>
            <strong>Email:</strong> {$safeEmail}<br><br>
            <strong>Message:</strong><br>
            {$safeMessage}
        ";

        // Mail headers
        $headers = [];
        $headers[] = 'MIME-Version: 1.0';
        $headers[] = 'Content-type: text/html; charset=utf-8';
        $headers[] = 'From: Onur Bayram Website <' . $fromEmail . '>';
        $headers[] = 'Reply-To: ' . $email;
        $headers[] = 'Return-Path: ' . $fromEmail;

        // Send mail
        $success = @mail(
            $recipient,
            $subject,
            $mailBody,
            implode("\r\n", $headers),
            '-f ' . $fromEmail
        );

        if ($success) {
            echo json_encode(['success' => true]);
        } else {
            http_response_code(500);
            echo json_encode(['success' => false, 'error' => 'Mail delivery failed']);
        }

        break;

    default:
        http_response_code(405);
        echo json_encode(['success' => false, 'error' => 'Method not allowed']);
        exit;
}
