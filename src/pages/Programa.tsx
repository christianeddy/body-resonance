import { useNavigate, useParams } from "react-router-dom";
import { PageTransition } from "@/components/layout/PageTransition";
import { ArrowLeft, Check, Lock } from "lucide-react";

const days = [
  { day: 1, title: "Introducción al método", duration: "8 min", status: "completed" as const },
  { day: 2, title: "Respiración consciente", duration: "10 min", status: "completed" as const },
  { day: 3, title: "Primer contacto con el frío", duration: "12 min", status: "current" as const },
  { day: 4, title: "Profundizando", duration: "10 min", status: "locked" as const },
  { day: 5, title: "Resistencia mental", duration: "15 min", status: "locked" as const },
  { day: 6, title: "Integración", duration: "12 min", status: "locked" as const },
  { day: 7, title: "Tu ritual completo", duration: "20 min", status: "locked" as const },
];

const Programa = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <PageTransition className="min-h-screen pb-8">
      <button
        onClick={() => navigate(-1)}
        className="pt-14 pb-4 text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft size={24} strokeWidth={1.5} />
      </button>

      <h1 className="font-display text-3xl text-foreground mb-2">NEW TO BODY</h1>
      <span className="inline-block rounded-full bg-primary/10 px-3 py-1 font-display text-[11px] text-accent mb-8">
        DÍA 3 DE 7
      </span>

      {/* Timeline */}
      <div className="relative pl-8 stagger-children">
        {/* Vertical line */}
        <div className="absolute left-3 top-0 bottom-0 w-px bg-[hsl(0_0%_100%/0.08)]" />

        {days.map((d) => (
          <div
            key={d.day}
            className={`relative mb-4 ${d.status === "locked" ? "opacity-40" : ""}`}
          >
            {/* Node */}
            <div className="absolute -left-[22px] top-3">
              {d.status === "completed" ? (
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-success/20">
                  <Check size={12} className="text-success" />
                </div>
              ) : d.status === "current" ? (
                <div className="h-5 w-5 rounded-full border-2 border-primary bg-background" />
              ) : (
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-card">
                  <Lock size={10} className="text-muted-foreground" />
                </div>
              )}
            </div>

            <div
              className={`card-body rounded-xl p-4 ${
                d.status === "current" ? "border-primary" : ""
              }`}
              style={d.status === "current" ? { borderColor: "hsl(221 83% 53%)" } : {}}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-display text-xs text-muted-foreground mb-1">DÍA {d.day}</p>
                  <p className="font-body text-sm font-medium text-foreground">{d.title}</p>
                </div>
                <p className="font-body text-xs text-muted-foreground">{d.duration}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </PageTransition>
  );
};

export default Programa;
