import { Link } from "react-router-dom";
import { Compass } from "@phosphor-icons/react";

const NotFound = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-5">
      <Compass size={48} weight="duotone" className="mb-6 text-muted-foreground" />
      <h1 className="mb-2 font-display text-6xl text-foreground">404</h1>
      <p className="mb-8 font-body text-base text-muted-foreground">
        Página no encontrada
      </p>
      <Link
        to="/"
        className="rounded-xl bg-primary px-6 py-3 font-display text-sm text-primary-foreground"
      >
        VOLVER AL INICIO
      </Link>
    </div>
  );
};

export default NotFound;
