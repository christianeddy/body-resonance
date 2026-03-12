import { useState, useMemo } from "react";
import { PageTransition } from "@/components/layout/PageTransition";
import { Heart, MagnifyingGlass, Wind } from "@phosphor-icons/react";
import { Link } from "react-router-dom";
import { useFavorites, useToggleFavorite } from "@/hooks/useFavorites";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Practice } from "@/hooks/usePractices";

const intentionFilters = ["Todas", "Energía", "Calma", "Enfoque", "Reset", "Dormir", "Hielo", "Sauna"];
const durationFilters = ["Duración", "3 min", "5 min", "10 min"];

const filterToCategory: Record<string, string | undefined> = {
  Hielo: "hielo",
  Sauna: "calor",
};
const filterToIntention: Record<string, string | undefined> = {
  Energía: "energia",
  Calma: "calma",
  Enfoque: "enfoque",
  Reset: "reset",
  Dormir: "dormir",
};

const labelForPractice = (p: Practice) => {
  if (p.category === "hielo") return "Hielo";
  if (p.category === "calor") return "Sauna";
  if (p.intention) {
    const map: Record<string, string> = { energia: "Energía", calma: "Calma", reset: "Reset", dormir: "Dormir", enfoque: "Enfoque" };
    return map[p.intention] || p.intention;
  }
  return p.category;
};

const Respirar = () => {
  const [activeFilter, setActiveFilter] = useState("Todas");
  const [activeDuration, setActiveDuration] = useState("Duración");
  const [search, setSearch] = useState("");
  const [bouncing, setBouncing] = useState<string | null>(null);

  const { data: allPractices, isLoading } = useQuery({
    queryKey: ["all-practices"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("practices")
        .select("*")
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return data as Practice[];
    },
  });

  const { data: favorites } = useFavorites();
  const toggleFav = useToggleFavorite();

  const filtered = useMemo(() => {
    if (!allPractices) return [];
    let list = allPractices;

    // Intention / category filter
    if (activeFilter !== "Todas") {
      const cat = filterToCategory[activeFilter];
      const int = filterToIntention[activeFilter];
      if (cat) {
        list = list.filter((p) => p.category === cat);
      } else if (int) {
        list = list.filter((p) => p.intention === int);
      }
    }

    // Duration filter
    if (activeDuration !== "Duración") {
      const mins = parseInt(activeDuration);
      list = list.filter((p) => {
        if (!p.duration_estimated) return false;
        return p.duration_estimated.includes(String(mins));
      });
    }

    // Search
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((p) => p.display_name.toLowerCase().includes(q));
    }

    return list;
  }, [allPractices, activeFilter, activeDuration, search]);

  const handleToggleFav = (id: string) => {
    setBouncing(id);
    setTimeout(() => setBouncing(null), 300);
    const isFav = favorites?.includes(id) ?? false;
    toggleFav.mutate({ practiceId: id, isFavorite: isFav });
  };

  return (
    <PageTransition>
      <h1 className="font-display text-3xl text-foreground pt-14 pb-6">Respirar</h1>

      {/* Hero */}
      <div className="relative rounded-2xl overflow-hidden mb-6">
        <img src={heroRespiracion} alt="Respiración guiada Bodhi" className="w-full h-52 object-cover" style={{ objectPosition: '50% 30%' }} />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        <p className="absolute bottom-3 left-4 right-4 font-body text-sm text-foreground/90">
          La respiración es tu herramienta más accesible para regular tu estado interno.
        </p>
      </div>

      <p className="font-body text-sm text-muted-foreground mb-4">Descubre tu práctica ideal</p>

      {/* Search */}
      <div className="relative mb-5">
        <MagnifyingGlass size={18} weight="regular" className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Buscar práctica…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl bg-card border border-border/40 py-3 pl-10 pr-4 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/40"
        />
      </div>

      {/* Intention filters */}
      <div className="flex gap-1.5 overflow-x-auto scrollbar-hide mb-2.5">
        {intentionFilters.map((f) => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`flex-shrink-0 rounded-full px-3 py-1 font-display text-[11px] transition-all duration-200 ${
              activeFilter === f
                ? "bg-primary text-primary-foreground"
                : "border border-border/40 text-muted-foreground hover:text-foreground"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Duration filters */}
      <div className="flex gap-1.5 overflow-x-auto scrollbar-hide mb-5">
        {durationFilters.map((f) => (
          <button
            key={f}
            onClick={() => setActiveDuration(f === activeDuration ? "Duración" : f)}
            className={`flex-shrink-0 rounded-full px-3 py-1 font-display text-[11px] transition-all duration-200 ${
              activeDuration === f
                ? "bg-primary text-primary-foreground"
                : "border border-border/40 text-muted-foreground hover:text-foreground"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Practice List */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="rounded-xl bg-card p-4 h-[68px] animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="stagger-children space-y-3">
          {filtered.map((p) => (
            <Link
              key={p.id}
              to={`/practica/${p.id}`}
              className="flex items-center gap-4 rounded-xl bg-card border border-border/20 p-4 transition-colors hover:bg-card/80"
            >
              {/* Breathing icon */}
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10">
                <Wind size={20} weight="duotone" className="text-primary" />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="font-body text-base font-medium text-foreground truncate">{p.display_name}</p>
                <p className="font-body text-sm text-muted-foreground mt-0.5">
                  {labelForPractice(p)} · {p.duration_estimated}
                </p>
              </div>

              {/* Favorite */}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleToggleFav(p.id);
                }}
                className={`flex-shrink-0 ${bouncing === p.id ? "animate-bounce-fav" : ""}`}
              >
                <Heart
                  size={20}
                  weight="duotone"
                  className={favorites?.includes(p.id) ? "fill-primary text-primary" : "text-muted-foreground"}
                />
              </button>
            </Link>
          ))}

          {filtered.length === 0 && (
            <p className="text-center text-muted-foreground font-body text-sm py-8">
              No se encontraron prácticas
            </p>
          )}
        </div>
      )}
    </PageTransition>
  );
};

export default Respirar;
