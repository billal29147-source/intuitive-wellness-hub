import { useEffect, useState } from "react";

interface LoadingScreenProps {
  onComplete: () => void;
  message?: string;
  duration?: number;
}

const LoadingScreen = ({
  onComplete,
  message = "Loading your dashboard",
  duration = 1800,
}: LoadingScreenProps) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const start = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      const pct = Math.min(100, (elapsed / duration) * 100);
      setProgress(pct);
      if (pct >= 100) {
        clearInterval(interval);
        setTimeout(onComplete, 200);
      }
    }, 30);
    return () => clearInterval(interval);
  }, [duration, onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background animate-slide-up">
      {/* Arrow loader */}
      <div className="relative w-32 h-32 flex items-center justify-center">
        {/* Soft glow */}
        <div
          className="absolute inset-0 rounded-full blur-3xl opacity-40"
          style={{
            background:
              "radial-gradient(circle, hsl(195 85% 55% / 0.7) 0%, transparent 70%)",
          }}
        />
        {/* Outer faint ring */}
        <div className="absolute inset-0 rounded-full border-2 border-muted/40" />

        {/* Spinning gradient arc */}
        <svg
          viewBox="0 0 100 100"
          className="absolute inset-0 w-full h-full"
          style={{ animation: "logo-spin 1.4s linear infinite" }}
        >
          <defs>
            <linearGradient id="arcGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsl(195 85% 55%)" stopOpacity="0" />
              <stop offset="100%" stopColor="hsl(195 85% 55%)" stopOpacity="1" />
            </linearGradient>
            <marker
              id="arrowHead"
              viewBox="0 0 10 10"
              refX="5"
              refY="5"
              markerWidth="5"
              markerHeight="5"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="hsl(195 85% 55%)" />
            </marker>
          </defs>
          <path
            d="M 50 8 A 42 42 0 1 1 8 50"
            fill="none"
            stroke="url(#arcGrad)"
            strokeWidth="5"
            strokeLinecap="round"
            markerEnd="url(#arrowHead)"
          />
        </svg>

        {/* Reverse-spinning secondary arc */}
        <svg
          viewBox="0 0 100 100"
          className="absolute inset-3 w-[calc(100%-1.5rem)] h-[calc(100%-1.5rem)]"
          style={{ animation: "logo-spin 2.2s linear infinite reverse" }}
        >
          <defs>
            <linearGradient id="arcGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsl(270 70% 60%)" stopOpacity="0" />
              <stop offset="100%" stopColor="hsl(270 70% 60%)" stopOpacity="1" />
            </linearGradient>
            <marker
              id="arrowHead2"
              viewBox="0 0 10 10"
              refX="5"
              refY="5"
              markerWidth="5"
              markerHeight="5"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="hsl(270 70% 60%)" />
            </marker>
          </defs>
          <path
            d="M 50 92 A 42 42 0 1 1 92 50"
            fill="none"
            stroke="url(#arcGrad2)"
            strokeWidth="4"
            strokeLinecap="round"
            markerEnd="url(#arrowHead2)"
          />
        </svg>

        {/* Center percentage */}
        <div className="relative z-10 flex flex-col items-center">
          <span className="text-2xl font-bold text-foreground tabular-nums">
            {Math.round(progress)}%
          </span>
        </div>
      </div>

      <p className="mt-8 text-sm text-muted-foreground tracking-wide">
        {message}
      </p>

      {/* Progress bar */}
      <div className="mt-4 w-56 h-1 rounded-full bg-muted overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-200 ease-out"
          style={{
            width: `${progress}%`,
            background:
              "linear-gradient(90deg, hsl(195 85% 55%), hsl(270 70% 60%))",
          }}
        />
      </div>
    </div>
  );
};

export default LoadingScreen;
