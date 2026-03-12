import { useNavigate, useParams, Link } from "react-router-dom";
import { PageTransition } from "@/components/layout/PageTransition";
import { ArrowLeft } from "lucide-react";
import { usePractice } from "@/hooks/usePractices";

const Practica = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: practice, isLoading } = usePractice(id);

  if (isLoading) {
    return (
      <PageTransition className="relative min-h-screen pb-24">
        <div className="pt-14 pb-6">
          <div className="h-8 w-48 bg-card rounded animate-pulse mb-4" />
          <div className="h-4 w-24 bg-card rounded animate-pulse mb-8" />
          <div className="h-24 w-full bg-card rounded animate-pulse" />
        </div>
      </PageTransition>
    );
  }

  if (!practice) {
    return (
      <PageTransition className="min-h-screen flex items-center justify-center">
        <p className="font-body text-muted-foreground">Práctica no encontrada</p>
      </PageTransition>
    );
  }

  const phases = Array.isArray(practice.phases) ? practice.phases : [];
  const tags = Array.isArray(practice.tags) ? practice.tags : [];
  const intentionLabel = practice.intention
    ? practice.intention.charAt(0).toUpperCase() + practice.intention.slice(1)
    : practice.category.toUpperCase();

  return (
    <PageTransition className="relative min-h-screen pb-24">
      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="pt-14 pb-6 text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft size={24} strokeWidth={1.5} />
      </button>

      <h1 className="font-display text-3xl text-foreground mb-3">{practice.display_name}</h1>
      <span className="inline-block rounded-full bg-primary/10 px-3 py-1 font-display text-[11px] text-accent mb-6">
        {intentionLabel.toUpperCase()}
      </span>

      {practice.technique && (
        <p className="font-body text-base text-muted-foreground mb-8 leading-relaxed">
          {practice.technique}
        </p>
      )}

      {/* Phases */}
      {phases.length > 0 && (
        <>
          <h3 className="font-display text-base text-muted-foreground mb-4">FASES</h3>
          <div className="relative pl-6 mb-8">
            <div className="absolute left-2 top-2 bottom-2 w-px bg-[hsl(0_0%_100%/0.08)]" />
            <div className="space-y-5 stagger-children">
              {phases.map((phase: any, i: number) => (
                <div key={i} className="relative">
                  <div className="absolute -left-[18px] top-1.5 h-2 w-2 rounded-full bg-primary" />
                  <p className="font-body text-sm font-medium text-foreground">{phase.name}</p>
                  <p className="font-body text-xs text-muted-foreground mt-0.5">{phase.duration}s</p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Tags */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
          {tags.map((tag: string) => (
            <span
              key={tag}
              className="rounded-full border border-[hsl(0_0%_100%/0.08)] px-3 py-1 font-body text-xs text-muted-foreground"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Fixed CTA */}
      <div className="fixed bottom-0 left-1/2 w-full max-w-md -translate-x-1/2 p-5 bg-background/90 backdrop-blur-md">
        <Link
          to={`/player/${practice.id}`}
          className="animate-pulse-cta flex w-full items-center justify-center rounded-xl bg-primary py-4 font-display text-sm text-primary-foreground"
        >
          COMENZAR
        </Link>
      </div>
    </PageTransition>
  );
};

export default Practica;
