import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check, ArrowLeft } from "@phosphor-icons/react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const steps = [
  {
    question: "¿Cómo te sientes últimamente?",
    options: ["Estresado", "Cansado", "Con buena energía", "Desconectado de mi cuerpo"],
  },
  {
    question: "¿Qué te gustaría lograr?",
    options: ["Mejorar mi rendimiento deportivo", "Gestionar mejor el estrés", "Dormir mejor", "Sentirme más fuerte mentalmente"],
  },
  {
    question: "¿Has practicado respiración consciente?",
    options: ["Nunca", "A veces", "Regularmente"],
  },
  {
    question: "¿Tienes acceso a inmersión en frío o sauna?",
    options: ["Inmersión en frío", "Sauna", "Ambos", "Ninguno"],
  },
];

const Onboarding = () => {
  const navigate = useNavigate();
  const { user, refreshProfile } = useAuth();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<(string | null)[]>([null, null, null, null]);
  const [saving, setSaving] = useState(false);
  const [direction, setDirection] = useState<"forward" | "back">("forward");
  const [showSummary, setShowSummary] = useState(false);

  const current = steps[step];
  const selected = answers[step];
  const isLast = step === steps.length - 1;

  const select = (option: string) => {
    const next = [...answers];
    next[step] = option;
    setAnswers(next);
  };

  const saveProfile = async () => {
    setSaving(true);
    try {
      const userProfile = answers[1] === "Mejorar mi rendimiento deportivo" ? "deportivo" : "bienestar";
      const { error } = await supabase
        .from("profiles")
        .update({
          onboarding_answers: answers,
          user_profile: userProfile,
          onboarding_completed: true,
        })
        .eq("user_id", user!.id);
      if (error) throw error;
      await refreshProfile();
      navigate("/");
    } catch (err: any) {
      toast.error("Error guardando respuestas");
    } finally {
      setSaving(false);
    }
  };

  const advance = () => {
    if (isLast) {
      setShowSummary(true);
    } else {
      setDirection("forward");
      setStep(step + 1);
    }
  };

  const goBack = () => {
    setDirection("back");
    setStep(step - 1);
  };

  const animClass =
    direction === "forward"
      ? "animate-fade-slide-in"
      : "animate-fade-slide-in [animation-direction:reverse]";

  if (showSummary) {
    return (
      <div className="min-h-screen w-full bg-background">
        <div className="flex min-h-screen flex-col px-5">
          <div className="pt-14 pb-10">
            <h1 className="font-display text-2xl text-foreground">TU PERFIL</h1>
          </div>

          <div className="flex-1 animate-fade-slide-in">
            {steps.map((s, i) => (
              <div key={i} className="card-body rounded-xl p-3 mb-2">
                <p className="text-xs text-muted-foreground mb-1">{s.question}</p>
                <p className="text-sm text-foreground">{answers[i] ?? "—"}</p>
              </div>
            ))}
          </div>

          <div className="pb-10 pt-6 space-y-3">
            <button
              onClick={saveProfile}
              disabled={saving}
              className="w-full rounded-xl py-4 font-display text-sm bg-primary text-primary-foreground animate-pulse-cta transition-all duration-200"
            >
              {saving ? (
                <div className="h-4 w-4 mx-auto rounded-full border-2 border-primary-foreground border-t-transparent animate-spin" />
              ) : (
                "Comenzar"
              )}
            </button>
            <button
              onClick={() => {
                setShowSummary(false);
                setDirection("back");
                setStep(0);
              }}
              className="w-full py-2 font-display text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Editar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-background">
      <div className="flex min-h-screen flex-col px-5">
        {/* Header: back button + progress bar */}
        <div className="pt-14 pb-10 flex flex-col gap-4">
          <div className="flex items-center">
            {step > 0 ? (
              <button
                onClick={goBack}
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Volver"
              >
                <ArrowLeft size={20} weight="duotone" />
              </button>
            ) : (
              <div className="w-5 h-5" />
            )}
          </div>

          {/* Progress bar */}
          <div className="h-1 w-full max-w-xs mx-auto rounded-full bg-input">
            <div
              className="h-full rounded-full bg-primary transition-all duration-500"
              style={{ width: `${((step + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <div className={`${animClass} flex-1`} key={step}>
          <h1 className="font-display text-2xl text-foreground mb-8">{current.question}</h1>

          <div className="space-y-3">
            {current.options.map((option) => (
              <button
                key={option}
                onClick={() => select(option)}
                className={`card-body w-full rounded-xl p-4 text-left font-body text-sm transition-all duration-200 relative ${
                  selected === option
                    ? "border-primary text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                style={selected === option ? { borderColor: "hsl(var(--primary))" } : {}}
              >
                {option}
                {selected === option && (
                  <Check
                    size={16}
                    weight="duotone"
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-primary"
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Next button */}
        <div className="pb-10 pt-6">
          <button
            onClick={advance}
            disabled={!selected}
            className={`w-full rounded-xl py-4 font-display text-sm transition-all duration-200 ${
              selected
                ? "bg-primary text-primary-foreground animate-pulse-cta"
                : "bg-muted text-muted-foreground cursor-not-allowed"
            }`}
          >
            {isLast ? "Ver resumen" : "Siguiente"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
