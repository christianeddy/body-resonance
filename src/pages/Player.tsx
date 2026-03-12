import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Play, Pause, RotateCcw, Check } from "lucide-react";

const Player = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isPlaying, setIsPlaying] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [feeling, setFeeling] = useState<string | null>(null);

  const feelings = ["Poderoso", "Orgulloso", "En calma", "Energizado"];

  if (completed) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background px-5">
        <div className="animate-scale-check mb-8">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-success/20">
            <Check size={40} strokeWidth={1.5} className="text-success" />
          </div>
        </div>
        <h1 className="font-display text-2xl text-foreground mb-8">¡LO LOGRASTE!</h1>
        <div className="grid grid-cols-2 gap-3 w-full max-w-xs mb-10">
          {feelings.map((f) => (
            <button
              key={f}
              onClick={() => setFeeling(f)}
              className={`rounded-xl border py-3 font-display text-xs transition-all duration-200 ${
                feeling === f
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-[hsl(0_0%_100%/0.12)] text-muted-foreground hover:text-foreground"
              }`}
            >
              {f.toUpperCase()}
            </button>
          ))}
        </div>
        <button
          onClick={() => navigate(-1)}
          className="font-display text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          VOLVER
        </button>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-5">
      {/* Practice name */}
      <p className="font-display text-lg text-foreground mb-1">Arrancar con energía</p>
      <p className="font-body text-sm text-muted-foreground mb-12">Respira con Lore</p>

      {/* Breathing Circle — THE STAR */}
      <div className="breathing-circle mb-12">
        <div className="breathing-ring breathing-ring--outer" />
        <div className="breathing-ring breathing-ring--middle" />
        <div className="breathing-ring breathing-ring--inner" />
        <div className="breathing-glow" />
      </div>

      {/* Progress bar */}
      <div className="w-full max-w-xs mb-8">
        <div className="h-0.5 w-full rounded-full bg-[hsl(0_0%_100%/0.06)]">
          <div
            className="h-full rounded-full bg-primary animate-progress-fill transition-all"
            style={{ width: isPlaying ? "65%" : "0%" }}
          />
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-10">
        <button className="text-muted-foreground hover:text-foreground transition-colors">
          <RotateCcw size={24} strokeWidth={1.5} />
        </button>
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground"
        >
          {isPlaying ? <Pause size={24} /> : <Play size={24} className="ml-0.5" />}
        </button>
        {/* Spacer for symmetry */}
        <div className="w-6" />
      </div>

      {/* Dev: complete button */}
      <button
        onClick={() => setCompleted(true)}
        className="mt-16 font-body text-xs text-muted-foreground/40 hover:text-muted-foreground transition-colors"
      >
        [dev] completar
      </button>
    </div>
  );
};

export default Player;
