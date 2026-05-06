import "./WorkoutAnimation.css";

const animations: Record<string, () => JSX.Element> = {
  "Morning HIIT": () => (
    <div className="workout-anim hiit">
      <div className="hiit-figure">
        <div className="hiit-head" />
        <div className="hiit-body" />
        <div className="hiit-leg left" />
        <div className="hiit-leg right" />
        <div className="hiit-arm left" />
        <div className="hiit-arm right" />
      </div>
    </div>
  ),
  "Strength Training": () => (
    <div className="workout-anim strength">
      <div className="barbell">
        <div className="plate left" />
        <div className="bar" />
        <div className="plate right" />
      </div>
      <div className="lifter" />
    </div>
  ),
  "Hypertrophy Push/Pull/Legs": () => (
    <div className="workout-anim strength">
      <div className="barbell">
        <div className="plate left big" />
        <div className="bar" />
        <div className="plate right big" />
      </div>
      <div className="lifter" />
    </div>
  ),
  "Evening Yoga": () => (
    <div className="workout-anim yoga">
      <div className="yoga-figure">
        <div className="yoga-head" />
        <div className="yoga-body" />
        <div className="yoga-arm left" />
        <div className="yoga-arm right" />
        <div className="yoga-leg" />
      </div>
    </div>
  ),
  "Zone 2 Cardio": () => (
    <div className="workout-anim cardio">
      <div className="runner">
        <div className="runner-head" />
        <div className="runner-body" />
        <div className="runner-leg left" />
        <div className="runner-leg right" />
        <div className="runner-arm left" />
        <div className="runner-arm right" />
      </div>
    </div>
  ),
  "Cardio Blast": () => (
    <div className="workout-anim cardio fast">
      <div className="runner">
        <div className="runner-head" />
        <div className="runner-body" />
        <div className="runner-leg left" />
        <div className="runner-leg right" />
        <div className="runner-arm left" />
        <div className="runner-arm right" />
      </div>
      <div className="speed-lines">
        <span /><span /><span />
      </div>
    </div>
  ),
  "Mobility & Stretch": () => (
    <div className="workout-anim stretch">
      <div className="stretch-figure">
        <div className="stretch-head" />
        <div className="stretch-body" />
        <div className="stretch-arm" />
        <div className="stretch-leg" />
      </div>
    </div>
  ),
};

export default function WorkoutAnimation({ name, color }: { name: string; color: string }) {
  const Anim = animations[name];
  if (!Anim) return null;
  return (
    <div className={`workout-anim-wrap ${color.replace("text-", "anim-")}`}>
      <Anim />
    </div>
  );
}
