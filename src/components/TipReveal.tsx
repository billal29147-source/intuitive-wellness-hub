import { useState, ReactNode } from "react";
import { Lightbulb, X } from "lucide-react";

interface TipRevealProps {
  children: ReactNode;
  tips: string[];
  summary?: string;
  colorClass?: string;
}

/**
 * Wraps a section so tapping it reveals an inline tip overlay (not a full dropdown).
 * The section content stays visible; tips appear as a small bubble below.
 */
const TipReveal = ({ children, tips, summary, colorClass = "text-health-progress" }: TipRevealProps) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <div onClick={() => setOpen(!open)} className="cursor-pointer">
        {children}
      </div>

      {/* Tap hint badge */}
      {!open && (
        <div className="absolute top-3 right-3 pointer-events-none">
          <Lightbulb className={`w-3.5 h-3.5 ${colorClass} opacity-60`} />
        </div>
      )}

      {/* Inline tip bubble */}
      {open && (
        <div className="mt-2 glass-card rounded-xl p-3 border border-primary/20 animate-slide-up">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex items-center gap-1.5">
              <Lightbulb className={`w-3.5 h-3.5 ${colorClass}`} />
              <p className={`text-[11px] font-semibold uppercase tracking-wider ${colorClass}`}>Tips</p>
            </div>
            <button onClick={() => setOpen(false)} className="opacity-60 hover:opacity-100">
              <X className="w-3 h-3" />
            </button>
          </div>
          {summary && <p className="text-[11px] font-medium mb-2">{summary}</p>}
          <ul className="space-y-1.5">
            {tips.map((tip, i) => (
              <li key={i} className="flex items-start gap-1.5">
                <span className="text-[10px] mt-0.5">💡</span>
                <p className="text-[11px] text-muted-foreground leading-relaxed">{tip}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default TipReveal;
