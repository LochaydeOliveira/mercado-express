<?php

class AuthMiddleware
{
    public static function handle(): void
    {
        if (empty($_SESSION['usuario'])) {

            Response::error(
                'Sessão expirada.',
                [],
                401
            );
        }
    }
}