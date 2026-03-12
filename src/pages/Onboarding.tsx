import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check } from "lucide-react";
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
    question: "¿Tienes acceso a tina de hielo o sauna?",
    options: ["Tina de hielo", "Sauna", "Ambos", "Ninguno"],
  },
];

const Onboarding = () => {
  const navigate = useNavigate();
  const { user, refreshProfile } = useAuth();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<(string | null)[]>([null, null, null, null]);
  const [saving, setSaving] = useState(false);

  const current = steps[step];
  const selected = answers[step];
  const isLast = step === steps.length - 1;

  const select = (option: string) => {
    const next = [...answers];
    next[step] = option;
    setAnswers(next);
  };

  const advance = async () => {
    if (isLast) {
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
    } else {
      setStep(step + 1);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background px-5">
      {/* Progress dots */}
      <div className="flex justify-center gap-2 pt-14 pb-10">
        {steps.map((_, i) => (
          <div
            key={i}
            className={`h-2 w-2 rounded-full transition-all duration-200 ${
              i === step ? "bg-primary" : "bg-[hsl(0_0%_100%/0.12)]"
            }`}
          />
        ))}
      </div>

      {/* Question */}
      <div className="animate-fade-slide-in" key={step}>
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
              style={selected === option ? { borderColor: "hsl(221 83% 53%)" } : {}}
            >
              {option}
              {selected === option && (
                <Check
                  size={16}
                  strokeWidth={2}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-primary"
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Next button */}
      <div className="mt-auto pb-10">
        <button
          onClick={advance}
          disabled={!selected || saving}
          className={`w-full rounded-xl py-4 font-display text-sm transition-all duration-200 ${
            selected
              ? "bg-primary text-primary-foreground animate-pulse-cta"
              : "bg-muted text-muted-foreground cursor-not-allowed"
          }`}
        >
          {saving ? (
            <div className="h-4 w-4 mx-auto rounded-full border-2 border-primary-foreground border-t-transparent animate-spin" />
          ) : (
            isLast ? "COMENZAR" : "SIGUIENTE"
          )}
        </button>
      </div>
    </div>
  );
};

export default Onboarding;
