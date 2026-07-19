<?php

require_once __DIR__ . '/env.php';

Env::load(__DIR__ . '/../.env');

date_default_timezone_set(
    Env::get('TIMEZONE', 'America/Fortaleza')
);

// --- Configurações de CORS para Integração com o React ---
$origin = $_SERVER['HTTP_ORIGIN'] ?? '*';
header("Access-Control-Allow-Origin: $origin");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, X-CSRF-TOKEN");
header("Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS");
header('Content-Type: application/json; charset=UTF-8');

// Se for uma requisição de preflight (OPTIONS), finaliza com status 200 imediatamente
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

mb_internal_encoding('UTF-8');

// Melhora a segurança do cookie de sessão que será enviado ao React
ini_set('session.cookie_httponly', 1);
ini_set('session.use_only_cookies', 1);
ini_set('session.cookie_samesite', 'Lax'); // Permite envio de cookies entre domínios relacionados de forma segura

session_name('mercadoexpress');
session_start();

error_reporting(E_ALL);

ini_set(
    'display_errors',
    Env::get('APP_DEBUG') === 'true' ? '1' : '0'
);