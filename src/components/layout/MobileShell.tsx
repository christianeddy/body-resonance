import { Outlet } from "react-router-dom";
import { BottomNav } from "./BottomNav";

export const MobileShell = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="relative mx-auto min-h-screen w-full max-w-6xl bg-background">
        <main className="pb-32">
          <Outlet />
        </main>
        <BottomNav />
      </div>
    </div>
  );
};
