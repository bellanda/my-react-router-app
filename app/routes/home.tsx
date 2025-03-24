import { Link } from "react-router";
import { ArrowRight, CheckCircle, Code2, Database, Lock } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { LandingLayout } from "~/components/layout";

export function meta() {
  return [{ title: "React Router v7 Demo" }, { name: "description", content: "Modern routing for React applications" }];
}

export default function HomePage() {
  return (
    <LandingLayout
      navLinks={[
        { label: "Home", href: "/" },
        { label: "Features", href: "#features" },
        { label: "Blog", href: "/blog" },
        { label: "Docs", href: "/docs" },
        { label: "Dashboard", href: "/dashboard" }
      ]}
    >
      {/* Hero Section */}
      <section className="px-4 py-24 md:py-32 bg-gradient-to-b from-muted/50 to-background">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Modern Routing for React Apps</h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            A comprehensive routing solution with all the features you need for your next React project.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/dashboard">
              <Button size="lg" className="gap-2">
                Try Dashboard <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/docs">
              <Button size="lg" variant="outline">
                Read the Docs
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="px-4 py-24 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Powerful Features</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              React Router v7 comes with all the features you need to build modern web applications.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <Code2 className="h-10 w-10 mb-2 text-primary" />
                <CardTitle>Declarative Routing</CardTitle>
                <CardDescription>
                  Define your routes in a structured, easy-to-understand way that mirrors your application architecture.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Use the power of React's component model to compose your routes in a way that makes sense for your application.
                </p>
              </CardContent>
              <CardFooter>
                <Link to="/docs">
                  <Button variant="ghost" className="gap-1 p-0">
                    Learn more <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <Database className="h-10 w-10 mb-2 text-primary" />
                <CardTitle>Data Handling</CardTitle>
                <CardDescription>Simplify data loading and state management with built-in data handling features.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Fetch data before your components render, handle loading and error states, and keep your UI in sync with your
                  data.
                </p>
              </CardContent>
              <CardFooter>
                <Link to="/docs">
                  <Button variant="ghost" className="gap-1 p-0">
                    Learn more <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <Lock className="h-10 w-10 mb-2 text-primary" />
                <CardTitle>Authentication</CardTitle>
                <CardDescription>
                  Secure your application with built-in authentication patterns and protected routes.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Implement complex auth flows and protect your routes with middleware functions that run before rendering.
                </p>
              </CardContent>
              <CardFooter>
                <Link to="/login">
                  <Button variant="ghost" className="gap-1 p-0">
                    Try it out <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      {/* Layout Showcase */}
      <section className="px-4 py-24">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Flexible Layouts</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Choose from multiple layout options to build any type of application.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-6 rounded-lg border bg-card shadow-sm">
              <div className="w-full h-48 mb-4 bg-muted rounded-md flex items-center justify-center">
                <div className="w-16 h-full bg-muted-foreground/20"></div>
                <div className="flex-1 p-4">
                  <div className="h-6 w-24 bg-muted-foreground/20 mb-2 rounded"></div>
                  <div className="h-20 bg-muted-foreground/10 rounded"></div>
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2">Main Layout</h3>
              <p className="text-muted-foreground mb-4">
                A full-featured layout with sidebar, ideal for dashboards and admin panels.
              </p>
              <Link to="/dashboard">
                <Button variant="outline" size="sm">
                  View Example
                </Button>
              </Link>
            </div>

            <div className="flex flex-col items-center text-center p-6 rounded-lg border bg-card shadow-sm">
              <div className="w-full h-48 mb-4 bg-muted rounded-md flex flex-col">
                <div className="h-12 w-full bg-muted-foreground/20 mb-2 rounded-t-md"></div>
                <div className="flex-1 p-4">
                  <div className="h-24 bg-muted-foreground/10 rounded"></div>
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2">Landing Layout</h3>
              <p className="text-muted-foreground mb-4">Perfect for marketing pages with a top navigation bar and footer.</p>
              <Link to="/">
                <Button variant="outline" size="sm">
                  You're Here
                </Button>
              </Link>
            </div>

            <div className="flex flex-col items-center text-center p-6 rounded-lg border bg-card shadow-sm">
              <div className="w-full h-48 mb-4 bg-muted rounded-md flex items-center justify-center">
                <div className="w-32 h-32 bg-muted-foreground/10 rounded"></div>
              </div>
              <h3 className="text-xl font-semibold mb-2">Auth Layout</h3>
              <p className="text-muted-foreground mb-4">
                A clean, minimal layout for authentication pages like login and registration.
              </p>
              <Link to="/login">
                <Button variant="outline" size="sm">
                  View Example
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl mb-8 text-primary-foreground/90 max-w-2xl mx-auto">
            Try our demo dashboard or check out the documentation to see how React Router v7 can help you build better applications.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/dashboard">
              <Button size="lg" variant="secondary" className="gap-2">
                Try Dashboard <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/docs">
              <Button
                size="lg"
                variant="outline"
                className="bg-transparent border-primary-foreground/20 hover:bg-primary-foreground/10"
              >
                Read the Docs
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </LandingLayout>
  );
}
