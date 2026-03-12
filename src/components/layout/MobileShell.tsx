import { Outlet } from "react-router-dom";
import { BottomNav } from "./BottomNav";

export const MobileShell = () => {
  return (
    <div className="min-h-screen bg-[#020202]">
      {/* Desktop background decoration */}
      <div className="hidden lg:block fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.02] to-transparent" />
        <div className="absolute left-1/2 -translate-x-1/2 top-8 font-display text-sm text-muted-foreground/20 tracking-[0.3em]">
          B·O·D·H·I
        </div>
      </div>

      {/* App container */}
      <div className="relative mx-auto min-h-screen w-full md:max-w-[600px] lg:max-w-[480px] bg-background lg:border-x lg:border-[hsl(0_0%_100%/0.04)]">
        <main className="pb-24">
          <Outlet />
        </main>
        <BottomNav />
      </div>
    </div>
  );
};
