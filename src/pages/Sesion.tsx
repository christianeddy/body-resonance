import { PageTransition } from "@/components/layout/PageTransition";
import { CaretRight, Thermometer, Heart, Clock, Snowflake, Lock } from "@phosphor-icons/react";
import { Link } from "react-router-dom";
import { usePractices } from "@/hooks/usePractices";
import type { Practice } from "@/hooks/usePractices";
import heroFrio from "@/assets/hero-frio.png";

const getTagLabel = (p: Practice): string => {
  const tags = Array.isArray(p.tags) ? (p.tags as string[]).map((t) => String(t).toLowerCase()) : [];
  if (tags.includes("pre")) return "Preparación";
  if (tags.includes("durante")) return "Durante el frío";
  if (tags.includes("post")) return "Recuperación";
  return "Preparación";
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

  const { data: iceProtocols, isLoading } = usePractices("hielo");
  const protocols = iceProtocols;

  return (
    <PageTransition>
      <h1 className="group font-display text-2xl pt-14 pb-6 flex items-center gap-2.5 cursor-default transition-all duration-500">
        <Snowflake size={24} weight="duotone" className="text-sky-400 transition-transform duration-500 group-hover:rotate-90 group-hover:scale-110" />
        <span className="frio-hover-gradient transition-all duration-500">Frío</span>
      </h1>

      {/* Hero image */}
      <div className="relative rounded-2xl overflow-hidden mb-6">
        <img src={heroFrio} alt="Ice bath Bodhi" className="w-full h-52 object-cover animate-[heroZoom_1.2s_cubic-bezier(0.22,1,0.36,1)_forwards]" style={{ objectPosition: '50% 35%' }} />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        <p className="absolute bottom-3 left-4 right-4 font-body text-sm text-foreground/90">
          El frío es una herramienta poderosa para regular tu sistema nervioso.
        </p>
      </div>

      <h2 className="font-display text-base text-foreground mb-4">Protocolo Bodhi para frío</h2>

      {isLoading ? (
        <div className="space-y-3 mb-12">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card-body rounded-xl p-5 h-20 animate-pulse" />
          ))}
        </div>
      ) : protocols && protocols.length > 0 ? (
        <div className="stagger-children space-y-2 mb-12">
        {protocols.map((p) => {
            const tagLabel = getTagLabel(p);
            const isPremium = p.premium;
            const Wrapper = isPremium ? 'div' : Link;
            const wrapperProps = isPremium
              ? { className: "flex items-center gap-3 rounded-xl bg-card/40 border border-border p-3 shadow-[inset_0_1px_1px_rgba(255,255,255,0.03)] opacity-70 cursor-not-allowed" }
              : { to: `/player/${p.id}`, className: "flex items-center gap-3 rounded-xl bg-card/40 border border-border p-3 shadow-[inset_0_1px_1px_rgba(255,255,255,0.03)] transition-colors hover:bg-card/60" };
            return (
              <Wrapper
                key={p.id}
                {...(wrapperProps as any)}
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-sky-500/20">
                  <Snowflake size={16} weight="duotone" className="text-sky-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-body text-sm font-medium text-foreground truncate flex items-center gap-1.5">
                    {p.display_name}
                    {isPremium && <Lock size={12} weight="fill" className="text-muted-foreground flex-shrink-0" />}
                  </h3>
                  <p className="font-body text-xs text-muted-foreground mt-0.5">
                    {tagLabel} · {p.duration_estimated}
                  </p>
                </div>
                <CaretRight size={18} weight="regular" className="text-muted-foreground flex-shrink-0" />
              </Wrapper>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 gap-3 mb-12">
          <Snowflake size={32} weight="duotone" className="text-muted-foreground" />
          <p className="font-body text-sm text-muted-foreground text-center">
            No hay protocolos de frío aún
          </p>
        </div>
      )}

      {/* Aprende sobre — siempre visible */}
      <h2 className="font-display text-base text-foreground mb-4">Aprende sobre el frío</h2>
      <div className="space-y-2">
        {LEARN_FRIO.map((item, i) => {
          const Icon = item.icon;
          return (
            <div key={i} className="group flex items-center gap-3 rounded-xl bg-card/40 border border-border p-3 shadow-[inset_0_1px_1px_rgba(255,255,255,0.03)] transition-colors hover:bg-card/60">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-sky-500/20 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
                <Icon size={16} weight="duotone" className="text-sky-400 transition-all duration-300 group-hover:drop-shadow-[0_0_6px_rgba(56,189,248,0.5)]" />
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
