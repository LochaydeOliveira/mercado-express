<?php

// 1. Responde requisições Preflight (OPTIONS) do Axios/CORS antes do roteamento
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header('Access-Control-Allow-Origin: ' . ($_SERVER['HTTP_ORIGIN'] ?? '*'));
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, X-CSRF-TOKEN');
    header('Access-Control-Allow-Credentials: true');
    http_response_code(200);
    exit;
}

// 2. Carrega o autoloader nativo do projeto
require_once __DIR__ . '/../autoload.php';

// 3. Inicializa o roteador
$router = new Router();

// Define o prefixo padronizado
$router->prefix('/api/v1');

/*
|--------------------------------------------------------------------------
| Autenticação
|--------------------------------------------------------------------------
*/

$router->post('/login', [AuthController::class, 'login']);
$router->post('/login/', [AuthController::class, 'login']);

$router->post('/logout', [AuthController::class, 'logout']);
$router->post('/logout/', [AuthController::class, 'logout']);

/*
|--------------------------------------------------------------------------
| Produtos
|--------------------------------------------------------------------------
*/

// GET - Busca e Listagem
$router->get('/produtos/buscar', [ProductController::class, 'search']);
$router->get('/produtos/buscar/', [ProductController::class, 'search']);

$router->get('/produtos', [ProductController::class, 'index']);
$router->get('/produtos/', [ProductController::class, 'index']);

$router->get('/produtos/{id}', [ProductController::class, 'show']);

// POST - Cadastro de Produtos (Com e sem barra no final)
$router->post('/produtos', [ProductController::class, 'store']);
$router->post('/produtos/', [ProductController::class, 'store']);

// PUT / DELETE - Edição e Remoção
$router->put('/produtos/{id}', [ProductController::class, 'update']);
$router->delete('/produtos/{id}', [ProductController::class, 'destroy']);

/*
|--------------------------------------------------------------------------
| Notificações
|--------------------------------------------------------------------------
*/

$router->get('/notificacoes', [NotificationController::class, 'index']);
$router->get('/notificacoes/', [NotificationController::class, 'index']);

$router->post('/notificacoes/lida', [NotificationController::class, 'read']);
$router->post('/notificacoes/lida/', [NotificationController::class, 'read']);

// 4. Executa o roteamento da requisição
$router->dispatch();