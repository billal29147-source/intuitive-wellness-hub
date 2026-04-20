import { useState } from "react";
import { useAuth, UserProfile, getPendingEmail } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";

const STEPS = ["Basics", "Body", "Goals", "Preferences"] as const;

const OnboardingFlow = () => {
  const { completeOnboarding } = useAuth();
  const email = getPendingEmail() || "";
  const [step, setStep] = useState(0);
  const [data, setData] = useState<Partial<UserProfile>>({
    email,
    units: "metric",
    sex: "male",
    activityLevel: "moderate",
    goal: "maintain",
    workoutStyle: "mixed",
    dietaryRestrictions: [],
  });

  const update = <K extends keyof UserProfile>(key: K, value: UserProfile[K]) =>
    setData((d) => ({ ...d, [key]: value }));

  const next = () => {
    if (step === 0 && !data.name?.trim()) return toast.error("Enter your name");
    if (step === 1 && (!data.age || !data.height || !data.weight))
      return toast.error("Fill in age, height and weight");
    if (step === 2 && !data.targetWeight) return toast.error("Enter target weight");
    if (step < STEPS.length - 1) setStep(step + 1);
    else finish();
  };

  const finish = () => {
    completeOnboarding(data as UserProfile);
    toast.success("Profile saved!");
  };

  const toggleDiet = (item: string) => {
    const current = data.dietaryRestrictions || [];
    update(
      "dietaryRestrictions",
      current.includes(item) ? current.filter((i) => i !== item) : [...current, item]
    );
  };

  const heightUnit = data.units === "metric" ? "cm" : "in";
  const weightUnit = data.units === "metric" ? "kg" : "lbs";

  return (
    <div className="fixed inset-0 z-40 flex flex-col bg-background overflow-y-auto">
      <div className="w-full max-w-md mx-auto px-6 py-8 flex-1 flex flex-col">
        {/* Progress */}
        <div className="flex gap-1.5 mb-6">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full transition-all ${
                i <= step ? "bg-primary" : "bg-muted"
              }`}
            />
          ))}
        </div>

        <p className="text-xs text-muted-foreground uppercase tracking-wider">
          Step {step + 1} of {STEPS.length}
        </p>
        <h1 className="text-2xl font-bold mt-1 mb-6">{STEPS[step]}</h1>

        <div className="flex-1 space-y-4 animate-slide-up" key={step}>
          {step === 0 && (
            <>
              <Field label="Your name">
                <Input
                  value={data.name || ""}
                  onChange={(e) => update("name", e.target.value)}
                  placeholder="Alex"
                  maxLength={50}
                  className="glass-card"
                />
              </Field>
              <Field label="Units">
                <SegButtons
                  value={data.units!}
                  options={[
                    { v: "metric", l: "Metric (kg/cm)" },
                    { v: "imperial", l: "Imperial (lb/in)" },
                  ]}
                  onChange={(v) => update("units", v as UserProfile["units"])}
                />
              </Field>
            </>
          )}

          {step === 1 && (
            <>
              <Field label="Sex">
                <SegButtons
                  value={data.sex!}
                  options={[
                    { v: "male", l: "Male" },
                    { v: "female", l: "Female" },
                    { v: "other", l: "Other" },
                  ]}
                  onChange={(v) => update("sex", v as UserProfile["sex"])}
                />
              </Field>
              <Field label="Age">
                <Input
                  type="number"
                  inputMode="numeric"
                  value={data.age || ""}
                  onChange={(e) => update("age", Number(e.target.value))}
                  placeholder="28"
                  min={10}
                  max={120}
                  className="glass-card"
                />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label={`Height (${heightUnit})`}>
                  <Input
                    type="number"
                    inputMode="numeric"
                    value={data.height || ""}
                    onChange={(e) => update("height", Number(e.target.value))}
                    placeholder={data.units === "metric" ? "175" : "69"}
                    className="glass-card"
                  />
                </Field>
                <Field label={`Weight (${weightUnit})`}>
                  <Input
                    type="number"
                    inputMode="numeric"
                    value={data.weight || ""}
                    onChange={(e) => update("weight", Number(e.target.value))}
                    placeholder={data.units === "metric" ? "70" : "155"}
                    className="glass-card"
                  />
                </Field>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <Field label="Activity level">
                <SegButtons
                  vertical
                  value={data.activityLevel!}
                  options={[
                    { v: "sedentary", l: "Sedentary" },
                    { v: "light", l: "Lightly active" },
                    { v: "moderate", l: "Moderately active" },
                    { v: "active", l: "Active" },
                    { v: "very_active", l: "Very active" },
                  ]}
                  onChange={(v) => update("activityLevel", v as UserProfile["activityLevel"])}
                />
              </Field>
              <Field label="Goal">
                <SegButtons
                  value={data.goal!}
                  options={[
                    { v: "lose", l: "Lose" },
                    { v: "maintain", l: "Maintain" },
                    { v: "gain", l: "Gain" },
                  ]}
                  onChange={(v) => update("goal", v as UserProfile["goal"])}
                />
              </Field>
              <Field label={`Target weight (${weightUnit})`}>
                <Input
                  type="number"
                  inputMode="numeric"
                  value={data.targetWeight || ""}
                  onChange={(e) => update("targetWeight", Number(e.target.value))}
                  placeholder={data.units === "metric" ? "68" : "150"}
                  className="glass-card"
                />
              </Field>
            </>
          )}

          {step === 3 && (
            <>
              <Field label="Workout style">
                <SegButtons
                  vertical
                  value={data.workoutStyle!}
                  options={[
                    { v: "strength", l: "Strength" },
                    { v: "cardio", l: "Cardio" },
                    { v: "hiit", l: "HIIT" },
                    { v: "yoga", l: "Yoga / Mobility" },
                    { v: "mixed", l: "Mixed" },
                  ]}
                  onChange={(v) => update("workoutStyle", v as UserProfile["workoutStyle"])}
                />
              </Field>
              <Field label="Dietary restrictions (optional)">
                <div className="flex flex-wrap gap-2">
                  {["Vegetarian", "Vegan", "Gluten-free", "Dairy-free", "Nut-free", "Halal", "Kosher"].map(
                    (item) => {
                      const active = data.dietaryRestrictions?.includes(item);
                      return (
                        <button
                          key={item}
                          type="button"
                          onClick={() => toggleDiet(item)}
                          className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                            active
                              ? "bg-primary text-primary-foreground border-primary"
                              : "glass-card text-foreground border-border"
                          }`}
                        >
                          {item}
                        </button>
                      );
                    }
                  )}
                </div>
              </Field>
            </>
          )}
        </div>

        {/* Nav */}
        <div className="flex gap-3 mt-8 pt-4">
          {step > 0 && (
            <Button
              variant="outline"
              onClick={() => setStep(step - 1)}
              className="flex-1 h-11"
            >
              <ChevronLeft className="w-4 h-4 mr-1" /> Back
            </Button>
          )}
          <Button
            onClick={next}
            className="flex-1 h-11 font-semibold"
            style={{
              background: "linear-gradient(90deg, hsl(195 85% 55%), hsl(270 70% 60%))",
              color: "hsl(var(--primary-foreground))",
            }}
          >
            {step === STEPS.length - 1 ? "Finish" : "Continue"}
            {step < STEPS.length - 1 && <ChevronRight className="w-4 h-4 ml-1" />}
          </Button>
        </div>
      </div>
    </div>
  );
};

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div>
    <label className="text-xs text-muted-foreground ml-1">{label}</label>
    <div className="mt-1.5">{children}</div>
  </div>
);

const SegButtons = ({
  value,
  options,
  onChange,
  vertical,
}: {
  value: string;
  options: { v: string; l: string }[];
  onChange: (v: string) => void;
  vertical?: boolean;
}) => (
  <div className={vertical ? "flex flex-col gap-2" : "grid grid-cols-3 gap-2"}>
    {options.map((o) => (
      <button
        key={o.v}
        type="button"
        onClick={() => onChange(o.v)}
        className={`px-3 py-2.5 rounded-xl text-sm border transition-colors ${
          value === o.v
            ? "bg-primary text-primary-foreground border-primary"
            : "glass-card text-foreground border-border"
        }`}
      >
        {o.l}
      </button>
    ))}
  </div>
);

export default OnboardingFlow;
