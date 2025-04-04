import { ArrowRight, CheckCircle, Code2, Database, Lock, Server, Zap } from "lucide-react";
import { Link } from "react-router";
import { LandingLayout } from "~/components/layout";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "~/components/ui/carousel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";

export function meta() {
  return [{ title: "React Router v7 Demo" }, { name: "description", content: "Modern routing for React applications" }];
}

export default function HomePage() {
  return (
    <LandingLayout>
      {/* Hero Section */}
      <section className="px-4 py-20 md:py-28 bg-gradient-to-b from-muted/50 to-background">
        <div className="container mx-auto text-center">
          <Badge className="mb-4" variant="outline">
            React Router v7
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">Modern Routing for React Apps</h1>
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

      {/* Features with Carousel */}
      <section id="features" className="px-4 py-24">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <Badge className="mb-2">Features</Badge>
            <h2 className="text-3xl font-bold mb-4 tracking-tight">Powerful Features</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              React Router v7 comes with all the features you need to build modern web applications.
            </p>
          </div>

          <Carousel className="w-full max-w-5xl mx-auto">
            <CarouselContent>
              <CarouselItem className="md:basis-1/2 lg:basis-1/3">
                <Card className="h-full">
                  <CardHeader>
                    <Code2 className="h-10 w-10 mb-2 text-primary" />
                    <CardTitle>Declarative Routing</CardTitle>
                    <CardDescription>
                      Define your routes in a structured, easy-to-understand way that mirrors your application architecture.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Use the power of React's component model to compose your routes in a way that makes sense for your
                      application.
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
                    <Database className="h-10 w-10 mb-2 text-primary" />
                    <CardTitle>Data Handling</CardTitle>
                    <CardDescription>
                      Simplify data loading and state management with built-in data handling features.
                    </CardDescription>
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
              </CarouselItem>

              <CarouselItem className="md:basis-1/2 lg:basis-1/3">
                <Card className="h-full">
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
                    <Server className="h-10 w-10 mb-2 text-primary" />
                    <CardTitle>Server Rendering</CardTitle>
                    <CardDescription>Built-in support for server-side rendering and static site generation.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Optimize your application for performance and SEO with first-class support for server rendering.
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
                    <Zap className="h-10 w-10 mb-2 text-primary" />
                    <CardTitle>Fast Performance</CardTitle>
                    <CardDescription>Optimized for speed with code splitting and prefetching capabilities.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Enjoy fast page loads with automatic code splitting and smart prefetching strategies.
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
            <div className="flex justify-center mt-8">
              <CarouselPrevious className="static translate-x-0 translate-y-0 mr-2" />
              <CarouselNext className="static translate-x-0 translate-y-0" />
            </div>
          </Carousel>
        </div>
      </section>

      {/* Layout Showcase with Tabs */}
      <section className="px-4 py-24">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <Badge className="mb-2">Layouts</Badge>
            <h2 className="text-3xl font-bold mb-4 tracking-tight">Flexible Layouts</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Choose from multiple layout options to build any type of application.
            </p>
          </div>

          <Tabs defaultValue="dashboard" className="w-full max-w-4xl mx-auto">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="landing">Landing</TabsTrigger>
              <TabsTrigger value="auth">Auth</TabsTrigger>
            </TabsList>
            <TabsContent value="dashboard" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row gap-8 items-center">
                    <div className="w-full max-w-md h-64 bg-muted rounded-md flex">
                      <div className="w-16 h-full bg-muted-foreground/20 flex flex-col gap-2 p-2">
                        <div className="w-full h-8 bg-muted-foreground/30 rounded"></div>
                        <div className="w-full h-8 bg-muted-foreground/30 rounded"></div>
                        <div className="w-full h-8 bg-muted-foreground/30 rounded"></div>
                      </div>
                      <div className="flex-1 p-4">
                        <div className="h-8 w-1/3 bg-muted-foreground/20 mb-4 rounded"></div>
                        <div className="grid grid-cols-3 gap-3 mb-4">
                          <div className="h-16 bg-muted-foreground/10 rounded"></div>
                          <div className="h-16 bg-muted-foreground/10 rounded"></div>
                          <div className="h-16 bg-muted-foreground/10 rounded"></div>
                        </div>
                        <div className="h-24 bg-muted-foreground/10 rounded"></div>
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-3">Dashboard Layout</h3>
                      <p className="text-muted-foreground mb-4">
                        A full-featured layout with sidebar navigation, ideal for dashboards, admin panels, and complex
                        applications.
                      </p>
                      <ul className="space-y-2 mb-4">
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
                  <div className="flex flex-col lg:flex-row gap-8 items-center">
                    <div className="w-full max-w-md h-64 bg-muted rounded-md flex flex-col">
                      <div className="h-12 w-full bg-muted-foreground/20 flex items-center px-4">
                        <div className="h-4 w-24 bg-muted-foreground/30 rounded mr-auto"></div>
                        <div className="flex gap-2">
                          <div className="h-4 w-16 bg-muted-foreground/30 rounded"></div>
                          <div className="h-4 w-16 bg-muted-foreground/30 rounded"></div>
                          <div className="h-4 w-16 bg-muted-foreground/30 rounded"></div>
                        </div>
                      </div>
                      <div className="flex-1 p-4">
                        <div className="h-16 w-2/3 bg-muted-foreground/20 mb-4 mx-auto rounded"></div>
                        <div className="h-6 w-full bg-muted-foreground/10 mb-2 rounded"></div>
                        <div className="h-6 w-full bg-muted-foreground/10 rounded"></div>
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-3">Landing Layout</h3>
                      <p className="text-muted-foreground mb-4">
                        Perfect for marketing pages, product showcases, and public-facing pages with a top navigation bar and
                        footer.
                      </p>
                      <ul className="space-y-2 mb-4">
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
                  <div className="flex flex-col lg:flex-row gap-8 items-center">
                    <div className="w-full max-w-md h-64 bg-muted rounded-md flex items-center justify-center">
                      <div className="w-64 h-48 bg-card border rounded-md p-4 flex flex-col">
                        <div className="h-4 w-32 bg-muted-foreground/30 mb-4 mx-auto rounded"></div>
                        <div className="h-8 w-full bg-muted-foreground/10 mb-3 rounded"></div>
                        <div className="h-8 w-full bg-muted-foreground/10 mb-3 rounded"></div>
                        <div className="h-8 w-full bg-primary/20 mt-auto rounded"></div>
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-3">Auth Layout</h3>
                      <p className="text-muted-foreground mb-4">
                        A clean, minimal layout focused on the task at hand, perfect for authentication pages like login and
                        registration.
                      </p>
                      <ul className="space-y-2 mb-4">
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
          <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Try our demo dashboard or check out the documentation to see how React Router v7 can help you build better applications.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/dashboard">
              <Button size="lg" className="gap-2">
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
