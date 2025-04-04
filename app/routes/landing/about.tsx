import { ArrowRight, Building2, Calendar, Github, Linkedin, Users } from "lucide-react";
import { Link } from "react-router";
import { LandingLayout } from "~/components/layout";
import { Button } from "~/components/ui/button";

export function meta() {
  return [
    { title: "About Us - React Router v7 Demo" },
    { name: "description", content: "Learn about the team behind React Router v7 Demo" }
  ];
}

export default function AboutPage() {
  return (
    <LandingLayout>
      {/* Hero Section */}
      <section className="px-4 py-20 bg-gradient-to-b from-muted/50 to-background">
        <div className="container mx-auto">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">About Us</h1>
            <p className="text-xl text-muted-foreground mb-8">
              We're a team of passionate developers building tools to make web development easier, faster, and more enjoyable.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="px-4 py-16">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
              <p className="text-muted-foreground mb-4">
                We believe that routing shouldn't be complicated. Our mission is to provide the most intuitive and powerful routing
                solution for React applications, helping developers build better user experiences with less effort.
              </p>
              <p className="text-muted-foreground mb-4">
                React Router v7 is designed to be approachable for beginners yet powerful enough for the most demanding
                applications. We're committed to maintaining a balance between simplicity and flexibility, ensuring that developers
                of all skill levels can leverage the full power of routing in their applications.
              </p>
              <p className="text-muted-foreground">
                With a focus on performance, developer experience, and best practices, we're constantly pushing the boundaries of
                what's possible with client-side routing.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-muted p-6 rounded-lg">
                <Users className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">For Developers</h3>
                <p className="text-muted-foreground">
                  Building tools that make developers more productive and help them create better applications.
                </p>
              </div>
              <div className="bg-muted p-6 rounded-lg">
                <Building2 className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Open Source</h3>
                <p className="text-muted-foreground">
                  Committed to the open source community and collaborating with developers worldwide.
                </p>
              </div>
              <div className="bg-muted p-6 rounded-lg col-span-2">
                <Calendar className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Continuous Improvement</h3>
                <p className="text-muted-foreground">
                  Always learning, iterating, and improving our tools based on user feedback and emerging best practices.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="px-4 py-16 bg-muted/30">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">Meet Our Team</h2>

          <div className="grid md:grid-cols-3 gap-8">
            <TeamMember
              name="Gustavo C. Bellanda"
              role="AI Engineer"
              bio="Passionate about AI and its applications in various fields."
              image="/public/images/bellanda.jpg"
              github="https://github.com/bellanda"
              linkedin="https://www.linkedin.com/in/gustavo-casadei-bellanda-410a351bb/"
            />

            <TeamMember
              name="Samantha Lee"
              role="Senior Frontend Engineer"
              bio="Samantha specializes in UI/UX and has contributed to numerous open source projects in the React ecosystem."
              image=""
              github="#"
              linkedin="#"
            />

            <TeamMember
              name="Marcus Chen"
              role="Developer Advocate"
              bio="Marcus loves teaching and helping developers understand complex concepts through clear documentation and examples."
              image=""
              github="#"
              linkedin="#"
            />
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="px-4 py-16">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold mb-12 text-center">Our Values</h2>

          <div className="space-y-12">
            <ValueItem
              title="Simplicity"
              description="We believe that the best tools are those that get out of your way. We strive to make React Router intuitive and easy to use, allowing you to focus on building your application rather than fighting with your router."
            />

            <ValueItem
              title="Performance"
              description="Every millisecond counts when it comes to user experience. We're relentlessly focused on making React Router as fast and efficient as possible, ensuring your application remains snappy and responsive."
            />

            <ValueItem
              title="Community"
              description="We're committed to fostering an inclusive and supportive community around React Router. We value feedback, contributions, and collaboration from developers of all backgrounds and experience levels."
            />

            <ValueItem
              title="Education"
              description="We believe in the power of knowledge sharing. We're dedicated to creating comprehensive documentation, tutorials, and examples to help developers master routing in React applications."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-20">
        <div className="container mx-auto text-center max-w-3xl">
          <h2 className="text-3xl font-bold mb-6">Join Our Community</h2>
          <p className="text-xl mb-8">
            Become part of our growing community of developers building amazing applications with React Router v7.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/auth/register">
              <Button size="lg" className="gap-2">
                Sign Up Now <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/contact">
              <Button
                size="lg"
                variant="outline"
                className="bg-transparent border-primary-foreground/20 hover:bg-primary-foreground/10"
              >
                Get in Touch
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </LandingLayout>
  );
}

function TeamMember({
  name,
  role,
  bio,
  image,
  github,
  twitter,
  linkedin
}: {
  name: string;
  role: string;
  bio: string;
  image: string;
  github?: string;
  twitter?: string;
  linkedin?: string;
}) {
  return (
    <div className="bg-card border rounded-lg overflow-hidden">
      <img src={image} alt={name} className="w-full h-64 object-cover" />
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-1">{name}</h3>
        <p className="text-primary font-medium mb-3">{role}</p>
        <p className="text-muted-foreground mb-4">{bio}</p>
        <div className="flex gap-3">
          {github && (
            <a href={github} className="text-muted-foreground hover:text-foreground" target="_blank">
              <Github className="h-5 w-5" />
            </a>
          )}
          {linkedin && (
            <a href={linkedin} className="text-muted-foreground hover:text-foreground" target="_blank">
              <Linkedin className="h-5 w-5" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

function ValueItem({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex gap-6">
      <div className="h-16 w-1 bg-primary rounded-full"></div>
      <div>
        <h3 className="text-xl font-semibold mb-3">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
