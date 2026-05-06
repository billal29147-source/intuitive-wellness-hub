import "./ExerciseAnimation.css";

const ANIM_MAP: Record<string, () => JSX.Element> = {
  /* ---- HIIT ---- */
  "burpee": () => (
    <div className="ex-anim burpee-fig">
      <div className="ex-head" /><div className="ex-torso" />
      <div className="ex-arm l" /><div className="ex-arm r" />
      <div className="ex-leg l" /><div className="ex-leg r" />
    </div>
  ),
  "jump-squat": () => (
    <div className="ex-anim jsquat-fig">
      <div className="ex-head" /><div className="ex-torso" />
      <div className="ex-leg l" /><div className="ex-leg r" />
    </div>
  ),
  "mountain-climber": () => (
    <div className="ex-anim mclimb-fig">
      <div className="ex-head" /><div className="ex-torso" />
      <div className="ex-arm l" /><div className="ex-arm r" />
      <div className="ex-leg l" /><div className="ex-leg r" />
    </div>
  ),
  "high-knees": () => (
    <div className="ex-anim hknees-fig">
      <div className="ex-head" /><div className="ex-torso" />
      <div className="ex-leg l" /><div className="ex-leg r" />
    </div>
  ),
  "plank-jack": () => (
    <div className="ex-anim plank-fig">
      <div className="ex-head" /><div className="ex-torso" />
      <div className="ex-leg l" /><div className="ex-leg r" />
    </div>
  ),

  /* ---- STRENGTH ---- */
  "bench-press": () => (
    <div className="ex-anim bench-fig">
      <div className="bench-body" />
      <div className="bench-bar">
        <div className="bp l" /><div className="bb" /><div className="bp r" />
      </div>
    </div>
  ),
  "squat": () => (
    <div className="ex-anim squat-fig">
      <div className="ex-head" /><div className="ex-torso" />
      <div className="sq-bar" />
      <div className="ex-leg l" /><div className="ex-leg r" />
    </div>
  ),
  "deadlift": () => (
    <div className="ex-anim dlift-fig">
      <div className="ex-head" /><div className="ex-torso" />
      <div className="dl-bar">
        <div className="bp l" /><div className="bb" /><div className="bp r" />
      </div>
    </div>
  ),
  "bicep-curl": () => (
    <div className="ex-anim curl-fig">
      <div className="ex-head" /><div className="ex-torso" />
      <div className="curl-arm">
        <div className="curl-forearm" />
        <div className="curl-weight" />
      </div>
    </div>
  ),
  "overhead-press": () => (
    <div className="ex-anim ohp-fig">
      <div className="ex-head" /><div className="ex-torso" />
      <div className="ohp-arm l" /><div className="ohp-arm r" />
      <div className="ohp-bar">
        <div className="bp l" /><div className="bb" /><div className="bp r" />
      </div>
    </div>
  ),
  "bent-row": () => (
    <div className="ex-anim row-fig">
      <div className="ex-head" /><div className="ex-torso" />
      <div className="row-arm" />
      <div className="row-weight" />
    </div>
  ),

  /* ---- HYPERTROPHY ---- */
  "pulldown": () => (
    <div className="ex-anim pulldown-fig">
      <div className="ex-head" /><div className="ex-torso" />
      <div className="pd-arm l" /><div className="pd-arm r" />
      <div className="pd-bar" />
    </div>
  ),
  "lateral-raise": () => (
    <div className="ex-anim latraise-fig">
      <div className="ex-head" /><div className="ex-torso" />
      <div className="lr-arm l" /><div className="lr-arm r" />
    </div>
  ),
  "leg-curl": () => (
    <div className="ex-anim legcurl-fig">
      <div className="lc-body" /><div className="lc-leg" />
    </div>
  ),
  "chest-fly": () => (
    <div className="ex-anim chestfly-fig">
      <div className="ex-head" /><div className="ex-torso" />
      <div className="cf-arm l" /><div className="cf-arm r" />
    </div>
  ),

  /* ---- YOGA ---- */
  "downward-dog": () => (
    <div className="ex-anim ddog-fig">
      <div className="dd-body" />
    </div>
  ),
  "warrior": () => (
    <div className="ex-anim warrior-fig">
      <div className="ex-head" /><div className="ex-torso" />
      <div className="w-arm l" /><div className="w-arm r" />
      <div className="w-leg l" /><div className="w-leg r" />
    </div>
  ),
  "tree-pose": () => (
    <div className="ex-anim tree-fig">
      <div className="ex-head" /><div className="ex-torso" />
      <div className="t-arm l" /><div className="t-arm r" />
      <div className="t-leg" />
    </div>
  ),
  "childs-pose": () => (
    <div className="ex-anim child-fig">
      <div className="cp-body" />
    </div>
  ),
  "pigeon-pose": () => (
    <div className="ex-anim pigeon-fig">
      <div className="pg-body" />
    </div>
  ),

  /* ---- CARDIO ---- */
  "walking": () => (
    <div className="ex-anim walk-fig">
      <div className="ex-head" /><div className="ex-torso" />
      <div className="ex-leg l" /><div className="ex-leg r" />
    </div>
  ),
  "running": () => (
    <div className="ex-anim run-fig">
      <div className="ex-head" /><div className="ex-torso" />
      <div className="ex-leg l" /><div className="ex-leg r" />
      <div className="ex-arm l" /><div className="ex-arm r" />
    </div>
  ),
  "sprint": () => (
    <div className="ex-anim sprint-fig">
      <div className="ex-head" /><div className="ex-torso" />
      <div className="ex-leg l" /><div className="ex-leg r" />
      <div className="ex-arm l" /><div className="ex-arm r" />
      <div className="sp-lines"><span /><span /><span /></div>
    </div>
  ),
  "incline-walk": () => (
    <div className="ex-anim incline-fig">
      <div className="ex-head" /><div className="ex-torso" />
      <div className="ex-leg l" /><div className="ex-leg r" />
      <div className="inc-slope" />
    </div>
  ),
  "jump-rope": () => (
    <div className="ex-anim jrope-fig">
      <div className="ex-head" /><div className="ex-torso" />
      <div className="jr-rope" />
    </div>
  ),
  "rowing": () => (
    <div className="ex-anim row-machine-fig">
      <div className="ex-head" /><div className="rm-body" />
      <div className="rm-arm" /><div className="rm-handle" />
    </div>
  ),
  "battle-ropes": () => (
    <div className="ex-anim bropes-fig">
      <div className="ex-head" /><div className="ex-torso" />
      <div className="br-arm l" /><div className="br-arm r" />
      <div className="br-rope l" /><div className="br-rope r" />
    </div>
  ),

  /* ---- MOBILITY ---- */
  "foam-roll": () => (
    <div className="ex-anim froll-fig">
      <div className="fr-body" /><div className="fr-roller" />
    </div>
  ),
  "hip-circle": () => (
    <div className="ex-anim hipcircle-fig">
      <div className="ex-head" /><div className="ex-torso" />
      <div className="hc-leg" />
    </div>
  ),
  "cat-cow": () => (
    <div className="ex-anim catcow-fig">
      <div className="cc-body" />
    </div>
  ),
  "lunge-twist": () => (
    <div className="ex-anim ltwist-fig">
      <div className="ex-head" /><div className="ex-torso" />
      <div className="lt-arm" />
      <div className="ex-leg l" /><div className="ex-leg r" />
    </div>
  ),
  "shoulder-pass": () => (
    <div className="ex-anim spass-fig">
      <div className="ex-head" /><div className="ex-torso" />
      <div className="sp-arm" /><div className="sp-stick" />
    </div>
  ),
};

export default function ExerciseAnimation({ animId, color }: { animId: string; color: string }) {
  const Anim = ANIM_MAP[animId];
  if (!Anim) return <div className="ex-anim-wrap" />;
  return (
    <div className={`ex-anim-wrap ${color.replace("text-", "exanim-")}`}>
      <Anim />
    </div>
  );
}
