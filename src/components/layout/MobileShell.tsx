import { Outlet } from "react-router-dom";
import { BottomNav } from "./BottomNav";

export const MobileShell = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="relative mx-auto min-h-screen w-full max-w-4xl bg-background lg:border-x lg:border-border/60">
        <main className="pb-24">
          <Outlet />
        </main>
        <BottomNav />
      </div>
    </div>
  );
};
