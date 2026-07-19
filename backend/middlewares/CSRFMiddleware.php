<?php

class CSRFMiddleware
{
    public static function handle(): void
    {
        $headers = getallheaders();

        $token = $headers['X-CSRF-TOKEN'] ?? '';

        if (!Security::validateCsrf($token)) {

            Response::error(
                'Token CSRF inválido.',
                [],
                403
            );
        }
    }
}