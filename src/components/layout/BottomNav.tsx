import { NavLink, useLocation } from "react-router-dom";
import { House, Wind, Thermometer, UserCircle } from "@phosphor-icons/react";

const tabs = [
  { to: "/", label: "Inicio", icon: House },
  { to: "/respirar", label: "Respirar", icon: Wind },
  { to: "/sesion", label: "Sesión", icon: Thermometer },
  { to: "/perfil", label: "Perfil", icon: UserCircle },
];

export const BottomNav = () => {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-1/2 z-50 w-full max-w-6xl -translate-x-1/2">
      <div
        className="mx-3 mb-3 rounded-2xl border border-border/40 bg-card/90 px-2 py-2.5"
        style={{
          backdropFilter: "blur(24px) saturate(1.4)",
          WebkitBackdropFilter: "blur(24px) saturate(1.4)",
          boxShadow:
            "var(--shadow-card), var(--shadow-inner-glow)",
        }}
      >
        <div className="flex items-center justify-around">
          {tabs.map(({ to, label, icon: Icon }) => {
            const isActive =
              to === "/"
                ? location.pathname === "/"
                : location.pathname.startsWith(to);

            return (
              <NavLink
                key={to}
                to={to}
                className="group relative flex flex-col items-center gap-1 px-4 py-1.5 transition-all duration-200"
              >
                {isActive && (
                  <div className="absolute -top-1 h-8 w-8 rounded-full bg-primary/15 blur-lg" />
                )}
                <Icon
                  size={22}
                  weight={isActive ? "fill" : "duotone"}
                  className={`relative z-10 transition-colors duration-200 ${
                    isActive ? "text-accent" : "text-muted-foreground group-hover:text-foreground/70"
                  }`}
                />
                <span
                  className={`relative z-10 font-body text-[10px] tracking-wide transition-colors duration-200 ${
                    isActive ? "text-foreground" : "text-muted-foreground group-hover:text-foreground/70"
                  }`}
                >
                  {label}
                </span>
                <div
                  className={`h-1 w-1 rounded-full transition-all duration-300 ${
                    isActive ? "bg-accent scale-100" : "bg-transparent scale-0"
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