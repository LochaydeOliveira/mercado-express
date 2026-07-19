<?php

class Validator
{
    private array $errors = [];

    public function required(
        string $field,
        mixed $value,
        string $message = null
    ): self {

        if (
            $value === null ||
            $value === ''
        ) {

            $this->errors[$field] =
                $message ??
                "O campo {$field} é obrigatório.";
        }

        return $this;
    }

    public function min(
        string $field,
        string $value,
        int $size
    ): self {

        if (mb_strlen($value) < $size) {

            $this->errors[$field] =
                "O campo {$field} deve possuir pelo menos {$size} caracteres.";
        }

        return $this;
    }

    public function numeric(
        string $field,
        mixed $value
    ): self {

        if (!is_numeric($value)) {

            $this->errors[$field] =
                "O campo {$field} deve ser numérico.";
        }

        return $this;
    }

    public function max(
        string $field,
        string $value,
        int $size
    ): self {

        if (mb_strlen($value) > $size) {

            $this->errors[$field] =
                "O campo {$field} excede {$size} caracteres.";
        }

        return $this;
    }

    public function errors(): array
    {
        return $this->errors;
    }

    public function fails(): bool
    {
        return !empty($this->errors);
    }
}