import { useNavigate, useParams, Link } from "react-router-dom";
import { PageTransition } from "@/components/layout/PageTransition";
import { ArrowLeft } from "lucide-react";

const phases = [
  { name: "Respiración nasal profunda", duration: "2 min" },
  { name: "Respiración rítmica 4-4-4", duration: "3 min" },
  { name: "Retención y liberación", duration: "2 min" },
];

const Practica = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <PageTransition className="relative min-h-screen pb-24">
      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="pt-14 pb-6 text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft size={24} strokeWidth={1.5} />
      </button>

      <h1 className="font-display text-3xl text-foreground mb-3">Arrancar con energía</h1>
      <span className="inline-block rounded-full bg-primary/10 px-3 py-1 font-display text-[11px] text-accent mb-6">
        ENERGÍA
      </span>

      <p className="font-body text-base text-muted-foreground mb-8 leading-relaxed">
        Una secuencia de respiración diseñada para activar tu sistema nervioso simpático
        y prepararte para dar el máximo en tu día.
      </p>

      {/* Phases */}
      <h3 className="font-display text-base text-muted-foreground mb-4">FASES</h3>
      <div className="relative pl-6 mb-8">
        {/* Timeline line */}
        <div className="absolute left-2 top-2 bottom-2 w-px bg-[hsl(0_0%_100%/0.08)]" />

        <div className="space-y-5 stagger-children">
          {phases.map((phase, i) => (
            <div key={i} className="relative">
              {/* Dot */}
              <div className="absolute -left-[18px] top-1.5 h-2 w-2 rounded-full bg-primary" />
              <p className="font-body text-sm font-medium text-foreground">{phase.name}</p>
              <p className="font-body text-xs text-muted-foreground mt-0.5">{phase.duration}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tags */}
      <div className="flex gap-2 mb-8">
        {["Mañana", "Principiante"].map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-[hsl(0_0%_100%/0.08)] px-3 py-1 font-body text-xs text-muted-foreground"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Fixed CTA */}
      <div className="fixed bottom-0 left-1/2 w-full max-w-md -translate-x-1/2 p-5 bg-background/90 backdrop-blur-md">
        <Link
          to={`/player/${id}`}
          className="animate-pulse-cta flex w-full items-center justify-center rounded-xl bg-primary py-4 font-display text-sm text-primary-foreground"
        >
          COMENZAR
        </Link>
      </div>
    </PageTransition>
  );
};

export default Practica;
