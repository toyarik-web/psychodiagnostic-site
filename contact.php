<?php
// Simple contact endpoint: sends email to site inbox
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  http_response_code(405);
  echo json_encode(['ok' => false, 'error' => 'Method Not Allowed']);
  exit;
}

function field(string $key): string {
  return trim($_POST[$key] ?? '');
}

$name = strip_tags(field('name'));
$emailRaw = field('email');
$message = trim(field('message'));
$consent = field('consent');

$email = filter_var($emailRaw, FILTER_VALIDATE_EMAIL) ? $emailRaw : '';
$consented = in_array(strtolower($consent), ['true', 'on', '1', 'yes'], true);

$errors = [];
if ($name === '') { $errors['name'] = "Вкажіть ім'я"; }
if ($email === '') { $errors['email'] = 'Некоректний email'; }
if ($message === '') { $errors['message'] = 'Вкажіть повідомлення'; }
if (!$consented) { $errors['consent'] = 'Потрібна згода'; }

if ($errors) {
  http_response_code(400);
  echo json_encode(['ok' => false, 'errors' => $errors]);
  exit;
}

$to = 'info@psychodiagnostic.online'; // destination inbox
$from = 'no-reply@psychodiagnostic.online'; // use your domain to pass SPF/DMARC
$subject = "Запит з сайту — PsychoDiagnostic";
$subjectEnc = '=?UTF-8?B?' . base64_encode($subject) . '?=';

// Extra context
$ip = $_SERVER['REMOTE_ADDR'] ?? '';
$ua = $_SERVER['HTTP_USER_AGENT'] ?? '';
$referer = $_SERVER['HTTP_REFERER'] ?? '';

$body = "Ім'я: {$name}\nEmail: {$email}\n\nПовідомлення:\n{$message}\n\nIP: {$ip}\nUA: {$ua}\nRef: {$referer}\n";

$headers = [];
$headers[] = "From: PsychoDiagnostic <{$from}>";
$headers[] = "Reply-To: {$email}";
$headers[] = "MIME-Version: 1.0";
$headers[] = "Content-Type: text/plain; charset=UTF-8";

$additionalParams = "-f {$from}"; // set envelope sender
$ok = @mail($to, $subjectEnc, $body, implode("\r\n", $headers), $additionalParams);

if ($ok) {
  echo json_encode(['ok' => true]);
} else {
  http_response_code(500);
  echo json_encode(['ok' => false, 'error' => 'Send failed']);
}
