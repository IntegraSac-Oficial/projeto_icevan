"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { Save, Loader2, CheckCircle, Plus, Trash2, ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import Link from "next/link";

interface AppData {
  titulo: string;
  subtitulo: string;
  tituloSecao: string;
  conteudo: string[];
  specs: { label: string; valor: string }[];
}

type SaveStatus = "idle" | "saving" | "saved";

export default function AplicacaoEditPage() {
  const params = useParams();
  const router = useRouter();
  const slug = typeof params.slug === "string" ? params.slug : "";

  const [data, setData] = useState<AppData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/settings");
      const all = await res.json() as Record<string, string>;
      const key = `content_application_${slug}`;
      
      if (all[key]) {
        // Veículo existe no banco - carrega dados
        setData(JSON.parse(all[key]));
      } else {
        // Veículo não existe no banco - cria dados vazios (permite editar novo veículo)
        setData({
          titulo: "",
          subtitulo: "",
          tituloSecao: "",
          conteudo: [""],
          specs: [{ label: "", valor: "" }],
        });
      }
    } catch (error) {
      console.error("Erro ao carregar aplicação:", error);
      // Erro de rede - não conseguiu carregar
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => { load(); }, [load]);

  const save = async () => {
    if (!data) return;
    setSaveStatus("saving");
    try {
      // Salva o conteúdo da aplicação
      await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [`content_application_${slug}`]: JSON.stringify(data) }),
      });

      // Atualiza o título no registro de veículos (para sincronizar com o footer)
      try {
        const registryRes = await fetch("/api/admin/veiculos");
        const registry = await registryRes.json();
        const vehicleIndex = registry.findIndex((v: { slug: string }) => v.slug === slug);
        
        if (vehicleIndex !== -1) {
          registry[vehicleIndex].label = data.titulo;
          await fetch("/api/admin/veiculos", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(registry),
          });
          
          // Emite evento para atualizar o Footer
          if (typeof window !== "undefined") {
            const { eventBus, EVENTS } = await import("@/lib/events");
            eventBus.emit(EVENTS.VEHICLES_UPDATED);
          }
        }
      } catch (err) {
        console.error("Erro ao atualizar registro de veículos:", err);
      }

      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 2500);
    } catch {
      setSaveStatus("idle");
    }
  };

  const updateConteudo = (index: number, value: string) => {
    setData((prev) => {
      if (!prev) return prev;
      const conteudo = [...prev.conteudo];
      conteudo[index] = value;
      return { ...prev, conteudo };
    });
  };

  const addConteudo = () => {
    setData((prev) => prev ? { ...prev, conteudo: [...prev.conteudo, ""] } : prev);
  };

  const removeConteudo = (index: number) => {
    setData((prev) => {
      if (!prev) return prev;
      return { ...prev, conteudo: prev.conteudo.filter((_, i) => i !== index) };
    });
  };

  const updateSpec = (index: number, field: "label" | "valor", value: string) => {
    setData((prev) => {
      if (!prev) return prev;
      const specs = [...prev.specs];
      specs[index] = { ...specs[index], [field]: value };
      return { ...prev, specs };
    });
  };

  const addSpec = () => {
    setData((prev) => prev ? { ...prev, specs: [...prev.specs, { label: "", valor: "" }] } : prev);
  };

  const removeSpec = (index: number) => {
    setData((prev) => {
      if (!prev) return prev;
      return { ...prev, specs: prev.specs.filter((_, i) => i !== index) };
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-40">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (data === null) {
    return (
      <div className="space-y-4">
        <p className="text-destructive">Erro ao carregar aplicação: &quot;{slug}&quot;</p>
        <p className="text-sm text-muted-foreground">
          Verifique sua conexão e tente novamente.
        </p>
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4" /> Voltar
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link
            href="/admin/textos/aplicacoes"
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-2 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Todas as aplicações
          </Link>
          <h1 className="text-2xl font-bold">{data.titulo}</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Edite os textos e especificações técnicas desta aplicação.
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

      {/* Dados básicos */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Informações Principais</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Título (nome do veículo)</Label>
            <Input
              value={data.titulo}
              onChange={(e) => setData((p) => p ? { ...p, titulo: e.target.value } : p)}
            />
          </div>
          <div>
            <Label>Subtítulo (descrição curta para cards)</Label>
            <Textarea
              value={data.subtitulo}
              onChange={(e) => setData((p) => p ? { ...p, subtitulo: e.target.value } : p)}
              rows={2}
            />
          </div>
          <div>
            <Label>Título da seção de conteúdo</Label>
            <Input
              value={data.tituloSecao}
              onChange={(e) => setData((p) => p ? { ...p, tituloSecao: e.target.value } : p)}
              placeholder={`Refrigeração para ${data.titulo}`}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Aparece como título da seção de texto na página do veículo.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Conteúdo (parágrafos) */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Texto da Página</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {data.conteudo.map((paragrafo, i) => (
            <div key={i} className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label>Parágrafo {i + 1}</Label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeConteudo(i)}
                  className="h-7 px-2 text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
              <Textarea
                value={paragrafo}
                onChange={(e) => updateConteudo(i, e.target.value)}
                rows={4}
              />
            </div>
          ))}
          <Button variant="outline" size="sm" onClick={addConteudo}>
            <Plus className="w-4 h-4" />
            Adicionar parágrafo
          </Button>
        </CardContent>
      </Card>

      {/* Especificações técnicas */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Especificações Técnicas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {data.specs.map((spec, i) => (
            <div key={i} className="flex gap-2 items-start">
              <div className="flex-1">
                <Input
                  value={spec.label}
                  onChange={(e) => updateSpec(i, "label", e.target.value)}
                  placeholder="Rótulo (ex: Capacidade de carga)"
                  className="mb-2"
                />
                <Input
                  value={spec.valor}
                  onChange={(e) => updateSpec(i, "valor", e.target.value)}
                  placeholder="Valor (ex: Até 1.500 kg)"
                />
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeSpec(i)}
                className="mt-1 text-destructive hover:text-destructive hover:bg-destructive/10 shrink-0"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
          <Button variant="outline" size="sm" onClick={addSpec}>
            <Plus className="w-4 h-4" />
            Adicionar especificação
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
