import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import logoSymbol from "@/assets/logo-symbol.png";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn, signUp, signInWithGoogle, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate("/", { replace: true });
  }, [user, navigate]);

  const handleForgotPassword = async () => {
    if (!email) {
      toast.error("Ingresa tu email primero");
      return;
    }
    await supabase.auth.resetPasswordForEmail(email);
    toast.success("Revisa tu email para restablecer tu contraseña");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        await signIn(email, password);
        navigate("/");
      } else {
        await signUp(email, password, displayName || email.split("@")[0]);
        toast.success("Cuenta creada. Revisa tu email para confirmar.");
      }
    } catch (err: any) {
      toast.error(err.message || "Error de autenticación");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-background flex flex-col items-center justify-center px-5">
      <div className="w-full max-w-sm animate-fade-in">
        {/* Logo */}
        <div className="text-center mb-10">
          <img
            src={logoSymbol}
            alt="BODHI"
            className="h-12 mx-auto mb-6 brightness-0 invert"
          />
          <h1 className="font-display text-3xl font-bold text-foreground mb-2">
            BODHI Lab
          </h1>
          <p className="font-body text-sm text-muted-foreground">
            Vuelve a tu centro
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {!isLogin && (
            <input
              type="text"
              placeholder="Nombre"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full rounded-xl border border-white/[0.06] bg-[hsl(0,0%,18%)] px-4 py-3.5 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded-xl border border-white/[0.06] bg-[hsl(0,0%,18%)] px-4 py-3.5 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full rounded-xl border border-white/[0.06] bg-[hsl(0,0%,18%)] px-4 py-3.5 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
          />
          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center rounded-xl bg-primary py-3.5 font-display text-sm font-semibold text-primary-foreground disabled:opacity-50 transition-all duration-300 hover:shadow-[0_0_20px_-4px_hsl(221,83%,53%,0.5)] hover:scale-[1.01] active:scale-[0.99]"
          >
            {loading ? (
              <div className="h-4 w-4 rounded-full border-2 border-primary-foreground border-t-transparent animate-spin" />
            ) : (
              isLogin ? "Iniciar sesión" : "Crear cuenta"
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-4 my-6">
          <div className="flex-1 h-px bg-white/[0.06]" />
          <span className="font-body text-xs text-muted-foreground">o</span>
          <div className="flex-1 h-px bg-white/[0.06]" />
        </div>

        {/* Google */}
        <button
          onClick={() => signInWithGoogle()}
          className="flex w-full items-center justify-center gap-3 rounded-xl border border-white/[0.06] bg-[hsl(0,0%,18%)] py-3.5 font-display text-sm font-semibold text-foreground transition-all duration-300 hover:bg-[hsl(0,0%,22%)] hover:scale-[1.01] active:scale-[0.99]"
        >
          <svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
          Continuar con Google
        </button>

        {/* Forgot password */}
        {isLogin && (
          <div className="flex justify-center mt-5">
            <button
              onClick={handleForgotPassword}
              className="font-body text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              ¿Olvidaste tu contraseña?
            </button>
          </div>
        )}

        {/* Toggle */}
        <div className="flex justify-center mt-3 gap-1">
          <span className="font-body text-sm text-muted-foreground">
            {isLogin ? "¿No tienes cuenta?" : "¿Ya tienes cuenta?"}
          </span>
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="font-body text-sm text-accent hover:underline"
          >
            {isLogin ? "Crear cuenta" : "Iniciar sesión"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
