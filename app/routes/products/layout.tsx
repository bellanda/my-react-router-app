import { Outlet } from "react-router";
import { DashboardLayout } from "~/components/layout";

export function meta() {
  return [
    { title: "Produtos - React Router v7 Demo" },
    { name: "description", content: "Produtos section with layout routes and dynamic segments" }
  ];
}

export default function ProdutosLayout() {
  return (
    <DashboardLayout>
      <div className="bg-gradient-to-r from-indigo-600 to-blue-500 text-white -mt-4 -mx-4 mb-4">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold mb-2">Produtos</h1>
          <p className="text-indigo-100 max-w-2xl">
            Esta seção demonstra o uso de layout routes no React Router v7. Layout routes criam um novo nível de aninhamento para
            seus filhos, mas não adicionam nenhum segmento à URL.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-semibold mb-4">Implementação de Layout Routes</h2>
          <div className="bg-slate-950 text-slate-200 p-4 rounded-md text-sm mb-4 overflow-x-auto">
            <pre>
              {`layout("routes/products/layout.tsx", [
                index("routes/products/index.tsx"),
                route("categorias", "routes/products/categorias.tsx"),
                route(":produtoId", "routes/products/productstsx"),
              ])`}
            </pre>
          </div>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            O layout route cria um componente de layout compartilhado para suas rotas filhas, sem adicionar qualquer segmento à URL.
            Por exemplo, "/products", "/products/categorias" e "/products/1" todos usam este mesmo layout.
          </p>

          {/* This is where child routes will be rendered */}
          <Outlet />
        </div>
      </div>
    </DashboardLayout>
  );
}
