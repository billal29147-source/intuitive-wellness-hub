import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export interface UserProfile {
  // Account
  email: string;
  name: string;
  // Basics
  age: number;
  sex: "male" | "female" | "other";
  height: number; // cm or inches depending on units
  weight: number; // kg or lbs
  // Activity & goals
  activityLevel: "sedentary" | "light" | "moderate" | "active" | "very_active";
  goal: "lose" | "maintain" | "gain";
  targetWeight: number;
  // Preferences
  dietaryRestrictions: string[];
  workoutStyle: "strength" | "cardio" | "hiit" | "yoga" | "mixed";
  units: "metric" | "imperial";
}

interface StoredAccount {
  email: string;
  password: string;
  profile: UserProfile;
}

interface AuthContextValue {
  user: UserProfile | null;
  isReady: boolean;
  signIn: (email: string, password: string) => { ok: boolean; error?: string };
  signUp: (email: string, password: string) => { ok: boolean; error?: string };
  completeOnboarding: (profile: UserProfile) => void;
  signOut: () => void;
  needsOnboarding: boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const ACCOUNTS_KEY = "app_accounts";
const SESSION_KEY = "app_session_email";

const loadAccounts = (): StoredAccount[] => {
  try {
    return JSON.parse(localStorage.getItem(ACCOUNTS_KEY) || "[]");
  } catch {
    return [];
  }
};

const saveAccounts = (accounts: StoredAccount[]) => {
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [pendingEmail, setPendingEmail] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const sessionEmail = localStorage.getItem(SESSION_KEY);
    if (sessionEmail) {
      const account = loadAccounts().find((a) => a.email === sessionEmail);
      if (account?.profile?.name) {
        setUser(account.profile);
      } else if (account) {
        setPendingEmail(account.email);
      }
    }
    setIsReady(true);
  }, []);

  const signUp = (email: string, password: string) => {
    const accounts = loadAccounts();
    if (accounts.find((a) => a.email === email.toLowerCase())) {
      return { ok: false, error: "An account with this email already exists." };
    }
    const newAccount: StoredAccount = {
      email: email.toLowerCase(),
      password,
      profile: { email: email.toLowerCase() } as UserProfile,
    };
    accounts.push(newAccount);
    saveAccounts(accounts);
    localStorage.setItem(SESSION_KEY, newAccount.email);
    setPendingEmail(newAccount.email);
    return { ok: true };
  };

  const signIn = (email: string, password: string) => {
    const account = loadAccounts().find((a) => a.email === email.toLowerCase());
    if (!account) return { ok: false, error: "No account found." };
    if (account.password !== password)
      return { ok: false, error: "Incorrect password." };
    localStorage.setItem(SESSION_KEY, account.email);
    if (account.profile?.name) setUser(account.profile);
    else setPendingEmail(account.email);
    return { ok: true };
  };

  const completeOnboarding = (profile: UserProfile) => {
    const accounts = loadAccounts();
    const idx = accounts.findIndex((a) => a.email === profile.email.toLowerCase());
    if (idx >= 0) {
      accounts[idx].profile = profile;
      saveAccounts(accounts);
    }
    setUser(profile);
    setPendingEmail(null);
  };

  const signOut = () => {
    localStorage.removeItem(SESSION_KEY);
    setUser(null);
    setPendingEmail(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isReady,
        signIn,
        signUp,
        completeOnboarding,
        signOut,
        needsOnboarding: !!pendingEmail && !user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

export const getPendingEmail = () => localStorage.getItem(SESSION_KEY);
