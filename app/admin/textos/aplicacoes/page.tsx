import Link from "next/link";
import { Car, ChevronRight, Pencil } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { getVehicleRegistry } from "@/lib/applications";

export default async function AplicacoesListPage() {
  const registry = await getVehicleRegistry();

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Aplicações (Veículos)</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Selecione um veículo para editar seus textos e especificações técnicas.
          Para adicionar ou remover veículos, use{" "}
          <Link href="/admin/veiculos" className="underline">Gerenciar Veículos</Link>.
        </p>
      </div>

      <div className="space-y-3">
        {registry.map((v) => (
          <Link key={v.slug} href={`/admin/textos/aplicacoes/${v.slug}`}>
            <Card className="hover:border-primary/50 hover:shadow-sm transition-all cursor-pointer group">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="p-2.5 bg-muted rounded-lg group-hover:bg-primary/10 transition-colors">
                  <Car className="w-5 h-5 text-muted-foreground group-hover:text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm">{v.label}</p>
                  <p className="text-xs text-muted-foreground font-mono">{v.href}</p>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground group-hover:text-primary transition-colors">
                  <Pencil className="w-4 h-4" />
                  <ChevronRight className="w-4 h-4" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
