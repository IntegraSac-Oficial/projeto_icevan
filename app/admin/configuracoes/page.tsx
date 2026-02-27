"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Palette,
  Mail,
  Lock,
  Save,
  Loader2,
  CheckCircle,
  Upload,
  Eye,
  EyeOff,
  RefreshCw,
  Image as ImageIcon,
  Building2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// ─── Tipos ────────────────────────────────────────────────────────────────────

type Tab = "aparencia" | "empresa" | "smtp" | "acesso";

interface Settings {
  // Cores
  cor_primaria:   string;
  cor_secundaria: string;
  cor_destaque:   string;
  cor_neutra:     string;
  cor_texto:      string;
  // SMTP
  smtp_host:    string;
  smtp_port:    string;
  smtp_user:    string;
  smtp_pass:    string;
  smtp_from:    string;
  smtp_nome:    string;
  // Filtro do banner hero
  hero_filtro_cor:        string;
  hero_filtro_opacidade:  string;
  // Empresa / Rodapé
  empresa_descricao:  string;
  empresa_endereco:   string;
  empresa_telefone:   string;
  empresa_email:      string;
  empresa_horario:    string;
  footer_copyright:   string;
  footer_rodape:      string;
  // Acesso (não persiste senha no estado — campos separados)
}

const DEFAULTS: Settings = {
  cor_primaria:   "#003957",
  cor_secundaria: "#2D92BE",
  cor_destaque:   "#F28C28",
  cor_neutra:     "#F5F5F5",
  cor_texto:      "#1A1A1A",
  smtp_host:  "",
  smtp_port:  "587",
  smtp_user:  "",
  smtp_pass:  "",
  smtp_from:  "",
  smtp_nome:  "",
  hero_filtro_cor:       "#2563EB",
  hero_filtro_opacidade: "20",
  empresa_descricao: "Especialistas em sistemas de refrigeração e isolamento térmico para veículos de transporte. Atendemos transportadoras, frotas e autônomos em todo o Brasil.",
  empresa_endereco:  "Rua Gabriela Mistral, 1246 — Penha de França, São Paulo/SP, CEP 03701-000",
  empresa_telefone:  "(11) 94824-2999",
  empresa_email:     "vendas@icevans.com.br",
  empresa_horario:   "Seg a Sex: 8h às 18h | Sáb: 8h às 12h",
  footer_copyright:  "© 2026 Ice Van. Todos os direitos reservados.",
  footer_rodape:     "CNPJ — Refrigeração para Transporte | São Paulo, SP",
};

// ─── Componente de color picker com preview ────────────────────────────────

function ColorField({
  label,
  value,
  cssVar,
  onChange,
}: {
  label: string;
  value: string;
  cssVar: string;
  onChange: (v: string) => void;
}) {
  const handleChange = (v: string) => {
    onChange(v);
    document.documentElement.style.setProperty(cssVar, v);
  };

  return (
    <div className="flex items-center gap-3">
      <div className="relative flex-shrink-0">
        <div
          className="w-10 h-10 rounded-lg border border-gray-200 shadow-sm cursor-pointer"
          style={{ backgroundColor: value }}
        />
        <input
          type="color"
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
          title={label}
        />
      </div>
      <div className="flex-1">
        <label className="text-xs font-medium text-gray-500 block mb-1">{label}</label>
        <input
          type="text"
          value={value}
          onChange={(e) => {
            const v = e.target.value;
            if (/^#[0-9A-Fa-f]{0,6}$/.test(v)) handleChange(v);
          }}
          className="form-input text-sm font-mono py-1.5"
          maxLength={7}
          placeholder="#000000"
        />
      </div>
    </div>
  );
}

// ─── Upload de logo ────────────────────────────────────────────────────────

function LogoUpload({
  label,
  description,
  folder,
  currentSrc,
  onUploaded,
}: {
  label: string;
  description: string;
  folder: string;
  currentSrc: string;
  onUploaded: (url: string) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(currentSrc);

  // Busca a logo atual ao montar o componente
  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const res = await fetch("/api/logo");
        const data = await res.json();
        
        console.log('Buscando logo para:', label);
        console.log('Dados recebidos:', data);
        
        if (label.includes("Principal") && data.principal) {
          const url = data.principal + '?t=' + Date.now();
          console.log('Setando preview Principal:', url);
          setPreview(url);
        } else if (label.includes("Branca") && data.branca) {
          const url = data.branca + '?t=' + Date.now();
          console.log('Setando preview Branca:', url);
          setPreview(url);
        } else if (label.includes("Favicon") && data.favicon) {
          const url = data.favicon + '?t=' + Date.now();
          console.log('Setando preview Favicon:', url);
          setPreview(url);
        } else {
          console.log('Nenhuma logo encontrada, usando fallback');
          setPreview(currentSrc);
        }
      } catch (error) {
        console.error('Erro ao buscar logo:', error);
        setPreview(currentSrc);
      }
    };
    
    fetchLogo();
  }, [label, currentSrc]);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

      console.log('');
      console.log('═══════════════════════════════════════════════════════════');
      console.log('📤 UPLOAD DE LOGO INICIADO');
      console.log('═══════════════════════════════════════════════════════════');
      console.log('📝 Label:', label);
      console.log('📁 Pasta:', folder);
      console.log('📄 Arquivo:', file.name);
      console.log('📊 Tamanho:', (file.size / 1024).toFixed(2), 'KB');
      console.log('📎 Tipo:', file.type);
      console.log('');

      setUploading(true);

      try {
        // Define o nome base e mantém a extensão do arquivo enviado
        let targetFilename = "";
        let baseFilename = "";
        const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';

        console.log('───────────────────────────────────────────────────────────');
        console.log('ETAPA 1: Determinando nome do arquivo');
        console.log('───────────────────────────────────────────────────────────');

        if (label.includes("Principal")) {
          baseFilename = "logo";
          targetFilename = `logo.${ext}`;
          console.log('🎯 Tipo: Logo Principal');
        } else if (label.includes("Branca")) {
          baseFilename = "logo-white";
          targetFilename = `logo-white.${ext}`;
          console.log('🎯 Tipo: Logo Branca');
        } else if (label.includes("Favicon")) {
          baseFilename = "favicon";
          targetFilename = `favicon.${ext}`;
          console.log('🎯 Tipo: Favicon');
        }

        console.log('📝 Nome base:', baseFilename);
        console.log('📝 Nome final:', targetFilename);
        console.log('📎 Extensão:', ext);
        console.log('');

        // PASSO 1: Deletar TODOS os arquivos antigos com o mesmo nome base
        console.log('───────────────────────────────────────────────────────────');
        console.log('ETAPA 2: Deletando arquivos antigos');
        console.log('───────────────────────────────────────────────────────────');
        const extensoesParaDeletar = ['svg', 'png', 'jpg', 'jpeg', 'webp', 'gif', 'ico'];

        for (const extAntiga of extensoesParaDeletar) {
          const nomeAntigo = `${baseFilename}.${extAntiga}`;
          console.log('🗑️  Tentando deletar:', nomeAntigo);

          try {
            const deleteUrl = `/api/admin/images/${encodeURIComponent(nomeAntigo)}?folder=${encodeURIComponent(folder)}`;
            const deleteRes = await fetch(deleteUrl, { method: "DELETE" });

            if (deleteRes.ok) {
              console.log('   ✅ Deletado:', nomeAntigo);
            } else {
              console.log('   ⚠️  Não encontrado:', nomeAntigo);
            }
          } catch (error) {
            console.log('   ⚠️  Erro (arquivo pode não existir):', nomeAntigo);
          }
        }

        console.log('');
        console.log('───────────────────────────────────────────────────────────');
        console.log('ETAPA 3: Fazendo upload do novo arquivo');
        console.log('───────────────────────────────────────────────────────────');

        const fd = new FormData();
        fd.append("file", file);
        fd.append("folder", folder);

        if (targetFilename) {
          fd.append("saveas", targetFilename);
          console.log('📦 FormData:');
          console.log('   - file:', file.name);
          console.log('   - folder:', folder);
          console.log('   - saveas:', targetFilename);
        }

        console.log('');
        console.log('🌐 Enviando POST para /api/admin/images...');
        const res = await fetch("/api/admin/images", { method: "POST", body: fd });
        const data = await res.json();

        console.log('📥 Status HTTP:', res.status, res.ok ? '✅' : '❌');
        console.log('📥 Resposta:', JSON.stringify(data, null, 2));
        console.log('');

        if (data.ok && data.url) {
          const urlWithTimestamp = `${data.url}?t=${Date.now()}`;
          console.log('═══════════════════════════════════════════════════════════');
          console.log('✅✅✅ UPLOAD BEM-SUCEDIDO! ✅✅✅');
          console.log('═══════════════════════════════════════════════════════════');
          console.log('🌐 URL:', urlWithTimestamp);
          console.log('📝 Arquivo salvo:', data.filename);
          console.log('⏰ Timestamp:', data.timestamp);
          console.log('');
          console.log('💡 PRÓXIMOS PASSOS:');
          console.log('   1. Clique em "Atualizar Página" abaixo');
          console.log('   2. Se não aparecer, use Ctrl+Shift+R');
          console.log('═══════════════════════════════════════════════════════════');
          console.log('');

          setPreview(urlWithTimestamp);
          onUploaded(urlWithTimestamp);

          // Força atualização do preview após 500ms
          setTimeout(() => {
            const newUrl = `${data.url}?t=${Date.now()}`;
            console.log('🔄 Atualizando preview:', newUrl);
            setPreview(newUrl);
          }, 500);
        } else {
          console.error('');
          console.error('❌❌❌ ERRO NO UPLOAD ❌❌❌');
          console.error('Status:', res.status);
          console.error('Dados:', data);
          console.error('═══════════════════════════════════════════════════════════');
          console.error('');
        }
      } catch (error) {
        console.error('');
        console.error('❌❌❌ ERRO GERAL NO UPLOAD ❌❌❌');
        console.error('Tipo:', error instanceof Error ? error.name : typeof error);
        console.error('Mensagem:', error instanceof Error ? error.message : String(error));
        console.error('Stack:', error instanceof Error ? error.stack : 'N/A');
        console.error('═══════════════════════════════════════════════════════════');
        console.error('');
      } finally {
        setUploading(false);
      }
    };

  return (
    <div className="flex items-center gap-4 p-4 border border-gray-200 rounded-xl bg-gray-50">
      <div className="w-16 h-16 rounded-lg bg-white border border-gray-200 flex items-center justify-center overflow-hidden flex-shrink-0">
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img 
            src={preview} 
            alt={label} 
            className="max-w-full max-h-full object-contain" 
            key={preview}
            onError={(e) => {
              console.error('Erro ao carregar preview da logo:', preview);
              e.currentTarget.src = currentSrc;
            }}
          />
        ) : (
          <ImageIcon className="w-6 h-6 text-gray-300" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-800">{label}</p>
        <p className="text-xs text-gray-400 mt-0.5">{description}</p>
      </div>
      <label className={cn(
        "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium cursor-pointer transition-colors",
        uploading
          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
          : "bg-brand-primary text-white hover:bg-brand-primary/90"
      )}>
        {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
        {uploading ? "Enviando..." : "Trocar"}
        <input type="file" accept="image/*" className="hidden" onChange={handleFile} disabled={uploading} />
      </label>
    </div>
  );
}

// ─── Página principal ──────────────────────────────────────────────────────

export default function ConfiguracoesPage() {
  const [tab, setTab] = useState<Tab>("aparencia");
  const [settings, setSettings] = useState<Settings>(DEFAULTS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [testingSmtp, setTestingSmtp] = useState(false);
  const [smtpMsg, setSmtpMsg] = useState("");

  // Campos de acesso (separados por segurança)
  const [newEmail, setNewEmail]           = useState("");
  const [newPassword, setNewPassword]     = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPass, setShowPass]           = useState(false);
  const [accessError, setAccessError]     = useState("");
  const [accessSaved, setAccessSaved]     = useState(false);
  const [savingAccess, setSavingAccess]   = useState(false);

  const fetchSettings = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/admin/settings");
    const data: Record<string, string> = await res.json();
    setSettings((prev) => ({ ...prev, ...data }));
    setLoading(false);
  }, []);

  useEffect(() => { fetchSettings(); }, [fetchSettings]);

  const handleSaveAppearance = async () => {
    setSaving(true);
    setSaved(false);
    await fetch("/api/admin/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        cor_primaria:          settings.cor_primaria,
        cor_secundaria:        settings.cor_secundaria,
        cor_destaque:          settings.cor_destaque,
        cor_neutra:            settings.cor_neutra,
        cor_texto:             settings.cor_texto,
        hero_filtro_cor:       settings.hero_filtro_cor,
        hero_filtro_opacidade: settings.hero_filtro_opacidade,
      }),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleSaveSmtp = async () => {
    setSaving(true);
    setSaved(false);
    await fetch("/api/admin/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        smtp_host: settings.smtp_host,
        smtp_port: settings.smtp_port,
        smtp_user: settings.smtp_user,
        smtp_pass: settings.smtp_pass,
        smtp_from: settings.smtp_from,
        smtp_nome: settings.smtp_nome,
      }),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleTestSmtp = async () => {
    setTestingSmtp(true);
    setSmtpMsg("");
    try {
      const res = await fetch("/api/admin/settings/test-smtp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          smtp_host: settings.smtp_host,
          smtp_port: settings.smtp_port,
          smtp_user: settings.smtp_user,
          smtp_pass: settings.smtp_pass,
          smtp_from: settings.smtp_from,
          smtp_nome: settings.smtp_nome,
        }),
      });
      const data = await res.json();
      setSmtpMsg(data.ok ? "✅ Conexão SMTP bem-sucedida!" : `❌ Erro: ${data.error}`);
    } catch {
      setSmtpMsg("❌ Erro de conexão ao testar SMTP.");
    }
    setTestingSmtp(false);
  };

  const handleSaveEmpresa = async () => {
    setSaving(true);
    setSaved(false);
    await fetch("/api/admin/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        empresa_descricao: settings.empresa_descricao,
        empresa_endereco:  settings.empresa_endereco,
        empresa_telefone:  settings.empresa_telefone,
        empresa_email:     settings.empresa_email,
        empresa_horario:   settings.empresa_horario,
        footer_copyright:  settings.footer_copyright,
        footer_rodape:     settings.footer_rodape,
      }),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleSaveAccess = async () => {
    setAccessError("");
    setAccessSaved(false);
    if (!newEmail && !newPassword) {
      setAccessError("Preencha ao menos o e-mail ou a senha.");
      return;
    }
    if (newPassword && newPassword !== confirmPassword) {
      setAccessError("As senhas não coincidem.");
      return;
    }
    if (newPassword && newPassword.length < 8) {
      setAccessError("A senha deve ter no mínimo 8 caracteres.");
      return;
    }
    setSavingAccess(true);
    const payload: Record<string, string> = {};
    if (newEmail)    payload.admin_email    = newEmail;
    if (newPassword) payload.admin_password = newPassword;
    await fetch("/api/admin/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setSavingAccess(false);
    setAccessSaved(true);
    setNewEmail("");
    setNewPassword("");
    setConfirmPassword("");
    setTimeout(() => setAccessSaved(false), 4000);
  };

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "aparencia", label: "Aparência", icon: <Palette    className="w-4 h-4" /> },
    { id: "empresa",   label: "Empresa",   icon: <Building2  className="w-4 h-4" /> },
    { id: "smtp",      label: "SMTP",      icon: <Mail       className="w-4 h-4" /> },
    { id: "acesso",    label: "Acesso",    icon: <Lock       className="w-4 h-4" /> },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center p-20 text-gray-400">
        <Loader2 className="w-6 h-6 animate-spin mr-2" />
        Carregando configurações...
      </div>
    );
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold text-foreground">Configurações</h1>
        <p className="text-muted-foreground text-sm mt-0.5">Aparência, e-mail e credenciais do painel</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => { setTab(t.id); setSaved(false); setSmtpMsg(""); }}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
              tab === t.id
                ? "bg-white text-brand-primary shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            )}
          >
            {t.icon}
            {t.label}
          </button>
        ))}
      </div>

      {/* ── ABA: APARÊNCIA ─────────────────────────────────────────────── */}
      {tab === "aparencia" && (
        <div className="space-y-6">
          {/* Logos */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <ImageIcon className="w-4 h-4" /> Logos e Ícone
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 text-sm text-blue-700">
              <p className="font-semibold mb-1">✅ Como funciona:</p>
              <p className="text-xs leading-relaxed">
                1. Clique em &quot;Trocar&quot; e selecione sua logo (JPEG, PNG, WebP, SVG)<br/>
                2. O arquivo será salvo automaticamente (pode demorar alguns segundos)<br/>
                3. Clique em &quot;Atualizar Página&quot; abaixo para recarregar e ver as mudanças<br/>
                4. A Logo Branca aparece no Header e Footer (fundos escuros)<br/>
                5. O Favicon aparece na aba do navegador<br/>
                <span className="font-semibold">⚠️ Favicon:</span> Pode demorar mais para atualizar no navegador. Use Ctrl+Shift+R (Windows) ou Cmd+Shift+R (Mac) para forçar atualização.
              </p>
            </div>
            <LogoUpload
              label="Logo Principal"
              description="Reserva. Tamanho recomendado: 240×72px ou similar."
              folder="images/logo"
              currentSrc="/images/logo/logo.svg"
              onUploaded={() => {}}
            />
            <LogoUpload
              label="Logo Branca"
              description="Aparece no Header (240×72px) e Footer (200×60px)."
              folder="images/logo"
              currentSrc="/images/logo/logo-white.svg"
              onUploaded={() => {}}
            />
            <LogoUpload
              label="Favicon / Ícone do Site"
              description="Aba do navegador. Formatos: ICO, PNG, SVG, WebP 32×32px."
              folder="images/logo"
              currentSrc="/images/logo/favicon.ico"
              onUploaded={() => {}}
            />
            <div className="pt-3 border-t border-border">
              <button
                onClick={() => window.location.reload()}
                className="btn-primary text-sm py-2"
              >
                <RefreshCw className="w-4 h-4" />
                Atualizar Página para Ver Mudanças
              </button>
            </div>
            </CardContent>
          </Card>

          {/* Cores */}
          <Card>
            <CardHeader className="pb-0">
              <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <Palette className="w-4 h-4" /> Paleta de Cores
              </CardTitle>
              <button
                onClick={() => {
                  setSettings((s) => ({ ...s, ...DEFAULTS }));
                  Object.entries({
                    "--brand-primary":   DEFAULTS.cor_primaria,
                    "--brand-secondary": DEFAULTS.cor_secundaria,
                    "--brand-accent":    DEFAULTS.cor_destaque,
                    "--brand-dark":      DEFAULTS.cor_texto,
                    "--brand-light":     DEFAULTS.cor_neutra,
                  }).forEach(([k, v]) => document.documentElement.style.setProperty(k, v));
                }}
                className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Restaurar padrão
              </button>
              </div>
            </CardHeader>
            <CardContent className="space-y-5 pt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <ColorField
                label="Cor Primária"
                value={settings.cor_primaria}
                cssVar="--brand-primary"
                onChange={(v) => setSettings((s) => ({ ...s, cor_primaria: v }))}
              />
              <ColorField
                label="Cor Secundária"
                value={settings.cor_secundaria}
                cssVar="--brand-secondary"
                onChange={(v) => setSettings((s) => ({ ...s, cor_secundaria: v }))}
              />
              <ColorField
                label="Cor de Destaque (CTAs)"
                value={settings.cor_destaque}
                cssVar="--brand-accent"
                onChange={(v) => setSettings((s) => ({ ...s, cor_destaque: v }))}
              />
              <ColorField
                label="Cor Neutra (Fundos)"
                value={settings.cor_neutra}
                cssVar="--brand-light"
                onChange={(v) => setSettings((s) => ({ ...s, cor_neutra: v }))}
              />
              <ColorField
                label="Cor de Texto"
                value={settings.cor_texto}
                cssVar="--brand-dark"
                onChange={(v) => setSettings((s) => ({ ...s, cor_texto: v }))}
              />
            </div>

            {/* Preview */}
            <div className="mt-2 p-4 rounded-xl border border-border bg-muted space-y-2">
              <p className="text-xs text-muted-foreground font-medium mb-3">Preview das cores</p>
              <div className="flex flex-wrap gap-2">
                {[
                  { label: "Primária",   color: settings.cor_primaria },
                  { label: "Secundária", color: settings.cor_secundaria },
                  { label: "Destaque",   color: settings.cor_destaque },
                  { label: "Neutra",     color: settings.cor_neutra },
                  { label: "Texto",      color: settings.cor_texto },
                ].map(({ label, color }) => (
                  <div key={label} className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-md border border-border shadow-sm" style={{ backgroundColor: color }} />
                    <span className="text-xs text-muted-foreground">{label}</span>
                    <span className="text-xs font-mono text-muted-foreground/70">{color}</span>
                  </div>
                ))}
              </div>
            </div>
            </CardContent>
          </Card>

          {/* Filtro do banner */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <Palette className="w-4 h-4" /> Filtro de Cor do Banner
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <p className="text-sm text-muted-foreground">
                Controla a camada de cor sobreposta às imagens do banner principal.
              </p>

              {/* Color picker */}
              <div className="flex items-center gap-3">
                <div className="relative flex-shrink-0">
                  <div
                    className="w-10 h-10 rounded-lg border border-gray-200 shadow-sm cursor-pointer"
                    style={{ backgroundColor: settings.hero_filtro_cor }}
                  />
                  <input
                    type="color"
                    value={settings.hero_filtro_cor}
                    onChange={(e) => setSettings((s) => ({ ...s, hero_filtro_cor: e.target.value }))}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    title="Cor do filtro"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-xs font-medium text-gray-500 block mb-1">Cor do filtro</label>
                  <input
                    type="text"
                    value={settings.hero_filtro_cor}
                    onChange={(e) => {
                      const v = e.target.value;
                      if (/^#[0-9A-Fa-f]{0,6}$/.test(v)) setSettings((s) => ({ ...s, hero_filtro_cor: v }));
                    }}
                    className="form-input text-sm font-mono py-1.5"
                    maxLength={7}
                    placeholder="#2563EB"
                  />
                </div>
              </div>

              {/* Slider de opacidade */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-medium text-gray-500">Intensidade (opacidade)</label>
                  <span className="text-xs font-mono font-semibold text-brand-primary bg-gray-100 px-2 py-0.5 rounded">
                    {settings.hero_filtro_opacidade}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="80"
                  step="1"
                  value={settings.hero_filtro_opacidade}
                  onChange={(e) => setSettings((s) => ({ ...s, hero_filtro_opacidade: e.target.value }))}
                  className="w-full accent-brand-primary"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>0% (invisível)</span>
                  <span>80% (intenso)</span>
                </div>
              </div>

              {/* Preview */}
              <div
                className="relative h-16 rounded-xl overflow-hidden border border-border"
                style={{ background: "linear-gradient(to right, #1a6b9e, #6baacc, #aad4e8)" }}
              >
                <div
                  className="absolute inset-0 rounded-xl"
                  style={{
                    backgroundColor: settings.hero_filtro_cor,
                    opacity: Number(settings.hero_filtro_opacidade) / 100,
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs font-medium text-white drop-shadow">Preview do filtro</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <SaveBar saving={saving} saved={saved} onSave={handleSaveAppearance} />
        </div>
      )}

      {/* ── ABA: EMPRESA ───────────────────────────────────────────────── */}
      {tab === "empresa" && (
        <div className="space-y-6">
          {/* Textos do rodapé */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <Building2 className="w-4 h-4" /> Informações da Empresa
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <p className="text-sm text-muted-foreground">
                Edite os textos que aparecem no rodapé do site. As alterações ficam visíveis após salvar.
              </p>

              <div>
                <label className="form-label">Descrição da empresa</label>
                <p className="text-xs text-muted-foreground mb-1.5">Aparece abaixo da logo no rodapé.</p>
                <textarea
                  rows={3}
                  value={settings.empresa_descricao}
                  onChange={(e) => setSettings((s) => ({ ...s, empresa_descricao: e.target.value }))}
                  className="form-input resize-none"
                  placeholder="Especialistas em sistemas de refrigeração..."
                />
              </div>

              <div>
                <label className="form-label">Endereço completo</label>
                <p className="text-xs text-muted-foreground mb-1.5">Exibido na coluna Contato do rodapé.</p>
                <input
                  type="text"
                  value={settings.empresa_endereco}
                  onChange={(e) => setSettings((s) => ({ ...s, empresa_endereco: e.target.value }))}
                  className="form-input"
                  placeholder="Rua Exemplo, 123 — Bairro, Cidade/UF, CEP 00000-000"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Telefone</label>
                  <p className="text-xs text-muted-foreground mb-1.5">Exibido na coluna Contato do rodapé.</p>
                  <input
                    type="text"
                    value={settings.empresa_telefone}
                    onChange={(e) => setSettings((s) => ({ ...s, empresa_telefone: e.target.value }))}
                    className="form-input"
                    placeholder="(11) 99999-9999"
                  />
                </div>
                <div>
                  <label className="form-label">E-mail de contato</label>
                  <p className="text-xs text-muted-foreground mb-1.5">Exibido na coluna Contato do rodapé.</p>
                  <input
                    type="text"
                    value={settings.empresa_email}
                    onChange={(e) => setSettings((s) => ({ ...s, empresa_email: e.target.value }))}
                    className="form-input"
                    placeholder="contato@empresa.com.br"
                  />
                </div>
              </div>

              <div>
                <label className="form-label">Horário de atendimento</label>
                <p className="text-xs text-muted-foreground mb-1.5">Exibido na coluna Contato do rodapé.</p>
                <input
                  type="text"
                  value={settings.empresa_horario}
                  onChange={(e) => setSettings((s) => ({ ...s, empresa_horario: e.target.value }))}
                  className="form-input"
                  placeholder="Seg a Sex: 8h às 18h | Sáb: 8h às 12h"
                />
              </div>

              <div className="border-t border-border pt-5 space-y-4">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Barra inferior do rodapé</p>

                <div>
                  <label className="form-label">Texto de copyright (lado esquerdo)</label>
                  <p className="text-xs text-muted-foreground mb-1.5">Ex: © 2026 Ice Van. Todos os direitos reservados.</p>
                  <input
                    type="text"
                    value={settings.footer_copyright}
                    onChange={(e) => setSettings((s) => ({ ...s, footer_copyright: e.target.value }))}
                    className="form-input"
                    placeholder="© 2026 Empresa. Todos os direitos reservados."
                  />
                </div>

                <div>
                  <label className="form-label">Texto do rodapé (lado direito)</label>
                  <p className="text-xs text-muted-foreground mb-1.5">Ex: CNPJ — Refrigeração para Transporte | São Paulo, SP</p>
                  <input
                    type="text"
                    value={settings.footer_rodape}
                    onChange={(e) => setSettings((s) => ({ ...s, footer_rodape: e.target.value }))}
                    className="form-input"
                    placeholder="CNPJ 00.000.000/0001-00 | São Paulo, SP"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <SaveBar saving={saving} saved={saved} onSave={handleSaveEmpresa} />
        </div>
      )}

      {/* ── ABA: SMTP ──────────────────────────────────────────────────── */}
      {tab === "smtp" && (
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <Mail className="w-4 h-4" /> Configurações de E-mail (SMTP)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
            <p className="text-sm text-muted-foreground">
              Configure o servidor SMTP para que o formulário de contato envie e-mails.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="form-label">Host SMTP</label>
                <input
                  type="text"
                  value={settings.smtp_host}
                  onChange={(e) => setSettings((s) => ({ ...s, smtp_host: e.target.value }))}
                  placeholder="smtp.gmail.com"
                  className="form-input"
                />
              </div>
              <div>
                <label className="form-label">Porta</label>
                <input
                  type="number"
                  value={settings.smtp_port}
                  onChange={(e) => setSettings((s) => ({ ...s, smtp_port: e.target.value }))}
                  placeholder="587"
                  className="form-input"
                />
              </div>
              <div>
                <label className="form-label">Usuário</label>
                <input
                  type="text"
                  value={settings.smtp_user}
                  onChange={(e) => setSettings((s) => ({ ...s, smtp_user: e.target.value }))}
                  placeholder="seu@email.com"
                  className="form-input"
                />
              </div>
              <div>
                <label className="form-label">Senha</label>
                <input
                  type="password"
                  value={settings.smtp_pass}
                  onChange={(e) => setSettings((s) => ({ ...s, smtp_pass: e.target.value }))}
                  placeholder="••••••••"
                  className="form-input"
                  autoComplete="new-password"
                />
              </div>
              <div>
                <label className="form-label">E-mail Remetente</label>
                <input
                  type="email"
                  value={settings.smtp_from}
                  onChange={(e) => setSettings((s) => ({ ...s, smtp_from: e.target.value }))}
                  placeholder="noreply@icevans.com.br"
                  className="form-input"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="form-label">Nome do Remetente</label>
                <input
                  type="text"
                  value={settings.smtp_nome}
                  onChange={(e) => setSettings((s) => ({ ...s, smtp_nome: e.target.value }))}
                  placeholder="Ice Van"
                  className="form-input"
                />
              </div>
            </div>

            {smtpMsg && (
              <div className={cn(
                "px-4 py-3 rounded-lg text-sm",
                smtpMsg.startsWith("✅") ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"
              )}>
                {smtpMsg}
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={handleTestSmtp}
                disabled={testingSmtp || !settings.smtp_host}
                className="btn-outline text-sm py-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {testingSmtp ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                Testar Conexão
              </button>
            </div>
            </CardContent>
          </Card>

          <SaveBar saving={saving} saved={saved} onSave={handleSaveSmtp} />
        </div>
      )}

      {/* ── ABA: ACESSO ────────────────────────────────────────────────── */}
      {tab === "acesso" && (
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <Lock className="w-4 h-4" /> Credenciais de Acesso
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
            <p className="text-sm text-muted-foreground">
              Altere o e-mail e/ou a senha usados para acessar o painel administrativo.
              Deixe em branco os campos que não deseja alterar.
            </p>

            <div className="space-y-4">
              <div>
                <label className="form-label">Novo E-mail</label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="novo@email.com"
                  className="form-input"
                  autoComplete="email"
                />
              </div>
              <div>
                <label className="form-label">Nova Senha</label>
                <div className="relative">
                  <input
                    type={showPass ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Mínimo 8 caracteres"
                    className="form-input pr-12"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="form-label">Confirmar Nova Senha</label>
                <input
                  type={showPass ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repita a nova senha"
                  className="form-input"
                  autoComplete="new-password"
                />
              </div>
            </div>

            {accessError && (
              <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
                {accessError}
              </div>
            )}
            {accessSaved && (
              <div className="bg-green-50 border border-green-200 text-green-700 rounded-lg px-4 py-3 text-sm flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Credenciais atualizadas com sucesso!
              </div>
            )}

            <button
              onClick={handleSaveAccess}
              disabled={savingAccess || (!newEmail && !newPassword)}
              className="btn-accent text-sm py-2.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {savingAccess ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Atualizar Credenciais
            </button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

// ─── Barra de salvar reutilizável ──────────────────────────────────────────

function SaveBar({
  saving,
  saved,
  onSave,
}: {
  saving: boolean;
  saved: boolean;
  onSave: () => void;
}) {
  return (
    <Card>
      <CardContent className="py-4 flex items-center justify-between">
      {saved ? (
        <span className="flex items-center gap-2 text-green-600 text-sm font-medium">
          <CheckCircle className="w-4 h-4" />
          Configurações salvas com sucesso!
        </span>
      ) : (
        <span className="text-sm text-muted-foreground">Lembre-se de salvar as alterações.</span>
      )}
      <button
        onClick={onSave}
        disabled={saving}
        className="btn-accent text-sm py-2 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
        Salvar
      </button>
      </CardContent>
    </Card>
  );
}
