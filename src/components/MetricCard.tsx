import { LucideIcon, Info, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

interface MetricCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  subtitle?: string;
  colorClass: string;
  glowClass: string;
  onInfo?: () => void;
  goalTip?: {
    summary: string;
    tips: string[];
    progress?: number;
  };
}

const MetricCard = ({ icon: Icon, label, value, subtitle, colorClass, glowClass, onInfo, goalTip }: MetricCardProps) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className={`glass-card rounded-2xl p-4 ${glowClass} animate-slide-up cursor-pointer transition-all duration-300 ${expanded ? "col-span-2" : ""}`}
      onClick={() => goalTip && setExpanded(!expanded)}
    >
      <div className="flex items-center gap-2 mb-2">
        <Icon className={`w-4 h-4 ${colorClass}`} />
        <span className="text-xs text-muted-foreground uppercase tracking-wider flex-1">{label}</span>
        {goalTip && (
          expanded ? <ChevronUp className="w-3 h-3 text-muted-foreground" /> : <ChevronDown className="w-3 h-3 text-muted-foreground" />
        )}
        {onInfo && (
          <button onClick={(e) => { e.stopPropagation(); onInfo(); }} className="opacity-50 hover:opacity-100 transition-opacity">
            <Info className="w-3 h-3 text-muted-foreground" />
          </button>
        )}
      </div>
      <p className={`text-2xl font-bold ${colorClass}`}>{value}</p>
      {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}

      {expanded && goalTip && (
        <div className="mt-3 pt-3 border-t border-border/50 space-y-2">
          {goalTip.progress !== undefined && (
            <div className="w-full bg-muted/50 rounded-full h-2 mb-2">
              <div className={`h-2 rounded-full bg-current ${colorClass}`} style={{ width: `${Math.min(goalTip.progress, 100)}%` }} />
            </div>
          )}
          <p className="text-xs font-semibold">{goalTip.summary}</p>
          {goalTip.tips.map((tip, i) => (
            <div key={i} className="flex items-start gap-2">
              <span className="text-[10px] mt-0.5">💡</span>
              <p className="text-[11px] text-muted-foreground leading-relaxed">{tip}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MetricCard;
