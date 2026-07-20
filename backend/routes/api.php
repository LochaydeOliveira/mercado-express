<?php

require_once __DIR__ . '/../autoload.php';

$router = new Router();

/*
|--------------------------------------------------------------------------
| Autenticação (Suporta com e sem /api/v1)
|--------------------------------------------------------------------------
*/

$router->post('/login', [AuthController::class, 'login']);
$router->post('/login/', [AuthController::class, 'login']);
$router->post('/api/v1/login', [AuthController::class, 'login']);
$router->post('/api/v1/login/', [AuthController::class, 'login']);

$router->post('/logout', [AuthController::class, 'logout']);
$router->post('/api/v1/logout', [AuthController::class, 'logout']);

/*
|--------------------------------------------------------------------------
| Produtos (Suporta com e sem /api/v1)
|--------------------------------------------------------------------------
*/

$router->get('/produtos/buscar', [ProductController::class, 'search']);
$router->get('/api/v1/produtos/buscar', [ProductController::class, 'search']);

$router->get('/produtos', [ProductController::class, 'index']);
$router->get('/api/v1/produtos', [ProductController::class, 'index']);

$router->get('/produtos/{id}', [ProductController::class, 'show']);
$router->get('/api/v1/produtos/{id}', [ProductController::class, 'show']);

// POST Produtos
$router->post('/produtos', [ProductController::class, 'store']);
$router->post('/produtos/', [ProductController::class, 'store']);
$router->post('/api/v1/produtos', [ProductController::class, 'store']);
$router->post('/api/v1/produtos/', [ProductController::class, 'store']);
$router->post('/backend/routes/api.php/produtos', [ProductController::class, 'store']);

// PUT e DELETE Produtos
$router->put('/produtos/{id}', [ProductController::class, 'update']);
$router->put('/api/v1/produtos/{id}', [ProductController::class, 'update']);

$router->delete('/produtos/{id}', [ProductController::class, 'destroy']);
$router->delete('/api/v1/produtos/{id}', [ProductController::class, 'destroy']);

/*
|--------------------------------------------------------------------------
| Notificações
|--------------------------------------------------------------------------
*/

$router->get('/notificacoes', [NotificationController::class, 'index']);
$router->get('/api/v1/notificacoes', [NotificationController::class, 'index']);

$router->post('/notificacoes/lida', [NotificationController::class, 'read']);
$router->post('/api/v1/notificacoes/lida', [NotificationController::class, 'read']);

$router->dispatch();