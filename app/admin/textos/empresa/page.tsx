"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Save, Loader2, CheckCircle, Plus, Trash2,
  ExternalLink, Target, Eye, Heart,
} from "lucide-react";
import {
  Card, CardContent, CardHeader, CardTitle, CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import Link from "next/link";

interface MvvCard {
  titulo: string;
  descricao: string;
}

interface EmpresaContent {
  heroLabel: string;
  heroTitulo: string;
  heroSubtitulo: string;
  historiaTitle: string;
  historiaParagrafos: string[];
  mvvTitle: string;
  mvvSubtitulo: string;
  missao: MvvCard;
  visao: MvvCard;
  valores: MvvCard;
  diferenciaisTitle: string;
  diferenciaisLista: string[];
  ctaTitle: string;
  ctaSubtitulo: string;
}

const DEFAULTS: EmpresaContent = {
  heroLabel: "Quem somos",
  heroTitulo: "Especialistas em Refrigeração para Transporte",
  heroSubtitulo:
    "Há anos no mercado, a Ice Van é referência em soluções de isolamento térmico e refrigeração para veículos de transporte de perecíveis em São Paulo e região.",
  historiaTitle: "Nossa História",
  historiaParagrafos: [
    "A Ice Van nasceu da necessidade de oferecer soluções profissionais de refrigeração para o crescente mercado de transporte de perecíveis no Brasil. Desde o início, nossa proposta foi clara: entregar qualidade técnica, materiais de primeira linha e atendimento consultivo que realmente ajude o cliente a tomar a melhor decisão para o seu negócio.",
    "Ao longo dos anos, instalamos sistemas de refrigeração e isolamento térmico em centenas de veículos — desde Fiorinos para pequenas distribuidoras até Sprinters e Ducatos para grandes frotas. Cada projeto é único e desenvolvido conforme as necessidades específicas de temperatura, volume de carga e perfil de operação do cliente.",
    "Hoje, a Ice Van atua a partir de São Paulo, atendendo clientes de todo o estado com agilidade, seriedade e o mesmo compromisso com a qualidade que sempre nos diferenciou no mercado.",
  ],
  mvvTitle: "Missão, Visão e Valores",
  mvvSubtitulo: "Os pilares que orientam cada projeto e cada relação com nossos clientes.",
  missao: {
    titulo: "Missão",
    descricao:
      "Oferecer soluções completas de refrigeração e isolamento térmico para veículos de transporte, garantindo a integridade dos produtos perecíveis e a satisfação total dos nossos clientes.",
  },
  visao: {
    titulo: "Visão",
    descricao:
      "Ser referência nacional no segmento de refrigeração veicular, reconhecidos pela qualidade técnica, inovação e pelo relacionamento de longo prazo com nossos parceiros e clientes.",
  },
  valores: {
    titulo: "Valores",
    descricao:
      "Qualidade sem compromisso. Honestidade nas relações. Comprometimento com o prazo. Respeito ao cliente. Melhoria contínua em processos e materiais.",
  },
  diferenciaisTitle: "Nossos Diferenciais",
  diferenciaisLista: [
    "Técnicos especializados e certificados",
    "Materiais de alta qualidade e durabilidade",
    "Projetos personalizados por veículo e aplicação",
    "Cumprimento rigoroso de prazos",
    "Garantia de 12 meses nas instalações",
    "Suporte e assistência técnica pós-venda",
    "Conformidade com normas sanitárias ANVISA",
    "Atendimento consultivo — não somos apenas vendedores",
  ],
  ctaTitle: "Vamos conversar sobre seu projeto?",
  ctaSubtitulo:
    "Entre em contato agora e descubra como podemos ajudar a transformar seu veículo em uma plataforma de refrigeração profissional.",
};

type SaveStatus = "idle" | "saving" | "saved";

export default function EmpresaAdminPage() {
  const [data, setData] = useState<EmpresaContent>(DEFAULTS);
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/settings");
      const all = (await res.json()) as Record<string, string>;
      if (all["content_empresa"]) {
        setData({ ...DEFAULTS, ...JSON.parse(all["content_empresa"]) });
      }
    } catch {
      // usa defaults
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const save = async () => {
    setSaveStatus("saving");
    try {
      await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content_empresa: JSON.stringify(data) }),
      });
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 2500);
    } catch {
      setSaveStatus("idle");
    }
  };

  const setField = <K extends keyof EmpresaContent>(key: K, value: EmpresaContent[K]) =>
    setData((p) => ({ ...p, [key]: value }));

  const setMvv = (card: "missao" | "visao" | "valores", field: keyof MvvCard, value: string) =>
    setData((p) => ({ ...p, [card]: { ...p[card], [field]: value } }));

  const setParagrafo = (i: number, value: string) =>
    setData((p) => {
      const arr = [...p.historiaParagrafos];
      arr[i] = value;
      return { ...p, historiaParagrafos: arr };
    });

  const addParagrafo = () =>
    setData((p) => ({ ...p, historiaParagrafos: [...p.historiaParagrafos, ""] }));

  const removeParagrafo = (i: number) =>
    setData((p) => ({ ...p, historiaParagrafos: p.historiaParagrafos.filter((_, idx) => idx !== i) }));

  const setDiferencial = (i: number, value: string) =>
    setData((p) => {
      const arr = [...p.diferenciaisLista];
      arr[i] = value;
      return { ...p, diferenciaisLista: arr };
    });

  const addDiferencial = () =>
    setData((p) => ({ ...p, diferenciaisLista: [...p.diferenciaisLista, ""] }));

  const removeDiferencial = (i: number) =>
    setData((p) => ({ ...p, diferenciaisLista: p.diferenciaisLista.filter((_, idx) => idx !== i) }));

  if (loading) {
    return (
      <div className="flex items-center justify-center h-40">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Página Empresa</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Edite os textos da{" "}
            <Link href="/empresa" target="_blank" className="underline inline-flex items-center gap-1">
              página Empresa <ExternalLink className="w-3 h-3" />
            </Link>
            .
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

      {/* Hero */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Cabeçalho da página</CardTitle>
          <CardDescription>Faixa azul no topo da página.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label>Label acima do título</Label>
            <Input
              value={data.heroLabel}
              onChange={(e) => setField("heroLabel", e.target.value)}
              placeholder="Quem somos"
            />
          </div>
          <div className="space-y-1.5">
            <Label>Título principal</Label>
            <Input
              value={data.heroTitulo}
              onChange={(e) => setField("heroTitulo", e.target.value)}
              placeholder="Especialistas em Refrigeração para Transporte"
            />
          </div>
          <div className="space-y-1.5">
            <Label>Subtítulo</Label>
            <Textarea
              value={data.heroSubtitulo}
              onChange={(e) => setField("heroSubtitulo", e.target.value)}
              rows={2}
            />
          </div>
        </CardContent>
      </Card>

      {/* Nossa História */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Nossa História</CardTitle>
          <CardDescription>Seção com texto e imagem do escritório.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label>Título da seção</Label>
            <Input
              value={data.historiaTitle}
              onChange={(e) => setField("historiaTitle", e.target.value)}
              placeholder="Nossa História"
            />
          </div>
          <div className="space-y-3">
            <Label>Parágrafos</Label>
            {data.historiaParagrafos.map((p, i) => (
              <div key={i} className="flex gap-2">
                <Textarea
                  value={p}
                  onChange={(e) => setParagrafo(i, e.target.value)}
                  rows={3}
                  className="flex-1"
                  placeholder={`Parágrafo ${i + 1}`}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-destructive hover:text-destructive self-start mt-0.5"
                  onClick={() => removeParagrafo(i)}
                  disabled={data.historiaParagrafos.length <= 1}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
            <Button variant="outline" size="sm" onClick={addParagrafo}>
              <Plus className="w-4 h-4" />
              Adicionar parágrafo
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Missão, Visão e Valores */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Missão, Visão e Valores</CardTitle>
          <CardDescription>3 cards na seção cinza.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Título da seção</Label>
              <Input
                value={data.mvvTitle}
                onChange={(e) => setField("mvvTitle", e.target.value)}
              />
            </div>
            <div className="space-y-1.5 col-span-2">
              <Label>Subtítulo da seção</Label>
              <Input
                value={data.mvvSubtitulo}
                onChange={(e) => setField("mvvSubtitulo", e.target.value)}
              />
            </div>
          </div>

          {(
            [
              { key: "missao", icon: Target, label: "Missão", color: "text-brand-primary" },
              { key: "visao", icon: Eye, label: "Visão", color: "text-brand-secondary" },
              { key: "valores", icon: Heart, label: "Valores", color: "text-brand-accent" },
            ] as const
          ).map(({ key, icon: Icon, label, color }) => (
            <div key={key} className="border rounded-lg p-4 space-y-3">
              <div className={`flex items-center gap-2 font-semibold text-sm ${color}`}>
                <Icon className="w-4 h-4" />
                {label}
              </div>
              <div className="space-y-1.5">
                <Label>Título do card</Label>
                <Input
                  value={data[key].titulo}
                  onChange={(e) => setMvv(key, "titulo", e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Descrição</Label>
                <Textarea
                  value={data[key].descricao}
                  onChange={(e) => setMvv(key, "descricao", e.target.value)}
                  rows={3}
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Nossos Diferenciais */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Nossos Diferenciais</CardTitle>
          <CardDescription>Lista de itens com ícone de check.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label>Título da seção</Label>
            <Input
              value={data.diferenciaisTitle}
              onChange={(e) => setField("diferenciaisTitle", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Itens da lista</Label>
            {data.diferenciaisLista.map((item, i) => (
              <div key={i} className="flex gap-2">
                <Input
                  value={item}
                  onChange={(e) => setDiferencial(i, e.target.value)}
                  placeholder={`Item ${i + 1}`}
                  className="flex-1"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-destructive hover:text-destructive"
                  onClick={() => removeDiferencial(i)}
                  disabled={data.diferenciaisLista.length <= 1}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
            <Button variant="outline" size="sm" onClick={addDiferencial}>
              <Plus className="w-4 h-4" />
              Adicionar item
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* CTA */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Chamada para ação (CTA)</CardTitle>
          <CardDescription>Faixa laranja no final da página.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label>Título</Label>
            <Input
              value={data.ctaTitle}
              onChange={(e) => setField("ctaTitle", e.target.value)}
              placeholder="Vamos conversar sobre seu projeto?"
            />
          </div>
          <div className="space-y-1.5">
            <Label>Subtítulo</Label>
            <Textarea
              value={data.ctaSubtitulo}
              onChange={(e) => setField("ctaSubtitulo", e.target.value)}
              rows={2}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
