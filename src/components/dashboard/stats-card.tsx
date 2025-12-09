import { Card } from "@/components/ui/card";
import { LucideIcon, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    label: string;
  };
  variant?: "default" | "success" | "warning" | "destructive";
}

export function StatsCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  variant = "default",
}: StatsCardProps) {
  const variantStyles = {
    default: {
      bg: "bg-blue-50",
      iconBg: "bg-blue-100",
      iconColor: "text-primary",
      textColor: "text-primary",
    },
    success: {
      bg: "bg-green-50",
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
      textColor: "text-green-700",
    },
    warning: {
      bg: "bg-orange-50",
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600",
      textColor: "text-orange-700",
    },
    destructive: {
      bg: "bg-purple-50",
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
      textColor: "text-purple-700",
    },
  };

  const styles = variantStyles[variant];

  return (
    <Card className={cn("card-hover cursor-default h-full border-0", styles.bg)}>
      <div className="p-6">
        <div className="flex items-start gap-4">
          {/* Icon */}
          <div className={cn("rounded-full p-3 transition-transform duration-200 hover:scale-110", styles.iconBg)}>
            <Icon className={cn("h-6 w-6", styles.iconColor)} />
          </div>

          {/* Content */}
          <div className="flex-1 space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              {title}
            </p>
            <p className="text-3xl font-bold text-gray-900">
              {value}
            </p>
            {description && (
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <TrendingUp className="h-3 w-3" />
                <span>{description}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
