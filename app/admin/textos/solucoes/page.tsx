"use client";

import { useEffect, useState, useCallback } from "react";
import { Save, Loader2, CheckCircle, Plus, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface SolutionCard {
  title: string;
  description: string;
  features: string[];
}

interface SolucoesContent {
  titulo_secao: string;
  subtitulo_secao: string;
  cards: SolutionCard[];
}

const DEFAULT: SolucoesContent = {
  titulo_secao: "Nossas Soluções",
  subtitulo_secao:
    "Oferecemos dois serviços principais para transformar seu veículo em uma plataforma completa de transporte refrigerado.",
  cards: [
    {
      title: "Isolamento Térmico",
      description:
        "O isolamento térmico é a base para garantir a eficiência da cadeia de frio no transporte de perecíveis. Aplicado em vans, furgões e utilitários, impede a troca de calor entre o interior e o exterior do veículo, mantendo a temperatura estável por mais tempo.",
      features: [
        "Painéis de poliuretano injetado de alta densidade",
        "Acabamento em PVC alimentício ou alumínio",
        "Conformidade com normas sanitárias da ANVISA",
        "Máxima eficiência térmica e durabilidade",
        "Reduz consumo do sistema de refrigeração",
      ],
    },
    {
      title: "Aparelho de Refrigeração",
      description:
        "Os aparelhos de refrigeração são instalados em vans, furgões e caminhões para manter a temperatura ideal no transporte de cargas perecíveis. Trabalhamos com equipamentos de alta tecnologia, dimensionados conforme o tipo de veículo e a faixa de temperatura exigida.",
      features: [
        "Compressores e componentes de primeira linha",
        "Dimensionamento por volume e temperatura",
        "Resfriados, climatizados ou congelados",
        "Painel de controle digital",
        "Suporte técnico e manutenção preventiva",
      ],
    },
  ],
};

type SaveStatus = "idle" | "saving" | "saved";

export default function SolucoesPage() {
  const [data, setData] = useState<SolucoesContent>(DEFAULT);
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/settings");
      const all = await res.json() as Record<string, string>;
      if (all["content_solucoes"]) {
        setData({ ...DEFAULT, ...JSON.parse(all["content_solucoes"]) });
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
        body: JSON.stringify({ content_solucoes: JSON.stringify(data) }),
      });
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 2500);
    } catch {
      setSaveStatus("idle");
    }
  };

  const updateCard = (index: number, field: keyof SolutionCard, value: string | string[]) => {
    setData((prev) => {
      const cards = [...prev.cards];
      cards[index] = { ...cards[index], [field]: value };
      return { ...prev, cards };
    });
  };

  const updateFeature = (cardIndex: number, featIndex: number, value: string) => {
    setData((prev) => {
      const cards = [...prev.cards];
      const features = [...cards[cardIndex].features];
      features[featIndex] = value;
      cards[cardIndex] = { ...cards[cardIndex], features };
      return { ...prev, cards };
    });
  };

  const addFeature = (cardIndex: number) => {
    setData((prev) => {
      const cards = [...prev.cards];
      cards[cardIndex] = {
        ...cards[cardIndex],
        features: [...cards[cardIndex].features, ""],
      };
      return { ...prev, cards };
    });
  };

  const removeFeature = (cardIndex: number, featIndex: number) => {
    setData((prev) => {
      const cards = [...prev.cards];
      const features = cards[cardIndex].features.filter((_, i) => i !== featIndex);
      cards[cardIndex] = { ...cards[cardIndex], features };
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
          <h1 className="text-2xl font-bold">Nossas Soluções</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Edite os textos da seção de soluções na página inicial.
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

      {/* Título da seção */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Cabeçalho da Seção</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Título</Label>
            <Input
              value={data.titulo_secao}
              onChange={(e) => setData((p) => ({ ...p, titulo_secao: e.target.value }))}
              placeholder="Nossas Soluções"
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
      {data.cards.map((card, cardIdx) => (
        <Card key={cardIdx}>
          <CardHeader>
            <CardTitle className="text-base">
              Card {cardIdx + 1} — {cardIdx === 0 ? "Azul (Isolamento)" : "Laranja (Refrigeração)"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Título do card</Label>
              <Input
                value={card.title}
                onChange={(e) => updateCard(cardIdx, "title", e.target.value)}
              />
            </div>
            <div>
              <Label>Descrição</Label>
              <Textarea
                value={card.description}
                onChange={(e) => updateCard(cardIdx, "description", e.target.value)}
                rows={4}
              />
            </div>
            <div>
              <Label>Itens da lista</Label>
              <div className="space-y-2 mt-2">
                {card.features.map((feat, featIdx) => (
                  <div key={featIdx} className="flex gap-2">
                    <Input
                      value={feat}
                      onChange={(e) => updateFeature(cardIdx, featIdx, e.target.value)}
                      placeholder={`Item ${featIdx + 1}`}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeFeature(cardIdx, featIdx)}
                      className="shrink-0 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => addFeature(cardIdx)}
                  className="mt-1"
                >
                  <Plus className="w-4 h-4" />
                  Adicionar item
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
