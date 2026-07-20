<?php

require_once __DIR__ . '/../autoload.php';

$router = new Router();
$router->prefix('/api/v1');

/*
|--------------------------------------------------------------------------
| Autenticação
|--------------------------------------------------------------------------
*/

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
| Produtos (Busca estática primeiro para evitar conflito!)
|--------------------------------------------------------------------------
*/

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

$router->dispatch();