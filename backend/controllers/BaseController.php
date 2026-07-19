<?php

abstract class BaseController
{
    protected function success(
        string $message = '',
        mixed $data = null,
        int $status = 200
    ): never {

        Response::success(
            $message,
            $data,
            $status
        );
    }

    protected function error(
        string $message,
        array $errors = [],
        int $status = 400
    ): never {

        Response::error(
            $message,
            $errors,
            $status
        );
    }

    protected function input(): array
    {
        return Request::input();
    }

    protected function query(string $key = null)
    {
        return Request::query($key);
    }

    protected function file(
        string $name
    ): ?array {

        return Request::file($name);
    }

    protected function hasFile(
        string $name
    ): bool {

        return Request::hasFile($name);
    }
}