import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface AdTypeCardProps {
  title: string;
  description: string;
  href: string;
  specs: string[];
  icon: React.ReactNode;
  className?: string;
}

export function AdTypeCard({
  title,
  description,
  href,
  specs,
  icon,
  className,
}: AdTypeCardProps) {
  return (
    <Link href={href} className="block focus:outline-none">
      <Card
        className={cn(
          "cursor-pointer transition-all duration-200 hover:shadow-md hover:border-primary/50 hover:-translate-y-0.5",
          className
        )}
      >
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary text-xl">
              {icon}
            </div>
            <CardTitle className="text-lg">{title}</CardTitle>
          </div>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-1.5">
            {specs.map((spec) => (
              <Badge key={spec} variant="secondary" className="text-xs font-normal">
                {spec}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
