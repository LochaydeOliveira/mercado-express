<?php

class Security
{
    /**
     * Escapa saída HTML (proteção contra XSS)
     */
    public static function escape(?string $value): string
    {
        return htmlspecialchars(
            $value ?? '',
            ENT_QUOTES | ENT_SUBSTITUTE,
            'UTF-8'
        );
    }

    /**
     * Gera token aleatório
     */
    public static function randomToken(int $length = 64): string
    {
        return bin2hex(random_bytes($length / 2));
    }

    /**
     * Obtém ou cria token CSRF
     */
    public static function csrfToken(): string
    {
        if (empty($_SESSION['csrf_token'])) {

            $_SESSION['csrf_token'] = self::randomToken();
        }

        return $_SESSION['csrf_token'];
    }

    /**
     * Valida token CSRF
     */
    public static function validateCsrf(?string $token): bool
    {
        if (empty($_SESSION['csrf_token'])) {
            return false;
        }

        return hash_equals(
            $_SESSION['csrf_token'],
            $token ?? ''
        );
    }

    /**
     * Renova ID da sessão
     */
    public static function regenerateSession(): void
    {
        if (session_status() === PHP_SESSION_ACTIVE) {
            session_regenerate_id(true);
        }
    }
}