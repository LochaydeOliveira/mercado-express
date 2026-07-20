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

// Ajustado para evitar bloqueios de diretiva em servidores compartilhados
session_name('mercadoexpress');
session_start();

error_reporting(E_ALL);
ini_set('display_errors', '1');

// --- CARREGAMENTO MANUAL DE CLASSES BASE (Evita Erro 500 na HostGator) ---
// Nota: Se algum destes arquivos estiver em subpastas diferentes (ex: /src/ ou /helpers/), 
// ajuste o caminho do require correspondente.
if (file_exists(__DIR__ . '/database.php')) require_once __DIR__ . '/database.php';
if (file_exists(__DIR__ . '/../models/BaseModel.php')) require_once __DIR__ . '/../models/BaseModel.php';
if (file_exists(__DIR__ . '/../Models/BaseModel.php')) require_once __DIR__ . '/../Models/BaseModel.php';

if (file_exists(__DIR__ . '/../controllers/BaseController.php')) require_once __DIR__ . '/../controllers/BaseController.php';
if (file_exists(__DIR__ . '/../Controllers/BaseController.php')) require_once __DIR__ . '/../Controllers/BaseController.php';

if (file_exists(__DIR__ . '/../helpers/Validator.php')) require_once __DIR__ . '/../helpers/Validator.php';
if (file_exists(__DIR__ . '/../helpers/Security.php')) require_once __DIR__ . '/../helpers/Security.php';
if (file_exists(__DIR__ . '/../utils/Validator.php')) require_once __DIR__ . '/../utils/Validator.php';
if (file_exists(__DIR__ . '/../utils/Security.php')) require_once __DIR__ . '/../utils/Security.php';