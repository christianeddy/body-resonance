import { useState } from "react";
import { PageTransition } from "@/components/layout/PageTransition";
import { ChevronRight, Flame } from "lucide-react";
import { Link } from "react-router-dom";

const iceProtocols = [
  { id: "ritual-completo", name: "Ritual Completo", desc: "Pre + Durante + Post hielo", duration: "25 min", featured: true },
  { id: "pre-hielo", name: "Solo Pre Hielo", desc: "Prepara tu cuerpo y mente", duration: "8 min", featured: false },
  { id: "durante-hielo", name: "Solo Durante Hielo", desc: "Guía para estar en el hielo", duration: "10 min", featured: false },
  { id: "post-hielo", name: "Post Hielo", desc: "Recuperación después del frío", duration: "7 min", featured: false },
];

const Sesion = () => {
  const [tab, setTab] = useState<"hielo" | "calor">("hielo");

  return (
    <PageTransition>
      <h1 className="font-display text-3xl text-foreground pt-14 pb-6">SESIÓN</h1>

      {/* Tabs */}
      <div className="flex gap-6 mb-8 border-b border-[hsl(0_0%_100%/0.06)]">
        {(["hielo", "calor"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`pb-3 font-display text-sm transition-all duration-200 relative ${
              tab === t ? "text-foreground" : "text-muted-foreground"
            }`}
          >
            {t.toUpperCase()}
            {tab === t && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
            )}
          </button>
        ))}
      </div>

      {tab === "hielo" ? (
        <div className="stagger-children space-y-3">
          {iceProtocols.map((p) => (
            <Link
              to={`/practica/${p.id}`}
              key={p.id}
              className={`card-body flex items-center justify-between rounded-xl p-5 ${
                p.featured ? "min-h-[120px]" : ""
              }`}
              style={p.featured ? { background: "linear-gradient(135deg, hsl(221 83% 53% / 0.08) 0%, hsl(190 80% 50% / 0.06) 100%)" } : {}}
            >
              <div>
                <h3 className="font-display text-lg text-foreground mb-1">{p.name}</h3>
                <p className="font-body text-sm text-muted-foreground">{p.desc}</p>
                <p className="font-body text-xs text-muted-foreground mt-1">{p.duration}</p>
              </div>
              <ChevronRight size={20} strokeWidth={1.5} className="text-muted-foreground flex-shrink-0" />
            </Link>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20">
          <Flame size={48} strokeWidth={1.5} className="text-muted-foreground opacity-40 mb-4" />
          <h3 className="font-display text-xl text-muted-foreground mb-2">PRÓXIMAMENTE</h3>
          <p className="font-body text-sm text-muted-foreground/30">Protocolos de sauna Body</p>
        </div>
      )}
    </PageTransition>
  );
};

export default Sesion;
