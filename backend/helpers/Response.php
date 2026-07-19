<?php

class Response
{
    public static function success(
        string $message = '',
        mixed $data = null,
        int $status = 200
    ): never {

        http_response_code($status);

        echo json_encode([
            'success' => true,
            'message' => $message,
            'data' => $data
        ], JSON_UNESCAPED_UNICODE);

        exit;
    }

    public static function error(
        string $message,
        array $errors = [],
        int $status = 400
    ): never {

        http_response_code($status);

        echo json_encode([
            'success' => false,
            'message' => $message,
            'errors' => $errors
        ], JSON_UNESCAPED_UNICODE);

        exit;
    }
}