import { Outlet } from "react-router-dom";
import { BottomNav } from "./BottomNav";

export const MobileShell = () => {
  return (
    <div className="min-h-screen bg-[#020202]">
      <div className="relative mx-auto min-h-screen w-full max-w-2xl bg-background border-x border-[hsl(0_0%_100%/0.04)]">
        <main className="pb-24">
          <Outlet />
        </main>
        <BottomNav />
      </div>
    </div>
  );
};
