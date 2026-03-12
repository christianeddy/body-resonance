import { useState } from "react";
import { PageTransition } from "@/components/layout/PageTransition";
import { Heart, CaretRight } from "@phosphor-icons/react";
import { Link } from "react-router-dom";
import { usePractices } from "@/hooks/usePractices";
import { useFavorites, useToggleFavorite } from "@/hooks/useFavorites";

const filters = ["Todas", "Energía", "Calma", "Reset", "Dormir"];
const filterToIntention: Record<string, string | undefined> = {
  Todas: undefined,
  Energía: "energia",
  Calma: "calma",
  Reset: "reset",
  Dormir: "dormir",
};

const intensityToLevel = (i: string | null) => {
  if (i === "baja") return 1;
  if (i === "media") return 2;
  if (i === "media-alta") return 3;
  if (i === "alta") return 3;
  return 1;
};

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
  const [bouncing, setBouncing] = useState<string | null>(null);

  const intention = filterToIntention[activeFilter];
  const { data: practices, isLoading } = usePractices("respiracion", intention);
  const { data: favorites } = useFavorites();
  const toggleFav = useToggleFavorite();

  const handleToggleFav = (id: string) => {
    setBouncing(id);
    setTimeout(() => setBouncing(null), 300);
    const isFav = favorites?.includes(id) ?? false;
    toggleFav.mutate({ practiceId: id, isFavorite: isFav });
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
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card-body rounded-xl p-4 h-16 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="stagger-children space-y-3">
          {practices?.map((p) => (
            <div key={p.id} className="card-body flex items-center gap-4 rounded-xl p-4">
              <div className="flex-1 min-w-0">
                <Link to={`/practica/${p.id}`} className="block">
                  <p className="font-body text-base font-medium text-foreground truncate">{p.display_name}</p>
                  <p className="font-body text-sm text-muted-foreground mt-0.5">
                    {p.duration_estimated} · {p.intensity}
                  </p>
                </Link>
              </div>
              <IntensityBars level={intensityToLevel(p.intensity)} />
              <button
                onClick={() => handleToggleFav(p.id)}
                className={bouncing === p.id ? "animate-bounce-fav" : ""}
              >
                <Heart
                  size={20}
                  weight="duotone"
                  className={favorites?.includes(p.id) ? "fill-primary text-primary" : "text-muted-foreground"}
                />
              </button>
              <Link to={`/practica/${p.id}`}>
                <CaretRight size={20} weight="duotone" className="text-muted-foreground" />
              </Link>
            </div>
          ))}
        </div>
      )}
    </PageTransition>
  );
};

export default Respirar;
