"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Loader2, Plus, Trash2, Save, CheckCircle, GripVertical, AlertTriangle, Car,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

interface VehicleRegistryItem {
  slug: string;
  label: string;
  href: string;
  ordem: number;
}

const DEFAULT_REGISTRY: VehicleRegistryItem[] = [
  { slug: "fiorinos",                  label: "Fiorinos",                       href: "/fiorinos",                  ordem: 1 },
  { slug: "van-ducato",                label: "Van Ducato",                     href: "/van-ducato",                ordem: 2 },
  { slug: "van-sprinter",              label: "Van Sprinter",                   href: "/van-sprinter",              ordem: 3 },
  { slug: "van-master",                label: "Van Master",                     href: "/van-master",                ordem: 4 },
  { slug: "expert-porta-frigorifica",  label: "Expert c/ Porta Frigorífica",   href: "/expert-porta-frigorifica",  ordem: 5 },
  { slug: "fiorino-porta-frigorifica", label: "Fiorino c/ Porta Frigorífica",  href: "/fiorino-porta-frigorifica", ordem: 6 },
];

// Slugs dos veículos originais que têm rota estática própria
const STATIC_SLUGS = new Set([
  "fiorinos", "van-ducato", "van-sprinter", "van-master",
  "expert-porta-frigorifica", "fiorino-porta-frigorifica",
]);

type SaveStatus = "idle" | "saving" | "saved";

function slugify(str: string): string {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function VeiculosPage() {
  const [registry, setRegistry] = useState<VehicleRegistryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [newLabel, setNewLabel] = useState("");
  const [newSlug, setNewSlug] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/veiculos");
      setRegistry(await res.json());
    } catch {
      setRegistry(DEFAULT_REGISTRY);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  // Auto-preenche slug a partir do nome
  const handleLabelChange = (value: string) => {
    setNewLabel(value);
    setNewSlug(slugify(value));
  };

  const save = async (list: VehicleRegistryItem[]) => {
    setSaveStatus("saving");
    try {
      await fetch("/api/admin/veiculos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(list),
      });
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 2500);
    } catch {
      setSaveStatus("idle");
    }
  };

  const addVehicle = async () => {
    if (!newLabel.trim() || !newSlug.trim()) return;
    const newItem: VehicleRegistryItem = {
      slug: newSlug,
      label: newLabel.trim(),
      href: `/aplicacoes/${newSlug}`,
      ordem: registry.length + 1,
    };

    // Cria conteúdo inicial no banco para o novo veículo
    await fetch("/api/admin/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        [`content_application_${newSlug}`]: JSON.stringify({
          titulo: newLabel.trim(),
          subtitulo: "",
          conteudo: [""],
          specs: [{ label: "", valor: "" }],
        }),
      }),
    });

    // Cria pasta de imagens no servidor
    await fetch(`/api/admin/images?folder=images/aplicacoes/${newSlug}`, {
      method: "PUT",
    }).catch(() => {}); // Falha silenciosa se a API não suportar PUT

    const updated = [...registry, newItem];
    setRegistry(updated);
    await save(updated);
    setNewLabel("");
    setNewSlug("");
  };

  const removeVehicle = async (slug: string) => {
    const updated = registry
      .filter((v) => v.slug !== slug)
      .map((v, i) => ({ ...v, ordem: i + 1 }));
    setRegistry(updated);
    setDeleteConfirm(null);
    await save(updated);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-40">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-6 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Gerenciar Veículos</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Adicione ou remova veículos do site. Ao adicionar, o veículo aparece em Aplicações, no footer e no editor de textos.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => save(registry)}
          disabled={saveStatus === "saving"}
        >
          {saveStatus === "saving" ? <Loader2 className="w-4 h-4 animate-spin" /> :
           saveStatus === "saved" ? <CheckCircle className="w-4 h-4 text-green-500" /> :
           <Save className="w-4 h-4" />}
          {saveStatus === "saved" ? "Salvo!" : "Salvar ordem"}
        </Button>
      </div>

      {/* Lista atual */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Veículos Ativos ({registry.length})</CardTitle>
          <CardDescription>
            Clique em{" "}
            <Link href="/admin/textos/aplicacoes" className="underline">
              Textos → Aplicações
            </Link>{" "}
            para editar o conteúdo de cada veículo.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {registry.map((v) => (
              <div
                key={v.slug}
                className="flex items-center gap-3 p-3 rounded-lg border bg-card"
              >
                <GripVertical className="w-4 h-4 text-muted-foreground shrink-0" />
                <div className="p-2 bg-muted rounded-md shrink-0">
                  <Car className="w-4 h-4 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">{v.label}</p>
                  <p className="text-xs text-muted-foreground font-mono">{v.href}</p>
                </div>
                {STATIC_SLUGS.has(v.slug) && (
                  <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full shrink-0">
                    padrão
                  </span>
                )}
                {deleteConfirm === v.slug ? (
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs text-destructive">Confirmar?</span>
                    <Button size="sm" variant="destructive" onClick={() => removeVehicle(v.slug)}>
                      Sim
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setDeleteConfirm(null)}>
                      Não
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="shrink-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => setDeleteConfirm(v.slug)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Adicionar novo veículo */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Adicionar Novo Veículo</CardTitle>
          <CardDescription>
            Após adicionar, vá em <Link href="/admin/textos/aplicacoes" className="underline">Textos → Aplicações</Link> para editar o conteúdo e em <Link href="/admin/imagens" className="underline">Imagens</Link> para fazer upload das fotos.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label>Nome do veículo</Label>
              <Input
                value={newLabel}
                onChange={(e) => handleLabelChange(e.target.value)}
                placeholder="ex: Caminhão Truck"
              />
            </div>
            <div>
              <Label>Slug (URL)</Label>
              <Input
                value={newSlug}
                onChange={(e) => setNewSlug(e.target.value)}
                placeholder="ex: caminhao-truck"
              />
              {newSlug && (
                <p className="text-xs text-muted-foreground mt-1">
                  Página: <code>/aplicacoes/{newSlug}</code>
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-sm">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>O slug não pode ser alterado após a criação.</span>
          </div>
          <Button
            onClick={addVehicle}
            disabled={!newLabel.trim() || !newSlug.trim()}
          >
            <Plus className="w-4 h-4" />
            Adicionar veículo
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
