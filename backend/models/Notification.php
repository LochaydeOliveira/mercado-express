<?php

class Notification extends BaseModel
{
    protected string $table = 'notificacoes';

    /**
     * Cria uma nova notificação
     */
    public function create(
        string $titulo,
        string $mensagem,
        int $produtoId,
        int $usuarioId
    ): int {
        try {
            $stmt = $this->db->prepare("
                INSERT INTO notificacoes (
                    titulo, 
                    mensagem, 
                    produto_id, 
                    usuario_origem, 
                    lida, 
                    created_at
                ) VALUES (
                    :titulo, 
                    :mensagem, 
                    :produto_id, 
                    :usuario_origem, 
                    0, 
                    NOW()
                )
            ");

            $stmt->execute([
                ':titulo'         => $titulo,
                ':mensagem'       => $mensagem,
                ':produto_id'     => $produtoId,
                ':usuario_origem' => $usuarioId
            ]);

            return (int)$this->db->lastInsertId();
        } catch (PDOException $e) {
            error_log("Erro no Notification::create: " . $e->getMessage());
            return 0;
        }
    }

    /**
     * Lista todas as notificações não lidas
     */
    public function unread(): array
    {
        return $this->query("
            SELECT *
            FROM notificacoes
            WHERE lida = 0
            ORDER BY id DESC
        ");
    }

    /**
     * Marca uma notificação específica como lida
     */
    public function markAsRead(int $id): bool
    {
        try {
            $stmt = $this->db->prepare("
                UPDATE notificacoes 
                SET lida = 1 
                WHERE id = :id
            ");
            return $stmt->execute([':id' => $id]);
        } catch (PDOException $e) {
            error_log("Erro no Notification::markAsRead: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Marca todas as notificações pendentes como lidas
     */
    public function markAllAsRead(): bool
    {
        try {
            $stmt = $this->db->prepare("
                UPDATE notificacoes 
                SET lida = 1 
                WHERE lida = 0
            ");
            return $stmt->execute();
        } catch (PDOException $e) {
            error_log("Erro no Notification::markAllAsRead: " . $e->getMessage());
            return false;
        }
    }
}