import React from "react";
import { Link, useParams } from "react-router";
import { LandingLayout } from "~/components/layout";

export function meta() {
  return [
    { title: "Documentação - React Router v7 Demo" },
    {
      name: "description",
      content: "Demonstração de rotas catch-all/splat no React Router v7",
    },
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
    content:
      "Seja bem-vindo à documentação do React Router v7. Esta página irá ajudá-lo a começar rapidamente.",
  },
  "getting-started/installation": {
    title: "Instalação",
    content:
      "Para instalar o React Router v7, execute: `npm install react-router@7` ou `yarn add react-router@7`.",
  },
  "getting-started/quick-start": {
    title: "Início Rápido",
    content:
      "Este guia rápido mostrará como configurar o React Router v7 em um novo projeto.",
  },
  concepts: {
    title: "Visão Geral",
    content:
      "O React Router v7 introduz novos conceitos importantes para entender como funciona o roteamento.",
  },
  "concepts/routing": {
    title: "Roteamento",
    content:
      "O roteamento no React Router v7 é baseado em uma configuração declarativa de rotas.",
  },
  "concepts/nested-routes": {
    title: "Rotas Aninhadas",
    content:
      "As rotas aninhadas permitem criar interfaces de usuário complexas com múltiplos níveis de navegação.",
  },
  api: {
    title: "Visão Geral",
    content: "Documentação completa da API do React Router v7.",
  },
  "api/components": {
    title: "Componentes",
    content: "Documentação dos componentes exportados pelo React Router v7.",
  },
  "api/hooks": {
    title: "Hooks",
    content: "Documentação dos hooks exportados pelo React Router v7.",
  },
};

export default function Docs() {
  const params = useParams();
  const splat = params["*"] || "";

  // Map the splat to a documentation section
  const section = docs[splat] || {
    title: "Documentação não encontrada",
    content: "A seção de documentação solicitada não existe.",
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
        <div className="mx-auto max-w-5xl">
          <div className="mb-6 flex items-center text-sm">
            <Link
              to="/docs"
              className="text-blue-600 hover:underline dark:text-blue-400"
            >
              Docs
            </Link>
            {pathSegments.map((segment, index) => (
              <React.Fragment key={segment.path}>
                <span className="mx-2 text-slate-400">/</span>
                <Link
                  to={`/docs/${segment.path}`}
                  className="text-blue-600 hover:underline dark:text-blue-400"
                >
                  {segment.name}
                </Link>
              </React.Fragment>
            ))}
          </div>

          <div className="flex flex-col gap-8 lg:flex-row">
            <aside className="shrink-0 lg:w-64">
              <div className="sticky top-20 rounded-lg border bg-white p-4 dark:border-slate-800 dark:bg-(--background)">
                <h2 className="mb-4 font-semibold">Seções</h2>
                <nav className="space-y-6">
                  <div>
                    <h3 className="mb-2 text-sm font-medium text-slate-500 dark:text-slate-400">
                      PRIMEIROS PASSOS
                    </h3>
                    <ul className="space-y-1 pl-2">
                      <li>
                        <Link
                          to="/docs/getting-started"
                          className="text-sm transition-colors hover:text-blue-600 dark:hover:text-blue-400"
                        >
                          Introdução
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/docs/getting-started/installation"
                          className="text-sm transition-colors hover:text-blue-600 dark:hover:text-blue-400"
                        >
                          Instalação
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/docs/getting-started/quick-start"
                          className="text-sm transition-colors hover:text-blue-600 dark:hover:text-blue-400"
                        >
                          Início Rápido
                        </Link>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="mb-2 text-sm font-medium text-slate-500 dark:text-slate-400">
                      CONCEITOS
                    </h3>
                    <ul className="space-y-1 pl-2">
                      <li>
                        <Link
                          to="/docs/concepts"
                          className="text-sm transition-colors hover:text-blue-600 dark:hover:text-blue-400"
                        >
                          Visão Geral
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/docs/concepts/routing"
                          className="text-sm transition-colors hover:text-blue-600 dark:hover:text-blue-400"
                        >
                          Roteamento
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/docs/concepts/nested-routes"
                          className="text-sm transition-colors hover:text-blue-600 dark:hover:text-blue-400"
                        >
                          Rotas Aninhadas
                        </Link>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="mb-2 text-sm font-medium text-slate-500 dark:text-slate-400">
                      API
                    </h3>
                    <ul className="space-y-1 pl-2">
                      <li>
                        <Link
                          to="/docs/api"
                          className="text-sm transition-colors hover:text-blue-600 dark:hover:text-blue-400"
                        >
                          Visão Geral
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/docs/api/components"
                          className="text-sm transition-colors hover:text-blue-600 dark:hover:text-blue-400"
                        >
                          Componentes
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/docs/api/hooks"
                          className="text-sm transition-colors hover:text-blue-600 dark:hover:text-blue-400"
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
              <div className="rounded-lg border bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-(--background)">
                <h1 className="mb-4 text-3xl font-bold">{section.title}</h1>
                <div className="prose dark:prose-invert max-w-none">
                  <p>{section.content}</p>
                </div>

                <div className="mt-12 rounded-lg border border-cyan-200 bg-cyan-50 p-4 dark:border-cyan-900 dark:bg-cyan-950">
                  <h2 className="mb-2 font-semibold text-cyan-800 dark:text-cyan-300">
                    Rotas Catch-All (Splat) no React Router v7
                  </h2>
                  <p className="mb-2 text-sm text-cyan-700 dark:text-cyan-400">
                    Esta página demonstra o uso de rotas catch-all (splat) no
                    React Router v7. A rota é definida como:
                  </p>
                  <pre className="mb-2 rounded bg-cyan-100 p-2 text-xs text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300">
                    route("docs/*", "routes/docs.tsx")
                  </pre>
                  <p className="mb-2 text-sm text-cyan-700 dark:text-cyan-400">
                    O{" "}
                    <code className="rounded bg-cyan-100 px-1 dark:bg-cyan-900">
                      *
                    </code>{" "}
                    no final da rota indica que ela irá capturar qualquer URL
                    que comece com{" "}
                    <code className="rounded bg-cyan-100 px-1 dark:bg-cyan-900">
                      /docs/
                    </code>
                    , independentemente de quantos segmentos adicionais existam.
                  </p>

                  <div className="mt-4 overflow-x-auto rounded-md bg-slate-950 p-3 text-sm text-slate-200">
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
