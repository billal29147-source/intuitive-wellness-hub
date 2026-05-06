import { Exercise } from "@/lib/exerciseData";
import ExerciseAnimation from "./ExerciseAnimation";

interface Props {
  exercises: Exercise[];
  color: string;
}

export default function ExerciseList({ exercises, color }: Props) {
  return (
    <div className="space-y-1.5 mt-2">
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-1">Exercises</p>
      {exercises.map((ex) => (
        <div key={ex.id} className="flex items-center gap-2 py-1.5 px-2 rounded-lg bg-muted/30">
          <ExerciseAnimation animId={ex.animId} color={color} />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium truncate">{ex.name}</p>
            <p className="text-[10px] text-muted-foreground">{ex.cue}</p>
          </div>
          <div className="text-right flex-shrink-0">
            <p className={`text-xs font-bold ${color}`}>
              {ex.sets > 1 ? `${ex.reps} × ${ex.sets}` : ex.reps}
            </p>
            {ex.restSec > 0 && (
              <p className="text-[9px] text-muted-foreground">{ex.restSec}s rest</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
