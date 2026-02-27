"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  LayoutDashboard,
  Image,
  GalleryHorizontalEnd,
  Video,
  MessageSquare,
  Search,
  Settings,
  Megaphone,
  Truck,
  LogOut,
  ExternalLink,
  Paintbrush,
  FileText,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar"

const navMain = [
  { title: "Dashboard", url: "/admin", icon: LayoutDashboard, exact: true },
]

const navContent = [
  { title: "Banners Hero", url: "/admin/banners",  icon: Megaphone },
  { title: "Galeria",      url: "/admin/galeria",  icon: GalleryHorizontalEnd },
  { title: "Imagens",      url: "/admin/imagens",  icon: Image },
  { title: "Vídeos",       url: "/admin/videos",   icon: Video },
  { title: "Veículos",     url: "/admin/veiculos", icon: Truck },
]

const navComm = [
  { title: "Contatos", url: "/admin/contatos", icon: MessageSquare },
]

const navSettings = [
  { title: "Textos do Site", url: "/admin/textos",        icon: FileText },
  { title: "Aparência",      url: "/admin/aparencia",     icon: Paintbrush },
  { title: "SEO",            url: "/admin/seo",           icon: Search },
  { title: "Configurações",  url: "/admin/configuracoes", icon: Settings },
]

function NavItem({
  item,
}: {
  item: { title: string; url: string; icon: React.ElementType; exact?: boolean }
}) {
  const pathname = usePathname()
  const isActive = item.exact
    ? pathname === item.url
    : pathname.startsWith(item.url)

  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild isActive={isActive} tooltip={item.title}>
        <Link href={item.url}>
          <item.icon />
          <span>{item.title}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}

function LogoutButton() {
  const router = useRouter()

  const handleLogout = async () => {
    await fetch("/api/admin/auth/logout", { method: "POST" })
    router.push("/admin/login")
    router.refresh()
  }

  return (
    <SidebarMenuButton
      onClick={handleLogout}
      tooltip="Sair"
      className="text-sidebar-foreground/60 hover:text-destructive hover:bg-destructive/10"
    >
      <LogOut className="size-4" />
      <span>Sair</span>
    </SidebarMenuButton>
  )
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      {/* ── Header ────────────────────────────────────────── */}
      <SidebarHeader className="border-b border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/admin">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Truck className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-bold text-sm">Ice Van</span>
                  <span className="text-xs text-sidebar-foreground/60">Admin Panel</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* ── Content ───────────────────────────────────────── */}
      <SidebarContent>
        {/* Principal */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navMain.map((item) => (
                <NavItem key={item.url} item={item} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        {/* Conteúdo */}
        <SidebarGroup>
          <SidebarGroupLabel>Conteúdo</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navContent.map((item) => (
                <NavItem key={item.url} item={item} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        {/* Comunicação */}
        <SidebarGroup>
          <SidebarGroupLabel>Comunicação</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navComm.map((item) => (
                <NavItem key={item.url} item={item} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        {/* Configurações */}
        <SidebarGroup>
          <SidebarGroupLabel>Configurações</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navSettings.map((item) => (
                <NavItem key={item.url} item={item} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* ── Footer ────────────────────────────────────────── */}
      <SidebarFooter className="border-t border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              tooltip="Ver o site"
              className="text-sidebar-foreground/60 hover:text-sidebar-foreground"
            >
              <a href="/" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="size-4" />
                <span>Ver o site</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <LogoutButton />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
