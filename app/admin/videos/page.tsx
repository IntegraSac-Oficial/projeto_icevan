import { getVehicleRegistry } from "@/lib/applications";
import VideosPageClient from "./VideosPageClient";

export const dynamic = "force-dynamic";

export default async function VideosPage() {
  // Busca veículos dinâmicos do banco
  const vehicleRegistry = await getVehicleRegistry();
  
  // Gera lista de categorias: veículos dinâmicos + categorias fixas
  const vehicleCategories = vehicleRegistry.map((v) => v.label);
  const fixedCategories = ["Manutenção", "Outro"];
  const allCategories = [...vehicleCategories, ...fixedCategories];
  
  return <VideosPageClient categorias={allCategories} />;
}
