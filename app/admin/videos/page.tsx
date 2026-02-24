"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Image from "next/image";
import {
  Plus,
  Trash2,
  Eye,
  EyeOff,
  ChevronUp,
  ChevronDown,
  Loader2,
  Video,
  Save,
  X,
  Youtube,
  Film,
  Upload,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface VideoItem {
  id: number;
  youtubeId: string;
  titulo: string;
  categoria: string;
  sortOrder: number;
  visible: boolean;
}

const CATEGORIAS = [
  "Fiorino",
  "Van Ducato",
  "Van Sprinter",
  "Van Master",
  "Expert c/ Porta",
  "Fiorino c/ Porta",
  "Manutenção",
  "Outro",
];

function isLocalVideo(youtubeId: string) {
  return youtubeId.startsWith("/");
}

export default function VideosPage() {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [tipo, setTipo] = useState<"youtube" | "local">("youtube");
  const [form, setForm] = useState({ youtubeId: "", titulo: "", categoria: "" });
  const [saving, setSaving] = useState(false);

  // Upload de vídeo local
  const videoFileRef = useRef<HTMLInputElement>(null);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [uploadVideoStatus, setUploadVideoStatus] = useState<"idle" | "success" | "error">("idle");

  const fetchVideos = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/admin/videos");
    const data = await res.json();
    setVideos(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  const handleLocalFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setUploadingVideo(true);
    setUploadVideoStatus("idle");
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/videos/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (res.ok && data.url) {
        setForm((prev) => ({ ...prev, youtubeId: data.url }));
        setUploadVideoStatus("success");
      } else {
        setUploadVideoStatus("error");
      }
    } catch {
      setUploadVideoStatus("error");
    } finally {
      setUploadingVideo(false);
    }
  };

  const addVideo = async () => {
    if (!form.youtubeId || !form.titulo || !form.categoria) return;
    setSaving(true);
    await fetch("/api/admin/videos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setForm({ youtubeId: "", titulo: "", categoria: "" });
    setTipo("youtube");
    setUploadVideoStatus("idle");
    setShowForm(false);
    fetchVideos();
    setSaving(false);
  };

  const toggleVisible = async (id: number, visible: boolean) => {
    await fetch(`/api/admin/videos/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ visible }),
    });
    setVideos((prev) => prev.map((v) => (v.id === id ? { ...v, visible } : v)));
  };

  const move = async (index: number, direction: "up" | "down") => {
    const newVideos = [...videos];
    const swapIndex = direction === "up" ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= newVideos.length) return;
    [newVideos[index], newVideos[swapIndex]] = [newVideos[swapIndex], newVideos[index]];
    setVideos(newVideos);
    await Promise.all([
      fetch(`/api/admin/videos/${newVideos[index].id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sortOrder: index }),
      }),
      fetch(`/api/admin/videos/${newVideos[swapIndex].id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sortOrder: swapIndex }),
      }),
    ]);
  };

  const deleteVideo = async (id: number) => {
    if (!confirm("Remover este vídeo?")) return;
    await fetch(`/api/admin/videos/${id}`, { method: "DELETE" });
    setVideos((prev) => prev.filter((v) => v.id !== id));
  };

  const categoriesWithVideos = CATEGORIAS.filter((cat) =>
    videos.some((v) => v.categoria === cat)
  );
  const uncategorized = videos.filter((v) => !CATEGORIAS.includes(v.categoria));

  function VideoRow({ video }: { video: VideoItem }) {
    const index = videos.findIndex((v) => v.id === video.id);
    const local = isLocalVideo(video.youtubeId);
    return (
      <li className={cn("flex items-center gap-3 px-4 py-3", !video.visible && "opacity-50")}>
        {/* Thumbnail */}
        <div className="relative w-20 h-14 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 flex items-center justify-center">
          {local ? (
            <Film className="w-7 h-7 text-gray-400" />
          ) : (
            <Image
              src={`https://img.youtube.com/vi/${video.youtubeId}/mqdefault.jpg`}
              alt={video.titulo}
              fill
              className="object-cover"
              sizes="80px"
              unoptimized
            />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-brand-dark truncate">{video.titulo}</p>
          <div className="flex items-center gap-1.5 mt-0.5">
            {local ? (
              <span className="inline-flex items-center gap-1 text-xs text-violet-500 font-medium">
                <Film className="w-3 h-3" /> Arquivo local
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-xs text-red-500 font-medium">
                <Youtube className="w-3 h-3" /> YouTube
              </span>
            )}
            <span className="text-xs text-gray-300">·</span>
            <p className="text-xs text-gray-400 font-mono truncate">
              {local ? video.youtubeId.split("/").pop() : video.youtubeId}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            onClick={() => move(index, "up")}
            disabled={index === 0}
            title="Mover para cima"
            className="p-1.5 text-gray-400 hover:text-brand-primary hover:bg-gray-100 rounded-lg disabled:opacity-30"
          >
            <ChevronUp className="w-4 h-4" />
          </button>
          <button
            onClick={() => move(index, "down")}
            disabled={index === videos.length - 1}
            title="Mover para baixo"
            className="p-1.5 text-gray-400 hover:text-brand-primary hover:bg-gray-100 rounded-lg disabled:opacity-30"
          >
            <ChevronDown className="w-4 h-4" />
          </button>
          <button
            onClick={() => toggleVisible(video.id, !video.visible)}
            title={video.visible ? "Ocultar" : "Exibir"}
            className="p-1.5 text-gray-400 hover:text-brand-secondary hover:bg-gray-100 rounded-lg"
          >
            {video.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          </button>
          <button
            onClick={() => deleteVideo(video.id)}
            title="Remover vídeo"
            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </li>
    );
  }

  return (
    <div className="space-y-5 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold text-brand-primary">Vídeos</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            {videos.length} vídeos · {videos.filter((v) => v.visible).length} visíveis
          </p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary text-sm py-2">
          <Plus className="w-4 h-4" />
          Adicionar Vídeo
        </button>
      </div>

      {/* Formulário */}
      {showForm && (
        <div className="bg-white rounded-xl shadow-card p-5 border border-brand-secondary/20 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-brand-primary">Novo Vídeo</h3>
            {/* Toggle YouTube / Arquivo local */}
            <div className="flex rounded-lg border border-gray-200 overflow-hidden text-sm">
              <button
                onClick={() => {
                  setTipo("youtube");
                  setForm((p) => ({ ...p, youtubeId: "" }));
                  setUploadVideoStatus("idle");
                }}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 font-medium transition-all",
                  tipo === "youtube" ? "bg-red-500 text-white" : "text-gray-500 hover:bg-gray-50"
                )}
              >
                <Youtube className="w-3.5 h-3.5" />
                YouTube
              </button>
              <button
                onClick={() => {
                  setTipo("local");
                  setForm((p) => ({ ...p, youtubeId: "" }));
                  setUploadVideoStatus("idle");
                }}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 font-medium transition-all border-l border-gray-200",
                  tipo === "local" ? "bg-violet-500 text-white" : "text-gray-500 hover:bg-gray-50"
                )}
              >
                <Film className="w-3.5 h-3.5" />
                Arquivo local
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Campo YouTube ID ou Upload */}
            {tipo === "youtube" ? (
              <div>
                <label className="form-label">YouTube ID *</label>
                <input
                  type="text"
                  value={form.youtubeId}
                  onChange={(e) => setForm({ ...form, youtubeId: e.target.value })}
                  placeholder="dQw4w9WgXcQ"
                  className="form-input text-sm"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Final da URL: youtube.com/watch?v=<strong>ID</strong>
                </p>
              </div>
            ) : (
              <div>
                <label className="form-label">Arquivo de vídeo *</label>
                <input
                  ref={videoFileRef}
                  type="file"
                  accept=".mp4,.webm,.mov,.avi,.mkv"
                  onChange={handleLocalFileChange}
                  className="hidden"
                />
                {form.youtubeId ? (
                  /* Arquivo já enviado */
                  <div className="flex items-center gap-2 px-3 py-2 bg-green-50 border border-green-200 rounded-lg">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm text-green-700 truncate font-medium">
                      {form.youtubeId.split("/").pop()}
                    </span>
                    <button
                      onClick={() => {
                        setForm((p) => ({ ...p, youtubeId: "" }));
                        setUploadVideoStatus("idle");
                      }}
                      className="ml-auto text-gray-400 hover:text-red-500"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => videoFileRef.current?.click()}
                    disabled={uploadingVideo}
                    className={cn(
                      "w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg border-2 border-dashed text-sm transition-all",
                      uploadVideoStatus === "error"
                        ? "border-red-300 text-red-500"
                        : "border-gray-200 text-gray-500 hover:border-violet-400 hover:text-violet-500"
                    )}
                  >
                    {uploadingVideo ? (
                      <><Loader2 className="w-4 h-4 animate-spin" /> Enviando...</>
                    ) : uploadVideoStatus === "error" ? (
                      <><AlertCircle className="w-4 h-4" /> Erro — tentar novamente</>
                    ) : (
                      <><Upload className="w-4 h-4" /> Selecionar MP4, WebM ou MOV</>
                    )}
                  </button>
                )}
              </div>
            )}

            <div>
              <label className="form-label">Título *</label>
              <input
                type="text"
                value={form.titulo}
                onChange={(e) => setForm({ ...form, titulo: e.target.value })}
                placeholder="Instalação Fiorino — Completo"
                className="form-input text-sm"
              />
            </div>
            <div>
              <label className="form-label">Veículo / Categoria *</label>
              <select
                value={form.categoria}
                onChange={(e) => setForm({ ...form, categoria: e.target.value })}
                className="form-input text-sm"
              >
                <option value="">Selecione o veículo...</option>
                {CATEGORIAS.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Preview do YouTube */}
          {tipo === "youtube" && form.youtubeId && (
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
              <div className="relative w-24 h-16 rounded overflow-hidden flex-shrink-0">
                <Image
                  src={`https://img.youtube.com/vi/${form.youtubeId}/mqdefault.jpg`}
                  alt="Preview"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium mb-1">Preview do vídeo</p>
                <p className="text-sm text-gray-700 font-medium">{form.titulo || "—"}</p>
                {form.categoria && (
                  <span className="inline-block mt-1 text-xs bg-brand-secondary/10 text-brand-secondary px-2 py-0.5 rounded-full">
                    {form.categoria}
                  </span>
                )}
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <button
              onClick={addVideo}
              disabled={saving || uploadingVideo || !form.youtubeId || !form.titulo || !form.categoria}
              className="btn-accent text-sm py-2 disabled:opacity-50"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Salvar
            </button>
            <button
              onClick={() => {
                setShowForm(false);
                setForm({ youtubeId: "", titulo: "", categoria: "" });
                setTipo("youtube");
                setUploadVideoStatus("idle");
              }}
              className="btn-outline text-sm py-2"
            >
              <X className="w-4 h-4" />
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Lista agrupada por veículo */}
      {loading ? (
        <div className="bg-white rounded-xl shadow-card flex items-center justify-center p-16 text-gray-400">
          <Loader2 className="w-6 h-6 animate-spin mr-2" />
          Carregando...
        </div>
      ) : videos.length === 0 ? (
        <div className="bg-white rounded-xl shadow-card p-16 text-center text-gray-400">
          <Video className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="text-sm">Nenhum vídeo cadastrado ainda.</p>
          <p className="text-xs mt-1">Clique em &quot;Adicionar Vídeo&quot; para começar.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {categoriesWithVideos.map((cat) => {
            const catVideos = videos.filter((v) => v.categoria === cat);
            return (
              <div key={cat} className="bg-white rounded-xl shadow-card overflow-hidden">
                <div className="px-4 py-2.5 bg-brand-primary/5 border-b border-brand-primary/10 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Video className="w-4 h-4 text-brand-primary" />
                    <span className="text-sm font-semibold text-brand-primary">{cat}</span>
                  </div>
                  <span className="text-xs text-gray-400">
                    {catVideos.length} {catVideos.length === 1 ? "vídeo" : "vídeos"} ·{" "}
                    {catVideos.filter((v) => v.visible).length} visíveis
                  </span>
                </div>
                <ul className="divide-y divide-gray-50">
                  {catVideos.map((video) => (
                    <VideoRow key={video.id} video={video} />
                  ))}
                </ul>
              </div>
            );
          })}

          {uncategorized.length > 0 && (
            <div className="bg-white rounded-xl shadow-card overflow-hidden">
              <div className="px-4 py-2.5 bg-gray-50 border-b border-gray-100">
                <span className="text-sm font-semibold text-gray-500">Outros</span>
              </div>
              <ul className="divide-y divide-gray-50">
                {uncategorized.map((video) => (
                  <VideoRow key={video.id} video={video} />
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
