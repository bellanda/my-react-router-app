import { Loader2, RefreshCw } from "lucide-react";
import { Button } from "~/components/ui/button";
import { useAuth } from "~/hooks/useAuth";

export function AuthStatus() {
  const { authenticated, loading, login, checkAuth } = useAuth({
    autoLogin: false,
    retryCount: 2,
  });

  const handleRefresh = async () => {
    await checkAuth();
  };

  if (loading) {
    return (
      <div className="text-muted-foreground flex items-center gap-2 text-sm">
        <Loader2 className="h-3 w-3 animate-spin" />
        <span>Verificando autenticação...</span>
      </div>
    );
  }

  if (authenticated) {
    return (
      <div className="flex items-center gap-1 text-sm text-green-500">
        <span className="h-2 w-2 rounded-full bg-green-500"></span>
        <span>Autenticado</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1 text-sm text-red-500">
        <span className="h-2 w-2 rounded-full bg-red-500"></span>
        <span>Não autenticado</span>
      </div>
      <div className="flex gap-1">
        <Button
          variant="outline"
          size="sm"
          onClick={login}
          className="h-7 px-2 text-xs"
        >
          {loading ? <Loader2 className="mr-1 h-3 w-3 animate-spin" /> : null}
          Conectar
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleRefresh}
          className="h-7 w-7 p-0 text-xs"
        >
          <RefreshCw className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
}
