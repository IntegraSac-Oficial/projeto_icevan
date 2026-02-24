"use client";

import { useState } from "react";
import { Save, Loader2, CheckCircle, Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const PAGES = [
  { slug: "/", label: "Home" },
  { slug: "/empresa", label: "Empresa" },
  { slug: "/aplicacoes", label: "Aplicações" },
  { slug: "/fotos-servicos", label: "Fotos e Serviços" },
  { slug: "/contato", label: "Contato" },
  { slug: "/fiorinos", label: "Fiorinos" },
  { slug: "/van-ducato", label: "Van Ducato" },
  { slug: "/van-sprinter", label: "Van Sprinter" },
  { slug: "/van-master", label: "Van Master" },
  { slug: "/expert-porta-frigorifica", label: "Expert c/ Porta Frigorífica" },
  { slug: "/fiorino-porta-frigorifica", label: "Fiorino c/ Porta Frigorífica" },
];

interface SeoForm {
  metaTitulo: string;
  metaDescricao: string;
  ogImage: string;
}

export default function SeoPage() {
  const [forms, setForms] = useState<Record<string, SeoForm>>(
    Object.fromEntries(
      PAGES.map((p) => [
        p.slug,
        { metaTitulo: "", metaDescricao: "", ogImage: "" },
      ])
    )
  );
  const [savingSlug, setSavingSlug] = useState<string | null>(null);
  const [savedSlug, setSavedSlug] = useState<string | null>(null);

  const updateForm = (slug: string, field: keyof SeoForm, value: string) => {
    setForms((prev) => ({
      ...prev,
      [slug]: { ...prev[slug], [field]: value },
    }));
  };

  const saveSeo = async (slug: string) => {
    setSavingSlug(slug);
    try {
      await fetch("/api/admin/seo", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pageSlug: slug, ...forms[slug] }),
      });
      setSavedSlug(slug);
      setTimeout(() => setSavedSlug(null), 3000);
    } finally {
      setSavingSlug(null);
    }
  };

  const titleLength = (slug: string) => forms[slug].metaTitulo.length;
  const descLength = (slug: string) => forms[slug].metaDescricao.length;

  return (
    <div className="space-y-5 max-w-3xl">
      <div>
        <h1 className="text-2xl font-heading font-bold text-foreground">
          Configurações de SEO
        </h1>
        <p className="text-muted-foreground text-sm mt-0.5">
          Defina o título e a descrição de cada página para melhorar o posicionamento no Google
        </p>
      </div>

      {PAGES.map((page) => {
        const form = forms[page.slug];
        const isSaving = savingSlug === page.slug;
        const isSaved = savedSlug === page.slug;
        const t = titleLength(page.slug);
        const d = descLength(page.slug);

        return (
          <Card key={page.slug}>
            <CardHeader className="pb-4 flex flex-row items-center gap-2 space-y-0">
              <div className="p-1.5 bg-primary/10 rounded-lg">
                <Search className="w-4 h-4 text-primary" />
              </div>
              <div>
                <CardTitle className="text-sm font-semibold">{page.label}</CardTitle>
                <CardDescription className="text-xs">{page.slug}</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Meta Título */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="form-label text-xs mb-0">Meta Título</label>
                  <span className={`text-xs ${t > 60 ? "text-red-500" : t > 50 ? "text-yellow-500" : "text-gray-400"}`}>
                    {t}/60
                  </span>
                </div>
                <input
                  type="text"
                  value={form.metaTitulo}
                  onChange={(e) => updateForm(page.slug, "metaTitulo", e.target.value)}
                  placeholder={`Ex: ${page.label} | Ice Van — Refrigeração para Transporte`}
                  className="form-input text-sm"
                  maxLength={70}
                />
              </div>

              {/* Meta Descrição */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="form-label text-xs mb-0">Meta Descrição</label>
                  <span className={`text-xs ${d > 160 ? "text-red-500" : d > 140 ? "text-yellow-500" : "text-gray-400"}`}>
                    {d}/160
                  </span>
                </div>
                <textarea
                  value={form.metaDescricao}
                  onChange={(e) => updateForm(page.slug, "metaDescricao", e.target.value)}
                  placeholder="Breve descrição da página (aparece no Google abaixo do título)"
                  className="form-input text-sm resize-none"
                  rows={2}
                  maxLength={180}
                />
              </div>

              {/* Preview snippet */}
              {(form.metaTitulo || form.metaDescricao) && (
                <div className="bg-muted rounded-lg p-3 border border-border">
                  <p className="text-xs text-muted-foreground mb-1.5 uppercase tracking-wider font-semibold">
                    Preview no Google
                  </p>
                  <p className="text-[#1a0dab] text-sm font-medium truncate">
                    {form.metaTitulo || "(sem título)"}
                  </p>
                  <p className="text-xs text-[#006621] mb-0.5">
                    icevans.com.br{page.slug}
                  </p>
                  <p className="text-xs text-gray-600 line-clamp-2">
                    {form.metaDescricao || "(sem descrição)"}
                  </p>
                </div>
              )}

              {/* Botão salvar */}
              <div className="flex items-center gap-3 pt-1">
                <button
                  onClick={() => saveSeo(page.slug)}
                  disabled={isSaving || (!form.metaTitulo && !form.metaDescricao)}
                  className="btn-primary text-sm py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : isSaved ? (
                    <CheckCircle className="w-4 h-4 text-green-400" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  {isSaved ? "Salvo!" : "Salvar"}
                </button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
