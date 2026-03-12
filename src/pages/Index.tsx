import { PageTransition } from "@/components/layout/PageTransition";
import { Wind, Snowflake, Flame, ChevronRight, Settings } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <PageTransition>
      {/* Header */}
      <div className="flex items-center justify-between pt-14 pb-6">
        <h1 className="font-display text-2xl text-foreground">Hola, Atleta</h1>
        <Settings size={20} strokeWidth={1.5} className="text-muted-foreground" />
      </div>

      {/* Stats */}
      <div className="mb-8 flex gap-3 overflow-x-auto scrollbar-hide">
        {[
          { value: "12", label: "SESIONES" },
          { value: "86", label: "MINUTOS" },
          { value: "3", label: "DÍAS DE RACHA", highlight: true },
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
      <section className="mb-8">
        <div
          className="card-body relative overflow-hidden rounded-2xl p-6"
          style={{ background: "linear-gradient(135deg, hsl(240 12% 5%) 0%, hsl(240 30% 10%) 100%)" }}
        >
          <span className="inline-block rounded-full bg-accent/10 px-3 py-1 font-display text-[11px] text-accent mb-3">
            MAÑANA
          </span>
          <h2 className="font-display text-xl text-foreground mb-1">Arrancar con energía</h2>
          <p className="font-body text-sm text-muted-foreground mb-6">7 min · Intensidad media</p>
          <div className="flex justify-end">
            <Link
              to="/player/arrancar-energia"
              className="animate-pulse-cta inline-flex items-center rounded-full bg-primary px-6 py-2.5 font-display text-sm text-primary-foreground"
            >
              COMENZAR
            </Link>
          </div>
        </div>
      </section>

      {/* Programs */}
      <section className="mb-8">
        <h3 className="font-display text-base text-muted-foreground mb-4">PROGRAMAS</h3>
        <div className="flex gap-3 overflow-x-auto scrollbar-hide stagger-children">
          {[
            { name: "NEW TO BODY", desc: "Tu introducción al método", progress: "Nuevo" },
            { name: "DORMIR MEJOR", desc: "Protocolo de 7 días para descanso profundo", progress: "Día 3 de 7" },
            { name: "RESET TOTAL", desc: "Reinicia tu sistema nervioso", progress: "Nuevo" },
          ].map((prog, i) => (
            <Link
              to={`/programa/${i + 1}`}
              key={i}
              className="card-body flex-shrink-0 w-60 rounded-2xl p-5"
            >
              <h4 className="font-display text-lg text-foreground mb-1">{prog.name}</h4>
              <p className="font-body text-[13px] text-muted-foreground line-clamp-2 mb-3">{prog.desc}</p>
              <span className="inline-block rounded-full bg-primary/10 px-3 py-1 font-display text-[11px] text-accent">
                {prog.progress}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Explore */}
      <section className="mb-8">
        <h3 className="font-display text-base text-muted-foreground mb-4">EXPLORA</h3>
        <div className="stagger-children space-y-3">
          {[
            { name: "RESPIRACIÓN", icon: Wind, gradient: "var(--gradient-ice)" },
            { name: "FRÍO", icon: Snowflake, gradient: "var(--gradient-ice)" },
            { name: "CALOR", icon: Flame, gradient: "var(--gradient-fire)" },
          ].map(({ name, icon: Icon, gradient }, i) => (
            <Link
              to={name === "RESPIRACIÓN" ? "/respirar" : "/sesion"}
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
