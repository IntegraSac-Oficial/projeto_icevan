import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import {
  MessageSquare,
  TrendingUp,
  TrendingDown,
  Users,
  Image,
  ArrowRight,
  Star,
  CheckCircle2,
  Truck,
  Bell,
  Settings,
  Eye,
  Heart,
  Share2,
  Clock,
  MapPin,
  Phone,
  Mail,
} from "lucide-react"

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

/* ─── Prop row ─────────────────────────────────────────────────── */
function PropRow({
  name,
  type,
  default: def,
  description,
}: {
  name: string
  type: string
  default?: string
  description: string
}) {
  return (
    <tr className="border-b border-border last:border-0">
      <td className="py-2.5 pr-4 font-mono text-xs text-primary font-medium">{name}</td>
      <td className="py-2.5 pr-4 font-mono text-xs text-muted-foreground">{type}</td>
      <td className="py-2.5 pr-4 font-mono text-xs text-muted-foreground">{def ?? "—"}</td>
      <td className="py-2.5 text-xs text-foreground/70">{description}</td>
    </tr>
  )
}

/* ══════════════════════════════════════════════════════════════════
   PAGE
══════════════════════════════════════════════════════════════════ */
export default function CardShowcasePage() {
  return (
    <div className="space-y-16 py-8">

      {/* ── Header ───────────────────────────────────────────────── */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono bg-primary/10 text-primary px-2 py-0.5 rounded">
            registry:ui
          </span>
          <span className="text-xs text-muted-foreground">@shadcn/card</span>
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-foreground">Card</h1>
        <p className="text-lg text-muted-foreground max-w-2xl">
          Displays a card with header, content, and footer. The foundation for
          grouping related information and actions.
        </p>
        <div className="flex gap-2 text-sm text-muted-foreground font-mono">
          <span>import &#123; Card, CardHeader, CardTitle, CardDescription,</span>
          <br />
          <span>  CardContent, CardFooter &#125; from "@/components/ui/card"</span>
        </div>
      </div>

      {/* ── Anatomy ──────────────────────────────────────────────── */}
      <Section
        title="Anatomy"
        description="All exported sub-components and their roles within the card."
      >
        <div className="grid md:grid-cols-2 gap-8">
          <Card className="relative">
            {/* Labels */}
            <div className="absolute -left-2 top-3 text-[10px] font-mono bg-primary text-primary-foreground px-1.5 py-0.5 rounded shadow">
              Card
            </div>
            <CardHeader className="border-b border-border/50 relative">
              <div className="absolute -left-2 top-3 text-[10px] font-mono bg-blue-500 text-white px-1.5 py-0.5 rounded shadow">
                CardHeader
              </div>
              <CardTitle className="relative">
                <span className="absolute -right-1 -top-5 text-[10px] font-mono bg-violet-500 text-white px-1.5 py-0.5 rounded shadow">
                  CardTitle
                </span>
                Título do Card
              </CardTitle>
              <CardDescription className="relative">
                <span className="absolute -right-1 -top-5 text-[10px] font-mono bg-slate-500 text-white px-1.5 py-0.5 rounded shadow">
                  CardDescription
                </span>
                Texto descritivo opcional do card
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4 relative">
              <div className="absolute -left-2 top-3 text-[10px] font-mono bg-emerald-500 text-white px-1.5 py-0.5 rounded shadow">
                CardContent
              </div>
              <p className="text-sm text-muted-foreground">
                Aqui fica o conteúdo principal do card — qualquer elemento React é válido.
              </p>
            </CardContent>
            <CardFooter className="border-t border-border/50 relative">
              <div className="absolute -left-2 top-3 text-[10px] font-mono bg-orange-500 text-white px-1.5 py-0.5 rounded shadow">
                CardFooter
              </div>
              <Button variant="outline" size="sm">Ação</Button>
              <Button size="sm" className="ml-2">Confirmar</Button>
            </CardFooter>
          </Card>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground">Sub-componentes</h3>
            <div className="space-y-2 text-sm">
              {[
                { name: "Card", color: "bg-primary", desc: "Contêiner raiz com borda, bg-card e sombra" },
                { name: "CardHeader", color: "bg-blue-500", desc: "Área do cabeçalho com flex-col e padding" },
                { name: "CardTitle", color: "bg-violet-500", desc: "Título — text-2xl font-semibold" },
                { name: "CardDescription", color: "bg-slate-500", desc: "Subtítulo — text-sm text-muted-foreground" },
                { name: "CardContent", color: "bg-emerald-500", desc: "Conteúdo principal — p-6 pt-0" },
                { name: "CardFooter", color: "bg-orange-500", desc: "Rodapé com flex items-center" },
              ].map((item) => (
                <div key={item.name} className="flex items-start gap-2">
                  <span className={`mt-0.5 size-2.5 rounded-full flex-shrink-0 ${item.color}`} />
                  <div>
                    <span className="font-mono text-xs font-medium text-foreground">{item.name}</span>
                    <span className="text-xs text-muted-foreground ml-2">{item.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      <Separator />

      {/* ── Stat Cards ───────────────────────────────────────────── */}
      <Section
        title="Stat Cards"
        description="Common pattern for dashboards — metric value with trend indicator."
      >
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2 flex flex-row items-start justify-between space-y-0">
              <CardDescription>Total Contatos</CardDescription>
              <div className="p-1.5 bg-primary/10 rounded-md">
                <MessageSquare className="size-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-3xl font-bold text-foreground">128</p>
              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                <TrendingUp className="size-3 text-green-500" />
                <span className="text-green-600 font-medium">+12%</span> este mês
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2 flex flex-row items-start justify-between space-y-0">
              <CardDescription>Não Lidos</CardDescription>
              <div className="p-1.5 bg-destructive/10 rounded-md">
                <Bell className="size-4 text-destructive" />
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-3xl font-bold text-foreground">7</p>
              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                <TrendingDown className="size-3 text-red-500" />
                <span className="text-red-600 font-medium">+3</span> novos hoje
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2 flex flex-row items-start justify-between space-y-0">
              <CardDescription>Páginas SEO</CardDescription>
              <div className="p-1.5 bg-accent/20 rounded-md">
                <Settings className="size-4 text-accent-foreground" />
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-3xl font-bold text-foreground">6</p>
              <p className="text-xs text-muted-foreground mt-1">
                todas configuradas
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2 flex flex-row items-start justify-between space-y-0">
              <CardDescription>Imagens</CardDescription>
              <div className="p-1.5 bg-secondary rounded-md">
                <Image className="size-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-3xl font-bold text-foreground">34</p>
              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                <TrendingUp className="size-3 text-green-500" />
                <span className="text-green-600 font-medium">+4</span> esta semana
              </p>
            </CardContent>
          </Card>
        </div>
      </Section>

      <Separator />

      {/* ── Content Cards ────────────────────────────────────────── */}
      <Section
        title="Content Cards"
        description="Cards with descriptive content and call-to-action buttons."
      >
        <div className="grid md:grid-cols-3 gap-4">
          {/* Feature card */}
          <Card className="flex flex-col">
            <CardHeader>
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-2">
                <Truck className="size-5 text-primary" />
              </div>
              <CardTitle className="text-lg">Instalação de Refrigeração</CardTitle>
              <CardDescription>
                Equipamentos de última geração para baús frigoríficos de todos os tamanhos.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <ul className="space-y-1.5 text-sm text-muted-foreground">
                {["Garantia de 2 anos", "Assistência técnica 24h", "Instalação certificada"].map(f => (
                  <li key={f} className="flex items-center gap-2">
                    <CheckCircle2 className="size-3.5 text-green-500 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full" size="sm">
                Saiba mais <ArrowRight className="size-4 ml-1.5" />
              </Button>
            </CardFooter>
          </Card>

          {/* Review card */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-1 mb-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="size-3.5 fill-[#FEB63D] text-[#FEB63D]" />
                ))}
              </div>
              <CardTitle className="text-base leading-snug">
                "Serviço impecável, equipe muito profissional."
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Instalaram o sistema de refrigeração no meu baú em menos de um dia. Recomendo!
              </p>
            </CardContent>
            <CardFooter className="gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                MO
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Marcos Oliveira</p>
                <p className="text-xs text-muted-foreground">Transportadora FastLog</p>
              </div>
            </CardFooter>
          </Card>

          {/* Contact card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Entre em Contato</CardTitle>
              <CardDescription>Fale com nossa equipe especializada.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { icon: Phone, label: "(11) 9 9999-9999" },
                { icon: Mail,  label: "contato@icevans.com.br" },
                { icon: MapPin, label: "São Paulo, SP" },
                { icon: Clock, label: "Seg–Sex, 8h às 18h" },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2.5 text-sm text-muted-foreground">
                  <Icon className="size-4 text-primary flex-shrink-0" />
                  {label}
                </div>
              ))}
            </CardContent>
            <CardFooter className="gap-2">
              <Button variant="outline" size="sm" className="flex-1">WhatsApp</Button>
              <Button size="sm" className="flex-1">Ligar</Button>
            </CardFooter>
          </Card>
        </div>
      </Section>

      <Separator />

      {/* ── Color Variants ───────────────────────────────────────── */}
      <Section
        title="Color Variants"
        description="Override backgrounds using CSS-variable-backed Tailwind classes."
      >
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {/* Default */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Default</CardTitle>
              <CardDescription className="text-xs">bg-card</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-xs text-muted-foreground">bg-card / text-card-foreground</p>
            </CardContent>
          </Card>

          {/* Primary */}
          <Card className="bg-primary text-primary-foreground border-primary">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-primary-foreground">Primary</CardTitle>
              <CardDescription className="text-xs text-primary-foreground/70">bg-primary</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-xs text-primary-foreground/70">text-primary-foreground</p>
            </CardContent>
          </Card>

          {/* Accent */}
          <Card className="bg-accent text-accent-foreground border-accent/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Accent</CardTitle>
              <CardDescription className="text-xs text-accent-foreground/70">bg-accent</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-xs text-accent-foreground/70">text-accent-foreground</p>
            </CardContent>
          </Card>

          {/* Muted */}
          <Card className="bg-muted border-transparent">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Muted</CardTitle>
              <CardDescription className="text-xs">bg-muted</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-xs text-muted-foreground">text-muted-foreground</p>
            </CardContent>
          </Card>

          {/* Destructive */}
          <Card className="bg-destructive text-destructive-foreground border-destructive">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-destructive-foreground">Destructive</CardTitle>
              <CardDescription className="text-xs text-destructive-foreground/70">bg-destructive</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-xs text-destructive-foreground/70">text-destructive-foreground</p>
            </CardContent>
          </Card>
        </div>
      </Section>

      <Separator />

      {/* ── Loading State (Skeleton) ─────────────────────────────── */}
      <Section
        title="Loading State"
        description="Combine Card with Skeleton for placeholder loading UI."
      >
        <div className="grid md:grid-cols-3 gap-4 max-w-2xl">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-3">
                <div className="flex items-start gap-3">
                  <Skeleton className="size-10 rounded-xl" />
                  <div className="flex-1 space-y-2 pt-0.5">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-5/6" />
                <Skeleton className="h-3 w-4/5" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-8 w-full rounded-md" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </Section>

      <Separator />

      {/* ── Social / Media Card ──────────────────────────────────── */}
      <Section
        title="Media Card"
        description="Card with image area and interactive footer actions."
      >
        <div className="grid md:grid-cols-2 gap-4 max-w-xl">
          <Card className="overflow-hidden">
            {/* Image placeholder */}
            <div className="h-40 bg-gradient-to-br from-primary/20 via-primary/10 to-accent/20 flex items-center justify-center">
              <Truck className="size-16 text-primary/30" />
            </div>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Baú Frigorífico 14 Paletes</CardTitle>
              <CardDescription>Refrigeração de alta performance para longas distâncias</CardDescription>
            </CardHeader>
            <CardContent className="pt-0 pb-2">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <MapPin className="size-3" />
                <span>São Paulo • SP</span>
              </div>
            </CardContent>
            <CardFooter className="border-t border-border/50 pt-3 gap-1">
              <Button variant="ghost" size="sm" className="text-muted-foreground gap-1.5">
                <Heart className="size-4" /> 24
              </Button>
              <Button variant="ghost" size="sm" className="text-muted-foreground gap-1.5">
                <Eye className="size-4" /> 132
              </Button>
              <Button variant="ghost" size="sm" className="text-muted-foreground gap-1.5 ml-auto">
                <Share2 className="size-4" /> Compartilhar
              </Button>
            </CardFooter>
          </Card>

          <Card className="overflow-hidden">
            <div className="h-40 bg-gradient-to-br from-accent/30 via-accent/10 to-primary/10 flex items-center justify-center">
              <Users className="size-16 text-accent/40" />
            </div>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Equipe Técnica Certificada</CardTitle>
              <CardDescription>Profissionais treinados para instalação e manutenção</CardDescription>
            </CardHeader>
            <CardContent className="pt-0 pb-2">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <CheckCircle2 className="size-3 text-green-500" />
                <span>Certificação INMETRO</span>
              </div>
            </CardContent>
            <CardFooter className="border-t border-border/50 pt-3 gap-1">
              <Button variant="ghost" size="sm" className="text-muted-foreground gap-1.5">
                <Heart className="size-4" /> 58
              </Button>
              <Button variant="ghost" size="sm" className="text-muted-foreground gap-1.5">
                <Eye className="size-4" /> 410
              </Button>
              <Button variant="ghost" size="sm" className="text-muted-foreground gap-1.5 ml-auto">
                <Share2 className="size-4" /> Compartilhar
              </Button>
            </CardFooter>
          </Card>
        </div>
      </Section>

      <Separator />

      {/* ── Props Table ──────────────────────────────────────────── */}
      <Section
        title="Props"
        description="All card sub-components extend their respective HTML element props."
      >
        <Card>
          <CardContent className="pt-6 overflow-x-auto">
            <table className="w-full text-left min-w-[500px]">
              <thead>
                <tr className="border-b border-border">
                  <th className="pb-2.5 text-xs font-semibold text-foreground uppercase tracking-wider pr-4">Component</th>
                  <th className="pb-2.5 text-xs font-semibold text-foreground uppercase tracking-wider pr-4">Base Element</th>
                  <th className="pb-2.5 text-xs font-semibold text-foreground uppercase tracking-wider pr-4">Extra Props</th>
                  <th className="pb-2.5 text-xs font-semibold text-foreground uppercase tracking-wider">Notes</th>
                </tr>
              </thead>
              <tbody>
                <PropRow name="Card"            type="HTMLDivElement"  description="Root container. Applies rounded-lg border bg-card shadow-sm." />
                <PropRow name="CardHeader"      type="HTMLDivElement"  description="flex flex-col space-y-1.5 p-6" />
                <PropRow name="CardTitle"       type="HTMLDivElement"  description="text-2xl font-semibold leading-none tracking-tight" />
                <PropRow name="CardDescription" type="HTMLDivElement"  description="text-sm text-muted-foreground" />
                <PropRow name="CardContent"     type="HTMLDivElement"  description="p-6 pt-0 — remove padding override with className" />
                <PropRow name="CardFooter"      type="HTMLDivElement"  description="flex items-center p-6 pt-0" />
              </tbody>
            </table>
          </CardContent>
        </Card>

        <p className="text-xs text-muted-foreground">
          All components accept <span className="font-mono">className</span> for custom overrides and forward{" "}
          <span className="font-mono">ref</span> to the underlying DOM element.
        </p>
      </Section>

      <Separator />

      {/* ── Code Examples ────────────────────────────────────────── */}
      <Section
        title="Code Examples"
        description="Copy-paste snippets for the most common patterns."
      >
        <div className="space-y-6">
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-foreground">Basic card</h3>
            <CodeBlock code={`import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

<Card>
  <CardHeader>
    <CardTitle>Título</CardTitle>
    <CardDescription>Descrição opcional</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Conteúdo do card.</p>
  </CardContent>
  <CardFooter>
    <Button>Ação</Button>
  </CardFooter>
</Card>`} />
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-foreground">Stat card (dashboard)</h3>
            <CodeBlock code={`<Card>
  <CardHeader className="pb-2 flex flex-row items-start justify-between space-y-0">
    <CardDescription>Total Contatos</CardDescription>
    <MessageSquare className="size-4 text-primary" />
  </CardHeader>
  <CardContent className="pt-0">
    <p className="text-3xl font-bold">128</p>
    <p className="text-xs text-muted-foreground mt-1">+12% este mês</p>
  </CardContent>
</Card>`} />
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-foreground">Card with primary color variant</h3>
            <CodeBlock code={`<Card className="bg-primary text-primary-foreground border-primary">
  <CardHeader>
    <CardTitle className="text-primary-foreground">Destaque</CardTitle>
    <CardDescription className="text-primary-foreground/70">
      Informação importante
    </CardDescription>
  </CardHeader>
  <CardContent>
    <p className="text-primary-foreground/80">Conteúdo em destaque.</p>
  </CardContent>
</Card>`} />
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-foreground">Loading skeleton card</h3>
            <CodeBlock code={`import { Skeleton } from "@/components/ui/skeleton"

<Card>
  <CardHeader>
    <Skeleton className="h-4 w-3/4" />
    <Skeleton className="h-3 w-1/2" />
  </CardHeader>
  <CardContent className="space-y-2">
    <Skeleton className="h-3 w-full" />
    <Skeleton className="h-3 w-5/6" />
  </CardContent>
</Card>`} />
          </div>
        </div>
      </Section>

    </div>
  )
}
