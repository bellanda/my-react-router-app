import { ptBR } from "date-fns/locale";
import { useEffect, useState } from "react";
import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";
import "~/app.css";
import { Calendar } from "~/components/ui/calendar";
import { Toaster } from "~/components/ui/sonner";
import { useAuth } from "~/hooks/useAuth";
import { ThemeProvider } from "~/lib/theme-provider";
import type { Route } from "./+types/root";

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const [date, setDate] = useState<Date | undefined>(new Date());
  return (
    <html lang="en" className="antialiased">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const storageKey = "react-router-ui-theme";
                  const theme = localStorage.getItem(storageKey);
                  const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
                  
                  document.documentElement.classList.remove("light", "dark");
                  document.documentElement.classList.add(theme === "system" ? systemTheme : theme || "light");
                } catch (e) {
                  console.error("Error setting theme:", e);
                }
              })();
            `,
          }}
        />
      </head>
      <body className="bg-background min-h-screen font-sans antialiased">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          locale={ptBR}
          className="mx-auto"
        />
        <ThemeProvider defaultTheme="system" storageKey="react-router-ui-theme">
          {children}
          <Toaster />
        </ThemeProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  // Inicializar autenticação ao carregar o aplicativo
  const { authenticated, loading } = useAuth({
    autoLogin: true,
    retryCount: 3, // Tentar até 3 vezes
    onAuthStateChange: (isAuth) => {
      console.log(
        "Estado de autenticação:",
        isAuth ? "Autenticado" : "Não autenticado"
      );
    },
  });

  // Log de debug quando o estado de autenticação mudar
  useEffect(() => {
    if (!loading) {
      console.log(
        `[Auth] ${authenticated ? "Autenticado com sucesso" : "Não autenticado"}`
      );
    }
  }, [authenticated, loading]);

  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="container mx-auto p-4 pt-16">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full overflow-x-auto p-4">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
