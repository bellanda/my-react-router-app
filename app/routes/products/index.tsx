import DataTable from "~/components/data-table";
import { AuthStatus } from "~/components/layout/AuthStatus";
import type { TableConfig } from "~/lib/types/data-table";
import { formatDisplayValue } from "~/lib/utils";

export function meta() {
  return [
    { title: "Produtos - React Router v7 Demo" },
    {
      name: "description",
      content: "Listagem de produtos com React Router v7",
    },
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
        width: "110px",
      },
      {
        accessor: "group__name",
        displayAccessor: "additional_info.group",
        header: "Grupo",
        type: "text",
        sortable: true,
        filterable: true,
      },
      {
        accessor: "category__name",
        displayAccessor: "additional_info.category",
        header: "Categoria",
        type: "text",
        sortable: true,
        filterable: true,
      },
      {
        accessor: "brand__name",
        displayAccessor: "additional_info.brand",
        header: "Marca",
        type: "text",
        sortable: true,
        filterable: true,
      },
      {
        accessor: "compatible_brand__name",
        displayAccessor: "additional_info.compatible_brand",
        header: "Marca Compatível",
        type: "text",
        sortable: true,
        filterable: true,
      },
      {
        accessor: "model__name",
        displayAccessor: "additional_info.model",
        header: "Modelo",
        type: "text",
        sortable: true,
        filterable: true,
      },
      {
        accessor: "compatible_model__name",
        displayAccessor: "additional_info.compatible_model",
        header: "Modelo Compatível",
        type: "text",
        sortable: true,
        filterable: true,
      },
      {
        accessor: "color__name",
        displayAccessor: "additional_info.color",
        header: "Cor",
        type: "text",
        sortable: true,
        filterable: true,
      },
      {
        accessor: "description",
        header: "Descrição",
        type: "text",
        sortable: true,
        filterable: true,
        width: "350px",
      },
      {
        accessor: "short_description",
        header: "Descrição Curta",
        type: "text",
        sortable: true,
        filterable: true,
        width: "350px",
      },
      {
        accessor: "min_stock",
        header: "Estoque Mínimo",
        type: "number",
        sortable: true,
        filterable: true,
      },
      {
        accessor: "max_stock",
        header: "Estoque Máximo",
        type: "number",
        sortable: true,
        filterable: true,
      },
      {
        accessor: "price",
        header: "Preço",
        type: "number",
        sortable: true,
        filterable: true,
        formatFn: (value) => formatDisplayValue(value, "currency"),
      },
      {
        accessor: "warranty_period",
        header: "Garantia (dias)",
        type: "number",
        sortable: true,
        filterable: true,
      },
      {
        accessor: "is_active",
        header: "Ativo",
        type: "boolean",
        sortable: true,
        filterable: true,
        formatFn: (value) => formatDisplayValue(value, "boolean"),
      },
      {
        accessor: "created_at",
        header: "Criado em",
        type: "date",
        sortable: true,
        filterable: true,
        formatFn: (value) => formatDisplayValue(value, "datetime"),
      },
      {
        accessor: "updated_at",
        header: "Atualizado em",
        type: "date",
        sortable: true,
        filterable: true,
        formatFn: (value) => formatDisplayValue(value, "datetime"),
      },
      {
        accessor: "created_by__email",
        displayAccessor: "additional_info.created_by",
        header: "Criado por",
        type: "text",
        sortable: true,
        filterable: true,
      },
      {
        accessor: "additional_info.total_stock_quantity",
        header: "Estoque Total",
        type: "number",
        sortable: false,
        filterable: false,
      },
      {
        accessor: "additional_info.total_sold_quantity",
        header: "Total Vendido",
        type: "number",
        sortable: false,
        filterable: false,
      },
      {
        accessor: "additional_info.total_sold_value",
        header: "Valor Total Vendido",
        type: "number",
        sortable: false,
        filterable: false,
        formatFn: (value) => formatDisplayValue(value, "currency"),
      },
      {
        accessor: "additional_info.daily_sales_average_last_30_days",
        header: "Média Diária (30d)",
        type: "number",
        sortable: false,
        filterable: false,
        formatFn: (value) => formatDisplayValue(value, "decimal"),
      },
    ],
    endpoint: {
      url: "/api/products/",
      sortParam: "ordering",
      pageParam: "cursor",
      limitParam: "limit",
      params: {
        format: "json",
      },
    },
    initialSort: {
      id: "id",
      desc: false,
    },
    defaultPageSize: 20,
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Produtos</h1>
        </div>
        <div className="flex items-end gap-1">
          <AuthStatus />
          <button className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-2 py-2">
            Novo Produto
          </button>
        </div>
      </div>

      <div className="w-full py-2">
        <DataTable config={tableConfig} />
      </div>
    </div>
  );
}
