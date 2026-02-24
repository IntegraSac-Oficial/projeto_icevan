"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Snowflake, Eye, EyeOff, Loader2, Lock, Mail, Zap } from "lucide-react";
import { empresa } from "@/lib/config";

/* ── Dev-only: preenche campos com credenciais do .env ─── */
function DevFillButton({
  onFill,
}: {
  onFill: (email: string, password: string) => void;
}) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const fill = async () => {
    setBusy(true);
    setErr("");
    try {
      const res = await fetch("/api/admin/dev-credentials");
      const data = await res.json();
      if (res.ok && data.email && data.password) {
        onFill(data.email, data.password);
      } else {
        setErr(data.error ?? "Credenciais não encontradas no .env.local");
      }
    } catch {
      setErr("Erro ao buscar credenciais");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-1.5">
      <button
        type="button"
        onClick={fill}
        disabled={busy}
        className="w-full flex items-center justify-center gap-2 py-2.5 px-4
                   border-2 border-dashed border-amber-300 rounded-lg
                   text-sm font-semibold text-amber-700 bg-amber-50
                   hover:bg-amber-100 hover:border-amber-400
                   transition-all duration-150
                   disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {busy ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Zap className="w-4 h-4" />
        )}
        {busy ? "Buscando credenciais..." : "DEV — Preencher credenciais"}
      </button>
      {err && (
        <p className="text-xs text-red-500 text-center">{err}</p>
      )}
    </div>
  );
}

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        router.push("/admin");
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.error || "E-mail ou senha incorretos");
      }
    } catch {
      setError("Erro de conexão. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-primary flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo / Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 mb-4">
            <Snowflake className="w-8 h-8 text-brand-accent" />
          </div>
          <h1 className="text-2xl font-heading font-bold text-white">
            {empresa.nome}
          </h1>
          <p className="text-white/60 text-sm mt-1">Painel Administrativo</p>
        </div>

        {/* Card de login */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-brand-primary/10 rounded-lg">
              <Lock className="w-5 h-5 text-brand-primary" />
            </div>
            <div>
              <h2 className="font-heading font-bold text-brand-primary text-lg">
                Acesso Restrito
              </h2>
              <p className="text-gray-500 text-sm">
                Digite suas credenciais para acessar o painel
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Campo E-mail */}
            <div>
              <label className="form-label" htmlFor="email">
                E-mail
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className="form-input pl-10"
                  autoFocus
                  required
                />
              </div>
            </div>

            {/* Campo Senha */}
            <div>
              <label className="form-label" htmlFor="password">
                Senha
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Digite sua senha"
                  className="form-input pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400
                             hover:text-gray-600 transition-colors"
                  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !email || !password}
              className="btn-accent w-full justify-center py-3.5 text-base
                         disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Verificando...
                </>
              ) : (
                "Entrar no Painel"
              )}
            </button>

            {/* DEV ONLY — invisível em produção via endpoint protegido */}
            {process.env.NODE_ENV === "development" && (
              <DevFillButton onFill={(e, p) => { setEmail(e); setPassword(p); }} />
            )}
          </form>
        </div>

        <p className="text-center text-white/40 text-xs mt-6">
          © {new Date().getFullYear()} {empresa.nome} — Área Restrita
        </p>
      </div>
    </div>
  );
}
