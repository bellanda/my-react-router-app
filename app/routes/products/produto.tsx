import { Link, useParams } from "react-router";
import { Button } from "~/components/ui/button";
import { DashboardLayout } from "~/layouts";

export function meta() {
  return [
    { title: "Detalhes do Produto - React Router v7 Demo" },
    {
      name: "description",
      content: "Demonstração de segmentos dinâmicos no React Router v7",
    },
  ];
}

// Mock products database
const products = [
  {
    id: 1,
    name: "Laptop Pro X",
    price: 1999.99,
    category: "Eletrônicos",
    description:
      "Um laptop poderoso com processador de última geração, 16GB de RAM e 1TB de SSD.",
    specs: [
      "Processador Intel i9",
      "16GB RAM",
      "1TB SSD",
      "Placa de vídeo RTX 3080",
    ],
  },
  {
    id: 2,
    name: "Smartphone Y20",
    price: 799.99,
    category: "Eletrônicos",
    description:
      "Smartphone com câmera de alta resolução, tela AMOLED e bateria de longa duração.",
    specs: [
      "Processador Snapdragon 888",
      "8GB RAM",
      "256GB Storage",
      "Câmera 108MP",
    ],
  },
  {
    id: 3,
    name: "Cadeira Ergonômica",
    price: 299.99,
    category: "Móveis",
    description:
      "Cadeira de escritório ergonômica com ajuste de altura e apoio lombar.",
    specs: [
      "Ajuste de altura",
      "Apoio lombar",
      "Apoio de braços ajustáveis",
      "Rodízios silenciosos",
    ],
  },
  {
    id: 4,
    name: 'Monitor Curvo 32"',
    price: 399.99,
    category: "Eletrônicos",
    description:
      "Monitor curvo de 32 polegadas com alta taxa de atualização e tempo de resposta baixo.",
    specs: [
      "32 polegadas",
      "Resolução 4K",
      "144Hz",
      "1ms de resposta",
      "HDR10",
    ],
  },
  {
    id: 5,
    name: "Mesa de Escritório",
    price: 249.99,
    category: "Móveis",
    description:
      "Mesa de escritório espaçosa com compartimento para organização de cabos.",
    specs: ["Material MDF", "120x60cm", "Altura 75cm", "Suporta até 80kg"],
  },
  {
    id: 6,
    name: "Teclado Mecânico",
    price: 129.99,
    category: "Periféricos",
    description:
      "Teclado mecânico com switches Cherry MX e iluminação RGB personalizável.",
    specs: [
      "Switches Cherry MX",
      "Iluminação RGB",
      "Anti-ghosting",
      "Layout ABNT2",
    ],
  },
];

export default function ProdutoDetalhe() {
  const { produtoId } = useParams();
  const productId = parseInt(produtoId as string, 10);

  const product = products.find((p) => p.id === productId);

  if (!product) {
    return (
      <DashboardLayout>
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="mb-4 text-2xl font-bold">Produto não encontrado</h1>
          <p className="mb-6 text-slate-600 dark:text-slate-400">
            Não foi possível encontrar um produto com o ID {productId}.
          </p>
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
        <div className="mb-6 flex items-center">
          <Button asChild variant="outline" size="sm">
            <Link to="/products">← Voltar</Link>
          </Button>
          <div className="ml-4 rounded-full bg-indigo-100 px-3 py-1 text-xs font-medium text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300">
            {product.category}
          </div>
        </div>

        <div className="mb-8 overflow-hidden rounded-lg border bg-white dark:border-slate-800 dark:bg-slate-950">
          <div className="p-6">
            <h2 className="mb-2 text-2xl font-bold">{product.name}</h2>
            <div className="mb-4 text-2xl font-bold text-indigo-600 dark:text-indigo-400">
              R$ {product.price.toFixed(2)}
            </div>
            <p className="mb-6 text-slate-600 dark:text-slate-400">
              {product.description}
            </p>

            <h3 className="mb-3 font-semibold">Especificações:</h3>
            <ul className="mb-6 list-disc space-y-1 pl-5 text-slate-600 dark:text-slate-400">
              {product.specs.map((spec, index) => (
                <li key={index}>{spec}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-900 dark:bg-amber-950">
          <h3 className="mb-2 font-semibold text-amber-800 dark:text-amber-300">
            Segmentos Dinâmicos no React Router v7
          </h3>
          <p className="text-sm text-amber-700 dark:text-amber-400">
            Esta página demonstra o uso de segmentos dinâmicos no React Router
            v7. A rota é definida como{" "}
            <code className="rounded bg-amber-100 px-1 dark:bg-amber-900">
              ":produtoId"
            </code>
            , que captura qualquer valor nesse segmento da URL e o disponibiliza
            através do hook{" "}
            <code className="rounded bg-amber-100 px-1 dark:bg-amber-900">
              useParams()
            </code>
            .
          </p>
        </div>

        <div className="overflow-x-auto rounded-md bg-slate-950 p-4 text-sm text-slate-200">
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
