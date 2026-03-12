import { Outlet } from "react-router-dom";
import { BottomNav } from "./BottomNav";
import { Sun, Moon } from "@phosphor-icons/react";
import { useTheme } from "next-themes";

export const MobileShell = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="min-h-screen bg-background">
      <div className="relative mx-auto min-h-screen w-full max-w-6xl bg-background">
        {/* Theme toggle — top right, all screens */}
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="fixed top-4 right-4 z-50 flex h-10 w-10 items-center justify-center rounded-xl bg-card/80 backdrop-blur-md border border-border/30 transition-all duration-200 hover:scale-105 active:scale-95"
          style={{ boxShadow: "0 4px 12px hsl(0 0% 0% / 0.3)" }}
        >
          {theme === "dark" ? (
            <Sun size={18} weight="duotone" className="text-amber-400" />
          ) : (
            <Moon size={18} weight="duotone" className="text-indigo-400" />
          )}
        </button>
        <main className="pb-24">
          <Outlet />
        </main>
        <BottomNav />
      </div>
    </div>
  );
};
