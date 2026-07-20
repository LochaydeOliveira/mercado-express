<?php

// 1. Carrega as classes base/core do sistema
require_once __DIR__ . '/../core/Router.php';
require_once __DIR__ . '/../models/BaseModel.php'; // 👈 IMPORTANTE: carrega o BaseModel primeiro!

// 2. Carrega os Models
require_once __DIR__ . '/../models/User.php';
require_once __DIR__ . '/../models/Product.php';
// require_once __DIR__ . '/../models/Notification.php'; // Adicione se houver esse model

// 3. Carrega os Controllers
require_once __DIR__ . '/../controllers/AuthController.php';
require_once __DIR__ . '/../controllers/ProductController.php';
require_once __DIR__ . '/../controllers/NotificationController.php';

// 4. Inicializa o roteador e as rotas
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