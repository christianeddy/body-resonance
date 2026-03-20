import { PageTransition } from "@/components/layout/PageTransition";
import { CaretRight, Thermometer, Heart, Clock, Snowflake, Fire, Lock } from "@phosphor-icons/react";
import { Link, useSearchParams } from "react-router-dom";
import { usePractices } from "@/hooks/usePractices";
import type { Practice } from "@/hooks/usePractices";
import heroFrio from "@/assets/hero-frio.png";
import heroCalor from "@/assets/hero-calor.png";

const getTagLabel = (p: Practice, isIce: boolean): string => {
  const tags = Array.isArray(p.tags) ? (p.tags as string[]).map((t) => String(t).toLowerCase()) : [];
  if (tags.includes("pre")) return "Preparación";
  if (tags.includes("durante")) return isIce ? "Durante el frío" : "Durante el calor";
  if (tags.includes("post")) return "Recuperación";
  return "Preparación";
};

const getTagStyle = (label: string) => {
  switch (label) {
    case "Preparación":
      return "bg-sky-500/15 text-sky-300 border-sky-500/30";
    case "Durante el frío":
      return "bg-blue-500/15 text-blue-300 border-blue-500/30";
    case "Recuperación":
      return "bg-emerald-500/15 text-emerald-300 border-emerald-500/30";
    default:
      return "bg-muted text-muted-foreground border-border";
  }
};

const LEARN_FRIO = [
  { icon: Heart, title: "Beneficios del frío", text: "Reduce inflamación, mejora la circulación, fortalece el sistema inmune y aumenta la resiliencia mental." },
  { icon: Clock, title: "Cuánto tiempo entrar", text: "Comienza con 30 segundos e incrementa gradualmente. El rango ideal es entre 1 y 3 minutos." },
  { icon: Thermometer, title: "Temperatura recomendada", text: "Entre 0°C y 15°C. Lo importante es que sientas el frío como un desafío controlable." },
];

const LEARN_CALOR = [
  { icon: Heart, title: "Beneficios del calor", text: "Mejora la circulación, relaja la musculatura y promueve la desintoxicación a través del sudor." },
  { icon: Clock, title: "Tiempo recomendado", text: "Sesiones de 10 a 20 minutos. Escucha a tu cuerpo y sal cuando lo necesites." },
  { icon: Thermometer, title: "Temperatura ideal", text: "Entre 60°C y 90°C para sauna tradicional. Lo importante es sentir el calor sin forzar." },
];

const Sesion = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "hielo";

  const { data: iceProtocols, isLoading: iceLoading } = usePractices("hielo");
  const { data: heatProtocols, isLoading: heatLoading } = usePractices("calor");

  const isIce = activeTab === "hielo";
  const protocols = isIce ? iceProtocols : heatProtocols;
  const isLoading = isIce ? iceLoading : heatLoading;
  const learnItems = isIce ? LEARN_FRIO : LEARN_CALOR;

  return (
    <PageTransition>
      {/* Tab switcher */}
      <div className="flex gap-2 pt-14 pb-6">
        <button
          onClick={() => setSearchParams({ tab: "hielo" })}
          className={`group font-display text-2xl flex items-center gap-2 px-1 pb-1 transition-all duration-300 ${
            isIce ? "text-foreground" : "text-muted-foreground/50 hover:text-muted-foreground"
          }`}
        >
          <Snowflake size={24} weight="duotone" className={`transition-all duration-500 ${isIce ? "text-sky-400" : "text-muted-foreground/50"}`} />
          <span className={isIce ? "frio-hover-gradient" : ""}>Frío</span>
          {isIce && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-sky-400 rounded-full" />}
        </button>
        <button
          onClick={() => setSearchParams({ tab: "calor" })}
          className={`group font-display text-2xl flex items-center gap-2 px-1 pb-1 transition-all duration-300 ${
            !isIce ? "text-foreground" : "text-muted-foreground/50 hover:text-muted-foreground"
          }`}
        >
          <Fire size={24} weight="duotone" className={`transition-all duration-500 ${!isIce ? "text-orange-400" : "text-muted-foreground/50"}`} />
          <span className={!isIce ? "calor-hover-gradient" : ""}>Calor</span>
        </button>
      </div>

      {/* Hero image */}
      <div className="relative rounded-2xl overflow-hidden mb-6">
        <img
          src={isIce ? heroFrio : heroCalor}
          alt={isIce ? "Ice bath Bodhi" : "Sauna Bodhi"}
          className="w-full h-52 object-cover animate-[heroZoom_1.2s_cubic-bezier(0.22,1,0.36,1)_forwards]"
          style={{ objectPosition: '50% 35%' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        <p className="absolute bottom-3 left-4 right-4 font-body text-sm text-foreground/90">
          {isIce
            ? "El frío es una herramienta poderosa para regular tu sistema nervioso."
            : "El calor activa la recuperación profunda y la relajación del cuerpo."}
        </p>
      </div>

      <h2 className="font-display text-base text-foreground mb-4">
        {isIce ? "Protocolo Bodhi para frío" : "Protocolo Bodhi para calor"}
      </h2>

      {isLoading ? (
        <div className="space-y-3 mb-12">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card-body rounded-xl p-5 h-20 animate-pulse" />
          ))}
        </div>
      ) : protocols && protocols.length > 0 ? (
        <div className="stagger-children space-y-2 mb-12">
          {protocols.map((p) => {
            const tagLabel = isIce ? getTagLabel(p) : "";
            const tagStyle = getTagStyle(tagLabel);
            const isPremium = p.premium;
            const Wrapper = isPremium ? 'div' : Link;
            const accentBg = isIce ? "bg-sky-500/20" : "bg-orange-500/20";
            const accentText = isIce ? "text-sky-400" : "text-orange-400";
            const IconComp = isIce ? Snowflake : Fire;
            const wrapperProps = isPremium
              ? { className: "flex items-center gap-3 rounded-xl bg-card/40 border border-border p-3 shadow-[inset_0_1px_1px_rgba(255,255,255,0.03)] opacity-70 cursor-not-allowed" }
              : { to: `/player/${p.id}`, className: "flex items-center gap-3 rounded-xl bg-card/40 border border-border p-3 shadow-[inset_0_1px_1px_rgba(255,255,255,0.03)] transition-colors hover:bg-card/60" };
            return (
              <Wrapper key={p.id} {...(wrapperProps as any)}>
                <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${accentBg}`}>
                  <IconComp size={16} weight="duotone" className={accentText} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-body text-sm font-medium text-foreground truncate flex items-center gap-2">
                    {p.display_name}
                    {isPremium && <Lock size={12} weight="fill" className="text-muted-foreground flex-shrink-0" />}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    {tagLabel && (
                      <span className={`inline-flex items-center rounded-full border px-2 py-0.5 font-display text-[10px] tracking-wide ${tagStyle}`}>
                        {tagLabel}
                      </span>
                    )}
                    <span className="font-body text-xs text-muted-foreground">{p.duration_estimated}</span>
                  </div>
                </div>
                <CaretRight size={18} weight="regular" className="text-muted-foreground flex-shrink-0" />
              </Wrapper>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 gap-3 mb-12">
          {isIce ? (
            <Snowflake size={32} weight="duotone" className="text-muted-foreground" />
          ) : (
            <Fire size={32} weight="duotone" className="text-muted-foreground" />
          )}
          <p className="font-body text-sm text-muted-foreground text-center">
            {isIce ? "No hay protocolos de frío aún" : "Próximamente — los protocolos de calor están en camino"}
          </p>
        </div>
      )}

      {/* Aprende sobre */}
      <h2 className="font-display text-base text-foreground mb-4">
        {isIce ? "Aprende sobre el frío" : "Aprende sobre el calor"}
      </h2>
      <div className="space-y-2">
        {learnItems.map((item, i) => {
          const Icon = item.icon;
          const iconBg = isIce ? "bg-sky-500/20" : "bg-orange-500/20";
          const iconText = isIce ? "text-sky-400" : "text-orange-400";
          const glowColor = isIce ? "rgba(56,189,248,0.5)" : "rgba(251,146,60,0.5)";
          return (
            <div key={i} className="group flex items-center gap-3 rounded-xl bg-card/40 border border-border p-3 shadow-[inset_0_1px_1px_rgba(255,255,255,0.03)] transition-colors hover:bg-card/60">
              <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${iconBg} transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6`}>
                <Icon size={16} weight="duotone" className={`${iconText} transition-all duration-300`} style={{ filter: `drop-shadow(0 0 0px ${glowColor})` }} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-body text-sm font-medium text-foreground">{item.title}</h3>
                <p className="font-body text-xs text-muted-foreground mt-0.5 leading-relaxed">{item.text}</p>
              </div>
            </div>
          );
        })}
      </div>
    </PageTransition>
  );
};

export default Sesion;