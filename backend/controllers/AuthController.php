<?php

// Ajustado para apontar exatamente para a pasta 'models' em minúsculo
require_once __DIR__ . '/../models/User.php';

class AuthController extends BaseController
{
    private User $users;

    public function __construct()
    {
        $this->users = new User();
    }

    /**
     * Realiza a autenticação do usuário
     */
    public function login(): never
    {
        $data = $this->input();

        $validator = new Validator();

        $validator
            ->required('usuario', $data['usuario'] ?? null)
            ->required('senha', $data['senha'] ?? null);

        if ($validator->fails()) {
            $this->error(
                'Dados inválidos.',
                $validator->errors(),
                422
            );
        }

        $user = $this->users->findByUsername(
            trim($data['usuario'])
        );

        if (!$user) {
            $this->error(
                'Usuário ou senha inválidos.',
                [],
                401
            );
        }

        if (!password_verify(
            $data['senha'],
            $user['senha']
        )) {
            $this->error(
                'Usuário ou senha inválidos.',
                [],
                401
            );
        }

        Security::regenerateSession();

        $_SESSION['usuario'] = [
            'id' => $user['id'],
            'nome' => $user['nome'],
            'usuario' => $user['usuario']
        ];

        $this->users->updateLastLogin(
            $user['id']
        );

        $this->success(
            'Login realizado com sucesso.',
            [
                'usuario' => [
                    'id' => $user['id'],
                    'nome' => $user['nome'],
                    'usuario' => $user['usuario']
                ],
                'csrf_token' => Security::csrfToken()
            ]
        );
    }

    /**
     * Verifica o estado atual da sessão
     */
    public function check(): never
    {
        if (isset($_SESSION['usuario'])) {
            $this->success(
                'Sessão ativa.',
                [
                    'usuario' => $_SESSION['usuario'],
                    'csrf_token' => Security::csrfToken()
                ]
            );
        }

        $this->error(
            'Não autenticado.',
            [],
            401
        );
    }

    /**
     * Finaliza a sessão do usuário com segurança
     */
    public function logout(): never
    {
        $_SESSION = [];

        if (ini_get('session.use_cookies')) {
            $params = session_get_cookie_params();
            setcookie(
                session_name(),
                '',
                time() - 42000,
                $params['path'],
                $params['domain'],
                $params['secure'],
                $params['httponly']
            );
        }

        session_destroy();

        $this->success(
            'Logout realizado com sucesso.'
        );
    }
}