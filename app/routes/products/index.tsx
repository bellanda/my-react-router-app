import { Link } from "react-router";
import { Button } from "~/components/ui/button";

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

export default function Products() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center pb-5 border-b dark:border-slate-800">
        <div>
          <h2 className="text-2xl font-semibold">Produtos</h2>
          <p className="text-muted-foreground mt-1">Gerencie seu catálogo de produtos</p>
        </div>
        <Button>Adicionar Produto</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg border border-blue-100 dark:border-blue-800">
          <div className="text-blue-600 dark:text-blue-300 font-medium">Total de Produtos</div>
          <div className="text-2xl font-bold mt-1">{products.length}</div>
        </div>

        <div className="bg-emerald-50 dark:bg-emerald-900/30 p-4 rounded-lg border border-emerald-100 dark:border-emerald-800">
          <div className="text-emerald-600 dark:text-emerald-300 font-medium">Vendas Totais</div>
          <div className="text-2xl font-bold mt-1">{products.reduce((sum, product) => sum + product.sales, 0)}</div>
        </div>

        <div className="bg-amber-50 dark:bg-amber-900/30 p-4 rounded-lg border border-amber-100 dark:border-amber-800">
          <div className="text-amber-600 dark:text-amber-300 font-medium">Em Estoque</div>
          <div className="text-2xl font-bold mt-1">{products.reduce((sum, product) => sum + product.stock, 0)}</div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-950 border dark:border-slate-800 rounded-lg overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 dark:bg-slate-900 border-b dark:border-slate-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Produto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Categoria
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Preço
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Vendas
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Estoque
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium">{product.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs rounded-full bg-slate-100 dark:bg-slate-800">{product.category}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">R$ {product.price.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{product.sales}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        product.stock > 10
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                          : "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300"
                      }`}
                    >
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <Link
                      to={`/products/${product.id}`}
                      className="text-blue-600 dark:text-blue-400 hover:underline px-2"
                      prefetch="intent"
                    >
                      Ver
                    </Link>
                    <Link
                      to={`/products/${product.id}/edit`}
                      className="text-slate-600 dark:text-slate-400 hover:underline px-2"
                      prefetch="intent"
                    >
                      Editar
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-indigo-50 dark:bg-indigo-950 border border-indigo-200 dark:border-indigo-900 rounded-lg p-6">
        <h3 className="font-semibold text-indigo-800 dark:text-indigo-300 mb-2">Routes no React Router v7</h3>
        <p className="text-indigo-700 dark:text-indigo-400 text-sm mb-4">
          Esta página demonstra como o React Router v7 organiza rotas e como elas são renderizadas dentro de layouts. Você pode
          adicionar mais rotas facilmente para expandir sua aplicação.
        </p>
        <pre className="bg-slate-950 text-slate-200 p-4 rounded-md text-sm overflow-x-auto">
          {`// In routes.ts
layout("routes/products/layout.tsx", [
  index("routes/products/index.tsx"), // <-- You are here
  route("categorias", "routes/products/categorias.tsx"),
  route(":produtoId", "routes/products/produto.tsx"),
])`}
        </pre>
      </div>
    </div>
  );
}
