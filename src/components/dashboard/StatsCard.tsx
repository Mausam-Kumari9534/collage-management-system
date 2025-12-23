import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  color?: 'cyan' | 'magenta' | 'purple' | 'green';
}

export const StatsCard = ({ title, value, icon: Icon, trend, color = 'cyan' }: StatsCardProps) => {
  const colorClasses = {
    cyan: 'text-primary border-primary/30 bg-primary/10',
    magenta: 'text-accent border-accent/30 bg-accent/10',
    purple: 'text-secondary border-secondary/30 bg-secondary/10',
    green: 'text-neon-green border-neon-green/30 bg-neon-green/10',
  };

  const glowClasses = {
    cyan: 'glow-cyan',
    magenta: 'glow-magenta',
    purple: 'glow-purple',
    green: '',
  };

  return (
    <div className={`cyber-card hover:${glowClasses[color]} animate-slide-up`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-muted-foreground text-sm font-medium">{title}</p>
          <p className="text-3xl font-display font-bold text-foreground mt-2">{value}</p>
          {trend && (
            <p className={`text-sm mt-1 ${colorClasses[color].split(' ')[0]}`}>{trend}</p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};
