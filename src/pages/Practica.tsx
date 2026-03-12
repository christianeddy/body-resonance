import { useNavigate, useParams, Link } from "react-router-dom";
import { PageTransition } from "@/components/layout/PageTransition";
import { ArrowLeft, Clock, Zap, Layers } from "lucide-react";
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
  const maxDuration = phases.length > 0 ? Math.max(...phases.map((p: any) => p.duration)) : 1;
  const totalDuration = phases.reduce((acc: number, p: any) => acc + p.duration, 0);
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

      {/* Quick info */}
      <div className="flex gap-6 mb-8">
        <div className="flex items-center gap-2">
          <Clock size={16} className="text-muted-foreground" />
          <span className="font-body text-sm text-muted-foreground">{practice.duration_estimated}</span>
        </div>
        <div className="flex items-center gap-2">
          <Zap size={16} className="text-muted-foreground" />
          <span className="font-body text-sm text-muted-foreground">{practice.intensity}</span>
        </div>
        <div className="flex items-center gap-2">
          <Layers size={16} className="text-muted-foreground" />
          <span className="font-body text-sm text-muted-foreground">{phases.length} fases</span>
        </div>
      </div>

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
                  <div className="mt-1.5 h-1 rounded-full bg-primary/20" style={{ width: `${Math.min((phase.duration / maxDuration) * 100, 100)}%` }}>
                    <div className="h-full rounded-full bg-primary" style={{ width: '100%' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <p className="font-body text-xs text-muted-foreground text-right mb-8">Duración total: {totalDuration}s</p>
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
      <div className="fixed bottom-[72px] left-1/2 w-full max-w-4xl -translate-x-1/2 p-5 bg-background/90 backdrop-blur-md border-t border-[hsl(0_0%_100%/0.06)]">
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
