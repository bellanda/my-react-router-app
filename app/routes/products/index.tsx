import DataTable from "~/components/data-table/DataTable";
import { AuthStatus } from "~/components/layout/AuthStatus";
import type { TableConfig } from "~/lib/types/data-table";
import { formatDisplayValue } from "~/lib/utils";

export function meta() {
  return [
    { title: "Produtos - React Router v7 Demo" },
    { name: "description", content: "Listagem de produtos com React Router v7" }
  ];
}

export default function ProductsPage() {
  // Configuração da tabela para o modelo de Produto
  const tableConfig: TableConfig = {
    columns: [
      {
        accessor: "id",
        header: "ID",
        type: "text",
        sortable: true,
        filterable: true,
        width: "80px"
      },
      {
        accessor: "group__name",
        header: "Grupo",
        type: "text",
        sortable: true,
        filterable: true
      },
      {
        accessor: "category__name",
        header: "Categoria",
        type: "text",
        sortable: true,
        filterable: true
      },
      {
        accessor: "brand__name",
        header: "Marca",
        type: "text",
        sortable: true,
        filterable: true
      },
      {
        accessor: "compatible_brand__name",
        header: "Marca Compatível",
        type: "text",
        sortable: true,
        filterable: true
      },
      {
        accessor: "model__name",
        header: "Modelo",
        type: "text",
        sortable: true,
        filterable: true
      },
      {
        accessor: "compatible_model__name",
        header: "Modelo Compatível",
        type: "text",
        sortable: true,
        filterable: true
      },
      {
        accessor: "color__name",
        header: "Cor",
        type: "text",
        sortable: true,
        filterable: true
      },
      {
        accessor: "description",
        header: "Descrição",
        type: "text",
        sortable: true,
        filterable: true,
        width: "300px"
      },
      {
        accessor: "short_description",
        header: "Descrição Curta",
        type: "text",
        sortable: true,
        filterable: true,
        width: "250px"
      },
      {
        accessor: "min_stock",
        header: "Estoque Mínimo",
        type: "number",
        sortable: true,
        filterable: true
      },
      {
        accessor: "max_stock",
        header: "Estoque Máximo",
        type: "number",
        sortable: true,
        filterable: true
      },
      {
        accessor: "price",
        header: "Preço",
        type: "number",
        sortable: true,
        filterable: true,
        formatFn: (value) => formatDisplayValue(value, "currency")
      },
      {
        accessor: "warranty_period",
        header: "Garantia (dias)",
        type: "number",
        sortable: true,
        filterable: true
      },
      {
        accessor: "is_active",
        header: "Ativo",
        type: "boolean",
        sortable: true,
        filterable: true,
        formatFn: (value) => formatDisplayValue(value, "boolean")
      },
      {
        accessor: "created_at",
        header: "Criado em",
        type: "date",
        sortable: true,
        filterable: true,
        formatFn: (value) => formatDisplayValue(value, "datetime")
      },
      {
        accessor: "updated_at",
        header: "Atualizado em",
        type: "date",
        sortable: true,
        filterable: true,
        formatFn: (value) => formatDisplayValue(value, "datetime")
      },
      {
        accessor: "created_by__email",
        header: "Criado por",
        type: "text",
        sortable: true,
        filterable: true
      }
    ],
    endpoint: {
      url: "/api/products/",
      sortParam: "ordering",
      pageParam: "cursor",
      limitParam: "limit",
      params: {
        format: "json"
      }
    },
    initialSort: {
      id: "id",
      desc: false
    },
    defaultPageSize: 20
  };

  // Exibe a URL base da API no console para depuração
  console.log("API Base URL:", import.meta.env.VITE_API_BASE_URL || "Não configurada");

  return (
    <div className="space-y-4 w-full">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Produtos</h1>
          <p className="text-muted-foreground">Gerencie o catálogo de produtos da empresa</p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <AuthStatus />
          <button className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md">Novo Produto</button>
        </div>
      </div>

      <div className="py-2 w-full">
        <DataTable config={tableConfig} />
      </div>
    </div>
  );
}
