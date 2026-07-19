import React, { createContext, useContext, useState, useEffect } from 'react';
import { api, setCsrfToken } from '../services/api';

interface Usuario {
  id: number;
  nome: string;
  usuario: string;
}

interface AuthContextType {
  usuario: Usuario | null;
  loading: boolean;
  logado: boolean;
  login: (usuarioInput: string, senhaInput: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const verificarSessao = async () => {
      try {
        const response = await api.get('/check');
        if (response.data.success) {
          setUsuario(response.data.data.usuario);
        }
      } catch (error) {
        setUsuario(null);
      } finally {
        setLoading(false);
      }
    };
    verificarSessao();
  }, []);

  const login = async (usuarioInput: string, senhaInput: string): Promise<void> => {
    try {
      const response = await api.post('/login', {
        usuario: usuarioInput,
        senha: senhaInput,
      });
      if (response.data.success) {
        setUsuario(response.data.data.usuario);
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Falha na autenticação.');
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await api.post('/logout');
    } catch (error) {
      console.error('Erro ao encerrar sessão no servidor:', error);
    } finally {
      setUsuario(null);
      setCsrfToken('');
    }
  };

  return (
    <AuthContext.Provider value={{ usuario, loading, logado: !!usuario, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser utilizado dentro de um AuthProvider');
  }
  return context;
};