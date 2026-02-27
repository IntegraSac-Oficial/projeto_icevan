"use client";

import { useEffect, useState, useCallback } from "react";
import { Save, Loader2, CheckCircle, Plus, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface ContatoCta {
  label: string;
  numero: string;
}

interface CtaContent {
  titulo: string;
  subtitulo: string;
  texto: string;
  titulo_form: string;
  contatos: ContatoCta[];
}

const DEFAULT_CTA: CtaContent = {
  titulo: "Solicite seu Orçamento",
  subtitulo: "Sem Compromisso",
  texto:
    "Preencha o formulário ao lado ou entre em contato direto pelo WhatsApp. Nossa equipe responde rapidamente com a solução ideal para o seu veículo.",
  titulo_form: "Fale com nosso time",
  contatos: [{ label: "WhatsApp", numero: "+55 (11) 94824-2999" }],
};

type SaveStatus = "idle" | "saving" | "saved";

export default function CtaPage() {
  const [cta, setCta] = useState<CtaContent>(DEFAULT_CTA);
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/settings");
      const all = await res.json() as Record<string, string>;
      if (all["content_cta"]) {
        const parsed = JSON.parse(all["content_cta"]);
        // Migração: se vier o formato antigo (com whatsapp/telefone separados), converte
        if (!parsed.contatos) {
          parsed.contatos = [];
          if (all["empresa_whatsapp"] || parsed.whatsapp) {
            parsed.contatos.push({ label: "WhatsApp", numero: all["empresa_whatsapp"] || parsed.whatsapp || "" });
          }
        }
        setCta({ ...DEFAULT_CTA, ...parsed });
      }
    } catch {
      // usa defaults
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const save = async () => {
    setSaveStatus("saving");
    try {
      await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content_cta: JSON.stringify(cta) }),
      });
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 2500);
    } catch {
      setSaveStatus("idle");
    }
  };

  const updateContato = (index: number, field: keyof ContatoCta, value: string) => {
    setCta((prev) => {
      const contatos = [...prev.contatos];
      contatos[index] = { ...contatos[index], [field]: value };
      return { ...prev, contatos };
    });
  };

  const addContato = () => {
    setCta((prev) => ({
      ...prev,
      contatos: [...prev.contatos, { label: "", numero: "" }],
    }));
  };

  const removeContato = (index: number) => {
    setCta((prev) => ({
      ...prev,
      contatos: prev.contatos.filter((_, i) => i !== index),
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-40">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Seção de Orçamento</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Edite o bloco de CTA com formulário de contato na página inicial.
          </p>
        </div>
        <Button onClick={save} disabled={saveStatus === "saving"}>
          {saveStatus === "saving" ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : saveStatus === "saved" ? (
            <CheckCircle className="w-4 h-4 text-green-500" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {saveStatus === "saved" ? "Salvo!" : "Salvar"}
        </Button>
      </div>

      {/* Textos do CTA */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Textos do Bloco</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Título principal</Label>
            <Input
              value={cta.titulo}
              onChange={(e) => setCta((p) => ({ ...p, titulo: e.target.value }))}
              placeholder="Solicite seu Orçamento"
            />
          </div>
          <div>
            <Label>
              Subtítulo{" "}
              <span className="text-muted-foreground font-normal">(aparece em laranja abaixo do título)</span>
            </Label>
            <Input
              value={cta.subtitulo}
              onChange={(e) => setCta((p) => ({ ...p, subtitulo: e.target.value }))}
              placeholder="Sem Compromisso"
            />
          </div>
          <div>
            <Label>Texto descritivo</Label>
            <Textarea
              value={cta.texto}
              onChange={(e) => setCta((p) => ({ ...p, texto: e.target.value }))}
              rows={3}
            />
          </div>
          <div>
            <Label>Título do formulário</Label>
            <Input
              value={cta.titulo_form}
              onChange={(e) => setCta((p) => ({ ...p, titulo_form: e.target.value }))}
              placeholder="Fale com nosso time"
            />
          </div>
        </CardContent>
      </Card>

      {/* Contatos dinâmicos */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Números de Contato</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Estes números aparecem <strong>apenas nesta seção</strong>. Cada número exibe o ícone verde do WhatsApp e cria um link direto para conversa.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {cta.contatos.map((contato, i) => (
            <div key={i} className="flex gap-2 items-end border rounded-lg p-3 bg-muted/30">
              <div className="flex-1 space-y-2">
                <div>
                  <Label className="text-xs">Título / Etiqueta</Label>
                  <Input
                    value={contato.label}
                    onChange={(e) => updateContato(i, "label", e.target.value)}
                    placeholder="ex: Vendas, Suporte, WhatsApp..."
                  />
                </div>
                <div>
                  <Label className="text-xs">Número (com DDD e código do país)</Label>
                  <Input
                    value={contato.numero}
                    onChange={(e) => updateContato(i, "numero", e.target.value)}
                    placeholder="+55 (11) 94824-2999"
                  />
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeContato(i)}
                className="mb-0.5 text-destructive hover:text-destructive hover:bg-destructive/10 shrink-0"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
          <Button variant="outline" size="sm" onClick={addContato}>
            <Plus className="w-4 h-4" />
            Adicionar número
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
