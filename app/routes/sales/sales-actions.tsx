import { toast } from "sonner";
import ActionMenu from "~/components/data-table/ActionMenu";

export const renderProductActions = (row: any) => {
  // Função para excluir um produto
  const handleDelete = async (id: string | number, rowData: any) => {
    try {
      toast.promise(
        async () => {
          const response = await fetch(`/api/products/${id}`, {
            method: "DELETE",
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Erro ao excluir produto");
          }

          // Adicione um pequeno delay para permitir que o DOM se atualize corretamente
          await new Promise((resolve) => setTimeout(resolve, 200));

          // Recarrega a página para atualizar a tabela
          window.location.reload();

          return true;
        },
        {
          loading: "Excluindo produto...",
          success: "Produto excluído com sucesso!",
          error: (err) => `${err.message || "Erro ao excluir produto"}`,
        }
      );
    } catch (error) {
      console.error("Erro ao excluir produto:", error);
    }
  };

  // Exemplo de uso com dados da linha
  console.log("Dados completos da linha:", row);

  return (
    <ActionMenu
      id={row.id}
      baseUrl="/sales"
      onDelete={handleDelete}
      row={row}
    />
  );
};

export const renderOrderActions = (row: any) => {
  // Função para cancelar um pedido
  const handleCancel = async (id: string | number, rowData: any) => {
    try {
      toast.promise(
        async () => {
          const response = await fetch(`/api/orders/${id}/cancel/`, {
            method: "POST",
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Erro ao cancelar pedido");
          }

          // Adicione um pequeno delay para permitir que o DOM se atualize corretamente
          await new Promise((resolve) => setTimeout(resolve, 200));

          // Recarrega a página para atualizar a tabela
          window.location.reload();

          return true;
        },
        {
          loading: "Cancelando pedido...",
          success: "Pedido cancelado com sucesso!",
          error: (err) => `${err.message || "Erro ao cancelar pedido"}`,
        }
      );
    } catch (error) {
      console.error("Erro ao cancelar pedido:", error);
    }
  };

  // Criar itens personalizados para o menu
  const customItems = (
    <>
      <div
        className="hover:bg-accent hover:text-accent-foreground flex cursor-pointer items-center px-2 py-1.5 text-sm"
        onClick={() => {
          if (row.status !== "CANCELED") {
            handleCancel(row.id, row);
          }
        }}
        style={{ opacity: row.status === "CANCELED" ? 0.5 : 1 }}
      >
        <span>Cancelar Pedido</span>
      </div>
      <div
        className="hover:bg-accent hover:text-accent-foreground flex cursor-pointer items-center px-2 py-1.5 text-sm"
        onClick={() => {
          if (!row.is_invoice_generated && row.status !== "CANCELED") {
            toast("Funcionalidade de gerar nota fiscal em desenvolvimento");
          }
        }}
        style={{
          opacity:
            row.is_invoice_generated || row.status === "CANCELED" ? 0.5 : 1,
        }}
      >
        <span>Gerar Nota Fiscal</span>
      </div>
    </>
  );

  return (
    <ActionMenu
      id={row.id}
      baseUrl="/sales"
      customItems={customItems}
      row={row}
    />
  );
};
