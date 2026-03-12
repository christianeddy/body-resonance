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
            className="h-16 mx-auto mb-6 brightness-0 invert"
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
