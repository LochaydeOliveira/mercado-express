<?php

class PriceHistory extends BaseModel
{
    protected string $table = 'historico_precos';

    /**
     * Registra uma alteração de preço no histórico
     */
    public function register(
        int $produto,
        int $usuario,
        float $valorAntigo,
        float $valorNovo
    ): int {
        try {
            $stmt = $this->db->prepare("
                INSERT INTO historico_precos (
                    produto_id, 
                    usuario, 
                    valor_antigo, 
                    valor_novo, 
                    created_at
                ) VALUES (
                    :produto_id, 
                    :usuario, 
                    :valor_antigo, 
                    :valor_novo, 
                    NOW()
                )
            ");

            $stmt->execute([
                ':produto_id'   => $produto,
                ':usuario'      => $usuario,
                ':valor_antigo' => $valorAntigo,
                ':valor_novo'   => $valorNovo
            ]);

            return (int)$this->db->lastInsertId();
        } catch (PDOException $e) {
            error_log("Erro no PriceHistory::register: " . $e->getMessage());
            return 0;
        }
    }

    /**
     * Retorna o histórico de preços de um produto específico com os dados do usuário
     */
    public function byProduct(int $produto): array
    {
        try {
            $stmt = $this->db->prepare("
                SELECT 
                    h.*,
                    u.nome as usuario_nome
                FROM historico_precos h
                LEFT JOIN usuarios u ON u.id = h.usuario
                WHERE h.produto_id = :produto
                ORDER BY h.created_at DESC
            ");

            $stmt->execute([
                ':produto' => $produto
            ]);

            return $stmt->fetchAll(PDO::FETCH_ASSOC) ?: [];
        } catch (PDOException $e) {
            error_log("Erro no PriceHistory::byProduct: " . $e->getMessage());
            return [];
        }
    }
}