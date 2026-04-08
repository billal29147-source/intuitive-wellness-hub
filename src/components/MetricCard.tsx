import { LucideIcon, Info } from "lucide-react";

interface MetricCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  subtitle?: string;
  colorClass: string;
  glowClass: string;
  onInfo?: () => void;
}

const MetricCard = ({ icon: Icon, label, value, subtitle, colorClass, glowClass, onInfo }: MetricCardProps) => {
  return (
    <div className={`glass-card rounded-2xl p-4 ${glowClass} animate-slide-up`}>
      <div className="flex items-center gap-2 mb-2">
        <Icon className={`w-4 h-4 ${colorClass}`} />
        <span className="text-xs text-muted-foreground uppercase tracking-wider flex-1">{label}</span>
        {onInfo && (
          <button onClick={onInfo} className="opacity-50 hover:opacity-100 transition-opacity">
            <Info className="w-3 h-3 text-muted-foreground" />
          </button>
        )}
      </div>
      <p className={`text-2xl font-bold ${colorClass}`}>{value}</p>
      {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
    </div>
  );
};

export default MetricCard;
