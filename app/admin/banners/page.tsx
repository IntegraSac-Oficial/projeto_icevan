"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { Upload, Trash2, Loader2, Edit3, Save, X, RefreshCw, CheckCircle, AlertCircle } from "lucide-react";

interface Banner {
  id: number;
  filename: string;
  titulo: string;
  descricao: string;
  sortOrder: number;
  visible: boolean;
}

export default function BannersPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitulo, setEditTitulo] = useState("");
  const [editDescricao, setEditDescricao] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<"idle" | "success" | "error">("idle");
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const replaceInputRef = useRef<HTMLInputElement>(null);
  const [replaceTarget, setReplaceTarget] = useState<Banner | null>(null);

  const fetchBanners = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/banners");
      const data = await res.json();
      setBanners(data.banners || []);
    } catch (error) {
      console.error("Erro ao carregar banners:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const startEdit = (banner: Banner) => {
    setEditingId(banner.id);
    setEditTitulo(banner.titulo);
    setEditDescricao(banner.descricao);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditTitulo("");
    setEditDescricao("");
  };

  const saveBanner = async (id: number) => {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/banners/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          titulo: editTitulo,
          descricao: editDescricao,
        }),
      });

      if (res.ok) {
        await fetchBanners();
        cancelEdit();
      }
    } catch (error) {
      console.error("Erro ao salvar:", error);
    } finally {
      setSaving(false);
    }
  };

  const syncBanners = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/banners/sync", {
        method: "POST",
      });
      if (res.ok) {
        await fetchBanners();
      }
    } catch (error) {
      console.error("Erro ao sincronizar:", error);
    } finally {
      setLoading(false);
    }
  };

  const uploadFile = async (file: File, saveas?: string) => {
    setUploading(true);
    setUploadStatus("idle");

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "images/hero");
      if (saveas) {
        formData.append("saveas", saveas);
      }

      const res = await fetch("/api/admin/images", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        setUploadStatus("success");
        await syncBanners();
        setTimeout(() => setUploadStatus("idle"), 3000);
        setReplaceTarget(null);
      } else {
        setUploadStatus("error");
      }
    } catch (error) {
      console.error("Erro no upload:", error);
      setUploadStatus("error");
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadFile(file);
    }
    e.target.value = "";
  };

  const handleReplaceFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && replaceTarget) {
      uploadFile(file, replaceTarget.filename);
    }
    e.target.value = "";
  };

  const handleReplaceClick = (banner: Banner) => {
    setReplaceTarget(banner);
    replaceInputRef.current?.click();
  };

  const deleteBanner = async (banner: Banner) => {
    if (!confirm(`Deletar o banner "${banner.filename}"?`)) return;

    try {
      const res = await fetch(`/api/admin/images/${encodeURIComponent(banner.filename)}?folder=images/hero`, {
        method: "DELETE",
      });

      if (res.ok) {
        await syncBanners();
      }
    } catch (error) {
      console.error("Erro ao deletar:", error);
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Banners Hero</h1>
            <p className="text-sm text-gray-500 mt-1">
              Gerencie os banners do slider principal (imagem + título + descrição)
            </p>
          </div>
          <button
            onClick={syncBanners}
            disabled={loading}
            className="px-4 py-2 bg-brand-secondary text-white rounded-lg hover:bg-brand-secondary/90 transition-colors disabled:opacity-50"
          >
            {loading ? "Sincronizando..." : "Sincronizar"}
          </button>
        </div>

        {/* Upload de novo banner */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
          <h3 className="font-semibold text-gray-800 mb-4">Adicionar Novo Banner</h3>
          
          <input
            ref={fileInputRef}
            type="file"
            accept=".jpg,.jpeg,.png,.webp"
            onChange={handleFileChange}
            className="hidden"
          />
          <input
            ref={replaceInputRef}
            type="file"
            accept=".jpg,.jpeg,.png,.webp"
            onChange={handleReplaceFileChange}
            className="hidden"
          />

          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-brand-secondary hover:bg-gray-50 transition-all"
          >
            {uploading ? (
              <div className="flex items-center justify-center gap-2 text-brand-secondary">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="text-sm font-medium">Enviando...</span>
              </div>
            ) : uploadStatus === "success" ? (
              <div className="flex items-center justify-center gap-2 text-green-600">
                <CheckCircle className="w-5 h-5" />
                <span className="text-sm font-medium">Banner adicionado!</span>
              </div>
            ) : uploadStatus === "error" ? (
              <div className="flex items-center justify-center gap-2 text-red-500">
                <AlertCircle className="w-5 h-5" />
                <span className="text-sm font-medium">Erro no upload</span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-3 text-gray-500">
                <Upload className="w-5 h-5 text-brand-secondary" />
                <span className="text-sm">Clique para adicionar um banner (1920×780px recomendado)</span>
              </div>
            )}
          </div>

          <p className="text-xs text-gray-500 mt-2">
            💡 Os banners são numerados automaticamente (01-, 02-, 03-...) e aparecem na ordem alfabética
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-brand-secondary" />
          </div>
        ) : banners.length === 0 ? (
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-8 text-center">
            <p className="text-gray-500 mb-4">
              Nenhum banner encontrado. Adicione um banner acima ou clique em &quot;Sincronizar&quot;.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {banners.map((banner) => {
              const isEditing = editingId === banner.id;

              return (
                <div
                  key={banner.id}
                  className="bg-white border border-gray-200 rounded-xl overflow-hidden"
                >
                  <div className="flex gap-4 p-4">
                    {/* Imagem */}
                    <div className="relative w-48 h-28 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                      <Image
                        src={`/images/hero/${banner.filename}?t=${Date.now()}`}
                        alt={banner.titulo || "Banner"}
                        fill
                        className="object-cover"
                        sizes="192px"
                      />
                      <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                        #{banner.sortOrder}
                      </div>
                    </div>

                    {/* Conteúdo */}
                    <div className="flex-1 min-w-0">
                      {isEditing ? (
                        <div className="space-y-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Título do banner
                            </label>
                            <input
                              type="text"
                              value={editTitulo}
                              onChange={(e) => setEditTitulo(e.target.value)}
                              placeholder="Ex: Sistemas de Refrigeração para Transporte"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-secondary focus:border-transparent"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Descrição do banner
                            </label>
                            <textarea
                              value={editDescricao}
                              onChange={(e) => setEditDescricao(e.target.value)}
                              placeholder="Ex: Qualidade e eficiência para conservar sua carga perecível..."
                              rows={3}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-secondary focus:border-transparent resize-none"
                            />
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => saveBanner(banner.id)}
                              disabled={saving}
                              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                            >
                              {saving ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <Save className="w-4 h-4" />
                              )}
                              Salvar
                            </button>
                            <button
                              onClick={cancelEdit}
                              disabled={saving}
                              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50 flex items-center gap-2"
                            >
                              <X className="w-4 h-4" />
                              Cancelar
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-800 text-lg">
                                {banner.titulo || <span className="text-gray-400 italic">Sem título</span>}
                              </h3>
                              <p className="text-sm text-gray-500 mt-1">
                                {banner.descricao || <span className="text-gray-400 italic">Sem descrição</span>}
                              </p>
                            </div>
                            <div className="flex items-center gap-1 flex-shrink-0">
                              <button
                                onClick={() => startEdit(banner)}
                                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                title="Editar título e descrição"
                              >
                                <Edit3 className="w-5 h-5" />
                              </button>
                              <button
                                onClick={() => handleReplaceClick(banner)}
                                className="p-2 text-gray-400 hover:text-brand-secondary hover:bg-brand-secondary/10 rounded-lg transition-all"
                                title="Substituir imagem"
                              >
                                <RefreshCw className="w-5 h-5" />
                              </button>
                              <button
                                onClick={() => deleteBanner(banner)}
                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                title="Deletar banner"
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                            </div>
                          </div>
                          <p className="text-xs text-gray-400 mt-2">
                            Arquivo: {banner.filename}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Instruções */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
          <p className="text-sm font-semibold text-blue-700 mb-2">
            📌 Como funciona:
          </p>
          <ul className="text-sm text-blue-600 space-y-1 list-disc list-inside">
            <li>Adicione novos banners clicando na área de upload acima</li>
            <li>Clique no ícone de lápis (✏️) para editar título e descrição</li>
            <li>Clique no ícone de substituir (↻) para trocar a imagem mantendo a posição</li>
            <li>Clique no ícone de lixeira (🗑️) para deletar um banner</li>
            <li>Os banners aparecem no slider da home na ordem alfabética (01-, 02-, 03-...)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
