import { PageTransition } from "@/components/layout/PageTransition";
import { useAuth } from "@/hooks/useAuth";
import { useSessionStats, useSessions } from "@/hooks/useSessions";
import { useFavorites } from "@/hooks/useFavorites";
import { usePractices } from "@/hooks/usePractices";
import { useMemo } from "react";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { Wind, Clock, Fire, Heart, CaretRight, WhatsappLogo } from "@phosphor-icons/react";

const Perfil = () => {
  const { profile, signOut } = useAuth();

  const { totalSessions, totalMinutes, streak, mostUsed } = useSessionStats();
  const { data: sessions } = useSessions();
  const { data: favoriteIds } = useFavorites();
  const { data: allPractices } = usePractices();

  const displayName = profile?.display_name || "Usuario";
  const initials = displayName.split(" ").map((w: string) => w[0]).join("").toUpperCase().slice(0, 2);

  const favoritePractices = allPractices?.filter((p) => favoriteIds?.includes(p.id)) ?? [];

  // Most used practice name from stats
  const mostUsedPractice = useMemo(() => {
    if (!mostUsed || !allPractices) return null;
    return allPractices.find((p) => p.display_name === mostUsed) ?? null;
  }, [mostUsed, allPractices]);

  return (
    <PageTransition>
      {/* Header */}
      <div className="flex items-center gap-4 pt-14 pb-8">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-card border border-border">
          <span className="font-display text-lg text-foreground">{initials}</span>
        </div>
        <div>
          <h1 className="font-display text-xl text-foreground">{displayName}</h1>
        </div>
      </div>

      {/* Tu Camino — Stats */}
      <section className="mb-8">
        <h3 className="font-display text-xs tracking-[0.15em] text-muted-foreground mb-4">TU CAMINO</h3>
        <div className="grid grid-cols-3 gap-3 stagger-children">
          {[
            { value: String(totalSessions), label: "Sesiones", icon: Wind, color: "text-accent", glow: "group-hover:drop-shadow-[0_0_6px_rgba(96,165,250,0.5)]" },
            { value: String(totalMinutes), label: "Minutos", icon: Clock, color: "text-primary", glow: "group-hover:drop-shadow-[0_0_6px_rgba(59,130,246,0.5)]" },
            { value: String(streak), label: "Racha", icon: Fire, color: "text-orange-400", glow: "group-hover:drop-shadow-[0_0_6px_rgba(245,158,11,0.5)]" },
          ].map((s, i) => {
            const Icon = s.icon;
            return (
              <div
                key={i}
                className="group flex flex-col items-center gap-2 rounded-2xl bg-card/40 border border-white/[0.06] p-4 shadow-[inset_0_1px_1px_rgba(255,255,255,0.03)] transition-colors hover:bg-card/60"
              >
                <div className="transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
                  <Icon size={20} weight="duotone" className={`${s.color} transition-all duration-300 ${s.glow}`} />
                </div>
                <p className="font-display text-2xl text-foreground">{s.value}</p>
                <p className="font-body text-[11px] text-muted-foreground">{s.label}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Respiración más usada */}
      {mostUsedPractice && (
        <section className="mb-8">
          <h3 className="font-display text-xs tracking-[0.15em] text-muted-foreground mb-4">RESPIRACIÓN MÁS USADA</h3>
          <Link
            to={`/practica/${mostUsedPractice.id}`}
            className="flex items-center gap-4 rounded-2xl bg-card/40 border border-white/[0.06] p-4 shadow-[inset_0_1px_1px_rgba(255,255,255,0.03)] transition-colors hover:bg-card/60"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10">
              <Wind size={18} weight="duotone" className="text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-body text-base font-medium text-foreground truncate">{mostUsedPractice.display_name}</p>
              <p className="font-body text-sm text-muted-foreground mt-0.5">{mostUsedPractice.duration_estimated}</p>
            </div>
            <CaretRight size={18} weight="regular" className="text-muted-foreground flex-shrink-0" />
          </Link>
        </section>
      )}

      {/* Tus Respiraciones Favoritas */}
      <section className="mb-8">
        <h3 className="font-display text-xs tracking-[0.15em] text-muted-foreground mb-4">TUS RESPIRACIONES FAVORITAS</h3>
        {favoritePractices.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-2xl bg-card/40 border border-white/[0.06] p-8 shadow-[inset_0_1px_1px_rgba(255,255,255,0.03)]">
            <Heart size={28} weight="duotone" className="text-muted-foreground" />
            <p className="font-body text-sm text-muted-foreground text-center">Aún no tienes favoritas.</p>
            <p className="font-body text-xs text-muted-foreground text-center">Guarda prácticas desde las sesiones para verlas aquí.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {favoritePractices.map((p) => (
              <Link
                key={p.id}
                to={`/practica/${p.id}`}
                className="flex items-center gap-4 rounded-2xl bg-card/40 border border-white/[0.06] p-4 shadow-[inset_0_1px_1px_rgba(255,255,255,0.03)] transition-colors hover:bg-card/60"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                  <Wind size={18} weight="duotone" className="text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-body text-base font-medium text-foreground truncate">{p.display_name}</p>
                  <p className="font-body text-sm text-muted-foreground mt-0.5">{p.duration_estimated}</p>
                </div>
                <CaretRight size={18} weight="regular" className="text-muted-foreground flex-shrink-0" />
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Sesiones Recientes */}
      <section className="mb-8">
        <h3 className="font-display text-xs tracking-[0.15em] text-muted-foreground mb-4">SESIONES RECIENTES</h3>
        {!sessions || sessions.length === 0 ? (
          <p className="font-body text-sm text-muted-foreground text-center py-6">
            Aún no has completado ninguna sesión.
          </p>
        ) : (
          <div className="space-y-3">
            {sessions.slice(0, 5).map((s) => {
              const totalSecs = s.duration_seconds ?? 0;
              const mins = Math.floor(totalSecs / 60);
              const secs = totalSecs % 60;
              return (
                <div
                  key={s.id}
                  className="flex items-center gap-4 rounded-2xl bg-card/40 border border-white/[0.06] p-4 shadow-[inset_0_1px_1px_rgba(255,255,255,0.03)]"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent/10">
                    <Wind size={18} weight="duotone" className="text-accent" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-body text-base font-medium text-foreground truncate">{s.practice_name}</p>
                    <p className="font-body text-sm text-muted-foreground mt-0.5">
                      {formatDistanceToNow(new Date(s.completed_at), { addSuffix: true, locale: es })}
                    </p>
                  </div>
                  <span className="font-body text-xs text-muted-foreground shrink-0">
                    {mins}m {secs}s
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Comunidad Bodhi */}
      <section className="mb-8">
        <h3 className="font-display text-xs tracking-[0.15em] text-muted-foreground mb-4">COMUNIDAD BODHI</h3>
        <a
          href="https://chat.whatsapp.com"
          target="_blank"
          rel="noopener noreferrer"
          className="group relative flex items-center gap-4 rounded-2xl border border-green-500/20 p-4 overflow-hidden transition-all duration-500 hover:border-green-500/40 hover:shadow-[0_0_24px_-4px_rgba(34,197,94,0.25)]"
          style={{ background: "linear-gradient(135deg, hsl(0 0% 12%) 0%, hsl(142 40% 8%) 100%)" }}
        >
          {/* Glow pulse bg */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-[radial-gradient(circle_at_30%_50%,rgba(34,197,94,0.12),transparent_70%)]" />
          <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-green-500/20 transition-all duration-500 group-hover:bg-green-500/30 group-hover:scale-110 group-hover:rotate-3">
            <WhatsappLogo size={18} weight="fill" className="text-green-400 transition-all duration-500 group-hover:text-green-300 group-hover:drop-shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
          </div>
          <div className="relative flex-1 min-w-0">
            <p className="font-body text-base font-medium text-foreground transition-colors duration-300 group-hover:text-green-100">Únete a la comunidad</p>
            <p className="font-body text-sm text-muted-foreground mt-0.5">Respiración en WhatsApp</p>
          </div>
          <CaretRight size={18} weight="regular" className="relative text-muted-foreground flex-shrink-0 transition-all duration-300 group-hover:text-green-400 group-hover:translate-x-1" />
        </a>
      </section>

      {/* Logout */}
      <button
        onClick={() => signOut()}
        className="w-full py-4 font-body text-sm text-destructive/70 hover:text-destructive transition-colors border border-white/[0.06] rounded-2xl mb-4"
      >
        Cerrar sesión
      </button>
    </PageTransition>
  );
};

export default Perfil;
