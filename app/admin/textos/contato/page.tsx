"use client";

import { useEffect, useState, useCallback } from "react";
import { Save, Loader2, CheckCircle, ExternalLink, MapPin, Phone, Mail, Clock, Map } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import Link from "next/link";

interface ContatoContent {
  endereco: string;
  telefone: string;
  email: string;
  horario: string;
  maps_embed: string;
}

const DEFAULTS: ContatoContent = {
  endereco: "Rua Paratiji, 1811 penha- Id. Jáu – São Paulo SP. Cep 03702.000",
  telefone: "(11) 91330-8413",
  email: "vendas@icevans.com.br",
  horario: "Seg a Sex: 8h às 18h | Sáb: 8h às 12h",
  maps_embed: "",
};

type SaveStatus = "idle" | "saving" | "saved";

/** Extrai o src do iframe caso o usuário cole o HTML completo */
function extractMapsSrc(value: string): string {
  const match = value.match(/src="([^"]+)"/);
  if (match) return match[1];
  return value;
}

export default function ContatoPage() {
  const [data, setData] = useState<ContatoContent>(DEFAULTS);
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/settings");
      const all = (await res.json()) as Record<string, string>;
      setData({
        endereco:    all["empresa_endereco"]   || DEFAULTS.endereco,
        telefone:    all["empresa_telefone"]   || DEFAULTS.telefone,
        email:       all["empresa_email"]      || DEFAULTS.email,
        horario:     all["empresa_horario"]    || DEFAULTS.horario,
        maps_embed:  all["empresa_maps_embed"] || DEFAULTS.maps_embed,
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
          empresa_telefone:   data.telefone,
          empresa_email:      data.email,
          empresa_horario:    data.horario,
          empresa_maps_embed: data.maps_embed,
        }),
      });
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 2500);
    } catch {
      setSaveStatus("idle");
    }
  };

  const field = (key: keyof ContatoContent) => ({
    value: data[key],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setData((p) => ({ ...p, [key]: e.target.value })),
  });

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
            . Esses dados também aparecem no footer do site.
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

      {/* Informações de contato */}
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
              <Phone className="w-3.5 h-3.5 text-muted-foreground" />
              Telefone
            </Label>
            <Input {...field("telefone")} placeholder="(11) 91330-8413" />
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
              onChange={(e) => {
                const raw = e.target.value;
                // Extrai o src automaticamente se o usuário colar o iframe completo
                setData((p) => ({ ...p, maps_embed: extractMapsSrc(raw) }));
              }}
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

          {/* Preview do mapa */}
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
