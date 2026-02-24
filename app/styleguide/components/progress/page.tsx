import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"

function Section({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-xl font-bold text-foreground">{title}</h2>
        {description && <p className="text-sm text-muted-foreground mt-0.5">{description}</p>}
      </div>
      {children}
    </section>
  )
}

function CodeBlock({ code }: { code: string }) {
  return (
    <pre className="bg-muted rounded-lg p-4 text-xs overflow-x-auto text-foreground/80 leading-relaxed border border-border">
      <code>{code.trim()}</code>
    </pre>
  )
}

export default function ProgressPage() {
  const services = [
    { label: "Instalação câmara fria",    pct: 85,  color: "" },
    { label: "Manutenção preventiva",     pct: 60,  color: "[&>div]:bg-amber-500" },
    { label: "Reparo emergencial",         pct: 40,  color: "[&>div]:bg-orange-500" },
    { label: "Entrega do veículo",         pct: 100, color: "[&>div]:bg-green-500" },
  ]

  const fleet = [
    { vehicle: "Fiorino ICE-001",    pct: 72 },
    { vehicle: "Van Ducato ICE-004", pct: 45 },
    { vehicle: "Sprinter ICE-007",   pct: 91 },
  ]

  return (
    <div className="space-y-16 py-8">
      {/* Header */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono bg-primary/10 text-primary px-2 py-0.5 rounded">shadcn/ui</span>
          <span className="text-xs text-muted-foreground">components/ui/progress.tsx</span>
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-foreground">Progress</h1>
        <p className="text-lg text-muted-foreground max-w-2xl">
          Linear progress indicator to communicate the completion status of a task, upload,
          or multi-step process. Accepts a 0–100 value and supports color customization via className.
        </p>
        <CodeBlock code={`import { Progress } from "@/components/ui/progress"`} />
      </div>

      <Separator />

      {/* Values */}
      <Section title="Values" description="Progress at 0, 25, 50, 75, and 100.">
        <div className="space-y-3 max-w-md">
          {[0, 25, 50, 75, 100].map((v) => (
            <div key={v} className="flex items-center gap-4">
              <span className="text-xs font-mono text-muted-foreground w-8 text-right">{v}%</span>
              <Progress value={v} className="flex-1 h-2.5" />
            </div>
          ))}
        </div>
        <CodeBlock code={`<Progress value={0}   className="h-2.5" />
<Progress value={25}  className="h-2.5" />
<Progress value={50}  className="h-2.5" />
<Progress value={75}  className="h-2.5" />
<Progress value={100} className="h-2.5" />`} />
      </Section>

      <Separator />

      {/* Color variants */}
      <Section title="Variantes de cor" description="Sobrescreva a cor do indicador com o seletor [&>div] do Tailwind.">
        <div className="space-y-3 max-w-md">
          {[
            { label: "default (primary)", pct: 65, cls: "" },
            { label: "success (green)",   pct: 80, cls: "[&>div]:bg-green-500" },
            { label: "warning (amber)",   pct: 50, cls: "[&>div]:bg-amber-500" },
            { label: "danger (red)",      pct: 25, cls: "[&>div]:bg-red-500" },
            { label: "info (sky)",        pct: 70, cls: "[&>div]:bg-sky-500" },
          ].map(({ label, pct, cls }) => (
            <div key={label} className="space-y-1">
              <span className="text-xs font-mono text-muted-foreground">{label}</span>
              <Progress value={pct} className={`h-2.5 ${cls}`} />
            </div>
          ))}
        </div>
        <CodeBlock code={`{/* Default */}
<Progress value={65} className="h-2.5" />

{/* Success */}
<Progress value={80} className="h-2.5 [&>div]:bg-green-500" />

{/* Warning */}
<Progress value={50} className="h-2.5 [&>div]:bg-amber-500" />

{/* Danger */}
<Progress value={25} className="h-2.5 [&>div]:bg-red-500" />`} />
      </Section>

      <Separator />

      {/* Labeled bars */}
      <Section title="Com rótulo" description="Exiba nome e percentual acima de cada barra.">
        <div className="space-y-4 max-w-md">
          {[
            { label: "Capacidade de armazenamento", value: 72 },
            { label: "Taxa de entrega no prazo",    value: 88 },
            { label: "Frota em operação",           value: 94 },
          ].map(({ label, value }) => (
            <div key={label} className="space-y-1.5">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-foreground">{label}</span>
                <span className="text-muted-foreground font-mono text-xs tabular-nums">{value}%</span>
              </div>
              <Progress value={value} className="h-2" />
            </div>
          ))}
        </div>
        <CodeBlock code={`<div className="space-y-1.5">
  <div className="flex items-center justify-between text-sm">
    <span className="font-medium text-foreground">Capacidade de armazenamento</span>
    <span className="text-muted-foreground font-mono text-xs tabular-nums">72%</span>
  </div>
  <Progress value={72} className="h-2" />
</div>`} />
      </Section>

      <Separator />

      {/* Ice Van demo: Service completion */}
      <Section
        title="Serviços em andamento — Ice Van"
        description="Acompanhe o percentual de conclusão de cada ordem de serviço ativa."
      >
        <div className="rounded-xl border border-border bg-card divide-y divide-border max-w-lg">
          {services.map(({ label, pct, color }) => (
            <div key={label} className="px-4 py-4 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-foreground">{label}</span>
                <span className={`text-xs font-semibold tabular-nums px-2 py-0.5 rounded-full ${
                  pct === 100 ? "bg-green-500/10 text-green-600" :
                  pct >= 60   ? "bg-primary/10 text-primary" :
                  pct >= 40   ? "bg-amber-500/10 text-amber-600" :
                                "bg-orange-500/10 text-orange-600"
                }`}>{pct}%</span>
              </div>
              <Progress value={pct} className={`h-2 ${color}`} />
            </div>
          ))}
        </div>
      </Section>

      <Separator />

      {/* Fleet capacity */}
      <Section title="Capacidade da frota" description="Percentual de ocupação de carga por veículo.">
        <div className="space-y-4 max-w-sm">
          {fleet.map(({ vehicle, pct }) => (
            <div key={vehicle} className="space-y-1.5">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-foreground truncate">{vehicle}</span>
                <span className="font-mono text-xs text-muted-foreground tabular-nums ml-2">{pct}%</span>
              </div>
              <Progress value={pct} className="h-3" />
            </div>
          ))}
        </div>
        <CodeBlock code={`const fleet = [
  { vehicle: "Fiorino ICE-001",    pct: 72 },
  { vehicle: "Van Ducato ICE-004", pct: 45 },
  { vehicle: "Sprinter ICE-007",   pct: 91 },
]

{fleet.map(({ vehicle, pct }) => (
  <div key={vehicle} className="space-y-1.5">
    <div className="flex items-center justify-between text-sm">
      <span className="font-medium text-foreground">{vehicle}</span>
      <span className="font-mono text-xs text-muted-foreground">{pct}%</span>
    </div>
    <Progress value={pct} className="h-3" />
  </div>
))}`} />
      </Section>
    </div>
  )
}
