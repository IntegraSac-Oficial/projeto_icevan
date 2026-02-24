"use client"

import * as React from "react"
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
  PanelLeft,
  ChevronRight,
  Bell,
  Home,
  Users,
  BarChart3,
  FileText,
  Shield,
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
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarInset,
  SidebarTrigger,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

/* ================================================================
   ICE VAN — Admin Sidebar Showcase
   Aesthetic: Industrial-precision logistics dashboard
   EOS Design System · Blue Iris palette · Plus Jakarta Sans
   ================================================================ */

const navMain = [
  { title: "Dashboard", icon: LayoutDashboard, active: true },
  { title: "Analytics", icon: BarChart3 },
]

const navContent = [
  { title: "Banners", icon: Megaphone },
  { title: "Galeria", icon: GalleryHorizontalEnd },
  { title: "Imagens", icon: Image },
  { title: "Vídeos", icon: Video },
]

const navComm = [
  { title: "Contatos", icon: MessageSquare, badge: "5" },
  { title: "Usuários", icon: Users },
]

const navSettings = [
  { title: "SEO", icon: Search },
  { title: "Configurações", icon: Settings },
  { title: "Segurança", icon: Shield },
]

/* ── Mini Sidebar Preview (static, no provider needed) ────── */
function SidebarPreview({
  collapsed = false,
  variant = "default",
}: {
  collapsed?: boolean
  variant?: "default" | "dark" | "primary"
}) {
  const isDark = variant === "dark"
  const isPrimary = variant === "primary"

  const bg = isDark
    ? "bg-[#0E0D35]"
    : isPrimary
    ? "bg-primary"
    : "bg-card"

  const textColor = isDark || isPrimary ? "text-white" : "text-foreground"
  const mutedColor = isDark
    ? "text-white/40"
    : isPrimary
    ? "text-white/60"
    : "text-muted-foreground"
  const borderColor = isDark
    ? "border-white/10"
    : isPrimary
    ? "border-white/20"
    : "border-border"
  const activeColor = isDark
    ? "bg-white/15 text-white"
    : isPrimary
    ? "bg-white/20 text-white"
    : "bg-primary text-primary-foreground"
  const hoverColor = isDark
    ? "hover:bg-white/8"
    : isPrimary
    ? "hover:bg-white/10"
    : "hover:bg-muted"

  const width = collapsed ? "w-12" : "w-52"

  const allItems = [
    { icon: LayoutDashboard, label: "Dashboard", active: true },
    { icon: Megaphone, label: "Banners" },
    { icon: GalleryHorizontalEnd, label: "Galeria" },
    { icon: MessageSquare, label: "Contatos", badge: "5" },
    { icon: Search, label: "SEO" },
    { icon: Settings, label: "Config." },
  ]

  return (
    <div
      className={cn(
        "flex flex-col h-80 rounded-xl border overflow-hidden transition-all duration-300 shadow-elevation-2",
        bg, borderColor, width
      )}
    >
      {/* Header */}
      <div className={cn("flex items-center gap-2 p-3 border-b", borderColor)}>
        <div className={cn(
          "flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center",
          isDark || isPrimary ? "bg-white/20" : "bg-primary/10"
        )}>
          <Truck className={cn("size-4", isDark || isPrimary ? "text-white" : "text-primary")} />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <p className={cn("text-xs font-bold leading-none", textColor)}>Ice Van</p>
            <p className={cn("text-[10px] leading-none mt-0.5", mutedColor)}>Admin</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <div className="flex-1 overflow-hidden p-1.5 space-y-0.5">
        {allItems.map((item) => (
          <div
            key={item.label}
            className={cn(
              "flex items-center gap-2 rounded-md px-2 py-1.5 transition-colors",
              item.active ? activeColor : cn(mutedColor, hoverColor)
            )}
          >
            <item.icon className="size-3.5 flex-shrink-0" />
            {!collapsed && (
              <span className="text-[11px] font-medium flex-1 truncate">{item.label}</span>
            )}
            {!collapsed && item.badge && (
              <span className={cn(
                "text-[9px] font-bold px-1.5 py-0.5 rounded-full",
                item.active ? "bg-white/30 text-white" : "bg-primary/20 text-primary"
              )}>
                {item.badge}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className={cn("p-2 border-t", borderColor)}>
        <div className={cn("flex items-center gap-2 rounded-md px-2 py-1.5", mutedColor)}>
          <LogOut className="size-3.5 flex-shrink-0" />
          {!collapsed && <span className="text-[11px] font-medium">Sair</span>}
        </div>
      </div>
    </div>
  )
}

/* ── Interactive Full Sidebar Demo ─────────────────────────── */
function InteractiveSidebarDemo() {
  const [activeItem, setActiveItem] = React.useState("Dashboard")
  const [contentOpen, setContentOpen] = React.useState(true)

  return (
    <SidebarProvider defaultOpen={true} style={{ "--sidebar-width": "14rem" } as React.CSSProperties}>
      <div className="flex h-[500px] w-full overflow-hidden rounded-xl border border-border shadow-elevation-3">
        <Sidebar collapsible="icon">
          <SidebarHeader className="border-b border-sidebar-border">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton size="lg" asChild className="cursor-pointer">
                  <div>
                    <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                      <Truck className="size-4" />
                    </div>
                    <div className="flex flex-col gap-0.5 leading-none">
                      <span className="font-bold text-sm">Ice Van</span>
                      <span className="text-[10px] text-sidebar-foreground/50">Admin Panel</span>
                    </div>
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarHeader>

          <SidebarContent>
            {/* Principal */}
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navMain.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        isActive={activeItem === item.title}
                        onClick={() => setActiveItem(item.title)}
                        tooltip={item.title}
                      >
                        <item.icon />
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarSeparator />

            {/* Conteúdo — collapsible */}
            <Collapsible open={contentOpen} onOpenChange={setContentOpen} className="group/collapsible">
              <SidebarGroup>
                <SidebarGroupLabel asChild>
                  <CollapsibleTrigger className="flex w-full items-center">
                    Conteúdo
                    <ChevronRight className="ml-auto size-3.5 transition-transform group-data-[state=open]/collapsible:rotate-90" />
                  </CollapsibleTrigger>
                </SidebarGroupLabel>
                <CollapsibleContent>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {navContent.map((item) => (
                        <SidebarMenuItem key={item.title}>
                          <SidebarMenuButton
                            isActive={activeItem === item.title}
                            onClick={() => setActiveItem(item.title)}
                            tooltip={item.title}
                          >
                            <item.icon />
                            <span>{item.title}</span>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </CollapsibleContent>
              </SidebarGroup>
            </Collapsible>

            <SidebarSeparator />

            {/* Comunicação */}
            <SidebarGroup>
              <SidebarGroupLabel>Comunicação</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navComm.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        isActive={activeItem === item.title}
                        onClick={() => setActiveItem(item.title)}
                        tooltip={item.title}
                      >
                        <item.icon />
                        <span>{item.title}</span>
                        {item.badge && (
                          <span className="ml-auto flex h-4 min-w-4 items-center justify-center rounded-full bg-primary/15 px-1 text-[10px] font-bold text-primary">
                            {item.badge}
                          </span>
                        )}
                      </SidebarMenuButton>
                    </SidebarMenuItem>
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
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        isActive={activeItem === item.title}
                        onClick={() => setActiveItem(item.title)}
                        tooltip={item.title}
                      >
                        <item.icon />
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="border-t border-sidebar-border">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  tooltip="Sair"
                  className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                >
                  <LogOut />
                  <span>Sair</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
          <SidebarRail />
        </Sidebar>

        {/* Inset content */}
        <SidebarInset className="flex-1 overflow-auto bg-background">
          <header className="flex h-12 items-center gap-2 border-b border-border px-4">
            <SidebarTrigger className="-ml-1 text-muted-foreground hover:text-foreground" />
            <Separator orientation="vertical" className="h-4" />
            <span className="text-sm font-medium text-foreground">{activeItem}</span>
            <div className="ml-auto flex items-center gap-2">
              <button className="relative p-1.5 rounded-md hover:bg-muted transition-colors">
                <Bell className="size-4 text-muted-foreground" />
                <span className="absolute top-1 right-1 size-1.5 rounded-full bg-destructive" />
              </button>
            </div>
          </header>
          <div className="p-4 space-y-3">
            <div className="h-24 rounded-lg bg-muted/60 border border-border animate-pulse" />
            <div className="grid grid-cols-3 gap-3">
              <div className="h-16 rounded-lg bg-muted/40 border border-border" />
              <div className="h-16 rounded-lg bg-muted/40 border border-border" />
              <div className="h-16 rounded-lg bg-muted/40 border border-border" />
            </div>
            <div className="h-32 rounded-lg bg-muted/30 border border-border" />
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <div className="size-1.5 rounded-full bg-success animate-pulse" />
              <span>Active page: <span className="font-semibold text-foreground">{activeItem}</span> — click nav items to switch</span>
            </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}

/* ── Page ─────────────────────────────────────────────────── */
export default function SidebarShowcasePage() {
  return (
    <div className="p-8 max-w-5xl mx-auto space-y-16">

      {/* ── Header ──────────────────────────────────────────── */}
      <header>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Components</span>
          <span className="text-muted-foreground/40">·</span>
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
            <span className="size-1.5 rounded-full bg-primary" />
            shadcn/ui
          </span>
        </div>
        <h1 className="text-5xl font-bold text-foreground mb-3">Sidebar</h1>
        <p className="text-muted-foreground text-lg max-w-2xl">
          A collapsible navigation panel for the Ice Van admin dashboard. Supports icon-only mode,
          grouped sections, badges, and keyboard shortcut <kbd className="text-sm font-mono bg-muted border border-border rounded px-1.5 py-0.5">⌘B</kbd>.
        </p>
      </header>

      {/* ── Interactive Demo ─────────────────────────────────── */}
      <section>
        <h2 className="text-2xl font-bold mb-1">Interactive Demo</h2>
        <p className="text-muted-foreground text-sm mb-5">
          Click the <span className="font-semibold">trigger button</span> or press <kbd className="text-xs font-mono bg-muted border border-border rounded px-1.5 py-0.5">⌘B</kbd> to collapse/expand.
          Click nav items to see active state transitions.
        </p>
        <InteractiveSidebarDemo />
      </section>

      {/* ── Variants ─────────────────────────────────────────── */}
      <section>
        <h2 className="text-2xl font-bold mb-1">Variants</h2>
        <p className="text-muted-foreground text-sm mb-6">Expanded vs. collapsed, and three color themes</p>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 items-start">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Default · Expanded</p>
            <SidebarPreview collapsed={false} variant="default" />
          </div>
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Default · Collapsed</p>
            <SidebarPreview collapsed={true} variant="default" />
          </div>
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Dark Theme</p>
            <SidebarPreview collapsed={false} variant="dark" />
          </div>
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Primary Theme</p>
            <SidebarPreview collapsed={false} variant="primary" />
          </div>
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Dark · Collapsed</p>
            <SidebarPreview collapsed={true} variant="dark" />
          </div>
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Primary · Collapsed</p>
            <SidebarPreview collapsed={true} variant="primary" />
          </div>
        </div>
      </section>

      {/* ── Anatomy ──────────────────────────────────────────── */}
      <section>
        <h2 className="text-2xl font-bold mb-1">Component Anatomy</h2>
        <p className="text-muted-foreground text-sm mb-6">All exported primitives from the sidebar component</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[
            { name: "SidebarProvider", desc: "Context + keyboard shortcut (⌘B)", type: "Provider" },
            { name: "Sidebar", desc: "Root element, sets collapsible mode", type: "Root" },
            { name: "SidebarInset", desc: "Main content area beside sidebar", type: "Layout" },
            { name: "SidebarTrigger", desc: "Toggle button (PanelLeft icon)", type: "Control" },
            { name: "SidebarHeader", desc: "Top section, usually logo/brand", type: "Section" },
            { name: "SidebarFooter", desc: "Bottom section, usually user/logout", type: "Section" },
            { name: "SidebarContent", desc: "Scrollable navigation area", type: "Section" },
            { name: "SidebarGroup", desc: "Groups nav items with optional label", type: "Group" },
            { name: "SidebarGroupLabel", desc: "Section heading (hidden in icon mode)", type: "Element" },
            { name: "SidebarMenu", desc: "Ordered nav item list", type: "Element" },
            { name: "SidebarMenuItem", desc: "Single nav item wrapper", type: "Element" },
            { name: "SidebarMenuButton", desc: "Styled button with active + tooltip states", type: "Element" },
            { name: "SidebarMenuSub", desc: "Nested sub-navigation list", type: "Sub" },
            { name: "SidebarRail", desc: "Drag-to-resize rail at sidebar edge", type: "Utility" },
            { name: "SidebarSeparator", desc: "Horizontal divider between groups", type: "Utility" },
          ].map((item) => (
            <div key={item.name} className="p-3 rounded-lg bg-card border border-border shadow-elevation-1">
              <div className="flex items-start justify-between gap-2 mb-1">
                <code className="text-xs font-mono font-semibold text-primary">{item.name}</code>
                <span className={cn(
                  "text-[10px] font-semibold px-1.5 py-0.5 rounded-full flex-shrink-0",
                  item.type === "Provider" && "bg-info/15 text-info",
                  item.type === "Root" && "bg-primary/15 text-primary",
                  item.type === "Layout" && "bg-accent/20 text-warning-foreground",
                  item.type === "Control" && "bg-success/15 text-success",
                  item.type === "Section" && "bg-muted text-muted-foreground",
                  item.type === "Group" && "bg-muted text-muted-foreground",
                  item.type === "Element" && "bg-muted text-muted-foreground",
                  item.type === "Sub" && "bg-muted text-muted-foreground",
                  item.type === "Utility" && "bg-destructive/10 text-destructive",
                )}>
                  {item.type}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CSS Variables ─────────────────────────────────────── */}
      <section>
        <h2 className="text-2xl font-bold mb-1">CSS Variable Tokens</h2>
        <p className="text-muted-foreground text-sm mb-6">Sidebar reads from its own token namespace for independent theming</p>
        <div className="rounded-xl border border-border overflow-hidden shadow-elevation-1">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/60">
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Variable</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Purpose</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Token</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {[
                { var: "--sidebar-background", purpose: "Sidebar background", token: "bg-sidebar" },
                { var: "--sidebar-foreground", purpose: "Default text color", token: "text-sidebar-foreground" },
                { var: "--sidebar-primary", purpose: "Active item background", token: "bg-sidebar-primary" },
                { var: "--sidebar-primary-foreground", purpose: "Active item text", token: "text-sidebar-primary-foreground" },
                { var: "--sidebar-accent", purpose: "Hover state background", token: "bg-sidebar-accent" },
                { var: "--sidebar-accent-foreground", purpose: "Hover state text", token: "text-sidebar-accent-foreground" },
                { var: "--sidebar-border", purpose: "Borders & separators", token: "border-sidebar-border" },
                { var: "--sidebar-ring", purpose: "Focus ring color", token: "ring-sidebar-ring" },
              ].map((row, i) => (
                <tr key={row.var} className={i % 2 === 0 ? "bg-card" : "bg-muted/20"}>
                  <td className="px-4 py-2.5">
                    <code className="text-xs font-mono text-primary">{row.var}</code>
                  </td>
                  <td className="px-4 py-2.5 text-sm text-foreground">{row.purpose}</td>
                  <td className="px-4 py-2.5">
                    <code className="text-xs font-mono text-muted-foreground">{row.token}</code>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── Usage Code ───────────────────────────────────────── */}
      <section className="pb-16">
        <h2 className="text-2xl font-bold mb-1">Usage</h2>
        <p className="text-muted-foreground text-sm mb-5">Import from the project's AppSidebar component or compose from primitives</p>

        <div className="space-y-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">Basic import</p>
            <div className="bg-[#0E0D35] rounded-xl p-5 overflow-auto border border-white/5 shadow-elevation-2">
              <pre className="text-sm text-[#F4F6F9] font-mono leading-relaxed">{`import { AppSidebar } from "@/components/AppSidebar"
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar"

export default function AdminLayout({ children }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header>
          <SidebarTrigger />
        </header>
        {children}
      </SidebarInset>
    </SidebarProvider>
  )
}`}</pre>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">Collapsible prop</p>
            <div className="bg-[#0E0D35] rounded-xl p-5 overflow-auto border border-white/5 shadow-elevation-2">
              <pre className="text-sm text-[#F4F6F9] font-mono leading-relaxed">{`// "icon"     — collapses to icon-only rail (default)
// "offcanvas" — slides off screen completely
// "none"      — always expanded, not collapsible

<Sidebar collapsible="icon">
  ...
</Sidebar>`}</pre>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">Active state pattern</p>
            <div className="bg-[#0E0D35] rounded-xl p-5 overflow-auto border border-white/5 shadow-elevation-2">
              <pre className="text-sm text-[#F4F6F9] font-mono leading-relaxed">{`"use client"

import { usePathname } from "next/navigation"

function NavItem({ item }) {
  const pathname = usePathname()
  const isActive = pathname === item.url

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
}`}</pre>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}
