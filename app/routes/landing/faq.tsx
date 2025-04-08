import { ArrowRight, Search } from "lucide-react";
import { Link } from "react-router";
import { LandingLayout } from "~/components/layout";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";

export function meta() {
  return [
    { title: "FAQs - React Router v7 Demo" },
    {
      name: "description",
      content: "Frequently asked questions about React Router v7",
    },
  ];
}

export default function FaqPage() {
  return (
    <LandingLayout>
      {/* Hero Section */}
      <section className="from-muted/50 to-background bg-gradient-to-b px-4 py-20">
        <div className="container mx-auto text-center">
          <h1 className="mb-6 text-4xl font-bold md:text-5xl">
            Frequently Asked Questions
          </h1>
          <p className="text-muted-foreground mx-auto mb-8 max-w-3xl text-xl">
            Find answers to common questions about React Router v7 and how to
            use it in your projects.
          </p>

          {/* Search Bar */}
          <div className="relative mx-auto max-w-2xl">
            <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
              <Search className="text-muted-foreground h-5 w-5" />
            </div>
            <Input
              type="search"
              placeholder="Search for answers..."
              className="rounded-full py-6 pr-4 pl-10 text-lg"
            />
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="px-4 py-16">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <CategoryCard
              title="Getting Started"
              description="Basic concepts and setup instructions"
              items={[
                "Installation",
                "Basic Setup",
                "Configuration",
                "First Route",
              ]}
            />
            <CategoryCard
              title="Core Concepts"
              description="Understanding routes, loaders and actions"
              items={[
                "Defining Routes",
                "Nested Routes",
                "Data Loading",
                "Form Actions",
              ]}
            />
            <CategoryCard
              title="Advanced Usage"
              description="Advanced techniques and patterns"
              items={[
                "Code Splitting",
                "Error Handling",
                "Authentication",
                "Lazy Loading",
              ]}
            />
          </div>
        </div>
      </section>

      {/* FAQ Items Section */}
      <section className="bg-muted/30 px-4 py-16">
        <div className="container mx-auto max-w-4xl">
          <h2 className="mb-12 text-center text-3xl font-bold">
            Common Questions
          </h2>

          <div className="space-y-8">
            <FaqItem
              question="What is React Router v7?"
              answer="React Router v7 is the latest version of React Router, a standard library for routing in React applications. Version 7 introduces a streamlined API, improved performance, and better TypeScript support compared to previous versions."
            />

            <FaqItem
              question="How is React Router v7 different from previous versions?"
              answer="React Router v7 introduces several key improvements including a more intuitive API, better performance through reduced re-renders, improved TypeScript support, and simplified route definitions. It also includes built-in support for data loading and mutations."
            />

            <FaqItem
              question="Do I need to use TypeScript with React Router v7?"
              answer="No, TypeScript is not required. React Router v7 works perfectly fine with JavaScript. However, if you are using TypeScript, you'll benefit from improved type definitions and better type safety compared to previous versions."
            />

            <FaqItem
              question="Can I use React Router v7 with Next.js?"
              answer="React Router v7 is designed for client-side routing in React applications. Next.js has its own built-in routing system, so typically you would use one or the other. However, it is possible to use React Router within specific Next.js pages if you have a specific use case that requires it."
            />

            <FaqItem
              question="How do I handle code splitting with React Router v7?"
              answer="React Router v7 makes code splitting easy with its built-in support for lazy loading. You can use React's lazy and Suspense components together with the route definitions to load components only when they're needed."
            />

            <FaqItem
              question="Can I migrate gradually from v6 to v7?"
              answer="Yes, React Router v7 provides compatibility layers and migration guides to help you transition gradually. You can start by updating your route definitions and then progressively adopt other new features like loaders and actions."
            />

            <FaqItem
              question="How do I handle authentication with React Router v7?"
              answer="React Router v7 provides several ways to handle authentication. You can use route loaders to check authentication status, implement protected routes with the require property, and manage authentication state through context or a state management library."
            />

            <FaqItem
              question="Is React Router v7 backward compatible with v6?"
              answer="React Router v7 introduces some breaking changes from v6, but many core concepts remain similar. There are compatibility layers available to ease migration, and the documentation provides detailed migration guides to help you update your code."
            />
          </div>

          <div className="mt-12 text-center">
            <Button variant="outline" size="lg" className="gap-2">
              View All FAQs <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-16">
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="mb-6 text-3xl font-bold">Still have questions?</h2>
          <p className="text-muted-foreground mb-8 text-xl">
            If you couldn't find the answer you were looking for, reach out to
            our support team.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Link to="/contact">
              <Button size="lg" className="gap-2">
                Contact Support <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/docs">
              <Button size="lg" variant="outline">
                Browse Documentation
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </LandingLayout>
  );
}

function CategoryCard({
  title,
  description,
  items,
}: {
  title: string;
  description: string;
  items: string[];
}) {
  return (
    <div className="bg-card rounded-lg border p-6 shadow-sm">
      <h3 className="mb-2 text-xl font-bold">{title}</h3>
      <p className="text-muted-foreground mb-4">{description}</p>
      <ul className="space-y-2">
        {items.map((item, index) => (
          <li key={index} className="flex items-center gap-2">
            <div className="bg-primary h-1.5 w-1.5 rounded-full"></div>
            <span>{item}</span>
          </li>
        ))}
      </ul>
      <Button variant="link" className="mt-4 h-auto gap-1 p-0" asChild>
        <Link to={`/docs/${title.toLowerCase().replace(/\s+/g, "-")}`}>
          View all <ArrowRight className="h-3 w-3" />
        </Link>
      </Button>
    </div>
  );
}

function FaqItem({ question, answer }: { question: string; answer: string }) {
  return (
    <div className="border-b pb-6">
      <h3 className="mb-2 text-lg font-semibold">{question}</h3>
      <p className="text-muted-foreground">{answer}</p>
    </div>
  );
}
