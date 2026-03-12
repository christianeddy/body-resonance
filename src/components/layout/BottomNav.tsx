import { NavLink, useLocation } from "react-router-dom";
import { Home, Wind, Snowflake, User } from "lucide-react";

const tabs = [
  { to: "/", label: "INICIO", icon: Home },
  { to: "/respirar", label: "RESPIRAR", icon: Wind },
  { to: "/sesion", label: "SESIÓN", icon: Snowflake },
  { to: "/perfil", label: "PERFIL", icon: User },
];

export const BottomNav = () => {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-1/2 z-50 w-full max-w-4xl -translate-x-1/2 border-t border-[hsl(0_0%_100%/0.06)] bg-background/95 backdrop-blur-md">
      <div className="flex items-center justify-around px-2 py-2">
        {tabs.map(({ to, label, icon: Icon }) => {
          const isActive =
            to === "/"
              ? location.pathname === "/"
              : location.pathname.startsWith(to);

          return (
            <NavLink
              key={to}
              to={to}
              className="flex flex-col items-center gap-1 px-3 py-1"
            >
              <Icon
                size={20}
                strokeWidth={1.5}
                className={isActive ? "text-foreground" : "text-muted-foreground"}
              />
              <span
                className={`font-display text-[10px] tracking-wider ${
                  isActive ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {label}
              </span>
              {/* Active dot indicator */}
              <div
                className={`h-1 w-1 rounded-full transition-all duration-200 ${
                  isActive ? "bg-primary scale-100" : "bg-transparent scale-0"
                }`}
              />
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};
