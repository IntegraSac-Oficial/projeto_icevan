import { LegendasFotosClient } from "./LegendasFotosClient";
import { getVehicleRegistry } from "@/lib/applications";

export default async function LegendasFotosPage() {
  // Carrega lista de aplicações no servidor
  const registry = await getVehicleRegistry();
  const aplicacoes = registry.map((v) => ({ slug: v.slug, label: v.label }));

  return <LegendasFotosClient aplicacoes={aplicacoes} />;
}
