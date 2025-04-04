import { Link, useParams } from "react-router";
import { DashboardLayout } from "~/components/layout";
import { Button } from "~/components/ui/button";

export function meta() {
  return [
    { title: "Detalhes do Produto - React Router v7 Demo" },
    { name: "description", content: "Demonstração de segmentos dinâmicos no React Router v7" }
  ];
}

// Mock products database
const products = [
  {
    id: 1,
    name: "Laptop Pro X",
    price: 1999.99,
    category: "Eletrônicos",
    description: "Um laptop poderoso com processador de última geração, 16GB de RAM e 1TB de SSD.",
    specs: ["Processador Intel i9", "16GB RAM", "1TB SSD", "Placa de vídeo RTX 3080"]
  },
  {
    id: 2,
    name: "Smartphone Y20",
    price: 799.99,
    category: "Eletrônicos",
    description: "Smartphone com câmera de alta resolução, tela AMOLED e bateria de longa duração.",
    specs: ["Processador Snapdragon 888", "8GB RAM", "256GB Storage", "Câmera 108MP"]
  },
  {
    id: 3,
    name: "Cadeira Ergonômica",
    price: 299.99,
    category: "Móveis",
    description: "Cadeira de escritório ergonômica com ajuste de altura e apoio lombar.",
    specs: ["Ajuste de altura", "Apoio lombar", "Apoio de braços ajustáveis", "Rodízios silenciosos"]
  },
  {
    id: 4,
    name: 'Monitor Curvo 32"',
    price: 399.99,
    category: "Eletrônicos",
    description: "Monitor curvo de 32 polegadas com alta taxa de atualização e tempo de resposta baixo.",
    specs: ["32 polegadas", "Resolução 4K", "144Hz", "1ms de resposta", "HDR10"]
  },
  {
    id: 5,
    name: "Mesa de Escritório",
    price: 249.99,
    category: "Móveis",
    description: "Mesa de escritório espaçosa com compartimento para organização de cabos.",
    specs: ["Material MDF", "120x60cm", "Altura 75cm", "Suporta até 80kg"]
  },
  {
    id: 6,
    name: "Teclado Mecânico",
    price: 129.99,
    category: "Periféricos",
    description: "Teclado mecânico com switches Cherry MX e iluminação RGB personalizável.",
    specs: ["Switches Cherry MX", "Iluminação RGB", "Anti-ghosting", "Layout ABNT2"]
  }
];

export default function ProdutoDetalhe() {
  const { produtoId } = useParams();
  const productId = parseInt(produtoId as string, 10);

  const product = products.find((p) => p.id === productId);

  if (!product) {
    return (
      <DashboardLayout>
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">Produto não encontrado</h1>
          <p className="text-slate-600 dark:text-slate-400 mb-6">Não foi possível encontrar um produto com o ID {productId}.</p>
          <Button asChild>
            <Link to="/products">Voltar para Produtos</Link>
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div>
        <div className="flex items-center mb-6">
          <Button asChild variant="outline" size="sm">
            <Link to="/products">← Voltar</Link>
          </Button>
          <div className="ml-4 px-3 py-1 bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300 rounded-full text-xs font-medium">
            {product.category}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-950 border dark:border-slate-800 rounded-lg overflow-hidden mb-8">
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-2">{product.name}</h2>
            <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mb-4">R$ {product.price.toFixed(2)}</div>
            <p className="text-slate-600 dark:text-slate-400 mb-6">{product.description}</p>

            <h3 className="font-semibold mb-3">Especificações:</h3>
            <ul className="list-disc pl-5 space-y-1 text-slate-600 dark:text-slate-400 mb-6">
              {product.specs.map((spec, index) => (
                <li key={index}>{spec}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-900 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-amber-800 dark:text-amber-300 mb-2">Segmentos Dinâmicos no React Router v7</h3>
          <p className="text-amber-700 dark:text-amber-400 text-sm">
            Esta página demonstra o uso de segmentos dinâmicos no React Router v7. A rota é definida como{" "}
            <code className="bg-amber-100 dark:bg-amber-900 px-1 rounded">":produtoId"</code>, que captura qualquer valor nesse
            segmento da URL e o disponibiliza através do hook{" "}
            <code className="bg-amber-100 dark:bg-amber-900 px-1 rounded">useParams()</code>.
          </p>
        </div>

        <div className="bg-slate-950 text-slate-200 p-4 rounded-md text-sm overflow-x-auto">
          <pre>
            {`// Em routes.ts
layout("routes/products/layout.tsx", [
  index("routes/products/index.tsx"),
  route("categorias", "routes/products/categorias.tsx"),
  route(":produtoId", "routes/products/produto.tsx"), // <-- Esta rota!
])

// Em produto.tsx
export default function ProdutoDetalhe() {
  const { produtoId } = useParams();
  // ...
}`}
          </pre>
        </div>
      </div>
    </DashboardLayout>
  );
}
