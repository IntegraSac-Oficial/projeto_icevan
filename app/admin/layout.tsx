"use client";

import { usePathname } from "next/navigation";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Separator } from "@/components/ui/separator";

const navItems = [
  { href: "/admin",               label: "Dashboard",     exact: true },
  { href: "/admin/contatos",      label: "Contatos" },
  { href: "/admin/imagens",       label: "Imagens" },
  { href: "/admin/banners",       label: "Banners Hero" },
  { href: "/admin/galeria",       label: "Galeria" },
  { href: "/admin/videos",        label: "Vídeos" },
  { href: "/admin/seo",           label: "SEO" },
  { href: "/admin/configuracoes", label: "Configurações" },
];

function getPageTitle(pathname: string) {
  const match = navItems
    .slice()
    .reverse()
    .find((n) =>
      n.exact ? pathname === n.href : pathname.startsWith(n.href)
    );
  return match?.label ?? "Admin";
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Não aplicar layout no login
  if (pathname === "/admin/login") return <>{children}</>;

  const pageTitle = getPageTitle(pathname);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        {/* Topbar */}
        <header className="flex h-14 shrink-0 items-center gap-2 border-b bg-background px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="h-4" />
          <h1 className="text-sm font-semibold text-foreground">{pageTitle}</h1>
        </header>

        {/* Conteúdo da página */}
        <main className="flex-1 p-6 bg-muted/30">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
