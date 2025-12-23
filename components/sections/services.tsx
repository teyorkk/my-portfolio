import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import servicesData from "@/app/data/services.json";
import {
  Code,
  Globe,
  Laptop,
  Layout,
  Smartphone,
  Database,
} from "lucide-react";

const iconMap: Record<string, React.ElementType> = {
  Globe,
  Smartphone,
  Layout,
  Code,
  Database,
  Laptop,
};

export function Services() {
  const services = servicesData.map((s) => ({
    ...s,
    icon: iconMap[s.icon],
  }));
  return (
    <section
      id="services"
      className="py-20 bg-background scroll-mt-28 md:scroll-mt-32"
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-primary">
            Services
          </h2>
          <p className="mx-auto max-w-[700px] text-muted-foreground md:text-lg">
            I provide a wide range of services to help you achieve your goals.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <Card
              key={index}
              className="h-full bg-card hover:border-primary/50 transition-colors"
            >
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <service.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>{service.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{service.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
