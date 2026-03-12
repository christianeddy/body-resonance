import { PageTransition } from "@/components/layout/PageTransition";
import { CaretRight, Snowflake, Fire } from "@phosphor-icons/react";
import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { usePractices } from "@/hooks/usePractices";

type Tab = "hielo" | "calor";

const Sesion = () => {
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<Tab>(() => {
    const tab = searchParams.get("tab");
    return tab === "calor" ? "calor" : "hielo";
  });

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab === "calor" || tab === "hielo") setActiveTab(tab);
  }, [searchParams]);

  const { data: iceProtocols, isLoading: loadingIce } = usePractices("hielo");
  const { data: heatProtocols, isLoading: loadingHeat } = usePractices("calor");

  const isLoading = activeTab === "hielo" ? loadingIce : loadingHeat;
  const protocols = activeTab === "hielo" ? iceProtocols : heatProtocols;

  return (
    <PageTransition>
      <h1 className="font-display text-3xl text-foreground pt-14 pb-6">SESIÓN</h1>

      {/* Tabs */}
      <div className="flex gap-6 mb-8 border-b border-[hsl(0_0%_100%/0.06)]">
        {(["hielo", "calor"] as Tab[]).map((tab) => {
          const count = tab === "hielo" ? (iceProtocols?.length ?? 0) : (heatProtocols?.length ?? 0);
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 font-display text-sm relative ${
                activeTab === tab ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              {tab.toUpperCase()}{" "}
              <span className="text-muted-foreground text-[11px]">({count})</span>
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
              )}
            </button>
          );
        })}
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card-body rounded-xl p-5 h-20 animate-pulse" />
          ))}
        </div>
      ) : protocols && protocols.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          {activeTab === "hielo" ? (
            <Snowflake size={32} weight="duotone" className="text-muted-foreground" />
          ) : (
            <Fire size={32} weight="duotone" className="text-muted-foreground" />
          )}
          <p className="font-body text-sm text-muted-foreground">
            No hay protocolos de {activeTab} aún
          </p>
        </div>
      ) : (
        <div className="stagger-children space-y-3">
          {protocols?.map((p, index) => (
            <Link
              to={`/practica/${p.id}`}
              key={p.id}
              className="card-body flex items-center justify-between rounded-xl p-5"
              style={
                index === 0
                  ? { background: "linear-gradient(135deg, hsl(221 83% 53% / 0.06) 0%, hsl(190 80% 50% / 0.04) 100%)" }
                  : undefined
              }
            >
              <div>
                {index === 0 && (
                  <span className="inline-block rounded-full bg-primary/10 px-2 py-0.5 font-display text-[10px] text-accent mb-1">
                    RECOMENDADO
                  </span>
                )}
                <h3 className="font-display text-lg text-foreground mb-1">{p.display_name}</h3>
                <p className="font-body text-sm text-muted-foreground">{p.technique ? p.technique.substring(0, 50) + "..." : ""}</p>
                <p className="font-body text-xs text-muted-foreground mt-1">{p.duration_estimated}</p>
              </div>
              <CaretRight size={20} weight="duotone" className="text-muted-foreground flex-shrink-0" />
            </Link>
          ))}
        </div>
      )}
    </PageTransition>
  );
};

export default Sesion;
