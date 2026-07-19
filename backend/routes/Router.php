<?php

class Router
{
    private array $routes = [];

    private string $prefix = '';

    public function prefix(string $prefix): void
    {
        $this->prefix = rtrim($prefix, '/');
    }

    public function get(string $uri, array $action): void
    {
        $this->add('GET', $uri, $action);
    }

    public function post(string $uri, array $action): void
    {
        $this->add('POST', $uri, $action);
    }

    public function put(string $uri, array $action): void
    {
        $this->add('PUT', $uri, $action);
    }

    public function patch(string $uri, array $action): void
    {
        $this->add('PATCH', $uri, $action);
    }

    public function delete(string $uri, array $action): void
    {
        $this->add('DELETE', $uri, $action);
    }

    private function add(
        string $method,
        string $uri,
        array $action
    ): void {

        $uri = $this->prefix . '/' . trim($uri, '/');

        $uri = rtrim($uri, '/');

        if ($uri === '') {
            $uri = '/';
        }

        $this->routes[] = [

            'method' => $method,

            'uri' => $uri,

            'action' => $action
        ];
    }

    public function dispatch(): void
    {
        $method = Request::method();

        $uri = Request::uri();

        foreach ($this->routes as $route) {

            $pattern = preg_replace(
                '#\{([a-zA-Z0-9_]+)\}#',
                '([^/]+)',
                $route['uri']
            );

            $pattern = '#^' . $pattern . '$#';

            if (preg_match($pattern, $uri, $matches)) {

                if ($route['method'] !== $method) {

                    Response::error(
                        'Método não permitido.',
                        [],
                        405
                    );
                }

                array_shift($matches);

                [$controller, $action] = $route['action'];

                $controller = new $controller();

                call_user_func_array(
                    [$controller, $action],
                    $matches
                );

                return;
            }
        }

        Response::error(
            'Rota não encontrada.',
            [],
            404
        );
    }
}