<?php

// 1. Carrega o autoloader nativo do projeto (procura classes nas pastas automaticamente)
require_once __DIR__ . '/../autoload.php';

// 2. Inicializa o roteador
$router = new Router();

// Define o prefixo padronizado para as rotas da versão 1
$router->prefix('/api/v1');

/*
|--------------------------------------------------------------------------
| Autenticação
|--------------------------------------------------------------------------
*/

$router->post(
    '/login',
    [AuthController::class, 'login']
);

$router->post(
    '/login/',
    [AuthController::class, 'login']
);

$router->post(
    '/logout',
    [AuthController::class, 'logout']
);

/*
|--------------------------------------------------------------------------
| Produtos
|--------------------------------------------------------------------------
*/

// Busca estática primeiro para evitar conflito com rotas dinâmicas como /produtos/{id}
$router->get(
    '/produtos/buscar',
    [ProductController::class, 'search']
);

$router->get(
    '/produtos',
    [ProductController::class, 'index']
);

$router->get(
    '/produtos/{id}',
    [ProductController::class, 'show']
);

$router->post(
    '/produtos',
    [ProductController::class, 'store']
);

$router->post(
    '/produtos/',
    [ProductController::class, 'store']
);

$router->put(
    '/produtos/{id}',
    [ProductController::class, 'update']
);

$router->delete(
    '/produtos/{id}',
    [ProductController::class, 'destroy']
);

/*
|--------------------------------------------------------------------------
| Notificações
|--------------------------------------------------------------------------
*/

$router->get(
    '/notificacoes',
    [NotificationController::class, 'index']
);

$router->post(
    '/notificacoes/lida',
    [NotificationController::class, 'read']
);

// 3. Executa o roteamento da requisição
$router->dispatch();