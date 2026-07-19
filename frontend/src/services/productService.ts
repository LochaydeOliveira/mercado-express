import { api } from './api';

// Interface que define o formato de um Produto vindo do PHP
export interface Product {
  id?: number;
  codigo_barras: string;
  nome: string;
  preco: number;
  imagem?: string;
  criado_em?: string;
  atualizado_em?: string;
}

export const productService = {
  /**
   * Retorna a lista de todos os produtos cadastrados
   */
  async listarTodos(): Promise<Product[]> {
    const response = await api.get('/produtos');
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Erro ao carregar produtos.');
  },

  /**
   * Busca um único produto pelo ID
   */
  async buscarPorId(id: number): Promise<Product> {
    const response = await api.get(`/produtos/${id}`);
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Produto não encontrado.');
  },

  /**
   * Cadastra um novo produto (Envia dados normais ou FormData se houver imagem)
   */
  async cadastrar(dadosProduto: FormData | Omit<Product, 'id'>): Promise<Product> {
    const headers = dadosProduto instanceof FormData 
      ? { 'Content-Type': 'multipart/form-data' } 
      : { 'Content-Type': 'application/json' };

    const response = await api.post('/produtos', dadosProduto, { headers });
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Erro ao cadastrar produto.');
  },

  /**
   * Atualiza um produto existente
   */
  async atualizar(id: number, dadosProduto: FormData | Partial<Product>): Promise<Product> {
    const headers = dadosProduto instanceof FormData 
      ? { 'Content-Type': 'multipart/form-data' } 
      : { 'Content-Type': 'application/json' };

    // Para o PHP entender requisições Multipart/Form-Data como UPDATE (PUT),
    // nós enviamos via POST e adicionamos o método spoofing "_method=PUT"
    let dadosEnvio = dadosProduto;
    if (dadosProduto instanceof FormData) {
      dadosProduto.append('_method', 'PUT');
    }

    const url = dadosProduto instanceof FormData ? `/produtos/${id}` : `/produtos/${id}`;
    const metodo = dadosProduto instanceof FormData ? 'post' : 'put';

    const response = await api[metodo](url, dadosEnvio, { headers });
    
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Erro ao atualizar produto.');
  },

  /**
   * Exclui um produto do sistema
   */
  async deletar(id: number): Promise<void> {
    const response = await api.delete(`/produtos/${id}`);
    if (!response.data.success) {
      throw new Error(response.data.message || 'Erro ao excluir produto.');
    }
  }
};