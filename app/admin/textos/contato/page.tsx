"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Save, Loader2, CheckCircle, ExternalLink,
  MapPin, Mail, Clock, Map, Plus, Trash2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import Link from "next/link";

interface ContatoItem {
  label: string;
  numero: string;
}

interface ContatoContent {
  endereco: string;
  email: string;
  horario: string;
  maps_embed: string;
  contatos: ContatoItem[];
}

const DEFAULTS: ContatoContent = {
  endereco: "Rua Paratiji, 1811 penha- Id. Jáu – São Paulo SP. Cep 03702.000",
  email: "vendas@icevans.com.br",
  horario: "Seg a Sex: 8h às 18h | Sáb: 8h às 12h",
  maps_embed: "",
  contatos: [{ label: "WhatsApp", numero: "+55 (11) 94824-2999" }],
};

type SaveStatus = "idle" | "saving" | "saved";

function extractMapsSrc(value: string): string {
  const match = value.match(/src="([^"]+)"/);
  return match ? match[1] : value;
}

export default function ContatoPage() {
  const [data, setData] = useState<ContatoContent>(DEFAULTS);
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/settings");
      const all = (await res.json()) as Record<string, string>;

      // Carrega contatos dinâmicos; se não existir, cria a partir do telefone salvo
      let contatos: ContatoItem[] = DEFAULTS.contatos;
      if (all["empresa_contatos"]) {
        contatos = JSON.parse(all["empresa_contatos"]);
      } else if (all["empresa_telefone"]) {
        contatos = [{ label: "Telefone", numero: all["empresa_telefone"] }];
      }

      setData({
        endereco:   all["empresa_endereco"]   || DEFAULTS.endereco,
        email:      all["empresa_email"]      || DEFAULTS.email,
        horario:    all["empresa_horario"]    || DEFAULTS.horario,
        maps_embed: all["empresa_maps_embed"] || DEFAULTS.maps_embed,
        contatos,
      });
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
        body: JSON.stringify({
          empresa_endereco:   data.endereco,
          empresa_email:      data.email,
          empresa_horario:    data.horario,
          empresa_maps_embed: data.maps_embed,
          empresa_contatos:   JSON.stringify(data.contatos),
        }),
      });
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 2500);
    } catch {
      setSaveStatus("idle");
    }
  };

  const field = (key: keyof Omit<ContatoContent, "contatos">) => ({
    value: data[key] as string,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setData((p) => ({ ...p, [key]: e.target.value })),
  });

  const updateContato = (i: number, field: keyof ContatoItem, value: string) =>
    setData((p) => {
      const arr = [...p.contatos];
      arr[i] = { ...arr[i], [field]: value };
      return { ...p, contatos: arr };
    });

  const addContato = () =>
    setData((p) => ({ ...p, contatos: [...p.contatos, { label: "", numero: "" }] }));

  const removeContato = (i: number) =>
    setData((p) => ({ ...p, contatos: p.contatos.filter((_, idx) => idx !== i) }));

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
          <h1 className="text-2xl font-bold">Página de Contato</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Edite as informações exibidas na{" "}
            <Link href="/contato" target="_blank" className="underline inline-flex items-center gap-1">
              página de contato <ExternalLink className="w-3 h-3" />
            </Link>
            . Endereço, e-mail e horário também aparecem no footer.
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

      {/* Números de contato dinâmicos */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Números de Contato</CardTitle>
          <CardDescription>
            Cada número exibe o ícone verde do WhatsApp e abre uma conversa direta. Aparece na coluna lateral da página de contato.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {data.contatos.map((c, i) => (
            <div key={i} className="flex gap-2 items-end border rounded-lg p-3 bg-muted/30">
              <div className="flex-1 space-y-2">
                <div>
                  <Label className="text-xs">Título / Etiqueta</Label>
                  <Input
                    value={c.label}
                    onChange={(e) => updateContato(i, "label", e.target.value)}
                    placeholder="ex: WhatsApp, Vendas, Suporte..."
                  />
                </div>
                <div>
                  <Label className="text-xs">Número (com DDD e código do país)</Label>
                  <Input
                    value={c.numero}
                    onChange={(e) => updateContato(i, "numero", e.target.value)}
                    placeholder="+55 (11) 94824-2999"
                  />
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeContato(i)}
                disabled={data.contatos.length <= 1}
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

      {/* Informações fixas */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Informações de Contato</CardTitle>
          <CardDescription>
            Aparecem na coluna lateral da página de contato e no rodapé do site.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-1.5">
            <Label className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
              Endereço completo
            </Label>
            <Textarea {...field("endereco")} rows={2} />
          </div>
          <div className="space-y-1.5">
            <Label className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-muted-foreground" />
              E-mail
            </Label>
            <Input {...field("email")} placeholder="vendas@icevans.com.br" />
          </div>
          <div className="space-y-1.5">
            <Label className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-muted-foreground" />
              Horário de atendimento
            </Label>
            <Input {...field("horario")} placeholder="Seg a Sex: 8h às 18h | Sáb: 8h às 12h" />
          </div>
        </CardContent>
      </Card>

      {/* Google Maps */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Map className="w-4 h-4" />
            Mapa de Localização (Google Maps)
          </CardTitle>
          <CardDescription>
            O mapa aparece logo abaixo do cabeçalho na página de contato.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label>URL de incorporação do Google Maps</Label>
            <Textarea
              value={data.maps_embed}
              onChange={(e) => setData((p) => ({ ...p, maps_embed: extractMapsSrc(e.target.value) }))}
              rows={3}
              placeholder="https://www.google.com/maps/embed?pb=..."
            />
            <div className="rounded-lg bg-muted p-3 text-xs text-muted-foreground space-y-1.5">
              <p className="font-semibold text-foreground">Como obter a URL do mapa:</p>
              <ol className="list-decimal list-inside space-y-1">
                <li>Abra o <strong>Google Maps</strong> e encontre o endereço</li>
                <li>Clique em <strong>&quot;Compartilhar&quot;</strong> → aba <strong>&quot;Incorporar um mapa&quot;</strong></li>
                <li>Copie o código HTML que aparece (ex: <code className="bg-background px-1 rounded">{'<iframe src="https://...">'}</code>)</li>
                <li>Cole aqui — a URL será extraída automaticamente</li>
              </ol>
            </div>
          </div>
          {data.maps_embed && (
            <div className="space-y-1.5">
              <Label className="text-muted-foreground text-xs">Pré-visualização</Label>
              <div className="rounded-lg overflow-hidden border h-52">
                <iframe
                  src={data.maps_embed}
                  title="Preview do mapa"
                  className="w-full h-full border-0"
                  loading="lazy"
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
