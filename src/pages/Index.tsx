import { PageTransition } from "@/components/layout/PageTransition";
import { useState } from "react";
import { Wind, Thermometer, Fire, CaretRight, GearSix, Heartbeat, Timer, Lightning, Heart, ArrowsClockwise, Brain, Bed } from "@phosphor-icons/react";
import heroHome from "@/assets/hero-home.png";
import { Link } from "react-router-dom";

import { useAuth } from "@/hooks/useAuth";
import { useSessionStats } from "@/hooks/useSessions";
import { usePractices } from "@/hooks/usePractices";
import { usePrograms, useAllProgramProgress } from "@/hooks/usePrograms";

const MOOD_TO_INTENTION: Record<string, string> = {
  energia: "energia",
  calma: "calma",
  reset: "reset",
  enfoque: "energia", // maps to energia until enfoque intention exists
  dormir: "dormir",
};

const MoodPractices = ({ intention }: { intention: string }) => {
  const mappedIntention = MOOD_TO_INTENTION[intention] ?? intention;
  const { data: practices, isLoading } = usePractices("respiracion", mappedIntention);

  if (isLoading) {
    return (
      <div className="mt-4 space-y-2">
        {[1, 2].map((i) => (
          <div key={i} className="card-body rounded-xl p-4 h-16 animate-pulse" />
        ))}
      </div>
    );
  }

  if (!practices || practices.length === 0) {
    return (
      <p className="mt-4 font-body text-sm text-muted-foreground text-center py-3">
        No hay prácticas para esta intención aún
      </p>
    );
  }

  return (
    <div className="mt-4 space-y-2 stagger-children">
      {practices.map((p) => (
        <Link
          to={`/practica/${p.id}`}
          key={p.id}
          className="card-body flex items-center gap-4 rounded-xl px-5 py-4"
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
            <ArrowsClockwise size={16} weight="duotone" className="text-accent" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-display text-base text-foreground">{p.display_name}</h4>
            <p className="font-body text-xs text-muted-foreground mt-0.5">{p.duration_estimated}</p>
          </div>
        </Link>
      ))}
    </div>
  );
};

const Index = () => {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const { profile } = useAuth();
  const { theme, setTheme } = useTheme();
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
      <div className="flex items-center justify-between pt-14 pb-2 mb-8">
        <div>
          <p className="font-body text-sm text-muted-foreground">Hola, {displayName}</p>
          <h1 className="font-display text-3xl text-foreground mt-1 tracking-wide">Vuelve a tu centro</h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-card transition-all duration-200 hover:scale-105 active:scale-95"
          >
            {theme === "dark" ? (
              <Sun size={18} weight="duotone" className="text-muted-foreground" />
            ) : (
              <Moon size={18} weight="duotone" className="text-muted-foreground" />
            )}
          </button>
          <Link to="/perfil">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-card transition-all duration-200 hover:scale-105 active:scale-95">
              <GearSix size={18} weight="duotone" className="text-muted-foreground" />
            </div>
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="mb-8 flex gap-3">
        {[
          { value: String(totalSessions), label: "Sesiones", icon: Heartbeat },
          { value: String(totalMinutes), label: "Minutos", icon: Timer },
          { value: String(streak), label: "Días seguidos", icon: Lightning, highlight: streak > 0 },
        ].map(({ value, label, icon: Icon, highlight }, i) => (
          <div
            key={i}
            className="card-body flex-1 rounded-xl px-4 py-5 flex flex-col items-center text-center"
            style={{ animationDelay: `${i * 50}ms` }}
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 mb-3">
              <Icon size={16} weight="duotone" className="text-accent" />
            </div>
            <p className={highlight ? "bg-gradient-to-r from-emerald-400 to-emerald-300 bg-clip-text text-transparent font-display text-3xl font-light" : "font-display text-3xl text-foreground font-light"}>
              {value}
            </p>
            <p className="font-display text-sm text-muted-foreground mt-1.5 tracking-wide">{label}</p>
          </div>
        ))}
      </div>

      {/* Hero */}
      <div className="relative -mx-5 mb-8 overflow-hidden">
        <img
          src={heroHome}
          alt="Bodhi ice bath"
          className="w-full h-56 sm:h-72 object-cover object-center animate-[heroZoom_1.2s_cubic-bezier(0.22,1,0.36,1)_forwards]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
        <div className="absolute inset-0">
          <span
            className="absolute left-[10%] top-[32%] font-display text-base sm:text-lg font-semibold tracking-[0.12em] animate-[fadeSlideRight_0.8s_cubic-bezier(0.22,1,0.36,1)_0.3s_both]"
            style={{ background: "linear-gradient(90deg, #ffffff 40%, #38bdf8 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", filter: "drop-shadow(0 2px 12px rgba(0,0,0,0.9)) drop-shadow(0 0 4px rgba(0,0,0,0.6))" }}
          >
            Regulación
          </span>
          <span
            className="absolute left-1/2 -translate-x-1/2 top-[28%] font-display text-base sm:text-lg font-semibold tracking-[0.12em] animate-[fadeSlideDown_0.8s_cubic-bezier(0.22,1,0.36,1)_0.5s_both]"
            style={{ background: "linear-gradient(90deg, #ffffff 30%, #a78bfa 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.8))" }}
          >
            Recuperación
          </span>
          <span
            className="absolute right-[8%] top-[38%] font-display text-base sm:text-lg font-semibold tracking-[0.12em] animate-[fadeSlideLeft_0.8s_cubic-bezier(0.22,1,0.36,1)_0.7s_both]"
            style={{ background: "linear-gradient(90deg, #ffffff 30%, #fb923c 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.8))" }}
          >
            Bienestar
          </span>
        </div>
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
            <h2 className="font-display text-2xl text-foreground mb-2">{recommended.display_name}</h2>
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
        <h3 className="font-display text-xs tracking-[0.15em] text-muted-foreground mb-4">Cómo te sientes hoy</h3>
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {[
            { id: "energia", label: "Necesito energía", icon: Lightning, iconBg: "bg-amber-500/20", iconCls: "text-amber-400" },
            { id: "calma", label: "Necesito calma", icon: Heart, iconBg: "bg-blue-400/20", iconCls: "text-blue-400" },
            { id: "reset", label: "Quiero soltar\ntensión", icon: ArrowsClockwise, iconBg: "bg-emerald-500/20", iconCls: "text-emerald-400" },
            { id: "enfoque", label: "Quiero enfocarme", icon: Brain, iconBg: "bg-violet-500/20", iconCls: "text-violet-400" },
            { id: "dormir", label: "Quiero dormir", icon: Bed, iconBg: "bg-indigo-500/20", iconCls: "text-indigo-400" },
          ].map(({ id, label, icon: Icon, iconBg, iconCls }) => (
            <button
              key={id}
              type="button"
              onClick={() => setSelectedMood(selectedMood === id ? null : id)}
              className={`card-body flex flex-col items-start gap-2 rounded-xl px-3 py-3 min-w-[110px] flex-shrink-0 transition-all duration-200 border ${
                selectedMood === id ? "border-primary ring-2 ring-primary/20" : "border-border"
              }`}
            >
              <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${iconBg}`}>
                <Icon size={18} weight="duotone" className={iconCls} />
              </div>
              <span className="font-body text-[11px] text-foreground text-left leading-tight whitespace-pre-line">{label}</span>
            </button>
          ))}
        </div>

        {/* Mood-filtered practices */}
        {selectedMood && (
          <MoodPractices intention={selectedMood} />
        )}
      </section>

      {/* Programs */}
      <section className="mb-8">
        <h3 className="font-display text-xs tracking-[0.15em] text-muted-foreground mb-4">Programas</h3>
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
        <h3 className="font-display text-xs tracking-[0.15em] text-muted-foreground mb-4">Explora</h3>
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
