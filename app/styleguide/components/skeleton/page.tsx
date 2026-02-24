import { Skeleton } from "@/components/ui/skeleton"
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

export default function SkeletonPage() {
  return (
    <div className="space-y-16 py-8">
      {/* Header */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono bg-primary/10 text-primary px-2 py-0.5 rounded">shadcn/ui</span>
          <span className="text-xs text-muted-foreground">components/ui/skeleton.tsx</span>
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-foreground">Skeleton</h1>
        <p className="text-lg text-muted-foreground max-w-2xl">
          Placeholder loading state that mimics the shape of incoming content. Prevents layout shift
          and provides visual feedback during async data fetches.
        </p>
        <CodeBlock code={`import { Skeleton } from "@/components/ui/skeleton"`} />
      </div>

      <Separator />

      {/* Single + Paragraph */}
      <Section title="Text Skeletons" description="Single line and paragraph patterns.">
        <div className="space-y-6">
          <div className="space-y-2 max-w-sm">
            <p className="text-xs text-muted-foreground font-mono mb-2">Single line</p>
            <Skeleton className="h-4 w-full" />
          </div>
          <div className="space-y-2 max-w-sm">
            <p className="text-xs text-muted-foreground font-mono mb-2">Paragraph</p>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
        <CodeBlock code={`<Skeleton className="h-4 w-full" />

{/* Paragraph */}
<div className="space-y-2">
  <Skeleton className="h-4 w-full" />
  <Skeleton className="h-4 w-full" />
  <Skeleton className="h-4 w-5/6" />
  <Skeleton className="h-4 w-3/4" />
</div>`} />
      </Section>

      <Separator />

      {/* Avatar + Text */}
      <Section title="Avatar + Text Row" description="User / contact list item while loading.">
        <div className="space-y-3 max-w-sm">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-full flex-shrink-0" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          ))}
        </div>
        <CodeBlock code={`<div className="flex items-center gap-3">
  <Skeleton className="h-10 w-10 rounded-full flex-shrink-0" />
  <div className="flex-1 space-y-1.5">
    <Skeleton className="h-4 w-3/4" />
    <Skeleton className="h-3 w-1/2" />
  </div>
</div>`} />
      </Section>

      <Separator />

      {/* Card Skeleton */}
      <Section title="Card Skeleton" description="Full card with image, title and action while loading.">
        <div className="max-w-xs rounded-xl border border-border overflow-hidden bg-card">
          <Skeleton className="h-44 w-full rounded-none" />
          <div className="p-4 space-y-3">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-3.5 w-full" />
            <Skeleton className="h-3.5 w-5/6" />
            <div className="flex items-center justify-between pt-1">
              <Skeleton className="h-5 w-16 rounded-full" />
              <Skeleton className="h-8 w-24 rounded-lg" />
            </div>
          </div>
        </div>
        <CodeBlock code={`<div className="rounded-xl border border-border overflow-hidden bg-card">
  <Skeleton className="h-44 w-full rounded-none" />
  <div className="p-4 space-y-3">
    <Skeleton className="h-5 w-3/4" />
    <Skeleton className="h-3.5 w-full" />
    <Skeleton className="h-3.5 w-5/6" />
    <div className="flex items-center justify-between pt-1">
      <Skeleton className="h-5 w-16 rounded-full" />
      <Skeleton className="h-8 w-24 rounded-lg" />
    </div>
  </div>
</div>`} />
      </Section>

      <Separator />

      {/* Table Row Skeleton */}
      <Section title="Table Row Skeleton" description="Data table while rows are being fetched.">
        <div className="rounded-lg border border-border overflow-hidden max-w-2xl">
          <div className="grid grid-cols-4 gap-4 bg-muted px-4 py-3">
            {["Contato", "Veículo", "Status", "Data"].map((col) => (
              <span key={col} className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{col}</span>
            ))}
          </div>
          {[1, 2, 3, 4].map((row) => (
            <div key={row} className="grid grid-cols-4 gap-4 px-4 py-3 border-t border-border items-center">
              <div className="space-y-1">
                <Skeleton className="h-3.5 w-20" />
                <Skeleton className="h-3 w-14" />
              </div>
              <Skeleton className="h-3.5 w-24" />
              <Skeleton className="h-5 w-16 rounded-full" />
              <Skeleton className="h-3.5 w-16" />
            </div>
          ))}
        </div>
        <CodeBlock code={`{[1, 2, 3, 4].map((row) => (
  <div key={row} className="grid grid-cols-4 gap-4 px-4 py-3 border-t border-border items-center">
    <div className="space-y-1">
      <Skeleton className="h-3.5 w-20" />
      <Skeleton className="h-3 w-14" />
    </div>
    <Skeleton className="h-3.5 w-24" />
    <Skeleton className="h-5 w-16 rounded-full" />
    <Skeleton className="h-3.5 w-16" />
  </div>
))}`} />
      </Section>

      <Separator />

      {/* Fleet Card Loading — Ice Van demo */}
      <Section
        title="Fleet Cards Loading — Ice Van"
        description="Loading state for the vehicle fleet grid: image placeholder, name, details, and CTA."
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-xl border border-border bg-card overflow-hidden">
              <Skeleton className="h-48 w-full rounded-none" />
              <div className="p-4 space-y-3">
                <Skeleton className="h-5 w-3/5" />
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-3 w-3 rounded-full" />
                    <Skeleton className="h-3 w-2/5" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-3 w-3 rounded-full" />
                    <Skeleton className="h-3 w-1/3" />
                  </div>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <Skeleton className="h-5 w-20 rounded-full" />
                  <Skeleton className="h-9 w-28 rounded-lg" />
                </div>
              </div>
            </div>
          ))}
        </div>
        <CodeBlock code={`{[1, 2, 3].map((i) => (
  <div key={i} className="rounded-xl border border-border bg-card overflow-hidden">
    <Skeleton className="h-48 w-full rounded-none" />
    <div className="p-4 space-y-3">
      <Skeleton className="h-5 w-3/5" />
      <div className="space-y-1.5">
        <Skeleton className="h-3 w-2/5" />
        <Skeleton className="h-3 w-1/3" />
      </div>
      <div className="flex items-center justify-between pt-1">
        <Skeleton className="h-5 w-20 rounded-full" />
        <Skeleton className="h-9 w-28 rounded-lg" />
      </div>
    </div>
  </div>
))}`} />
      </Section>
    </div>
  )
}
