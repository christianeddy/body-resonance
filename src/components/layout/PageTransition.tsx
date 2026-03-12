import { ReactNode } from "react";

interface PageTransitionProps {
  children: ReactNode;
  className?: string;
}

export const PageTransition = ({ children, className = "" }: PageTransitionProps) => {
  return (
    <div className={`animate-page-enter px-5 ${className}`}>
      {children}
    </div>
  );
};
