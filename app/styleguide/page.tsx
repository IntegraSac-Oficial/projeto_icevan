export default function StyleguidePage() {
  return (
    <div className="p-8 max-w-5xl mx-auto space-y-16">

      {/* ── Header ────────────────────────────────────────────── */}
      <header>
        <p className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-2">
          Foundation
        </p>
        <h1 className="text-5xl font-bold text-foreground mb-3">Design Tokens</h1>
        <p className="text-muted-foreground text-lg">
          Extracted from the EOS Design System — Blue Iris palette, Plus Jakarta Sans typography.
        </p>
      </header>

      {/* ── Brand Colors ─────────────────────────────────────── */}
      <section>
        <h2 className="text-2xl font-bold mb-1">Brand Colors</h2>
        <p className="text-muted-foreground text-sm mb-6">Primary brand palette from EOS Design System</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { name: "Blue Iris", hex: "#4747E8", var: "--brand-primary", cls: "bg-[#4747E8]", light: false },
            { name: "Blue Iris Light", hex: "#6B68FF", var: "--brand-secondary", cls: "bg-[#6B68FF]", light: false },
            { name: "Amber", hex: "#FEB63D", var: "--brand-accent", cls: "bg-[#FEB63D]", light: true },
            { name: "Pale Iris", hex: "#D9D7FF", var: "Pale Iris", cls: "bg-[#D9D7FF]", light: true },
            { name: "Safety Orange", hex: "#FF8F6B", var: "Safety Orange", cls: "bg-[#FF8F6B]", light: false },
            { name: "Neutral_100", hex: "#0E0D35", var: "--brand-dark", cls: "bg-[#0E0D35]", light: false },
            { name: "Pale Grey", hex: "#F4F6F9", var: "--brand-light", cls: "bg-[#F4F6F9]", light: true },
            { name: "Static Blue", hex: "#5B93FF", var: "--info", cls: "bg-[#5B93FF]", light: false },
          ].map((c) => (
            <div key={c.hex} className="rounded-xl overflow-hidden border border-border shadow-elevation-1">
              <div className={`h-24 w-full ${c.cls}`} />
              <div className="p-3 bg-card">
                <p className="text-sm font-semibold text-foreground">{c.name}</p>
                <p className="text-xs text-muted-foreground font-mono">{c.hex}</p>
                <p className="text-xs text-muted-foreground">{c.var}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Primary Scale ────────────────────────────────────── */}
      <section>
        <h2 className="text-2xl font-bold mb-1">Primary Scale — Blue Iris</h2>
        <p className="text-muted-foreground text-sm mb-6">Indigo-blue brand color scale (50–900)</p>
        <div className="flex rounded-xl overflow-hidden border border-border shadow-elevation-1">
          {[
            { shade: "50",  hex: "#EEEEFF" },
            { shade: "100", hex: "#DDDEFF" },
            { shade: "200", hex: "#BBBBFF" },
            { shade: "300", hex: "#9999FF" },
            { shade: "400", hex: "#7777EE" },
            { shade: "500", hex: "#4747E8" },
            { shade: "600", hex: "#3535CC" },
            { shade: "700", hex: "#2424AA" },
            { shade: "800", hex: "#151488" },
            { shade: "900", hex: "#0A0866" },
          ].map((s) => (
            <div key={s.shade} className="flex-1 flex flex-col">
              <div
                className="h-16"
                style={{ backgroundColor: s.hex }}
              />
              <div className="p-1.5 text-center bg-card">
                <p className="text-xs font-semibold text-foreground">{s.shade}</p>
                <p className="text-[10px] text-muted-foreground font-mono">{s.hex}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Neutral Scale ────────────────────────────────────── */}
      <section>
        <h2 className="text-2xl font-bold mb-1">Neutral Scale — Text Primary</h2>
        <p className="text-muted-foreground text-sm mb-6">From EOS Neutral_100 to Neutral_0</p>
        <div className="flex rounded-xl overflow-hidden border border-border shadow-elevation-1">
          {[
            { shade: "100", hex: "#0E0D35" },
            { shade: "90",  hex: "#27264A" },
            { shade: "80",  hex: "#3E3D5D" },
            { shade: "70",  hex: "#575672" },
            { shade: "60",  hex: "#6E6E86" },
            { shade: "50",  hex: "#868599" },
            { shade: "40",  hex: "#9F9EAE" },
            { shade: "30",  hex: "#B7B7C3" },
            { shade: "20",  hex: "#CFCFD7" },
            { shade: "10",  hex: "#E7E7EB" },
            { shade: "0",   hex: "#FFFFFF" },
          ].map((s) => (
            <div key={s.shade} className="flex-1 flex flex-col">
              <div
                className="h-16"
                style={{ backgroundColor: s.hex, border: s.hex === "#FFFFFF" ? "1px solid #E7E7EB" : undefined }}
              />
              <div className="p-1.5 text-center bg-card">
                <p className="text-xs font-semibold text-foreground">{s.shade}</p>
                <p className="text-[10px] text-muted-foreground font-mono hidden sm:block">{s.hex}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Semantic Colors ──────────────────────────────────── */}
      <section>
        <h2 className="text-2xl font-bold mb-1">Semantic Colors</h2>
        <p className="text-muted-foreground text-sm mb-6">System alerts, states, and notifications</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { name: "Success", hex: "#51CC56", cls: "bg-[#51CC56]", label: "Successful" },
            { name: "Destructive", hex: "#FF5555", cls: "bg-[#FF5555]", label: "Heart Rhythm" },
            { name: "Warning", hex: "#FEB63D", cls: "bg-[#FEB63D]", label: "Amber" },
            { name: "Info", hex: "#5B93FF", cls: "bg-[#5B93FF]", label: "Static Blue" },
          ].map((c) => (
            <div key={c.hex} className="rounded-xl overflow-hidden border border-border shadow-elevation-1">
              <div className={`h-20 w-full ${c.cls}`} />
              <div className="p-3 bg-card">
                <p className="text-sm font-semibold text-foreground">{c.name}</p>
                <p className="text-xs text-muted-foreground">{c.label}</p>
                <p className="text-xs text-muted-foreground font-mono">{c.hex}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Background Surfaces ──────────────────────────────── */}
      <section>
        <h2 className="text-2xl font-bold mb-1">Background Surfaces</h2>
        <p className="text-muted-foreground text-sm mb-6">Interface grey tones for backgrounds and hover states</p>
        <div className="grid grid-cols-3 gap-4">
          {[
            { name: "Pale Grey", hex: "#F4F6F9", desc: "Page background" },
            { name: "Neutral Grey", hex: "#F8F8F9", desc: "Muted surfaces" },
            { name: "Hover Grey", hex: "#F4F3FF", desc: "Hover state" },
          ].map((s) => (
            <div key={s.hex} className="rounded-xl overflow-hidden border border-border shadow-elevation-1">
              <div className="h-16 w-full" style={{ backgroundColor: s.hex }} />
              <div className="p-3 bg-card">
                <p className="text-sm font-semibold text-foreground">{s.name}</p>
                <p className="text-xs text-muted-foreground">{s.desc}</p>
                <p className="text-xs text-muted-foreground font-mono">{s.hex}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── shadcn Token Preview ─────────────────────────────── */}
      <section>
        <h2 className="text-2xl font-bold mb-1">shadcn / CSS Variable Tokens</h2>
        <p className="text-muted-foreground text-sm mb-6">Mapped to HSL CSS custom properties for component theming</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[
            { var: "--background",   label: "Background",           cls: "bg-background border border-border" },
            { var: "--foreground",   label: "Foreground",           cls: "bg-foreground" },
            { var: "--primary",      label: "Primary",              cls: "bg-primary" },
            { var: "--secondary",    label: "Secondary",            cls: "bg-secondary border border-border" },
            { var: "--muted",        label: "Muted",                cls: "bg-muted border border-border" },
            { var: "--accent",       label: "Accent",               cls: "bg-accent" },
            { var: "--destructive",  label: "Destructive",          cls: "bg-destructive" },
            { var: "--border",       label: "Border",               cls: "border-4 border-border bg-card" },
            { var: "--card",         label: "Card",                 cls: "bg-card border border-border" },
            { var: "--success",      label: "Success",              cls: "bg-success" },
            { var: "--warning",      label: "Warning",              cls: "bg-warning" },
            { var: "--info",         label: "Info",                 cls: "bg-info" },
          ].map((t) => (
            <div key={t.var} className="flex items-center gap-3 p-3 rounded-lg bg-card border border-border">
              <div className={`h-8 w-8 rounded-md flex-shrink-0 ${t.cls}`} />
              <div>
                <p className="text-sm font-medium text-foreground">{t.label}</p>
                <p className="text-xs font-mono text-muted-foreground">{t.var}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Typography ───────────────────────────────────────── */}
      <section>
        <h2 className="text-2xl font-bold mb-1">Typography</h2>
        <p className="text-muted-foreground text-sm mb-6">
          Font: <span className="font-semibold">Plus Jakarta Sans</span> — geometric, modern sans-serif (closest open-source match to Aeonik)
        </p>

        <div className="space-y-6 p-6 rounded-xl bg-card border border-border shadow-elevation-1">
          <div className="border-b border-border pb-4">
            <p className="text-xs text-muted-foreground mb-2">Title h1 · Bold · 72px equiv · −2% tracking</p>
            <p className="text-5xl font-bold leading-tight">Cardiac Rehab</p>
          </div>
          <div className="border-b border-border pb-4">
            <p className="text-xs text-muted-foreground mb-2">Headline h2 · Bold · 48px equiv</p>
            <p className="text-4xl font-bold leading-tight">Cardiac Rehab</p>
          </div>
          <div className="border-b border-border pb-4">
            <p className="text-xs text-muted-foreground mb-2">Headline h3 · Bold · 36px equiv</p>
            <p className="text-3xl font-bold leading-snug">Cardiac Rehab</p>
          </div>
          <div className="border-b border-border pb-4">
            <p className="text-xs text-muted-foreground mb-2">Headline h4 · Bold · 24px</p>
            <p className="text-2xl font-bold">Cardiac Rehab</p>
          </div>
          <div className="border-b border-border pb-4">
            <p className="text-xs text-muted-foreground mb-2">Headline h4 · Medium · 24px</p>
            <p className="text-2xl font-medium">Cardiac Rehab</p>
          </div>
          <div className="border-b border-border pb-4">
            <p className="text-xs text-muted-foreground mb-2">Body · Regular · 16px · 150% line-height</p>
            <p className="text-base leading-relaxed text-foreground">
              The design system was created for existing services and needs to be standardized product UI elements
              for growing and appending new features. Simple base elements like bold colours and typography
              are the foundation the entire system is built upon.
            </p>
          </div>
          <div className="border-b border-border pb-4">
            <p className="text-xs text-muted-foreground mb-2">Small · Regular · 12px</p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Caption text. Version 1.0 / eos design system. Used for metadata, labels, and secondary information.
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-2">Button text · Semibold · 14px</p>
            <p className="text-sm font-semibold tracking-wide">Button Label</p>
          </div>
        </div>
      </section>

      {/* ── Border Radius ────────────────────────────────────── */}
      <section>
        <h2 className="text-2xl font-bold mb-1">Border Radius</h2>
        <p className="text-muted-foreground text-sm mb-6">Rounded style — var(--radius) = 0.75rem (12px)</p>
        <div className="flex flex-wrap gap-6">
          {[
            { label: "sm", cls: "rounded-sm", px: "8px" },
            { label: "md", cls: "rounded-md", px: "10px" },
            { label: "lg (default)", cls: "rounded-lg", px: "12px" },
            { label: "xl", cls: "rounded-xl", px: "16px" },
            { label: "2xl", cls: "rounded-2xl", px: "20px" },
            { label: "full", cls: "rounded-full", px: "pill" },
          ].map((r) => (
            <div key={r.label} className="flex flex-col items-center gap-2">
              <div
                className={`w-16 h-16 bg-primary ${r.cls}`}
              />
              <p className="text-xs font-semibold text-foreground">{r.label}</p>
              <p className="text-xs text-muted-foreground">{r.px}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Shadows / Elevation ──────────────────────────────── */}
      <section>
        <h2 className="text-2xl font-bold mb-1">Shadows — Elevation</h2>
        <p className="text-muted-foreground text-sm mb-6">Subtle blue-tinted shadow system from EOS</p>
        <div className="flex flex-wrap gap-8">
          {[
            { label: "Default", cls: "shadow-elevation-1", desc: "Cards, list items" },
            { label: "Active", cls: "shadow-elevation-2", desc: "Hover, focused states" },
            { label: "Floating", cls: "shadow-elevation-3", desc: "Dropdowns, modals" },
          ].map((s) => (
            <div key={s.label} className="flex flex-col items-center gap-3">
              <div
                className={`w-32 h-20 bg-card rounded-xl ${s.cls}`}
              />
              <div className="text-center">
                <p className="text-sm font-semibold text-foreground">{s.label}</p>
                <p className="text-xs text-muted-foreground">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Button Components ────────────────────────────────── */}
      <section>
        <h2 className="text-2xl font-bold mb-1">Buttons</h2>
        <p className="text-muted-foreground text-sm mb-6">Using design tokens — contained, outlined, texted variants</p>

        <div className="p-6 bg-card rounded-xl border border-border shadow-elevation-1 space-y-6">
          {/* Contained */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Contained</p>
            <div className="flex flex-wrap gap-3">
              <button className="px-5 py-2.5 bg-primary text-primary-foreground font-semibold text-sm rounded-lg hover:opacity-90 transition-opacity">
                Enabled
              </button>
              <button className="px-5 py-2.5 bg-primary/80 text-primary-foreground font-semibold text-sm rounded-lg opacity-60 cursor-not-allowed" disabled>
                Disabled
              </button>
              <button className="px-5 py-2.5 bg-primary text-primary-foreground font-semibold text-sm rounded-lg opacity-80">
                Hover
              </button>
              <button className="px-5 py-2.5 bg-primary/90 text-primary-foreground font-semibold text-sm rounded-lg shadow-elevation-2">
                Pressed
              </button>
              <button className="px-5 py-2.5 bg-accent text-accent-foreground font-semibold text-sm rounded-lg hover:opacity-90 transition-opacity">
                Accent
              </button>
            </div>
          </div>

          {/* Outlined */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Outlined</p>
            <div className="flex flex-wrap gap-3">
              <button className="px-5 py-2.5 border-1.5 border border-primary text-primary font-semibold text-sm rounded-lg hover:bg-secondary transition-colors">
                Enabled
              </button>
              <button className="px-5 py-2.5 border border-border text-muted-foreground font-semibold text-sm rounded-lg opacity-60 cursor-not-allowed" disabled>
                Disabled
              </button>
              <button className="px-5 py-2.5 border border-destructive text-destructive font-semibold text-sm rounded-lg">
                Destructive
              </button>
            </div>
          </div>

          {/* Texted */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Text / Ghost</p>
            <div className="flex flex-wrap gap-3">
              <button className="px-5 py-2.5 text-primary font-semibold text-sm rounded-lg hover:bg-secondary transition-colors">
                Enabled
              </button>
              <button className="px-5 py-2.5 text-muted-foreground font-semibold text-sm rounded-lg opacity-60 cursor-not-allowed" disabled>
                Disabled
              </button>
              <button className="px-5 py-2.5 text-destructive font-semibold text-sm rounded-lg hover:bg-destructive/10 transition-colors">
                Destructive
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Card Component ───────────────────────────────────── */}
      <section>
        <h2 className="text-2xl font-bold mb-1">Cards</h2>
        <p className="text-muted-foreground text-sm mb-6">Surface tokens — card, border, shadow-elevation</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="rounded-xl bg-card border border-border shadow-elevation-1 p-5">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">Default</p>
            <p className="text-lg font-bold text-foreground mb-1">Card Title</p>
            <p className="text-sm text-muted-foreground">Card body text using muted foreground color token.</p>
          </div>
          <div className="rounded-xl bg-card border border-border shadow-elevation-2 p-5">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-2">Active</p>
            <p className="text-lg font-bold text-foreground mb-1">Active State</p>
            <p className="text-sm text-muted-foreground">Elevated shadow for hover/active states.</p>
          </div>
          <div className="rounded-xl bg-primary text-primary-foreground shadow-elevation-3 p-5">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary-foreground/70 mb-2">Brand</p>
            <p className="text-lg font-bold mb-1">Primary Card</p>
            <p className="text-sm text-primary-foreground/80">Uses primary color as background.</p>
          </div>
        </div>
      </section>

      {/* ── Badges ───────────────────────────────────────────── */}
      <section>
        <h2 className="text-2xl font-bold mb-1">Badges</h2>
        <p className="text-muted-foreground text-sm mb-6">Status indicators and labels</p>
        <div className="flex flex-wrap gap-3 p-6 bg-card rounded-xl border border-border shadow-elevation-1">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-primary text-primary-foreground">Primary</span>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-secondary text-secondary-foreground border border-primary/20">Secondary</span>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-success/15 text-success">Success</span>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-destructive/15 text-destructive">Error</span>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-warning/20 text-warning-foreground">Warning</span>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-info/15 text-info">Info</span>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-muted text-muted-foreground">Muted</span>
        </div>
      </section>

      {/* ── Alert / Notification ─────────────────────────────── */}
      <section>
        <h2 className="text-2xl font-bold mb-1">Alerts</h2>
        <p className="text-muted-foreground text-sm mb-6">System notifications — success, error, warning, info</p>
        <div className="space-y-3">
          <div className="flex gap-3 p-4 rounded-lg border border-success/30 bg-success/10">
            <div className="w-1.5 self-stretch rounded-full bg-success flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-success">Success — Successful</p>
              <p className="text-sm text-foreground mt-0.5">Your changes have been saved successfully.</p>
            </div>
          </div>
          <div className="flex gap-3 p-4 rounded-lg border border-destructive/30 bg-destructive/10">
            <div className="w-1.5 self-stretch rounded-full bg-destructive flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-destructive">Error — Heart Rhythm</p>
              <p className="text-sm text-foreground mt-0.5">Something went wrong. Please try again.</p>
            </div>
          </div>
          <div className="flex gap-3 p-4 rounded-lg border border-warning/30 bg-warning/10">
            <div className="w-1.5 self-stretch rounded-full bg-warning flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-warning-foreground">Warning — Amber</p>
              <p className="text-sm text-foreground mt-0.5">Please review before submitting your request.</p>
            </div>
          </div>
          <div className="flex gap-3 p-4 rounded-lg border border-info/30 bg-info/10">
            <div className="w-1.5 self-stretch rounded-full bg-info flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-info">Info — Static Blue</p>
              <p className="text-sm text-foreground mt-0.5">New update available. Refresh to get the latest version.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Chart Colors ─────────────────────────────────────── */}
      <section>
        <h2 className="text-2xl font-bold mb-1">Chart Colors</h2>
        <p className="text-muted-foreground text-sm mb-6">Visually distinct colors for data visualization</p>
        <div className="flex gap-3 flex-wrap">
          {[
            { n: "1", cls: "bg-[hsl(var(--chart-1))]", label: "Blue Iris" },
            { n: "2", cls: "bg-[hsl(var(--chart-2))]", label: "Safety Orange" },
            { n: "3", cls: "bg-[hsl(var(--chart-3))]", label: "Amber" },
            { n: "4", cls: "bg-[hsl(var(--chart-4))]", label: "Success" },
            { n: "5", cls: "bg-[hsl(var(--chart-5))]", label: "Static Blue" },
          ].map((c) => (
            <div key={c.n} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-md ${c.cls}`} />
              <div>
                <p className="text-xs font-semibold text-foreground">Chart {c.n}</p>
                <p className="text-xs text-muted-foreground">{c.label}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Dark Mode Preview ────────────────────────────────── */}
      <section>
        <h2 className="text-2xl font-bold mb-1">Dark Mode</h2>
        <p className="text-muted-foreground text-sm mb-6">
          Toggle <code className="text-xs bg-muted px-1.5 py-0.5 rounded font-mono">.dark</code> class on{" "}
          <code className="text-xs bg-muted px-1.5 py-0.5 rounded font-mono">&lt;html&gt;</code> to activate
        </p>
        <div className="rounded-xl overflow-hidden border border-border shadow-elevation-2">
          {/* Dark mode preview card */}
          <div className="bg-[#0E0D35] p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[#F4F6F9] font-bold text-lg">Dark Mode Preview</span>
              <span className="px-3 py-1 rounded-full bg-[#7A77FF] text-white text-xs font-semibold">Active</span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 rounded-lg bg-[#1A1948] border border-[#3E3D5D]">
                <p className="text-xs text-[#9F9EAE]">Card</p>
                <p className="text-sm font-semibold text-[#F4F6F9]">Dark Surface</p>
              </div>
              <div className="p-3 rounded-lg bg-[#27264A] border border-[#3E3D5D]">
                <p className="text-xs text-[#9F9EAE]">Secondary</p>
                <p className="text-sm font-semibold text-[#F4F6F9]">Muted bg</p>
              </div>
              <div className="p-3 rounded-lg bg-[#7A77FF] border border-[#7A77FF]">
                <p className="text-xs text-white/70">Primary</p>
                <p className="text-sm font-semibold text-white">Blue Iris</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-[#7A77FF] text-white font-semibold text-sm rounded-lg">Primary</button>
              <button className="px-4 py-2 border border-[#7A77FF] text-[#7A77FF] font-semibold text-sm rounded-lg">Outlined</button>
              <button className="px-4 py-2 text-[#9F9EAE] font-semibold text-sm rounded-lg">Ghost</button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Design Summary ───────────────────────────────────── */}
      <section className="pb-16">
        <div className="p-6 rounded-xl bg-primary text-primary-foreground shadow-elevation-3">
          <h2 className="text-2xl font-bold mb-4">Design Summary</h2>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: "Primary color", value: "Blue Iris — #4747E8 (indigo-blue)" },
              { label: "Font", value: "Plus Jakarta Sans (Aeonik substitute)" },
              { label: "Style", value: "Modern minimal, clean & professional" },
              { label: "Border radius", value: "Rounded 12px (0.75rem)" },
              { label: "Accent color", value: "Amber — #FEB63D" },
              { label: "Overall feel", value: "Trustworthy, tech-forward, crisp" },
            ].map((item) => (
              <div key={item.label}>
                <dt className="text-xs font-semibold uppercase tracking-widest text-primary-foreground/60">{item.label}</dt>
                <dd className="text-sm font-medium text-primary-foreground mt-0.5">{item.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

    </div>
  )
}
