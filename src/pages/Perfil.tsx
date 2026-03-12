import { PageTransition } from "@/components/layout/PageTransition";
import { useAuth } from "@/hooks/useAuth";
import { useSessionStats, useSessions } from "@/hooks/useSessions";
import { useFavorites } from "@/hooks/useFavorites";
import { usePractices } from "@/hooks/usePractices";
import { useMemo } from "react";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

const Perfil = () => {
  const { profile, signOut } = useAuth();
  
  const { totalSessions, totalMinutes, streak, mostUsed } = useSessionStats();
  const { data: sessions } = useSessions();
  const { data: favoriteIds } = useFavorites();
  const { data: allPractices } = usePractices();

  const displayName = profile?.display_name || "Usuario";
  const initials = displayName.split(" ").map((w: string) => w[0]).join("").toUpperCase().slice(0, 2);
  

  // Heatmap data: last 12 weeks (84 days)
  const heatmapData = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dayMs = 86400000;
    const counts: Record<number, number> = {};

    sessions?.forEach((s) => {
      const d = new Date(s.completed_at);
      d.setHours(0, 0, 0, 0);
      const dayIndex = Math.floor((today.getTime() - d.getTime()) / dayMs);
      if (dayIndex >= 0 && dayIndex < 84) {
        counts[dayIndex] = (counts[dayIndex] || 0) + 1;
      }
    });

    return Array.from({ length: 84 }).map((_, i) => counts[83 - i] || 0);
  }, [sessions]);

  const favoritePractices = allPractices?.filter((p) => favoriteIds?.includes(p.id)) ?? [];

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

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 mb-8 stagger-children">
        {[
          { value: String(totalSessions), label: "Sesiones" },
          { value: String(totalMinutes), label: "Minutos" },
          { value: String(streak), label: "Días de racha", highlight: streak > 0 },
          { value: mostUsed || "—", label: "Más usada" },
        ].map((s, i) => (
          <div key={i} className="card-body rounded-xl p-4">
            <p className={`font-display-semi text-2xl ${s.highlight ? "text-success" : "text-foreground"}`}>
              {s.value}
            </p>
            <p className="font-body text-[11px] text-muted-foreground mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Recientes */}
      <section className="mb-8">
        <h3 className="font-display text-base text-muted-foreground mb-4">Recientes</h3>
        {!sessions || sessions.length === 0 ? (
          <p className="font-body text-sm text-muted-foreground">Aún no tienes sesiones</p>
        ) : (
          <div className="space-y-2">
            {sessions.slice(0, 3).map((s) => {
              const totalSecs = s.duration_seconds ?? 0;
              const mins = Math.floor(totalSecs / 60);
              const secs = totalSecs % 60;
              return (
                <div key={s.id} className="card-body rounded-xl p-3 flex items-center justify-between">
                  <div>
                    <p className="font-body text-sm text-foreground">{s.practice_name}</p>
                    <p className="font-body text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(s.completed_at), { addSuffix: true, locale: es })}
                    </p>
                  </div>
                  <span className="font-body text-xs text-muted-foreground shrink-0 ml-3">
                    {mins}m {secs}s
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Heatmap */}
      <section className="mb-8">
        <h3 className="font-display text-base text-muted-foreground mb-4">Actividad</h3>
        <div className="grid grid-cols-12 gap-1">
          {heatmapData.map((count, i) => {
            let bg = "bg-card";
            if (count >= 3) bg = "bg-accent";
            else if (count === 2) bg = "bg-primary";
            else if (count === 1) bg = "bg-primary/50";
            return (
              <div key={i} className={`aspect-square rounded-sm ${bg}`} />
            );
          })}
        </div>
        <div className="flex gap-3 justify-end mt-2 items-center">
          {[
            { bg: "bg-card", label: "0" },
            { bg: "bg-primary/50", label: "1" },
            { bg: "bg-primary", label: "2" },
            { bg: "bg-accent", label: "3+" },
          ].map(({ bg, label }) => (
            <div key={label} className="flex items-center gap-1">
              <div className={`w-2 h-2 rounded-sm ${bg}`} />
              <span className="font-body text-[10px] text-muted-foreground">{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Favorites */}
      <section className="mb-8">
        <h3 className="font-display text-base text-muted-foreground mb-4">Mis favoritos</h3>
        {favoritePractices.length === 0 ? (
          <p className="font-body text-sm text-muted-foreground">Aún no tienes favoritos guardados</p>
        ) : (
          <div className="space-y-2">
            {favoritePractices.map((p) => (
              <Link key={p.id} to={`/practica/${p.id}`}>
                <div className="card-body rounded-xl p-3">
                  <p className="font-body text-sm text-foreground">{p.display_name}</p>
                  <p className="font-body text-xs text-muted-foreground">{p.duration_estimated}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>


      {/* Logout */}
      <button
        onClick={() => signOut()}
        className="w-full py-4 font-body text-sm text-destructive/70 hover:text-destructive transition-colors border border-input rounded-xl"
      >
        Cerrar sesión
      </button>
    </PageTransition>
  );
};

export default Perfil;
