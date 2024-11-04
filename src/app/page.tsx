import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BarChart2,
  Users,
  Calendar,
  Zap,
  Globe,
  Shield,
  ArrowRight,
  CheckCircle,
} from "lucide-react";

const FeatureCard: React.FC<{
  icon: React.ComponentType;
  title: string;
  description: string;
}> = ({ icon: Icon, title, description }) => (
  <Card className="group hover:border-primary transition-colors">
    <CardHeader>
      {/* Render the Icon component */}
      <Icon />
      <h3>{title}</h3>
      <p>{description}</p>
    </CardHeader>
  </Card>
);

interface TestimonialCardProps {
  quote: string;
  author: string;
  role: string;
  company: string;
}

const TestimonialCard = ({
  quote,
  author,
  role,
  company,
}: TestimonialCardProps) => (
  <Card className="bg-primary text-primary-foreground">
    <CardContent className="pt-6">
      <div className="mb-4">
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star} className="text-yellow-400">
            ★
          </span>
        ))}
      </div>
      <blockquote className="text-lg mb-4">{quote}</blockquote>
      <footer>
        <strong>{author}</strong>
        <p className="text-sm opacity-80">
          {role}, {company}
        </p>
      </footer>
    </CardContent>
  </Card>
);

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-background to-secondary">
      <header className="px-4 lg:px-6 h-16 flex items-center sticky top-0 z-50 bg-gradient-to-r from-background via-background/60 to-secondary/60 backdrop-blur-lg shadow-md transition-shadow duration-300">
        <Link
          className="flex items-center justify-center hover:scale-105 transition-transform"
          href="#"
        >
          <BarChart2 className="h-6 w-6 text-primary" />
          <span className="ml-2 text-2xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-foreground">
            ProjectPro
          </span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          {["Features", "Testimonials", "Pricing"].map((item) => (
            <Link
              key={item}
              href={`#${item.toLowerCase()}`}
              className="text-sm font-medium hover:text-primary transition-colors hover:underline underline-offset-4"
            >
              {item}
            </Link>
          ))}
          <Button variant="outline" asChild>
            <Link href="/login">Log In</Link>
          </Button>
        </nav>
      </header>

      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 px-4 md:px-6">
          <div className="container mx-auto flex flex-col items-center text-center">
            <Badge className="mb-4" variant="outline">
              Version 2.0 Now Available
            </Badge>
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none mb-4">
              The Future of{" "}
              <span className="text-primary">Project Management</span> is Here
            </h1>
            <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400 mb-8">
              Empower your team with AI-driven insights, real-time
              collaboration, and intuitive workflows. Welcome to ProjectPro -
              where innovation meets efficiency.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" asChild>
                <Link href="/signup">Start Free Trial</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="#demo">Watch Demo</Link>
              </Button>
            </div>
          </div>
        </section>

        <section id="features" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">
              Revolutionize Your Workflow
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <FeatureCard
                icon={Zap}
                title="AI-Powered Insights"
                description="Harness the power of artificial intelligence to predict project outcomes and optimize resource allocation."
              />
              <FeatureCard
                icon={Users}
                title="Seamless Collaboration"
                description="Real-time updates, in-app messaging, and smart notifications keep your team in perfect sync."
              />
              <FeatureCard
                icon={Calendar}
                title="Adaptive Scheduling"
                description="Dynamic Gantt charts and automated timeline adjustments ensure your projects stay on track."
              />
              <FeatureCard
                icon={Globe}
                title="Global Accessibility"
                description="Access your projects from anywhere, on any device, with our cloud-based solution."
              />
              <FeatureCard
                icon={Shield}
                title="Enterprise-Grade Security"
                description="Bank-level encryption and customizable permissions keep your data safe and compliant."
              />
              <FeatureCard
                icon={BarChart2}
                title="Advanced Analytics"
                description="Gain deep insights into your project's performance with customizable dashboards and reports."
              />
            </div>
          </div>
        </section>

        <section
          id="testimonials"
          className="w-full py-12 md:py-24 lg:py-32 bg-secondary"
        >
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">
              Trusted by Industry Leaders
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <TestimonialCard
                quote="ProjectPro has transformed the way we manage our global initiatives. The AI insights have been a game-changer for our decision-making process."
                author="Sarah Chen"
                role="CTO"
                company="TechGiant Inc."
              />
              <TestimonialCard
                quote="The intuitive interface and powerful features of ProjectPro have significantly boosted our team's productivity. It's an indispensable tool for us now."
                author="Marcus Johnson"
                role="Project Manager"
                company="InnovateCorp"
              />
              <TestimonialCard
                quote="As a startup, we needed a scalable solution. ProjectPro not only met our current needs but has grown with us every step of the way."
                author="Aisha Patel"
                role="Founder & CEO"
                company="NextGen Startups"
              />
            </div>
          </div>
        </section>

        <section id="pricing" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">
              Choose Your Plan
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  name: "Starter",
                  price: "$29",
                  period: "per month",
                  features: [
                    "Up to 10 users",
                    "5 projects",
                    "Basic analytics",
                    "24/7 support",
                  ],
                },
                {
                  name: "Pro",
                  price: "$99",
                  period: "per month",
                  features: [
                    "Up to 50 users",
                    "Unlimited projects",
                    "Advanced analytics",
                    "Priority support",
                    "API access",
                  ],
                },
                {
                  name: "Enterprise",
                  price: "Custom",
                  period: "contact us",
                  features: [
                    "Unlimited users",
                    "Unlimited projects",
                    "Custom integrations",
                    "Dedicated account manager",
                    "On-premise deployment option",
                  ],
                },
              ].map((plan) => (
                <Card
                  key={plan.name}
                  className={plan.name === "Pro" ? "border-primary" : ""}
                >
                  <CardHeader>
                    <CardTitle>{plan.name}</CardTitle>
                    <CardDescription>
                      <span className="text-3xl font-bold">{plan.price}</span>{" "}
                      {plan.period}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center">
                          <CheckCircle className="h-5 w-5 text-primary mr-2" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardContent>
                    <Button
                      className="w-full"
                      variant={plan.name === "Pro" ? "default" : "outline"}
                    >
                      Get Started
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                Ready to Transform Your Project Management?
              </h2>
              <p className="mx-auto max-w-[700px] md:text-xl">
                Join thousands of forward-thinking teams who are already
                experiencing the future of project management with ProjectPro.
              </p>
              <Button size="lg" variant="secondary" asChild>
                <Link href="/signup">
                  Start Your Free Trial <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          © {new Date().getFullYear()} ProjectPro. All rights reserved.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Privacy Policy
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Cookie Settings
          </Link>
        </nav>
      </footer>
    </div>
  );
}
