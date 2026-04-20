import { HealthMetrics } from "@/contexts/HealthDataContext";
import { UserProfile } from "@/contexts/AuthContext";
import { calcBMI, bmiCategory } from "@/lib/profileMath";

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

export function getStepsTip(m: HealthMetrics, p?: UserProfile | null) {
  const remaining = Math.max(0, m.stepsGoal - m.steps);
  const progress = Math.min(100, Math.round((m.steps / m.stepsGoal) * 100));
  const goalNote = p ? ` Your goal of ${m.stepsGoal.toLocaleString()} is set for your ${p.activityLevel.replace("_", " ")} activity level.` : "";
  const summary = remaining === 0
    ? `Amazing${p?.name ? `, ${p.name}` : ""}! You've hit your ${m.stepsGoal.toLocaleString()} step goal with ${m.steps.toLocaleString()} steps! 🎉`
    : `You've taken ${m.steps.toLocaleString()} steps and need ${remaining.toLocaleString()} more.${goalNote}`;
  const lossBoost = p?.goal === "lose" ? " Walking after meals also helps blunt blood-sugar spikes — key for fat loss." : "";
  const tips = remaining === 0
    ? ["You've crushed your goal! Consider increasing it tomorrow.", "Stay active — even exceeding your goal has benefits.", `Walking is one of the best things for longevity${p && p.age >= 50 ? " — especially in your age group." : "."}`]
    : remaining < 2000
      ? [`A quick 15-minute walk covers about 1,500-2,000 steps — you're almost there!${lossBoost}`, "Try taking the stairs instead of the elevator for the rest of the day.", "Walk while on phone calls to add steps without extra time.", "Park farther from entrances to sneak in extra steps."]
      : [`You need ${remaining.toLocaleString()} more steps. Try a 30-minute brisk walk to cover ~3,000 steps.${lossBoost}`, "Break it up: 10-minute walks after each meal add up fast.", "Explore a new walking route to make it enjoyable.", "Set hourly reminders to get up and walk for 5 minutes."];
  return { summary, tips, progress };
}

export function getHeartTip(m: HealthMetrics, p?: UserProfile | null) {
  const bpm = m.heartRate;
  let summary: string, tips: string[];
  const progress = Math.min(100, Math.round(((100 - Math.abs(bpm - 65)) / 100) * 100));

  if (bpm < 40) {
    summary = `⚠️ Your heart rate is ${bpm} bpm — this is dangerously low (bradycardia). Seek medical attention immediately.`;
    tips = ["This is a medical emergency — contact a doctor or go to the ER now.", "Do not exercise until cleared by a medical professional.", "Symptoms like dizziness, fainting, or shortness of breath require immediate attention.", "Severe bradycardia can indicate heart block or other serious conditions."];
  } else if (bpm < 50) {
    summary = `Your heart rate is ${bpm} bpm — this is very low. Unless you're a trained athlete, consult a doctor.`;
    tips = ["Athletes often have resting heart rates of 40-50 bpm — this can be normal for them.", "If you feel dizzy, lightheaded, or fatigued, see a doctor soon.", "Low heart rate can be caused by certain medications — check with your pharmacist.", "Monitor for symptoms: fatigue, weakness, or confusion."];
  } else if (bpm < 60) {
    summary = `Your heart rate is ${bpm} bpm — on the low-normal side. Often seen in fit individuals.`;
    tips = ["A heart rate of 50-60 bpm is common in well-conditioned athletes.", "This is generally healthy — your heart is efficient at pumping blood.", "Continue regular exercise to maintain cardiovascular fitness.", "If you experience any unusual symptoms, consult your doctor."];
  } else if (bpm <= 80) {
    summary = `Your heart rate is ${bpm} bpm — perfectly healthy! The normal range is 60-100 bpm.`;
    tips = ["Practice deep breathing (4-7-8 technique) to further optimize your heart rate.", "Regular cardio 3-4x per week strengthens your heart over time.", "Reduce caffeine in the afternoon — it can elevate heart rate for hours.", "Meditation can lower resting heart rate by 5-10 bpm over weeks."];
  } else if (bpm <= 100) {
    summary = `Your heart rate is ${bpm} bpm — slightly elevated but still within normal range. Try to relax.`;
    tips = ["Try slow, deep breathing for 5 minutes to bring your heart rate down.", "Reduce caffeine and stimulant intake — they raise resting heart rate.", "Check if you're dehydrated — dehydration can increase heart rate.", "Stress and anxiety can elevate heart rate — try a calming activity."];
  } else if (bpm <= 120) {
    summary = `⚠️ Your heart rate is ${bpm} bpm — this is high for a resting rate. Rest and monitor.`;
    tips = ["Sit or lie down and practice slow breathing immediately.", "If this persists at rest for more than 15 minutes, contact a doctor.", "Avoid caffeine, alcohol, and intense activity until it comes down.", "Dehydration, fever, or stress can cause elevated heart rate — address these first."];
  } else {
    summary = `🚨 Your heart rate is ${bpm} bpm — this is dangerously high! Seek immediate medical attention.`;
    tips = ["Stop all activity immediately and sit or lie down.", "Call emergency services if you feel chest pain, shortness of breath, or dizziness.", "Do NOT try to exercise or 'push through' — this is dangerous.", "Tachycardia above 120 bpm at rest can indicate a serious cardiac event."];
  }
  return { summary, tips, progress: Math.max(0, progress) };
}

export function getSleepTip(m: HealthMetrics, p?: UserProfile | null) {
  const totalMin = m.sleepHours * 60 + m.sleepMinutes;
  const band = ageBand(p?.age);
  const goalMin = band === "teen" ? 540 : band === "senior" ? 450 : 480;
  const goalH = Math.round(goalMin / 60);
  const progress = Math.min(100, Math.round((totalMin / goalMin) * 100));
  const diff = goalMin - totalMin;
  const summary = diff <= 0
    ? `Great! You slept ${m.sleepHours}h ${m.sleepMinutes}m — you've met your ${goalH}-hour target! Deep sleep: ${m.deepSleepHours}h ${m.deepSleepMinutes}m.`
    : `You slept ${m.sleepHours}h ${m.sleepMinutes}m — you're ${diff} min short of your ${goalH}h target${p?.age ? ` (recommended for age ${p.age})` : ""}. Deep sleep: ${m.deepSleepHours}h ${m.deepSleepMinutes}m.`;
  const tips = diff > 60
    ? [`Go to bed ${diff} minutes earlier tonight to hit your ${goalH}-hour goal.`, "Avoid screens 1 hour before bed — blue light delays deep sleep.", "Keep your room at 65-68°F (18-20°C) for optimal sleep quality.", "Consider a magnesium supplement before bed for deeper sleep."]
    : diff > 0
      ? [`You're only ${diff} minutes away! Go to bed just a bit earlier tonight.`, "A consistent bedtime routine improves both sleep duration and quality.", "Avoid large meals 2-3 hours before bed for better sleep.", "Try reading instead of scrolling before bed."]
      : ["You're sleeping great! Maintain your current sleep schedule.", "Even with enough hours, consistency matters — try to sleep and wake at the same times.", "Track your deep sleep ratio — aim for 20-25% of total sleep.", "Quality > quantity: focus on minimizing wake-ups during the night."];
  return { summary, tips, progress };
}

export function getCaloriesTip(m: HealthMetrics, p?: UserProfile | null) {
  const remaining = Math.max(0, m.caloriesGoal - m.activeCalories);
  const progress = Math.min(100, Math.round((m.activeCalories / m.caloriesGoal) * 100));
  const goalContext = p ? ` (set for your ${p.goal} goal)` : "";
  const summary = remaining === 0
    ? `You've burned ${m.activeCalories} active calories — goal of ${m.caloriesGoal} achieved!${goalContext} 🔥`
    : `You've burned ${m.activeCalories} of ${m.caloriesGoal} active cal${goalContext}. ${remaining} more to go!`;
  const styleTip = p?.workoutStyle === "strength"
    ? "Add 10 min of weighted carries — burns calories AND builds muscle."
    : p?.workoutStyle === "yoga"
      ? "A power-yoga flow can burn ~5 cal/min while still being recovery-friendly."
      : p?.workoutStyle === "hiit"
        ? "A 12-min Tabata circuit (8 rounds, 20s/10s) burns ~150 cal."
        : "Mix bodyweight intervals with steady cardio for the best burn.";
  const tips = remaining === 0
    ? ["Goal smashed! Consider adding a cool-down stretch.", "Great burn today! Make sure to refuel with protein.", "You can increase your goal tomorrow if this felt comfortable."]
    : remaining < 100
      ? ["You're almost there! A quick 10-minute walk will finish it off.", "Light stretching or yoga can burn the remaining calories.", "Even household chores count — clean up and close your goal!"]
      : [`A 20-minute HIIT session can burn 150-250 calories — perfect for your ${remaining} cal gap.`, styleTip, "A 30-minute moderate walk burns about 100-150 calories.", "Dancing to music for 15 minutes burns roughly 100 calories!"];
  return { summary, tips, progress };
}

export function getWaterTip(m: HealthMetrics, p?: UserProfile | null) {
  const remaining = Math.max(0, m.waterGoal - m.water);
  const progress = Math.min(100, Math.round((m.water / m.waterGoal) * 100));
  const summary = remaining === 0
    ? `You've hit your hydration goal of ${m.waterGoal} glasses! 💧 Well done!`
    : `You've had ${m.water} of ${m.waterGoal} glasses. Drink ${remaining} more to hit your goal!`;
  const tips = remaining === 0
    ? ["Great hydration! Keep sipping water throughout the day.", "Staying hydrated improves energy, skin, and cognitive function.", "Even after hitting your goal, drink when thirsty."]
    : [`Drink ${remaining} more glass${remaining > 1 ? "es" : ""} — set a reminder for one now and one with dinner.`, "Keep a water bottle visible — people who see water drink 25% more.", "Eat water-rich foods like cucumber, watermelon, or oranges.", "Drink a glass 30 min before each meal — aids digestion too."];
  return { summary, tips, progress };
}

export function getStreakTip(m: HealthMetrics, _p?: UserProfile | null) {
  const nextMilestone = m.streak < 7 ? 7 : m.streak < 14 ? 14 : m.streak < 21 ? 21 : m.streak < 30 ? 30 : m.streak < 60 ? 60 : m.streak < 100 ? 100 : m.streak + 10;
  const daysLeft = nextMilestone - m.streak;
  const progress = Math.min(100, Math.round((m.streak / nextMilestone) * 100));
  const summary = `You're on a ${m.streak}-day streak! Next milestone: ${nextMilestone} days (${daysLeft} days away).`;
  const tips = [
    `Keep going for ${daysLeft} more day${daysLeft > 1 ? "s" : ""} to hit ${nextMilestone} days!`,
    "Consistency beats intensity — even light activity keeps your streak alive.",
    "Share your streak with friends for accountability.",
    "It takes roughly 21 days to form a lasting habit — you're building one!",
  ];
  return { summary, tips, progress };
}

export function getSpo2Tip(m: HealthMetrics, _p?: UserProfile | null) {
  const val = m.spo2;
  const progress = val;
  let summary: string, tips: string[];
  if (val >= 95) {
    summary = `Your SpO2 is ${val}% — excellent! Normal range is 95-100%.`;
    tips = ["Practice deep diaphragmatic breathing to maintain great levels.", "Regular aerobic exercise improves oxygen utilization.", "Spending time outdoors in fresh air helps maintain healthy SpO2.", "Your blood oxygen is in the healthy range — keep it up!"];
  } else if (val >= 90) {
    summary = `⚠️ Your SpO2 is ${val}% — borderline low. Normal is 95-100%. Monitor closely.`;
    tips = ["Take slow, deep breaths for 5 minutes and re-check.", "If this persists, consult a doctor — it may indicate a respiratory issue.", "Avoid high-altitude activities until your SpO2 normalizes.", "Certain medications and conditions can lower SpO2 — review with your doctor."];
  } else {
    summary = `🚨 Your SpO2 is ${val}% — dangerously low! This requires immediate medical attention.`;
    tips = ["Seek medical help immediately — low SpO2 can be life-threatening.", "Sit upright and take slow, deep breaths while waiting for help.", "Do NOT exercise or exert yourself with SpO2 below 90%.", "This can indicate pneumonia, COPD, asthma attack, or other serious conditions."];
  }
  return { summary, tips, progress };
}

export function getRespTip(m: HealthMetrics, _p?: UserProfile | null) {
  const val = m.respRate;
  const progress = val <= 20 && val >= 12 ? Math.round(((20 - Math.abs(val - 16)) / 20) * 100) : val < 12 ? 30 : 30;
  let summary: string, tips: string[];
  if (val >= 12 && val <= 20) {
    summary = `Your respiratory rate is ${val} breaths/min — within normal range (12-20). ${val <= 14 ? "Excellent relaxation!" : "Aim for 12-14 for peak calm."}`;
    tips = ["Try box breathing (4s in, 4s hold, 4s out, 4s hold) to train slower breaths.", "Yoga practitioners often achieve 10-14 breaths per minute.", "Slower breathing activates your parasympathetic nervous system.", "Practice 5 minutes of controlled breathing before bed."];
  } else if (val < 12) {
    summary = `Your respiratory rate is ${val} breaths/min — below normal (12-20). Monitor for symptoms.`;
    tips = ["Very slow breathing can indicate sedation or neurological issues.", "If you feel dizzy or lightheaded, seek medical attention.", "Some medications can slow breathing — check with your doctor.", "Monitor closely and note if it stays this low."];
  } else {
    summary = `⚠️ Your respiratory rate is ${val} breaths/min — elevated (normal: 12-20). Try to relax.`;
    tips = ["Practice slow breathing exercises to bring your rate down.", "Elevated respiratory rate can indicate stress, anxiety, or illness.", "If accompanied by shortness of breath, see a doctor.", "Ensure you're not in a hot, stuffy environment — fresh air helps."];
  }
  return { summary, tips, progress: Math.max(0, Math.min(100, progress)) };
}

export function getDistanceTip(m: HealthMetrics, _p?: UserProfile | null) {
  const remaining = Math.max(0, m.distanceGoal - m.distance);
  const progress = Math.min(100, Math.round((m.distance / m.distanceGoal) * 100));
  const summary = remaining === 0
    ? `You've covered ${m.distance} km — exceeding your ${m.distanceGoal} km goal! 🏃`
    : `You've covered ${m.distance} km — you need ${remaining.toFixed(1)} km more to hit your ${m.distanceGoal} km goal.`;
  const tips = remaining === 0
    ? ["Goal complete! Great job getting your distance in today.", "Consider increasing your distance goal if this felt easy.", "Recovery walk tomorrow is fine — you've earned it!"]
    : [`A ${Math.ceil(remaining / 0.12)}-minute walk at moderate pace covers about ${remaining.toFixed(1)} km.`, "Walk to nearby errands instead of driving.", "Explore a new route — novelty makes walking enjoyable.", "An evening walk with a friend adds distance and social time."];
  return { summary, tips, progress };
}

export function getBodyCompTip(m: HealthMetrics, p?: UserProfile | null) {
  const progress = Math.min(100, Math.round(((30 - m.bodyFat) / 30) * 100));
  const note = profileNote(p);
  let summary: string, tips: string[];
  if (m.bodyFat < 10) {
    summary = `Your body fat is ${m.bodyFat}% — extremely low.${note}`;
    tips = ["Body fat below 10% is typically only for competition — not sustainable long-term.", "Ensure adequate calorie intake to maintain hormonal health.", "Very low body fat can weaken immune function.", "Consider consulting a sports nutritionist."];
  } else if (m.bodyFat <= 20) {
    summary = `Your body fat is ${m.bodyFat}% with ${m.leanMass} kg lean mass — athletic range!${note}`;
    tips = ["You're in great shape! Maintain with consistent strength training.", `Hit ~${p ? Math.round((p.units === "imperial" ? p.weight * 0.4536 : p.weight) * 1.8) : "120-150"}g protein/day to preserve lean mass.`, "Track monthly — small fluctuations are normal.", "Balance strength and cardio for overall fitness."];
  } else if (m.bodyFat <= 30) {
    summary = `Your body fat is ${m.bodyFat}% with ${m.leanMass} kg lean mass.${note} Aim for 15-20% for athletic fitness.`;
    tips = ["Strength training 3-4x per week builds lean mass and burns more calories at rest.", "Eat 1.6-2.2g protein per kg body weight daily.", p?.goal === "lose" ? "Aim for a ~500 cal/day deficit (~0.5 kg/week loss)." : "Reduce refined carbs and sugars to recomp body fat.", "Track body composition monthly, not daily."];
  } else {
    summary = `Your body fat is ${m.bodyFat}% — above recommended range.${note} Focus on gradual fat loss.`;
    tips = ["Start with 30 minutes of moderate exercise daily.", "Reduce processed foods and increase whole foods.", "Aim to lose 0.5-1% body fat per month for sustainable results.", "Consult a nutritionist for a personalized plan."];
  }
  return { summary, tips, progress: Math.max(0, progress) };
}

export function getHealthScoreTip(m: HealthMetrics) {
  const score = m.healthScore;
  let label = score >= 80 ? "Excellent" : score >= 60 ? "Good" : score >= 40 ? "Fair" : "Needs Work";
  return { label, score };
}
