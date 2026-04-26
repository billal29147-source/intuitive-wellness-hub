import { HealthMetrics } from "@/contexts/HealthDataContext";
import { UserProfile } from "@/contexts/AuthContext";
import { calcBMI, bmiCategory } from "@/lib/profileMath";

export type Severity = "ok" | "warn" | "critical";

export interface TipResult {
  summary: string;
  tips: string[];
  progress: number;
  severity: Severity;
  action: string; // single most important next step, references actual numbers
}

function ageBand(age?: number): "teen" | "young" | "adult" | "senior" {
  if (!age) return "adult";
  if (age < 20) return "teen";
  if (age < 35) return "young";
  if (age < 60) return "adult";
  return "senior";
}

function profileNote(p?: UserProfile | null): string {
  if (!p) return "";
  const bmi = calcBMI(p);
  const cat = bmiCategory(bmi);
  return ` (BMI ${bmi.toFixed(1)} — ${cat.label}, goal: ${p.goal})`;
}

/* ---------- STEPS ---------- */
export function getStepsTip(m: HealthMetrics, p?: UserProfile | null): TipResult {
  const remaining = Math.max(0, m.stepsGoal - m.steps);
  const pct = Math.round((m.steps / m.stepsGoal) * 100);
  const progress = Math.min(100, pct);
  const minutesNeeded = Math.ceil(remaining / 100); // ~100 steps/min brisk
  const km = (remaining * 0.0008).toFixed(2);

  let severity: Severity = "ok";
  if (pct < 30) severity = "critical";
  else if (pct < 70) severity = "warn";

  const goalNote = p ? ` Goal set for your ${p.activityLevel.replace("_", " ")} level.` : "";
  const summary = remaining === 0
    ? `🎉 Done! ${m.steps.toLocaleString()} / ${m.stepsGoal.toLocaleString()} steps (${pct}%).`
    : `${m.steps.toLocaleString()} / ${m.stepsGoal.toLocaleString()} steps — ${pct}% done, ${remaining.toLocaleString()} to go.${goalNote}`;

  const action = remaining === 0
    ? `You've crushed your goal. Add a 10-min cooldown walk to keep momentum.`
    : `Walk briskly for ~${minutesNeeded} min (about ${km} km) to close the ${remaining.toLocaleString()}-step gap.`;

  const lossBoost = p?.goal === "lose" ? " Walking after meals blunts blood-sugar spikes — key for fat loss." : "";

  const tips = remaining === 0
    ? [`You exceeded your ${m.stepsGoal.toLocaleString()} target by ${(m.steps - m.stepsGoal).toLocaleString()} steps.`, "Bump tomorrow's goal by 500 steps to keep progressing.", `At this pace you're walking ~${(m.steps * 0.0008).toFixed(1)} km/day.`]
    : pct < 30
      ? [`🚨 Only ${pct}% of your goal — sedentary day. Stand up and walk RIGHT NOW for 10 min (~1,000 steps).${lossBoost}`, `You still need ${remaining.toLocaleString()} steps. Schedule THREE 15-min walks before bed.`, "Sitting >8h/day raises mortality risk — break it up every hour.", `${minutesNeeded} min of brisk walking will fully close your gap.`]
      : pct < 70
        ? [`You're at ${pct}%. A single ${minutesNeeded}-min walk closes the remaining ${remaining.toLocaleString()} steps.${lossBoost}`, "Take a call walking — adds ~1,500 steps per 15 min.", "Park at the far end of the lot — easy +200 steps each trip.", "Stairs instead of elevator: ~15 steps per flight."]
        : [`Almost there — only ${remaining.toLocaleString()} steps (${minutesNeeded} min) left.${lossBoost}`, "A walk after dinner closes most short gaps.", "Pace while brushing teeth — sneak in 100+ steps."];
  return { summary, tips, progress, severity, action };
}

/* ---------- HEART ---------- */
export function getHeartTip(m: HealthMetrics, _p?: UserProfile | null): TipResult {
  const bpm = m.heartRate;
  const progress = Math.max(0, Math.min(100, Math.round(((100 - Math.abs(bpm - 65)) / 100) * 100)));
  let severity: Severity = "ok", summary = "", action = "", tips: string[] = [];

  if (bpm < 40) {
    severity = "critical";
    summary = `🚨 Heart rate ${bpm} bpm — DANGEROUSLY LOW (severe bradycardia).`;
    action = `Call emergency services now. Sit down, do not exert yourself.`;
    tips = ["This is a medical emergency — go to ER.", "Do not drive yourself if dizzy.", "Note any chest pain, fainting, or shortness of breath for the doctor.", "Stop any beta-blocker / heart med until cleared."];
  } else if (bpm < 50) {
    severity = "warn";
    summary = `Heart rate ${bpm} bpm — very low. Normal resting is 60-100.`;
    action = `If not a trained athlete, book a doctor visit this week. Recheck after 5 min seated rest.`;
    tips = ["Athletes commonly sit at 40-50 — fine if asymptomatic.", "Track for dizziness, fatigue, fainting.", "Review medications (beta-blockers lower HR).", "Hydrate — dehydration can mask symptoms."];
  } else if (bpm < 60) {
    severity = "ok";
    summary = `Heart rate ${bpm} bpm — low-normal. Common in fit individuals.`;
    action = `Maintain with 3 cardio sessions/week. Recheck weekly.`;
    tips = ["A resting HR of 50-60 indicates a strong heart.", "Keep aerobic base with 150 min/week.", "Watch caffeine if it spikes you above 80.", "No action needed unless you feel unwell."];
  } else if (bpm <= 80) {
    severity = "ok";
    summary = `Heart rate ${bpm} bpm — perfectly healthy (60-100 normal).`;
    action = `Add 5 min of 4-7-8 breathing daily to drift toward 60-65.`;
    tips = ["Cardio 3-4x/wk lowers resting HR ~1 bpm/month.", "Cut afternoon caffeine to drop 3-5 bpm.", "10 min meditation = ~5 bpm long-term.", "You're in the optimal zone — protect it."];
  } else if (bpm <= 100) {
    severity = "warn";
    summary = `⚠️ Heart rate ${bpm} bpm — elevated end of normal. Aim under 80.`;
    action = `Sit, do 5 min box-breathing (4s in/hold/out/hold), then recheck.`;
    tips = [`You're ${bpm - 70} bpm above the healthy 70 average.`, "Drink 500 ml water — dehydration can add 10-15 bpm.", "Cut today's caffeine (each cup adds ~5-10 bpm for hours).", "If sustained at rest >2 hr, contact your doctor."];
  } else if (bpm <= 120) {
    severity = "critical";
    summary = `🚨 Heart rate ${bpm} bpm — HIGH at rest. Stop, sit, breathe.`;
    action = `Sit/lie down NOW. 5 min slow breathing. If still >100 after 15 min, call your doctor.`;
    tips = ["No caffeine, alcohol, or exercise today.", "Drink 500 ml water and recheck in 10 min.", "If chest pain / shortness of breath → ER immediately.", "Note triggers (stress, fever, meds) for your doctor."];
  } else {
    severity = "critical";
    summary = `🚨 Heart rate ${bpm} bpm — DANGEROUSLY HIGH. Possible tachycardia.`;
    action = `Call emergency services. Lie down, do not move.`;
    tips = ["Stop ALL activity immediately.", "If chest pain, dizziness, or fainting — ER now.", "Do not 'push through' — this is dangerous.", "Tachycardia >120 at rest can be a cardiac event."];
  }
  return { summary, tips, progress, severity, action };
}

/* ---------- SLEEP ---------- */
export function getSleepTip(m: HealthMetrics, p?: UserProfile | null): TipResult {
  const totalMin = m.sleepHours * 60 + m.sleepMinutes;
  const band = ageBand(p?.age);
  const goalMin = band === "teen" ? 540 : band === "senior" ? 450 : 480;
  const goalH = Math.round(goalMin / 60);
  const progress = Math.min(100, Math.round((totalMin / goalMin) * 100));
  const diff = goalMin - totalMin;
  const deepMin = m.deepSleepHours * 60 + m.deepSleepMinutes;
  const deepPct = totalMin > 0 ? Math.round((deepMin / totalMin) * 100) : 0;

  let severity: Severity = "ok";
  if (diff > 120 || deepPct < 10) severity = "critical";
  else if (diff > 30 || deepPct < 18) severity = "warn";

  const summary = diff <= 0
    ? `${m.sleepHours}h ${m.sleepMinutes}m — met your ${goalH}h target. Deep sleep ${deepPct}%.`
    : `${m.sleepHours}h ${m.sleepMinutes}m — ${diff} min short of ${goalH}h. Deep sleep ${deepPct}%.`;

  const action = diff > 0
    ? `Go to bed ${diff} minutes earlier tonight to hit ${goalH}h.`
    : deepPct < 20
      ? `Cut alcohol and screens 90 min before bed to push deep sleep above 20%.`
      : `Maintain your bedtime — your sleep is on track.`;

  const tips = diff > 120
    ? [`🚨 You're ${diff} min short — that's >2h sleep debt. Nap 20 min today and sleep ${diff} min earlier.`, "Chronic <6h sleep raises diabetes & heart-disease risk.", "Cut caffeine after noon — half-life is 6h.", "No screens 1h pre-bed — blue light delays melatonin 90 min."]
    : diff > 30
      ? [`Bed ${diff} min earlier tonight to close the gap.`, "Set a wind-down alarm 30 min before bedtime.", "Room at 18-20°C improves sleep onset by ~10 min.", "Magnesium glycinate 200-400 mg can deepen sleep."]
      : diff > 0
        ? [`Almost there — only ${diff} min off.`, "Consistent bedtime > total hours.", "Avoid heavy meals 2-3h before bed.", "Try reading instead of scrolling."]
        : deepPct < 18
          ? [`Deep sleep only ${deepPct}% — aim for 20-25%.`, "Skip alcohol — it crushes deep sleep.", "Lift weights 2x/week — boosts slow-wave sleep.", "Cool bedroom (18°C) increases deep sleep ~15%."]
          : ["Sleeping great — protect this routine.", "Wake at the same time daily — even weekends.", `Deep sleep ${deepPct}% is in the optimal 20-25% range.`, "Quality > quantity: minimize wake-ups."];
  return { summary, tips, progress, severity, action };
}

/* ---------- ACTIVE CALORIES ---------- */
export function getCaloriesTip(m: HealthMetrics, p?: UserProfile | null): TipResult {
  const remaining = Math.max(0, m.caloriesGoal - m.activeCalories);
  const pct = Math.round((m.activeCalories / m.caloriesGoal) * 100);
  const progress = Math.min(100, pct);
  let severity: Severity = "ok";
  if (pct < 30) severity = "critical";
  else if (pct < 70) severity = "warn";

  const minutesWalk = Math.ceil(remaining / 5);  // ~5 cal/min walk
  const minutesHIIT = Math.ceil(remaining / 12); // ~12 cal/min HIIT
  const ctx = p ? ` (set for your "${p.goal}" goal)` : "";

  const summary = remaining === 0
    ? `🔥 ${m.activeCalories} / ${m.caloriesGoal} cal — goal hit${ctx}.`
    : `${m.activeCalories} / ${m.caloriesGoal} active cal — ${remaining} to go${ctx}.`;

  const action = remaining === 0
    ? `Cool down with 5 min of stretching to lock in recovery.`
    : `Do ${minutesHIIT} min HIIT or ${minutesWalk} min brisk walk to close the ${remaining}-cal gap.`;

  const styleTip = p?.workoutStyle === "strength"
    ? "Add 10 min weighted carries — burns cal AND builds muscle."
    : p?.workoutStyle === "yoga"
      ? "Power-yoga flow burns ~5 cal/min, recovery-friendly."
      : p?.workoutStyle === "hiit"
        ? `${minutesHIIT}-min Tabata circuit (8 rounds 20s/10s) ≈ ${remaining} cal.`
        : "Mix bodyweight intervals + steady cardio.";

  const tips = remaining === 0
    ? ["Goal smashed — refuel with 20-30 g protein within 60 min.", `You burned ${m.activeCalories} cal — equivalent to ~${Math.round(m.activeCalories / 100)} km running.`, "Bump tomorrow's goal by 50 cal to progress."]
    : pct < 30
      ? [`🚨 Only ${pct}% done — start moving in the next hour. ${minutesWalk} min walk = your gap.`, styleTip, "Stand-up breaks every 30 min add ~30 cal/hr.", "Even chores (vacuum, laundry) burn 100-200 cal/hr."]
      : pct < 70
        ? [`${pct}% done — one ${minutesHIIT}-min HIIT block finishes it.`, styleTip, "20-min bike commute ≈ 150-200 cal.", "Dance to 4 songs ≈ 100 cal."]
        : [`Almost done — ${minutesWalk} min walk seals it.`, styleTip, "Light stretch + walk closes <100 cal gaps.", "Don't skip cooldown."];
  return { summary, tips, progress, severity, action };
}

/* ---------- WATER ---------- */
export function getWaterTip(m: HealthMetrics, _p?: UserProfile | null): TipResult {
  const remaining = Math.max(0, m.waterGoal - m.water);
  const pct = Math.round((m.water / m.waterGoal) * 100);
  const progress = Math.min(100, pct);
  let severity: Severity = "ok";
  if (pct < 30) severity = "critical";
  else if (pct < 70) severity = "warn";

  const ml = remaining * 250;
  const summary = remaining === 0
    ? `💧 ${m.water} / ${m.waterGoal} glasses — hydrated!`
    : `${m.water} / ${m.waterGoal} glasses — ${remaining} more (${ml} ml).`;
  const action = remaining === 0
    ? `Maintain — sip steadily, don't binge.`
    : `Drink one glass (250 ml) right now, then space ${remaining - 1} more across the rest of today.`;

  const tips = remaining === 0
    ? ["Hydration locked in — keep sipping.", "Urine color pale yellow = perfect.", "Add electrolytes if sweating heavily."]
    : pct < 30
      ? [`🚨 Only ${m.water} glass${m.water === 1 ? "" : "es"} so far. Down 500 ml in the next 30 min.`, "Dehydration drops focus & energy by 20-30%.", "Set hourly phone reminders to sip.", "Eat water-rich foods: cucumber, watermelon, oranges."]
      : pct < 70
        ? [`${remaining} glasses left (${ml} ml). One with each remaining meal/snack.`, "Visible bottle = 25% more drinking.", "Glass before each meal also aids digestion.", "Add lemon or mint if plain water feels boring."]
        : [`Just ${remaining} more — one with dinner finishes you.`, "Don't chug at night — wakes you up.", "Herbal tea counts.", "Great pace today."];
  return { summary, tips, progress, severity, action };
}

/* ---------- STREAK ---------- */
export function getStreakTip(m: HealthMetrics, _p?: UserProfile | null): TipResult {
  const next = m.streak < 7 ? 7 : m.streak < 14 ? 14 : m.streak < 21 ? 21 : m.streak < 30 ? 30 : m.streak < 60 ? 60 : m.streak < 100 ? 100 : m.streak + 10;
  const left = next - m.streak;
  const progress = Math.min(100, Math.round((m.streak / next) * 100));
  const summary = `${m.streak}-day streak — ${left} day${left === 1 ? "" : "s"} to ${next}.`;
  const action = `Do one small healthy thing today (10-min walk, glass of water) to extend to ${m.streak + 1} days.`;
  const tips = [
    `${left} more day${left === 1 ? "" : "s"} unlocks the ${next}-day badge.`,
    "Consistency > intensity — anything counts.",
    "Stack with morning coffee = automatic.",
    "21 days = lasting habit. You're at " + m.streak + ".",
  ];
  return { summary, tips, progress, severity: "ok", action };
}

/* ---------- SPO2 ---------- */
export function getSpo2Tip(m: HealthMetrics, _p?: UserProfile | null): TipResult {
  const v = m.spo2;
  const progress = v;
  let severity: Severity = "ok", summary = "", action = "", tips: string[] = [];
  if (v >= 95) {
    severity = "ok";
    summary = `SpO₂ ${v}% — excellent (95-100% normal).`;
    action = `Maintain with daily diaphragmatic breathing (5 min).`;
    tips = ["Aerobic exercise improves O₂ utilization.", "Outdoor fresh air keeps levels strong.", "No action needed.", `${v}% is in the optimal range.`];
  } else if (v >= 90) {
    severity = "warn";
    summary = `⚠️ SpO₂ ${v}% — borderline (normal 95-100). Recheck in 5 min.`;
    action = `Sit upright, slow deep breaths for 5 min, then recheck. If still <95%, call doctor today.`;
    tips = [`You're ${95 - v}% below normal.`, "Avoid altitude/exertion until normalized.", "Could indicate respiratory issue — log symptoms.", "Smokers: this is a strong cessation signal."];
  } else {
    severity = "critical";
    summary = `🚨 SpO₂ ${v}% — DANGEROUSLY LOW. Seek medical help now.`;
    action = `Call emergency services or go to ER immediately. Sit upright, breathe slowly.`;
    tips = ["Below 90% can be life-threatening.", "Do NOT exercise.", "Possible pneumonia, COPD, asthma, PE — needs imaging.", "Use supplemental O₂ if prescribed."];
  }
  return { summary, tips, progress, severity, action };
}

/* ---------- RESP RATE ---------- */
export function getRespTip(m: HealthMetrics, _p?: UserProfile | null): TipResult {
  const v = m.respRate;
  const progress = v >= 12 && v <= 20 ? Math.round(((20 - Math.abs(v - 16)) / 20) * 100) : 30;
  let severity: Severity = "ok", summary = "", action = "", tips: string[] = [];
  if (v >= 12 && v <= 20) {
    severity = "ok";
    summary = `Respiratory rate ${v} brpm — normal (12-20).`;
    action = `Practice box-breathing (4-4-4-4) 5 min/day to drift toward 12.`;
    tips = ["Yoga practitioners reach 10-14.", "Slower breath = parasympathetic activation.", "5 min controlled breathing pre-bed.", `${v} brpm is healthy.`];
  } else if (v < 12) {
    severity = "warn";
    summary = `Respiratory rate ${v} brpm — below normal (12-20).`;
    action = `If you feel dizzy or sluggish, contact a doctor today.`;
    tips = ["Very slow breath can signal sedation/neuro issue.", "Check medications (opioids, sedatives).", "Monitor for confusion or lightheadedness.", `${12 - v} brpm below the normal floor.`];
  } else if (v <= 25) {
    severity = "warn";
    summary = `⚠️ Respiratory rate ${v} brpm — elevated (normal 12-20).`;
    action = `Sit, slow breathing 5 min, recheck. Persistent? See doctor.`;
    tips = [`You're ${v - 20} brpm above normal.`, "Common with stress, anxiety, fever.", "If shortness of breath — see doctor.", "Cool air / fresh air helps."];
  } else {
    severity = "critical";
    summary = `🚨 Respiratory rate ${v} brpm — VERY HIGH. Seek medical attention.`;
    action = `Call doctor or ER if persistent or with chest pain.`;
    tips = [">25 brpm at rest is a clinical red flag.", "Possible infection, asthma, PE, anxiety attack.", "Do NOT exercise.", "Sit upright, slow breathing while seeking help."];
  }
  return { summary, tips, progress: Math.max(0, Math.min(100, progress)), severity, action };
}

/* ---------- DISTANCE ---------- */
export function getDistanceTip(m: HealthMetrics, _p?: UserProfile | null): TipResult {
  const remaining = Math.max(0, m.distanceGoal - m.distance);
  const pct = Math.round((m.distance / m.distanceGoal) * 100);
  const progress = Math.min(100, pct);
  const minutes = Math.ceil(remaining / 0.08); // ~5 km/h
  let severity: Severity = "ok";
  if (pct < 30) severity = "critical";
  else if (pct < 70) severity = "warn";

  const summary = remaining === 0
    ? `🏃 ${m.distance.toFixed(1)} / ${m.distanceGoal} km — goal exceeded!`
    : `${m.distance.toFixed(1)} / ${m.distanceGoal} km — ${remaining.toFixed(1)} km to go.`;
  const action = remaining === 0
    ? `Recovery walk tomorrow is fine — you earned it.`
    : `Walk ${minutes} min at moderate pace to cover the remaining ${remaining.toFixed(1)} km.`;
  const tips = remaining === 0
    ? ["Bump goal +1 km tomorrow.", "Great distance day.", `Equivalent to ~${Math.round(m.distance * 1300)} steps.`]
    : pct < 30
      ? [`🚨 Only ${pct}% — schedule a ${minutes}-min walk today.`, "Walk to errands instead of driving.", `${remaining.toFixed(1)} km ≈ a podcast episode.`, "Break into 2 short walks if needed."]
      : [`${minutes}-min walk closes the gap.`, "New route = more enjoyable.", "Evening walk + friend = social + steps.", "Treadmill works if weather is bad."];
  return { summary, tips, progress, severity, action };
}

/* ---------- BODY COMP ---------- */
export function getBodyCompTip(m: HealthMetrics, p?: UserProfile | null): TipResult {
  const note = profileNote(p);
  const progress = Math.max(0, Math.min(100, Math.round(((30 - m.bodyFat) / 30) * 100)));
  let severity: Severity = "ok", summary = "", action = "", tips: string[] = [];

  if (m.bodyFat < 8) {
    severity = "critical";
    summary = `Body fat ${m.bodyFat}% — extremely low.${note}`;
    action = `Increase calories by 300/day and consult a sports nutritionist.`;
    tips = ["<8% risks hormonal issues (esp. for women).", "Not sustainable outside competition.", "Prioritize sleep & adequate fats.", "Get bloodwork done."];
  } else if (m.bodyFat <= 20) {
    severity = "ok";
    summary = `Body fat ${m.bodyFat}%, lean ${m.leanMass} kg — athletic.${note}`;
    action = `Maintain with strength 3-4x/week and ~${p ? Math.round((p.units === "imperial" ? p.weight * 0.4536 : p.weight) * 1.8) : 130} g protein/day.`;
    tips = ["Track monthly — fluctuations are normal.", "Don't chase lower BF without reason.", "Mix strength + cardio.", `Lean mass ${m.leanMass} kg is your engine — protect it.`];
  } else if (m.bodyFat <= 30) {
    severity = "warn";
    summary = `Body fat ${m.bodyFat}%, lean ${m.leanMass} kg.${note} Aim 15-20%.`;
    const targetBF = 18;
    const fatLossKg = ((m.bodyFat - targetBF) / 100 * (m.weight || 75)).toFixed(1);
    action = `Lose ~${fatLossKg} kg fat. Eat in a 500-cal/day deficit + strength 3x/week.`;
    tips = [`To hit ${targetBF}% you need to lose ~${fatLossKg} kg fat.`, "Protein 1.6-2.2 g/kg preserves lean mass while cutting.", p?.goal === "lose" ? "500-cal deficit ≈ 0.5 kg/week loss." : "Reduce refined carbs first.", "Track monthly, not daily."];
  } else {
    severity = "critical";
    summary = `🚨 Body fat ${m.bodyFat}% — above healthy range.${note}`;
    const targetBF = 25;
    const fatLossKg = ((m.bodyFat - targetBF) / 100 * (m.weight || 75)).toFixed(1);
    action = `Start with 30 min daily walk + 500-cal deficit. Target ${fatLossKg} kg fat loss to reach ${targetBF}%.`;
    tips = [`~${fatLossKg} kg fat to lose to reach ${targetBF}%.`, "Begin with walking — sustainable beats extreme.", "Cut sugar-sweetened drinks first (biggest win).", "Aim 0.5-1% BF/month — slow = lasting."];
  }
  return { summary, tips, progress, severity, action };
}

/* ---------- HEALTH SCORE ---------- */
export function getHealthScoreTip(m: HealthMetrics) {
  const s = m.healthScore;
  const label = s >= 80 ? "Excellent" : s >= 60 ? "Good" : s >= 40 ? "Fair" : "Needs Work";
  const severity: Severity = s >= 60 ? "ok" : s >= 40 ? "warn" : "critical";
  return { label, score: s, severity };
}
