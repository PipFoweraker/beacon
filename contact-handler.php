<?php
// contact-handler.php — Sends contact form submissions to admin@beacongcr.org
// Deployed on Dreamhost (PHP available by default)

// Honeypot check — bots fill hidden fields, humans don't
if (!empty($_POST['website'])) {
    // Silently redirect as if successful — don't reveal the trap
    header('Location: /contact.html?status=sent');
    exit;
}

// Validate required fields
$name    = trim($_POST['name'] ?? '');
$email   = trim($_POST['email'] ?? '');
$subject = trim($_POST['subject'] ?? '');
$message = trim($_POST['message'] ?? '');

if ($name === '' || $email === '' || $subject === '' || $message === '') {
    header('Location: /contact.html?status=error&reason=missing');
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    header('Location: /contact.html?status=error&reason=email');
    exit;
}

// Rate limiting via session (basic protection against form spam)
session_start();
$now = time();
$last_submit = $_SESSION['last_contact_submit'] ?? 0;
if ($now - $last_submit < 60) {
    header('Location: /contact.html?status=error&reason=rate');
    exit;
}
$_SESSION['last_contact_submit'] = $now;

// Sanitize for email headers — prevent header injection
$safe_name  = str_replace(["\r", "\n"], '', $name);
$safe_email = str_replace(["\r", "\n"], '', $email);

$to = 'admin@beacongcr.org';
$mail_subject = "Contact form: $subject";
$body  = "Name: $safe_name\n";
$body .= "Email: $safe_email\n";
$body .= "Subject: $subject\n\n";
$body .= $message;

$headers  = "From: noreply@beacongcr.org\r\n";
$headers .= "Reply-To: $safe_email\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

$sent = mail($to, $mail_subject, $body, $headers);

if ($sent) {
    header('Location: /contact.html?status=sent');
} else {
    header('Location: /contact.html?status=error&reason=send');
}
exit;
