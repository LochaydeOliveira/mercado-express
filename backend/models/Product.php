<?php

class Product extends BaseModel
{
    protected string $table = 'produtos';

    /**
     * Normaliza texto para comparação
     */
    private function normalize(string $text): string
    {
        if (class_exists('Transliterator')) {
            $text = transliterator_transliterate(
                'NFD; [:Nonspacing Mark:] Remove; NFC',
                $text
            );
        } else {
            $text = iconv('UTF-8', 'ASCII//TRANSLIT//IGNORE', $text);
        }

        return mb_strtolower($text ?? '', 'UTF-8');
    }

    /**
     * Calcula relevância da busca
     */
    private function score(string $needle, string $text): int
    {
        $needle = $this->normalize($needle);
        $text   = $this->normalize($text);

        if ($needle === $text) {
            return 100;
        }

        if (str_starts_with($text, $needle)) {
            return 80;
        }

        if (str_contains($text, $needle)) {
            return 60;
        }

        similar_text($needle, $text, $percent);

        return (int)$percent;
    }

    /**
     * Lista produtos ativos
     */
    public function list(): array
    {
        return $this->query("
            SELECT *
            FROM produtos
            WHERE ativo = 1
            ORDER BY nome
        ");
    }

    /**
     * Busca inteligente
     */
    public function search(string $term): array {
        $term = trim($term);

        if ($term === '') {
            return [];
        }

        $stmt = $this->db->prepare("
            SELECT
                id,
                nome,
                preco,
                foto,
                codigo_barras
            FROM produtos
            WHERE ativo = 1
        ");

        $stmt->execute();

        $products = $stmt->fetchAll();

        $result = [];

        foreach ($products as $product) {

            $score = max(

                $this->score(
                    $term,
                    $product['nome']
                ),

                $this->score(
                    $term,
                    $product['codigo_barras']
                )

            );

            if ($score >= 40) {

                $product['_score'] = $score;

                $result[] = $product;
            }
        }

        usort($result, function ($a, $b) {

            return $b['_score'] <=> $a['_score'];

        });

        foreach ($result as &$row) {

            unset($row['_score']);

        }

        return array_slice($result, 0, 20);
    }

    /**
     * Busca completa do produto ativo
     */
    public function get(int $id): ?array
    {
        return $this->queryOne(
            "
            SELECT *
            FROM produtos
            WHERE id = :id AND ativo = 1
            LIMIT 1
            ",
            [
                ':id' => $id
            ]
        );
    }

    /**
     * Busca código de barras ativo
     */
    public function findByBarcode(string $barcode): ?array {
        $stmt = $this->db->prepare("
            SELECT *
            FROM produtos
            WHERE codigo_barras = :barcode AND ativo = 1
            LIMIT 1
        ");

        $stmt->execute([
            ':barcode' => $barcode
        ]);

        return $stmt->fetch() ?: null;
    }

    /**
     * Verifica duplicidade
     */
    public function barcodeExists(
        string $barcode,
        ?int $ignore = null
    ): bool {

        $sql = "
            SELECT COUNT(*)
            FROM produtos
            WHERE codigo_barras = :barcode AND ativo = 1
        ";

        $params = [

            ':barcode' => $barcode

        ];

        if ($ignore !== null) {

            $sql .= " AND id <> :id";

            $params[':id'] = $ignore;

        }

        $stmt = $this->db->prepare($sql);

        $stmt->execute($params);

        return (bool)$stmt->fetchColumn();
    }

    /**
     * Insere um novo produto no banco de dados
     */
    public function create(array $data): ?int
    {
        try {
            $stmt = $this->db->prepare("
                INSERT INTO produtos (
                    codigo_barras, 
                    nome, 
                    descricao, 
                    preco, 
                    preco_custo, 
                    estoque_atual, 
                    estoque_minimo, 
                    foto, 
                    ativo, 
                    created_at, 
                    updated_at
                ) VALUES (
                    :codigo_barras, 
                    :nome, 
                    :descricao, 
                    :preco, 
                    :preco_custo, 
                    :estoque_atual, 
                    :estoque_minimo, 
                    :foto, 
                    1, 
                    NOW(), 
                    NOW()
                )
            ");

            $stmt->execute([
                ':codigo_barras'  => $data['codigo_barras'] ?? null,
                ':nome'           => $data['nome'],
                ':descricao'      => $data['descricao'] ?? null,
                ':preco'          => $data['preco'],
                ':preco_custo'    => $data['preco_custo'] ?? 0.0,
                ':estoque_atual'  => $data['estoque_atual'] ?? 0,
                ':estoque_minimo' => $data['estoque_minimo'] ?? 0,
                ':foto'           => $data['foto'] ?? null
            ]);

            return (int)$this->db->lastInsertId();
        } catch (PDOException $e) {
            error_log("Erro no Product::create: " . $e->getMessage());
            return null;
        }
    }

    /**
     * Atualiza um produto ativo existente
     */
    public function update(int $id, array $data): bool
    {
        try {
            $stmt = $this->db->prepare("
                UPDATE produtos SET 
                    codigo_barras = :codigo_barras, 
                    nome = :nome, 
                    descricao = :descricao, 
                    preco = :preco, 
                    preco_custo = :preco_custo, 
                    estoque_atual = :estoque_atual, 
                    estoque_minimo = :estoque_minimo, 
                    foto = :foto, 
                    updated_at = NOW() 
                WHERE id = :id AND ativo = 1
            ");

            return $stmt->execute([
                ':id'             => $id,
                ':codigo_barras'  => $data['codigo_barras'] ?? null,
                ':nome'           => $data['nome'],
                ':descricao'      => $data['descricao'] ?? null,
                ':preco'          => $data['preco'],
                ':preco_custo'    => $data['preco_custo'] ?? 0.0,
                ':estoque_atual'  => $data['estoque_atual'] ?? 0,
                ':estoque_minimo' => $data['estoque_minimo'] ?? 0,
                ':foto'           => $data['foto'] ?? null
            ]);
        } catch (PDOException $e) {
            error_log("Erro no Product::update: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Realiza a exclusão lógica desativando o registro
     */
    public function delete(int $id): bool
    {
        try {
            $stmt = $this->db->prepare("
                UPDATE produtos 
                SET ativo = 0, updated_at = NOW() 
                WHERE id = :id
            ");
            return $stmt->execute([':id' => $id]);
        } catch (PDOException $e) {
            error_log("Erro no Product::delete: " . $e->getMessage());
            return false;
        }
    }
}