import { PageTransition } from "@/components/layout/PageTransition";
import { CaretRight, Thermometer, Fire, Heart, Clock, Snowflake, Lock } from "@phosphor-icons/react";
import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { usePractices } from "@/hooks/usePractices";
import type { Practice } from "@/hooks/usePractices";
import heroFrio from "@/assets/hero-frio.png";
import heroCalor from "@/assets/hero-calor.png";

type Tab = "hielo" | "calor";

const getPhase = (p: Practice, isFrio: boolean): { num: number; label: string } => {
  const name = (p.display_name || "").toLowerCase();
  const tags = Array.isArray(p.tags) ? (p.tags as string[]).map((t) => String(t).toLowerCase()) : [];
  const all = name + " " + tags.join(" ");
  const word = isFrio ? "Hielo" : "Sauna";
  if (all.includes("pre")) return { num: 1, label: `Pre ${word}` };
  if (all.includes("durante")) return { num: 2, label: `Durante ${word}` };
  if (all.includes("post")) return { num: 3, label: `Post ${word}` };
  return { num: 1, label: `Pre ${word}` };
};

const LEARN_FRIO = [
  { icon: Heart, title: "Beneficios del frío", text: "Reduce inflamación, mejora la circulación, fortalece el sistema inmune y aumenta la resiliencia mental." },
  { icon: Clock, title: "Cuánto tiempo entrar", text: "Comienza con 30 segundos e incrementa gradualmente. El rango ideal es entre 1 y 3 minutos." },
  { icon: Thermometer, title: "Temperatura recomendada", text: "Entre 0°C y 15°C. Lo importante es que sientas el frío como un desafío controlable." },
];

const LEARN_CALOR = [
  { icon: Heart, title: "Beneficios del sauna", text: "Mejora la circulación, reduce el cortisol, libera tensión muscular profunda y promueve la desintoxicación natural." },
  { icon: Clock, title: "Cómo usar sauna correctamente", text: "Comienza con 10-15 minutos a temperatura moderada. Hidrátate bien antes y después. Escucha a tu cuerpo." },
  { icon: Thermometer, title: "Cómo combinar calor y frío", text: "Alterna sauna con inmersión en frío para potenciar los beneficios. El contraste térmico activa la regulación del sistema nervioso." },
];

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
      <h1
        className="group font-display text-2xl pt-14 pb-6 flex items-center gap-2.5 cursor-default transition-all duration-500"
      >
        {activeTab === "hielo" ? (
          <>
            <Snowflake size={24} weight="duotone" className="text-cyan-400 transition-transform duration-500 group-hover:rotate-90 group-hover:scale-110" />
            <span className="frio-hover-gradient transition-all duration-500">
              Frío
            </span>
          </>
        ) : (
          <>
            <Fire size={24} weight="duotone" className="text-orange-400 transition-transform duration-500 group-hover:scale-125" />
            <span className="calor-hover-gradient transition-all duration-500">
              Calor
            </span>
          </>
        )}
      </h1>

      {/* Hero image */}
      {activeTab === "hielo" && (
        <div className="relative rounded-2xl overflow-hidden mb-6">
          <img src={heroFrio} alt="Ice bath Bodhi" className="w-full h-52 object-cover animate-[heroZoom_1.2s_cubic-bezier(0.22,1,0.36,1)_forwards]" style={{ objectPosition: '50% 35%' }} />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
          <p className="absolute bottom-3 left-4 right-4 font-body text-sm text-foreground/90">
            El frío es una herramienta poderosa para regular tu sistema nervioso.
          </p>
        </div>
      )}
      {activeTab === "calor" && (
        <div className="relative rounded-2xl overflow-hidden mb-6">
          <img src={heroCalor} alt="Sauna infrarrojo Bodhi" className="w-full h-52 object-cover animate-[heroZoom_1.2s_cubic-bezier(0.22,1,0.36,1)_forwards]" style={{ objectPosition: '50% 25%' }} />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
          <p className="absolute bottom-3 left-4 right-4 font-body text-sm text-foreground/90">
            El calor ayuda a liberar tensión profunda y relajar el sistema nervioso.
          </p>
        </div>
      )}

      <h2 className="font-display text-base text-foreground mb-4">
        Protocolo Bodhi para {activeTab === "hielo" ? "frío" : "sauna"}
      </h2>

      {isLoading ? (
        <div className="space-y-3 mb-12">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card-body rounded-xl p-5 h-20 animate-pulse" />
          ))}
        </div>
      ) : protocols && protocols.length > 0 ? (
        <div className="stagger-children space-y-3 mb-12">
          {protocols.map((p) => {
            const { num, label } = getPhase(p, activeTab === "hielo");
            const isFrio = activeTab === "hielo";
            const isPremium = p.premium;
            const Wrapper = isPremium ? 'div' : Link;
            const wrapperProps = isPremium
              ? { className: "flex items-center gap-4 rounded-2xl bg-card/40 border border-border p-4 shadow-[inset_0_1px_1px_rgba(255,255,255,0.03)] opacity-70 cursor-not-allowed" }
              : { to: `/practica/${p.id}`, className: "flex items-center gap-4 rounded-2xl bg-card/40 border border-border p-4 shadow-[inset_0_1px_1px_rgba(255,255,255,0.03)] transition-colors hover:bg-card/60" };
            return (
              <Wrapper
                key={p.id}
                {...(wrapperProps as any)}
              >
                <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl font-display text-xs ${isFrio ? "bg-cyan-500/20 text-cyan-400" : "bg-orange-500/20 text-foreground"}`}>
                  {num}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-body text-base font-medium text-foreground truncate flex items-center gap-1.5">
                    {p.display_name}
                    {isPremium && <Lock size={14} weight="fill" className="text-muted-foreground flex-shrink-0" />}
                  </h3>
                  <p className="font-body text-sm text-muted-foreground mt-0.5">
                    {label} · {p.duration_estimated}
                  </p>
                </div>
                <CaretRight size={18} weight="regular" className="text-muted-foreground flex-shrink-0" />
              </Wrapper>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 gap-3 mb-12">
          {activeTab === "hielo" ? (
            <Thermometer size={32} weight="duotone" className="text-muted-foreground" />
          ) : (
            <Fire size={32} weight="duotone" className="text-muted-foreground" />
          )}
          <p className="font-body text-sm text-muted-foreground text-center">
            No hay protocolos de {activeTab === "hielo" ? "frío" : "calor"} aún
          </p>
        </div>
      )}

      {/* Aprende sobre — siempre visible */}
      <h2 className="font-display text-xs tracking-[0.15em] text-muted-foreground mb-4">
        Aprende sobre el {activeTab === "hielo" ? "frío" : "calor"}
      </h2>
      <div className="space-y-3">
        {(activeTab === "hielo" ? LEARN_FRIO : LEARN_CALOR).map((item, i) => {
          const Icon = item.icon;
          const isFrio = activeTab === "hielo";
          return (
            <div key={i} className="group flex items-center gap-4 rounded-2xl bg-card/40 border border-white/[0.06] p-4 shadow-[inset_0_1px_1px_rgba(255,255,255,0.03)] transition-colors hover:bg-card/60">
              <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6 ${isFrio ? "bg-cyan-500/20" : "bg-orange-500/20"}`}>
                <Icon size={18} weight="duotone" className={`transition-all duration-300 ${isFrio ? "text-cyan-400 group-hover:drop-shadow-[0_0_6px_rgba(34,211,238,0.5)]" : "text-orange-400 group-hover:drop-shadow-[0_0_6px_rgba(245,158,11,0.5)]"}`} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-body text-base font-medium text-foreground">{item.title}</h3>
                <p className="font-body text-sm text-muted-foreground mt-0.5 leading-relaxed">{item.text}</p>
              </div>
            </div>
          );
        })}
      </div>
    </PageTransition>
  );
};

export default Sesion;
