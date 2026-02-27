"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutGrid,
  Lightbulb,
  Star,
  MessageCircle,
  Car,
  PanelBottom,
  Phone,
  Building2,
} from "lucide-react";

const navItems = [
  {
    label: "Nossas Soluções",
    href: "/admin/textos/solucoes",
    icon: Lightbulb,
  },
  {
    label: "Por que Escolher",
    href: "/admin/textos/diferenciais",
    icon: Star,
  },
  {
    label: "Seção de Orçamento",
    href: "/admin/textos/cta",
    icon: MessageCircle,
  },
  {
    label: "Aplicações",
    href: "/admin/textos/aplicacoes",
    icon: Car,
    startsWith: true,
  },
  {
    label: "Empresa",
    href: "/admin/textos/empresa",
    icon: Building2,
  },
  {
    label: "Contato",
    href: "/admin/textos/contato",
    icon: Phone,
  },
  {
    label: "Footer",
    href: "/admin/textos/footer",
    icon: PanelBottom,
  },
];

export default function TextosLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex gap-0 min-h-[calc(100vh-4rem)]">
      {/* Secondary sidebar */}
      <aside className="w-56 shrink-0 border-r bg-muted/30">
        <div className="p-4 border-b">
          <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            <LayoutGrid className="w-4 h-4" />
            Textos do Site
          </div>
        </div>
        <nav className="p-2 space-y-0.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.startsWith
              ? pathname.startsWith(item.href)
              : pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground font-medium"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 overflow-auto p-8">
        {children}
      </div>
    </div>
  );
}
