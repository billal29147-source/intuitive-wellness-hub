import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useAuth } from "./AuthContext";
import {
  calcActiveCalorieGoal,
  calcCarbsGoal,
  calcDailyCalorieGoal,
  calcFatsGoal,
  calcProteinGoal,
  calcStepsGoal,
  calcWaterGoal,
} from "@/lib/profileMath";

export interface HealthMetrics {
  steps: number;
  stepsGoal: number;
  heartRate: number;
  sleepHours: number;
  sleepMinutes: number;
  deepSleepHours: number;
  deepSleepMinutes: number;
  calories: number;
  activeCalories: number;
  caloriesGoal: number;
  water: number;
  waterGoal: number;
  streak: number;
  spo2: number;
  respRate: number;
  distance: number;
  distanceGoal: number;
  bodyFat: number;
  leanMass: number;
  healthScore: number;
  protein: number;
  proteinGoal: number;
  carbs: number;
  carbsGoal: number;
  fats: number;
  fatsGoal: number;
  totalCaloriesFood: number;
  totalCaloriesFoodGoal: number;
  weight: number;
  height: number;
  age: number;
}

const baseMetrics: HealthMetrics = {
  steps: 8432,
  stepsGoal: 10000,
  heartRate: 72,
  sleepHours: 7,
  sleepMinutes: 24,
  deepSleepHours: 2,
  deepSleepMinutes: 10,
  calories: 1847,
  activeCalories: 420,
  caloriesGoal: 600,
  water: 6,
  waterGoal: 8,
  streak: 14,
  spo2: 98,
  respRate: 16,
  distance: 5.2,
  distanceGoal: 8,
  bodyFat: 22,
  leanMass: 65,
  healthScore: 82,
  protein: 85,
  proteinGoal: 130,
  carbs: 120,
  carbsGoal: 240,
  fats: 45,
  fatsGoal: 65,
  totalCaloriesFood: 950,
  totalCaloriesFoodGoal: 2100,
  weight: 83,
  height: 175,
  age: 25,
};

interface HealthDataContextType {
  metrics: HealthMetrics;
  updateMetric: (key: keyof HealthMetrics, value: number) => void;
  getStatusColor: (key: string) => string;
  getStatusLabel: (key: string) => string;
}

function getHeartRateStatus(bpm: number): { label: string; color: string } {
  if (bpm < 40) return { label: "⚠️ Dangerously Low", color: "text-destructive" };
  if (bpm < 50) return { label: "Very Low — See a Doctor", color: "text-health-calories" };
  if (bpm < 60) return { label: "Athletic / Low", color: "text-health-steps" };
  if (bpm <= 80) return { label: "Normal & Healthy", color: "text-health-progress" };
  if (bpm <= 100) return { label: "Slightly Elevated", color: "text-health-calories" };
  if (bpm <= 120) return { label: "High — Rest & Relax", color: "text-health-heart" };
  return { label: "⚠️ Dangerously High!", color: "text-destructive" };
}

function getSpo2Status(val: number): { label: string; color: string } {
  if (val >= 95) return { label: "Excellent", color: "text-health-progress" };
  if (val >= 90) return { label: "Borderline — Monitor", color: "text-health-calories" };
  return { label: "⚠️ Low — Seek Help", color: "text-destructive" };
}

function getRespStatus(val: number): { label: string; color: string } {
  if (val >= 12 && val <= 20) return { label: "Normal Range", color: "text-health-progress" };
  if (val < 12) return { label: "Below Normal", color: "text-health-calories" };
  return { label: "Elevated", color: "text-health-heart" };
}

const HealthDataContext = createContext<HealthDataContextType | null>(null);

const STORAGE_PREFIX = "app_health_metrics_";

export const HealthDataProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState<HealthMetrics>(baseMetrics);

  // Hydrate from per-user profile + storage
  useEffect(() => {
    if (!user) return;
    const stored = localStorage.getItem(STORAGE_PREFIX + user.email);
    if (stored) {
      try {
        setMetrics(JSON.parse(stored));
        return;
      } catch {}
    }
    // Build personalized defaults from profile
    const personalized: HealthMetrics = {
      ...baseMetrics,
      weight: user.weight,
      height: user.height,
      age: user.age,
      stepsGoal: calcStepsGoal(user),
      caloriesGoal: calcActiveCalorieGoal(user),
      waterGoal: calcWaterGoal(user),
      proteinGoal: calcProteinGoal(user),
      carbsGoal: calcCarbsGoal(user),
      fatsGoal: calcFatsGoal(user),
      totalCaloriesFoodGoal: calcDailyCalorieGoal(user),
    };
    setMetrics(personalized);
  }, [user]);

  // Persist
  useEffect(() => {
    if (user) localStorage.setItem(STORAGE_PREFIX + user.email, JSON.stringify(metrics));
  }, [metrics, user]);

  const updateMetric = (key: keyof HealthMetrics, value: number) => {
    setMetrics((prev) => ({ ...prev, [key]: value }));
  };

  const getStatusColor = (key: string) => {
    switch (key) {
      case "heartRate": return getHeartRateStatus(metrics.heartRate).color;
      case "spo2": return getSpo2Status(metrics.spo2).color;
      case "respRate": return getRespStatus(metrics.respRate).color;
      default: return "text-health-progress";
    }
  };

  const getStatusLabel = (key: string) => {
    switch (key) {
      case "heartRate": return getHeartRateStatus(metrics.heartRate).label;
      case "spo2": return getSpo2Status(metrics.spo2).label;
      case "respRate": return getRespStatus(metrics.respRate).label;
      default: return "";
    }
  };

  return (
    <HealthDataContext.Provider value={{ metrics, updateMetric, getStatusColor, getStatusLabel }}>
      {children}
    </HealthDataContext.Provider>
  );
};

export const useHealthData = () => {
  const ctx = useContext(HealthDataContext);
  if (!ctx) throw new Error("useHealthData must be inside HealthDataProvider");
  return ctx;
};
