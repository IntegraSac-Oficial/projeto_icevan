import Link from "next/link";
import {
  MessageSquare,
  ImageIcon,
  Search,
  BellDot,
  ArrowRight,
  Clock,
} from "lucide-react";
import { prisma } from "@/lib/db";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

async function getStats() {
  try {
    const [totalContacts, unreadContacts, seoCount] = await Promise.all([
      prisma.contact.count(),
      prisma.contact.count({ where: { lido: false } }),
      prisma.seoSetting.count(),
    ]);

    const recentContacts = await prisma.contact.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
    });

    return { totalContacts, unreadContacts, seoCount, recentContacts };
  } catch {
    return {
      totalContacts: 0,
      unreadContacts: 0,
      seoCount: 0,
      recentContacts: [],
    };
  }
}

export default async function AdminDashboard() {
  const { totalContacts, unreadContacts, seoCount, recentContacts } =
    await getStats();

  const stats = [
    {
      label: "Total de Contatos",
      value: totalContacts,
      icon: MessageSquare,
      iconBg: "bg-primary/10",
      iconColor: "text-primary",
      href: "/admin/contatos",
    },
    {
      label: "Não Lidos",
      value: unreadContacts,
      icon: BellDot,
      iconBg: "bg-destructive/10",
      iconColor: "text-destructive",
      href: "/admin/contatos",
    },
    {
      label: "Páginas com SEO",
      value: seoCount,
      icon: Search,
      iconBg: "bg-accent/20",
      iconColor: "text-accent-foreground",
      href: "/admin/seo",
    },
    {
      label: "Gerenciar Imagens",
      value: "→",
      icon: ImageIcon,
      iconBg: "bg-secondary",
      iconColor: "text-primary",
      href: "/admin/imagens",
    },
  ];

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Título */}
      <div>
        <h1 className="text-2xl font-heading font-bold text-foreground">
          Dashboard
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Visão geral do site Ice Van
        </p>
      </div>

      {/* Cards de stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link key={stat.label} href={stat.href} className="block group">
              <Card className="hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
                <CardHeader className="pb-2 flex flex-row items-start justify-between space-y-0">
                  <CardDescription>{stat.label}</CardDescription>
                  <div className={`p-1.5 ${stat.iconBg} rounded-md`}>
                    <Icon className={`size-4 ${stat.iconColor}`} />
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-3xl font-bold text-foreground">
                    {stat.value}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                    Ver detalhes
                    <ArrowRight className="size-3 group-hover:translate-x-0.5 transition-transform" />
                  </p>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Contatos recentes */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-0 border-b border-border">
          <CardTitle className="text-base font-semibold">
            Contatos Recentes
          </CardTitle>
          <Link
            href="/admin/contatos"
            className="text-sm text-primary hover:text-primary/80
                       font-medium flex items-center gap-1 transition-colors"
          >
            Ver todos
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </CardHeader>
        <CardContent className="pt-0">
          {recentContacts.length === 0 ? (
            <div className="py-10 text-center text-muted-foreground">
              <MessageSquare className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="text-sm">Nenhum contato recebido ainda.</p>
              <p className="text-xs mt-1">
                Os contatos do formulário aparecerão aqui.
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-border">
              {recentContacts.map((contact) => (
                <li key={contact.id} className="py-3.5 flex items-center gap-4">
                  <div
                    className={`w-2 h-2 rounded-full flex-shrink-0 ${
                      contact.lido ? "bg-border" : "bg-accent"
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground text-sm truncate">
                      {contact.nome}
                      {contact.empresa && (
                        <span className="text-muted-foreground font-normal">
                          {" "}
                          — {contact.empresa}
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {contact.tipoVeiculo} · {contact.telefone}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground flex-shrink-0">
                    <Clock className="w-3 h-3" />
                    {new Date(contact.createdAt).toLocaleDateString("pt-BR")}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      {/* Links rápidos */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { href: "/admin/galeria", label: "Gerenciar Galeria" },
          { href: "/admin/videos",  label: "Gerenciar Vídeos" },
          { href: "/admin/seo",     label: "Configurar SEO" },
        ].map((link) => (
          <Link key={link.href} href={link.href} className="block group">
            <Card className="hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
              <CardContent className="py-3.5 flex items-center justify-between">
                <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                  {link.label}
                </span>
                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
