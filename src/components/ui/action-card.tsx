import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ActionCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  onClick?: () => void;
  variant?: 'default' | 'success' | 'warning' | 'info';
  className?: string;
}

const variantClasses = {
  default: {
    iconBg: 'bg-primary/10 group-hover:bg-primary/20',
    iconColor: 'text-primary'
  },
  success: {
    iconBg: 'bg-condoway-success/10 group-hover:bg-condoway-success/20',
    iconColor: 'text-condoway-success'
  },
  warning: {
    iconBg: 'bg-condoway-warning/10 group-hover:bg-condoway-warning/20',
    iconColor: 'text-condoway-warning'
  },
  info: {
    iconBg: 'bg-condoway-info/10 group-hover:bg-condoway-info/20',
    iconColor: 'text-condoway-info'
  }
};

export const ActionCard: React.FC<ActionCardProps> = ({
  title,
  description,
  icon: Icon,
  onClick,
  variant = 'default',
  className
}) => {
  const variantClass = variantClasses[variant];
  
  return (
    <Card 
      className={cn(
        "shadow-condoway-md hover:shadow-condoway-lg transition-all duration-200 cursor-pointer group",
        onClick && "hover:scale-[1.02]",
        className
      )}
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <div className={cn(
            "p-3 rounded-lg transition-colors",
            variantClass.iconBg
          )}>
            <Icon className={cn("w-6 h-6", variantClass.iconColor)} />
          </div>
          <div className="flex-1">
            <CardTitle className="text-lg text-condoway-text-primary group-hover:text-primary transition-colors">
              {title}
            </CardTitle>
            <CardDescription className="text-condoway-text-secondary">
              {description}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
};