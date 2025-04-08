import { ArrowLeft, Home } from "lucide-react";
import { Link } from "react-router";
import { Button } from "~/components/ui/button";
import { LandingLayout } from "~/layouts";

export function meta() {
  return [
    { title: "Page Not Found - React Router v7 Demo" },
    {
      name: "description",
      content: "The page you are looking for does not exist",
    },
  ];
}

export default function NotFoundPage() {
  return (
    <LandingLayout showFooter={false}>
      <div className="flex min-h-[80vh] items-center justify-center py-16">
        <div className="container mx-auto max-w-3xl px-4 text-center">
          <h1 className="text-primary mb-4 text-9xl font-bold">404</h1>
          <h2 className="mb-6 text-3xl font-bold md:text-4xl">
            Page Not Found
          </h2>
          <p className="text-muted-foreground mx-auto mb-8 max-w-2xl text-xl">
            The page you are looking for doesn't exist or has been moved. Please
            check the URL or navigate back to the homepage.
          </p>

          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Button variant="default" size="lg" className="gap-2" asChild>
              <Link to="/">
                <Home className="h-4 w-4" /> Go to Homepage
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="gap-2"
              onClick={() => window.history.back()}
            >
              <ArrowLeft className="h-4 w-4" /> Go Back
            </Button>
          </div>

          <div className="bg-muted/30 mt-16 w-full max-w-md rounded-lg p-6">
            <h3 className="mb-4 text-lg font-semibold">
              Looking for something specific?
            </h3>
            <ul className="space-y-2 text-left">
              <li>
                <Link
                  to="/docs"
                  className="text-primary flex items-center hover:underline"
                >
                  <span className="mr-2">•</span> Documentation
                </Link>
              </li>
              <li>
                <Link
                  to="/faq"
                  className="text-primary flex items-center hover:underline"
                >
                  <span className="mr-2">•</span> Frequently Asked Questions
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-primary flex items-center hover:underline"
                >
                  <span className="mr-2">•</span> Contact Support
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </LandingLayout>
  );
}
