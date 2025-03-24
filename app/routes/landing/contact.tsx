import { Link } from "react-router";
import { Mail, MapPin, Phone, ArrowRight } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { Label } from "~/components/ui/label";
import { LandingLayout } from "~/components/layout";

export function meta() {
  return [
    { title: "Contact Us - React Router v7 Demo" },
    { name: "description", content: "Get in touch with the React Router v7 team" }
  ];
}

export default function ContactPage() {
  return (
    <LandingLayout>
      {/* Hero Section */}
      <section className="px-4 py-20 bg-gradient-to-b from-muted/50 to-background">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Contact Us</h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Have a question or feedback? We'd love to hear from you. Fill out the form below and we'll get back to you as soon as
            possible.
          </p>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="px-4 py-16">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl font-bold mb-6">Get in Touch</h2>
              <form className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="first-name">First name</Label>
                    <Input id="first-name" placeholder="Enter your first name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="last-name">Last name</Label>
                    <Input id="last-name" placeholder="Enter your last name" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="Enter your email address" />
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium">What are you contacting us about?</p>
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
                  <Textarea id="message" placeholder="Enter your message" className="min-h-32" />
                </div>

                <Button type="submit" className="w-full sm:w-auto">
                  Send Message
                </Button>
              </form>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
              <div className="space-y-6">
                <ContactInfo
                  icon={<Mail className="h-6 w-6 text-primary" />}
                  title="Email"
                  content={
                    <a href="mailto:info@reactrouterv7.com" className="text-primary hover:underline">
                      info@reactrouterv7.com
                    </a>
                  }
                />

                <ContactInfo
                  icon={<Phone className="h-6 w-6 text-primary" />}
                  title="Phone"
                  content={
                    <a href="tel:+1234567890" className="text-primary hover:underline">
                      +1 (234) 567-890
                    </a>
                  }
                />

                <ContactInfo
                  icon={<MapPin className="h-6 w-6 text-primary" />}
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

              <div className="mt-8 p-6 bg-muted rounded-lg">
                <h3 className="text-lg font-semibold mb-3">Office Hours</h3>
                <p className="text-muted-foreground mb-2">Monday - Friday: 9AM - 5PM (PST)</p>
                <p className="text-muted-foreground">We typically respond to inquiries within 24-48 hours during business days.</p>
              </div>
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
      <section className="px-4 py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto text-center max-w-3xl">
          <h2 className="text-3xl font-bold mb-6">Ready to get started?</h2>
          <p className="text-xl text-primary-foreground/90 mb-8">
            Try React Router v7 today and see how it can improve your application's routing.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/dashboard">
              <Button size="lg" variant="secondary" className="gap-2">
                Try the Demo <ArrowRight className="h-4 w-4" />
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

function ContactInfo({ icon, title, content }: { icon: React.ReactNode; title: string; content: React.ReactNode }) {
  return (
    <div className="flex gap-4">
      <div className="mt-1">{icon}</div>
      <div>
        <h3 className="font-medium mb-1">{title}</h3>
        <div className="text-muted-foreground">{content}</div>
      </div>
    </div>
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
