import {
  ArrowRight,
  CheckCircle,
  Code2,
  Database,
  Lock,
  Server,
  Zap,
} from "lucide-react";
import { Link } from "react-router";
import { LandingLayout } from "~/components/layout";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "~/components/ui/carousel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";

export function meta() {
  return [
    { title: "React Router v7 Demo" },
    { name: "description", content: "Modern routing for React applications" },
  ];
}

export default function HomePage() {
  return (
    <LandingLayout>
      {/* Hero Section */}
      <section className="from-muted/50 to-background bg-gradient-to-b px-4 py-20 md:py-28">
        <div className="container mx-auto text-center">
          <Badge className="mb-4" variant="outline">
            React Router v7
          </Badge>
          <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-6xl">
            Modern Routing for React Apps
          </h1>
          <p className="text-muted-foreground mx-auto mb-8 max-w-3xl text-xl md:text-2xl">
            A comprehensive routing solution with all the features you need for
            your next React project.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
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

      {/* Features with Carousel */}
      <section id="features" className="px-4 py-24">
        <div className="container mx-auto">
          <div className="mb-12 text-center">
            <Badge className="mb-2">Features</Badge>
            <h2 className="mb-4 text-3xl font-bold tracking-tight">
              Powerful Features
            </h2>
            <p className="text-muted-foreground mx-auto max-w-3xl text-xl">
              React Router v7 comes with all the features you need to build
              modern web applications.
            </p>
          </div>

          <Carousel className="mx-auto w-full max-w-5xl">
            <CarouselContent>
              <CarouselItem className="md:basis-1/2 lg:basis-1/3">
                <Card className="h-full">
                  <CardHeader>
                    <Code2 className="text-primary mb-2 h-10 w-10" />
                    <CardTitle>Declarative Routing</CardTitle>
                    <CardDescription>
                      Define your routes in a structured, easy-to-understand way
                      that mirrors your application architecture.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm">
                      Use the power of React's component model to compose your
                      routes in a way that makes sense for your application.
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
              </CarouselItem>

              <CarouselItem className="md:basis-1/2 lg:basis-1/3">
                <Card className="h-full">
                  <CardHeader>
                    <Database className="text-primary mb-2 h-10 w-10" />
                    <CardTitle>Data Handling</CardTitle>
                    <CardDescription>
                      Simplify data loading and state management with built-in
                      data handling features.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm">
                      Fetch data before your components render, handle loading
                      and error states, and keep your UI in sync with your data.
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
              </CarouselItem>

              <CarouselItem className="md:basis-1/2 lg:basis-1/3">
                <Card className="h-full">
                  <CardHeader>
                    <Lock className="text-primary mb-2 h-10 w-10" />
                    <CardTitle>Authentication</CardTitle>
                    <CardDescription>
                      Secure your application with built-in authentication
                      patterns and protected routes.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm">
                      Implement complex auth flows and protect your routes with
                      middleware functions that run before rendering.
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Link to="/auth/login">
                      <Button variant="ghost" className="gap-1 p-0">
                        Try it out <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              </CarouselItem>

              <CarouselItem className="md:basis-1/2 lg:basis-1/3">
                <Card className="h-full">
                  <CardHeader>
                    <Server className="text-primary mb-2 h-10 w-10" />
                    <CardTitle>Server Rendering</CardTitle>
                    <CardDescription>
                      Built-in support for server-side rendering and static site
                      generation.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm">
                      Optimize your application for performance and SEO with
                      first-class support for server rendering.
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
              </CarouselItem>

              <CarouselItem className="md:basis-1/2 lg:basis-1/3">
                <Card className="h-full">
                  <CardHeader>
                    <Zap className="text-primary mb-2 h-10 w-10" />
                    <CardTitle>Fast Performance</CardTitle>
                    <CardDescription>
                      Optimized for speed with code splitting and prefetching
                      capabilities.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm">
                      Enjoy fast page loads with automatic code splitting and
                      smart prefetching strategies.
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
              </CarouselItem>
            </CarouselContent>
            <div className="mt-8 flex justify-center">
              <CarouselPrevious className="static mr-2 translate-x-0 translate-y-0" />
              <CarouselNext className="static translate-x-0 translate-y-0" />
            </div>
          </Carousel>
        </div>
      </section>

      {/* Layout Showcase with Tabs */}
      <section className="px-4 py-24">
        <div className="container mx-auto">
          <div className="mb-12 text-center">
            <Badge className="mb-2">Layouts</Badge>
            <h2 className="mb-4 text-3xl font-bold tracking-tight">
              Flexible Layouts
            </h2>
            <p className="text-muted-foreground mx-auto max-w-3xl text-xl">
              Choose from multiple layout options to build any type of
              application.
            </p>
          </div>

          <Tabs defaultValue="dashboard" className="mx-auto w-full max-w-4xl">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="landing">Landing</TabsTrigger>
              <TabsTrigger value="auth">Auth</TabsTrigger>
            </TabsList>
            <TabsContent value="dashboard" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col items-center gap-8 lg:flex-row">
                    <div className="bg-muted flex h-64 w-full max-w-md rounded-md">
                      <div className="bg-muted-foreground/20 flex h-full w-16 flex-col gap-2 p-2">
                        <div className="bg-muted-foreground/30 h-8 w-full rounded"></div>
                        <div className="bg-muted-foreground/30 h-8 w-full rounded"></div>
                        <div className="bg-muted-foreground/30 h-8 w-full rounded"></div>
                      </div>
                      <div className="flex-1 p-4">
                        <div className="bg-muted-foreground/20 mb-4 h-8 w-1/3 rounded"></div>
                        <div className="mb-4 grid grid-cols-3 gap-3">
                          <div className="bg-muted-foreground/10 h-16 rounded"></div>
                          <div className="bg-muted-foreground/10 h-16 rounded"></div>
                          <div className="bg-muted-foreground/10 h-16 rounded"></div>
                        </div>
                        <div className="bg-muted-foreground/10 h-24 rounded"></div>
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="mb-3 text-xl font-semibold">
                        Dashboard Layout
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        A full-featured layout with sidebar navigation, ideal
                        for dashboards, admin panels, and complex applications.
                      </p>
                      <ul className="mb-4 space-y-2">
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span>Collapsible sidebar navigation</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span>Header with user controls</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span>Mobile responsive design</span>
                        </li>
                      </ul>
                      <Link to="/dashboard">
                        <Button>View Dashboard</Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="landing" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col items-center gap-8 lg:flex-row">
                    <div className="bg-muted flex h-64 w-full max-w-md flex-col rounded-md">
                      <div className="bg-muted-foreground/20 flex h-12 w-full items-center px-4">
                        <div className="bg-muted-foreground/30 mr-auto h-4 w-24 rounded"></div>
                        <div className="flex gap-2">
                          <div className="bg-muted-foreground/30 h-4 w-16 rounded"></div>
                          <div className="bg-muted-foreground/30 h-4 w-16 rounded"></div>
                          <div className="bg-muted-foreground/30 h-4 w-16 rounded"></div>
                        </div>
                      </div>
                      <div className="flex-1 p-4">
                        <div className="bg-muted-foreground/20 mx-auto mb-4 h-16 w-2/3 rounded"></div>
                        <div className="bg-muted-foreground/10 mb-2 h-6 w-full rounded"></div>
                        <div className="bg-muted-foreground/10 h-6 w-full rounded"></div>
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="mb-3 text-xl font-semibold">
                        Landing Layout
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        Perfect for marketing pages, product showcases, and
                        public-facing pages with a top navigation bar and
                        footer.
                      </p>
                      <ul className="mb-4 space-y-2">
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span>Header with navigation links</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span>Full-width content sections</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span>Footer with important links</span>
                        </li>
                      </ul>
                      <Link to="/">
                        <Button>You're Here</Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="auth" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col items-center gap-8 lg:flex-row">
                    <div className="bg-muted flex h-64 w-full max-w-md items-center justify-center rounded-md">
                      <div className="bg-card flex h-48 w-64 flex-col rounded-md border p-4">
                        <div className="bg-muted-foreground/30 mx-auto mb-4 h-4 w-32 rounded"></div>
                        <div className="bg-muted-foreground/10 mb-3 h-8 w-full rounded"></div>
                        <div className="bg-muted-foreground/10 mb-3 h-8 w-full rounded"></div>
                        <div className="bg-primary/20 mt-auto h-8 w-full rounded"></div>
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="mb-3 text-xl font-semibold">
                        Auth Layout
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        A clean, minimal layout focused on the task at hand,
                        perfect for authentication pages like login and
                        registration.
                      </p>
                      <ul className="mb-4 space-y-2">
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span>Centered card design</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span>Distraction-free experience</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span>Navigation back to main site</span>
                        </li>
                      </ul>
                      <Link to="/auth/login">
                        <Button>View Auth Pages</Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 py-24">
        <div className="container mx-auto text-center">
          <h2 className="mb-6 text-3xl font-bold">Ready to Get Started?</h2>
          <p className="mx-auto mb-8 max-w-2xl text-xl">
            Try our demo dashboard or check out the documentation to see how
            React Router v7 can help you build better applications.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Link to="/dashboard">
              <Button size="lg" className="gap-2">
                Try Dashboard <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/docs">
              <Button
                size="lg"
                variant="outline"
                className="border-primary-foreground/20 hover:bg-primary-foreground/10 bg-transparent"
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
