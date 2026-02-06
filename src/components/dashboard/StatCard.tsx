import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: 'default' | 'primary' | 'success' | 'warning';
  className?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  variant = 'default',
  className,
}) => {
  const variantStyles = {
    default: 'bg-card',
    primary: 'gradient-primary text-primary-foreground',
    success: 'gradient-success text-success-foreground',
    warning: 'bg-warning/10 border-warning/20',
  };

  const iconBgStyles = {
    default: 'bg-primary/10 text-primary',
    primary: 'bg-white/20 text-primary-foreground',
    success: 'bg-white/20 text-success-foreground',
    warning: 'bg-warning/20 text-warning',
  };

  return (
    <div
      className={cn(
        'stat-card relative overflow-hidden transition-all duration-300 hover:scale-[1.02]',
        variantStyles[variant],
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className={cn(
            'text-sm font-medium',
            variant === 'default' ? 'text-muted-foreground' : 'opacity-90'
          )}>
            {title}
          </p>
          <p className="text-2xl font-bold tracking-tight lg:text-3xl">
            {value}
          </p>
          {subtitle && (
            <p className={cn(
              'text-xs',
              variant === 'default' ? 'text-muted-foreground' : 'opacity-80'
            )}>
              {subtitle}
            </p>
          )}
          {trend && (
            <div className="flex items-center gap-1 pt-1">
              <span className={cn(
                'text-xs font-medium',
                trend.isPositive ? 'text-success' : 'text-destructive'
              )}>
                {trend.isPositive ? '+' : ''}{trend.value}%
              </span>
              <span className={cn(
                'text-xs',
                variant === 'default' ? 'text-muted-foreground' : 'opacity-70'
              )}>
                vs last semester
              </span>
            </div>
          )}
        </div>
        <div className={cn(
          'flex h-10 w-10 items-center justify-center rounded-lg lg:h-12 lg:w-12',
          iconBgStyles[variant]
        )}>
          <Icon className="h-5 w-5 lg:h-6 lg:w-6" />
        </div>
      </div>
    </div>
  );
};

export default StatCard;
