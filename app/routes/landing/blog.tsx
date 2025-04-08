import { Link, useParams } from "react-router";
import { Button } from "~/components/ui/button";
import { LandingLayout } from "~/layouts";

export function meta() {
  return [
    { title: "Blog - React Router v7 Demo" },
    {
      name: "description",
      content: "Demonstração de parâmetros opcionais no React Router v7",
    },
  ];
}

const categories = [
  {
    id: "tech",
    name: "Tecnologia",
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  },
  {
    id: "design",
    name: "Design",
    color: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300",
  },
  {
    id: "business",
    name: "Negócios",
    color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  },
  {
    id: "tutorial",
    name: "Tutoriais",
    color:
      "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
  },
  {
    id: "news",
    name: "Notícias",
    color: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300",
  },
];

const posts = [
  {
    id: 1,
    title: "Introdução ao React Router v7",
    excerpt:
      "Aprenda as novidades do React Router v7 e como ele simplifica o roteamento em aplicações React.",
    date: "2023-06-15",
    category: "tech",
    author: "Maria Silva",
  },
  {
    id: 2,
    title: "Design System: Por que você precisa de um",
    excerpt:
      "Um bom design system pode acelerar seu desenvolvimento e melhorar a consistência visual do seu produto.",
    date: "2023-06-10",
    category: "design",
    author: "Carlos Oliveira",
  },
  {
    id: 3,
    title: "Como monetizar seu aplicativo web",
    excerpt:
      "Estratégias eficazes para monetizar seu aplicativo web sem comprometer a experiência do usuário.",
    date: "2023-06-05",
    category: "business",
    author: "Julia Mendes",
  },
  {
    id: 4,
    title: "Tutorial: Criando um blog com React Router v7",
    excerpt:
      "Um guia passo a passo para criar um blog usando as novas funcionalidades do React Router v7.",
    date: "2023-06-02",
    category: "tutorial",
    author: "Pedro Costa",
  },
  {
    id: 5,
    title: "React 19 anunciado com novas features",
    excerpt:
      "A equipe do React anunciou a versão 19 com melhorias significativas de performance e novas APIs.",
    date: "2023-05-28",
    category: "news",
    author: "Ana Souza",
  },
  {
    id: 6,
    title: "Tailwind CSS v4: O que há de novo",
    excerpt:
      "A nova versão do Tailwind CSS traz melhorias de performance e novas utilidades.",
    date: "2023-05-20",
    category: "tech",
    author: "Lucas Ferreira",
  },
];

export default function Blog() {
  const { category } = useParams();

  // Filter posts by category if a category is specified
  const filteredPosts = category
    ? posts.filter((post) => post.category === category)
    : posts;

  const selectedCategory = category
    ? categories.find((c) => c.id === category)
    : null;

  return (
    <LandingLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8 flex items-center justify-between">
            <h1 className="text-3xl font-bold">
              {selectedCategory ? `Blog: ${selectedCategory.name}` : "Blog"}
            </h1>

            {category && (
              <Button asChild variant="outline">
                <Link to="/blog">Ver todos os posts</Link>
              </Button>
            )}
          </div>

          <div className="mb-8">
            <div className="mb-6 flex flex-wrap gap-2">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  to={`/blog/${cat.id}`}
                  className={`rounded-full px-3 py-1 text-sm font-medium ${cat.color} ${
                    category === cat.id
                      ? "ring-2 ring-offset-2 ring-offset-white dark:ring-offset-slate-950"
                      : ""
                  }`}
                >
                  {cat.name}
                </Link>
              ))}
            </div>

            <div className="mb-8 rounded-lg border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-900 dark:bg-yellow-950">
              <h2 className="mb-2 font-semibold text-yellow-800 dark:text-yellow-300">
                Parâmetros Opcionais no React Router v7
              </h2>
              <p className="mb-2 text-sm text-yellow-700 dark:text-yellow-400">
                Esta página demonstra o uso de parâmetros opcionais no React
                Router v7. A rota é definida como:
              </p>
              <pre className="mb-2 rounded bg-yellow-100 p-2 text-xs text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
                route("blog/:category?", "routes/blog/index.tsx")
              </pre>
              <p className="text-sm text-yellow-700 dark:text-yellow-400">
                O{" "}
                <code className="rounded bg-yellow-100 px-1 dark:bg-yellow-900">
                  ?
                </code>{" "}
                após o nome do parâmetro indica que ele é opcional. Isso permite
                que esta mesma rota atenda tanto a{" "}
                <code className="rounded bg-yellow-100 px-1 dark:bg-yellow-900">
                  /blog
                </code>{" "}
                quanto a{" "}
                <code className="rounded bg-yellow-100 px-1 dark:bg-yellow-900">
                  /blog/tech
                </code>
                .
              </p>
            </div>
          </div>

          <div className="space-y-8">
            {filteredPosts.length === 0 ? (
              <div className="py-12 text-center">
                <h2 className="mb-2 text-xl font-semibold">
                  Nenhum post encontrado
                </h2>
                <p className="mb-4 text-slate-600 dark:text-slate-400">
                  Não há posts disponíveis para a categoria selecionada.
                </p>
                <Button asChild>
                  <Link to="/blog">Ver todos os posts</Link>
                </Button>
              </div>
            ) : (
              filteredPosts.map((post) => (
                <article
                  key={post.id}
                  className="overflow-hidden rounded-lg border shadow-sm dark:border-slate-800"
                >
                  <div className="p-6">
                    <div className="mb-3 flex items-center justify-between">
                      <Link
                        to={`/blog/${post.category}`}
                        className={`rounded px-2 py-0.5 text-xs font-medium ${
                          categories.find((c) => c.id === post.category)?.color
                        }`}
                      >
                        {categories.find((c) => c.id === post.category)?.name}
                      </Link>
                      <span className="text-sm text-slate-500 dark:text-slate-400">
                        {post.date}
                      </span>
                    </div>

                    <h2 className="mb-3 text-xl font-bold">{post.title}</h2>
                    <p className="mb-4 text-slate-600 dark:text-slate-400">
                      {post.excerpt}
                    </p>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-500 dark:text-slate-400">
                        Por {post.author}
                      </span>
                      <Button asChild size="sm" variant="outline">
                        <Link to={`/blog/post/${post.id}`}>Ler mais</Link>
                      </Button>
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>
        </div>
      </div>
    </LandingLayout>
  );
}
