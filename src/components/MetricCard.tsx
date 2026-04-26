import { LucideIcon, Info, ChevronDown, ChevronUp, Pencil, Check } from "lucide-react";
import { useState, useRef } from "react";

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
    severity?: "ok" | "warn" | "critical";
    action?: string;
  };
  editable?: {
    fields: { key: string; label: string; value: number; unit: string; min?: number; max?: number; step?: number }[];
    onSave: (key: string, value: number) => void;
  };
  statusLabel?: string;
  statusColor?: string;
}

const MetricCard = ({ icon: Icon, label, value, subtitle, colorClass, glowClass, onInfo, goalTip, editable, statusLabel, statusColor }: MetricCardProps) => {
  const [expanded, setExpanded] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editValues, setEditValues] = useState<Record<string, number>>({});
  const inputRef = useRef<HTMLInputElement>(null);

  const startEditing = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (editable) {
      const vals: Record<string, number> = {};
      editable.fields.forEach(f => { vals[f.key] = f.value; });
      setEditValues(vals);
      setEditing(true);
      setExpanded(true);
    }
  };

  const saveEdits = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (editable) {
      Object.entries(editValues).forEach(([key, val]) => {
        editable.onSave(key, val);
      });
      setEditing(false);
    }
  };

  const sev = goalTip?.severity ?? "ok";
  const critical = sev === "critical";
  const warn = sev === "warn";
  const effColor = critical ? "text-destructive" : warn ? "text-health-calories" : colorClass;
  const effGlow = critical ? "ring-1 ring-destructive/60 shadow-[0_0_20px_-5px_hsl(var(--destructive)/0.6)] animate-pulse-slow" : glowClass;

  return (
    <div
      className={`glass-card rounded-2xl p-4 ${effGlow} animate-slide-up cursor-pointer transition-all duration-300 ${expanded ? "col-span-2" : ""}`}
      onClick={() => !editing && goalTip && setExpanded(!expanded)}
    >
      <div className="flex items-center gap-2 mb-2">
        <Icon className={`w-4 h-4 ${effColor}`} />
        <span className="text-xs text-muted-foreground uppercase tracking-wider flex-1">{label}</span>
        {critical && <span className="text-[9px] font-bold text-destructive uppercase">⚠ Critical</span>}
        {warn && !critical && <span className="text-[9px] font-bold text-health-calories uppercase">! Watch</span>}
        {editable && !editing && (
          <button onClick={startEditing} className="opacity-50 hover:opacity-100 transition-opacity">
            <Pencil className="w-3 h-3 text-muted-foreground" />
          </button>
        )}
        {editing && (
          <button onClick={saveEdits} className="opacity-80 hover:opacity-100 transition-opacity">
            <Check className="w-3.5 h-3.5 text-health-progress" />
          </button>
        )}
        {goalTip && !editing && (
          expanded ? <ChevronUp className="w-3 h-3 text-muted-foreground" /> : <ChevronDown className="w-3 h-3 text-muted-foreground" />
        )}
        {onInfo && (
          <button onClick={(e) => { e.stopPropagation(); onInfo(); }} className="opacity-50 hover:opacity-100 transition-opacity">
            <Info className="w-3 h-3 text-muted-foreground" />
          </button>
        )}
      </div>
      <p className={`text-2xl font-bold ${effColor}`}>{value}</p>
      {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
      {statusLabel && (
        <p className={`text-xs font-semibold mt-1 ${critical ? "text-destructive" : statusColor || colorClass}`}>{statusLabel}</p>
      )}

      {/* Edit Mode */}
      {editing && editable && (
        <div className="mt-3 pt-3 border-t border-border/50 space-y-3" onClick={(e) => e.stopPropagation()}>
          {editable.fields.map((field) => (
            <div key={field.key} className="flex items-center gap-2">
              <label className="text-[11px] text-muted-foreground w-16 flex-shrink-0">{field.label}</label>
              <input
                ref={inputRef}
                type="number"
                value={editValues[field.key] ?? field.value}
                min={field.min}
                max={field.max}
                step={field.step || 1}
                onChange={(e) => setEditValues(prev => ({ ...prev, [field.key]: parseFloat(e.target.value) || 0 }))}
                className="flex-1 h-8 rounded-lg border border-border bg-muted/50 px-2 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <span className="text-[10px] text-muted-foreground w-10">{field.unit}</span>
            </div>
          ))}
        </div>
      )}

      {/* Expanded Tips */}
      {expanded && goalTip && !editing && (
        <div className="mt-3 pt-3 border-t border-border/50 space-y-2">
          {goalTip.progress !== undefined && (
            <div className="w-full bg-muted/50 rounded-full h-2 mb-2">
              <div className={`h-2 rounded-full bg-current ${effColor}`} style={{ width: `${Math.min(goalTip.progress, 100)}%` }} />
            </div>
          )}
          <p className={`text-xs font-semibold ${critical ? "text-destructive" : ""}`}>{goalTip.summary}</p>
          {goalTip.action && (
            <div className={`rounded-lg px-2 py-1.5 mt-1 ${critical ? "bg-destructive/15 border border-destructive/40" : warn ? "bg-health-calories/10 border border-health-calories/30" : "bg-primary/10 border border-primary/30"}`}>
              <p className="text-[10px] uppercase tracking-wider font-bold opacity-70 mb-0.5">Do this now</p>
              <p className={`text-[11px] font-medium leading-snug ${critical ? "text-destructive" : warn ? "text-health-calories" : "text-foreground"}`}>{goalTip.action}</p>
            </div>
          )}
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
