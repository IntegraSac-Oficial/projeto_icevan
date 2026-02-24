"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Save,
  Loader2,
  CheckCircle,
  RefreshCw,
  Palette,
  Layers,
  Shapes,
  SquareStack,
  Type,
  Sparkles,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

// ─── Color Utilities ──────────────────────────────────────────────────────────

function hexToHslStr(hex: string): string {
  if (!hex.startsWith("#") || hex.length !== 7) return "0 0% 0%";
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}

function hslToHex(h: number, s: number, l: number): string {
  l /= 100;
  const a = (s * Math.min(l, 1 - l)) / 100;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

function generateScale(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  const hDeg = h * 360;
  const sPct = s * 100;
  return [
    { step: "50",  lPct: 95 },
    { step: "100", lPct: 88 },
    { step: "200", lPct: 78 },
    { step: "300", lPct: 65 },
    { step: "400", lPct: 54 },
    { step: "500", lPct: 46 },
    { step: "600", lPct: 38 },
    { step: "700", lPct: 30 },
    { step: "800", lPct: 22 },
    { step: "900", lPct: 15 },
  ].map(({ step, lPct }) => ({ step, color: hslToHex(hDeg, sPct, lPct) }));
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface AppSettings {
  cor_primaria:   string;
  cor_secundaria: string;
  cor_destaque:   string;
  cor_texto:      string;
  cor_neutra:     string;
  cor_sucesso:    string;
  cor_destrutivo: string;
  cor_aviso:      string;
  cor_info:       string;
  cor_fundo:      string;
  cor_card:       string;
  cor_muted:      string;
  raio_borda:     string;
}

const DEFAULTS: AppSettings = {
  cor_primaria:   "#4747E8",
  cor_secundaria: "#6B68FF",
  cor_destaque:   "#FEB63D",
  cor_texto:      "#0E0D35",
  cor_neutra:     "#F4F6F9",
  cor_sucesso:    "#51CC56",
  cor_destrutivo: "#FF5555",
  cor_aviso:      "#FEB63D",
  cor_info:       "#5B93FF",
  cor_fundo:      "#F4F6F9",
  cor_card:       "#FFFFFF",
  cor_muted:      "#F8F8F9",
  raio_borda:     "0.75",
};

// ─── Apply CSS Vars (client-side live preview) ────────────────────────────────

function applyToPage(key: keyof AppSettings, value: string) {
  const el = document.documentElement;
  switch (key) {
    case "cor_primaria":
      el.style.setProperty("--brand-primary", value);
      el.style.setProperty("--primary", hexToHslStr(value));
      el.style.setProperty("--ring", hexToHslStr(value));
      break;
    case "cor_secundaria":
      el.style.setProperty("--brand-secondary", value);
      break;
    case "cor_destaque":
      el.style.setProperty("--brand-accent", value);
      el.style.setProperty("--accent", hexToHslStr(value));
      break;
    case "cor_texto":
      el.style.setProperty("--brand-dark", value);
      break;
    case "cor_neutra":
      el.style.setProperty("--brand-light", value);
      break;
    case "cor_sucesso":
      el.style.setProperty("--success", hexToHslStr(value));
      break;
    case "cor_destrutivo":
      el.style.setProperty("--destructive", hexToHslStr(value));
      break;
    case "cor_aviso":
      el.style.setProperty("--warning", hexToHslStr(value));
      break;
    case "cor_info":
      el.style.setProperty("--info", hexToHslStr(value));
      break;
    case "cor_fundo":
      el.style.setProperty("--background", hexToHslStr(value));
      break;
    case "cor_card":
      el.style.setProperty("--card", hexToHslStr(value));
      break;
    case "cor_muted":
      el.style.setProperty("--muted", hexToHslStr(value));
      break;
    case "raio_borda":
      el.style.setProperty("--radius", `${value}rem`);
      break;
  }
}

function applyAllToPage(s: AppSettings) {
  (Object.keys(s) as (keyof AppSettings)[]).forEach((k) => applyToPage(k, s[k]));
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function Section({
  title,
  description,
  icon: Icon,
  children,
}: {
  title: string;
  description?: string;
  icon?: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          {Icon && <Icon className="w-4 h-4 text-primary" />}
          {title}
        </CardTitle>
        {description && (
          <CardDescription className="text-xs">{description}</CardDescription>
        )}
      </CardHeader>
      <CardContent className="pt-0">{children}</CardContent>
    </Card>
  );
}

function ColorField({
  label,
  description,
  value,
  onChange,
}: {
  label: string;
  description?: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="relative flex-shrink-0 mt-0.5">
        <div
          className="w-12 h-12 rounded-xl border-2 border-border shadow-sm cursor-pointer hover:scale-105 transition-transform"
          style={{ backgroundColor: value }}
        />
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
        />
      </div>
      <div className="flex-1 min-w-0">
        <label className="text-sm font-medium text-foreground">{label}</label>
        {description && (
          <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
        )}
        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
          <input
            type="text"
            value={value}
            onChange={(e) => {
              const v = e.target.value;
              if (/^#[0-9A-Fa-f]{0,6}$/.test(v)) onChange(v);
            }}
            className="form-input text-sm font-mono py-1 w-[110px]"
            maxLength={7}
            placeholder="#000000"
          />
          <code className="text-[11px] bg-muted text-muted-foreground px-2 py-1 rounded font-mono">
            {hexToHslStr(value)}
          </code>
        </div>
      </div>
    </div>
  );
}

function Swatch({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div
        className="w-full h-10 rounded-lg border border-border shadow-sm"
        style={{ backgroundColor: color }}
      />
      <span className="text-[10px] font-mono text-muted-foreground text-center leading-tight">
        {label}
      </span>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AparenciaPage() {
  const [settings, setSettings] = useState<AppSettings>(DEFAULTS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const fetchSettings = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/settings");
      const data: Record<string, string> = await res.json();
      setSettings((prev) => ({ ...prev, ...data }));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchSettings(); }, [fetchSettings]);

  const setField = (key: keyof AppSettings, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    applyToPage(key, value);
  };

  const handleReset = () => {
    setSettings(DEFAULTS);
    applyAllToPage(DEFAULTS);
  };

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    await fetch("/api/admin/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-20 text-muted-foreground">
        <Loader2 className="w-6 h-6 animate-spin mr-2" />
        Carregando configurações de aparência...
      </div>
    );
  }

  const primaryScale = generateScale(settings.cor_primaria);

  const neutralScale = [
    { step: "0",   color: "#FFFFFF" },
    { step: "10",  color: "#E7E7EB" },
    { step: "20",  color: "#CFCFD7" },
    { step: "30",  color: "#B7B7C3" },
    { step: "40",  color: "#9F9EAE" },
    { step: "50",  color: "#868599" },
    { step: "60",  color: "#6D6C7F" },
    { step: "70",  color: "#555465" },
    { step: "80",  color: "#3C3B4B" },
    { step: "90",  color: "#242330" },
    { step: "100", color: "#0E0D35" },
  ];

  const radiusNum = parseFloat(settings.raio_borda) || 0;

  return (
    <div className="max-w-4xl space-y-6 pb-6">
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-foreground">
            Aparência
          </h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            Editor completo de Design Tokens — alterações são aplicadas em tempo real e afetam todo o site ao salvar.
          </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors px-3 py-2 rounded-lg hover:bg-muted"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Restaurar padrão
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="btn-accent text-sm py-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : saved ? (
              <CheckCircle className="w-4 h-4" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {saved ? "Salvo!" : "Salvar"}
          </button>
        </div>
      </div>

      {/* ── Cores da Marca ──────────────────────────────────────────────── */}
      <Section
        title="Cores da Marca"
        description="As 5 cores que definem a identidade visual do site."
        icon={Palette}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <ColorField
            label="Cor Primária"
            description="Botões, links, elementos principais — também sincroniza --primary no shadcn"
            value={settings.cor_primaria}
            onChange={(v) => setField("cor_primaria", v)}
          />
          <ColorField
            label="Cor Secundária"
            description="Elementos secundários, borders de foco, hover states"
            value={settings.cor_secundaria}
            onChange={(v) => setField("cor_secundaria", v)}
          />
          <ColorField
            label="Cor de Destaque (Accent)"
            description="CTAs importantes, badges — também sincroniza --accent no shadcn"
            value={settings.cor_destaque}
            onChange={(v) => setField("cor_destaque", v)}
          />
          <ColorField
            label="Cor de Texto (Dark)"
            description="Texto principal, headings, ícones sobre fundo claro"
            value={settings.cor_texto}
            onChange={(v) => setField("cor_texto", v)}
          />
          <ColorField
            label="Cor Neutra (Light)"
            description="Fundos de seção, backgrounds alternativos, áreas neutras"
            value={settings.cor_neutra}
            onChange={(v) => setField("cor_neutra", v)}
          />
        </div>

        {/* Preview palette */}
        <div className="mt-5 grid grid-cols-5 gap-2 p-4 bg-muted rounded-xl border border-border">
          {[
            { label: "Primária",   color: settings.cor_primaria },
            { label: "Secundária", color: settings.cor_secundaria },
            { label: "Destaque",   color: settings.cor_destaque },
            { label: "Dark",       color: settings.cor_texto },
            { label: "Light",      color: settings.cor_neutra },
          ].map(({ label, color }) => (
            <div key={label} className="flex flex-col items-center gap-1.5">
              <div
                className="w-full h-14 rounded-xl border border-border shadow-sm"
                style={{ backgroundColor: color }}
              />
              <span className="text-[11px] text-muted-foreground font-medium">{label}</span>
              <span className="text-[10px] font-mono text-muted-foreground/70">{color}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* ── Escala Primária ─────────────────────────────────────────────── */}
      <Section
        title="Escala de Cor Primária"
        description="10 tons gerados automaticamente a partir da Cor Primária (50–900). Apenas visualização."
        icon={Layers}
      >
        <div className="grid grid-cols-10 gap-1.5">
          {primaryScale.map(({ step, color }) => (
            <div key={step} className="flex flex-col items-center gap-1">
              <div
                className="w-full h-10 rounded-md border border-border shadow-sm"
                style={{ backgroundColor: color }}
                title={`${color}`}
              />
              <span className="text-[10px] font-mono text-muted-foreground text-center">
                {step}
              </span>
            </div>
          ))}
        </div>
      </Section>

      {/* ── Escala Neutra ───────────────────────────────────────────────── */}
      <Section
        title="Escala Neutra"
        description="11 tons de cinza do sistema de design, do branco (#FFFFFF) ao escuro (#0E0D35). Fixos."
        icon={Layers}
      >
        <div className="grid grid-cols-11 gap-1.5">
          {neutralScale.map(({ step, color }) => (
            <div key={step} className="flex flex-col items-center gap-1">
              <div
                className="w-full h-10 rounded-md border border-border shadow-sm"
                style={{ backgroundColor: color }}
                title={color}
              />
              <span className="text-[10px] font-mono text-muted-foreground text-center">
                {step}
              </span>
            </div>
          ))}
        </div>
      </Section>

      {/* ── Cores Semânticas ────────────────────────────────────────────── */}
      <Section
        title="Cores Semânticas"
        description="Feedback e estados do sistema: sucesso, erro, aviso e informação."
        icon={Sparkles}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <ColorField
            label="Sucesso"
            description="Confirmações, uploads OK, operações bem-sucedidas"
            value={settings.cor_sucesso}
            onChange={(v) => setField("cor_sucesso", v)}
          />
          <ColorField
            label="Destrutivo / Erro"
            description="Erros, ações irreversíveis, alertas críticos"
            value={settings.cor_destrutivo}
            onChange={(v) => setField("cor_destrutivo", v)}
          />
          <ColorField
            label="Aviso / Warning"
            description="Alertas que merecem atenção, mas não são erros"
            value={settings.cor_aviso}
            onChange={(v) => setField("cor_aviso", v)}
          />
          <ColorField
            label="Informação"
            description="Dicas, informações neutras, mensagens de sistema"
            value={settings.cor_info}
            onChange={(v) => setField("cor_info", v)}
          />
        </div>

        {/* Semantic preview badges */}
        <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Sucesso",      bg: settings.cor_sucesso,    msg: "Salvo com sucesso!" },
            { label: "Erro",         bg: settings.cor_destrutivo, msg: "Algo deu errado." },
            { label: "Aviso",        bg: settings.cor_aviso,      msg: "Atenção necessária." },
            { label: "Informação",   bg: settings.cor_info,       msg: "Nova mensagem." },
          ].map(({ label, bg, msg }) => (
            <div
              key={label}
              className="px-3 py-3 rounded-xl text-white text-xs"
              style={{ backgroundColor: bg }}
            >
              <p className="font-semibold mb-0.5">{label}</p>
              <p className="opacity-80 leading-relaxed">{msg}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ── Superfícies e Fundos ────────────────────────────────────────── */}
      <Section
        title="Superfícies e Fundos"
        description="Cores de fundo de páginas, cards e áreas neutras. Atenção: alterar --background muda o fundo do painel também."
        icon={SquareStack}
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <ColorField
            label="Background"
            description="--background · Fundo principal da página"
            value={settings.cor_fundo}
            onChange={(v) => setField("cor_fundo", v)}
          />
          <ColorField
            label="Card"
            description="--card · Fundo dos cards e painéis"
            value={settings.cor_card}
            onChange={(v) => setField("cor_card", v)}
          />
          <ColorField
            label="Muted"
            description="--muted · Inputs, tabelas, áreas de conteúdo neutro"
            value={settings.cor_muted}
            onChange={(v) => setField("cor_muted", v)}
          />
        </div>

        {/* Surface preview */}
        <div className="mt-5 p-1.5 rounded-xl border border-border overflow-hidden">
          <div
            className="rounded-lg p-5"
            style={{ backgroundColor: settings.cor_fundo }}
          >
            <div
              className="rounded-xl p-4 border border-border shadow-sm"
              style={{ backgroundColor: settings.cor_card }}
            >
              <p className="text-sm font-semibold text-foreground mb-2">Exemplo de Card</p>
              <p className="text-xs text-muted-foreground mb-3">Conteúdo dentro do card com fundo card color.</p>
              <div
                className="rounded-lg px-3 py-2 text-xs text-muted-foreground"
                style={{ backgroundColor: settings.cor_muted }}
              >
                Área muted — inputs, tabelas, áreas neutras
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* ── Raio de Borda ───────────────────────────────────────────────── */}
      <Section
        title="Raio de Borda (Border Radius)"
        description="Controla o arredondamento global de cards, botões e inputs — --radius."
        icon={Shapes}
      >
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <input
              type="range"
              min="0"
              max="2"
              step="0.125"
              value={settings.raio_borda}
              onChange={(e) => setField("raio_borda", e.target.value)}
              className="flex-1 accent-primary"
            />
            <div className="flex items-center gap-1.5">
              <input
                type="text"
                value={settings.raio_borda}
                onChange={(e) => {
                  const v = e.target.value;
                  setField("raio_borda", v);
                }}
                className="form-input text-sm font-mono py-1.5 w-20 text-center"
              />
              <span className="text-sm text-muted-foreground">rem</span>
            </div>
          </div>

          {/* Radius visual reference */}
          <div className="flex items-end gap-4 flex-wrap p-4 bg-muted rounded-xl border border-border">
            {[
              { label: "Nenhum",  value: "0rem" },
              { label: "Pequeno", value: "0.25rem" },
              { label: "Médio",   value: "0.5rem" },
              { label: "Padrão",  value: `${radiusNum}rem`, active: true },
              { label: "Grande",  value: "1.25rem" },
              { label: "XL",      value: "2rem" },
            ].map(({ label, value, active }) => (
              <div key={label} className="flex flex-col items-center gap-2">
                <div
                  className={cn(
                    "w-16 h-10 border-2 transition-all",
                    active
                      ? "bg-primary/20 border-primary"
                      : "bg-muted-foreground/10 border-muted-foreground/20"
                  )}
                  style={{ borderRadius: value }}
                />
                <span className={cn("text-[10px]", active ? "text-primary font-semibold" : "text-muted-foreground")}>
                  {label}
                </span>
                <span className="text-[9px] font-mono text-muted-foreground/60">{value}</span>
              </div>
            ))}
          </div>

          {/* Live component preview */}
          <div className="flex items-center gap-3 flex-wrap">
            <button
              className="px-4 py-2 bg-primary text-primary-foreground text-sm font-medium transition-all"
              style={{ borderRadius: `${radiusNum}rem` }}
            >
              Botão Primário
            </button>
            <button
              className="px-4 py-2 border-2 border-primary text-primary text-sm font-medium"
              style={{ borderRadius: `${radiusNum}rem` }}
            >
              Botão Outline
            </button>
            <input
              type="text"
              placeholder="Input de texto"
              className="px-4 py-2 border border-border text-sm bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              style={{ borderRadius: `${radiusNum}rem` }}
              readOnly
            />
            <span
              className="px-3 py-1 bg-accent/20 text-accent-foreground text-xs font-semibold"
              style={{ borderRadius: `${radiusNum * 2}rem` }}
            >
              Badge
            </span>
          </div>
        </div>
      </Section>

      {/* ── Tokens shadcn/ui ────────────────────────────────────────────── */}
      <Section
        title="Tokens shadcn/ui"
        description="Valores computados dos CSS custom properties internos. Atualizados automaticamente ao salvar."
        icon={Layers}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {[
            { name: "--primary",     hex: settings.cor_primaria },
            { name: "--accent",      hex: settings.cor_destaque },
            { name: "--ring",        hex: settings.cor_primaria },
            { name: "--success",     hex: settings.cor_sucesso },
            { name: "--destructive", hex: settings.cor_destrutivo },
            { name: "--warning",     hex: settings.cor_aviso },
            { name: "--info",        hex: settings.cor_info },
            { name: "--background",  hex: settings.cor_fundo },
            { name: "--card",        hex: settings.cor_card },
            { name: "--muted",       hex: settings.cor_muted },
            { name: "--brand-primary",   hex: settings.cor_primaria },
            { name: "--brand-secondary", hex: settings.cor_secundaria },
            { name: "--brand-accent",    hex: settings.cor_destaque },
            { name: "--brand-dark",      hex: settings.cor_texto },
            { name: "--brand-light",     hex: settings.cor_neutra },
            { name: "--radius",          hex: null, value: `${settings.raio_borda}rem` },
          ].map(({ name, hex, value }) => (
            <div
              key={name}
              className="flex items-center gap-2 px-3 py-2 bg-muted rounded-lg border border-border"
            >
              {hex ? (
                <div
                  className="w-5 h-5 rounded flex-shrink-0 border border-border shadow-sm"
                  style={{ backgroundColor: hex }}
                />
              ) : (
                <div className="w-5 h-5 rounded flex-shrink-0 bg-primary/20 border border-primary/30 flex items-center justify-center text-[8px] text-primary font-bold">
                  R
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-mono text-primary truncate font-medium">{name}</p>
                <p className="text-[10px] font-mono text-muted-foreground truncate">
                  {hex ? hexToHslStr(hex) : value}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ── Tipografia ──────────────────────────────────────────────────── */}
      <Section
        title="Tipografia"
        description="Fontes do sistema de design. Definidas via Tailwind (font-heading, font-sans)."
        icon={Type}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-5 bg-muted rounded-xl border border-border space-y-2">
            <p className="text-xs font-mono text-muted-foreground">
              font-heading · Plus Jakarta Sans
            </p>
            <p className="font-heading font-bold text-3xl text-foreground tracking-tight">
              Aa Bb Cc
            </p>
            <p className="font-heading text-sm text-foreground/60 leading-relaxed">
              ABCDEFGHIJKLMNOPQRSTUVWXYZ<br />
              abcdefghijklmnopqrstuvwxyz<br />
              0123456789 !@#$%&amp;*()
            </p>
          </div>
          <div className="p-5 bg-muted rounded-xl border border-border space-y-2">
            <p className="text-xs font-mono text-muted-foreground">
              font-sans · Inter
            </p>
            <p className="font-sans font-medium text-3xl text-foreground">
              Aa Bb Cc
            </p>
            <p className="font-sans text-sm text-foreground/60 leading-relaxed">
              ABCDEFGHIJKLMNOPQRSTUVWXYZ<br />
              abcdefghijklmnopqrstuvwxyz<br />
              0123456789 !@#$%&amp;*()
            </p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-2">
          {[
            { label: "text-xs",   size: "0.75rem / 12px" },
            { label: "text-sm",   size: "0.875rem / 14px" },
            { label: "text-base", size: "1rem / 16px" },
            { label: "text-lg",   size: "1.125rem / 18px" },
            { label: "text-xl",   size: "1.25rem / 20px" },
            { label: "text-2xl",  size: "1.5rem / 24px" },
          ].map(({ label, size }) => (
            <div
              key={label}
              className="flex items-baseline gap-3 p-3 bg-muted rounded-lg border border-border"
            >
              <span
                className={cn("text-foreground font-medium leading-none", label)}
              >
                Aa
              </span>
              <div>
                <p className="text-[11px] font-mono text-primary">{label}</p>
                <p className="text-[10px] text-muted-foreground">{size}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ── Elevação & Sombras ──────────────────────────────────────────── */}
      <Section
        title="Elevação e Sombras"
        description="Camadas de shadow do sistema Tailwind CSS. Apenas visualização."
        icon={Layers}
      >
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "shadow-sm", css: "0 1px 2px 0 rgb(0 0 0 / 0.05)" },
            { label: "shadow",    css: "0 1px 3px 0 rgb(0 0 0 / 0.10), 0 1px 2px -1px rgb(0 0 0 / 0.10)" },
            { label: "shadow-md", css: "0 4px 6px -1px rgb(0 0 0 / 0.10), 0 2px 4px -2px rgb(0 0 0 / 0.10)" },
            { label: "shadow-lg", css: "0 10px 15px -3px rgb(0 0 0 / 0.10), 0 4px 6px -4px rgb(0 0 0 / 0.10)" },
          ].map(({ label, css }) => (
            <div key={label} className="flex flex-col items-center gap-3">
              <div
                className="w-full h-16 rounded-xl border border-border"
                style={{ backgroundColor: settings.cor_card, boxShadow: css }}
              />
              <span className="text-xs font-mono text-muted-foreground">{label}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* ── Preview de Componentes ──────────────────────────────────────── */}
      <Section
        title="Preview de Componentes"
        description="Visualização ao vivo de como a paleta se aplica nos elementos do site."
      >
        <div className="space-y-6">
          {/* Buttons */}
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Botões
            </p>
            <div className="flex flex-wrap gap-3">
              <button className="btn-primary text-sm">Botão Primário</button>
              <button className="btn-accent text-sm">Botão Destaque</button>
              <button className="btn-outline text-sm">Botão Outline</button>
              <button
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-border text-foreground text-sm font-semibold hover:bg-muted transition-colors"
              >
                Botão Ghost
              </button>
            </div>
          </div>

          {/* Badges */}
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Badges
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-semibold text-white" style={{ backgroundColor: settings.cor_primaria }}>
                Primário
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold text-white" style={{ backgroundColor: settings.cor_destaque }}>
                Destaque
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold text-white" style={{ backgroundColor: settings.cor_sucesso }}>
                Sucesso
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold text-white" style={{ backgroundColor: settings.cor_destrutivo }}>
                Erro
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold text-white" style={{ backgroundColor: settings.cor_aviso }}>
                Aviso
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold text-white" style={{ backgroundColor: settings.cor_info }}>
                Info
              </span>
            </div>
          </div>

          {/* Cards sample */}
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Cards
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Card Padrão</CardTitle>
                  <CardDescription className="text-xs">Usa --card e --border</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-xs text-muted-foreground">Conteúdo do card com tokens aplicados.</p>
                </CardContent>
              </Card>
              <div
                className="rounded-xl p-4 border border-border"
                style={{ backgroundColor: settings.cor_primaria }}
              >
                <p className="font-semibold text-sm text-white mb-1">Card Primário</p>
                <p className="text-xs text-white/70">Fundo com cor primária</p>
              </div>
              <div
                className="rounded-xl p-4 border border-border"
                style={{ backgroundColor: settings.cor_destaque }}
              >
                <p className="font-semibold text-sm text-white mb-1">Card Destaque</p>
                <p className="text-xs text-white/70">Fundo com cor de destaque</p>
              </div>
            </div>
          </div>

          {/* Form inputs */}
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Formulário
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg">
              <div>
                <label className="form-label">Label do campo</label>
                <input
                  type="text"
                  placeholder="Digite aqui..."
                  className="form-input text-sm"
                  readOnly
                />
              </div>
              <div>
                <label className="form-label">Outro campo</label>
                <select className="form-input text-sm">
                  <option>Opção 1</option>
                  <option>Opção 2</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* ── Save bar (bottom) ──────────────────────────────────────────── */}
      <Card>
        <CardContent className="py-4 flex items-center justify-between gap-4">
          {saved ? (
            <span className="flex items-center gap-2 text-green-600 text-sm font-medium">
              <CheckCircle className="w-4 h-4" />
              Tokens salvos! As alterações afetarão todo o site.
            </span>
          ) : (
            <span className="text-sm text-muted-foreground">
              As cores são aplicadas em tempo real. Salve para persistir ao recarregar a página.
            </span>
          )}
          <button
            onClick={handleSave}
            disabled={saving}
            className="btn-accent text-sm py-2.5 flex-shrink-0 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Salvar Design Tokens
          </button>
        </CardContent>
      </Card>
    </div>
  );
}
