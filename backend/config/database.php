<?php

class Database
{
    private static ?PDO $instance = null;

    private function __construct()
    {
    }

    public static function getInstance(): PDO
    {
        if (self::$instance === null) {

            $dsn = sprintf(
                "mysql:host=%s;port=%s;dbname=%s;charset=utf8mb4",
                Env::get('DB_HOST'),
                Env::get('DB_PORT'),
                Env::get('DB_DATABASE')
            );

            self::$instance = new PDO(
                $dsn,
                Env::get('DB_USERNAME'),
                Env::get('DB_PASSWORD'),
                [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                    PDO::ATTR_EMULATE_PREPARES => false
                ]
            );
        }

        return self::$instance;
    }
}