import { useEffect, useState } from "react";
import AnimatedLogo from "./AnimatedLogo";

interface LoadingScreenProps {
  onComplete: () => void;
  message?: string;
  duration?: number;
}

const LoadingScreen = ({
  onComplete,
  message = "Preparing your experience",
  duration = 2200,
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
        setTimeout(onComplete, 250);
      }
    }, 30);
    return () => clearInterval(interval);
  }, [duration, onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background animate-slide-up">
      <AnimatedLogo size={180} />
      <div className="mt-10 w-56 h-1.5 rounded-full bg-muted overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-200 ease-out"
          style={{
            width: `${progress}%`,
            background:
              "linear-gradient(90deg, hsl(195 85% 55%), hsl(270 70% 60%))",
          }}
        />
      </div>
      <p className="mt-4 text-sm text-muted-foreground tracking-wide">
        {message}
      </p>
    </div>
  );
};

export default LoadingScreen;
