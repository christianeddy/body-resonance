import { PageTransition } from "@/components/layout/PageTransition";
import { ChevronRight, Flame } from "lucide-react";
import { Link } from "react-router-dom";
import { usePractices } from "@/hooks/usePractices";

const Sesion = () => {
  const { data: iceProtocols, isLoading } = usePractices("hielo");

  return (
    <PageTransition>
      <h1 className="font-display text-3xl text-foreground pt-14 pb-6">SESIÓN</h1>

      {/* Tabs */}
      <div className="flex gap-6 mb-8 border-b border-[hsl(0_0%_100%/0.06)]">
        <button className="pb-3 font-display text-sm text-foreground relative">
          HIELO
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
        </button>
        <button className="pb-3 font-display text-sm text-muted-foreground">
          CALOR
        </button>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card-body rounded-xl p-5 h-20 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="stagger-children space-y-3">
          {iceProtocols?.map((p) => (
            <Link
              to={`/practica/${p.id}`}
              key={p.id}
              className={`card-body flex items-center justify-between rounded-xl p-5 ${
                p.id === "hielo-ritual" ? "min-h-[120px]" : ""
              }`}
              style={p.id === "hielo-ritual" ? { background: "linear-gradient(135deg, hsl(221 83% 53% / 0.08) 0%, hsl(190 80% 50% / 0.06) 100%)" } : {}}
            >
              <div>
                <h3 className="font-display text-lg text-foreground mb-1">{p.display_name}</h3>
                <p className="font-body text-sm text-muted-foreground">{p.technique ? p.technique.substring(0, 50) + "..." : ""}</p>
                <p className="font-body text-xs text-muted-foreground mt-1">{p.duration_estimated}</p>
              </div>
              <ChevronRight size={20} strokeWidth={1.5} className="text-muted-foreground flex-shrink-0" />
            </Link>
          ))}
        </div>
      )}
    </PageTransition>
  );
};

export default Sesion;
