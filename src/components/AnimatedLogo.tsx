import logo from "@/assets/logo.png";

interface AnimatedLogoProps {
  size?: number;
  className?: string;
}

const AnimatedLogo = ({ size = 160, className = "" }: AnimatedLogoProps) => {
  return (
    <div
      className={`relative ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Glow halo */}
      <div
        className="absolute inset-0 rounded-full blur-2xl opacity-60 animate-pulse-glow"
        style={{
          background:
            "radial-gradient(circle, hsl(195 85% 55% / 0.6) 0%, transparent 70%)",
        }}
      />
      {/* Spinning arrow ring */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          animation: "logo-spin 3.5s linear infinite",
          background:
            "conic-gradient(from 0deg, transparent 0deg, hsl(195 85% 55% / 0.5) 90deg, transparent 180deg, hsl(270 70% 60% / 0.5) 270deg, transparent 360deg)",
          mask: "radial-gradient(circle, transparent 60%, black 62%, black 100%)",
          WebkitMask:
            "radial-gradient(circle, transparent 60%, black 62%, black 100%)",
        }}
      />
      {/* Logo */}
      <img
        src={logo}
        alt="Logo"
        className="relative w-full h-full object-contain animate-pulse-glow"
        style={{ filter: "drop-shadow(0 0 12px hsl(195 85% 55% / 0.6))" }}
      />
    </div>
  );
};

export default AnimatedLogo;
