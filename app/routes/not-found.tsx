import { Link } from "react-router";
import { ArrowLeft, Home } from "lucide-react";
import { Button } from "~/components/ui/button";
import { LandingLayout } from "~/components/layout";

export function meta() {
  return [
    { title: "Page Not Found - React Router v7 Demo" },
    { name: "description", content: "The page you are looking for does not exist" }
  ];
}

export default function NotFoundPage() {
  return (
    <LandingLayout showFooter={false}>
      <div className="flex items-center justify-center min-h-[80vh] py-16">
        <div className="container max-w-3xl mx-auto px-4 text-center">
          <h1 className="text-9xl font-bold text-primary mb-4">404</h1>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Page Not Found</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            The page you are looking for doesn't exist or has been moved. Please check the URL or navigate back to the homepage.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="default" size="lg" className="gap-2" asChild>
              <Link to="/">
                <Home className="h-4 w-4" /> Go to Homepage
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="gap-2" onClick={() => window.history.back()}>
              <ArrowLeft className="h-4 w-4" /> Go Back
            </Button>
          </div>

          <div className="mt-16 w-full max-w-md p-6 bg-muted/30 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Looking for something specific?</h3>
            <ul className="space-y-2 text-left">
              <li>
                <Link to="/docs" className="text-primary hover:underline flex items-center">
                  <span className="mr-2">•</span> Documentation
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-primary hover:underline flex items-center">
                  <span className="mr-2">•</span> Frequently Asked Questions
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-primary hover:underline flex items-center">
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
