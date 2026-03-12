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
      {/* Glassmorphism bar */}
      <div
        className="mx-3 mb-3 rounded-2xl border border-white/[0.06] px-2 py-2.5"
        style={{
          background: "hsla(0, 0%, 6%, 0.85)",
          backdropFilter: "blur(24px) saturate(1.4)",
          WebkitBackdropFilter: "blur(24px) saturate(1.4)",
          boxShadow:
            "0 -4px 30px -8px hsla(0, 0%, 0%, 0.5), inset 0 1px 0 0 hsla(0, 0%, 100%, 0.04)",
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
                {/* Active glow behind icon */}
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
                {/* Active dot */}
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
