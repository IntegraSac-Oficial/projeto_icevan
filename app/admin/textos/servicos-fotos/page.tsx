"use client";

import { useState, useEffect } from "react";
import { Save, Loader2 } from "lucide-react";

interface ServicosTextos {
  heroTitulo: string;
  heroSubtitulo: string;
  galeriaFotosTitulo: string;
  galeriaFotosDescricao: string;
  ctaTitulo: string;
  ctaDescricao: string;
}

const DEFAULT_TEXTOS: ServicosTextos = {
  heroTitulo: "Fotos e Serviços",
  heroSubtitulo: "Confira nossos trabalhos e serviços realizados. Cada instalação é executada com cuidado, precisão técnica e materiais de primeira linha.",
  galeriaFotosTitulo: "Galeria de Fotos",
  galeriaFotosDescricao: "Registros reais dos nossos serviços de instalação e acabamento.",
  ctaTitulo: "Gostou do que viu?",
  ctaDescricao: "Solicite um orçamento agora e transforme seu veículo em uma plataforma de refrigeração profissional.",
};

export default function ServicosTextosPage() {
  const [textos, setTextos] = useState<ServicosTextos>(DEFAULT_TEXTOS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    fetchTextos();
  }, []);

  async function fetchTextos() {
    try {
      const res = await fetch("/api/admin/settings");
      if (res.ok) {
        const data = await res.json();
        const loaded: Partial<ServicosTextos> = {};
        
        Object.keys(DEFAULT_TEXTOS).forEach((key) => {
          const settingKey = `servicosFotos_${key}`;
          if (data[settingKey]) {
            loaded[key as keyof ServicosTextos] = data[settingKey];
          }
        });
        
        setTextos({ ...DEFAULT_TEXTOS, ...loaded });
      }
    } catch (error) {
      console.error("Erro ao carregar textos:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    setSaving(true);
    setMessage(null);

    try {
      const settings: Record<string, string> = {};
      Object.entries(textos).forEach(([key, value]) => {
        settings[`servicosFotos_${key}`] = value;
      });

      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      if (res.ok) {
        setMessage({ type: "success", text: "Textos salvos com sucesso!" });
        setTimeout(() => setMessage(null), 3000);
      } else {
        throw new Error("Erro ao salvar");
      }
    } catch (error) {
      console.error("Erro ao salvar:", error);
      setMessage({ type: "error", text: "Erro ao salvar textos" });
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-brand-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold text-brand-primary">
            Serviços e Fotos
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Edite os textos da página de portfólio
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="btn-primary flex items-center gap-2"
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Salvando...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Salvar
            </>
          )}
        </button>
      </div>

      {message && (
        <div
          className={`p-4 rounded-lg ${
            message.type === "success"
              ? "bg-green-50 text-green-800 border border-green-200"
              : "bg-red-50 text-red-800 border border-red-200"
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-card p-6 space-y-6">
        {/* Hero Section */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">
            Seção Hero (Topo da Página)
          </h2>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Título Principal
            </label>
            <input
              type="text"
              value={textos.heroTitulo}
              onChange={(e) => setTextos({ ...textos, heroTitulo: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent"
              placeholder="Ex: Fotos e Serviços"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subtítulo / Descrição
            </label>
            <textarea
              value={textos.heroSubtitulo}
              onChange={(e) => setTextos({ ...textos, heroSubtitulo: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent resize-none"
              placeholder="Descrição que aparece abaixo do título"
            />
          </div>
        </div>

        {/* Galeria de Fotos */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">
            Galeria de Fotos
          </h2>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Título da Galeria
            </label>
            <input
              type="text"
              value={textos.galeriaFotosTitulo}
              onChange={(e) => setTextos({ ...textos, galeriaFotosTitulo: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent"
              placeholder="Ex: Galeria de Fotos"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descrição da Galeria
            </label>
            <textarea
              value={textos.galeriaFotosDescricao}
              onChange={(e) => setTextos({ ...textos, galeriaFotosDescricao: e.target.value })}
              rows={2}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent resize-none"
              placeholder="Texto que aparece abaixo do título da galeria"
            />
          </div>
        </div>

        {/* CTA Section */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">
            Call to Action (Final da Página)
          </h2>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Título do CTA
            </label>
            <input
              type="text"
              value={textos.ctaTitulo}
              onChange={(e) => setTextos({ ...textos, ctaTitulo: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent"
              placeholder="Ex: Gostou do que viu?"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descrição do CTA
            </label>
            <textarea
              value={textos.ctaDescricao}
              onChange={(e) => setTextos({ ...textos, ctaDescricao: e.target.value })}
              rows={2}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent resize-none"
              placeholder="Texto que aparece acima do botão de WhatsApp"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
