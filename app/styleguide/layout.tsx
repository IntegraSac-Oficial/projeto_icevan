"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { navigation } from "./navigation"

export default function StyleguideLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Sidebar — Fixed */}
      <aside className="w-64 border-r border-border bg-card flex flex-col gap-6 fixed top-0 left-0 h-screen overflow-y-auto p-6">
        <div>
          <Link href="/styleguide" className="flex flex-col gap-0.5">
            <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Ice Van
            </span>
            <span className="text-xl font-bold text-foreground">Design System</span>
          </Link>
        </div>

        <nav className="flex flex-col gap-6">
          {navigation.map((section) => (
            <div key={section.title}>
              <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2 px-3">
                {section.title}
              </h3>
              {section.items.length > 0 ? (
                <ul className="flex flex-col gap-0.5">
                  {section.items.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={cn(
                          "block px-3 py-2 rounded-lg text-sm transition-colors",
                          pathname === item.href
                            ? "bg-primary text-primary-foreground font-medium"
                            : "text-foreground hover:bg-muted"
                        )}
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="px-3 text-xs text-muted-foreground italic">Coming soon</p>
              )}
            </div>
          ))}
        </nav>

        <div className="mt-auto pt-4 border-t border-border">
          <p className="text-xs text-muted-foreground px-3">
            EOS Design System v1.0
          </p>
        </div>
      </aside>

      {/* Main content — offset by sidebar width */}
      <main className="flex-1 ml-64 overflow-auto min-h-screen">
        {children}
      </main>
    </div>
  )
}
