import { Link } from "react-router";
import { ArrowRight, Check, Zap, Shield, Globe, BarChart, Layers } from "lucide-react";
import { Button } from "~/components/ui/button";
import { LandingLayout } from "~/components/layout";

export function meta() {
  return [
    { title: "Features - React Router v7 Demo" },
    { name: "description", content: "Explore the powerful features of React Router v7" }
  ];
}

export default function FeaturesPage() {
  return (
    <LandingLayout>
      {/* Hero Section */}
      <section className="px-4 py-20 bg-gradient-to-b from-muted/50 to-background">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Powerful Features</h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Everything you need to build modern web applications with React Router v7.
          </p>
        </div>
      </section>

      {/* Feature List Section */}
      <section className="px-4 py-16">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            <FeatureItem
              icon={<Zap className="h-8 w-8 text-primary" />}
              title="Declarative Routing"
              description="Define your routes with a simple, intuitive syntax that makes your code more readable and maintainable."
            >
              <pre className="bg-muted p-4 rounded-md text-sm mt-4 overflow-x-auto">
                {`// Define routes declaratively
export default [
  index("routes/home.tsx"),
  route("dashboard", "routes/dashboard.tsx", [
    index("routes/dashboard/overview.tsx"),
    route("settings", "routes/dashboard/settings.tsx")
  ]),
]`}
              </pre>
            </FeatureItem>

            <FeatureItem
              icon={<Layers className="h-8 w-8 text-primary" />}
              title="Nested Routes"
              description="Create complex UIs with nested routes that mirror your application's component hierarchy."
            >
              <ul className="mt-4 space-y-2">
                <ListItem>Organize routes hierarchically</ListItem>
                <ListItem>Share layouts between related routes</ListItem>
                <ListItem>Load data for specific sections of your UI</ListItem>
                <ListItem>Maintain clean URLs that reflect your app structure</ListItem>
              </ul>
            </FeatureItem>

            <FeatureItem
              icon={<Globe className="h-8 w-8 text-primary" />}
              title="Dynamic Route Matching"
              description="Handle dynamic segments, optional parameters, and catch-all routes with ease."
            >
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="bg-muted p-3 rounded-md">
                  <p className="font-mono text-sm mb-1">:userId</p>
                  <p className="text-xs text-muted-foreground">Dynamic segments</p>
                </div>
                <div className="bg-muted p-3 rounded-md">
                  <p className="font-mono text-sm mb-1">:category?</p>
                  <p className="text-xs text-muted-foreground">Optional parameters</p>
                </div>
                <div className="bg-muted p-3 rounded-md">
                  <p className="font-mono text-sm mb-1">*</p>
                  <p className="text-xs text-muted-foreground">Catch-all routes</p>
                </div>
                <div className="bg-muted p-3 rounded-md">
                  <p className="font-mono text-sm mb-1">?filter=active</p>
                  <p className="text-xs text-muted-foreground">Search params</p>
                </div>
              </div>
            </FeatureItem>

            <FeatureItem
              icon={<BarChart className="h-8 w-8 text-primary" />}
              title="Data Loading"
              description="Load data for your routes before they render, with built-in loading states and error handling."
            >
              <ul className="mt-4 space-y-2">
                <ListItem>Parallel data loading for multiple components</ListItem>
                <ListItem>Automatic loading indicators</ListItem>
                <ListItem>Graceful error boundaries</ListItem>
                <ListItem>Data revalidation strategies</ListItem>
              </ul>
            </FeatureItem>

            <FeatureItem
              icon={<Shield className="h-8 w-8 text-primary" />}
              title="Authentication & Authorization"
              description="Protect routes with middleware that runs before your components render."
            >
              <pre className="bg-muted p-4 rounded-md text-sm mt-4 overflow-x-auto">
                {`// Auth middleware example
                  export const loader = async ({ request }) => {
                    const user = await getUser(request);
                    if (!user) {
                      return redirect("/auth/login");
                    }
                    return { user };
                  };`}
              </pre>
            </FeatureItem>

            <FeatureItem
              icon={<Zap className="h-8 w-8 text-primary" />}
              title="Performance Optimizations"
              description="Automatically optimize your application with code splitting and prefetching."
            >
              <ul className="mt-4 space-y-2">
                <ListItem>Automatic code-splitting by route</ListItem>
                <ListItem>Prefetching for instant page transitions</ListItem>
                <ListItem>Optimized bundle sizes</ListItem>
                <ListItem>Deferred data loading for non-critical content</ListItem>
              </ul>
            </FeatureItem>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-16 bg-muted/30">
        <div className="container mx-auto text-center max-w-3xl">
          <h2 className="text-3xl font-bold mb-6">Ready to get started?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Try our demo or check out the documentation to see how React Router v7 can help you build better web applications.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/dashboard">
              <Button size="lg" className="gap-2">
                Try the Demo <ArrowRight className="h-4 w-4" />
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
    </LandingLayout>
  );
}

function FeatureItem({
  icon,
  title,
  description,
  children
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="bg-primary/10 p-3 rounded-lg">{icon}</div>
        <div>
          <h3 className="text-xl font-semibold">{title}</h3>
          <p className="text-muted-foreground">{description}</p>
        </div>
      </div>
      {children}
    </div>
  );
}

function ListItem({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2">
      <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
      <span>{children}</span>
    </li>
  );
}
