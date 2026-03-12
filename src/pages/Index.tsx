import { PageTransition } from "@/components/layout/PageTransition";
import { Wind, Snowflake, Fire, CaretRight, GearSix, Heartbeat, Timer, Lightning } from "@phosphor-icons/react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useSessionStats } from "@/hooks/useSessions";
import { usePractices } from "@/hooks/usePractices";
import { usePrograms, useAllProgramProgress } from "@/hooks/usePrograms";

const Index = () => {
  const { profile } = useAuth();
  const { totalSessions, totalMinutes, streak } = useSessionStats();
  const { data: practices } = usePractices("respiracion");
  const { data: programs } = usePrograms();
  const { data: allProgress } = useAllProgramProgress();

  // Recommend practice based on profile + time of day
  const hour = new Date().getHours();
  let recommendedIntention = "calma";
  if (hour < 12) recommendedIntention = "energia";
  else if (hour >= 21) recommendedIntention = "dormir";
  else if (hour >= 15) recommendedIntention = "calma";
  else recommendedIntention = "reset";

  const recommended = practices?.find((p) => p.intention === recommendedIntention) ?? practices?.[0];
  const timeLabel = hour < 12 ? "MAÑANA" : hour < 18 ? "TARDE" : "NOCHE";

  const displayName = profile?.display_name || "Atleta";

  const intentionLabel: Record<string, string> = {
    energia: "ENERGÍA",
    calma: "CALMA",
    dormir: "DORMIR",
    reset: "RESET",
  };

  const intentionColors: Record<string, string> = {
    energia: "bg-amber-500/10 text-amber-400",
    calma: "bg-blue-400/10 text-blue-400",
    dormir: "bg-indigo-400/10 text-indigo-400",
    reset: "bg-emerald-400/10 text-emerald-400",
  };

  return (
    <PageTransition>
      {/* Header */}
      <div className="flex items-center justify-between pt-14 pb-6">
        <h1 className="font-display text-2xl text-foreground">Hola, {displayName}</h1>
        <Link to="/perfil">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-card border border-[hsl(0_0%_100%/0.06)] transition-colors hover:border-[hsl(0_0%_100%/0.12)]">
            <GearSix size={16} weight="duotone" className="text-muted-foreground" />
          </div>
        </Link>
      </div>

      {/* Stats */}
      <div className="mb-8 flex gap-3 overflow-x-auto scrollbar-hide">
        {[
          { value: String(totalSessions), label: "SESIONES", icon: Heartbeat },
          { value: String(totalMinutes), label: "MINUTOS", icon: Timer },
          { value: String(streak), label: "DÍAS DE RACHA", icon: Lightning, highlight: streak > 0 },
        ].map(({ value, label, icon: Icon, highlight }, i) => (
          <div
            key={i}
            className="card-body flex-shrink-0 rounded-xl px-5 py-4 transition-all duration-300 hover:-translate-y-0.5"
            style={{ animationDelay: `${i * 50}ms` }}
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 mb-2">
              <Icon size={16} weight="duotone" className="text-accent" />
            </div>
            <p className={highlight ? "bg-gradient-to-r from-emerald-400 to-emerald-300 bg-clip-text text-transparent font-display-semi text-3xl" : "font-display-semi text-3xl text-foreground"}>
              {value}
            </p>
            <p className="font-body text-[11px] text-muted-foreground mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Daily Ritual */}
      {recommended && (
        <section className="mb-8">
          <div
            className="card-body relative overflow-hidden rounded-2xl p-6"
            style={{ background: "linear-gradient(135deg, hsl(240 12% 5%) 0%, hsl(240 30% 10%) 100%)" }}
          >
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
            <span className="inline-block rounded-full bg-accent/10 px-3 py-1 font-display text-[11px] text-accent mb-3">
              {timeLabel}
            </span>
            <h2 className="font-display text-xl text-foreground mb-2">{recommended.display_name}</h2>
            {recommended.intention && (
              <span className={`inline-block rounded-full px-3 py-1 font-display text-[11px] mb-3 ${intentionColors[recommended.intention] ?? "bg-accent/10 text-accent"}`}>
                {intentionLabel[recommended.intention] ?? recommended.intention.toUpperCase()}
              </span>
            )}
            <p className="font-body text-sm text-muted-foreground mb-6">
              {recommended.duration_estimated} · Intensidad {recommended.intensity}
            </p>
            <div className="flex justify-end">
              <Link
                to={`/player/${recommended.id}`}
                className="animate-pulse-cta inline-flex items-center rounded-full bg-gradient-to-r from-[hsl(221,83%,48%)] to-[hsl(213,94%,63%)] shadow-[0_0_20px_-4px_hsl(221,83%,53%/0.4)] px-6 py-2.5 font-display text-sm text-primary-foreground"
              >
                COMENZAR
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Programs */}
      <section className="mb-8">
        <h3 className="font-display text-base text-muted-foreground mb-4">PROGRAMAS</h3>
        {programs && programs.length > 0 ? (
          <div className="flex gap-3 overflow-x-auto pb-3 scrollbar-thin stagger-children">
            {programs.map((prog) => {
              const progress = allProgress?.find((p) => p.program_id === prog.id);
              const progressLabel = progress
                ? `Día ${progress.current_day} de ${prog.max_days}`
                : "Nuevo";
              return (
                <Link
                  to={`/programa/${prog.id}`}
                  key={prog.id}
                  className="card-body flex-shrink-0 w-60 rounded-2xl p-5 transition-all duration-300 hover:-translate-y-0.5 relative overflow-hidden"
                >
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[hsl(0_0%_100%/0.08)] to-transparent" />
                  <h4 className="font-display text-lg text-foreground mb-1">{prog.name}</h4>
                  <p className="font-body text-[13px] text-muted-foreground line-clamp-2 mb-3">{prog.description}</p>
                  <span className="inline-block rounded-full bg-primary/10 px-3 py-1 font-display text-[11px] text-accent">
                    {progressLabel}
                  </span>
                </Link>
              );
            })}
          </div>
        ) : (
          <p className="font-body text-sm text-muted-foreground text-center py-4">
            Aún no hay programas disponibles
          </p>
        )}
      </section>

      {/* Explore */}
      <section className="mb-8">
        <h3 className="font-display text-base text-muted-foreground mb-4">EXPLORA</h3>
        <div className="stagger-children space-y-3">
          {[
            { name: "RESPIRACIÓN", description: "Técnicas guiadas", icon: Wind, gradient: "var(--gradient-ice)", to: "/respirar", isHeat: false },
            { name: "FRÍO", description: "Protocolos de hielo", icon: Snowflake, gradient: "var(--gradient-ice)", to: "/sesion?tab=hielo", isHeat: false },
            { name: "CALOR", description: "Protocolos de calor", icon: Fire, gradient: "var(--gradient-fire)", to: "/sesion?tab=calor", isHeat: true },
          ].map(({ name, description, icon: Icon, gradient, to, isHeat }, i) => (
            <Link
              to={to}
              key={i}
              className="card-body flex items-center justify-between rounded-xl px-5 py-6"
              style={{ background: gradient }}
            >
              <div className="flex items-center gap-4">
                <div className="relative flex-shrink-0">
                  <div className={`absolute inset-0 rounded-xl blur-md ${isHeat ? "bg-orange-500/15" : "bg-primary/15"}`} />
                  <div className={`relative flex h-11 w-11 items-center justify-center rounded-xl ${isHeat ? "bg-orange-500/10" : "bg-primary/10"}`}>
                    <Icon size={20} weight="duotone" className={isHeat ? "text-orange-400" : "text-accent"} />
                  </div>
                </div>
                <div>
                  <span className="font-display text-base text-foreground">{name}</span>
                  <p className="font-body text-xs text-muted-foreground mt-0.5">{description}</p>
                </div>
              </div>
              <CaretRight size={20} weight="duotone" className="text-muted-foreground flex-shrink-0" />
            </Link>
          ))}
        </div>
      </section>
    </PageTransition>
  );
};

export default Index;
