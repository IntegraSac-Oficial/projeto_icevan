"use client";

import { useEffect, useState, useCallback } from "react";
import { Save, Loader2, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface DifCard {
  title: string;
  desc: string;
}

interface DiferenciaisContent {
  titulo_secao: string;
  subtitulo_secao: string;
  cards: DifCard[];
}

const CARD_LABELS = [
  "Qualidade Garantida",
  "Prazo no Combinado",
  "Experiência Comprovada",
  "Atendimento Personalizado",
];

const DEFAULT: DiferenciaisContent = {
  titulo_secao: "Por que escolher a",
  subtitulo_secao:
    "Somos especialistas em refrigeração veicular com foco em qualidade, pontualidade e satisfação total do cliente.",
  cards: [
    { title: "Qualidade Garantida", desc: "Materiais de primeira linha e mão de obra especializada com garantia de 12 meses." },
    { title: "Prazo no Combinado", desc: "Cumprimos os prazos de entrega para você não perder tempo nem dinheiro." },
    { title: "Experiência Comprovada", desc: "Anos de atuação no mercado de refrigeração veicular com centenas de instalações realizadas." },
    { title: "Atendimento Personalizado", desc: "Cada projeto é dimensionado conforme o veículo, a carga e a necessidade do cliente." },
  ],
};

type SaveStatus = "idle" | "saving" | "saved";

export default function DiferenciaisPage() {
  const [data, setData] = useState<DiferenciaisContent>(DEFAULT);
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/settings");
      const all = await res.json() as Record<string, string>;
      if (all["content_diferenciais"]) {
        setData({ ...DEFAULT, ...JSON.parse(all["content_diferenciais"]) });
      }
    } catch {
      // usa default
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
        body: JSON.stringify({ content_diferenciais: JSON.stringify(data) }),
      });
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 2500);
    } catch {
      setSaveStatus("idle");
    }
  };

  const updateCard = (index: number, field: keyof DifCard, value: string) => {
    setData((prev) => {
      const cards = [...prev.cards];
      cards[index] = { ...cards[index], [field]: value };
      return { ...prev, cards };
    });
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
          <h1 className="text-2xl font-bold">Por que Escolher a Ice Van</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Edite os textos dos 4 cards de diferenciais na página inicial.
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

      {/* Cabeçalho da seção */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Cabeçalho da Seção</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>
              Título{" "}
              <span className="text-muted-foreground font-normal">
                (o nome &quot;Ice Van&quot; aparece em laranja automaticamente após este texto)
              </span>
            </Label>
            <Input
              value={data.titulo_secao}
              onChange={(e) => setData((p) => ({ ...p, titulo_secao: e.target.value }))}
              placeholder="Por que escolher a"
            />
          </div>
          <div>
            <Label>Subtítulo</Label>
            <Textarea
              value={data.subtitulo_secao}
              onChange={(e) => setData((p) => ({ ...p, subtitulo_secao: e.target.value }))}
              rows={2}
            />
          </div>
        </CardContent>
      </Card>

      {/* Cards */}
      {data.cards.map((card, i) => (
        <Card key={i}>
          <CardHeader>
            <CardTitle className="text-base">
              Card {i + 1} — {CARD_LABELS[i]}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Título</Label>
              <Input
                value={card.title}
                onChange={(e) => updateCard(i, "title", e.target.value)}
              />
            </div>
            <div>
              <Label>Descrição</Label>
              <Textarea
                value={card.desc}
                onChange={(e) => updateCard(i, "desc", e.target.value)}
                rows={3}
              />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
