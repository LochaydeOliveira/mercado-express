<?php

spl_autoload_register(function ($class) {

    $folders = [

        'config',

        'controllers',

        'models',

        'helpers',

        'middlewares',

        'routes'
    ];

    foreach ($folders as $folder) {

        $file = __DIR__ . "/{$folder}/{$class}.php";

        if (file_exists($file)) {

            require_once $file;

            return;
        }
    }
});