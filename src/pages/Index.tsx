import { PageTransition } from "@/components/layout/PageTransition";
import { useState } from "react";
import { Wind, Thermometer, Fire, CaretRight, GearSix, Heartbeat, Timer, Lightning, Heart, ArrowsClockwise, Brain, Bed } from "@phosphor-icons/react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useSessionStats } from "@/hooks/useSessions";
import { usePractices } from "@/hooks/usePractices";
import { usePrograms, useAllProgramProgress } from "@/hooks/usePrograms";

const Index = () => {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
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
  const timeLabel = hour < 12 ? "Mañana" : hour < 18 ? "Tarde" : "Noche";

  const displayName = profile?.display_name || "Atleta";

  const intentionLabel: Record<string, string> = {
    energia: "Energía",
    calma: "Calma",
    dormir: "Dormir",
    reset: "Reset",
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
      <div className="flex items-center justify-between pt-14 pb-2 mb-6">
        <div>
          <p className="font-body text-sm text-muted-foreground">Hola, {displayName}</p>
          <h1 className="font-display text-3xl text-foreground mt-1">Vuelve a tu centro</h1>
        </div>
        <Link to="/perfil">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-card border border-border transition-colors hover:border-muted-foreground/20">
            <GearSix size={16} weight="duotone" className="text-muted-foreground" />
          </div>
        </Link>
      </div>

      {/* Stats */}
      <div className="mb-8 flex gap-3">
        {[
          { value: String(totalSessions), label: "Sesiones", icon: Heartbeat },
          { value: String(totalMinutes), label: "Minutos", icon: Timer },
          { value: String(streak), label: "Días de racha", icon: Lightning, highlight: streak > 0 },
        ].map(({ value, label, icon: Icon, highlight }, i) => (
          <div
            key={i}
            className="flex-1 rounded-xl px-5 py-4 bg-card border border-border"
            style={{ boxShadow: "var(--shadow-inner-glow)" }}
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
            style={{ background: "var(--gradient-card)" }}
          >
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
            <span className="inline-block rounded-full bg-accent/10 px-3 py-1 font-display text-[11px] text-accent mb-3">
              {timeLabel}
            </span>
            <h2 className="font-display text-xl text-foreground mb-2">{recommended.display_name}</h2>
            {recommended.intention && (
              <span className={`inline-block rounded-full px-3 py-1 font-display text-[11px] mb-3 ${intentionColors[recommended.intention] ?? "bg-accent/10 text-accent"}`}>
                {intentionLabel[recommended.intention] ?? recommended.intention}
              </span>
            )}
            <p className="font-body text-sm text-muted-foreground mb-6">
              {recommended.duration_estimated} · Intensidad {recommended.intensity}
            </p>
            <div className="flex justify-end">
              <Link
                to={`/player/${recommended.id}`}
                className="animate-pulse-cta inline-flex items-center rounded-full bg-gradient-to-r from-primary to-accent shadow-[0_0_20px_-4px_hsl(var(--primary)/0.4)] px-6 py-2.5 font-display text-sm text-primary-foreground"
              >
                Comenzar
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ¿Cómo te sientes hoy? */}
      <section className="mb-8">
        <h3 className="font-display text-base text-muted-foreground mb-4">¿Cómo te sientes hoy?</h3>
        <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
          {[
            { id: "energia", label: "Necesito energía", icon: Lightning, gradient: "linear-gradient(135deg, hsl(30 90% 50% / 0.08) 0%, hsl(15 85% 55% / 0.05) 100%)", iconBg: "bg-amber-500/20", iconCls: "text-amber-400" },
            { id: "calma", label: "Necesito calma", icon: Heart, gradient: "linear-gradient(135deg, hsl(221 83% 53% / 0.08) 0%, hsl(190 80% 50% / 0.06) 100%)", iconBg: "bg-blue-400/20", iconCls: "text-blue-400" },
            { id: "reset", label: "Quiero soltar tensión", icon: ArrowsClockwise, gradient: "linear-gradient(135deg, hsl(160 60% 45% / 0.08) 0%, hsl(140 50% 40% / 0.05) 100%)", iconBg: "bg-emerald-500/20", iconCls: "text-emerald-400" },
            { id: "enfoque", label: "Quiero enfocarme", icon: Brain, gradient: "linear-gradient(135deg, hsl(270 70% 55% / 0.08) 0%, hsl(260 60% 50% / 0.05) 100%)", iconBg: "bg-violet-500/20", iconCls: "text-violet-400" },
            { id: "dormir", label: "Quiero dormir", icon: Bed, gradient: "linear-gradient(135deg, hsl(240 50% 45% / 0.08) 0%, hsl(250 40% 35% / 0.05) 100%)", iconBg: "bg-indigo-500/20", iconCls: "text-indigo-400" },
          ].map(({ id, label, icon: Icon, gradient, iconBg, iconCls }) => (
            <button
              key={id}
              type="button"
              onClick={() => setSelectedMood(selectedMood === id ? null : id)}
              className={`card-body flex-shrink-0 flex flex-col items-center gap-3 rounded-xl px-4 py-4 min-w-[100px] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_16px_-4px_hsl(var(--primary)/0.2)] border ${
                selectedMood === id ? "border-primary ring-2 ring-primary/20" : "border-border"
              }`}
              style={{ background: gradient }}
            >
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconBg}`}>
                <Icon size={20} weight="duotone" className={iconCls} />
              </div>
              <span className="font-body text-xs text-foreground text-center leading-tight">{label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Programs */}
      <section className="mb-8">
        <h3 className="font-display text-base text-muted-foreground mb-4">Programas</h3>
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
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
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
        <h3 className="font-display text-base text-muted-foreground mb-4">Explora</h3>
        <div className="stagger-children space-y-3">
          {[
            { name: "Respiración", description: "Técnicas guiadas", icon: Wind, gradient: "var(--gradient-ice)", to: "/respirar", isHeat: false },
            { name: "Frío", description: "Protocolos de frío", icon: Thermometer, gradient: "var(--gradient-ice)", to: "/sesion?tab=hielo", isHeat: false },
            { name: "Calor", description: "Protocolos de calor", icon: Fire, gradient: "var(--gradient-fire)", to: "/sesion?tab=calor", isHeat: true },
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
