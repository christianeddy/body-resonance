import { PageTransition } from "@/components/layout/PageTransition";
import { ChevronRight } from "lucide-react";
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
        {(["hielo", "calor"] as Tab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 font-display text-sm relative ${
              activeTab === tab ? "text-foreground" : "text-muted-foreground"
            }`}
          >
            {tab.toUpperCase()}
            {activeTab === tab && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
            )}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card-body rounded-xl p-5 h-20 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="stagger-children space-y-3">
          {protocols?.map((p) => (
            <Link
              to={`/practica/${p.id}`}
              key={p.id}
              className="card-body flex items-center justify-between rounded-xl p-5"
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
