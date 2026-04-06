import { useState, useRef, useCallback } from "react";
import { Home, Dumbbell, UtensilsCrossed, Gamepad2, Settings } from "lucide-react";
import HomePage from "@/pages/HomePage";
import WorkoutPage from "@/pages/WorkoutPage";
import FoodPage from "@/pages/FoodPage";
import GamesPage from "@/pages/GamesPage";
import SettingsMenu from "@/components/SettingsMenu";

const pages = [
  { id: "games", label: "Games", icon: Gamepad2 },
  { id: "home", label: "Home", icon: Home },
  { id: "workout", label: "Workout", icon: Dumbbell },
  { id: "food", label: "Food", icon: UtensilsCrossed },
];

const HOME_INDEX = 1;

const SwipeableApp = () => {
  const [currentPage, setCurrentPage] = useState(HOME_INDEX);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startX = useRef(0);
  const startY = useRef(0);
  const isHorizontal = useRef<boolean | null>(null);

  const handleNavigate = useCallback((page: number) => {
    // Map from HomePage's page indices to our page order
    // 1=Workout, 2=Food, 3=Games
    const map: Record<number, number> = { 1: 2, 2: 3, 3: 0 };
    setCurrentPage(map[page] ?? HOME_INDEX);
  }, []);

  const handleTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
    startY.current = e.touches[0].clientY;
    isHorizontal.current = null;
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const dx = e.touches[0].clientX - startX.current;
    const dy = e.touches[0].clientY - startY.current;

    if (isHorizontal.current === null) {
      isHorizontal.current = Math.abs(dx) > Math.abs(dy);
    }

    if (!isHorizontal.current) return;

    // If at rightmost page and swiping right more, open settings
    if (currentPage === 0 && dx > 0) {
      setSettingsOpen(true);
      setIsDragging(false);
      setDragOffset(0);
      return;
    }

    setDragOffset(dx);
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);

    const threshold = 80;
    if (dragOffset < -threshold && currentPage < pages.length - 1) {
      setCurrentPage(currentPage + 1);
    } else if (dragOffset > threshold && currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
    setDragOffset(0);
  };

  const translateX = -currentPage * 100 + (dragOffset / window.innerWidth) * 100;

  return (
    <div className="relative h-[100dvh] w-full max-w-lg mx-auto overflow-hidden bg-background flex flex-col items-center">
      {/* Swipeable Pages */}
      <div
        className={`flex h-[calc(100dvh-4rem)] ${isDragging ? "" : "transition-transform duration-300 ease-out"}`}
        style={{ transform: `translateX(${translateX}%)`, width: `${pages.length * 100}%` }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="w-full h-full flex-shrink-0"><GamesPage /></div>
        <div className="w-full h-full flex-shrink-0"><HomePage onNavigate={handleNavigate} /></div>
        <div className="w-full h-full flex-shrink-0"><WorkoutPage /></div>
        <div className="w-full h-full flex-shrink-0"><FoodPage /></div>
      </div>

      {/* Bottom Navigation */}
      <div className="absolute bottom-0 left-0 right-0 h-16 glass-card border-t border-border/50 flex items-center justify-around px-4">
        {pages.map((page, index) => (
          <button
            key={page.id}
            onClick={() => setCurrentPage(index)}
            className={`flex flex-col items-center gap-0.5 p-2 transition-colors ${
              currentPage === index ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <page.icon className="w-5 h-5" />
            <span className="text-[10px]">{page.label}</span>
          </button>
        ))}
        <button
          onClick={() => setSettingsOpen(true)}
          className="flex flex-col items-center gap-0.5 p-2 text-muted-foreground"
        >
          <Settings className="w-5 h-5" />
          <span className="text-[10px]">Settings</span>
        </button>
      </div>

      {/* Page Indicator Dots */}
      <div className="absolute bottom-[4.5rem] left-0 right-0 flex justify-center gap-1.5">
        {pages.map((_, i) => (
          <div
            key={i}
            className={`h-1 rounded-full transition-all duration-300 ${
              currentPage === i ? "w-5 bg-primary" : "w-1 bg-muted-foreground/30"
            }`}
          />
        ))}
      </div>

      {/* Settings Menu */}
      <SettingsMenu open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </div>
  );
};

export default SwipeableApp;
