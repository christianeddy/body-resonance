import { PageTransition } from "@/components/layout/PageTransition";
import { Wind, Snowflake, Flame, ChevronRight, Settings } from "lucide-react";
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

  return (
    <PageTransition>
      {/* Header */}
      <div className="flex items-center justify-between pt-14 pb-6">
        <h1 className="font-display text-2xl text-foreground">Hola, {displayName}</h1>
        <Link to="/perfil">
          <Settings size={20} strokeWidth={1.5} className="text-muted-foreground" />
        </Link>
      </div>

      {/* Stats */}
      <div className="mb-8 flex gap-3 overflow-x-auto scrollbar-hide">
        {[
          { value: String(totalSessions), label: "SESIONES" },
          { value: String(totalMinutes), label: "MINUTOS" },
          { value: String(streak), label: "DÍAS DE RACHA", highlight: streak > 0 },
        ].map((stat, i) => (
          <div
            key={i}
            className="card-body flex-shrink-0 rounded-xl px-5 py-4"
            style={{ animationDelay: `${i * 50}ms` }}
          >
            <p className={`font-display-semi text-3xl ${stat.highlight ? "text-success" : "text-foreground"}`}>
              {stat.value}
            </p>
            <p className="font-body text-[11px] text-muted-foreground mt-1">{stat.label}</p>
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
            <span className="inline-block rounded-full bg-accent/10 px-3 py-1 font-display text-[11px] text-accent mb-3">
              {timeLabel}
            </span>
            <h2 className="font-display text-xl text-foreground mb-1">{recommended.display_name}</h2>
            <p className="font-body text-sm text-muted-foreground mb-6">
              {recommended.duration_estimated} · Intensidad {recommended.intensity}
            </p>
            <div className="flex justify-end">
              <Link
                to={`/player/${recommended.id}`}
                className="animate-pulse-cta inline-flex items-center rounded-full bg-primary px-6 py-2.5 font-display text-sm text-primary-foreground"
              >
                COMENZAR
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Programs */}
      {programs && programs.length > 0 && (
        <section className="mb-8">
          <h3 className="font-display text-base text-muted-foreground mb-4">PROGRAMAS</h3>
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
                  className="card-body flex-shrink-0 w-60 rounded-2xl p-5"
                >
                  <h4 className="font-display text-lg text-foreground mb-1">{prog.name}</h4>
                  <p className="font-body text-[13px] text-muted-foreground line-clamp-2 mb-3">{prog.description}</p>
                  <span className="inline-block rounded-full bg-primary/10 px-3 py-1 font-display text-[11px] text-accent">
                    {progressLabel}
                  </span>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* Explore */}
      <section className="mb-8">
        <h3 className="font-display text-base text-muted-foreground mb-4">EXPLORA</h3>
        <div className="stagger-children space-y-3">
          {[
            { name: "RESPIRACIÓN", icon: Wind, gradient: "var(--gradient-ice)", to: "/respirar" },
            { name: "FRÍO", icon: Snowflake, gradient: "var(--gradient-ice)", to: "/sesion?tab=hielo" },
            { name: "CALOR", icon: Flame, gradient: "var(--gradient-fire)", to: "/sesion?tab=calor" },
          ].map(({ name, icon: Icon, gradient, to }, i) => (
            <Link
              to={to}
              key={i}
              className="card-body flex items-center justify-between rounded-xl p-5"
              style={{ background: gradient }}
            >
              <div className="flex items-center gap-4">
                <Icon size={24} strokeWidth={1.5} className="text-foreground" />
                <span className="font-display text-base text-foreground">{name}</span>
              </div>
              <ChevronRight size={20} strokeWidth={1.5} className="text-muted-foreground" />
            </Link>
          ))}
        </div>
      </section>
    </PageTransition>
  );
};

export default Index;
