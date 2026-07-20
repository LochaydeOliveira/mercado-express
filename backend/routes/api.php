<?php

require_once __DIR__ . '/../routes/Router.php';
require_once __DIR__ . '/../controllers/AuthController.php';
require_once __DIR__ . '/../controllers/ProductController.php';
require_once __DIR__ . '/../controllers/NotificationController.php';

// 2. Inicializa o roteador
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
| Produtos
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