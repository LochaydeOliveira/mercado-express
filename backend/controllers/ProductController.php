<?php

class ProductController extends BaseController
{
    private Product $products;
    private Notification $notifications;
    private PriceHistory $history;

    public function __construct()
    {
        $this->products = new Product();
        $this->notifications = new Notification();
        $this->history = new PriceHistory();
    }

    /**
     * Lista produtos
     */
    public function index(): never
    {
        AuthMiddleware::handle();

        $this->success(
            'Produtos encontrados.',
            $this->products->list()
        );
    }

    /**
     * Detalhes
     */
    public function show(int $id): never
    {
        AuthMiddleware::handle();

        $product = $this->products->get($id);

        if (!$product) {

            $this->error(
                'Produto não encontrado.',
                [],
                404
            );
        }

        $this->success(
            '',
            $product
        );
    }

    /**
     * Pesquisa
     */
    public function search(): never
    {
        AuthMiddleware::handle();

        $term = trim(
            $this->query('q') ?? ''
        );

        $this->success(
            '',
            $this->products->search($term)
        );
    }

    /**
     * Cadastro
     */
    public function store(): never
    {
        AuthMiddleware::handle();

        CSRFMiddleware::handle();

        $data = $this->input();

        $validator = new Validator();

        $validator
            ->required('nome', $data['nome'] ?? null)
            ->required('preco', $data['preco'] ?? null)
            ->required('codigo_barras', $data['codigo_barras'] ?? null);

        if ($validator->fails()) {

            $this->error(
                'Dados inválidos.',
                $validator->errors(),
                422
            );
        }

        if ($this->products->barcodeExists($data['codigo_barras'])) {

            $this->error(
                'Código de barras já cadastrado.',
                [],
                409
            );
        }

        $data['usuario_criacao'] = $_SESSION['usuario']['id'];
        $data['usuario_ultima_edicao'] = $_SESSION['usuario']['id'];
        $data['data_atualizacao'] = date('Y-m-d H:i:s');
        $data['ativo'] = 1;

        $id = $this->products->create($data);

        $this->notifications->create(
            'Novo Produto',
            "Produto {$data['nome']} cadastrado.",
            $id,
            $_SESSION['usuario']['id']
        );

        $this->success(
            'Produto cadastrado com sucesso.',
            [
                'id' => $id
            ],
            201
        );
    }

    /**
     * Atualização
     */
    public function update(int $id): never
    {
        AuthMiddleware::handle();

        CSRFMiddleware::handle();

        $product = $this->products->get($id);

        if (!$product) {

            $this->error(
                'Produto não encontrado.',
                [],
                404
            );
        }

        $data = $this->input();

        $validator = new Validator();

        $validator
            ->required('nome', $data['nome'] ?? null)
            ->required('preco', $data['preco'] ?? null);

        if ($validator->fails()) {

            $this->error(
                'Dados inválidos.',
                $validator->errors(),
                422
            );
        }

        if (
            isset($data['codigo_barras']) &&
            $this->products->barcodeExists(
                $data['codigo_barras'],
                $id
            )
        ) {

            $this->error(
                'Código de barras já utilizado.',
                [],
                409
            );
        }

        $valorAntigo = (float)$product['preco'];

        $valorNovo = (float)$data['preco'];

        $data['usuario_ultima_edicao'] =
            $_SESSION['usuario']['id'];

        $data['data_atualizacao'] =
            date('Y-m-d H:i:s');

        $this->products->update(
            $id,
            $data
        );

        if ($valorAntigo != $valorNovo) {

            $this->history->register(

                $id,

                $_SESSION['usuario']['id'],

                $valorAntigo,

                $valorNovo

            );
        }

        $this->notifications->create(

            'Produto atualizado',
            "Produto {$data['nome']} atualizado.",

            $id,

            $_SESSION['usuario']['id']

        );

        $this->success(
            'Produto atualizado com sucesso.'
        );
    }

    /**
     * Exclusão
     */
    public function destroy(int $id): never
    {
        AuthMiddleware::handle();

        CSRFMiddleware::handle();

        $product = $this->products->get($id);

        if (!$product) {

            $this->error(
                'Produto não encontrado.',
                [],
                404
            );
        }

        $this->products->delete($id);
        $this->notifications->create(

            'Produto excluído',

            "Produto {$product['nome']} foi excluído.",

            $id,

            $_SESSION['usuario']['id']

        );

        $this->success(
            'Produto excluído com sucesso.'
        );
    }
}