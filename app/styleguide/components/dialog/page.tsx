"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
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

export default function DialogShowcasePage() {
  return (
    <div className="space-y-16 py-8">
      {/* Header */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono bg-primary/10 text-primary px-2 py-0.5 rounded">shadcn/ui</span>
          <span className="text-xs text-muted-foreground">components/ui/dialog.tsx</span>
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-foreground">Dialog</h1>
        <p className="text-lg text-muted-foreground max-w-2xl">
          Modal dialog component for displaying content that requires user interaction.
          Built on Radix UI with keyboard navigation and focus management.
        </p>
        <CodeBlock code={`import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"`} />
      </div>

      <Separator />

      {/* Basic Dialog */}
      <Section title="Basic Dialog" description="Simple dialog with title, description and actions.">
        <Dialog>
          <DialogTrigger asChild>
            <Button>Open Dialog</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirmar ação</DialogTitle>
              <DialogDescription>
                Tem certeza que deseja continuar? Esta ação não pode ser desfeita.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline">Cancelar</Button>
              <Button>Confirmar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <CodeBlock code={`<Dialog>
  <DialogTrigger asChild>
    <Button>Open Dialog</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Confirmar ação</DialogTitle>
      <DialogDescription>
        Tem certeza que deseja continuar?
      </DialogDescription>
    </DialogHeader>
    <DialogFooter>
      <Button variant="outline">Cancelar</Button>
      <Button>Confirmar</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>`} />
      </Section>

      <Separator />

      {/* With Form */}
      <Section title="Dialog with Form" description="Dialog containing form inputs.">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">Adicionar Contato</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Novo Contato</DialogTitle>
              <DialogDescription>
                Preencha os dados do contato abaixo.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Nome</label>
                <input type="text" className="w-full px-3 py-2 border border-border rounded-md" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <input type="email" className="w-full px-3 py-2 border border-border rounded-md" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline">Cancelar</Button>
              <Button>Salvar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </Section>
    </div>
  )
}
