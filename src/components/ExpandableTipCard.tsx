import { LucideIcon, ChevronDown, ChevronUp } from "lucide-react";
import { useState, ReactNode } from "react";

interface ExpandableTipCardProps {
  icon?: LucideIcon;
  title: string;
  subtitle?: string;
  rightContent?: ReactNode;
  colorClass?: string;
  glowClass?: string;
  summary: string;
  tips: string[];
  progress?: number;
  children?: ReactNode;
}

const ExpandableTipCard = ({
  icon: Icon,
  title,
  subtitle,
  rightContent,
  colorClass = "text-foreground",
  glowClass = "",
  summary,
  tips,
  progress,
  children,
}: ExpandableTipCardProps) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className={`glass-card rounded-2xl p-4 ${glowClass} cursor-pointer transition-all duration-300`}
      onClick={() => setExpanded(!expanded)}
    >
      <div className="flex items-center gap-2">
        {Icon && <Icon className={`w-4 h-4 ${colorClass} flex-shrink-0`} />}
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-medium ${colorClass}`}>{title}</p>
          {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
        </div>
        {rightContent}
        {expanded ? (
          <ChevronUp className="w-3.5 h-3.5 text-muted-foreground" />
        ) : (
          <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
        )}
      </div>

      {expanded && (
        <div className="mt-3 pt-3 border-t border-border/50 space-y-2">
          {progress !== undefined && (
            <div className="w-full bg-muted/50 rounded-full h-2 mb-2">
              <div
                className={`h-2 rounded-full bg-current ${colorClass}`}
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
          )}
          <p className="text-xs font-semibold">{summary}</p>
          {children}
          {tips.map((tip, i) => (
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

export default ExpandableTipCard;
