import {
  ArrowRight,
  Building2,
  Calendar,
  Github,
  Linkedin,
  Users,
} from "lucide-react";
import { Link } from "react-router";
import { Button } from "~/components/ui/button";
import { LandingLayout } from "~/layouts";

export function meta() {
  return [
    { title: "About Us - React Router v7 Demo" },
    {
      name: "description",
      content: "Learn about the team behind React Router v7 Demo",
    },
  ];
}

export default function AboutPage() {
  return (
    <LandingLayout>
      {/* Hero Section */}
      <section className="from-muted/50 to-background bg-gradient-to-b px-4 py-20">
        <div className="container mx-auto">
          <div className="max-w-3xl">
            <h1 className="mb-6 text-4xl font-bold md:text-5xl">About Us</h1>
            <p className="text-muted-foreground mb-8 text-xl">
              We're a team of passionate developers building tools to make web
              development easier, faster, and more enjoyable.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="px-4 py-16">
        <div className="container mx-auto">
          <div className="grid items-center gap-12 md:grid-cols-2">
            <div>
              <h2 className="mb-6 text-3xl font-bold">Our Mission</h2>
              <p className="text-muted-foreground mb-4">
                We believe that routing shouldn't be complicated. Our mission is
                to provide the most intuitive and powerful routing solution for
                React applications, helping developers build better user
                experiences with less effort.
              </p>
              <p className="text-muted-foreground mb-4">
                React Router v7 is designed to be approachable for beginners yet
                powerful enough for the most demanding applications. We're
                committed to maintaining a balance between simplicity and
                flexibility, ensuring that developers of all skill levels can
                leverage the full power of routing in their applications.
              </p>
              <p className="text-muted-foreground">
                With a focus on performance, developer experience, and best
                practices, we're constantly pushing the boundaries of what's
                possible with client-side routing.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-muted rounded-lg p-6">
                <Users className="text-primary mb-4 h-10 w-10" />
                <h3 className="mb-2 text-xl font-semibold">For Developers</h3>
                <p className="text-muted-foreground">
                  Building tools that make developers more productive and help
                  them create better applications.
                </p>
              </div>
              <div className="bg-muted rounded-lg p-6">
                <Building2 className="text-primary mb-4 h-10 w-10" />
                <h3 className="mb-2 text-xl font-semibold">Open Source</h3>
                <p className="text-muted-foreground">
                  Committed to the open source community and collaborating with
                  developers worldwide.
                </p>
              </div>
              <div className="bg-muted col-span-2 rounded-lg p-6">
                <Calendar className="text-primary mb-4 h-10 w-10" />
                <h3 className="mb-2 text-xl font-semibold">
                  Continuous Improvement
                </h3>
                <p className="text-muted-foreground">
                  Always learning, iterating, and improving our tools based on
                  user feedback and emerging best practices.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="bg-muted/30 px-4 py-16">
        <div className="container mx-auto">
          <h2 className="mb-12 text-center text-3xl font-bold">
            Meet Our Team
          </h2>

          <div className="grid gap-8 md:grid-cols-3">
            <TeamMember
              name="Gustavo C. Bellanda"
              role="AI Engineer"
              bio="Passionate about AI and its applications in various fields."
              image="/images/bellanda.jpg"
              github="https://github.com/bellanda"
              linkedin="https://www.linkedin.com/in/gustavo-casadei-bellanda-410a351bb/"
            />

            <TeamMember
              name=""
              role=""
              bio=""
              image=""
              github="#"
              linkedin="#"
            />
            <TeamMember
              name=""
              role=""
              bio=""
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
          <h2 className="mb-12 text-center text-3xl font-bold">Our Values</h2>

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
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="mb-6 text-3xl font-bold">Join Our Community</h2>
          <p className="mb-8 text-xl">
            Become part of our growing community of developers building amazing
            applications with React Router v7.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Link to="/auth/register">
              <Button size="lg" className="gap-2">
                Sign Up Now <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/contact">
              <Button
                size="lg"
                variant="outline"
                className="border-primary-foreground/20 hover:bg-primary-foreground/10 bg-transparent"
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
  linkedin,
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
    <div className="bg-card overflow-hidden rounded-lg border">
      <img src={image} alt={name} className="h-64 w-full object-cover" />
      <div className="p-6">
        <h3 className="mb-1 text-xl font-semibold">{name}</h3>
        <p className="text-primary mb-3 font-medium">{role}</p>
        <p className="text-muted-foreground mb-4">{bio}</p>
        <div className="flex gap-3">
          {github && (
            <a
              href={github}
              className="text-muted-foreground hover:text-foreground"
              target="_blank"
            >
              <Github className="h-5 w-5" />
            </a>
          )}
          {linkedin && (
            <a
              href={linkedin}
              className="text-muted-foreground hover:text-foreground"
              target="_blank"
            >
              <Linkedin className="h-5 w-5" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

function ValueItem({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-6">
      <div className="bg-primary h-16 w-1 rounded-full"></div>
      <div>
        <h3 className="mb-3 text-xl font-semibold">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
