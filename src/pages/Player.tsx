import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Play, Pause, ArrowCounterClockwise, Check, ArrowClockwise, House } from "@phosphor-icons/react";

import BreathingCircle from "@/components/BreathingCircle";
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
  const [audioDuration, setAudioDuration] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const isAudioMode = practice?.media_mode === "audio" && !!practice?.media_url;

  // Audio setup & control
  useEffect(() => {
    if (!isAudioMode || !practice?.media_url) return;

    const audio = new Audio(practice.media_url);
    audio.preload = "auto";
    audioRef.current = audio;

    audio.addEventListener("loadedmetadata", () => {
      if (isFinite(audio.duration)) setAudioDuration(Math.round(audio.duration));
    });

    audio.addEventListener("ended", () => {
      setIsPlaying(false);
    });

    return () => {
      audio.pause();
      audio.src = "";
      audioRef.current = null;
      setAudioDuration(0);
    };
  }, [isAudioMode, practice?.media_url]);

  useEffect(() => {
    if (!audioRef.current || !isAudioMode) return;
    if (isPlaying) {
      audioRef.current.play().catch(() => {});
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying, isAudioMode]);

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
  const defaultPhases = [
    { name: "Inhala", duration: 4 },
    { name: "Retención", duration: 4 },
    { name: "Exhala", duration: 4 },
    { name: "Retención", duration: 4 },
  ];
  const phases = practice?.phases && Array.isArray(practice.phases) && (practice.phases as any[]).length > 0
    ? (practice.phases as any[])
    : defaultPhases;
  let totalPhaseDuration = 0;
  phases.forEach((p: any) => { totalPhaseDuration += p.duration || 0; });
  const cycleDuration = totalPhaseDuration || 16;

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

  const isVisualPlaying = isPlaying;
  const phaseClass = isVisualPlaying && currentPhaseName ? getPhaseClass(currentPhaseName) : "";

  // Estimate total duration for progress bar
  const estimatedTotal = isAudioMode && audioDuration > 0
    ? audioDuration
    : totalPhaseDuration > 0 ? totalPhaseDuration * 3 : 300;
  const completionPercent = estimatedTotal > 0 ? (elapsed / estimatedTotal) * 100 : 100;
  const isValidCompletion = completionPercent >= 70;
  const handleComplete = () => {
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
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
          estimated_duration_seconds: estimatedTotal,
          feeling,
        });
        toast.success("Sesión guardada");
      } catch {
        toast.error("Error guardando sesión");
      }
    }
    navigate(-1);
  };

  const progress = Math.min((elapsed / estimatedTotal) * 100, 100);

  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-background">
        <div className="h-6 w-6 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  if (completed && !isValidCompletion) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background px-5">
        <div className="flex gap-4">
          <button
            onClick={() => {
              setCompleted(false);
              setElapsed(0);
              setFeeling(null);
              if (audioRef.current) audioRef.current.currentTime = 0;
            }}
            className="flex items-center gap-2 rounded-xl border border-primary bg-primary text-primary-foreground px-5 py-3 font-display text-sm transition-all"
          >
            <ArrowClockwise size={18} weight="bold" />
            Reintentar
          </button>
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 rounded-xl border border-border text-muted-foreground hover:text-foreground px-5 py-3 font-display text-sm transition-all"
          >
            <House size={18} weight="duotone" />
            Inicio
          </button>
        </div>
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
      <BreathingCircle
        phase={currentPhaseName}
        isPlaying={isVisualPlaying}
        phaseDuration={currentPhaseDuration}
        className={`mb-8 transition-opacity duration-300 ${exiting ? "opacity-0" : ""}`}
      />

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
          onClick={() => {
            setElapsed(Math.max(0, elapsed - 15));
            if (audioRef.current) {
              audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 15);
            }
          }}
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
