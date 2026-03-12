import { PageTransition } from "@/components/layout/PageTransition";

const Perfil = () => {
  const initials = "JD";

  return (
    <PageTransition>
      {/* Header */}
      <div className="flex items-center gap-4 pt-14 pb-8">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-card border border-[hsl(0_0%_100%/0.06)]">
          <span className="font-display text-lg text-foreground">{initials}</span>
        </div>
        <div>
          <h1 className="font-display text-xl text-foreground">Juan Deportista</h1>
          <span className="inline-block rounded-full bg-primary/10 px-3 py-0.5 font-display text-[11px] text-accent mt-1">
            DEPORTIVO
          </span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 mb-8 stagger-children">
        {[
          { value: "12", label: "SESIONES" },
          { value: "86", label: "MINUTOS" },
          { value: "3", label: "DÍAS DE RACHA", highlight: true },
          { value: "Calma", label: "MÁS USADA" },
        ].map((s, i) => (
          <div key={i} className="card-body rounded-xl p-4">
            <p className={`font-display-semi text-2xl ${s.highlight ? "text-success" : "text-foreground"}`}>
              {s.value}
            </p>
            <p className="font-body text-[11px] text-muted-foreground mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Heatmap placeholder */}
      <section className="mb-8">
        <h3 className="font-display text-base text-muted-foreground mb-4">ACTIVIDAD</h3>
        <div className="grid grid-cols-12 gap-1">
          {Array.from({ length: 84 }).map((_, i) => {
            const intensity = Math.random();
            let bg = "bg-card";
            if (intensity > 0.8) bg = "bg-accent";
            else if (intensity > 0.6) bg = "bg-primary";
            else if (intensity > 0.4) bg = "bg-primary/50";
            return (
              <div key={i} className={`aspect-square rounded-sm ${bg}`} />
            );
          })}
        </div>
      </section>

      {/* Favorites placeholder */}
      <section className="mb-8">
        <h3 className="font-display text-base text-muted-foreground mb-4">MIS FAVORITOS</h3>
        <p className="font-body text-sm text-muted-foreground">Aún no tienes favoritos guardados</p>
      </section>

      {/* Logout */}
      <button className="w-full py-4 font-body text-sm text-muted-foreground hover:text-foreground transition-colors">
        Cerrar sesión
      </button>
    </PageTransition>
  );
};

export default Perfil;
