"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import {
  Plus,
  Trash2,
  Eye,
  EyeOff,
  ChevronUp,
  ChevronDown,
  Loader2,
  Images,
  Save,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface GalleryPhoto {
  id: number;
  filename: string;
  alt: string;
  category: string;
  sortOrder: number;
  visible: boolean;
}

export default function GaleriaPage() {
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ filename: "", alt: "", category: "" });
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({ alt: "", category: "" });

  const fetchPhotos = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/admin/gallery");
    const data = await res.json();
    setPhotos(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchPhotos();
  }, [fetchPhotos]);

  const addPhoto = async () => {
    if (!form.filename || !form.alt || !form.category) return;
    setSaving(true);
    await fetch("/api/admin/gallery", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setForm({ filename: "", alt: "", category: "" });
    setShowForm(false);
    fetchPhotos();
    setSaving(false);
  };

  const toggleVisible = async (id: number, visible: boolean) => {
    await fetch(`/api/admin/gallery/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ visible }),
    });
    setPhotos((prev) => prev.map((p) => (p.id === id ? { ...p, visible } : p)));
  };

  const move = async (index: number, direction: "up" | "down") => {
    const newPhotos = [...photos];
    const swapIndex = direction === "up" ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= newPhotos.length) return;
    [newPhotos[index], newPhotos[swapIndex]] = [newPhotos[swapIndex], newPhotos[index]];

    setPhotos(newPhotos);
    await Promise.all([
      fetch(`/api/admin/gallery/${newPhotos[index].id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sortOrder: index }),
      }),
      fetch(`/api/admin/gallery/${newPhotos[swapIndex].id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sortOrder: swapIndex }),
      }),
    ]);
  };

  const deletePhoto = async (id: number) => {
    if (!confirm("Remover esta foto da galeria?")) return;
    await fetch(`/api/admin/gallery/${id}`, { method: "DELETE" });
    setPhotos((prev) => prev.filter((p) => p.id !== id));
  };

  const saveEdit = async (id: number) => {
    await fetch(`/api/admin/gallery/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editForm),
    });
    setPhotos((prev) => prev.map((p) => (p.id === id ? { ...p, ...editForm } : p)));
    setEditingId(null);
  };

  return (
    <div className="space-y-5 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold text-brand-primary">Galeria</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            {photos.length} fotos · {photos.filter((p) => p.visible).length} visíveis
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-primary text-sm py-2"
        >
          <Plus className="w-4 h-4" />
          Adicionar Foto
        </button>
      </div>

      {/* Formulário de nova foto */}
      {showForm && (
        <div className="bg-white rounded-xl shadow-card p-5 border border-brand-secondary/20">
          <h3 className="font-semibold text-brand-primary mb-4">Nova Foto</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
            <div>
              <label className="form-label">Caminho da imagem *</label>
              <input
                type="text"
                value={form.filename}
                onChange={(e) => setForm({ ...form, filename: e.target.value })}
                placeholder="/images/fotos-servicos/foto-01.webp"
                className="form-input text-sm"
              />
            </div>
            <div>
              <label className="form-label">Texto alternativo (alt) *</label>
              <input
                type="text"
                value={form.alt}
                onChange={(e) => setForm({ ...form, alt: e.target.value })}
                placeholder="Descrição da imagem"
                className="form-input text-sm"
              />
            </div>
            <div>
              <label className="form-label">Categoria *</label>
              <input
                type="text"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                placeholder="Ex: Fiorino, Van Ducato"
                className="form-input text-sm"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={addPhoto} disabled={saving} className="btn-accent text-sm py-2">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Salvar
            </button>
            <button onClick={() => setShowForm(false)} className="btn-outline text-sm py-2">
              <X className="w-4 h-4" />
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Lista de fotos */}
      <div className="bg-white rounded-xl shadow-card overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center p-16 text-gray-400">
            <Loader2 className="w-6 h-6 animate-spin mr-2" />
            Carregando...
          </div>
        ) : photos.length === 0 ? (
          <div className="p-16 text-center text-gray-400">
            <Images className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="text-sm">Nenhuma foto na galeria ainda.</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-50">
            {photos.map((photo, index) => (
              <li key={photo.id} className={cn("flex items-center gap-3 px-4 py-3", !photo.visible && "opacity-50")}>
                {/* Preview */}
                <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                  <Image src={photo.filename} alt={photo.alt} fill className="object-cover" sizes="56px" unoptimized />
                </div>

                {/* Dados editáveis */}
                {editingId === photo.id ? (
                  <div className="flex-1 grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={editForm.alt}
                      onChange={(e) => setEditForm({ ...editForm, alt: e.target.value })}
                      className="form-input text-sm py-1.5"
                      placeholder="Alt text"
                    />
                    <input
                      type="text"
                      value={editForm.category}
                      onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                      className="form-input text-sm py-1.5"
                      placeholder="Categoria"
                    />
                  </div>
                ) : (
                  <div
                    className="flex-1 cursor-pointer"
                    onClick={() => {
                      setEditingId(photo.id);
                      setEditForm({ alt: photo.alt, category: photo.category });
                    }}
                  >
                    <p className="text-sm font-medium text-brand-dark truncate">{photo.alt}</p>
                    <p className="text-xs text-gray-400">{photo.category} · {photo.filename}</p>
                  </div>
                )}

                {/* Ações */}
                <div className="flex items-center gap-1 flex-shrink-0">
                  {editingId === photo.id ? (
                    <>
                      <button onClick={() => saveEdit(photo.id)} className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg"><Save className="w-4 h-4" /></button>
                      <button onClick={() => setEditingId(null)} className="p-1.5 text-gray-400 hover:bg-gray-100 rounded-lg"><X className="w-4 h-4" /></button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => move(index, "up")} disabled={index === 0} className="p-1.5 text-gray-400 hover:text-brand-primary hover:bg-gray-100 rounded-lg disabled:opacity-30"><ChevronUp className="w-4 h-4" /></button>
                      <button onClick={() => move(index, "down")} disabled={index === photos.length - 1} className="p-1.5 text-gray-400 hover:text-brand-primary hover:bg-gray-100 rounded-lg disabled:opacity-30"><ChevronDown className="w-4 h-4" /></button>
                      <button onClick={() => toggleVisible(photo.id, !photo.visible)} className="p-1.5 text-gray-400 hover:text-brand-secondary hover:bg-gray-100 rounded-lg">{photo.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}</button>
                      <button onClick={() => deletePhoto(photo.id)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                    </>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
