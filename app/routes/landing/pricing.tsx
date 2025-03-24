import { Link } from "react-router";
import { Check, ArrowRight } from "lucide-react";
import { Button } from "~/components/ui/button";
import { LandingLayout } from "~/components/layout";

export function meta() {
  return [
    { title: "Pricing - React Router v7 Demo" },
    { name: "description", content: "Flexible pricing plans for React Router v7" }
  ];
}

export default function PricingPage() {
  return (
    <LandingLayout>
      {/* Hero Section */}
      <section className="px-4 py-20 bg-gradient-to-b from-muted/50 to-background">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Simple, Transparent Pricing</h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Choose the plan that's right for you and start building amazing web applications.
          </p>
        </div>
      </section>

      {/* Pricing Tables */}
      <section className="px-4 py-16">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Free Plan */}
            <div className="border rounded-lg p-8 bg-card flex flex-col">
              <div>
                <h3 className="text-lg font-medium mb-2">Free</h3>
                <p className="text-3xl font-bold mb-2">
                  $0<span className="text-muted-foreground text-base font-normal">/month</span>
                </p>
                <p className="text-muted-foreground mb-6">Perfect for getting started and learning the basics.</p>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                <PricingListItem>All core routing features</PricingListItem>
                <PricingListItem>Basic documentation</PricingListItem>
                <PricingListItem>Community support</PricingListItem>
                <PricingListItem>Unlimited public projects</PricingListItem>
              </ul>

              <Link to="/register" className="mt-auto">
                <Button variant="outline" className="w-full">
                  Get Started
                </Button>
              </Link>
            </div>

            {/* Pro Plan */}
            <div className="border rounded-lg p-8 bg-card flex flex-col relative">
              <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-3 py-1 text-xs font-medium rounded-bl-lg rounded-tr-lg">
                Popular
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2">Pro</h3>
                <p className="text-3xl font-bold mb-2">
                  $29<span className="text-muted-foreground text-base font-normal">/month</span>
                </p>
                <p className="text-muted-foreground mb-6">Ideal for professionals and growing teams.</p>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                <PricingListItem>Everything in Free</PricingListItem>
                <PricingListItem>Advanced routing features</PricingListItem>
                <PricingListItem>Premium components library</PricingListItem>
                <PricingListItem>Priority support</PricingListItem>
                <PricingListItem>Performance optimizations</PricingListItem>
                <PricingListItem>Unlimited private projects</PricingListItem>
              </ul>

              <Link to="/register" className="mt-auto">
                <Button className="w-full">Get Started</Button>
              </Link>
            </div>

            {/* Enterprise Plan */}
            <div className="border rounded-lg p-8 bg-card flex flex-col">
              <div>
                <h3 className="text-lg font-medium mb-2">Enterprise</h3>
                <p className="text-3xl font-bold mb-2">
                  $99<span className="text-muted-foreground text-base font-normal">/month</span>
                </p>
                <p className="text-muted-foreground mb-6">Advanced features for larger organizations.</p>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
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
      <section className="px-4 py-16 bg-muted/30">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold mb-12 text-center">Frequently Asked Questions</h2>

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

      {/* CTA Section */}
      <section className="px-4 py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto text-center max-w-3xl">
          <h2 className="text-3xl font-bold mb-6">Ready to get started?</h2>
          <p className="text-xl text-primary-foreground/90 mb-8">
            Join thousands of developers already using React Router v7 to build better web applications.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button size="lg" variant="secondary" className="gap-2">
                Sign Up Now <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/contact">
              <Button
                size="lg"
                variant="outline"
                className="bg-transparent border-primary-foreground/20 hover:bg-primary-foreground/10"
              >
                Contact Sales
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
      <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
      <span>{children}</span>
    </li>
  );
}

function FaqItem({ question, answer }: { question: string; answer: string }) {
  return (
    <div className="border-b pb-6">
      <h3 className="text-lg font-semibold mb-2">{question}</h3>
      <p className="text-muted-foreground">{answer}</p>
    </div>
  );
}
