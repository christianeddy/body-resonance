import { useState, useEffect, useRef, lazy, Suspense } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Play, Pause, ArrowCounterClockwise, Check } from "@phosphor-icons/react";

const BreathingSphere3D = lazy(() => import("@/components/BreathingSphere3D"));
import { usePractice } from "@/hooks/usePractices";
import { useSaveSession } from "@/hooks/useSessions";
import { toast } from "sonner";

const Player = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: practice, isLoading } = usePractice(id);
  const saveSession = useSaveSession();

  const [isPlaying, setIsPlaying] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [exiting, setExiting] = useState(false);
  const [feeling, setFeeling] = useState<string | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const feelings = ["Poderoso", "Orgulloso", "En calma", "Energizado"];

  // Timer
  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => setElapsed((e) => e + 1), 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isPlaying]);

  // Visual mode: cycle through phases
  const phases = practice?.phases && Array.isArray(practice.phases) ? practice.phases : [];
  let totalPhaseDuration = 0;
  phases.forEach((p: any) => { totalPhaseDuration += p.duration || 0; });
  const cycleDuration = totalPhaseDuration || 16; // fallback 16s cycle

  const cycleElapsed = elapsed % cycleDuration;
  let currentPhaseName = "";
  let currentPhaseDuration = 4;
  let phaseTimeLeft = 0;
  let accumulated = 0;
  for (const phase of phases) {
    const dur = phase.duration || 4;
    if (cycleElapsed < accumulated + dur) {
      currentPhaseName = phase.name || "";
      currentPhaseDuration = dur;
      phaseTimeLeft = dur - (cycleElapsed - accumulated);
      break;
    }
    accumulated += dur;
  }
  if (!currentPhaseName && phases.length > 0) {
    currentPhaseName = phases[0].name;
    currentPhaseDuration = phases[0].duration || 4;
    phaseTimeLeft = currentPhaseDuration;
  }

  const getPhaseClass = (name: string): string => {
    const lower = name.toLowerCase();
    if (lower.includes("inhal")) return "breathing-phase--inhale";
    if (lower.includes("exhal")) return "breathing-phase--exhale";
    if (lower.includes("reten")) return "breathing-phase--hold";
    return "";
  };

  const isVisualPlaying = practice?.media_mode === "visual" && isPlaying;
  const phaseClass = isVisualPlaying && currentPhaseName ? getPhaseClass(currentPhaseName) : "";

  const handleComplete = () => {
    setIsPlaying(false);
    setExiting(true);
    setTimeout(() => {
      setExiting(false);
      setCompleted(true);
    }, 300);
  };

  const handleSaveAndBack = async () => {
    if (practice && feeling) {
      try {
        await saveSession.mutateAsync({
          practice_id: practice.id,
          practice_name: practice.display_name,
          duration_seconds: elapsed,
          feeling,
        });
        toast.success("Sesión guardada");
      } catch {
        toast.error("Error guardando sesión");
      }
    }
    navigate(-1);
  };

  // Estimate total duration for progress bar
  const estimatedTotal = totalPhaseDuration > 0 ? totalPhaseDuration * 3 : 300; // 3 cycles or 5 min
  const progress = Math.min((elapsed / estimatedTotal) * 100, 100);

  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-background">
        <div className="h-6 w-6 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  if (completed) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background px-5">
        <div className="animate-scale-check mb-8">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-success/20">
            <Check size={40} weight="duotone" className="text-success" />
          </div>
        </div>
        <h1 className="font-display text-2xl text-foreground mb-2">¡Lo lograste!</h1>
        <p className="font-body text-sm text-muted-foreground mb-8">¿Cómo te sentiste?</p>
        <div className="grid grid-cols-2 gap-3 w-full max-w-xs mb-10">
          {feelings.map((f) => (
            <button
              key={f}
              onClick={() => setFeeling(f)}
              className={`rounded-xl border py-3 font-display text-xs transition-all duration-200 ${
                feeling === f
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        <button
          onClick={handleSaveAndBack}
          className="font-display text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Volver
        </button>
      </div>
    );
  }

  return (
    <div className="animate-player-enter min-h-screen w-full flex flex-col items-center justify-center bg-background px-5">
      {/* Practice name */}
      <p className="font-display text-lg text-foreground mb-1">
        {practice?.display_name || "Práctica"}
      </p>
      <p className="font-body text-sm text-muted-foreground mb-12">Respira con Lore</p>

      {/* 3D Breathing Sphere */}
      <Suspense fallback={<div className="w-[260px] h-[260px] flex items-center justify-center"><div className="h-6 w-6 rounded-full border-2 border-primary border-t-transparent animate-spin" /></div>}>
        <BreathingSphere3D
          phase={currentPhaseName}
          isPlaying={isVisualPlaying}
          phaseDuration={currentPhaseDuration}
          className={`mb-8 transition-opacity duration-300 ${exiting ? "opacity-0" : ""}`}
        />
      </Suspense>

      {/* Progress bar */}
      <div className="w-full max-w-xs mb-8">
        <div className="h-0.5 w-full rounded-full bg-border">
          <div
            className="h-full rounded-full bg-primary transition-all duration-1000"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-10">
        <button
          onClick={() => setElapsed(Math.max(0, elapsed - 15))}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowCounterClockwise size={24} weight="duotone" />
        </button>
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground"
        >
          {isPlaying ? <Pause size={24} weight="duotone" /> : <Play size={24} weight="duotone" className="ml-0.5" />}
        </button>
        <div className="w-6" />
      </div>

      {/* Complete button */}
      <button
        onClick={handleComplete}
        className="mt-16 font-body text-xs text-muted-foreground hover:text-foreground transition-colors border border-border rounded-lg px-4 py-2.5"
      >
        Terminar sesión
      </button>
    </div>
  );
};

export default Player;
