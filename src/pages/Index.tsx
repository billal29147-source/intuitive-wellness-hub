import { useState } from "react";
import SwipeableApp from "@/components/SwipeableApp";
import LoadingScreen from "@/components/LoadingScreen";
import AuthScreen from "@/components/AuthScreen";
import OnboardingFlow from "@/components/OnboardingFlow";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const { user, isReady, needsOnboarding } = useAuth();
  const [bootDone, setBootDone] = useState(false);

  if (!isReady || !bootDone) {
    return <LoadingScreen onComplete={() => setBootDone(true)} />;
  }

  if (!user && !needsOnboarding) return <AuthScreen />;
  if (needsOnboarding) return <OnboardingFlow />;

  return <SwipeableApp />;
};

export default Index;
