import DataTable from "~/components/data-table/DataTable";
import type { TableConfig } from "~/lib/types/data-table";
import { formatDisplayValue } from "~/lib/utils";

export function meta() {
  return [
    { title: "Produtos - React Router v7 Demo" },
    { name: "description", content: "Listagem de produtos com React Router v7" }
  ];
}

const products = [
  {
    id: 1,
    name: "Laptop Pro X",
    price: 1999.99,
    category: "Eletrônicos",
    sales: 145,
    stock: 30
  },
  {
    id: 2,
    name: "Smartphone Y20",
    price: 799.99,
    category: "Eletrônicos",
    sales: 290,
    stock: 42
  },
  {
    id: 3,
    name: "Cadeira Ergonômica",
    price: 299.99,
    category: "Móveis",
    sales: 78,
    stock: 15
  },
  {
    id: 4,
    name: 'Monitor Curvo 32"',
    price: 399.99,
    category: "Eletrônicos",
    sales: 102,
    stock: 8
  },
  {
    id: 5,
    name: "Mesa de Escritório",
    price: 249.99,
    category: "Móveis",
    sales: 65,
    stock: 22
  },
  {
    id: 6,
    name: "Teclado Mecânico",
    price: 129.99,
    category: "Periféricos",
    sales: 210,
    stock: 35
  }
];

export default function ProductsPage() {
  // Configuração da tabela para o modelo de Produto
  const tableConfig: TableConfig = {
    columns: [
      {
        accessor: "id",
        header: "ID",
        type: "text",
        sortable: true,
        filterable: true
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
        accessor: "price",
        header: "Preço",
        type: "number",
        sortable: true,
        filterable: true,
        formatFn: (value) => formatDisplayValue(value, "currency")
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
      }
    ],
    endpoint: {
      url: "/api/products/",
      sortParam: "ordering",
      pageParam: "offset",
      limitParam: "limit"
    },
    initialSort: {
      id: "id",
      desc: false
    },
    defaultPageSize: 20
  };

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Produtos</h1>
          <p className="text-muted-foreground">Gerencie o catálogo de produtos da empresa</p>
        </div>
        <button className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md">Novo Produto</button>
      </div>

      <div className="py-2">
        <DataTable config={tableConfig} />
      </div>
    </div>
  );
}
