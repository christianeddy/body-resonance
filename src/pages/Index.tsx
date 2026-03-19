import { PageTransition } from "@/components/layout/PageTransition";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { Wind, Thermometer, Fire, CaretRight, GearSix, Heartbeat, Timer, Lightning, Heart, ArrowsClockwise, Brain, Bed, Snowflake, Sun, Lock } from "@phosphor-icons/react";
import ritualEnergia from "@/assets/ritual-energia.png";
import ritualReset from "@/assets/ritual-reset.png";
import ritualCalma from "@/assets/ritual-calma.png";
import ritualDormir from "@/assets/ritual-dormir.png";
import { Link } from "react-router-dom";

import { useAuth } from "@/hooks/useAuth";
import { useSessionStats } from "@/hooks/useSessions";
import { usePractices } from "@/hooks/usePractices";
import { usePrograms, useAllProgramProgress } from "@/hooks/usePrograms";

/*
 * ── HERO SECTION (guardado para re-implementar) ──
 * 
 * import heroHome from "@/assets/hero-home.png";
 *
 * <div className="relative -mx-5 mb-8 overflow-hidden">
 *   <img
 *     src={heroHome}
 *     alt="Bodhi ice bath"
 *     className="w-full h-56 sm:h-72 object-cover object-center animate-[heroZoom_1.2s_cubic-bezier(0.22,1,0.36,1)_forwards]"
 *   />
 *   <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
 *   <div className="absolute inset-0">
 *     <span
 *       className="absolute left-[10%] top-[32%] font-display text-base sm:text-lg font-semibold tracking-[0.12em] animate-[fadeSlideRight_0.8s_cubic-bezier(0.22,1,0.36,1)_0.3s_both]"
 *       style={{ background: "linear-gradient(90deg, #ffffff 40%, #38bdf8 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", filter: "drop-shadow(0 2px 12px rgba(0,0,0,0.9)) drop-shadow(0 0 4px rgba(0,0,0,0.6))" }}
 *     >
 *       Regulación
 *     </span>
 *     <span
 *       className="absolute left-1/2 -translate-x-1/2 top-[28%] font-display text-base sm:text-lg font-semibold tracking-[0.12em] animate-[fadeSlideDown_0.8s_cubic-bezier(0.22,1,0.36,1)_0.5s_both]"
 *       style={{ background: "linear-gradient(90deg, #ffffff 30%, #a78bfa 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.8))" }}
 *     >
 *       Recuperación
 *     </span>
 *     <span
 *       className="absolute right-[8%] top-[38%] font-display text-base sm:text-lg font-semibold tracking-[0.12em] animate-[fadeSlideLeft_0.8s_cubic-bezier(0.22,1,0.36,1)_0.7s_both]"
 *       style={{ background: "linear-gradient(90deg, #ffffff 30%, #fb923c 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.8))" }}
 *     >
 *       Bienestar
 *     </span>
 *   </div>
 * </div>
 */

const MOOD_TO_INTENTION: Record<string, string> = {
  energia: "energia",
  calma: "calma",
  reset: "reset",
  enfoque: "energia",
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
      {practices.map((p) => {
        const isPremium = p.premium;
        const Wrapper = isPremium ? 'div' : Link;
        const wrapperProps = isPremium
          ? { className: "card-body flex items-center gap-4 rounded-xl px-5 py-4 opacity-70 cursor-not-allowed" }
          : { to: `/player/${p.id}`, className: "card-body flex items-center gap-4 rounded-xl px-5 py-4" };
        return (
          <Wrapper key={p.id} {...(wrapperProps as any)}>
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <ArrowsClockwise size={16} weight="duotone" className="text-accent" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-display text-base text-foreground flex items-center gap-1.5">
                {p.display_name}
                {isPremium && <Lock size={14} weight="fill" className="text-muted-foreground flex-shrink-0" />}
              </h4>
              <p className="font-body text-xs text-muted-foreground mt-0.5">{p.duration_estimated}</p>
            </div>
          </Wrapper>
        );
      })}
    </div>
  );
};

const Index = () => {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const { profile } = useAuth();
  
  const { totalSessions, totalMinutes, streak } = useSessionStats();
  const { data: practices } = usePractices("respiracion");
  const { data: programs } = usePrograms();
  const { data: allProgress } = useAllProgramProgress();

  const hour = new Date().getHours();
  let recommendedIntention = "calma";
  if (hour < 12) recommendedIntention = "energia";
  else if (hour >= 21) recommendedIntention = "dormir";
  else if (hour >= 15) recommendedIntention = "calma";
  else recommendedIntention = "reset";

  const recommended = practices?.find((p) => p.intention === recommendedIntention) ?? practices?.[0];

  const displayName = profile?.display_name || "Atleta";

  const intentionLabel: Record<string, string> = {
    energia: "Energía",
    calma: "Calma",
    dormir: "Dormir",
    reset: "Reset",
  };

  const intentionGradients: Record<string, string> = {
    energia: "linear-gradient(90deg, #f59e0b 0%, #ef4444 100%)",
    calma: "linear-gradient(90deg, #60a5fa 0%, #a78bfa 100%)",
    dormir: "linear-gradient(90deg, #818cf8 0%, #c084fc 100%)",
    reset: "linear-gradient(90deg, #34d399 0%, #22d3ee 100%)",
  };

  const intentionImages: Record<string, string> = {
    energia: ritualEnergia,
    reset: ritualReset,
    calma: ritualCalma,
    dormir: ritualDormir,
  };

  const ritualImage = intentionImages[recommendedIntention] ?? ritualEnergia;
  const { data: allPracticesCount } = useQuery({
    queryKey: ["all-practices-count"],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("practices")
        .select("*", { count: "exact", head: true });
      if (error) throw error;
      return count ?? 0;
    },
  });
  const practiceCount = allPracticesCount ?? 0;

  return (
    <PageTransition>
      {/* 1. Header */}
      <div className="flex items-center justify-between pt-14 pb-2 mb-6">
        <div>
          <p className="font-body text-sm text-muted-foreground">Hola, {displayName}</p>
          <h1 className="font-display text-2xl text-foreground mt-1 tracking-wide">Vuelve a tu centro</h1>
        </div>
        <Link to="/perfil">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-card transition-all duration-200 hover:scale-105 active:scale-95">
            <GearSix size={18} weight="duotone" className="text-muted-foreground" />
          </div>
        </Link>
      </div>

      {/* 2. Ritual de hoy */}
      {recommended && (
        <section className="mb-8">
          <div
            className="relative overflow-hidden rounded-2xl p-6"
            style={{ background: "linear-gradient(180deg, hsl(240 12% 5%) 0%, hsl(240 18% 8%) 100%)" }}
          >
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
            <div className="absolute inset-0 pointer-events-none">
              <img src={ritualImage} alt="" className="absolute right-0 top-0 h-full w-3/4 object-cover object-[center_20%]" />
              <div className="absolute inset-0" style={{ background: "linear-gradient(to right, hsl(240 12% 5%) 25%, hsl(240 12% 5% / 0.85) 38%, hsl(240 12% 5% / 0.3) 55%, transparent 70%)" }} />
              <div className="absolute inset-0" style={{ background: "linear-gradient(to top, hsl(240 12% 5%) 0%, transparent 35%)" }} />
            </div>
            <div className="relative z-10">
              <span
                className="inline-block font-display text-[11px] font-semibold tracking-[0.15em] mb-3"
                style={{
                  background: intentionGradients[recommendedIntention] ?? "linear-gradient(90deg, #60a5fa, #a78bfa)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                RITUAL DE HOY
              </span>
              <h2 className="font-display text-2xl text-white mb-1">{recommended.display_name}</h2>
              <p className="font-body text-sm text-white/50 mb-6">
                {recommended.duration_estimated} · {recommended.technique ?? `Respiración de ${recommendedIntention}`}
              </p>
              <Link
                to={`/player/${recommended.id}`}
                className="inline-flex items-center gap-2"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent">
                  <svg width="12" height="14" viewBox="0 0 14 16" fill="none"><polygon points="2,0 14,8 2,16" fill="hsl(var(--accent-foreground))" /></svg>
                </div>
                <span className="font-display text-sm text-white">Empezar</span>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* 3. Cómo te sientes hoy */}
      <section className="mb-8">
        <h3 className="font-display text-xs tracking-[0.15em] text-muted-foreground mb-4">CÓMO TE SIENTES HOY</h3>
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

        {selectedMood && <MoodPractices intention={selectedMood} />}
      </section>

      {/* 4. Protocolo Bodhi */}
      <section className="mb-8">
        <h3 className="font-display text-xs tracking-[0.15em] text-muted-foreground mb-4">PROTOCOLOS BODHI</h3>
        <div className="grid grid-cols-2 gap-3">
          <Link
            to="/sesion?tab=hielo"
            className="relative overflow-hidden rounded-2xl p-4 flex flex-col gap-3 transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.98]"
            style={{ background: "linear-gradient(135deg, hsl(30 40% 12%) 0%, hsl(25 50% 8%) 100%)", border: "1px solid hsl(30 40% 18%)" }}
          >
            <Lightning size={24} weight="duotone" className="text-amber-400" />
            <div>
              <h4 className="font-display text-sm text-foreground">Energy Flow</h4>
              <p className="font-body text-[11px] text-muted-foreground mt-0.5">Activación</p>
            </div>
          </Link>
          <Link
            to="/sesion?tab=hielo"
            className="relative overflow-hidden rounded-2xl p-4 flex flex-col gap-3 transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.98]"
            style={{ background: "linear-gradient(135deg, hsl(250 30% 12%) 0%, hsl(250 40% 8%) 100%)", border: "1px solid hsl(250 30% 18%)" }}
          >
            <ArrowsClockwise size={24} weight="duotone" className="text-violet-400" />
            <div>
              <h4 className="font-display text-sm text-foreground">Reset Flow</h4>
              <p className="font-body text-[11px] text-muted-foreground mt-0.5">Recuperación</p>
            </div>
          </Link>
        </div>
      </section>

      {/* 5. Tu Camino (Stats) */}
      <section className="mb-8">
        <h3 className="font-display text-xs tracking-[0.15em] text-muted-foreground mb-4">TU CAMINO</h3>
        <div className="grid grid-cols-3 gap-3">
          {[
            { value: String(totalSessions), label: "Sesiones", icon: ArrowsClockwise },
            { value: String(totalMinutes), label: "Minutos", icon: Timer },
            { value: String(streak), label: "Racha", icon: Fire, highlight: streak > 0 },
          ].map(({ value, label, icon: Icon, highlight }, i) => (
            <div
              key={i}
              className="card-body rounded-xl px-3 py-3 flex flex-col items-center text-center border border-border/50"
            >
              <Icon size={16} weight="duotone" className="text-accent mb-2" />
              <p className={highlight ? "bg-gradient-to-r from-emerald-400 to-emerald-300 bg-clip-text text-transparent font-display text-xl font-light" : "font-display text-xl text-foreground font-light"}>
                {value}
              </p>
              <p className="font-display text-[11px] text-muted-foreground mt-1 tracking-wide">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Explorar respiraciones */}
      <section className="mb-8">
        <Link
          to="/respirar"
          className="card-body flex items-center justify-between rounded-2xl px-5 py-5 border border-border/50"
        >
          <div className="flex items-center gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
              <Wind size={20} weight="duotone" className="text-accent" />
            </div>
            <div>
              <h4 className="font-display text-base text-foreground">Explorar todas las respiraciones</h4>
              <p className="font-body text-xs text-muted-foreground mt-0.5">{practiceCount} prácticas disponibles</p>
            </div>
          </div>
          <CaretRight size={20} weight="bold" className="text-muted-foreground flex-shrink-0" />
        </Link>
      </section>

      {/* 7. Programas */}
      <section className="mb-8">
        <h3 className="font-display text-xs tracking-[0.15em] text-muted-foreground mb-4">PROGRAMAS</h3>
        <div className="card-body rounded-2xl p-5 relative overflow-hidden transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.98] cursor-pointer">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
          <div className="flex items-center gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 flex-shrink-0">
              <Heartbeat size={20} weight="duotone" className="text-accent" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-display text-base text-foreground">New to Body</h4>
              <p className="font-body text-xs text-muted-foreground mt-0.5">7 días · Una práctica por día</p>
            </div>
            <CaretRight size={20} weight="bold" className="text-muted-foreground flex-shrink-0" />
          </div>
        </div>
      </section>
    </PageTransition>
  );
};

export default Index;
