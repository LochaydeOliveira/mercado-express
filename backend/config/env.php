<?php

class Env
{
    private static array $variables = [];

    public static function load(string $path): void
    {
        if (!file_exists($path)) {
            throw new Exception(".env não encontrado.");
        }

        $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);

        foreach ($lines as $line) {

            $line = trim($line);

            if ($line === '' || str_starts_with($line, '#')) {
                continue;
            }

            if (!str_contains($line, '=')) {
                continue;
            }

            [$key, $value] = explode('=', $line, 2);

            $key = trim($key);
            $value = trim($value);

            self::$variables[$key] = $value;

            $_ENV[$key] = $value;
            putenv("$key=$value");
        }
    }

    public static function get(string $key, mixed $default = null): mixed
    {
        return self::$variables[$key] ?? $default;
    }
}