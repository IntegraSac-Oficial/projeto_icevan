"use client";

import { useState, useEffect } from "react";
import { Save, Image as ImageIcon, RefreshCw } from "lucide-react";

interface Photo {
  filename: string;
  legenda: string;
  src: string;
}

interface CaptionsData {
  aplicacao: string;
  totalFotos: number;
  fotos: Photo[];
}

interface LegendasFotosClientProps {
  aplicacoes: { slug: string; label: string }[];
}

export function LegendasFotosClient({ aplicacoes }: LegendasFotosClientProps) {
  const [aplicacaoSelecionada, setAplicacaoSelecionada] = useState<string>(
    aplicacoes[0]?.slug || ""
  );
  const [fotos, setFotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Carrega fotos quando seleciona uma aplicação
  useEffect(() => {
    if (!aplicacaoSelecionada) return;
    loadFotos();
  }, [aplicacaoSelecionada]);

  async function loadFotos() {
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch(`/api/admin/photo-captions?aplicacao=${aplicacaoSelecionada}`);
      if (!res.ok) {
        throw new Error("Erro ao carregar fotos");
      }
      const data: CaptionsData = await res.json();
      setFotos(data.fotos);
    } catch (error) {
      console.error("Erro ao carregar fotos:", error);
      setMessage({ type: "error", text: "Erro ao carregar fotos" });
      setFotos([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/photo-captions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          aplicacao: aplicacaoSelecionada,
          legendas: fotos.map((f) => ({ filename: f.filename, legenda: f.legenda })),
        }),
      });

      if (!res.ok) {
        throw new Error("Erro ao salvar legendas");
      }

      setMessage({ type: "success", text: "Legendas salvas com sucesso!" });
      
      // Recarrega as fotos para sincronizar
      setTimeout(() => loadFotos(), 1000);
    } catch (error) {
      console.error("Erro ao salvar legendas:", error);
      setMessage({ type: "error", text: "Erro ao salvar legendas" });
    } finally {
      setSaving(false);
    }
  }

  function updateLegenda(filename: string, legenda: string) {
    setFotos((prev) =>
      prev.map((f) => (f.filename === filename ? { ...f, legenda } : f))
    );
  }

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Legendas das Fotos
          </h1>
          <p className="text-gray-600">
            Edite os textos que aparecem no canto inferior esquerdo de cada foto da galeria das aplicações.
            As legendas são sincronizadas automaticamente com as fotos do filesystem.
          </p>
        </div>

        {/* Seletor de aplicação */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Selecione a Aplicação
          </label>
          <div className="flex gap-3">
            <select
              value={aplicacaoSelecionada}
              onChange={(e) => setAplicacaoSelecionada(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {aplicacoes.map((app) => (
                <option key={app.slug} value={app.slug}>
                  {app.label}
                </option>
              ))}
            </select>
            <button
              onClick={loadFotos}
              disabled={loading}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg
                         transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              Recarregar
            </button>
          </div>
        </div>

        {/* Mensagem de feedback */}
        {message && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              message.type === "success"
                ? "bg-green-50 text-green-800 border border-green-200"
                : "bg-red-50 text-red-800 border border-red-200"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="text-center py-12">
            <RefreshCw className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-3" />
            <p className="text-gray-600">Carregando fotos...</p>
          </div>
        )}

        {/* Lista de fotos */}
        {!loading && fotos.length === 0 && (
          <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">Nenhuma foto encontrada para esta aplicação</p>
          </div>
        )}

        {!loading && fotos.length > 0 && (
          <>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Fotos da Galeria ({fotos.length})
                </h2>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg
                             transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {saving ? "Salvando..." : "Salvar Legendas"}
                </button>
              </div>

              <div className="space-y-4">
                {fotos.map((foto, index) => (
                  <div
                    key={foto.filename}
                    className="flex gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200
                               hover:border-blue-300 transition-colors"
                  >
                    {/* Preview da foto */}
                    <div className="flex-shrink-0 w-32 h-32 relative rounded-lg overflow-hidden bg-gray-200">
                      <img
                        src={foto.src}
                        alt={foto.filename}
                        className="w-full h-full object-cover"
                      />
                      {foto.legenda && (
                        <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                          {foto.legenda}
                        </div>
                      )}
                    </div>

                    {/* Campos de edição */}
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Foto {index + 1}: {foto.filename}
                      </label>
                      <input
                        type="text"
                        value={foto.legenda}
                        onChange={(e) => updateLegenda(foto.filename, e.target.value)}
                        placeholder="Digite a legenda que aparecerá no canto da foto"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg
                                   focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Este texto aparecerá no canto inferior esquerdo da foto na galeria
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Botão salvar no final */}
            <div className="flex justify-end">
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg
                           transition-colors flex items-center gap-2 disabled:opacity-50 text-lg"
              >
                <Save className="w-5 h-5" />
                {saving ? "Salvando..." : "Salvar Todas as Legendas"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
