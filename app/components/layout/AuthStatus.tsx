import { Loader2, RefreshCw } from "lucide-react";
import { Button } from "~/components/ui/button";
import { useAuth } from "~/hooks/useAuth";

export function AuthStatus() {
  const { authenticated, loading, login, checkAuth } = useAuth({
    autoLogin: false,
    retryCount: 2
  });

  const handleRefresh = async () => {
    await checkAuth();
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="h-3 w-3 animate-spin" />
        <span>Verificando autenticação...</span>
      </div>
    );
  }

  if (authenticated) {
    return (
      <div className="text-sm text-green-500 flex items-center gap-1">
        <span className="bg-green-500 rounded-full h-2 w-2"></span>
        <span>Autenticado</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <div className="text-sm text-red-500 flex items-center gap-1">
        <span className="bg-red-500 rounded-full h-2 w-2"></span>
        <span>Não autenticado</span>
      </div>
      <div className="flex gap-1">
        <Button variant="outline" size="sm" onClick={login} className="text-xs h-7 px-2">
          {loading ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : null}
          Conectar
        </Button>
        <Button variant="ghost" size="sm" onClick={handleRefresh} className="text-xs h-7 w-7 p-0">
          <RefreshCw className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
}
