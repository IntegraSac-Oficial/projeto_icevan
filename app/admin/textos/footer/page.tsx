"use client";

import { useEffect, useState, useCallback } from "react";
import { Save, Loader2, CheckCircle, Phone } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import Link from "next/link";

interface FooterContent {
  descricao: string;
  footerCopyright: string;
  footerRodape: string;
}

const DEFAULTS: FooterContent = {
  descricao:
    "Especialistas em sistemas de refrigeração e isolamento térmico para veículos de transporte. Atendemos transportadoras, frotas e autônomos em todo o Brasil.",
  footerCopyright: "",
  footerRodape: "CNPJ 00.000.000/0000-00 — Refrigeração para Transporte | São Paulo, SP",
};

type SaveStatus = "idle" | "saving" | "saved";

export default function FooterPage() {
  const [data, setData] = useState<FooterContent>(DEFAULTS);
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/settings");
      const all = (await res.json()) as Record<string, string>;
      setData({
        descricao:       all["empresa_descricao"]  || DEFAULTS.descricao,
        footerCopyright: all["footer_copyright"]   || DEFAULTS.footerCopyright,
        footerRodape:    all["footer_rodape"]      || DEFAULTS.footerRodape,
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
          empresa_descricao: data.descricao,
          footer_copyright:  data.footerCopyright,
          footer_rodape:     data.footerRodape,
        }),
      });
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 2500);
    } catch {
      setSaveStatus("idle");
    }
  };

  const field = (key: keyof FooterContent) => ({
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
          <h1 className="text-2xl font-bold">Footer do Site</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Edite os textos exclusivos do rodapé de todas as páginas.
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

      {/* Sobre a empresa */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Coluna &quot;Sobre&quot; (esquerda)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label>Descrição da empresa</Label>
            <Textarea {...field("descricao")} rows={3} />
          </div>
        </CardContent>
      </Card>

      {/* Coluna Contato — link para a seção Contato */}
      <Card className="border-dashed">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Phone className="w-4 h-4 text-muted-foreground" />
            Coluna &quot;Contato&quot; (direita)
          </CardTitle>
          <CardDescription>
            Endereço, telefone, e-mail, horário e mapa são editados na seção de Contato.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link href="/admin/textos/contato">
            <Button variant="outline" size="sm">
              Ir para Editar Informações de Contato
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* Aplicações no footer */}
      <Card className="border-dashed">
        <CardHeader>
          <CardTitle className="text-base">Lista de Aplicações (coluna central)</CardTitle>
          <CardDescription>
            Os veículos exibidos aqui são gerenciados pelo Gerenciador de Veículos.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link href="/admin/veiculos">
            <Button variant="outline" size="sm">
              Ir para Gerenciar Veículos
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* Copyright */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Barra inferior do footer</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label>
              Copyright{" "}
              <span className="text-muted-foreground font-normal">(deixe em branco para gerar automaticamente)</span>
            </Label>
            <Input
              {...field("footerCopyright")}
              placeholder={`© ${new Date().getFullYear()} Ice Van. Todos os direitos reservados.`}
            />
          </div>
          <div className="space-y-1.5">
            <Label>Rodapé (CNPJ, segmento)</Label>
            <Input
              {...field("footerRodape")}
              placeholder="CNPJ 00.000.000/0000-00 — Refrigeração para Transporte | São Paulo, SP"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
