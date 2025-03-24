import { Link } from "react-router";
import { Button } from "../../components/ui/button";

export function meta() {
  return [{ title: "Lista de Produtos - React Router v7 Demo" }, { name: "description", content: "Lista de produtos exemplo" }];
}

const products = [
  { id: 1, name: "Laptop Pro X", price: 1999.99, category: "Eletrônicos" },
  { id: 2, name: "Smartphone Y20", price: 799.99, category: "Eletrônicos" },
  { id: 3, name: "Cadeira Ergonômica", price: 299.99, category: "Móveis" },
  { id: 4, name: 'Monitor Curvo 32"', price: 399.99, category: "Eletrônicos" },
  { id: 5, name: "Mesa de Escritório", price: 249.99, category: "Móveis" },
  { id: 6, name: "Teclado Mecânico", price: 129.99, category: "Periféricos" }
];

export default function ProdutosIndex() {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold">Catálogo de Produtos</h3>
        <Button asChild variant="outline" size="sm">
          <Link to="/products/categorias">Ver Categorias</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product) => (
          <div key={product.id} className="border rounded-lg overflow-hidden bg-white dark:bg-slate-950 dark:border-slate-800">
            <div className="p-4">
              <div className="text-sm text-slate-500 dark:text-slate-400 mb-1">{product.category}</div>
              <h3 className="font-semibold mb-2">{product.name}</h3>
              <div className="font-bold text-lg">R$ {product.price.toFixed(2)}</div>
            </div>
            <div className="border-t dark:border-slate-800 p-3 bg-slate-50 dark:bg-slate-900 flex justify-end">
              <Button asChild size="sm">
                <Link to={`/products/${product.id}`}>Ver Detalhes</Link>
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 p-4 border border-blue-200 bg-blue-50 dark:bg-blue-950 dark:border-blue-900 rounded-lg">
        <h3 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">Sobre este exemplo</h3>
        <p className="text-blue-600 dark:text-blue-400 text-sm">
          Esta é a rota de índice para a seção de produtos. Ela é definida usando{" "}
          <code className="bg-blue-100 dark:bg-blue-900 px-1 rounded">index("routes/products/index.tsx")</code> e renderizada dentro
          do layout de produtos quando o usuário acessa <code className="bg-blue-100 dark:bg-blue-900 px-1 rounded">/products</code>
          . Clique em "Ver Detalhes" para ver um exemplo de rota com segmento dinâmico.
        </p>
      </div>
    </div>
  );
}
