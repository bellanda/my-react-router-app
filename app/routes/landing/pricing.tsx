import { ArrowRight, Check } from "lucide-react";
import { Link } from "react-router";
import { Button } from "~/components/ui/button";
import { LandingLayout } from "~/layouts";

export function meta() {
  return [
    { title: "Pricing - React Router v7 Demo" },
    {
      name: "description",
      content: "Flexible pricing plans for React Router v7",
    },
  ];
}

export default function PricingPage() {
  return (
    <LandingLayout>
      {/* Hero Section */}
      <section className="from-muted/50 to-background bg-gradient-to-b px-4 py-20">
        <div className="container mx-auto text-center">
          <h1 className="mb-6 text-4xl font-bold md:text-5xl">
            Simple, Transparent Pricing
          </h1>
          <p className="text-muted-foreground mx-auto mb-8 max-w-3xl text-xl">
            Choose the plan that's right for you and start building amazing web
            applications.
          </p>
        </div>
      </section>

      {/* Pricing Tables */}
      <section className="px-4 py-16">
        <div className="container mx-auto">
          <div className="grid gap-8 md:grid-cols-3">
            {/* Free Plan */}
            <div className="bg-card flex flex-col rounded-lg border p-8">
              <div>
                <h3 className="mb-2 text-lg font-medium">Free</h3>
                <p className="mb-2 text-3xl font-bold">
                  $0
                  <span className="text-muted-foreground text-base font-normal">
                    /month
                  </span>
                </p>
                <p className="text-muted-foreground mb-6">
                  Perfect for getting started and learning the basics.
                </p>
              </div>

              <ul className="mb-8 flex-1 space-y-3">
                <PricingListItem>All core routing features</PricingListItem>
                <PricingListItem>Basic documentation</PricingListItem>
                <PricingListItem>Community support</PricingListItem>
                <PricingListItem>Unlimited public projects</PricingListItem>
              </ul>

              <Link to="/auth/register" className="mt-auto">
                <Button variant="outline" className="w-full">
                  Get Started
                </Button>
              </Link>
            </div>

            {/* Pro Plan */}
            <div className="bg-card relative flex flex-col rounded-lg border p-8">
              <div className="bg-primary text-primary-foreground absolute top-0 right-0 rounded-tr-lg rounded-bl-lg px-3 py-1 text-xs font-medium">
                Popular
              </div>
              <div>
                <h3 className="mb-2 text-lg font-medium">Pro</h3>
                <p className="mb-2 text-3xl font-bold">
                  $29
                  <span className="text-muted-foreground text-base font-normal">
                    /month
                  </span>
                </p>
                <p className="text-muted-foreground mb-6">
                  Ideal for professionals and growing teams.
                </p>
              </div>

              <ul className="mb-8 flex-1 space-y-3">
                <PricingListItem>Everything in Free</PricingListItem>
                <PricingListItem>Advanced routing features</PricingListItem>
                <PricingListItem>Premium components library</PricingListItem>
                <PricingListItem>Priority support</PricingListItem>
                <PricingListItem>Performance optimizations</PricingListItem>
                <PricingListItem>Unlimited private projects</PricingListItem>
              </ul>

              <Link to="/auth/register" className="mt-auto">
                <Button className="w-full">Get Started</Button>
              </Link>
            </div>

            {/* Enterprise Plan */}
            <div className="bg-card flex flex-col rounded-lg border p-8">
              <div>
                <h3 className="mb-2 text-lg font-medium">Enterprise</h3>
                <p className="mb-2 text-3xl font-bold">
                  $99
                  <span className="text-muted-foreground text-base font-normal">
                    /month
                  </span>
                </p>
                <p className="text-muted-foreground mb-6">
                  Advanced features for larger organizations.
                </p>
              </div>

              <ul className="mb-8 flex-1 space-y-3">
                <PricingListItem>Everything in Pro</PricingListItem>
                <PricingListItem>Custom routing solutions</PricingListItem>
                <PricingListItem>Dedicated support team</PricingListItem>
                <PricingListItem>SLA guarantees</PricingListItem>
                <PricingListItem>Advanced security features</PricingListItem>
                <PricingListItem>Extended analytics</PricingListItem>
                <PricingListItem>Team management tools</PricingListItem>
              </ul>

              <Link to="/contact" className="mt-auto">
                <Button variant="outline" className="w-full">
                  Contact Sales
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-muted/30 px-4 py-16">
        <div className="container mx-auto max-w-4xl">
          <h2 className="mb-12 text-center text-3xl font-bold">
            Frequently Asked Questions
          </h2>

          <div className="space-y-8">
            <FaqItem
              question="What's included in the free plan?"
              answer="The free plan includes all the core routing features, basic documentation and access to community support. It's perfect for personal projects, learning, and small applications."
            />

            <FaqItem
              question="Can I upgrade or downgrade my plan anytime?"
              answer="Yes, you can change your plan at any time. When upgrading, you'll be charged the prorated amount for the remainder of your billing cycle. When downgrading, the new rate will apply to your next billing cycle."
            />

            <FaqItem
              question="Do you offer a discount for startups or non-profits?"
              answer="Yes, we offer special pricing for eligible startups, non-profit organizations, and educational institutions. Please contact our sales team for more information."
            />

            <FaqItem
              question="Is there a trial period for paid plans?"
              answer="Yes, all paid plans come with a 14-day free trial. No credit card is required to start your trial, and you can cancel anytime during the trial period without being charged."
            />

            <FaqItem
              question="What payment methods do you accept?"
              answer="We accept all major credit cards (Visa, MasterCard, American Express) as well as PayPal. For Enterprise plans, we also offer invoicing options."
            />
          </div>
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

function PricingListItem({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2">
      <Check className="text-primary mt-0.5 h-5 w-5 shrink-0" />
      <span>{children}</span>
    </li>
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
