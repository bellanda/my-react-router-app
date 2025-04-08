import { useEffect, useState } from "react";
import { getJwtToken, isAuthenticated } from "~/lib/services/api";

interface UseAuthOptions {
  autoLogin?: boolean; // Tentar login automático ao inicializar
  onAuthStateChange?: (isAuth: boolean) => void; // Callback quando o estado de autenticação muda
  retryCount?: number; // Número de tentativas de login (padrão: 1)
}

export function useAuth(options: UseAuthOptions = {}) {
  const { autoLogin = true, onAuthStateChange, retryCount = 1 } = options;
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [retries, setRetries] = useState(0);

  // Verificar estado de autenticação
  const checkAuth = async () => {
    setLoading(true);
    try {
      const isAuth = await isAuthenticated();
      setAuthenticated(isAuth);
      onAuthStateChange?.(isAuth);

      // Se não estiver autenticado, tentar login automático
      if (!isAuth && autoLogin && retries < retryCount) {
        console.log(
          `Não autenticado, tentando login automático (tentativa ${retries + 1} de ${retryCount})...`
        );
        setRetries((prev) => prev + 1);
        return await login();
      }

      return isAuth;
    } catch (error) {
      console.error("Erro ao verificar autenticação:", error);
      setAuthenticated(false);
      onAuthStateChange?.(false);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Tentar login com as credenciais do .env
  const login = async () => {
    setLoading(true);
    try {
      const token = await getJwtToken();
      const isAuth = !!token;
      setAuthenticated(isAuth);
      onAuthStateChange?.(isAuth);
      return isAuth;
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      setAuthenticated(false);
      onAuthStateChange?.(false);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Efeito para verificar autenticação ao inicializar
  useEffect(() => {
    if (autoLogin) {
      login();
    } else {
      checkAuth();
    }
  }, [autoLogin]);

  return {
    authenticated,
    loading,
    checkAuth,
    login,
  };
}

export default useAuth;
