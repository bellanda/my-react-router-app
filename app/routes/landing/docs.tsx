import React from "react";
import { Link, useParams } from "react-router";
import { LandingLayout } from "~/components/layout";

export function meta() {
  return [
    { title: "Documentação - React Router v7 Demo" },
    { name: "description", content: "Demonstração de rotas catch-all/splat no React Router v7" }
  ];
}

interface DocSection {
  title: string;
  content: string;
}

// Mock documentation structure
const docs: Record<string, DocSection> = {
  "getting-started": {
    title: "Introdução",
    content: "Seja bem-vindo à documentação do React Router v7. Esta página irá ajudá-lo a começar rapidamente."
  },
  "getting-started/installation": {
    title: "Instalação",
    content: "Para instalar o React Router v7, execute: `npm install react-router@7` ou `yarn add react-router@7`."
  },
  "getting-started/quick-start": {
    title: "Início Rápido",
    content: "Este guia rápido mostrará como configurar o React Router v7 em um novo projeto."
  },
  concepts: {
    title: "Visão Geral",
    content: "O React Router v7 introduz novos conceitos importantes para entender como funciona o roteamento."
  },
  "concepts/routing": {
    title: "Roteamento",
    content: "O roteamento no React Router v7 é baseado em uma configuração declarativa de rotas."
  },
  "concepts/nested-routes": {
    title: "Rotas Aninhadas",
    content: "As rotas aninhadas permitem criar interfaces de usuário complexas com múltiplos níveis de navegação."
  },
  api: {
    title: "Visão Geral",
    content: "Documentação completa da API do React Router v7."
  },
  "api/components": {
    title: "Componentes",
    content: "Documentação dos componentes exportados pelo React Router v7."
  },
  "api/hooks": {
    title: "Hooks",
    content: "Documentação dos hooks exportados pelo React Router v7."
  }
};

export default function Docs() {
  const params = useParams();
  const splat = params["*"] || "";

  // Map the splat to a documentation section
  const section = docs[splat] || {
    title: "Documentação não encontrada",
    content: "A seção de documentação solicitada não existe."
  };

  // Create a breadcrumb path from the splat
  const pathSegments = splat
    ? splat.split("/").map((segment, index, array) => {
        const path = array.slice(0, index + 1).join("/");
        return { name: segment, path };
      })
    : [];

  return (
    <LandingLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center mb-6 text-sm">
            <Link to="/docs" className="text-blue-600 dark:text-blue-400 hover:underline">
              Docs
            </Link>
            {pathSegments.map((segment, index) => (
              <React.Fragment key={segment.path}>
                <span className="mx-2 text-slate-400">/</span>
                <Link to={`/docs/${segment.path}`} className="text-blue-600 dark:text-blue-400 hover:underline">
                  {segment.name}
                </Link>
              </React.Fragment>
            ))}
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            <aside className="lg:w-64 shrink-0">
              <div className="bg-white dark:bg-(--background) border dark:border-slate-800 rounded-lg p-4 sticky top-20">
                <h2 className="font-semibold mb-4">Seções</h2>
                <nav className="space-y-6">
                  <div>
                    <h3 className="font-medium text-sm mb-2 text-slate-500 dark:text-slate-400">PRIMEIROS PASSOS</h3>
                    <ul className="space-y-1 pl-2">
                      <li>
                        <Link
                          to="/docs/getting-started"
                          className="text-sm hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                        >
                          Introdução
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/docs/getting-started/installation"
                          className="text-sm hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                        >
                          Instalação
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/docs/getting-started/quick-start"
                          className="text-sm hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                        >
                          Início Rápido
                        </Link>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-medium text-sm mb-2 text-slate-500 dark:text-slate-400">CONCEITOS</h3>
                    <ul className="space-y-1 pl-2">
                      <li>
                        <Link
                          to="/docs/concepts"
                          className="text-sm hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                        >
                          Visão Geral
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/docs/concepts/routing"
                          className="text-sm hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                        >
                          Roteamento
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/docs/concepts/nested-routes"
                          className="text-sm hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                        >
                          Rotas Aninhadas
                        </Link>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-medium text-sm mb-2 text-slate-500 dark:text-slate-400">API</h3>
                    <ul className="space-y-1 pl-2">
                      <li>
                        <Link to="/docs/api" className="text-sm hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                          Visão Geral
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/docs/api/components"
                          className="text-sm hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                        >
                          Componentes
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/docs/api/hooks"
                          className="text-sm hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                        >
                          Hooks
                        </Link>
                      </li>
                    </ul>
                  </div>
                </nav>
              </div>
            </aside>

            <main className="flex-1">
              <div className="bg-white dark:bg-(--background) border dark:border-slate-800 rounded-lg shadow-sm p-6">
                <h1 className="text-3xl font-bold mb-4">{section.title}</h1>
                <div className="prose dark:prose-invert max-w-none">
                  <p>{section.content}</p>
                </div>

                <div className="mt-12 p-4 bg-cyan-50 dark:bg-cyan-950 border border-cyan-200 dark:border-cyan-900 rounded-lg">
                  <h2 className="font-semibold text-cyan-800 dark:text-cyan-300 mb-2">
                    Rotas Catch-All (Splat) no React Router v7
                  </h2>
                  <p className="text-cyan-700 dark:text-cyan-400 text-sm mb-2">
                    Esta página demonstra o uso de rotas catch-all (splat) no React Router v7. A rota é definida como:
                  </p>
                  <pre className="bg-cyan-100 dark:bg-cyan-900 p-2 rounded text-xs text-cyan-800 dark:text-cyan-300 mb-2">
                    route("docs/*", "routes/docs.tsx")
                  </pre>
                  <p className="text-cyan-700 dark:text-cyan-400 text-sm mb-2">
                    O <code className="bg-cyan-100 dark:bg-cyan-900 px-1 rounded">*</code> no final da rota indica que ela irá
                    capturar qualquer URL que comece com <code className="bg-cyan-100 dark:bg-cyan-900 px-1 rounded">/docs/</code>,
                    independentemente de quantos segmentos adicionais existam.
                  </p>

                  <div className="bg-slate-950 text-slate-200 p-3 rounded-md text-sm mt-4 overflow-x-auto">
                    <pre>
                      {`export default function Docs() {
  const params = useParams();
  const splat = params["*"] || "";
  
  // O parâmetro splat contém o restante da URL após /docs/
  // Por exemplo, se a URL for /docs/getting-started/installation:
  // splat = "getting-started/installation"
  
  // Use o splat para determinar qual conteúdo exibir
}`}
                    </pre>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    </LandingLayout>
  );
}
