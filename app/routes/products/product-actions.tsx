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
      baseUrl="/products"
      onDelete={handleDelete}
      row={row}
    />
  );
};
