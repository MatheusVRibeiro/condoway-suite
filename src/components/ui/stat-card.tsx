import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  className?: string;
}

const variantClasses = {
  default: 'text-primary',
  success: 'text-condoway-success',
  warning: 'text-condoway-warning',
  error: 'text-condoway-error',
  info: 'text-condoway-info'
};

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  description,
  icon: Icon,
  trend,
  variant = 'default',
  className
}) => {
  return (
    <Card className={cn("shadow-condoway-md hover:shadow-condoway-lg transition-shadow", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-condoway-text-secondary">
          {title}
        </CardTitle>
        <Icon className={cn("h-4 w-4", variantClasses[variant])} />
      </CardHeader>
      <CardContent>
        <div className={cn("text-2xl font-bold", variantClasses[variant])}>
          {value}
        </div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">
            {description}
          </p>
        )}
        {trend && (
          <p className={cn(
            "text-xs mt-1 flex items-center gap-1",
            trend.isPositive ? "text-condoway-success" : "text-condoway-error"
          )}>
            <span>{trend.isPositive ? "↗" : "↘"}</span>
            {trend.value}
          </p>
        )}
      </CardContent>
    </Card>
  );
};