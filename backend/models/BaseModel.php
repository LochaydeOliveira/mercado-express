<?php

abstract class BaseModel
{
    protected PDO $db;

    protected string $table;

    protected string $primaryKey = 'id';

    public function __construct()
    {
        $this->db = Database::getInstance();
    }

    /*
    |--------------------------------------------------------------------------
    | Buscar por ID
    |--------------------------------------------------------------------------
    */

    public function find(int $id): ?array
    {
        $sql = "
            SELECT *
            FROM {$this->table}
            WHERE {$this->primaryKey} = :id
            LIMIT 1
        ";

        $stmt = $this->db->prepare($sql);

        $stmt->execute([
            ':id' => $id
        ]);

        return $stmt->fetch() ?: null;
    }

    /*
    |--------------------------------------------------------------------------
    | Listar ativos
    |--------------------------------------------------------------------------
    */

    public function all(): array
    {
        return $this->db
            ->query("
                SELECT *
                FROM {$this->table}
                WHERE ativo = 1
                ORDER BY id DESC
            ")
            ->fetchAll();
    }

    /*
    |--------------------------------------------------------------------------
    | Inserir
    |--------------------------------------------------------------------------
    */

    public function insert(array $data): int
    {
        $columns = array_keys($data);

        $fields = implode(',', $columns);

        $params = ':' . implode(',:', $columns);

        $sql = "
            INSERT INTO {$this->table}
            ($fields)
            VALUES
            ($params)
        ";

        $stmt = $this->db->prepare($sql);

        foreach ($data as $key => $value) {

            $stmt->bindValue(":{$key}", $value);
        }

        $stmt->execute();

        return (int)$this->db->lastInsertId();
    }

    /*
    |--------------------------------------------------------------------------
    | Atualizar
    |--------------------------------------------------------------------------
    */

    public function update(
        int $id,
        array $data
    ): bool {

        $fields = [];

        foreach ($data as $column => $value) {

            $fields[] = "{$column} = :{$column}";
        }

        $sql = "
            UPDATE {$this->table}
            SET
            " . implode(',', $fields) . "
            WHERE {$this->primaryKey} = :id
        ";

        $stmt = $this->db->prepare($sql);

        foreach ($data as $column => $value) {

            $stmt->bindValue(":{$column}", $value);
        }

        $stmt->bindValue(':id', $id);

        return $stmt->execute();
    }

    /*
    |--------------------------------------------------------------------------
    | Exclusão lógica
    |--------------------------------------------------------------------------
    */

    public function delete(int $id): bool
    {
        $stmt = $this->db->prepare("
            UPDATE {$this->table}
            SET ativo = 0
            WHERE {$this->primaryKey} = :id
        ");

        return $stmt->execute([
            ':id' => $id
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | Verifica existência
    |--------------------------------------------------------------------------
    */

    public function exists(
        string $column,
        mixed $value
    ): bool {

        $sql = "
            SELECT COUNT(*)
            FROM {$this->table}
            WHERE {$column} = :value
        ";

        $stmt = $this->db->prepare($sql);

        $stmt->execute([
            ':value' => $value
        ]);

        return (bool)$stmt->fetchColumn();
    }

    /*
    |--------------------------------------------------------------------------
    | Contagem
    |--------------------------------------------------------------------------
    */

    public function count(): int
    {
        return (int)$this->db
            ->query("
                SELECT COUNT(*)
                FROM {$this->table}
                WHERE ativo = 1
            ")
            ->fetchColumn();
    }

    /*
    |--------------------------------------------------------------------------
    | Executar SQL parametrizado
    |--------------------------------------------------------------------------
    */

    protected function query(
        string $sql,
        array $params = []
    ): array {

        $stmt = $this->db->prepare($sql);

        $stmt->execute($params);

        return $stmt->fetchAll();
    }

    /*
    |--------------------------------------------------------------------------
    | Executa consulta retornando um único registro
    |--------------------------------------------------------------------------
    */
    protected function queryOne(
        string $sql,
        array $params = []
    ): ?array {

        $stmt = $this->db->prepare($sql);

        $stmt->execute($params);

        $result = $stmt->fetch();

        return $result ?: null;
    }

    /*
    |--------------------------------------------------------------------------
    | Executa comandos sem retorno
    |--------------------------------------------------------------------------
    */
    protected function execute(
        string $sql,
        array $params = []
    ): bool {

        $stmt = $this->db->prepare($sql);

        return $stmt->execute($params);
    }

}