import { useNavigate, useParams } from "react-router-dom";
import { PageTransition } from "@/components/layout/PageTransition";
import { ArrowLeft, Check, LockSimple } from "@phosphor-icons/react";
import { useProgram, useProgramProgress } from "@/hooks/usePrograms";

const Programa = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: program, isLoading } = useProgram(id);
  const { data: progress } = useProgramProgress(id);

  if (isLoading) {
    return (
      <PageTransition className="min-h-screen pb-8">
        <div className="pt-14 pb-4">
          <div className="h-8 w-48 bg-card rounded animate-pulse mb-4" />
          <div className="h-4 w-24 bg-card rounded animate-pulse" />
        </div>
      </PageTransition>
    );
  }

  if (!program) {
    return (
      <PageTransition className="min-h-screen flex items-center justify-center">
        <p className="font-body text-muted-foreground">Programa no encontrado</p>
      </PageTransition>
    );
  }

  const days = Array.isArray(program.days) ? program.days : [];
  const currentDay = progress?.current_day ?? 1;
  const completedDays: number[] = Array.isArray(progress?.completed_days) ? progress.completed_days as number[] : [];

  return (
    <PageTransition className="min-h-screen pb-8">
      <button
        onClick={() => navigate(-1)}
        className="pt-14 pb-4 text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft size={24} weight="duotone" />
      </button>

      <h1 className="font-display text-3xl text-foreground mb-2">{program.name}</h1>
      <span className="inline-block rounded-full bg-primary/10 px-3 py-1 font-display text-[11px] text-accent mb-8">
        DÍA {currentDay} DE {program.max_days}
      </span>

      {/* Timeline */}
      <div className="relative pl-8 stagger-children">
        <div className="absolute left-3 top-0 bottom-0 w-px bg-[hsl(0_0%_100%/0.08)]" />

        {days.map((d: any) => {
          const dayNum = d.day;
          const isCompleted = completedDays.includes(dayNum);
          const isCurrent = dayNum === currentDay && !isCompleted;
          const isLocked = dayNum > currentDay && !isCompleted;

          return (
            <div
              key={dayNum}
              className={`relative mb-4 ${isLocked ? "opacity-40" : ""}`}
            >
              <div className="absolute -left-[22px] top-3">
                {isCompleted ? (
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-success/20">
                    <Check size={12} weight="duotone" className="text-success" />
                  </div>
                ) : isCurrent ? (
                  <div className="h-5 w-5 rounded-full border-2 border-primary bg-background" />
                ) : (
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-card">
                    <LockSimple size={10} weight="duotone" className="text-muted-foreground" />
                  </div>
                )}
              </div>

              <div
                className={`card-body rounded-xl p-4 ${isCurrent ? "border-primary" : ""}`}
                style={isCurrent ? { borderColor: "hsl(221 83% 53%)" } : {}}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-display text-xs text-muted-foreground mb-1">DÍA {dayNum}</p>
                    <p className="font-body text-sm font-medium text-foreground">{d.title}</p>
                  </div>
                  <p className="font-body text-xs text-muted-foreground">
                    {d.practices?.length || 0} práctica{(d.practices?.length || 0) !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </PageTransition>
  );
};

export default Programa;
