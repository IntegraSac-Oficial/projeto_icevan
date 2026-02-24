import {
  IconWhatsApp,
  IconInstagram,
  IconFacebook,
  IconYouTube,
  IconTikTok,
  IconLinkedIn,
  IconX,
  IconGitHub,
} from "@/components/ui/social-icons"
import { Separator } from "@/components/ui/separator"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

/* ─── Types ────────────────────────────────────────────────────── */
type SocialDef = {
  name: string
  component: React.ElementType
  brand: string
  hoverClass: string
  hoverTextClass?: string
  handle?: string
}

const socials: SocialDef[] = [
  {
    name: "WhatsApp",
    component: IconWhatsApp,
    brand: "#25D366",
    hoverClass: "hover:bg-[#25D366]",
    handle: "+55 (11) 94824-2999",
  },
  {
    name: "Instagram",
    component: IconInstagram,
    brand: "#E1306C",
    hoverClass: "hover:bg-[#E1306C]",
    handle: "@icevans",
  },
  {
    name: "Facebook",
    component: IconFacebook,
    brand: "#1877F2",
    hoverClass: "hover:bg-[#1877F2]",
    handle: "icevans",
  },
  {
    name: "YouTube",
    component: IconYouTube,
    brand: "#FF0000",
    hoverClass: "hover:bg-[#FF0000]",
    handle: "@icevans",
  },
  {
    name: "TikTok",
    component: IconTikTok,
    brand: "#000000",
    hoverClass: "hover:bg-white",
    hoverTextClass: "hover:text-black",
    handle: "@icevans",
  },
  {
    name: "LinkedIn",
    component: IconLinkedIn,
    brand: "#0A66C2",
    hoverClass: "hover:bg-[#0A66C2]",
    handle: "ice-van",
  },
  {
    name: "X",
    component: IconX,
    brand: "#000000",
    hoverClass: "hover:bg-white",
    hoverTextClass: "hover:text-black",
    handle: "@icevans",
  },
  {
    name: "GitHub",
    component: IconGitHub,
    brand: "#181717",
    hoverClass: "hover:bg-[#181717]",
    handle: "icevans",
  },
]

/* ─── Section wrapper ──────────────────────────────────────────── */
function Section({
  title,
  description,
  children,
}: {
  title: string
  description?: string
  children: React.ReactNode
}) {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-xl font-bold text-foreground">{title}</h2>
        {description && (
          <p className="text-sm text-muted-foreground mt-0.5">{description}</p>
        )}
      </div>
      {children}
    </section>
  )
}

/* ─── Code block ───────────────────────────────────────────────── */
function CodeBlock({ code }: { code: string }) {
  return (
    <pre className="bg-muted rounded-lg p-4 text-xs overflow-x-auto text-foreground/80 leading-relaxed border border-border">
      <code>{code.trim()}</code>
    </pre>
  )
}

/* ══════════════════════════════════════════════════════════════════
   PAGE
══════════════════════════════════════════════════════════════════ */
export default function SocialIconsShowcasePage() {
  return (
    <div className="space-y-16 py-8">

      {/* ── Header ───────────────────────────────────────────────── */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono bg-primary/10 text-primary px-2 py-0.5 rounded">
            custom:ui
          </span>
          <span className="text-xs text-muted-foreground">components/ui/social-icons.tsx</span>
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-foreground">Social Icons</h1>
        <p className="text-lg text-muted-foreground max-w-2xl">
          Ícones SVG inline das principais redes sociais. Sem dependência externa —
          seguindo o padrão shadcn/ui de componentes SVG com <code className="font-mono text-sm bg-muted px-1 py-0.5 rounded">currentColor</code>.
        </p>
        <div className="text-sm font-mono text-muted-foreground bg-muted px-3 py-2 rounded-lg border border-border inline-block">
          import &#123; IconWhatsApp, IconInstagram, ... &#125; from "@/components/ui/social-icons"
        </div>
      </div>

      {/* ── All Icons Grid ───────────────────────────────────────── */}
      <Section
        title="Todos os ícones"
        description="8 redes sociais disponíveis. Tamanho padrão: size-4 (16px)."
      >
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {socials.map(({ name, component: Icon, brand }) => (
            <Card key={name} className="text-center">
              <CardContent className="pt-5 pb-4 flex flex-col items-center gap-2">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white"
                  style={{ backgroundColor: brand }}
                >
                  <Icon className="size-5" />
                </div>
                <p className="text-xs font-medium text-foreground">{name}</p>
                <p className="text-[10px] font-mono text-muted-foreground">{brand}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>

      <Separator />

      {/* ── Sizes ────────────────────────────────────────────────── */}
      <Section
        title="Tamanhos"
        description="Controle pelo className usando classes Tailwind size-* ou w-*/h-*."
      >
        <div className="flex items-end gap-6 flex-wrap">
          {[
            { label: "size-3", size: "size-3", px: "12px" },
            { label: "size-4", size: "size-4", px: "16px" },
            { label: "size-5", size: "size-5", px: "20px" },
            { label: "size-6", size: "size-6", px: "24px" },
            { label: "size-8", size: "size-8", px: "32px" },
            { label: "size-10", size: "size-10", px: "40px" },
            { label: "size-12", size: "size-12", px: "48px" },
          ].map(({ label, size, px }) => (
            <div key={label} className="flex flex-col items-center gap-1.5">
              <IconWhatsApp className={`${size} text-[#25D366]`} />
              <span className="text-[10px] font-mono text-muted-foreground">{label}</span>
              <span className="text-[10px] text-muted-foreground/60">{px}</span>
            </div>
          ))}
        </div>
      </Section>

      <Separator />

      {/* ── Color Control ────────────────────────────────────────── */}
      <Section
        title="Controle de cor"
        description="currentColor herda a cor do texto. Use text-* ou style={{ color }} para cor customizada."
      >
        <div className="grid md:grid-cols-3 gap-4">
          {/* currentColor */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">currentColor (padrão)</CardTitle>
              <CardDescription className="text-xs">Herda a cor do texto pai</CardDescription>
            </CardHeader>
            <CardContent className="flex gap-3">
              <span className="text-foreground"><IconInstagram className="size-6" /></span>
              <span className="text-primary"><IconInstagram className="size-6" /></span>
              <span className="text-muted-foreground"><IconInstagram className="size-6" /></span>
              <span className="text-destructive"><IconInstagram className="size-6" /></span>
            </CardContent>
          </Card>

          {/* Brand colors */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Cores da marca</CardTitle>
              <CardDescription className="text-xs">text-[#hex] via Tailwind</CardDescription>
            </CardHeader>
            <CardContent className="flex gap-3">
              <IconWhatsApp className="size-6 text-[#25D366]" />
              <IconInstagram className="size-6 text-[#E1306C]" />
              <IconFacebook className="size-6 text-[#1877F2]" />
              <IconYouTube className="size-6 text-[#FF0000]" />
            </CardContent>
          </Card>

          {/* White on dark */}
          <Card className="bg-brand-primary">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-white">Fundo escuro</CardTitle>
              <CardDescription className="text-xs text-white/60">text-white no fundo colorido</CardDescription>
            </CardHeader>
            <CardContent className="flex gap-3">
              <IconWhatsApp className="size-6 text-white" />
              <IconInstagram className="size-6 text-white" />
              <IconFacebook className="size-6 text-white" />
              <IconYouTube className="size-6 text-white" />
            </CardContent>
          </Card>
        </div>
      </Section>

      <Separator />

      {/* ── Button Patterns ──────────────────────────────────────── */}
      <Section
        title="Padrões de botão"
        description="Combinações comuns para usar os ícones como links de redes sociais."
      >
        <div className="space-y-8">
          {/* Dark background — footer style */}
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Fundo escuro (estilo Footer)
            </p>
            <div className="bg-brand-primary p-4 rounded-xl flex items-center gap-2 flex-wrap">
              {socials.slice(0, 5).map(({ name, component: Icon, hoverClass, hoverTextClass }) => (
                <a
                  key={name}
                  href="#"
                  aria-label={name}
                  className={`p-2 rounded-full bg-white/10 text-white ${hoverClass} ${hoverTextClass ?? ""} transition-colors duration-200`}
                >
                  <Icon className="size-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Light background */}
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Fundo claro — com borda
            </p>
            <div className="flex items-center gap-2 flex-wrap">
              {socials.slice(0, 5).map(({ name, component: Icon, brand }) => (
                <a
                  key={name}
                  href="#"
                  aria-label={name}
                  className="p-2.5 rounded-full border border-border bg-card text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors duration-200"
                >
                  <Icon className="size-4" />
                </a>
              ))}
            </div>
          </div>

          {/* With label */}
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Com label — lista de contatos
            </p>
            <div className="flex flex-col gap-2 max-w-xs">
              {socials.slice(0, 4).map(({ name, component: Icon, brand, handle }) => (
                <a
                  key={name}
                  href="#"
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg border border-border bg-card hover:bg-muted transition-colors text-sm text-foreground"
                >
                  <span
                    className="size-7 rounded-lg flex items-center justify-center text-white flex-shrink-0"
                    style={{ backgroundColor: brand }}
                  >
                    <Icon className="size-4" />
                  </span>
                  <span className="flex-1">{name}</span>
                  <span className="text-xs text-muted-foreground">{handle}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </Section>

      <Separator />

      {/* ── Props Table ──────────────────────────────────────────── */}
      <Section title="Props" description="Todos os ícones aceitam as mesmas props.">
        <Card>
          <CardContent className="pt-6 overflow-x-auto">
            <table className="w-full text-left min-w-[420px]">
              <thead>
                <tr className="border-b border-border">
                  <th className="pb-2.5 text-xs font-semibold text-foreground uppercase tracking-wider pr-4">Prop</th>
                  <th className="pb-2.5 text-xs font-semibold text-foreground uppercase tracking-wider pr-4">Tipo</th>
                  <th className="pb-2.5 text-xs font-semibold text-foreground uppercase tracking-wider pr-4">Padrão</th>
                  <th className="pb-2.5 text-xs font-semibold text-foreground uppercase tracking-wider">Descrição</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {[
                  ["className", "string", "size-4", "Tailwind classes — controla tamanho e cor"],
                  ["fill", "string", "currentColor", "Herdado do SVGProps — substitui currentColor"],
                  ["aria-label", "string", "nome da rede", "Já definido em cada ícone, mas pode sobrescrever"],
                  ["...props", "SVGProps<SVGSVGElement>", "—", "Todos os atributos SVG padrão são repassados"],
                ].map(([prop, type, def, desc]) => (
                  <tr key={prop} className="border-b border-border last:border-0">
                    <td className="py-2.5 pr-4 font-mono text-xs text-primary font-medium">{prop}</td>
                    <td className="py-2.5 pr-4 font-mono text-xs text-muted-foreground">{type}</td>
                    <td className="py-2.5 pr-4 font-mono text-xs text-muted-foreground">{def}</td>
                    <td className="py-2.5 text-xs text-foreground/70">{desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </Section>

      <Separator />

      {/* ── Code Examples ────────────────────────────────────────── */}
      <Section title="Exemplos de código">
        <div className="space-y-6">
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-foreground">Importação</h3>
            <CodeBlock code={`import {
  IconWhatsApp,
  IconInstagram,
  IconFacebook,
  IconYouTube,
  IconTikTok,
  IconLinkedIn,
  IconX,
  IconGitHub,
} from "@/components/ui/social-icons"`} />
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-foreground">Uso básico</h3>
            <CodeBlock code={`// Tamanho padrão (size-4 = 16px)
<IconWhatsApp />

// Tamanho customizado
<IconInstagram className="size-6" />

// Com cor da marca
<IconFacebook className="size-5 text-[#1877F2]" />`} />
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-foreground">Botão de link (Footer style)</h3>
            <CodeBlock code={`<a
  href="https://wa.me/5511948242999"
  target="_blank"
  rel="noopener noreferrer"
  aria-label="WhatsApp"
  className="p-2 rounded-full bg-white/10 text-white
             hover:bg-[#25D366] transition-colors duration-200"
>
  <IconWhatsApp className="size-4" />
</a>`} />
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-foreground">Lista com label (usando lib/config)</h3>
            <CodeBlock code={`import { empresa } from "@/lib/config"
import { IconInstagram, IconWhatsApp } from "@/components/ui/social-icons"

const links = [
  { icon: IconWhatsApp, href: \`https://wa.me/\${empresa.whatsappNumero}\`, label: "WhatsApp" },
  { icon: IconInstagram, href: empresa.instagram, label: "Instagram" },
]

{links.filter(l => l.href).map(({ icon: Icon, href, label }) => (
  <a key={label} href={href} target="_blank" rel="noopener noreferrer">
    <Icon className="size-4" />
    <span>{label}</span>
  </a>
))}`} />
          </div>
        </div>
      </Section>

    </div>
  )
}
