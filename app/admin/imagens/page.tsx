import { getVehicleRegistry } from "@/lib/applications";
import { ImagensPageClient, type FolderGroup } from "./ImagensPageClient";

export default async function ImagensPage() {
  // Busca veículos dinamicamente do banco
  const registry = await getVehicleRegistry();

  // Gera folders de veículos dinamicamente
  const vehicleFolders = registry.map((v) => ({
    value: `images/aplicacoes/${v.slug}`,
    label: v.label,
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
    description:
      "Thumbnail aparece no card da página /aplicacoes. Fotos da galeria aparecem na página de detalhe.",
  }));

  // Folders do site (hardcoded - não mudam)
  const siteFolders = [
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
      description:
        "Galeria de fotos da página /fotos-servicos. Aceita qualquer quantidade de imagens.",
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
      description:
        "Primeira imagem: Nosso Escritório (aparece no topo). Segunda imagem: Nossos Diferenciais (aparece abaixo).",
    },
    {
      value: "images/formas-pagamento",
      label: "Formas de Pagamento",
      slotLabels: ["Imagem de Formas de Pagamento"],
      genericSuffix: "Formas de Pagamento",
      recommendedSize: "1200×400px ou similar",
      description:
        "Imagem mostrando as formas de pagamento aceitas. Aparece no rodapé do site.",
    },
    {
      value: "images/og",
      label: "OG Image",
      slotLabels: ["OG Image (compartilhamento social)"],
      genericSuffix: "OG Image",
      recommendedSize: "1200×630px (exato)",
      description:
        "Imagem de compartilhamento para redes sociais (Facebook, WhatsApp, LinkedIn). Tamanho fixo recomendado.",
    },
  ];

  // Monta os grupos de pastas
  const folderGroups: FolderGroup[] = [
    { group: "Veículos", folders: vehicleFolders },
    { group: "Site", folders: siteFolders },
  ];

  return <ImagensPageClient folderGroups={folderGroups} />;
}
