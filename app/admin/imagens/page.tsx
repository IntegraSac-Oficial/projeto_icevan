"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Image from "next/image";
import {
  Upload,
  Trash2,
  Loader2,
  ImageIcon,
  CheckCircle,
  AlertCircle,
  FolderOpen,
  Tag,
  RefreshCw,
  Edit3,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Definição de pastas com grupos e labels de slot ─────────────────────────

interface FolderDef {
  value: string;
  label: string;
  slotLabels: string[];
  genericSuffix: string;
  recommendedSize?: string;
  description?: string;
}

interface FolderGroup {
  group: string;
  folders: FolderDef[];
}

const FOLDER_GROUPS: FolderGroup[] = [
  {
    group: "Veículos",
    folders: [
      {
        value: "images/aplicacoes/fiorinos",
        label: "Fiorino",
        slotLabels: [
          "Thumbnail (card do veículo)",
          "Galeria — Foto 1",
          "Galeria — Foto 2",
          "Galeria — Foto 3",
          "Galeria — Foto 4",
          "Galeria — Foto 5",
        ],
        genericSuffix: "Galeria — Foto",
        recommendedSize: "800×600px (thumbnail) | 1200×900px (galeria)",
        description: "Thumbnail aparece no card da página /aplicacoes. Fotos da galeria aparecem na página de detalhe.",
      },
      {
        value: "images/aplicacoes/van-ducato",
        label: "Van Ducato",
        slotLabels: [
          "Thumbnail (card do veículo)",
          "Galeria — Foto 1",
          "Galeria — Foto 2",
          "Galeria — Foto 3",
          "Galeria — Foto 4",
        ],
        genericSuffix: "Galeria — Foto",
        recommendedSize: "800×600px (thumbnail) | 1200×900px (galeria)",
        description: "Thumbnail aparece no card da página /aplicacoes. Fotos da galeria aparecem na página de detalhe.",
      },
      {
        value: "images/aplicacoes/van-sprinter",
        label: "Van Sprinter",
        slotLabels: [
          "Thumbnail (card do veículo)",
          "Galeria — Foto 1",
          "Galeria — Foto 2",
          "Galeria — Foto 3",
          "Galeria — Foto 4",
        ],
        genericSuffix: "Galeria — Foto",
        recommendedSize: "800×600px (thumbnail) | 1200×900px (galeria)",
        description: "Thumbnail aparece no card da página /aplicacoes. Fotos da galeria aparecem na página de detalhe.",
      },
      {
        value: "images/aplicacoes/van-master",
        label: "Van Master",
        slotLabels: [
          "Thumbnail (card do veículo)",
          "Galeria — Foto 1",
          "Galeria — Foto 2",
          "Galeria — Foto 3",
          "Galeria — Foto 4",
        ],
        genericSuffix: "Galeria — Foto",
        recommendedSize: "800×600px (thumbnail) | 1200×900px (galeria)",
        description: "Thumbnail aparece no card da página /aplicacoes. Fotos da galeria aparecem na página de detalhe.",
      },
      {
        value: "images/aplicacoes/expert-porta-frigorifica",
        label: "Expert c/ Porta",
        slotLabels: [
          "Thumbnail (card do veículo)",
          "Galeria — Foto 1",
          "Galeria — Foto 2",
          "Galeria — Foto 3",
        ],
        genericSuffix: "Galeria — Foto",
        recommendedSize: "800×600px (thumbnail) | 1200×900px (galeria)",
        description: "Thumbnail aparece no card da página /aplicacoes. Fotos da galeria aparecem na página de detalhe.",
      },
      {
        value: "images/aplicacoes/fiorino-porta-frigorifica",
        label: "Fiorino c/ Porta",
        slotLabels: [
          "Thumbnail (card do veículo)",
          "Galeria — Foto 1",
          "Galeria — Foto 2",
          "Galeria — Foto 3",
        ],
        genericSuffix: "Galeria — Foto",
        recommendedSize: "800×600px (thumbnail) | 1200×900px (galeria)",
        description: "Thumbnail aparece no card da página /aplicacoes. Fotos da galeria aparecem na página de detalhe.",
      },
    ],
  },
  {
    group: "Site",
    folders: [
      {
        value: "images/fotos-servicos",
        label: "Fotos de Serviços",
        slotLabels: [
          "Foto 1",
          "Foto 2",
          "Foto 3",
          "Foto 4",
          "Foto 5",
          "Foto 6",
          "Foto 7",
          "Foto 8",
          "Foto 9",
          "Foto 10",
        ],
        genericSuffix: "Foto",
        recommendedSize: "1200×900px ou 1000×1000px",
        description: "Galeria de fotos da página /fotos-servicos. Aceita qualquer quantidade de imagens.",
      },
      {
        value: "images/empresa",
        label: "Empresa",
        slotLabels: [
          "Nosso Escritório (imagem superior)",
          "Nossos Diferenciais (imagem inferior)",
          "Foto 3",
          "Foto 4",
          "Foto 5",
        ],
        genericSuffix: "Foto",
        recommendedSize: "1200×800px",
        description: "Primeira imagem: Nosso Escritório (aparece no topo). Segunda imagem: Nossos Diferenciais (aparece abaixo).",
      },
      {
        value: "images/formas-pagamento",
        label: "Formas de Pagamento",
        slotLabels: ["Imagem de Formas de Pagamento"],
        genericSuffix: "Formas de Pagamento",
        recommendedSize: "1200×400px ou similar",
        description: "Imagem mostrando as formas de pagamento aceitas. Aparece no rodapé do site.",
      },
      {
        value: "images/og",
        label: "OG Image",
        slotLabels: ["OG Image (compartilhamento social)"],
        genericSuffix: "OG Image",
        recommendedSize: "1200×630px (exato)",
        description: "Imagem de compartilhamento para redes sociais (Facebook, WhatsApp, LinkedIn). Tamanho fixo recomendado.",
      },
    ],
  },
];

const ALL_FOLDERS = FOLDER_GROUPS.flatMap((g) => g.folders);

function getSlotLabel(folder: FolderDef, index: number): string {
  if (index < folder.slotLabels.length) return folder.slotLabels[index];
  const extra = index - folder.slotLabels.length + 1;
  return `${folder.genericSuffix} ${folder.slotLabels.length + extra}`;
}

interface ImageFile {
  filename: string;
  url: string;
  folder: string;
  timestamp?: number; // Para cache-busting
}

export default function ImagensPage() {
  const [activeFolder, setActiveFolder] = useState(ALL_FOLDERS[0].value);
  const [images, setImages] = useState<ImageFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<"idle" | "success" | "error">("idle");
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Para substituição direta de slot
  const replaceInputRef = useRef<HTMLInputElement>(null);
  const [replaceTarget, setReplaceTarget] = useState<ImageFile | null>(null);
  
  // Para renomear arquivo
  const [renameTarget, setRenameTarget] = useState<ImageFile | null>(null);
  const [newFilename, setNewFilename] = useState("");
  
  // Para editar banner (título e descrição)
  const [editBannerTarget, setEditBannerTarget] = useState<ImageFile | null>(null);
  const [bannerTitulo, setBannerTitulo] = useState("");
  const [bannerDescricao, setBannerDescricao] = useState("");

  const folderDef = ALL_FOLDERS.find((f) => f.value === activeFolder)!;

  const fetchImages = useCallback(async (folder: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/images?folder=${encodeURIComponent(folder)}`);
      const data = await res.json();
      setImages(data.images ?? []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchImages(activeFolder);
  }, [activeFolder, fetchImages]);

  const uploadFile = async (file: File, saveas?: string) => {
    setUploading(true);
    setUploadStatus("idle");
    
    console.log('');
    console.log('═══════════════════════════════════════════════════════════');
    console.log('📤 UPLOAD DE IMAGEM INICIADO');
    console.log('═══════════════════════════════════════════════════════════');
    console.log('📄 Arquivo:', file.name);
    console.log('📁 Pasta:', activeFolder);
    console.log('');
    
    try {
      let finalFilename = saveas;
      
      // Se não foi especificado um nome (upload normal, não substituição)
      if (!saveas) {
        console.log('───────────────────────────────────────────────────────────');
        console.log('MODO: Upload Normal (adicionar nova imagem)');
        console.log('───────────────────────────────────────────────────────────');
        
        // Pega a extensão do arquivo
        const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
        
        // Remove extensão do nome
        const nameWithoutExt = file.name.replace(/\.[^/.]+$/, '');
        
        // Remove qualquer prefixo numérico existente
        const cleanName = nameWithoutExt.replace(/^\d+-/, '');
        
        // Encontra o próximo número disponível
        const nextNumber = images.length + 1;
        const prefix = String(nextNumber).padStart(2, '0');
        
        finalFilename = `${prefix}-${cleanName}.${ext}`;
        
        console.log('📊 Imagens existentes:', images.length);
        console.log('🔢 Próximo número:', nextNumber);
        console.log('📝 Prefixo:', prefix + '-');
        console.log('🧹 Nome limpo:', cleanName);
        console.log('📎 Extensão:', ext);
        console.log('📄 Nome final:', finalFilename);
        console.log('');
      } else {
        console.log('───────────────────────────────────────────────────────────');
        console.log('MODO: Substituição (manter posição)');
        console.log('───────────────────────────────────────────────────────────');
        console.log('📄 Nome especificado:', saveas);
        console.log('');
      }
      
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", activeFolder);
      if (finalFilename) {
        formData.append("saveas", finalFilename);
      }
      
      console.log('🌐 Enviando para API...');
      const res = await fetch("/api/admin/images", { method: "POST", body: formData });
      
      if (res.ok) {
        const data = await res.json();
        console.log('');
        console.log('✅✅✅ UPLOAD BEM-SUCEDIDO! ✅✅✅');
        console.log('🌐 URL:', data.url);
        console.log('📄 Arquivo salvo:', data.filename);
        console.log('═══════════════════════════════════════════════════════════');
        console.log('');
        
        setUploadStatus("success");
        // Atualiza a lista de imagens com o novo timestamp
        await fetchImages(activeFolder);
        setTimeout(() => setUploadStatus("idle"), 3000);
      } else {
        console.error('');
        console.error('❌ ERRO NO UPLOAD');
        console.error('Status:', res.status);
        console.error('═══════════════════════════════════════════════════════════');
        console.error('');
        setUploadStatus("error");
      }
    } catch (error) {
      console.error('');
      console.error('❌❌❌ ERRO GERAL NO UPLOAD ❌❌❌');
      console.error('Erro:', error);
      console.error('═══════════════════════════════════════════════════════════');
      console.error('');
      setUploadStatus("error");
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) uploadFile(file);
  };

  // Substituir um slot específico: envia com saveas = nome do arquivo original
  const handleReplaceClick = (e: React.MouseEvent, img: ImageFile) => {
    e.stopPropagation(); // Evita propagar o clique para o container pai
    setReplaceTarget(img);
    replaceInputRef.current?.click();
  };

  const handleReplaceFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || !replaceTarget) return;
    
    console.log('');
    console.log('═══════════════════════════════════════════════════════════');
    console.log('🔄 SUBSTITUIÇÃO DE IMAGEM INICIADA');
    console.log('═══════════════════════════════════════════════════════════');
    console.log('📁 Pasta:', activeFolder);
    console.log('🗑️  Arquivo antigo:', replaceTarget.filename);
    console.log('📤 Arquivo novo:', file.name, '(' + (file.size / 1024).toFixed(2) + ' KB)');
    console.log('');
    
    setUploading(true);
    setUploadStatus("idle");
    
    try {
      // 1. DELETAR arquivo antigo PRIMEIRO
      console.log('───────────────────────────────────────────────────────────');
      console.log('ETAPA 1/4: Deletando arquivo antigo');
      console.log('───────────────────────────────────────────────────────────');
      const deleteUrl = `/api/admin/images/${encodeURIComponent(replaceTarget.filename)}?folder=${encodeURIComponent(activeFolder)}`;
      console.log('🌐 URL DELETE:', deleteUrl);
      
      const deleteRes = await fetch(deleteUrl, { method: "DELETE" });
      const deleteData = await deleteRes.json();
      
      console.log('📥 Status HTTP:', deleteRes.status, deleteRes.ok ? '✅' : '❌');
      console.log('📥 Resposta:', JSON.stringify(deleteData, null, 2));
      
      if (!deleteRes.ok || !deleteData.ok) {
        console.error('');
        console.error('❌❌❌ ERRO AO DELETAR ARQUIVO ANTIGO ❌❌❌');
        console.error('Status:', deleteRes.status);
        console.error('Dados:', deleteData);
        console.error('');
        alert('Erro ao deletar arquivo antigo. Verifique o console para detalhes.');
        setUploadStatus("error");
        return;
      }
      
      console.log('✅ Arquivo antigo DELETADO com sucesso!');
      console.log('');
      
      // Aguarda 500ms para garantir que o arquivo foi deletado
      console.log('⏳ Aguardando 500ms para garantir deleção...');
      await new Promise(resolve => setTimeout(resolve, 500));
      console.log('✅ Aguardo concluído');
      console.log('');
      
      // 2. Encontrar a POSIÇÃO do arquivo antigo na lista
      console.log('───────────────────────────────────────────────────────────');
      console.log('ETAPA 2/4: Encontrando posição do arquivo na lista');
      console.log('───────────────────────────────────────────────────────────');
      console.log('📋 Lista atual de imagens:', images.map(img => img.filename).join(', '));
      
      const oldIndex = images.findIndex(img => img.filename === replaceTarget.filename);
      console.log('📍 Posição encontrada:', oldIndex, '(índice base-0)');
      console.log('📍 Posição visual:', oldIndex + 1, '(número que o usuário vê)');
      console.log('');
      
      // 3. Construir novo nome MANTENDO A POSIÇÃO
      console.log('───────────────────────────────────────────────────────────');
      console.log('ETAPA 3/4: Construindo novo nome mantendo posição');
      console.log('───────────────────────────────────────────────────────────');
      
      // Pega a extensão do arquivo novo
      const newExt = file.name.split('.').pop()?.toLowerCase() || 'jpg';
      console.log('📎 Extensão do arquivo novo:', newExt);
      
      // Remove extensão do nome novo
      const newNameWithoutExt = file.name.replace(/\.[^/.]+$/, '');
      console.log('📝 Nome sem extensão:', newNameWithoutExt);
      
      // Remove qualquer prefixo numérico que o arquivo novo possa ter
      const cleanNewName = newNameWithoutExt.replace(/^\d+-/, '');
      console.log('🧹 Nome limpo (sem prefixo):', cleanNewName);
      
      // Cria o novo nome com o prefixo da posição (01-, 02-, 03-...)
      const positionPrefix = String(oldIndex + 1).padStart(2, '0');
      const newFilename = `${positionPrefix}-${cleanNewName}.${newExt}`;
      
      console.log('🔢 Prefixo de posição:', positionPrefix + '-');
      console.log('📄 Nome final completo:', newFilename);
      console.log('');
      
      // 4. Fazer upload do novo arquivo
      console.log('───────────────────────────────────────────────────────────');
      console.log('ETAPA 4/4: Fazendo upload do novo arquivo');
      console.log('───────────────────────────────────────────────────────────');
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", activeFolder);
      formData.append("saveas", newFilename);
      
      console.log('📦 FormData preparado:');
      console.log('   - file:', file.name);
      console.log('   - folder:', activeFolder);
      console.log('   - saveas:', newFilename);
      console.log('');
      console.log('🌐 Enviando POST para /api/admin/images...');
      
      const uploadRes = await fetch("/api/admin/images", { method: "POST", body: formData });
      const uploadData = await uploadRes.json();
      
      console.log('📥 Status HTTP:', uploadRes.status, uploadRes.ok ? '✅' : '❌');
      console.log('📥 Resposta:', JSON.stringify(uploadData, null, 2));
      console.log('');
      
      if (uploadRes.ok && uploadData.ok) {
        console.log('═══════════════════════════════════════════════════════════');
        console.log('✅✅✅ SUBSTITUIÇÃO CONCLUÍDA COM SUCESSO! ✅✅✅');
        console.log('═══════════════════════════════════════════════════════════');
        console.log('🗑️  Arquivo deletado:', replaceTarget.filename);
        console.log('📤 Arquivo criado:', newFilename);
        console.log('📍 Posição mantida:', oldIndex + 1);
        console.log('🌐 URL:', uploadData.url);
        console.log('═══════════════════════════════════════════════════════════');
        console.log('');
        
        setUploadStatus("success");
        await new Promise(resolve => setTimeout(resolve, 500));
        await fetchImages(activeFolder);
        setTimeout(() => setUploadStatus("idle"), 3000);
      } else {
        console.error('');
        console.error('❌❌❌ ERRO NO UPLOAD DO NOVO ARQUIVO ❌❌❌');
        console.error('Status:', uploadRes.status);
        console.error('Dados:', uploadData);
        console.error('');
        alert('Erro ao fazer upload do novo arquivo. Verifique o console para detalhes.');
        setUploadStatus("error");
      }
    } catch (error) {
      console.error('');
      console.error('❌❌❌ ERRO GERAL AO SUBSTITUIR ❌❌❌');
      console.error('Tipo:', error instanceof Error ? error.name : typeof error);
      console.error('Mensagem:', error instanceof Error ? error.message : String(error));
      console.error('Stack:', error instanceof Error ? error.stack : 'N/A');
      console.error('');
      alert('Erro ao substituir imagem. Verifique o console para detalhes.');
      setUploadStatus("error");
    } finally {
      setUploading(false);
      setReplaceTarget(null);
    }
  };

  const deleteImage = async (img: ImageFile) => {
    if (!confirm(`Deletar "${img.filename}"?`)) return;
    await fetch(
      `/api/admin/images/${encodeURIComponent(img.filename)}?folder=${encodeURIComponent(img.folder)}`,
      { method: "DELETE" }
    );
    setImages((prev) => prev.filter((i) => i.filename !== img.filename));
  };

  const moveImage = async (index: number, direction: "up" | "down") => {
    const newImages = [...images];
    const swapIndex = direction === "up" ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= newImages.length) return;

    // Troca as posições no array local
    [newImages[index], newImages[swapIndex]] = [newImages[swapIndex], newImages[index]];
    setImages(newImages);

    // Renomeia os arquivos para refletir a nova ordem
    try {
      const img1 = newImages[index];
      const img2 = newImages[swapIndex];

      // Gera novos nomes com os prefixos corretos
      const getNewFilename = (originalFilename: string, newIndex: number) => {
        const ext = originalFilename.split('.').pop()?.toLowerCase() || 'jpg';
        const nameWithoutExt = originalFilename.replace(/\.[^/.]+$/, '');
        const cleanName = nameWithoutExt.replace(/^\d+-/, '');
        const prefix = String(newIndex + 1).padStart(2, '0');
        return `${prefix}-${cleanName}.${ext}`;
      };

      const newFilename1 = getNewFilename(img1.filename, index);
      const newFilename2 = getNewFilename(img2.filename, swapIndex);

      // Renomeia os arquivos via API
      await Promise.all([
        fetch(`/api/admin/images/rename`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            folder: activeFolder,
            oldFilename: img1.filename,
            newFilename: newFilename1,
          }),
        }),
        fetch(`/api/admin/images/rename`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            folder: activeFolder,
            oldFilename: img2.filename,
            newFilename: newFilename2,
          }),
        }),
      ]);

      // Recarrega a lista para refletir as mudanças
      await fetchImages(activeFolder);
    } catch (error) {
      console.error("Erro ao reordenar imagens:", error);
      // Reverte o estado local em caso de erro
      await fetchImages(activeFolder);
    }
  };
  
  const handleRename = async () => {
    if (!renameTarget || !newFilename.trim()) return;
    
    try {
      const res = await fetch(`/api/admin/images/rename`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          folder: activeFolder,
          oldFilename: renameTarget.filename,
          newFilename: newFilename.trim(),
        }),
      });
      
      if (res.ok) {
        await fetchImages(activeFolder);
        setRenameTarget(null);
        setNewFilename("");
      } else {
        alert("Erro ao renomear arquivo");
      }
    } catch {
      alert("Erro ao renomear arquivo");
    }
  };

  return (
    <div className="max-w-6xl space-y-5">
      {/* Cabeçalho */}
      <div>
        <h1 className="text-2xl font-heading font-bold text-brand-primary">
          Gerenciar Imagens
        </h1>
        <p className="text-gray-500 text-sm mt-0.5">
          Selecione a seção do site para ver e gerenciar as imagens correspondentes
        </p>
      </div>

      <div className="flex gap-5">
        {/* ── Sidebar de pastas ── */}
        <aside className="w-52 flex-shrink-0 space-y-4">
          {FOLDER_GROUPS.map((grp) => (
            <div key={grp.group}>
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 px-2 mb-1">
                {grp.group}
              </p>
              <ul className="space-y-0.5">
                {grp.folders.map((f) => (
                  <li key={f.value}>
                    <button
                      onClick={() => setActiveFolder(f.value)}
                      className={cn(
                        "w-full text-left flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all",
                        activeFolder === f.value
                          ? "bg-brand-primary text-white"
                          : "text-gray-600 hover:bg-gray-100 hover:text-brand-primary"
                      )}
                    >
                      <FolderOpen className="w-3.5 h-3.5 flex-shrink-0" />
                      {f.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </aside>

        {/* ── Área principal ── */}
        <div className="flex-1 min-w-0 space-y-4">
          {/* Card de informações sobre tamanhos recomendados */}
          {folderDef.recommendedSize && (
            <div className="bg-gradient-to-r from-brand-primary/5 to-brand-secondary/5 border border-brand-primary/10 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-brand-primary/10 rounded-lg flex-shrink-0">
                  <ImageIcon className="w-5 h-5 text-brand-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold text-brand-primary mb-1">
                    Tamanho Recomendado
                  </h3>
                  <p className="text-sm font-semibold text-brand-secondary mb-1">
                    {folderDef.recommendedSize}
                  </p>
                  {folderDef.description && (
                    <p className="text-xs text-gray-600 leading-relaxed">
                      {folderDef.description}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {/* Aviso sobre Upload vs Substituição */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <p className="text-xs font-bold text-blue-700 mb-2">
              📌 Como funciona:
            </p>
            <div className="text-xs text-blue-600 space-y-2">
              <p>
                <strong>Upload Novo:</strong> Arraste ou clique na área acima. O sistema vai:
              </p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Adicionar automaticamente o prefixo numérico (01-, 02-, 03-...)</li>
                <li>Colocar a imagem na próxima posição disponível</li>
                <li>Manter a ordem alfabética (01- é sempre thumbnail, 02+ é galeria)</li>
              </ul>
              <p className="mt-2">
                <strong>Substituir (↻):</strong> Clique no ícone ↻ de uma imagem. O sistema vai:
              </p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>DELETAR o arquivo antigo</li>
                <li>SALVAR o novo arquivo com NOVO NOME</li>
                <li>MANTER A MESMA POSIÇÃO na lista (usando o mesmo prefixo)</li>
              </ul>
              <p className="text-amber-600 mt-2">
                💡 Exemplo Upload: Você adiciona &quot;van03.webp&quot; → Sistema salva como &quot;03-van03.webp&quot; (posição 3)
              </p>
              <p className="text-amber-600">
                💡 Exemplo Substituição: Você substitui &quot;01-thumb.jpg&quot; com &quot;nova.webp&quot; → Resultado: &quot;01-nova.webp&quot; (mantém posição 1)
              </p>
              <p className="text-xs text-gray-500 mt-2">
                ✅ A primeira imagem (01-) é sempre a thumbnail do card<br/>
                ✅ As demais (02-, 03-...) aparecem na galeria na ordem
              </p>
            </div>
          </div>

          {/* Upload normal (drag & drop) */}
          <div
            className={cn(
              "border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all",
              dragOver
                ? "border-brand-secondary bg-brand-secondary/5"
                : "border-gray-200 hover:border-brand-secondary hover:bg-gray-50"
            )}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={(e) => {
              // Só abre o file picker se clicar diretamente na área, não em botões filhos
              if (e.target === e.currentTarget || (e.target as HTMLElement).closest('.upload-trigger')) {
                fileInputRef.current?.click();
              }
            }}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".jpg,.jpeg,.png,.webp,.svg,.gif"
              onChange={handleFileChange}
              className="hidden"
            />
            {/* Input oculto para substituição de slot */}
            <input
              ref={replaceInputRef}
              type="file"
              accept=".jpg,.jpeg,.png,.webp,.svg,.gif"
              onChange={handleReplaceFileChange}
              className="hidden"
            />
            {uploading ? (
              <div className="flex items-center justify-center gap-2 text-brand-secondary upload-trigger">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="text-sm font-medium">
                  {replaceTarget ? `Substituindo ${replaceTarget.filename}...` : "Enviando imagem..."}
                </span>
              </div>
            ) : uploadStatus === "success" ? (
              <div className="flex flex-col items-center justify-center gap-2 text-green-600 upload-trigger">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  <span className="text-sm font-medium">
                    {replaceTarget ? "Imagem substituída com sucesso!" : "Upload realizado com sucesso!"}
                  </span>
                </div>
                <span className="text-xs text-amber-600">
                  Pressione Ctrl+Shift+R no site para ver a atualização
                </span>
              </div>
            ) : uploadStatus === "error" ? (
              <div className="flex items-center justify-center gap-2 text-red-500 upload-trigger">
                <AlertCircle className="w-5 h-5" />
                <span className="text-sm font-medium">Erro no upload. Tente novamente.</span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-3 text-gray-500 upload-trigger">
                <Upload className="w-5 h-5 text-brand-secondary flex-shrink-0" />
                <span className="text-sm">
                  Clique ou arraste para{" "}
                  <strong className="text-brand-secondary">{folderDef.label}</strong>
                </span>
                <span className="text-xs text-gray-400 border-l border-gray-200 pl-3">
                  JPG, PNG, WebP, SVG — máx. 10 MB
                </span>
              </div>
            )}
          </div>

          {/* Lista com slots nomeados */}
          <div className="bg-white rounded-xl shadow-card overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-semibold text-brand-primary text-sm">
                {folderDef.label}
              </h2>
              <span className="text-xs text-gray-400">
                {images.length} {images.length === 1 ? "imagem" : "imagens"}
              </span>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-14 text-gray-400">
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                Carregando...
              </div>
            ) : images.length === 0 ? (
              <div className="py-14 text-center text-gray-400">
                <ImageIcon className="w-10 h-10 mx-auto mb-3 opacity-25" />
                <p className="text-sm">Nenhuma imagem nesta seção.</p>
                <p className="text-xs mt-1">Faça upload acima para adicionar.</p>
              </div>
            ) : (
              <ul className="divide-y divide-gray-50">
                {images.map((img, idx) => {
                  const slotLabel = getSlotLabel(folderDef, idx);
                  const isFirst = idx === 0;
                  return (
                    <li
                      key={img.filename}
                      className="flex items-center gap-4 px-4 py-3 hover:bg-gray-50 transition-colors"
                    >
                      {/* Preview */}
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-200">
                        <Image
                          src={`${img.url}?t=${img.timestamp || Date.now()}`}
                          alt={img.filename}
                          fill
                          className="object-cover"
                          sizes="64px"
                          unoptimized
                          key={`${img.filename}-${img.timestamp || Date.now()}`}
                        />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className={cn(
                              "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold",
                              isFirst
                                ? "bg-brand-accent/10 text-brand-accent"
                                : "bg-brand-secondary/10 text-brand-secondary"
                            )}
                          >
                            <Tag className="w-3 h-3" />
                            {slotLabel}
                          </span>
                          <span className="text-xs text-gray-300">#{idx + 1}</span>
                        </div>
                        <p className="text-sm font-medium text-gray-700 truncate">
                          {img.filename}
                        </p>
                        <p className="text-xs text-gray-400 truncate">{img.url}</p>
                      </div>

                      {/* Ações */}
                      <div className="flex items-center gap-1 flex-shrink-0">
                        {/* Botões de reordenação */}
                        <button
                          onClick={() => moveImage(idx, "up")}
                          disabled={idx === 0}
                          title="Mover para cima"
                          className="p-1.5 text-gray-400 hover:text-brand-primary hover:bg-gray-100 rounded-lg disabled:opacity-30"
                        >
                          <ChevronUp className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => moveImage(idx, "down")}
                          disabled={idx === images.length - 1}
                          title="Mover para baixo"
                          className="p-1.5 text-gray-400 hover:text-brand-primary hover:bg-gray-100 rounded-lg disabled:opacity-30"
                        >
                          <ChevronDown className="w-4 h-4" />
                        </button>
                        {/* Botão Editar - apenas para Banner Hero */}
                        {activeFolder === "images/hero" && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditBannerTarget(img);
                              setBannerTitulo("");
                              setBannerDescricao("");
                            }}
                            className="p-2 text-gray-300 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all"
                            title="Editar título e descrição do banner"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={(e) => handleReplaceClick(e, img)}
                          className="p-2 text-gray-300 hover:text-brand-secondary hover:bg-brand-secondary/10 rounded-lg transition-all"
                          title="Substituir: deleta antigo, salva novo mantendo posição"
                        >
                          <RefreshCw className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteImage(img);
                          }}
                          className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                          title="Deletar imagem"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {/* Aviso sobre cache do navegador */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <p className="text-xs font-bold text-amber-700 mb-2 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              Sobre atualização de imagens
            </p>
            <p className="text-xs text-amber-600 leading-relaxed">
              O sistema tenta atualizar as imagens automaticamente após a substituição. No entanto, 
              em alguns casos o navegador pode ainda mostrar a versão antiga em cache. Se isso acontecer, 
              pressione <strong>Ctrl + Shift + R</strong> (Windows/Linux) ou <strong>Cmd + Shift + R</strong> (Mac) 
              para recarregar sem cache e ver a imagem atualizada.
            </p>
          </div>
        </div>
      </div>

      {/* Modal de Edição de Banner */}
      {editBannerTarget && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">Editar Banner</h3>
              <p className="text-sm text-gray-500 mt-1">{editBannerTarget.filename}</p>
            </div>

            {/* Preview da imagem */}
            <div className="p-6 border-b border-gray-200">
              <div className="relative w-full h-48 rounded-lg overflow-hidden bg-gray-100">
                <Image
                  src={editBannerTarget.url}
                  alt="Preview do banner"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            {/* Formulário */}
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Título do Banner
                </label>
                <input
                  type="text"
                  value={bannerTitulo}
                  onChange={(e) => setBannerTitulo(e.target.value)}
                  placeholder="Ex: Sistemas de Refrigeração para Transporte"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descrição do Banner
                </label>
                <textarea
                  value={bannerDescricao}
                  onChange={(e) => setBannerDescricao(e.target.value)}
                  placeholder="Ex: Qualidade e eficiência para conservar sua carga perecível..."
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent resize-none"
                />
              </div>
            </div>

            {/* Ações */}
            <div className="p-6 border-t border-gray-200 flex gap-3">
              <button
                onClick={async () => {
                  try {
                    const res = await fetch("/api/admin/hero-banners", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        filename: editBannerTarget.filename,
                        titulo: bannerTitulo,
                        descricao: bannerDescricao,
                      }),
                    });
                    
                    if (res.ok) {
                      alert("Banner atualizado com sucesso!");
                      setEditBannerTarget(null);
                      setBannerTitulo("");
                      setBannerDescricao("");
                    } else {
                      alert("Erro ao salvar banner");
                    }
                  } catch (error) {
                    console.error("Erro ao salvar banner:", error);
                    alert("Erro ao salvar banner");
                  }
                }}
                className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                ✓ Salvar
              </button>
              <button
                onClick={() => {
                  setEditBannerTarget(null);
                  setBannerTitulo("");
                  setBannerDescricao("");
                }}
                className="flex-1 bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors font-medium"
              >
                × Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
