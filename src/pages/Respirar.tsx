import { useState } from "react";
import { PageTransition } from "@/components/layout/PageTransition";
import { Heart, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

const filters = ["Todas", "Energía", "Calma", "Reset", "Dormir"];

const practices = [
  { id: "calmar-mente", name: "Calmar mi mente", duration: "8 min", intention: "Calma", intensity: 1 },
  { id: "arrancar-energia", name: "Arrancar con energía", duration: "7 min", intention: "Energía", intensity: 2 },
  { id: "activarme", name: "Activarme", duration: "5 min", intention: "Energía", intensity: 3 },
  { id: "soltar-todo", name: "Soltar todo", duration: "10 min", intention: "Calma", intensity: 1 },
  { id: "resetearme", name: "Resetearme", duration: "6 min", intention: "Reset", intensity: 2 },
  { id: "preparar-dormir", name: "Prepararme para dormir", duration: "12 min", intention: "Dormir", intensity: 1 },
  { id: "respiracion-lunes", name: "Respiración de los lunes", duration: "8 min", intention: "Reset", intensity: 2 },
];

const IntensityBars = ({ level }: { level: number }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3].map((i) => (
      <div
        key={i}
        className={`h-3 w-1 rounded-full ${
          i <= level ? "bg-primary" : "bg-[hsl(0_0%_100%/0.12)]"
        }`}
      />
    ))}
  </div>
);

const Respirar = () => {
  const [activeFilter, setActiveFilter] = useState("Todas");
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [bouncing, setBouncing] = useState<string | null>(null);

  const filtered = activeFilter === "Todas"
    ? practices
    : practices.filter((p) => p.intention === activeFilter);

  const toggleFav = (id: string) => {
    setBouncing(id);
    setTimeout(() => setBouncing(null), 300);
    setFavorites((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <PageTransition>
      <h1 className="font-display text-3xl text-foreground pt-14 pb-6">RESPIRAR</h1>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide mb-6">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`flex-shrink-0 rounded-full px-4 py-2 font-display text-xs transition-all duration-200 ${
              activeFilter === f
                ? "bg-primary text-primary-foreground"
                : "border border-[hsl(0_0%_100%/0.12)] text-muted-foreground hover:text-foreground"
            }`}
          >
            {f.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Practice List */}
      <div className="stagger-children space-y-3">
        {filtered.map((p) => (
          <div
            key={p.id}
            className="card-body flex items-center gap-4 rounded-xl p-4"
          >
            <div className="flex-1 min-w-0">
              <Link to={`/practica/${p.id}`} className="block">
                <p className="font-body text-base font-medium text-foreground truncate">{p.name}</p>
                <p className="font-body text-sm text-muted-foreground mt-0.5">
                  {p.duration} · Intensidad {p.intention.toLowerCase()}
                </p>
              </Link>
            </div>
            <IntensityBars level={p.intensity} />
            <button
              onClick={() => toggleFav(p.id)}
              className={bouncing === p.id ? "animate-bounce-fav" : ""}
            >
              <Heart
                size={20}
                strokeWidth={1.5}
                className={favorites.has(p.id) ? "fill-primary text-primary" : "text-muted-foreground"}
              />
            </button>
            <Link to={`/practica/${p.id}`}>
              <ChevronRight size={20} strokeWidth={1.5} className="text-muted-foreground" />
            </Link>
          </div>
        ))}
      </div>
    </PageTransition>
  );
};

export default Respirar;
