<?php

class User extends BaseModel
{
    protected string $table = 'usuarios';

    public function findByUsername(string $username): array|null
    {
        $sql = "
            SELECT *
            FROM usuarios
            WHERE usuario = :usuario
              AND ativo = 1
            LIMIT 1
        ";

        $stmt = $this->db->prepare($sql);

        $stmt->execute([
            ':usuario' => $username
        ]);

        $user = $stmt->fetch();

        return $user ?: null;
    }

    public function updateLastLogin(int $id): void
    {
        $stmt = $this->db->prepare("
            UPDATE usuarios
            SET ultimo_login = NOW()
            WHERE id = :id
        ");

        $stmt->execute([
            ':id' => $id
        ]);
    }
}