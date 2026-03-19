import { NavLink, useLocation } from "react-router-dom";
import { House, Wind, Snowflake, UserCircle } from "@phosphor-icons/react";

const tabs = [
  { to: "/", label: "Inicio", icon: House },
  { to: "/respirar", label: "Respirar", icon: Wind },
  { to: "/sesion?tab=hielo", label: "Frío", icon: Snowflake, match: "/sesion", matchParam: "hielo" },
  { to: "/perfil", label: "Perfil", icon: UserCircle },
];

export const BottomNav = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  return (
    <nav className="fixed bottom-0 left-1/2 z-50 w-full max-w-6xl -translate-x-1/2">
      <div
        className="mx-3 mb-3 rounded-2xl border border-border/40 bg-card/90 px-2 py-2.5"
        style={{
          backdropFilter: "blur(24px) saturate(1.4)",
          WebkitBackdropFilter: "blur(24px) saturate(1.4)",
          boxShadow: "var(--shadow-card), var(--shadow-inner-glow)",
        }}
      >
        <div className="flex items-center justify-around">
          {tabs.map(({ to, label, icon: Icon, match, matchParam }) => {
            let isActive: boolean;
            if (match && matchParam) {
              isActive = location.pathname.startsWith(match) && searchParams.get("tab") === matchParam;
            } else if (to === "/") {
              isActive = location.pathname === "/";
            } else {
              isActive = location.pathname.startsWith(to);
            }

            const accentColor =
              label === "Frío" ? "text-cyan-400" : label === "Calor" ? "text-orange-400" : undefined;
            const dotColor =
              label === "Frío" ? "bg-cyan-400" : label === "Calor" ? "bg-orange-400" : "bg-accent";

            return (
              <NavLink
                key={to}
                to={to}
                className="group relative flex flex-col items-center gap-1 px-3 py-1.5 transition-all duration-200"
              >
                {isActive && (
                  <div className="absolute -top-1 h-8 w-8 rounded-full bg-primary/15 blur-lg" />
                )}
                <Icon
                  key={isActive ? `${to}-active` : to}
                  size={22}
                  weight={isActive ? "fill" : "duotone"}
                  className={`relative z-10 transition-colors duration-200 ${
                    isActive
                      ? `${accentColor || "text-accent"} animate-[bounce-pop_0.4s_ease-out]`
                      : "text-muted-foreground group-hover:text-foreground/70"
                  }`}
                />
                <span
                  className={`relative z-10 font-body text-[10px] tracking-wide transition-colors duration-200 ${
                    isActive && !accentColor ? "text-foreground" : !isActive ? "text-muted-foreground group-hover:text-foreground/70" : ""
                  }`}
                  style={
                    isActive && accentColor
                      ? {
                          background: label === "Frío"
                            ? "linear-gradient(90deg, #22d3ee, #818cf8)"
                            : "linear-gradient(90deg, #f59e0b, #ef4444)",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                        }
                      : undefined
                  }
                >
                  {label}
                </span>
                <div
                  className={`h-1 w-1 rounded-full transition-all duration-300 ${
                    isActive ? `${dotColor} scale-100` : "bg-transparent scale-0"
                  }`}
                />
              </NavLink>
            );
          })}
        </div>
      </div>
    </nav>
  );
};