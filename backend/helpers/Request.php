<?php

class Request
{
    /**
     * Método HTTP
     */
    public static function method(): string
    {
        if (
            $_SERVER['REQUEST_METHOD'] === 'POST' &&
            isset($_POST['_method'])
        ) {
            return strtoupper($_POST['_method']);
        }

        return strtoupper($_SERVER['REQUEST_METHOD']);
    }

    /**
     * URI
     */
    public static function uri(): string
    {
        $uri = parse_url(
            $_SERVER['REQUEST_URI'],
            PHP_URL_PATH
        );

        $base = dirname($_SERVER['SCRIPT_NAME']);

        if ($base !== '/') {
            $uri = preg_replace(
                '#^' . preg_quote($base, '#') . '#',
                '',
                $uri
            );
        }

        return '/' . trim($uri, '/');
    }

    /**
     * Dados enviados
     */
    public static function input(): array
    {
        $contentType = $_SERVER['CONTENT_TYPE'] ?? '';

        /*
        |--------------------------------------------------------------------------
        | JSON
        |--------------------------------------------------------------------------
        */
        if (str_contains($contentType, 'application/json')) {
            $json = file_get_contents('php://input');
            $data = json_decode($json, true);

            return is_array($data) ? $data : [];
        }

        /*
        |--------------------------------------------------------------------------
        | multipart/form-data ou x-www-form-urlencoded
        |--------------------------------------------------------------------------
        */
        // Se for um PUT/DELETE nativo (sem _method bypass), PHP não popula o $_POST automaticamente.
        if ($_SERVER['REQUEST_METHOD'] !== 'POST' && $_SERVER['REQUEST_METHOD'] !== 'GET') {
            parse_str(file_get_contents('php://input'), $putData);
            return array_merge($putData, $_POST);
        }

        return $_POST;
    }

    /**
     * Arquivos enviados
     */
    public static function file(string $name): ?array
    {
        return $_FILES[$name] ?? null;
    }

    /**
     * Existe arquivo?
     */
    public static function hasFile(string $name): bool
    {
        return isset($_FILES[$name]) && $_FILES[$name]['error'] === UPLOAD_ERR_OK;
    }

    /**
     * Query String
     */
    public static function query(string $key = null)
    {
        if ($key === null) {
            return $_GET;
        }

        return $_GET[$key] ?? null;
    }
}