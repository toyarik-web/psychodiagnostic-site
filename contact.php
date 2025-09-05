<?php
header('Content-Type: application/json; charset=utf-8');
if ($_SERVER['REQUEST_METHOD'] !== 'POST') { http_response_code(405); echo json_encode(['ok'=>false,'error'=>'Method Not Allowed']); exit; }
function field($k){ return trim($_POST[$k] ?? ''); }
$name = strip_tags(field('name')); $email = field('email'); $phone = field('phone'); $message = field('message');
$ip = $_SERVER['REMOTE_ADDR'] ?? ''; $ua = $_SERVER['HTTP_USER_AGENT'] ?? ''; $ref = $_SERVER['HTTP_REFERER'] ?? '';
$body = "Ім'я: {$name}
Email: {$email}
Телефон: {$phone}

Повідомлення:
{$message}

IP: {$ip}
UA: {$ua}
Ref: {$ref}
";
$subject = 'Нова заявка з сайту PsychoDiagnostic';
$subjectEnc = '=?UTF-8?B?'.base64_encode($subject).'?=';
$to = 'info@psychodiagnostic.online';
$conf = @include __DIR__ . '/config.php';
$sent = false; $log = '';

if (is_array($conf)) {
  require __DIR__ . '/lib/PHPMailer/PHPMailer.php';
  require __DIR__ . '/lib/PHPMailer/SMTP.php';
  require __DIR__ . '/lib/PHPMailer/Exception.php';
  $m = new PHPMailer\PHPMailer\PHPMailer(true);
  try {
    $m->isSMTP();
    $m->Host = $conf['host'];
    $m->Port = (int)$conf['port'];
    $m->SMTPAuth = true;
    $m->SMTPSecure = $conf['secure']; // 'tls' or 'ssl'
    $m->CharSet = 'UTF-8';
    $m->Username = $conf['username'];
    $m->Password = $conf['password'];
    $m->setFrom($conf['from_email'], $conf['from_name']);
    if ($email) { $m->addReplyTo($email); }
    $m->addAddress($to);
    $m->addBCC('y.hrydkovets@gmail.com');
    $m->addBCC('thepsychodiagnostic@gmail.com');
    $m->Subject = $subject;
    $m->isHTML(true);
    $m->Body = nl2br(htmlspecialchars($body, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8'));
    $m->AltBody = $body;
    $m->addCustomHeader('List-Unsubscribe', '<mailto:info@psychodiagnostic.online>');
    $sent = $m->send();
  } catch (Throwable $e) {
    $log = 'PHPMailer: '.$e->getMessage();
  }
}

if (!$sent) {
  $from = is_array($conf) ? ($conf['from_email'] ?? 'no-reply@psychodiagnostic.online') : 'no-reply@psychodiagnostic.online';
  $headers = ["From: PsychoDiagnostic <{$from}", "Reply-To: {$email}", 'MIME-Version: 1.0', 'Content-Type: text/plain; charset=UTF-8'];
  @mail($to, $subjectEnc, $body, implode("
", $headers), "-f {$from}");
  $log = trim($log.'; fallback=mail()');
  $sent = true; // best effort
}

@file_put_contents(__DIR__.'/mail.log', date('c').' SMTP '.($sent?'OK':'FAIL').' | '.$email.' | '.str_replace("
",' ',substr($message,0,200)).' | '.$log."
", FILE_APPEND);

echo json_encode(['ok'=>(bool)$sent]);
