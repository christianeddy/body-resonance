import { Outlet } from "react-router-dom";
import { BottomNav } from "./BottomNav";

export const MobileShell = () => {
  return (
    <div className="relative mx-auto min-h-screen w-full max-w-md bg-background">
      <main className="pb-24">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
};
