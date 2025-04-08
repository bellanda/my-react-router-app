import { ArrowRight, Mail, MapPin, Phone } from "lucide-react";
import { Link } from "react-router";
import { LandingLayout } from "~/components/layout";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { Textarea } from "~/components/ui/textarea";

export function meta() {
  return [
    { title: "Contact Us - React Router v7 Demo" },
    {
      name: "description",
      content: "Get in touch with the React Router v7 team",
    },
  ];
}

export default function ContactPage() {
  return (
    <LandingLayout>
      {/* Hero Section */}
      <section className="from-muted/50 to-background bg-gradient-to-b px-4 py-20">
        <div className="container mx-auto text-center">
          <h1 className="mb-6 text-4xl font-bold md:text-5xl">Contact Us</h1>
          <p className="text-muted-foreground mx-auto mb-8 max-w-3xl text-xl">
            Have a question or feedback? We'd love to hear from you. Fill out
            the form below and we'll get back to you as soon as possible.
          </p>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="px-4 py-16">
        <div className="container mx-auto">
          <div className="grid gap-12 md:grid-cols-2">
            <div>
              <h2 className="mb-6 text-2xl font-bold">Get in Touch</h2>
              <form className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="first-name">First name</Label>
                    <Input
                      id="first-name"
                      placeholder="Enter your first name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="last-name">Last name</Label>
                    <Input id="last-name" placeholder="Enter your last name" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email address"
                  />
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium">
                    What are you contacting us about?
                  </p>
                  <RadioGroup defaultValue="general">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="general" id="general" />
                      <Label htmlFor="general">General inquiry</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="support" id="support" />
                      <Label htmlFor="support">Technical support</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="feedback" id="feedback" />
                      <Label htmlFor="feedback">Feedback</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="other" id="other" />
                      <Label htmlFor="other">Other</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    placeholder="Enter your message"
                    className="min-h-32"
                  />
                </div>

                <Button type="submit" className="w-full sm:w-auto">
                  Send Message
                </Button>
              </form>
            </div>

            <div>
              <h2 className="mb-6 text-2xl font-bold">Contact Information</h2>
              <div className="space-y-6">
                <ContactInfo
                  icon={<Mail className="text-primary h-6 w-6" />}
                  title="Email"
                  content={
                    <a
                      href="mailto:info@reactrouterv7.com"
                      className="text-primary hover:underline"
                    >
                      info@reactrouterv7.com
                    </a>
                  }
                />

                <ContactInfo
                  icon={<Phone className="text-primary h-6 w-6" />}
                  title="Phone"
                  content={
                    <a
                      href="tel:+1234567890"
                      className="text-primary hover:underline"
                    >
                      +1 (234) 567-890
                    </a>
                  }
                />

                <ContactInfo
                  icon={<MapPin className="text-primary h-6 w-6" />}
                  title="Office"
                  content={
                    <>
                      123 React Street
                      <br />
                      San Francisco, CA 94107
                      <br />
                      United States
                    </>
                  }
                />
              </div>

              <div className="bg-muted mt-8 rounded-lg p-6">
                <h3 className="mb-3 text-lg font-semibold">Office Hours</h3>
                <p className="text-muted-foreground mb-2">
                  Monday - Friday: 9AM - 5PM (PST)
                </p>
                <p className="text-muted-foreground">
                  We typically respond to inquiries within 24-48 hours during
                  business days.
                </p>
              </div>
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
              question="How can I report a bug in React Router v7?"
              answer="You can report bugs by opening an issue on our GitHub repository. Please include as much detail as possible, including steps to reproduce the bug, expected behavior, and actual behavior."
            />

            <FaqItem
              question="Do you offer technical support for React Router v7?"
              answer="Yes, we offer technical support for all our users. Free support is available through our community forums and GitHub issues. Priority support is available for Pro and Enterprise plan subscribers."
            />

            <FaqItem
              question="Can I request a feature for React Router v7?"
              answer="Absolutely! We welcome feature requests from our community. You can submit a feature request through our GitHub repository or by contacting us directly through this form."
            />

            <FaqItem
              question="How can I contribute to React Router v7?"
              answer="We welcome contributions from the community. You can contribute by submitting pull requests, improving documentation, reporting bugs, or helping other users on our forums. Check our GitHub repository for contribution guidelines."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-primary-foreground px-4 py-20">
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="mb-6 text-3xl font-bold">Ready to get started?</h2>
          <p className="text-primary-foreground/90 mb-8 text-xl">
            Try React Router v7 today and see how it can improve your
            application's routing.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Link to="/dashboard">
              <Button size="lg" variant="secondary" className="gap-2">
                Try the Demo <ArrowRight className="h-4 w-4" />
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

function ContactInfo({
  icon,
  title,
  content,
}: {
  icon: React.ReactNode;
  title: string;
  content: React.ReactNode;
}) {
  return (
    <div className="flex gap-4">
      <div className="mt-1">{icon}</div>
      <div>
        <h3 className="mb-1 font-medium">{title}</h3>
        <div className="text-muted-foreground">{content}</div>
      </div>
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
