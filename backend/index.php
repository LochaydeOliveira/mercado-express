<?php

require_once __DIR__ . '/autoload.php';

require_once __DIR__ . '/config/app.php';

try {

    require_once __DIR__ . '/routes/api.php';

} catch (Throwable $e) {

    Response::error(

        'Erro interno do servidor.',

        Env::get('APP_DEBUG') === 'true'
            ? [
                'exception' => $e->getMessage(),
                'line' => $e->getLine(),
                'file' => $e->getFile()
            ]
            : [],

        500
    );
}